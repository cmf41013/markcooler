# ADR-002：用 vite-plugin-singlefile 支持 file:// 双击模式

## 状态

已采纳（2026-10-09）

## 背景

双击 `dist/index.html` 打开时白屏。根因：Chrome 出于 CORS 拦截 `file://` 加载的外部 `<script type="module">`。

## 决策

使用 `vite-plugin-singlefile` 把 JS/CSS 全部内联进 index.html（内联 module 脚本无 CORS 限制）。

## 后果

- 正：双击模式在 Chrome 真正可用（E2E 验证）。
- 负：产物是单个约 730KB 的 HTML（本地使用无碍）。
