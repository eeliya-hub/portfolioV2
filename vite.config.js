import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { GRID, UPRIGHT, outline } from './src/lib/mark.js';

// The overture is in index.html rather than in the app, because a loader has
// to be on the glass before the script that would draw it has arrived. Its
// paths are written in here, at build, from the same rows as every other
// drawing of the mark — so there is still only one drawing of it.
//
//   data-mark="knots"    ایلیا upright: the overture turns it into the E.
//   data-mark="cartoon"  the squared paper it is knotted on, MARGIN cells
//                        past the mark on every side. The page's viewBox and
//                        the stage's size in cells are set to match.
const MARGIN = 4;

const cartoon = () => {
  const [lo, hi] = [-MARGIN, GRID + MARGIN];
  const lines = [];
  for (let at = lo; at <= hi; at += 1) lines.push(`M${at} ${lo}V${hi}`, `M${lo} ${at}H${hi}`);
  return lines.join('');
};

const overture = () => ({
  name: 'overture',
  transformIndexHtml: (html) =>
    html
      .replace('data-mark="knots"', `d="${outline(UPRIGHT)}"`)
      .replace('data-mark="cartoon"', `d="${cartoon()}"`),
});

export default defineConfig({
  plugins: [react(), overture()],
});
