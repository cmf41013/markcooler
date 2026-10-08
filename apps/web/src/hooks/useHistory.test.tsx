import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { HistoryEntry } from '@markcooler/shared';
import { useFileHistory, useServerHistory } from './useHistory';

function queryWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe('useFileHistory', () => {
  afterEach(() => localStorage.clear());

  it('add 去重且最近优先', () => {
    const { result } = renderHook(() => useFileHistory());
    const a: HistoryEntry = { id: '1', path: 'a.md', title: 'a', openedAt: 'x' };
    const b: HistoryEntry = { id: '2', path: 'b.md', title: 'b', openedAt: 'x' };
    act(() => result.current.add(b));
    act(() => result.current.add(a));
    act(() => result.current.add(b));
    expect(result.current.entries.map((e) => e.id)).toEqual(['2', '1']);
  });

  it('remove 删除记录', () => {
    const { result } = renderHook(() => useFileHistory());
    act(() => result.current.add({ id: '1', path: 'a.md', title: 'a', openedAt: 'x' }));
    act(() => result.current.remove('1'));
    expect(result.current.entries).toHaveLength(0);
  });
});

describe('useServerHistory', () => {
  it('通过 MSW 列出历史', async () => {
    const { result } = renderHook(() => useServerHistory(), { wrapper: queryWrapper() });
    await waitFor(() => expect(result.current.entries.length).toBeGreaterThan(0));
    expect(result.current.entries[0]?.title).toBe('a');
  });
});
