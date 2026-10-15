import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeWaterProfile,createNativeWaterState,applyNativeWaterForces,
  nativeJetMagnitude,nativeWaveCellImpulse} from '../native-water.js';

const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const vecClose=(a,b,e=1e-10)=>{for(const axis of ['x','y','z'])close(a[axis],b[axis],e);};
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const before=(water,options)=>h=>applyNativeWaterForces(h,water,options);

test('numeric rider profiles expose independent native tune endpoints and frame/substep units',()=>{
  const first=createNativeWaterProfile(),tuned=createNativeWaterProfile({tuneB6c:11,tuneB70:11,tuneB74:11});
  assert.equal(first.riderIndex,0);
  close(first.pivotSpeedNative,30/1.8/5);
  close(tuned.pivotSpeedNative,100/1.8/5);
  close(first.steeringDegrees,28);close(tuned.steeringDegrees,22);
  close(first.peakForceNative,.589);close(tuned.peakForceNative,.556);
  close(first.waterLateralRetention,.92);close(tuned.waterLateralRetention,.8109);
  close(createNativeWaterProfile({riderIndex:1}).referenceHeightOffsetNative,-5);
  assert.ok(Object.isFrozen(first));
  assert.throws(()=>createNativeWaterProfile({riderIndex:4}),RangeError);
  assert.throws(()=>createNativeWaterProfile({tuneB70:12}),RangeError);
});

test('jet curve has the analytic rest, pivot, high-speed and rear-wet limits',()=>{
  const p=createNativeWaterProfile();
  close(nativeJetMagnitude(p,{rearWet:true,speedNative:0}),.589*.45+.1);
  close(nativeJetMagnitude(p,{rearWet:true,speedNative:p.pivotSpeedNative}),.589+.1);
  close(nativeJetMagnitude(p,{rearWet:true,speedNative:1000}),.589*.95+.1);
  close(nativeJetMagnitude(p,{rearWet:false,speedNative:0}),(.589*.45+.1)*.75);
  for(let riderIndex=0;riderIndex<4;riderIndex++){
    const profile=createNativeWaterProfile({riderIndex});
    const bound=profile.peakForceNative*Math.max(profile.lowSpeedForceRatio,1,profile.highSpeedForceRatio)+profile.powerBonusNative;
    for(let i=0;i<=200;i++){
      const force=nativeJetMagnitude(profile,{rearWet:true,speedNative:i/10});
      assert.ok(Number.isFinite(force)&&force>=0&&force<=bound+1e-12);
    }
  }
});

test('Glacier dry contact uses full contact force despite tilt, rear dryness or depleted wet power',()=>{
  const profile=createNativeWaterProfile();
  const contact=nativeJetMagnitude(profile,{speedNative:0,forwardY:.9,rearWet:false,powerSteps:0,powerFactor:0,staticContact:true,contactFactor:1});
  close(contact,.689);
  close(nativeJetMagnitude(profile,{staticContact:true,contactFactor:.25}),.689/4);
  assert.equal(nativeJetMagnitude(profile,{powerFactor:0}),0);
  const hull=createNativeHull({position:{x:0,y:3,z:0}}),water=createNativeWaterState(profile);
  applyNativeWaterForces(hull,water,{surface:0,throttle:true,staticContact:true,powerSteps:0});
  close(water.lastJet.magnitudeNative,.689);
  close(hull.points[0].velocity.z,.689*.025/.01);
  close(hull.points[2].velocity.z,.689*.025/.01);
  assert.equal(hull.points[3].velocity.z,0);
});

test('source-signed steering acts at the rear and supplies yaw torque rather than direct pose changes',()=>{
  const hull=createNativeHull({position:{x:0,y:3,z:0}}),water=createNativeWaterState();
  const originalFrame=structuredClone(hull.frame);
  applyNativeWaterForces(hull,water,{surface:0,throttle:true,stickX:1,staticContact:true});
  assert.ok(water.lastJet.angleIndex>0&&water.lastJet.angleRadians<Math.PI/4);
  assert.ok(hull.points[0].velocity.x>0&&hull.points[2].velocity.x>0);
  const torque=[0,2].map(i=>cross({x:hull.points[i].position.x-hull.center.x,
    y:hull.points[i].position.y-hull.center.y,z:hull.points[i].position.z-hull.center.z},water.lastJet.velocity));
  assert.ok(torque[0].y+torque[1].y<0);
  assert.deepEqual(hull.frame,originalFrame,'forces must not directly assign heading or roll');
});

