# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: recruiters and hiring managers** screening UK graduate, junior, and internship candidates. They arrive from a CV link, a LinkedIn profile, or a name search, usually mid-screening with several tabs open and little patience. Their job is to decide within a minute or two whether Eeliya is worth a conversation, then find a way to start one.

**Primary: engineering interviewers** — developers who will actually judge the work. They arrive later in the process, or from the same link, and want depth: what each project really does, how it is built, whether the code and the write-up hold up. They open GitHub repos, live demos, and the per-project PDF case studies.

Both audiences are **desktop-first with a large mobile minority**: most reviewing happens on a laptop during screening, but a significant share of arrivals are a LinkedIn or CV link tapped on a phone. Both layouts are first-class; neither is a courtesy path.

Secondary, unconfirmed as a design driver: peers, collaborators, and freelance enquiries. They are welcome but do not set priorities.

## Product Purpose

A personal portfolio site at `eeliyanayeri.com` for Eeliya Nayeri, a UK-based software developer and First Class Computer Science BSc (Hons) graduate of the University of Westminster.

It exists to convert a cold screening visit into a real conversation. Success is a recruiter or interviewer leaving with (a) a confident read on the calibre of the work and (b) an initiated contact — a message sent through the contact panel, a CV opened, or a project explored deeply enough to be quoted back in an interview.

The site is itself a work sample: its craft is part of the argument being made.

## Positioning

Eeliya builds finished, working products rather than tutorial exercises — full-stack, mobile, and web applications, most with a live deployment, a public repository, and a written case-study document behind them. The through-line is AI, travel technology, and aviation: domains chosen because they sit where systems, people, and useful products meet.

The portfolio's own differentiator is the evidence itself: seven finished projects, most with a live deployment, a public repository and a written case study, each presented as a record you can open rather than a claim you must take on trust. A project's lead screenshot is still set **inside a device** — a phone or a laptop, drawn in ink lines — so the visitor sees the product running; that device now appears only where a project is being shown, never as the shell of the whole site. A neighbouring graduate portfolio cannot truthfully copy this without shipping the same body of finished work.

## Operating Context

- Visitors arrive cold, from a CV PDF link, a LinkedIn profile, or a search for the name (English "Eeliya Nayeri" and Persian "ایلیا نایری").
- Reading is fast and non-linear, across **real pages with real URLs**: `/` (the cover, the lead entry, the register), `/work/` (all seven entries), `/work/<id>/` (one page per project), `/about/` (bio, chronology, stack), `/contact/`. Ordinary scrolling; the scroll-snapped full-viewport sequence has been retired at Eeliya's request.
- A single responsive layout serves every width: the spine grid folds its rail above the content below `54rem`, and display type restacks rather than shrinking. There are no separate mobile components.
- Deep evaluation happens off-site: GitHub repositories, live deployments, and per-project PDF documents opened in new tabs.
- Contact is initiated through the form on `/contact/`; there is no scheduling link, chat, or newsletter.

## Capabilities and Constraints

- **Stack:** React 18 + Vite, hand-authored CSS with custom properties. Tailwind, Framer Motion and `ogl` have all been removed. Vite runs in **multi-page mode**: `scripts/build-pages.mjs` generates one HTML entry per route (with its own title, description, canonical, Open Graph and JSON-LD) before every `dev` and `build`, so metadata is static markup rather than something React assembles after a crawler has read the page. Deployed as a static site; no router and no SPA fallback needed.
- **Contact:** the form posts to Web3Forms with a public access key; there is no backend of Eeliya's own. Statuses are rendered in-page (`Sending…` / success / failure).
- **Project data is content, not code:** `src/data/projects.js`, `profile.js`, `journey.js` and `stack.js` are the single source of truth, and they are plain data with no imports — so the page generator reads them under bare Node. One ordered `projects` array carries all seven entries; each names its own `frame` (`phone` or `laptop`).
- **Media is generated, never hand-placed:** `npm run media` (`scripts/optimise-media.mjs`) reads the stems referenced in the data and writes responsive WebP sets plus a manifest into `src/media`. It converts only what the data references, so an unused photograph can never reach the bundle, and it fails loudly when a referenced screenshot has no source. 46.9 MB of PNG becomes 5.7 MB of WebP.
- **Device frames are simple CSS** (`src/components/Plate.jsx`): a phone and a laptop drawn in ink lines, with no gradients, gloss or shadow. They replaced the previous 1,678-line `IPhoneMockup.jsx` / `LaptopMockup.jsx` pair, which rendered whole sections and was the most fragile part of the old codebase.
- **Discovery is load-bearing:** `index.html` carries Person and WebSite JSON-LD, Persian alternate names, canonical URL, Open Graph, and a Google site-verification token. These are factual entity claims about a real person and must not be broken or fabricated by edits, even though they are not pinned as visually binding.
- **Type:** Petrona (editorial) and Archivo (tabular matter, labels, controls), both variable and **self-hosted** from `public/fonts` — no Google Fonts request at runtime. 162 KB for three faces.
- Not established: analytics, a blog or writing surface, a CMS, internationalised content (the Persian name is metadata only, not a translated site), any form of authentication.

