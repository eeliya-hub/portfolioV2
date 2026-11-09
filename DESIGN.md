---
name: Naqsheh — eeliyanayeri.com
description: A personal portfolio built as a Persian weaver's cartoon — ornament as geometry, never wallpaper.
colors:
  ground: "#f1e9d9"
  ground-2: "#e7dcc6"
  paper: "#f8f3e8"
  lacquer: "#16110f"
  ink: "#1a1512"
  ink-2: "#5a4e44"
  ink-3: "#8d7f6e"
  madder: "#8e1c24"
  madder-lift: "#a8303a"
  on-madder: "#f4ead9"
  on-madder-2: "#e3bdb4"
  terracotta: "#bd6a45"
  sand: "#cdbb97"
  rule: "#d2c4a3"
  rule-strong: "#8c7a53"
  scrim: "rgb(8 6 5 / 72%)"
  night-ground: "#121010"
  night-ground-2: "#1b1715"
  night-paper: "#221c19"
  night-ink: "#f0e5d1"
  night-ink-2: "#b3a391"
  night-ink-3: "#7e7161"
  night-madder: "#e08c7d"
  night-field: "#76191f"
  night-brass: "#c9924a"
  night-sand: "#5f5240"
  night-rule: "#2e2723"
  night-rule-strong: "#7d6e5b"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.9rem, 6.6vw, 6rem)"
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: "-0.042em"
  hero:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15.8cqw"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.047em"
  persian:
    fontFamily: "Vazirmatn, Markazi, sans-serif"
    fontSize: "calc(var(--name-size) * 0.46)"
    fontWeight: 600
    lineHeight: 0.84
    letterSpacing: "normal"
  body:
    fontFamily: "Markazi, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.25rem, 0.5vw + 1.14rem, 1.5rem)"
    fontWeight: 450
    lineHeight: 1.3
    letterSpacing: "normal"
  lead:
    fontFamily: "Markazi, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.55rem, 1.25vw + 1.2rem, 2.2rem)"
    fontWeight: 450
    lineHeight: 1.16
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.19em"
  tiny:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.16em"
  micro:
    fontFamily: "Markazi, 'Iowan Old Style', Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 450
    lineHeight: 1.34
    letterSpacing: "normal"
  small:
    fontFamily: "Markazi, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 450
    lineHeight: 1.3
    letterSpacing: "normal"
  sub:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.8rem, 2.9vw, 2.9rem)"
    fontWeight: 740
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  entry:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.45rem, 2.3vw, 1.95rem)"
    fontWeight: 740
    lineHeight: 1
    letterSpacing: "-0.035em"
  focus:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.7rem)"
    fontWeight: 720
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  menu:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.9rem, 8vw, 2.9rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
rounded:
  none: "0"
spacing:
  k1: "clamp(0.8125rem, 1.05vw, 1.1875rem)"
  k2: "calc(var(--knot) * 2)"
  k3: "calc(var(--knot) * 3)"
  k4: "calc(var(--knot) * 4)"
  k6: "calc(var(--knot) * 6)"
  k8: "calc(var(--knot) * 8)"
  selvedge: "clamp(1.125rem, 3.4vw, 3.75rem)"
  gutter: "clamp(1.125rem, 4vw, 4.5rem)"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.82rem 1.25rem"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.82rem 1.25rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "2.75rem"
  entry-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "calc(var(--knot) * 2) var(--knot)"
  entry-row-active:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.on-madder}"
    rounded: "{rounded.none}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.48rem 0.8rem"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
  field-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.6rem 0 0.55rem"
---

# Naqsheh

## Overview

A **naqsheh** is the squared cartoon a Persian weaver works from: graph paper where one
cell is one knot and colour is indexed rather than painted. It is a colour-indexed bitmap
five centuries before the bitmap, which is why it — and not finished carpet pattern — is
the Iranian artefact this site is built from. The heritage is structural, not decorative:
ornament is geometry struck from a centre, the page margins are a woven selvedge that
doubles as the progress indicator, and the ground is a real girih tessellation rather than
a texture.

The system refuses two things explicitly: the dark-mode-with-neon-accent developer
portfolio, and the parchment-and-serif editorial default this domain already carried. It
also refuses the tourism register — no gold, no stock arabesque, no pattern used as
wallpaper.

Two editions ship, art-directed separately rather than inverted. **Day** is ivory parchment
with a madder crimson field. **Night** is a lacquered bookbinding: black ground, bone type,
brass where the day used terracotta, and an oxblood field *deeper* than the day's madder
rather than lighter. Night also gets its own composition — the hero figure is set larger,
lower, and graded into the ground it no longer has to float on.

## Colors

Madder is a **field**, not an accent. It carries whole regions: the contact chapter is a
full crimson ground, and the active row in the work register is a madder block. It is never
scattered as trim.

Three surface scopes redefine the whole ink ramp, so a control written once works on every
ground:

| Scope | Ground | Body ink | Use |
|---|---|---|---|
| page | `ground` / `ground-2` / `paper` | `ink` | everything by default |
| `.on-field` | `madder` (day) / `night-field` (night) | `on-madder` | the contact close, active register rows |
| `.on-lacquer` | `lacquer` | `#f2e8d5` | the project dossier, **pinned in both editions** |

**Terracotta, brass and sand are field colours.** Nothing sets small type on them — they
carry timeline bars, filled knots and tonal panels. Anything that does land on them takes
the darkest ink available.

Secondary text on a coloured ground is tinted from that hue (`on-madder-2` is drawn out of
the madder itself), never grey.

Every pairing is computed by `scripts/contrast.mjs`, not eyeballed. `npm run contrast`
measures 48 pairings across all three scopes in both editions and **exits non-zero** on any
failure, so a palette edit that breaks a pairing fails the build.

## Typography

Three faces, all self-hosted from `public/fonts`; no runtime request leaves the origin.

- **Archivo** (variable, width axis 62–125%) — display, labels, every figure. The width axis
  is load-bearing: the hero name is genuinely stretched to its measure, never letter-spaced
  to fake it. The two hero words carry different widths (119% / 112%) so six letters each
  land on the same measure.
- **Markazi Text** (variable) — all running copy. Drawn by an Iranian designer with a Persian
  companion, so the Latin and the Farsi come from one hand.
- **Vazirmatn** (variable, Saber Rastikerdar) — Persian at display size.

**Markazi sits on a tall em box** to carry Persian ascenders, so the usual 1.5 line-height
opens a chasm between Latin lines. Body runs at **1.3**, lead at **1.16**, display at
**0.84–0.92**. Measure these off the render, not off the number.

