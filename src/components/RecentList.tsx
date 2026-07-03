import React, { useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { useDimensions } from '../hooks/useDimensions.ts';
import { usePlayerStore } from '../state/playerStore.ts';
import { truncate, formatTime } from '../utils/format.ts';

/**
 * Shown when nothing is playing: a pick-list of recently played tracks so you
 * can start music without opening Spotify. Owns j/k/Enter while visible.
 */

export function RecentList(): React.JSX.Element {
  const theme = useTheme();
  const { rows } = useDimensions();

  const recent = usePlayerStore((s) => s.recent);
  const selected = usePlayerStore((s) => s.recentSelected);
  const loadRecent = usePlayerStore((s) => s.loadRecent);
  const moveRecent = usePlayerStore((s) => s.moveRecent);
  const playRecent = usePlayerStore((s) => s.playRecent);

  useEffect(() => {
    if (recent.length === 0) void loadRecent();
  }, [recent.length, loadRecent]);

  useInput((input, key) => {
    if (input === 'j' || key.downArrow) moveRecent(1);
    else if (input === 'k' || key.upArrow) moveRecent(-1);
    else if (key.return) void playRecent();
  });

  if (recent.length === 0) {
    return (
      <Box flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
        <Text color={theme.colors.secondary}>Nothing playing</Text>
        <Text color={theme.colors.muted}>no recent tracks — play something on Spotify once</Text>
      </Box>
    );
  }

  const visible = Math.max(3, rows - 10);
  const start = Math.min(
    Math.max(0, selected - Math.floor(visible / 2)),
    Math.max(0, recent.length - visible),
  );
  const window = recent.slice(start, start + visible);

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={3} paddingTop={1}>
      <Text color={theme.colors.primary} bold>
        RECENTLY PLAYED{' '}
        <Text color={theme.colors.muted}>· press enter to play</Text>
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {window.map((track, i) => {
          const index = start + i;
          const isSel = index === selected;
          return (
            <Text
              key={track.id}
              color={isSel ? theme.colors.accent : theme.colors.foreground}
              bold={isSel}
              wrap="truncate-end"
            >
              {isSel ? '❯ ' : '  '}
              {truncate(track.title, 40)}
              <Text color={isSel ? theme.colors.accent : theme.colors.secondary}>
                {' · '}
                {truncate(track.artist, 24)}
              </Text>
              <Text color={theme.colors.muted}> {formatTime(track.durationMs)}</Text>
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}
