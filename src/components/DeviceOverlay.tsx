import React from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useDeviceStore } from '../state/deviceStore.ts';
import { truncate } from '../utils/format.ts';

/**
 * Device picker. Lists Spotify Connect devices; the active one is marked, and
 * Enter transfers playback to the highlighted device. j/k navigate, Esc closes.
 */

export function DeviceOverlay(): React.JSX.Element {
  const theme = useTheme();
  const status = useDeviceStore((s) => s.status);
  const devices = useDeviceStore((s) => s.devices);
  const selected = useDeviceStore((s) => s.selected);
  const moveSelection = useDeviceStore((s) => s.moveSelection);
  const transferSelected = useDeviceStore((s) => s.transferSelected);
  const closeDevices = useDeviceStore((s) => s.closeDevices);

  useInput((input, key) => {
    if (key.escape) closeDevices();
    else if (input === 'j' || key.downArrow) moveSelection(1);
    else if (input === 'k' || key.upArrow) moveSelection(-1);
    else if (key.return) void transferSelected();
  });

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle={theme.border}
      borderColor={theme.colors.primary}
      paddingX={1}
    >
      <Text color={theme.colors.primary} bold>
        DEVICES{' '}
        <Text color={theme.colors.muted}>· switch speaker</Text>
      </Text>

      <Box flexDirection="column" marginTop={1} flexGrow={1}>
        {status === 'loading' ? (
          <Text color={theme.colors.muted}>
            <Spinner type="dots" /> finding devices…
          </Text>
        ) : status === 'empty' ? (
          <Text color={theme.colors.muted}>
            No devices found — open Spotify on a phone, desktop, or speaker.
          </Text>
        ) : (
          devices.map((device, i) => {
            const isSel = i === selected;
            return (
              <Text
                key={device.id}
                color={isSel ? theme.colors.accent : theme.colors.foreground}
                bold={isSel}
                wrap="truncate-end"
              >
                {isSel ? '❯ ' : '  '}
                {device.isActive ? '● ' : '○ '}
                {truncate(device.name, 30)}
                <Text color={theme.colors.muted}> · {device.type.toLowerCase()}</Text>
              </Text>
            );
          })
        )}
      </Box>

      <Text color={theme.colors.muted}>j/k move · enter switch · esc close</Text>
    </Box>
  );
}
