import ChapterHead from '../components/ChapterHead.jsx';
import Icon from '../components/Icon.jsx';
import Lines from '../components/Lines.jsx';
import { GuardBand, Khatam, Shamsa } from '../components/Ornament.jsx';
import { photographs, profile } from '../data/profile.js';
import { khatamFrame } from '../lib/girih.js';
import { picture } from '../lib/media.js';

/**
 * The band, left to right — and the composition of it, which is why the
 * width lives here beside the photographs rather than as nth-child rules in
 * the stylesheet.
 *
 * This is a medallion: the tall portrait in the middle, the two landscape
 * plates flanking it, and all three standing on one baseline, the way a
 * carpet sets a medallion in its field. `span` is in twelfths of the band,
 * and the three were solved rather than chosen — the two flanks come out at
 * the same height as each other and the centre about 1.3 times taller:
 *
 *   flank height h, centre height 1.3h
 *   square (1.000) -> w = h          -> 3.50 twelfths
 *   portrait (0.808) -> w = 1.05h    -> 3.65
 *   wide (1.391) -> w = 1.391h       -> 4.85
 *
 * Change one and the other two have to be re-solved, or the medallion stops
 * standing level.
 */
const PLATES = [
  { photo: photographs.room, span: 3.5 },
  { photo: photographs.graduation, span: 3.65 },
  { photo: photographs.stage, span: 4.85 },
];

const RECORD = [
  ...profile.credentials,
  { label: 'Based in', value: profile.location, detail: profile.relocation, icon: 'pin' },
];

/**
 * One plate, held in a khatam frame.
 *
 * The window is an octagon — the figure at the centre of the star-and-cross
 * repeat the whole site is drawn from — rather than the rotated square it
 * started as. An octagon takes the corners off a photograph; a diamond takes
 * half of it, and half of these photographs is the half that says where they
 * were taken. The diamond survives as the drawn figure behind the window,
 * its points standing out past the flat edges.
 */
function Plate({ photo, span, index }) {
  const image = picture(photo.stem);
  if (!image) return null;

  // The window's shape, how much larger than the window the photograph is
  // held, and the point of it kept in view are all declared in
  // src/data/profile.js. A photograph with no crop of its own is framed to
  // its own shape at its own size, centred.
  const crop = photo.crop ?? {};
  const aspect = crop.aspect ?? image.width / image.height;
  const frame = khatamFrame(aspect);

  // The focus is written as CSS would write it and used as a pair of
  // fractions, because it has to drive both the photograph's offset inside
  // the window and its offset inside its own box. One number for both keeps
  // the two slacks in step; two numbers would drift apart.
  const [fx, fy] = (crop.focus ?? '50% 50%')
    .split(/\s+/)
    .map((part) => Number.parseFloat(part) / 100);

  return (
    <figure
      className="khatam reveal"
      style={{
        '--i': index + 1,
        '--span': span,
        '--ar': aspect,
        '--zoom': crop.zoom ?? 1,
        '--fx': fx,
        '--fy': fy,
      }}
    >
      <span className="khatam__frame">
        {/* The window is cut by the same construction the frame is drawn
            from, and worn by the element around the photograph rather than
            the photograph itself: once a crop can be zoomed, the image's own
            box is larger than the window and a clip measured against it
            would cut the wrong shape. The ornament is its sibling, so none
            of it is clipped. The image keeps its srcset rather than becoming
            an SVG image with one fixed source. */}
        <span className="khatam__window" style={{ clipPath: frame.clip }}>
          <img
            draggable="false"
            src={image.src}
            srcSet={image.srcSet}
            sizes="(max-width: 60rem) 88vw, 30vw"
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

/**
 * About.
 *
 * Three bands down the page: the standfirst, struck with a rosette the way
 * a manuscript illuminates its first line; the register of record, ruled
 * top and bottom like an entry in a ledger; and the medallion of three
 * photographs that is the evidence for both. A biography and a credential
 * are different kinds of statement and are not set in the same voice.
 */
export function About() {
  return (
    <section className="chapter chapter--sand chapter--fit" id="about" aria-labelledby="about-heading">
      <div className="chapter__inner">
        <ChapterHead id="about" />

        <div className="about">
          <div className="about__say">
            <Shamsa className="about__illum reveal" />
            <p className="about__lead reveal" style={{ '--i': 1 }}>
              <Lines text={profile.blurb} />
            </p>
          </div>

          {/* The register of record, ruled across under the statement it
              qualifies. The medallion below is the evidence for both. */}
          <dl className="record">
            {RECORD.map((row, index) => (
              <div className="record__cell reveal" style={{ '--i': index }} key={row.label}>
                <span className="record__mark" aria-hidden="true">
                  <Icon name={row.icon} />
                </span>
                <dt className="record__label label">{row.label}</dt>
                <dd className="record__value">{row.value}</dd>
                {row.detail ? <dd className="record__detail">{row.detail}</dd> : null}
              </div>
            ))}
          </dl>

          <div className="plates">
            {PLATES.map((plate, index) => (
              <Plate
                photo={plate.photo}
                span={plate.span}
                index={index}
                key={plate.photo.stem}
              />
            ))}
          </div>
        </div>

        <GuardBand />
      </div>
    </section>
  );
}

export default About;
