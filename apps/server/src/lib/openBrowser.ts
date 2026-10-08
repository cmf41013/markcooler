import { spawn } from 'node:child_process';

/** 用系统默认浏览器打开 URL（不阻塞、不等待）。 */
export function openBrowser(url: string): void {
  const opts = { detached: true, stdio: 'ignore' as const, windowsHide: true };

  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '""', url], opts);
  } else if (process.platform === 'darwin') {
    spawn('open', [url], opts);
  } else {
    spawn('xdg-open', [url], opts);
  }
}
