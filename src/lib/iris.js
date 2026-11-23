/**
 * The way out of the overture: the iris.
 *
 * Eight petals of ground, each a wedge from the mark to beyond the corners
 * of the glass, turned outward and away together, so the opening is an
 * octagon that widens and twists like a lens, and the page is behind it.
 * Chosen from ten, by watching them.
 *
 * The score round the name is taken off first, quickly, because it is drawn
 * on the ground and cannot be cut into petals with it; the name is not, since
 * it is flying to the hero (src/lib/nameflight.js). With the name in flight
 * the mark does not fly through it to the bar: it goes where it stands, and
 * the bar's square is given its mark. If the score ever stops setting the
 * name, the mark flies home to the square instead.
 *
 * It returns the motions Overture.jsx waits on before it takes the stage
 * away. Everything it builds it builds inside the stage, so it goes with it.
 */

const SHARP = 'cubic-bezier(0.7, 0, 0.2, 1)';
const SOFT = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * @param {object} parts
 *   stage, ground, flight, knots, home  the elements
 *   here                                the mark's box
 *   corner                              {dx, dy, scale} to put it in the bar's square
 *   glass                               {w, h}
 *   move(el, keyframes, options)        animates, and is cancelled with the stage
 * @returns {Promise[]}
 */
export function openIris({ ground, flight, knots, home, here, corner, glass, move }) {
  const going = [];
  const cx = here.left + here.width / 2;
  const cy = here.top + here.height / 2;
  const named = Boolean(ground.querySelector('[data-word]'));

  // The score, but not the name. A part that holds words is looked inside
  // rather than taken whole, so anything drawn beside the name goes with
  // the score while the words fly.
  const besideTheName = (node) =>
    [...node.children].flatMap((child) => {
      if (child.matches('[data-word]')) return [];
      return child.querySelector('[data-word]') ? besideTheName(child) : [child];
    });
  const score = ground.querySelector('.overture__score');
  if (score) {
    for (const part of named ? besideTheName(score) : [score]) {
      going.push(move(part, [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: SOFT }));
    }
  }

  // The ground handed over to petals of the same colour, laid exactly
  // where it was, so the swap cannot be seen. They go in under the score.
  const fill = ground.querySelector('.overture__fill');
  const colour = getComputedStyle(fill).backgroundColor;
  const box = document.createElement('div');
  box.className = 'overture__petals';
  box.setAttribute('aria-hidden', 'true');
  ground.insertBefore(box, score);
  fill.style.visibility = 'hidden';

  const R = Math.hypot(glass.w, glass.h);
  const reach = Math.min(glass.w, glass.h) * 0.62;
  for (let i = 0; i < 8; i += 1) {
    // A hair of overlap either side, so no seam of page shows between two
    // petals before they part.
    const a0 = ((i * 45 - 90 - 0.6) * Math.PI) / 180;
    const a1 = (((i + 1) * 45 - 90 + 0.6) * Math.PI) / 180;
    const mid = ((i * 45 - 90 + 22.5) * Math.PI) / 180;
    const petal = document.createElement('div');
    Object.assign(petal.style, {
      position: 'absolute',
      inset: '0',
      background: colour,
      clipPath: `polygon(${cx}px ${cy}px, ${cx + R * Math.cos(a0)}px ${cy + R * Math.sin(a0)}px, ${cx + R * Math.cos(a1)}px ${cy + R * Math.sin(a1)}px)`,
      transformOrigin: `${cx}px ${cy}px`,
    });
    box.append(petal);
    going.push(
      move(
        petal,
        [
          { translate: '0 0', rotate: '0deg' },
          { translate: `${reach * Math.cos(mid)}px ${reach * Math.sin(mid)}px`, rotate: '14deg' },
        ],
        { duration: 820, delay: 120, easing: 'cubic-bezier(0.55, 0, 0.25, 1)' },
      ),
    );
  }

  if (named || !home) {
    // The mark goes where it stands, and the square is given its mark.
    going.push(move(flight, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: 1.12 }], { duration: 520, easing: SOFT }));
    home?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 360, easing: SOFT, fill: 'backwards' });
  } else {
    // Home to the square, recoloured on the way to the bar's own ink.
    going.push(
      move(
        flight,
        [
          { translate: '0px 0px', scale: 1 },
          { translate: `${corner.dx}px ${corner.dy}px`, scale: corner.scale },
        ],
        { duration: 760, easing: SHARP },
      ),
      move(knots, [{ color: getComputedStyle(knots).color }, { color: getComputedStyle(home).color }], {
        duration: 760,
        easing: SOFT,
      }),
    );
  }

  return going;
}

export default openIris;
