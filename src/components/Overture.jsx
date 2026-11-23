import { useEffect, useRef, useState } from 'react';

import { openIris } from '../lib/iris.js';
import { flyName } from '../lib/nameflight.js';

const SEEN = 'overture';

// The landing, in one place. The dressing of the loom, the writing and the
// spin before it belong to the page itself (index.html, in the head),
// because they run before this file has arrived; everything from the moment
// the page is ready is here.
//
// The overture is built forward from its beats rather than back from a
// total, because the beat that matters is in the middle of it: the mark
// stands as ایلیا, written the way it is written, before the quarter turn
// that makes it the E. A reader who cannot read the Persian still sees a
// word; a reader who can, reads it. Two seconds is long enough to do
// either, which is why nothing is allowed to move in them.
//
// The first three beats are NOT here. They are --score, --write and --hold
// on `.overture` in index.html, where the rules that draw them are, and
// this file reads them off the stage. One number, one place, and no pair
// of files to keep in step. The knobs below are the landing's own, which
// is the part no stylesheet does.
//
//   0      --score: whatever is being struck, woven or constructed
//   1200   --write: the name written in, 9 columns, right to left
//   1640   --hold: it stands. The score's last beats settle behind it
//   3640   the landing begins, from a standing start
//   4790   it has come round to the E (and WHIRL)
//   5010   the mark leaves for the top left (and REST)
//   gone about a second later: the iris opens and the name flies to the
//   hero together (src/lib/iris.js, src/lib/nameflight.js)

const WHIRL = 1150; // from a standing start: once round and a quarter, into the E
const BRAKE = 860; // from a spin already under way: slowing into the E
const REST = 220; // the E standing on the plan before it goes home

// A beat off the stage, in milliseconds, whatever unit it was written in.
const BEATS = { '--score': 1200, '--write': 440, '--hold': 2000 };
const beats = (stage) => {
  const style = getComputedStyle(stage);
  let total = 0;
  for (const [name, fallback] of Object.entries(BEATS)) {
    const raw = style.getPropertyValue(name).trim();
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) total += fallback;
    else total += raw.endsWith('ms') ? value : value * 1000;
  }
  return total;
};
const LIFT = 600; // the ground dissolving off the hero
const CLEAR = 260; // how fast an interruption clears it all away
const PATIENCE = 6000; // the longest the faces and the portrait are waited for

// The E is ایلیا turned a quarter clockwise, so it stands at 90° and at
// every full turn past it.
const E = 90;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** The mark's rotation as drawn this frame, whoever is turning it. */
const turned = (el) => {
  const value = parseFloat(getComputedStyle(el).rotate);
  return Number.isFinite(value) ? value : 0;
};

/**
 * Ready is what the hero is made of: the faces loaded and the portrait
 * decoded. One frame first, so the page has been laid out and every face it
 * uses has actually been asked for — before that, `fonts.ready` resolves on
 * a set with nothing in it.
 */
async function pageReady() {
  await frame();
  const portrait = document.querySelector('.hero__portrait img');
  await Promise.race([
    Promise.all([document.fonts.ready, portrait?.decode().catch(() => {})]),
    pause(PATIENCE),
  ]);
}

/**
 * The overture.
 *
 * ایلیا, written in knots from the right and turned a quarter to stand as
 * the E (see src/lib/mark.js), spinning on the cartoon while the page it is
 * waiting for arrives. The stage is in index.html, not here: a loader has to
 * be on the glass before the script that would draw it, so it is written
 * and set spinning by the page's own markup and rules, and this component
 * only takes it over once the page under it is ready.
 *
 * The landing takes the spin from wherever it is — angle and speed — and
 * eases it into the next E on a curve that starts at that speed, so there
 * is no seam where the stylesheet hands over. From a standing start it goes
 * once round and a quarter, so even a page that was ready at once is seen to
 * turn. Then it rests on the cartoon for a beat and flies home to the square
 * at the top left as the ground lifts off the hero, which has been held
 * waiting behind it and arrives as it goes.
 *
 * It plays once a session. Anything at all — a click, a key, a scroll, the
 * skip control — clears it at once, and nothing is withheld: the page is
 * fully rendered underneath. For a reader who asked for stillness the E
 * stands still until the page is ready and the ground simply goes.
 */
