import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useLyricsStore } from '../state/lyricsStore.ts';
import { usePlayerStore } from '../state/playerStore.ts';
import { currentLineIndex } from '../utils/lrc.ts';
import { truncate } from '../utils/format.ts';

/**
 * Lyrics panel. Synced lyrics scroll with playback and highlight the active
 * line; plain lyrics scroll proportionally. Reflects the lyrics store only.
 */

interface LyricsPanelProps {
  maxLines: number;
  width: number;
}

export function LyricsPanel({ maxLines, width }: LyricsPanelProps): React.JSX.Element {
  const theme = useTheme();
  const status = useLyricsStore((s) => s.status);
  const lines = useLyricsStore((s) => s.lines);
  const synced = useLyricsStore((s) => s.synced);
  const progressMs = usePlayerStore((s) => s.progressMs);
  const durationMs = usePlayerStore((s) => s.track?.durationMs ?? 0);

  const rows = Math.max(1, maxLines);
  const textWidth = Math.max(6, width - 2);

  const frame = (children: React.ReactNode): React.JSX.Element => (
    <Box
      flexDirection="column"
      flexGrow={1}
      borderStyle={theme.border}
      borderColor={theme.colors.muted}
      paddingX={1}
      overflow="hidden"
    >
      <Text color={theme.colors.primary} bold>
        LYRICS {synced ? <Text color={theme.colors.muted}>· synced</Text> : null}
      </Text>
      {children}
    </Box>
  );

  if (status === 'loading') {
    return frame(
      <Text color={theme.colors.muted}>
        <Spinner type="dots" /> finding lyrics…
      </Text>,
    );
  }
  if (status === 'notfound' || lines.length === 0) {
    return frame(<Text color={theme.colors.muted}>No lyrics found.</Text>);
  }

  const current = synced ? currentLineIndex(lines, progressMs) : -1;

  // Choose the scroll window.
  let start: number;
  if (synced) {
    start = Math.max(0, current - Math.floor(rows / 2));
  } else {
    const ratio = durationMs > 0 ? progressMs / durationMs : 0;
    start = Math.floor(ratio * Math.max(0, lines.length - rows));
  }
  start = Math.min(start, Math.max(0, lines.length - rows));
  const window = lines.slice(start, start + rows);

  return frame(
    <>
      {window.map((line, i) => {
        const globalIndex = start + i;
        const isCurrent = synced && globalIndex === current;
        const text = line.text.length > 0 ? truncate(line.text, textWidth) : '♪';
        return (
          <Text
            key={globalIndex}
            color={isCurrent ? theme.colors.accent : theme.colors.secondary}
            bold={isCurrent}
            dimColor={!isCurrent && synced}
            wrap="truncate-end"
          >
            {text}
          </Text>
        );
      })}
    </>,
  );
}
