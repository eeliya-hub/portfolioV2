import { useCallback, useEffect, useRef, useState } from 'react';

import Icon from './Icon.jsx';
import { Shamsa } from './Ornament.jsx';
import { SECTIONS, folio } from '../lib/chapters.js';
import { profile } from '../data/profile.js';
import { readEdition, setEdition } from '../lib/theme.js';
import { GRID, TURNED, outline } from '../lib/mark.js';

const ELSEWHERE = [
  { key: 'github', label: 'GitHub', icon: 'repo' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'external' },
  { key: 'cv', label: 'CV', icon: 'download' },
];

function EditionToggle() {
  const [edition, setLocal] = useState('day');

  // The inline script in <head> already applied the right edition; sync to
  // it after mount so the control never shows the wrong state.
  useEffect(() => setLocal(readEdition()), []);

  const toggle = () => {
    const next = edition === 'night' ? 'day' : 'night';
    setEdition(next);
    setLocal(next);
  };

  return (
    <button
      type="button"
      className="edition"
      onClick={toggle}
      aria-pressed={edition === 'night'}
      aria-label={edition === 'night' ? 'Switch to the day edition' : 'Switch to the night edition'}
      data-cursor-label={edition === 'night' ? 'Day' : 'Night'}
    >
      <span className="edition__face">
        <Icon name="sun" />
        <Icon name="moon" />
      </span>
    </button>
  );
}

/**
 * The menu — one menu, every width. Opening it is part of the experience
 * rather than a fallback for small screens: the five bands at display
 * scale, each with its Persian pair, over lacquer. Native `<dialog>`
 * handles modality, Escape and focus return, so none of that is
 * reimplemented here.
 */
function Menu({ active }) {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return undefined;
    const onClose = () => {
      setOpen(false);
      delete document.body.dataset.locked;
    };
    node.addEventListener('close', onClose);
    return () => node.removeEventListener('close', onClose);
  }, []);

  const show = () => {
    dialogRef.current?.showModal();
    document.body.dataset.locked = 'true';
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="burger"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-cursor="control"
      >
        <span className="burger__bars" aria-hidden="true">
          <span />
          <span />
        </span>
        Menu
      </button>

      <dialog className="menu on-lacquer" ref={dialogRef} aria-label="Sections">
        <div className="menu__inner">
          <div className="menu__top">
            <p className="menu__fa" lang="fa" dir="rtl" translate="no">
              {profile.namePersian}
            </p>
            <button type="button" className="iconbtn" onClick={close} aria-label="Close the menu">
              <Icon name="close" />
            </button>
          </div>

          <nav className="menu__nav">
            <ul className="menu__list">
              {SECTIONS.map((section, index) => (
                <li key={section.id} style={{ '--i': index }}>
                  <a
                    href={`#${section.id}`}
                    className="menu__link"
                    aria-current={active === section.id ? 'true' : undefined}
                    onClick={close}
                  >
                    <span className="menu__no figures" aria-hidden="true">
                      {folio(section.no)}
                    </span>
                    <span className="menu__word">{section.title}</span>
                    <span className="menu__pair" lang="fa" dir="rtl" aria-hidden="true">
                      {section.fa}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu__foot">
            <ul className="menu__elsewhere">
              {ELSEWHERE.map((entry) => (
                <li key={entry.key}>
                  <a
                    className="btn"
                    href={profile.links[entry.key]}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                  >
                    <Icon name={entry.icon} />
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
            <Shamsa className="menu__mark" />
          </div>
        </div>
      </dialog>
    </>
  );
}

// Traced once: the rows never change, so neither does the outline.
const MARK = outline(TURNED);

/**
 * The mark at the top left: ایلیا in square Kufic, turned to stand as an E
 * (see src/lib/mark.js), in the ruled square the monogram has always stood
 * in. Drawn in the bar's own ink, so it is charcoal on parchment, bone on
 * lacquer and cream over the madder close without being told which. The
 * same knots, in cream on a madder tile, are the tab icon.
 *
 * Nine knots of 2px each. A knot has to be a whole number of pixels or its
 * edges blur, and the bar sits at fractional offsets wherever the gutter is
 * a percentage of the glass — so the mark is a fixed eighteen pixels, and
 * `crispEdges` snaps every edge by the same fraction, which keeps every
 * stroke exactly two pixels wide wherever it lands.
 *
 * Decorative here: the link it sits in is already named for where it goes.
 */
function Mark() {
  return (
    <span className="monogram__mark" aria-hidden="true">
      <svg
        className="monogram__knots"
        viewBox={`0 0 ${GRID} ${GRID}`}
        focusable="false"
        shapeRendering="crispEdges"
      >
        <path d={MARK} fill="currentColor" />
      </svg>
    </span>
  );
}

// The band whose ground is dark in both editions — the madder close. Over
// it the fixed chrome takes bone ink; everywhere else it takes the
// edition's own ramp. Projects used to be here too, back when that band was
// pinned to lacquer.
const DUSK = new Set(['contact']);

export function TopBar({ active }) {
  return (
    <header className="topbar" data-dusk={DUSK.has(active) ? 'true' : undefined}>
      <div className="topbar__row">
        <a className="monogram" href="#hero" aria-label={`${profile.name}, back to the top`}>
          <Mark />
          <span className="monogram__name">{profile.name}</span>
        </a>

        <div className="topbar__actions">
          <EditionToggle />
          <Menu active={active} />
        </div>
      </div>
    </header>
  );
}

/**
 * The warp: the page's one thread, hung down the right edge.
 *
 * A carpet is woven from one end of the loom to the other, and so is this
 * page — the thread fills with `--woven`, which the loom engine writes on
 * the fill itself as the reader scrolls. On the fill, and not on the root:
 * the fill is the only thing on the site that reads the number, and a
 * custom property set on an element is inherited by everything under it,
 * so writing this one on the root was asking the browser to restyle the
 * whole page on every frame of every scroll. See lib/useLoom.js.
 *
 * Each band owns a knot on the thread; the knot of the band you are in is
 * struck open, and every knot is a control that carries you there.
 */
export function Warp({ active }) {
  return (
    <nav className="warp" aria-label="Progress" data-dusk={DUSK.has(active) ? 'true' : undefined}>
      <span className="warp__track" aria-hidden="true" />
      <span className="warp__fill" data-loom="woven" aria-hidden="true" />
      <ul className="warp__knots">
        {SECTIONS.map((section, index) => (
          <li key={section.id} style={{ '--i': index }}>
            <a
              className="warp__knot"
              href={`#${section.id}`}
              aria-current={active === section.id ? 'true' : undefined}
              aria-label={`${folio(section.no)}, ${section.title}`}
              data-cursor="control"
              data-cursor-label={section.label}
            >
              <span className="warp__gem" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TopBar;
