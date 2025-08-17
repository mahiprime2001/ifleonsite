import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true, // ✅ this is the key
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    },
  },
});
