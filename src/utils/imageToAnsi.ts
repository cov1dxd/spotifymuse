import sharp from 'sharp';
import { Chalk } from 'chalk';

/**
 * Converts an image buffer into truecolor "half-block" lines. Each character
 * (▀) packs two vertical pixels: foreground = top pixel, background = bottom.
 * A W-wide render uses W columns × W/2 rows to look roughly square in a terminal.
 */

// Force truecolor so art always carries color codes, independent of TTY detection.
const paint = new Chalk({ level: 3 });

export async function imageToAnsi(buffer: Buffer, widthChars: number): Promise<string[]> {
  const w = Math.max(2, Math.floor(widthChars));
  const rows = Math.max(1, Math.round(w / 2));
  const pixelHeight = rows * 2;

  const { data, info } = await sharp(buffer)
    .resize(w, pixelHeight, { fit: 'cover', kernel: 'lanczos3' })
    .modulate({ saturation: 1.12 }) // gently richer colors
    .sharpen({ sigma: 1 }) // crisp edges so covers stay recognizable at low res
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rgb = (x: number, y: number): [number, number, number] => {
    const o = (y * info.width + x) * channels;
    return [data[o] ?? 0, data[o + 1] ?? 0, data[o + 2] ?? 0];
  };

  const lines: string[] = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let x = 0; x < info.width; x++) {
      const [tr, tg, tb] = rgb(x, row * 2);
      const [br, bg, bb] = rgb(x, row * 2 + 1);
      line += paint.rgb(tr, tg, tb).bgRgb(br, bg, bb)('▀');
    }
    lines.push(line);
  }
  return lines;
}
