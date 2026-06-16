import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import cssLogo from '../assets/logos/css3.png';
import dartLogo from '../assets/logos/dart.png';
import djangoLogo from '../assets/logos/django.png';
import figmaLogo from '../assets/logos/figma.png';
import firebaseLogo from '../assets/logos/firebase.png';
import flutterLogo from '../assets/logos/flutter.png';
import gitLogo from '../assets/logos/git.png';
import githubLogo from '../assets/logos/github.png';
import htmlLogo from '../assets/logos/html5.png';
import javaLogo from '../assets/logos/java.png';
import jsLogo from '../assets/logos/javascript.png';
import nodeLogo from '../assets/logos/nodejs.png';
import postmanLogo from '../assets/logos/postman.png';
import pythonLogo from '../assets/logos/python.png';
import reactLogo from '../assets/logos/react.png';
import sqlLogo from '../assets/logos/sql.png';
import swiftLogo from '../assets/logos/swift.png';
import tailwindLogo from '../assets/logos/tailwind.png';
import viteLogo from '../assets/logos/vite.png';
import vscodeLogo from '../assets/logos/vscode.png';
import xcodeLogo from '../assets/logos/xcode.png';
import alumniPreview from '../assets/projects/alumni-api/alumni-thumb.png';
import financePreview from '../assets/projects/finance/finance-money.jpg';
import premPreview from '../assets/projects/prem-predictor/prem-predictor-thumb.png';
import skyPreview from '../assets/projects/skyhealth/skyhealth-thumb.png';
import { quickEase, smoothEase, viewportOnce } from '../lib/motion.js';

const desktopProjects = [
  {
    name: 'Prem Predictor',
    description: 'A browser app for prediction leagues, full table submissions, leaderboard scoring, and PDF reports.',
    stack: ['HTML', 'JavaScript', 'Tailwind', 'jsPDF'],
    accent: 'finance',
    image: premPreview,
  },
  {
    name: 'Alumni API',
    description: 'A two-service alumni platform with authentication, profiles, blind bidding, winner selection, and Swagger docs.',
    stack: ['Node.js', 'Express', 'SQLite', 'JWT'],
    accent: 'portfolio',
    image: alumniPreview,
  },
  {
    name: 'SkyHealth',
    description: 'An aviation-inspired health and safety project focused on structured status views and operational workflows.',
    stack: ['Django', 'Python', 'SQLite', 'Dashboards'],
    accent: 'sky',
    image: skyPreview,
  },
  {
    name: 'Portfolio Optimiser',
    description: 'A Django finance optimiser for stock inputs, CSV uploads, risk controls, and portfolio allocation results.',
    stack: ['Django', 'Python', 'PyPortfolioOpt', 'SQLite'],
    accent: 'finance',
    image: financePreview,
  },
];

const techGroups = [
  {
    title: 'Languages',
    items: ['JavaScript', 'Dart', 'Python', 'Java', 'Swift', 'SQL'],
    tone: 'cyan',
  },
  {
    title: 'Frontend',
    items: ['React', 'Vite', 'Tailwind', 'HTML', 'CSS'],
    tone: 'violet',
  },
  {
    title: 'Mobile',
    items: ['Flutter', 'Swift/iOS'],
    tone: 'green',
  },
  {
    title: 'Backend',
    items: ['Django', 'REST APIs', 'Firebase', 'Node/Express'],
    tone: 'amber',
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Xcode', 'VS Code', 'Postman'],
    tone: 'rose',
  },
  {
    title: 'APIs',
    items: ['Amadeus API', 'Google Places API', 'Firebase'],
    tone: 'blue',
  },
];

const journeyTimeline = [
  {
    command: 'init cs-degree',
    title: 'Started Computer Science degree',
    detail: 'Built the foundation: programming, systems thinking, problem solving, and better technical habits.',
  },
  {
    command: 'ship uni-projects',
    title: 'Built early university projects',
    detail: 'Used coursework and experiments to learn how ideas move from brief to working software.',
  },
  {
    command: 'work customer-facing',
    title: 'Worked at B&Q',
    detail: 'Developed practical customer-facing experience, communication, patience, and attention to real user needs.',
  },
  {
    command: 'build skyhealth --django',
    title: 'Built SkyHealth Django project',
    detail: 'Explored backend structure, data flows, and aviation-inspired health and safety workflows.',
  },
  {
    command: 'create finance-and-weather',
    title: 'Built finance planner and weather app',
    detail: 'Practised dashboard thinking, APIs, responsive layouts, and clearer user feedback.',
  },
  {
    command: 'start traverse',
    title: 'Started Traverse travel companion app',
    detail: 'Began shaping a travel product around planning, places, routes, and mobile-first interaction.',
  },
  {
    command: 'focus final-year',
    title: 'Final year portfolio and full-stack/mobile focus',
    detail: 'Now tightening the portfolio, improving project quality, and building stronger full-stack and mobile skills.',
  },
];

