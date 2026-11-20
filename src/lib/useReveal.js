import { useEffect } from 'react';

/**
 * Reveals elements as they enter the viewport rather than when their chapter
 * becomes "active".
 *
 * The chapter-wide flag was the wrong unit: everything in a section fired at
 * once the moment the section was mostly on screen, which on a long section
 * meant half of it had already animated above the fold. An element is the
 * right unit — it moves when you actually reach it.
 *
 * The observer is built once and never rebuilt. That matters: this page
 * re-renders on scroll to track the active chapter, and an observer torn down
 * and recreated on each of those renders is disconnected again before it ever
 * gets to deliver its first callback, so nothing reveals while you are moving
 * quickly. A MutationObserver picks up anything React mounts afterwards, and
 * each element is unobserved as it lands: a reveal is a one-way trip.
 */
export function useReveal() {
  useEffect(() => {
    const reveal = (node) => node.classList.add('is-in');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const node of document.querySelectorAll('.reveal')) reveal(node);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // An element has arrived when either test passes, and it needs both
          // tests because the page is built two ways at once.
          //
          // The second test is the original one: the element's top has risen
          // past a band held off the bottom edge, so it starts moving by the
          // time it is properly in view rather than finishing off-screen.
          // That is right for a column you scroll down, and it is wrong for a
          // chapter that is exactly one frame tall — there, whatever stands in
          // that bottom band is in full view with no further scroll inside the
          // chapter to release it, so it stayed hidden while the reader looked
          // straight at it and then appeared as they left. That is how both
          // guard bands were being missed.
          //
          // The first test covers it: something the window contains entirely
          // is not something barely peeking in, whatever height it sits at.
          const room = entry.rootBounds?.height ?? window.innerHeight;
          const whole = entry.intersectionRatio >= 0.92;
          const risen = entry.boundingClientRect.top <= room * 0.92;
          if (!whole && !risen) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Thresholds, not a rootMargin: the band is applied in the callback now,
      // because a margin cannot express "or". 0 catches first contact for an
      // element taller than the window, which never reaches 0.92 at all.
      { threshold: [0, 0.92, 1] },
    );

    const watch = (root) => {
      for (const node of root.querySelectorAll('.reveal:not(.is-in)')) observer.observe(node);
    };

    watch(document);

    const mounted = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.classList.contains('reveal')) observer.observe(node);
          watch(node);
        }
      }
    });
    mounted.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mounted.disconnect();
    };
  }, []);
}

export default useReveal;
