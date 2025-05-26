import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/style/global.scss" as g;
        `,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 代理目标地址
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['@faker-js/faker']
  }
})
