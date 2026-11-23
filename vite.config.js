import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { FIGS, MARKS, TILES } from './overture/figures.js';

// The overture is in index.html rather than in the app, because a loader has
// to be on the glass before the script that would draw it has arrived. This
// is where it is put together, at build:
//
//   · overture/score.html is written into the stage where index.html says
//     <!-- SCORE -->.
//   · every <g data-fig="name"></g> in it is filled with that figure from
//     overture/figures.js, and every data-mark="name" becomes a path's d.
//   · every tile token in the rules becomes the data URL it names.
//
// So there is still only one drawing of everything: the geometry is struck
// from src/lib/girih.js and src/lib/mark.js like the rest of the site's.

const SCORE = fileURLToPath(new URL('./overture/score.html', import.meta.url));

const figures = (html) =>
  html
    .replace(/<g([^>]*?)\sdata-fig="([a-z0-9-]+)"([^>]*)><\/g>/g, (whole, before, name, after) =>
      FIGS[name] ? `<g${before}${after}>${FIGS[name]()}</g>` : whole,
    )
    .replace(/data-mark="([a-z-]+)"/g, (whole, name) => (MARKS[name] ? `d="${MARKS[name]}"` : whole));

const tiles = (html) => Object.entries(TILES).reduce((out, [token, url]) => out.replaceAll(token, url), html);

const overture = () => ({
  name: 'overture',
  transformIndexHtml: (html) => tiles(figures(html.replace('<!-- SCORE -->', readFileSync(SCORE, 'utf8').trim()))),
  // The score is not a module, so the dev server is told when it changes.
  configureServer(server) {
    server.watcher.add(SCORE);
  },
  handleHotUpdate({ file, server }) {
    if (file === SCORE) {
      server.ws.send({ type: 'full-reload' });
      return [];
    }
    return undefined;
  },
});

export default defineConfig({
  plugins: [react(), overture()],
});
