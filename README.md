# mix-blog

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

// 配置环境
node.js: 24.0.2
npm：11.4.0

安装 postcss 插件实现 px 自动转 rem
npm install postcss-pxtorem autoprefixer --save-dev

移动端使用：vant组件库
使用了动态路由来加载H5

使用了mirage.js、faker-js/faker来模拟数据

使用了@vueup/vue-quill组件进行富文本编辑

使用 npx node-modules-inspector命令生成依赖可视化

1.0.5 预计完善功能：

1. 登录页增加是否记住密码选项（完成）
2. 支持markdown阅读（完成）
3. 集成书籍、小说、漫画、散文等（进行中...）
4. 支持点赞、查看统计功能（进行中...）
5. 增加找回密码功能（完成）
6. h5页面前期开发90%完成（延迟下一版本）
7. 国际化（持续集成中...）
8. 站点集成导航（进行中...）
9. 个人中心修改密码（完成）
10. 立绘海报（进行中..）
11. 集成deepseek AI模型（完成）
12. 其它问题修复与优化
