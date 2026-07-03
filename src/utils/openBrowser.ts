import { spawn } from 'node:child_process';
import { platform } from 'node:os';

/**
 * Opens a URL in the user's default browser. Detached so it never blocks or
 * ties the browser's lifetime to the TUI process.
 */
export function openBrowser(url: string): void {
  const os = platform();
  const command = os === 'darwin' ? 'open' : os === 'win32' ? 'start' : 'xdg-open';
  const args = os === 'win32' ? ['', url] : [url];

  const child = spawn(command, args, {
    stdio: 'ignore',
    detached: true,
    shell: os === 'win32',
  });
  child.unref();
}
