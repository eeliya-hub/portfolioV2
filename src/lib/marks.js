// A mark for any named technology, wherever it is written.
//
// 04 already carries one for every item in its registers — a product's own
// logo, a drawn glyph for a practice, or a monogram struck in the site's
// octagon where there is no logo file. A project's `stack` in projects.js is
// a list of the same names, so the file view looks them up here rather than
// keeping a second table that could disagree with the first.
//
// A name the registers do not hold gets a monogram built from its initials,
// which is the same fallback 04 uses and for the same reason: a register
// with a hole in it looks broken, and a drawn mark never does.

import { stackRegisters } from '../data/stack.js';

const INDEX = new Map();
for (const register of stackRegisters) {
  for (const item of register.items) INDEX.set(item.name.toLowerCase(), item);
}

/** 'OpenWeather API' -> 'OA'; 'Express' -> 'EX'. */
function initials(name) {
  const words = name.replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' ').filter(Boolean);
  if (words.length === 0) return '·';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function markFor(name) {
  return INDEX.get(name.toLowerCase()) ?? { name, mono: initials(name) };
}

export default markFor;
