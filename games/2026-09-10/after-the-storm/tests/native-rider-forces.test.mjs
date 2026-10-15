import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeWaterState,applyNativeWaterForces} from '../native-water.js';
import {createNativeRiderProfile,prepareNativeRiderFrame,decideNativeRiderAction,
  applyNativeTrimForces,applyNativeAuxiliaryYawForces,applyNativeManipulationForces} from '../native-rider-forces.js';

const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const axes=['x','y','z'];
const vecClose=(a,b,e=1e-10)=>axes.forEach(axis=>close(a[axis],b[axis],e));
const minus=(a,b)=>Object.fromEntries(axes.map(axis=>[axis,a[axis]-b[axis]]));
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const sum=values=>Object.fromEntries(axes.map(axis=>[axis,values.reduce((s,p)=>s+p[axis],0)]));
const pointMoment=hull=>sum(hull.points.map(p=>cross(minus(p.position,hull.center),p.velocity)));
const profile=createNativeRiderProfile();
const joint={x:0,y:.85,z:-.68};
const trimBoundary=16.666667938232422,auxiliaryBoundary=11.111111640930176,actionBoundary=33.333335876464844;
const frame=options=>prepareNativeRiderFrame(profile,{jointWorld:joint,horizontalFrameSpeedNative:30,frameSpeedNative:40,...options});
const enter=(options={},p=profile)=>decideNativeRiderAction(p,{frameSpeedNative:40,throttle:true,tick:100,...options});

test('explicit rider indices select independent untuned trim and manipulation coefficients',()=>{
  const expected=[
    [.7,.002,.001,.72,.55,.002], [.7,.002,.001,.75,.55,.0027],
    [.7,.002,.001,.63,.55,.0021], [.8,.0018,.0008,.63,.53,.002]
  ];
  for(let riderIndex=0;riderIndex<4;riderIndex++){
    const p=createNativeRiderProfile({riderIndex});
    assert.deepEqual(['trimGeometry','trimPositive','trimNegative','roll','flip','auxiliaryYaw'].map(k=>p[k]),expected[riderIndex]);
    assert.ok(Object.isFrozen(p));
    close(enter({rawXNative:70,gestureTicks:{negativeX:99}},p).actionMagnitudeNative,p.roll);
    close(enter({rawXNative:-70,gestureTicks:{positiveX:99}},p).actionMagnitudeNative,-p.roll);
    close(enter({rawYNative:-70,gestureTicks:{positiveY:99}},p).actionMagnitudeNative,p.flip);
  }
  assert.throws(()=>createNativeRiderProfile({riderIndex:4}),RangeError);
});

test('trim distinguishes wet positive input, dry asymmetry, steering attenuation and the low-speed floor',()=>{
  close(frame({stickYNative:70,wetCount:8}).trimMagnitudeNative,.07);
  close(frame({stickYNative:-70,wetCount:8}).trimMagnitudeNative,-.07);
  close(frame({stickYNative:70,wetCount:0}).trimMagnitudeNative,.14);
  close(frame({stickYNative:70,stickXNative:70,wetCount:8}).trimMagnitudeNative,.0525);
  close(frame({stickYNative:-70,stickXNative:70,wetCount:8}).trimMagnitudeNative,-.07);
  close(frame({stickYNative:70,wetCount:8,horizontalFrameSpeedNative:0}).trimMagnitudeNative,.049);
  close(frame({stickYNative:70,wetCount:8,horizontalFrameSpeedNative:12.5}).trimMagnitudeNative,.07*12.5/trimBoundary);
  assert.equal(frame({stickYNative:70,wetCount:12}).trimMagnitudeNative,0);
  assert.equal(frame({stickYNative:70,actorState:8}).trimMagnitudeNative,0);
});

test('contact trim is an input-independent strict nose-up override, including a fully wet hull',()=>{
  close(frame({stickYNative:-70,stickXNative:70,forwardY:.9,wetCount:12,
    floorContact:true,horizontalFrameSpeedNative:0,actorState:8}).trimMagnitudeNative,.14);
  close(frame({forwardY:.9,boxContact:true}).trimMagnitudeNative,.14);
  assert.equal(frame({stickYNative:70,forwardY:.8,floorContact:true}).trimMagnitudeNative,0);
  assert.equal(frame({stickYNative:70,forwardY:Math.fround(.8),floorContact:true}).trimMagnitudeNative,0);
  assert.equal(frame({stickYNative:70,forwardY:-.9,floorContact:true}).trimMagnitudeNative,0);
});

test('latched joint is explicit and copied, while zero trim needs no invented physical joint',()=>{
  const original={...joint},prepared=frame({stickYNative:70,jointWorld:original});
  original.y=300;
  assert.equal(prepared.jointWorld.y,joint.y);
  assert.ok(Object.isFrozen(prepared)&&Object.isFrozen(prepared.jointWorld));
  assert.equal(prepareNativeRiderFrame(profile).jointWorld,null);
  assert.throws(()=>prepareNativeRiderFrame(profile,{stickYNative:70}),/previous-frame jointWorld/);
});

