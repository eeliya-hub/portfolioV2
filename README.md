# eeliyanayeri.com

The portfolio of Eeliya Nayeri — a record of seven finished projects, built as a **naqsheh**:
the squared cartoon a Persian weaver works from, which is a colour-indexed bitmap five
centuries before the bitmap. Everything ornamental on the site is geometry struck from a
centre, not an image stretched to fit.

## Running it

```bash
npm install
npm run dev        # Vite dev server
npm run build      # build to dist/
npm run preview    # serve the built site on :4317
```

## Checks

Each of these fails loudly rather than warning, so a regression stops the build rather than
shipping.

```bash
npm run lint       # ESLint
npm run contrast   # every text pairing in both editions, against WCAG 2.2 AA
npm run check      # drives the built site: 26 interaction assertions, both widths
npm run shots      # screenshots every chapter, both widths, both editions
npm run treat      # crop the About photographs and soften what is behind the subject
npm run media      # rebuild the responsive WebP sets from src/assets
```

`npm run check` and `npm run shots` expect `npm run preview` to be running.

## How it is put together

- **Content is data.** `src/data/` holds the register (`projects.js`), the person
  (`profile.js`), the chronology (`journey.js`) and the stack (`stack.js`). These are plain
  data with no imports, so the Node scripts can read them under bare Node. Editing the site's
  words means editing these, never the components. Nothing in the chapters invents a fact.
- **Figures are derived, never typed.** The count beside a technology in the stack chapter is
  computed from `projects.js` at render time (`src/lib/stack.js`); the timeline bars are
  struck from the dates in `journey.js`; the chapter counts come from the arrays themselves.
  None of them can drift from the data.
- **Selected work is a dial.** One device on a stage, the seven projects as channels beneath
  it. Pointing at a channel changes the screen; clicking the channel already on the stage
  opens the file. The three actions under the glass are always the same three — live, source,
  case study — and one that is missing says so rather than disappearing.
- **Copy with written line breaks.** The About lede in `src/lib/chapters.js` is an array: one
  entry per line of the page on a wide screen, running together as prose below 64rem. Edit the
  strings to change where the lines break. `npm run check` fails if a written line is long
  enough to wrap, since a break that wraps looks like an accident. The About paragraph works
  the other way — one sentence, with `--blurb` on `.about` deciding how wide it runs and so
  how many lines it takes.
- **The About photographs are treated, not shot that way.** `npm run treat` crops each one
  and, where a treatment asks for it, holds the subject sharp while the room behind goes
  soft, using a real Vision foreground-instance matte from `scripts/subject-mask.swift` —
  chosen by naming a point that lands on whoever should stay in focus. Two of the three are
  cropped only: where the background is the record of the occasion (the stage branding behind
  the Ideathon panel, the walkway and the skyline behind the graduation) softening it takes
  more out of the photograph than the separation buys back. Run it before `npm run media`.
- **The About framing is data, in one place.** Each photograph's `crop` in
  `src/data/profile.js` names its window's `aspect` (left out, the photograph's own shape),
  the `zoom` it is held at and the `focus` point kept in view. At zoom 1 nothing is enlarged
  and the photograph moves only on the axis the window and the photograph disagree about;
  above 1 it moves freely in any direction. There is no in-page editor: the numbers are
  written here and nowhere else.
- **Images are generated.** `npm run media` reads only the stems the data references and
  writes responsive WebP sets plus a manifest into `src/media/`. Originals live in
  `src/assets/` and are never bundled, so an unused photograph cannot reach the build, and a
  referenced screenshot with no source file fails the run. 48 MB of source becomes 6.2 MB.
- **Ornament is generated too.** `src/lib/girih.js` returns SVG paths for the shamsa rosette
  and the running knot band — real star-polygon geometry, so a motif can be drawn as
  construction lines, takes its colour from the theme at any size, and needs no second asset
  for the night edition.
- **Two editions, art-directed separately.** Day is ivory parchment with a madder crimson
  field; night is lacquered black with bone type and brass. Not a tint inversion. Switched on
  `data-theme` (`day` / `night`) and set before first paint by the inline script in
  `index.html`, so a night visitor never sees the ivory flash past.
- **Surfaces carry their own ink.** `.on-field` (the madder close) and `.on-lacquer` (the
  project dossier) redefine the whole ink ramp, so a button or a rule written once works on
  parchment, on madder and on lacquer. `npm run contrast` measures all three.

### The stylesheets

| File | What it owns |
|---|---|
| `src/styles/tokens.css` | The two editions, the surface scopes, the knot module, type, motion |
| `src/styles/base.css` | Reset, browser surfaces, the loom grid, cartouche controls, reveals, fields |
| `src/styles/chapters.css` | Every composition, in the order a visitor meets them |

### Accessibility

WCAG 2.2 AA is the bar, and it is enforced rather than intended:

- Every pairing is computed by `scripts/contrast.mjs` in both editions and on every surface.
  Terracotta, brass and sand are field colours — nothing sets small type on them.
- State is a mark, not a hue: an entry's evidence badges carry a drawn glyph and a word, the
  stack meter prints its figure beside the filled knots, and a running timeline bar frays
  rather than relying on colour.
- The project dossier and the compact menu are native `<dialog>` elements, so modality,
  Escape and focus return come from the platform.
- `prefers-reduced-motion` skips the overture entirely and neutralises every entrance.
- The Persian name is rendered with a real Persian face and correct RTL shaping; that
  spelling — ایلیا نیری — is correct as written and must not be "corrected".

`PRODUCT.md` records what the site is for and what is pinned. `DESIGN.md` records the visual
system.
