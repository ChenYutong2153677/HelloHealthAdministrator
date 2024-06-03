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
    proxy: {
      '/spring': {
        //target: 'http://49.235.103.189:8070',
        target: 'http://175.24.176.248:8070',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spring/, '')
      },
      '/api': {
        target: 'http://8.130.78.60:18088',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
    port: 5172
  }
})
