import { useCallback, useEffect, useRef, useState } from 'react';
import { http, normalizeError } from '../services/apiClient';

/**
 * useMutation — хук для запитів, що змінюють дані (POST / PUT / PATCH / DELETE).
 *
 * @param {string|((vars) => string)} url  шлях або функція, що будує шлях зі змінних
 * @param {object} [options]
 * @param {string} [options.method='post']
 * @param {(data, vars) => void} [options.onSuccess]
 * @param {(error, vars) => void} [options.onError]
 * @returns {{ mutate, data, error, loading, reset }}
 *   mutate(vars) повертає Promise<data> і відхиляється нормалізованою помилкою.
 */
export function useMutation(url, { method = 'post', onSuccess, onError } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: false });
  const mounted = useRef(true);
  const callbacks = useRef({ onSuccess, onError });
  callbacks.current = { onSuccess, onError };

  useEffect(() => {
    mounted.current = true; // StrictMode монтує компонент двічі — відновлюємо прапорець
    return () => {
      mounted.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (vars = {}) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const path = typeof url === 'function' ? url(vars) : url;
        const res = await http.request({ url: path, method, data: vars });
        if (mounted.current) setState({ data: res.data, error: null, loading: false });
        callbacks.current.onSuccess?.(res.data, vars);
        return res.data;
      } catch (e) {
        const err = normalizeError(e);
        if (mounted.current) setState({ data: null, error: err, loading: false });
        callbacks.current.onError?.(err, vars);
        throw err;
      }
    },
    [url, method]
  );

  const reset = useCallback(() => setState({ data: null, error: null, loading: false }), []);

  return { mutate, ...state, reset };
}
