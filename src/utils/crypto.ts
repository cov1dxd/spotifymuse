import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_DIR } from '../config/paths.ts';

/**
 * At-rest encryption for stored tokens. The key is a random 32 bytes kept in a
 * 0600 keyfile under ~/.config/muse/. This is stable across machine renames
 * (unlike a hostname-derived key) so sessions survive network/hostname changes.
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_FILE = join(CONFIG_DIR, '.keyfile');

let cachedKey: Uint8Array | null = null;

function getKey(): Uint8Array {
  if (cachedKey) return cachedKey;
  try {
    const existing = readFileSync(KEY_FILE);
    if (existing.length === 32) {
      cachedKey = new Uint8Array(existing);
      return cachedKey;
    }
  } catch {
    /* no keyfile yet */
  }
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  const key = randomBytes(32);
  writeFileSync(KEY_FILE, new Uint8Array(key), { mode: 0o600 });
  cachedKey = new Uint8Array(key);
  return cachedKey;
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(), new Uint8Array(iv));
  const encrypted = cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64');
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(':');
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Malformed encrypted payload');
  }
  const decipher = createDecipheriv(ALGORITHM, getKey(), new Uint8Array(Buffer.from(ivB64, 'base64')));
  decipher.setAuthTag(new Uint8Array(Buffer.from(tagB64, 'base64')));
  return decipher.update(dataB64, 'base64', 'utf8') + decipher.final('utf8');
}
