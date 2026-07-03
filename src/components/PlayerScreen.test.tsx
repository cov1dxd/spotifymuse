import { test, expect, afterEach } from 'bun:test';
import { render } from 'ink-testing-library';
import { PlayerScreen } from './PlayerScreen.tsx';
import { usePlayerStore } from '../state/playerStore.ts';
import type { NowPlaying } from '../spotify/playbackTypes.ts';

const mockTrack: NowPlaying = {
  id: 'x',
  title: 'Midnight City',
  artist: 'M83',
  album: 'Hurry Up, We’re Dreaming',
  artUrl: null,
  durationMs: 240_000,
  progressMs: 60_000,
  isPlaying: true,
  shuffle: false,
  repeat: 'off',
  volume: 80,
  device: 'MacBook',
};

afterEach(() => {
  usePlayerStore.setState({ track: null, progressMs: 0, loaded: false, lastTick: Date.now() });
});

test('renders track info and timestamps when a track is loaded', () => {
  usePlayerStore.setState({ track: mockTrack, progressMs: 60_000, loaded: true });
  const { lastFrame, unmount } = render(<PlayerScreen />);
  const frame = lastFrame() ?? '';
  expect(frame).toContain('Midnight City');
  expect(frame).toContain('M83');
  expect(frame).toContain('1:00'); // elapsed
  expect(frame).toContain('4:00'); // duration
  unmount();
});

test('shows an empty state when nothing is playing', () => {
  usePlayerStore.setState({ track: null, loaded: true });
  const { lastFrame, unmount } = render(<PlayerScreen />);
  expect(lastFrame()).toContain('Nothing playing');
  unmount();
});
