import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useTheme } from '../hooks/useTheme.ts';
import { useAuthStore } from '../state/authStore.ts';
import { isValidClientId } from '../services/configService.ts';

/**
 * First-run prompt for the Spotify Client ID. On submit it persists the ID and
 * immediately kicks off the OAuth flow.
 */

export function ClientIdInput(): React.JSX.Element {
  const theme = useTheme();
  const setClientId = useAuthStore((s) => s.setClientId);
  const connect = useAuthStore((s) => s.connect);
  const [value, setValue] = useState('');

  const handleSubmit = async (submitted: string): Promise<void> => {
    const id = submitted.trim();
    if (!isValidClientId(id)) return; // ignore junk (must be 32 hex chars)
    await setClientId(id);
    await connect();
  };

  return (
    <Box flexDirection="column" alignItems="center">
      <Text color={theme.colors.secondary}>Paste your Spotify Client ID</Text>
      <Text color={theme.colors.muted}>
        (create an app at developer.spotify.com — no secret needed)
      </Text>

      <Box
        marginTop={1}
        borderStyle={theme.border}
        borderColor={theme.colors.primary}
        paddingX={1}
        minWidth={44}
      >
        <Text color={theme.colors.accent}>❯ </Text>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
      </Box>

      <Box marginTop={1}>
        <Text color={theme.colors.muted}>
          also add redirect URI{' '}
        </Text>
        <Text color={theme.colors.secondary}>http://127.0.0.1:8888/callback</Text>
      </Box>
    </Box>
  );
}
