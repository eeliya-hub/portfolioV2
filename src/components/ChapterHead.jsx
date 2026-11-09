import Lines from './Lines.jsx';
import { chapter, folio } from '../lib/chapters.js';

/**
 * Every chapter opens the same way, so they cannot drift apart.
 *
 * The chapter number is set in the margin and turned on its side, the way a
 * folio is numbered on a manuscript page — it belongs to the edge of the
 * sheet, not to the sentence. It is never a label stacked above the heading:
 * the heading carries its own weight, and the number is wayfinding for
 * someone scanning the margin rather than reading.
 *
 * `figure` is the chapter's own quantity — a count, a span of years — passed
 * in from that chapter's data and set at the far end of the rule.
 */
export function ChapterHead({ id, figure }) {
  const meta = chapter(id);
  if (!meta) return null;

  return (
    <header className="head">
      <span className="head__folio figures" aria-hidden="true">
        {folio(meta.no)}
      </span>

      <h2 className="head__title reveal reveal--wipe" id={`${id}-heading`}>
        <span>{meta.title}</span>
      </h2>

      <div className="head__line reveal reveal--rule" style={{ '--i': 1 }} aria-hidden="true">
        <span className="head__rule" />
      </div>

      {figure ? (
        <p className="head__figure figures reveal" style={{ '--i': 2 }}>
          {figure}
        </p>
      ) : null}

      {meta.lede ? (
        /* The wrapper is the thing the deck size is measured against: it is
           the grid item, so it is exactly as wide as the rule above it,
           which is the width a one-line lede has to fill. */
        <div className="head__deck">
          <p
            className="head__lede reveal"
          /* A lede written as lines is set to the width of the rule, so its
             size has to come from how long the line is. The count is of the
             longest line, because that is the one that has to fit. */
          style={{
            '--i': 2,
            '--deck-len': Array.isArray(meta.lede)
              ? Math.max(...meta.lede.map((line) => line.length))
              : undefined,
          }}
          >
            <Lines text={meta.lede} />
          </p>
        </div>
      ) : null}
    </header>
  );
}

export default ChapterHead;
