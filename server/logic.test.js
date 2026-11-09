import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARS, SERVERS } from './data.js';
import {
  checkJoin,
  validateLap,
  isLapValid,
  buildLeaderboard,
  ratingDelta,
  licenseFor,
  tierLabel,
  safetyScore,
  validateRegistration,
  liveServerState,
  runConsoleCommand,
} from './logic.js';

const shuto = liveServerState(SERVERS[0], 0);
const georgia = liveServerState(SERVERS[1], 0);
const car = (id) => CARS.find((c) => c.id === id);
const codeOf = (fn) => {
  try {
    fn();
  } catch (e) {
    return e.code;
  }
  return 'OK';
};

test('реєстрація: валідація полів', () => {
  assert.deepEqual(
    validateRegistration({ email: 'a@b.cc', callsign: 'Pilot_1', password: 'abc123' }),
    {}
  );
  const e = validateRegistration({ email: 'bad', callsign: 'a', password: '123', steamId: '42' });
  assert.deepEqual(Object.keys(e).sort(), ['callsign', 'email', 'password', 'steamId']);
});

test('ліцензія, рівень і безпека', () => {
  assert.equal(licenseFor(0).code, 'ROOKIE');
  assert.equal(licenseFor(150).code, 'CLUB');
  assert.equal(tierLabel(420), 'Level 42 Pro Tier');
  assert.equal(safetyScore(4), 98.4);
});

test('join: успіх повертає acmanager:// посилання', () => {
  const m5 = car('bmw-m5cs');
  const r = checkJoin({ server: shuto, car: m5, user: { rating: 0 }, clientChecksum: m5.sha256 });
  assert.match(
    r.joinUrl,
    /^acmanager:\/\/ui\/quick\/server\?server_ip=185\.190\.140\.12&server_port=9601&server_http_port=8082&car=bmw-m5cs$/
  );
});

test('join: правила допуску', () => {
  const supra = car('supra-mkv');
  const m5 = car('bmw-m5cs');
  assert.equal(
    codeOf(() =>
      checkJoin({
        server: georgia,
        car: supra,
        user: { rating: 999 },
        clientChecksum: supra.sha256,
      })
    ),
    'CLASS_NOT_ALLOWED'
  );
  assert.equal(
    codeOf(() =>
      checkJoin({ server: shuto, car: supra, user: { rating: 0 }, clientChecksum: supra.sha256 })
    ),
    'LICENSE_TOO_LOW'
  );
  assert.equal(
    codeOf(() => checkJoin({ server: shuto, car: m5, user: { rating: 0 }, clientChecksum: 'bad' })),
    'CHECKSUM_MISMATCH'
  );
  assert.equal(
    codeOf(() =>
      checkJoin({
        server: { ...shuto, freeSlots: 0 },
        car: m5,
        user: { rating: 0 },
        clientChecksum: m5.sha256,
      })
    ),
    'SERVER_FULL'
  );
  assert.equal(
    codeOf(() =>
      checkJoin({
        server: { ...shuto, status: 'maintenance' },
        car: m5,
        user: { rating: 0 },
        clientChecksum: m5.sha256,
      })
    ),
    'SERVER_OFFLINE'
  );
});

test('коло: anti-cheat межі та інциденти', () => {
  const m5 = car('bmw-m5cs');
  assert.equal(
    codeOf(() => validateLap({ server: SERVERS[0], car: m5, timeMs: 60_000, incidents: 0 })),
    'LAP_TOO_FAST'
  );
  assert.equal(
    codeOf(() => validateLap({ server: SERVERS[0], car: m5, timeMs: 3_600_000, incidents: 0 })),
    'LAP_TOO_SLOW'
  );
  assert.equal(
    codeOf(() => validateLap({ server: SERVERS[0], car: m5, timeMs: 230_000, incidents: 0 })),
    'OK'
  );
  assert.equal(isLapValid(2), true);
  assert.equal(isLapValid(3), false);
});

test('рейтинг і лідерборд (невалідні кола не враховуються)', () => {
  assert.equal(ratingDelta({ valid: true, isPersonalBest: true, isServerRecord: true }), 85);
  assert.equal(ratingDelta({ valid: false }), -5);
  const users = [
    { id: 'a', callsign: 'A' },
    { id: 'b', callsign: 'B' },
  ];
  const laps = [
    { userId: 'a', carId: 'x', timeMs: 300_000, valid: true, createdAt: '1' },
    { userId: 'a', carId: 'x', timeMs: 290_000, valid: true, createdAt: '2' },
    { userId: 'b', carId: 'y', timeMs: 280_000, valid: false, createdAt: '3' },
    { userId: 'b', carId: 'y', timeMs: 295_000, valid: true, createdAt: '4' },
  ];
  assert.deepEqual(
    buildLeaderboard(laps, users).map((r) => [r.pilot, r.timeMs, r.gapMs]),
    [
      ['A', 290_000, 0],
      ['B', 295_000, 5_000],
    ]
  );
});

test('консоль: /weather лише для PRO', () => {
  assert.equal(
    codeOf(() => runConsoleCommand('/weather rain', { servers: [], user: { rating: 0 } })),
    'FORBIDDEN'
  );
  assert.equal(
    runConsoleCommand('/weather rain', { servers: [], user: { rating: 400, callsign: 'X' } })[0],
    'WARN'
  );
  assert.equal(
    codeOf(() => runConsoleCommand('/kick all', { servers: [], user: { rating: 400 } })),
    'UNKNOWN_COMMAND'
  );
});
