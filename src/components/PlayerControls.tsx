import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import type { NowPlaying } from '../spotify/playbackTypes.ts';

/**
 * Playback status row: shuffle / play-state / repeat indicators plus volume.
 * Active toggles use the accent color; inactive ones are muted.
 */

interface PlayerControlsProps {
  track: NowPlaying;
}

const REPEAT_LABEL: Record<NowPlaying['repeat'], string> = {
  off: 'repeat',
  context: 'repeat all',
  track: 'repeat one',
};

export function PlayerControls({ track }: PlayerControlsProps): React.JSX.Element {
  const theme = useTheme();
  const on = theme.colors.accent;
  const off = theme.colors.muted;

  const volBars = Math.round((track.volume / 100) * 10);
  const volume = '▮'.repeat(volBars) + '▯'.repeat(10 - volBars);

  return (
    <Box>
      <Text color={track.shuffle ? on : off} bold={track.shuffle}>
        ⤮ shuffle
      </Text>
      <Text color={off}>{'  '}</Text>
      <Text color={track.isPlaying ? on : off} bold>
        {track.isPlaying ? '▶ playing' : '⏸ paused'}
      </Text>
      <Text color={off}>{'  '}</Text>
      <Text color={track.repeat === 'off' ? off : on} bold={track.repeat !== 'off'}>
        ↻ {REPEAT_LABEL[track.repeat]}
      </Text>
      <Text color={off}>{'   vol '}</Text>
      <Text color={theme.colors.primary}>{volume}</Text>
    </Box>
  );
}
