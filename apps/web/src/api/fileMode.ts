import type { HistoryEntry } from '@markcooler/shared';

export interface OpenedLocalFile {
  name: string;
  content: string;
  size: number;
  modifiedAt: string;
}

const STORAGE_KEY = 'markcooler:history';
const MAX_ENTRIES = 50;

/** 读取本地文件内容（双击模式）。 */
export async function readLocalFile(file: File): Promise<OpenedLocalFile> {
  return {
    name: file.name,
    content: await file.text(),
    size: file.size,
    modifiedAt: new Date(file.lastModified).toISOString(),
  };
}

function fileHistoryId(file: OpenedLocalFile): string {
  return `${file.name}|${file.size}|${file.modifiedAt}`;
}

export function toLocalHistoryEntry(file: OpenedLocalFile): HistoryEntry {
  return {
    id: fileHistoryId(file),
    path: file.name,
    title: file.name.replace(/\.(md|markdown)$/i, ''),
    openedAt: new Date().toISOString(),
  };
}

export function loadLocalHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // localStorage 不可用（部分 file:// 环境）时静默忽略
  }
}
