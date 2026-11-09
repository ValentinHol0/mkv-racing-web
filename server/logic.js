// Бізнес-логіка MKV Racing — чисті функції без Express, покриті тестами (server/logic.test.js).

export class DomainError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

// ---------- Реєстрація ----------
const CALLSIGN_RE = /^[A-Za-z0-9_]{3,20}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function validateRegistration({ email, callsign, password, steamId }) {
  const errors = {};
  if (!EMAIL_RE.test(email ?? '')) errors.email = 'Enter a valid email address';
  if (!CALLSIGN_RE.test(callsign ?? ''))
    errors.callsign = 'Callsign: 3-20 chars, letters, digits or _';
  if (typeof password !== 'string' || password.length < 6)
    errors.password = 'Security token must be at least 6 characters';
  else if (!/\d/.test(password) || !/[A-Za-z]/.test(password))
    errors.password = 'Security token must contain letters and digits';
  if (steamId && !/^7656\d{13}$/.test(steamId))
    errors.steamId = 'SteamID64 must be 17 digits starting with 7656';
  return errors;
}

// ---------- Ліцензії, рівень, безпека ----------
export const LICENSES = [
  { code: 'ROOKIE', title: 'Rookie', minRating: 0, classes: ['B'] },
  { code: 'CLUB', title: 'Club', minRating: 100, classes: ['A', 'B'] },
  { code: 'PRO', title: 'Pro', minRating: 300, classes: ['S', 'A', 'B'] },
];

export const licenseFor = (rating) => [...LICENSES].reverse().find((l) => rating >= l.minRating);

/** "Level 42 Pro Tier" — рівень = рейтинг / 10. */
export function tierLabel(rating) {
  return `Level ${Math.max(1, Math.floor(rating / 10))} ${licenseFor(rating).title} Tier`;
}

/** Індекс безпеки: 100% мінус 0.4% за кожен інцидент (контакт, виліт), не нижче 0. */
export const safetyScore = (incidents) => Math.max(0, +(100 - incidents * 0.4).toFixed(1));

// ---------- Сервери ----------
/** «Живий» стан сервера: онлайн і пінг коливаються з часом + активні сесії гравців. */
export function liveServerState(server, joinedCount, now = Date.now()) {
  if (server.status !== 'online') return { ...server, clients: 0, ping: null, freeSlots: 0 };
  const wave = Math.round(Math.sin(now / 15_000 + server.port) * 4);
  const clients = Math.min(server.maxClients, Math.max(0, server.baseClients + wave + joinedCount));
  const ping = server.basePing + Math.abs(Math.round(Math.cos(now / 7_000) * 4));
  return {
    ...server,
    clients,
    ping,
    freeSlots: server.maxClients - clients,
    joinUrl: buildJoinUrl(server),
  };
}

export function buildJoinUrl(server, carId) {
  const q = new URLSearchParams({
    server_ip: server.ip,
    server_port: String(server.port),
    server_http_port: String(server.httpPort),
  });
  if (carId) q.set('car', carId);
  return `acmanager://ui/quick/server?${q}`;
}

/**
 * Допуск пілота на сервер. Правила перевіряються по черзі:
 *  1) сервер online;  2) є вільні слоти;  3) клас авто дозволений на сервері;
 *  4) ліцензія пілота дозволяє цей клас;  5) SHA-256 файлів авто збігається з серверним.
 */
export function checkJoin({ server, car, user, clientChecksum }) {
  if (!server) throw new DomainError(404, 'SERVER_NOT_FOUND', 'Server node not found');
  if (!car) throw new DomainError(404, 'CAR_NOT_FOUND', 'Select a car in the Garage first');
  if (server.status !== 'online')
    throw new DomainError(409, 'SERVER_OFFLINE', 'Server node is under maintenance');
  if (server.freeSlots <= 0)
    throw new DomainError(409, 'SERVER_FULL', 'No free slots on this server');
  if (!server.allowedClasses.includes(car.carClass))
    throw new DomainError(
      422,
      'CLASS_NOT_ALLOWED',
      `Class ${car.carClass} is not allowed here (allowed: ${server.allowedClasses.join(', ')})`
    );
  const license = licenseFor(user.rating);
  if (!license.classes.includes(car.carClass))
    throw new DomainError(
      403,
      'LICENSE_TOO_LOW',
      `${license.title} license does not unlock class ${car.carClass}`
    );
  if (clientChecksum !== car.sha256)
    throw new DomainError(
      422,
      'CHECKSUM_MISMATCH',
      'Local car files do not match the server SHA-256 manifest'
    );
  return { joinUrl: buildJoinUrl(server, car.id), license: license.code };
}

