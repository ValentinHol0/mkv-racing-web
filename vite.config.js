import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Запити /api/* проксуються на MKV API (npm run server)
    proxy: { '/api': `http://localhost:${process.env.API_PORT || 4000}` },
  },
});
