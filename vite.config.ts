import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_PROXY_BASE can be set in .env to point at the deployed FRED proxy
// base มาจาก env (Actions ตั้ง VITE_BASE=/<repo>/ ให้อัตโนมัติ) — local = '/'
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5173 },
});
