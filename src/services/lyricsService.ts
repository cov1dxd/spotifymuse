import { parseLrc, plainToLines, type LyricLine } from '../utils/lrc.ts';

/**
 * Fetches lyrics from LRCLIB (https://lrclib.net). Prefers synced lyrics,
 * falls back to plain, and returns null when nothing is found.
 */

const LRCLIB_GET = 'https://lrclib.net/api/get';

export interface LyricsResult {
  lines: LyricLine[];
  synced: boolean;
}

interface LrcLibResponse {
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
}

export interface LyricsQuery {
  title: string;
  artist: string;
  album: string;
  durationMs: number;
}

export async function fetchLyrics(q: LyricsQuery): Promise<LyricsResult | null> {
  const url = new URL(LRCLIB_GET);
  url.searchParams.set('track_name', q.title);
  url.searchParams.set('artist_name', q.artist);
  url.searchParams.set('album_name', q.album);
  url.searchParams.set('duration', String(Math.round(q.durationMs / 1000)));

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'MUSE terminal Spotify client (https://lrclib.net)' },
    });
    if (!res.ok) return null; // 404 = not found

    const data = (await res.json()) as LrcLibResponse;
    if (data.syncedLyrics) return { lines: parseLrc(data.syncedLyrics), synced: true };
    if (data.plainLyrics) return { lines: plainToLines(data.plainLyrics), synced: false };
    return null;
  } catch {
    return null;
  }
}
