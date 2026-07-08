import React from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useDimensions } from '../hooks/useDimensions.ts';
import { useSearchStore } from '../state/searchStore.ts';
import { truncate, formatTime } from '../utils/format.ts';

/**
 * Full-page search. Typing mode edits the query (Enter searches); browsing mode
 * navigates results with j/k, Enter plays, i/​/ edits again, Esc closes.
 */

export function SearchOverlay(): React.JSX.Element {
  const theme = useTheme();
  const { rows } = useDimensions();

  const mode = useSearchStore((s) => s.mode);
  const recommend = useSearchStore((s) => s.recommend);
  const query = useSearchStore((s) => s.query);
  const results = useSearchStore((s) => s.results);
  const status = useSearchStore((s) => s.status);
  const selected = useSearchStore((s) => s.selected);
  const notice = useSearchStore((s) => s.notice);
  const setQuery = useSearchStore((s) => s.setQuery);
  const setMode = useSearchStore((s) => s.setMode);
  const runSearch = useSearchStore((s) => s.runSearch);
  const moveSelection = useSearchStore((s) => s.moveSelection);
  const playSelected = useSearchStore((s) => s.playSelected);
  const closeSearch = useSearchStore((s) => s.closeSearch);

  useInput((input, key) => {
    if (key.escape) {
      closeSearch();
      return;
    }
    if (mode === 'typing') {
      // Jump into results without re-searching.
      if (key.downArrow && results.length) setMode('browsing');
      return; // TextInput owns the rest
    }
    // browsing
    if (input === 'j' || key.downArrow) moveSelection(1);
    else if (input === 'k' || key.upArrow) moveSelection(-1);
    else if (key.return) void playSelected();
    else if (input === 'i' || input === '/') setMode('typing');
  });

  const visibleRows = Math.max(3, rows - 10);
  const start = Math.min(
    Math.max(0, selected - Math.floor(visibleRows / 2)),
    Math.max(0, results.length - visibleRows),
  );
  const window = results.slice(start, start + visibleRows);

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle={theme.border}
      borderColor={theme.colors.primary}
      paddingX={1}
    >
      <Text color={theme.colors.primary} bold>
        {recommend ? 'RECOMMENDED' : 'SEARCH'}{' '}
        <Text color={theme.colors.muted}>· {recommend ? 'your top tracks' : 'tracks'}</Text>
      </Text>

      {/* Query line — hidden in recommend mode (there's no query) */}
      <Box marginTop={1} display={recommend && mode === 'browsing' ? 'none' : 'flex'}>
        <Text color={theme.colors.accent}>❯ </Text>
        {mode === 'typing' ? (
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={() => void runSearch()}
            placeholder="type a song, artist, album…"
          />
        ) : (
          <Text color={theme.colors.foreground}>{query || ' '}</Text>
        )}
      </Box>

      {/* Results */}
      <Box flexDirection="column" marginTop={1} flexGrow={1}>
        {status === 'searching' ? (
          <Text color={theme.colors.muted}>
            <Spinner type="dots" /> searching…
          </Text>
        ) : status === 'empty' ? (
          <Text color={theme.colors.muted}>
            {recommend ? 'No top tracks yet — listen a while, then check back.' : `No results for “${query}”.`}
          </Text>
        ) : results.length === 0 ? (
          <Text color={theme.colors.muted}>Type a query and press enter.</Text>
        ) : (
          window.map((track, i) => {
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
                {truncate(track.title, 34)}
                <Text color={isSel ? theme.colors.accent : theme.colors.secondary}>
                  {' · '}
                  {truncate(track.artist, 22)}
                </Text>
                <Text color={theme.colors.muted}> {formatTime(track.durationMs)}</Text>
              </Text>
            );
          })
        )}
      </Box>

      {notice ? <Text color={theme.colors.warning}>⚠ {notice}</Text> : null}

      {/* Hints */}
      <Text color={theme.colors.muted}>
        {mode === 'typing'
          ? 'enter search · ↓ results · esc close'
          : recommend
            ? 'j/k move · enter play · / search · esc close'
            : 'j/k move · enter play · i edit · esc close'}
      </Text>
    </Box>
  );
}
