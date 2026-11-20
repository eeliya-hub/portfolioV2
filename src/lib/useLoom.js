import { useEffect } from 'react';

/**
 * The loom: one scroll engine for the whole page.
 *
 * Elements opt in with an attribute and the engine writes them a single
 * custom property; everything visual is then stated in CSS.
 *
 *   data-loom           --p       0 → 1 as the element crosses the viewport:
 *                                 0 with its top at the bottom edge, 1 with
 *                                 its bottom at the top. Parallax reads it.
 *   data-loom="travel"  --travel  0 → 1 across a tall section's pinned leg:
 *                                 0 as its top docks, 1 as its foot arrives.
 *                                 The route is driven by it.
 *   data-loom="deck"    inert     on every child a later one has completely
 *                                 covered, where the children are a stack of
 *                                 sticky plates docking at the top. They all
 *                                 stay pinned once they arrive, so the six
 *                                 underneath the one you are reading are
 *                                 still in the page: their buttons answered
 *                                 clicks aimed at the plate on top, and the
 *                                 tab key walked through six invisible
 *                                 copies of the same three controls before
 *                                 reaching anything on screen. A plate is
 *                                 covered exactly when the next one has
 *                                 docked, since each is a full viewport
 *                                 tall; `inert` takes it out of both the hit
 *                                 testing and the focus order, and gives it
 *                                 back the moment it is uncovered.
 *   data-loom="deck-x"  inert     the same guard for a stack dealt sideways,
 *                                 which is how 02 deals its plates: the
 *                                 children are absolutely stacked in a
 *                                 pinned frame and slide in from the left,
 *                                 so a plate is out of reach either because
 *                                 the next one has fully arrived over it OR
 *                                 because it has not arrived itself and is
 *                                 still standing off the left edge. Both
 *                                 read off one number — the plate's own left
 *                                 edge, which is 0 exactly when it has
 *                                 landed and negative at every other moment.
 *
 * The document root gets --woven, 0 → 1 down the whole page, which is what
 * fills the warp at the page's edge.
 *
 * One rAF for everything: all rects are read first, then all properties are
 * written, so a frame never alternates read-write-read. An
 * IntersectionObserver keeps the working set to what is near the glass, and
 * the margin it watches with is generous because a pinned section is taller
 * than the viewport and must stay live for its whole leg.
 *
 * None of it runs for a reader who asked for stillness — every property it
 * writes has a static fallback in the stylesheet, and the one layout the
 * travel drives (the route) falls back to a native horizontal scroller.
 */
export function useLoom() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const doc = document.documentElement;
    const live = new Set();
    let frame = 0;

    const write = () => {
      frame = 0;
      const height = window.innerHeight;
      const woven = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, doc.scrollHeight - height)),
      );

      // Reads, all of them, before any write.
      const jobs = [];
      const covers = [];
      const sideways = [];
      for (const node of live) {
        if (node.dataset.loom === 'deck') {
          const plates = [...node.children];
          const tops = plates.map((plate) => plate.getBoundingClientRect().top);
          // Covered when the plate after this one has docked at the top.
          for (let i = 0; i < plates.length; i += 1) {
            covers.push([plates[i], i + 1 < tops.length && tops[i + 1] <= 0]);
          }
          continue;
        }

        if (node.dataset.loom === 'deck-x') {
          sideways.push(node);
          continue;
        }

        const rect = node.getBoundingClientRect();
        if (node.dataset.loom === 'travel') {
          const span = rect.height - height;
          const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
          jobs.push([node, '--travel', p]);
        } else {
          const p = Math.min(1, Math.max(0, (height - rect.top) / (height + rect.height)));
          jobs.push([node, '--p', p]);
        }
      }

      doc.style.setProperty('--woven', woven.toFixed(4));
      for (const [node, prop, value] of jobs) node.style.setProperty(prop, value.toFixed(4));

      // The sideways deck is read AFTER those writes, and it has to be: its
      // plates are moved by the very --travel written above, so measuring
      // them in the pass before it answers for the previous frame and every
      // plate is guarded one scroll-step late. This is the one deliberate
      // read-after-write in the engine — one forced layout, only while that
      // band is on the glass, and the alternative is restating the
      // stylesheet's arrival arithmetic here where it could drift.
      for (const node of sideways) {
        const plates = [...node.children];
        // A plate has LANDED when its left edge is at the frame's own; a
        // couple of pixels of slack, because a translate resolves to
        // fractions. Anything else means it is still off to the left or part
        // way across, and either way it is not the plate being read.
        const landed = plates.map((plate) => plate.getBoundingClientRect().left > -2);
        for (let i = 0; i < plates.length; i += 1) {
          covers.push([plates[i], !landed[i] || (i + 1 < landed.length && landed[i + 1])]);
        }
      }

      for (const [plate, covered] of covers) {
        if (plate.inert !== covered) plate.inert = covered;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) live.add(entry.target);
          else live.delete(entry.target);
        }
        schedule();
      },
      { rootMargin: '20% 0% 20%' },
    );

    for (const node of document.querySelectorAll('[data-loom]')) watcher.observe(node);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      watcher.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
}

export default useLoom;
