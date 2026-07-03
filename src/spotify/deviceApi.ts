import { spotifyGet, spotifyRequest } from './client.ts';
import { devicesResponseSchema, normalizeDevices, type Device } from './deviceTypes.ts';

/** Lists available Spotify Connect devices. */
export async function getDevices(token: string): Promise<Device[]> {
  const raw = await spotifyGet<unknown>(token, '/me/player/devices');
  if (raw === null) return [];
  const parsed = devicesResponseSchema.safeParse(raw);
  return parsed.success ? normalizeDevices(parsed.data) : [];
}

/** Transfers playback to a device (and starts playing there by default). */
export async function transferPlayback(
  token: string,
  deviceId: string,
  play = true,
): Promise<void> {
  await spotifyRequest(token, '/me/player', {
    method: 'PUT',
    body: { device_ids: [deviceId], play },
  });
}
