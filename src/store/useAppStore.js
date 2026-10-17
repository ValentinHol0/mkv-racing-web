import { create } from 'zustand';

const INITIAL_SERVERS = [
  {
    id: 'srp-tokyo-01',
    name: '[MKV] SHUTO REVIVAL | HIGHWAY TRAFFIC',
    region: 'Japan (Tokyo C1)',
    track: 'Shuto Expressway C1 Outer Loop',
    ip: '185.190.140.12',
    port: 9601,
    httpPort: 8082,
    clients: 48,
    maxClients: 70,
    maxSlots: 170,
    ping: 24,
    tickRate: 40,
    bubbleRadius: 300,
    weather: 'Pure 3.10 Rain FX (Wet Road)',
    ambientTemp: 19,
    roadTemp: 18,
    checksumVerified: true,
    cars: ['Toyota Supra MKV', 'Audi R8 V10', 'Porsche 911 GT3 RS', 'BMW M5 CS'],
    joinUrl:
      'acmanager://ui/quick/server?server_ip=185.190.140.12&server_port=9601&server_http_port=8082',
  },
  {
    id: 'georgia-tbilisi-02',
    name: '[UA] GEORGIA TBILISI | TRAFFIC | VALEEEK',
    region: 'Georgia (Tbilisi)',
    track: 'AC Georgia Mountain Serpentine Pass',
    ip: '185.190.140.12',
    port: 9600,
    httpPort: 8081,
    clients: 32,
    maxClients: 70,
    maxSlots: 70,
    ping: 26,
    tickRate: 30,
    bubbleRadius: 300,
    weather: 'Pure 3.10 Overcast FX',
    ambientTemp: 22,
    roadTemp: 24,
    checksumVerified: true,
    cars: ['BMW M240i Tuned', 'Toyota Supra MKV', 'Cadillac ATS-V', 'Mercedes-AMG G63'],
    joinUrl:
      'acmanager://ui/quick/server?server_ip=185.190.140.12&server_port=9600&server_http_port=8081',
  },
];

const INITIAL_CARS = [
  {
    id: 'supra-mkv',
    name: 'Toyota Supra MKV (A90)',
    role: 'Flagship Platform Runner',
    power: '720 HP',
    torque: '850 Nm',
    topSpeed: '335 km/h',
    accel: '3.1 s (0-100)',
    drivetrain: 'RWD',
    weight: '1,490 kg',
    engine: '3.0L 2JZ-GTE Custom Twin-Turbo',
    checksumVerified: true,
    liveries: ['Crimson Red', 'Gloss Obsidian', 'Metallic Gunmetal', 'Storm White'],
  },
  {
    id: 'audi-r8',
    name: 'Audi R8 V10 Performance',
    role: 'AWD Track Precision',
    power: '620 HP',
    torque: '580 Nm',
    topSpeed: '331 km/h',
    accel: '3.2 s (0-100)',
    drivetrain: 'AWD',
    weight: '1,595 kg',
    engine: '5.2L V10 FSI Atmospheric',
    checksumVerified: true,
    liveries: ['Suzuka Grey', 'Mythos Black', 'Vegas Yellow', 'Daytona Grey'],
  },
  {
    id: 'porsche-gt3rs',
    name: 'Porsche 911 GT3 RS (992)',
    role: 'Aero Downforce Weapon',
    power: '525 HP',
    torque: '465 Nm',
    topSpeed: '296 km/h',
    accel: '3.2 s (0-100)',
    drivetrain: 'RWD',
    weight: '1,450 kg',
    engine: '4.0L Boxer-6 High-Revving',
    checksumVerified: true,
    liveries: ['Guards Red', 'Shark Blue', 'Ice Grey', 'Signal Yellow'],
  },
  {
    id: 'bmw-m5cs',
    name: 'BMW M5 CS (F90)',
    role: 'Highway Super Sedan',
    power: '635 HP',
    torque: '750 Nm',
    topSpeed: '305 km/h',
    accel: '3.0 s (0-100)',
    drivetrain: 'AWD',
    weight: '1,825 kg',
    engine: '4.4L V8 M TwinPower Turbo',
    checksumVerified: true,
    liveries: ['Frozen Deep Green', 'Brands Hatch Grey', 'Black Sapphire'],
  },
];

export const useAppStore = create((set) => ({
  // Auth state
  isAuthenticated: false,
  user: null,
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  login: (userData) =>
    set({
      isAuthenticated: true,
      user: {
        name: userData.name || 'Valentin Holomidov',
        callsign: userData.callsign || 'ApexPredator_UA',
        tier: 'Level 42 Pro Tier',
        safetyScore: 98.4,
        steamId: userData.steamId || '76561198000000001',
        email: userData.email || 'pilot@mkvracing.com',
      },
      isAuthModalOpen: false,
    }),
  logout: () => set({ isAuthenticated: false, user: null }),

  // Server state
  servers: INITIAL_SERVERS,
  selectedServerId: 'srp-tokyo-01',
  setSelectedServerId: (id) => set({ selectedServerId: id }),

  // Garage state
  cars: INITIAL_CARS,
  selectedCarId: 'supra-mkv',
  selectedLivery: 'Crimson Red',
  setSelectedCarId: (id) => {
    const car = INITIAL_CARS.find((c) => c.id === id);
    set({
      selectedCarId: id,
      selectedLivery: car ? car.liveries[0] : 'Default',
    });
  },
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
