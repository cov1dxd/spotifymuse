import { create } from 'zustand';
import * as library from '../services/libraryService.ts';
import type { Playlist } from '../spotify/libraryTypes.ts';
import { clamp } from '../utils/format.ts';

/** Library (playlists) picker state, opened with `l`. */

export type LibraryStatus = 'idle' | 'loading' | 'done' | 'empty';

interface LibraryState {
  open: boolean;
  status: LibraryStatus;
  playlists: Playlist[];
  selected: number;
  notice: string | null;

  openLibrary: () => Promise<void>;
  closeLibrary: () => void;
  moveSelection: (delta: number) => void;
  playSelected: () => Promise<boolean>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  open: false,
  status: 'idle',
  playlists: [],
  selected: 0,
  notice: null,

  openLibrary: async () => {
    set({ open: true, status: 'loading', notice: null });
    const playlists = await library.fetchPlaylists();
    set({ playlists, status: playlists.length ? 'done' : 'empty', selected: 0 });
  },

  closeLibrary: () => set({ open: false, notice: null }),

  moveSelection: (delta) => {
    const { playlists, selected } = get();
    if (playlists.length === 0) return;
    set({ selected: clamp(selected + delta, 0, playlists.length - 1) });
  },

  playSelected: async () => {
    const { playlists, selected } = get();
    const playlist = playlists[selected];
    if (!playlist) return false;
    const ok = await library.playPlaylist(playlist.uri);
    if (ok) {
      set({ open: false, notice: null });
      return true;
    }
    set({ notice: 'No active device — press d to pick a speaker, then try again.' });
    return false;
  },
}));
