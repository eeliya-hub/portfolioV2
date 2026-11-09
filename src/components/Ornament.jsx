import { useMemo } from 'react';

import { DRAW_LENGTH, fieldUrl, khatamFrame, knotRun, polygon, shamsa } from '../lib/girih.js';

/**
 * A shamsa — the eight-pointed rosette struck at the centre of a carpet and
 * at the head of an illuminated page.
 *
 * Every path carries `pathLength="1"`, so the stylesheet can draw the figure
 * on with a dashoffset from 1 to 0 without anything being measured. The
 * paths are emitted in the order a draughtsman strikes them — frame, ties,
 * star, eye — and the stylesheet delays each role by its position, so the
 * figure assembles rather than fading in.
 */
export function Shamsa({ className = '', size = 100 }) {
  const paths = useMemo(() => shamsa(size), [size]);

  return (
    <svg
      className={`shamsa ${className}`.trim()}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((path, index) => (
        <path
          key={path.d}
          d={path.d}
          pathLength="1"
          data-role={path.role}
          style={{ '--step': index }}
        />
      ))}
    </svg>
  );
}

/**
 * The selvedge: the woven edge that runs down both sides of every page of
 * this site, and the reason nothing here spans the full width.
 *
 * It is also the progress indicator. A carpet grows from one end of the loom
 * to the other, and so does this: each chapter owns a station on the band,
 * and as you reach that chapter its shamsa is struck and the run of knots
 * above it is woven in. By the contact chapter the edge is finished. Nothing
 * about it animates per frame — `reached` flips a data attribute and the
 * stylesheet does the rest.
 *
 * @param {object} props
 * @param {'left'|'right'} props.side
 * @param {Array<{id: string, label: string}>} props.stations
 * @param {Set<string>} props.reached chapters the reader has arrived at
 * @param {string} props.active the chapter they are in now
 */
export function Selvedge({ side, stations, reached, active }) {
  // One repeating unit of the running band, used as a mask so the knots take
  // their colour from the theme rather than being baked into an image.
  const run = useMemo(() => {
    const d = knotRun(24, 34, 1);
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='34' viewBox='0 0 24 34'>` +
      `<path d='${d}' fill='none' stroke='#000' stroke-width='1.1'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, []);

  return (
    <div className={`selvedge selvedge--${side}`} aria-hidden="true" style={{ '--run': run }}>
      {stations.map((station, index) => (
        <div
          className="selvedge__station"
          key={station.id}
          data-woven={reached.has(station.id) ? 'true' : undefined}
          data-here={station.id === active ? 'true' : undefined}
          style={{ '--i': index }}
        >
          <span className="selvedge__run" />
          {/* The ghost is struck on the cartoon from the start; the ink is
              drawn over it, stroke by stroke, as the reader arrives. */}
          <span className="selvedge__markwrap">
            <Shamsa className="selvedge__mark" />
            <Shamsa className="selvedge__ink" />
          </span>
        </div>
      ))}
      <span className="selvedge__run selvedge__run--tail" />
    </div>
  );
}

/**
 * A band that closes a chapter. The same running knot as the selvedge, laid
 * horizontally and drawn across as it arrives.
 */
/**
 * A framed khatam window.
 *
 * Two rules with a run of lozenge knots between them, and a rosette struck
 * over each of the four cut corners — the border a carpet carries, at the
 * size of a photograph. Every path is normalised with `pathLength="1"` so
 * the frame can draw itself on arrival without anything being measured in
 * JavaScript, and the rosettes turn once the frame has settled.
 */
export function Khatam({ aspect }) {
  const f = khatamFrame(aspect);
  return (
    <svg
      className="khatam__orn"
      viewBox={`0 0 ${f.width} ${f.height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="khatam__rules">
        <path d={f.outer} pathLength={DRAW_LENGTH} />
        <path d={f.inner} pathLength={DRAW_LENGTH} />
      </g>

      <g className="khatam__run">
        {f.runs.map((piece) => (
          <path key={piece.transform} d={piece.d} transform={piece.transform} pathLength={DRAW_LENGTH} />
        ))}
      </g>

      {/* The rosette is struck about the origin and carried to its corner by
          an outer group, so the turn is its own rather than an orbit of the
          plate's centre. `transform-box: fill-box` cannot be relied on for a
          group; rotating about 0 0 can be.

          Its ground is an octagon of the rosette's own figure and it stays
          still. A square one cut a straight notch out of the photograph's
          chamfered corner, and because it turned with the rosette the notch
          moved — which is what read as the frame being cut off at random. */}
      {f.bosses.map(([cx, cy]) => (
        <g key={`${cx},${cy}`} transform={`translate(${cx} ${cy})`}>
          <path className="khatam__bossGround" d={polygon(0, 0, f.bossSize / 2, 8)} />
          <g className="khatam__boss">
            {/* The outer ring, the star and the eye. A rosette this small
                carries three strokes legibly; the full figure's inner ring
                and radial ties close up into a blot at this size. */}
            {shamsa(f.bossSize)
              .filter((part, n) => n === 0 || part.role === 'figure' || part.role === 'eye')
              .map((part) => (
                <path
                  key={part.d}
                  d={part.d}
                  data-role={part.role}
                  pathLength={DRAW_LENGTH}
                  transform={`translate(${-f.bossSize / 2} ${-f.bossSize / 2})`}
                />
              ))}
          </g>
        </g>
      ))}
    </svg>
  );
}

export function GuardBand({ className = '' }) {
  return (
    <span className={`guard reveal reveal--rule ${className}`.trim()} aria-hidden="true">
      <span className="guard__band" />
      <Shamsa className="guard__mark" />
      <span className="guard__band" />
    </span>
  );
}

export default Shamsa;

/**
 * The weave the whole page is laid on: a seamless girih tessellation, drifting.
 *
 * Two passes at two scales moving at two rates, which reads as depth rather
 * than as a slide. The pattern is geometry from `fieldUrl`, so it is one
 * small data URI, it takes its colour from the edition, and there is no
 * second asset for the night.
 */
export function Weave() {
  const tile = useMemo(() => fieldUrl(132, 1), []);
  return (
    <div className="weave" aria-hidden="true" style={{ '--tile': tile, '--tile-size': '132px' }}>
      <span className="weave__pass" />
      <span className="weave__pass weave__pass--fine" />
    </div>
  );
}
