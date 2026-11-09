/**
 * MKV Racing REST API Client (axios) & Protocol Dispatcher
 */
import axios from 'axios';

export const TOKEN_KEY = 'mkv_token';

// У dev-режимі Vite проксує /api на Express-сервер (див. vite.config.js)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const http = axios.create({ baseURL: API_BASE_URL, timeout: 10_000 });

// Request interceptor: кожен запит автоматично отримує Bearer-токен пілота
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: 401 → токен недійсний, повідомляємо застосунок про завершення сесії
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('mkv:unauthorized'));
    }
    return Promise.reject(error);
  }
);

/** Приводить будь-яку помилку axios до вигляду { status, code, message, fields }. */
export function normalizeError(error) {
  if (axios.isCancel(error)) return null;
  const data = error.response?.data;
  return {
    status: error.response?.status ?? 0,
    code: data?.code ?? (error.response ? 'HTTP_ERROR' : 'NETWORK'),
    message:
      data?.message ??
      (error.response
        ? `HTTP error ${error.response.status}`
        : 'MKV API is unreachable. Start it with `npm run server`.'),
    fields: data?.fields ?? {},
  };
}

export const apiClient = {
  /**
   * Triggers the custom browser protocol acmanager:// to launch Content Manager.
   */
  launchAcManager(joinUrl) {
    if (typeof window !== 'undefined') {
      window.location.href = joinUrl;
      return true;
    }
    return false;
  },
};
