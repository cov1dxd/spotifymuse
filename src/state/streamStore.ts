import { create } from 'zustand';
import { useAuthStore } from './authStore.ts';
import { isInstalled, startStream, stopStream, STREAM_DEVICE_NAME } from '../services/streamService.ts';
import { activateDeviceByName } from '../services/deviceService.ts';

/**
 * Local playback via the embedded librespot device. When running, the terminal
 * is a Spotify Connect device and audio plays locally — no Spotify app needed.
 */

interface StreamState {
  installed: boolean;
  running: boolean;
  starting: boolean;

  start: () => Promise<void>;
  stop: () => void;
}

const ACTIVATE_DELAY_MS = 4000; // let librespot register with Spotify first

export const useStreamStore = create<StreamState>((set) => ({
  installed: isInstalled(),
  running: false,
  starting: false,

  start: async () => {
    if (!isInstalled()) {
      set({ installed: false });
      return;
    }
    const token = await useAuthStore.getState().getAccessToken();
    if (!token) return;

    set({ installed: true, starting: true });
    const ok = startStream(token);
    set({ running: ok });

    if (ok) {
      setTimeout(() => {
        void activateDeviceByName(STREAM_DEVICE_NAME).finally(() => set({ starting: false }));
      }, ACTIVATE_DELAY_MS);
    } else {
      set({ starting: false });
    }
  },

  stop: () => {
    stopStream();
    set({ running: false });
  },
}));
