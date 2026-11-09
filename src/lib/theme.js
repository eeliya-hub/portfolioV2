// Two editions of the same record: day on parchment, night on lacquer. The
// inline script in index.html sets the initial value before first paint, so
// a night visitor never sees the ivory flash past; this only handles changes.

const KEY = 'edition';

export const readEdition = () => {
  if (typeof document === 'undefined') return 'day';
  return document.documentElement.dataset.theme === 'night' ? 'night' : 'day';
};

export const setEdition = (edition) => {
  document.documentElement.dataset.theme = edition;
  try {
    localStorage.setItem(KEY, edition);
  } catch {
    // Private browsing, or storage blocked. The choice holds for this page.
  }
};
