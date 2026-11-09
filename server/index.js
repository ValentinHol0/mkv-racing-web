// MKV Racing REST API (Express). Запуск: npm run server → http://localhost:4000/api/v1
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARS, SERVERS, SEED_USERS, SEED_LAPS, SEED_LOGS } from './data.js';
import {
  DomainError,
  validateRegistration,
  licenseFor,
  tierLabel,
  safetyScore,
  liveServerState,
  checkJoin,
  validateLap,
  isLapValid,
  ratingDelta,
  buildLeaderboard,
  runConsoleCommand,
} from './logic.js';

const PORT = process.env.API_PORT || 4000;
const SECRET = process.env.TOKEN_SECRET || 'mkv-racing-dev-secret';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const DB_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');

// ---------- Паролі та токени ----------
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 32).toString('hex')}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  return crypto.timingSafeEqual(crypto.scryptSync(password, salt, 32), Buffer.from(hash, 'hex'));
}
// Спрощений JWT: base64url(payload).HMAC-SHA256(payload)
function signToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Date.now() + TOKEN_TTL_MS })
  ).toString('base64url');
  return `${payload}.${crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')}`;
}
function readToken(token) {
  const [payload, sig] = (token || '').split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  )
    return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return data.exp > Date.now() ? data : null;
}

// ---------- Сховище (JSON-файл, створюється з seed-даних) ----------
const now = () => new Date().toISOString();
function seed() {
  const users = SEED_USERS.map(({ password, ...u }) => ({
    ...u,
    id: crypto.randomUUID(),
    passwordHash: hashPassword(password),
    selectedCarId: 'supra-mkv',
    createdAt: now(),
  }));
  const laps = SEED_LAPS.map(([callsign, serverId, carId, timeMs]) => ({
    id: crypto.randomUUID(),
    userId: users.find((u) => u.callsign === callsign).id,
    serverId,
    carId,
    timeMs,
    incidents: 0,
    valid: true,
    createdAt: now(),
  }));
  const logs = SEED_LOGS.map(([level, message], i) => ({ id: i + 1, time: now(), level, message }));
  return { users, laps, logs, sessions: [] };
}
const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : seed();
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
save();

function log(level, message) {
  db.logs.push({ id: (db.logs.at(-1)?.id ?? 0) + 1, time: now(), level, message });
  if (db.logs.length > 500) db.logs.shift();
}

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  callsign: u.callsign,
  email: u.email,
  steamId: u.steamId,
  rating: u.rating,
  license: licenseFor(u.rating).code,
  allowedClasses: licenseFor(u.rating).classes,
  tier: tierLabel(u.rating),
  safetyScore: safetyScore(u.incidents),
  selectedCarId: u.selectedCarId,
});
const issue = (res, user, status = 200) =>
  res.status(status).json({ token: signToken(user.id), user: publicUser(user) });

// ---------- Middleware ----------
const app = express();
app.use(cors());
app.use(express.json());
app.use((_req, _res, next) => setTimeout(next, 200)); // імітація мережевої затримки

function auth(req, _res, next) {
  const data = readToken(req.headers.authorization?.replace(/^Bearer /, ''));
  const user = data && db.users.find((u) => u.id === data.sub);
  if (!user) return next(new DomainError(401, 'UNAUTHORIZED', 'Pilot authentication required'));
  req.user = user;
  next();
}

const activeSessions = (serverId) =>
  db.sessions.filter((s) => s.serverId === serverId && s.active).length;
const serverView = (id) => {
  const s = SERVERS.find((x) => x.id === id);
  return s && liveServerState(s, activeSessions(s.id));
};
const findCar = (id) => CARS.find((c) => c.id === id);
const findUserByLogin = (login) => {
  const l = String(login ?? '').toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === l || u.callsign.toLowerCase() === l);
};

const api = express.Router();

