import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { FileContentResponse, FileEntry } from '@markcooler/shared';
import { safeResolve } from '../lib/pathGuard.ts';

const MARKDOWN_EXTS = new Set(['.md', '.markdown']);

function isMarkdown(name: string): boolean {
  return MARKDOWN_EXTS.has(path.extname(name).toLowerCase());
}

/** 递归列出 root（或其子目录 subdir）下所有 markdown 文件，路径为相对 root 的 POSIX 路径。 */
export async function listMarkdownFiles(root: string, subdir = ''): Promise<FileEntry[]> {
  const rootAbs = path.resolve(root);
  const baseAbs = subdir ? safeResolve(rootAbs, subdir) : rootAbs;
  const relBase = subdir.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const result: FileEntry[] = [];

  async function walk(dir: string, relDir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const abs = path.join(dir, entry.name);
      const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(abs, rel);
      } else if (entry.isFile() && isMarkdown(entry.name)) {
        const info = await stat(abs);
        result.push({
          path: rel,
          name: entry.name,
          dir: relDir,
          size: info.size,
          modifiedAt: info.mtime.toISOString(),
        });
      }
    }
  }

  await walk(baseAbs, relBase);
  return result.sort((a, b) => a.path.localeCompare(b.path));
}

/** 读取单个 markdown 文件（路径经 safeResolve 校验）。 */
export async function readMarkdownFile(root: string, rel: string): Promise<FileContentResponse> {
  const target = safeResolve(root, rel);
  const info = await stat(target);
  const content = await readFile(target, 'utf-8');
  return {
    path: rel.replace(/\\/g, '/'),
    content,
    size: info.size,
    modifiedAt: info.mtime.toISOString(),
    encoding: 'utf-8',
  };
}
