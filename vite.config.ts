import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import manifestPlugin from './vite-plugin-manifest'
export default defineConfig({
  plugins: [react(),
    manifestPlugin('/sudoku-app/')
  ],
  base: '/sudoku-app/',
  server: {
    port: 5173,
    open: true
  }
}) 