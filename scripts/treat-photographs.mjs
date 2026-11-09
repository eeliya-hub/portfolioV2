// Prepares the About plates: crop, then hold the subject sharp while the room
// behind goes soft.
//
//   npm run treat        (then `npm run media` to build the WebP sets)
//
// The matte is a real Vision foreground-instance mask, not a shape or a
// radial gradient, so the falloff follows the edge of a person. Instances are
// chosen by naming a point that lands on whoever should stay sharp, which is
// what lets a stage of five presenters keep one of them in focus.
//
// `clear` regions are held sharp as well. A blurred background would
// otherwise take the thing that says where the photograph was taken with it —
// the London Eye behind the graduation, the team's name behind the stage.

import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const run = promisify(execFile);

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'src/assets/personal/treated');
const TMP = join(ROOT, 'node_modules/.cache/treat');

// Every figure and region below was read off the photograph itself.
const TREATMENTS = [
  {
    name: 'founder-matcha',
    source: 'src/assets/personal/founder-matcha-1.jpg',
    crop: { left: 550, top: 240, width: 1100, height: 1100 },
    // Both men at the table. Vision returns them as one near-field instance,
    // which is right: the conversation is the subject, not just one half.
    keep: [[0.61, 0.36], [0.27, 0.4]],
    blur: 16,
  },
  {
    name: 'graduation',
    source: 'src/assets/personal/gradpic.jpeg',
    // Cropped only. The walkway, the crowd and the Eye behind him are the
    // day, and softening them took more out of the photograph than the
    // separation they bought back. The crop is unchanged, so the plate keeps
    // the same shape and the framing in profile.js still holds.
    crop: { left: 0, top: 0, width: 1536, height: 1900 },
    mode: 'none',
  },
  {
    name: 'amf1',
    source: 'src/assets/personal/amf1pic.jpeg',
    crop: { left: 0, top: 40, width: 1280, height: 920 },
    // Cropped only. Everyone on that stage presented together and the screen
    // behind them is the record of it, so nothing here is softened.
    mode: 'none',
  },
];

const pct = (v, total) => Math.round(v * total);

await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

for (const job of TREATMENTS) {
  const { width: w, height: h } = job.crop;
  const cropped = join(TMP, `${job.name}-crop.png`);
  const matte = join(TMP, `${job.name}-matte.png`);
  const out = join(OUT, `${job.name}.jpg`);

  await sharp(join(ROOT, job.source), { limitInputPixels: false })
    .extract(job.crop)
    .toFile(cropped);

  if (job.mode === 'none') {
    await sharp(cropped).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(out);
    console.log(`  ${job.name.padEnd(16)} ${w}x${h}  cropped, nothing softened`);
    continue;
  }

  const { stdout } = await run('swift', [
    join(ROOT, 'scripts/subject-mask.swift'),
    cropped,
    matte,
    ...(job.mode === 'others' ? ['--others'] : []),
    ...job.keep.flat().map(String),
  ]);

  // The matte, plus any region that has to stay legible, feathered so the
  // focus falls off rather than stopping at an edge.
  const regions = (job.clear ?? [])
    .map((r) => `<rect x="${pct(r.left, w)}" y="${pct(r.top, h)}" width="${pct(r.width, w)}"
       height="${pct(r.height, h)}" rx="${Math.round(w * 0.04)}" fill="#fff"/>`)
    .join('');

  let mask = sharp(matte).resize(w, h).greyscale();
  if (regions) {
    mask = sharp(
      await mask
        .composite([
          {
            input: Buffer.from(
              `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#000"/>${regions}</svg>`,
            ),
            blend: 'lighten',
          },
        ])
        .toBuffer(),
    ).greyscale();
  }
  // In 'others' mode the matte names what to soften, so the sharp layer is
  // everything the matte is not.
  if (job.mode === 'others') mask = mask.negate();
  const alpha = await mask.blur(Math.max(2, w * 0.012)).raw().toBuffer();

  const base = await sharp(cropped).removeAlpha().toBuffer();
  const subject = await sharp(base)
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();
  const behind = await sharp(base).blur(job.blur).toBuffer();

  await sharp(behind)
    .composite([{ input: subject, blend: 'over' }])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(out);

  console.log(`  ${job.name.padEnd(16)} ${w}x${h}  ${stdout.trim()}`);
}

await rm(TMP, { recursive: true, force: true });
console.log('\ntreated into src/assets/personal/treated');
