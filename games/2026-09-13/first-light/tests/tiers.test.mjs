import test from 'node:test';import assert from 'node:assert/strict';
import {QUALITY_LEVELS} from '../adaptive-quality.js';
import {DOF_TAPS} from '../dof-model.js';
import {RIPPLE_TIERS} from '../ripple-math.js';
test('every per-tier table answers for every tier, so a new tier can never size a target undefined',()=>{
 for(const q of QUALITY_LEVELS){
  assert.ok(Number.isFinite(DOF_TAPS[q]),'depth of field taps for '+q);
  assert.ok(RIPPLE_TIERS[q]&&Number.isFinite(RIPPLE_TIERS[q].res),'ripple resolution for '+q);
 }
 assert.ok(DOF_TAPS.ultra>=DOF_TAPS.high&&RIPPLE_TIERS.ultra.res>=RIPPLE_TIERS.high.res,'ultra is never coarser than high');
});
