// Resolves a media stem ('pulseos/pulseos-1') to a responsive WebP set.
//
// scripts/optimise-media.mjs writes the files and the manifest; this turns
// them into the three things an <img> needs to load fast and never reflow:
// a src, a srcset, and the intrinsic width and height.

import manifest from '../media/manifest.json';

const files = import.meta.glob('../media/**/*.webp', { eager: true, query: '?url', import: 'default' });

// '../media/pulseos/pulseos-1-960.webp' -> stem 'pulseos/pulseos-1', width 960
const byStem = new Map();
for (const [path, url] of Object.entries(files)) {
  const match = path.match(/^\.\.\/media\/(.+)-(\d+)\.webp$/);
  if (!match) continue;
  const [, stem, width] = match;
  if (!byStem.has(stem)) byStem.set(stem, []);
  byStem.get(stem).push({ width: Number(width), url });
}
for (const variants of byStem.values()) variants.sort((a, b) => a.width - b.width);

/**
 * @param {string} stem
 * @returns {{src: string, srcSet: string, width: number, height: number, aspect: number}|null}
 */
export function picture(stem) {
  const variants = byStem.get(stem);
  const meta = manifest[stem];
  if (!variants?.length || !meta) {
    if (import.meta.env.DEV) console.warn(`[media] no image for stem "${stem}" — run npm run media`);
    return null;
  }
  return {
    // Largest as the fallback src: any browser without srcset support is on a
    // desktop that can afford it.
    src: variants.at(-1).url,
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(', '),
    width: meta.width,
    height: meta.height,
    aspect: meta.aspect,
  };
}

export const hasPicture = (stem) => byStem.has(stem);
