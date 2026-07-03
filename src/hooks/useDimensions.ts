import { useEffect, useState } from 'react';
import { useStdout } from 'ink';

export interface Dimensions {
  columns: number;
  rows: number;
}

/**
 * Tracks terminal size and updates on resize. Drives the responsive layout —
 * no component should assume a fixed width or height.
 */
export function useDimensions(): Dimensions {
  const { stdout } = useStdout();

  const [dimensions, setDimensions] = useState<Dimensions>({
    columns: stdout.columns ?? 80,
    rows: stdout.rows ?? 24,
  });

  useEffect(() => {
    const onResize = (): void => {
      setDimensions({
        columns: stdout.columns ?? 80,
        rows: stdout.rows ?? 24,
      });
    };

    stdout.on('resize', onResize);
    return () => {
      stdout.off('resize', onResize);
    };
  }, [stdout]);

  return dimensions;
}
