import { useRef, useState } from 'react';

import ChapterHead from '../components/ChapterHead.jsx';
import Icon from '../components/Icon.jsx';
import { chronology, chronologyKinds, chronologyRange } from '../data/journey.js';
import { folio } from '../lib/chapters.js';

const SPAN = chronologyRange.to - chronologyRange.from;
const at = (year) => ((year - chronologyRange.from) / SPAN) * 100;
const until = (entry) => entry.to ?? chronologyRange.to;

// One tick per whole year inside the range.
const YEARS = [];
for (let year = Math.ceil(chronologyRange.from); year <= Math.floor(chronologyRange.to); year += 1) {
  YEARS.push(year);
}

// The span the chapter actually covers, taken from the entries rather than
// from the axis — the axis is padded at both ends so the bars are not flush
// against it, and that padding is nobody's history.
const FIRST = Math.floor(Math.min(...chronology.map((entry) => entry.from)));
const LAST = Math.floor(Math.max(...chronology.map(until)));

// The order the leaf steps through and numbers by: when each one began. The
// lanes group by kind, but "how it went" is read in time.
const SEQUENCE = [...chronology].sort((a, b) => a.from - b.from);

const LANES = chronologyKinds.map((lane) => ({
  ...lane,
  entries: SEQUENCE.filter((entry) => entry.kind === lane.kind),
}));

// The order the rows stand in on screen, lane by lane. The arrow keys walk
// this one, because they are spatial; Earlier and Later walk SEQUENCE,
// because they are about time.
const DISPLAY = LANES.flatMap((lane) => lane.entries);

const KIND = Object.fromEntries(chronologyKinds.map((lane) => [lane.kind, lane.title]));

// Everything that was running at the same time as an entry, worked out from
// the dates — the overlaps the chart draws, said in words.
const alongside = (entry) =>
  SEQUENCE.filter(
    (other) => other.id !== entry.id && other.from < until(entry) && entry.from < until(other),
  );

/**
 * The chronology, drawn as a loom.
 *
 * The years are the warp — fixed threads running down the chart — and each
 * chapter of the life is a weft bar crossing them, in two lanes, Education
 * and Experience, the way the CV divides them. That is the whole reason this
 * is a chart rather than a list: six years of retail run underneath school,
 * the degree and every placement, and a stacked list of dates hides exactly
 * that. Nothing here is positioned by hand; every bar is struck from the
 * dates in the data.
 *
 * Each row names the role and the organisation outright, and the leaf beside
 * the chart carries the rest. Choosing is a click, never a hover — a chart
 * that rewrote the leaf as the pointer crossed it made the reader steer
 * around it to read anything — and the arrow keys walk the rows.
 */
export function Journey() {
  const [id, setId] = useState(SEQUENCE[SEQUENCE.length - 1].id);
  const rows = useRef({});

  const entry = SEQUENCE.find((row) => row.id === id);
  const position = SEQUENCE.indexOf(entry);
  const concurrent = alongside(entry);

  // Earlier and Later. They stop at both ends rather than coming round: the
  // earliest thing in a life is not what comes after the latest.
  const step = (next) => setId(SEQUENCE[Math.min(Math.max(next, 0), SEQUENCE.length - 1)].id);

  // Up and down the rows as they stand on screen. Selection and focus move
  // together, or the ring is left on a row the leaf no longer describes.
  const walk = (from, by) => {
    const target = DISPLAY[Math.min(Math.max(DISPLAY.indexOf(from) + by, 0), DISPLAY.length - 1)];
    setId(target.id);
    rows.current[target.id]?.focus();
  };

  return (
    <section className="chapter chapter--sand chapter--fit" id="journey" aria-labelledby="journey-heading">
      <div className="chapter__inner">
        <ChapterHead id="journey" figure={`${FIRST} – ${LAST}`} />

        <div className="journey">
          <div className="loom reveal">
            {/* The warp, and the band of it the chosen entry spans. Shared by
                every lane, so a year and the bars under it are measured
                against exactly one track. */}
            <div className="loom__warp" aria-hidden="true">
              <span
                className="loom__span"
                style={{
                  '--a': `${at(entry.from)}%`,
                  '--s': Math.max(at(until(entry)) - at(entry.from), 0.9) / 100,
                }}
              />
              {YEARS.map((year) => (
                <span className="warp" key={year} style={{ '--at': `${at(year)}%` }}>
                  <span className="warp__year figures">{year}</span>
                  <span className="warp__thread" />
                </span>
              ))}
            </div>

            {LANES.map((lane) => (
              <div className="loom__lane" key={lane.kind}>
                <p className="loom__kind label">{lane.title}</p>
                <ul className="loom__rows">
                  {lane.entries.map((row) => {
                    const start = at(row.from);
                    const end = at(until(row));
                    return (
                      <li key={row.id}>
                        <button
                          type="button"
                          className="weft"
                          data-kind={row.kind}
                          aria-current={row.id === id ? 'true' : undefined}
                          aria-controls="journey-leaf"
                          ref={(node) => {
                            rows.current[row.id] = node;
                          }}
                          onClick={() => setId(row.id)}
                          onKeyDown={(event) => {
                            const by = { ArrowDown: 1, ArrowUp: -1 }[event.key];
                            if (by) {
                              event.preventDefault();
                              walk(row, by);
                            }
                          }}
                          data-cursor="open"
                          data-cursor-label="Read"
                          style={{ '--i': DISPLAY.indexOf(row) }}
                        >
                          <span className="weft__who">
                            <span className="weft__role">{row.role}</span>
                            {row.org ? <span className="weft__org">{row.org}</span> : null}
                          </span>
                          <span className="weft__track">
                            <span
                              className="weft__bar"
                              data-running={row.to === null ? 'true' : undefined}
                              style={{ '--a': `${start}%`, '--w': `${Math.max(end - start, 0.9)}%` }}
                            />
                          </span>
                          <span className="visually-hidden">{`, ${row.period}`}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <article className="leaf reveal" style={{ '--i': 1 }} id="journey-leaf" aria-live="polite">
            <div className="leaf__swap" key={entry.id}>
              <h3 className="leaf__role">{entry.role}</h3>
              {entry.org ? <p className="leaf__org">{entry.org}</p> : null}
              <p className="leaf__when">
                <span className="figures">{entry.period}</span>
                <span className="leaf__kind">{KIND[entry.kind]}</span>
              </p>
              <p className="leaf__text">{entry.detail}</p>

              {concurrent.length ? (
                <div className="leaf__with">
                  <p className="leaf__with-label label">At the same time</p>
                  <ul className="leaf__chips">
                    {concurrent.map((other) => (
                      <li key={other.id}>
                        <button
                          type="button"
                          className="chip"
                          onClick={() => setId(other.id)}
                          data-cursor="control"
                        >
                          {other.org ?? other.role}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="leaf__foot">
              <p className="leaf__no figures">
                {folio(position + 1)}
                <span className="leaf__of"> / {folio(SEQUENCE.length)}</span>
              </p>
              <div className="leaf__move">
                <button
                  type="button"
                  className="iconbtn"
                  onClick={() => step(position - 1)}
                  disabled={position === 0}
                  aria-label="Earlier"
                >
                  <Icon name="chevronLeft" />
                </button>
                <button
                  type="button"
                  className="iconbtn"
                  onClick={() => step(position + 1)}
                  disabled={position === SEQUENCE.length - 1}
                  aria-label="Later"
                >
                  <Icon name="chevronRight" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Journey;
