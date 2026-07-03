import { test, expect } from 'bun:test';
import { nextRepeat } from './playbackService.ts';

test('repeat cycles off → context → track → off', () => {
  expect(nextRepeat('off')).toBe('context');
  expect(nextRepeat('context')).toBe('track');
  expect(nextRepeat('track')).toBe('off');
});
