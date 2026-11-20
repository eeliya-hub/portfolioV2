// Drives the built site and asserts the experience actually works.
//
//   npm run check            (expects `npm run preview` on :4317)
//
// This is not a unit test suite; it is the pass that stops "it renders" being
// mistaken for "it works". Every assertion corresponds to something a visitor
// does or sees: ride the deck, travel the route, open a file, send the form
// badly, open the menu, switch edition — plus the invariants the carpet
// construction promises: the colour arc, the toranj's centre line, the warp
// filling, nothing stranded and nothing hanging out sideways.

import { createRequire } from 'node:module';

import { projects } from '../src/data/projects.js';
import { chronology } from '../src/data/journey.js';
import { stackRegisters } from '../src/data/stack.js';
import { UPRIGHT, outline } from '../src/lib/mark.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4317';

// The span the chronology actually covers, worked out the same way 03 works
// it out: the earliest start, and the latest date anything can point at.
const FIRST = Math.floor(Math.min(...chronology.map((entry) => entry.from)));
const LAST = Math.floor(
  Math.max(...chronology.flatMap((entry) => [entry.from, entry.to ?? 0])),
);

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

// Wait for a smooth scroll to come to rest instead of guessing a duration.
const scrollSettled = async (page, timeout = 5000) => {
  const until = Date.now() + timeout;
  let last = null;
  while (Date.now() < until) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y === last) return;
    last = y;
    await page.waitForTimeout(100);
  }
};

// Programmatic scrolls in these checks are measurements, not journeys: smooth
// scrolling turns every one into a race against its own animation.
const instant = (page) =>
  page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });

/**
 * Stand the deal at plate `k`: --t = k, which is the moment plate k has just
 * landed square in the frame. The plates are absolutely stacked inside a
 * pinned leg now, so there are no static tops to measure — the position is
 * arithmetic on the leg's own box, the same arithmetic the stylesheet does.
 */
const dealTo = async (page, k) => {
  const at = await page.evaluate(() => {
    const deck = document.querySelector('.deck');
    return {
      top: deck.getBoundingClientRect().top + scrollY,
      span: deck.offsetHeight - innerHeight,
      n: document.querySelectorAll('.piece').length,
    };
  });
  await page.evaluate((y) => scrollTo(0, y), at.top + at.span * (k / at.n));
  await page.waitForTimeout(400);
};

/** Every plate's left edge, and whether it has landed. */
const dealt = (page) =>
  page.evaluate(() => ({
    pin: Math.round(document.querySelector('.deck__pin').getBoundingClientRect().top),
    lefts: [...document.querySelectorAll('.piece')].map((p) =>
      Math.round(p.getBoundingClientRect().left),
    ),
    inert: [...document.querySelectorAll('.piece')].map((p) => p.inert),
  }));

/**
 * The overture's journey, written down a frame at a time from the first
 * frame on, because it is over before a check could look at it: what it was
 * knotted from, the phases it went through, how it stood when it was first
 * drawn and when it lifted, whether it was shown at all, and whether the
 * hero waited behind it. Runs in the page, as an init script.
 */
const recordOverture = () => {
  const seen = { phases: [], knots: null, shown: null, first: null, landed: null, held: null };
  window.__overture = seen;
  const note = () => {
    const phase = document.documentElement?.dataset.overture ?? 'gone';
    // Nothing is recorded before the head script has said which it is.
    if (seen.phases.at(-1) !== phase && (seen.phases.length || phase !== 'gone')) seen.phases.push(phase);
    const stage = document.getElementById('overture');
    const spin = stage?.querySelector('.overture__spin');
    if (stage && seen.shown === null) seen.shown = getComputedStyle(stage).display !== 'none';
    // Read the knots once they exist: the stage can be seen the moment its
    // own tag is parsed, before the paths inside it are.
    const knots = stage?.querySelector('.overture__knots path')?.getAttribute('d');
    if (knots && !seen.knots) seen.knots = knots;
    if (spin && seen.first === null) {
      seen.first = { rotate: getComputedStyle(spin).rotate, animations: spin.getAnimations().length };
    }
    if (phase === 'lift' && spin && seen.landed === null) seen.landed = getComputedStyle(spin).rotate;
    return phase;
  };
  // Every change as it happens, not once a frame: on a warm second visit the
  // app can have cleared the stage before the first frame is drawn.
  new MutationObserver(note).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-overture'],
  });
  // And once a frame for what only moves with time: the hero held paused.
  const watch = () => {
    const phase = note();
    const row = document.querySelector('.hero__row');
    if (phase === 'play' && row) {
      seen.held = (seen.held ?? true) && row.getAnimations()[0]?.playState === 'paused';
    }
    if (phase !== 'gone' || !seen.phases.length) requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
};

const browser = await chromium.launch();

