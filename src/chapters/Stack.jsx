import { useCallback, useEffect, useRef, useState } from 'react';

import Announce from '../components/Announce.jsx';
import Icon from '../components/Icon.jsx';
import { stackRegisters } from '../data/stack.js';
import { picture } from '../lib/media.js';

/**
 * 04 — the running bands.
 *
 * Five registers, five bands, and the bands run: every name rides past the
 * way a border pattern repeats along a carpet, each band at its own pace and
 * every second one the other way. Nothing is behind a tab or a click — the
 * whole stack is on the page at once, moving.
 *
 * Each name carries its own mark. A product carries its own logo; a practice
 * carries a glyph drawn in this site's stroke, because a way of working has
 * no logo and borrowing one for it would be a claim about a tool rather than
 * a description of the work. Where a product has no logo file the mark is a
 * monogram struck in the site's octagon — a drawn mark rather than a hole.
 *
 * The motion is one CSS animation on one transform. Each band holds its list
 * twice and the second lap is aria-hidden: the first lap is the register, the
 * second is the mechanism that makes the loop seamless. A fine pointer can
 * hold a band still by resting on it, and a reader who asked for stillness
 * gets all five bands standing, wrapped, with nothing duplicated visible.
 */
const TOTAL = stackRegisters.reduce((sum, group) => sum + group.items.length, 0);

// Seconds per lap. Different rates read as texture; one rate reads as a
// machine. Slowest where the names are longest.
//
// Set about 1.8x slower than they first ran. A band that moves at reading
// pace is a band the reader fights — they start tracking a name across the
// glass instead of taking the register in. These are meant to drift at the
// edge of noticing, the way a border pattern does when you are looking at
// the field.
const PACE = [94, 130, 158, 100, 116];