test('balanced trim has zero COM impulse and the analytic pitch moment at all lower sections',()=>{
  const hull=createNativeHull(),initialCenter={...hull.center},initialFrame=structuredClone(hull.frame);
  applyNativeTrimForces(hull,profile,frame({stickYNative:70,wetCount:0}));
  vecClose(hull.velocity,{x:0,y:0,z:0});
  vecClose(sum(hull.points.map(p=>p.velocity)),{x:0,y:0,z:0});
  // Sum(native Z * weight)=-480. SI moment gains both the position scale
  // and native-velocity scale:480*.14*.025*(.025/.01)=4.2.
  vecClose(pointMoment(hull),{x:4.2,y:0,z:0});
  close(hull.points[0].velocity.y,1.05);close(hull.points[3].velocity.y,-1.05);
  close(hull.points[6].velocity.y,-.35);close(hull.points[9].velocity.y,.35);
  for(const i of [1,4,8,11])vecClose(hull.points[i].velocity,{x:0,y:0,z:0});
  vecClose(hull.center,initialCenter);assert.deepEqual(hull.frame,initialFrame);
  stepNativeHull(hull,.01);
  vecClose(hull.center,initialCenter);
  assert.ok(hull.frame.forward.y<0,'positive upright trim lowers the bow through point constraints');
});

test('joint direction uses the fourth-power attenuation and ignores its forward component',()=>{
  const make=z=>{
    const h=createNativeHull();
    applyNativeTrimForces(h,profile,frame({stickYNative:70,jointWorld:{x:1,y:1,z}}));
    return h;
  };
  const a=make(-2),b=make(50),gain=(1-.7*Math.sqrt(.75))*.14*2.5;
  close(a.points[9].velocity.x,gain/Math.sqrt(2));
  close(a.points[9].velocity.y,gain/Math.sqrt(2));
  for(let i=0;i<12;i++)vecClose(a.points[i].velocity,b.points[i].velocity);
  const side=createNativeHull();
  applyNativeTrimForces(side,profile,frame({stickYNative:70,jointWorld:{x:1,y:0,z:0}}));
  close(side.points[9].velocity.x,.3*.14*2.5);
});

test('rider forces follow the fitted body frame without assigning a heading or pose',()=>{
  const upright=createNativeHull(),turned=createNativeHull({heading:Math.PI/2});
  const a=frame({stickYNative:70,jointWorld:{x:1,y:1,z:3}});
  const b=frame({stickYNative:70,jointWorld:{x:3,y:1,z:-1}});
  applyNativeTrimForces(upright,profile,a);applyNativeTrimForces(turned,profile,b);
  for(let i=0;i<12;i++)vecClose(turned.points[i].velocity,{
    x:upright.points[i].velocity.z,y:upright.points[i].velocity.y,z:-upright.points[i].velocity.x
  });
  const original=structuredClone(turned.frame);
  applyNativeManipulationForces(turned,{action:1,actionMagnitudeNative:.72,gravityNative:-.192});
  assert.deepEqual(turned.frame,original);
  assert.ok(turned.velocity.z<0,'the side kick follows body right after yaw');
});

test('auxiliary yaw has a separate low-speed actor branch and an unrestricted shore-contact branch',()=>{
  const options={stickXNative:70,frameSpeedNative:0};
  close(frame(options).auxiliaryYawNative,.14);
  close(frame({...options,actorState:7}).auxiliaryYawNative,.14);
  assert.equal(frame({...options,actorState:25}).auxiliaryYawNative,0);
  assert.equal(frame({...options,frameSpeedNative:auxiliaryBoundary}).auxiliaryYawNative,0);
  close(frame({...options,frameSpeedNative:40,actorState:8,shoreContact:true}).auxiliaryYawNative,.14);
  const hull=createNativeHull();
  applyNativeAuxiliaryYawForces(hull,frame(options));
  vecClose(hull.velocity,{x:0,y:0,z:0});
  vecClose(pointMoment(hull),{x:0,y:-1.89,z:0});
  for(const i of [0,1,2])close(hull.points[i].velocity.x,.35);
  for(const i of [3,4,5])close(hull.points[i].velocity.x,-.35);
});

