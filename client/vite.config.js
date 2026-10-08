import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-assistant-page',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/assistant' || req.url === '/assistant/') req.url = '/assistant/index.html';
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          maps: ['@googlemaps/markerclusterer']
        }
      }
    }
  }
});
