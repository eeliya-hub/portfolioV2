// Batched inspection screenshots. Settles entrance motion, then captures every
// page at desktop and phone width into .impeccable/review/.
//
//   node scripts/shots.mjs [baseUrl]

import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.argv[2] ?? 'http://localhost:4317';
const OUT = resolve(import.meta.dirname, '../.impeccable/review');

// One page, six chapters: capture each chapter in place.
const ROUTES = [
  ['hero', '/'],
  ['about', '/#about'],
  ['work', '/#work'],
  ['journey', '/#journey'],
  ['stack', '/#stack'],
  ['contact', '/#contact'],
  ['dossier', '/#work/pulseos'],
];

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const [vpName, viewport] of VIEWPORTS) {
  for (const [theme, colorScheme] of [
    ['', 'light'],
    ['-dark', 'dark'],
  ]) {
    const context = await browser.newContext({
      viewport,
      colorScheme,
      deviceScaleFactor: 2,
      // Entrance animations are authored; freeze them so a capture never
      // records a mid-animation frame as a missing element.
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    for (const [name, route] of ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Walk the page so every lazy image enters the viewport, then wait for
      // each one to actually decode. A full-page shot taken before this holds
      // empty frames, and an empty frame reads as a missing image.
      //
      // The walk covers every scroller, not just the window: an open dossier
      // locks the body and keeps its own column and a horizontal filmstrip,
      // and images inside those never enter the viewport by scrolling the
      // page alone.
      await page.evaluate(async () => {
        const rest = (ms) => new Promise((r) => setTimeout(r, ms));

        const walk = async (el, axis) => {
          const [size, extent, to] =
            axis === 'y'
              ? [el.clientHeight, el.scrollHeight, (v) => el.scrollTo({ top: v })]
              : [el.clientWidth, el.scrollWidth, (v) => el.scrollTo({ left: v })];
          const step = Math.max(1, Math.round(size * 0.8));
          for (let v = 0; v < extent; v += step) {
            to(v);
            await rest(90);
          }
          to(0);
          await rest(60);
        };

        const scrollers = [...document.querySelectorAll('*')].filter((el) => {
          const style = getComputedStyle(el);
          return (
            (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 8) ||
            (/(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 8)
          );
        });

        for (const el of scrollers) {
          const style = getComputedStyle(el);
          if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 8) {
            await walk(el, 'y');
          }
          if (/(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 8) {
            await walk(el, 'x');
          }
        }

        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await rest(110);
        }
        window.scrollTo(0, 0);
      });
      // Only images that are actually laid out can ever load: a lazy image
      // inside a `display: none` branch (the project plate is hidden at
      // phone width) never fetches, so waiting on it would wait for ever.
      await page.waitForFunction(
        () =>
          Array.from(document.images)
            .filter((image) => image.getClientRects().length > 0)
            .every((image) => image.complete && image.naturalWidth > 0),
        null,
        { timeout: 20000 },
      );
      // Only now jump to the chapter: the settling walk above scrolls the
      // page, so jumping before it would land back at the top.
      await page.evaluate((hash) => {
        const id = hash.replace('/#', '');
        if (id) document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        else window.scrollTo(0, 0);
      }, route);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${vpName}${theme}-${name}.png` });
      console.log(`  ${vpName}${theme}-${name}.png`);
    }

    if (errors.length) {
      console.error(`\nCONSOLE ERRORS (${vpName}${theme}):`);
      for (const error of [...new Set(errors)]) console.error(`  ${error}`);
    }

    await context.close();
  }
}

await browser.close();
console.log('\ndone');
