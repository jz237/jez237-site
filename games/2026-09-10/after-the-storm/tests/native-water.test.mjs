import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeWaterProfile,createNativeWaterState,applyNativeWaterForces,
  nativeJetMagnitude,nativeWaveCellImpulse,createNativeWaterCellSurface} from '../native-water.js';
import {createNativeWaterField,queryNativeWaterField} from '../native-water-field.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';

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
  for(const options of [{afterJet:3},{afterGravity:3},{jetStraight:1},{suppressDryCorrection:1},{buoyancyKOverride:-.1},
    {nativeCellSampler:3},{surface:{cellAtNative:3}}]){
    const hull=createNativeHull(),water=createNativeWaterState(),before=structuredClone(hull);
    assert.throws(()=>applyNativeWaterForces(hull,water,options));
    assert.deepEqual(hull,before);assert.equal(water.boundHull,null);
  }
});

test('explicit raw field flat-water pressure preserves the independently derived equilibrium',()=>{
  const field=createNativeWaterField(),surface=createNativeWaterCellSurface(field);
  const modern={hull:createNativeHull({position:{x:0,y:.015,z:0}}),water:createNativeWaterState()};
  const source={hull:createNativeHull({position:{x:0,y:.015,z:0}}),water:createNativeWaterState()};
  for(let i=0;i<200;i++){
    stepNativeHull(modern.hull,.01,{beforeIntegrate:before(modern.water,{surface:0})});
    stepNativeHull(source.hull,.01,{beforeIntegrate:before(source.water,{surface})});
  }
  vecClose(source.hull.center,{x:0,y:.015,z:0},1e-9);vecClose(source.hull.velocity,{x:0,y:0,z:0},1e-9);
  vecClose(source.hull.center,modern.hull.center,1e-9);vecClose(source.hull.velocity,modern.hull.velocity,1e-9);
  assert.deepEqual(source.water.wet,modern.water.wet);assert.equal(source.water.wetCount,8);
  assert.equal(field.patchUpdates,0);assert.equal(field.forcingCalls,0);
});

test('raw slopes keep source non-unit impulse direction and bypass generic height pressure',()=>{
  const hull=createNativeHull(),water=createNativeWaterState();
  const cell={h00:24,slopeU:-64,slopeV:32,offsetU:-20,offsetV:-30,referenceHeight:5};
  applyNativeWaterForces(hull,water,{surface:()=>({height:1e6,gradient:{x:100,z:100},waveCell:cell})});
  // Denominator6144, a=-1/96,b=1/192,c=2/3. At upper point8,Y14,
  // immersion=15*(2/3)+20/96-30/192=965/96; magnitude=965/3200.
  const magnitude=965/3200,toVelocity=.025/.01;
  vecClose(water.lastBuoyancy[8],{x:magnitude*(-5/384)*toVelocity,
    y:magnitude*(2/3)*toVelocity,z:magnitude*.8660253882408142/192*toVelocity});
  assert.equal(water.wet[8],true);
  assert.ok(Math.hypot(...Object.values(water.lastBuoyancy[8]))<1,'must not normalize and reuse render height');
});

test('native cell method receives each point in native XZ and runs after staged rider forces',()=>{
  const hull=createNativeHull({position:{x:-3,y:0,z:2},scale:.05}),water=createNativeWaterState(),calls=[];
  hull.simulationTime=7.5;
  const surface={cellAtNative(x,z,time){
    const i=calls.filter(c=>c.kind==='cell').length;
    calls.push({kind:'cell',x,z,time});
    close(x,hull.points[i].position.x/.05);close(z,hull.points[i].position.z/.05);close(time,7.5);
    return {h00:0,slopeU:0,slopeV:0,offsetU:0,offsetV:0};
  }};
  applyNativeWaterForces(hull,water,{surface,
    afterJet:()=>calls.push({kind:'jet'}),afterGravity:()=>calls.push({kind:'gravity'})});
  assert.deepEqual(calls.map(c=>c.kind),['jet','gravity',...Array(12).fill('cell')]);
  close(water.lastBuoyancy[0].y,7*.03*.05/.01);
});

