import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Canonical on-disk locations for MUSE. Everything lives under
 * ~/.config/muse/ so the app leaves no mess elsewhere.
 */

export const CONFIG_DIR = join(homedir(), '.config', 'muse');
export const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
export const TOKENS_FILE = join(CONFIG_DIR, 'tokens.json');
export const CACHE_DIR = join(CONFIG_DIR, 'cache');
export const ALBUM_ART_CACHE = join(CACHE_DIR, 'art');
