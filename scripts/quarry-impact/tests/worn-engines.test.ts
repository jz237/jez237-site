import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORN_ENGINE,wornEngine} from '../src/age-rust';
import {EngineMisfire,MISFIRE_ONSET} from '../src/engine-misfire';
test('an old engine wears in step with the car’s age, from the misfire’s onset up to its most',()=>{
  assert.equal(wornEngine(0),0);assert.equal(wornEngine(WORN_ENGINE.from-.01),0,'not that old');assert.equal(wornEngine(WORN_ENGINE.from),WORN_ENGINE.onset);
  assert.equal(wornEngine(1),WORN_ENGINE.most);assert.equal(wornEngine(5),WORN_ENGINE.most);assert.equal(wornEngine(NaN),0);
  assert.equal(WORN_ENGINE.onset,MISFIRE_ONSET,'starting where misfires start');assert.ok(WORN_ENGINE.most<.6,'a stumble, not a dying engine');
});
test('under load an old engine stumbles now and then, a sound one never',()=>{
  const run=(damage:number,seconds:number)=>{const m=new EngineMisfire(7);let cuts=0,was=1;for(let i=0;i<seconds*60;i++){const f=m.update(1/60,damage,1);if(f<1&&was>=1)cuts++;was=f;}return cuts;};
  assert.equal(run(wornEngine(0),30),0);const old=run(wornEngine(1),30);assert.ok(old>=5&&old<=30,`now and then: ${old} in 30 s`);
  assert.ok(run(wornEngine(.7),30)<=old,'less when less worn');
});
test('the vehicle feeds the wear in beside real damage, offline only',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('this.misfireFactor=running?this.engineMisfire.update(dt,Math.max(this.engineDamage??0,wornEngine(this.surfaceFinish.rustAge)),this.input.throttle):1;'));
  assert.ok(vehicle.includes('const running=this.extendedDamage&&this.health>0&&!(this.engineStall!>0);'),'running is offline only');
});
