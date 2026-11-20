/**
 * The mark: ایلیا in square Kufic, turned a quarter so that it reads E.
 *
 * Square Kufic (bannā'ī) is the brick script of Iranian walls: letters laid
 * on a grid in glazed and unglazed bricks of one size, so a stroke and the
 * gap beside it are always the same width. It is the same grid this site is
 * built on — the naqsheh, where one cell is one knot — which is why the
 * mark is drawn cell by cell rather than set in a font.
 *
 * Written on its baseline, ایلیا is five upright strokes that very nearly
 * mirror: alef tall, yeh short, lam tall, yeh short, alef tall. The yehs and
 * the lam join along the baseline; the first alef does not, and that one
 * break in the baseline is the only thing telling the name apart from a
 * border pattern. Walls of bannā'ī run their words up and down as freely as
 * across, and turned a quarter this one stands as a Latin E — the three
 * tall letters are its arms, the baseline its spine, the two yehs the short
 * strokes between, and the lone alef the foot set one knot away. One drawing
 * in both of the site's scripts, the way the hero sets the name in both.
 *
 * `#` is a knot. The rows run top to bottom with the mark standing as an E.
 */
export const TURNED = [
  '#########', // ا  the last letter, joined to the yeh before it
  '#........',
  '###......', // ی
  '#........',
  '#########', // ل
  '#........',
  '###......', // ی  the first letter of the joined run
  '.........', //    the break: the alef before it never joins
  '#########', // ا  the first letter, standing alone
];

export const GRID = TURNED.length;

/** The same drawing set back on its baseline, as the word is written. */
export const UPRIGHT = Array.from({ length: GRID }, (_, row) =>
  Array.from({ length: GRID }, (_, col) => TURNED[col][GRID - 1 - row]).join(''),
);

/** Every knot in a drawing, as [column, row]. */
export function knots(rows = TURNED) {
  const out = [];
  rows.forEach((line, y) => {
    [...line].forEach((cell, x) => {
      if (cell === '#') out.push([x, y]);
    });
  });
  return out;
}

/**
 * The outline of a drawing as one path, every knot merged with its
 * neighbours. Laid as separate squares, two knots that touch can show a
 * hairline between them wherever the renderer anti-aliases their shared
 * edge; traced as one outline there is no shared edge to show.
 *
 * Each knot contributes its four edges, clockwise; an edge two knots share
 * comes once in each direction and cancels; what is left chains into
 * closed loops, and runs along one line are merged into a single segment.
 */
export function outline(rows = TURNED, unit = 1, x0 = 0, y0 = 0) {
  const filled = new Set(knots(rows).map(([x, y]) => `${x},${y}`));
  const edges = new Map();
  const add = (ax, ay, bx, by) => {
    const back = `${bx},${by}>${ax},${ay}`;
    if (edges.has(back)) edges.delete(back);
    else edges.set(`${ax},${ay}>${bx},${by}`, [ax, ay, bx, by]);
  };
  for (const key of filled) {
    const [x, y] = key.split(',').map(Number);
    add(x, y, x + 1, y);
    add(x + 1, y, x + 1, y + 1);
    add(x + 1, y + 1, x, y + 1);
    add(x, y + 1, x, y);
  }

  const from = new Map();
  for (const [ax, ay, bx, by] of edges.values()) {
    const key = `${ax},${ay}`;
    if (!from.has(key)) from.set(key, []);
    from.get(key).push([bx, by]);
  }

  const loops = [];
  while (from.size) {
    const [start] = from.keys();
    const loop = [start.split(',').map(Number)];
    let at = start;
    for (;;) {
      const nexts = from.get(at);
      const [nx, ny] = nexts.shift();
      if (!nexts.length) from.delete(at);
      at = `${nx},${ny}`;
      if (at === start) break;
      loop.push([nx, ny]);
    }
    // Drop the corners that are not corners: a point in line with both of
    // its neighbours.
    const corners = loop.filter((point, i) => {
      const [px, py] = loop[(i - 1 + loop.length) % loop.length];
      const [qx, qy] = loop[(i + 1) % loop.length];
      return !((px === point[0] && point[0] === qx) || (py === point[1] && point[1] === qy));
    });
    loops.push(corners);
  }

  const n = (v) => +(v).toFixed(4);
  return loops
    .map(
      (loop) =>
        loop
          .map(([x, y], i) => `${i ? 'L' : 'M'}${n(x0 + x * unit)} ${n(y0 + y * unit)}`)
          .join('') + 'Z',
    )
    .join('');
}
