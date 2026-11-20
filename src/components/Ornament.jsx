import { useEffect, useMemo, useRef } from 'react';

import { DRAW_LENGTH, fieldUrl, khatamFrame, polygon, shamsa } from '../lib/girih.js';

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
  const root = useRef(null);

  // The field answers the pointer. Two numbers are written to the element —
  // where the pointer is, as a fraction of the glass, each side of centre —
  // and the stylesheet turns them into a few pixels of travel on each pass,
  // in opposite directions, so the ground has a near side and a far one.
  //
  // One listener for the page, written inside a frame and never read back,
  // so nothing here forces layout. It is not installed at all for a coarse
  // pointer or for a reader who asked for stillness: on a touchscreen there
  // is no pointer to answer, and the whole effect is motion.
  useEffect(() => {
    const node = root.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!node || !fine.matches || still.matches) return undefined;

    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      node.style.setProperty('--near-x', x.toFixed(4));
      node.style.setProperty('--near-y', y.toFixed(4));
    };

    const onMove = (event) => {
      x = event.clientX / window.innerWidth - 0.5;
      y = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(write);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      node.style.removeProperty('--near-x');
      node.style.removeProperty('--near-y');
    };
  }, []);

  return (
    <div
      className="weave"
      ref={root}
      aria-hidden="true"
      style={{ '--tile': tile, '--tile-size': '132px' }}
    >
      <span className="weave__pass" />
      <span className="weave__pass weave__pass--fine" />
    </div>
  );
}
