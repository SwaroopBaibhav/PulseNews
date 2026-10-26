import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/google-sheet': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-sheet/, '')
      }
    }
  }
})
