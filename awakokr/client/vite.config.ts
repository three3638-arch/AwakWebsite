import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const OKR_API_PORT = Number(process.env.STACK_OKR_API_PORT || 3001)

export default defineConfig({
  base: '/okr/',
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.STACK_OKR_PORT || 3005),
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${OKR_API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
