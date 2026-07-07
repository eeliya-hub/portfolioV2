import { motion } from 'framer-motion';
import { useState } from 'react';
import chromeIcon from '../assets/docicons/chrome.png';
import finderIcon from '../assets/docicons/finder.png';
import mapsIcon from '../assets/docicons/maps.png';
import messagesIcon from '../assets/docicons/messages.png';
import photosIcon from '../assets/docicons/photos.png';
import { desktopProjects } from '../data/projects.js';
import { journeyTimeline } from '../data/journey.js';
import { techCategories } from '../data/techStack.js';
import { smoothEase } from '../lib/motion.js';
import { LucideIcon, TechItemIcon } from './TechIcons.jsx';

const dockApps = [
  { title: 'Finder', icon: finderIcon },
  { title: 'Chrome', icon: chromeIcon },
  { title: 'Messages', icon: messagesIcon },
  { title: 'Photos', icon: photosIcon },
  { title: 'Maps', icon: mapsIcon },
];

function ChromeFavicon({ icon }) {
  return (
    <span className="chrome-favicon" aria-hidden="true">
      <LucideIcon name={icon} />
    </span>
  );
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

// Gantt-style timeline: each event is a bar spanning its date range across a
// shared year axis, so overlapping chapters line up and are easy to read.
const TIMELINE_MIN = 2018.3;
const TIMELINE_MAX = 2026.9;
const TIMELINE_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const TIMELINE_NOW = 2026.46;
const TIMELINE_MIN_DURATION = 0.32;
const TIMELINE_GUTTER = 30; // % of the chart width reserved for event names
const TIMELINE_COLORS = ['#56d9ff', '#a78bfa', '#fbbf24', '#4ade80', '#f472b6', '#60a5fa'];

function timelineX(year) {
  const t = (year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN);
  return TIMELINE_GUTTER + t * (98 - TIMELINE_GUTTER);
}

function JourneyTimelineScreen({ activeIndex = 0, onSelect }) {
  const count = journeyTimeline.length;
  const rowTop = 3; // %
  const rowBandBottom = 84; // % (below this sits the year axis)
  const rowHeight = (rowBandBottom - rowTop) / count;

  return (
    <div className="journey-timeline">
      <div className="journey-roadmap-head">
        <p className="device-kicker">Timeline</p>
        <h3>The journey so far</h3>
        <span className="journey-roadmap-sub">{count} chapters · overlapping milestones</span>
      </div>
      <div className="journey-gantt">
        <div className="journey-gantt-grid" aria-hidden="true">
          {TIMELINE_YEARS.map((year) => (
            <div className="journey-gantt-year" key={year} style={{ left: `${timelineX(year)}%` }}>
              <i style={{ top: `${rowTop}%`, bottom: `${100 - rowBandBottom}%` }} />
              <span>{`'${String(year).slice(2)}`}</span>
            </div>
          ))}
          <div
            className="journey-gantt-now"
            style={{ left: `${timelineX(TIMELINE_NOW)}%`, top: `${rowTop}%`, bottom: `${100 - rowBandBottom}%` }}
          >
            <span>now</span>
          </div>
        </div>

        {journeyTimeline.map((ev, index) => {
          const barEnd = Math.max(ev.end, ev.start + TIMELINE_MIN_DURATION);
          const left = timelineX(ev.start);
          const width = timelineX(barEnd) - left;
          const top = rowTop + index * rowHeight;
          const color = ev.color || TIMELINE_COLORS[index % TIMELINE_COLORS.length];

          return (
            <button
              type="button"
              key={ev.id}
              className={`journey-gantt-row ${index === activeIndex ? 'is-active' : ''}`}
              style={{ top: `${top}%`, height: `${rowHeight}%`, '--bar': color }}
              onClick={() => onSelect?.(index)}
              aria-pressed={index === activeIndex}
              aria-label={`${ev.short}, ${ev.date}`}
            >
              <span className="journey-gantt-name">
                <span className="journey-gantt-check" aria-hidden="true">
                  <svg className="journey-gantt-tick" viewBox="0 0 24 24">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                <span className="journey-gantt-name-info">
                  <span className="journey-gantt-name-text">{ev.short}</span>
                  <span className="journey-gantt-name-date">{ev.date}</span>
                </span>
              </span>
              <span
                className={`journey-gantt-bar ${ev.ongoing ? 'is-ongoing' : ''}`}
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TechLaptopScreen() {
  const [activeTabId, setActiveTabId] = useState(techCategories[0].id);
  const activeTab = techCategories.find((tab) => tab.id === activeTabId) || techCategories[0];

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
              {techCategories.map((tab) => (
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

export default function LaptopMockup({
  variant = 'projects',
  className = '',
  activeProject,
  activeJourneyIndex = 0,
  onJourneySelect,
  children,
}) {
  const selectedProject = activeProject || desktopProjects[0];
  const isProjects = variant === 'projects';
  const isTech = variant === 'tech';
  const isContact = variant === 'contact';
  const isJourney = !isProjects && !isTech && !isContact;

  return (
    <div
      className={`laptop-focus ${isProjects ? 'laptop-projects' : ''} ${isTech ? 'laptop-tech' : ''} ${
        isContact ? 'laptop-contact' : ''
      } ${isJourney ? 'laptop-journey' : ''} ${className}`}
    >
      <div
        className="laptop-lid"
        aria-label={
          isProjects
            ? 'Desktop project laptop'
            : isTech
              ? 'Developer tech stack laptop'
              : isContact
                ? 'Contact form desktop'
                : 'Laptop journey focus'
        }
      >
        <div className="laptop-screen">
          {isProjects ? (
            <ProjectLaptopScreen activeProject={selectedProject} />
          ) : isTech ? (
            <TechLaptopScreen />
          ) : isJourney ? (
            <JourneyTimelineScreen activeIndex={activeJourneyIndex} onSelect={onJourneySelect} />
          ) : null}
          {/* Children (the contact form) stay mounted across variant switches
              so arriving at the contact section never pays a mount mid-slide;
              they are simply hidden while another screen is showing. */}
          {children ? (
            <div className="laptop-screen-children" style={{ display: isContact ? undefined : 'none' }}>
              {children}
            </div>
          ) : null}
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
