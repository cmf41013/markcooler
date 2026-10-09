import type { FastifyInstance } from 'fastify';
import { VERSION, type ServerConfig } from '../config.ts';

export function registerMetaRoutes(app: FastifyInstance, config: ServerConfig): void {
  app.get('/api/health', async () => ({
    ok: true,
    version: VERSION,
    root: config.root,
    mode: 'server' as const,
  }));

  app.get('/api/meta', async () => ({
    root: config.root,
    version: VERSION,
    mode: 'server' as const,
  }));
}
