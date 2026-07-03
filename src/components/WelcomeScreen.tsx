import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import { useTheme } from '../hooks/useTheme.ts';
import { APP_TAGLINE } from '../config/constants.ts';

/**
 * Landing body shown before a Spotify session is connected. Placeholder for the
 * foundation slice — the auth flow will replace this in a later feature.
 */

export function WelcomeScreen(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Box flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
      <BigText text="MUSE" font="tiny" colors={[theme.colors.primary, theme.colors.accent]} />

      <Text color={theme.colors.secondary}>{APP_TAGLINE}</Text>

      <Box marginTop={1}>
        <Text color={theme.colors.muted}>press </Text>
        <Text color={theme.colors.accent} bold>
          enter
        </Text>
        <Text color={theme.colors.muted}> to connect Spotify · </Text>
        <Text color={theme.colors.accent} bold>
          q
        </Text>
        <Text color={theme.colors.muted}> to quit</Text>
      </Box>
    </Box>
  );
}
