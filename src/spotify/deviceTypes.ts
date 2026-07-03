import { z } from 'zod';

/** Spotify Connect device shapes. */

export interface Device {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  volumePercent: number;
}

const deviceSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  type: z.string(),
  is_active: z.boolean(),
  volume_percent: z.number().nullable(),
});

export const devicesResponseSchema = z.object({
  devices: z.array(deviceSchema).default([]),
});

export type DevicesResponse = z.infer<typeof devicesResponseSchema>;

export function normalizeDevices(res: DevicesResponse): Device[] {
  return res.devices
    .filter((d): d is typeof d & { id: string } => d.id !== null)
    .map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      isActive: d.is_active,
      volumePercent: d.volume_percent ?? 100,
    }));
}
