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
// 通过vite-plugin-pwa 实现资源缓存：
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  define: {
    // 注入构建时间到代码中
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    preload({
      // 只预加载首页关键资源
      shouldPreload: (chunk) => {
        // 预加载所有JS和CSS资源，但可以通过更精细的控制只加载首页关键资源
        if (chunk.type === 'asset' && chunk.fileName.endsWith('.css')) {
          // 预加载所有CSS资源
          return true
        }
        if (chunk.type === 'chunk' && chunk.fileName.endsWith('.js')) {
          // 只预加载关键的JS chunks
          // 预加载主入口文件、Vue核心库、路由相关文件
          const isMainChunk =
            chunk.name === 'main' || chunk.name === 'HomeView' || chunk.name === 'MixMain'
          const isVueCore =
            chunk.fileName.includes('vue') ||
            chunk.fileName.includes('vue-router') ||
            chunk.fileName.includes('pinia')
          // 首页组件相关
          const isHomeComponent =
            chunk.fileName.includes('Home') ||
            chunk.fileName.includes('Header') ||
            chunk.fileName.includes('Footer')

          return isMainChunk || isVueCore || isHomeComponent
        }
        return false
      },
    }),
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
    // 专门为CSS文件添加一个压缩插件实例
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
      compressionOptions: { level: 9 },
      filter: /\.(css)$/i,
      verbose: true,
    }),
    // 自动导入
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'src/auto-imports.d.ts',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        maximumFileSizeToCacheInBytes: 5000000, // 设置为 5MB
      },
    }),
    {
      // 自定义插件生成版本文件
      name: 'version-file',
      apply: 'build',
      buildStart() {
        const versionInfo = {
          version: process.env.npm_package_version || '1.2.5',
          buildTime: new Date().toISOString(),
          hash: Math.random().toString(36).substring(2, 11)
        };

        // 生成版本文件
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify(versionInfo, null, 2)
        });
      }
    }
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
    sourcemap: 'hidden', // 源代码映射
    cssMinify: true,
    minify: true,
    terserOptions: {
      sourceMap: true, // 确保压缩时保留 source map
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
            drop_console: false, // 移除所有 console.log
          },
          format: {
            comments: true, // 移除注释
          },
        }),
      ],
      external: ['fsevents'],
      output: {
        manualChunks: {
          // 核心框架：Vue相关的核心库
          'vue-core': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          // 状态管理相关
          store: ['@/stores'],
          // UI组件库（按需加载）
          'naive-ui': ['naive-ui'],
          // 工具库
          utils: ['axios', 'lodash', '@vueuse/core'],
          // 文档处理库（较大的包）
          'epub-bundle': ['epubjs'],
          // 可视化和图表库
          visualization: ['echarts', 'highlight.js'],
          // 将@vue-office/pdf和pdfjs-dist这种大型库打包在一起
          'pdf-bundle': [
            '@vue-office/pdf',
          ],
          // 富文本编辑器
          editors: ['quill', '@vueup/vue-quill', '@tiptap/core', '@tiptap/vue-3']
        },
      },
    },
  },
})
