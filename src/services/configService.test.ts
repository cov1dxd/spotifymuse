import { test, expect } from 'bun:test';
import { configSchema, DEFAULT_CONFIG, isValidClientId } from './configService.ts';

test('defaults are applied for an empty object', () => {
  expect(DEFAULT_CONFIG.clientId).toBeNull();
  expect(DEFAULT_CONFIG.lyrics).toBe(true);
  expect(DEFAULT_CONFIG.animations).toBe(true);
  expect(DEFAULT_CONFIG.visualizer).toBe(true);
  expect(DEFAULT_CONFIG.albumArt).toBe(true);
});

test('valid overrides are preserved', () => {
  const parsed = configSchema.parse({ clientId: 'abc', theme: 'nord', lyrics: false });
  expect(parsed.clientId).toBe('abc');
  expect(parsed.theme).toBe('nord');
  expect(parsed.lyrics).toBe(false);
});

test('invalid types are rejected', () => {
  expect(configSchema.safeParse({ lyrics: 'yes' }).success).toBe(false);
  expect(configSchema.safeParse({ clientId: 123 }).success).toBe(false);
});

test('isValidClientId accepts only 32-hex IDs', () => {
  expect(isValidClientId('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6')).toBe(true);
  expect(isValidClientId('q')).toBe(false); // the bug we hit
  expect(isValidClientId('')).toBe(false);
  expect(isValidClientId(null)).toBe(false);
  expect(isValidClientId('12d5c8c07126442ca12c930468a862c')).toBe(false); // 31 chars
  expect(isValidClientId('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')).toBe(false); // non-hex
});
