import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { useAlbumArt } from '../hooks/useAlbumArt.ts';
import { useAlbumImage } from '../hooks/useAlbumImage.ts';
import { supportsInlineImages } from '../utils/terminalCaps.ts';
import { buildItermImage } from '../utils/itermImage.ts';

/**
 * Album art. On terminals with inline-image support (iTerm2 / WezTerm) it
 * renders the exact cover; otherwise truecolor half-blocks; and a spinning
 * vinyl disc while either loads or when there's no image.
 */

const SPIN = ['◐', '◓', '◑', '◒'] as const;
const INLINE = supportsInlineImages();

interface AlbumArtProps {
  artUrl: string | null;
  playing: boolean;
  width: number;
  rows: number;
}

export function AlbumArt({ artUrl, playing, width, rows }: AlbumArtProps): React.JSX.Element {
  const theme = useTheme();
  const base64 = useAlbumImage(artUrl, INLINE);
  const lines = useAlbumArt(INLINE ? null : artUrl, width); // skip ANSI work on image terminals

  // Real inline image (exact cover) — iTerm2 / WezTerm.
  if (INLINE && base64) {
    return (
      <Box width={width} height={rows}>
        <Text>{buildItermImage(base64, width, rows)}</Text>
      </Box>
    );
  }

  // Truecolor half-block fallback.
  if (!INLINE && lines && lines.length > 0) {
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
