// Every answer combination: no result explains or pictures a sign that wasn't picked
// (Jez, Nov 6 2026 19:21 and 19:51 "check your work again"; Astra 19:50 found the first tests too narrow).
import test from 'node:test';
import assert from 'node:assert/strict';
import { inputs, check } from './combinations.mjs';
import { assessReef, reefSignsFor } from '../../experiments/fish-health-lab/reef-logic.mjs';
import { REEF_GROUPS, REEF_KINDS, REEF_CHANGES } from '../../experiments/fish-health-lab/reef-data.mjs';
import { reefResultImageFor, reefImageFor } from '../../experiments/fish-health-lab/reef-images.mjs';
import { assessDiagnosis } from '../../experiments/fish-health-lab/logic.mjs';

test('fish check: every combination (closer looks, extra signs, up to three behaviors) — wording and picture match the answers', () => {
  let runs = 0; const problems = [];
  for (const input of inputs({ behaviors: 3 })) { runs++; for (const p of check(input)) if (problems.length < 20) problems.push({ input, ...p }); }
  assert.ok(runs > 80000, `ran ${runs}`);
  assert.deepEqual(problems, []);
});

test('fish check: the checker itself catches the mismatches it is meant to catch', async () => {
  const { claimsIn } = await import('./combinations.mjs');
  const one = { signs: ['unclear', 'collapse'], affected: 'one' };
  assert.equal(claimsIn('When several fish go downhill at once with nothing to see on them, bad water is likely.', one).length, 1);
  assert.equal(claimsIn('Fast breathing is most often a water or oxygen problem.', { signs: ['unclear'] }).length, 1);
  assert.equal(claimsIn('Shine a flashlight from the side—watch for fast breathing.', { signs: ['dust'] }).length, 0);
  // Astra's example: one barely responsive fish.
  const d = assessDiagnosis({ water: 'marine', fishType: 'goby', primarySign: 'unclear', visualSigns: ['unclear'], signs: ['unclear', 'collapse'], affected: 'one' });
  assert.doesNotMatch(d.primary.reason, /several/i);
});

// A coral, invert or pond result reached through a sign that isn't its own leads with that
// sign's picture and either has wording for that sign or a check that only names the cause.
const CAUSE_ONLY = new Set(['alk-swing', 'acclimation', 'invert-water', 'pond-water-swing']);
const upTo = (list, n) => { const out = [[]]; const go = (s, cur) => { for (let i = s; i < list.length; i++) { const next = [...cur, list[i]]; out.push(next); if (next.length < n) go(i + 1, next); } }; go(0, []); return out; };
test('coral, invert and pond: every sign × kind × up to three recent changes — wording and picture follow the sign', () => {
  const problems = []; let runs = 0;
  for (const group of REEF_GROUPS.map(g => g.id)) for (const kind of ['', ...(REEF_KINDS[group] || []).map(k => k.id)]) for (const s of reefSignsFor(group, kind))
    for (const changes of upTo((REEF_CHANGES[group] || []).map(c => c.id), 3)) {
      runs++;
      const r = assessReef({ group, kind, sign: s.id, changes, chosen: [] }), c = r.primary;
      if (!c) continue;
      // Wording: the classic sentence is about the condition's strongest sign. Picture: `shows` lists exactly what its own picture shows.
      const strongest = (c.weights[s.id] || 0) >= Math.max(...Object.values(c.weights));
      const own = c.shows ? c.shows.includes(s.id) : strongest;
      if (!strongest && !(c.shows || []).includes(s.id) && !c.checks?.[s.id] && !CAUSE_ONLY.has(c.id)) problems.push(`${group}/${kind}/${s.id} → ${c.id}: ${c.check}`);
      if (c.checks?.[s.id] && !c.reason.includes(c.checks[s.id])) problems.push(`${group} ${s.id} → ${c.id}: sign wording missing`);
      const pic = reefResultImageFor(group, c, s.id, kind), signPic = reefImageFor(group, s.id, kind, 'signs');
      if (!own && signPic && pic !== signPic) problems.push(`${group}/${kind}/${s.id} → ${c.id}: picture is not the picked sign's`);
      for (const a of r.alternatives) if (!a.whyAlso) problems.push(`${group} ${s.id}: ${a.id} has no why`);
    }
  assert.ok(runs > 6000, `ran ${runs}`);
  assert.deepEqual(problems.slice(0, 20), []);
});

// "What to do now" follows the fish and the tank (Jez, Nov 6 20:12: "do one and two").
test('care plans: no salt suggested for corys/plecos, saltwater medicine goes in a hospital tank, no goldfish advice in saltwater', async () => {
  const { carePlanFor } = await import('../../experiments/fish-health-lab/treatments.mjs');
  const { CONDITIONS, FISH_TYPES } = await import('../../experiments/fish-health-lab/data.mjs');
  const problems = [];
  for (const water of ['fresh', 'marine']) for (const fish of ['', ...FISH_TYPES[water].map(f => f.id)]) for (const c of CONDITIONS.filter(c => c.scope === 'both' || c.scope === water)) {
    const p = carePlanFor(c.id, water, fish);
    const text = [...p.steps, p.treatment, p.recovery];
    for (const t of text) {
      if (['cory', 'pleco'].includes(fish) && /\bsalt\b/i.test(t) && !/no salt|skip salt|not corys|epsom/i.test(t)) problems.push(`${fish} ${c.id}: ${t}`);
      if (water === 'marine' && /goldfish|aquarium salt|pond salt|\bpeas?\b/i.test(t)) problems.push(`marine ${c.id}: ${t}`);
      if (fish === 'goldfish' && /8\d\s?°F/.test(t)) problems.push(`goldfish ${c.id}: ${t}`);
    }
    if (p.reefUnsafe && !/hospital|isolate|separate/i.test(p.treatment)) problems.push(`marine ${c.id} summary: ${p.treatment}`);
    if (p.reefUnsafe && /medicat|copper|praziquantel|antibacterial|formalin|chloroquine|metronidazole/i.test(p.steps.join(' ')) && !/hospital/i.test(p.steps.join(' '))) problems.push(`marine ${c.id}: medicine step without a hospital tank`);
  }
  assert.deepEqual(problems, []);
});
