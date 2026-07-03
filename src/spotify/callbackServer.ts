import { createServer, type Server } from 'node:http';
import { REDIRECT_PORT } from './types.ts';

/**
 * One-shot loopback server that captures Spotify's OAuth redirect. Resolves
 * with the authorization code (after validating `state`) then shuts down.
 */

const SUCCESS_HTML = `<!doctype html><html><head><meta charset="utf-8">
<title>MUSE</title><style>
body{background:#1e1e2e;color:#cdd6f4;font-family:-apple-system,sans-serif;
display:flex;height:100vh;margin:0;align-items:center;justify-content:center}
.card{text-align:center}h1{color:#a6e3a1;margin:0 0 .5rem}
p{color:#a6adc8}</style></head><body><div class="card">
<h1>&#10003; Connected</h1><p>You can return to the terminal now.</p>
</div></body></html>`;

const ERROR_HTML = `<!doctype html><html><head><meta charset="utf-8">
<title>MUSE</title><style>body{background:#1e1e2e;color:#f38ba8;
font-family:sans-serif;display:flex;height:100vh;margin:0;align-items:center;
justify-content:center}</style></head><body>
<h1>Authorization failed</h1></body></html>`;

export interface CallbackResult {
  code: string;
}

export function waitForCallback(
  expectedState: string,
  timeoutMs = 120_000,
): Promise<CallbackResult> {
  return new Promise<CallbackResult>((resolve, reject) => {
    let server: Server;

    const timer = setTimeout(() => {
      server.close();
      reject(new Error('Authorization timed out'));
    }, timeoutMs);

    const finish = (fn: () => void): void => {
      clearTimeout(timer);
      server.close();
      fn();
    };

    server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', `http://127.0.0.1:${REDIRECT_PORT}`);
      if (url.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error || !code || state !== expectedState) {
        res.writeHead(400, { 'Content-Type': 'text/html' }).end(ERROR_HTML);
        finish(() => reject(new Error(error ?? 'Invalid authorization callback')));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' }).end(SUCCESS_HTML);
      finish(() => resolve({ code }));
    });

    server.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    server.listen(REDIRECT_PORT, '127.0.0.1');
  });
}