test('flat source buoyancy balances gravity at the independently derived lower-point draft',()=>{
  // Lower points are7native units below center. Gravity.192/.03 needs6.4units
  // immersion, so equilibrium center=(7-6.4)*.025=.015m above reference.
  const hull=createNativeHull({position:{x:0,y:.015,z:0}}),water=createNativeWaterState();
  for(let i=0;i<200;i++)stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0})});
  vecClose(hull.center,{x:0,y:.015,z:0},1e-9);
  vecClose(hull.velocity,{x:0,y:0,z:0},1e-9);
  assert.equal(water.wetCount,8);assert.equal(water.anyWet,true);
});

test('normal gravity accelerates lower8 only, with correctly converted point velocity units',()=>{
  const hull=createNativeHull({position:{x:0,y:3,z:0}}),water=createNativeWaterState();
  applyNativeWaterForces(hull,water,{surface:0});
  for(let i=0;i<12;i++)close(hull.points[i].velocity.y,[1,4,8,11].includes(i)?0:-.192*.025/.01);
  close(hull.velocity.y,-.32);
});

test('mixed-wet drag matches the source grouped example, including the rear XZ exemption',()=>{
  const hull=createNativeHull(),water=createNativeWaterState(),wet=new Set([0,3,8]);
  // Cancel the known lower8 gravity contribution to isolate the drag example.
  for(let i=0;i<12;i++)hull.points[i].velocity={x:3,y:2+([1,4,8,11].includes(i)?0:.48),z:4};
  const surface=(x,z)=>{
    const i=hull.points.findIndex(p=>Math.abs(p.position.x-x)<1e-12&&Math.abs(p.position.z-z)<1e-12);
    return hull.points[i].position.y+(wet.has(i)?0:-1);
  };
  applyNativeWaterForces(hull,water,{surface});
  assert.deepEqual(water.wet.map((w,i)=>w?i:-1).filter(i=>i>=0),[0,3,8]);
  vecClose(hull.points[0].velocity,{x:3,y:1.7,z:4});
  vecClose(hull.points[2].velocity,{x:3,y:1.7,z:4});
  for(const i of [3,5,8])vecClose(hull.points[i].velocity,{x:2.76,y:1.7,z:4});
  for(const i of [1,4,6,7,9,10,11])vecClose(hull.points[i].velocity,{x:3,y:2,z:4});
});

test('wet bits update each step but aggregate counts and input preparation use five-step frames',()=>{
  const hull=createNativeHull({position:{x:0,y:-1,z:0},rider:1}),water=createNativeWaterState(createNativeWaterProfile({riderIndex:1}));
  for(let i=0;i<5;i++){
    stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,stickX:i===0?0:1})});
    assert.equal(water.wet.every(Boolean),true);
    assert.equal(water.lastJet.angleIndex,0,'mid-frame input must wait for the next preparation');
    close(water.lastGravityNative,-.192*1.2);
    assert.equal(water.wetCount,i===4?12:0);
  }
  stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,stickX:1})});
  assert.ok(water.lastJet.angleIndex>0);
  close(water.lastGravityNative,-.192);
  assert.ok(water.frameSpeedNative>0,'frame movement is captured after the previous five integrations');
});

test('vertical drag consumes its previous-step coefficient before preparing the next one',()=>{
  const hull=createNativeHull(),water=createNativeWaterState();
  for(const point of hull.points)point.velocity.y=2;
  const beforeVelocity=hull.points[0].velocity.y;
  applyNativeWaterForces(hull,water,{surface:0,stickY:-1});
  const afterBuoyancy=beforeVelocity-.48+.175*.03/.01;
  close(hull.points[0].velocity.y,afterBuoyancy*.85);
  close(water.verticalDamping,.91);
});

