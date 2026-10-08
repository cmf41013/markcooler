import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { HistoryEntry } from '@markcooler/shared';
import { api } from '../api/client';
import { loadLocalHistory, saveLocalHistory } from '../api/fileMode';

/** 服务器模式：基于 TanStack Query 的打开历史。 */
export function useServerHistory() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ['history'], queryFn: api.listHistory });

  const add = useMutation({
    mutationFn: api.addHistory,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['history'] }),
  });
  const remove = useMutation({
    mutationFn: api.removeHistory,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['history'] }),
  });

  return {
    entries: list.data ?? [],
    add: (path: string) => add.mutate(path),
    remove: (id: string) => remove.mutate(id),
  };
}

/** 双击模式：基于 localStorage 的打开历史（仅记录，无法一键重开）。 */
export function useFileHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadLocalHistory);

  const add = useCallback((entry: HistoryEntry) => {
    setEntries((prev) => {
      const next = [entry, ...prev.filter((e) => e.id !== entry.id)];
      saveLocalHistory(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveLocalHistory(next);
      return next;
    });
  }, []);

  return { entries, add, remove };
}
