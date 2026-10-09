import type { HistoryEntry } from '@markcooler/shared';
import { Trash2 } from 'lucide-react';

export function HistoryPanel({
  entries,
  onSelect,
  onRemove,
}: {
  entries: HistoryEntry[];
  /** 点击打开（双击模式下不提供，历史仅作记录）。 */
  onSelect?: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
}) {
  if (entries.length === 0) {
    return <p className="px-2 text-xs text-neutral-400">暂无打开历史</p>;
  }
  return (
    <ul className="flex flex-col gap-0.5 text-sm">
      {entries.map((e) => (
        <li key={e.id} className="group flex items-center gap-1">
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(e)}
              title={e.path}
              className="flex-1 truncate rounded px-2 py-1 text-left text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {e.title}
            </button>
          ) : (
            <span
              title={e.path}
              className="flex-1 truncate rounded px-2 py-1 text-neutral-700 dark:text-neutral-300"
            >
              {e.title}
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemove(e.id)}
            aria-label={`删除 ${e.title}`}
            className="rounded p-1 text-neutral-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
