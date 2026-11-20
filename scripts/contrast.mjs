// Every text pairing the site ships, measured against WCAG 2.2 AA.
//
// `npm run contrast` exits non-zero when any pairing drops below its bar, so
// a palette edit that breaks one fails loudly instead of shipping. The table
// mirrors the surface scopes in src/styles/tokens.css: a region that changes
// its ground changes its whole ink ramp, and each ramp is measured against
// the ground it actually lands on rather than against the page's.
//
// Field colours (terracotta, brass, sand) are measured deliberately: the rule
// that nothing sets small type on them stays a measured fact, not a habit.

const hex = (value) => {
  const n = parseInt(value.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (value) => {
  const [r, g, b] = hex(value).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// 4.5 = small text · 3 = large text (>=24px, or >=18.66px bold), UI component
// edges, focus rings, and meaningful graphical objects.
const SMALL = 4.5;
const LARGE = 3;

/** One surface: a ground plus the ink ramp that applies on it. */
const surface = (name, g) => [
  [g.ink, g.ground, SMALL, `${name}: body`],
  [g.ink2, g.ground, SMALL, `${name}: secondary`],
  [g.ink3, g.ground, LARGE, `${name}: tertiary mark`],
  [g.accent, g.ground, SMALL, `${name}: accent type`],
  [g.ruleStrong, g.ground, LARGE, `${name}: control edge`],
  [g.focus, g.ground, LARGE, `${name}: focus ring`],
  ...(g.ground2 ? [[g.ink, g.ground2, SMALL, `${name}: body on second ground`]] : []),
  ...(g.ground2 ? [[g.ink2, g.ground2, SMALL, `${name}: secondary on second ground`]] : []),
  ...(g.paper ? [[g.ink, g.paper, SMALL, `${name}: body on paper`]] : []),
  ...(g.paper ? [[g.ink2, g.paper, SMALL, `${name}: secondary on paper`]] : []),
];

/**
 * A colour that carries a region but never small type, and whose own
 * difference from the ground is information — a filled knot, a weft bar.
 * It has to be readable as a mark in its own right.
 */
const fieldOnly = (name, colour, ground, onIt) => [
  [colour, ground, LARGE, `${name}: field read against its ground`],
  [onIt, colour, SMALL, `${name}: the only ink allowed on it`],
];

/**
 * A tonal surface: a second paper, not a mark. Nothing is encoded in the
 * tone itself, so no 1.4.11 bar applies to it — but the rule is only true
 * while two things hold, and both are enforced elsewhere:
 *   · its edge is drawn with --rule-strong, which IS measured above, so the
 *     panel's boundary never depends on the tonal step;
 *   · wherever a sand fill counts something (the knots in the stack
 *     register), the count is printed as a figure beside it, so the tone is
 *     never the only carrier of the value.
 * Only the ink it takes is measured here.
 */
const tonal = (name, colour, onIt) => [[onIt, colour, SMALL, `${name}: the ink it takes`]];

const day = {
  ground: '#f1e9d9',
  ground2: '#e7dcc6',
  paper: '#f8f3e8',
  ink: '#1a1512',
  ink2: '#5a4e44',
  ink3: '#8d7f6e',
  accent: '#8e1c24',
  ruleStrong: '#8c7a53',
  focus: '#1a1512',
};

const night = {
  ground: '#121010',
  ground2: '#1b1715',
  paper: '#221c19',
  ink: '#f0e5d1',
  ink2: '#b3a391',
  ink3: '#7e7161',
  accent: '#e08c7d',
  ruleStrong: '#7d6e5b',
  focus: '#f0e5d1',
};

// .on-field — the closing band. Its ground is the edition's --field-deep,
// madder taken down to where a whole band of it can be read on.
const fieldScope = (fieldColour, name) => ({
  ground: fieldColour,
  ink: '#f4ead9',
  ink2: '#e9cbc3',
  ink3: '#d9a39b',
  accent: '#f4ead9',
  ruleStrong: '#cb8d86',
  focus: '#f4ead9',
  _name: name,
});

// .on-lacquer — the dossier. Pinned, identical in both editions.
const lacquer = {
  ground: '#16110f',
  ground2: '#1e1815',
  paper: '#241d19',
  ink: '#f2e8d5',
  ink2: '#b3a391',
  ink3: '#7e7161',
  accent: '#e08c7d',
  ruleStrong: '#7d6e5b',
  focus: '#f2e8d5',
};

const checks = [
  ...surface('day page', day),
  ...surface('day madder field', fieldScope('#631a1e')),
  // The band's figure ("London, United Kingdom") is set in the tertiary, so
  // on this ground the tertiary is body text and is held to the small bar.
  ['#d9a39b', '#631a1e', SMALL, 'day madder field: tertiary set as text'],
  ...fieldOnly('day terracotta', '#bd6a45', day.ground, day.ink),
  ...tonal('day sand', '#cdbb97', day.ink),

  ...surface('night page', night),
  ...surface('night madder field', fieldScope('#561719')),
  ['#d9a39b', '#561719', SMALL, 'night madder field: tertiary set as text'],
  ...fieldOnly('night brass', '#c9924a', night.ground, '#0b0908'),
  ...tonal('night sand', '#5f5240', night.ink),

  ...surface('lacquer dossier', lacquer),

  // The fixed chrome carries its own bone ramp over the two dark bands
  // (data-dusk on the bar and the warp): measured against lacquer and
  // against both editions' deep madder, because the bar passes over all
  // three.
  ...['#16110f', '#631a1e', '#561719'].flatMap((g) => [
    ['#f4ead9', g, SMALL, `dusk chrome: ink on ${g}`],
    ['#e3cdb9', g, SMALL, `dusk chrome: secondary on ${g}`],
    ['#cfae9d', g, LARGE, `dusk chrome: control edge on ${g}`],
  ]),
];

let failures = 0;
let lastGroup = '';

for (const [fg, bg, bar, what] of checks) {
  const group = what.split(':')[0];
  if (group !== lastGroup) {
    console.log(`\n${group.toUpperCase()}`);
    lastGroup = group;
  }
  const r = ratio(fg, bg);
  const ok = r >= bar;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (needs ${bar})  ` +
      `${what.split(': ')[1]}  —  ${fg} on ${bg}`,
  );
}

console.log(
  failures ? `\n${failures} pairing(s) below the bar.` : `\nAll ${checks.length} pairings clear.`,
);
process.exit(failures ? 1 : 0);
