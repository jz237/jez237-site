// Reef best guess: the same shape as the fish guide (Most likely, up to three
// "Could also be" cards, a plain "normal" line, tap-to-swap), kept simpler.
import { URGENCY } from './data.mjs';
import { ALTERNATIVE_TEXT } from './logic.mjs';
import { REEF_KINDS, REEF_SIGNS, REEF_CHANGES, REEF_CONDITIONS, REEF_LOOKALIKES, REEF_LOOK_FOR, REEF_TREATMENT_FAMILY } from './reef-data.mjs';
import { reefPlanFor, INVERT_WARNING } from './reef-care.mjs';

export const MAX_REEF_ALTERNATIVES = 3;
const NATURAL = {
  coral: 'Or it may be normal—corals close at night and for a day or two after a move.',
  pond: 'Or it may be normal—pond fish slow right down and rest on the bottom when the water is cold.',
};

export const reefKindFor = (group, id) => (REEF_KINDS[group] || []).find(k => k.id === id) || null;
export const reefSignFor = (group, id) => (REEF_SIGNS[group] || []).find(s => s.id === id) || null;
export const reefConditionFor = id => REEF_CONDITIONS.find(c => c.id === id) || null;

// Sign tiles for a kind ("Not sure" shows every sign of the group).
export function reefSignsFor(group, kind = '') {
  return (REEF_SIGNS[group] || []).filter(s => !kind || !s.kinds || s.kinds.includes(kind));
}

const inScope = (condition, group, kind) => condition.group === group && (!kind || !condition.kinds || condition.kinds.includes(kind));