The hero sizes in `cqw` against a container query on `.hero__stage`, so the name scales with
its own column rather than the viewport.

**The ramp is closed.** Eleven named steps cover the whole site:

`tiny 0.72` · `label 0.82` · `micro 0.95` · `small 1.125` · `body 1.25–1.5` ·
`lead 1.55–2.2` · `focus 1.3–1.7` · `entry 1.45–1.95` · `sub 1.8–2.9` · `menu 1.9–2.9` ·
`head 2.9–6` — plus `hero`, which is `cqw` and belongs to one element.

Nothing outside this list. The small end previously carried nineteen one-off values between
0.58rem and 0.92rem, which is how a page gets ragged and how "the text is too small" becomes
true in nineteen different ways at once. The design hook enforces this: a literal font-size
in a stylesheet is a finding.

**Persian is never decoration.** It is rendered with a real Persian face, correct RTL and
correct joining. The spelling **ایلیا نیری** is correct as written and must not be
"corrected" to نایری. Any element with `dir="rtl"` flips logical inset properties — use
physical `top`/`left`/`right` inside one.

**The hero's bilingual fit is solved, not tuned.** The staggered Latin leaves two counter-
spaces — one at the right of the first line, one at the left of the second — and the Persian
occupies them exactly. Three rules, every constant measured off the rendered ink rather than
read from font metrics, because side bearings, negative tracking and the thin extremities of
ا and ی all land somewhere the metrics do not predict:

1. **The ink meets the measure, not the layout box.** Each line carries an inline margin
   equal to its own side bearing, so both scripts land exactly on the margin. The correction
   sits on `.hero__line` rather than on the word, because the line is what clips and a clip
   boundary resting on the ink would shave it.
2. **Each Persian word's ink box spans the Latin's cap band exactly.** The two scripts stand
   the same height: top on the cap line, bottom on the baseline, measured to the pixel. The
   words need different ratios — `--fa-first: 0.7551`, `--fa-second: 0.7706` — because ایلیا
   carries two alefs and a lam to its full ascender while نیری's tallest letter is a bowl.
   Each is lifted by its own descender depth (`--fa-drop-first`, `--fa-drop-second`) so its
   lowest stroke rests on the Latin baseline.

   **`--fa-stretch` is a deliberate distortion, and the only one in the site.** Vazirmatn has
   a weight axis but no width axis, and weight buys almost no width — 600 to 900 widens ایلیا
   by 3.5%. With the height pinned to the cap band, a horizontal scale is the only lever left
   for closing the gap to the Latin, so the signature carries `scale: 1.22 1` anchored at each
   line's outer margin, growing inward so the flush edge does not move. It thickens the
   vertical strokes, which the script needs here: Vazirmatn covers 34% of its ink box at 600
   against Archivo 800's 55%, so at 700 and stretched it finally reads as the same voice
   rather than a heading and a note. Never apply `letter-spacing` instead — it breaks the
   joins in a connected script. The undistorted way to extend Persian is the kashida, which
   inserts a character into the name and is therefore his call, not ours.
3. **Both Latin words render the same width**, which is what makes the stagger read as a
   block. Archivo's width axis is swept to find the pair — `125%` / `118.5%`, the first at the
   axis ceiling — that measures equal and leaves the Persian its counter. The air between the
   two scripts is whatever remains (about `12.5%` and `7%` of the measure), and it differs
   between the lines only because the two Persian words differ in length.

**Under the name is one register, not a column.** The name is ruled off, and what follows is
three rows across the full measure: the role at `--t-sub` in the display face, taking the
whole width; the standfirst at `--t-lead` running the measure; the two actions with the
scroll cue opposite them. The hero states what he is and what he builds, and nothing else —
that he is open to graduate roles is said in the About bio, and the location in the About
ledger and twice in Contact, so the hero does not repeat either. The role is set at display size because it is the
one thing the page must say about him, and under a name this large a label-sized role is a
caption rather than a statement. The earlier arrangement pressed all of it into a `42ch`
column and left the right half of the page empty.

`--fa-ratio`, `--fa-descender` and the two stretch values are a solved set. Changing one
without re-deriving the rest breaks the fit.

**The khatam frame.** The About photographs sit in octagonal windows, not the rotated squares
they were sketched as. An octagon takes the corners off a photograph where a diamond takes
half of it, and half of these is the half that says where they were taken — the London Eye
above the graduation, the team's name behind the stage. The corner is cut at 45°, where the
two squares of a khatam cross.

Around each window is the border a carpet actually carries: **two rules, a run of lozenge
knots between them along each straight edge, and a rosette struck over each of the four cut
corners** where the runs would otherwise collide. The rosette is small enough to sit inside the
band and its mat, and its ground is an octagon of its own figure, drawn still. A square ground
cut a straight notch out of the photograph's chamfered corner, and because it turned with the
rosette the notch moved — which is what read as the frame being cut off at random. At this size
the rosette carries three strokes: the outer ring, the star and the eye. The full figure's
inner ring and radial ties close up into a blot. `khatamFrame(aspect)` in `girih.js` builds
all of it in units where the plate is 100 tall, so one SVG scales to any size without
distorting — and because the geometry is *built from* the aspect rather than stretched to it,
the band keeps one width the whole way round a wide plate as readily as a square one. The
window is handed to the image as a `clip-path` struck from the same construction, so an
ordinary responsive image element keeps its `srcset` instead of becoming an SVG image with a
single fixed source.

**The band moves with the reader.** The three plates carry a scroll-driven animation —
`animation-timeline: view()` — so they pass the viewport at three different rates and the band
opens as it comes up the page and closes as it leaves. The travel is each plate's own drop
read back: the plate that sits lowest moves furthest, which keeps the fall of the band legible
while it is in motion. A timer cannot do this. Motion on a timer is decoration running on its
own clock; this is the reader's own scrolling, which is the only thing on the page that has
any business moving the photographs. Where the timeline is not supported the plates keep the
slow idle drift they had, and under `prefers-reduced-motion` they have neither. The photograph
inside also eases up a little against its own window on hover, so the frame stays exactly
where it is and only the picture moves — the window already clips to the octagon, so nothing
escapes the figure.

