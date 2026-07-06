/**
 * Builds an iTerm2 inline-image escape sequence (also understood by WezTerm).
 * The image is drawn at the cursor, sized to `cols` × `rows` terminal cells.
 * See https://iterm2.com/documentation-images.html
 */

const ESC = '\x1b';
const BEL = '\x07';

export function buildItermImage(base64: string, cols: number, rows: number): string {
  const args = [
    'inline=1',
    `width=${cols}`,
    `height=${rows}`,
    'preserveAspectRatio=1',
  ].join(';');
  // ESC ] 1337 ; File = <args> : <base64> BEL
  return `${ESC}]1337;File=${args}:${base64}${BEL}`;
}
