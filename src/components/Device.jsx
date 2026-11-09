import { frameFor } from '../lib/device.js';
import { picture } from '../lib/media.js';

// The phone and the laptop, drawn as a draughtsman's elevation rather than a
// rendered object: ink rules, square corners, no gloss, no bezel highlight,
// no drop shadow pretending the thing floats above the paper. The screenshot
// inside is the only photographic element on the page, which is the point —
// nothing decorative may outrank the artefact in the frame.
//
// Which frame to draw is decided in src/lib/device.js, so the dial can work
// out the height of its stage from the same answer.
//
// `flag` is rendered inside the device's own box, so anything pinned to a
// corner lands on the corner of the drawn object rather than on whatever
// column it happens to be standing in.
export function Device({ project, stem, alt, sizes, flag }) {
  const image = picture(stem ?? project.lead);
  if (!image) return <div className="device device--empty" aria-hidden="true" />;

  const kind = frameFor(project, image.aspect);
  const screen = (
    <img
      key={image.src}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes ?? '(max-width: 54rem) 88vw, 32rem'}
      width={image.width}
      height={image.height}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );

  if (kind === 'phone') {
    return (
      <div className="device device--phone" style={{ '--aspect': image.aspect }}>
        <span className="device__speaker" aria-hidden="true" />
        <div className="device__screen">{screen}</div>
        {flag}
      </div>
    );
  }

  if (kind === 'plate') {
    return (
      <div className="device device--plate" style={{ '--aspect': image.aspect }}>
        <div className="device__screen">{screen}</div>
        {flag}
      </div>
    );
  }

  return (
    <div className="device device--laptop" style={{ '--aspect': image.aspect }}>
      <div className="device__lid">
        <div className="device__screen">{screen}</div>
      </div>
      <div className="device__base" aria-hidden="true">
        <span className="device__notch" />
      </div>
      {flag}
    </div>
  );
}

export default Device;