test('action entry requires a recent opposite input, dry wet-count, speed and throttle, with X priority',()=>{
  assert.equal(enter({rawXNative:70,rawYNative:-70,gestureTicks:{negativeX:98,positiveY:99}}).action,1);
  assert.equal(enter({rawXNative:-70,gestureTicks:{positiveX:99}}).action,2);
  assert.equal(enter({rawYNative:-70,gestureTicks:{positiveY:99}}).action,4);
  assert.equal(enter({rawYNative:70,gestureTicks:{negativeY:99},diveWetFrames:25}).diveWetFrames,0);
  assert.equal(enter({rawXNative:70,gestureTicks:{negativeX:97}}).action,0);
  assert.equal(enter({rawXNative:70,wetCount:1,override:4}).action,0);
  assert.equal(enter({rawXNative:70,frameSpeedNative:100/3,override:4}).action,0);
  assert.equal(enter({rawXNative:70,frameSpeedNative:actionBoundary,override:4}).action,0);
  assert.equal(enter({rawXNative:70,frameSpeedNative:actionBoundary+1e-6,override:4}).action,1);
  assert.equal(enter({rawXNative:70,throttle:false,override:4}).action,0);
  assert.equal(enter({rawXNative:70}).action,0,'missing timestamp must not fabricate a gesture');
  const forced=enter({rawXNative:70,override:4});
  assert.equal(forced.action,1);assert.equal(forced.override,0);assert.equal(forced.entered,true);
  assert.equal(forced.muteSteering,false,'new entry does not mute the working axis until continuation');
  assert.equal(enter({rawXNative:70,override:4,floorContact:true}).action,1,'entry has no additional floor-contact gate');
});

test('gesture age uses unsigned frame arithmetic and treats a future stamp as stale',()=>{
  assert.equal(enter({tick:0,rawXNative:70,gestureTicks:{negativeX:0xfffffffe}}).action,1);
  assert.equal(enter({tick:0,rawXNative:70,gestureTicks:{negativeX:0xfffffffd}}).action,0);
  assert.equal(enter({tick:100,rawXNative:70,gestureTicks:{negativeX:101}}).action,0);
});

test('held decisions preserve entry magnitude, mute the right working axis and enforce landing boundaries',()=>{
  const kept=enter({action:1,actionMagnitudeNative:.6,rawXNative:70,throttle:false});
  assert.equal(kept.action,1);assert.equal(kept.actionMagnitudeNative,.6);assert.equal(kept.muteSteering,true);
  assert.equal(enter({action:1,rawXNative:69}).landingPending,true);
  assert.equal(enter({action:2,rawXNative:-70,floorContact:true,noWetNoContactFrames:5}).action,2);
  assert.equal(enter({action:2,rawXNative:-70,boxContact:true,noWetNoContactFrames:6}).action,0);
  assert.equal(enter({action:4,rawYNative:-70}).muteTrim,true);
  assert.equal(enter({action:4,rawYNative:-69}).action,0);
  assert.equal(enter({action:3,rawYNative:70,actorState:8}).landingPending,true);
});

test('dive action counts qualifying wet frames cumulatively, exits after30, and has no direct impulse',()=>{
  let decision=enter({action:3,rawYNative:70,wetCount:8,diveWetFrames:29});
  assert.equal(decision.action,3);assert.equal(decision.diveWetFrames,30);
  assert.equal(decision.buoyancyKOverride,.003);assert.equal(decision.suppressDryCorrection,true);
  decision=enter({...decision,rawYNative:70,wetCount:7});
  assert.equal(decision.action,3);assert.equal(decision.diveWetFrames,30);
  decision=enter({...decision,rawYNative:70,wetCount:8});
  assert.equal(decision.action,0);assert.equal(decision.diveWetFrames,31);assert.equal(decision.landingPending,false);
  assert.equal(enter({action:3,rawYNative:69}).action,0);
  const hull=createNativeHull(),snapshot=JSON.stringify(hull);
  applyNativeManipulationForces(hull,{action:3,gravityNative:-.192});
  assert.equal(JSON.stringify(hull),snapshot);
});

test('frame preparation retains old-action jet override and pre-mute trim/yaw on entry and release',()=>{
  const prepared=frame({previousAction:0,stickYNative:-70,stickXNative:70,frameSpeedNative:0});
  const decision=enter({rawYNative:-70,gestureTicks:{positiveY:99}});
  assert.equal(prepared.jetStraight,false);assert.equal(decision.action,4);
  assert.ok(prepared.trimMagnitudeNative<0&&prepared.auxiliaryYawNative>0);
  const continuing=enter({action:4,actionMagnitudeNative:.55,rawYNative:-70});
  assert.equal(continuing.muteTrim,true);
  assert.equal(prepared.trimMagnitudeNative,-.07,'later muting must not rewrite prepared trim');
  const release=frame({previousAction:4});
  assert.equal(release.jetStraight,true);
  assert.equal(enter({action:4,rawYNative:0}).action,0);
});