// ---------------------------------------------------------------- desktop
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(recordOverture);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  console.log('\nDESKTOP');

  // The overture plays once a session, then gets out of the way.
  const overtureGone = await page
    .waitForSelector('.overture', { state: 'detached', timeout: 6000 })
    .then(() => true)
    .catch(() => false);
  check('overture clears itself', overtureGone);
  check('body scroll unlocked after overture', !(await page.evaluate(() => document.body.dataset.locked)));

  // The overture is the mark itself: ایلیا written in, spun, and landed on
  // the E, with the hero held behind it until it lifts.
  const journey = await page.evaluate(() => window.__overture);
  check('the overture is ایلیا, knotted from the mark’s own rows', journey.knots === outline(UPRIGHT));
  check(
    'it is written, spins, then lifts and goes',
    journey.phases.join(' → ') === 'play → lift → gone',
    journey.phases.join(' → '),
  );
  check('it comes to rest on the E', Math.round(parseFloat(journey.landed)) % 360 === 90, journey.landed);
  check('the hero waits behind it and arrives as it lifts', journey.held === true);
  await instant(page);

  // The colour arc: sand, parchment, sand, parchment, madder. The scroll has
  // acts, and each band declares its own ground. The one band that is dark
  // whatever the reader chose is the madder close; everything before it
  // follows the edition, which is the whole point of having one.
  const arc = await page.evaluate(() => {
    const bg = (id) => getComputedStyle(document.getElementById(id)).backgroundColor;
    return {
      about: bg('about'),
      work: bg('work'),
      journey: bg('journey'),
      stack: bg('stack'),
      contact: bg('contact'),
    };
  });
  // The mark in the bar is drawn, not loaded: ایلیا in square Kufic, nine
  // knots of exactly 2px. A knot that is not a whole number of pixels blurs,
  // so the size is pinned here as well as in the stylesheet.
  const mark = await page.evaluate(() => {
    const svg = document.querySelector('.monogram .monogram__knots');
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    const path = svg.querySelector('path');
    return {
      size: `${box.width}x${box.height}`,
      drawn: Boolean(path?.getAttribute('d')),
      ink: getComputedStyle(path).fill === getComputedStyle(svg.closest('.monogram')).color,
      home: getComputedStyle(svg).visibility === 'visible',
    };
  });
  check(
    'the bar carries the mark, nine 2px knots in the bar’s own ink',
    mark?.size === '18x18' && mark.drawn && mark.ink,
    JSON.stringify(mark),
  );
  check('and the overture’s mark has come home to it', mark?.home === true);

  // The close is the deep madder (--field-deep, #631a1e by day), not the
  // madder of the marks: spread across a whole band behind a form, full
  // madder was too loud to read on.
  check(
    'the bands alternate sand and parchment and close on deep madder',
    arc.about === arc.journey &&
      arc.about !== arc.work &&
      arc.work === arc.stack &&
      arc.contact === 'rgb(99, 26, 30)',
    `about ${arc.about}, work ${arc.work}, contact ${arc.contact}`,
  );
  // 02 used to be pinned to lacquer in both editions, so the day reader got
  // one chapter that ignored the edition they had chosen.
  check(
    'the day edition reaches the projects band',
    arc.work === 'rgba(0, 0, 0, 0)' || !arc.work.startsWith('rgb(22'),
    arc.work,
  );

  // Every band announces itself the same way: a real heading with the id the
  // section is labelled by, and its Persian pair beside it, hidden from the
  // reader who hears the page.
  const anns = await page.evaluate(() =>
    ['about', 'work', 'journey', 'stack', 'contact'].map((id) => {
      const head = document.getElementById(`${id}-heading`);
      const fa = head?.closest('.ann')?.querySelector('.ann__fa');
      return {
        id,
        head: Boolean(head),
        fa: Boolean(fa?.textContent.trim()),
        hidden: fa?.getAttribute('aria-hidden') === 'true',
        rtl: fa?.getAttribute('dir') === 'rtl',
      };
    }),
  );
  check(
    'every band is announced in both scripts',
    anns.every((a) => a.head && a.fa && a.hidden && a.rtl),
    anns.filter((a) => !(a.head && a.fa && a.hidden && a.rtl)).map((a) => a.id).join(', ') || 'all five',
  );

  // --- 01 · the band of three and the register -----------------------------
  // The band's whole claim is a set of pixel facts, so every one of them is
  // measured: the three frames stand on ONE baseline, the two flanking the
  // centre come out at exactly the same height as each other, the centre is
  // 1.3 times taller than them, and no frame has been cropped to get there.
  // Then the register beside it: four entries of equal share, the knot run
  // between two of them landing at the midpoint every time, and the last
  // entry ending level with the plates.
  await page.evaluate(() => scrollTo(0, document.getElementById('about').offsetTop));
  // Every reveal forced in first. The last register row sits below the fold
  // on a 900px window, so measured un-revealed it is still carrying its
  // entrance offset and the band above it reads 15px out of place.
  await page.evaluate(() => {
    for (const node of document.querySelectorAll('.reveal')) node.classList.add('is-in');
  });
  await page.waitForTimeout(700);
  const band = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('.khatam__frame')].map((n) =>
      n.getBoundingClientRect(),
    );
    const ar = [...document.querySelectorAll('.khatam')].map((n) =>
      parseFloat(n.style.getPropertyValue('--ar')),
    );
    const cells = [...document.querySelectorAll('.record__cell')].map((n) =>
      n.getBoundingClientRect(),
    );
    // The knot run straddles the line between two rows; where it actually
    // lands is read off the pseudo-element rather than assumed.
    const bands = [...document.querySelectorAll('.record__cell + .record__cell')].map((n) => {
      const before = getComputedStyle(n, '::before');
      const box = n.getBoundingClientRect();
      return box.top + parseFloat(before.insetBlockStart) + parseFloat(before.height) / 2;
    });
    return {
      count: frames.length,
      feet: Math.max(...frames.map((r) => r.bottom)) - Math.min(...frames.map((r) => r.bottom)),
      flanks: Math.abs(frames[0].height - frames[2].height),
      centre: frames[1].height / frames[0].height,
      shapes: frames.map((r, i) => Math.abs(r.width / r.height - ar[i]) < 0.01),
      rows: cells.map((c) => Math.round(c.height)),
      bands: bands.map((b, i) =>
        Math.abs(b - (cells[i].bottom + cells[i + 1].top) / 2),
      ),
      marks: [...document.querySelectorAll('.record__mark svg')].length,
      distinct: new Set(
        [...document.querySelectorAll('.record__mark svg')].map((n) => n.innerHTML),
      ).size,
      endsLevel: Math.abs(
        document.querySelector('.record').getBoundingClientRect().bottom -
          document.querySelector('.plates').getBoundingClientRect().bottom,
      ),
    };
  });
  check(
    'the three plates stand on one line',
    band.count === 3 && band.feet <= 1,
    `${band.feet.toFixed(2)}px apart`,
  );
  check(
    'the two flanking the centre are the same height',
    band.flanks <= 1,
    `${band.flanks.toFixed(2)}px apart`,
  );
  check(
    'and the centre is drawn 1.3 times taller than them',
    Math.abs(band.centre - 1.3) < 0.01,
    `${band.centre.toFixed(4)}x`,
  );
  check('every plate keeps its own photograph\'s shape exactly', band.shapes.every(Boolean));
  check(
    'the register divides into four equal shares',
    band.rows.length === 4 && Math.max(...band.rows) - Math.min(...band.rows) <= 1,
    band.rows.join(' / '),
  );
  check(
    'and the knot run falls midway between two entries, every time',
    band.bands.every((d) => d <= 1),
    band.bands.map((d) => `${d.toFixed(2)}px`).join(', '),
  );
  check(
    'each entry is marked, and no two marks are the same',
    band.marks === 4 && band.distinct === 4,
  );
  check(
    'the register ends level with the plates',
    band.endsLevel <= 1,
    `${band.endsLevel.toFixed(2)}px`,
  );

  // The record is the ledger: a value for every row, no empty cells.
  const record = await page.evaluate(() =>
    [...document.querySelectorAll('.record__cell')].map((entry) => ({
      label: entry.querySelector('.record__label')?.textContent.trim(),
      value: entry.querySelector('.record__value')?.textContent.trim(),
    })),
  );
  check(
    'the record rules four entries, each with its matter',
    record.length === 4 && record.every((row) => row.label && row.value),
    record.map((row) => row.label).join(', '),
  );

  // --- 02 · the deck ------------------------------------------------------
  // Seven plates, dealt in order, each pinning while the next slides over.
  const deck = await page.evaluate(() => {
    const pieces = [...document.querySelectorAll('.piece')];
    return {
      count: pieces.length,
      titles: pieces.map((p) => p.querySelector('.piece__title')?.textContent.trim()),
    };
  });
  check(
    'the deck deals all seven, in register order',
    deck.count === projects.length && deck.titles.every((t, i) => t === projects[i].title),
    deck.titles.join(' · '),
  );

  // The deal, measured. Stand it at plate 2: the band is pinned, plates 0–2
  // have landed square, and everything after is still off the left edge.
  await dealTo(page, 2);
  const landed = await dealt(page);
  const wide = await page.evaluate(() => document.querySelector('.piece').offsetWidth);
  check(
    'the band pins and the plates land square',
    landed.pin === 0 && landed.lefts.slice(0, 3).every((x) => Math.abs(x) <= 2),
    `pin ${landed.pin}, lefts ${landed.lefts.join('/')}`,
  );
  check(
    'and the ones not yet dealt stand off the left edge',
    landed.lefts.slice(3).every((x) => x <= -wide + 2),
    landed.lefts.slice(3).join('/'),
  );

  // Mid-deal: the incoming plate is genuinely crossing, not cutting.
  await dealTo(page, 2.72);
  const crossing = await dealt(page);
  check(
    'a plate crosses the frame rather than cutting to it',
    crossing.lefts[3] < -40 && crossing.lefts[3] > -wide + 40,
    `plate 04 at ${crossing.lefts[3]} of ${-wide}`,
  );
  await dealTo(page, 2);

  // Every capture fills its plate edge to edge — the media pipeline pads
  // every lead to 16:9 precisely so this can be true of all seven — and the
  // screen opens the deployment where there is one, the file where not. The
  // flash is a claim, so it is checked against the data.
  const plates = await page.evaluate(() =>
    [...document.querySelectorAll('.piece')].map((p) => {
      const img = p.querySelector('.capture img');
      const box = p.querySelector('.capture').getBoundingClientRect();
      const open = p.querySelector('.piece__open');
      // Only a capture that has actually decoded can be measured; the
      // plates further down the deck are lazy and have not been reached.
      const loaded = Boolean(img?.complete && img.naturalWidth);
      return {
        loaded,
        edges: loaded
          ? Math.abs(img.naturalWidth / img.naturalHeight - box.width / box.height) < 0.02
          : null,
        live: open?.getAttribute('href') ?? null,
        flash: Boolean(p.querySelector('.flash')),
      };
    }),
  );
  const drawn = plates.filter((p) => p.loaded);
  check(
    'every capture fills its plate, no letterbox',
    drawn.length > 0 && drawn.every((p) => p.edges),
    `${drawn.length} of ${plates.length} decoded so far`,
  );
  check(
    'the screen opens the deployment where there is one',
    plates.every((p, i) => p.live === (projects[i].links.live ?? null)),
    plates.filter((p, i) => p.live !== (projects[i].links.live ?? null)).length + ' wrong',
  );
  check(
    'the flash is struck on those plates and only those',
    plates.every((p, i) => p.flash === Boolean(projects[i].links.live)),
  );

  // A product site is a page about the work, not the work running: it gets
  // a button that says so, and never the word Live anywhere on its plate.
  const sites = await page.evaluate(() =>
    [...document.querySelectorAll('.piece')].map((p) => ({
      site: [...p.querySelectorAll('.piece__acts a')].find((a) => /product site/i.test(a.textContent))?.getAttribute('href') ?? null,
      saysLive: [...p.querySelectorAll('.piece__acts a, .flash')].some((n) => /\blive\b/i.test(n.textContent)),
    })),
  );
  check(
    'a product site is labelled as one, and never as live',
    sites.every((p, i) => p.site === (projects[i].links.site ?? null)) &&
      sites.every((p, i) => projects[i].links.live || !p.saysLive),
    projects.filter((x) => x.links.site).map((x) => x.title).join(', ') || 'none',
  );

  // Exactly one plate may be reachable. Every plate is in the page for the
  // whole leg: the ones that have landed are stacked under the one on top,
  // and the ones still to come stand off the left edge. Both used to answer
  // clicks aimed at the plate the reader could actually see, and the tab key
  // walked through all seven copies of the same three controls. Measured at
  // plate 2, where there are covered plates on one side and undealt ones on
  // the other.
  await dealTo(page, 2);
  const reach = await dealt(page);
  check(
    'exactly one plate is in reach — the one on top',
    reach.inert.filter(Boolean).length === reach.inert.length - 1 && reach.inert[2] === false,
    `in reach: ${reach.inert.map((i, n) => (i ? null : n)).filter((n) => n !== null).join(',')}`,
  );
  check(
    'the covered and the undealt are both out of it',
    reach.inert[0] && reach.inert[1] && reach.inert[3],
  );

  // Open the file from the plate that is actually on top.
  await dealTo(page, 1);
  await page.locator('.piece').nth(1).getByRole('button', { name: 'Open the file' }).click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  const title = await page.locator('#dossier-title').textContent();
  check('Open the file opens that file', title === 'Traverse', `got "${title}"`);
  check('dossier address is shareable', page.url().endsWith('#work/traverse'), page.url());

  // The frame: one capture at a time, said plainly, and the whole set one
  // arrow away. It was a sheet of every capture stacked down the page.
  const frame = await page.evaluate(() => ({
    shots: document.querySelectorAll('.case__shot img').length,
    count: document.querySelector('.case__count')?.textContent.replace(/\s+/g, ' ').trim(),
    named: Boolean(document.querySelector('.case__alt')?.textContent.trim()),
    platform: document.querySelector('.case__plat')?.textContent.trim(),
  }));
  check(
    'the file shows one capture at a time, and says which of how many',
    frame.shots === 1 && frame.count === '01 / 05' && frame.named,
    `${frame.shots} shown, ${frame.count}`,
  );

  // Stepping wraps, in both directions.
  await page.locator('.case__step[data-side="back"]').click();
  await page.waitForTimeout(220);
  const atEnd = await page.locator('.case__count').textContent();
  await page.locator('.case__step[data-side="on"]').click();
  await page.waitForTimeout(220);
  const atStart = await page.locator('.case__count').textContent();
  check(
    'the frame steps, and wraps at both ends',
    atEnd.trim() === '05 / 05' && atStart.trim() === '01 / 05',
    `${atEnd.trim()} then ${atStart.trim()}`,
  );

  // Three points to a file, and every part marked.
  const listed = await page.evaluate(() => ({
    points: document.querySelectorAll('.case__point').length,
    parts: document.querySelectorAll('.case__part').length,
    marks: document.querySelectorAll('.case__mark').length,
  }));
  check(
    'the file makes three points, and marks every part',
    listed.points === 3 && listed.parts > 0 && listed.marks === listed.parts,
    `${listed.points} points, ${listed.marks}/${listed.parts} marked`,
  );

  // The cursor over an open file: raised into the top layer, or it is drawn
  // under the modal and the reader has no cursor at all.
  const raised = await page.evaluate(() => ({
    attr: document.documentElement.dataset.pointer,
    open: document.querySelector('.cursor')?.matches(':popover-open') ?? false,
  }));
  check(
    'the cursor is raised into the top layer',
    raised.attr === 'raised' && raised.open,
    `data-pointer="${raised.attr}", popover open: ${raised.open}`,
  );

  // The capture in the frame, up into the loupe; Escape peels one layer at
  // a time. Step to the second one first, so the loupe has to open on the
  // frame's own index rather than on nothing.
  await page.locator('.case__step[data-side="on"]').click();
  await page.waitForTimeout(220);
  const atPlate = await page.evaluate(() => Math.round(document.querySelector('.dossier__scroll').scrollTop));
  await page.locator('.dossier .case__shot').click();
  await page.waitForSelector('.loupe[open]', { timeout: 4000 });
  await page.waitForTimeout(500);
  const lifted = await page.evaluate(() => {
    const box = document.querySelector('.loupe__img')?.getBoundingClientRect();
    return {
      file: document.querySelector('.dossier')?.open,
      count: document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim(),
      fits: Boolean(box) && box.height <= innerHeight && box.width <= innerWidth,
    };
  });
  check('a plate opens into the loupe over the file', lifted.file && lifted.count === '02 / 05', lifted.count);
  check('the loupe holds the capture inside the frame', lifted.fits);

  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  const stepped = await page.evaluate(() =>
    document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim(),
  );
  check('the arrows step through the plates', stepped === '01 / 05', stepped);

  await page.keyboard.press('Escape');
  await page.waitForSelector('.loupe[open]', { state: 'detached', timeout: 4000 });
  await page.waitForTimeout(250);
  const returned = await page.evaluate(() => ({
    file: document.querySelector('.dossier')?.open,
    at: Math.round(document.querySelector('.dossier__scroll').scrollTop),
  }));
  check('Escape lifts the loupe and leaves the file open', returned.file === true);
  check('the file is given back where it was left', Math.abs(returned.at - atPlate) < 4, `${returned.at} vs ${atPlate}`);

  await page.keyboard.press('Escape');
  await page.waitForSelector('.dossier[open]', { state: 'detached', timeout: 4000 });
  check('Escape closes the file and restores the address', !page.url().includes('#work/traverse'), page.url());
  check('scroll unlocked on close', !(await page.evaluate(() => document.body.dataset.locked)));

  // Every file is one frame: nothing in it scrolls, the name stands on one
  // line in its column, and the meta line under it does too. Opened by its
  // address, all seven, on the desk glass this suite runs at.
  const frames = [];
  for (const entry of projects) {
    await page.goto(`${BASE}#work/${entry.id}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.dossier[open]', { timeout: 5000 });
    await page.waitForTimeout(350);
    frames.push(
      await page.evaluate((id) => {
        const scroller = document.querySelector('.dossier__scroll');
        const column = document.querySelector('.case__about').getBoundingClientRect().width;
        const width = (node) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return range.getBoundingClientRect().width;
        };
        const meta = document.querySelector('.case__meta');
        return {
          id,
          over: scroller.scrollHeight - scroller.clientHeight,
          title: width(document.querySelector('.case__title')) <= column + 1,
          meta: meta.scrollWidth <= meta.clientWidth + 1,
        };
      }, entry.id),
    );
    await page.keyboard.press('Escape');
    await page.waitForSelector('.dossier[open]', { state: 'detached', timeout: 4000 });
  }
  const spilt = frames.filter((f) => f.over > 0 || !f.title || !f.meta);
  check(
    'every file stands in one frame, its name and meta on one line each',
    spilt.length === 0,
    spilt.map((f) => `${f.id}: ${f.over}px over${f.title ? '' : ', name breaks'}${f.meta ? '' : ', meta spills'}`).join('; ') ||
      `all ${frames.length}`,
  );

  // A jump from the menu lands every band with its join — the run of knots
  // at its top edge — 2px under the top of the window. The figure is taken
  // off the capture the landing was set against.
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.overture', { state: 'detached', timeout: 8000 }).catch(() => {});
  const again = await page.evaluate(() => window.__overture);
  check(
    'a second visit in the session never shows the overture',
    again.phases[0] === 'seen' && again.shown !== true,
    again.phases.join(' → '),
  );
  const landings = [];
  for (const id of ['about', 'work', 'journey', 'stack', 'contact']) {
    await page.locator('.burger').click();
    await page.waitForSelector('.menu[open]');
    await page.waitForTimeout(200);
    await page.locator(`.menu__link[href="#${id}"]`).click();
    // Until the scroll has actually come to rest, not for a fixed time: the
    // jump into 03 crosses the whole of 02's leg, and a smooth scroll that
    // long is still travelling at a second and a half.
    await page.evaluate(
      () =>
        new Promise((done) => {
          let last = -1;
          let still = 0;
          const tick = () => {
            if (Math.abs(scrollY - last) < 0.5) still += 1;
            else still = 0;
            last = scrollY;
            if (still >= 12) done();
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
    landings.push([id, await page.evaluate((sid) => document.getElementById(sid).getBoundingClientRect().top, id)]);
  }
  check(
    'a menu jump lands every band 2px from the top of the window',
    landings.every(([, top]) => Math.abs(top - 2) <= 1),
    landings.map(([id, top]) => `${id} ${top.toFixed(1)}`).join(', '),
  );

  // Deep link.
  await page.goto(`${BASE}#work/pit-wall`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.dossier[open]', { timeout: 5000 });
  check('a project URL opens that project', (await page.locator('#dossier-title').textContent()) === 'Pit Wall');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await instant(page);

  // --- 03 · the route -----------------------------------------------------
  // The pinned leg has four phases, all arithmetic on one number: the ride
  // (the thread crosses the glass end to end), the fold (the cards shed,
  // then the track reels in to the width of the glass and lifts), the unroll
  // (the roll writes itself out beneath it) and the hold. Each is measured
  // where it should have finished, because a phase that never completes is
  // the failure that looks like a design decision.
  const routeBox = await page.evaluate(() => {
    const r = document.querySelector('.route');
    return { top: r.getBoundingClientRect().top + scrollY, h: r.offsetHeight };
  });
  const phaseAt = async (f) => {
    await page.evaluate(([y]) => scrollTo(0, y), [routeBox.top + (routeBox.h - 900) * f]);
    await page.waitForTimeout(300);
    return page.evaluate(() => {
      const track = document.querySelector('.route__track');
      const glass = document.querySelector('.route__window').getBoundingClientRect().width;
      const line = document.querySelector('.route__line').getBoundingClientRect();
      return {
        pin: Math.round(document.querySelector('.route__pin').getBoundingClientRect().top),
        x: Math.round(new DOMMatrix(getComputedStyle(track).transform).m41),
        span: Math.round(track.getBoundingClientRect().width - glass),
        laps: +(track.getBoundingClientRect().width / glass).toFixed(2),
        axis: Math.round(line.top),
        cards: Number(getComputedStyle(document.querySelector('.station__card')).opacity),
        record: Number(getComputedStyle(document.querySelector('.roll')).opacity),
      };
    });
  };
  const t0 = await phaseAt(0.02);
  const tMid = await phaseAt(0.4);
  const tRide = await phaseAt(0.55);
  const tShed = await phaseAt(0.66);
  const tFold = await phaseAt(0.86);
  const tHold = await phaseAt(0.98);
  check(
    'the route pins for its whole leg',
    [t0, tMid, tRide, tShed, tFold, tHold].every((p) => p.pin === 0),
    [t0, tMid, tRide, tShed, tFold, tHold].map((p) => p.pin).join('/'),
  );
  check(
    'the ride crosses the glass end to end',
    Math.abs(t0.x) < t0.span * 0.09 && -tRide.x > tRide.span * 0.95,
    `x ${t0.x} → ${tRide.x} over ${tRide.span}`,
  );
  check(
    'and nothing has been written yet while it rides',
    t0.cards === 1 && t0.record === 0,
    `cards ${t0.cards}, record ${t0.record}`,
  );
  // The fold is the whole idea: the track CONTRACTS to the glass and lifts,
  // so the axis a reader ends up with is the same line they just rode. A
  // cross-fade between two drawings would pass a test for both being
  // visible, so the thing measured is the track's own width in laps.
  check(
    'the track contracts to the glass rather than cutting away',
    tRide.laps > 2 && Math.abs(tHold.laps - 1) < 0.02 && Math.abs(tHold.x) <= 2,
    `${tRide.laps} laps → ${tHold.laps}, x ${tHold.x}`,
  );
  // The cards have to be gone BEFORE the track reels in, or the contraction
  // crops them: a card stands taller than the axis the track is becoming.
  check(
    'the cards shed before the track reels in',
    tShed.cards === 0 && tShed.laps > 2,
    `cards ${tShed.cards} with the track still at ${tShed.laps} laps`,
  );
  check(
    'and the axis lifts to the head of the frame',
    tHold.cards === 0 && tHold.axis < t0.axis - 200,
    `line at ${t0.axis} → ${tHold.axis}`,
  );
  check(
    'and the record is written out under it by the hold',
    tFold.record > 0 && tFold.record < 1 && tHold.record === 1,
    `roll ${tFold.record} → ${tHold.record}`,
  );

  // Every chapter of the record is hung from the thread at the date it
  // began, and nothing is drawn to say where it ended — the station carries
  // a start, the ledger carries the span in words.
  await phaseAt(0.02);
  const route = await page.evaluate(() => ({
    stations: [...document.querySelectorAll('.station')].map((s) => ({
      role: s.querySelector('.station__role')?.textContent.trim(),
      when: s.querySelector('.station__when')?.textContent.trim(),
      brief: s.querySelector('.station__brief')?.textContent.trim(),
      kind: s.dataset.kind,
    })),
    breaks: document.querySelectorAll('.route__break').length,
    years: [...document.querySelectorAll('.route__date')].map((y) => y.textContent.trim()),
    spans: document.querySelectorAll('.route__under, .weft__bar, .loom__span').length,
    // Two stations on the same side of the thread may never touch.
    collisions: (() => {
      const cards = [...document.querySelectorAll('.station')].map((n) => ({
        side: n.dataset.side,
        b: n.querySelector('.station__card').getBoundingClientRect(),
      }));
      let bad = 0;
      for (let i = 0; i < cards.length; i += 1) {
        for (let j = i + 1; j < cards.length; j += 1) {
          if (cards[i].side !== cards[j].side) continue;
          const [a, c] = [cards[i].b, cards[j].b];
          if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) bad += 1;
        }
      }
      return bad;
    })(),
  }));
  check(
    'every chapter of the record hangs from the thread',
    route.stations.length === chronology.length && route.stations.every((s) => s.role && s.when && s.kind),
    `${route.stations.length} stations`,
  );
  // A card says what the entry was in one quick line, and says it in the
  // entry's own words: the line is cut off the front of the same copy the
  // record carries in full, so neither is written twice and neither can
  // contradict the other. A card is a thing read while it rides past, so
  // the line has to stay a line — a first sentence of two hundred and forty
  // characters is a paragraph, and nobody reads a paragraph going by.
  const QUICK = 92;
  check(
    'and each card says what it was in one quick line of its own copy',
    route.stations.every(
      (s) =>
        s.brief &&
        s.brief.length <= QUICK &&
        chronology.find((e) => e.role === s.role)?.detail.startsWith(s.brief.replace(/\.$/, '')),
    ),
    `longest ${Math.max(...route.stations.map((s) => s.brief?.length ?? 0))} characters`,
  );
  check('nothing is drawn to say where an entry ended', route.spans === 0, `${route.spans} spans`);
  check('no two stations collide', route.collisions === 0, `${route.collisions} overlaps`);
  // Inside a squeezed run the ticks stand a few pixels apart, so the years
  // there are not labelled at all — the break mark stands for them. What
  // must survive is the span itself: the year the chronology starts and the
  // year it reaches are both on the axis.
  check(
    'the axis is labelled from the first year to the last',
    route.years.includes(String(FIRST)) && route.years.includes(String(LAST)),
    route.years.join(' '),
  );
  // The axis is squeezed where nothing happens, and says so: an unmarked
  // non-linear axis is a lie about the data.
  check(
    'every squeezed run of the axis is struck with a break',
    route.breaks === 2,
    `${route.breaks} breaks`,
  );

  // And the record it settles into holds everything, in one frame.
  await phaseAt(0.98);
  const held = await page.evaluate(() => {
    const box = document.querySelector('.roll').getBoundingClientRect();
    const axis = document.querySelector('.route__window').getBoundingClientRect();
    const rows = [...document.querySelectorAll('.roll__row')];
    return {
      rows: rows.length,
      full: rows.every(
        (r) =>
          r.querySelector('.roll__when')?.textContent.trim() &&
          r.querySelector('.roll__role')?.textContent.trim() &&
          r.querySelector('.roll__detail')?.textContent.trim(),
      ),
      // The axis stands above the record, not across it.
      clear: box.top >= axis.bottom - 2,
      written: rows.every((r) => getComputedStyle(r).clipPath === 'none' || !getComputedStyle(r).clipPath.includes('100%')),
    };
  });
  // A record longer than the room under the axis is not cut off at the
  // foot of the frame: the overrun hangs below it and the leg leaves that
  // much room, so the last row scrolls into view as the frame moves on, on
  // the band's own ground. Measured at the far end of that room.
  const overrun = await page.evaluate(async () => {
    const route = document.querySelector('.route');
    const over = parseFloat(getComputedStyle(route).marginBlockEnd) || 0;
    scrollTo(0, route.getBoundingClientRect().top + scrollY + route.offsetHeight - innerHeight + over);
    await new Promise((r) => setTimeout(r, 250));
    const last = [...document.querySelectorAll('.roll__row')].at(-1).getBoundingClientRect();
    const band = document.getElementById('journey').getBoundingClientRect();
    return { over: Math.round(over), bottom: Math.round(last.bottom), onBand: last.bottom <= band.bottom };
  });
  check(
    'the record holds every entry, in full, and none of it is out of reach',
    held.rows === chronology.length && held.full && overrun.bottom <= 900 && overrun.onBand,
    `${held.rows} rows, ${overrun.over ? `${overrun.over}px carried past the frame` : 'in one frame'}, last row ends at ${overrun.bottom}`,
  );
  check('the axis stands clear above it', held.clear);
  // The axis is at its tightest once folded — one glass wide — and that is
  // where two labels would overprint each other into an unreadable smudge.
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('.route__year')]
      .filter((y) => Number(getComputedStyle(y).opacity) > 0.5)
      .map((y) => {
        const b = y.querySelector('.route__date').getBoundingClientRect();
        return { text: y.textContent.trim(), left: b.left, right: b.right };
      })
      .sort((a, b) => a.left - b.left),
  );
  check(
    'and no two of its labels overprint',
    labels.every((l, i) => i === 0 || l.left > labels[i - 1].right + 2) &&
      labels[0].left >= 0,
    `${labels.length} labels, tightest gap ${Math.round(
      Math.min(...labels.slice(1).map((l, i) => l.left - labels[i].right)),
    )}px`,
  );
  check('every row has finished being written by the hold', held.written);

  // Pointing at a row lights its knot on the axis — the one thing tying the
  // two readings together, and the only reason to keep both.
  await page.locator('.roll__row').nth(3).hover();
  await page.waitForTimeout(250);
  const tied = await page.evaluate(() => ({
    lit: document.querySelectorAll('.station[data-lit]').length,
    row: [...document.querySelectorAll('.roll__row')].findIndex((r) => r.dataset.lit),
    station: [...document.querySelectorAll('.station')].findIndex((s) => s.dataset.lit),
  }));
  check(
    'pointing at a row lights its own knot, and only its own',
    tied.lit === 1 && tied.row === 3 && tied.station === 3,
    `row ${tied.row} → knot ${tied.station}`,
  );

  // --- 04 · the runs ------------------------------------------------------
  // Five bands, every name on the page, the duplicate lap hidden from the
  // reader who hears it, and the bands actually running.
  await page.evaluate(() => scrollTo(0, document.getElementById('stack').offsetTop));
  await page.waitForTimeout(500);
  const names = stackRegisters.reduce((n, g) => n + g.items.length, 0);
  const runs = await page.evaluate(() => ({
    count: document.querySelectorAll('.run').length,
    spoken: document.querySelectorAll('.run__lap:not([aria-hidden]) .run__item').length,
    doubled: document.querySelectorAll('.run__lap[aria-hidden="true"] .run__item').length,
    marks: document.querySelectorAll('.run__lap:not([aria-hidden]) .run__mark').length,
    broken: [...document.querySelectorAll('.run__mark img')].filter(
      (img) => img.complete && img.naturalWidth === 0,
    ).length,
    // Every mark is drawn in the same square, whichever kind it is, or the
    // band loses its rhythm halfway along a register.
    sizes: new Set(
      [...document.querySelectorAll('.run__lap:not([aria-hidden]) .run__mark')].map((m) =>
        Math.round(m.getBoundingClientRect().width),
      ),
    ).size,
  }));
  check(
    'every name runs in its band, duplicates unspoken',
    runs.count === stackRegisters.length && runs.spoken === names && runs.doubled === names,
    `${runs.count} bands, ${runs.spoken} + ${runs.doubled} names`,
  );
  // A logo for a product, a drawn glyph for a practice, a monogram where
  // there is no logo file: every name has a mark and none of them is a
  // broken image.
  check(
    'every name carries a mark, and none of them is broken',
    runs.marks === names && runs.broken === 0,
    `${runs.marks} of ${names} marked, ${runs.broken} broken`,
  );
  check('every mark is drawn in the same square', runs.sizes === 1, `${runs.sizes} widths`);
  // A band pauses under a resting pointer, and the pointer is wherever the
  // last click left it — so it is parked off the bands before the run is
  // measured, or this reads whatever the previous assertion was hovering.
  await page.mouse.move(4, 4);
  await page.waitForTimeout(150);
  const x0 = await page.evaluate(() => document.querySelector('.run__lap').getBoundingClientRect().x);
  await page.waitForTimeout(500);
  const x1 = await page.evaluate(() => document.querySelector('.run__lap').getBoundingClientRect().x);
  check('the bands run', Math.abs(x1 - x0) > 2, `${(x1 - x0).toFixed(1)}px in 500ms`);
  await page.locator('.run').first().hover();
  await page.waitForTimeout(120);
  const h0 = await page.evaluate(() => document.querySelector('.run__lap').getBoundingClientRect().x);
  await page.waitForTimeout(400);
  const h1 = await page.evaluate(() => document.querySelector('.run__lap').getBoundingClientRect().x);
  check('resting on a band holds it still', Math.abs(h1 - h0) < 0.5, `${(h1 - h0).toFixed(2)}px while held`);

  // --- the warp -----------------------------------------------------------
  // The page's one thread fills as the reader weaves: nothing at the top,
  // everything at the fringe, and a knot for each band that carries you.
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  const wovenTop = await page.evaluate(() => parseFloat(document.documentElement.style.getPropertyValue('--woven') || '0'));
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  const wovenFoot = await page.evaluate(() => parseFloat(document.documentElement.style.getPropertyValue('--woven') || '0'));
  check('the warp fills from nothing to everything', wovenTop < 0.02 && wovenFoot > 0.98, `${wovenTop} → ${wovenFoot}`);
  const knots = await page.locator('.warp__knot').count();
  check('a knot for every band', knots === 5, `${knots}`);
  await page.locator('.warp__knot').nth(2).click();
  await scrollSettled(page);
  check(
    'a knot carries you to its band',
    await page.evaluate(() => Math.abs(document.getElementById('journey').getBoundingClientRect().top) < 240),
  );

  // --- the menu -----------------------------------------------------------
  // One menu, every width: it opens over everything, names the five bands in
  // both scripts, marks where you are, and a choice closes it and goes.
  await page.locator('.burger').click();
  await page.waitForSelector('.menu[open]', { timeout: 4000 });
  const menu = await page.evaluate(() => ({
    links: document.querySelectorAll('.menu__link').length,
    pairs: [...document.querySelectorAll('.menu__pair')].filter((p) => p.textContent.trim()).length,
    current: document.querySelector('.menu__link[aria-current="true"]')?.textContent ?? '',
  }));
  check(
    'the menu names all five bands in both scripts',
    menu.links === 5 && menu.pairs === 5,
    `${menu.links} links, ${menu.pairs} pairs`,
  );
  check('the menu marks where you are', menu.current.includes('Experience'), menu.current.trim().slice(0, 30));
  await page.locator('.menu__link', { hasText: 'Skills' }).click();
  await scrollSettled(page);
  check('a menu choice closes it and goes', (await page.locator('.menu[open]').count()) === 0);
  check(
    'and arrives at the band',
    await page.evaluate(() => Math.abs(document.getElementById('stack').getBoundingClientRect().top) < 240),
  );

  // --- the letter ---------------------------------------------------------
  await page.evaluate(() => scrollTo(0, document.getElementById('contact').offsetTop));
  await page.waitForTimeout(400);
  await page.locator('.form button[type="submit"]').click();
  await page.waitForTimeout(300);
  const fieldErrors = await page.locator('.field__error').count();
  check('empty form is refused with per-field errors', fieldErrors === 4, `${fieldErrors} errors`);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
  check('focus moves to the first bad field', focused === 'name', `focus on "${focused}"`);

  await page.fill('.form input[name="name"]', 'A Recruiter');
  await page.fill('.form input[name="email"]', 'not-an-address');
  await page.fill('.form input[name="subject"]', 'Role');
  await page.fill('.form textarea[name="message"]', 'Hello');
  await page.locator('.form button[type="submit"]').click();
  await page.waitForTimeout(250);
  check('a malformed email is caught', (await page.locator('.field__error').count()) === 1);

  // Fixing the address clears its error and nothing else speaks up. The row
  // of knots that used to count the ready fields is gone: it was a picture
  // of the four errors already written under the fields.
  await page.fill('.form input[name="email"]', 'recruiter@example.com');
  await page.waitForTimeout(250);
  const fixed = await page.evaluate(() => ({
    errors: document.querySelectorAll('.field__error').length,
    ticks: document.querySelectorAll('.field__ok').length,
    controls: document.querySelectorAll('.form button').length,
  }));
  check(
    'fixing a field clears its error, and the letter has one button',
    fixed.errors === 0 && fixed.ticks === 4 && fixed.controls === 1,
    `${fixed.errors} errors, ${fixed.ticks} ticks, ${fixed.controls} button`,
  );

  // Edition toggle.
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator('.edition').click();
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  check('edition toggle switches', before !== after, `${before} -> ${after}`);
  check('the choice is remembered', (await page.evaluate(() => localStorage.getItem('edition'))) === after);
  await page.locator('.edition').click();

  // Every outward link has a real destination.
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')].map((a) => a.getAttribute('href')),
  );
  check(
    'every external link has a destination',
    hrefs.length > 0 && hrefs.every((h) => h && h !== '#'),
    `${hrefs.length} links`,
  );

  // Copy written as lines has its breaks chosen by hand; a written break
  // that wraps looks like an accident.
  const wrapped = await page.evaluate(() =>
    [...document.querySelectorAll('.lines__part')]
      .filter((n) => n.getClientRects().length > 1)
      .map((n) => n.textContent.trim()),
  );
  check('no written line wraps', wrapped.length === 0, wrapped.join(' | '));

  // Nothing is painted outside the about band, and nothing anywhere makes
  // the page scroll sideways. (The deck clips itself and the route's track
  // hangs out of the glass by design — the pin's window clips it.)
  const spill = await page.evaluate(() => {
    for (const n of document.querySelectorAll('.reveal')) n.classList.add('is-in');
    const clipped = (el) => {
      let box = el.getBoundingClientRect();
      for (let p = el.parentElement; p; p = p.parentElement) {
        const s = getComputedStyle(p);
        const cuts =
          s.clipPath !== 'none' || s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible';
        if (!cuts) continue;
        const c = p.getBoundingClientRect();
        const left = Math.max(box.left, c.left);
        const top = Math.max(box.top, c.top);
        const right = Math.min(box.right, c.right);
        const bottom = Math.min(box.bottom, c.bottom);
        box = { left, top, right, bottom, width: right - left, height: bottom - top };
        if (box.width <= 0 || box.height <= 0) return null;
      }
      return box;
    };
    const sec = document.getElementById('about');
    const s = sec.getBoundingClientRect();
    const out = [];
    for (const el of sec.querySelectorAll('*')) {
      const raw = el.getBoundingClientRect();
      if (!raw.width || !raw.height) continue;
      const b = clipped(el);
      if (!b) continue;
      const over = Math.max(b.bottom - s.bottom, s.top - b.top, b.right - s.right, s.left - b.left);
      if (over > 1)
        out.push(`${el.tagName.toLowerCase()}.${(el.className?.baseVal ?? el.className ?? '').toString().split(' ')[0]}`);
    }
    return [...new Set(out)];
  });
  check('nothing hangs out of the opening band', spill.length === 0, spill.slice(0, 3).join(', ') || 'clean');
  const sideways = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check('no horizontal overflow at desk width', sideways <= 1, `${sideways}px`);

  // After one full pass, nothing that promised to arrive is still hidden.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(700);
  const stranded = await page.evaluate(() => document.querySelectorAll('.reveal:not(.is-in)').length);
  check('nothing is stranded unrevealed after a full pass', stranded === 0, `${stranded} left`);

  // The hero leans after the cursor a few pixels a plane, measured against
  // its own box. Further down the page the pointer is thousands of pixels
  // below that box: the lean came out ten times its range, the portrait
  // sank behind the second line, and it was still sunk when the reader
  // scrolled back up, until the mouse next moved.
  const planes = () =>
    page.evaluate(() => {
      const off = (selector) => {
        const m = new DOMMatrix(getComputedStyle(document.querySelector(selector)).transform);
        return Math.hypot(m.e, m.f);
      };
      return { portrait: off('.hero__portrait'), name: off('.hero__line--first') };
    });
  await page.mouse.move(700, 420, { steps: 3 });
  await page.waitForTimeout(800);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(120);
  const cameBack = await planes();
  check(
    'the hero is as it was set when the reader scrolls back up',
    cameBack.portrait < 0.5 && cameBack.name < 0.5,
    `portrait ${cameBack.portrait.toFixed(1)}px, name ${cameBack.name.toFixed(1)}px out`,
  );
  await page.mouse.move(160, 160, { steps: 3 });
  await page.waitForTimeout(800);
  const leant = await planes();
  check('and still leans after the cursor over it', leant.portrait > 4, `${leant.portrait.toFixed(1)}px`);

  check('no console errors', errors.length === 0, errors.join(' | ').slice(0, 200));
  await context.close();
}

