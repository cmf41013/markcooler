import { useCallback, useState } from 'react';
import { readLocalFile, toLocalHistoryEntry, type OpenedLocalFile } from '../api/fileMode';
import { useFileHistory } from '../hooks/useHistory';
import { FileDropZone } from './FileDropZone';
import { HistoryPanel } from './HistoryPanel';
import { MarkdownRenderer } from './MarkdownRenderer';

export function FileView() {
  const [opened, setOpened] = useState<OpenedLocalFile | null>(null);
  const { entries, add, remove } = useFileHistory();

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const openedFile = await readLocalFile(file);
      setOpened(openedFile);
      add(toLocalHistoryEntry(openedFile));
    },
    [add],
  );

  return (
    <div className="flex h-[calc(100vh-49px)]">
      <aside className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r border-neutral-200 p-3 dark:border-neutral-800">
        <FileDropZone onFiles={handleFiles} />
        <section>
          <h2 className="mb-1 px-2 text-xs font-semibold uppercase text-neutral-400">历史</h2>
          {/* 双击模式下浏览器不暴露真实路径，历史仅作记录，故不传 onSelect */}
          <HistoryPanel entries={entries} onRemove={remove} />
        </section>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {opened ? (
          <MarkdownRenderer content={opened.content} />
        ) : (
          <p className="text-sm text-neutral-400">拖拽或选择一个 .md 文件</p>
        )}
      </main>
    </div>
  );
}
