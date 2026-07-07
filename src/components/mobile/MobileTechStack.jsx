import { motion } from 'framer-motion';
import { useState } from 'react';
import { techCategories } from '../../data/techStack.js';
import { LucideIcon, TechItemIcon } from '../TechIcons.jsx';

// Touch-first replacement for the desktop Chrome-window monitor: scrollable
// category chips over a full-width grid of tools at readable sizes.
export default function MobileTechStack() {
  const [activeId, setActiveId] = useState(techCategories[0].id);
  const activeCategory = techCategories.find((category) => category.id === activeId) || techCategories[0];

  return (
    <div className="m-tech">
      <div className="m-tech-tabs" role="tablist" aria-label="Developer toolkit categories">
        {techCategories.map((category) => (
          <button
            type="button"
            role="tab"
            key={category.id}
            aria-selected={category.id === activeCategory.id}
            className={`m-tech-tab ${category.id === activeCategory.id ? 'is-active' : ''}`}
            onClick={() => setActiveId(category.id)}
          >
            <LucideIcon name={category.icon} />
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeCategory.id}
        className="m-tech-panel"
        role="tabpanel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <p className="m-tech-desc">{activeCategory.description}</p>
        <div className="m-tech-grid">
          {activeCategory.items.map((item) => (
            <span className="m-tech-card" key={item}>
              <i aria-hidden="true">
                <TechItemIcon item={item} />
              </i>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
