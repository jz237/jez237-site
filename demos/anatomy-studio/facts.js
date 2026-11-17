/**
 * Key facts and related pieces, derived from the description text that ships with the model (Z-Anatomy / Wikipedia).
 * Nothing here is authored: a fact is a sentence lifted from the piece's own description, and a related piece is
 * another piece of the model that the description names.
 */

// [label, pattern, muscles only]
const RULES = [
  ['Origin', /\b(originat\w*|arises?|arising|its origin|origin (is|on|from|at))\b/i, true],
  ['Insertion', /\binsert\w*\b/i, true],
  ['Action', /\b(flex(es|ion|or)?|extends?|extension|abducts?|abduction|adducts?|adduction|rotat\w+|elevat\w+|depress\w+|pronat\w+|supinat\w+)\b/i, true],
  ['Nerve supply', /\b(innervat\w*|nerve supply|supplied by (the )?[\w\s-]*nerves?)\b/i, false],
  ['Blood supply', /\b(blood supply|supplied by (the )?[\w\s-]*arter(y|ies)|drain(s|ed)? (in)?to (the )?[\w\s-]*veins?)\b/i, false]
];

const sentences = text => text
  .replace(/==+[^=]+==+/g, ' ')
  .split(/(?<=[.!?])\s+(?=[A-Z])|\n+/)
  .map(s => s.trim())
  .filter(s => s.length > 20 && s.length < 280 && /[.!?]$/.test(s));

/** Up to one sentence per heading, in the order above. Returns [{ label, text }]. */
export function keyFacts(text, file) {
  if (!text) return [];
  const list = sentences(text);
  const used = new Set();
  const facts = [];
  for (const [label, pattern, musclesOnly] of RULES) {
    if (musclesOnly && file !== 'muscular') continue;
    const hit = list.find(s => !used.has(s) && pattern.test(s));
    if (hit) { used.add(hit); facts.push({ label, text: hit }); }
  }
  return facts;
}

let index = null, indexSize = -1;

/** Pieces of the model named in the text, longest names first so "Head of femur" wins over "Femur". */
export function relatedPieces(text, part, parts, limit = 6) {
  if (!text) return [];
  if (indexSize !== parts.length) {
    const byName = new Map();
    for (const p of parts) { if (p.name.length < 5) continue; const k = p.name.toLowerCase(); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(p); }
    index = [...byName.entries()].sort((a, b) => b[0].length - a[0].length);
    indexSize = parts.length;
  }
  let haystack = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `;
  const own = part.name.toLowerCase();
  const found = [];
  for (const [name, candidates] of index) {
    if (name === own) continue;
    const needle = ` ${name.replace(/[^a-z0-9]+/g, ' ')} `;
    const at = haystack.indexOf(needle);
    if (at < 0) continue;
    haystack = haystack.replace(needle, ' ~ ');   // a shorter name inside this one no longer matches
    found.push({ at, part: candidates.find(p => p.side === part.side) || candidates[0] });
    if (found.length >= limit * 2) break;
  }
  return found.sort((a, b) => a.at - b.at).slice(0, limit).map(f => f.part);
}

/** The opening of a description, cut at a sentence boundary: used for tour cards. */
export function summary(text, max = 380) {
  if (!text) return '';
  const clean = text.replace(/==+[^=]+==+/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return end > 80 ? cut.slice(0, end + 1) : `${cut.replace(/\s+\S*$/, '')}…`;
}
