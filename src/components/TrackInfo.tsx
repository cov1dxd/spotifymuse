import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { truncate } from '../utils/format.ts';
import type { NowPlaying } from '../spotify/playbackTypes.ts';

/** Track title / artist / album / device block. */

interface TrackInfoProps {
  track: NowPlaying;
  width: number;
  showDevice?: boolean;
}

export function TrackInfo({ track, width, showDevice = true }: TrackInfoProps): React.JSX.Element {
  const theme = useTheme();
  const w = Math.max(8, width);

  return (
    <Box flexDirection="column">
      <Text color={theme.colors.foreground} bold wrap="truncate-end">
        {truncate(track.title, w)}
      </Text>
      <Text color={theme.colors.primary} wrap="truncate-end">
        {truncate(track.artist, w)}
      </Text>
      <Text color={theme.colors.secondary} wrap="truncate-end">
        {truncate(track.album, w)}
      </Text>
      {showDevice && track.device ? (
        <Box marginTop={1}>
          <Text color={theme.colors.muted}>◆ {truncate(track.device, w - 2)}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
