/**
 * The name's flight from the overture to the hero.
 *
 * A score that sets the name marks each of its four words with `data-word`,
 * one for each word the hero sets: the given name in Latin and in Persian on
 * the hero's first line, the family name in Persian and in Latin on its
 * second. At the handoff each word flies from where the overture set it to
 * where the hero sets it, growing as it goes, and lands on the hero's own
 * word so exactly that the one can be swapped for the other with nothing to
 * see. That is the whole point of it, and it is done like this:
 *
 *   1. The hero's name is put where it ends, but invisible: its rows are
 *      taken out of their own rise and stood in place, and the Persian out
 *      of its own writing-in. Now every word can be measured where it will
 *      be read.
 *   2. Each hero word is copied into a layer above the stage, set in its
 *      own computed type — face, size, weight, width, tracking, leading,
 *      ink, stretch — so the copy is the word, not a likeness of it, and
 *      laid exactly over the hero's.
 *   3. The copy is then moved back onto the overture's word: shifted onto
 *      its centre and scaled by the ratio of the two type sizes. Because
 *      the overture sets the name in the hero's own type, that is the same
 *      drawing at the same size in the same place, and the overture's word
 *      is swapped for it on one frame. A word inlaid with a pattern is
 *      swapped for a twin carrying the pattern, and the twin dissolves into
 *      the plain copy as the two fly.
 *   4. It flies home: the shift and the scale run back to nothing, and the
 *      copy ends where it was laid, which is on the hero's word.
 *   5. The hero's name is shown and the copies are taken away.
 *
 * If the hero is not on the glass, because the page was opened partway down
 * it, there is nowhere for the name to go: the overture's words simply go
 * with the overture and the hero rises as it always does.
 */

const PAIRS = [
  ['first-latin', '.hero__line--first .hero__latin'],
  ['first-fa', '.hero__line--first .hero__fa'],
  ['second-fa', '.hero__line--second .hero__fa'],
  ['second-latin', '.hero__line--second .hero__latin'],
];

const COPIED = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStretch',
  'fontStyle',
  'fontFeatureSettings',
  'fontVariationSettings',
  'letterSpacing',
  'lineHeight',
  'textTransform',
  'color',
];

/**
 * @param {object} parts
 *   stage                          the overture's stage
 *   move(el, keyframes, options)   animates, and is cancelled with the stage
 *   duration                       the flight, in milliseconds
 * @returns {{ going: Promise[], finish: () => void }}
 */
