import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance } from 'fastify';
import { existsSync } from 'node:fs';
import type { ServerConfig } from './config.ts';
import { registerFileRoutes } from './routes/files.ts';
import { registerHistoryRoutes } from './routes/history.ts';
import { registerMetaRoutes } from './routes/meta.ts';
import { HistoryStore } from './services/historyStore.ts';

/**
 * 构建 Fastify 实例（不监听端口，便于测试注入）。
 * 若 web 已构建（webDist 存在），托管 SPA 并做 history fallback。
 */
export async function buildApp(config: ServerConfig): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  if (existsSync(config.webDist)) {
    await app.register(fastifyStatic, {
      root: config.webDist,
      index: 'index.html',
    });
    // SPA fallback：非 /api 的未匹配路由一律回 index.html（不能用通配路由，否则与 static 冲突）
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api')) {
        return reply.code(404).send({ error: 'Not Found', code: 'NOT_FOUND' });
      }
      return reply.sendFile('index.html');
    });
  }

  const history = new HistoryStore(config.historyFile);
  await history.load();

  registerMetaRoutes(app, config);
  registerFileRoutes(app, config);
  registerHistoryRoutes(app, config, history);

  return app;
}
