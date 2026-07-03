import { useEffect, useState } from 'react';
import { getAnsiArt } from '../services/albumArtService.ts';

/**
 * Resolves ANSI album-art lines for a given image URL + width. Returns null
 * while loading or when art is unavailable (caller shows a fallback).
 */
export function useAlbumArt(url: string | null, width: number): string[] | null {
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setLines(null);
      return;
    }
    setLines(null);
    void getAnsiArt(url, width).then((res) => {
      if (!cancelled) setLines(res);
    });
    return () => {
      cancelled = true;
    };
  }, [url, width]);

  return lines;
}
