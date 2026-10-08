import { Command } from 'commander';
import { buildApp } from './app.ts';
import { resolveConfig, VERSION, type CliOptions, type ServerConfig } from './config.ts';
import { openBrowser } from './lib/openBrowser.ts';

function parsePort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`无效端口：${value}`);
  }
  return port;
}

async function startServer(config: ServerConfig): Promise<void> {
  try {
    const app = await buildApp(config);
    await app.listen({ port: config.port, host: config.host });
    const url = `http://${config.host}:${config.port}`;
    app.log.info(`markcooler 已启动：${url}`);
    if (config.open) openBrowser(url);
  } catch (err) {
    console.error('启动失败：', err);
    process.exit(1);
  }
}

export function run(argv: string[] = process.argv): void {
  const program = new Command();

  program.name('markcooler').description('本地优先的 Markdown 阅读器').version(VERSION);

  program
    .command('serve', { isDefault: true })
    .description('启动本地服务器并在浏览器中打开')
    .option('-p, --port <number>', '监听端口（默认 3000）', parsePort, 3000)
    .option('-d, --dir <path>', 'markdown 根目录（默认当前目录）')
    .option('--host <host>', '监听地址（默认 127.0.0.1）', '127.0.0.1')
    .option('--no-open', '启动后不自动打开浏览器')
    .action(async (options: CliOptions) => {
      await startServer(resolveConfig(options));
    });

  program.parse(argv);
}
