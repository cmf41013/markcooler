import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { HistoryEntry } from '@markcooler/shared';
import { HistoryStore, historyId } from '../src/services/historyStore.ts';

function entry(id: string, p: string): HistoryEntry {
  return { id, path: p, title: p, openedAt: '2026-01-01T00:00:00.000Z' };
}

describe('HistoryStore', () => {
  let dir = '';
  let file = '';

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'markcooler-hist-'));
    file = path.join(dir, 'history.json');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('add 去重且最近优先', () => {
    const store = new HistoryStore(file);
    store.add(entry('1', '/a.md'));
    store.add(entry('2', '/b.md'));
    store.add(entry('1', '/a.md'));
    expect(store.list().map((e) => e.id)).toEqual(['1', '2']);
  });

  it('remove 删除记录', () => {
    const store = new HistoryStore(file);
    store.add(entry('1', '/a.md'));
    expect(store.remove('1')).toBe(true);
    expect(store.remove('1')).toBe(false);
    expect(store.list()).toHaveLength(0);
  });

  it('persist 后 load 可读回', async () => {
    const store = new HistoryStore(file);
    store.add(entry('x', '/x.md'));
    await store.persist();

    const store2 = new HistoryStore(file);
    await store2.load();
    expect(store2.list().map((e) => e.id)).toEqual(['x']);
  });

  it('historyId 稳定且区分不同路径', () => {
    expect(historyId('/a.md')).toBe(historyId('/a.md'));
    expect(historyId('/a.md')).not.toBe(historyId('/b.md'));
  });
});