test('roll impulses retain the source side kick and asymmetric moment without a net gravity adjustment',()=>{
  for(const sign of [1,-1]){
    const hull=createNativeHull();
    applyNativeManipulationForces(hull,{action:sign===1?1:2,actionMagnitudeNative:sign*.72,gravityNative:-.192});
    vecClose(hull.velocity,{x:sign*.3,y:0,z:0});
    // Native sum(r x deltaV)=[-48G,-48A,56A]; world conversion=.0625.
    vecClose(pointMoment(hull),{x:.576,y:-sign*2.16,z:sign*2.52});
    close(hull.points[0].velocity.y,.24);close(hull.points[1].velocity.y,-.24);
    close(hull.points[3].velocity.y,0);
  }
});

test('flip impulses redistribute lower-only gravity uniformly while supplying a zero-net pitch force',()=>{
  const hull=createNativeHull(),lower=new Set([0,2,3,5,6,7,9,10]);
  for(let i=0;i<12;i++)if(lower.has(i))hull.points[i].velocity.y=-.192*2.5;
  applyNativeManipulationForces(hull,{action:4,actionMagnitudeNative:.55,gravityNative:-.192});
  vecClose(hull.velocity,{x:0,y:-.24,z:0});
  vecClose(pointMoment(hull),{x:-7.425,y:0,z:0});
  for(const i of [0,1,2])close(hull.points[i].velocity.y,-.24-.55*2.5);
  for(const i of [3,4,5])close(hull.points[i].velocity.y,-.24+.55*2.5);
  for(const i of [6,7,8,9,10,11])close(hull.points[i].velocity.y,-.24);
});

test('fixed-tick rider impulses produce the same hull result at60Hz and120Hz render cadence',()=>{
  const make=()=>createNativeHull({velocity:{x:0,y:0,z:8}}),a=make(),b=make();
  const beforeIntegrate=h=>{
    // This diagnostic supplies a fixed articulated joint. It does not claim
    // to be the native rider animation or a recommended live-game controller.
    applyNativeTrimForces(h,profile,frame({stickYNative:12,jointWorld:{x:.1,y:1,z:-.5}}));
    applyNativeAuxiliaryYawForces(h,{auxiliaryYawNative:.01,riderIndex:0});
  };
  for(let i=0;i<60;i++)stepNativeHull(a,1/60,{beforeIntegrate});
  for(let i=0;i<120;i++)stepNativeHull(b,1/120,{beforeIntegrate});
  assert.equal(a.ticks,100);assert.equal(b.ticks,100);
  vecClose(a.center,b.center);vecClose(a.velocity,b.velocity);
  for(let i=0;i<12;i++)vecClose(a.points[i].velocity,b.points[i].velocity);
});

test('inactive helpers preserve the existing ordinary water/hull trajectory',()=>{
  const make=()=>({hull:createNativeHull({position:{x:0,y:.015,z:0}}),water:createNativeWaterState()});
  const a=make(),b=make(),inactive=prepareNativeRiderFrame(profile,{frameSpeedNative:40});
  const options={surface:0,throttle:true,stickX:.1,stickY:0};
  for(let i=0;i<30;i++){
    stepNativeHull(a.hull,.01,{beforeIntegrate:h=>applyNativeWaterForces(h,a.water,options)});
    stepNativeHull(b.hull,.01,{beforeIntegrate:h=>{
      applyNativeWaterForces(h,b.water,options);
      applyNativeTrimForces(h,profile,inactive);
      applyNativeAuxiliaryYawForces(h,inactive);
      applyNativeManipulationForces(h,{action:0});
    }});
  }
  assert.deepEqual(a.hull,b.hull);assert.deepEqual(a.water.wet,b.water.wet);
});

test('invalid inputs and missing or parallel nonzero trim joints reject before changing the hull',()=>{
  const hull=createNativeHull(),snapshot=JSON.stringify(hull);
  assert.throws(()=>prepareNativeRiderFrame(profile,{stickXNative:1.5}),RangeError);
  assert.throws(()=>prepareNativeRiderFrame(profile,{wetCount:13}),RangeError);
  assert.throws(()=>decideNativeRiderAction(profile,{tick:-1}),RangeError);
  assert.throws(()=>decideNativeRiderAction(profile,{gestureTicks:{negativeX:NaN}}),RangeError);
  assert.throws(()=>applyNativeTrimForces(hull,profile,{trimMagnitudeNative:.1}),/jointWorld/);
  assert.throws(()=>applyNativeTrimForces(hull,profile,{trimMagnitudeNative:.1,jointWorld:{x:0,y:0,z:1}}),/perpendicular/);
  assert.throws(()=>applyNativeManipulationForces(hull,{action:5}),RangeError);
  assert.throws(()=>applyNativeAuxiliaryYawForces(hull,{auxiliaryYawNative:NaN}),TypeError);
  assert.throws(()=>applyNativeTrimForces(hull,createNativeRiderProfile({riderIndex:1}),frame()),/match hull rider/);
  assert.equal(JSON.stringify(hull),snapshot);
});
