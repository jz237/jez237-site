import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LIMITER,onLimiter,limiterCut} from '../src/rev-limiter';
test('floored against the limiter, a running engine bounces off its ignition cut; otherwise not',()=>{
  assert.equal(onLimiter(6319,1,true),true,'the revs the coupe sits at flat out in first');
  assert.equal(onLimiter(LIMITER.rpm-1,1,true),false,'short of it');assert.equal(onLimiter(6400,LIMITER.throttle-.05,true),false,'off the floor');
  assert.equal(onLimiter(6400,-1,true),true,'reversing flat out too');assert.equal(onLimiter(6400,1,false),false,'not a stalled engine');assert.equal(onLimiter(NaN,1,true),false);
});
test('the cut comes LIMITER.hz times a second for LIMITER.duty of each beat, each car on its own beat',()=>{
  let cuts=0,changes=0,last=limiterCut(0,3);for(let i=1;i<=6000;i++){const t=i/6000,c=limiterCut(t,3);if(c)cuts++;if(c!==last)changes++;last=c;}
  assert.ok(Math.abs(cuts/6000-LIMITER.duty)<.01,'cut its share of the time');assert.ok(Math.abs(changes/2-LIMITER.hz)<=1,'at its beat');
  const a=Array.from({length:40},(_,i)=>limiterCut(i/240,0)),b=Array.from({length:40},(_,i)=>limiterCut(i/240,1));assert.notDeepEqual(a,b,'cars out of step');
  assert.equal(typeof limiterCut(NaN,NaN),'boolean');
});
test('the engine sound stutters with it, offline: the combustion layers cut and dip in pitch, quick',()=>{
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
  assert.ok(audio.includes('const limiting=!!car.extendedDamage&&car.health>0&&onLimiter(rpm,car.input.throttle,!(car.engineStall!>0)),bounce=limiting&&limiterCut(c.currentTime,car.id),beat=bounce?LIMITER.cut:1,heard=rpm-(bounce?LIMITER.drop:0);'),'offline, running, floored');
  assert.ok(audio.includes('* level * cut * beat *')&&audio.includes("v = Math.abs(car.input.throttle) * 0.07 * cut * beat;"),'the layers cut');
  assert.ok(audio.includes('(heard / centers[name]) * doppler')&&audio.includes("setGain(l,v,c.currentTime,limiting&&(name in ENGINE_CENTERS||name==='load')?LIMITER.response:0.08);"),'dipping, and quick enough to hear');
});
