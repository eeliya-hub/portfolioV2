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

export function Stack() {
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
    </section>
  );
}

export default Stack;
