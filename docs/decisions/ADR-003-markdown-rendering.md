# ADR-003：react-markdown + rehype-highlight（而非 shiki）

## 状态

已采纳（2026-09-30）

## 背景

需要渲染 GFM（表格/任务列表）并高亮代码。

## 决策

- 渲染：react-markdown + remark-gfm
- 高亮：rehype-highlight（highlight.js，单主题 CSS）
- 排版：@tailwindcss/typography（prose）

不选 shiki：它需要 TextMate 语法 + WASM，对本地小工具过重。

## 后果

- 正：轻量、同步、离线可用。
- 负：语法高亮精度略逊于 shiki。
