import type { ApiError } from '@markcooler/shared';
import { PathError } from './pathGuard.ts';

/** 把服务层抛出的异常映射为 HTTP 状态码与 ApiError 响应体。 */
export function toApiError(err: unknown): { status: number; body: ApiError } {
  if (err instanceof PathError) {
    return { status: 400, body: { error: err.message, code: err.code } };
  }
  const code = (err as NodeJS.ErrnoException | null)?.code;
  if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EISDIR') {
    return { status: 404, body: { error: '文件或目录不存在', code: 'NOT_FOUND' } };
  }
  return { status: 500, body: { error: '服务器内部错误', code: 'INTERNAL' } };
}