/** One item's mark: its logo, its glyph, or its monogram. */
function Mark({ item }) {
  if (item.logo) {
    const image = picture(`logos/${item.logo}`);
    if (!image) return null;
    return (
      <span className="run__mark" data-dark={item.dark ? 'true' : undefined}>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="2rem"
          width={image.width}
          height={image.height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }

  if (item.icon) {
    return (
      <span className="run__mark run__mark--drawn">
        <Icon name={item.icon} />
      </span>
    );
  }

  return (
    <span className="run__mark run__mark--mono" aria-hidden="true">
      {/* The letters are sized on their own element. Set on the tile, the
          smaller font-size would resolve the tile's own `em` box against
          itself and the monogram would come out a third of every other
          mark in the band. */}
      <span className="run__mono">{item.mono}</span>
    </span>
  );
}

function Lap({ items, hidden }) {
  return (
    <ul className="run__lap" aria-hidden={hidden ? 'true' : undefined}>
      {items.map((item) => (
        <li className="run__item" key={item.name}>
          <Mark item={item} />
          <span className="run__name-text">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

/* --- The sampler ------------------------------------------------------------
   A band is read by letting it go past; it is not read by looking something
   up in it. A reader who wants to know whether one particular name is in
   there has to stand and wait for it to come round, and on a phone, where
   the bands are the whole chapter, that is the only way through.

   So the same five registers are given a second reading that stands still:
   every name at once, ruled, under a toggle that takes the list down to one
   register at a time. It is the weaver's sampler to the carpet's border —
   the same knots, set out to be looked up rather than looked at.            */

const ALL = 'all';

/** The toggle's entries: everything, then each register, each with its count. */
const TABS = [
  { id: ALL, title: 'All', count: TOTAL },
  ...stackRegisters.map((register) => ({
    id: register.id,
    title: register.title,
    count: register.items.length,
  })),
];

function Sampler({ open, onClose }) {
  const ref = useRef(null);
  const tabs = useRef(null);
  const [shown, setShown] = useState(false);
  const [at, setAt] = useState(ALL);

  const close = useCallback(() => {
    const node = ref.current;
    if (!node?.open) return onClose();
    setShown(false);
    return setTimeout(() => node.close(), 200);
  }, [onClose]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (open && !node.open) {
      node.showModal();
      document.body.dataset.locked = 'true';
      setAt(ALL);
      requestAnimationFrame(() => setShown(true));
    }

    const onCancel = (event) => {
      event.preventDefault();
      close();
    };
    const onClosed = () => {
      delete document.body.dataset.locked;
      onClose();
    };

    node.addEventListener('cancel', onCancel);
    node.addEventListener('close', onClosed);
    return () => {
      node.removeEventListener('cancel', onCancel);
      node.removeEventListener('close', onClosed);
    };
  }, [open, close, onClose]);

  useEffect(() => () => delete document.body.dataset.locked, []);

  // The arrow keys walk the toggle, which is what a tablist owes a reader
  // who is not using a pointer. Home and End go to the ends; the tab that
  // takes focus is the tab that is chosen, so nothing has to be confirmed.
  const walk = (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const here = TABS.findIndex((tab) => tab.id === at);
    let next = -1;
    if (event.key in keys) next = (here + keys[event.key] + TABS.length) % TABS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = TABS.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setAt(TABS[next].id);
    tabs.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  const showing = at === ALL ? stackRegisters : stackRegisters.filter((r) => r.id === at);

  return (
    <dialog
      className="sampler"
      ref={ref}
      data-shown={shown ? 'true' : undefined}
      aria-labelledby="sampler-title"
      onClick={(event) => {
        if (event.target === ref.current) close();
      }}
    >
      <div className="sampler__sheet">
        <header className="sampler__bar">
          <div>
            <h2 className="sampler__title" id="sampler-title">
              The full stack
            </h2>
            <p className="sampler__figure label figures">{TOTAL} in all</p>
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={close}
            aria-label="Close the list"
            data-cursor="close"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="sampler__tabs" role="tablist" aria-label="Registers" ref={tabs} onKeyDown={walk}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`sampler-tab-${tab.id}`}
              className="sampler__tab"
              aria-selected={tab.id === at}
              aria-controls="sampler-list"
              tabIndex={tab.id === at ? 0 : -1}
              onClick={() => setAt(tab.id)}
              data-cursor="control"
            >
              {tab.title}
              <span className="sampler__count figures">{tab.count}</span>
            </button>
          ))}
        </div>

        <div
          className="sampler__list"
          id="sampler-list"
          role="tabpanel"
          aria-labelledby={`sampler-tab-${at}`}
          tabIndex={0}
        >
          {showing.map((register) => (
            <section className="sampler__reg" key={register.id}>
              <h3 className="sampler__regname label">
                {register.title}
                <span className="sampler__count figures">{register.items.length}</span>
              </h3>
              <ul className="sampler__names">
                {register.items.map((item) => (
                  <li className="sampler__name" key={item.name}>
                    <Mark item={item} />
                    <span className="sampler__who">{item.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export function Stack() {
  const [open, setOpen] = useState(false);
  const shut = useCallback(() => setOpen(false), []);

  return (
    <section className="chapter stack" id="stack" aria-labelledby="stack-heading">
      <div className="chapter__inner">
        <Announce id="stack" figure={`${TOTAL} in all`} />
      </div>

      <div className="runs">
        {stackRegisters.map((register, index) => (
          <section
            className="run reveal"
            style={{ '--i': index, '--lap': `${PACE[index % PACE.length]}s` }}
            data-back={index % 2 ? 'true' : undefined}
            key={register.id}
            aria-label={register.title}
          >
            <h3 className="run__name label">{register.title}</h3>
            <div className="run__belt">
              <Lap items={register.items} />
              <Lap items={register.items} hidden />
            </div>
          </section>
        ))}
      </div>

      {/* Quiet, and at the foot where a reader who has watched the bands
          go by and wants the whole thing in one place will look for it. */}
      <div className="runs__foot">
        <button type="button" className="quietbtn" onClick={() => setOpen(true)} data-cursor="control">
          <Icon name="register" />
          View all {TOTAL}
        </button>
      </div>

      <Sampler open={open} onClose={shut} />
    </section>
  );
}

export default Stack;
