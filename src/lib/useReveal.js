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
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // A little short of the bottom edge, so an element has started moving by
      // the time it is properly in view rather than finishing off-screen.
      // Threshold 0: any overlap at all counts, which keeps this working for
      // an element taller than the window.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
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
