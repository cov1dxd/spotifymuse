import { useAuthStore } from '../state/authStore.ts';
import { searchTracks as apiSearch, searchPlaylists } from '../spotify/searchApi.ts';
import { getTopTracks, getTopArtists } from '../spotify/topApi.ts';
import { playTrackInAlbum, playContextUri } from './playbackControls.ts';
import { logDebug } from '../utils/logger.ts';
import type { TrackResult } from '../spotify/searchTypes.ts';
import type { Playlist } from '../spotify/libraryTypes.ts';

/** Search + play orchestration. Resolves a valid token, then calls the API. */

async function token(): Promise<string | null> {
  return useAuthStore.getState().getAccessToken();
}

export async function searchTracks(query: string): Promise<TrackResult[]> {
  const t = await token();
  if (!t) throw new Error('Not connected — reconnect and try again.');
  try {
    return await apiSearch(t, query);
  } catch (err) {
    logDebug(`search failed: ${err instanceof Error ? err.message : String(err)}`);
    throw err; // surfaced to the search page so the real reason is visible
  }
}

/** Your top tracks — the personalized "recommendations" list. */
export async function topTracks(): Promise<TrackResult[]> {
  const t = await token();
  if (!t) throw new Error('Not connected — reconnect and try again.');
  try {
    return await getTopTracks(t);
  } catch (err) {
    logDebug(`top tracks failed: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
}

/**
 * Recommended playlists: searches playlists for your top artists. Spotify's
 * /browse/featured-playlists and made-for-you playlists aren't available to
 * new apps, so this taste-seeded search is the working substitute.
 */
export async function recommendedPlaylists(): Promise<Playlist[]> {
  const t = await token();
  if (!t) throw new Error('Not connected — reconnect and try again.');
  try {
    const artists = (await getTopArtists(t)).slice(0, 3);
    if (artists.length === 0) return [];
    const lists = await Promise.all(artists.map((name) => searchPlaylists(t, name)));
    // Interleave-then-dedupe by uri; keep the first ~10.
    const seen = new Set<string>();
    const out: Playlist[] = [];
    for (const p of lists.flat()) {
      if (seen.has(p.uri)) continue;
      seen.add(p.uri);
      out.push(p);
      if (out.length >= 10) break;
    }
    return out;
  } catch (err) {
    logDebug(`recommended playlists failed: ${err instanceof Error ? err.message : String(err)}`);
    throw err;
  }
}

/** Plays a track within its album so playback continues afterwards. */
export function playTrack(track: TrackResult): Promise<boolean> {
  return playTrackInAlbum(track.uri, track.albumUri);
}

/** Plays a playlist (context). */
export function playPlaylist(uri: string): Promise<boolean> {
  return playContextUri(uri);
}

export type { TrackResult, Playlist };
