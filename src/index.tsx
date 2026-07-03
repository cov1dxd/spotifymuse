#!/usr/bin/env bun
import { render } from 'ink';
import { App } from './app/App.tsx';
import { stopStream } from './services/streamService.ts';

/**
 * Entry point. Enters the alternate screen buffer so MUSE takes over the
 * terminal cleanly and restores it on exit.
 */

process.stdout.write('\x1b[?1049h'); // enter alternate screen

// Ensure the embedded librespot device never outlives MUSE.
const cleanup = (): void => stopStream();
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

const { waitUntilExit } = render(<App />);

waitUntilExit().then(() => {
  stopStream();
  process.stdout.write('\x1b[?1049l'); // leave alternate screen
});