// ---------- Кола, рейтинг, лідерборд ----------
export const MAX_INCIDENTS_PER_LAP = 2;

export function validateLap({ server, car, timeMs, incidents }) {
  if (!server) throw new DomainError(404, 'SERVER_NOT_FOUND', 'Server node not found');
  if (!car) throw new DomainError(404, 'CAR_NOT_FOUND', 'Car not found');
  if (!Number.isInteger(timeMs) || timeMs <= 0)
    throw new DomainError(400, 'BAD_TIME', 'Invalid lap time');
  if (!Number.isInteger(incidents) || incidents < 0)
    throw new DomainError(400, 'BAD_INCIDENTS', 'Invalid incidents count');
  if (!server.allowedClasses.includes(car.carClass))
    throw new DomainError(422, 'CLASS_NOT_ALLOWED', 'This car cannot run on this server');
  const { min, max } = server.lapLimitsMs;
  if (timeMs < min)
    throw new DomainError(
      422,
      'LAP_TOO_FAST',
      'Lap time is physically impossible — rejected by anti-cheat'
    );
  if (timeMs > max)
    throw new DomainError(422, 'LAP_TOO_SLOW', 'Lap exceeds the session time limit');
}

/** Коло з >2 інцидентами зберігається, але не зараховується в лідерборд і рейтинг (як invalid lap у AC). */
export const isLapValid = (incidents) => incidents <= MAX_INCIDENTS_PER_LAP;

/** Рейтинг: +10 за чисте коло, +25 за особистий рекорд, +50 за рекорд сервера; −5 за невалідне коло. */
export function ratingDelta({ valid, isPersonalBest, isServerRecord }) {
  if (!valid) return -5;
  return 10 + (isPersonalBest ? 25 : 0) + (isServerRecord ? 50 : 0);
}

/** Найкраще валідне коло кожного пілота, сортування за часом, відставання від лідера. */
export function buildLeaderboard(laps, users) {
  const best = new Map();
  for (const lap of laps) {
    if (!lap.valid) continue;
    const cur = best.get(lap.userId);
    if (!cur || lap.timeMs < cur.timeMs) best.set(lap.userId, lap);
  }
  const rows = [...best.values()].sort(
    (a, b) => a.timeMs - b.timeMs || a.createdAt.localeCompare(b.createdAt)
  );
  const leader = rows[0]?.timeMs ?? 0;
  return rows.map((lap, i) => ({
    rank: i + 1,
    pilot: users.find((u) => u.id === lap.userId)?.callsign ?? 'unknown',
    carId: lap.carId,
    timeMs: lap.timeMs,
    gapMs: lap.timeMs - leader,
  }));
}

// ---------- Консольні команди ----------
export function runConsoleCommand(input, { servers, user }) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  switch (cmd) {
    case '/help':
      return ['INFO', 'Commands: /help, /players, /weather <rain|clear|overcast>, /ping'];
    case '/players':
      return ['INFO', servers.map((s) => `${s.id}: ${s.clients}/${s.maxClients}`).join(' | ')];
    case '/ping':
      return ['INFO', servers.map((s) => `${s.id}: ${s.ping} ms`).join(' | ')];
    case '/weather': {
      if (licenseFor(user.rating).code !== 'PRO')
        throw new DomainError(403, 'FORBIDDEN', '/weather requires PRO license');
      if (!['rain', 'clear', 'overcast'].includes(args[0]))
        throw new DomainError(400, 'BAD_COMMAND', 'Usage: /weather <rain|clear|overcast>');
      return [
        'WARN',
        `Weather vote by ${user.callsign}: Pure 3.10 → ${args[0].toUpperCase()} (applies next session)`,
      ];
    }
    default:
      throw new DomainError(400, 'UNKNOWN_COMMAND', `Unknown command "${cmd}". Type /help`);
  }
}
