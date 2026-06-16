import { MotionConfig, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import dartLogo from './assets/logos/dart.png';
import firebaseLogo from './assets/logos/firebase.png';
import flutterLogo from './assets/logos/flutter.png';
import googleCloudLogo from './assets/logos/google-cloud.png';
import html5Logo from './assets/logos/html5.png';
import javascriptLogo from './assets/logos/javascript.png';
import nodejsLogo from './assets/logos/nodejs.png';
import premPredictorThumb from './assets/projects/prem-predictor/prem-predictor-thumb.png';
import traverseThumb from './assets/projects/traverse/traverse-thumb.png';
import tailwindLogo from './assets/logos/tailwind.png';
import IPhoneMockup from './components/IPhoneMockup.jsx';
import { cardItem, sectionContainer, sectionItem, viewportOnce } from './lib/motion.js';

const LaptopMockup = lazy(() => import('./components/LaptopMockup.jsx'));

const sectionIds = ['home', 'about', 'projects', 'projects-desktop', 'tech-stack', 'journey', 'contact'];
const softLockDelayMs = 250;
const softLockReleaseMs = 900;
const snapDistanceThreshold = 28;

const aboutProofPoints = [
  {
    label: 'Degree',
    title: 'Computer Science BSc Honours',
    body: <>University of Westminster<br /><b>First Class Honours.</b></>,
  },
  {
    label: 'Happy To Collaborate',
    title: 'Open to opportunities',
    body: 'Open to internships, grad schemes, junior roles, freelance builds, and collaborative projects.',
  },
];

const mobileProjectSpotlight = {
  name: 'Traverse',
  intro: 'Mobile travel companion for routes, places, and trip details.',
  label: 'Travel App',
  image: traverseThumb,
  overview:
    'Traverse is my final year project: a cross-platform travel planner that brings flight search, hotel search, itinerary planning, budgeting, and an AI travel assistant into one app.',
  highlights: [
    'Searches flights and hotels through backend-proxied travel APIs.',
    'Saves trips, itinerary items, budgets, expenses, and user preferences in Firestore.',
    'Includes FlyAI, a travel-focused assistant powered through a secured backend route.',
  ],
  stack: [
    { label: 'Flutter', icon: 'F', logo: flutterLogo, tone: 'cyan' },
    { label: 'Dart', icon: 'D', logo: dartLogo, tone: 'blue' },
    { label: 'Firebase', icon: 'F', logo: firebaseLogo, tone: 'amber' },
    { label: 'Node.js', icon: 'JS', logo: nodejsLogo, tone: 'green' },
    { label: 'Express', icon: 'E', tone: 'navy' },
    { label: 'Google Places API', icon: 'G', logo: googleCloudLogo, tone: 'gold' },
    { label: 'Amadeus API', icon: 'A', tone: 'gold' },
  ],
};

const desktopProjectSpotlight = {
  name: 'Prem Predictor',
  intro: 'Browser-based Premier League prediction leagues with scoring and reports.',
  label: 'Web App',
  image: premPredictorThumb,
  overview:
    'Prem Predictor is a client-side web app for creating prediction leagues, submitting full Premier League tables, scoring entries against the real table, and generating PDF reports.',
  highlights: [
    'League creation, player prediction entry, editing, deletion, and local persistence.',
    'Validation for all 20 teams, duplicate prevention, and automatic leaderboard scoring.',
    'PDF report generation with predicted versus actual table comparisons.',
  ],
  stack: [
    { label: 'HTML5', icon: 'H', logo: html5Logo, tone: 'cyan' },
    { label: 'JavaScript', icon: 'JS', logo: javascriptLogo, tone: 'blue' },
    { label: 'Tailwind', icon: 'T', logo: tailwindLogo, tone: 'cyan' },
    { label: 'jsPDF', icon: 'PDF', tone: 'green' },
    { label: 'localStorage', icon: 'DB', tone: 'navy' },
  ],
};

const journeyNotes = [
  'Customer-facing work at B&Q shaped how I think about communication, patience, and software that is genuinely usable.',
  'University projects gave me the foundation, while SkyHealth, finance, weather, and Traverse pushed that foundation into product work.',
  'Final year is about sharpening the portfolio and becoming stronger across full-stack and mobile development.',
];

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(ids[0]);
  const activeSectionRef = useRef(ids[0]);
  const rafRef = useRef(0);
  const lockTimerRef = useRef(0);
  const releaseTimerRef = useRef(0);
  const isSoftLockingRef = useRef(false);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopViewport = window.matchMedia('(min-width: 1024px)');

    const getNearestSection = () =>
      elements
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element,
            id: element.id,
            distance: Math.abs(rect.top),
            top: rect.top,
          };
        })
        .sort((a, b) => a.distance - b.distance)[0];

    const setActiveIfNeeded = (id) => {
      if (!id || activeSectionRef.current === id) return;
      activeSectionRef.current = id;
      setActiveSection(id);
    };

    const syncActiveSection = () => {
      const nearest = getNearestSection();
      setActiveIfNeeded(nearest?.id);
    };

    const releaseSoftLock = () => {
      isSoftLockingRef.current = false;
      syncActiveSection();
    };

    const settleToNearestSection = () => {
      if (!desktopViewport.matches) return;

      const nearest = getNearestSection();
      if (!nearest || nearest.distance < snapDistanceThreshold) {
        syncActiveSection();
        return;
      }

      setActiveIfNeeded(nearest.id);
      isSoftLockingRef.current = true;
      window.scrollTo({
        top: window.scrollY + nearest.top,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });

      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(releaseSoftLock, softLockReleaseMs);
    };

    const scheduleSoftLock = () => {
      window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(settleToNearestSection, softLockDelayMs);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(syncActiveSection);

      if (!isSoftLockingRef.current) {
        scheduleSoftLock();
      }
    };

    syncActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(lockTimerRef.current);
      window.clearTimeout(releaseTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ids]);

  return activeSection;
}

