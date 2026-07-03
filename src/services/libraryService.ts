import { useAuthStore } from '../state/authStore.ts';
import { getPlaylists } from '../spotify/libraryApi.ts';
import { playContextUri } from './playbackControls.ts';
import type { Playlist } from '../spotify/libraryTypes.ts';

/** Library listing + playlist playback. */

async function token(): Promise<string | null> {
  return useAuthStore.getState().getAccessToken();
}

export async function fetchPlaylists(): Promise<Playlist[]> {
  const t = await token();
  if (!t) return [];
  try {
    return await getPlaylists(t);
  } catch {
    return [];
  }
}

/** Plays a playlist (context), recovering from "no active device". */
export function playPlaylist(uri: string): Promise<boolean> {
  return playContextUri(uri);
}

export type { Playlist };
