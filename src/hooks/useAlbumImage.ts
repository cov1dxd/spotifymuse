import { useEffect, useState } from 'react';
import { getArtImageBase64 } from '../services/albumArtService.ts';

/**
 * Loads the cover as a base64 PNG for terminals with inline-image support.
 * Returns null while loading or when unavailable.
 */
export function useAlbumImage(url: string | null, enabled: boolean): string | null {
  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!enabled || !url) {
      setBase64(null);
      return;
    }
    setBase64(null);
    void getArtImageBase64(url).then((res) => {
      if (!cancelled) setBase64(res);
    });
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return base64;
}
