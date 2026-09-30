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

The portfolio's own differentiator is that each project is presented **inside a device** — an interactive iPhone or laptop mockup running the real screens — so the visitor sees the product working, not a flat screenshot grid. A neighbouring graduate portfolio cannot truthfully copy this without shipping the same body of finished, demonstrable work.

## Operating Context

- Visitors arrive cold, from a CV PDF link, a LinkedIn profile, or a search for the name (English "Eeliya Nayeri" and Persian "ایلیا نایری").
- Reading is fast and non-linear: the whole site is one scroll-snapped sequence of full-viewport sections — `home`, `about`, `projects` (mobile projects), `projects-desktop`, `journey`, `tech-stack`, `contact` — with an in-page nav.
- Mobile visitors get purpose-built compact components (`MobileProjectViewer`, `MobileJourneyTimeline`, `MobileTechStack`) rather than shrunken desktop mockups; the compact breakpoint is `max-width: 1023px`.
- Deep evaluation happens off-site: GitHub repositories, live deployments, and per-project PDF documents opened in new tabs.
- Contact is initiated in-page through a mail-window form; there is no scheduling link, chat, or newsletter.

## Capabilities and Constraints

- **Stack:** React 18 + Vite, Tailwind CSS 3, Framer Motion, `ogl` (WebGL). Single-page app, no router — navigation is anchor + scroll-snap. Built with `npm run dev` / `npm run build`; deployed as a static site.
- **Contact:** the form posts to Web3Forms with a public access key; there is no backend of Eeliya's own. Statuses are rendered in-page (`Sending…` / success / failure).
- **Project data is content, not code:** `src/data/projects.js`, `journey.js`, and `techStack.js` are the single source of truth for projects, the timeline, and the tech grid. Projects are split into `mobileProjects` (Traverse, Pit Wall, Weather App) and `desktopProjects` (PulseOS, Prem Predictor, Alumni API, Sky Health) because each set is shown in a different device.
- **Device mockups are hand-built components** (`IPhoneMockup.jsx`, `LaptopMockup.jsx`) that render the active section's content; they are the heaviest and most fragile part of the codebase.
- **Discovery is load-bearing:** `index.html` carries Person and WebSite JSON-LD, Persian alternate names, canonical URL, Open Graph, and a Google site-verification token. These are factual entity claims about a real person and must not be broken or fabricated by edits, even though they are not pinned as visually binding.
- **Type:** Manrope only, loaded from Google Fonts. `Inter` was named in the CSS stack for a long time without ever being loaded; that is fixed and should not regress.
- Not established: analytics, a blog or writing surface, a CMS, internationalised content (the Persian name is metadata only, not a translated site), any form of authentication.

## Brand Commitments

Pinned by Eeliya as fixed — change these only on an explicit request, never as a side effect:

1. **The device-mockup concept.** Projects presented inside interactive iPhone and laptop mockups, within the section-per-viewport scroll-snap shell, is the site's core idea.
2. **The content set and PDF case studies.** The seven projects, their documents, GitHub and live links, and the journey timeline are the factual spine.
3. **The contact form and its Web3Forms path.** The mail-window form stays the primary contact mechanism.

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

**WCAG 2.2 AA is the bar** and is treated as non-negotiable in every future pass: contrast on the dark palette, visible focus on every interactive element, full keyboard reachability through the scroll-snap sections and the device mockups, and honoured `prefers-reduced-motion` (already respected in the active-section logic) across all Framer Motion and WebGL effects.

Names appear in Persian as well as English; that spelling and its diacritics must be preserved exactly wherever they are rendered.
