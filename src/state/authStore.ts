import { create } from 'zustand';
import { authorize, refresh } from '../spotify/auth.ts';
import { loadTokens, clearTokens } from '../spotify/tokenStore.ts';
import { loadConfig, updateConfig, isValidClientId } from '../services/configService.ts';
import { DEFAULT_CLIENT_ID } from '../config/constants.ts';
import type { StoredTokens } from '../spotify/types.ts';

/**
 * Global auth state + lifecycle. UI reads status/error and dispatches actions;
 * all Spotify/token logic is delegated to services — never inlined in the UI.
 */

export type AuthStatus =
  | 'loading'
  | 'needs-client-id'
  | 'disconnected'
  | 'authorizing'
  | 'authenticated'
  | 'error';

interface AuthState {
  status: AuthStatus;
  clientId: string | null;
  tokens: StoredTokens | null;
  error: string | null;

  init: () => Promise<void>;
  setClientId: (id: string) => Promise<void>;
  connect: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  clientId: null,
  tokens: null,
  error: null,

  init: async () => {
    const config = await loadConfig();
    const tokens = await loadTokens();

    // Prefer a valid stored Client ID, else the env default; a malformed stored
    // value (e.g. a stray keystroke) is ignored and healed.
    const stored = config.clientId;
    const clientId = isValidClientId(stored)
      ? stored
      : isValidClientId(DEFAULT_CLIENT_ID)
        ? DEFAULT_CLIENT_ID
        : null;
    if (stored !== null && !isValidClientId(stored)) void updateConfig({ clientId: null });

    if (tokens) {
      set({ status: 'authenticated', clientId, tokens, error: null });
      return;
    }
    set({ status: 'disconnected', clientId, error: null });
  },

  setClientId: async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    await updateConfig({ clientId: trimmed });
    set({ clientId: trimmed, status: 'disconnected', error: null });
  },

  connect: async () => {
    const { clientId } = get();
    if (!clientId) {
      set({ status: 'needs-client-id' });
      return;
    }
    set({ status: 'authorizing', error: null });
    try {
      const tokens = await authorize(clientId);
      set({ status: 'authenticated', tokens, error: null });
    } catch (err) {
      set({ status: 'error', error: err instanceof Error ? err.message : 'Authorization failed' });
    }
  },

  logout: async () => {
    await clearTokens();
    set({ status: 'disconnected', tokens: null, error: null });
  },

  getAccessToken: async () => {
    const { tokens, clientId } = get();
    if (!tokens || !clientId) return null;
    if (Date.now() < tokens.expiresAt) return tokens.accessToken;

    try {
      const refreshed = await refresh(clientId, tokens.refreshToken);
      set({ tokens: refreshed });
      return refreshed.accessToken;
    } catch {
      set({ status: 'disconnected', tokens: null });
      return null;
    }
  },
}));
