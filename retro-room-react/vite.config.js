import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "node_modules/@fortawesome/fontawesome-free/css/all.css";`
      }
    }
  },
  assetsInclude: ['**/*.woff', '**/*.woff2']
})
