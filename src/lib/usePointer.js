import { useEffect, useRef } from 'react';

/**
 * Publishes the pointer's position on an element as CSS custom properties, so
 * the parallax itself is written in CSS rather than driven from JavaScript:
 *
 *   --mx, --my   -1 … 1, from the centre. Signed, for depth.
 *   --mxp, --myp percentages, for anything that follows the cursor directly.
 *   --mdist      0 … 1, how far from the centre, for falling off at the edges.
 *
 * Writes are batched into one rAF, so a burst of pointer events still costs a
 * single style recalculation per frame. Nothing runs for a reader who asked
 * for reduced motion, or on a touch screen where there is no cursor to follow.
 */
export function usePointer() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return undefined;

    let frame = 0;
    let pending = null;

    const write = () => {
      frame = 0;
      if (!pending) return;
      const { x, y } = pending;
      node.style.setProperty('--mx', x.toFixed(4));
      node.style.setProperty('--my', y.toFixed(4));
      node.style.setProperty('--mxp', `${(50 + x * 50).toFixed(2)}%`);
      node.style.setProperty('--myp', `${(50 + y * 50).toFixed(2)}%`);
      node.style.setProperty('--mdist', Math.min(1, Math.hypot(x, y)).toFixed(4));
    };

    const onMove = (event) => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      pending = {
        x: ((event.clientX - box.left) / box.width) * 2 - 1,
        y: ((event.clientY - box.top) / box.height) * 2 - 1,
      };
      if (!frame) frame = requestAnimationFrame(write);
    };

    // Easing back to centre is the CSS transition's job; this only has to stop
    // feeding it a position.
    const onLeave = () => {
      pending = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(write);
    };

    node.dataset.pointer = 'on';
    window.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      delete node.dataset.pointer;
    };
  }, []);

  return ref;
}

export default usePointer;
