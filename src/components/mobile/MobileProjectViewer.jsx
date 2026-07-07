import { motion } from 'framer-motion';

function NavArrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'previous' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

// Touch-first replacement for the desktop laptop mockup: the screenshot sits
// in a simple browser card at full content width, with large prev/next
// controls and position dots underneath.
export default function MobileProjectViewer({ projects, activeIndex, onChange }) {
  const project = projects[activeIndex];
  const showPrevious = () => onChange((activeIndex - 1 + projects.length) % projects.length);
  const showNext = () => onChange((activeIndex + 1) % projects.length);

  return (
    <div className="m-browser">
      <div className="m-browser-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>projects.eeliya.dev</p>
      </div>

      <motion.img
        key={project.id}
        className="m-browser-shot"
        src={project.deviceImage}
        alt={`${project.title} screenshot`}
        loading="lazy"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.26 }}
      />

      <div className="m-browser-nav">
        <button type="button" onClick={showPrevious} aria-label="Previous project">
          <NavArrow direction="previous" />
        </button>
        <div className="m-browser-dots" aria-hidden="true">
          {projects.map((item, index) => (
            <span key={item.id} className={index === activeIndex ? 'is-active' : ''} />
          ))}
        </div>
        <button type="button" onClick={showNext} aria-label="Next project">
          <NavArrow direction="next" />
        </button>
      </div>
    </div>
  );
}
