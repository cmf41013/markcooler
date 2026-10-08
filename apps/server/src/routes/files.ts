import type { FastifyInstance } from 'fastify';
import { API } from '@markcooler/shared';
import type { ServerConfig } from '../config.ts';
import { toApiError } from '../lib/apiError.ts';
import { listMarkdownFiles, readMarkdownFile } from '../services/fileService.ts';

export function registerFileRoutes(app: FastifyInstance, config: ServerConfig): void {
  app.get<{ Querystring: { path?: string } }>(API.files, async (request, reply) => {
    try {
      const files = await listMarkdownFiles(config.root, request.query.path ?? '');
      return { files };
    } catch (err) {
      const { status, body } = toApiError(err);
      return reply.code(status).send(body);
    }
  });

  app.get<{ Querystring: { path?: string } }>(API.file, async (request, reply) => {
    try {
      const path = request.query.path;
      if (!path) {
        return reply.code(400).send({ error: '缺少 path 参数', code: 'INVALID_PATH' });
      }
      return await readMarkdownFile(config.root, path);
    } catch (err) {
      const { status, body } = toApiError(err);
      return reply.code(status).send(body);
    }
  });
}
