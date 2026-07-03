import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';

/**
 * Faux frequency visualizer (phase 1). Self-animates while playing; freezes to
 * a flat low line when paused. Spotify exposes no live spectrum, so bar heights
 * are a smooth rhythmic pseudo-animation.
 */

const BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const;

interface VisualizerProps {
  playing: boolean;
  width: number;
}

export function Visualizer({ playing, width }: VisualizerProps): React.JSX.Element {
  const theme = useTheme();
  const [frame, setFrame] = useState(0);
  const bars = Math.max(4, width);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFrame((f) => f + 1), 120);
    return () => clearInterval(id);
  }, [playing]);

  const line = Array.from({ length: bars }, (_, i) => {
    if (!playing) return BLOCKS[0];
    const wave =
      Math.sin(frame * 0.35 + i * 0.7) * 0.5 +
      Math.sin(frame * 0.15 + i * 1.3) * 0.3 +
      0.6;
    const idx = Math.max(0, Math.min(BLOCKS.length - 1, Math.round(wave * (BLOCKS.length - 1))));
    return BLOCKS[idx];
  }).join('');

  return <Text color={playing ? theme.colors.accent : theme.colors.muted}>{line}</Text>;
}
