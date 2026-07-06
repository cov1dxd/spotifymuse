/** Detects terminal graphics capabilities. */

/**
 * True if the terminal can render real inline images via the iTerm2 protocol
 * (iTerm2 and WezTerm). Overridable with MUSE_INLINE_IMAGES=1 / =0.
 */
export function supportsInlineImages(): boolean {
  const override = process.env.MUSE_INLINE_IMAGES;
  if (override === '1') return true;
  if (override === '0') return false;

  const program = process.env.TERM_PROGRAM ?? '';
  const lcTerminal = process.env.LC_TERMINAL ?? '';
  return program === 'iTerm.app' || program === 'WezTerm' || lcTerminal === 'iTerm2';
}
