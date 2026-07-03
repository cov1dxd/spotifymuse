import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { truncate, formatTime } from '../utils/format.ts';
import type { QueueItem } from '../spotify/playbackTypes.ts';

/** Bordered "up next" list. Shows as many queued tracks as fit `maxLines`. */

interface QueuePanelProps {
  queue: QueueItem[];
  maxLines: number;
}

export function QueuePanel({ queue, maxLines }: QueuePanelProps): React.JSX.Element {
  const theme = useTheme();
  const rows = Math.max(1, maxLines);
  const visible = queue.slice(0, rows);

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle={theme.border}
      borderColor={theme.colors.muted}
      paddingX={1}
      overflow="hidden"
    >
      <Text color={theme.colors.primary} bold>
        QUEUE{' '}
        <Text color={theme.colors.muted}>· up next</Text>
      </Text>

      {visible.length === 0 ? (
        <Text color={theme.colors.muted}>nothing queued</Text>
      ) : (
        visible.map((item, i) => (
          <Text key={`${item.id ?? item.title}-${i}`} wrap="truncate-end">
            <Text color={theme.colors.muted}>{String(i + 1).padStart(2, ' ')} </Text>
            <Text color={theme.colors.foreground}>{truncate(item.title, 22)}</Text>
            <Text color={theme.colors.secondary}> · {truncate(item.artist, 16)}</Text>
            <Text color={theme.colors.muted}> {formatTime(item.durationMs)}</Text>
          </Text>
        ))
      )}
    </Box>
  );
}
