import { motion } from 'framer-motion';
import { useState } from 'react';
import chromeIcon from '../assets/docicons/chrome.png';
import finderIcon from '../assets/docicons/finder.png';
import mapsIcon from '../assets/docicons/maps.png';
import messagesIcon from '../assets/docicons/messages.png';
import photosIcon from '../assets/docicons/photos.png';
import cssLogo from '../assets/logos/css3.png';
import dartLogo from '../assets/logos/dart.png';
import djangoLogo from '../assets/logos/django.png';
import figmaLogo from '../assets/logos/figma.png';
import firebaseLogo from '../assets/logos/firebase.png';
import flutterLogo from '../assets/logos/flutter.png';
import gitLogo from '../assets/logos/git.png';
import googleCloudLogo from '../assets/logos/google-cloud.png';
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
import swiftuiLogo from '../assets/logos/swiftui.png';
import tailwindLogo from '../assets/logos/tailwind.png';
import viteLogo from '../assets/logos/vite.png';
import vscodeLogo from '../assets/logos/vscode.png';
import xcodeLogo from '../assets/logos/xcode.png';
import phpLogo from '../assets/logos/PHP-logo.svg.png';
import androidStudioLogo from '../assets/logos/Android_Studio_Logo_(2023).svg.png';
import { desktopProjects } from '../data/projects.js';
import { smoothEase, viewportOnce } from '../lib/motion.js';

