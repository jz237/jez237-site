import test from 'node:test';
import assert from 'node:assert/strict';
import {nextNativeDryContactFrames,nativeBodyHudPosture,nativeRaceBodyFields} from '../native-race-body-fields.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const impacts=(floor=0,box=0,shore=0,markedBox=false)=>({floorImpactNative:floor,boxImpactNative:box,shoreImpactNative:shore,markedBox});

test('source dry-contact counter distinguishes solid support, marked boxes, wet hulls and free flight',()=>{
 for(const contact of [impacts(1),impacts(0,1),impacts(0,0,1),impacts(1,0,0,true)]){
  assert.equal(nextNativeDryContactFrames(80,{anyWet:false,impacts:contact}),81);
  assert.equal(nextNativeDryContactFrames(80,{anyWet:true,impacts:contact}),0);
 }
 for(const contact of [impacts(),impacts(0,1,0,true)])assert.equal(nextNativeDryContactFrames(80,{anyWet:false,impacts:contact}),0);
 assert.equal(nextNativeDryContactFrames(2147483647,{anyWet:false,impacts:impacts(1)}),-2147483648);
 assert.equal(nativeBodyHudPosture(23,0),2);assert.equal(nativeBodyHudPosture(24,0),1);
 assert.equal(nativeBodyHudPosture(7,0),2);assert.equal(nativeBodyHudPosture(7,1),1);
 for(const actor of [15,16,22])assert.equal(nativeBodyHudPosture(actor,0),0);
});

test('ordinary body samples read the physical hull history, applied jet and actual recovery mode',()=>{
 const s=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}),a=s.nativeHost.world.adapters[0];
 assert.throws(()=>nativeRaceBodyFields(a),/completed/);
 for(let i=0;i<180;i++)stepRace(s,{throttle:1},1/60);
 const b=nativeRaceBodyFields(a),scale=a.hull.scale;
 for(const k of ['x','y','z']){
  assert.equal(b.positionNative[k],Math.fround(a.hull.center[k]/scale));
  assert.equal(b.priorBodyPointNative[k],Math.fround(a.frame.startCenter[k]/scale));
 }
 assert.equal(b.frameSpeedB98,Math.fround(a.water.forceNative));
 assert.notEqual(b.frameSpeedB98,a.lastFrame.frameSpeedNative,'applied force is not frame displacement speed');
 assert.equal(b.field16d0,a.dryContactFrames16d0);
 assert.equal(b.field15c0,nativeBodyHudPosture(a.lastFrame.actorState,a.riderLifecycle.physicalMode));
 const before=structuredClone(a.hull.center);b.positionNative.x=999;assert.deepEqual(a.hull.center,before);
});
