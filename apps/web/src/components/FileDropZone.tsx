import { useCallback, useState, type DragEvent } from 'react';
import { cn } from '../lib/cn';

export function FileDropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm',
        'border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400',
        dragging && 'border-blue-500 text-blue-500',
      )}
    >
      <p>拖拽 .md 文件到此处</p>
      <label className="cursor-pointer rounded-md border px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800">
        或点击选择文件
        <input
          type="file"
          accept=".md,.markdown,text/markdown"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onFiles(files);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}
