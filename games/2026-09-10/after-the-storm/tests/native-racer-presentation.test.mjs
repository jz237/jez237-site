import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRacerPresentation} from '../native-racer-presentation.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeWaterField,locateNativeWaterCell,queryNativeWaterField} from '../native-water-field.js';

const vec=(x=0,y=0,z=0)=>({x,y,z}),close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const lower=[0,2,3,5,6,7,9,10],flags=indices=>Array.from({length:12},(_,i)=>indices.includes(i));
const snapshot=options=>nativeRaceSnapshot(createNativeRaceAdapter(options));
const display=(q,options={})=>nativeRacerPresentation(q,{wetFlags:flags(lower),renderHeightNative:0,...options});
function deepFreeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(deepFreeze);Object.freeze(v);}return v;}

test('world position and instantaneous horizontal speed stay separate from the source HUD integer',()=>{
 const a=createNativeRaceAdapter({position:vec(4,2,-6),contacts:{primarySpheres:h=>{
  for(const point of h.points)point.velocity=vec(0,0,25);
 }}});
 stepNativeRaceAdapter(a,.05,{});
 const q=nativeRaceSnapshot(a),out=display(q,{wetFlags:a.water.wet});
 close(out.racer.x,4);close(out.racer.y,2);close(out.racer.z,-6+1.24);
 close(out.racer.vx,q.velocity.x);close(out.racer.vy,q.velocity.y);close(out.racer.vz,q.velocity.z);close(out.racer.speed,24.8);
 assert.equal(out.source.hudSpeed,88);close(out.source.frameSpeedNative,49.6);close(out.source.frameAverageVelocityWorld.z,24.8);
 assert.notEqual(out.source.hudSpeed,out.racer.speed*3.6);assert.equal(out.racer.hydro.initialized,true);
});

test('vertical velocity is retained without inflating the horizontal display speed',()=>{
 const out=display(snapshot({velocity:vec(3,12,4)}));
 assert.equal(out.racer.speed,5);assert.equal(out.derived.speed3DWorld,13);assert.equal(out.racer.vy,12);assert.equal(out.racer.hydro.vy,12);
 assert.equal(out.source.hudSpeed,0,'a new adapter has not completed a native HUD frame');
});

test('attitude is reconstructed from the physical Y-X-Z hull frame rather than cached angle fields',()=>{
 const q=snapshot({heading:1.1,pitch:.6,roll:-.4});q.heading=99;q.pitch=99;q.roll=99;
 const out=display(q);
 close(out.racer.heading,1.1);close(out.racer.hydro.pitch,.6);close(out.racer.hydro.roll,-.4);
 assert.equal(out.derived.attitudeSingular,false);assert.equal(out.derived.ratesAvailable,false);
});

test('raw point wet bits and frame-latched native aggregate counts remain distinct at reset',()=>{
 const out=display(snapshot(),{wetFlags:Array(12).fill(false)});
 assert.equal(out.source.wetCount,8);assert.equal(out.source.anyWet,true);
 assert.equal(out.derived.pointWetCount,0);assert.equal(out.derived.pointAnyWet,false);assert.equal(out.derived.allPointsDry,true);
 assert.equal(out.racer.hydro.wet,0);assert.equal(out.racer.hydro.intake,0);
 assert.equal('airborne' in out.racer.hydro,false);assert.equal('landingId' in out.racer.hydro,false);
});

