import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  //base: '/',
  base: '/wealth-tracker/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/authservice': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/expenseservice': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/report-automation-service': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
