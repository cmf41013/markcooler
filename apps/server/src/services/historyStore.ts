import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { HistoryEntry } from '@markcooler/shared';

const MAX_ENTRIES = 50;

export function historyId(absolutePath: string): string {
  return createHash('sha1').update(absolutePath).digest('hex').slice(0, 12);
}

/** 打开历史的 JSON 文件存储（内存缓存 + 原子写盘）。 */
export class HistoryStore {
  private entries: HistoryEntry[] = [];
  private readonly file: string;

  constructor(file: string) {
    this.file = file;
  }

  async load(): Promise<void> {
    try {
      const raw = await readFile(this.file, 'utf-8');
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) this.entries = parsed as HistoryEntry[];
    } catch {
      this.entries = [];
    }
  }

  list(): HistoryEntry[] {
    return [...this.entries];
  }

  /** 追加（按 id 去重、最近优先、封顶 MAX_ENTRIES）。 */
  add(entry: HistoryEntry): HistoryEntry {
    this.entries = [entry, ...this.entries.filter((e) => e.id !== entry.id)];
    if (this.entries.length > MAX_ENTRIES) this.entries = this.entries.slice(0, MAX_ENTRIES);
    return entry;
  }

  remove(id: string): boolean {
    const before = this.entries.length;
    this.entries = this.entries.filter((e) => e.id !== id);
    return this.entries.length < before;
  }

  /** 原子写盘：先写临时文件再 rename，避免中途崩溃损坏历史文件。 */
  async persist(): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(this.entries, null, 2), 'utf-8');
    await rename(tmp, this.file);
  }
}
