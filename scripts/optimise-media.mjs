// Converts the screenshots and photographs the site actually references into
// responsive WebP sets.
//
// The originals stay in src/assets (untouched, never bundled); the built site
// only ever ships what lands in src/media. Run after adding or replacing a
// screenshot:  npm run media
//
// The list of what to convert is read from the data, not from the directory —
// so an unused photograph in src/assets can never end up in the bundle, and a
// screenshot referenced by a project can never be silently missing.

import { createRequire } from 'node:module';
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { projects } from '../src/data/projects.js';
import { photographs, portrait } from '../src/data/profile.js';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = resolve(import.meta.dirname, '..');
const OUT_ROOT = join(ROOT, 'src/media');

const QUALITY = 92;
// The artefact in chapter 02 runs to about 50rem on a wide screen, so 1920
// is 2× it — and 1920 is also the width every screenshot was captured at, so
// it is the ceiling whatever the stylesheet asks for. The quality is high
// because these are flat UI screenshots read at half the width of the glass,
// where WebP's blocking shows up in gradients and hairlines long before it
// would in a photograph.
const WIDTHS = [480, 960, 1440, 1920];

// Every stem the site references, paired with the source file to build it from.
const wanted = new Map();

const want = (stem, candidates) => wanted.set(stem, candidates);

for (const project of projects) {
  for (const stem of new Set([project.lead, ...project.gallery.map((shot) => shot.stem)])) {
    want(stem, [`src/assets/projects/${stem}.png`, `src/assets/projects/${stem}.jpg`]);
  }
}
want(portrait.stem, ['src/assets/cutout/eeliya-cutout.png']);
for (const photo of Object.values(photographs)) want(photo.stem, [photo.source]);

const firstExisting = async (candidates) => {
  for (const candidate of candidates) {
    try {
      await stat(join(ROOT, candidate));
      return candidate;
    } catch {
      // try the next extension
    }
  }
  return null;
};

async function convert(source, stem, manifest) {
  const absolute = join(ROOT, source);
  const { width: sourceWidth, height: sourceHeight } = await sharp(absolute, {
    limitInputPixels: false,
  }).metadata();

  if (!sourceWidth || !sourceHeight) {
    console.warn(`  ! no dimensions: ${source}`);
    return 0;
  }

  // Never upscale, and never exceed the cap.
  const cap = Math.min(sourceWidth, WIDTHS.at(-1));
  const targets = WIDTHS.filter((w) => w < cap);
  targets.push(cap);

  let bytes = 0;
  for (const width of targets) {
    const outPath = join(OUT_ROOT, `${stem}-${width}.webp`);
    await mkdir(dirname(outPath), { recursive: true });
    const { size } = await sharp(absolute, { limitInputPixels: false })
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5, alphaQuality: 100 })
      .toFile(outPath);
    bytes += size;
  }

  manifest[stem] = {
    width: Math.min(sourceWidth, cap),
    height: Math.round((Math.min(sourceWidth, cap) / sourceWidth) * sourceHeight),
    aspect: Number((sourceWidth / sourceHeight).toFixed(4)),
    widths: targets,
  };
  return bytes;
}

// Start clean, so a stem that is no longer referenced stops shipping.
await rm(OUT_ROOT, { recursive: true, force: true });
await mkdir(OUT_ROOT, { recursive: true });

const manifest = {};
let sourceBytes = 0;
let outBytes = 0;
const missing = [];

for (const [stem, candidates] of wanted) {
  const source = await firstExisting(candidates);
  if (!source) {
    missing.push(stem);
    continue;
  }
  sourceBytes += (await stat(join(ROOT, source))).size;
  outBytes += await convert(source, stem, manifest);
  console.log(`  ${stem}`);
}

await writeFile(
  join(OUT_ROOT, 'manifest.json'),
  `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}\n`,
);

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
console.log(`\n${Object.keys(manifest).length} images, ${(await readdir(OUT_ROOT, { recursive: true })).length} files`);
console.log(`source ${mb(sourceBytes)} -> webp ${mb(outBytes)}`);

if (missing.length) {
  console.error(`\nMISSING SOURCES — these stems are referenced but have no file in src/assets:`);
  for (const stem of missing) console.error(`  ${stem}`);
  process.exitCode = 1;
}
