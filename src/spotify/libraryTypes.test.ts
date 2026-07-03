import { test, expect } from 'bun:test';
import { normalizePlaylists, playlistsResponseSchema } from './libraryTypes.ts';

test('normalizes playlists and skips nulls', () => {
  const parsed = playlistsResponseSchema.parse({
    items: [
      { id: 'p1', name: 'Focus', uri: 'spotify:playlist:p1', tracks: { total: 42 }, owner: { display_name: 'me' } },
      null,
      { id: 'p2', name: 'Gym', uri: 'spotify:playlist:p2' },
    ],
  });
  const lists = normalizePlaylists(parsed);
  expect(lists).toHaveLength(2);
  expect(lists[0]).toEqual({ id: 'p1', name: 'Focus', uri: 'spotify:playlist:p1', trackCount: 42, owner: 'me' });
  expect(lists[1]?.trackCount).toBe(0); // missing tracks defaults to 0
  expect(lists[1]?.owner).toBe('');
});

test('missing items normalizes to []', () => {
  expect(normalizePlaylists(playlistsResponseSchema.parse({}))).toEqual([]);
});
