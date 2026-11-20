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
import { logoSources } from '../src/data/stack.js';

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

// A logo in 04 is drawn at about a line's height and never larger, so it
// needs none of the widths above: 128 covers it on a 2x screen with room to
// spare, and 64 is the 1x. Converting them at screenshot widths would ship
// a third of a megabyte of marks nobody can see the pixels of.
const MARK_WIDTHS = [64, 128];

// Every capture in chapter 02 is drawn in the same plate, so every capture
// has to be the same shape. They are not: the screenshots come in at 16:10
// (PulseOS, Prem Predictor, Alumni API), 16:9 (Traverse, Pit Wall, Weather)
// and a little over 2:1 (Sky Health). Drawn into one box they were letterboxed
// against a black backing — 27 of the 37 of them.
//
// They are padded to one shape here rather than cropped there, because a crop
// takes 15% off the sides of an ultrawide dashboard and what it takes is the
// part of the screen furthest from the middle, which is where an interface
// usually keeps its chrome. The padding is `extendWith: 'copy'`, which repeats
// the edge pixels outward: on a flat app background the seam is invisible, and
// on a gradient the last column continues it. Nothing is invented and nothing
// is lost.
//
// 16:9 is the target because it is the shape most of them already are and the
// one that needs the least padding over the set.
const PLATE = 16 / 9;
const PLATE_SUFFIX = '--plate';

// Every stem the site references, paired with the source file to build it from.
// `plate` marks the ones drawn in chapter 02's plate, which are the ones that
// have to share a shape; the photographs have their own crops in profile.js and
// are framed by a khatam window, so they are left alone.
const wanted = new Map();

const want = (stem, candidates, plate = false, widths = WIDTHS) =>
  wanted.set(stem, { candidates, plate, widths });

const sources = (stem) => [`src/assets/projects/${stem}.png`, `src/assets/projects/${stem}.jpg`];

for (const project of projects) {
  // The captures themselves, at the shape they were taken. The file's sheet
  // lays these out by their own aspect, and a portrait phone capture is
  // supposed to look like one.
  for (const stem of new Set([project.lead, ...project.gallery.map((shot) => shot.stem)])) {
    want(stem, sources(stem));
  }
  // And one more of the lead, padded to the plate. Chapter 02 draws every
  // entry in the same plate, so it needs one shape; the sheet in the file
  // wants the truth. Two stems rather than one capture asked to be both.
  want(`${project.lead}${PLATE_SUFFIX}`, sources(project.lead), true);
}
want(portrait.stem, ['src/assets/cutout/eeliya-cutout.png']);
// The marks in 04. Listed in src/data/stack.js beside the registers that
// reference them, so the two can never drift apart.
for (const [stem, file] of Object.entries(logoSources)) {
  want(`logos/${stem}`, [`src/assets/logos/${file}`], false, MARK_WIDTHS);
}
for (const photo of Object.values(photographs)) want(photo.stem, [photo.source]);

/**
 * The source, padded out to the plate's shape by repeating its own edge.
 * Returns a buffer, or null when the capture is already that shape.
 */
async function toPlate(absolute, width, height) {
  const aspect = width / height;
  if (Math.abs(aspect - PLATE) < 0.005) return null;

  const image = sharp(absolute, { limitInputPixels: false });
  if (aspect < PLATE) {
    // Too tall for the plate: pad the sides.
    const total = Math.round(height * PLATE) - width;
    const left = Math.floor(total / 2);
    return image.extend({ left, right: total - left, extendWith: 'copy' }).toBuffer();
  }
  // Too wide: pad above and below.
  const total = Math.round(width / PLATE) - height;
  const top = Math.floor(total / 2);
  return image.extend({ top, bottom: total - top, extendWith: 'copy' }).toBuffer();
}

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

async function convert(source, stem, manifest, plate, widths) {
  const absolute = join(ROOT, source);
  const read = await sharp(absolute, { limitInputPixels: false }).metadata();

  if (!read.width || !read.height) {
    console.warn(`  ! no dimensions: ${source}`);
    return 0;
  }

  // What everything below works from: the padded capture where one was
  // needed, the file itself where it was not.
  const padded = plate ? await toPlate(absolute, read.width, read.height) : null;
  const input = padded ?? absolute;
  const { width: sourceWidth, height: sourceHeight } = padded
    ? await sharp(padded).metadata()
    : read;

  // Never upscale, and never exceed the cap.
  const cap = Math.min(sourceWidth, widths.at(-1));
  const targets = widths.filter((w) => w < cap);
  targets.push(cap);

  let bytes = 0;
  for (const width of targets) {
    const outPath = join(OUT_ROOT, `${stem}-${width}.webp`);
    await mkdir(dirname(outPath), { recursive: true });
    const { size } = await sharp(input, { limitInputPixels: false })
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

for (const [stem, { candidates, plate, widths }] of wanted) {
  const source = await firstExisting(candidates);
  if (!source) {
    missing.push(stem);
    continue;
  }
  sourceBytes += (await stat(join(ROOT, source))).size;
  outBytes += await convert(source, stem, manifest, plate, widths);
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