**The crop is data.** Each photograph carries a `crop` in `profile.js`: the `aspect` of its
window, the `zoom` it is held at, and the `focus` point kept in view. The photograph's box is
`zoom` times the window and `cover` then fills that box, so the two overhangs add and both are
driven by the same fraction — one continuous travel rather than two controls fighting. At zoom
1 nothing is enlarged and the photograph moves only on the axis the two shapes disagree about;
above 1 it moves freely in any direction, which is what cropping someone out of the edge of a
frame takes. These plates are drawn at a few hundred pixels from sources of a thousand and
more, so the enlargement costs no sharpness. The alternative — re-cutting the JPEG in
`treat-photographs.mjs` for every nudge — throws pixels away permanently and costs a media
rebuild each time.

Because the image's own box is now larger than the window, the window's `clip-path` is worn by
the element around the photograph rather than by the photograph: a clip measured against the
image would cut the wrong shape, and the ornament, as its sibling, stays unclipped. The global
`max-width: 100%` that keeps ordinary images inside their column has to be lifted here, or it
clamps the zoom away on one axis and leaves the photograph stretched.

These three numbers are the whole framing, and `profile.js` is the only place they are set.
An earlier version let a photograph be dragged and scrolled in the page to find them, with a
readout under the plate to paste back into the data file. It was removed on purpose: a crop
that can be nudged in the browser is a crop nobody can be sure of, and the tool's own readout
was the proof that the real decision always had to be written down anyway.

**Four knobs every chapter has**, set on `.chapter` so one place moves every chapter that does
not set its own: `--space-above-title` (the top of a section to its heading),
`--space-below-head` (the heading, its rule and its sentence to the body), `--space-above-guard`
(the body to the closing band of knots) and `--space-below-section` (the last thing to the end).
Every chapter stands in one frame now, so these move the composition *inside* the frame rather
than changing its height: whatever they take, the body row gives up, and only once it has
nothing left does the section grow. To change the height itself, change `--frame`. 01 and 02 set
their own over the top, in `.chapter--fit:has(.about)` and `.chapter--fit:has(.dial)`; 03, 04 and
05 take them from `.chapter`.

05 used to set a `padding-block-end` of its own for a deeper foot, which meant one of the five
did not answer to the knob that was supposed to own it. It sets `--space-below-section` instead
now, and `every chapter takes its head and foot from the same two knobs` in `scripts/check.mjs`
turns both knobs on all five sections and insists the padding follows.

**One frame, and the same frame — all five.** Every chapter carries `chapter--fit` and is given
`--frame` as a `min-block-size`, so all five come out the same height as each other as well as the
same height as the glass — whatever is in them, and without any one being told what that height
is. `--frame` is `100svh` less `--bar`, capped at 62rem, and `--bar` is what the fixed bar takes
off the top: a floor of four knots, or the bar's content and its two knots of padding, whichever is
taller. The bar's row takes its own height from that same figure rather than the other way
round, so the two cannot drift apart. Inside each section the head and the closing band take
what they need and the body row stretches, which is where the air a tall screen has spare
collects — around the photographs in 01, around the artefact in 02.

The cap is the "obvious extent", and it is measured rather than picked. With the floor lifted
off, the tallest chapter wants 944px at 2560×1146 and 969px at 2560×1440: the compositions have a
size they want, and past it they do not fill the extra height, they space out inside it. The cap
was 76rem for a while and every chapter on a tall screen carried 400px of ground it had nothing to
do with — holes between the things that belonged together, which is worse than a margin. At 62rem
a 1080p window is 12px short of the glass and a 1440p one shows the next chapter at the bottom
edge, which is what a page should do anyway. On a phone no chapter fits one screen and none is
made to — the frame is a floor, so each simply runs as long as it needs. `every chapter is the
same height` and `and that height is one screen under the bar` in `scripts/check.mjs` hold both
halves.

Each chapter has a short-window rule (`max-height: 52rem`) that closes its own air up on a
768px laptop — the rows of the journey, the lines of the letter, the knobs of 02. They are the
floor the figures come down to, not the figures to turn.

Both grid rows involved are `1fr` rather than `minmax(0, 1fr)`. With a zero floor a row keeps
the height the frame gave it and lets its contents out of the bottom instead, which is how the
row of controls in 02 came to be painted below the end of its own section.

**The two columns close on one line.** The register spans both rows of the grid and the
photographs are stood at the foot of the second, so whatever the register is taller than the
sentence by lands in that row and the medallion comes to rest level with it — no figure
anywhere says so. Where the photographs are the taller column instead, the register stretches
to meet them rather than the other way round: `align-self: stretch` with `grid-auto-rows: 1fr`,
so the column is divided into four equal rows and the extra height is shared between them
instead of pooling at the foot. Equal rows do three things at once — the register ends with the
medallion, the entries keep an even measure, and the band between two of them falls at the same
interval every time, which is what lets it be an ornament rather than a hairline landing
wherever the copy leaves it. Each entry is centred in its row, so the air above it and the air
below it are the same and the band sits midway. `.about` itself is `align-self: start`, which
is what keeps the
frame's spare height below the block rather than inside it — stretched, this grid took all of
it into the second row and opened a 270px hole between the sentence and the photographs.

**Composed to a screen.** About carries `chapter--fit`, and everything in it that decides its
height is measured in viewport height rather than in knots: the caps on the heading and on the
two blocks of type, `--band` (the height the medallion is drawn to), and six named spacing
knobs — `--space-above-title`, `--space-above-blurb`, `--space-below-blurb`,
`--space-between-entries`, `--space-below-photos` and `--space-below-section`. The knot is a
width module and cannot know how tall the glass is.

Each knob moves one piece of air and nothing else, which is why the grid's row gap is zero and
the bands carry their own margins: one gap cannot be two different numbers. Set any of them to
a fixed length and that piece stops moving with the height of the screen. Measured at
1440×900 they come out at 41, 27, 36, 10, 18 and 23 pixels.

They were none of those things for a while. Every one of the six was written
`clamp(min, 100.6vh, max)`, and 100.6vh is past every cap here, so all six sat pinned at their
caps and not one of them ever answered to the height of the glass. That is how a chapter
composed to stand in one screen came to be 1563px tall on a 768px one. The middle terms are
real figures now; keep any replacement in vh.

The band is then sized backwards from that height, which is the reverse of the usual: the
centre plate is 3.65 twelfths of the band after the gaps and its photograph is 0.808 wide to
tall, so its height is 0.3766 of the band's width. Inverting that gives the width that draws
the medallion at `--band`, capped at the measure.

Measured, the section stands in exactly one frame at 1280×800, 1366×768, 1440×900, 1512×982,
1680×1050, 1920×1080 and 2560×1440 — the same height as chapter 02 at every one of them, to
within a pixel. `the two composed chapters are the same height` and `and that height is one
screen under the bar` in `scripts/check.mjs` hold both halves of that.

