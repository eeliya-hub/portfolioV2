import { useEffect, useRef, useState } from 'react';

import Announce from '../components/Announce.jsx';
import { folio } from '../lib/chapters.js';
import { chronology } from '../data/journey.js';

/**
 * 03 — the route, which folds into the record.
 *
 * The section is given several screens of height and its viewport is pinned;
 * the scroll it absorbs becomes travel, and the whole chronology rides past
 * horizontally on a single madder thread. Every chapter of the record hangs
 * from that one thread at the date it BEGAN — education above, work below —
 * and nothing is drawn to say where it ended. A bar spanning start to end
 * made the chart a Gantt nobody asked for; the point of this chapter is when
 * each thing started and what order they came in, and the full span is given
 * in words where there is room to read it.
 *
 * The pinned leg has four phases, all plain arithmetic on the one number the
 * loom engine writes:
 *
 *   travel 0 → 0.56     the ride: the thread crosses the glass end to end
 *   travel 0.56 → 0.82  the fold: the cards shed, and then the track reels
 *                       in — contracting to the width of the glass and
 *                       lifting to the head of the frame, so what is left is
 *                       an axis of the same knots and the same years. The
 *                       reader watches eight years of track compress into
 *                       one line rather than cross-fade into a different
 *                       drawing of it.
 *   travel 0.80 → 0.94  the unroll: the roll writes itself out beneath the
 *                       axis, a row at a time, each wiping in from the left.
 *   travel 0.94 → 1     the hold: axis and roll, standing together.
 *
 * So the chapter is read twice — once as time, once as a roll — and the
 * second reading keeps the first above it instead of replacing it. The two
 * are tied together by number: every knot on the axis is numbered and so is
 * every row of the roll, which means a reader can see where any entry sits
 * in the eight years without doing anything at all. Pointing at a row lights
 * its knot on top of that, for anyone who would rather point than read a
 * figure.
 *
 * For a reader who asked for stillness the pin is released: the thread
 * becomes a native horizontal scroller and the record simply stands under
 * it, both at once, neither on a trigger.
 */

/* --- The axis ---------------------------------------------------------------
   Time is drawn to a squeezed scale rather than a linear one. Three years
   pass between the GCSEs and the A-Levels with nothing to put on the thread,
   and a linear axis spends a third of its length drawing that nothing — the
   reader scrolls through an empty quarter of the chapter to reach the half
   where everything happens. So each calendar year is given a full share of
   the track if something begins in it and a quarter share if nothing does.

   The squeeze is declared, not hidden: the years stay labelled at their own
   positions, and every compressed run is struck through with a break mark,
   the way a broken axis is marked on a printed chart. A reader who looks can
   see exactly where the scale changes and by how much.                     */

/** The share of the track a year with nothing in it is given. */
const QUIET = 0.26;

const FROM = Math.floor(Math.min(...chronology.map((entry) => entry.from)));
const TO = Math.ceil(Math.max(...chronology.map((entry) => entry.from)));

/** One weight per [year, year + 1) interval: 1 if occupied, QUIET if not. */
const WEIGHTS = [];
for (let year = FROM; year < TO; year += 1) {
  WEIGHTS.push(chronology.some((entry) => Math.floor(entry.from) === year) ? 1 : QUIET);
}

const TOTAL = WEIGHTS.reduce((sum, weight) => sum + weight, 0);

/** Cumulative share of the track at the start of each year. */
const OFFSET = [0];
for (const weight of WEIGHTS) OFFSET.push(OFFSET[OFFSET.length - 1] + weight / TOTAL);

/** A decimal year → its share of the squeezed axis, 0 → 1. */
const share = (year) => {
  const i = Math.min(WEIGHTS.length - 1, Math.max(0, Math.floor(year) - FROM));
  return OFFSET[i] + ((year - (FROM + i)) * WEIGHTS[i]) / TOTAL;
};

/** …and into 3–92% of the track, so the ends stand clear and a card fits. */
const at = (year) => `${(3 + share(year) * 89).toFixed(3)}%`;

/**
 * The labelled ticks. A year is labelled only if it touches a year that was
 * given a full share — inside a squeezed run the ticks would stand a few
 * pixels apart and their labels would simply overprint each other, and the
 * break mark says what is there instead.
 *
 * `edge` marks the last label before a break. On a phone the folded axis is
 * one screen wide and even the labels that survive are too close, so those
 * two fade out as the axis contracts; the labelled years that remain are
 * the ones the chronology actually resumes on.
 */
