import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DERBY_WEAR,IMPACT_SPEED,derbyWear} from '../src/damage-rules';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
test('offline derbies wear cars more slowly, and no one crash can take more than DERBY_WEAR.cap',()=>{
  assert.ok(DERBY_WEAR.damage>0&&DERBY_WEAR.damage<1&&DERBY_WEAR.cap<IMPACT_SPEED.cap&&DERBY_WEAR.cap>=25,'a big hit still smashes');
  assert.deepEqual(derbyWear(true),DERBY_WEAR);assert.deepEqual(derbyWear(false),{damage:1,cap:IMPACT_SPEED.cap},'everything else keeps its balance');
});
test('main applies it to crashes and pinning in offline derbies only, weight share included',()=>{
  assert.ok(main.includes("  const wear=derbyWear(mode==='derby'&&!online?.active);\n")&&main.includes("collisionDamageMultiplier(mode==='race'&&!bangerRace(),damageRule())*wear.damage,online?.active?undefined:impactSpeedFactor,wear.cap)"));
  assert.ok(main.includes('Math.min(wear.cap,sharedDamage(damage,shareA))')&&main.includes('Math.min(wear.cap,sharedDamage(damage,shareB))'));
  assert.ok(main.includes("*derbyWear(mode==='derby'&&!online?.active).damage;"),'pinning crushes in at the same rate');
});