Under 64rem of width it stops standing in one frame, and is meant to: the reading column and
the register together need more width than there is, and squeezed into an 872px measure the
four-line paragraph came out at nine lines. The two columns go one above the other there, and
because `min-block-size` is a floor rather than a height, what the section does instead of
cutting its own foot off is grow.

**The ground.** About and How it went carry `--chapter-ground` set to the second ground, so the
page alternates between the woven field and a plain one rather than running at one weight from
top to bottom. A chapter that changes its ground changes two other things with it, which is
why both are named rather than reached for directly: a rosette masking the knot band behind
it has to be filled in the ground it is sitting on (`--chapter-ground`), and a mark struck on
its own octagon has to be one step away from it (`--chapter-patch`). Left pointing at the page
ground, the rosettes came out as pale octagons on the sand and the register's marks vanished
into it.

**The composition.** Two columns. The left one reads — the statement, and under it the
medallion of three photographs that is the evidence for it. The right one is the register of
record, set as a colophon is set: four entries read down, nothing drawn round them, and a band
of knots woven between them. Each is a mark in the margin, the matter in small caps, the fact
under it, the qualification under that.

It was boxed before — closed top and bottom, a spine down the left edge, a plain hairline
between every entry — and the box was the problem, not the division. It was the only thing on
the page with a rule drawn round it, while everything else here that lists is a line under a
row and nothing more. Four rules and a spine read as a table pasted into a manuscript.

So the box went and the division stayed, as the page's own ornament rather than a hairline: the
band between two entries is the knot run woven across the foot of every chapter and struck at
every chapter join, taken down to a twelfth of its height and half its weight. Drawn as a mask
over a flat colour, so it takes the edition's own ink and costs no second asset. A register
divided by plain rules is a table; divided by the figure that closes a chapter it belongs to
the page it is set on.

The marks are outlined now rather than filled. The figure was always the octagon the
photographs are cut to — the smallest ornament on the page and the largest being the same shape
is the point of it — but filled, with an icon sitting in it, it read as a chip, which is a
component and not an ornament. Drawn as a hairline it is the khatam frame below it at a twelfth
the size. It takes two clipped layers, because a `clip-path` cannot be stroked: the outer one
is the line, the inner one punches the ground back out of it. A statement and a credential are different
kinds of claim, and setting them side by side rather than one above the other says so without
needing a label to say it.

It was three bands down the page before — statement, register, medallion — with the register
four cells across. Across, each entry had a quarter of the measure to fit a label, a value and
a detail into, so the longest wrapped to three lines while the shortest took one and the whole
row was ruled to the tallest. Down a column each entry has the width of the column and takes
exactly the height its own copy needs. The mark beside each one spans the entry rather than
sitting in the label's row, where it was the tallest thing in that row and quietly added
ninety pixels to the ledger for an ornament that was never meant to set the leading.

The statement is centred, and `--blurb` on `.about` is how wide it is allowed to run — which
is the same thing as how many lines it takes, since it is one sentence and it wraps. 24rem
gives it six lines, 34rem four, 46rem three, and 70rem — what it is set to — two, from about
1180px of viewport up. Below that the column runs out before the knob does and the paragraph
takes the lines it needs. It is the text column alone: the
rosette in the margin is not part of it, and the pair stays centred as the number changes. The
chapter lede above it goes the other way and has its break written down in `chapters.js`,
because that line has to land exactly at the end of the rule. A written break is right for a
line that has to land somewhere; a width is right for a paragraph whose shape should follow
the space it is in.

**The medallion.** The tall portrait in the middle, the two landscape plates flanking it, all
three standing on one baseline. `align-items: end` is what makes it a medallion rather than a
row: the centre's extra height all goes upward, so the flanks sit lower without being given an
offset to sit at, and the captions are held to two lines so the bottoms being aligned aligns
the frames and not just the type beneath them.

The three spans were solved, not chosen — the flanks come out at the same height as each other
and the centre about 1.3 times taller:

```
flank height h, centre height 1.3h
square   (1.000)  w = h       -> 3.50 twelfths
portrait (0.808)  w = 1.05h   -> 3.65
wide     (1.391)  w = 1.391h  -> 4.85
```

Change one and the other two have to be re-solved, or the medallion stops standing level. They
are declared beside the photographs in `About.jsx`, not as nth-child rules here: they are a
composition, not a style, and have to be read next to what they are composing. How large the
band is drawn is `--plate`, and how close together is `--plate-gap`; both are separate from
the spans on purpose, so the size of the band and the proportions inside it can be changed
without disturbing each other.

The plates were overlapped once, staggered across a 24-column grid, and later fell to the
right in a cascade. The frames are ornate enough that crowding them turned the band to
clutter, and the cascade read as three unrelated plates rather than one figure. A medallion is
the arrangement the ornament already belongs to.

**The register.** Four matters of record in four equal rows, divided by the page's own knot
run at a twelfth of its height — never boxed, never ruled round. Each mark is an *outlined*
octagon of the same figure the photographs are cut to, so the smallest ornament on the page is
the largest drawn small. The matter is set at `--t-micro`, a step above the page's label size,
and the qualification under the fact at `--t-small` in `--ink-2`: it was `--t-micro` in `--ink-3`
for a while, about 3:1 on the sand, small and faint at once for the line that says First Class.
The photo captions stay at `--t-label` but moved out of `--ink-3` for the same reason; a step
larger put the longest caption onto a fourth line at laptop widths and stood its frame off the
medallion's baseline. Under about 1400px all three reserve four lines, because there the
longest one needs them.

Every size in these chapters is a step on the type ramp in `tokens.css`. A few were literal
values for a while — 0.86rem, 1.06rem, 1.04rem — each tuned to make one thing fit, and the design
hook was right to flag them: a size that is not on the ramp is a size nobody can find again.

The frame has nothing in flow — both the image and the ornament are absolute — so an `auto`
grid column sizes it from its `aspect-ratio` and lets it overhang its own figure. It takes a
`minmax(0, 1fr)` column, which has to accept the width it is given.

