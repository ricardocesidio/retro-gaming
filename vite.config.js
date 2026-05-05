import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default {
  server: {
    fs: {
      // Permite que o Vite sirva arquivos fora da raiz do projeto, se necessário
      allow: ['..'] 
    }
  }
}