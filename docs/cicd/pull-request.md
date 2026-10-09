# Pull Request（PR）流程

> 记录一次真实遇到的问题：推送 `dev` 后，GitHub 出现了「Compare & pull request」绿色按钮，它是什么？需要操作吗？

## 那个绿色按钮是什么

当你把一个**非默认分支**（如 `dev`）推送到 GitHub 后，GitHub 会自动提示：「要不要把 `dev` 合并进 `main`？」—— 就是页面顶部的 **Compare & pull request** 按钮。

它出现的条件：远程 `dev` 比 `main` 多出了一些提交。GitHub 在提醒「有东西还没合并」。

## 需要立刻操作吗？

**不需要。** 这只是建议，不是要求。日常开发在 `dev` 上持续进行，不需要每次推送都合并回 `main`。

## 什么时候用（真正的 PR 流程）

等 `dev` 上积累了一批稳定功能，再主动发起 PR `dev → main`：

1. 点 **Compare & pull request** → 填写标题与说明 → **Create pull request**
2. CI 自动运行（lint / typecheck / build / test）
3. 全部检查通过后 → **Merge** 合并进 main

## 与分支保护的关系

给 `main` 开启分支保护后（要求 PR + 状态检查通过），**Merge 按钮会被「等待 CI 通过」卡住**——只有 CI 全绿才能合并。这就是「阻止坏代码进入主线」的机制。

## 本项目约定

| 分支 | 角色 | 规则 |
|---|---|---|
| `main` | 稳定、可发布 | 只通过 PR 合并，禁止直接 push |
| `dev` | 集成分支 | 日常开发提交到这里 |

合并节奏：**一个里程碑完成后再 PR `dev → main`**，不必每次推送都合并。
