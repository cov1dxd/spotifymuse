import { create } from 'zustand';
import * as devices from '../services/deviceService.ts';
import type { Device } from '../spotify/deviceTypes.ts';
import { clamp } from '../utils/format.ts';

/** Device picker state (opened with `d`), mirroring the search flow. */

export type DeviceStatus = 'idle' | 'loading' | 'done' | 'empty';

interface DeviceState {
  open: boolean;
  status: DeviceStatus;
  devices: Device[];
  selected: number;

  openDevices: () => Promise<void>;
  closeDevices: () => void;
  moveSelection: (delta: number) => void;
  transferSelected: () => Promise<boolean>;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  open: false,
  status: 'idle',
  devices: [],
  selected: 0,

  openDevices: async () => {
    set({ open: true, status: 'loading', devices: [], selected: 0 });
    const list = await devices.fetchDevices();
    const active = Math.max(0, list.findIndex((d) => d.isActive));
    set({ devices: list, status: list.length ? 'done' : 'empty', selected: active });
  },

  closeDevices: () => set({ open: false }),

  moveSelection: (delta) => {
    const { devices: list, selected } = get();
    if (list.length === 0) return;
    set({ selected: clamp(selected + delta, 0, list.length - 1) });
  },

  transferSelected: async () => {
    const { devices: list, selected } = get();
    const device = list[selected];
    if (!device) return false;
    await devices.transferTo(device.id, true);
    set({ open: false });
    return true;
  },
}));
