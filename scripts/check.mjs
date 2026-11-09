// Drives the built site and asserts the interactive paths actually work.
//
//   npm run check            (expects `npm run preview` on :4317)
//
// This is not a unit test suite; it is the pass that stops "it renders" being
// mistaken for "it works". Every assertion here corresponds to something a
// visitor does: open a project, close it, navigate, submit the form badly,
// switch edition, open the compact menu.

import { createRequire } from 'node:module';

import { projects } from '../src/data/projects.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4317';

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

// Wait for a smooth scroll to come to rest instead of guessing a duration.
// A fixed wait turns the assertion into a race — the same scroll finishes
// well inside it on a warm paint and misses it on a cold one, which showed
// up as "nav scrolls to the chapter" failing about one run in eight.
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

const browser = await chromium.launch();

// ---------------------------------------------------------------- desktop
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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

  // The dial, clicked end to end. Choosing is a click and never a hover, so
  // crossing the rail with the pointer must change nothing; the rail must
  // hold its place whatever is up on the left; and the flash has to be on
  // exactly the entries that have something deployed — its presence is a
  // claim, so it is checked against the data.
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.locator('.chan').nth(3).hover();
  await page.waitForTimeout(300);
  check(
    'crossing the rail changes nothing',
    (await page.locator('.dial__title').textContent()) === projects[0].title,
    `showing ${await page.locator('.dial__title').textContent()}`,
  );

  // The first entry is already up, and clicking the one that is up opens its
  // file — so it is visited last, when it is no longer the one up.
  const order = [...projects.keys()].slice(1).concat(0);
  const swept = [];
  for (const i of order) {
    await page.locator('.chan').nth(i).click();
    await page.waitForTimeout(260);
    swept[i] = (
      await page.evaluate(() => {
        const stage = document.querySelector('.dial__stage');
        const device = document.querySelector('.dial .device');
        const open = document.querySelector('.dial__open');
        return {
          title: document.querySelector('.dial__title').textContent,
          frame: stage.dataset.frame,
          // Measured from the head rather than from the viewport: hovering
          // scrolls, so a viewport-relative figure moves for reasons that
          // have nothing to do with the layout. Kept at full precision and
          // compared with a tolerance below, because the page sits at a
          // fractional scroll offset and two rects read off it disagree in
          // the third decimal — a rounded figure then lands either side of a
          // boundary for reasons that are not the layout either.
          railTop:
            document.querySelector('.dial__rail').getBoundingClientRect().top -
            document.querySelector('.dial__head').getBoundingClientRect().top,
          screen: (() => {
            const b = device.querySelector('.device__screen').getBoundingClientRect();
            return `${Math.round(b.width)}x${Math.round(b.height)}`;
          })(),
          inside: (() => {
            const measure = document.querySelector('#work .chapter__inner').getBoundingClientRect();
            // The laptop's base is drawn wider than its lid, so it is the
            // edge that would cross the measure first.
            const parts = [device, device.querySelector('.device__base')].filter(Boolean);
            return parts.every((el) => {
              const b = el.getBoundingClientRect();
              return b.left >= measure.left - 1 && b.right <= measure.right + 1;
            });
          })(),
          fits: Math.round(device.getBoundingClientRect().width) <=
            Math.round(stage.getBoundingClientRect().width),
          section: Math.round(document.getElementById('work').getBoundingClientRect().height),
          live: open?.getAttribute('href') ?? null,
          flash: Boolean(document.querySelector('.flash')),
        };
      })
    );
  }

  // The seven names have to hold the same place on the page whatever is up
  // beside them, or the reader is choosing from a list that walks about.
  // The reserve on .dial__head holds this. The thing being guarded against
  // is a head that grows by a line, which moves the rail by the better part
  // of thirty pixels; under one pixel of spread is not the rail moving.
  const rails = swept.map((entry) => entry.railTop);
  const walk = Math.max(...rails) - Math.min(...rails);
  check(
    'the rail never moves',
    walk < 1,
    `${walk.toFixed(2)}px of walk across ${rails.length} entries`,
  );
  // The whole chapter has to stand in one frame on a laptop, whichever of
  // the seven is up — the artefact is sized backwards from the height of the
  // glass precisely so that it does.
  const frame = await page.evaluate(
    () => innerHeight - Math.round(document.querySelector('.bar, header')?.getBoundingClientRect().height ?? 0),
  );
  check(
    'the chapter stands in one frame',
    swept.every((entry) => entry.section <= frame),
    `tallest ${Math.max(...swept.map((e) => e.section))} of ${frame}`,
  );
  // Every chapter is given --frame as its height, so all five come out the
  // same height as each other as well as the same height as the glass. Two
  // separate claims, and the second is the one that quietly breaks: a
  // chapter whose content outgrows the frame keeps standing in one frame
  // right up until it doesn't.
  const framed = await page.evaluate(() => {
    const bar = document.querySelector('.topbar').getBoundingClientRect().height;
    const ids = ['about', 'work', 'journey', 'stack', 'contact'];
    return {
      heights: Object.fromEntries(ids.map((id) => [id, document.getElementById(id).getBoundingClientRect().height])),
      frame: innerHeight - bar,
    };
  });
  const tall = Object.values(framed.heights);
  const shown = Object.entries(framed.heights).map(([id, h]) => `${id} ${Math.round(h)}`).join(', ');
  check('every chapter is the same height', Math.max(...tall) - Math.min(...tall) < 1, shown);
  check(
    'and that height is one screen under the bar',
    tall.every((h) => Math.abs(h - framed.frame) < 1),
    `of ${Math.round(framed.frame)}`,
  );
  // Every chapter on the page takes its head and foot from the same two
  // named knobs, so one place controls the air above a heading and the air
  // under a section for all five. The thing that breaks it is a chapter
  // quietly setting a padding of its own — 05 did, for a deeper foot — so
  // this turns each knob on each section and insists the padding follows.
  const perChapter = await page.evaluate(() => {
    const bad = [];
    for (const id of ['about', 'work', 'journey', 'stack', 'contact']) {
      const el = document.getElementById(id);
      const pad = (side) => parseFloat(getComputedStyle(el)[side]);
      for (const [knob, side] of [['--space-above-title', 'paddingTop'], ['--space-below-section', 'paddingBottom']]) {
        el.style.setProperty(knob, '200px');
        const got = pad(side);
        el.style.setProperty(knob, '');
        if (Math.abs(got - 200) > 1) bad.push(`${id} ${knob} -> ${Math.round(got)}px`);
      }
    }
    return bad;
  });
  check(
    'every chapter takes its head and foot from the same two knobs',
    perChapter.length === 0,
    perChapter.join(', ') || 'all five follow both',
  );

  // The entry's words stand no wider than the rail of seven under them, and
  // the artefact has the whole of the other side to itself, from the top of
  // the name down — the text ends where the list ends.
  const panel = await page.evaluate(() => {
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const rail = r('.dial__rail');
    const widest = Math.max(...['.dial__title', '.dial__meta', '.dial__line'].map((s) => r(s).right));
    return {
      over: Math.round(widest - rail.right),
      beside: r('.dial__stage').left >= rail.right,
      fromTop: Math.round(Math.abs(r('.dial__stage').top - r('.dial__head').top)),
    };
  });
  check(
    "the entry's text ends where the rail ends",
    panel.over <= 1 && panel.beside && panel.fromTop <= 1,
    `${panel.over}px past the rail, artefact ${panel.beside ? 'beside it' : 'over it'}`,
  );
  // Nothing in either chapter may hang out of it. Both are given a height
  // now, and a grid row with a zero floor will happily keep that height and
  // let its contents out of the bottom instead.
  const spill = await page.evaluate(() => {
    for (const n of document.querySelectorAll('.reveal')) n.classList.add('is-in');
    const out = [];
    for (const id of ['about', 'work']) {
      const sec = document.getElementById(id);
      const s = sec.getBoundingClientRect();
      for (const el of sec.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        const over = Math.max(b.bottom - s.bottom, s.top - b.top, b.right - s.right, s.left - b.left);
        if (over > 1) out.push(`${id} ${el.tagName.toLowerCase()}.${(el.className?.baseVal ?? el.className ?? '').toString().split(' ')[0]}`);
      }
    }
    return [...new Set(out)];
  });
  check('nothing hangs out of either chapter', spill.length === 0, spill.slice(0, 3).join(', ') || 'clean');

  // Seven captures, three shapes between them. They are set into one box so
  // that the whole left of the page does not resize as the reader moves down
  // the rail, and the box stands inside the measure like everything else.
  check(
    'every entry comes up the same size',
    new Set(swept.map((entry) => entry.screen)).size === 1,
    [...new Set(swept.map((entry) => entry.screen))].join(' / '),
  );
  check(
    'nothing runs outside the measure',
    swept.every((entry) => entry.inside),
    swept.filter((entry) => !entry.inside).map((entry) => entry.title).join(', '),
  );
  // A web project was captured as one screen and is drawn in a laptop; a
  // mobile one was captured as three and is drawn on a plate, because a
  // capture with phones already in it cannot go inside another phone.
  check(
    'each entry is drawn in the frame its capture was made in',
    swept.every((entry, i) => entry.frame === (projects[i].frame === 'phone' ? 'plate' : 'laptop')),
    swept.map((entry) => entry.frame).join(', '),
  );
  check('no device is wider than its stage', swept.every((entry) => entry.fits));
  check(
    'the artefact opens the deployment where there is one',
    swept.every((entry, i) => entry.live === (projects[i].links.live ?? null)),
    swept.filter((entry, i) => entry.live !== (projects[i].links.live ?? null))
      .map((entry) => entry.title).join(', '),
  );
  check(
    'the flash is struck on those entries and only those',
    swept.every((entry, i) => entry.flash === Boolean(projects[i].links.live)),
    swept.filter((entry, i) => entry.flash !== Boolean(projects[i].links.live))
      .map((entry) => entry.title).join(', '),
  );

  // Every entry opens into its file, from the one control they all have.
  // PulseOS is the one up after the sweep.
  await page.locator('.act', { hasText: 'See more' }).click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  check(
    'See more opens the file',
    (await page.locator('#dossier-title').textContent()) === 'PulseOS',
  );

  // The cursor over an open file. A modal is painted in the top layer, above
  // every z-index on the page, so a cursor drawn in the page is drawn under
  // it — and with the native pointer hidden that left the file with no
  // cursor at all. The mechanism first, for the diagnostic:
  const raised = await page.evaluate(() => ({
    attr: document.documentElement.dataset.pointer,
    open: document.querySelector('.cursor')?.matches(':popover-open') ?? false,
  }));
  check(
    'the cursor is raised into the top layer',
    raised.attr === 'raised' && raised.open,
    `data-pointer="${raised.attr}", popover open: ${raised.open}`,
  );

  // Then the only honest test of a paint order, which is the pixels: the
  // same patch of the file with the cursor standing in it and with the
  // cursor somewhere else.
  const patch = { x: 660, y: 460, width: 80, height: 80 };
  await page.mouse.move(700, 500);
  await page.waitForTimeout(500);

  // The reticle is struck open over prose and only fills over something
  // that opens. It used to fill everywhere, because the root's own state
  // was kept under the same attribute elements opt in with and the search
  // for an interactive element walks up to the root.
  const overProse = await page.evaluate(
    () => document.querySelector('.cursor__ring')?.dataset.mode ?? '',
  );
  check('the reticle stays open over prose', overProse === '', `mode "${overProse}"`);
  const withCursor = await page.screenshot({ clip: patch });
  await page.mouse.move(1180, 800);
  await page.waitForTimeout(500);
  const without = await page.screenshot({ clip: patch });
  check('the cursor is drawn over an open file', !withCursor.equals(without));

  await page.keyboard.press('Escape');
  await page.waitForSelector('.dossier[open]', { state: 'detached', timeout: 4000 });

  // Opening a project. One click brings an entry up; a second on the one
  // already up opens its file.
  await page.locator('.chan').nth(1).click();
  await page.waitForTimeout(250);
  check(
    'clicking a channel brings that entry up',
    (await page.locator('.dial__title').textContent()) === 'Traverse',
  );
  await page.locator('.chan').nth(1).click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  const title = await page.locator('#dossier-title').textContent();
  check('clicking the channel again opens that project', title === 'Traverse', `got "${title}"`);
  check('dossier address is shareable', page.url().endsWith('#work/traverse'), page.url());

  const shots = await page.locator('.dossier .plate').count();
  check('dossier shows the whole gallery', shots === 5, `${shots} plates for Traverse`);

  // The two standing facts run on one line and are set the same way, which
  // is the whole point of putting them there: same baseline, same type.
  const facts = await page.evaluate(() => {
    const line = document.querySelector('.dossier__for');
    const platform = document.querySelector('.dossier__platform');
    const type = (n) => {
      const s = getComputedStyle(n);
      return `${s.fontFamily}/${s.fontSize}/${s.fontWeight}/${s.letterSpacing}`;
    };
    return {
      same: Math.abs(line.getBoundingClientRect().top - platform.getBoundingClientRect().top) < 2,
      type: type(line) === type(platform),
      text: platform.textContent.trim(),
    };
  });
  check('what it was for and what it runs on share a line', facts.same && facts.type, facts.text);

  // The key functions are read at reading size, and the parts list beside
  // them is the smaller of the two — not the other way round.
  const steps = await page.evaluate(() => [
    parseFloat(getComputedStyle(document.querySelector('.points__row')).fontSize),
    parseFloat(getComputedStyle(document.querySelector('.spec__row')).fontSize),
  ]);
  check('the key functions are the larger type', steps[0] >= 20 && steps[0] > steps[1], steps.join('px vs ') + 'px');

  // Every piece of air down the file is a named knob. Turning one has to
  // move the band under it and nothing above it — a hardcoded value put
  // back by a later edit would leave the knob there and do nothing.
  const turned = await page.evaluate(() => {
    const file = document.querySelector('.dossier');
    const scroll = document.querySelector('.dossier__scroll');
    const at = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().top + scroll.scrollTop);
    const was = { title: at('.dossier__title'), sheet: at('.dossier__gallery'), foot: at('.dossier__foot') };
    const stood = parseFloat(getComputedStyle(document.querySelector('.dossier__gallery')).marginTop);
    file.style.setProperty('--space-above-sheet', '240px');
    const now = { title: at('.dossier__title'), sheet: at('.dossier__gallery'), foot: at('.dossier__foot') };
    file.style.removeProperty('--space-above-sheet');
    return {
      above: now.title - was.title,
      sheet: now.sheet - was.sheet,
      foot: now.foot - was.foot,
      expected: Math.round(240 - stood),
    };
  });
  check(
    'turning a spacing knob opens that band and only that band',
    turned.above === 0 && Math.abs(turned.sheet - turned.expected) <= 1 && Math.abs(turned.foot - turned.expected) <= 1,
    `title ${turned.above}px, sheet ${turned.sheet}px, foot ${turned.foot}px, expected ${turned.expected}px`,
  );

  // A plate off the sheet, into the loupe. A second modal over the first:
  // it has to stack above the file, step without closing it, and give the
  // file back at the place on the sheet it was opened from.
  await page.locator('.dossier .plate__open').nth(1).scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const atPlate = await page.evaluate(() => Math.round(document.querySelector('.dossier__scroll').scrollTop));
  await page.locator('.dossier .plate__open').nth(1).click();
  await page.waitForSelector('.loupe[open]', { timeout: 4000 });
  await page.waitForTimeout(500);

  const lifted = await page.evaluate(() => {
    const img = document.querySelector('.loupe__img');
    const box = img?.getBoundingClientRect();
    return {
      file: document.querySelector('.dossier')?.open,
      count: document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim(),
      lit: document.querySelector('.loupe__frame')?.dataset.lit === 'true',
      threads: document.querySelectorAll('.loupe__thread').length,
      here: [...document.querySelectorAll('.loupe__thread')].findIndex((n) => n.dataset.here === 'true'),
      fits: Boolean(box) && box.height <= innerHeight && box.width <= innerWidth,
      height: Math.round(box?.height ?? 0),
    };
  });
  check('a plate opens into the loupe over the file', lifted.file && lifted.count === '02 / 05', lifted.count);
  check('the loupe holds the capture inside the frame', lifted.fits && lifted.lit, `${lifted.height}px tall`);
  check('the warp marks where the reader is', lifted.threads === 5 && lifted.here === 1, `${lifted.here + 1} of ${lifted.threads}`);

  // The loupe stands in one frame, so its knobs are the other kind: air
  // given to one comes off the capture rather than pushing it off the
  // bottom of the window.
  const air = await page.evaluate(() => {
    const loupe = document.querySelector('.loupe');
    const box = () => document.querySelector('.loupe__img').getBoundingClientRect();
    const stood = parseFloat(getComputedStyle(document.querySelector('.loupe__inner')).rowGap);
    const was = box().height;
    loupe.style.setProperty('--space-around-capture', '96px');
    const now = box();
    loupe.style.removeProperty('--space-around-capture');
    return { lost: Math.round(was - now.height), expected: Math.round(2 * (96 - stood)), fits: now.bottom <= innerHeight };
  });
  check(
    'air given to the loupe comes off the capture',
    Math.abs(air.lost - air.expected) <= 2 && air.fits,
    `${air.lost}px off, expected ${air.expected}px`,
  );

  // The arrows step through the set and come round at the end of it.
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  const stepped = await page.evaluate(() => document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim());
  check('the arrows step through the plates', stepped === '01 / 05', stepped);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  const roundAgain = await page.evaluate(() => document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim());
  check('the set comes round rather than stopping', roundAgain === '05 / 05', roundAgain);

  // Escape is dealt with by the topmost modal, so it lifts the loupe and
  // leaves the file open where it was.
  await page.keyboard.press('Escape');
  await page.waitForSelector('.loupe[open]', { state: 'detached', timeout: 4000 });
  await page.waitForTimeout(250);
  const returned = await page.evaluate(() => ({
    file: document.querySelector('.dossier')?.open,
    at: Math.round(document.querySelector('.dossier__scroll').scrollTop),
    focus: document.activeElement?.getAttribute('aria-label') ?? '',
  }));
  check('Escape lifts the loupe and leaves the file open', returned.file === true);
  check(
    'the file is given back at the plate it was opened from',
    Math.abs(returned.at - atPlate) < 4 && returned.focus.startsWith('Plate 02'),
    `${returned.at} vs ${atPlate}, focus "${returned.focus}"`,
  );

  // Escape closes it and the address is restored.
  await page.keyboard.press('Escape');
  await page.waitForSelector('.dossier[open]', { state: 'detached', timeout: 4000 });
  check('Escape closes the dossier', true);
  check('address restored on close', !page.url().includes('#work/traverse'), page.url());
  check('scroll unlocked on close', !(await page.evaluate(() => document.body.dataset.locked)));

  // Deep link.
  await page.goto(`${BASE}#work/pit-wall`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.dossier[open]', { timeout: 5000 });
  check('a project URL opens that project', (await page.locator('#dossier-title').textContent()) === 'Pit Wall');
  await page.keyboard.press('Escape');

  // Navigation.
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('.nav__link', { hasText: 'Journey' }).click();
  await scrollSettled(page);
  const atJourney = await page.evaluate(() => {
    const box = document.getElementById('journey').getBoundingClientRect();
    return Math.abs(box.top) < 220;
  });
  check('nav scrolls to the chapter', atJourney);
  await page.waitForTimeout(500);
  check(
    'active chapter is marked in the nav',
    (await page.locator('.nav__link[aria-current="true"]').textContent())?.includes('Journey'),
  );

  // The journey is chosen by click, never by hover, and choosing never moves
  // the page: the leaf is the one thing in the chapter whose height depends
  // on the entry, so it is sized by the loom rather than the other way round.
  await page.locator('#journey').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const leafRole = () => page.evaluate(() => document.querySelector('.leaf__role').textContent);
  const chosen = await leafRole();
  await page.locator('.weft', { hasText: 'GCSEs' }).hover();
  await page.waitForTimeout(250);
  check('hovering a row of the journey changes nothing', (await leafRole()) === chosen, `still "${chosen}"`);
  const journeyHeights = new Set();
  let leafSpill = 0;
  for (const row of await page.locator('.weft').all()) {
    await row.click();
    await page.waitForTimeout(180);
    const read = await page.evaluate(() => {
      const swap = document.querySelector('.leaf__swap');
      return { h: Math.round(document.getElementById('journey').getBoundingClientRect().height), spill: swap.scrollHeight - swap.clientHeight };
    });
    journeyHeights.add(read.h);
    leafSpill = Math.max(leafSpill, read.spill);
  }
  check('a click chooses, and every entry has a role', (await leafRole()).length > 0 && (await page.locator('.weft__role').count()) === 7);
  check('choosing an entry never moves the page', journeyHeights.size === 1, [...journeyHeights].join(' / '));
  check('every entry fits its leaf', leafSpill <= 1, `${leafSpill}px over at worst`);

  // The specimen: size follows the count, and choosing a name never moves
  // the page either.
  await page.locator('#stack').scrollIntoViewIfNeeded();
  const specimen = await page.evaluate(() => {
    const names = [...document.querySelectorAll('.specimen:not([hidden]) .specimen__name')];
    // The name is the button's first text node; the figure and the spoken
    // count follow it, and "Java" is the start of "JavaScript".
    const size = (text) => parseFloat(getComputedStyle(names.find((n) => n.firstChild.textContent === text)).fontSize);
    return { js: size('JavaScript'), html: size('HTML'), ts: size('TypeScript'), java: size('Java') };
  });
  check(
    'the specimen is set by how much each name is used',
    specimen.js > specimen.html && specimen.html > specimen.ts && specimen.ts > specimen.java,
    `JavaScript ${Math.round(specimen.js)} > HTML ${Math.round(specimen.html)} > TypeScript ${Math.round(specimen.ts)} > Java ${Math.round(specimen.java)}`,
  );
  const stackHeights = new Set();
  for (const tab of await page.locator('.tab').all()) {
    await tab.click();
    for (const name of await page.locator('.specimen:not([hidden]) .specimen__name').all()) {
      await name.click();
      stackHeights.add(await page.evaluate(() => Math.round(document.getElementById('stack').getBoundingClientRect().height)));
    }
  }
  check('choosing a name never moves the page', stackHeights.size === 1, [...stackHeights].join(' / '));

  // The stack cross-links into the register.
  await page.locator('.tab').first().click();
  await page.locator('.specimen:not([hidden]) .specimen__name').first().click();
  await page.locator('.reading__project').first().click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  check('a technology links through to a project', Boolean(await page.locator('#dossier-title').textContent()));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // The form refuses an empty submission and says why.
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('.form button[type="submit"]').click();
  await page.waitForTimeout(300);
  const fieldErrors = await page.locator('.field__error').count();
  check('empty form is refused with per-field errors', fieldErrors === 4, `${fieldErrors} errors`);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('name'));
  check('focus moves to the first bad field', focused === 'name', `focus on "${focused}"`);

  // A malformed address is caught before the network is touched.
  await page.fill('.form input[name="name"]', 'A Recruiter');
  await page.fill('.form input[name="email"]', 'not-an-address');
  await page.fill('.form input[name="subject"]', 'Role');
  await page.fill('.form textarea[name="message"]', 'Hello');
  await page.locator('.form button[type="submit"]').click();
  await page.waitForTimeout(250);
  check('a malformed email is caught', (await page.locator('.field__error').count()) === 1);

  // The letter answers as it is filled: a knot struck for each field that is
  // ready, and the send button filled in only once all four are.
  const partWay = await page.evaluate(() => ({
    struck: document.querySelectorAll('.form__knot[data-struck]').length,
    ready: document.querySelector('.form__send').dataset.ready,
  }));
  await page.fill('.form input[name="email"]', 'recruiter@example.com');
  await page.waitForTimeout(200);
  const allIn = await page.evaluate(() => ({
    struck: document.querySelectorAll('.form__knot[data-struck]').length,
    ready: document.querySelector('.form__send').dataset.ready,
    errors: document.querySelectorAll('.field__error').length,
  }));
  check(
    'the letter strikes a knot for each field that is ready',
    partWay.struck === 3 && !partWay.ready && allIn.struck === 4 && allIn.ready === 'true' && allIn.errors === 0,
    `${partWay.struck} of 4, then ${allIn.struck} of 4 and ready`,
  );

  // Edition toggle.
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator('.edition').click();
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  check('edition toggle switches and persists', before !== after, `${before} -> ${after}`);
  check(
    'the choice is remembered',
    (await page.evaluate(() => localStorage.getItem('edition'))) === after,
  );

  // Every outward link has a real destination.
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')].map((a) => a.getAttribute('href')),
  );
  check(
    'every external link has a destination',
    hrefs.length > 0 && hrefs.every((h) => h && h !== '#'),
    `${hrefs.length} links`,
  );

  // Copy written as lines (profile.blurb, the About lede) has its breaks
  // chosen by hand. A line longer than its column wraps, and a written break
  // that wraps looks like an accident rather than a decision — so the page
  // is asked whether any of them has more than one line box.
  const wrapped = await page.evaluate(() =>
    [...document.querySelectorAll('.lines__part')].filter((n) => n.getClientRects().length > 1)
      .map((n) => n.textContent.trim()),
  );
  check('no written line wraps', wrapped.length === 0, wrapped.join(' | '));

  check('no console errors', errors.length === 0, errors.join(' | '));
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
  check('the compact menu opens', true);

  await page.locator('.menu__link', { hasText: 'Selected work' }).click();
  await scrollSettled(page);
  check('a menu link closes the menu', (await page.locator('.menu[open]').count()) === 0);
  check('and scrolls to the chapter', await page.evaluate(() => {
    const box = document.getElementById('work').getBoundingClientRect();
    return Math.abs(box.top) < 240;
  }));
  check('scroll unlocked after the menu', !(await page.evaluate(() => document.body.dataset.locked)));

  // The first channel is already the one up, so a single tap on it opens the
  // file; tapping any other one brings that entry up first.
  await page.locator('.chan').first().click();
  await page.waitForSelector('.dossier[open]', { timeout: 4000 });
  check('tapping an entry opens the file', (await page.locator('#dossier-title').textContent()) === 'PulseOS');

  // And a plate on the sheet still opens into the loupe on a narrow screen,
  // where the warp comes off and the two marks are what move.
  await page.locator('.dossier .plate__open').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator('.dossier .plate__open').first().click();
  await page.waitForSelector('.loupe[open]', { timeout: 4000 });
  await page.waitForTimeout(400);
  const compactLoupe = await page.evaluate(() => {
    const box = document.querySelector('.loupe__img')?.getBoundingClientRect();
    return {
      fits: Boolean(box) && box.width <= innerWidth + 1 && box.height <= innerHeight,
      warp: getComputedStyle(document.querySelector('.loupe__warp')).display,
      steps: document.querySelectorAll('.loupe__steps .iconbtn').length,
      count: document.querySelector('.loupe__count')?.textContent.replace(/\s+/g, ' ').trim(),
    };
  });
  check('a plate opens into the loupe on a narrow screen', compactLoupe.fits, compactLoupe.count);
  check(
    'the warp comes off and the marks stay',
    compactLoupe.warp === 'none' && compactLoupe.steps === 2,
    `warp ${compactLoupe.warp}, ${compactLoupe.steps} marks`,
  );
  await page.keyboard.press('Escape');
  await page.waitForSelector('.loupe[open]', { state: 'detached', timeout: 4000 });

  // Nothing may scroll sideways at phone width.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check('no horizontal overflow', overflow <= 1, `${overflow}px`);

  check('no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : '\nEvery check passed.');
process.exit(failures ? 1 : 0);
