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
      '/spring':{
        target: 'http://49.235.103.189:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spring/, '')
      },
      '/FlashService' : {
        target: 'http://49.235.103.189:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/FlashService/, '')
      },
      '/CheckService': {
        //审核模块
        target: 'http://43.143.165.4:8089',
        //target: 'http://49.235.103.189:8070',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/CheckService/, '')
      },
      '/LoginService': {
        //审核模块
        target: 'http://8.130.77.190:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/LoginService/, '')
      },
      '/UserInfoService': {
        //审核模块
        target: 'http://8.130.77.190:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/UserInfoService/, '')
      },
    }
  }
})
