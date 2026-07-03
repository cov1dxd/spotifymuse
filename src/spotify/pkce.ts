import { createHash, randomBytes } from 'node:crypto';
import { REDIRECT_URI, SCOPES } from './types.ts';

/**
 * PKCE (Proof Key for Code Exchange) primitives for Spotify's Authorization
 * Code flow — no client secret required, safe for a public CLI client.
 */

const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize';

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

/** High-entropy random string, 43–128 chars per the PKCE spec. */
export function generateVerifier(): string {
  return base64url(randomBytes(64));
}

/** S256 challenge derived from the verifier. */
export function generateChallenge(verifier: string): string {
  return base64url(createHash('sha256').update(verifier).digest());
}

/** Opaque value to guard against CSRF on the callback. */
export function generateState(): string {
  return base64url(randomBytes(16));
}

export interface AuthUrlParams {
  clientId: string;
  challenge: string;
  state: string;
}

export function buildAuthUrl({ clientId, challenge, state }: AuthUrlParams): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    scope: SCOPES.join(' '),
  });
  return `${AUTHORIZE_ENDPOINT}?${params.toString()}`;
}
