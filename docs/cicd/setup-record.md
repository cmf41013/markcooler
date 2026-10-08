# 完整实操记录

> 本文按时间顺序记录了 markcooler 项目 CI/CD 从零到跑通的全过程。
> 「👤 用户」表示你（在 GitHub 网页 / 本地）的操作；「🤖 Claude」表示 AI 助手在本机执行的操作。

## 0. 前置条件

| 工具 | 版本 | 说明 |
|---|---|---|
| Node.js | v24.13.0 | 运行时 |
| pnpm | 11.22.0 | 包管理器（本项目统一用它，不用 npm） |
| git | 2.43.0.windows.1 | 版本控制 |
| 系统 | Windows 10 Pro | — |

---

## 1. 创建 GitHub 远程仓库 👤 用户

在 GitHub 网页上创建远程空仓库：

1. 登录 GitHub，右上角 `+` → **New repository**。
2. **Repository name** 填 `markcooler`。
3. 可见性选 **Public**（本项目选公开）。
4. ⚠️ **不勾选** `Add a README file`、`.gitignore`、`license` —— 保持**空仓库**，避免与本地已有内容冲突。
5. 点 **Create repository**，得到仓库地址：`https://github.com/cmf41013/markcooler`。

> 备注：期间曾误建过一个 `markfcooler`（多了个 f），随后删除并重建为正确的 `markcooler`。这提醒我们：**远程仓库名要与项目名保持一致**，否则会导致品牌/命名不一致。

---

## 2. 本地初始化项目（M0 骨架） 🤖 Claude

在本地目录 `F:\for_test\frontend\markdown_viewer\markcooler` 下：

```bash
git init -b main        # 初始化 git 仓库，默认分支设为 main
```

安装根级开发依赖（TypeScript / ESLint / Prettier / husky / commitlint 等）：

```bash
pnpm add -D -w typescript eslint @eslint/js typescript-eslint \
  eslint-plugin-react-hooks eslint-plugin-react-refresh globals \
  prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
```

创建了这些配置文件（都属于工程规范/工具链，不属于业务代码）：

| 文件 | 作用 |
|---|---|
| `pnpm-workspace.yaml` | 声明 monorepo 工作区（apps/*、packages/*） |
| `tsconfig.base.json` | 全项目共享的 TypeScript 严格模式配置 |
| `eslint.config.js` | ESLint 平铺配置（代码风格/静态检查） |
| `prettier.config.mjs` | 代码格式化规则 |
| `commitlint.config.mjs` | 提交信息规范（Conventional Commits） |
| `lint-staged.config.mjs` | 提交前只对改动文件跑检查 |
| `husky`（.husky/） | git 钩子：提交前跑 lint-staged、提交时校验提交信息 |
| `.gitignore` / `.editorconfig` / `.gitattributes` / `.prettierignore` / `.npmrc` | 忽略规则、换行统一、编辑器约定等 |
| `.vscode/` | 调试配置（launch/tasks/settings/extensions） |

> 💡 踩坑记录：一开始 `pnpm add` 装到了 **TypeScript 7.0**，但 `typescript-eslint` 尚不支持 TS7（peer 要求 `<6.1.0`），导致 `pnpm lint` 直接报错。解决：钉回 **TypeScript 6.0.x**。这也体现了「工具链要彼此兼容」的重要性。

---

## 3. 首次提交（本地） 🤖 Claude

```bash
git add -A
git commit   # 提交信息（中文、符合 Conventional Commits 规范）
```

得到的首次提交：

```
0e0133b  chore: 初始化 markcooler monorepo 骨架
```

> 此时 husky 钩子已生效：`pre-commit` 自动跑了 lint-staged（prettier 格式化），`commit-msg` 自动跑了 commitlint 校验提交信息。

---

## 4. 添加最小 CI 工作流 🤖 Claude

新建文件 `.github/workflows/ci.yml`（内容见 [github-actions.md](github-actions.md)），提交：

```
fcb0ef7  ci: 添加 GitHub Actions 最小 CI 工作流
```

---

## 5. 建 dev 分支、添加远程、推送 🤖 Claude

```bash
git checkout -b dev          # 从 main 分出开发分支 dev
git remote add origin https://github.com/cmf41013/markcooler
git push -u origin main      # 推送 main（首次 push 触发 GitHub 授权）
git push -u origin dev       # 推送 dev
```

推送结果（摘录）：

```
To https://github.com/cmf41013/markcooler
 * [new branch]      main -> main

To https://github.com/cmf41013/markcooler
 * [new branch]      dev -> dev
```

推送后，GitHub 立即触发了 `CI` 工作流（因为 ci.yml 里声明了 push 到 main/dev 时触发）。

---

## 6. 开启 main 分支保护 👤 用户（待完成）

在 GitHub 网页操作：

1. 打开 `https://github.com/cmf41013/markcooler/settings/branches`。
2. 点 **Add branch protection rule**。
3. **Branch name pattern** 填 `main`。
4. 勾选 **Require a pull request before merging**。
5. 勾选 **Require status checks to pass before merging**，搜索 `Lint` 勾选（CI 至少成功一次后才会出现）。
6. 勾选 **Do not allow bypassing the above settings**（可选但推荐）。
7. **Create** 保存。

> 分支保护的目的是：`main` 不允许直接 push，只能通过「PR + 全部状态检查通过」合并，防止坏代码进入主线。

---

## 7. 验证 CI 运行结果 🤖 Claude（查询 GitHub API）

通过 GitHub API 查询工作流运行状态，结果：

| 触发分支 | 工作流 | 状态 | 结论 |
|---|---|---|---|
| `main` | CI | completed | ✅ success |
| `dev` | CI | completed | ✅ success |

即：第一次 push 后，两条分支的流水线都自动跑通（lint + typecheck + build 全绿）。

---

## 附录：完整命令清单

```bash
# —— 本地初始化 ——
git init -b main
pnpm add -D -w typescript eslint @eslint/js typescript-eslint \
  eslint-plugin-react-hooks eslint-plugin-react-refresh globals \
  prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm exec husky

# —— 首次提交 ——
git add -A
git commit -m "chore: 初始化 markcooler monorepo 骨架"

# —— CI 工作流提交 ——
git commit -m "ci: 添加 GitHub Actions 最小 CI 工作流"

# —— 分支 / 远程 / 推送 ——
git checkout -b dev
git remote add origin https://github.com/cmf41013/markcooler
git push -u origin main
git push -u origin dev
```
