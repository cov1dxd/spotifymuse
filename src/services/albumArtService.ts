import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ALBUM_ART_CACHE } from '../config/paths.ts';
import { imageToAnsi } from '../utils/imageToAnsi.ts';

/**
 * Loads album art and converts it to ANSI. Raw images are cached on disk
 * (never downloaded twice) and converted results are memoized in memory so
 * re-displaying a track is instant.
 */

const ansiMemo = new Map<string, string[]>();

async function fetchArtBuffer(url: string): Promise<Buffer | null> {
  const key = createHash('sha1').update(url).digest('hex');
  const file = join(ALBUM_ART_CACHE, key);

  try {
    return await readFile(file);
  } catch {
    // not cached yet — download below
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(ALBUM_ART_CACHE, { recursive: true });
    await writeFile(file, new Uint8Array(buf));
    return buf;
  } catch {
    return null;
  }
}

export async function getAnsiArt(url: string, width: number): Promise<string[] | null> {
  const memoKey = `${url}|${width}`;
  const memoized = ansiMemo.get(memoKey);
  if (memoized) return memoized;

  const buf = await fetchArtBuffer(url);
  if (!buf) return null;

  try {
    const lines = await imageToAnsi(buf, width);
    ansiMemo.set(memoKey, lines);
    return lines;
  } catch {
    return null;
  }
}
