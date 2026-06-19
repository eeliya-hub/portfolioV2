import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import profilePhoto from './assets/image.png';
import cvPdf from './assets/nayeri-eeliya-CV-compressed (1).pdf';
import IPhoneMockup from './components/IPhoneMockup.jsx';
import { desktopProjects, mobileProjects } from './data/projects.js';
import { journeyTimeline } from './data/journey.js';
import { cardItem, sectionContainer, sectionItem, smoothEase, viewportOnce } from './lib/motion.js';

const LaptopMockup = lazy(() => import('./components/LaptopMockup.jsx'));

const sectionIds = ['home', 'about', 'projects', 'projects-desktop', 'tech-stack', 'journey', 'contact'];
const softLockDelayMs = 250;
const softLockReleaseMs = 900;
const snapDistanceThreshold = 28;

// Sections where the persistent floating desktop device is visible. Once the
// first one (projects-desktop) is in frame it stays on screen and slides to
// each section's position — exactly like the desktop phone.
const desktopDeviceSections = ['projects-desktop', 'tech-stack', 'journey', 'contact'];

// Measures the layout space each desktop section already reserves for its
// device (the hidden inline slot) and returns its settled viewport rect. The
// floating device is positioned exactly onto that slot, so it can never cover
// text — the slot is part of the normal layout flow at any screen size.
function useDesktopSlots() {
  const [slots, setSlots] = useState({});
  const [isLayoutChanging, setIsLayoutChanging] = useState(false);

  useLayoutEffect(() => {
    let raf = 0;
    let layoutTimer = 0;

    const measure = () => {
      setSlots((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const id of desktopDeviceSections) {
          const section = document.getElementById(id);
          const slot = section?.querySelector('.device-inline');
          if (!section || !slot) continue;
          const s = slot.getBoundingClientRect();
          const sec = section.getBoundingClientRect();
          if (s.width < 1) continue;
          // top is the slot's offset within its section; when the section is
          // snapped to the top of the viewport this equals its viewport top.
          const rect = { left: Math.round(s.left), top: Math.round(s.top - sec.top), width: Math.round(s.width) };
          const old = prev[id];
          if (!old || old.left !== rect.left || old.top !== rect.top || old.width !== rect.width) {
            next[id] = rect;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const scheduleMeasure = (layoutChanging = false) => {
      if (layoutChanging) {
        setIsLayoutChanging(true);
        window.clearTimeout(layoutTimer);
        layoutTimer = window.setTimeout(() => setIsLayoutChanging(false), 180);
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    // Re-measure as lazy devices/fonts settle and on resize.
    const timers = [
      setTimeout(() => scheduleMeasure(true), 300),
      setTimeout(() => scheduleMeasure(true), 900),
      setTimeout(() => scheduleMeasure(true), 1800),
    ];
    const onResize = () => scheduleMeasure(true);
    window.addEventListener('resize', onResize);

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => scheduleMeasure(true))
        : null;

    if (resizeObserver) {
      for (const id of desktopDeviceSections) {
        const section = document.getElementById(id);
        const slot = section?.querySelector('.device-inline');
        if (section) resizeObserver.observe(section);
        if (slot) resizeObserver.observe(slot);
      }
    }

    return () => {
      timers.forEach(clearTimeout);
      window.clearTimeout(layoutTimer);
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { slots, isLayoutChanging };
}

function useDesktopProjectBoundaryLock(enabled) {
  const stageRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (stageRef.current) {
        stageRef.current.style.marginTop = '';
      }
      return undefined;
    }

    const stageElement = stageRef.current;

    const sync = () => {
      const projectSection = document.getElementById('projects-desktop');
      const stage = stageRef.current;

      if (!projectSection || !stage) return;

      const projectTop = projectSection.getBoundingClientRect().top;
      const nextOffset = Math.max(0, projectTop);

      stage.style.marginTop = `${nextOffset}px`;
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      if (stageElement) {
        stageElement.style.marginTop = '';
      }
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [enabled]);

  return stageRef;
}

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

const initialDesktopProjectIndex = Math.max(
  desktopProjects.findIndex((project) => project.id === 'sky-health'),
  0,
);

function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState(ids[0]);
  const activeSectionRef = useRef(ids[0]);
  const activeSectionTopRef = useRef(0);
  const rafRef = useRef(0);
  const lockTimerRef = useRef(0);
  const releaseTimerRef = useRef(0);
  const resizeTimerRef = useRef(0);
  const isResizingRef = useRef(false);
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
      if (nearest) {
        activeSectionTopRef.current = nearest.top;
      }
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

      if (!isSoftLockingRef.current && !isResizingRef.current) {
        scheduleSoftLock();
      }
    };

    const handleResize = () => {
      const activeElement = document.getElementById(activeSectionRef.current);

      isResizingRef.current = true;
      isSoftLockingRef.current = false;
      window.clearTimeout(lockTimerRef.current);
      window.clearTimeout(releaseTimerRef.current);
      window.clearTimeout(resizeTimerRef.current);
      window.cancelAnimationFrame(rafRef.current);

      if (desktopViewport.matches && activeElement) {
        const nextScrollTop = window.scrollY + activeElement.getBoundingClientRect().top - activeSectionTopRef.current;
        window.scrollTo({ top: nextScrollTop, behavior: 'auto' });
      }

      rafRef.current = window.requestAnimationFrame(syncActiveSection);
      resizeTimerRef.current = window.setTimeout(() => {
        isResizingRef.current = false;
        syncActiveSection();
      }, 220);
    };

    syncActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(lockTimerRef.current);
      window.clearTimeout(releaseTimerRef.current);
      window.clearTimeout(resizeTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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

function ProjectButtonIcon({ type }) {
  if (type === 'gallery') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 13l2.4-2.4 3.1 3.1 1.8-1.8L20 16.6" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </svg>
    );
  }

  if (type === 'docs') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5" />
        <path d="M9.5 12h5M9.5 15h5M9.5 18h3" />
      </svg>
    );
  }

  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19c-4 1.2-4-2-5.5-2.5" />
        <path d="M15 22v-3.5c0-1 .1-1.4-.5-2 2-.2 4.2-1 4.2-4.5a3.5 3.5 0 0 0-1-2.5 3.2 3.2 0 0 0-.1-2.5s-.8-.3-2.6 1a9 9 0 0 0-4.8 0c-1.8-1.3-2.6-1-2.6-1a3.2 3.2 0 0 0-.1 2.5 3.5 3.5 0 0 0-1 2.5c0 3.5 2.1 4.3 4.1 4.5-.5.5-.7.9-.7 1.8V22" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'previous' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

function getActionIconType(label) {
  const normalized = label.toLowerCase();
  if (normalized.includes('git')) return 'github';
  if (normalized.includes('doc')) return 'docs';
  if (normalized.includes('gallery')) return 'gallery';
  return 'external';
}

function shouldOpenInNewTab(href) {
  return Boolean(href && !href.startsWith('#'));
}

function ProjectActions({ project, onGallery, className = '' }) {
  return (
    <div className={`project-action-row ${className}`}>
      {project.actions.map((action) => {
        const opensInNewTab = shouldOpenInNewTab(action.href);

        return action.href ? (
          <a
            href={action.href}
            key={action.label}
            target={opensInNewTab ? '_blank' : undefined}
            rel={opensInNewTab ? 'noreferrer' : undefined}
            download={action.download}
          >
            <ProjectButtonIcon type={getActionIconType(action.label)} />
            {action.label}
          </a>
        ) : (
          <button className="is-disabled" disabled key={action.label} type="button">
            <ProjectButtonIcon type={getActionIconType(action.label)} />
            {action.label}
          </button>
        );
      })}
      <button type="button" onClick={() => onGallery(project)}>
        <ProjectButtonIcon type="gallery" />
        Gallery
      </button>
    </div>
  );
}

function ProjectSelector({ projects, activeIndex, onChange, className = '' }) {
  const showPrevious = () => onChange((activeIndex - 1 + projects.length) % projects.length);
  const showNext = () => onChange((activeIndex + 1) % projects.length);

  return (
    <div className={`project-selector ${className}`} aria-label="Switch projects">
      <button type="button" onClick={showPrevious} aria-label="Previous project">
        <ArrowIcon direction="previous" />
      </button>
      <button type="button" onClick={showNext} aria-label="Next project">
        <ArrowIcon direction="next" />
      </button>
    </div>
  );
}

function ProjectGalleryModal({ project, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = project?.gallery || [];
  const activeImage = images[activeImageIndex];
  const showPrevious = () => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  const showNext = () => setActiveImageIndex((activeImageIndex + 1) % images.length);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveImageIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose, project]);

  if (!project || !activeImage) return null;

  return (
    <div className="project-gallery-backdrop" role="presentation" onMouseDown={onClose}>
      <motion.div
        className="project-gallery-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} gallery`}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="project-gallery-header">
          <div>
            <p>{project.category}</p>
            <h3>{project.title} Gallery</h3>
            <span>{activeImageIndex + 1} / {images.length}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close gallery">
            Close
          </button>
        </div>
        <div className="project-gallery-carousel">
          <button type="button" onClick={showPrevious} aria-label="Previous image">
            <ArrowIcon direction="previous" />
          </button>
          <figure>
            <motion.img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              loading="lazy"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          </figure>
          <button type="button" onClick={showNext} aria-label="Next image">
            <ArrowIcon direction="next" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HeroButtonIcon({ type }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    projects: (
      <>
        <rect {...c} x="4" y="4" width="6" height="6" rx="1.5" />
        <rect {...c} x="14" y="4" width="6" height="6" rx="1.5" />
        <rect {...c} x="4" y="14" width="6" height="6" rx="1.5" />
        <rect {...c} x="14" y="14" width="6" height="6" rx="1.5" />
      </>
    ),
    
    about: (
      <>
        <circle {...c} cx="12" cy="8" r="3" />
        <path {...c} d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),

    cv: (
      <>
        <path {...c} d="M7 3h7l4 4v14H7z" />
        <path {...c} d="M14 3v5h5" />
        <path {...c} d="M9.5 12h5M9.5 15h5M9.5 18h3" />
      </>
    ),
  };

  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-frost px-7 text-sm font-bold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-glow focus:ring-offset-2 focus:ring-offset-ink"
            >
              <HeroButtonIcon type="projects" />
              View Projects
            </a>
            
            <a
              href="#about"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm font-semibold text-frost transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
            >
              <HeroButtonIcon type="about" />
              About Eeliya
            </a>

            <a
              href={cvPdf}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-glow/35 bg-cyan-glow/10 px-7 text-sm font-semibold text-frost transition hover:border-cyan-glow/65 hover:bg-cyan-glow/15 focus:outline-none focus:ring-2 focus:ring-cyan-glow"
            >
              <HeroButtonIcon type="cv" />
              CV
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

function Projects({
  activeSection,
  mobileProjectIndex,
  setMobileProjectIndex,
  desktopProjectIndex,
  setDesktopProjectIndex,
  onGallery,
}) {
  const mobileProject = mobileProjects[mobileProjectIndex];
  const desktopProject = desktopProjects[desktopProjectIndex];
  const mobileSelectorClass = `project-selector-mobile project-device-selector ${
    activeSection === 'projects' ? 'is-visible' : ''
  }`;
  const desktopSelectorClass = `project-selector-desktop project-device-selector ${
    activeSection === 'projects-desktop' ? 'is-visible' : ''
  }`;

  return (
    <>
      <section
        id="projects"
        className="project-showcase-section project-mobile-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(155,124,255,0.05),transparent_30%,rgba(255,255,255,0.03))]" />
        <div className="mobile-static-phone project-static-phone">
          <IPhoneMockup activeSection="projects" project={mobileProject} staticMode />
          <ProjectSelector
            projects={mobileProjects}
            activeIndex={mobileProjectIndex}
            onChange={setMobileProjectIndex}
            className={mobileSelectorClass}
          />
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
            <h2>{mobileProject.title}</h2>
            <p>{mobileProject.summary}</p>
            <ProjectActions project={mobileProject} onGallery={onGallery} className="project-action-row-left" />
          </motion.div>

          <div className="project-phone-slot" aria-hidden="true">
            <ProjectSelector
              projects={mobileProjects}
              activeIndex={mobileProjectIndex}
              onChange={setMobileProjectIndex}
              className={mobileSelectorClass}
            />
          </div>

          <motion.div className="project-detail-block" variants={cardItem}>
            <ProjectInfoPanel project={mobileProject} />
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
            <div className="project-title-heading-row">
              <h2>{desktopProject.title}</h2>
            </div>
            <p>{desktopProject.summary}</p>
          </motion.div>

          <motion.div className="project-desktop-actions" variants={cardItem}>
            <ProjectActions project={desktopProject} onGallery={onGallery} />
          </motion.div>

          <motion.div className="project-laptop-slot" variants={cardItem}>
            <ProjectSelector
              projects={desktopProjects}
              activeIndex={desktopProjectIndex}
              onChange={setDesktopProjectIndex}
              className={desktopSelectorClass}
            />
            <div className="device-inline">
              <LazyLaptop activeProject={desktopProject} variant="projects" />
            </div>
          </motion.div>

          <motion.div className="project-detail-block project-desktop-detail" variants={cardItem}>
            <ProjectInfoPanel project={desktopProject} />
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
      className="section-panel tech-section relative flex min-h-dvh snap-start items-center justify-center overflow-hidden px-5 py-12 text-center sm:px-8 sm:py-14 lg:px-12 lg:py-10"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(74,222,128,0.05),transparent_30%,rgba(255,255,255,0.03))]" />
      <motion.div
        className="tech-section-inner mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <motion.div className="tech-copy" variants={sectionItem}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90">Tech Stack</p>
          <h2 className="text-4xl font-semibold leading-tight text-frost sm:text-5xl lg:text-6xl">
            Developer Toolkit
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            A focused look at the tools behind my mobile apps, web interfaces, backend APIs, and connected product
            workflows.
          </p>
        </motion.div>
        <motion.div className="tech-laptop-slot device-inline" variants={cardItem}>
          <LazyLaptop variant="tech" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Journey({ activeIndex = 0, onSelect }) {
  const activeEvent = journeyTimeline[activeIndex];
  const total = journeyTimeline.length;

  return (
    <section
      id="journey"
      className="section-panel journey-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(251,191,36,0.05),transparent_32%,rgba(255,255,255,0.03))]" />
      <motion.div
        className="mx-auto grid w-full max-w-7xl items-stretch gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <motion.div
          className="journey-copy flex h-full flex-col justify-center"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={sectionContainer}
        >
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90"
            variants={sectionItem}
          >
            The Roadmap
          </motion.p>
          <motion.h2
            className="max-w-2xl text-4xl font-semibold leading-tight text-frost sm:text-5xl"
            variants={sectionItem}
          >
            My Journey.
          </motion.h2>
          <motion.p className="mt-4 max-w-xl text-lg leading-8 text-muted" variants={sectionItem}>
            Pick a milestone on the roadmap to see what happened.
          </motion.p>

          <motion.span className="journey-divider" variants={sectionItem} aria-hidden="true" />

          <motion.div
            className="journey-detail"
            style={{ '--accent': activeEvent.color }}
            variants={cardItem}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <div className="journey-detail-meta">
                  <span className="journey-detail-step">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="journey-detail-date">{activeEvent.date}</span>
                </div>
                <h3 className="journey-detail-title">{activeEvent.title}</h3>
                <p className="journey-detail-text">{activeEvent.detail}</p>
                <code className="journey-detail-cmd">$ {activeEvent.command}</code>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
        <motion.div className="device-inline" variants={cardItem}>
          <LazyLaptop
            variant="journey"
            activeJourneyIndex={activeIndex}
            onJourneySelect={onSelect}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function MailGlyph({ name }) {
  const c = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    send: <path {...c} d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
    paperclip: <path {...c} d="M21 11.5 12.6 20a5 5 0 0 1-7-7l8.5-8.6a3.3 3.3 0 0 1 4.7 4.7L10 18.3a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />,
    image: (
      <>
        <rect {...c} x="3" y="4" width="18" height="16" rx="2.5" />
        <circle {...c} cx="8.5" cy="9.5" r="1.5" />
        <path {...c} d="m4 18 5-5 4 4 3-3 4 4" />
      </>
    ),
    text: <path {...c} d="M7 7h10M12 7v10m-2 0h4" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ContactForm() {
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormStatus('Sending...');

    const formData = new FormData(event.target);
    const userSubject = formData.get('subject')?.toString().trim();

    formData.append('access_key', '00278f25-2bfb-4583-801f-3c9ad4e45642');
    formData.set('subject', userSubject ? `Portfolio Thread: ${userSubject}` : 'Portfolio contact form');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('Message sent successfully');
        event.target.reset();
      } else {
        setFormStatus('Failed to send message');
      }
    } catch {
      setFormStatus('Something went wrong');
    }
  };

  return (
    <form className="contact-mail" onSubmit={handleSubmit}>
      <div className="contact-mail-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="contact-mail-title">New Message</span>
        <span className="contact-mail-bar-spacer" aria-hidden="true" />
      </div>

      <div className="contact-mail-head">
        <div className="contact-mail-row">
          <span className="contact-mail-key">To</span>
          <span className="contact-mail-to">
            <span className="contact-mail-avatar" aria-hidden="true">
              <img src={profilePhoto} alt="" />
            </span>
            Eeliya Nayeri
          </span>
        </div>
        <label className="contact-mail-row">
          <span className="contact-mail-key">From</span>
          <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
        </label>
        <label className="contact-mail-row">
          <span className="contact-mail-key">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="contact-mail-row">
          <span className="contact-mail-key">Subject</span>
          <input name="subject" type="text" placeholder="Let’s build something together" required />
        </label>
      </div>

      <textarea className="contact-mail-body" name="message" placeholder="Write your message…" required />

      <div className="contact-mail-foot">
        <div className="contact-mail-tools" aria-hidden="true">
          <i><MailGlyph name="paperclip" /></i>
          <i><MailGlyph name="image" /></i>
          <i><MailGlyph name="text" /></i>
        </div>
        <span className="contact-mail-status" aria-live="polite">
          {formStatus}
        </span>
        <button type="submit" className="contact-mail-send">
          <MailGlyph name="send" />
          Send
        </button>
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="section-panel contact-section relative flex min-h-dvh snap-start items-center overflow-hidden px-5 pb-24 pt-[30rem] sm:px-8 sm:pt-[34rem] lg:px-12 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(251,113,133,0.05),transparent_34%,rgba(86,217,255,0.04))]" />
      <motion.div
        className="contact-shell mx-auto w-full max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sectionContainer}
      >
        <div className="contact-head">
          <motion.p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-glow/90"
            variants={sectionItem}
          >
            Contact
          </motion.p>
          <motion.h2
            className="max-w-3xl text-4xl font-semibold leading-tight text-frost sm:text-5xl"
            variants={sectionItem}
          >
            Get in Touch.
          </motion.h2>
          <motion.p className="mt-4 max-w-2xl text-lg leading-8 text-muted" variants={sectionItem}>
            If you want to discuss a project, internship, collaboration, or a product idea, this panel is ready to open a new thread.
          </motion.p>
        </div>

        <div className="contact-stage grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.5fr)]">
          <motion.div className="contact-device device-inline" variants={cardItem}>
            <LazyLaptop variant="contact">
              <ContactForm />
            </LazyLaptop>
          </motion.div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}

const sectionToDesktopVariant = {
  'projects-desktop': 'projects',
  'tech-stack': 'tech',
  journey: 'journey',
  contact: 'contact',
};

// Single persistent desktop device that floats and slides between sections,
// exactly like the desktop phone. The per-section inline devices stay for
// mobile; on desktop they only reserve layout space (see .device-inline), and
// the float is positioned precisely onto that reserved slot.
function DesktopDevice({
  activeSection,
  desktopProject,
  journeyIndex,
  onJourneySelect,
  slots,
  isLayoutChanging,
}) {
  const isOn = desktopDeviceSections.includes(activeSection);
  const lastSectionRef = useRef('projects-desktop');
  if (isOn) lastSectionRef.current = activeSection;

  const contentSection = lastSectionRef.current;
  const variant = sectionToDesktopVariant[contentSection];
  const target = slots[contentSection];
  const stageRef = useDesktopProjectBoundaryLock(isOn && contentSection === 'projects-desktop');

  return (
    <motion.div
      ref={stageRef}
      className="desktop-device-float"
      initial={false}
      animate={
        target
          ? { left: target.left, top: target.top, width: target.width }
          : {}
      }
      style={{ opacity: target && isOn ? 1 : 0, pointerEvents: isOn ? 'auto' : 'none' }}
      transition={{ duration: isLayoutChanging ? 0 : 0.7, ease: smoothEase }}
      aria-hidden={!isOn}
    >
      <Suspense fallback={null}>
        <LaptopMockup
          variant={variant}
          activeProject={desktopProject}
          activeJourneyIndex={journeyIndex}
          onJourneySelect={onJourneySelect}
        >
          {variant === 'contact' ? <ContactForm /> : null}
        </LaptopMockup>
      </Suspense>
    </motion.div>
  );
}

export default function App() {
  const activeSection = useActiveSection(sectionIds);
  const [mobileProjectIndex, setMobileProjectIndex] = useState(0);
  const [desktopProjectIndex, setDesktopProjectIndex] = useState(initialDesktopProjectIndex);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [galleryProject, setGalleryProject] = useState(null);
  const activeMobileProject = mobileProjects[mobileProjectIndex];
  const desktopProject = desktopProjects[desktopProjectIndex];
  const { slots: desktopSlots, isLayoutChanging: isDesktopLayoutChanging } = useDesktopSlots();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-hidden bg-ink bg-radial-soft text-frost">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(115deg,rgba(6,9,18,0.68),rgba(11,16,32,0.9))]" />
        <IPhoneMockup activeSection={activeSection} className="desktop-phone" project={activeMobileProject} />
        <DesktopDevice
          activeSection={activeSection}
          desktopProject={desktopProject}
          journeyIndex={journeyIndex}
          onJourneySelect={setJourneyIndex}
          slots={desktopSlots}
          isLayoutChanging={isDesktopLayoutChanging}
        />
        <main className="overflow-x-hidden">
          <Home />
          <About />
          <Projects
            activeSection={activeSection}
            mobileProjectIndex={mobileProjectIndex}
            setMobileProjectIndex={setMobileProjectIndex}
            desktopProjectIndex={desktopProjectIndex}
            setDesktopProjectIndex={setDesktopProjectIndex}
            onGallery={setGalleryProject}
          />
          <TechStack />
          <Journey activeIndex={journeyIndex} onSelect={setJourneyIndex} />
          <Contact />
        </main>
        <ProjectGalleryModal project={galleryProject} onClose={() => setGalleryProject(null)} />
      </div>
    </MotionConfig>
  );
}
