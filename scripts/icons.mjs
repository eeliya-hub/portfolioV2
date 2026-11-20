// Builds every icon the site ships from the one drawing in src/lib/mark.js.
//
//   node scripts/icons.mjs          (npm run icons)
//
// The tab icon and the mark in the bar are the same knots, so they are drawn
// from the same rows rather than kept in step by hand. Each icon is the mark
// in cream on a madder tile:
//
//   favicon.ico            16, 32 and 48, PNG-in-ICO
//   favicon-32x32.png      the size a high-density tab actually draws
//   apple-touch-icon.png   180, the home screen on iOS (it rounds the corners)
//   icon-192.png           the web manifest's two sizes
//   icon-512.png
//   share.png              1200×630, what a link to the site unfurls into
//
// The mark is nine knots across. A knot is a whole number of pixels at every
// size (the tile's sixteenth, rounded), and the mark is set on whole pixels,
// so no edge is ever anti-aliased: at 16px it is one-pixel strokes, exactly,
// rather than a blur of two-pixel ones. It stands half a knot right of the
// tile's centre, because the spine down its left side is the heaviest thing
// in it, and on the centre line it reads as sliding left.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { GRID, TURNED, outline } from '../src/lib/mark.js';
import { profile } from '../src/data/profile.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MADDER = '#8e1c24';
const CREAM = '#f4ead9';
// The madder close's own secondary and tertiary inks (tokens.css, .on-field).
const CREAM_2 = '#e9cbc3';
const CREAM_3 = '#d9a39b';

