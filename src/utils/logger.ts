import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_DIR } from '../config/paths.ts';

/**
 * Minimal append-only debug log at ~/.config/muse/debug.log. Used to capture
 * OAuth diagnostics; never throws (logging must not break the app).
 */

const LOG_FILE = join(CONFIG_DIR, 'debug.log');

export function logDebug(message: string): void {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`);
  } catch {
    // logging is best-effort
  }
}
