import { useEffect } from 'react';
import { usePlayerStore } from '../state/playerStore.ts';

const POLL_MS = 3000; // authoritative sync with Spotify
const TICK_MS = 250; // local progress interpolation

/**
 * Starts/stops the playback loops for the lifetime of the mounted screen:
 * a slow poll against Spotify and a fast local tick for smooth progress.
 */
export function usePlayback(): void {
  const sync = usePlayerStore((s) => s.sync);
  const tick = usePlayerStore((s) => s.tick);

  useEffect(() => {
    void sync();
    const poll = setInterval(() => void sync(), POLL_MS);
    const animate = setInterval(() => tick(), TICK_MS);
    return () => {
      clearInterval(poll);
      clearInterval(animate);
    };
  }, [sync, tick]);
}
