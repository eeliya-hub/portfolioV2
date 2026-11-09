// Which entries in the register use a given technology.
//
// Derived from projects.js rather than typed into stack.js, so the count beside
// a name can never drift from the projects themselves.

import { projects } from '../data/projects.js';
import { stackAliases } from '../data/stack.js';

const normalise = (name) => (stackAliases[name] ?? name).toLowerCase();

const index = new Map();
for (const project of projects) {
  for (const item of project.stack) {
    const key = item.toLowerCase();
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(project);
  }
}

/** @returns {Array<{id: string, title: string}>} entries using this technology */
export const usedIn = (name) => index.get(normalise(name)) ?? [];
