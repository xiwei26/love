# 像素童话求婚网站

这是一个基于 `Vite + TypeScript` 的单页求婚网站。

打开后会先显示“点击开启音乐与童话”，点击后开始自动播放像素剧情，播放到宝箱时停住；再次点击宝箱进入最终求婚画面。

## 运行环境

- Node.js 18 或更高版本
- npm

## 本地运行

第一次运行先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

启动后在浏览器打开终端里显示的本地地址，通常是：

```text
http://localhost:5173
```

## 观看流程

1. 打开页面
2. 点击“点击开启音乐与童话”
3. 等剧情自动播放到宝箱场景
4. 点击宝箱，进入最终求婚画面

如果你只是想快速看完整流程，可以用测试模式打开：

```text
http://localhost:5173/?testMode=1
```

这个模式会把剧情时间大幅缩短，方便预览。

## 部署

项目已经配置为适配 GitHub Pages。

- 仓库地址：`https://github.com/xiwei26/love`
- 预期线上地址：`https://xiwei26.github.io/love/`

每次向 `main` 分支推送后，GitHub Actions 会自动重新构建并部署。

## 其他常用命令

运行单元测试：

```bash
npm test
```

运行浏览器端到端测试：

```bash
npx playwright test
```

构建生产包：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 主要目录

- `src/`：页面逻辑、场景渲染、样式
- `public/photos/`：回忆照片
- `public/sprites/`：8-bit 小人、恶龙、宝箱、戒指、爱心素材
- `public/audio/`：背景音乐
- `tests/`：单元测试和 e2e 测试
- `docs/`：设计稿和实现计划
