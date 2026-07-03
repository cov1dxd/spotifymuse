/** Thin base wrapper for Spotify Web API requests. */

const API_BASE = 'https://api.spotify.com/v1';

export interface SpotifyRequestOptions {
  method?: string;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
}

/** Perform an authenticated Web API request. Returns the raw Response. */
export async function spotifyRequest(
  token: string,
  path: string,
  options: SpotifyRequestOptions = {},
): Promise<Response> {
  const { method = 'GET', query, body } = options;

  const url = new URL(API_BASE + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  return fetch(url.toString(), {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

/** GET returning parsed JSON, or null on 204 (no active playback). */
export async function spotifyGet<T>(
  token: string,
  path: string,
  options?: SpotifyRequestOptions,
): Promise<T | null> {
  const res = await spotifyRequest(token, path, { ...options, method: 'GET' });
  if (res.status === 204) return null;
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 300);
    } catch {
      /* ignore */
    }
    throw new Error(`Spotify GET ${path} failed: ${res.status} ${detail}`);
  }
  return (await res.json()) as T;
}