const techLogoMap = {
  'Amadeus API': postmanLogo,
  CSS: cssLogo,
  Dart: dartLogo,
  Django: djangoLogo,
  Figma: figmaLogo,
  Firebase: firebaseLogo,
  Flutter: flutterLogo,
  Git: gitLogo,
  GitHub: githubLogo,
  HTML: htmlLogo,
  Java: javaLogo,
  JavaScript: jsLogo,
  'Node/Express': nodeLogo,
  Postman: postmanLogo,
  Python: pythonLogo,
  React: reactLogo,
  'REST APIs': postmanLogo,
  SQL: sqlLogo,
  Swift: swiftLogo,
  'Swift/iOS': swiftLogo,
  Tailwind: tailwindLogo,
  Vite: viteLogo,
  'VS Code': vscodeLogo,
  Xcode: xcodeLogo,
};

const projectVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: smoothEase } },
  exit: { opacity: 0, y: -14, scale: 0.98, transition: { duration: 0.2, ease: quickEase } },
};

function ProjectPreview({ accent, image, name }) {
  return (
    <div className={`laptop-ui-preview laptop-ui-${accent}`} aria-hidden="true">
      <img src={image} alt={`${name} preview`} loading="lazy" />
    </div>
  );
}

function ProjectLaptopScreen({ activeProject, activeIndex, setActiveIndex }) {
  const showPrevious = () => setActiveIndex((activeIndex - 1 + desktopProjects.length) % desktopProjects.length);
  const showNext = () => setActiveIndex((activeIndex + 1) % desktopProjects.length);

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 12) return;
    if (event.deltaY > 0) showNext();
    if (event.deltaY < 0) showPrevious();
  };

  return (
    <div className="laptop-project-os" onWheel={handleWheel}>
      <div className="laptop-window-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>projects.eeliya.dev</p>
        <div className="window-actions" aria-hidden="true">
          <span />
          <span />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={activeProject.name}
          className="laptop-project-panel"
          variants={projectVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="laptop-project-copy">
            <p className="device-kicker">Desktop/Web Project</p>
            <h3>{activeProject.name}</h3>
            <p>{activeProject.description}</p>
            <div className="device-stack" aria-label={`${activeProject.name} tech stack`}>
              {activeProject.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="project-actions">
              <a href="#projects">GitHub</a>
              <a href="#projects">Demo</a>
            </div>
          </div>
          <ProjectPreview accent={activeProject.accent} image={activeProject.image} name={activeProject.name} />
        </motion.article>
      </AnimatePresence>

      <div className="device-switcher" aria-label="Switch desktop projects">
        <button type="button" onClick={showPrevious}>
          Prev
        </button>
        <div>
          {desktopProjects.map((project, index) => (
            <button
              key={project.name}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`Show ${project.name}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" onClick={showNext}>
          Next
        </button>
      </div>
    </div>
  );
}

function JourneyLaptopScreen() {
  return (
    <div className="journey-terminal-os">
      <div className="laptop-window-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>journey.terminal</p>
        <div className="window-actions" aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
      <div className="terminal-header">
        <p className="device-kicker">Timeline Shell</p>
        <h3>~/eeliya/journey</h3>
        <span>Story-driven log of study, work, and project momentum.</span>
      </div>
      <div className="terminal-timeline" aria-label="Eeliya journey timeline">
        {journeyTimeline.map((item, index) => (
          <motion.article
            className="terminal-step"
            key={item.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.42, delay: index * 0.035, ease: smoothEase }}
          >
            <div className="terminal-command">
              <span>$</span>
              <code>{item.command}</code>
            </div>
            <div className="terminal-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function TechLaptopScreen() {
  return (
    <div className="laptop-tech-os">
      <div className="laptop-window-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>developer.stack</p>
        <div className="window-actions" aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
      <div className="tech-dashboard">
        <div className="tech-dashboard-hero">
          <p className="device-kicker">Developer Dashboard</p>
          <h3>Eeliya&apos;s Stack</h3>
          <span>Full-stack, mobile, APIs, and practical tools.</span>
        </div>
        <div className="tech-group-grid">
          {techGroups.map((group) => (
            <section className={`tech-group-card tech-tone-${group.tone}`} key={group.title}>
              <div className="tech-group-header">
                <span aria-hidden="true" />
                <h4>{group.title}</h4>
              </div>
              <div className="tech-chip-list">
                {group.items.map((item) => (
                  <span key={item}>
                    {techLogoMap[item] ? <img src={techLogoMap[item]} alt="" aria-hidden="true" loading="lazy" /> : null}
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LaptopMockup({ variant = 'projects', className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = desktopProjects[activeIndex];
  const isProjects = variant === 'projects';
  const isTech = variant === 'tech';

  return (
    <div
      className={`laptop-focus ${isProjects ? 'laptop-projects' : ''} ${isTech ? 'laptop-tech' : ''} ${
        !isProjects && !isTech ? 'laptop-journey' : ''
      } ${className}`}
    >
      <div
        className="laptop-lid"
        aria-label={isProjects ? 'Desktop project laptop' : isTech ? 'Developer tech stack laptop' : 'Laptop journey focus'}
      >
        <div className="laptop-screen">
          {isProjects ? (
            <ProjectLaptopScreen
              activeProject={activeProject}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ) : isTech ? (
            <TechLaptopScreen />
          ) : (
            <>
              <div className="laptop-toolbar">
                <span />
                <span />
                <span />
              </div>
              <JourneyLaptopScreen />
            </>
          )}
        </div>
      </div>
      <div className="laptop-base">
        <div className="keyboard-hint" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <span className="trackpad-hint" aria-hidden="true" />
      </div>
    </div>
  );
}
