import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';

/** Inline status message. Color follows the theme's semantic role. */

export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  level: NotificationLevel;
  message: string;
}

const ICONS: Record<NotificationLevel, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✗',
};

export function Notification({ level, message }: NotificationProps): React.JSX.Element {
  const theme = useTheme();
  const color =
    level === 'error'
      ? theme.colors.error
      : level === 'warning'
        ? theme.colors.warning
        : level === 'success'
          ? theme.colors.success
          : theme.colors.secondary;

  return (
    <Box>
      <Text color={color} bold>
        {ICONS[level]}{' '}
      </Text>
      <Text color={color}>{message}</Text>
    </Box>
  );
}
