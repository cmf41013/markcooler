import path from 'node:path';

export type PathErrorCode = 'INVALID_PATH' | 'PATH_OUTSIDE_ROOT';

export class PathError extends Error {
  readonly code: PathErrorCode;

  constructor(code: PathErrorCode, message: string) {
    super(message);
    this.name = 'PathError';
    this.code = code;
  }
}

/**
 * 将用户提供的路径（相对或绝对）安全解析为 root 内的绝对路径。
 * 安全不变量：结果绝不逃出 root。违规时抛出 PathError。
 */
export function safeResolve(root: string, input: string): string {
  if (input.includes('\0')) {
    throw new PathError('INVALID_PATH', '路径包含非法字符');
  }
  const normalized = input.replace(/\\/g, '/');
  const rootAbs = path.resolve(root);
  const target = path.isAbsolute(normalized)
    ? path.resolve(normalized)
    : path.resolve(rootAbs, normalized);
  const within = path.relative(rootAbs, target);
  if (within.startsWith('..') || path.isAbsolute(within)) {
    throw new PathError('PATH_OUTSIDE_ROOT', '路径越界');
  }
  return target;
}
