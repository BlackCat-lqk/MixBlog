import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// 引入打包依赖分析插件
import { visualizer } from 'rollup-plugin-visualizer'
// 引入gzip压缩插件
import viteCompression from 'vite-plugin-compression'
// 引入预加载
import preload from 'vite-plugin-preload'
// 引入terser, 压缩js和css和混淆代码
import terser from '@rollup/plugin-terser'
// 使用unplugin-auto-import插件自动导入工具
import AutoImport from 'unplugin-auto-import/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    preload(),
    // 依赖可视化分析
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'RollupVisualizer.html', //分析图生成的文件名
      open: true, //如果存在本地服务端口，将在打包后自动展示
    }),
    // 文件压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz', // 压缩后文件扩展名
      threshold: 10240, // 压缩阈值
      deleteOriginFile: false, // 压缩后是否删除源文件
      compressionOptions: { level: 9 }, // 压缩级别
      filter: /\.(js|mjs|json|css|html|svg)$/i, // 匹配文件
      verbose: true, // 是否打印压缩信息
    }),
    // 自动导入
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'src/auto-imports.d.ts',
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
  build: {
    cssMinify: true,
    minify: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 打包时，引用的第三方插件的配置
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true, // 移除所有 console.log
          },
          format: {
            comments: false, // 移除注释
          },
        }),
      ],
      external: ['fsevents'],
      output: {
        // manualChunks(id) {
        //   // 1. 核心框架单独分包
        //   if (
        //     id.includes('node_modules/vue') ||
        //     id.includes('node_modules/vue-router') ||
        //     id.includes('node_modules/pinia')
        //   ) {
        //     return 'vue-core'
        //   }
        //   // 2. 大型库单独分包
        //   if (id.includes('node_modules/echarts')) {
        //     return 'echarts'
        //   }
        //   if (id.includes('node_modules/lodash')) {
        //     return 'lodash'
        //   }
        //   if (id.includes('node_modules/axios')) {
        //     return 'axios'
        //   }
        //   if (id.includes('node_modules/highlight.js')) {
        //     return 'highlight'
        //   }
        //   // 3. 富文本编辑器相关
        //   if (id.includes('node_modules/quill') || id.includes('node_modules/@vueup/vue-quill')) {
        //     return 'quill-editor'
        //   }
        //   // 4. Tiptap 编辑器相关
        //   if (id.includes('node_modules/@tiptap')) {
        //     return 'tiptap-editor'
        //   }
        //   // 5. Office 文档处理相关
        //   if (id.includes('node_modules/@vue-office')) {
        //     return 'office-viewer'
        //   }
        //   // 6. VueUse 工具库
        //   if (id.includes('node_modules/@vueuse')) {
        //     return 'vueuse'
        //   }
        //   // 7. 国际化相关
        //   if (id.includes('node_modules/vue-i18n')) {
        //     return 'i18n'
        //   }
        //   // 8. 3D 相关 (ogl)
        //   if (id.includes('node_modules/ogl')) {
        //     return 'webgl'
        //   }
        //   // 9. 其他 node_modules 中的依赖
        //   if (id.includes('node_modules')) {
        //     return 'vendor'
        //   }
        //   // 10. 按功能分包 - 可以根据您的项目结构调整这部分
        //   if (id.includes('src/components')) {
        //     return 'components'
        //   }
        //   if (id.includes('src/views') || id.includes('src/pages')) {
        //     const match = id.match(/src\/(views|pages)\/([^/]+)/)
        //     if (match && match[2]) {
        //       return `view-${match[2]}`
        //     }
        //   }
        // },
      },
    },
  },
})
