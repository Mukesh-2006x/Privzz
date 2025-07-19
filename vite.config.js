// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,          // Optional: default port for Vite preview
    host: true,          // Allow external access
    allowedHosts: ['privzz-1.onrender.com'],  // ✅ Allow Render domain
  },
});
