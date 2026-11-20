import Announce from '../components/Announce.jsx';
import Icon from '../components/Icon.jsx';
import { Khatam, Shamsa } from '../components/Ornament.jsx';
import { photographs, profile } from '../data/profile.js';
import { khatamFrame } from '../lib/girih.js';
import { picture } from '../lib/media.js';

/**
 * 01 — the plates and the register.
 *
 * Two columns. The left one reads: the sentence under the rosette, and
 * beneath it the three photographs in their khatam frames, standing on one
 * line. The right one is the register of record — four matters, read down,
 * each marked in the margin and divided from the next by the page's own
 * knot run.
 *
 * THE BAND OF THREE. The frames are ornate, so the arrangement has to do
 * the work rather than the crowding: the three stand side by side on one
 * baseline, the upright photograph in the middle drawn 1.3 times the height
 * of the two flanking it, and the two flanks drawn to exactly the same
 * height as each other. That is the medallion a carpet is composed around,
 * and it is **solved, not chosen** — see SPANS below. None of the three is
 * cropped to match another: each frame carries its own photograph's ratio,
 * and the widths are what the ratios make them.
 *
 * THE REGISTER. Four entries of equal share, stretched to end level with
 * the plates, each centred in its own share. Equal shares do three things
 * at once: the last entry ends with the band of three, the entries keep an
 * even measure, and the knot run between two of them falls at the same
 * interval every time — which is what lets it be an ornament rather than a
 * hairline landing wherever the copy leaves it.
 */

/**
 * The three spans, in twelfths of the band after its two gaps are taken
 * out. Solved from the ratios, not picked:
 *
 *   flank height h, centre height 1.3h
 *   square   (1.0000)  w = h          -> 3.486 twelfths
 *   portrait (0.8084)  w = 1.0509h    -> 3.664
 *   wide     (1.3913)  w = 1.3913h    -> 4.850
 *                                        ------
 *                                        12.000
 *
 * Change one and the other two have to be re-solved, or the band stops
 * standing level. They are declared here beside the photographs rather than
 * as nth-child rules in the stylesheet: they are a composition, not a
 * style, and have to be read next to what they are composing.
 */
const PLATES = [
  { photo: photographs.room, span: 3.486 },
  { photo: photographs.graduation, span: 3.664 },
  { photo: photographs.stage, span: 4.85 },
];

/**
 * The register. The credentials as written, and where he is — a matter of
 * record like the rest, and not written twice. The mark is the glyph for
 * what the row is about; it is not in profile.js because it is a drawing
 * decision about this band, not a fact about Eeliya.
 */
const RECORD = [
  { ...profile.credentials[0], mark: 'cap' },
  { ...profile.credentials[1], mark: 'columns' },
  { ...profile.credentials[2], mark: 'door' },
  { label: 'Based in', value: profile.location, detail: profile.relocation, mark: 'marker' },
];

/**
 * Rubrication: the opening words struck in madder, the way a scribe marks
 * where the text begins. Taken off the front of profile.blurb rather than
 * written here, so there is one copy of the sentence.
 */
const RUBRIC = 2;

function opening(text) {
  const words = text.split(' ');
  return [words.slice(0, RUBRIC).join(' '), ` ${words.slice(RUBRIC).join(' ')}`];
}

function Plate({ photo, span, index, sizes }) {
  const image = picture(photo.stem);
  // Anything whose file is missing is dropped rather than drawn empty.
  if (!image) return null;

  const crop = photo.crop ?? {};
  const aspect = crop.aspect ?? image.width / image.height;
  const frame = khatamFrame(aspect);

  // The focus drives both the photograph's offset inside the window and its
  // offset inside its own box; one number for both keeps the two in step.
  const [fx, fy] = (crop.focus ?? '50% 50%')
    .split(/\s+/)
    .map((part) => Number.parseFloat(part) / 100);

  return (
    <figure
      className="khatam reveal"
      style={{
        '--ar': aspect,
        '--span': span,
        '--zoom': crop.zoom ?? 1,
        '--fx': fx,
        '--fy': fy,
        '--i': index,
      }}
    >
      <span className="khatam__frame">
        {/* The window is cut by the same construction the frame is drawn
            from, and worn by the element around the photograph rather than
            the photograph itself, so a zoomed crop is clipped against the
            window and the image keeps its srcset. */}
        <span className="khatam__window" style={{ clipPath: frame.clip }}>
          <img
            draggable="false"
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            width={image.width}
            height={image.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        </span>

        <Khatam aspect={aspect} />
      </span>

      <figcaption className="khatam__caption label">{photo.caption}</figcaption>
    </figure>
  );
}

export function About() {
  const [rubric, rest] = opening(profile.blurb);

  return (
    <section className="chapter chapter--sand about" id="about" aria-labelledby="about-heading">
      <div className="chapter__inner">
        <Announce id="about" figure={profile.location} />

        <div className="about__body">
          <div className="about__say">
            <Shamsa className="about__mark" />
            <p className="about__blurb reveal">
              <span className="about__rubric">{rubric}</span>
              {rest}
            </p>
          </div>

          <div className="plates">
            {PLATES.map(({ photo, span }, index) => (
              <Plate
                key={photo.stem}
                photo={photo}
                span={span}
                index={index}
                sizes="(max-width: 60rem) 92vw, 24vw"
              />
            ))}
          </div>

          <dl className="record">
            {RECORD.map((row, index) => (
              <div className="record__cell reveal" style={{ '--i': index }} key={row.label}>
                <span className="record__mark" aria-hidden="true">
                  <Icon name={row.mark} />
                </span>
                <dt className="record__label label">{row.label}</dt>
                <dd className="record__value">{row.value}</dd>
                {row.detail ? <dd className="record__detail">{row.detail}</dd> : null}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;
