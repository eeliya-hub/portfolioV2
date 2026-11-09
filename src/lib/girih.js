// Girih, generated rather than tiled.
//
// Everything ornamental on this site is built from these functions, so the
// motifs are real geometry — struck from a centre with a compass and a
// straightedge, the way a girih pattern actually is — rather than a bitmap
// stretched to fit. Two consequences matter:
//
//   · a motif can be drawn as construction lines first and resolved into the
//     finished figure afterwards, because the construction lines are what the
//     path already is;
//   · it takes its colour and its stroke weight from the theme, at any size,
//     with no second asset for the night edition.
//
// Angles start at twelve o'clock and run clockwise, which is how the points
// of a shamsa are counted.

const TAU = Math.PI * 2;

const point = (cx, cy, radius, turns) => [
  cx + radius * Math.cos(turns * TAU - Math.PI / 2),
  cy + radius * Math.sin(turns * TAU - Math.PI / 2),
];

const round = (n) => Math.round(n * 1000) / 1000;

const polyline = (points, close = true) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(y)}`).join('') + (close ? 'Z' : '');

/**
 * A star polygon {points/skip}. The classic shamsa is {8/3}: eight points,
 * each chord skipping three vertices, which is what gives the sharp point.
 *
 * @returns {string} an SVG path
 */
export function star(cx, cy, radius, points = 8, skip = 3) {
  // The inner radius is not chosen by eye — it is where the chords of the
  // star polygon actually cross.
  const inner = radius * (Math.cos((skip * Math.PI) / points) / Math.cos(Math.PI / points));
  const vertices = [];
  for (let i = 0; i < points * 2; i += 1) {
    vertices.push(point(cx, cy, i % 2 ? Math.abs(inner) : radius, i / (points * 2)));
  }
  return polyline(vertices);
}

/** A regular polygon, rotated so an edge sits flat at the top by default. */
export function polygon(cx, cy, radius, sides = 8, offset = 0.5 / 8) {
  const vertices = [];
  for (let i = 0; i < sides; i += 1) vertices.push(point(cx, cy, radius, i / sides + offset));
  return polyline(vertices);
}

/** The radial ties that bind a rosette to its surrounding frame. */
export function spokes(cx, cy, from, to, count = 8, offset = 0) {
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const [x1, y1] = point(cx, cy, from, i / count + offset);
    const [x2, y2] = point(cx, cy, to, i / count + offset);
    d += `M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`;
  }
  return d;
}

/**
 * One shamsa, as an ordered list of paths. The order is the order a
 * draughtsman would strike them, which is also the order they are drawn in:
 * the frame first, then the ties, then the star, then the eye.
 *
 * `size` is the side of the square the figure is struck inside.
 */
export function shamsa(size = 100) {
  const c = size / 2;
  const r = size / 2;
  return [
    { d: polygon(c, c, r * 0.97, 8), role: 'frame' },
    { d: polygon(c, c, r * 0.76, 8), role: 'frame' },
    { d: spokes(c, c, r * 0.76, r * 0.97, 8, 0.5 / 8), role: 'tie' },
    { d: star(c, c, r * 0.74, 8, 3), role: 'figure' },
    { d: polygon(c, c, r * 0.17, 8), role: 'eye' },
  ];
}

/**
 * The running band that fills the selvedge between rosettes: a chain of
 * lozenges tied by a straight run, which is the simplest border a carpet
 * actually carries. Returned as one path for a vertical strip `width` wide,
 * repeating every `period`.
 */
export function knotRun(width = 24, period = 24, repeats = 1) {
  const half = width / 2;
  const inset = width * 0.17;
  let d = '';
  for (let i = 0; i < repeats; i += 1) {
    const top = i * period;
    const mid = top + period / 2;
    const bottom = top + period;
    // The lozenge.
    d += polyline([
      [half, top + inset],
      [width - inset, mid],
      [half, bottom - inset],
      [inset, mid],
    ]);
    // Its inner echo.
    d += polyline([
      [half, top + inset + width * 0.19],
      [width - inset - width * 0.19, mid],
      [half, bottom - inset - width * 0.19],
      [inset + width * 0.19, mid],
    ]);
    // The run that ties one knot to the next.
    d += `M${half} ${round(top)}L${half} ${round(top + inset)}`;
    d += `M${half} ${round(bottom - inset)}L${half} ${round(bottom)}`;
  }
  return d;
}

/**
 * A chain of lozenges running along a straight band, struck from the origin
 * in +x with the band centred on y = 0. The horizontal twin of knotRun, for
 * the straight runs of a frame rather than the selvedge.
 */
export function knotBand(length, width, period) {
  const half = width / 2;
  const count = Math.max(1, Math.round(length / period));
  const step = length / count;
  const tie = step * 0.16;
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const a = i * step;
    const mid = a + step / 2;
    const b = a + step;
    d += polyline([
      [a + tie, 0],
      [mid, -half],
      [b - tie, 0],
      [mid, half],
    ]);
    if (i) d += `M${round(a - tie)} 0L${round(a + tie)} 0`;
  }
  return d;
}

/** A rectangle with its corners cut at 45°: the octagon of the khatam. */
function chamfered(x, y, w, h, k) {
  return polyline([
    [x + k, y],
    [x + w - k, y],
    [x + w, y + k],
    [x + w, y + h - k],
    [x + w - k, y + h],
    [x + k, y + h],
    [x, y + h - k],
    [x, y + k],
  ]);
}

/**
 * A framed khatam window for a plate of the given aspect.
 *
 * Everything is struck in units where the plate is 100 tall, so one SVG
 * scales to any size without distorting — and because the geometry is built
 * from the aspect rather than stretched to it, the band keeps one width the
 * whole way round a wide plate as readily as a square one.
 *
 * The frame is the border a carpet actually carries: two rules, a run of
 * lozenges between them along each straight edge, and a rosette struck over
 * each of the four cut corners where the runs would otherwise collide.
 */
export function khatamFrame(ar) {
  const H = 100;
  const W = 100 * ar;
  const m = Math.min(W, H);
  const k = 0.293 * m;
  const band = 0.062 * m;
  const mat = 0.03 * m;
  const p = band + mat;

  // Offsetting a 45° cut inward by b moves the corner in by b(2 − √2).
  const cut = (b) => k - b * (2 - Math.SQRT2);
  const half = band / 2;
  const kMid = cut(half);

  const runLength = (span) => span - band - 2 * kMid;
  const chain = (length) => knotBand(length, band * 0.56, band * 1.5);

  const boss = kMid / 2 + half;
  // Small enough to sit inside the band and its mat. Larger, its ground
  // reached past the inner rule and cut a notch out of the photograph.
  const bossSize = band * 1.3;

  const kPhoto = cut(p);
  const photo = [
    [p + kPhoto, p],
    [W - p - kPhoto, p],
    [W - p, p + kPhoto],
    [W - p, H - p - kPhoto],
    [W - p - kPhoto, H - p],
    [p + kPhoto, H - p],
    [p, H - p - kPhoto],
    [p, p + kPhoto],
  ];

  return {
    width: W,
    height: H,
    outer: chamfered(0, 0, W, H, k),
    inner: chamfered(band, band, W - 2 * band, H - 2 * band, cut(band)),
    runs: [
      { d: chain(runLength(W)), transform: `translate(${round(half + kMid)} ${round(half)})` },
      {
        d: chain(runLength(H)),
        transform: `translate(${round(W - half)} ${round(half + kMid)}) rotate(90)`,
      },
      {
        d: chain(runLength(W)),
        transform: `translate(${round(W - half - kMid)} ${round(H - half)}) rotate(180)`,
      },
      {
        d: chain(runLength(H)),
        transform: `translate(${round(half)} ${round(H - half - kMid)}) rotate(270)`,
      },
    ],
    bosses: [
      [boss, boss],
      [W - boss, boss],
      [W - boss, H - boss],
      [boss, H - boss],
    ],
    bossSize,
    // The window, as a CSS clip-path in percentages of the plate: the same
    // 45° cut as the frame, concentric with it, expressed so an ordinary
    // responsive <img> can wear it and keep its srcset.
    clip: `polygon(${photo
      .map(([x, y]) => `${round((100 * x) / W)}% ${round((100 * y) / H)}%`)
      .join(',')})`,
  };
}

// Draw-on animation does not need a measured length: every ornamental path
// below is rendered with the SVG `pathLength="1"` attribute, which normalises
// its own length to 1 so `stroke-dasharray: 1` and a dashoffset from 1 to 0
// draw it exactly, at any size, with nothing measured in JavaScript.
export const DRAW_LENGTH = 1;

/**
 * A seamless girih field — the tessellation itself, not a grid.
 *
 * A star-and-cross (khatam) repeat: an eight-point star struck at the centre
 * of the tile, a quarter of one at each corner so the figure continues across
 * every edge, and lozenges at the edge midpoints binding them. Tiled, it is a
 * continuous Persian pattern with no seam anywhere — which is the whole point
 * of girih, and the reason this replaced a square grid: a grid is paper, a
 * tessellation is the carpet.
 *
 * @param {number} size the side of one repeat
 * @returns {string} an SVG path covering one tile
 */
export function fieldTile(size = 120) {
  const s = size;
  const c = s / 2;
  const big = s * 0.3;
  const small = s * 0.145;

  let d = '';

  // The centre figure, and its echo.
  d += star(c, c, big, 8, 3);
  d += polygon(c, c, big * 0.42, 8);

  // A quarter star at each corner. Each is shared by four tiles, so the
  // figure resolves only once the field is laid.
  for (const [x, y] of [
    [0, 0],
    [s, 0],
    [0, s],
    [s, s],
  ]) {
    d += star(x, y, big, 8, 3);
  }

  // The lozenges that bind the stars, at the midpoint of every edge.
  for (const [x, y] of [
    [c, 0],
    [c, s],
    [0, c],
    [s, c],
  ]) {
    d += polygon(x, y, small, 4, 0);
  }

  // The straps: centre to each edge midpoint.
  d += spokes(c, c, big * 0.92, c - small, 4, 0.125);

  return d;
}

/**
 * The field as a CSS `url()` ready to be used as a mask or a background. It
 * is emitted black-on-transparent so the stylesheet can colour it from the
 * theme rather than shipping one asset per edition.
 */
export function fieldUrl(size = 120, weight = 1) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>` +
    `<path d='${fieldTile(size)}' fill='none' stroke='#000' stroke-width='${weight}' ` +
    `stroke-linejoin='miter'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
