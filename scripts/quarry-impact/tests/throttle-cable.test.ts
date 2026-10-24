import test from 'node:test';
import assert from 'node:assert/strict';
import {CABLE,cableSnaps,cableThrottle} from '../src/damage-handling';
import {crankRequested} from '../src/engine-stall';
test('only a big hit at the engine end of a battered engine can part the cable, about CABLE.chance of the time',()=>{
 let n=0;for(let seed=0;seed<1000;seed++)if(cableSnaps(.7,20,true,seed))n++;assert.ok(Math.abs(n/1000-CABLE.chance)<.05,`${n}`);
 for(let seed=0;seed<200;seed++){assert.ok(!cableSnaps(CABLE.engine-.01,20,true,seed),'a healthy engine');assert.ok(!cableSnaps(.7,CABLE.blow-.1,true,seed),'a knock');assert.ok(!cableSnaps(.7,20,false,seed),'the other end');}
 assert.ok(!cableSnaps(undefined,20,true,1)&&!cableSnaps(.7,20,true,NaN));
});
test('with the cable parted the engine sees at most CABLE.limp of the pedal either way, and can still be restarted',()=>{
 assert.equal(cableThrottle(1),CABLE.limp);assert.equal(cableThrottle(-1),-CABLE.limp);assert.equal(cableThrottle(.3),.3);assert.equal(cableThrottle(NaN),0);
 assert.ok(crankRequested(100,1,cableThrottle(1)),'the capped pedal still cranks a stalled engine');
 assert.ok(CABLE.limp>=.5&&CABLE.limp<1,'a limp, not a dead car (40% left it barely moving)');
});
test('a parted cable is a failure moment with its own toast, and caps the throttle after every other pedal modifier',async()=>{
 const fs=await import('node:fs'),main=fs.readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=fs.readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes("cable:{label:'THROTTLE CABLE SNAPPED',score:22}")&&main.includes("what==='cable'?'THROTTLE CABLE SNAPPED · LIMPING':"));
 assert.ok(vehicle.includes('if(this.throttleCable)throttle=cableThrottle(throttle);\n    if(steer!==raw.steer||throttle!==raw.throttle)'));
});