function DeviceSkeleton({ label = 'Loading device preview' }) {
  return (
    <div className="device-skeleton" role="status" aria-label={label}>
      <span />
      <span />
      <span />
    </div>
  );
}

function LazyLaptop(props) {
  return (
    <Suspense fallback={<DeviceSkeleton />}>
      <LaptopMockup {...props} />
    </Suspense>
  );
}

function ProjectInfoPanel({ project }) {
  return (
    <div className="project-info-panel">
      <section className="project-overview-panel">
        <div className="project-overview-card">
          <span className="project-type-badge">{project.label}</span>
          <h3>Overview</h3>
          <p>{project.overview}</p>
          <h4>Key Features</h4>
          <ul className="project-highlight-list">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="project-tech-stack" aria-label={`${project.name} tech stack`}>
        <p>Tech Stack</p>
        <div>
          {project.stack.map((item) => (
            <span className={`project-tech-chip project-tech-${item.tone}`} key={item.label}>
              <i aria-hidden="true">
                {item.logo ? <img src={item.logo} alt="" /> : item.icon}
              </i>
              {item.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function Home() {
  return (
    <section
      id="home"
      className="home-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="mobile-static-phone">
        <IPhoneMockup activeSection="home" staticMode />
      </div>
      <motion.div
        className="home-layout mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(19rem,0.82fr)_minmax(0,1.18fr)]"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <div className="hidden lg:block" aria-hidden="true" />
        <motion.div className="home-copy max-w-4xl text-center lg:text-left" variants={sectionItem}>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-glow">
            Software Developer
          </p>
          <h1 className="whitespace-nowrap text-[clamp(2.1rem,9.8vw,6.4rem)] font-semibold leading-none text-frost">
            Eeliya Nayeri
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl lg:mx-0">
            Computer Science graduate building clean full-stack apps, AI-powered ideas, and practical tools
            inspired by travel and aviation.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#projects"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-frost px-7 text-sm font-bold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-glow focus:ring-offset-2 focus:ring-offset-ink"
            >
              View Projects
            </a>
            <a
              href="#about"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-semibold text-frost transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
            >
              About Eeliya
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="section-panel about-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:pb-20 lg:pt-8"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(86,217,255,0.05),transparent_28%,rgba(255,255,255,0.03))]" />
      <motion.div
        className="mx-auto w-full max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <div className="about-copy max-w-3xl lg:max-w-[34rem] xl:max-w-[42rem]">
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90"
            variants={sectionItem}
          >
            My Personal Story
          </motion.p>
          <motion.h2
            className="max-w-4xl text-4xl font-semibold leading-tight text-frost sm:text-6xl lg:text-7xl"
            variants={sectionItem}
          >
            About Me
          </motion.h2>
          <motion.p
            className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
            variants={sectionItem}
          >
            I am Eeliya Nayeri, a Computer Science BSc Honours graduate and software developer building hands-on experience
            through full-stack apps, polished prototypes, and real problem-solving. I am especially interested in
            AI, travel, and aviation because they sit at the edge of systems, people, and useful products.
          </motion.p>
          <div className="about-proof-grid mt-8 grid gap-4 md:grid-cols-2">
            {aboutProofPoints.map((point) => (
              <motion.article key={point.title} className="about-proof-card" variants={cardItem}>
                <p>{point.label}</p>
                <h3>{point.title}</h3>
                <span>{point.body}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Projects() {
  return (
    <>
      <section
        id="projects"
        className="project-showcase-section project-mobile-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(155,124,255,0.05),transparent_30%,rgba(255,255,255,0.03))]" />
        <div className="mobile-static-phone project-static-phone">
          <IPhoneMockup activeSection="projects" staticMode />
        </div>
        <motion.div
          className="project-mobile-layout mx-auto grid w-full max-w-7xl items-center gap-10"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={sectionContainer}
        >
          <motion.div className="project-title-block" variants={sectionItem}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90">Mobile Project</p>
            <h2>{mobileProjectSpotlight.name}</h2>
            <p>{mobileProjectSpotlight.intro}</p>
            <div className="project-action-row project-action-row-left">
              <a href="#projects">GitHub</a>
              <a href="#projects">Live Demo</a>
              <a href="#projects">Docs</a>
            </div>
          </motion.div>

          <div className="project-phone-slot" aria-hidden="true" />

          <motion.div className="project-detail-block" variants={cardItem}>
            <ProjectInfoPanel project={mobileProjectSpotlight} />
          </motion.div>
        </motion.div>
      </section>

      <section
        id="projects-desktop"
        className="project-showcase-section project-desktop-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(86,217,255,0.045),transparent_30%,rgba(255,255,255,0.03))]" />
        <motion.div
          className="project-desktop-layout mx-auto grid w-full max-w-7xl items-center gap-10"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={sectionContainer}
        >
          <motion.div className="project-title-block project-desktop-title" variants={sectionItem}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90">Desktop Project</p>
            <h2>{desktopProjectSpotlight.name}</h2>
            <p>{desktopProjectSpotlight.intro}</p>
          </motion.div>

          <motion.div className="project-action-row project-desktop-actions" variants={cardItem}>
            <a href="#projects-desktop">GitHub</a>
            <a href="#projects-desktop">Live Demo</a>
            <a href="#projects-desktop">Docs</a>
          </motion.div>

          <motion.div className="project-laptop-slot" variants={cardItem}>
            <LazyLaptop variant="projects" />
          </motion.div>

          <motion.div className="project-detail-block project-desktop-detail" variants={cardItem}>
            <ProjectInfoPanel project={desktopProjectSpotlight} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

function TechStack() {
  return (
    <section
      id="tech-stack"
      className="section-panel tech-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(74,222,128,0.05),transparent_30%,rgba(255,255,255,0.03))]" />
      <motion.div
        className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <motion.div className="tech-copy" variants={sectionItem}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90">Tech Stack</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-frost sm:text-5xl lg:text-6xl">
            A toolkit that connects mobile ideas, web dashboards, and API-driven products.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Eeliya uses frontend tools like React, Vite, and Tailwind to shape fast interfaces, Flutter and Swift
            for mobile experiences, and backend/API tools like Django, Firebase, REST APIs, Amadeus, and Google
            Places to connect products to real data. The stack is practical: pick the right tool, build the
            workflow, then refine the user experience.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="tech-summary-card">
              <span>01</span>
              <p>Mobile apps for travel, weather, and iOS-style product flows.</p>
            </div>
            <div className="tech-summary-card">
              <span>02</span>
              <p>Web dashboards for finance, portfolio work, and structured data views.</p>
            </div>
            <div className="tech-summary-card">
              <span>03</span>
              <p>APIs and tooling that turn prototypes into connected software.</p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={cardItem}>
          <LazyLaptop variant="tech" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Journey() {
  return (
    <section
      id="journey"
      className="section-panel journey-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(251,191,36,0.05),transparent_32%,rgba(255,255,255,0.03))]" />
      <motion.div
        className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <motion.div
          className="journey-copy"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={sectionContainer}
        >
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90"
            variants={sectionItem}
          >
            Journey
          </motion.p>
          <motion.h2
            className="max-w-3xl text-4xl font-semibold leading-tight text-frost sm:text-5xl lg:text-6xl"
            variants={sectionItem}
          >
            The path has been practical: study, work, build, improve.
          </motion.h2>
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-muted"
            variants={sectionItem}
          >
            Eeliya&apos;s journey is not just a list of projects. It is a mix of Computer Science fundamentals,
            customer-facing work, and repeated practice turning ideas into apps. Each step adds a little more
            confidence, technical range, and product sense.
          </motion.p>
          <div className="mt-7 grid gap-3">
            {journeyNotes.map((note, index) => (
              <motion.div
                className="journey-note"
                key={note}
                variants={cardItem}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div variants={cardItem}>
          <LazyLaptop variant="journey" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Contact() {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormStatus('sent');
    event.currentTarget.reset();
  };

  return (
    <section
      id="contact"
      className="section-panel contact-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(251,113,133,0.05),transparent_34%,rgba(86,217,255,0.04))]" />
      <motion.div
        className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,0.92fr)_minmax(17rem,0.56fr)]"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <div className="contact-copy">
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90"
            variants={sectionItem}
          >
            Contact
          </motion.p>
          <motion.h2
            className="max-w-3xl text-4xl font-semibold leading-tight text-frost sm:text-5xl lg:text-6xl"
            variants={sectionItem}
          >
            Let&apos;s turn the next idea into something real.
          </motion.h2>
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-muted"
            variants={sectionItem}
          >
            This is the closing point of the portfolio: a direct way to reach Eeliya for internships,
            collaborations, project feedback, or software ideas around full-stack apps, mobile, AI, travel, and
            aviation.
          </motion.p>
          <motion.div
            className="contact-direct-links"
            variants={sectionItem}
          >
            <a href="mailto:eeliya@example.com">eeliya@example.com</a>
            <a href="#home">Back to top</a>
          </motion.div>
        </div>
        <motion.form
          className="contact-form-card"
          onSubmit={handleSubmit}
          variants={cardItem}
        >
          <div className="contact-form-heading">
            <p>Send a Message</p>
            <span>EmailJS-ready placeholder handler</span>
          </div>
          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Subject</span>
            <input name="subject" type="text" placeholder="Project, internship, collaboration..." required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows="5" placeholder="Write your message..." required />
          </label>
          <button type="submit">Submit Message</button>
          <p className="form-status" aria-live="polite">
            {formStatus === 'sent'
              ? 'Message captured locally. Connect EmailJS when ready.'
              : 'Placeholder submit: no email is sent yet.'}
          </p>
        </motion.form>
        <div className="hidden lg:block" aria-hidden="true" />
      </motion.div>
    </section>
  );
}

export default function App() {
  const activeSection = useActiveSection(sectionIds);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-hidden bg-ink bg-radial-soft text-frost">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(115deg,rgba(6,9,18,0.68),rgba(11,16,32,0.9))]" />
        <IPhoneMockup activeSection={activeSection} className="desktop-phone" />
        <main className="overflow-x-hidden">
          <Home />
          <About />
          <Projects />
          <TechStack />
          <Journey />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
