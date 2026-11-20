import Lines from './Lines.jsx';
import { chapter, folio } from '../lib/chapters.js';

/**
 * A band announces itself the way the hero does: at architectural scale, in
 * both scripts. The Latin title takes the measure; the Persian pair is
 * struck against its end in madder, larger than the Latin's cap band the way
 * an alef genuinely stands taller than a capital. The folio is set in the
 * margin, the rule draws across, and the band's own figure — a count, a span
 * of years — closes the line.
 *
 * The Persian is aria-hidden for the same reason the hero's is: the heading
 * would otherwise be announced twice in two alphabets. It is ornament built
 * from meaning, not a second heading.
 */
export function Announce({ id, figure }) {
  const meta = chapter(id);
  if (!meta) return null;

  return (
    <header className="ann">
      <p className="ann__folio figures" aria-hidden="true">
        {folio(meta.no)}
      </p>

      <div className="ann__pair">
        <h2 className="ann__title reveal reveal--wipe" id={`${id}-heading`}>
          <span>{meta.title}</span>
        </h2>
        <p className="ann__fa" lang="fa" dir="rtl" aria-hidden="true">
          {meta.fa}
        </p>
      </div>

      <div className="ann__line reveal reveal--rule" aria-hidden="true">
        <span className="ann__rule" />
      </div>

      <div className="ann__under">
        {meta.lede ? (
          <p className="ann__lede reveal">
            <Lines text={meta.lede} />
          </p>
        ) : null}
        {figure ? (
          <p className="ann__figure figures reveal" style={{ '--i': 1 }}>
            {figure}
          </p>
        ) : null}
      </div>
    </header>
  );
}

export default Announce;
