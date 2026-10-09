import type { FastifyInstance } from 'fastify';
import path from 'node:path';
import { API, type AddHistoryRequest, type HistoryEntry } from '@markcooler/shared';
import type { ServerConfig } from '../config.ts';
import { toApiError } from '../lib/apiError.ts';
import { safeResolve } from '../lib/pathGuard.ts';
import { historyId, type HistoryStore } from '../services/historyStore.ts';

export function registerHistoryRoutes(
  app: FastifyInstance,
  config: ServerConfig,
  store: HistoryStore,
): void {
  app.get(API.history, async () => store.list());

  app.post<{ Body: AddHistoryRequest }>(API.history, async (request, reply) => {
    try {
      const input = request.body?.path;
      if (!input) {
        return reply.code(400).send({ error: '缺少 path 字段', code: 'INVALID_PATH' });
      }
      const absolute = safeResolve(config.root, input);
      const entry: HistoryEntry = {
        id: historyId(absolute),
        path: absolute,
        title: path.basename(absolute).replace(/\.(md|markdown)$/i, ''),
        openedAt: new Date().toISOString(),
      };
      store.add(entry);
      await store.persist();
      return reply.code(201).send({ entry });
    } catch (err) {
      const { status, body } = toApiError(err);
      return reply.code(status).send(body);
    }
  });

  app.delete<{ Params: { id: string } }>(`${API.history}/:id`, async (request, reply) => {
    const removed = store.remove(request.params.id);
    if (!removed) return reply.code(404).send({ error: '记录不存在', code: 'NOT_FOUND' });
    await store.persist();
    return { ok: true };
  });
}
