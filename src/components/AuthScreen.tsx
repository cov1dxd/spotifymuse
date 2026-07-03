import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useTheme } from '../hooks/useTheme.ts';
import { useAuthStore } from '../state/authStore.ts';
import { WelcomeScreen } from './WelcomeScreen.tsx';
import { ClientIdInput } from './ClientIdInput.tsx';
import { Notification } from './Notification.tsx';

/**
 * Pre-session screen. Switches presentation on auth status; all logic lives in
 * the auth store, this component only reflects it.
 */

function Centered({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Box flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
}

export function AuthScreen(): React.JSX.Element {
  const theme = useTheme();
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);

  switch (status) {
    case 'loading':
      return (
        <Centered>
          <Text color={theme.colors.primary}>
            <Spinner type="dots" /> Loading…
          </Text>
        </Centered>
      );

    case 'needs-client-id':
      return (
        <Centered>
          <ClientIdInput />
        </Centered>
      );

    case 'authorizing':
      return (
        <Centered>
          <Text color={theme.colors.primary}>
            <Spinner type="dots" /> Waiting for Spotify authorization…
          </Text>
          <Box marginTop={1}>
            <Text color={theme.colors.muted}>a browser window should have opened</Text>
          </Box>
        </Centered>
      );

    case 'error':
      return (
        <Centered>
          <Notification level="error" message={error ?? 'Something went wrong'} />
          <Box marginTop={1}>
            <Text color={theme.colors.muted}>press </Text>
            <Text color={theme.colors.accent} bold>
              enter
            </Text>
            <Text color={theme.colors.muted}> to retry</Text>
          </Box>
        </Centered>
      );

    case 'authenticated':
      return (
        <Centered>
          <Notification level="success" message="Connected to Spotify" />
          <Box marginTop={1}>
            <Text color={theme.colors.muted}>player UI coming in the next feature…</Text>
          </Box>
        </Centered>
      );

    case 'disconnected':
    default:
      return <WelcomeScreen />;
  }
}
