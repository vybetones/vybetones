import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages не поддерживает префиксы в базовом URL
  server: {
    port: 3000,
    host: true
  }
})
