import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
<<<<<<< HEAD

export default defineConfig({
  server: {
    port: 3000, // Change this from 5173 to another port if needed
    strictPort: true,
  }
});
=======
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
>>>>>>> aeabe0789f190afb6234d65cd3ff666f7f45df8c
