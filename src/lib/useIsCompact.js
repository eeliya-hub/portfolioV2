import { useEffect, useState } from 'react';

// True below the desktop breakpoint (phones + tablets). Components use this to
// swap in layouts designed for touch instead of scaled-down desktop mockups.
export function useIsCompact() {
  const getInitial = () => (typeof window === 'undefined' ? false : window.matchMedia('(max-width: 1023px)').matches);
  const [isCompact, setIsCompact] = useState(getInitial);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsCompact(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isCompact;
}
