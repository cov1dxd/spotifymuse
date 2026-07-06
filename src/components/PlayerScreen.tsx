import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useDimensions } from '../hooks/useDimensions.ts';
import { usePlayback } from '../hooks/usePlayback.ts';
import { useLyrics } from '../hooks/useLyrics.ts';
import { usePlayerStore } from '../state/playerStore.ts';
import { AlbumArt } from './AlbumArt.tsx';
import { TrackInfo } from './TrackInfo.tsx';
import { Visualizer } from './Visualizer.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { PlayerControls } from './PlayerControls.tsx';
import { QueuePanel } from './QueuePanel.tsx';
import { LyricsPanel } from './LyricsPanel.tsx';
import { RecentList } from './RecentList.tsx';

/**
 * Now-playing screen: an upper "now playing" zone (art + metadata + progress)
 * and a lower zone split into Queue and Lyrics. Everything sizes to the
 * terminal — album art and panel heights scale with available rows.
 */

const H_PADDING = 3;

/** Desired album-art width (px/cols) by vertical space — bigger reads clearer. */
function desiredArtWidth(bodyRows: number, compact: boolean): number {
  if (compact) return 16;
  if (bodyRows >= 40) return 36;
  if (bodyRows >= 32) return 30;
  return 24;
}

function Centered({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Box flexGrow={1} alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
}

export function PlayerScreen(): React.JSX.Element {
  const theme = useTheme();
  const { columns, rows } = useDimensions();
  usePlayback();

  const track = usePlayerStore((s) => s.track);
  const queue = usePlayerStore((s) => s.queue);
  const progressMs = usePlayerStore((s) => s.progressMs);
  const loaded = usePlayerStore((s) => s.loaded);

  useLyrics(track);

  if (!loaded) {
    return (
      <Centered>
        <Text color={theme.colors.primary}>
          <Spinner type="dots" /> Loading playback…
        </Text>
      </Centered>
    );
  }

  if (!track) {
    return <RecentList />;
  }

  const inner = Math.max(24, columns - H_PADDING * 2 - 2);

  // Vertical budget: body = rows - header(3) - footer(3). The info column needs
  // ~12 rows (title/artist/album/device/visualizer/progress/controls); when
  // space is tight we drop the device + visualizer to fit (compact = 8 rows).
  // upperHeight is always info + 1 so the zone never exactly equals its content
  // (an exact fit makes Ink overlap the first line).
  const bodyRows = Math.max(8, rows - 6);
  const compact = bodyRows < 24;
  const infoRows = compact ? 8 : 12;

  // Art size: driven by height, capped by width so it never crowds the metadata.
  const maxArtByCols = Math.max(12, inner - 30);
  let artWidth = Math.min(desiredArtWidth(bodyRows, compact), maxArtByCols);
  if (artWidth % 2 === 1) artWidth -= 1;
  const artRows = artWidth / 2;

  // upperHeight fits the taller of art/info, +1 slack (exact fit overlaps).
  const upperHeight = Math.max(infoRows, artRows) + 1;
  const lowerHeight = Math.max(4, bodyRows - 3 - upperHeight);
  const panelLines = Math.max(1, lowerHeight - 3); // minus border + header

  const artCol = artWidth + 2;
  const infoWidth = Math.max(12, inner - artCol - 2);
  const queueWidth = Math.min(46, Math.floor(inner * 0.44));
  const lyricsWidth = Math.max(16, inner - queueWidth - 1);

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={H_PADDING} paddingTop={1}>
      {/* Upper: now playing */}
      <Box height={upperHeight}>
        <Box width={artCol} flexDirection="column">
          <AlbumArt artUrl={track.artUrl} playing={track.isPlaying} width={artWidth} rows={artRows} />
        </Box>

        <Box flexDirection="column" width={infoWidth} marginLeft={2}>
          <TrackInfo track={track} width={infoWidth} showDevice={!compact} />
          {compact ? null : (
            <Box marginTop={1}>
              <Visualizer playing={track.isPlaying} width={Math.min(infoWidth, 28)} />
            </Box>
          )}
          <Box marginTop={1} flexDirection="column">
            <ProgressBar progressMs={progressMs} durationMs={track.durationMs} width={infoWidth} />
            <Box marginTop={1} width={infoWidth}>
              <PlayerControls track={track} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Lower: queue + lyrics */}
      <Box height={lowerHeight} marginTop={1}>
        <Box width={queueWidth} height={lowerHeight}>
          <QueuePanel queue={queue} maxLines={panelLines} />
        </Box>
        <Box flexGrow={1} height={lowerHeight} marginLeft={1}>
          <LyricsPanel maxLines={panelLines} width={lyricsWidth} />
        </Box>
      </Box>
    </Box>
  );
}
