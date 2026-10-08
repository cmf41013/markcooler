# CI/CD 实践记录

本目录记录了 **markcooler** 项目从零搭建 CI/CD（持续集成/持续交付）的完整过程，用于学习与复盘。

## 什么是 CI/CD

- **CI（持续集成，Continuous Integration）**：每次代码提交（push）或合并请求（PR），自动在云端跑一遍检查（lint、类型检查、测试、构建），尽早发现问题、阻止坏代码进入主线。
- **CD（持续交付/部署，Continuous Delivery/Deployment）**：代码通过检查后，自动发布到目标环境。

本项目当前聚焦 **CI** 部分；CD 留待后续里程碑。

## 目录

| 文档 | 内容 |
|---|---|
| [setup-record.md](setup-record.md) | **完整实操记录**：每一步谁做了什么、用了什么命令、得到什么结果 |
| [github-actions.md](github-actions.md) | GitHub Actions 核心概念 + `ci.yml` 逐行解析 |

## 当前成果快照

| 项 | 值 |
|---|---|
| 平台 | GitHub + GitHub Actions |
| 仓库 | https://github.com/cmf41013/markcooler （public） |
| 分支 | `main`（保护分支）+ `dev`（集成分支） |
| 流水线文件 | `.github/workflows/ci.yml` |
| 触发时机 | push / PR 到 `main`、`dev` 时 |
| 流水线内容 | lint → typecheck → build |
| 首次运行结果 | `main` 与 `dev` 均 ✅ success |
