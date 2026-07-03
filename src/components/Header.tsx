import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { APP_NAME, APP_VERSION } from '../config/constants.ts';

/**
 * Top bar: app wordmark + version on the left, a status slot on the right.
 * Purely presentational — content is passed in, never fetched here.
 */

interface HeaderProps {
  status?: string;
}

export function Header({ status }: HeaderProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Box
      borderStyle={theme.border}
      borderColor={theme.colors.muted}
      paddingX={1}
      justifyContent="space-between"
    >
      <Box>
        <Text color={theme.colors.primary} bold>
          {'▸ '}
          {APP_NAME}
        </Text>
        <Text color={theme.colors.muted}> v{APP_VERSION}</Text>
      </Box>

      <Text color={theme.colors.secondary}>{status ?? 'not connected'}</Text>
    </Box>
  );
}
