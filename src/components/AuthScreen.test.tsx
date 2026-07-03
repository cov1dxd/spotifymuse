import { test, expect, afterEach } from 'bun:test';
import { render } from 'ink-testing-library';
import { AuthScreen } from './AuthScreen.tsx';
import { useAuthStore } from '../state/authStore.ts';

afterEach(() => {
  useAuthStore.setState({ status: 'loading', clientId: null, tokens: null, error: null });
});

test('needs-client-id shows the Client ID prompt', () => {
  useAuthStore.setState({ status: 'needs-client-id' });
  const { lastFrame, unmount } = render(<AuthScreen />);
  expect(lastFrame()).toContain('Client ID');
  unmount();
});

test('authorizing shows the waiting message', () => {
  useAuthStore.setState({ status: 'authorizing' });
  const { lastFrame, unmount } = render(<AuthScreen />);
  expect(lastFrame()).toContain('Waiting for Spotify authorization');
  unmount();
});

test('error surfaces the error message and retry hint', () => {
  useAuthStore.setState({ status: 'error', error: 'boom' });
  const { lastFrame, unmount } = render(<AuthScreen />);
  const frame = lastFrame() ?? '';
  expect(frame).toContain('boom');
  expect(frame).toContain('retry');
  unmount();
});

test('authenticated shows a connected notice', () => {
  useAuthStore.setState({ status: 'authenticated' });
  const { lastFrame, unmount } = render(<AuthScreen />);
  expect(lastFrame()).toContain('Connected to Spotify');
  unmount();
});