## Brand Commitments

Pinned by Eeliya as fixed — change these only on an explicit request, never as a side effect:

1. **The device, kept to the work.** A project's screen is shown inside a phone or a laptop frame. Scoped by Eeliya to the project surfaces only — it is no longer the shell of the whole site, and the scroll-snap sequence it used to live in has been retired.
2. **The content set and PDF case studies.** The seven projects, their documents, GitHub and live links, and the journey timeline are the factual spine.
3. **The contact form and its Web3Forms path.** The form stays the primary contact mechanism.
4. **The beige palette.** A warm beige ground is pinned. It ships as two editions — the buff edition and the ink edition — with a toggle, and the ochre is a field colour that never becomes type on paper.

Name and voice: first person, plain, understated. Claims are stated once and evidenced, not repeated or inflated. Real name in English and Persian; pronouns he/him.

## Evidence on Hand

Real, verifiable, and already in the repository:

- **Seven shipped projects**, each with screenshots, a stack, and a written PDF document in `src/docs/`: Traverse (final-year project, Flutter/Firebase travel app), Pit Wall (Cognizant × Aston Martin F1 Ideathon, React Native/Expo), Weather App (SwiftUI/MVVM), PulseOS (React/Express personal dashboard), Prem Predictor (Firebase multiplayer prediction leagues), Alumni API (Node/Express two-service REST backend), Sky Health (Django, built to a real Sky UK client brief).
- **Live deployments** for Traverse, Pit Wall, and Prem Predictor; public GitHub repositories for Traverse, Pit Wall, PulseOS, and Alumni API.
- **Credential:** BSc (Hons) Computer Science, First Class, University of Westminster. Confirmed.
- **CV PDF** in `src/docs/`, linked from the hero.
- **Journey timeline** with dated, real events: GCSEs, A-Levels, B&Q (2021–present), Fujitsu WorkX placement (2022), the Westminster degree (2023–2026), the Aston Martin F1 Ideathon (2026), and a two-month UI/UX-focused development internship at Foundermatcha (2026).
- **Photography** of Eeliya and of Westminster in `src/assets/personal/`.

Absent, and never to be invented: testimonials, client quotes, employer endorsements, user or download numbers, awards, salary or availability dates beyond "actively seeking", and any project, employer, or grade not listed above. Prem Predictor currently has no public repository link — leave it empty rather than inventing one. Alumni API, Sky Health, and Weather App have documents but no public repository.

## Product Principles

1. **Evidence over adjectives.** Every claim is backed by something the visitor can open — a live URL, a repository, a document, a screenshot. If it cannot be opened, it is not said.
2. **The work is the hero; the interface carries it.** The device mockups exist to make products feel real. Nothing decorative may outrank the artefact inside the frame.
3. **A minute must be enough.** A recruiter skimming the first two viewports should already know who this is, what calibre the work is, and how to make contact. Depth is available, never required.
4. **Craft is the argument.** Rough edges here read as rough edges in the candidate. Motion, alignment, and responsiveness are part of the pitch, not polish on top of it.
5. **Both hands are real.** Desktop and compact are two designed experiences, not one design and its fallback.

## Accessibility & Inclusion

**WCAG 2.2 AA is the bar** and is treated as non-negotiable in every future pass. The current build holds it this way, and each of these is load-bearing rather than aspirational:

- Every text pairing in both editions was computed, not eyeballed, and clears 4.5:1. The ochre `#C9A227` reaches only 1.77:1 on paper, so it is a **field colour only** — anything set on it takes the darkest ink.
- One focus treatment across the whole site, at 3:1 or better against every ground.
- State is a mark, not a hue: evidence badges carry a drawn glyph and a word, and the register's focus effect changes colour rather than opacity so nothing ever dims below AA.
- `prefers-reduced-motion` neutralises the single authored motion moment and every transition.
- The gallery lightbox is a native `<dialog>`, so modality, Escape and focus return come from the platform.

Names appear in Persian as well as English; that spelling and its diacritics must be preserved exactly wherever they are rendered.