test('modern surface gradients supply explicit normalized pressure while raw wave-cell math stays separate',()=>{
  const hull=createNativeHull(),water=createNativeWaterState();
  applyNativeWaterForces(hull,water,{surface:{height:.45,gradient:{x:.5,z:0}}});
  // At the upper central pointY.35, depth.1 and n=(-1,2,0)/sqrt5.
  vecClose(water.lastBuoyancy[8],{x:-.12,y:.24,z:0});
  const raw=nativeWaveCellImpulse({h00:0,slopeU:0,slopeV:0,offsetU:-20,offsetV:-30,
    pointY:-7,k:.03,maxPairLengthNative:Math.sqrt(5769)});
  assert.equal(raw.wet,true);vecClose(raw.velocity,{x:0,y:.21,z:0});
  const boundary=nativeWaveCellImpulse({h00:0,slopeU:0,slopeV:0,offsetU:0,offsetV:0,
    pointY:0,k:.03,maxPairLengthNative:Math.sqrt(5769)});
  assert.equal(boundary.wet,true);vecClose(boundary.velocity,{x:0,y:0,z:0});
});

test('first flat-water launch has the analytic two-rear-point centroid increment',()=>{
  const hull=createNativeHull({position:{x:0,y:.015,z:0}}),water=createNativeWaterState();
  stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,throttle:true})});
  const initialForce=(.589*.45+.1)*.75; // Initial wet bits are still clear.
  close(water.lastJet.magnitudeNative,initialForce);
  close(hull.center.z,.992*2/12*initialForce*.025);
  close(hull.center.y,.015);
  // Continue as an unconstrained diagnostic launch, not a fitted target speed.
  for(let i=1;i<100;i++)stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,throttle:true})});
  assert.ok(hull.center.z>3&&hull.center.z<20);
  assert.ok(hull.velocity.z>8&&hull.velocity.z<28);
  assert.ok(hull.center.y>-.2&&hull.center.y<.5);
  close(hull.center.x,0,1e-8);
});

test('shared modern wave sampling and five-step force preparation are render-cadence independent',()=>{
  const make=()=>({hull:createNativeHull({position:{x:0,y:.015,z:0}}),water:createNativeWaterState()});
  const a=make(),b=make();
  const options={throttle:true,stickX:.2,stickY:.3,surface:(x,z,t)=>({
    height:.02*Math.sin(z*.5-t),gradient:{x:0,z:.01*Math.cos(z*.5-t)}
  })};
  for(let i=0;i<60;i++)stepNativeHull(a.hull,1/60,{beforeIntegrate:before(a.water,options)});
  for(let i=0;i<120;i++)stepNativeHull(b.hull,1/120,{beforeIntegrate:before(b.water,options)});
  assert.equal(a.hull.ticks,100);assert.equal(b.hull.ticks,100);
  vecClose(a.hull.center,b.hull.center);vecClose(a.hull.velocity,b.hull.velocity);
  assert.deepEqual(a.water.wet,b.water.wet);close(a.water.frameSpeedNative,b.water.frameSpeedNative);
});

test('water states remain independent and reject repeated or cross-hull force application',()=>{
  const profile=createNativeWaterProfile(),a=createNativeHull(),b=createNativeHull({position:{x:0,y:3,z:0}});
  const wa=createNativeWaterState(profile),wb=createNativeWaterState(profile);
  applyNativeWaterForces(a,wa,{surface:0});
  applyNativeWaterForces(b,wb,{surface:0});
  assert.ok(wa.wet.some(Boolean));assert.ok(wb.wet.every(w=>!w));
  assert.throws(()=>applyNativeWaterForces(a,wa,{surface:0}),/consecutive hull tick/);
  assert.throws(()=>applyNativeWaterForces(b,wa,{surface:0}),/one hull/);
  assert.throws(()=>applyNativeWaterForces(b,wb,{stickX:2}),RangeError);
  assert.throws(()=>applyNativeWaterForces(b,createNativeWaterState(createNativeWaterProfile({riderIndex:1}))),/match hull rider/);
});

