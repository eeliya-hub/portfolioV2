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
  // A mortarboard, seen from in front: the board, the head, the tassel.
  degree: (
    <>
      <path d="M12 3.5 2 8.5l10 5 10-5z" />
      <path d="M6.5 11.5V16L12 18.75 17.5 16v-4.5" />
      <path d="M20.5 9.75v4.75" />
    </>
  ),
  // A pediment on columns: the institution.
  institution: (
    <>
      <path d="M2.5 9.5 12 4l9.5 5.5" />
      <path d="M5.5 9.5v9M10 9.5v9M14 9.5v9M18.5 9.5v9" />
      <path d="M3 18.5h18M2 21h20" />
    </>
  ),
  // A pointed arch standing open. The one glyph in the set drawn from the
  // same geometry as the ornament, because "open to" is better said by a
  // doorway than by a tick.
  open: (
    <>
      <path d="M5 20.5V10l7-6.5 7 6.5v10.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  // A marker: a kite with a diamond struck in it.
  pin: (
    <>
      <path d="M12 21.5 5.5 11 12 3l6.5 8z" />
      <path d="M12 7.5 14.5 10.5 12 13.5 9.5 10.5z" />
    </>
  ),
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
