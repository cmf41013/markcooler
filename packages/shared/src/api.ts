/**
 * API 契约：`@markcooler/server` 与 `@markcooler/web` 之间共享的单一事实来源。
 * 这里只放类型与路由常量，不放任何运行时逻辑，保证前后端对同一份契约保持同步。
 */

/** 前端当前以哪种方式被提供。 */
export type RunMode = 'server' | 'file';

/** 目录树里的一个 markdown 文件。 */
export interface FileEntry {
  /** 相对服务根目录的 POSIX 风格路径，例如 `notes/guide.md`。 */
  path: string;
  /** 文件名（含扩展名），例如 `guide.md`。 */
  name: string;
  /** 父目录路径（位于根目录时为 `''`）。 */
  dir: string;
  /** 文件大小（字节）。 */
  size: number;
  /** 最后修改时间，ISO 8601 字符串。 */
  modifiedAt: string;
}

/** `GET /api/files` 的响应体。 */
export interface FileListResponse {
  files: FileEntry[];
}

/** `GET /api/file` 的响应体。 */
export interface FileContentResponse {
  path: string;
  content: string;
  size: number;
  modifiedAt: string;
  encoding: 'utf-8';
}

/** 打开历史中的一条记录。 */
export interface HistoryEntry {
  /**
   * 稳定 id。服务器模式：`sha1(绝对路径).slice(0, 12)`；
   * 双击模式：由 `name + size + modifiedAt` 派生。
   */
  id: string;
  /** 绝对路径（服务器模式）或文件名（双击模式）。 */
  path: string;
  /** 展示用标题（去掉扩展名的文件名）。 */
  title: string;
  /** 最后打开时间，ISO 8601 字符串。 */
  openedAt: string;
}

/** `POST /api/history` 的请求体。 */
export interface AddHistoryRequest {
  path: string;
}

/** `POST /api/history` 的响应体。 */
export interface AddHistoryResponse {
  entry: HistoryEntry;
}

/** `GET /api/meta` 的响应体。 */
export interface ServerMeta {
  /** 服务根目录的绝对路径。 */
  root: string;
  version: string;
  mode: 'server';
}

/** API 返回的判别式错误码。 */
export type ApiErrorCode =
  'NOT_FOUND' | 'INVALID_PATH' | 'PATH_OUTSIDE_ROOT' | 'READ_ERROR' | 'INTERNAL';

/** 所有 API 路由失败时返回的错误结构。 */
export interface ApiError {
  error: string;
  code: ApiErrorCode;
}

/** 路由路径，集中定义，前后端引用同一份字符串。 */
export const API = {
  health: '/api/health',
  meta: '/api/meta',
  files: '/api/files',
  file: '/api/file',
  history: '/api/history',
} as const;

export type ApiPath = (typeof API)[keyof typeof API];
