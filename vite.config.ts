import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  server: {
    port: 3000, // Change this from 5173 to another port if needed
    strictPort: true,
  }
});