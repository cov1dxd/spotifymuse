import React from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useDimensions } from '../hooks/useDimensions.ts';
import { useLibraryStore } from '../state/libraryStore.ts';
import { truncate } from '../utils/format.ts';

/**
 * Library page: the user's playlists. Enter plays the highlighted playlist,
 * j/k navigate, Esc closes. Reflects the library store only.
 */

export function LibraryOverlay(): React.JSX.Element {
  const theme = useTheme();
  const { rows } = useDimensions();

  const status = useLibraryStore((s) => s.status);
  const playlists = useLibraryStore((s) => s.playlists);
  const selected = useLibraryStore((s) => s.selected);
  const notice = useLibraryStore((s) => s.notice);
  const moveSelection = useLibraryStore((s) => s.moveSelection);
  const playSelected = useLibraryStore((s) => s.playSelected);
  const closeLibrary = useLibraryStore((s) => s.closeLibrary);

  useInput((input, key) => {
    if (key.escape) closeLibrary();
    else if (input === 'j' || key.downArrow) moveSelection(1);
    else if (input === 'k' || key.upArrow) moveSelection(-1);
    else if (key.return) void playSelected();
  });

  const visible = Math.max(3, rows - 8);
  const start = Math.min(
    Math.max(0, selected - Math.floor(visible / 2)),
    Math.max(0, playlists.length - visible),
  );
  const window = playlists.slice(start, start + visible);

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle={theme.border}
      borderColor={theme.colors.primary}
      paddingX={1}
    >
      <Text color={theme.colors.primary} bold>
        LIBRARY{' '}
        <Text color={theme.colors.muted}>· your playlists</Text>
      </Text>

      <Box flexDirection="column" marginTop={1} flexGrow={1}>
        {status === 'loading' ? (
          <Text color={theme.colors.muted}>
            <Spinner type="dots" /> loading playlists…
          </Text>
        ) : status === 'empty' ? (
          <Text color={theme.colors.muted}>No playlists found.</Text>
        ) : (
          window.map((playlist, i) => {
            const index = start + i;
            const isSel = index === selected;
            return (
              <Text
                key={playlist.id}
                color={isSel ? theme.colors.accent : theme.colors.foreground}
                bold={isSel}
                wrap="truncate-end"
              >
                {isSel ? '❯ ' : '  '}
                {truncate(playlist.name, 44)}
                {playlist.trackCount > 0 ? (
                  <Text color={theme.colors.muted}> · {playlist.trackCount} tracks</Text>
                ) : null}
              </Text>
            );
          })
        )}
      </Box>

      {notice ? <Text color={theme.colors.warning}>⚠ {notice}</Text> : null}
      <Text color={theme.colors.muted}>j/k move · enter play · esc close</Text>
    </Box>
  );
}
