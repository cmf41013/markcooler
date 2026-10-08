# 开发路线图（里程碑）

> 项目按 **M0–M8** 八个里程碑推进，「M」是 Milestone（里程碑）的简写。
> 每个里程碑对应一批可独立验证的成果，按实现顺序依次完成。

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M0 | monorepo 骨架 + git 规范 + 工具链（ESLint / Prettier / husky / commitlint） | ✅ 已完成 |
| M1 | `packages/shared`：共享 API 契约（DTO 类型 + 路由常量） | ✅ 已完成 |
| M2 | `apps/web` 骨架：React 19 + Vite 8 + Tailwind v4 + 主题切换 | ✅ 已完成 |
| M3 | `apps/server` 骨架：Fastify + commander CLI + 静态托管 | ✅ 已完成 |
| M4 | 文件 API + 历史：递归列目录、路径穿越防护、historyStore | ⏳ 进行中 |
| M5 | web 数据与渲染：文件列表 / 渲染 / 历史 / 拖拽 | ⬜ 待做 |
| M6 | 单元与组件测试：Vitest + RTL + MSW | ⬜ 待做 |
| M7 | E2E 测试：Playwright（server / file 双模式） | ⬜ 待做 |
| M8 | CI/CD 完整化 + 文档 | ⬜ 待做 |

## 相关文档

- CI/CD 实践：[docs/cicd/](cicd/)
- API 契约：[docs/api/contract.md](api/contract.md)
