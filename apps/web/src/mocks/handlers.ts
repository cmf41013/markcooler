import { http, HttpResponse } from 'msw';
import { API, type FileEntry, type HistoryEntry } from '@markcooler/shared';

export const defaultFiles: FileEntry[] = [
  { path: 'a.md', name: 'a.md', dir: '', size: 10, modifiedAt: '2026-01-01T00:00:00.000Z' },
  { path: 'sub/b.md', name: 'b.md', dir: 'sub', size: 20, modifiedAt: '2026-01-02T00:00:00.000Z' },
];

export const defaultHistory: HistoryEntry[] = [
  { id: 'h1', path: '/a.md', title: 'a', openedAt: '2026-01-01T00:00:00.000Z' },
];

export const handlers = [
  http.get(API.files, () => HttpResponse.json({ files: defaultFiles })),
  http.get(API.history, () => HttpResponse.json(defaultHistory)),
  http.get(API.file, ({ request }) => {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') ?? '';
    return HttpResponse.json({
      path,
      content: `# ${path}\n`,
      size: 1,
      modifiedAt: '2026-01-01T00:00:00.000Z',
      encoding: 'utf-8',
    });
  }),
  http.post(API.history, async ({ request }) => {
    const body = (await request.json()) as { path: string };
    return HttpResponse.json({
      entry: { id: 'new', path: body.path, title: body.path, openedAt: 'now' },
    });
  }),
  http.delete(`${API.history}/:id`, () => HttpResponse.json({ ok: true })),
];
