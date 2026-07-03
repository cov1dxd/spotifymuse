import { test, expect } from 'bun:test';
import { formatTime, truncate, clamp } from './format.ts';

test('formatTime renders m:ss and h:mm:ss', () => {
  expect(formatTime(0)).toBe('0:00');
  expect(formatTime(42_000)).toBe('0:42');
  expect(formatTime(200_000)).toBe('3:20');
  expect(formatTime(3_661_000)).toBe('1:01:01');
  expect(formatTime(-500)).toBe('0:00');
});

test('truncate adds an ellipsis only when needed', () => {
  expect(truncate('hello', 10)).toBe('hello');
  expect(truncate('hello world', 5)).toBe('hell…');
  expect(truncate('x', 0)).toBe('');
});

test('clamp bounds values', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-1, 0, 10)).toBe(0);
  expect(clamp(11, 0, 10)).toBe(10);
});
