import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/sdk': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
      '/api/chat': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
      },
      '/api/xdr': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