// ---------- Auth ----------
api.post('/auth/register', (req, res) => {
  const { email, callsign, password, steamId, name } = req.body;
  const errors = validateRegistration(req.body);
  if (findUserByLogin(email)) errors.email = 'This email is already registered';
  if (findUserByLogin(callsign)) errors.callsign = 'This callsign is already taken';
  if (Object.keys(errors).length)
    throw new DomainError(400, 'VALIDATION', 'Check the highlighted fields', errors);
  const user = {
    id: crypto.randomUUID(),
    name: name || callsign,
    callsign,
    email,
    steamId: steamId || null,
    passwordHash: hashPassword(password),
    rating: 0,
    incidents: 0,
    selectedCarId: 'bmw-m5cs',
    createdAt: now(),
  };
  db.users.push(user);
  log('INFO', `New pilot registered: ${callsign} (Rookie license)`);
  save();
  issue(res, user, 201);
});

api.post('/auth/login', (req, res) => {
  const user = findUserByLogin(req.body.login);
  if (!user || !verifyPassword(String(req.body.password ?? ''), user.passwordHash))
    throw new DomainError(401, 'BAD_CREDENTIALS', 'Invalid email/callsign or security token');
  issue(res, user);
});

// Steam OpenID 2.0 — у навчальному середовищі імітується: вхід за прив'язаним SteamID64.
api.post('/auth/steam', (req, res) => {
  const steamId = req.body.steamId || '76561198000000001';
  const user = db.users.find((u) => u.steamId === steamId);
  if (!user)
    throw new DomainError(404, 'STEAM_NOT_LINKED', 'No pilot account is linked to this Steam ID');
  issue(res, user);
});

api.get('/auth/me', auth, (req, res) => res.json(publicUser(req.user)));

// ---------- Каталог ----------
api.get('/servers', (_req, res) => res.json(SERVERS.map((s) => serverView(s.id))));
api.get('/servers/:id', (req, res) => {
  const s = serverView(req.params.id);
  if (!s)
    throw new DomainError(404, 'SERVER_NOT_FOUND', `Server node "${req.params.id}" not found`);
  res.json(s);
});
api.get('/cars', (_req, res) => res.json(CARS));

api.post('/cars/:id/verify', (req, res) => {
  const car = findCar(req.params.id);
  if (!car) throw new DomainError(404, 'CAR_NOT_FOUND', 'Car not found');
  const matched = req.body.checksum === car.sha256;
  log(matched ? 'CHECKSUM' : 'WARN', `SHA-256 ${matched ? 'Pass' : 'MISMATCH'}: ${car.id}`);
  save();
  res.json({
    carId: car.id,
    matched,
    hash: car.sha256,
    status: matched ? 'CHECKSUM_PASS' : 'CHECKSUM_MISMATCH',
  });
});

// ---------- Гараж ----------
api.post('/garage/select', auth, (req, res) => {
  const car = findCar(req.body.carId);
  if (!car) throw new DomainError(404, 'CAR_NOT_FOUND', 'Car not found');
  const license = licenseFor(req.user.rating);
  if (!license.classes.includes(car.carClass))
    throw new DomainError(
      403,
      'LICENSE_TOO_LOW',
      `${license.title} license does not unlock class ${car.carClass}`
    );
  req.user.selectedCarId = car.id;
  save();
  res.json(publicUser(req.user));
});

// ---------- Підключення до сервера ----------
api.post('/servers/:id/join', auth, (req, res) => {
  const car = findCar(req.body.carId ?? req.user.selectedCarId);
  try {
    const result = checkJoin({
      server: serverView(req.params.id),
      car,
      user: req.user,
      clientChecksum: req.body.checksum,
    });
    db.sessions.forEach((s) => {
      if (s.userId === req.user.id) s.active = false;
    }); // одна активна сесія на пілота
    db.sessions.push({
      id: crypto.randomUUID(),
      userId: req.user.id,
      serverId: req.params.id,
      carId: car.id,
      active: true,
      startedAt: now(),
    });
    log('CHECKSUM', `Client [${req.user.callsign}] SHA-256 Checksum Pass: ${car.id}`);
    log('INFO', `${req.user.callsign} joined ${req.params.id} in ${car.name}`);
    save();
    res.status(201).json({ ...result, server: serverView(req.params.id) });
  } catch (e) {
    log('WARN', `Join rejected for ${req.user.callsign} on ${req.params.id}: ${e.code}`);
    save();
    throw e;
  }
});
api.get('/sessions/current', auth, (req, res) => {
  res.json(db.sessions.find((s) => s.userId === req.user.id && s.active) ?? null);
});
api.post('/sessions/leave', auth, (req, res) => {
  db.sessions.forEach((s) => {
    if (s.userId === req.user.id) s.active = false;
  });
  log('INFO', `${req.user.callsign} left the server`);
  save();
  res.json({ ok: true });
});

