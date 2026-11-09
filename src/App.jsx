import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TopBar } from './components/Chrome.jsx';
import Cursor from './components/Cursor.jsx';
import Dossier from './components/Dossier.jsx';
import Overture from './components/Overture.jsx';
import { Selvedge, Weave } from './components/Ornament.jsx';
import About from './chapters/About.jsx';
import Contact from './chapters/Contact.jsx';
import Hero from './chapters/Hero.jsx';
import Journey from './chapters/Journey.jsx';
import Stack from './chapters/Stack.jsx';
import Work from './chapters/Work.jsx';
import { CHAPTERS, SECTIONS } from './lib/chapters.js';
import { projects } from './data/projects.js';
import { useActiveChapter } from './lib/useActiveChapter.js';
import { useReveal } from './lib/useReveal.js';

const IDS = CHAPTERS.map((entry) => entry.id);
const HASH = '#work/';

const projectFromHash = () => {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH)) return null;
  const id = hash.slice(HASH.length);
  return projects.some((entry) => entry.id === id) ? id : null;
};

export function App() {
  const active = useActiveChapter(IDS);
  const [open, setOpen] = useState(null);
  // Where the reader was before a file was opened, so closing it restores
  // the address rather than leaving a dead project hash behind.
  const returnTo = useRef('');

  // Entrances are per element and fire as that element arrives, so a long
  // chapter does not animate its whole length the moment its top edge shows.
  useReveal();

  // The selvedge records where the reader has been, not only where they are:
  // a carpet does not unweave itself when you walk back up it.
  const [reached, setReached] = useState(() => new Set());
  useEffect(() => {
    setReached((current) => (current.has(active) ? current : new Set(current).add(active)));
  }, [active]);

  const openProject = useCallback((id) => {
    returnTo.current = window.location.hash;
    window.history.replaceState(null, '', `${HASH}${id}`);
    setOpen(id);
  }, []);

  const closeProject = useCallback(() => {
    setOpen((current) => {
      if (current) window.history.replaceState(null, '', returnTo.current || '#work');
      return null;
    });
  }, []);

  // A project address is shareable: landing on one opens that file, and the
  // back and forward buttons move between the register and the file.
  useEffect(() => {
    const sync = () => setOpen(projectFromHash());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const stations = useMemo(() => SECTIONS, []);

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>

      <Overture />
      <Cursor />

      <Weave />
      <Selvedge side="left" stations={stations} reached={reached} active={active} />
      <Selvedge side="right" stations={stations} reached={reached} active={active} />

      <TopBar active={active} />

      <main className="chapters">
        <Hero />
        <About />
        <Work onOpen={openProject} />
        <Journey />
        <Stack onOpen={openProject} />
        <Contact />
      </main>

      <Dossier id={open} onClose={closeProject} />
    </>
  );
}

export default App;
