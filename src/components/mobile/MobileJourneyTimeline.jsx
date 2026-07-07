import { AnimatePresence, motion } from 'framer-motion';
import { journeyTimeline } from '../../data/journey.js';

// Touch-first replacement for the desktop Gantt monitor: a vertical timeline
// where tapping a milestone expands its story in place, so nothing has to
// shrink to fit inside a mockup screen.
export default function MobileJourneyTimeline({ activeIndex = 0, onSelect }) {
  return (
    <div className="m-journey" role="list" aria-label="Journey milestones">
      {journeyTimeline.map((event, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={event.id}
            role="listitem"
            className={`m-journey-item ${isActive ? 'is-active' : ''}`}
            style={{ '--accent': event.color }}
          >
            <button
              type="button"
              className="m-journey-head"
              aria-expanded={isActive}
              onClick={() => onSelect?.(index)}
            >
              <span className="m-journey-node" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>
              <span className="m-journey-head-info">
                <span className="m-journey-name">{event.short}</span>
                <span className="m-journey-date">
                  {event.date}
                  {event.ongoing ? ' · ongoing' : ''}
                </span>
              </span>
              <span className="m-journey-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isActive ? (
                <motion.div
                  className="m-journey-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="m-journey-body-inner">
                    <h3>{event.title}</h3>
                    <p>{event.detail}</p>
                    <code>$ {event.command}</code>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
