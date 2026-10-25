import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DUST,dustRate} from '../src/dust-trails';
test('a fast car on dry gravel kicks up dust, more the faster; none slow, on asphalt or mud, or in the rain',()=>{
  assert.equal(dustRate(DUST.speed,'gravel',false),0,'too slow');assert.equal(dustRate(DUST.full,'gravel',false),DUST.rate,'full at speed');
  assert.ok(dustRate(14,'gravel',false)>0&&dustRate(14,'gravel',false)<dustRate(20,'gravel',false),'faster, thicker');
  assert.equal(dustRate(40,'gravel',false),DUST.rate,'capped');assert.equal(dustRate(-20,'gravel',false),dustRate(20,'gravel',false),'reversing too');
  for(const s of ['asphalt','mud'])assert.equal(dustRate(20,s,false),0,s);assert.equal(dustRate(20,'gravel',true),0,'wet gravel stays down');assert.equal(dustRate(NaN,'gravel',false),0);
});
test('main raises a pale billowing plume off the rear tyres touching the ground, offline',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("const rate=dustRate(c.speed,c.surface,eventLighting==='rain');if(rate<=0)continue;"),'by speed, surface and weather');
  assert.ok(main.includes('for(const k of [0,1]){const i=2+k,w=c.wheels[i];if(!w||c.wreckParts.wheelLost[i]||!c.controller.wheelIsInContact(i))continue;'),'rear tyres on the ground');
  assert.ok(main.includes('p.size=DUST.puff[0]+Math.random()*(DUST.puff[1]-DUST.puff[0]);p.max=p.life=DUST.life[0]+Math.random()*(DUST.life[1]-DUST.life[0]);dustTint.setHex(DUST.tint)'),'billowing and pale');
  assert.ok(main.includes("  if(state==='playing')for(const c of cars){if(!c.extendedDamage)continue;const rate=dustRate("),'offline play');
  assert.ok(DUST.puff[0]>=1&&DUST.life[0]>=2,'big, slow-settling puffs');
});
