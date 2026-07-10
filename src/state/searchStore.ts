import { create } from 'zustand';
import * as search from '../services/searchService.ts';
import type { TrackResult } from '../spotify/searchTypes.ts';
import type { Playlist } from '../spotify/libraryTypes.ts';
import { clamp } from '../utils/format.ts';

/**
 * Search page state: a typing → browsing focus flow (inspired by
 * spotify-player). All Spotify calls go through searchService.
 */

export type SearchStatus = 'idle' | 'searching' | 'done' | 'empty';
export type SearchMode = 'typing' | 'browsing';

interface SearchState {
  open: boolean;
  mode: SearchMode;
  recommend: boolean;
  query: string;
  results: TrackResult[];
  // Recommend mode only: playlists shown above the tracks. `selected` spans
  // the combined list — playlists first (0..P-1), then tracks (P..P+T-1).
  recPlaylists: Playlist[];
  status: SearchStatus;
  selected: number;
  notice: string | null;

  openSearch: () => void;
  openRecommendations: () => Promise<void>;
  closeSearch: () => void;
  setQuery: (q: string) => void;
  setMode: (m: SearchMode) => void;
  runSearch: () => Promise<void>;
  moveSelection: (delta: number) => void;
  playSelected: () => Promise<boolean>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  open: false,
  mode: 'typing',
  recommend: false,
  query: '',
  results: [],
  recPlaylists: [],
  status: 'idle',
  selected: 0,
  notice: null,

  openSearch: () => set({ open: true, mode: 'typing', recommend: false, notice: null }),

  openRecommendations: async () => {
    set({ open: true, recommend: true, status: 'searching', results: [], recPlaylists: [], selected: 0, notice: null });
    try {
      // Playlists (taste-seeded) and top tracks in parallel; either may be empty.
      const [recPlaylists, results] = await Promise.all([
        search.recommendedPlaylists().catch(() => []),
        search.topTracks().catch(() => []),
      ]);
      const total = recPlaylists.length + results.length;
      set({ recPlaylists, results, status: total ? 'done' : 'empty', selected: 0, mode: 'browsing' });
    } catch (err) {
      set({ status: 'empty', results: [], recPlaylists: [], mode: 'browsing', notice: err instanceof Error ? err.message : 'Failed to load recommendations' });
    }
  },

  closeSearch: () => set({ open: false, mode: 'typing', recommend: false, notice: null }),
  setQuery: (query) => set({ query }),
  // Typing means a fresh search, not recommendations — drop the recommend header.
  setMode: (mode) => set({ mode, ...(mode === 'typing' ? { recommend: false } : {}) }),

  runSearch: async () => {
    const query = get().query.trim();
    if (!query) return;
    set({ status: 'searching', results: [], selected: 0, notice: null });
    try {
      const results = await search.searchTracks(query);
      set({
        results,
        status: results.length ? 'done' : 'empty',
        selected: 0,
        mode: results.length ? 'browsing' : 'typing',
      });
    } catch (err) {
      set({
        status: 'empty',
        results: [],
        mode: 'typing',
        notice: err instanceof Error ? err.message : 'Search failed',
      });
    }
  },

  moveSelection: (delta) => {
    const { results, recPlaylists, recommend, selected } = get();
    const total = (recommend ? recPlaylists.length : 0) + results.length;
    if (total === 0) return;
    set({ selected: clamp(selected + delta, 0, total - 1) });
  },

  playSelected: async () => {
    const { results, recPlaylists, recommend, selected } = get();
    // In recommend mode the list is [playlists..., tracks...].
    const playlistCount = recommend ? recPlaylists.length : 0;
    let ok = false;
    if (selected < playlistCount) {
      const pl = recPlaylists[selected];
      if (pl) ok = await search.playPlaylist(pl.uri);
    } else {
      const track = results[selected - playlistCount];
      if (track) ok = await search.playTrack(track);
    }
    if (ok) {
      set({ open: false, mode: 'typing', notice: null });
      return true;
    }
    set({ notice: 'No active device — press d to pick a speaker, then try again.' });
    return false;
  },
}));