// Every condition that fits the sign, best first. Kind and recent changes only
// re-weight conditions that already fit; they never add one.
export function rankReef({ group, kind = '', sign, changes = [] }) {
  const picked = (REEF_CHANGES[group] || []).filter(c => changes.includes(c.id)).map(c => c.id);
  return REEF_CONDITIONS.filter(c => inScope(c, group, kind))
    .map(c => {
      const base = c.weights[sign] || 0;
      if (base <= 0) return null;
      const kindScore = base >= 2 ? c.kindBoost?.[kind] || 0 : 0;
      const changeScore = picked.reduce((sum, id) => sum + (c.changes?.[id] || 0), 0);
      return { ...c, base, score: base + kindScore + changeScore };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.base - a.base || a.id.localeCompare(b.id))
    // A "normal" answer never leads when a picked change points at a real problem
    // (e.g. winter rest + pump stopped): it drops behind the first real answer.
    .sort((a, b) => Number(alarmed(a, picked)) - Number(alarmed(b, picked)));
}
const alarmed = (c, picked) => Boolean(c.natural) && picked.some(id => !c.changes?.[id]);

function decorate(condition, input, extra = {}) {
  const sign = reefSignFor(input.group, input.sign);
  const changes = (REEF_CHANGES[input.group] || []).filter(c => input.changes?.includes(c.id) && condition.changes?.[c.id]).map(c => c.title.toLowerCase());
  return {
    ...condition,
    urgencyLevel: URGENCY[sign?.urgency]?.rank > URGENCY[condition.urgency].rank ? sign.urgency : condition.urgency,
    reason: extra.reason || [`You picked “${sign?.title || input.sign}”${changes.length ? `, plus ${changes.join(', ')}` : ''}.`, condition.checks?.[input.sign] || condition.check].join(' '),
    plan: reefPlanFor(condition.id),
    ...extra,
  };
}

export function reefTreatmentNote(a, b) {
  const fa = REEF_TREATMENT_FAMILY[a], fb = REEF_TREATMENT_FAMILY[b];
  if (!fa || !fb || fa === 'none' || fb === 'none') return '';
  return fa === fb ? 'same' : 'different';
}

// "Why it could be this" on a look-alike (Jez, Nov 6 2026 19:05): which answers it also fits.
function reefAlsoReason(condition, top, input) {
  const sign = reefSignFor(input.group, input.sign);
  const changes = (REEF_CHANGES[input.group] || []).filter(c => input.changes?.includes(c.id) && condition.changes?.[c.id]).map(c => c.title.toLowerCase());
  const like = top.title.replace(/\s*\(.*\)$/, '').toLowerCase();
  const fits = sign && (condition.weights?.[input.sign] || 0) > 0
    ? `“${sign.title}” fits this too${changes.length ? `, and so does ${changes.join(', ')}` : ''}.`
    : `It can look a lot like ${like}${changes.length ? `, and ${changes.join(', ')} fits it too` : ''}.`;
  const what = (condition.summary || '').match(/^[^.!?]*[.!?]/)?.[0] || '';
  return [fits, what].filter(Boolean).join(' ');
}

function couldAlsoBe(top, ranked, input, pinned = null) {
  const out = new Map();
  let natural = '';
  // Kind-specific pairs only show when that kind was picked.
  const curated = (REEF_LOOKALIKES[top.id] || []).filter(([, , kinds]) => !kinds || kinds.includes(input.kind));
  const reasons = new Map(curated.map(([id, reason]) => [id, reason]));
  const add = (condition, reason) => {
    if (!condition || condition.id === top.id || out.has(condition.id) || !inScope(condition, input.group, input.kind)) return;
    if (condition.natural) { if (!alarmed(condition, input.changes || [])) natural ||= NATURAL[input.group] || ''; return; }
    out.set(condition.id, { ...condition, comparisonReason: reason || REEF_LOOK_FOR[condition.id] });
  };
  if (pinned) add(pinned, reasons.get(pinned.id));
  const runnersUp = ranked.filter(c => c.base >= 2);
  // Strong runners-up first, then the curated look-alikes, then weaker runners-up.
  for (const other of runnersUp.filter(c => c.score >= 3)) add(other, reasons.get(other.id));
  // A curated "it may be normal" line also stays away from alarm changes (any change the normal answer doesn't explain).
  const calm = !(input.changes || []).length || (input.group === 'pond' && (input.changes || []).every(id => id === 'cold'));
  for (const [id, reason, , note] of curated) { if (id) add(reefConditionFor(id), reason); else if (calm) natural ||= note; }
  for (const other of runnersUp) add(other, reasons.get(other.id));
  const alternatives = [...out.values()].slice(0, MAX_REEF_ALTERNATIVES).map(c => ({
    ...c, urgencyLevel: c.urgency, whyAlso: reefAlsoReason(c, top, input),
    moreUrgent: URGENCY[c.urgency].rank > URGENCY[top.urgencyLevel].rank,
    treatmentNote: reefTreatmentNote(c.id, top.id),
  }));
  return { alternatives, natural };
}

// input: { group: 'coral' | 'invert' | 'pond', kind, sign, changes: [], chosen: [] }
export function assessReef(input) {
  const ranked = rankReef(input);
  let primary = ranked[0] ? decorate(ranked[0], input) : null;
  let { alternatives, natural } = primary ? couldAlsoBe(primary, ranked, input) : { alternatives: [], natural: '' };
  // Each "This looks more like mine" tap, in order.
  for (const id of input.chosen || []) {
    const pick = alternatives.find(c => c.id === id);
    if (!pick) continue;
    const previous = primary;
    primary = decorate(reefConditionFor(id), input, { chosen: true, reason: `You said this looks more like yours. ${pick.check}` });
    ({ alternatives, natural } = couldAlsoBe(primary, ranked, input, previous));
  }
  return {
    primary, alternatives, naturalNote: natural,
    chosen: Boolean(primary?.chosen),
    title: primary ? `Most likely: ${primary.title}` : 'Not enough to go on yet',
    warning: input.group === 'invert' ? INVERT_WARNING : '',
  };
}

export { ALTERNATIVE_TEXT };