// ---------- Кола та лідерборд ----------
api.post('/laps', auth, (req, res) => {
  const { serverId, carId, timeMs, incidents = 0 } = req.body;
  const server = SERVERS.find((s) => s.id === serverId);
  const car = findCar(carId);
  validateLap({ server, car, timeMs, incidents });
  const valid = isLapValid(incidents);
  const serverLaps = db.laps.filter((l) => l.serverId === serverId && l.valid);
  const isPersonalBest =
    valid && serverLaps.filter((l) => l.userId === req.user.id).every((l) => timeMs < l.timeMs);
  const isServerRecord = valid && serverLaps.every((l) => timeMs < l.timeMs);
  const delta = ratingDelta({ valid, isPersonalBest, isServerRecord });
  const lap = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    serverId,
    carId,
    timeMs,
    incidents,
    valid,
    createdAt: now(),
  };
  db.laps.push(lap);
  req.user.rating = Math.max(0, req.user.rating + delta);
  req.user.incidents += incidents;
  log(
    valid ? 'INFO' : 'WARN',
    `${req.user.callsign} lap ${timeMs} ms on ${serverId} (${valid ? 'valid' : 'INVALID'}, ${delta >= 0 ? '+' : ''}${delta} RP)`
  );
  save();
  res.status(201).json({
    lap,
    valid,
    isPersonalBest,
    isServerRecord,
    ratingDelta: delta,
    user: publicUser(req.user),
  });
});

api.get('/leaderboard/:serverId', (req, res) => {
  res.json(
    buildLeaderboard(
      db.laps.filter((l) => l.serverId === req.params.serverId),
      db.users
    )
  );
});

api.get('/me/stats', auth, (req, res) => {
  const laps = db.laps.filter((l) => l.userId === req.user.id);
  const valid = laps.filter((l) => l.valid);
  const best = (list) =>
    list.length ? list.reduce((a, b) => (b.timeMs < a.timeMs ? b : a)) : null;
  res.json({
    totalLaps: laps.length,
    validLaps: valid.length,
    bestLap: best(valid.filter((l) => l.serverId === 'srp-tokyo-01')),
    byCar: CARS.map((c) => {
      const mine = valid.filter((l) => l.carId === c.id);
      return {
        carId: c.id,
        car: c.name,
        topSpeed: c.topSpeed,
        laps: mine.length,
        bestMs: best(mine)?.timeMs ?? null,
      };
    }).filter((r) => r.laps > 0),
    recent: laps.slice(-5).reverse(),
  });
});

// ---------- Логи та консоль ----------
api.get('/logs', (req, res) => {
  const level = req.query.level;
  res.json(db.logs.filter((l) => !level || level === 'ALL' || l.level === level).slice(-100));
});
api.post('/logs/command', auth, (req, res) => {
  const command = String(req.body.command ?? '').trim();
  log('CLIENT', `${req.user.callsign}> ${command}`);
  try {
    const [level, message] = runConsoleCommand(command, {
      servers: SERVERS.map((s) => serverView(s.id)),
      user: req.user,
    });
    log(level, message);
  } catch (e) {
    log('WARN', e.message);
  }
  save();
  res.status(201).json(db.logs.slice(-2));
});

app.use('/api/v1', api);

// ---------- Обробка помилок ----------
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    code: err.code || 'INTERNAL',
    message: err.message || 'Server error',
    fields: err.fields,
  });
});

app.listen(PORT, () => console.info(`MKV Racing API → http://localhost:${PORT}/api/v1`));
