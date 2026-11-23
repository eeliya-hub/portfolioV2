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
 *   data-loom="woven"   --woven   0 → 1 down the whole page. The warp's fill
 *                                 at the right edge is the one thing that
 *                                 shows it, and it is written on that span
 *                                 rather than on the root. See WHERE A
 *                                 NUMBER IS WRITTEN below.
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
 * WHERE A NUMBER IS WRITTEN. A custom property is inherited, so setting one
 * marks every element under the element it is set on for a style
 * recalculation. Set it on the document root and that is the whole page,
 * once per scroll frame, however few elements actually read it.
 *
 * --woven was written on the root, and it is read by exactly one rule: the
 * scaleY on the warp's fill, a childless span at the right edge. The page is
 * long and its markup is dense, so that one write cost a full-document
 * recalculation on every frame of every scroll: about 33ms a frame on a
 * phone, which is two frames missed out of three, everywhere, in every
 * chapter, including the ones that animate nothing at all. Writing it on the
 * span instead recalculates one element with nothing inside it, and the same
 * passes hold 60fps.
 *
 * So: nothing is written to the root, and a number is written as far down the
 * tree as the thing that reads it. --travel is written on the two sections
 * whose own stylesheets do the work (02's deck and 03's route), which is as
 * high as it can go, and both are measured passes rather than assumed.
 *
 * WEIGHT. A pinned chapter is paced in screens of scroll, so a wheel covers
 * as much of it as it covers of the page, and one flick of a trackpad is
 * most of a plate. That was hidden while a desk was dropping two frames in
 * three: a deal nobody can see all of reads as slower than it is. With every
 * frame drawn it read as too quick, so on a desk the travel is not the
 * scroll's own number but a value chasing it, closing the distance to it by
 * the same fraction every millisecond: a flick is answered at once and
 * arrives over about two thirds of a second, which reads as weight rather
 * than lag. Chosen against three other ways of pacing it, by watching them,
 * and then made a touch heavier than it was tried at. The scrollbar stays
 * honest the whole time, since nothing about the page's length changes;
 * only the drawing trails. It is left off a touch screen, where a finger
 * already paces the thing, and off for a reader who asked for stillness,
 * who is not running this engine at all.
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
    // The root is still read for the page's own length. It is never written.
    const thread = document.querySelector('[data-loom="woven"]');
    const live = new Set();
    let frame = 0;

    // The weight, and what carries it: how long the travel takes to close
    // the distance to the scroll, and the value each node is drawn at while
    // it is still closing. SETTLE is the one knob: the time it takes to
    // close all but a third of the distance. Lower is tighter; above about
    // 300 it stops reading as weight and starts reading as lag.
    const SETTLE = 220;
    const desk = window.matchMedia('(hover: hover) and (pointer: fine)');
    const drawn = new Map();
    let last = 0;

    const write = (now = 0) => {
      frame = 0;
      const step = last ? Math.min(100, now - last) : 16;
      last = now;
      // Read once a frame rather than once a node: a window can move from a
      // screen with a pointer to one without.
      const weighted = desk.matches;
      let chasing = false;
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
          // Chasing it, or standing on it. The same fraction of whatever is
          // left every millisecond, which is the one easing that does not
          // care how long a frame took: a dropped frame moves it further,
          // not faster, so the weight is the same at any frame rate.
          let value = p;
          if (weighted) {
            const was = drawn.get(node);
            value = was === undefined ? p : was + (p - was) * (1 - Math.exp(-step / SETTLE));
            // Within half a pixel of scroll it lands, exactly. A chase that
            // simply stopped near enough stopped at a fixed fraction of the
            // whole leg, and the deck's leg is so long that the fraction was
            // four pixels: its plates came to rest four pixels short of
            // square.
            if (Math.abs(p - value) <= 0.5 / Math.max(1, span)) value = p;
            else chasing = true;
            drawn.set(node, value);
          } else if (drawn.size) {
            drawn.delete(node);
          }
          jobs.push([node, '--travel', value]);
        } else {
          const p = Math.min(1, Math.max(0, (height - rect.top) / (height + rect.height)));
          jobs.push([node, '--p', p]);
        }
      }

      if (thread) thread.style.setProperty('--woven', woven.toFixed(4));
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

      // A travel still closing the distance asks for the next frame itself:
      // the scroll has stopped sending them and the drawing has not
      // arrived yet.
      if (chasing) schedule();
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

    // The warp's fill is fixed to the glass and is never not on it, so it is
    // not one of the sections the observer keeps or drops.
    for (const node of document.querySelectorAll('[data-loom]:not([data-loom="woven"])')) {
      watcher.observe(node);
    }

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
