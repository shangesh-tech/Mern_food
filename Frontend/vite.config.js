import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-food-bl34.onrender.com',
        changeOrigin: true, // This ensures the origin of the request matches the target
        secure: true, // Set to true if you're using HTTPS on the backend
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' from the path
      },
    },
  },
});
