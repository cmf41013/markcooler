# ADR-001：使用 TypeScript 6.0.x（而非 TS 7）

## 状态

已采纳（2026-09-30）

## 背景

TypeScript 7.0（原生编译器）已发布，但 `typescript-eslint@8` 尚不支持（peer 要求 `<6.1.0`），导致 lint 直接报错。

## 决策

全栈钉在 **TypeScript 6.0.x**（`~6.0.3`）。

## 后果

- 正：工具链（typescript-eslint / 编辑器）完全兼容。
- 负：暂时无法用 TS 7 的新特性；待 typescript-eslint 支持后再升级。