export function flyName({ stage, move, duration = 980 }) {
  const words = PAIRS.map(([key, selector]) => [
    stage.querySelector(`[data-word="${key}"]`),
    document.querySelector(selector),
  ]).filter(([own, hero]) => own && hero);

  const hero = document.getElementById('hero')?.getBoundingClientRect();
  const onGlass = hero && hero.bottom > 0 && hero.top < window.innerHeight;
  if (!words.length || !onGlass) return { going: [], finish: () => {} };

  // 1. The hero's name, where it ends, invisible.
  const rows = [...document.querySelectorAll('.hero__row')];
  for (const row of rows) Object.assign(row.style, { animation: 'none', translate: '0 0', opacity: '0' });
  for (const fa of document.querySelectorAll('.hero__fa')) fa.style.animation = 'none';

  // The layer the copies fly in: above the stage, above the skip control,
  // and taking no pointer.
  const layer = document.createElement('div');
  layer.className = 'overture__flown';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: '402', pointerEvents: 'none' });
  document.body.append(layer);

  // The overture sets the name in the hero's own type, so the copy laid
  // over a word is the same drawing at the same size in the same place, and
  // the one is swapped for the other on a single frame with nothing to see.
  // A word set in a pattern is swapped for a twin of the copy that carries
  // the same pattern, lined up with the word's, and the twin dissolves into
  // the plain copy while the two fly together: the pattern leaves the
  // letters on the way, rather than being left behind where they were.

  const going = [];
  const flown = [];
  for (const [own, word] of words) {
    const style = getComputedStyle(word);
    const there = word.getBoundingClientRect();
    const here = own.getBoundingClientRect();

    // 2. The hero's word, copied in its own type and laid over it.
    const copy = document.createElement('span');
    copy.textContent = word.textContent;
    if (word.lang) copy.lang = word.lang;
    if (word.dir) copy.dir = word.dir;
    Object.assign(copy.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      margin: '0',
      padding: '0',
      whiteSpace: 'nowrap',
      transformOrigin: '50% 50%',
    });
    for (const key of COPIED) copy.style[key] = style[key];
    layer.append(copy);
    const width = copy.offsetWidth;
    const height = copy.offsetHeight;
    copy.style.left = `${there.left + there.width / 2 - width / 2}px`;
    copy.style.top = `${there.top + there.height / 2 - height / 2}px`;

    // The hero's own stretch on this word, if it has one: the Persian is
    // drawn wider than its face by a scale, and the copy carries it.
    const [sx = 1, sy = sx] = (style.scale === 'none' ? '1' : style.scale).split(' ').map(Number);

    // 3. Moved back onto the overture's word, and 4. flown home.
    const k = Number.parseFloat(getComputedStyle(own).fontSize) / Number.parseFloat(style.fontSize);
    const dx = here.left + here.width / 2 - (there.left + there.width / 2);
    const dy = here.top + here.height / 2 - (there.top + there.height / 2);
    const from = { translate: `${dx}px ${dy}px`, scale: `${k * sx} ${k * sy}` };
    const to = { translate: '0px 0px', scale: `${sx} ${sy}` };
    const timing = { duration, easing: 'cubic-bezier(0.62, 0, 0.2, 1)' };
    own.style.opacity = '0';

    const ownStyle = getComputedStyle(own);
    if (/text/.test(ownStyle.backgroundClip) || /text/.test(ownStyle.webkitBackgroundClip ?? '')) {
      // The twin: the copy again, inlaid as the word is. Its pattern is
      // sized and placed in the copy's own units so that, scaled down onto
      // the word at the start, every line of it falls where the word's did.
      const twin = copy.cloneNode(true);
      const own0 = own.getBoundingClientRect();
      const left0 = here.left + here.width / 2 - (k * sx * width) / 2;
      const top0 = here.top + here.height / 2 - (k * sy * height) / 2;
      const sizes = ownStyle.backgroundSize.split(',').map((size) =>
        size
          .trim()
          .split(/\s+/)
          .map((v) => (v.endsWith('px') ? `${Number.parseFloat(v) / k}px` : v))
          .join(' '),
      );
      const positions = ownStyle.backgroundPosition.split(',').map((pos) => {
        const [x = '0px', y = '0px'] = pos.trim().split(/\s+/);
        const px = (Number.parseFloat(x) + own0.left - left0) / (k * sx);
        const py = (Number.parseFloat(y) + own0.top - top0) / (k * sy);
        return `${px}px ${py}px`;
      });
      Object.assign(twin.style, {
        color: 'transparent',
        backgroundImage: ownStyle.backgroundImage,
        backgroundSize: sizes.join(', '),
        backgroundPosition: positions.join(', '),
        backgroundRepeat: ownStyle.backgroundRepeat,
        backgroundClip: 'text',
        webkitBackgroundClip: 'text',
      });
      layer.append(twin);
      going.push(
        move(copy, [{ ...from, opacity: 0 }, { opacity: 0, offset: 0.18 }, { opacity: 1, offset: 0.72 }, { ...to, opacity: 1 }], timing),
        move(twin, [{ ...from, opacity: 1 }, { opacity: 1, offset: 0.18 }, { opacity: 0, offset: 0.72 }, { ...to, opacity: 0 }], timing),
      );
      flown.push([twin, null]);
    } else {
      going.push(move(copy, [from, to], timing));
    }
    flown.push([copy, word]);
  }

  // 5. Shown, and the copies taken away. How close each copy came to its
  // word is kept where the checks can read it: it is the measure of the
  // whole thing.
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    window.__nameFlight = flown.filter(([, word]) => word).map(([copy, word]) => {
      const a = copy.getBoundingClientRect();
      const b = word.getBoundingClientRect();
      return Math.max(Math.abs(a.left - b.left), Math.abs(a.top - b.top), Math.abs(a.width - b.width), Math.abs(a.height - b.height));
    });
    for (const row of rows) row.style.opacity = '';
    layer.remove();
  };

  return { going, finish };
}

export default flyName;
