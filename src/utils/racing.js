// Клієнтська бізнес-логіка: форматування, парсинг, перевірки до відправки на сервер.

/** 228210 мс → "3:48.210" */
export function formatLapTime(ms) {
  if (ms == null) return '—';
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
}

/** "3:48.210" → 228210; null — якщо формат неправильний */
export function parseLapTime(text) {
  const match = /^(\d{1,2}):([0-5]\d)\.(\d{3})$/.exec(String(text).trim());
  if (!match) return null;
  return Number(match[1]) * 60_000 + Number(match[2]) * 1000 + Number(match[3]);
}

export const formatGap = (ms) => (ms === 0 ? 'LEADER' : `+${(ms / 1000).toFixed(3)}s`);

export const LICENSE_THRESHOLDS = { ROOKIE: 0, CLUB: 100, PRO: 300 };

/** Скільки рейтингу бракує до наступної ліцензії (null — максимальна). */
export function nextLicense(rating) {
  const next = Object.entries(LICENSE_THRESHOLDS).find(([, min]) => rating < min);
  return next ? { code: next[0], need: next[1] - rating } : null;
}

/** Причина, чому авто недоступне пілоту на сервері (null — доступне). */
export function carBlockReason(car, { allowedClasses = [], server } = {}) {
  if (server && !server.allowedClasses.includes(car.carClass))
    return `Class ${car.carClass} not allowed on this node`;
  if (!allowedClasses.includes(car.carClass))
    return `Class ${car.carClass} requires a higher license`;
  return null;
}

/**
 * Імітація читання локальної контрольної суми файлів авто (у реальному клієнті —
 * хеш data.acd із теки content/cars). outdated=true імітує застарілу версію мода.
 */
export const localChecksum = (car, outdated = false) => (outdated ? '0'.repeat(64) : car.sha256);
