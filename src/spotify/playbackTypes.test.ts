import { test, expect } from 'bun:test';
import {
  normalizePlayer,
  normalizeQueue,
  playerResponseSchema,
  queueResponseSchema,
} from './playbackTypes.ts';

const raw = {
  device: { name: 'MacBook', volume_percent: 70 },
  shuffle_state: true,
  repeat_state: 'context' as const,
  progress_ms: 42_000,
  is_playing: true,
  item: {
    id: 'abc',
    name: 'Blinding Lights',
    duration_ms: 200_000,
    artists: [{ name: 'The Weeknd' }],
    album: {
      name: 'After Hours',
      images: [
        { url: 'small.jpg', width: 64 },
        { url: 'big.jpg', width: 640 },
      ],
    },
  },
};

test('normalizes a full player response', () => {
  const parsed = playerResponseSchema.parse(raw);
  const now = normalizePlayer(parsed);
  expect(now).not.toBeNull();
  expect(now?.title).toBe('Blinding Lights');
  expect(now?.artist).toBe('The Weeknd');
  expect(now?.album).toBe('After Hours');
  expect(now?.artUrl).toBe('big.jpg'); // largest image wins
  expect(now?.progressMs).toBe(42_000);
  expect(now?.isPlaying).toBe(true);
  expect(now?.shuffle).toBe(true);
  expect(now?.repeat).toBe('context');
  expect(now?.volume).toBe(70);
  expect(now?.device).toBe('MacBook');
});

test('returns null when no item is loaded', () => {
  expect(normalizePlayer(playerResponseSchema.parse({ is_playing: false }))).toBeNull();
});

test('normalizes the queue into simple items', () => {
  const parsed = queueResponseSchema.parse({
    queue: [
      { name: 'Save Your Tears', duration_ms: 215_000, artists: [{ name: 'The Weeknd' }], album: { name: 'After Hours', images: [] } },
      { name: 'Heartless', duration_ms: 198_000, artists: [{ name: 'The Weeknd' }, { name: 'X' }], album: { name: 'After Hours', images: [] } },
    ],
  });
  const items = normalizeQueue(parsed);
  expect(items).toHaveLength(2);
  expect(items[0]?.title).toBe('Save Your Tears');
  expect(items[1]?.artist).toBe('The Weeknd, X');
});

test('empty/absent queue normalizes to []', () => {
  expect(normalizeQueue(queueResponseSchema.parse({}))).toEqual([]);
});

test('joins multiple artists', () => {
  const multi = normalizePlayer(
    playerResponseSchema.parse({
      ...raw,
      item: { ...raw.item, artists: [{ name: 'A' }, { name: 'B' }] },
    }),
  );
  expect(multi?.artist).toBe('A, B');
});