**The frame draws itself.** Every ornament path carries `pathLength="1"`, so one
`stroke-dasharray` of `1` covers a path exactly whatever its real length, with nothing measured
in JavaScript. **A path that forgets `pathLength` gets a one-unit dash against its true length
and renders as a dotted line** — which is what the rosettes did until they were given it.
Stroke widths are in the frame's own units rather than `vector-effect: non-scaling-stroke`:
all three plates come out the same height, so one user-unit weight reads the same across the
band and nothing depends on how a browser scales a dash. The rosette's ground is filled rather
than stroked, so it is excluded from the dash and the animation rather than overridden.
On arrival the frame assembles in the order a draughtsman strikes it: the two rules, then the
running band, then the rosettes over the corners. The rosettes turn once settled — about their
own origin, since `transform-box: fill-box` cannot be relied on for a `<g>` — and the cluster
breathes, each plate on its own phase so they never rise and fall together. All of it sits
inside `prefers-reduced-motion: no-preference`.

An earlier version drew the full khatam star behind each window, its eight points standing out
past the flat edges. It was geometrically true and it looked like scratches. The version after
that was a plain hairline octagon and a mat, which was tidy and said nothing. The border is
the figure that earns the space.

## Layout

**The measure grows with the screen, and then stops.** `--measure` is
`min(96rem, max(72rem, 80vw))`: under about 1370px it is the `72rem` the compositions were tuned
at, above that it grows with the viewport, and it stops at 96rem.

The cap was taken off for a while — 84vw up to 124rem — on the reasoning that a field holding 57%
of a 2560px panel is a strip down the middle with a hand of empty ground either side. It is, and
the page was worse for the fix: a composition tuned at 72rem and let out to 1984px does not fill
the extra width, it spaces out inside it, and every chapter grew gaps that had nothing in them.
The cap is back, a little above the 92rem it was. Width past it is left as ground, which is what a
margin is for. What grows up to the cap is the field — the artefact, the loom, the photographs,
the specimen — never a line of type: anything that reads as prose carries its own cap in `ch`.

One module: **the knot**, `clamp(0.8125rem, 1.05vw, 1.1875rem)`. Every measure is a whole
number of knots, the way every measure on a weaver's cartoon is a whole number of cells.

**Nothing spans the full width.** The *selvedge* — the woven edge of a carpet — holds both
page margins at `clamp(1.125rem, 3.4vw, 3.75rem)`, and the field lives between them:

```
.chapter__inner {
  width: min(var(--measure), 100% - (var(--selvedge) + var(--gutter)) * 2);
  margin-inline: auto;
}
```

`--measure` is `72rem`. One responsive system serves every width; there are no separate
mobile components, only compositions that restack.

**Chapter heads** place the folio number in the *margin*, turned on its side, the way a
manuscript page is numbered. It is never a label stacked above the heading — that eyebrow
is banned outright, including in the dossier. At compact widths the folio joins the rule
line beside the chapter's own figure; it never moves above the title.

**Every chapter's head figure is derived from that chapter's own data** — a count, a span
of years, a credential. Two chapters must never show the same figure.

## Elevation & Depth

Depth is drawn, not lit. Devices are a draughtsman's elevation: ink rules, square corners,
no gloss, no bezel highlight, no drop shadow pretending the object floats.

Two shadow tokens exist and are used sparingly, both with an offset *and* a blur:

```
--shadow-lift: 0 2px 4px rgb(26 21 18 / 5%), 0 12px 32px -12px rgb(26 21 18 / 18%);
--shadow-deep: 0 8px 16px rgb(26 21 18 / 8%), 0 40px 80px -32px rgb(26 21 18 / 32%);
```

Real depth comes from **z-ordered planes moving at different speeds**: in the hero the type
moves 7px against the cursor, the figure 17px. Three planes, three rates.

## Shapes

**The ground moves three ways.** A carpet on a loom moves under the weaver's hands, and a
field that never moves is wallpaper. `.weave` is two passes of the same girih tessellation at
two scales, and between them they carry a drift, a sweep and a breath.

The **drift** walks each pass a whole tile on its own clock — 58s for the near one, 83s for
the finer one, in opposite directions — so the two scales never come back into step, and
because the travel is exactly one tile the loop is seamless whatever the clock says. The
**sweep** pulls both passes against the scroll, the near one further than the far one, so
reading the page draws the ground under it; it is the strongest of the three because it
answers to the reader rather than to a timer, and it is scroll-driven where the browser has
it and simply absent where it does not. The **breath** is a slow swell in the weight of the
finer pass, which is what keeps the whole thing from reading as a mechanism running at a
constant rate.

The three sit on `translate`, `transform` and `opacity` — three independent properties, so
they compose without fighting over one matrix, and all of it runs on the compositor.

None of it survives `prefers-reduced-motion`, and that is said explicitly rather than left to
the blanket rule. The blanket rule collapses every animation to a 0.001ms single run, which
parks each one at its *end* state: harmless for a drift that walks exactly one tile, but it
would leave the breath at its heaviest and the sweep at the far end of its travel.

**Nothing has a radius.** A weaver's cartoon is squared paper; a rounded corner is a
different craft. `rounded.none` is the only shape token, and it is not negotiable.

All ornament is generated in `src/lib/girih.js` as real geometry, never an image:

- `star(cx, cy, r, 8, 3)` — the shamsa. The inner radius is computed from where the `{8/3}`
  chords actually cross, not chosen by eye.
- `shamsa(size)` — a full rosette, paths emitted **in the order a draughtsman strikes them**:
  frame → ties → figure → eye. The stylesheet delays each role by its index, so the figure
  assembles rather than fading in.
- `knotRun()` — the running band of the selvedge and the chapter joins.
- `fieldTile()` / `fieldUrl()` — the seamless star-and-cross tessellation the whole page is
  laid on.

Every ornamental path carries `pathLength="1"`, so a draw-on is `stroke-dasharray: 1` and a
dashoffset from 1 to 0 — exact at any size, with nothing measured in JavaScript.

**Chapter 02 is a dial.** The left column is one panel: the name of what is up, the facts
about it, the sentence that says what it is, and under them the rail of seven. Its text stands
no wider than the rail — the words end where the list ends. The artefact has the whole of the
right-hand side to itself, from the top of the name to its row of controls, so it is measured
against the full height of the chapter's body and comes up half as large again as it did under a
name set across the top. A grid of seven cards makes the reader compare thumbnails; this makes
them compare products, at a size where the screen can be read.

The colour is doing a job now rather than decorating. The facts under the name are madder, and
the rail marks the same entry in madder — madder type, a madder wash under the row, the lozenge
struck — so the eye reads *what is up* and *where it sits in the list* as one thing. The six names
not up moved from `--ink-3` to `--ink-2`: they are names a reader has to read to choose between,
and `--ink-3` on this ground is about 3.4:1, under the floor for type that size. The sentence is
full ink; it was the faintest thing on the panel after the list. `the entry's text ends where the
rail ends` in `scripts/check.mjs` holds the shape. It replaced a register of seven
ruled rows with a small plate beside it — the register compared well but the artefact was too
small to judge, which in a chapter whose job is to show finished products is the wrong trade.

