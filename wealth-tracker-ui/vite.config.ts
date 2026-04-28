import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/authservice': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/expenseservice': {
        target: 'http://localhost:8086',
        changeOrigin: true,
      },
      '/report-automation-service': {
        target: 'http://localhost:8089',
        changeOrigin: true,
      },
    },
  },
})
