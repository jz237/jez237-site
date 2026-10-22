import test from 'node:test';
import assert from 'node:assert/strict';
import {OVERHEAT_FIRE,runningHot,hotClock,overheatFire,overheatWarning} from '../src/damage-handling';
test('only a worn engine with no cooling, run hard, runs hot',()=>{
 assert.ok(runningHot(.7,false,.9));assert.equal(runningHot(.7,true,.9),false);assert.equal(runningHot(.4,false,.9),false);assert.equal(runningHot(.7,false,.3),false);assert.equal(runningHot(NaN,false,1),false);
});
test('held hot it climbs to the fire point; easing off cools it at a slower rate',()=>{
 let t=0;for(let i=0;i<120;i++)t=hotClock(t,true,.1);assert.ok(Math.abs(t-12)<1e-9);
 const cooled=hotClock(t,false,4);assert.ok(Math.abs(cooled-(12-4*OVERHEAT_FIRE.cool))<1e-9);assert.equal(hotClock(1,false,10),0);assert.equal(hotClock(NaN,true,0),0);
});
test('held hot long enough, about half the cars catch fire; the HUD warns first',()=>{
 const n=Array.from({length:40},(_,id)=>id).filter(id=>overheatFire(OVERHEAT_FIRE.after,id)).length;assert.ok(n>=12&&n<=28,`${n}/40`);
 assert.equal(Array.from({length:40},(_,id)=>id).filter(id=>overheatFire(OVERHEAT_FIRE.after-.01,id)).length,0);
 assert.equal(overheatWarning(1),'');assert.equal(overheatWarning(OVERHEAT_FIRE.warn),'ENGINE OVERHEATING');
});
test('the mechanical report names an engine fire right after a seizure',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.match(mechanicalReport({engineFire:true}),/engine fire/);assert.match(mechanicalReport({seized:true,engineFire:true}),/engine seized · engine fire/);
});
