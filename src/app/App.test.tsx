import { test, expect } from 'bun:test';
import { render } from 'ink-testing-library';
import { App } from './App.tsx';

test('App renders the MUSE shell without crashing', () => {
  const { lastFrame, unmount } = render(<App />);
  const frame = lastFrame() ?? '';

  // Header wordmark + version are present
  expect(frame).toContain('MUSE');
  expect(frame).toContain('v0.1.0');

  // Footer hints render
  expect(frame).toContain('quit');

  unmount();
});
