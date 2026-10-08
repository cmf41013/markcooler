import type { FileEntry } from '@markcooler/shared';
import { cn } from '../lib/cn';

export function FileTree({
  files,
  selected,
  onSelect,
}: {
  files: FileEntry[];
  selected: string | null;
  onSelect: (path: string) => void;
}) {
  if (files.length === 0) {
    return <p className="px-2 text-sm text-neutral-400">目录下没有 markdown 文件</p>;
  }
  return (
    <ul className="flex flex-col gap-0.5 text-sm">
      {files.map((f) => (
        <li key={f.path}>
          <button
            type="button"
            onClick={() => onSelect(f.path)}
            title={f.path}
            className={cn(
              'w-full truncate rounded px-2 py-1 text-left',
              'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
              selected === f.path && 'bg-neutral-100 font-medium dark:bg-neutral-800',
            )}
          >
            {f.path}
          </button>
        </li>
      ))}
    </ul>
  );
}