const YEARS = [];
for (let year = FROM; year < TO; year += 1) {
  const i = year - FROM;
  if (WEIGHTS[i - 1] !== 1 && WEIGHTS[i] !== 1) continue;
  YEARS.push({ year, edge: WEIGHTS[i] !== 1 });
}

/** Every maximal run of squeezed years, for the break marks. */
const BREAKS = [];
for (let i = 0; i < WEIGHTS.length; i += 1) {
  if (WEIGHTS[i] === 1) continue;
  let end = i;
  while (end + 1 < WEIGHTS.length && WEIGHTS[end + 1] !== 1) end += 1;
  BREAKS.push({ id: FROM + i, mid: FROM + (i + end + 1) / 2 });
  i = end;
}

/**
 * The span the chapter actually covers, taken from the entries themselves
 * rather than from the padded axis — the padding is nobody's history. An
 * entry still running contributes only its start: the chronology reaches as
 * far as the latest date it can point at, and inventing a present date for
 * it would be inventing a fact.
 */
const FIRST = Math.floor(Math.min(...chronology.map((entry) => entry.from)));
const LAST = Math.floor(
  Math.max(...chronology.flatMap((entry) => [entry.from, entry.to ?? 0])),
);

/* --- The entries ---------------------------------------------------------- */

/** Chronological: the order they ride past, and the order a reader walks. */
const SEQUENCE = [...chronology].sort((a, b) => a.from - b.from);

const KINDS = { education: 'Education', experience: 'Experience' };

/**
 * The date a chapter began, taken off the front of the period rather than
 * written down a second time — `period` stays the one copy of the dates.
 * 'Sep 2018 – Jul 2021' → 'Sep 2018'; 'Jul 2022' → 'Jul 2022'.
 */
const began = (period) => period.split('–')[0].trim();

/* One quick line for a card, cut off the front of the entry's own detail.
   Nothing here is written a second time: the card and the record cannot say
   different things, because there is only ever one copy of the words. The
   card gets the opening claim and the record, further down the same leg,
   gets the whole of it.

   A first sentence is not by itself a quick line. The longest one here runs
   to two hundred and forty characters, which is six lines of type on a card
   seventeen rems wide — a paragraph riding past on a thread, read by nobody,
   and the two newest chapters were the two buried deepest in it. So a line
   over CARD characters is cut back to the first whole clause past CLAUSE,
   never mid-clause and never with an ellipsis, and closed with a full stop.
   What stands on a card is always a whole clause in the writer's own words,
   and always ends like a sentence. */

/** How long a card's line may run before it is cut back. */
const CARD = 86;
/** And how short a cut line may be left: a clause, not a fragment. */
const CLAUSE = 60;
/**
 * Where a clause may be cut, strongest boundary first. Punctuation is a
 * boundary the writer put there. A joining word is weaker, and `and` is the
 * weakest of all, because it joins two nouns as readily as two clauses: cut
 * at the `and` in 'the lead developer and founder' and the card drops half a
 * phrase, where cutting at the `whilst` after it ends on a whole one.
 */
const MARKS = [[', ', '; '], [' whilst ', ' while ', ' alongside '], [' and ']];

const brief = (detail) => {
  const stop = detail.indexOf('. ');
  const line = (stop < 0 ? detail : detail.slice(0, stop)).replace(/\.$/, '');
  if (line.length <= CARD) return `${line}.`;
  // The first break past CLAUSE, not the last one that fits: the last one
  // that fits lands in the middle of a list and leaves its tail hanging
  // ('alongside A-Levels, the degree'), where the first one past the floor
  // closes the clause it is in.
  for (const tier of MARKS) {
    const cuts = tier.map((mark) => line.indexOf(mark, CLAUSE)).filter((at) => at > 0);
    if (cuts.length) return `${line.slice(0, Math.min(...cuts))}.`;
  }
  return `${line}.`;
};

function Station({ entry, index, lit }) {
  return (
    <article
      className="station"
      data-kind={entry.kind}
      data-side={index % 2 ? 'under' : 'over'}
      data-lit={lit ? 'true' : undefined}
      style={{ '--at': at(entry.from), '--i': index }}
    >
      <span className="station__drop" aria-hidden="true" />
      <span className="station__gem" aria-hidden="true" />
      {/* The knot's number, and the thing that survives the shed: it is how
          the roll below finds its way back onto the axis. It sits on the
          empty side of the thread — the side this entry's card is NOT on —
          and since the stations alternate sides, two knots close enough to
          collide always carry their numbers on opposite sides. */}
      <span className="station__no figures" aria-hidden="true">
        {folio(index + 1)}
      </span>
      <div className="station__card">
        <p className="station__when figures">{began(entry.period)}</p>
        <h3 className="station__role">{entry.role}</h3>
        {entry.org ? <p className="station__org">{entry.org}</p> : null}
        <p className="station__brief">{brief(entry.detail)}</p>
      </div>
    </article>
  );
}

