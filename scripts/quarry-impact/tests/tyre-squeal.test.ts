import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BELT_SURGE,RATTLE_BUDGET,ShotBudget,TYRE_SQUEAL,beltSurge,isPaved,skidChirp,squealLevel,squealState,squealVoices} from '../src/tyre-squeal';
test('tyres squeal on paved ground only, and not below the onset',()=>{
  assert.ok(isPaved('asphalt')&&!isPaved('gravel')&&!isPaved(undefined));
  assert.equal(squealLevel(squealState(),20,false,.016),0,'gravel roars, it does not squeal');
  assert.equal(squealLevel(squealState(),TYRE_SQUEAL.onset,true,.016),0);
  assert.ok(Math.abs(squealLevel(squealState(),TYRE_SQUEAL.full,true,.016)-TYRE_SQUEAL.cap)<.01,'a fresh slide at full voice');
});
test('a slide held for a while settles from a squeal to a scrub; let go and it is quiet',()=>{
  const s=squealState();let first=0,last=0;
  for(let i=0;i<600;i++){const v=squealLevel(s,TYRE_SQUEAL.full,true,1/60);if(i===0)first=v;last=v;}
  assert.ok(first>TYRE_SQUEAL.cap*.95&&Math.abs(last-TYRE_SQUEAL.cap*TYRE_SQUEAL.steady)<.01,`${first} → ${last}`);
  assert.equal(squealLevel(s,0,true,1/60),0,'let go');assert.doesNotThrow(()=>squealLevel(s,NaN,true,NaN));
});
test('a car chirps a skid at most every TYRE_SQUEAL.skidGap s',()=>{
  const s=squealState();assert.ok(skidChirp(s,0));assert.ok(!skidChirp(s,TYRE_SQUEAL.skidGap*.5));assert.ok(skidChirp(s,TYRE_SQUEAL.skidGap));
});
test('only the loudest few cars squeal at once',()=>{
  const heard=new Map([[1,.1],[2,.3],[3,.05],[4,.2],[5,0],[6,.25]]),voices=squealVoices(heard);
  assert.equal(voices.size,TYRE_SQUEAL.voices);assert.deepEqual([...voices].sort(),[2,4,6]);assert.equal(squealVoices(new Map([[1,0]])).size,0);
});
test('a slipping belt squeals as the revs climb and settles while they hold',()=>{
  const s={rpm:2000};assert.ok(beltSurge(s,2000+BELT_SURGE.rise,1/60)>.99,'climbing');
  for(let i=0;i<300;i++)beltSurge(s,5000,1/60);assert.ok(Math.abs(beltSurge(s,5000,1/60)-BELT_SURGE.base)<.02,'held');
  assert.equal(beltSurge({rpm:3000},1000,1/60),BELT_SURGE.base,'falling');
});
test('rattles across the field are held to RATTLE_BUDGET.rate a second',()=>{
  const b=new ShotBudget();let played=0;for(let i=0;i<600;i++)if(b.take(i/60))played++;
  assert.ok(played<=RATTLE_BUDGET.rate*10+RATTLE_BUDGET.burst&&played>=RATTLE_BUDGET.rate*10-2,`${played} in 10 s`);
  const burst=new ShotBudget();let quick=0;for(let i=0;i<20;i++)if(burst.take(5))quick++;assert.equal(quick,RATTLE_BUDGET.burst,'a burst at once');
});
test('the audio uses them: squeal level and voices for the tyre loop, chirps on paved ground, the belt surge, the rattle budget',()=>{
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
  assert.ok(audio.includes('const level=squealLevel(this.squealOf(car.id),car.slip,isPaved(car.surface),dt) * (this.raining && car.extendedDamage ? WET_TYRES.squeal : 1);'));
  assert.ok(audio.includes('v=this.squealAllowed.has(car.id)?level:0;')&&audio.includes('this.squealAllowed=squealVoices(this.squealHeard);'));
  assert.ok(audio.includes("&& isPaved(car.surface) && skidChirp(this.squealOf(car.id),c.currentTime))\n          this.shot('skid', car.current, 0.16);"));
  assert.ok(audio.includes('l.gain.gain.setTargetAtTime(.2*car.squeal*beltSurge(b,car.rpm??0,dt),now,.06);'));
  assert.ok(audio.includes("if((id.startsWith('rattle-')||id==='thump')&&!this.rattleBudget.take(this.ctx?.currentTime??0))return;"));
});
