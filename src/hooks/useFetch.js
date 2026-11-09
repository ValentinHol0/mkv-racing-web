import { useCallback, useEffect, useRef, useState } from 'react';
import { http, normalizeError } from '../services/apiClient';

/**
 * useFetch — універсальний хук для GET-запитів до MKV API.
 *
 * @param {string|null} url  шлях API; null — запит не виконується (умовне завантаження)
 * @param {object} [options]
 * @param {object} [options.params]        query-параметри
 * @param {number} [options.pollInterval]  мс; періодичне оновлення (live-стан серверів)
 * @param {*}      [options.initialData]   значення до першої відповіді
 * @returns {{ data, error, loading, refetch, setData }}
 */
export function useFetch(url, { params, pollInterval, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const controllerRef = useRef(null);
  const paramsKey = JSON.stringify(params ?? {});

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!url) return;
      // Скасовуємо попередній запит — відповідь на застарілі параметри не перезапише нові дані
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      if (!silent) setLoading(true);
      try {
        const res = await http.get(url, {
          params: JSON.parse(paramsKey),
          signal: controller.signal,
        });
        setData(res.data);
        setError(null);
      } catch (e) {
        const err = normalizeError(e);
        if (err) setError(err);
      } finally {
        if (controllerRef.current === controller) setLoading(false);
      }
    },
    [url, paramsKey]
  );

  useEffect(() => {
    load();
    const id = pollInterval && url ? setInterval(() => load({ silent: true }), pollInterval) : null;
    return () => {
      if (id) clearInterval(id);
      controllerRef.current?.abort();
    };
  }, [load, pollInterval, url]);

  return { data, error, loading, refetch: load, setData };
}
