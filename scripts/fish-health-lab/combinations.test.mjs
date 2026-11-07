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
      const own = (c.weights[s.id] || 0) >= Math.max(...Object.values(c.weights)) || (c.shows || []).includes(s.id);
      if (!own && !c.checks?.[s.id] && !CAUSE_ONLY.has(c.id)) problems.push(`${group}/${kind}/${s.id} → ${c.id}: ${c.check}`);
      if (c.checks?.[s.id] && !c.reason.includes(c.checks[s.id])) problems.push(`${group} ${s.id} → ${c.id}: sign wording missing`);
      const pic = reefResultImageFor(group, c, s.id, kind), signPic = reefImageFor(group, s.id, kind, 'signs');
      if (!own && signPic && pic !== signPic) problems.push(`${group}/${kind}/${s.id} → ${c.id}: picture is not the picked sign's`);
      for (const a of r.alternatives) if (!a.whyAlso) problems.push(`${group} ${s.id}: ${a.id} has no why`);
    }
  assert.ok(runs > 6000, `ran ${runs}`);
  assert.deepEqual(problems.slice(0, 20), []);
});
