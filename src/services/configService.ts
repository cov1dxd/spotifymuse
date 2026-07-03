import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { CONFIG_DIR, CONFIG_FILE } from '../config/paths.ts';
import { DEFAULT_THEME } from '../themes/index.ts';

/**
 * Loads and persists user config at ~/.config/muse/config.json. Unknown or
 * corrupt files fall back to defaults rather than crashing.
 */

export const configSchema = z.object({
  clientId: z.string().min(1).nullable().default(null),
  theme: z.string().default(DEFAULT_THEME),
  lyrics: z.boolean().default(true),
  animations: z.boolean().default(true),
  visualizer: z.boolean().default(true),
  albumArt: z.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

export const DEFAULT_CONFIG: Config = configSchema.parse({});

/** Spotify Client IDs are 32 hex characters. Guards against junk stored values. */
export function isValidClientId(id: string | null | undefined): id is string {
  return typeof id === 'string' && /^[0-9a-f]{32}$/i.test(id);
}

async function ensureDir(): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
}

export async function loadConfig(): Promise<Config> {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf8');
    const parsed = configSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureDir();
  const validated = configSchema.parse(config);
  await writeFile(CONFIG_FILE, JSON.stringify(validated, null, 2), 'utf8');
}

export async function updateConfig(patch: Partial<Config>): Promise<Config> {
  const current = await loadConfig();
  const next = configSchema.parse({ ...current, ...patch });
  await saveConfig(next);
  return next;
}
