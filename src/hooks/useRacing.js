// Доменні хуки MKV Racing — побудовані поверх useFetch / useMutation / useAuth.
import { useMemo } from 'react';
import { useFetch } from './useFetch';
import { useMutation } from './useMutation';
import { useAuth } from './useAuth';
import { useAppStore } from '../store/useAppStore';

/** Сервери з автооновленням кожні 5 с (онлайн, пінг, вільні слоти). */
export function useServers() {
  return useFetch('/servers', { pollInterval: 5000, initialData: [] });
}

export function useServer(serverId) {
  return useFetch(serverId ? `/servers/${serverId}` : null, { pollInterval: 5000 });
}

/** Автопарк + словник byId. */
export function useCars() {
  const query = useFetch('/cars', { initialData: [] });
  const byId = useMemo(() => Object.fromEntries(query.data.map((c) => [c.id, c])), [query.data]);
  return { ...query, byId };
}

/** Вибір авто для заїздів (з перевіркою ліцензії на сервері). */
export function useSelectCar() {
  const { updateUser } = useAuth();
  const setSelectedCarId = useAppStore((s) => s.setSelectedCarId);
  return useMutation('/garage/select', {
    onSuccess: (user) => {
      updateUser(user);
      setSelectedCarId(user.selectedCarId);
    },
  });
}

/** Перевірка SHA-256 локальних файлів авто проти серверного маніфесту. */
export function useVerifyChecksum() {
  return useMutation(({ carId }) => `/cars/${carId}/verify`);
}

/** Підключення до сервера: 5 правил допуску перевіряє API. */
export function useJoinServer() {
  return useMutation(({ serverId }) => `/servers/${serverId}/join`);
}

export function useLeaderboard(serverId) {
  return useFetch(serverId ? `/leaderboard/${serverId}` : null, {
    initialData: [],
    pollInterval: 10000,
  });
}

/** Відправка кола: новий рейтинг/тір/безпека одразу потрапляють у store. */
export function useSubmitLap({ onSuccess } = {}) {
  const { updateUser } = useAuth();
  return useMutation('/laps', {
    onSuccess: (data, vars) => {
      updateUser(data.user);
      onSuccess?.(data, vars);
    },
  });
}

export function useMyStats() {
  const { isAuthenticated, user } = useAuth();
  // rating у ключі — статистика перезавантажується після кожного зарахованого кола
  return useFetch(isAuthenticated ? '/me/stats' : null, { params: { r: user?.rating } });
}

/** Логи сервера з оновленням кожні 3 с + відправка консольних команд. */
export function useServerLogs(level) {
  const logs = useFetch('/logs', { params: { level }, pollInterval: 3000, initialData: [] });
  const send = useMutation('/logs/command', { onSuccess: () => logs.refetch({ silent: true }) });
  return { ...logs, send };
}
