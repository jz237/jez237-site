import test from 'node:test';
import assert from 'node:assert/strict';
import {readSalinity, assessUrgency} from '../../experiments/fish-health-lab/logic.mjs';

test('conflicting explicit salinity readings ask for a recheck, never choose a normal number', () => {
  for (const value of ['35 ppt / 20 ppt', '20 ppt / 35 ppt', '35 ppt / 0%', '0% / 35 ppt',
    '1.010 (3.5%)', '3.5% (SG 1.010)', '35 ppt (7%)', '7% (35 ppt)',
    '35 ppt / 90 ppt', '1.026 / 1.010', '1.026 (35 ppt, 0%)']) {
    assert.deepEqual(readSalinity(value), {unreadable: true}, value);
    const care = assessUrgency({water: 'marine', signs: [], salinity: value});
    assert.match(care.checks.join(' '), /re-check your refractometer or hydrometer/, value);
    assert.equal(care.urgent.some(u => /Salinity/.test(u)), false, 'do not advise correction from conflicting readings');
  }
});

test('consistent units and harmless rounding still agree', () => {
  for (const value of ['35 ppt / 35 PSU', '3.5% (35 ppt)', '1.026 (3.5%)', '35 ppt / 1.026',
    '35 ppt (3.5%, SG 1.026)', '35,0 ppt / 3,5%', '34.8 ppt / 35 ppt']) {
    assert.ok(Math.abs(readSalinity(value).ppt - 35) < 1, value);
  }
});
