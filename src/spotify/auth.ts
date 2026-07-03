import { openBrowser } from '../utils/openBrowser.ts';
import {
  buildAuthUrl,
  generateChallenge,
  generateState,
  generateVerifier,
} from './pkce.ts';
import { waitForCallback } from './callbackServer.ts';
import { saveTokens } from './tokenStore.ts';
import { logDebug } from '../utils/logger.ts';
import {
  REDIRECT_URI,
  tokenResponseSchema,
  type StoredTokens,
  type TokenResponse,
} from './types.ts';

/**
 * Orchestrates the Spotify OAuth PKCE flow and token lifecycle. This is the
 * only module that talks to Spotify's accounts endpoints.
 */

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

/** Refresh 60s early to avoid using an about-to-expire token. */
function toStored(res: TokenResponse, fallbackRefresh?: string): StoredTokens {
  const refreshToken = res.refresh_token ?? fallbackRefresh;
  if (!refreshToken) throw new Error('Spotify did not return a refresh token');
  return {
    accessToken: res.access_token,
    refreshToken,
    expiresAt: Date.now() + (res.expires_in - 60) * 1000,
    ...(res.scope !== undefined ? { scope: res.scope } : {}),
  };
}

async function postToken(body: URLSearchParams): Promise<TokenResponse> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = json as { error?: string; error_description?: string };
    logDebug(`token error ${res.status}: ${JSON.stringify(json)}`);
    const message = err.error_description ?? err.error ?? res.statusText;
    throw new Error(`Token request failed: ${message}`);
  }
  return tokenResponseSchema.parse(json);
}

/** Full interactive login. Opens the browser, waits for the callback, persists tokens. */
export async function authorize(clientId: string): Promise<StoredTokens> {
  const verifier = generateVerifier();
  const challenge = generateChallenge(verifier);
  const state = generateState();

  const authUrl = buildAuthUrl({ clientId, challenge, state });
  logDebug(`authorize: redirect_uri=${REDIRECT_URI} client_id=${clientId}`);
  logDebug(`authorize URL: ${authUrl}`);

  const callbackPromise = waitForCallback(state);
  openBrowser(authUrl);

  const { code } = await callbackPromise;

  const tokens = toStored(
    await postToken(
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        code_verifier: verifier,
      }),
    ),
  );

  await saveTokens(tokens);
  return tokens;
}

/** Exchanges a refresh token for a fresh access token and persists the result. */
export async function refresh(clientId: string, refreshToken: string): Promise<StoredTokens> {
  const tokens = toStored(
    await postToken(
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    ),
    refreshToken,
  );

  await saveTokens(tokens);
  return tokens;
}
