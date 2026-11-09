import Icon from '../components/Icon.jsx';
import { Shamsa } from '../components/Ornament.jsx';
import { portrait, profile } from '../data/profile.js';
import { picture } from '../lib/media.js';
import { usePointer } from '../lib/usePointer.js';

// The name in both scripts, paired word for word: ایلیا sits beside EELIYA,
// نیری beside NAYERI. Split here rather than in the data so the data keeps
// the whole name as one string for metadata and the colophon.
const [FA_GIVEN, FA_FAMILY] = profile.namePersian.split(' ');

function Portrait() {
  const image = picture(portrait.stem);
  if (!image) return null;
  return (
    <div className="hero__portrait">
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="(max-width: 54rem) 74vw, 32rem"
        width={image.width}
        height={image.height}
        alt={portrait.alt}
        // Lowercase: React 18 does not know the camelCase form and warns.
        // eslint-disable-next-line react/no-unknown-property
        fetchpriority="high"
        decoding="async"
      />
    </div>
  );
}

/**
 * The hero.
 *
 * The name is set twice, once in each script, and the two are interleaved
 * rather than stacked: EELIYA flush left with ایلیا closing the line on the
 * right, نیری opening the second line on the left with NAYERI flush right.
 * Each line reads outward from its own script's margin, so the composition
 * is bilingual in its structure and not just in its content — and the two
 * open quarters the staggered Latin left behind are now where the Persian
 * lives.
 *
 * The Persian is set larger than the Latin's cap band and its ascenders
 * rise past the cap line, which is how the two scripts actually relate —
 * an alef is taller than a Latin capital. Both words still share one
 * baseline, and ی comes to rest on the Latin's.
 *
 * Behind it all: a shamsa at architectural scale, turning slowly, and the
 * portrait standing between the two lines with the head clear above the
 * type. Three planes at three speeds under the cursor.
 *
 * The Persian words are `aria-hidden` because the heading would otherwise be
 * announced as four interleaved fragments; the full name in Persian is given
 * once, in order, immediately after.
 */
export function Hero() {
  const stage = usePointer();

  return (
    <section className="chapter hero" id="hero" aria-labelledby="hero-name" ref={stage}>
      {/* Warmth that follows the cursor across the field. */}
      <span className="hero__wash" aria-hidden="true" />

      <div className="hero__stage">
        {/* The grid resolving into a figure: the thesis, at the scale of the
            page rather than the margin. */}
        <Shamsa className="hero__halo" />

        <Portrait />

        <h1 className="hero__name" id="hero-name">
          <span className="hero__line hero__line--first">
            <span className="hero__row">
              <span className="hero__latin">Eeliya</span>
              <span className="hero__fa" lang="fa" dir="rtl" aria-hidden="true">
                {FA_GIVEN}
              </span>
            </span>
          </span>

          <span className="hero__line hero__line--second">
            <span className="hero__row">
              <span className="hero__fa" lang="fa" dir="rtl" aria-hidden="true">
                {FA_FAMILY}
              </span>
              <span className="hero__latin">Nayeri</span>
            </span>
          </span>
        </h1>

        <p className="visually-hidden" lang="fa" dir="rtl">
          {profile.namePersian}
        </p>
      </div>

      {/* Everything under the name is one register, ruled off from it: what
          he is, what he builds, and the two ways in. Three rows across the
          full measure rather than a column pressed into the left half with
          the right half left empty. */}
      <div className="hero__foot">
        <p className="hero__role">{profile.role}</p>

        <p className="hero__blurb">{profile.standfirst}</p>

        <div className="hero__act">
          <div className="hero__cta">
            <a className="btn btn--primary" href="#work" data-cursor-label="Work">
              See the work
              <Icon name="arrowDown" />
            </a>
            <a className="btn" href="#contact">
              <Icon name="mail" />
              Get in touch
            </a>
          </div>

          <a className="hero__scroll" href="#about" aria-label="Scroll to the first chapter">
            <span className="hero__scroll-word label">Scroll</span>
            <span className="hero__scroll-rule" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