test('display wet fractions respect the native lower-point topology and rear intake OR',()=>{
 const out=display(snapshot(),{wetFlags:flags([0,5,6,11])}),h=out.racer.hydro;
 assert.equal(out.derived.pointWetCount,4);assert.equal(h.wet,3/8);assert.equal(h.bowWet,.5);assert.equal(h.sternWet,.25);
 assert.equal(h.portWet,.5);assert.equal(h.starboardWet,.25);assert.equal(h.intake,1);
 const upper=display(snapshot(),{wetFlags:new Uint8Array(flags([1,4,8,11]).map(Number))});
 assert.equal(upper.derived.pointWetCount,4);assert.equal(upper.derived.allPointsDry,false);assert.equal(upper.racer.hydro.wet,0);assert.equal(upper.racer.hydro.intake,0);
 const lowerOnly=display(snapshot());assert.equal(lowerOnly.racer.hydro.wet,1);assert.equal(lowerOnly.racer.hydro.bowWet,1);assert.equal(lowerOnly.racer.hydro.sternWet,1);
});

test('rendered native water height includes the datum and is scaled exactly once',()=>{
 const field=createNativeWaterField({datumNative:-150}),p=locateNativeWaterCell(20,11);
 p.indices.forEach((index,i)=>field.heightQ[index]=[10,20,40][i]*256);
 const water=queryNativeWaterField(field,20,11),q=snapshot({position:vec(.5,-2,.275)});
 assert.notEqual(water.renderHeightNative,water.sourcePlaneQueryNative,'sloped render interpolation differs from the native normalized plane expression');
 const out=display(q,{renderHeightNative:water.renderHeightNative});
 close(out.racer.hydro.waterHeight,water.renderHeightNative*.025);
 close(out.derived.centerClearanceWorld,-2-water.renderHeightNative*.025);
 assert.equal(out.derived.centerAboveRenderedWater,true);
 const alternate=display(q,{renderHeightNative:water.renderHeightNative,scale:.05});close(alternate.racer.hydro.waterHeight,water.renderHeightNative*.05);
 assert.equal(alternate.racer.y,-2,'world positions are already scaled by the adapter');
});

test('angular derivatives cross the heading seam using actual physical snapshot time',()=>{
 const a=snapshot({heading:Math.PI-.01,pitch:.6,roll:-.4}),first=display(a,{renderHeightNative:0});
 const b=snapshot({heading:-Math.PI+.02,pitch:.61,roll:-.42});b.simulationTime=.01;
 const next=display(b,{renderHeightNative:4,previous:first});
 close(next.racer.yawVelocity,3,1e-9);close(next.racer.hydro.pitchVelocity,1,1e-9);close(next.racer.hydro.rollVelocity,-2,1e-9);close(next.racer.hydro.waterVelocity,10);
 assert.equal(next.derived.ratesAvailable,true);assert.equal(next.derived.rateSource,'physical-snapshot-difference');
 assert.equal(next.source.logicalFrame,0,'Euler rates do not use the still-latched five-tick HUD frame');
 const repeat=display(b,{renderHeightNative:4,previous:next.sample});assert.deepEqual(repeat.sample.rates,next.sample.rates);assert.equal(repeat.derived.rateSource,'held-physical-tick');
});

test('partial 10ms integration and repeated render calls do not invent elapsed physics time',()=>{
 const a=createNativeRaceAdapter(),first=display(nativeRaceSnapshot(a),{wetFlags:a.water.wet});
 stepNativeRaceAdapter(a,.016,{throttle:true,steer:.5});
 const q=nativeRaceSnapshot(a),one=display(q,{wetFlags:a.water.wet,renderHeightNative:2,previous:first});
 close(one.sample.time,.01);close(one.racer.hydro.waterVelocity,5);assert.equal(one.source.hudSpeed,0);assert.equal(one.source.logicalFrame,0);
 assert.deepEqual(display(q,{wetFlags:a.water.wet,renderHeightNative:2,previous:one}).sample.rates,one.sample.rates);
 stepNativeRaceAdapter(a,.004,{throttle:true,steer:.5});
 const two=display(nativeRaceSnapshot(a),{wetFlags:a.water.wet,renderHeightNative:4,previous:one});
 close(two.sample.time,.02);close(two.racer.hydro.waterVelocity,5);
});

