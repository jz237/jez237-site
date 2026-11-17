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

test('an invalid explicitly labelled SG is not hidden by another normal reading', () => {
  for (const value of ['35 ppt / SG 1.40', '35 ppt (1.2 SG)', 'SG 0.95 / 35 ppt',
    '3.5% (SG 35)', '1.026 SG / SG 1.4', '35 ppt / specific gravity: 1.4',
    '35 ppt / 1,40 specific gravity', 'specific gravity = 0.95 / 3.5%']) {
    assert.deepEqual(readSalinity(value), {unreadable: true}, value);
    const care = assessUrgency({water:'marine', signs:[], salinity:value});
    assert.match(care.checks.join(' '), /re-check your refractometer or hydrometer/, value);
    assert.equal(care.urgent.some(u => /Salinity/.test(u)), false, value);
    assert.doesNotMatch(care.checks.join(' '), /Correct it slowly/, value);
  }
});

test('explicit SG labels retain valid approximations, delimiters and extreme warnings', () => {
  for (const value of ['35 ppt / SG 1.026', '35 ppt (1.026 SG)', 'SG: 1.026 / 35 ppt',
    '35 ppt / specific gravity = 1.026', '35 ppt / 1,026 specific gravity', '3.5% (SG 1.026)']) {
    assert.equal(readSalinity(value).ppt, 35, value);
  }
  for (const value of ['SG 1.000', '1.100 SG']) {
    assert.equal(readSalinity(value).unreadable, undefined, value);
    assert.ok(assessUrgency({water:'marine', signs:[], salinity:value}).urgent.some(u => /Salinity/.test(u)), value);
  }
});
