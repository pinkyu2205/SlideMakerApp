import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7259',
        changeOrigin: true,
        secure: false, // Bỏ qua SSL certificate check
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
