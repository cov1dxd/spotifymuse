import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { formatTime, clamp } from '../utils/format.ts';

/**
 * Smooth playback progress bar with a knob and elapsed / total timestamps.
 * Width is provided by the parent so it tracks the terminal size.
 */

interface ProgressBarProps {
  progressMs: number;
  durationMs: number;
  width: number;
}

export function ProgressBar({ progressMs, durationMs, width }: ProgressBarProps): React.JSX.Element {
  const theme = useTheme();

  const barWidth = Math.max(4, width);
  const ratio = durationMs > 0 ? clamp(progressMs / durationMs, 0, 1) : 0;
  const knobAt = Math.round(ratio * (barWidth - 1));
  const filled = '━'.repeat(knobAt);
  const rest = '─'.repeat(Math.max(0, barWidth - knobAt - 1));

  return (
    <Box flexDirection="column" width={barWidth}>
      <Text>
        <Text color={theme.colors.primary}>{filled}</Text>
        <Text color={theme.colors.accent}>●</Text>
        <Text color={theme.colors.muted}>{rest}</Text>
      </Text>
      <Box justifyContent="space-between" width={barWidth}>
        <Text color={theme.colors.secondary}>{formatTime(progressMs)}</Text>
        <Text color={theme.colors.muted}>{formatTime(durationMs)}</Text>
      </Box>
    </Box>
  );
}