**Choosing is a click, never a hover.** A rail that changed the whole left of the page as the
pointer crossed it put the reader in the position of having to avoid it, and gave the
keyboard a different instrument from the mouse. One click brings an entry up; a second on the
one already up opens its file. `crossing the rail changes nothing` in `scripts/check.mjs`
holds it.

**One box, every entry.** The seven captures do not share a shape — three are 16:9, three
16:10 and one 2.1:1 — so left to themselves they came up at seven sizes and the whole left of
the page resized as the reader moved down the rail. The box is 16:9, the shape the most of
them already are, and a capture that is not that shape is set into it rather than cropped to
it: these screens are the work, and cutting a navigation bar off one to square it with the
next is not a trade worth making. What is left over is lacquer — the unlit part of a screen,
which is what every screen does with a picture that is not its own shape. `--screen-w` and
`--screen-h` describe the picture itself, which is why the plate's mount is moved outside the
screen in this chapter to match the laptop's lid.

The box is the smaller of two limits: the width the column can hold once the laptop's base
overhang is allowed for, and the height `--device-h` leaves once its lid and base are. Both
columns stand inside the measure like everything else on the page — nothing is drawn under
the artefact, no plate, no ground, no shadow, because the artefact is the drawing and
anything beneath it would be a second object competing with it.

**The artefact is the link.** A screen at this size that did nothing when clicked would be
the largest dead zone on the page, so it carries the biggest thing the entry has: the
deployment where there is one, the file where there is not. Where an entry is deployed, a
madder sash is struck across its top-left corner, clipped by a square on that corner so its
ends cut flush with the artefact's two edges. The sash is a mark and not a second, smaller
target beside the first — and only a deployed entry has one, which makes its presence
information rather than decoration.

**The chapter stands in one frame.** The artefact is sized backwards from the height of the
glass rather than forwards from a width — `--device-h` on `.dial` — so it is the screen that
decides how big the artefact can be and never the column. Everything else in the section is
measured against that height too, which is why what is left for the artefact is a share of
the viewport and a fixed remainder rather than one subtraction. Measured at 1024×768 through
2560×1440, the chapter fits with 28 to 386px to spare, and `the chapter stands in one frame`
holds it.

**Chapter 02 carries the same named knobs as chapter 01**, and two of its own for the air
around the entry's name — `--space-above-title`, `--space-above-blurb`, `--space-below-blurb`,
`--space-below-name`, `--space-below-entry`, `--space-below-artefact` and
`--space-below-section`, set on `.chapter--fit:has(.dial)` and listed in the stylesheet where
they are set. `--device-h` is the frame less every one of them, less `--space-for-type`
(the room the bar, the heading, the sentence and the row of actions need, the one measured
figure in the block). At 1440×900 they come out at 54, 31, 38, 16, 20, 20 and 29 pixels.

They are not all the same kind of knob, and the difference is worth knowing before turning
one. Air given to `--space-below-artefact` is taken off the artefact, because the artefact is
what is measured from the remainder. The rest is not, because the aside is the taller of the
two columns at every width measured — so it, and not the artefact, is what decides how tall
the section runs, and shrinking `--device-h` hands the room to nothing. Air given to those
goes into the height of the section, which the frame absorbs while it has the room. The two
inside the head of the aside are added to that head's reserve rather than written into it, so
opening one opens the reserve with it and the rail underneath still holds its place.

That is why the five around the heading and the entry's name are set twice: at the figures
above, and again at the close setting the section held before them, under
`@media (max-height: 52rem)`. On a screen tall enough to have the air the chapter takes it;
on a short one the frame wins. Without the second setting the chapter stopped standing in one
frame below 790px of glass, where it had managed down to 715px before.

**The rail never moves.** The entry's head stands at a fixed height whatever the entry: the
name, up to three lines of facts and two of the sentence — the tallest the seven produce in a
column the width of the rail — reserved on the block rather than on each line inside it so a
short entry leaves its slack at the foot of the block. The name is capped in rem rather than left
on the type ramp, so the reserve can be written against a figure that does not move. Without it
the seven names walk up and down as the reader moves between entries, which is the one thing a
chooser must not do.

**Three actions, always three, in the same order,** under the artefact where the thing they
act on is. The file, the source, the written case study. `See more` is the one control every
entry has, so it leads and it is the one madder button on the page outside the contact close.
A project missing one of the other two says so in place — `Code not public` — rather than
dropping the control: a row of two buttons here and three there reads as a layout accident
rather than as information.

### The journey

**A loom in two lanes, and a leaf beside it.** The years are the warp, run behind both lanes so a
year and every bar under it are measured against one track. The lanes are the CV's own two
headings — Education and Experience — and each row names the role and the organisation outright:
*Customer Advisor, B&Q*. Those job titles were never in the data before; the timeline asked the
reader to work them out from a sentence. They are taken from the CV published with the site, and
where the CV does not say — it names the two schools for GCSEs and A-Levels together, without
saying which was which — the organisation is left off rather than guessed.

Experience is terracotta and Education is brass, so a bar keeps its thread's colour until it is
chosen. Choosing lights three things at once: the row (the same madder wash as the rail in 02),
its bar (madder, drawn thicker), and the band of warp it spans, one element moved by transform so
it travels from the last choice to the next instead of blinking.

**Chosen by a click, never by hover.** A chart that rewrote the leaf as the pointer crossed it
made the reader steer around it to read anything. Hover tints a row and does nothing else.
↑ and ↓ walk the rows as they stand on screen; *Earlier* and *Later* walk them in time, and stop
at both ends rather than coming round. `At the same time` lists every entry whose dates overlap,
worked out from the data, each one a way of moving to it.

**The leaf is sized by the loom.** It is the one thing in the chapter whose height depends on the
entry — B&Q has the longest account and five things beside it, GCSEs one line and none — and left
to its own height it made the chapter 130px taller the moment B&Q was chosen, so the page jumped
under the reader. `contain: size` takes it out of the row's sizing; it is given the full height of
the body instead and lays its entry out inside that. `choosing an entry never moves the page` and
`every entry fits its leaf` in `scripts/check.mjs` hold both.

### The stack