test('world nativeCellSampler takes precedence and retains the world-point/time contract',()=>{
  const hull=createNativeHull({position:{x:2,y:0,z:-3}}),water=createNativeWaterState();
  const seen=[];
  applyNativeWaterForces(hull,water,{surface:()=>{throw new Error('unused modern surface was called');},
    nativeCellSampler:(x,z,time)=>{
      const point=hull.points[seen.length].position;close(x,point.x);close(z,point.z);close(time,hull.simulationTime);
      seen.push([x,z,time]);return {h00:0,slopeU:0,slopeV:0,offsetU:0,offsetV:0};
    }});
  assert.equal(seen.length,12);close(water.lastBuoyancy[0].y,7*.03*.025/.01);
});

test('rider and horizontal-frame height adjustment adds to raw datum in native units',()=>{
  const hull=createNativeHull({rider:1}),water=createNativeWaterState(createNativeWaterProfile({riderIndex:1}));
  // Rider1 offset-5 plus speed lift3 gives-2native. Raw datum20 then
  // yields4native immersion at upper pointY14, not6 or1native.
  water.frameDisplacementNative={x:100/3,y:0,z:0};
  const field=createNativeWaterField({datumNative:20});
  applyNativeWaterForces(hull,water,{surface:createNativeWaterCellSurface(field)});
  close(water.referenceOffsetWorld,-2*.025);close(water.lastBuoyancy[8].y,4*.03*.025/.01);
});

test('raw pressure uses current dive K and native pair-length cap before SI conversion',()=>{
  for(const scale of [.025,.05]){
    const hull=createNativeHull({scale}),water=createNativeWaterState();
    applyNativeWaterForces(hull,water,{surface:{waveCell:{h00:1000,slopeU:0,slopeV:0,offsetU:0,offsetV:0}},
      buoyancyKOverride:.003});
    const maximumPairNative=Math.sqrt(12*12+21*21+72*72);
    close(water.lastBuoyancy[8].y,.8*maximumPairNative*.003*scale/.01);
    assert.ok(water.wet.every(Boolean));assert.equal(water.buoyancyK,.003);
  }
});

test('raw-cell wet bits preserve grouped drag and fifth-tick aggregate latching',()=>{
  const hull=createNativeHull(),water=createNativeWaterState(),wet=new Set([0,3,8]);let n=0;
  for(let i=0;i<12;i++)hull.points[i].velocity={x:3,y:2+([1,4,8,11].includes(i)?0:.48),z:4};
  applyNativeWaterForces(hull,water,{nativeCellSampler:()=>{
    const i=n++,pointY=hull.points[i].position.y/.025;
    return {h00:pointY-(wet.has(i)?0:1),slopeU:0,slopeV:0,offsetU:0,offsetV:0};
  }});
  assert.deepEqual(water.wet.map((w,i)=>w?i:-1).filter(i=>i>=0),[0,3,8]);
  vecClose(hull.points[0].velocity,{x:3,y:1.7,z:4});vecClose(hull.points[2].velocity,{x:3,y:1.7,z:4});
  for(const i of [3,5,8])vecClose(hull.points[i].velocity,{x:2.76,y:1.7,z:4});
  assert.equal(water.wetCount,0);assert.equal(water.anyWet,false);
  const allHull=createNativeHull({position:{x:0,y:-1,z:0}}),allWater=createNativeWaterState();
  const allSurface=createNativeWaterCellSurface(createNativeWaterField());
  for(let i=0;i<5;i++){
    stepNativeHull(allHull,.01,{beforeIntegrate:before(allWater,{surface:allSurface})});
    assert.ok(allWater.wet.every(Boolean));assert.equal(allWater.wetCount,i===4?12:0);
    assert.equal(allWater.anyWet,i===4);
  }
});

