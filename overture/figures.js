// Every figure the overture draws, struck at build.
//
// The overture is in index.html rather than in the app, because a loader has
// to be on the glass before the script that would draw it has arrived; so
// its geometry is generated here, by vite.config.js, from the same rows and
// the same compass work as the rest of the site, and written into the page
// as markup. Nothing here runs in the browser.
//
// The score asks for a figure with `<g data-fig="name"></g>` and the build
// fills the group with this file's markup for that name. Two rules hold for
// everything here, and both exist because the first overtures broke them:
//
//   ONE STROKE, ONE PATH. A dash pattern restarts at every subpath, so a
//   single path of eight lines drawn with one offset draws all eight at once
//   in the first eighth of its time, and then sits there. Anything meant to
//   be drawn in an order is emitted as separate paths, each with its own
//   `--i`, and the stylesheet staggers them.
//
//   NO NON-SCALING STROKES ON ANYTHING DRAWN. `pathLength` normalises the
//   dash in the path's own units, and `vector-effect: non-scaling-stroke`
//   lays the dash out in the screen's, so the two together leave chunks of
//   every figure undrawn at rest. Strokes here scale with their figure, and
//   the stylesheet sets their weight per size of glass instead.
//
// Coordinates are a 100 by 100 box with its centre at 50 50, rounded to a
// tenth of a unit, and angles are degrees clockwise from three o'clock, so
// twelve o'clock is -90.

import { UPRIGHT, outline } from '../src/lib/mark.js';
import { fieldTile, fieldUrl } from '../src/lib/girih.js';

// ----------------------------------------------------------------- the pen

const DEG = Math.PI / 180;
const n1 = (v) => {
  const r = Math.round(v * 10) / 10;
  return Object.is(r, -0) ? 0 : r;
};
const pt = ([x, y]) => `${n1(x)} ${n1(y)}`;
const polar = (r, deg, c = [50, 50]) => [c[0] + r * Math.cos(deg * DEG), c[1] + r * Math.sin(deg * DEG)];
const poly = (pts) => `M${pts.map(pt).join('L')}Z`;
const regular = (n, r, start = -90) => Array.from({ length: n }, (_, i) => polar(r, start + (360 / n) * i));

/** The visible outline of a star polygon {n/k}: outer points and the inner
    points where its chords actually cross, alternating. */
const starOutline = (n, k, r, start = -90) => {
  const inner = (r * Math.cos((k * Math.PI) / n)) / Math.cos(Math.PI / n);
  return Array.from({ length: 2 * n }, (_, i) => polar(i % 2 ? inner : r, start + (180 / n) * i));
};

/** A stroke drawn on with a dash: one path, one line, its own place in the
    order. */
const draw = (d, i) => `<path class="d" pathLength="1" style="--i:${i}" d="${d}"/>`;

// ================================================================ FIGURES

/** Every figure, by the name the score asks for it with. */
export const FIGS = {
  // The knot struck first, at the centre of the glass: a khatam, two
  // squares turned an eighth against each other, and its eye. Three
  // strokes, struck in that order.
  'field-seed': () =>
    draw(poly(regular(4, 7.5, -90)), 0) + draw(poly(regular(4, 7.5, -45)), 1) + draw(poly(regular(8, 3.6, -67.5)), 2),

  // The shamsa that opens out of it, drawn round in one continuous line,
  // and the octagon its chords leave in the middle, which the name stands
  // in.
  'field-star': () => draw(poly(starOutline(8, 3, 46)), 0) + draw(poly(regular(8, 19, -67.5)), 1),
};

/** Single paths asked for with `data-mark`, which the stage itself uses. */
export const MARKS = {
  knots: outline(UPRIGHT),
};

/** Tiles the score paints with, as data URLs, written into its rules. */
export const TILES = {
  // The field the whole site is laid on.
  'FIELD-TILE': fieldUrl(150, 1),
  // The same field drawn in the ground's own colour, to be cut into a
  // letter: the letter is the solid, and the girih runs through it in the
  // colour of the page. One for each edition.
  'GROUND-TILE-DAY': `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>` +
      `<path d='${fieldTile(56)}' fill='none' stroke='#f1e9d9' stroke-width='1.3'/></svg>`,
  )}")`,
  'GROUND-TILE-NIGHT': `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>` +
      `<path d='${fieldTile(56)}' fill='none' stroke='#121010' stroke-width='1.3'/></svg>`,
  )}")`,
};
