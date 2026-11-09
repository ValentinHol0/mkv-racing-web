import { create } from 'zustand';

/**
 * Глобальний UI-стан. Дані серверів, авто, кіл і логів тепер приходять з MKV API
 * через хуки (src/hooks), а в store лишились сесія пілота та стан інтерфейсу.
 */
export const useAppStore = create((set) => ({
  // Auth state ('checking' — перевіряємо збережений токен при старті)
  authStatus: 'checking',
  isAuthenticated: false,
  user: null,
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  login: (user) =>
    set({
      authStatus: 'authenticated',
      isAuthenticated: true,
      user,
      selectedCarId: user.selectedCarId,
      isAuthModalOpen: false,
    }),
  updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  logout: () => set({ authStatus: 'guest', isAuthenticated: false, user: null }),

  // Server state
  selectedServerId: 'srp-tokyo-01',
  setSelectedServerId: (id) => set({ selectedServerId: id }),

  // Garage state (авто, яке зараз переглядається в гаражі)
  selectedCarId: 'supra-mkv',
  selectedLivery: null,
  setSelectedCarId: (id) => set({ selectedCarId: id, selectedLivery: null }),
  setSelectedLivery: (livery) => set({ selectedLivery: livery }),

  // Live telemetry state (WebSocket stream mockup)
  telemetry: {
    speed: 284,
    rpm: 7200,
    gear: 6,
    lateralG: 1.42,
    tireWear: 94,
    pureWeather: 'Pure 3.10 Rain',
    trackTemp: 18.4,
  },
  updateTelemetry: (partial) => set((state) => ({ telemetry: { ...state.telemetry, ...partial } })),
}));
