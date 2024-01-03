import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 5172,
    proxy: {
      '/FlashService' : {
        target: 'http://49.235.103.189:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/FlashService/, '')

      }
    }
  }
})
