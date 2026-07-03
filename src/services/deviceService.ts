import { useAuthStore } from '../state/authStore.ts';
import { getDevices, transferPlayback } from '../spotify/deviceApi.ts';
import type { Device } from '../spotify/deviceTypes.ts';

/** Device listing + transfer orchestration. */

async function token(): Promise<string | null> {
  return useAuthStore.getState().getAccessToken();
}

export async function fetchDevices(): Promise<Device[]> {
  const t = await token();
  if (!t) return [];
  try {
    return await getDevices(t);
  } catch {
    return [];
  }
}

export async function transferTo(deviceId: string, play = true): Promise<void> {
  const t = await token();
  if (t) await transferPlayback(t, deviceId, play);
}

/** Make the device with the given name active (used to activate MUSE's own device). */
export async function activateDeviceByName(name: string, play = false): Promise<boolean> {
  const t = await token();
  if (!t) return false;
  try {
    const device = (await getDevices(t)).find((d) => d.name === name);
    if (!device) return false;
    await transferPlayback(t, device.id, play);
    return true;
  } catch {
    return false;
  }
}

export type { Device };
