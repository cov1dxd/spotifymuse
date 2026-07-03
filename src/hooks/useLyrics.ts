import { useEffect } from 'react';
import { useLyricsStore } from '../state/lyricsStore.ts';
import type { NowPlaying } from '../spotify/playbackTypes.ts';

/** Loads lyrics whenever the current track changes. */
export function useLyrics(track: NowPlaying | null): void {
  const load = useLyricsStore((s) => s.load);

  useEffect(() => {
    if (track) void load(track);
  }, [track?.id, track?.title, track?.artist, load]);
}