// ------------------------------------------------------------- still (a11y)
// A reader who asked for stillness gets the same page standing: the route
// becomes a native sideways scroller, the bands stand wrapped with their
// duplicate laps dropped, and nothing waits for an entrance.
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await context.addInitScript(recordOverture);
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  console.log('\nSTILL');

  // The overture is the E standing, not written in and not spun, and it
  // goes when the page is ready.
  const standing = await page.evaluate(() => window.__overture);
  check(
    'the overture stands still as the E, then goes',
    standing.first?.rotate === '90deg' &&
      standing.first.animations === 0 &&
      standing.phases.at(-1) === 'gone',
    JSON.stringify(standing.first),
  );

  const still = await page.evaluate(() => {
    const pin = document.querySelector('.route__pin');
    const windowEl = document.querySelector('.route__window');
    const lap = document.querySelector('.run__lap');
    return {
      pinStatic: getComputedStyle(pin).position === 'static',
      sideways: getComputedStyle(windowEl).overflowX === 'auto',
      track: getComputedStyle(document.querySelector('.route__track')).transform === 'none',
      // Nothing cross-fades, so both readings stand at once and both are
      // under the reader's own hand.
      bothShown:
        Number(getComputedStyle(document.querySelector('.station__card')).opacity) === 1 &&
        Number(getComputedStyle(document.querySelector('.roll')).opacity) === 1,
      // The deal unpins too: the plates stand as a column of panels.
      deckStatic: getComputedStyle(document.querySelector('.deck__pin')).position === 'static',
      platesStill:
        getComputedStyle(document.querySelector('.piece')).transform === 'none' &&
        new Set(
          [...document.querySelectorAll('.piece')].map((p) =>
            Math.round(p.getBoundingClientRect().left),
          ),
        ).size === 1,
      lapStill: getComputedStyle(lap).animationName === 'none',
      doubledGone: getComputedStyle(document.querySelector('.run__lap[aria-hidden="true"]')).display === 'none',
      revealed: document.querySelectorAll('.reveal:not(.is-in)').length === 0,
    };
  });
  check('the route unpins into a native sideways scroller', still.pinStatic && still.sideways && still.track);
  check('and the thread and the record stand together', still.bothShown);
  check('the deck unpins into a column of plates', still.deckStatic && still.platesStill);
  check('the bands stand, duplicates dropped', still.lapStill && still.doubledGone);
  check('nothing waits for an entrance', still.revealed);
  await context.close();
}

