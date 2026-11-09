import { useCallback, useEffect, useRef, useState } from 'react';

import { Shamsa } from './Ornament.jsx';
import { profile } from '../data/profile.js';

const SEEN = 'overture';

// The whole sequence, in one place so the stylesheet and this file cannot
// drift: the figure is struck, the name is signed under it, the drawing
// opens outward, and the page is behind it.
const DRAW_MS = 1500;
const LIFT_MS = 850;

const prefersStillness = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const alreadySeen = () => {
  try {
    return sessionStorage.getItem(SEEN) === '1';
  } catch {
    // Storage blocked. Playing it once more is a better failure than
    // refusing to play it at all.
    return false;
  }
};

/**
 * The overture.
 *
 * A girih rosette is struck as construction lines — frame, ties, star, eye,
 * in the order a draughtsman strikes them — and then opens outward past the
 * frame to leave the hero behind it. It is the site's thesis in two seconds:
 * the ornament is geometry, and the geometry is drawn, not placed.
 *
 * It plays once per session, never for a reader who asked for stillness, and
 * anything at all — a click, a key, a scroll, the skip control — ends it
 * early. Nothing is withheld behind it: the page is fully rendered and the
 * overture sits over the top, so skipping costs nothing to resume.
 */
export function Overture() {
  const [phase, setPhase] = useState(() =>
    prefersStillness() || alreadySeen() ? 'done' : 'draw',
  );
  const skipRef = useRef(null);
  const timers = useRef([]);

  const finish = useCallback(() => {
    setPhase((current) => (current === 'done' ? current : 'lift'));
  }, []);

  useEffect(() => {
    if (phase === 'done') return undefined;

    const body = document.body;

    if (phase === 'draw') {
      try {
        sessionStorage.setItem(SEEN, '1');
      } catch {
        // Nothing to do; the overture simply plays again next time.
      }
      body.dataset.locked = 'true';
      timers.current.push(setTimeout(finish, DRAW_MS));

      const bail = () => finish();
      window.addEventListener('wheel', bail, { passive: true, once: true });
      window.addEventListener('touchstart', bail, { passive: true, once: true });
      window.addEventListener('keydown', bail, { once: true });
      window.addEventListener('pointerdown', bail, { once: true });

      return () => {
        window.removeEventListener('wheel', bail);
        window.removeEventListener('touchstart', bail);
        window.removeEventListener('keydown', bail);
        window.removeEventListener('pointerdown', bail);
      };
    }

    // phase === 'lift'
    const id = setTimeout(() => {
      delete body.dataset.locked;
      setPhase('done');
      // The reader's place in the document is the top of the page; make that
      // explicit rather than leaving focus on a control that is gone.
      document.getElementById('hero')?.setAttribute('tabindex', '-1');
    }, LIFT_MS);
    timers.current.push(id);
    return () => clearTimeout(id);
  }, [phase, finish]);

  useEffect(() => {
    const ids = timers.current;
    return () => {
      for (const id of ids) clearTimeout(id);
      delete document.body.dataset.locked;
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className="overture" data-phase={phase} role="presentation">
      <div className="overture__figure">
        <Shamsa className="overture__mark" />
        <p className="overture__fa" lang="fa" dir="rtl">
          {profile.namePersian}
        </p>
      </div>

      <button type="button" className="overture__skip" onClick={finish} ref={skipRef}>
        Skip
      </button>
    </div>
  );
}

export default Overture;
