import { test, expect } from 'bun:test';
import { encrypt, decrypt } from './crypto.ts';

test('encrypt/decrypt round-trips arbitrary strings', () => {
  const secret = JSON.stringify({ accessToken: 'tok_123', refreshToken: 'ref_456' });
  expect(decrypt(encrypt(secret))).toBe(secret);
});

test('ciphertext is not the plaintext and differs each call (random IV)', () => {
  const a = encrypt('same-input');
  const b = encrypt('same-input');
  expect(a).not.toContain('same-input');
  expect(a).not.toBe(b);
});

test('tampered payloads are rejected', () => {
  const payload = encrypt('sensitive');
  const [iv, tag] = payload.split(':');
  const tampered = `${iv}:${tag}:${Buffer.from('evil').toString('base64')}`;
  expect(() => decrypt(tampered)).toThrow();
  expect(() => decrypt('garbage')).toThrow();
});
