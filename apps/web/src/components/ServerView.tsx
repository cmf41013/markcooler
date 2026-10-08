import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { HistoryEntry } from '@markcooler/shared';
import { api } from '../api/client';
import { useServerHistory } from '../hooks/useHistory';
import { FileTree } from './FileTree';
import { HistoryPanel } from './HistoryPanel';
import { MarkdownRenderer } from './MarkdownRenderer';

export function ServerView() {
  const [selected, setSelected] = useState<string | null>(null);
  const files = useQuery({ queryKey: ['files'], queryFn: api.listFiles });
  const history = useServerHistory();

  const file = useQuery({
    queryKey: ['file', selected],
    queryFn: () => api.readFile(selected!),
    enabled: selected !== null,
  });

  function openPath(path: string) {
    setSelected(path);
    history.add(path);
  }

  function openHistory(entry: HistoryEntry) {
    // entry.path 为绝对路径，服务端会校验其在根目录内
    setSelected(entry.path);
  }

  return (
    <div className="flex h-[calc(100vh-49px)]">
      <aside className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r border-neutral-200 p-3 dark:border-neutral-800">
        <section>
          <h2 className="mb-1 px-2 text-xs font-semibold uppercase text-neutral-400">文件</h2>
          {files.isLoading ? (
            <p className="px-2 text-sm text-neutral-400">加载中…</p>
          ) : (
            <FileTree files={files.data?.files ?? []} selected={selected} onSelect={openPath} />
          )}
        </section>
        <section>
          <h2 className="mb-1 px-2 text-xs font-semibold uppercase text-neutral-400">历史</h2>
          <HistoryPanel
            entries={history.entries}
            onSelect={openHistory}
            onRemove={history.remove}
          />
        </section>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {file.data ? (
          <MarkdownRenderer content={file.data.content} />
        ) : (
          <p className="text-sm text-neutral-400">从左侧选择一个文件</p>
        )}
      </main>
    </div>
  );
}
