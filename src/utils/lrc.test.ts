import { test, expect } from 'bun:test';
import { parseLrc, plainToLines, currentLineIndex } from './lrc.ts';

const SAMPLE = `[ar:Artist]
[00:01.00]First line
[00:04.50]Second line
[00:09.20]Third line`;

test('parseLrc extracts timestamped lines and skips metadata tags', () => {
  const lines = parseLrc(SAMPLE);
  expect(lines.length).toBe(3);
  expect(lines[0]).toEqual({ timeMs: 1000, text: 'First line' });
  expect(lines[1]).toEqual({ timeMs: 4500, text: 'Second line' });
  expect(lines[2]?.timeMs).toBe(9200);
});

test('currentLineIndex tracks playback position', () => {
  const lines = parseLrc(SAMPLE);
  expect(currentLineIndex(lines, 0)).toBe(-1); // before first line
  expect(currentLineIndex(lines, 2000)).toBe(0);
  expect(currentLineIndex(lines, 5000)).toBe(1);
  expect(currentLineIndex(lines, 999_999)).toBe(2);
});

test('plainToLines yields timeless lines', () => {
  const lines = plainToLines('a\nb\nc');
  expect(lines).toHaveLength(3);
  expect(lines.every((l) => l.timeMs === null)).toBe(true);
  expect(lines[1]?.text).toBe('b');
});