**A type specimen.** Every name in a register is set in one wall of type, largest first, at one of
five steps — size and weight moving together — chosen by how many of the seven projects list it in
their stack, counted from the project data at render time. JavaScript, in four, is the largest
thing in the chapter; Java and PHP, on the CV and in none of the seven, are small and light. That is
the chapter's own sentence made visible. Size is never the only place the number lives: a figure
stands beside every counted name, and the reading under the wall gives it as seven knots and says
it in words, with the projects as links into their files.

The base the steps are struck from is `clamp(0.95rem, min(4.44vh, 2.8vw), 3rem)`, swept against
all five registers at every size the chapter is tuned for. All three terms bind somewhere: the
height on a laptop, the width on a narrow window, and the 3rem ceiling on a 2560px panel, where
the widest-set register — twelve frameworks — outgrew its frame by 121px without it. Re-sweep if a
register gains a name or the frame cap moves.

A register is sized only when at least two of its names are counted, because size is a comparison.
Tools has one — Postman — and sizing it would set Postman large and Git, GitHub and Figma small,
the reverse of the truth: those are simply not the kind of thing a project lists as its stack.
Tools and Working with people are set even. For the same reason a name with no count reads *not in
the listed stack of any of the seven*, never *not used*: the data knows what a project lists, not
what was ever touched.

A click chooses, a hover only draws the rule under a name, and each register remembers what was
chosen in it.

### The letter

**The contact form answers as it is filled in.** Each label sits on the line where the writing
goes and rises out of the way the moment the field is entered or holds anything — a real `<label>`
the whole time, never a placeholder standing in for one. A field says what is wrong with it once
it has been left, and stops the moment it is fixed; never while the first letters are typed. A
finished field carries a drawn tick. Along the top, a knot is struck for each field that is ready,
and the send cartouche stays in outline until all four are, then fills — it is never disabled
before that, because pressing it early is how a reader finds out what is missing. ⌘/Ctrl + Enter
sends from the message. Sent, the letter gives way to a shamsa struck like a seal and the address
the reply will go to.

The failure message used to send the reader to "the address in the colophon"; there is no address
in the colophon, or anywhere on the site. It sends them to LinkedIn, which is on the page.

The colophon is one line across the foot of the frame, the name in Persian first.

### The file

**It is read in four movements**, each answering one question and each carrying its own band.
*Who and what* — a title block where the name is set at the size a chapter heading is, and
under it one line carrying both standing facts: what it was made for, a knot, and what it
runs on. The number and the year are out in the margin, turned on their side. *Why it
exists* — the standfirst at
reading size, and under it the three ways out to the thing itself. *What it does and what it
is made of* — side by side across a rule, because the two are read against each other: a
numbered list of claims on the left, a ruled schedule of parts on the right. *And then the
evidence.*

**The two standing facts are one line, set one way.** What a piece of work was made for and
what it runs on are the same kind of fact and are stated at the same size, in the same face,
divided by a knot rather than by a demotion: the second is not a caption under the first.
Only the colour orders them — madder, then ink. The knot is carried by the second fact, not
set between the two, so where the line is too narrow to hold both they wrap with the mark
still attached. Read across it divides them; read down it is the same mark the parts list is
ruled with. A knot stranded at the end of a line is neither.

**Every piece of air down the file is a named knob**, set on `.dossier` and listed in the
stylesheet where it is set: `--space-above-title`, `--space-below-head`,
`--space-above-standfirst`, `--space-above-links`, `--space-above-panels`,
`--space-under-panelrule`, `--space-above-sheet`, `--space-under-sheethead`,
`--space-above-foot` and `--space-below-file` down the page, and
`--space-between-panels`, `--space-between-plates` and `--space-across-plates` across it.
These are the other kind of knob from a chapter's. A chapter has to stand in one frame, so
air given to one of its knobs is taken off the artefact; a file scrolls, so there is no fold
to push anything past and a knob here simply opens its band — the bands above it do not move.
Each default is a whole number of knots and so moves with the screen; a fixed length stops it.
`turning a spacing knob opens that band and only that band` holds them.

**The loupe's knobs are a chapter's kind**, because it stands in one frame: `--space-above-bar`,
`--space-around-capture`, `--space-under-footrule`, `--space-inside-foot` and
`--space-below-warp`, with the capture measured from what is left. Opening the air around the
capture from 30px to 96px takes 132px off the picture and moves neither the bar nor the warp,
which is what `air given to the loupe comes off the capture` checks.

**The file states its claims; it does not narrate them.** What a reader wants from an opened
file is what the thing does, what it is built out of and what it looks like — so the claims
are a numbered list and not paragraphs, and the parts are a ruled schedule and not a row of
pills. A pill is a shape with a radius and this site has none.

**The claims are read at reading size.** They are the argument of the file, not a gloss on
the pictures, so they are set at the body step in full ink and the schedule of parts beside
them stays the smaller of the two. The rule between the two panels is stretched, not started:
a divider that stops wherever the shorter panel runs out reads as a mistake.

**Every capture, on one sheet, at the shape it was taken in.** The sheet is the longest
movement and the last, which is the argument of the whole thing: a project is a claim and the
sheet is the proof. Four columns; a capture wider than it is tall takes two of them and a
narrow panel takes one, which is what lets a project whose captures are not all one shape
still rule up into even rows — PulseOS mixes 16:10 screens with 3:4 panels and they come out
351px and 367px tall beside each other. Nothing is cropped to fit it and nothing is set in a
letterbox to fit it.

It is a sheet and not a strip you drag sideways. The strip it replaced carried the same
pictures and showed two of them; a reader who never finds the handle never learns that the
rest of the work is there.

**Every plate on the sheet opens into the loupe.** One capture, held up to the light: a
second modal over the first, with no ground of its own — only a deeper scrim, so the file is
still there underneath, taken down one further stop rather than replaced. The capture is
given whatever the bar and the foot have left, at its own shape, scaled down to fit and never
cropped. What is said about it is ruled off at the foot: which plate of how many, what it
shows, and *the warp* — one hairline per plate in the set with the one in the loupe taken up
in madder, the same marks the selvedge is woven from. The arrows step and the set comes round
rather than stopping; the plate either side is fetched ahead, so stepping is a change of
picture and not a wait for one. A thread per plate is a thumb's width per plate, and fourteen
of those run off the edge of a phone: there the warp comes off, the count in the bar says
where the reader is, and the sheet underneath still opens any plate directly.

The loupe is a sibling of the file and not a child of it, which buys three things from the
platform rather than from code: the top layer stacks in arrival order, so it is painted over
the file without a z-index; a close request is dealt with by the topmost modal, so Escape
lifts the loupe and leaves the file open; and a wheel over it chains to the body rather than
to the file's own scroller, so the reader is given the sheet back at the plate they left.

