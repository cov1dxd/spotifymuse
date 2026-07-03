import { z } from 'zod';

/** Raw Spotify `GET /me/player` shape (only the fields MUSE consumes). */

export const repeatStateSchema = z.enum(['off', 'context', 'track']);
export type RepeatState = z.infer<typeof repeatStateSchema>;

const imageSchema = z.object({
  url: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
});

const trackItemSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string(),
  duration_ms: z.number(),
  artists: z.array(z.object({ name: z.string() })),
  album: z.object({
    name: z.string(),
    images: z.array(imageSchema),
  }),
});

export const playerResponseSchema = z.object({
  device: z
    .object({ name: z.string(), volume_percent: z.number().nullable() })
    .nullable()
    .optional(),
  shuffle_state: z.boolean().optional(),
  repeat_state: repeatStateSchema.optional(),
  progress_ms: z.number().nullable().optional(),
  is_playing: z.boolean().optional(),
  item: trackItemSchema.nullable().optional(),
});

export type PlayerResponse = z.infer<typeof playerResponseSchema>;

/** Normalized, UI-friendly playback snapshot. */
export interface NowPlaying {
  id: string | null;
  title: string;
  artist: string;
  album: string;
  artUrl: string | null;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: RepeatState;
  volume: number;
  device: string | null;
}

/** Pick the largest available album image URL. */
function largestImage(
  images: { url: string; width?: number | null | undefined }[],
): string | null {
  if (images.length === 0) return null;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? null;
}

/** A single upcoming track in the play queue. */
export interface QueueItem {
  id: string | null;
  title: string;
  artist: string;
  durationMs: number;
}

export const queueResponseSchema = z.object({
  queue: z.array(trackItemSchema).default([]),
});

export type QueueResponse = z.infer<typeof queueResponseSchema>;

export function normalizeQueue(res: QueueResponse): QueueItem[] {
  return res.queue.map((t) => ({
    id: t.id ?? null,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(', '),
    durationMs: t.duration_ms,
  }));
}

/** Convert a raw player response into a NowPlaying, or null if nothing is loaded. */
export function normalizePlayer(res: PlayerResponse): NowPlaying | null {
  if (!res.item) return null;
  return {
    id: res.item.id ?? null,
    title: res.item.name,
    artist: res.item.artists.map((a) => a.name).join(', '),
    album: res.item.album.name,
    artUrl: largestImage(res.item.album.images),
    durationMs: res.item.duration_ms,
    progressMs: res.progress_ms ?? 0,
    isPlaying: res.is_playing ?? false,
    shuffle: res.shuffle_state ?? false,
    repeat: res.repeat_state ?? 'off',
    volume: res.device?.volume_percent ?? 100,
    device: res.device?.name ?? null,
  };
}