// ----------------------------------------------------------------- compact
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);

  console.log('\nCOMPACT');

  await page.locator('.burger').click();
  await page.waitForSelector('.menu[open]', { timeout: 4000 });
  check('the menu opens', true);
  const menuFits = await page.evaluate(() => {
    const over = [...document.querySelectorAll('.menu__word')].filter(
      (w) => w.getBoundingClientRect().right > innerWidth + 1,
    );
    return over.length;
  });
  check('every band name fits the glass', menuFits === 0, `${menuFits} overflow`);

  await page.locator('.menu__link', { hasText: 'Projects' }).click();
  await scrollSettled(page);
  check('a menu link closes the menu and goes', (await page.locator('.menu[open]').count()) === 0);
  check(
    'and arrives at the band',
    await page.evaluate(() => Math.abs(document.getElementById('work').getBoundingClientRect().top) < 240),
  );
  check('scroll unlocked after the menu', !(await page.evaluate(() => document.body.dataset.locked)));
  await instant(page);

  // The deck is dealt the same way at phone width — same construction, same
  // site, and one plate in reach at a time there too.
  await dealTo(page, 1);
  const dealtM = await dealt(page);
  const wideM = await page.evaluate(() => document.querySelector('.piece').offsetWidth);
  check(
    'the plates are dealt from the left on a phone',
    dealtM.pin === 0 && Math.abs(dealtM.lefts[1]) <= 2 && dealtM.lefts[2] <= -wideM + 2,
    `pin ${dealtM.pin}, lefts ${dealtM.lefts.slice(0, 3).join('/')}`,
  );
  check(
    'and one plate is in reach',
    dealtM.inert.filter((v) => !v).length === 1 && dealtM.inert[1] === false,
  );

  // Every plate stands inside the glass on a phone: its name, its caption,
  // its actions and its screen. The narrowest phone in use and this one.
  // The page cannot scroll sideways either way, so a plate too wide for the
  // glass does not show up as overflow: it is simply cut off at the edge.
  const strays = [];
  for (const [width, height] of [
    [360, 800],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(300);
    for (let k = 0; k < projects.length; k += 1) {
      await dealTo(page, k);
      const stray = await page.evaluate((k) => {
        const piece = document.querySelectorAll('.piece')[k];
        const title = piece.querySelector('.piece__title');
        const off = ['.piece__meta', '.piece__title', '.piece__line', '.piece__acts', '.piece__stage'].filter(
          (sel) => {
            const box = piece.querySelector(sel).getBoundingClientRect();
            return box.left < -0.5 || box.right > innerWidth + 0.5;
          },
        );
        if (title.scrollWidth > title.clientWidth + 1) off.push('its name spills');
        return off.length ? `${title.textContent} at ${innerWidth}px: ${off.join(', ')}` : null;
      }, k);
      if (stray) strays.push(stray);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  check(
    'every plate stands inside the glass on a phone, name, caption and screen',
    strays.length === 0,
    strays.join('; ') || `all ${projects.length} at 360 and 390`,
  );

  // A plate opens its file at a tap.
  await dealTo(page, 0);
  await page.locator('.piece').first().getByRole('button', { name: 'Open the file' }).click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  check('a plate opens the file at a tap', (await page.locator('#dossier-title').textContent()) === 'PulseOS');

  await page.locator('.dossier .case__shot').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator('.dossier .case__shot').click();
  await page.waitForSelector('.loupe[open]', { timeout: 4000 });
  await page.waitForTimeout(400);
  const compactLoupe = await page.evaluate(() => {
    const box = document.querySelector('.loupe__img')?.getBoundingClientRect();
    return Boolean(box) && box.width <= innerWidth + 1 && box.height <= innerHeight;
  });
  check('a plate opens into the loupe on a narrow screen', compactLoupe);
  await page.keyboard.press('Escape');
  await page.waitForSelector('.loupe[open]', { state: 'detached', timeout: 4000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Every part in every file's register stays inside its column on the
  // narrowest phone: a name too long for the column breaks rather than
  // hanging past the rule.
  await page.setViewportSize({ width: 360, height: 800 });
  const hung = [];
  for (const entry of projects) {
    await page.evaluate((id) => {
      window.location.hash = `#work/${id}`;
    }, entry.id);
    await page.waitForSelector('.dossier[open]', { timeout: 4000 });
    await page.waitForTimeout(250);
    hung.push(
      ...(await page.evaluate(() =>
        [...document.querySelectorAll('.dossier .case__part')]
          .filter((part) => part.scrollWidth > part.clientWidth + 1)
          .map((part) => part.textContent.trim()),
      )),
    );
    await page.keyboard.press('Escape');
    await page.waitForSelector('.dossier[open]', { state: 'detached', timeout: 4000 });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  check(
    'every part in every file stays inside its column on a phone',
    hung.length === 0,
    hung.join(', ') || `all ${projects.length} files at 360`,
  );

  // The route travels at phone width too.
  const routeBoxM = await page.evaluate(() => {
    const r = document.querySelector('.route');
    return { top: r.getBoundingClientRect().top + scrollY, h: r.offsetHeight };
  });
  await page.evaluate(([y]) => scrollTo(0, y), [routeBoxM.top + (routeBoxM.h - 844) * 0.4]);
  await page.waitForTimeout(350);
  const travelM = await page.evaluate(() => ({
    pin: Math.round(document.querySelector('.route__pin').getBoundingClientRect().top),
    x: Math.round(new DOMMatrix(getComputedStyle(document.querySelector('.route__track')).transform).m41),
  }));
  check('the route pins and travels on a phone', travelM.pin === 0 && travelM.x < -200, `pin ${travelM.pin}, x ${travelM.x}`);

  // And it settles into the record there too, which on a phone is the only
  // reading that can hold everything at once.
  await page.evaluate(([y]) => scrollTo(0, y), [routeBoxM.top + (routeBoxM.h - 844) * 0.98]);
  await page.waitForTimeout(350);
  const recordM = await page.evaluate(() => {
    const box = document.querySelector('.roll').getBoundingClientRect();
    const axis = document.querySelector('.route__window').getBoundingClientRect();
    return {
      shown: Number(getComputedStyle(document.querySelector('.roll')).opacity) === 1,
      fits: box.height <= innerHeight - 16 && box.top >= 0 && box.bottom <= innerHeight,
      clear: box.top >= axis.bottom - 2,
      rows: document.querySelectorAll('.roll__row').length,
    };
  });
  check(
    'and folds into the record on a phone, under its axis',
    recordM.shown && recordM.fits && recordM.clear && recordM.rows === chronology.length,
    `${recordM.rows} rows, ${recordM.fits ? 'fits' : 'overflows'}`,
  );

  // The colophon wraps on a phone, and a dot left at either end of a line
  // is a separator separating nothing.
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  const hanging = await page.evaluate(() => {
    const rows = new Map();
    for (const item of document.querySelector('.colophon__line').children) {
      if (getComputedStyle(item).display === 'none') continue;
      const top = Math.round(item.getBoundingClientRect().top);
      rows.set(top, [...(rows.get(top) ?? []), item.textContent.trim()]);
    }
    return [...rows.values()].filter((row) => row[0] === '·' || row.at(-1) === '·').length;
  });
  check('the colophon leaves no dot hanging at the end of a line', hanging === 0, `${hanging} hanging`);

  // Nothing may scroll sideways at phone width.
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(async () => {
    // The hero's halo turns, and its box is widest at 45°. Stand it there,
    // so the answer does not depend on how long the run has taken to get
    // here: at the wrong moment it used to be the whole of the overflow.
    const turn = document.querySelector('.hero__halo')?.getAnimations()[0];
    if (turn) {
      turn.pause();
      turn.currentTime = turn.effect.getComputedTiming().duration / 8;
    }
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    const root = document.documentElement;
    const by = root.scrollWidth - root.clientWidth;
    turn?.play();
    // When it fails, name what is out past the edge, furthest first.
    const out =
      by <= 1
        ? []
        : [...document.querySelectorAll('body *')]
            .map((el) => [el, el.getBoundingClientRect()])
            .filter(([, box]) => box.width > 0 && box.right > root.clientWidth + 1)
            .sort((a, b) => b[1].right - a[1].right)
            .slice(0, 3)
            .map(([el, box]) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} to ${Math.round(box.right)}`);
    return { by, out: `${root.clientWidth}px wide${out.length ? `: ${out.join(', ')}` : ''}` };
  });
  check('no horizontal overflow', overflow.by <= 1, `${overflow.by}px, ${overflow.out}`);

  check('no console errors', errors.length === 0, errors.join(' | ').slice(0, 200));
  await context.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : '\nEvery check passed.');
process.exit(failures ? 1 : 0);