export function Overture() {
  const [skippable, setSkippable] = useState(false);
  const skip = useRef(() => {});

  useEffect(() => {
    const stage = document.getElementById('overture');
    if (!stage) return undefined;

    const root = document.documentElement;
    const body = document.body;

    // Later in the session the page's own rules never showed it.
    if (root.dataset.overture !== 'play') {
      stage.remove();
      delete root.dataset.overture;
      return undefined;
    }

    const flight = stage.querySelector('.overture__flight');
    const spin = stage.querySelector('.overture__spin');
    const knots = stage.querySelector('.overture__knots');
    const ground = stage.querySelector('.overture__ground');

    // running → clearing → over, or cancelled when React takes the effect
    // down before it has finished (StrictMode does, once, on mount).
    let state = 'running';
    const motions = [];
    const move = (el, keyframes, options) => {
      const motion = el.animate(keyframes, { fill: 'forwards', ...options });
      motions.push(motion);
      return motion.finished;
    };

    // The name's flight, when the score carries the name: what to do to
    // finish it, whenever and however the overture ends.
    let finishName = () => {};

    // Done: the stage is gone and the page is the reader's.
    function over() {
      if (state === 'over' || state === 'cancelled') return;
      state = 'over';
      finishName();
      unlisten();
      stage.remove();
      delete root.dataset.overture;
      // A file opened from the address is modal and holds the lock itself.
      if (!document.querySelector('dialog[open]')) delete body.dataset.locked;
      // The reader's place is the top of the page, not a control that is gone.
      document.getElementById('hero')?.setAttribute('tabindex', '-1');
      setSkippable(false);
    }

    // Interrupted, or still: everything goes at once, the hero arriving
    // under it.
    function clear() {
      if (state !== 'running') return;
      state = 'clearing';
      root.dataset.overture = 'lift';
      stage.style.pointerEvents = 'none';
      setSkippable(false);
      move(stage, [{ opacity: getComputedStyle(stage).opacity }, { opacity: 0 }], {
        duration: CLEAR,
        easing: 'linear',
      }).then(over, () => {});
    }
    skip.current = clear;

    const EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const listen = () => EVENTS.forEach((type) => window.addEventListener(type, clear, { passive: true }));
    const unlisten = () => EVENTS.forEach((type) => window.removeEventListener(type, clear));

    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      // Nothing to do; it simply plays again next time.
    }
    body.dataset.locked = 'true';
    listen();
    setSkippable(true);

    // When the landing begins: everything the stage says it will do before
    // the mark may be touched.
    const strike = beats(stage);

    const land = async () => {
      await pageReady();
      if (state !== 'running') return;

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        clear();
        return;
      }

      // Let the name finish being written, and then hold until the mark has
      // had its time. The clock is the page's own: the write animation
      // started on the frame the stage was first drawn, so the time since
      // it started is the time the reader has been looking at this.
      const [write] = knots.getAnimations();
      const began = Number(write?.startTime ?? document.timeline.currentTime);
      await write?.finished.catch(() => {});
      if (state !== 'running') return;
      const waited = Number(document.timeline.currentTime) - began;
      if (waited < strike) await pause(strike - waited);
      if (state !== 'running') return;

      // Where it is and how fast it is going, read off two frames.
      const css = Object.fromEntries(spin.getAnimations().map((a) => [a.animationName, a]));
      const steady = css['overture-spin'];
      const spinning = Boolean(steady) && steady.currentTime >= steady.effect.getTiming().delay;
      const t1 = await frame();
      const a1 = turned(spin);
      const t2 = await frame();
      const a2 = turned(spin);
      if (state !== 'running') return;
      const step = t2 - t1 || 16;
      const speed = ((((a2 - a1) % 360) + 360) % 360) / step; // degrees a millisecond
      const from = a2 + speed * step; // where the stylesheet would have it next frame

      // The next E far enough on to slow into smoothly. A curve that leaves
      // at `speed` and arrives at rest turns back on itself if it is asked to
      // stop in less than a third of what that speed covers in the time.
      const duration = speed < 0.02 ? WHIRL : BRAKE;
      const reach = Math.max((speed * duration) / 3, 120);
      let to = E + 360 * Math.ceil((from + reach - E) / 360);
      // From a standing start it goes all the way round before it stands.
      if (!spinning) to = Math.max(to, E + 360);
      // A cubic with x pinned to time, leaving at `speed` and arriving at rest.
      const slope = (speed * duration) / (to - from);

      spin.style.animation = 'none';
      await move(spin, [{ rotate: `${from}deg` }, { rotate: `${to}deg` }], {
        duration,
        easing: `cubic-bezier(0.3333, ${(slope / 3).toFixed(4)}, 0.6667, 1)`,
      });
      if (state !== 'running') return;

      await pause(REST);
      if (state !== 'running') return;

      // And out, by the iris. See src/lib/iris.js.
      const home = document.querySelector('.monogram__knots');
      const there = home?.getBoundingClientRect();
      const here = flight.getBoundingClientRect();
      root.dataset.overture = 'lift';
      stage.style.pointerEvents = 'none';
      setSkippable(false);

      let going;
      if (there?.width) {
        // What it takes to put the mark in the bar's square: the distance
        // between the two centres, and the ratio of the two widths.
        const corner = {
          dx: there.left + there.width / 2 - (here.left + here.width / 2),
          dy: there.top + there.height / 2 - (here.top + here.height / 2),
          scale: there.width / here.width,
        };
        going = openIris({
          ground,
          flight,
          knots,
          home,
          here,
          corner,
          glass: { w: window.innerWidth, h: window.innerHeight },
          move,
        });
      } else {
        // No square to go home to: the stage simply goes.
        going = [
          move(ground, [{ opacity: 1 }, { opacity: 0 }], { duration: LIFT }),
          move(flight, [{ opacity: 1 }, { opacity: 0 }], { duration: LIFT }),
        ];
      }

      // And if the score set the name, the name goes to the hero as the
      // ground opens. See src/lib/nameflight.js.
      const named = flyName({ stage, move });
      finishName = named.finish;
      going = [...going, ...named.going];

      await Promise.all(going);
      if (state !== 'running') return;
      over();
    };

    // If anything at all goes wrong, the one thing it must not do is stay.
    // (A cancelled effect rejects here too, and is left alone.)
    land().catch(() => {
      if (state === 'running') over();
    });

    return () => {
      unlisten();
      if (state === 'over') return;
      finishName();
      state = 'cancelled';
      for (const motion of motions) motion.cancel();
      spin.style.removeProperty('animation');
      stage.style.removeProperty('pointer-events');
      // What the ways out write on the stage as they go.
      stage.style.removeProperty('transform-origin');
      ground.style.removeProperty('--hx');
      ground.style.removeProperty('--hy');
      root.dataset.overture = 'play';
      delete body.dataset.locked;
    };
  }, []);

  if (!skippable) return null;

  return (
    <button type="button" className="overture__skip" onClick={() => skip.current()}>
      Skip
    </button>
  );
}

export default Overture;
