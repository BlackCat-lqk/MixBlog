import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// 引入预加载
import preload from 'vite-plugin-preload'
// 引入gzip压缩
import compression from 'vite-plugin-compression'
// 引入terser,清理日志,移除console.log和debugger
import terser from '@rollup/plugin-terser'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    preload(),
    // 使用gzip压缩算法
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
  ],
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
      '/uploads': {
        target: 'http://localhost:3000', // 代理目标地址
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  optimizeDeps: {
    include: ['@faker-js/faker'],
  },
  build: {
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 拆分第三方库
    rollupOptions: {
      plugins: [terser()],
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', '@vitejs/plugin-vue'],
        },
      },
    },
  },
})
