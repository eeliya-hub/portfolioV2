// Which frame an entry is drawn in, decided once and read by both the thing
// that draws it and the stage it stands on.
//
// The decision comes from the asset, not from a field anybody has to keep in
// sync. The mobile projects' lead images are composites with phones already
// drawn in them, so framing one of those again would put a device inside a
// device; the plate is the honest presentation for one. A bare portrait
// capture gets the phone, a bare landscape capture gets the laptop, and a
// composite gets a ruled plate and nothing else.

import { picture } from './media.js';

export function frameFor(project, aspect) {
  if (project.frame === 'phone') return aspect && aspect < 1 ? 'phone' : 'plate';
  return 'laptop';
}

/**
 * The frame and the shape of the screen inside it, without drawing either —
 * so the dial can size its stage before the device is on it, and the two can
 * never disagree about what is standing there.
 *
 * @returns {{kind: 'phone'|'laptop'|'plate', aspect: number|undefined}}
 */
export function deviceFrame(project, stem) {
  const image = picture(stem ?? project.lead);
  return { kind: image ? frameFor(project, image.aspect) : 'plate', aspect: image?.aspect };
}
