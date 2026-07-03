import { test, expect } from 'bun:test';
import sharp from 'sharp';
import { imageToAnsi } from './imageToAnsi.ts';

const stripAnsi = (s: string): string => s.replace(/\[[0-9;]*m/g, '');

async function solid(r: number, g: number, b: number, size = 16): Promise<Buffer> {
  return sharp({ create: { width: size, height: size, channels: 3, background: { r, g, b } } })
    .png()
    .toBuffer();
}

test('produces W columns × W/2 rows of half-blocks', async () => {
  const lines = await imageToAnsi(await solid(255, 0, 0), 12);
  expect(lines.length).toBe(6); // 12 / 2
  for (const line of lines) {
    expect(stripAnsi(line)).toBe('▀'.repeat(12));
  }
});

test('encodes color as truecolor ANSI (fg + bg)', async () => {
  const [line] = await imageToAnsi(await solid(255, 0, 0), 4);
  expect(line).toContain('['); // contains ANSI escape
  expect(line).toContain('38;2;255;0;0'); // truecolor red foreground
});
