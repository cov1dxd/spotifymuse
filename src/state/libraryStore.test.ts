import { test, expect, afterEach } from 'bun:test';
import { useLibraryStore } from './libraryStore.ts';
import type { Playlist } from '../spotify/libraryTypes.ts';

const mk = (id: string): Playlist => ({ id, name: id, uri: `spotify:playlist:${id}`, trackCount: 1, owner: 'me' });

afterEach(() => {
  useLibraryStore.setState({ open: false, status: 'idle', playlists: [], selected: 0, notice: null });
});

test('moveSelection clamps within bounds', () => {
  useLibraryStore.setState({ playlists: [mk('a'), mk('b'), mk('c')], selected: 0 });
  const { moveSelection } = useLibraryStore.getState();
  moveSelection(-5);
  expect(useLibraryStore.getState().selected).toBe(0);
  moveSelection(9);
  expect(useLibraryStore.getState().selected).toBe(2);
});

test('closeLibrary hides and clears notice', () => {
  useLibraryStore.setState({ open: true, notice: 'x' });
  useLibraryStore.getState().closeLibrary();
  expect(useLibraryStore.getState().open).toBe(false);
  expect(useLibraryStore.getState().notice).toBeNull();
});
