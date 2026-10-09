# 架构设计

## Monorepo 结构

```
markcooler/
├── apps/
│   ├── web/       # @markcooler/web：React 前端
│   ├── server/    # @markcooler/server：Node CLI + Fastify
│   └── e2e/       # @markcooler/e2e：Playwright 端到端测试
├── packages/
│   └── shared/    # @markcooler/shared：前后端共享的 API 契约类型
└── docs/
```

## 两种运行模式

前端根据 `location.protocol` 自动切换：

| 模式 | 触发 | 数据来源 |
|---|---|---|
| 服务器模式 | `http://` | `fetch /api/*` + TanStack Query |
| 双击模式 | `file://` | `File.text()` + localStorage |

### 服务器模式数据流

```
浏览器 ──GET /api/files──▶ Fastify ──fileService──▶ 文件系统
   ▲                                                │
   └────────────JSON（FileEntry[]）──────────────────┘
```

### 双击模式数据流

```
拖拽/选择文件 ──▶ FileDropZone ──▶ readLocalFile() ──▶ MarkdownRenderer
```

## 服务端分层

- `routes/`：HTTP 路由（薄层，只做参数解析与错误映射）
- `services/`：业务逻辑（fileService / historyStore）
- `lib/`：工具（pathGuard / apiError / openBrowser）

## 关键设计

- **路径穿越防护**（`pathGuard.safeResolve`）：任何文件读取都先做「根目录内」校验。
- **历史持久化**：服务器模式存 `~/.markcooler/history.json`（原子写盘）；双击模式存 localStorage。
- **单一契约**：前后端共享 `@markcooler/shared` 的 DTO 类型与路由常量，避免漂移。

## 后续规划（预留扩展点）

- **文件监听自动刷新**：预留 `--watch` 参数与 `FileChangeWatcher` 接口（未实现），计划用 chokidar + SSE 推送。
