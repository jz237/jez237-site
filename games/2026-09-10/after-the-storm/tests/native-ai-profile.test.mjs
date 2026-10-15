import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeWaterProfile,createNativeWaterState,nativeJetMagnitude,applyNativeWaterForces} from '../native-water.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';

const F=Math.fround;
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);

test('computer coefficient profiles retain the recovered independent rider values',()=>{
 const expected=[
  [30,.6,.95,.5,.1,.72,.027],
  [27.455,.28,.94,.605,.1,.75,.03],
  [29.273,1.2,.95,.4827,.09,.5627,.0431],
  [30,.7,.95,.545,.11,.75,.019]
 ];
 for(let riderIndex=0;riderIndex<4;riderIndex++){
  const p=createNativeWaterProfile({riderIndex,computerProfile:true});
  assert.equal(p.computerProfile,true);assert.ok(Object.isFrozen(p));
  assert.deepEqual([p.steeringDegrees,p.lowSpeedForceRatio,p.highSpeedForceRatio,p.peakForceNative,p.powerBonusNative,
   p.waterLateralRetention,p.rollBalance],expected[riderIndex].map(F));
  assert.equal(p.contactForceNative,F(p.peakForceNative+p.powerBonusNative));
  const human=createNativeWaterProfile({riderIndex});assert.equal(human.computerProfile,false);
  assert.notEqual(p.steeringDegrees,human.steeringDegrees);
 }
});

test('only computer pivot interpolation consumes B70; steering and engine tuning retain their separate branch',()=>{
 const expected=[
  [3.3333334922790527,4.747474670410156,11.11111068725586],
  [8.88888931274414,9.292929649353027,11.111111640930176],
  [11,11.020201683044434,11.11111068725586],
  [3.3333334922790527,4.747474670410156,11.11111068725586]
 ];
 for(let riderIndex=0;riderIndex<4;riderIndex++)for(const [i,tuneB70]of [0,2,11].entries()){
  const p=createNativeWaterProfile({riderIndex,computerProfile:true,tuneB70});
  assert.equal(p.pivotSpeedNative,expected[riderIndex][i]);
  const other=createNativeWaterProfile({riderIndex,computerProfile:true,tuneB70,tuneB6c:11,tuneB74:11});
  for(const key of ['steeringDegrees','peakForceNative','waterLateralRetention','rollBalance','pivotSpeedNative'])assert.equal(other[key],p[key]);
 }
 assert.notEqual(createNativeWaterProfile({tuneB74:0}).peakForceNative,createNativeWaterProfile({tuneB74:11}).peakForceNative);
 for(const computerProfile of [1,'ai',null])assert.throws(()=>createNativeWaterProfile({computerProfile}),/computerProfile/);
 assert.throws(()=>createNativeWaterProfile({computerProfile:true,tuneB70:2.5}),/integers/);
});

test('the fourth computer hull uses its distinct damping without changing geometry, pose or the other three hull families',()=>{
 for(let rider=0;rider<4;rider++){
  const h=createNativeHull({rider}),a=createNativeHull({rider,computerProfile:true});
  assert.equal(h.computerProfile,false);assert.equal(a.computerProfile,true);
  assert.deepEqual(a.points.map(p=>p.position),h.points.map(p=>p.position));assert.deepEqual(a.restLengths,h.restLengths);
  if(rider<3)assert.deepEqual(a.points.map(p=>p.damping),h.points.map(p=>p.damping));
  else{
   near(a.points[0].damping,.6099698239655402);near(a.points[1].damping,.61);assert.notEqual(a.points[0].damping,h.points[0].damping);
   assert.ok(a.points.every(p=>p.damping>=.58&&p.damping<=.611));
  }
 }
 assert.throws(()=>createNativeHull({computerProfile:1}),/computerProfile/);
});

test('original AI power gains above one reach the actual jet without clipping or changing static-contact force',()=>{
 const profile=createNativeWaterProfile({computerProfile:true}),gain=F(1.2);
 near(nativeJetMagnitude(profile,{powerFactor:gain,rearWet:true}),nativeJetMagnitude(profile,{powerFactor:1,rearWet:true})*gain);
 assert.equal(nativeJetMagnitude(profile,{powerFactor:gain,staticContact:true}),profile.contactForceNative);
 const hull=createNativeHull({computerProfile:true}),water=createNativeWaterState(profile);
 stepNativeHull(hull,.01,{beforeIntegrate:h=>applyNativeWaterForces(h,water,{throttle:true,powerFactor:gain,surface:0})});
 assert.equal(water.frameControls.powerFactor,gain);assert.ok(water.lastJet.magnitudeNative>0);
 for(const powerFactor of [-.1,NaN,Infinity,1e40])assert.throws(()=>nativeJetMagnitude(profile,{powerFactor}),/powerFactor/);
});

test('an explicitly computer-profile adapter consumes AI boost while its physics profile stays independent of dispatch',()=>{
 const a=createNativeRaceAdapter({computerProfile:true,controlOrigin:'ai',jointWorld:{x:0,y:1,z:0}});
 stepNativeRaceAdapter(a,.05,{rawXNative:0,rawYNative:0,heldButtons:0x8000,basePowerFactor:1.2});
 assert.equal(a.hull.computerProfile,true);assert.equal(a.water.profile.computerProfile,true);
 assert.equal(a.lastControls.powerFactor,F(1.2));assert.equal(a.hull.ticks,5);assert.ok(a.water.lastJet.magnitudeNative>0);
 stepNativeRaceAdapter(a,.05,{rawXNative:0,rawYNative:0,heldButtons:0x8000},{controlOrigin:'human'});
 assert.equal(a.lastControls.powerFactor,1);assert.equal(a.water.profile.computerProfile,true);assert.equal(a.hull.computerProfile,true);
 const human=createNativeRaceAdapter({controlOrigin:'ai',jointWorld:{x:0,y:1,z:0}});
 assert.equal(human.water.profile.computerProfile,false);assert.equal(human.hull.computerProfile,false);
});
