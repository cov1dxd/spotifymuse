import { test, expect } from 'bun:test';
import { waitForCallback } from './callbackServer.ts';

/** Exercises the real loopback catch on 127.0.0.1:8888 (no Spotify involved). */

// The server closes as soon as it responds, which can race the client fetch —
// we only care about the `pending` promise, so ignore any fetch-side error.
const hit = (url: string): Promise<unknown> => fetch(url).catch(() => undefined);

test('binds 127.0.0.1:8888 and captures the code when state matches', async () => {
  const pending = waitForCallback('state-ok', 5000);
  await new Promise((r) => setTimeout(r, 150));
  await hit('http://127.0.0.1:8888/callback?code=ABC123&state=state-ok');
  const result = await pending;
  expect(result.code).toBe('ABC123');
});
