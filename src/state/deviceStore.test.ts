import { test, expect, afterEach } from 'bun:test';
import { useDeviceStore } from './deviceStore.ts';
import type { Device } from '../spotify/deviceTypes.ts';

const mk = (id: string, active = false): Device => ({
  id,
  name: id,
  type: 'Speaker',
  isActive: active,
  volumePercent: 100,
});

afterEach(() => {
  useDeviceStore.setState({ open: false, status: 'idle', devices: [], selected: 0 });
});

test('moveSelection clamps within bounds', () => {
  useDeviceStore.setState({ devices: [mk('a'), mk('b'), mk('c')], selected: 0 });
  const { moveSelection } = useDeviceStore.getState();
  moveSelection(-1);
  expect(useDeviceStore.getState().selected).toBe(0);
  moveSelection(10);
  expect(useDeviceStore.getState().selected).toBe(2);
});

test('closeDevices hides the picker', () => {
  useDeviceStore.setState({ open: true });
  useDeviceStore.getState().closeDevices();
  expect(useDeviceStore.getState().open).toBe(false);
});
