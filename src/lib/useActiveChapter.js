import { useEffect, useState } from 'react';

/**
 * Tracks which chapter is on screen, so each one can play its entrance as it
 * arrives and the rail can mark where you are.
 */
export function useActiveChapter(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    // The observer hands over only the chapters that just crossed a
    // threshold, never all of them, so the share each one is showing has to
    // be kept here. Comparing within a single callback marked whichever
    // chapter happened to cross last — which, once chapter 02 was short
    // enough to leave the frame in one go, was the one being scrolled away
    // from rather than the one arriving.
    const showing = new Map(sections.map((section) => [section.id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          showing.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        // The chapter showing most of itself wins.
        let best = null;
        for (const [id, ratio] of showing) {
          if (ratio > (best?.ratio ?? 0)) best = { id, ratio };
        }
        if (best) setActive(best.id);
      },
      { threshold: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
