// The whole icon set, authored here so every glyph shares one grid, one stroke
// weight and one cap style. No brand logos: in this world a name set in type
// beside an external-link mark reads better than a pasted wordmark, and it
// keeps the set consistent.

const PATHS = {
  // A line leaving the frame: anything that opens away from this site.
  external: <path d="M7 17 17 7M17 7H9m8 0v8" />,
  // A branch: a repository.
  repo: (
    <>
      <circle cx="6.5" cy="5.5" r="2" />
      <circle cx="6.5" cy="18.5" r="2" />
      <circle cx="17.5" cy="9" r="2" />
      <path d="M6.5 7.5v9M8.5 9h5a2 2 0 0 1 2 2v0M17.5 11v1.5a4 4 0 0 1-4 4H8.5" />
    </>
  ),
  // A sheet with a turned corner: the written case study.
  doc: (
    <>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  // An arrow down into a tray: the CV.
  download: <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />,
  arrowRight: <path d="M4 12h15m0 0-5-5m5 5-5 5" />,
  arrowDown: <path d="M12 4v15m0 0 5-5m-5 5-5-5" />,
  arrowLeft: <path d="M20 12H5m0 0 5-5m-5 5 5 5" />,
  chevronLeft: <path d="M14.5 5 8 12l6.5 7" />,
  chevronRight: <path d="M9.5 5 16 12l-6.5 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  send: <path d="M4 12 20 4l-8 16-2-6z" />,
  check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  alert: (
    <>
      <path d="M12 4 2.5 20.5h19z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </>
  ),
  mail: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  // A plain square bracket pair: the register.
  register: <path d="M8 4H4v16h4M16 4h4v16h-4M9 9h6M9 15h6" />,

  // --- The practice glyphs -------------------------------------------------
  // Everything in 04 that is a way of working rather than a product. They are
  // drawn on the same 24-unit grid, at the same stroke, from the straight
  // lines and squares-on-point the rest of the site is built from — so a
  // register of practices reads as one set beside a register of logos rather
  // than as a different library pasted in.

  // Two endpoints and the hop between them: a request and its answer.
  route: <path d="M3 17h4l5-10h4M4 15v4M2 17h4M18 5l3 2-3 2" />,
  // Three stacked platters.
  database: (
    <>
      <path d="M4 6h16v4H4zM4 14h16v4H4z" />
      <path d="M7 8h.01M7 16h.01" />
    </>
  ),
  // A key: the ward and its bit.
  key: (
    <>
      <path d="M14 6h6v6h-6z" />
      <path d="M14 9H4m3 0v3m3-3v2" />
    </>
  ),
  // One line open in both directions at once.
  socket: <path d="M4 9h16M4 15h16M7 6 4 9l3 3M17 12l3 3-3 3" />,
  // Three planes seen edge on.
  layers: <path d="M12 3 3 7.5 12 12l9-4.5zM3 12.5 12 17l9-4.5M3 17 12 21.5 21 17" />,
  // One composition at two widths.
  responsive: <path d="M3 5h12v10H3zM17 9h4v10h-4M3 19h8" />,
  // The standing figure inside its frame: the accessibility mark, drawn in
  // this set's own stroke rather than borrowed as a glyph.
  access: (
    <>
      <path d="M3 3h18v18H3z" />
      <path d="M12 8.5v.01M12 11v4m0-4-2.5 1m2.5-1 2.5 1M9.5 19 12 15l2.5 4" />
    </>
  ),
  // A loop that closes: build, ship, build.
  cycle: <path d="M5 12a7 7 0 0 1 11.5-5.4M19 12a7 7 0 0 1-11.5 5.4M16 3v4h-4M8 21v-4h4" />,
  // One line leaving another and coming back.
  branch: (
    <>
      <path d="M7 4v16M17 9v2a4 4 0 0 1-4 4H7" />
      <path d="M5 4h4M15 7h4M5 20h4" />
    </>
  ),
  // The modular grid a system is laid on.
  grid: <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18" />,

  // --- Working with people -------------------------------------------------

  // Two lines of speech, one answering the other.
  speak: (
    <>
      <path d="M3 4h12v8H8l-5 4z" />
      <path d="M18 8h3v8l-3 2v-2h-5" />
    </>
  ),
  // Three standing together.
  team: <path d="M8 6v.01M8 8.5v4M5 20v-5l3-2.5 3 2.5v5M16 7v.01M16 9v3.5M13 20v-4l3-2 3 2v4" />,
  // A knot untied: the line goes in tangled and comes out straight.
  solve: <path d="M3 18h4l3-6 3 6 3-12 2 6h3M3 6h5" />,
  // One claim weighed against another.
  think: <path d="M12 4v16M5 20h14M7 7h10M7 7 4.5 13h5zM17 7l-2.5 6h5z" />,
  // The one mark out in front of the rank.
  lead: <path d="M12 3 9 8h6zM12 10v4M4 21v-3l4-2m12 5v-3l-4-2M9 14h6l1 7H8z" />,
  // A face with its hand on the hour.
  clock: (
    <>
      <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  // One square turning into another.
  adapt: <path d="M3 4h8v8H3zM13 13h8v8h-8zM13 7h5m0 0-2-2m2 2-2 2M11 17H6m0 0 2-2m-2 2 2 2" />,
  // --- The record glyphs ---------------------------------------------------
  // The four marks in 01's register. They replaced four outlined octagons —
  // the same figure at four sizes said four times, which marks a list as a
  // list but never says which row you are on. Each of these says what its
  // row is about, and all four are drawn from the same straight lines and
  // squares-on-point as the rest of the set.

  // A mortarboard: a board on its point, a head under it, the tassel at the
  // corner.
  cap: (
    <>
      <path d="M12 4 3 8.5 12 13l9-4.5z" />
      <path d="M6.5 10.8v4.4c0 1.5 2.5 2.6 5.5 2.6s5.5-1.1 5.5-2.6v-4.4M21 8.5V14" />
    </>
  ),
  // A colonnade under a pediment: an institution.
  columns: <path d="M3 9.5 12 4l9 5.5M5.5 9.5V19M9.5 9.5V19M14.5 9.5V19M18.5 9.5V19M3 19h18" />,
  // A door standing open, with its leaf swung towards you.
  door: <path d="M4 20V4h9v16M3.5 20h16.5M13 6 18 7.8V20M10 12.4v.01" />,
  // A marker: the page's own knot — a lozenge with a lozenge inside it —
  // drawn long so its lower vertex is a point that lands on a place.
  marker: (
    <>
      <path d="M12 2.5 18.5 9 12 21.5 5.5 9z" />
      <path d="M12 6.2 15.3 9 12 11.8 8.7 9z" />
    </>
  ),

  // Cards standing in columns: the board a plan is read on.
  board: <path d="M3 4h18v16H3zM9 4v16M15 4v16M4.5 8h3M10.5 8h3M16.5 8h3M4.5 12h3M10.5 12h3" />,
};

export function Icon({ name, className }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {path}
    </svg>
  );
}

export default Icon;
