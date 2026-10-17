/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './cypress/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          slate: '#12161E',
          surface: '#181D26',
          border: '#242B38',
          card: '#151A23',
        },
        racing: {
          red: '#E63946',
          redHover: '#D62839',
        },
        telemetry: {
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        racing: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
