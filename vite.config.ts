import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['axios', 'react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
  },
});
