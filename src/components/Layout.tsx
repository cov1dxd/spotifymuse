import React, { type ReactNode } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../hooks/useTheme.ts';
import { useDimensions } from '../hooks/useDimensions.ts';
import { MIN_COLS, MIN_ROWS } from '../config/constants.ts';
import { Header } from './Header.tsx';
import { Footer, type KeyHint } from './Footer.tsx';

/**
 * Full-screen responsive frame: Header on top, Footer at the bottom, and a
 * flexible body in between. Resizes with the terminal — no fixed dimensions.
 */

interface LayoutProps {
  status?: string;
  hints: KeyHint[];
  children: ReactNode;
}

export function Layout({ status, hints, children }: LayoutProps): React.JSX.Element {
  const theme = useTheme();
  const { columns, rows } = useDimensions();

  if (columns < MIN_COLS || rows < MIN_ROWS) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Text color={theme.colors.warning}>
          Terminal too small — need at least {MIN_COLS}×{MIN_ROWS}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Header {...(status !== undefined ? { status } : {})} />
      <Box flexGrow={1} flexDirection="column">
        {children}
      </Box>
      <Footer hints={hints} />
    </Box>
  );
}