**The file does not repeat the register.** There is no device plate at the head of it. The
artefact is what you clicked to get here, and drawing it again at half the size is a smaller
copy of the page you just left.

## Components

**Controls are double-ruled cartouches.** A squared panel, a 1px outer rule, a second rule
inset by 3px, and ink that wipes up from the bottom edge on hover — the direction a carpet
grows on the loom. This is the single button grammar; there is no pill, no filled rectangle
with a radius, no ghost variant.

**The selvedge** is the signature interaction and the site's only progress indicator. Each
chapter owns a station. Two rosettes sit at each: a *ghost* struck on the cartoon from the
start, and an *ink* figure drawn over it stroke by stroke as the reader arrives. Reached
chapters hold in `ink-3`; the chapter you are in takes madder. By the contact chapter the
edge is finished.

**State is a mark, never a hue.** Evidence badges carry a drawn glyph and a word. The stack
meter draws discrete knots *and* prints the figure beside them. A still-running timeline bar
frays out rather than relying on colour.

**Modality is the platform's job.** The project file and the compact menu are native
`<dialog>` elements — Escape, the top layer and focus return come free. Never hand-roll a
focus trap.

**Anything drawn over the page must be in the top layer with it.** A modal dialog paints above
every z-index there is, so the drawn cursor — which is a plain element in the page — was
painted underneath an open file while the native pointer stayed hidden, leaving the file with
no cursor at all. The cursor is a manual popover, which is how a plain element is put in the
top layer, and it is put there again whenever a dialog opens: the top layer stacks in the
order things entered it, so being last in is the whole trick. Over a file it is struck in
`--accent-lacquer`, because a file is opened on lacquer in both editions and the day edition's
madder on near-black is a mark you have to look for.

**The root's own state never shares an attribute with an opt-in.** Elements ask for a cursor
shape with `data-cursor`, and the cursor finds them with `closest('[data-cursor]')` — which
walks all the way up to the root. While the root carried `data-cursor` too it answered that
question for every element on the page, so the reticle was filled everywhere and was never
not over something. The root's state is `data-pointer`.

**Icons are authored**, one grid and one stroke weight, in `src/components/Icon.jsx`. No
brand logos, no emoji, no icon font.

## Do's and Don'ts

**Do**

- Derive every figure from the data. `usedIn()` counts projects at render time; timeline
  bars are struck from real dates. A number that was typed can drift; one that was computed
  cannot.
- Let a region change its ground by taking a scope class, not by recolouring its children.
- Give motion one authored grammar — `rise`, `wipe`, `rule-draw` — staggered by `--i`.
  Damped and physical; the needle settles, it never snaps.
- Reach past transform and opacity. `mask-image`, `clip-path` and `filter` are part of the
  palette here.
- Run `npm run contrast`, `npm run check` and `npm run lint` before shipping. They fail, not
  warn.

**Don't**

- Don't add a border radius anywhere.
- Don't put a kicker, eyebrow or category label above a heading — anywhere, including the
  dossier. Put it underneath.
- Don't set small type on terracotta, brass or sand.
- Don't use madder as trim. It takes a whole region or it stays a mark.
- Don't use the pattern as wallpaper at a constant density. It is heaviest at the selvedge
  and quietest under the reading column, and it drifts, sweeps against the scroll and breathes.
- Don't rely on the blanket `prefers-reduced-motion` rule to stop an animation that matters.
  It sets a 0.001ms duration and one iteration, which parks the animation at its end state —
  for anything scroll-driven, or anything whose end state is not its start state, say
  `animation: none` and the resting values yourself.
- Don't name a class that an existing component already owns. `.field` belongs to the contact
  form; the background layer is `.weave`. A collision here made every form field a fixed
  full-viewport overlay.
- Don't animate layout properties. The contact link's lean is a `translate`, not padding.
- Don't let a panel whose height depends on what is chosen set the height of a framed chapter.
  The journey's leaf did, and the page jumped every time B&Q was picked. Size it by the thing
  beside it that does not change (`contain: size`), and check every entry fits.
- Don't choose on hover. The rail, the loom and the specimen all choose on a click; hover may
  hint, never rewrite what the reader is reading.
- Don't size by a count with only one counted thing in the set. Size is a comparison, and one
  large name among small ones claims it is the main one.
- Don't let a composition out to a width or a height it has nothing to put there. A layout tuned
  at one size does not fill a bigger frame, it spaces out inside it, and the air lands between
  things that belong together. Both caps here — `--measure` and `--frame` — exist for that, and
  both were taken off once and put back.
- Don't move a control under the pointer. The cursor carried a magnetic pull that leant
  whatever it was over toward it by up to 32% of the distance; on a row of buttons whose gap
  is `0.6rem` that is enough to make neighbours overlap, and it was removed. Hover feedback
  is the cartouche ink wipe, which changes no geometry.
- Don't reuse the shared `sign-in` wipe on the hero signature. `clip-path` clips to the
  border box, and the signature's ink stands well outside its deliberately short box;
  `sign-hero` bleeds past it on every side but the one the hand writes from.
- Don't give `.hero__fa` a line-height that lets its box exceed the Latin's. The Latin alone
  sets the line rhythm; a taller Persian box pushes the second line down.
- Don't reach for an icon set. The glyphs are authored in `Icon.jsx` on one grid, one stroke
  weight and one cap style, and the ledger's four — mortarboard, pediment, pointed arch,
  marker — are drawn to that same grammar. A row names its own mark in the data so the two
  cannot drift apart.
- Don't letter-space Persian to make it wider. It breaks the joins. `--fa-stretch` is the
  sanctioned lever and it is anchored at the outer margin, never centred.
- Don't position something turned on its side with logical insets. An absolutely positioned
  element resolves them against its *own* writing mode, so under `vertical-rl`
  `inset-inline-start` means the top and `inset-block-start` means the right: the pair that
  reads as "out in the left margin" put every chapter's folio number above the right-hand end
  of its heading, where the chapter join clipped it. Use `top` and `left`.
- Don't expect a picture to be shrunk into a grid or flex track. A replaced element takes its
  intrinsic height as an automatic minimum and so overflows the room it was given, however
  the track is written: `max-height: 100%` on a 1080 × 1486 panel in a `minmax(0, 1fr)` row
  came out 1628px tall in a 900px window. Position it against the box instead — `inset: 0`
  with auto margins is out of flow, so the track is the room left over and nothing else, and
  it centres in both axes while it is there.
- Don't invent a fact. Everything the site states traces to `src/data/*.js`.