test('a vertical attitude is finite and explicitly marks the non-unique presentation yaw',()=>{
 const previous=display(snapshot({heading:.75})),out=display({...snapshot({heading:1.5,pitch:Math.PI/2,roll:.3}),simulationTime:.01},{previous});
 assert.equal(out.derived.attitudeSingular,true);close(out.racer.heading,.75);close(out.racer.hydro.pitch,Math.PI/2);
 assert.ok([out.racer.yawVelocity,out.racer.hydro.pitchVelocity,out.racer.hydro.rollVelocity].every(Number.isFinite));
});

test('semantic actor fields are copied only from explicit caller decisions',()=>{
 const dry=display(snapshot({position:vec(0,5,0)}),{wetFlags:Array(12).fill(false)});
 const semanticKeys=['airborne','airTime','launched','landingId','impact','onRamp','diveRemaining','diveUsed','diveRecovery'];
 for(const key of semanticKeys)assert.equal(key in dry.racer.hydro,false,key);
 assert.equal('wipeout' in dry.racer,false);assert.equal('score' in dry.racer,false);
 const semantics=deepFreeze({airborne:false,airTime:2.2,launched:true,landingId:17,impact:3,onRamp:true,diveRemaining:1,diveUsed:true,diveRecovery:false});
 const explicit=display(snapshot({position:vec(0,5,0)}),{wetFlags:Array(12).fill(false),semantics});
 for(const key of semanticKeys)assert.equal(explicit.racer.hydro[key],semantics[key],key);
 assert.equal(explicit.derived.allPointsDry,true);assert.equal(explicit.racer.hydro.airborne,false,'derived dryness never overrides caller actor state');
 assert.deepEqual(explicit.derived.semanticFields,Object.keys(semantics));
 assert.throws(()=>display(snapshot(),{semantics:{score:50}}),/Unsupported/);
 assert.throws(()=>display(snapshot(),{semantics:{wipeout:null}}),/Unsupported/);
});

test('snapshot, raw wet flags and previous presentation remain unmodified and detached',()=>{
 const a=createNativeRaceAdapter(),q=deepFreeze(nativeRaceSnapshot(a)),bits=deepFreeze(flags(lower)),prior=deepFreeze(display(q,{wetFlags:bits})),before=structuredClone(a);
 const next=display(q,{wetFlags:bits,previous:prior});
 next.racer.hydro.wet=0;next.source.frameDisplacementNative.z=99;next.source.frameAverageVelocityWorld.z=99;next.derived.pointWetFlags[0]=false;next.sample.rates.yawVelocity=99;
 assert.deepEqual(a,before);assert.equal(q.source.frameDisplacementNative.z,0);assert.equal(bits[0],true);assert.equal(prior.sample.rates.yawVelocity,0);
});

test('invalid clocks, fields and actor inputs fail without a nonfinite display patch',()=>{
 const q=snapshot(),badFrame={...q,frame:{...q.frame,right:vec(-1,0,0)}};
 assert.throws(()=>display(q,{wetFlags:[true]}),TypeError);assert.throws(()=>display(q,{wetFlags:Array(12).fill(2)}),TypeError);
 assert.throws(()=>display(q,{renderHeightNative:NaN}),TypeError);assert.throws(()=>display(q,{scale:0}),RangeError);
 assert.throws(()=>display({...q,velocity:vec(Infinity,0,0)}),TypeError);assert.throws(()=>display(badFrame),RangeError);
 assert.throws(()=>display({...q,source:{...q.source,hudSpeed:1.5}}),RangeError);
 assert.throws(()=>display(q,{semantics:{landingId:-1}}),RangeError);assert.throws(()=>display(q,{semantics:{airborne:1}}),TypeError);
 const later=display({...q,simulationTime:1});assert.throws(()=>display(q,{previous:later}),/backwards/);
 assert.throws(()=>display(q,{previous:display(q),scale:.05}),/scale/);
 assert.throws(()=>display(q,{previous:{}}),TypeError);
});
