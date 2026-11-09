import { useEffect, useRef, useState } from 'react';

// The ring trails the point it is chasing; the dot does not. That difference
// is the whole effect — a drawn instrument with some weight to it, rather
// than a second arrow pinned to the first.
const DRAG = 0.18;

/**
 * The cursor.
 *
 * One ring that trails, one dot that does not, and a word when the thing
 * under it needs one. Elements opt in through two attributes, so nothing has
 * to be registered here:
 *
 *   data-cursor="open|read|drag|close"   what shape the cursor takes
 *   data-cursor="control"                stays open and keeps out of the
 *                                        way of a control's own label
 *   data-cursor-label="Open the dossier" the word it carries
 *
 * The root's own state is kept under data-pointer rather than data-cursor,
 * because an element is found here with closest('[data-cursor]') and that
 * walks up to the root: a root carrying the same attribute answers for every
 * element on the page, and the reticle is then never not over something.
 *
 * It runs one requestAnimationFrame loop for the whole page and writes only
 * transforms, so it never forces layout. There is no cursor at all for a
 * coarse pointer or for a reader who asked for stillness — in both cases the
 * native pointer is the right instrument and the stylesheet keeps it.
 *
 * It is drawn in the top layer, because a file opened over the page is drawn
 * there too and nothing in the page can be painted above it.
 */
export function Cursor() {
  const root = useRef(null);
  const ring = useRef(null);
  const dot = useRef(null);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState('');
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return undefined;

    document.documentElement.dataset.pointer = 'drawn';
    setOn(true);

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const eased = { ...target };
    let frame = 0;

    const tick = () => {
      eased.x += (target.x - eased.x) * DRAG;
      eased.y += (target.y - eased.y) * DRAG;

      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }

      // Stop the loop once the ring has caught up; a cursor sitting still
      // should not cost a frame. Not before it has been drawn at all,
      // though: the loop is woken from the same effect that renders the
      // cursor, so the first frame can arrive while the refs are still
      // empty — and a loop that stopped there left the reticle parked in
      // the top-left corner until the reader first moved the pointer.
      const settled =
        ring.current &&
        Math.abs(target.x - eased.x) < 0.1 &&
        Math.abs(target.y - eased.y) < 0.1;
      if (settled) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;

      const hit = event.target instanceof Element ? event.target : null;
      const interactive = hit?.closest('a, button, [data-cursor], summary, input, textarea');

      setMode(interactive?.dataset?.cursor ?? (interactive ? 'open' : ''));
      setLabel(interactive?.dataset?.cursorLabel ?? '');

      wake();
    };

    const onLeave = () => {
      setMode('');
      setLabel('');
    };

    const onDown = () => {
      document.documentElement.dataset.pressed = 'true';
    };
    const onUp = () => {
      delete document.documentElement.dataset.pressed;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    // A scroll moves the page under a still cursor, so whatever the cursor
    // was over is no longer what it is over; drop the state rather than
    // keeping a label for an element that has moved on.
    // Captured, so a scroll inside the file counts as well as one of the
    // page: either way the cursor is no longer over what it was over.
    window.addEventListener('scroll', onLeave, { passive: true, capture: true });
    wake();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onLeave, { capture: true });
      delete document.documentElement.dataset.pointer;
      delete document.documentElement.dataset.pressed;
      setOn(false);
    };
  }, []);

  // A modal file is painted in the top layer, which is above every z-index
  // on the page — so a cursor drawn in the page is drawn underneath it, and
  // since the native pointer is hidden there was no cursor at all inside an
  // open file. The cursor is put in the top layer too, and put there again
  // each time something else arrives in it: the top layer stacks in the
  // order things entered, so being last in is the whole trick.
  useEffect(() => {
    const node = root.current;
    if (!on || !node || !('popover' in HTMLElement.prototype)) return undefined;

    const raise = () => {
      try {
        if (node.matches(':popover-open')) node.hidePopover();
        node.showPopover();
        document.documentElement.dataset.pointer = 'raised';
      } catch {
        // Refused: the stylesheet hands the native pointer back inside the
        // file rather than leaving the reader with no cursor at all.
        document.documentElement.dataset.pointer = 'drawn';
      }
    };

    raise();

    // Nothing announces an entry into the top layer, so the one thing on
    // this page that makes one is watched instead: a dialog opening.
    const watch = new MutationObserver((records) => {
      for (const record of records) {
        if (record.target instanceof HTMLDialogElement && record.target.open) {
          raise();
          return;
        }
      }
    });
    watch.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

    return () => {
      watch.disconnect();
      if (node.matches(':popover-open')) node.hidePopover();
    };
  }, [on]);

  // Nothing is drawn where the native pointer is the right instrument.
  if (!on) return null;

  return (
    <div className="cursor" ref={root} popover="manual" aria-hidden="true">
      <span className="cursor__ring" ref={ring} data-mode={mode || undefined}>
        {label ? <span className="cursor__label">{label}</span> : null}
      </span>
      <span className="cursor__dot" ref={dot} data-mode={mode || undefined} />
    </div>
  );
}

export default Cursor;
