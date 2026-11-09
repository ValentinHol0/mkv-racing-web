import { useCallback, useEffect } from 'react';
import { http, normalizeError, TOKEN_KEY } from '../services/apiClient';
import { useAppStore } from '../store/useAppStore';

/**
 * useAuthBootstrap — викликається один раз у <App />:
 *  - відновлює сесію пілота за збереженим токеном (GET /auth/me);
 *  - слухає подію 401 від axios-interceptor'а і виконує вихід.
 */
export function useAuthBootstrap() {
  const authStatus = useAppStore((s) => s.authStatus);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);

  useEffect(() => {
    if (authStatus !== 'checking') return;
    if (!localStorage.getItem(TOKEN_KEY)) return logout();
    http
      .get('/auth/me')
      .then((res) => login(res.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        logout();
      });
  }, [authStatus, login, logout]);

  useEffect(() => {
    window.addEventListener('mkv:unauthorized', logout);
    return () => window.removeEventListener('mkv:unauthorized', logout);
  }, [logout]);
}

/**
 * useAuth — авторизація пілота: вхід (email/callsign), Steam OpenID, реєстрація, вихід.
 * Стан користувача зберігається в глобальному Zustand-store, токен — у localStorage.
 */
export function useAuth() {
  const { user, isAuthenticated, authStatus, login, logout, openAuthModal, updateUser } =
    useAppStore();

  const authenticate = useCallback(
    async (path, body) => {
      try {
        const res = await http.post(path, body);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        login(res.data.user);
        return res.data.user;
      } catch (e) {
        throw normalizeError(e);
      }
    },
    [login]
  );

  const signIn = useCallback(
    (loginOrEmail, password) => authenticate('/auth/login', { login: loginOrEmail, password }),
    [authenticate]
  );
  const signInWithSteam = useCallback(
    (steamId) => authenticate('/auth/steam', { steamId }),
    [authenticate]
  );
  const register = useCallback((form) => authenticate('/auth/register', form), [authenticate]);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    logout();
  }, [logout]);

  /** Повертає true, якщо пілот авторизований; інакше відкриває вікно входу. */
  const requireAuth = useCallback(() => {
    if (isAuthenticated) return true;
    openAuthModal();
    return false;
  }, [isAuthenticated, openAuthModal]);

  return {
    user,
    isAuthenticated,
    status: authStatus,
    signIn,
    signInWithSteam,
    register,
    signOut,
    requireAuth,
    updateUser,
  };
}
