import { create } from 'zustand';
import { fetchLyrics } from '../services/lyricsService.ts';
import type { LyricLine } from '../utils/lrc.ts';

/**
 * Lyrics for the current track. Keyed by track so it fetches once per song;
 * a stale in-flight response for a previous track is discarded.
 */

export type LyricsStatus = 'idle' | 'loading' | 'found' | 'notfound';

export interface LyricsQueryInput {
  title: string;
  artist: string;
  album: string;
  durationMs: number;
}

interface LyricsState {
  status: LyricsStatus;
  lines: LyricLine[];
  synced: boolean;
  trackKey: string | null;
  load: (track: LyricsQueryInput) => Promise<void>;
}

export const useLyricsStore = create<LyricsState>((set, get) => ({
  status: 'idle',
  lines: [],
  synced: false,
  trackKey: null,

  load: async (track) => {
    const key = `${track.title}|${track.artist}`;
    if (get().trackKey === key) return; // already handled this track

    set({ trackKey: key, status: 'loading', lines: [], synced: false });
    const result = await fetchLyrics(track);
    if (get().trackKey !== key) return; // track changed while fetching

    if (!result) {
      set({ status: 'notfound', lines: [], synced: false });
      return;
    }
    set({ status: 'found', lines: result.lines, synced: result.synced });
  },
}));
