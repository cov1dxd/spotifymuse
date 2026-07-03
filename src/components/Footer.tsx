import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';

/**
 * Bottom bar: keyboard hint legend. Hints are passed in so different screens
 * can advertise their own bindings.
 */

export interface KeyHint {
  key: string;
  label: string;
}

interface FooterProps {
  hints: KeyHint[];
}

export function Footer({ hints }: FooterProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Box borderStyle={theme.border} borderColor={theme.colors.muted} paddingX={1}>
      {hints.map((hint, i) => (
        <Box key={hint.key} marginRight={i < hints.length - 1 ? 2 : 0}>
          <Text color={theme.colors.accent} bold>
            {hint.key}
          </Text>
          <Text color={theme.colors.muted}> {hint.label}</Text>
        </Box>
      ))}
    </Box>
  );
}