/** The tile at one size, as SVG. */
function tile(size) {
  const knot = Math.max(1, Math.round(size / 16));
  const free = size - GRID * knot;
  const x = Math.round(free / 2 + knot / 2);
  const y = Math.floor(free / 2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="${MADDER}"/>` +
    `<path d="${outline(TURNED, knot, x, y)}" fill="${CREAM}" shape-rendering="crispEdges"/>` +
    `</svg>`
  );
}

/** Two colours and no anti-aliasing, so a palette PNG holds it exactly. */
const png = (size) =>
  sharp(Buffer.from(tile(size)))
    .png({ palette: true, colours: 4, compressionLevel: 9, effort: 10 })
    .toBuffer();

/** PNG-in-ICO: a six-byte header, one sixteen-byte entry per image, then the PNGs. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

/**
 * The card a link to the site unfurls into: the mark on its cartoon, on the
 * madder ground, beside the name in both scripts. Drawn in Chromium rather
 * than by sharp, because the name is set in the site's own faces and the
 * Persian has to be shaped.
 *
 * It is the hero's lockup, cut down to a card: EELIYA and NAYERI at the
 * widths the hero solved to make them measure the same, and under them one
 * line that reads outward from both margins — the role from the left, ایلیا
 * نیری from the right. The first line's cap top stands level with the
 * mark's top and that last line's baseline with its foot, both measured off
 * the render rather than guessed, and the whole lockup is centred.
 */
async function card() {
  const [W, H, KNOT, MARGIN] = [1200, 630, 30, 4];
  const side = GRID * KNOT;
  const face = (file) =>
    `data:font/woff2;base64,${readFileSync(join(ROOT, 'public/fonts', file)).toString('base64')}`;
  const lines = [];
  for (let at = -MARGIN; at <= GRID + MARGIN; at += 1) {
    lines.push(`M${at} ${-MARGIN}V${GRID + MARGIN}`, `M${-MARGIN} ${at}H${GRID + MARGIN}`);
  }
  const [given, family] = profile.name.split(' ');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: Archivo; src: url(${face('archivo-var-latin.woff2')}) format('woff2-variations'); font-weight: 100 900; font-stretch: 62% 125%; }
    @font-face { font-family: Vazirmatn; src: url(${face('vazirmatn-arabic.woff2')}) format('woff2-variations'); font-weight: 100 900; }
    html, body { margin: 0; }
    body { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: ${MADDER}; color: ${CREAM}; font-family: Archivo; }
    .lockup { position: absolute; top: ${(H - side) / 2}px; left: 0; display: flex; gap: ${2 * KNOT}px; height: ${side}px; }
    .figure { position: relative; flex: none; width: ${side}px; height: ${side}px; }
    .cartoon { position: absolute; inset: ${-MARGIN * KNOT}px; overflow: visible; opacity: 0.16; -webkit-mask-image: radial-gradient(closest-side, #000 40%, transparent); }
    .cartoon path { fill: none; stroke: ${CREAM}; stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .mark { position: absolute; inset: 0; }
    .words { display: flex; flex-direction: column; justify-content: space-between; height: ${side}px; }
    .name { margin: 0; font-size: 112px; font-weight: 800; line-height: 0.86; letter-spacing: -0.047em; text-transform: uppercase; white-space: nowrap; }
    .name span { display: block; }
    .given { font-stretch: 125%; }
    .family { font-stretch: 118.5%; }
    .foot { display: flex; justify-content: space-between; align-items: baseline; margin: 0; white-space: nowrap; }
    .role { font-size: 17px; font-weight: 650; letter-spacing: 0.26em; text-transform: uppercase; color: ${CREAM_3}; }
    .fa { font-family: Vazirmatn; font-size: 46px; font-weight: 700; line-height: 1; color: ${CREAM_2}; }
    .baseline { display: inline-block; width: 0; height: 0; vertical-align: baseline; }
  </style></head><body>
    <div class="lockup">
      <div class="figure">
        <svg class="cartoon" viewBox="${-MARGIN} ${-MARGIN} ${GRID + 2 * MARGIN} ${GRID + 2 * MARGIN}"><path d="${lines.join('')}"/></svg>
        <svg class="mark" viewBox="0 0 ${GRID} ${GRID}" shape-rendering="crispEdges"><path d="${outline(TURNED)}" fill="${CREAM}"/></svg>
      </div>
      <div class="words">
        <h1 class="name"><span class="given">${given}<i class="baseline"></i></span><span class="family">${family}</span></h1>
        <p class="foot"><span class="role">${profile.role}<i class="baseline"></i></span><span class="fa" lang="fa" dir="rtl">${profile.namePersian}</span></p>
      </div>
    </div>
  </body></html>`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((side) => {
      const lockup = document.querySelector('.lockup');
      const top = lockup.getBoundingClientRect().top;
      const [first, last] = document.querySelectorAll('.baseline');
      // Cap height off the face itself: the width axis does not move it.
      const pen = document.createElement('canvas').getContext('2d');
      pen.font = `800 ${getComputedStyle(document.querySelector('.name')).fontSize} Archivo`;
      const cap = pen.measureText('E').actualBoundingBoxAscent;
      document.querySelector('.name').style.marginTop = `${top - (first.getBoundingClientRect().top - cap)}px`;
      document.querySelector('.foot').style.marginBottom = `${last.getBoundingClientRect().top - (top + side)}px`;
      lockup.style.left = `${Math.round((innerWidth - lockup.getBoundingClientRect().width) / 2)}px`;
    }, side);
    const shot = await page.screenshot({ type: 'png' });
    // Flat ground, two inks and their edges: a small palette holds it.
    return sharp(shot).png({ palette: true, colours: 64, compressionLevel: 9, effort: 10 }).toBuffer();
  } finally {
    await browser.close();
  }
}

const out = (name, data) => {
  writeFileSync(join(ROOT, 'public', name), data);
  console.log(`  ${name.padEnd(22)} ${String(data.length).padStart(6)} bytes`);
};

const sizes = [16, 32, 48, 180, 192, 512];
const built = Object.fromEntries(await Promise.all(sizes.map(async (s) => [s, await png(s)])));

out('favicon.ico', ico([16, 32, 48].map((size) => ({ size, data: built[size] }))));
out('favicon-32x32.png', built[32]);
out('apple-touch-icon.png', built[180]);
out('icon-192.png', built[192]);
out('icon-512.png', built[512]);
out('share.png', await card());
