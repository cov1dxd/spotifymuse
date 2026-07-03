import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { useAlbumArt } from '../hooks/useAlbumArt.ts';

/**
 * Album art. Renders the real cover as truecolor half-blocks when available,
 * falling back to a spinning vinyl disc while it loads or if there's no image.
 */

const SPIN = ['◐', '◓', '◑', '◒'] as const;

interface AlbumArtProps {
  artUrl: string | null;
  playing: boolean;
  width: number;
}

export function AlbumArt({ artUrl, playing, width }: AlbumArtProps): React.JSX.Element {
  const theme = useTheme();
  const lines = useAlbumArt(artUrl, width);

  if (lines && lines.length > 0) {
    return (
      <Box flexDirection="column" borderStyle={theme.border} borderColor={theme.colors.muted}>
        {lines.map((line, i) => (
          <Text key={i}>{line}</Text>
        ))}
      </Box>
    );
  }

  return <VinylDisc playing={playing} />;
}

function VinylDisc({ playing }: { playing: boolean }): React.JSX.Element {
  const theme = useTheme();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % SPIN.length), 180);
    return () => clearInterval(id);
  }, [playing]);

  const center = playing ? SPIN[frame] : '○';

  // Flat single-color lines (no nested <Text>) — nested Text confuses Ink's
  // sibling layout and can overlap adjacent columns.
  const lines = [
    '   ╭───────╮',
    '  ╱ ▒▒▒▒▒ ╲',
    ' │ ▒ ╭─╮ ▒ │',
    ` │ ▒ │${center}│ ▒ │`,
    ' │ ▒ ╰─╯ ▒ │',
    '  ╲ ▒▒▒▒▒ ╱',
    '   ╰───────╯',
  ];

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i} color={theme.colors.primary}>
          {line}
        </Text>
      ))}
    </Box>
  );
}