test('staged rider callbacks run after jet and after gravity, before water sampling and drag',()=>{
  const hull=createNativeHull({position:{x:0,y:-1,z:0}}),water=createNativeWaterState(),calls=[];
  applyNativeWaterForces(hull,water,{throttle:true,surface:()=>{calls.push('water');return 0;},
    afterJet:(h,w)=>{
      calls.push('jet');assert.ok(w.lastJet.magnitudeNative>0);
      close(h.points[0].velocity.y,0);close(h.points[3].velocity.y,0);
      h.points[0].velocity.y+=2;
    },
    afterGravity:(h,w)=>{
      calls.push('gravity');close(w.lastGravityNative,-.192);
      close(h.points[0].velocity.y,1.52);close(h.points[3].velocity.y,-.48);
      h.points[3].velocity.x+=3;h.points[3].velocity.y+=2;
    }});
  assert.deepEqual(calls,['jet','gravity',...Array(12).fill('water')]);
  const pressure=1.175*.03/.01;
  close(hull.points[0].velocity.y,(2-.48+pressure)*.85);
  close(hull.points[3].velocity.y,(2-.48+pressure)*.85);
  close(hull.points[3].velocity.x,3*.92);
});

test('prepared straight jet is latched for five ticks independently of current working steering',()=>{
  const hull=createNativeHull({position:{x:0,y:3,z:0}}),water=createNativeWaterState();
  for(let i=0;i<5;i++){
    stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,throttle:true,stickX:1,jetStraight:i===0})});
    assert.equal(water.lastJet.angleIndex,0);
  }
  stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,throttle:true,stickX:1})});
  assert.ok(water.lastJet.angleIndex>0);
});

test('held dive fixes pressure K before buoyancy and ordinary recovery resumes only on release',()=>{
  const hull=createNativeHull({position:{x:0,y:-1,z:0}}),water=createNativeWaterState();
  for(let i=0;i<5;i++){
    stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,stickY:1,
      suppressDryCorrection:true,buoyancyKOverride:.003})});
    close(water.buoyancyK,.003);
    close(water.verticalDamping,.85+(.745-.85)*(.003-.004)/(.03-.004));
  }
  stepNativeHull(hull,.01,{beforeIntegrate:before(water,{surface:0,stickY:0})});
  close(water.buoyancyK,.004);close(water.verticalDamping,.85);
});

test('current action suppresses only the dry correction, without suppressing gravity or engine',()=>{
  const make=()=>({hull:createNativeHull({pitch:.3,position:{x:0,y:3,z:0},velocity:{x:0,y:0,z:10}}),water:createNativeWaterState()});
  const plain=make(),action=make();
  applyNativeWaterForces(plain.hull,plain.water,{surface:0,throttle:true});
  applyNativeWaterForces(action.hull,action.water,{surface:0,throttle:true,suppressDryCorrection:true});
  const u=plain.hull.frame.up,a=-.0045*(10*.01/.025*u.z),conversion=.025/.01;
  for(let i=0;i<12;i++){
    close(plain.hull.points[i].velocity.y-action.hull.points[i].velocity.y,u.y*a*conversion);
    close(plain.hull.points[i].velocity.z-action.hull.points[i].velocity.z,.1*u.z*a*conversion);
  }
  assert.deepEqual(plain.water.lastJet,action.water.lastJet);
  close(plain.water.lastGravityNative,action.water.lastGravityNative);
});

test('invalid staged options reject before binding or changing velocities',()=>{
  for(const options of [{afterJet:3},{afterGravity:3},{jetStraight:1},{suppressDryCorrection:1},{buoyancyKOverride:-.1}]){
    const hull=createNativeHull(),water=createNativeWaterState(),before=structuredClone(hull);
    assert.throws(()=>applyNativeWaterForces(hull,water,options));
    assert.deepEqual(hull,before);assert.equal(water.boundHull,null);
  }
});
