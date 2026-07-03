import { test, expect } from 'bun:test';
import { normalizeDevices, devicesResponseSchema } from './deviceTypes.ts';

test('normalizes devices and drops ones without an id', () => {
  const parsed = devicesResponseSchema.parse({
    devices: [
      { id: 'd1', name: 'MacBook', type: 'Computer', is_active: true, volume_percent: 70 },
      { id: null, name: 'Ghost', type: 'Unknown', is_active: false, volume_percent: null },
      { id: 'd2', name: 'Kitchen', type: 'Speaker', is_active: false, volume_percent: null },
    ],
  });
  const devices = normalizeDevices(parsed);
  expect(devices).toHaveLength(2);
  expect(devices[0]).toEqual({
    id: 'd1',
    name: 'MacBook',
    type: 'Computer',
    isActive: true,
    volumePercent: 70,
  });
  expect(devices[1]?.volumePercent).toBe(100); // null volume defaults to 100
});

test('missing devices key normalizes to []', () => {
  expect(normalizeDevices(devicesResponseSchema.parse({}))).toEqual([]);
});
