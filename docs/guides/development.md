# 开发指南

## 环境

- Node.js ≥ 20.19（本项目在 Node 24 上开发）
- pnpm 11

## 安装与构建

```bash
pnpm install   # 安装所有依赖
pnpm build     # 构建 shared（tsc）+ web（vite）
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动前端开发服务器（Vite） |
| `node apps/server/src/index.ts serve --dir <目录>` | 启动后端并自动开浏览器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm test` | 单元/组件测试（Vitest） |
| `pnpm e2e` | 端到端测试（Playwright） |
| `pnpm format` | Prettier 格式化 |

## 提交规范

采用 Conventional Commits：`feat:` / `fix:` / `docs:` / `test:` / `chore:` 等。
提交前 husky 自动跑 lint-staged（prettier + eslint），提交信息需通过 commitlint 校验。

## Playwright 浏览器下载（国内镜像）

国内下载 chromium 可能超时，可用镜像：

```bash
PLAYWRIGHT_DOWNLOAD_HOST=https://cdn.npmmirror.com/binaries/playwright \
  pnpm --filter @markcooler/e2e exec playwright install chromium
```

## 分支与发布

- `main`：稳定分支，只通过 PR 合并（开启分支保护）。
- `dev`：集成分支，日常开发提交到这里。
- 功能在 `feature/*` 分支开发，完成后 PR 回 `dev`；里程碑完成后 PR `dev → main`。
