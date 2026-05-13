import { defineConfig } from 'vite';

export default defineConfig({
  base: 'frontend_kurs',
  server: {
    proxy: {
      '/api': {
        target: 'https://api.pandascore.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
  },
})