# GitHub Actions 概念与 ci.yml 解析

## 一、核心概念

| 概念 | 英文 | 说明 | 本项目对应 |
|---|---|---|---|
| 工作流 | Workflow | 一个完整的自动化流程，定义在 `.github/workflows/*.yml` 里 | `ci.yml`（name: CI） |
| 触发事件 | Event | 什么情况下启动工作流 | `push` / `pull_request` 到 main、dev |
| 任务 | Job | 工作流里的一组步骤，默认并行，可串行 | `check` |
| 步骤 | Step | 任务里的最小执行单元 | Checkout、Setup pnpm、Lint… |
| 运行器 | Runner | 执行任务的机器（GitHub 云端或自建） | `ubuntu-latest` |
| 动作 | Action | 可复用的封装步骤（社区共享） | `actions/checkout`、`pnpm/action-setup` |

**一句话理解**：`Event`（何时）→ 触发 `Workflow` → 包含多个 `Job` → 每个 `Job` 在 `Runner` 上执行多个 `Step` → `Step` 可以 `run` 命令或 `uses` 一个 `Action`。

## 二、我们的 ci.yml 逐行解析

```yaml
name: CI                                  # 工作流名字，显示在 Actions 页面
on:                                       # 触发事件
  push:                                   # 事件①：push 代码时
    branches: [main, dev]                 #   只监听 main / dev
  pull_request:                           # 事件②：提 PR 时
    branches: [main, dev]                 #   目标是 main / dev 时
concurrency:                              # 并发控制：同一分支有新触发就取消旧的
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
permissions: { contents: read }           # 最小权限（安全最佳实践，只读）
jobs:                                     # 任务列表
  check:                                  #   任务 id：check
    name: Lint · Typecheck · Build        #   任务显示名
    runs-on: ubuntu-latest                #   在 GitHub 的 Ubuntu 云主机上跑
    steps:                                #   步骤
      - uses: actions/checkout@v4         # 1. 拉取仓库代码
      - uses: pnpm/action-setup@v4        # 2. 安装 pnpm（version: 11.22.0）
      - uses: actions/setup-node@v4       # 3. 安装 Node 24（cache: pnpm 缓存依赖）
      - run: pnpm install --frozen-lockfile  # 4. 严格按 pnpm-lock.yaml 装依赖
      - run: pnpm lint                    # 5. 静态检查（ESLint）
      - run: pnpm typecheck               # 6. 类型检查（tsc）
      - run: pnpm build                   # 7. 构建
```

要点说明：

1. **`on.push/pull_request` 决定"何时跑"**：这是我们设定的触发条件。日常开发提 PR 到 dev/main 时自动跑，push 到这两条分支时也跑。
2. **`runs-on: ubuntu-latest`**：CI 跑在 GitHub 的云端 Linux 机器上，**不是你本机**——这也是为什么你只需要 `git push`，剩下的检查 GitHub 帮你做。
3. **`--frozen-lockfile`**：要求依赖版本与锁文件完全一致，保证 CI 环境可复现（本地和 CI 装出来一模一样）。
4. **`cache: pnpm`**：缓存依赖，加速后续运行。
5. **`@v4` 是 action 的版本号**：`actions/checkout@v4` 表示用官方 checkout 动作的 v4 版本。

## 三、后续如何扩展（规划）

当各包建好后，会在 `jobs:` 下**增加任务**（不是改这个文件的思想）：

```yaml
  test:        # M6 之后加入：单元/组件测试
    runs-on: ubuntu-latest
    steps:
      - ... (checkout / pnpm / node 同上)
      - run: pnpm test

  e2e:         # M7 之后加入：Playwright 端到端测试
    runs-on: ubuntu-latest
    steps:
      - ... (checkout / pnpm / node)
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm e2e
```

## 四、其他平台的对照（扩展知识）

| 平台 | CI 配置文件 | 说明 |
|---|---|---|
| GitHub | `.github/workflows/*.yml` | 本项目用的，最主流 |
| GitLab | `.gitlab-ci.yml` | 语法不同、思路相同 |
| Jenkins | `Jenkinsfile` | 自建服务器的老牌方案 |

学会了 GitHub Actions 的「事件 → 任务 → 步骤」模型，切换到其他平台只是换语法，思路完全通用。
