import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { CONFIG_DIR, TOKENS_FILE } from '../config/paths.ts';
import { encrypt, decrypt } from '../utils/crypto.ts';
import { storedTokensSchema, type StoredTokens } from './types.ts';

/**
 * Persists the Spotify token set encrypted at rest. Corrupt or unreadable
 * token files are treated as "no session" rather than fatal errors.
 */

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  const validated = storedTokensSchema.parse(tokens);
  const payload = encrypt(JSON.stringify(validated));
  await writeFile(TOKENS_FILE, payload, 'utf8');
}

export async function loadTokens(): Promise<StoredTokens | null> {
  try {
    const payload = await readFile(TOKENS_FILE, 'utf8');
    const parsed = storedTokensSchema.safeParse(JSON.parse(decrypt(payload)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await unlink(TOKENS_FILE);
  } catch {
    // already gone — nothing to do
  }
}
