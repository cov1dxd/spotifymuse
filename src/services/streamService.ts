import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_DIR } from '../config/paths.ts';
import { logDebug } from '../utils/logger.ts';

/**
 * Manages an embedded librespot process so the terminal itself becomes a
 * Spotify Connect device — playback runs locally, no Spotify app required.
 * Requires `librespot` (brew install librespot) and Spotify Premium.
 */

export const STREAM_DEVICE_NAME = 'MUSE';

const BINARY_CANDIDATES = ['/opt/homebrew/bin/librespot', '/usr/local/bin/librespot'];

let proc: ChildProcess | null = null;

/** Resolve the librespot binary path, or null if not installed. */
export function librespotPath(): string | null {
  for (const p of BINARY_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

export function isInstalled(): boolean {
  return librespotPath() !== null;
}

export function isStreaming(): boolean {
  return proc !== null;
}

/** Spawn librespot signed in with the given access token. Idempotent. */
export function startStream(accessToken: string): boolean {
  if (proc) return true;
  const bin = librespotPath();
  if (!bin) return false;

  try {
    proc = spawn(
      bin,
      [
        '--name', STREAM_DEVICE_NAME,
        '--access-token', accessToken,
        '--backend', 'rodio',
        '--device-type', 'computer',
        '--bitrate', '320',
        '--system-cache', join(CONFIG_DIR, 'librespot'),
        '--disable-audio-cache',
      ],
      { stdio: 'ignore' },
    );
    proc.on('error', (err) => {
      logDebug(`librespot error: ${err.message}`);
      proc = null;
    });
    proc.on('exit', (code) => {
      logDebug(`librespot exited (${code})`);
      proc = null;
    });
    return true;
  } catch (err) {
    logDebug(`librespot spawn failed: ${err instanceof Error ? err.message : String(err)}`);
    proc = null;
    return false;
  }
}

export function stopStream(): void {
  if (proc) {
    proc.kill('SIGTERM');
    proc = null;
  }
}
