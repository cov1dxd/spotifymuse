import { expect, test } from 'bun:test';
import { normalizeSearch, searchResponseSchema } from './searchTypes.ts';

// getTopTracks wraps the { items } response as { tracks: { items } } and reuses
// the search schema/normalizer. Verify that adapter against a real top-tracks shape.
test('top-tracks payload normalizes via the search schema wrap', () => {
  const raw = {
    items: [
      {
        id: '1',
        uri: 'spotify:track:1',
        name: 'Song',
        duration_ms: 200000,
        artists: [{ name: 'Artist' }],
        album: { name: 'Album', uri: 'spotify:album:9' },
      },
    ],
  };
  const parsed = searchResponseSchema.safeParse({ tracks: raw });
  expect(parsed.success).toBe(true);
  const tracks = normalizeSearch(parsed.data!);
  expect(tracks).toHaveLength(1);
  expect(tracks[0]).toMatchObject({ title: 'Song', artist: 'Artist', albumUri: 'spotify:album:9' });
});
