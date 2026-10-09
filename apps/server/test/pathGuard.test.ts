import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PathError, safeResolve } from '../src/lib/pathGuard.ts';

const root = path.resolve('root-dir');

describe('safeResolve', () => {
  it('解析相对路径', () => {
    expect(safeResolve(root, 'a.md')).toBe(path.resolve(root, 'a.md'));
  });

  it('解析子目录相对路径', () => {
    expect(safeResolve(root, 'sub/b.md')).toBe(path.resolve(root, 'sub/b.md'));
  });

  it('接受根目录内的绝对路径', () => {
    expect(safeResolve(root, path.resolve(root, 'a.md'))).toBe(path.resolve(root, 'a.md'));
  });

  it('拒绝 .. 路径穿越', () => {
    expect(() => safeResolve(root, '../etc/passwd')).toThrow(PathError);
  });

  it('拒绝根目录外的绝对路径', () => {
    expect(() => safeResolve(root, path.resolve(root, '..', 'other.md'))).toThrow(PathError);
  });

  it('拒绝 null 字节', () => {
    expect(() => safeResolve(root, 'a\0.md')).toThrow(PathError);
  });
});
