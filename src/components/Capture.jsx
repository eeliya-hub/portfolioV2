import { picture } from '../lib/media.js';

// The suffix the media pipeline gives the padded copy of each lead. Every
// capture drawn in this plate is 16:9 because that copy was padded to it —
// see scripts/optimise-media.mjs.
const PLATE = '--plate';

/**
 * One entry's capture, drawn as a ruled plate.
 *
 * There is no laptop and no phone here any more. A drawn device has to be
 * proportioned to the screenshot inside it, and the screenshots came in at
 * three different shapes — so the lid never matched its contents, the base
 * sat wider than the lid, and the capture was letterboxed against black on
 * 27 of the 37 images. A plate cannot misalign with what is in it, because
 * the capture is the plate: it runs edge to edge, and the only drawn thing
 * is the hairline round it and the four register marks at its corners.
 *
 * The marks are the carpet's corner figure at a twelfth of its size, struck
 * in madder — the same mark the medallion's frames carry in 01.
 *
 * `flag` is rendered inside the plate's own box, so anything pinned to a
 * corner lands on the corner of the drawn object rather than on whatever
 * column it happens to be standing in.
 */
export function Capture({ project, alt, sizes, flag }) {
  const image = picture(`${project.lead}${PLATE}`) ?? picture(project.lead);
  if (!image) return <div className="capture capture--empty" aria-hidden="true" />;

  return (
    <div className="capture">
      <img
        key={image.src}
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes ?? '(max-width: 54rem) 88vw, 46vw'}
        width={image.width}
        height={image.height}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      <span className="capture__mark" data-at="tl" aria-hidden="true" />
      <span className="capture__mark" data-at="tr" aria-hidden="true" />
      <span className="capture__mark" data-at="bl" aria-hidden="true" />
      <span className="capture__mark" data-at="br" aria-hidden="true" />
      {flag}
    </div>
  );
}

export default Capture;
