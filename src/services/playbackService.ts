import { useAuthStore } from '../state/authStore.ts';
import * as api from '../spotify/playbackApi.ts';
import { getRecentlyPlayed } from '../spotify/recentApi.ts';
import type { NowPlaying, QueueItem, RepeatState } from '../spotify/playbackTypes.ts';
import type { TrackResult } from '../spotify/searchTypes.ts';

/**
 * Playback orchestration. Resolves a valid access token (refreshing as needed)
 * then delegates to the typed Spotify endpoints. UI/stores call this — never
 * the raw API — so token handling stays in one place.
 */

async function token(): Promise<string | null> {
  return useAuthStore.getState().getAccessToken();
}

export async function fetchNowPlaying(): Promise<NowPlaying | null> {
  const t = await token();
  if (!t) return null;
  try {
    return await api.getNowPlaying(t);
  } catch {
    return null;
  }
}

export async function fetchQueue(): Promise<QueueItem[]> {
  const t = await token();
  if (!t) return [];
  try {
    return await api.getQueue(t);
  } catch {
    return [];
  }
}

export async function fetchRecent(): Promise<TrackResult[]> {
  const t = await token();
  if (!t) return [];
  try {
    return await getRecentlyPlayed(t);
  } catch {
    return [];
  }
}

export async function togglePlayback(isPlaying: boolean): Promise<void> {
  const t = await token();
  if (!t) return;
  if (isPlaying) await api.pause(t);
  else await api.play(t);
}

export async function skipNext(): Promise<void> {
  const t = await token();
  if (t) await api.next(t);
}

export async function skipPrevious(): Promise<void> {
  const t = await token();
  if (t) await api.previous(t);
}

export async function seekTo(positionMs: number): Promise<void> {
  const t = await token();
  if (t) await api.seek(t, positionMs);
}

export async function changeVolume(percent: number): Promise<void> {
  const t = await token();
  if (t) await api.setVolume(t, percent);
}

export async function toggleShuffle(state: boolean): Promise<void> {
  const t = await token();
  if (t) await api.setShuffle(t, state);
}

export async function setRepeatMode(state: RepeatState): Promise<void> {
  const t = await token();
  if (t) await api.setRepeat(t, state);
}

/** Next repeat mode in the off → all → one cycle. */
export function nextRepeat(current: RepeatState): RepeatState {
  return current === 'off' ? 'context' : current === 'context' ? 'track' : 'off';
}

export type { NowPlaying, QueueItem, RepeatState };
