/** LRC lyric parsing helpers. */

export interface LyricLine {
  /** Timestamp in ms, or null for unsynced (plain) lyrics. */
  timeMs: number | null;
  text: string;
}

const TAG = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

/** Parse synced LRC text into time-stamped lines, sorted ascending. */
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];

  for (const raw of lrc.split(/\r?\n/)) {
    const text = raw.replace(TAG, '').trim();
    TAG.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = TAG.exec(raw)) !== null) {
      const min = Number.parseInt(match[1] ?? '0', 10);
      const sec = Number.parseInt(match[2] ?? '0', 10);
      const fracRaw = match[3] ?? '0';
      const frac = Number.parseInt(fracRaw.padEnd(3, '0').slice(0, 3), 10);
      lines.push({ timeMs: min * 60_000 + sec * 1000 + frac, text });
    }
  }

  return lines.sort((a, b) => (a.timeMs ?? 0) - (b.timeMs ?? 0));
}

/** Wrap plain (unsynced) lyrics as timeless lines. */
export function plainToLines(plain: string): LyricLine[] {
  return plain.split(/\r?\n/).map((text) => ({ timeMs: null, text: text.trim() }));
}

/** Index of the active line for a synced set at `progressMs`, or -1. */
export function currentLineIndex(lines: LyricLine[], progressMs: number): number {
  let index = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i]?.timeMs;
    if (t === null || t === undefined) continue;
    if (t <= progressMs) index = i;
    else break;
  }
  return index;
}
