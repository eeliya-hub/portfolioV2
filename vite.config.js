import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { GRID, UPRIGHT, outline } from './src/lib/mark.js';
import { polygon, spokes } from './src/lib/girih.js';

// The overture is in index.html rather than in the app, because a loader has
// to be on the glass before the script that would draw it has arrived. Its
// paths are written in here, at build, from the same rows and the same
// compass work as every other drawing on the site — so there is still only
// one drawing of each of them.
//
//   data-mark="knots"  ایلیا upright: the overture turns it into the E.
//   data-mark="warp"   the uprights of the squared paper the mark is knotted
//   data-mark="weft"   on, and its crossings, MARGIN cells past the mark on
//                      every side. Two paths rather than one, because the
//                      overture strings the warp and then runs the weft
//                      through it: the loom being dressed. The page's
//                      viewBox and the stage's size in cells are set to
//                      match.
//   data-mark="ring"   the frame of a shamsa struck around the mark: two
//                      octagons and the ties between them, the figure's
//                      construction without the star that would fight the
//                      mark standing inside it.
const MARGIN = 4;

const rule = (across) => {
  const [lo, hi] = [-MARGIN, GRID + MARGIN];
  const lines = [];
  for (let at = lo; at <= hi; at += 1) lines.push(across ? `M${lo} ${at}H${hi}` : `M${at} ${lo}V${hi}`);
  return lines.join('');
};

const ring = () => {
  const c = 50;
  const r = 50;
  return polygon(c, c, r * 0.97, 8) + polygon(c, c, r * 0.78, 8) + spokes(c, c, r * 0.78, r * 0.97, 8, 0.5 / 8);
};

const overture = () => ({
  name: 'overture',
  transformIndexHtml: (html) =>
    html
      .replace('data-mark="knots"', `d="${outline(UPRIGHT)}"`)
      .replace('data-mark="warp"', `d="${rule(false)}"`)
      .replace('data-mark="weft"', `d="${rule(true)}"`)
      .replace('data-mark="ring"', `d="${ring()}"`),
});

export default defineConfig({
  plugins: [react(), overture()],
});
