import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    hmr: {
      port: 3001, // Use different port for HMR to avoid conflicts
    }
  }
});