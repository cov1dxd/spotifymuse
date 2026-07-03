import { test, expect } from 'bun:test';
import { generateVerifier, generateChallenge, generateState, buildAuthUrl } from './pkce.ts';
import { REDIRECT_URI } from './types.ts';

test('verifier is URL-safe and within PKCE length bounds', () => {
  const verifier = generateVerifier();
  expect(verifier.length).toBeGreaterThanOrEqual(43);
  expect(verifier.length).toBeLessThanOrEqual(128);
  expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
});

test('challenge is deterministic for a given verifier and URL-safe', () => {
  const verifier = generateVerifier();
  expect(generateChallenge(verifier)).toBe(generateChallenge(verifier));
  expect(generateChallenge(verifier)).toMatch(/^[A-Za-z0-9\-_]+$/);
});

test('state values are unique', () => {
  expect(generateState()).not.toBe(generateState());
});

test('auth URL carries all required PKCE params', () => {
  const url = new URL(
    buildAuthUrl({ clientId: 'abc123', challenge: 'chal', state: 'st' }),
  );
  expect(url.origin + url.pathname).toBe('https://accounts.spotify.com/authorize');
  expect(url.searchParams.get('client_id')).toBe('abc123');
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('code_challenge_method')).toBe('S256');
  expect(url.searchParams.get('code_challenge')).toBe('chal');
  expect(url.searchParams.get('state')).toBe('st');
  expect(url.searchParams.get('redirect_uri')).toBe(REDIRECT_URI);
});
