import test from 'node:test';
import assert from 'node:assert/strict';
import { assessUrgency, assessDiagnosis, buildCase } from '../../experiments/fish-health-lab/logic.mjs';

test('zero pH is a measured extreme, not a missing reading', () => {
  for (const water of ['fresh', 'marine']) for (const ph of [0, '0', '0.0', '0,0', '0.1']) {
    const input = {water, ph, primarySign:'dots', signs:['dots'], ammonia:'0', nitrite:'0'};
    const urgency = assessUrgency(input);
    assert.equal(urgency.level, 'urgent', `${water}: ${ph}`);
    assert.match(urgency.urgent.join(' '), /pH .* is dangerously low/);
    assert.match(urgency.checks.join(' '), /pH .* far outside/);
    assert.equal(assessDiagnosis(input).naturalNote, '');
    assert.match(buildCase(input), /Urgent signs: pH .* is dangerously low/);
  }
});

test('missing and ordinary pH readings keep their existing behavior', () => {
  for (const [water, ph] of [['fresh', '7'], ['marine', '8.2'], ['fresh', ''], ['marine', undefined]]) {
    const result = assessUrgency({water, ph, signs:[], ammonia:'0', nitrite:'0'});
    assert.deepEqual(result.urgent, []);
    assert.equal(result.checks.some(c => /pH/.test(c)), false);
  }
});
