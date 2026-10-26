import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SHIFT_SMOKE,shiftPuffs} from '../src/shift-smoke';
test('changing up with the pedal down coughs a puff of smoke, more from an old or worn engine',()=>{
  assert.equal(shiftPuffs(1,2,1,false,0),SHIFT_SMOKE.puffs);assert.equal(shiftPuffs(3,4,.7,true,0),SHIFT_SMOKE.classic,'an old carburettor car');
  assert.equal(shiftPuffs(2,3,1,false,.8),SHIFT_SMOKE.puffs+SHIFT_SMOKE.worn,'worn');assert.ok(shiftPuffs(2,3,1,true,.8)>shiftPuffs(2,3,1,true,0));
});
test('none changing down, holding a gear, lifting off, from neutral or reverse, or on nonsense',()=>{
  assert.equal(shiftPuffs(3,2,1,true,1),0,'down');assert.equal(shiftPuffs(2,2,1,true,1),0,'held');assert.equal(shiftPuffs(1,2,SHIFT_SMOKE.throttle-.01,true,1),0,'off the pedal');
  assert.equal(shiftPuffs(0,1,1,true,0),0,'out of neutral or reverse');assert.equal(shiftPuffs(NaN,2,1,false,0),0);assert.equal(shiftPuffs(1,2,NaN,false,0),0);assert.equal(shiftPuffs(1,2,1,false,NaN),SHIFT_SMOKE.puffs);
});
test('main puffs it from the tailpipe of offline cars in play, not with the pipe gone or the car out',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage)continue;const before=shiftGears.get(c)??c.gear,revs=shiftRevs.get(c)??c.rpm;shiftGears.set(c,c.gear);shiftRevs.set(c,c.rpm);if(c.health<=0||c.exhaustGone)continue;"),'offline, in play, gear always tracked');
  assert.ok(main.includes('const n=shiftPuffs(before,c.gear,c.input.throttle,isClassicKind(c.kind),c.engineDamage??0);if(!n)continue;'),'by gear, pedal, engine');
  assert.ok(main.includes('p.v.addScaledVector(c.forward,-SHIFT_SMOKE.back);'),'blown out behind');
});
