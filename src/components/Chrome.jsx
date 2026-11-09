import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import Icon from './Icon.jsx';
import { Shamsa } from './Ornament.jsx';
import { SECTIONS } from '../lib/chapters.js';
import { folio } from '../lib/chapters.js';
import { profile } from '../data/profile.js';
import { readEdition, setEdition } from '../lib/theme.js';

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
 * The section nav. The marker is one element that slides and resizes onto the
 * active link rather than a border that blinks between them — measured from
 * the links themselves, so it stays correct through font loading and resize.
 */
function SectionNav({ active }) {
  const listRef = useRef(null);
  const linkRefs = useRef(new Map());
  const [marker, setMarker] = useState(null);

  const place = useCallback(() => {
    const list = listRef.current;
    const link = linkRefs.current.get(active);
    if (!list || !link) return setMarker(null);
    const a = link.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    return setMarker({ left: a.left - b.left + list.scrollLeft, width: a.width });
  }, [active]);

  useLayoutEffect(() => {
    place();
    const onResize = () => place();
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(place);
    return () => window.removeEventListener('resize', onResize);
  }, [place]);

  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav__list" ref={listRef}>
        {marker ? (
          /* 100px wide and scaled, so it slides and resizes on the
             compositor rather than relaying out every frame. */
          <span
            className="nav__marker"
            aria-hidden="true"
            style={{ '--x': `${marker.left}px`, '--s': marker.width / 100 }}
          />
        ) : null}
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            ref={(node) => {
              if (node) linkRefs.current.set(section.id, node);
              else linkRefs.current.delete(section.id);
            }}
            className="nav__link"
            href={`#${section.id}`}
            aria-current={active === section.id ? 'true' : undefined}
          >
            <span className="nav__no figures">{folio(section.no)}</span>
            <span className="nav__label">{section.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/**
 * The compact menu: a full panel rather than a cramped dropdown, because at
 * this width the nav is the page for as long as it is open. Native `<dialog>`
 * handles modality, Escape and focus return, so none of that is reimplemented
 * here.
 */
function CompactMenu({ active }) {
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
      >
        <span className="burger__bars" aria-hidden="true">
          <span />
          <span />
        </span>
        Menu
      </button>

      <dialog className="menu" ref={dialogRef} aria-label="Sections">
        <div className="menu__inner">
          <div className="menu__top">
            <p className="menu__fa" lang="fa" dir="rtl">
              {profile.namePersian}
            </p>
            <button type="button" className="iconbtn" onClick={close} aria-label="Close the menu">
              <Icon name="close" />
            </button>
          </div>

          <nav>
            <ul className="menu__list">
              {SECTIONS.map((section, index) => (
                <li key={section.id} style={{ '--i': index }}>
                  <a
                    href={`#${section.id}`}
                    className="menu__link"
                    aria-current={active === section.id ? 'true' : undefined}
                    onClick={close}
                  >
                    <span className="menu__no figures">{folio(section.no)}</span>
                    <span className="menu__word">{section.title ?? section.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Shamsa className="menu__mark" />

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
        </div>
      </dialog>
    </>
  );
}

export function TopBar({ active }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="topbar__row">
        <a className="monogram" href="#hero" aria-label={`${profile.name} — back to the top`}>
          <span className="monogram__mark" aria-hidden="true">
            EN
          </span>
          <span className="monogram__name">{profile.name}</span>
        </a>

        <SectionNav active={active} />

        <div className="topbar__actions">
          {ELSEWHERE.map((entry) => (
            <a
              key={entry.key}
              className="iconlink"
              href={profile.links[entry.key]}
              target="_blank"
              rel="noreferrer"
              aria-label={`${entry.label} (opens in a new tab)`}
              data-cursor-label={entry.label}
            >
              <Icon name={entry.icon} />
            </a>
          ))}
          <span className="topbar__divider" aria-hidden="true" />
          <EditionToggle />
        </div>

        <CompactMenu active={active} />
      </div>

      <span className="topbar__progress" aria-hidden="true" />
    </header>
  );
}

export default TopBar;
