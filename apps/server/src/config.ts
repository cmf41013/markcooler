import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** CLI 解析后的原始选项（commander 产物）。 */
export interface CliOptions {
  port: number;
  dir?: string;
  host: string;
  open: boolean;
}

/** 解析后的服务器配置。 */
export interface ServerConfig {
  port: number;
  host: string;
  /** markdown 根目录（绝对路径）。 */
  root: string;
  /** 是否启动后自动打开浏览器。 */
  open: boolean;
  /** web 构建产物目录（不存在则跳过静态托管）。 */
  webDist: string;
  /** 打开历史记录文件路径。 */
  historyFile: string;
}

// 本文件位于 apps/server/src/，据此定位 web 构建产物与 package.json
const HERE = path.dirname(fileURLToPath(import.meta.url));

function readVersion(): string {
  const pkg = JSON.parse(readFileSync(path.resolve(HERE, '../package.json'), 'utf-8')) as {
    version: string;
  };
  return pkg.version;
}

export const VERSION = readVersion();

export function resolveConfig(options: CliOptions): ServerConfig {
  return {
    port: options.port,
    host: options.host,
    root: path.resolve(options.dir ?? process.cwd()),
    open: options.open,
    webDist: path.resolve(HERE, '../../web/dist'),
    historyFile:
      process.env.MARKCOOLER_HISTORY_FILE ?? path.join(homedir(), '.markcooler', 'history.json'),
  };
}
