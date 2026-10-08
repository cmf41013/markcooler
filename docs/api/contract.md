# API 契约

> 单一事实来源：`packages/shared/src/api.ts`。前后端都从 `@markcooler/shared` 导入这些类型与常量，避免各写一份造成漂移。

## 路由常量

| 常量 | 值 | 方法 | 用途 |
|---|---|---|---|
| `API.health` | `/api/health` | GET | 健康检查 |
| `API.meta` | `/api/meta` | GET | 服务元信息 |
| `API.files` | `/api/files` | GET | 列出 markdown 文件 |
| `API.file` | `/api/file` | GET | 读取单个文件 |
| `API.history` | `/api/history` | GET / POST | 打开历史（查 / 增） |
| — | `/api/history/:id` | DELETE | 删除一条历史 |

## 核心类型

### FileEntry（文件列表项）

| 字段 | 类型 | 说明 |
|---|---|---|
| `path` | string | 相对根目录的 POSIX 路径，如 `notes/guide.md` |
| `name` | string | 文件名（含扩展名） |
| `dir` | string | 父目录路径（根目录时为 `''`） |
| `size` | number | 字节数 |
| `modifiedAt` | string | ISO 8601 修改时间 |

### FileContentResponse（文件内容）

| 字段 | 类型 | 说明 |
|---|---|---|
| `path` | string | 相对路径 |
| `content` | string | UTF-8 文本内容 |
| `size` | number | 字节数 |
| `modifiedAt` | string | ISO 8601 修改时间 |
| `encoding` | `'utf-8'` | 编码 |

### HistoryEntry（历史记录）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 稳定 id（服务器模式 `sha1(path).slice(0,12)`） |
| `path` | string | 绝对路径（服务器）/ 文件名（双击） |
| `title` | string | 去掉扩展名的标题 |
| `openedAt` | string | ISO 8601 打开时间 |

### ApiError（错误）

| 字段 | 类型 | 说明 |
|---|---|---|
| `error` | string | 人类可读错误信息 |
| `code` | `ApiErrorCode` | 判别式错误码 |

### ApiErrorCode

| 值 | 含义 |
|---|---|
| `NOT_FOUND` | 文件/资源不存在 |
| `INVALID_PATH` | 路径非法（绝对路径、null 字节等） |
| `PATH_OUTSIDE_ROOT` | 路径越界（`..` 逃出根目录） |
| `READ_ERROR` | 读取失败 |
| `INTERNAL` | 服务器内部错误 |

## 运行模式

`RunMode = 'server' | 'file'`：前端根据 `location.protocol` 判断——`file:` 为双击模式，否则为服务器模式。
