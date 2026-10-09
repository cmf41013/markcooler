# markcooler

本地优先的 Markdown 阅读器 —— 用浏览器阅读你本地的 markdown 文件，完全离线。

## 特性

- 🌐 两种使用方式：启动本地服务，或直接双击 HTML 文件
- 📂 递归列出目录下所有 `.md` / `.markdown`（含子目录）
- 🕘 打开历史记录（服务器模式可一键重开）
- 🎨 Markdown 渲染：GFM 表格、任务列表、代码高亮
- 🌗 主题切换：浅色 / 深色 / 跟随系统
- 🛡 路径穿越防护，只允许读取指定目录内的文件

## 技术栈

- 前端：React 19 + Vite + Tailwind CSS v4 + TanStack Query
- 后端：Node.js + Fastify + commander（CLI）
- 测试：Vitest + Testing Library + MSW + Playwright
- 工程：pnpm workspaces（monorepo）+ TypeScript（strict）

## 快速开始

环境要求：Node.js ≥ 20.19，pnpm 11。

```bash
pnpm install
pnpm build
```

## 两种使用方式

### 服务器模式（推荐）

```bash
node apps/server/src/index.ts serve --dir /path/to/your/markdown
```

自动打开浏览器，左侧列出目录下所有 markdown 文件，点击阅读，历史可一键重开。
常用参数：`--port`（默认 3000）、`--dir`（默认当前目录）、`--no-open`、`--help`。

### 双击模式

直接双击 `apps/web/dist/index.html`，在 Chrome 中打开。除「列目录」外功能齐全（拖拽/选择文件打开，历史存 localStorage）。

## 开发

```bash
pnpm dev        # 启动前端开发服务器（Vite）
pnpm lint       # 代码检查
pnpm typecheck  # 类型检查
pnpm test       # 单元/组件测试（Vitest）
pnpm e2e        # 端到端测试（Playwright）
pnpm format     # 格式化
```

提交规范：Conventional Commits（`feat:` / `fix:` / `docs:` / `test:` 等）。

## 文档

- [开发路线图](docs/roadmap.md)
- [架构设计](docs/architecture/overview.md)
- [开发指南](docs/guides/development.md)
- [API 契约](docs/api/contract.md)
- [CI/CD 实践](docs/cicd/)
- [技术决策记录（ADR）](docs/decisions/)

## License

MIT