test('field cell surface reads live datum without using renderer signed-height wrap',()=>{
  const field=createNativeWaterField({datumNative:4});field.heightQ.fill(-1);
  const live=createNativeWaterCellSurface(field),fixed=createNativeWaterCellSurface(field,{datumNative:9});
  assert.deepEqual(live.cellAtNative(0,0),{h00:-1,slopeU:0,slopeV:0,offsetU:0,offsetV:0,referenceHeight:4});
  field.datumNative=-32768;
  assert.equal(live.cellAtNative(0,0).referenceHeight,-32768);assert.equal(fixed.cellAtNative(0,0).referenceHeight,9);
  // Rendered vertices wrap to+32767 here, but raw physical datum+height is
  // -32769. Treating the rendered height as physical would wrongly wet all12.
  assert.equal(queryNativeWaterField(field,0,0).renderHeightNative,32767);
  const hull=createNativeHull(),water=createNativeWaterState();applyNativeWaterForces(hull,water,{surface:live});
  assert.ok(water.wet.every(x=>!x));assert.ok(water.lastBuoyancy.every(v=>v.x===0&&v.y===0&&v.z===0));
  assert.equal(field.patchUpdates,0);assert.equal(field.forcingCalls,0);
});

test('existing race adapter accepts raw native field surface without new adapter options',()=>{
  const source=createNativeRaceAdapter({surface:createNativeWaterCellSurface(createNativeWaterField())});
  const modern=createNativeRaceAdapter({surface:0});
  for(let i=0;i<20;i++){
    stepNativeRaceAdapter(source,.05,{throttle:true});stepNativeRaceAdapter(modern,.05,{throttle:true});
  }
  vecClose(source.hull.center,modern.hull.center,1e-9);vecClose(source.hull.velocity,modern.hull.velocity,1e-9);
  assert.deepEqual(source.water.wet,modern.water.wet);assert.equal(source.lastFrame.hudSpeed,modern.lastFrame.hudSpeed);
});

test('nonflat raw-field force sampling is independent of render cadence',()=>{
  const field=createNativeWaterField();for(let i=0;i<field.heightQ.length;i++)field.heightQ[i]=(i*317)%1024-512;
  const make=()=>({hull:createNativeHull({position:{x:0,y:.015,z:0}}),water:createNativeWaterState()});
  const a=make(),b=make(),options={surface:createNativeWaterCellSurface(field),throttle:true,stickX:.2,stickY:.3};
  for(let i=0;i<60;i++)stepNativeHull(a.hull,1/60,{beforeIntegrate:before(a.water,options)});
  for(let i=0;i<120;i++)stepNativeHull(b.hull,1/120,{beforeIntegrate:before(b.water,options)});
  vecClose(a.hull.center,b.hull.center);vecClose(a.hull.velocity,b.hull.velocity);
  assert.deepEqual(a.water.wet,b.water.wet);assert.equal(a.hull.ticks,100);assert.equal(b.hull.ticks,100);
  assert.equal(field.patchUpdates,0);assert.equal(field.forcingCalls,0);
});

test('invalid explicit cell results fail instead of silently falling back to modern pressure',()=>{
  for(const result of [null,undefined,3,{},
    {h00:0,slopeU:NaN,slopeV:0,offsetU:0,offsetV:0},
    {h00:0,slopeU:0,slopeV:0,offsetU:0,offsetV:0,referenceHeight:null}]){
    for(const surface of [{cellAtNative:()=>result},()=>({waveCell:result})]){
      assert.throws(()=>applyNativeWaterForces(createNativeHull(),createNativeWaterState(),{surface}),TypeError);
    }
    assert.throws(()=>applyNativeWaterForces(createNativeHull(),createNativeWaterState(),{nativeCellSampler:()=>result}),TypeError);
  }
  assert.throws(()=>createNativeWaterCellSurface({}),TypeError);
  assert.throws(()=>createNativeWaterCellSurface(createNativeWaterField(),{datumNative:32768}),RangeError);
});