const chromeTechTabs = [
  {
    id: 'languages',
    title: 'Languages',
    icon: 'code',
    description: 'Core programming and scripting languages.',
    url: 'stack.eeliya.dev/languages',
    items: ['Python', 'Java', 'JavaScript', 'Dart', 'SQL', 'Swift', 'PHP', 'HTML', 'CSS'],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Stacks',
    icon: 'layers',
    description: 'Libraries, frameworks, and product stacks I build with.',
    url: 'stack.eeliya.dev/frameworks',
    items: ['React', 'Node.js', 'Express', 'Django', 'Flutter', 'SwiftUI', 'Tailwind CSS', 'Vite', 'Firebase', 'REST APIs'],
  },
  {
    id: 'software',
    title: 'Software',
    icon: 'monitorCog',
    description: 'Tools and platforms I use daily.',
    url: 'stack.eeliya.dev/software',
    items: ['VS Code', 'Git', 'GitHub', 'Figma', 'Postman', 'Google Cloud', 'Xcode', 'Android Studio'],
  },
  {
    id: 'capabilities',
    title: 'Tech Capabilities',
    icon: 'braces',
    description: 'Technical skills and engineering patterns.',
    url: 'stack.eeliya.dev/capabilities',
    items: [
      'Responsive Design',
      'API Design',
      'MVVM Architecture',
      'Database Modelling',
      'Motion & Animation',
      'CI/CD Workflows',
      'Version Control',
      'UI/UX Systems',
    ],
  },
  {
    id: 'personal',
    title: 'Personal Skills',
    icon: 'users',
    description: 'Soft skills and professional qualities.',
    url: 'stack.eeliya.dev/personal-skills',
    items: [
      'Leadership',
      'Communication',
      'Problem Solving',
      'Team Collaboration',
      'Time Management',
      'Adaptability',
      'Critical Thinking',
      'Project Management',
    ],
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
  'Google Cloud': googleCloudLogo,
  GitHub: githubLogo,
  HTML: htmlLogo,
  Java: javaLogo,
  JavaScript: jsLogo,
  'Node.js': nodeLogo,
  'Node/Express': nodeLogo,
  Postman: postmanLogo,
  Python: pythonLogo,
  React: reactLogo,
  'REST APIs': postmanLogo,
  SQL: sqlLogo,
  Swift: swiftLogo,
  'Swift/iOS': swiftLogo,
  SwiftUI: swiftuiLogo,
  Tailwind: tailwindLogo,
  'Tailwind CSS': tailwindLogo,
  Vite: viteLogo,
  'VS Code': vscodeLogo,
  Xcode: xcodeLogo,
  PHP: phpLogo,
  'Android Studio': androidStudioLogo,
};

const stackIconMap = {
  Adaptability: 'refresh',
  'API Design': 'share',
  'CI/CD Workflows': 'rocket',
  Communication: 'message',
  'Critical Thinking': 'brain',
  'Database Modelling': 'database',
  Leadership: 'crown',
  'Motion & Animation': 'sparkles',
  'MVVM Architecture': 'layers',
  'Problem Solving': 'lightbulb',
  'Project Management': 'clipboard',
  'Responsive Design': 'devices',
  'Team Collaboration': 'users',
  'Time Management': 'clock',
  'UI/UX Systems': 'palette',
  'Version Control': 'gitBranch',
};

const dockApps = [
  { title: 'Finder', icon: finderIcon },
  { title: 'Chrome', icon: chromeIcon },
  { title: 'Messages', icon: messagesIcon },
  { title: 'Photos', icon: photosIcon },
  { title: 'Maps', icon: mapsIcon },
];

function LucideIcon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
  };

  const paths = {
    braces: (
      <>
        <path {...common} d="M8 3H7a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3h1" />
        <path {...common} d="M16 3h1a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3h-1" />
      </>
    ),
    brain: (
      <>
        <path {...common} d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 3 5" />
        <path {...common} d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-3 5" />
        <path {...common} d="M9 4v16" />
        <path {...common} d="M15 4v16" />
      </>
    ),
    clipboard: (
      <>
        <rect {...common} x="7" y="4" width="10" height="16" rx="2" />
        <path {...common} d="M9 4a3 3 0 0 1 6 0" />
        <path {...common} d="M9 10h6" />
        <path {...common} d="M9 14h4" />
      </>
    ),
    clock: (
      <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="M12 8v5l3 2" />
      </>
    ),
    code: (
      <>
        <path {...common} d="m8 9-4 3 4 3" />
        <path {...common} d="m16 9 4 3-4 3" />
        <path {...common} d="m14 5-4 14" />
      </>
    ),
    crown: (
      <>
        <path {...common} d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z" />
        <path {...common} d="M6 20h12" />
      </>
    ),
    database: (
      <>
        <ellipse {...common} cx="12" cy="6" rx="7" ry="3" />
        <path {...common} d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path {...common} d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    devices: (
      <>
        <rect {...common} x="3" y="5" width="12" height="9" rx="1.5" />
        <rect {...common} x="16" y="10" width="5" height="9" rx="1.5" />
        <path {...common} d="M8 18h4" />
        <path {...common} d="M10 14v4" />
      </>
    ),
    gitBranch: (
      <>
        <circle {...common} cx="6" cy="6" r="2" />
        <circle {...common} cx="18" cy="18" r="2" />
        <circle {...common} cx="6" cy="18" r="2" />
        <path {...common} d="M6 8v8" />
        <path {...common} d="M8 6h4a6 6 0 0 1 6 6v4" />
      </>
    ),
    layers: (
      <>
        <path {...common} d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path {...common} d="m3 12 9 5 9-5" />
        <path {...common} d="m3 16 9 5 9-5" />
      </>
    ),
    lightbulb: (
      <>
        <path {...common} d="M9 18h6" />
        <path {...common} d="M10 22h4" />
        <path {...common} d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" />
      </>
    ),
    message: (
      <>
        <path {...common} d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>
    ),
    monitorCog: (
      <>
        <rect {...common} x="3" y="4" width="14" height="10" rx="2" />
        <path {...common} d="M8 20h5" />
        <path {...common} d="M10 14v6" />
        <circle {...common} cx="18" cy="17" r="2" />
        <path {...common} d="M18 13v1" />
        <path {...common} d="M18 20v1" />
        <path {...common} d="m14.5 15 1 .5" />
        <path {...common} d="m20.5 18.5 1 .5" />
      </>
    ),
    palette: (
      <>
        <path {...common} d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 .8-2.8H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z" />
        <circle {...common} cx="7.5" cy="10.5" r=".5" />
        <circle {...common} cx="10.5" cy="7.5" r=".5" />
        <circle {...common} cx="14" cy="7.5" r=".5" />
      </>
    ),
    refresh: (
      <>
        <path {...common} d="M20 6v5h-5" />
        <path {...common} d="M4 18v-5h5" />
        <path {...common} d="M6.2 8A7 7 0 0 1 18 7.1L20 11" />
        <path {...common} d="M17.8 16A7 7 0 0 1 6 16.9L4 13" />
      </>
    ),
    rocket: (
      <>
        <path {...common} d="M5 15c2-6 6-10 14-10-1 8-4 12-10 14l-4-4Z" />
        <path {...common} d="M9 19 5 21l2-4" />
        <circle {...common} cx="15" cy="9" r="1.5" />
      </>
    ),
    share: (
      <>
        <circle {...common} cx="18" cy="5" r="3" />
        <circle {...common} cx="6" cy="12" r="3" />
        <circle {...common} cx="18" cy="19" r="3" />
        <path {...common} d="m8.6 13.5 6.8 4" />
        <path {...common} d="m15.4 6.5-6.8 4" />
      </>
    ),
    sparkles: (
      <>
        <path {...common} d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
        <path {...common} d="m5 15 .8 1.8L8 18l-2.2 1.2L5 21l-.8-1.8L2 18l2.2-1.2L5 15Z" />
      </>
    ),
    users: (
      <>
        <path {...common} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle {...common} cx="9" cy="7" r="4" />
        <path {...common} d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path {...common} d="M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
  };

  return (
    <svg className="lucide-like-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] || paths.code}
    </svg>
  );
}

function ChromeFavicon({ icon }) {
  return (
    <span className="chrome-favicon" aria-hidden="true">
      <LucideIcon name={icon} />
    </span>
  );
}

function TechItemIcon({ item }) {
  const logo = techLogoMap[item];

  if (logo) {
    return <img src={logo} alt="" aria-hidden="true" loading="lazy" />;
  }

  return <LucideIcon name={stackIconMap[item] || 'code'} />;
}

function ProjectLaptopScreen({ activeProject }) {
  return (
    <div className="laptop-project-os">
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
      <motion.div
        className="laptop-project-shot"
        key={activeProject.id}
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: smoothEase }}
      >
        <img src={activeProject.deviceImage} alt={`${activeProject.title} screenshot`} loading="lazy" />
      </motion.div>
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
  const [activeTabId, setActiveTabId] = useState(chromeTechTabs[0].id);
  const activeTab = chromeTechTabs.find((tab) => tab.id === activeTabId) || chromeTechTabs[0];

  return (
    <div className="laptop-tech-os">
      <div className="mac-menu-bar" aria-hidden="true">
        <div>
          <span className="mac-apple">Mac</span>
          <strong>Chrome</strong>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
        </div>
        <div>
          <span>Wi-Fi</span>
          <span>100%</span>
          <span>9:41</span>
        </div>
      </div>

      <div className="mac-desktop">
        <section className="chrome-window" aria-label="Developer toolkit Chrome window">
          <div className="chrome-titlebar">
            <div className="chrome-traffic-lights" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="chrome-tab-strip" role="tablist" aria-label="Developer toolkit categories">
              {chromeTechTabs.map((tab) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab.id === tab.id}
                  className={`chrome-tab ${activeTab.id === tab.id ? 'is-active' : ''}`}
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <ChromeFavicon icon={tab.icon} />
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
            <button type="button" className="chrome-new-tab" aria-label="New tab">
              +
            </button>
          </div>

          <div className="chrome-toolbar">
            <div className="chrome-navigation" aria-hidden="true">
              <button type="button">&lt;</button>
              <button type="button">&gt;</button>
              <button type="button">
                <LucideIcon name="refresh" />
              </button>
            </div>
            <div className="chrome-address-bar">
              <span aria-hidden="true">https</span>
              <p>{activeTab.url}</p>
            </div>
            <button type="button" className="chrome-menu-button" aria-label="Chrome menu">
              ...
            </button>
          </div>

          <motion.div
            className="chrome-page"
            key={activeTab.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: smoothEase }}
            role="tabpanel"
          >
            <div className="chrome-page-heading">
              <p>Developer Toolkit</p>
              <h3>{activeTab.title}</h3>
              <span>{activeTab.description}</span>
            </div>
            <div className="chrome-stack-grid">
              {activeTab.items.map((item) => (
                <article className="chrome-stack-card" key={item}>
                  <i>
                    <TechItemIcon item={item} />
                  </i>
                  <span>{item}</span>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="mac-dock" aria-hidden="true">
          {dockApps.map((app) => (
            <span className={`dock-app-icon dock-app-${app.title.toLowerCase().replaceAll(' ', '-')}`} key={app.title}>
              <img src={app.icon} alt="" loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LaptopMockup({ variant = 'projects', className = '', activeProject }) {
  const selectedProject = activeProject || desktopProjects[0];
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
            <ProjectLaptopScreen activeProject={selectedProject} />
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