export function Journey() {
  // Which row the pointer is on, so its knot can light on the axis above it.
  // Decoration, and only decoration: nothing is reachable through it and the
  // record reads the same whether a pointer exists or not.
  const [lit, setLit] = useState(-1);

  // The roll's height as typeset, for the stylesheet's arithmetic: it works
  // out how much of the record the frame under the axis cannot hold, and
  // leaves that much room after the leg (see --roll-over). The laid-out
  // height, so the translate and the wipe the roll rides in on do not enter
  // into it. Copy grows, and the record grows with it; nothing here is
  // tuned to the entries as they stand.
  const leg = useRef(null);
  const roll = useRef(null);
  useEffect(() => {
    const route = leg.current;
    const record = roll.current;
    if (!route || !record || typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(() => {
      route.style.setProperty('--roll-h', `${record.offsetHeight}px`);
    });
    watch.observe(record);
    return () => watch.disconnect();
  }, []);

  return (
    <section className="chapter chapter--sand journey" id="journey" aria-labelledby="journey-heading">
      <div className="chapter__inner">
        <Announce id="journey" figure={`${FIRST} – ${LAST}`} />
      </div>

      <div className="route" data-loom="travel" ref={leg}>
        <div className="route__pin">
          {/* The full view names itself, above the axis it is read under.
              By the time it is read the band's announcement is two screens
              back up the leg, so without this the reader arrives at a ruled
              table with nothing saying what it is a table of. It arrives on
              the unroll like everything else in the full view; every figure
              in it is derived, never written. */}
          <header className="route__head">
            <h3 className="route__title">The full record</h3>
            <p className="route__sub">
              All my academic and professional experiences since {FIRST}.
            </p>
          </header>

          {/* The ride, which becomes the axis. Drawn from the same data as
              the record below and kept from the screen reader, which gets
              the record and only the record. */}
          <div className="route__ride" aria-hidden="true">
            <div className="route__window">
              <div className="route__track">
                <div className="route__thread">
                  <span className="route__line" />

                  {YEARS.map(({ year, edge }, index) => (
                    <span
                      className="route__year"
                      key={year}
                      data-edge={edge ? 'true' : undefined}
                      data-end={index === 0 ? 'first' : index === YEARS.length - 1 ? 'last' : undefined}
                      style={{ '--at': at(year) }}
                    >
                      <span className="route__tick" />
                      <span className="route__date figures">{year}</span>
                    </span>
                  ))}

                  {/* Where the scale is squeezed, struck as a break. */}
                  {BREAKS.map((gap) => (
                    <span className="route__break" key={gap.id} style={{ '--at': at(gap.mid) }} />
                  ))}
                </div>

                {SEQUENCE.map((entry, index) => (
                  <Station key={entry.id} entry={entry} index={index} lit={lit === index} />
                ))}
              </div>
            </div>

            <p className="route__hint label">Keep scrolling: the thread runs sideways</p>
          </div>

          {/* The roll: everything, ruled, under the axis it came off. This is
              the chapter's real content — the ride above is drawn from the
              same data and kept from the screen reader, which gets the roll
              and only the roll. Every cell is a direct child of its row, so
              one grid can set four columns on a desk and two on a phone
              without the markup changing underneath it. */}
          <div className="roll" ref={roll} onPointerLeave={() => setLit(-1)}>
            <div className="roll__head" aria-hidden="true">
              <span className="label">When</span>
              <span className="label">What</span>
              <span className="label">Where</span>
              <span className="label">What it was</span>
            </div>

            <ol className="roll__rows">
              {SEQUENCE.map((entry, index) => (
                <li
                  className="roll__row"
                  data-kind={entry.kind}
                  data-lit={lit === index ? 'true' : undefined}
                  style={{ '--i': index }}
                  key={entry.id}
                  onPointerEnter={() => setLit(index)}
                >
                  <p className="roll__when figures">
                    <span className="roll__no" aria-hidden="true">
                      {folio(index + 1)}
                    </span>
                    {entry.period}
                  </p>
                  <h3 className="roll__role">{entry.role}</h3>
                  <p className="roll__kind label">{KINDS[entry.kind]}</p>
                  {entry.org && <p className="roll__org">{entry.org}</p>}
                  <p className="roll__detail">{entry.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Journey;
