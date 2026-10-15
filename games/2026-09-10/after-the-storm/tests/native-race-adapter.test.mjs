import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot,applyNativeRaceContact} from '../native-race-adapter.js';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
import {createNativeArticulatedRider} from '../native-articulated-rider.js';

const vec=(x=0,y=0,z=0)=>({x,y,z});
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const vectorClose=(a,b,e=1e-10)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
function run(seconds,input,options={}){
  const a=createNativeRaceAdapter(options);
  for(let i=0;i<Math.round(seconds*100);i++)stepNativeRaceAdapter(a,.01,input);
  return a;
}

test('ordinary throttle advances a complete hull/water craft and exposes source frame/HUD outputs',()=>{
  const coasting=run(2,{throttle:false}),driving=run(2,{throttle:true}),q=nativeRaceSnapshot(driving);
  assert.ok(driving.hull.center.z>30);assert.ok(driving.hull.velocity.z>20);
  assert.ok(Math.abs(coasting.hull.center.z)<1e-6);
  assert.equal(q.source.logicalFrame,40);assert.equal(q.source.clockUnits,2000);
  assert.equal(driving.hull.ticks,200);assert.equal(q.simulationTime,2);
  assert.equal(q.source.wetCount,8);assert.equal(q.source.anyWet,true);
  assert.ok(q.source.hudSpeed>70&&q.source.hudSpeed<130);
  const delta=q.source.frameDisplacementNative;
  close(q.source.frameSpeedNative,Math.hypot(delta.x,delta.y,delta.z));
  assert.ok(Math.abs(q.heading)<1e-9&&Math.abs(q.roll)<1e-9);
  assert.equal(driving.water.profile.riderIndex,0);
});

test('browser steering sign is explicit and mirrored turns produce mirrored craft motion',()=>{
  const right=run(.8,{throttle:true,steer:.5}),left=run(.8,{throttle:true,steer:-.5});
  const a=nativeRaceSnapshot(right),b=nativeRaceSnapshot(left);
  assert.equal(right.lastControls.rawXNative,-35);assert.equal(right.lastControls.workingXNative,-18);
  assert.ok(a.heading>0);assert.ok(b.heading<0);
  close(a.heading,-b.heading,1e-9);close(a.position.x,-b.position.x,1e-9);close(a.position.z,b.position.z,1e-9);
});

test('HUD uses five center displacements and truncates before the display conversion',()=>{
  const a=createNativeRaceAdapter({contacts:{primarySpheres:h=>{
    // Controlled uniform point motion isolates the documented source HUD
    // conversion from the force model:25m/s =10native displacement/tick.
    for(const point of h.points)point.velocity={x:0,y:0,z:25};
  }}});
  stepNativeRaceAdapter(a,.05,{});
  close(a.hull.center.z,5*.992*25*.01);
  close(a.lastFrame.frameDisplacementNative.z,49.6);
  close(a.lastFrame.frameSpeedNative,49.6);
  assert.equal(a.lastFrame.hudSpeed,88);
  assert.equal(Math.trunc(49.6*1.8),89); //One combined conversion is different.
});

test('roll reference follows the hull frame and needs no articulated joint',()=>{
  const a=createNativeRaceAdapter(),before=nativeRaceSnapshot(a),s=a.hull.scale;
  const reference=q=>({x:q.position.x+s*(.1806645*q.frame.up.x-26.9998535*q.frame.forward.x),
    y:q.position.y+s*(.1806645*q.frame.up.y-26.9998535*q.frame.forward.y),
    z:q.position.z+s*(.1806645*q.frame.up.z-26.9998535*q.frame.forward.z)});
  const first=reference(before);stepNativeRaceAdapter(a,.05,{throttle:true,steer:.5});
  const last=reference(nativeRaceSnapshot(a)),delta=a.lastFrame.referenceDisplacementNative;
  vectorClose(delta,{x:(last.x-first.x)/s,y:(last.y-first.y)/s,z:(last.z-first.z)/s});
  assert.equal(a.frame.prepared.jointWorld,null);
});

test('native axis roundtrip through normalized water controls never loses an integer step',()=>{
  for(let rawXNative=-70;rawXNative<=70;rawXNative++){
    const a=createNativeRaceAdapter();stepNativeRaceAdapter(a,.01,{rawXNative,rawYNative:35,heldButtons:0x8000},{jointWorld:vec(0,.85,-.68)});
    const working=a.lastControls.workingXNative;
    const expected=Math.trunc(working*28*1.3/70*4096/360);
    assert.equal(a.water.lastJet.angleIndex,expected,`raw${rawXNative}, working${working}`);
  }
});

test('inputs and explicit physical joint are sampled once per five-tick frame',()=>{
  const inputTimes=[],jointTimes=[],a=createNativeRaceAdapter({jointWorld:(h,c)=>{jointTimes.push(c.time);return vec(h.center.x,h.center.y+.85,h.center.z-.68);}});
  stepNativeRaceAdapter(a,.12,(time)=>{inputTimes.push(time);return {throttle:true,trim:.2};});
  assert.deepEqual(inputTimes,[0,.05,.1]);assert.deepEqual(jointTimes,inputTimes);
  assert.equal(a.logicalFrames,2);assert.equal(a.hull.ticks,12);
  assert.equal(a.lastControls.workingYNative,3);
});

test('missing required trim joint fails explicitly and a supplied joint changes pitch',()=>{
  const a=createNativeRaceAdapter(),before=nativeRaceSnapshot(a);
  assert.throws(()=>stepNativeRaceAdapter(a,.05,{throttle:true,trim:1}),/jointWorld/);
  assert.equal(a.hull.ticks,0);assert.equal(a.remainder,0);assert.equal(a.lastControls,null);
  assert.deepEqual(nativeRaceSnapshot(a),before);
  const jointWorld=(h)=>vec(h.center.x,h.center.y+.85,h.center.z-.68);
  const neutral=run(.3,{throttle:true},{jointWorld}),trimmed=run(.3,{throttle:true,trim:1},{jointWorld});
  assert.ok(nativeRaceSnapshot(trimmed).pitch>nativeRaceSnapshot(neutral).pitch+.05);
});

test('trim participates in the same water damping before contacts',()=>{
  const capture=trim=>{
    let velocity;
    const a=createNativeRaceAdapter({position:vec(0,-1,0),jointWorld:vec(0,0,-.68),
      contacts:{floor:h=>{velocity={...h.points[0].velocity};}}});
    stepNativeRaceAdapter(a,.01,{throttle:true,trim});return velocity;
  };
  const plain=capture(0),trimmed=capture(1);
  // Positive trim:.002*70*wetHalf*.7 low-speed floor, weight3, SI2.5,
  // then the initial .85 vertical water retention, before hull integration.
  close(trimmed.y-plain.y,.002*70*.5*.7*3*2.5*.85,1e-10);
});

test('water precedes ordered geometry hooks on every fixed tick',()=>{
  const calls=[],contacts={};
  for(const phase of ['shore','floor','boxes','dynamicPlanes','fixedSpheres','primarySpheres']){
    contacts[phase]=(h,c)=>{
      assert.equal(c.water.lastBuoyancy.length,12);
      assert.equal(c.water.lastHullTick,h.ticks);
      calls.push(`${h.ticks}:${phase}`);
    };
  }
  const a=createNativeRaceAdapter({contacts});stepNativeRaceAdapter(a,.02,{throttle:true});
  assert.deepEqual(calls,[0,1].flatMap(i=>['shore','floor','boxes','dynamicPlanes','fixedSpheres','primarySpheres'].map(p=>`${i}:${p}`)));
});

test('floor engine override uses current-window contact and resets before the first tick of each frame',()=>{
  const engines=[];
  const a=createNativeRaceAdapter({contactFactor:.5,contacts:{floor:(h,c)=>{
    engines.push(c.water.lastJet.magnitudeNative);return {floorImpactNative:.2};
  }}});
  stepNativeRaceAdapter(a,.07,{throttle:true});
  const target=(.589+.1)*.5;
  for(const i of [1,2,3,4,6])close(engines[i],target);
  assert.ok(Math.abs(engines[0]-target)>.02);
  assert.ok(Math.abs(engines[5]-target)>.02);
  assert.equal(a.lastFrame.contacts.floorImpactNative,.2);
  assert.equal(a.contactWindow.floorImpactNative,.2);
});

test('point contact changes immediate COM velocity by one-twelfth and common push is not velocity',()=>{
  const plain=createNativeHull({velocity:vec(0,-2,0)}),hit=createNativeHull({velocity:vec(0,-2,0)});
  const report=applyNativeRaceContact(hit,{kind:'floor',pointIndex:0,normal:vec(0,1,0),penetration:.1});
  close(hit.velocity.y-plain.velocity.y,2/12);
  close(report.floorImpactNative,.8);
  stepNativeHull(plain,.01);stepNativeHull(hit,.01);
  close(hit.center.y-plain.center.y,.1+.992*.01*2/12,1e-10);
  assert.ok(Math.abs(hit.velocity.y-plain.velocity.y)<1); //No spurious .1/.01=10m/s launch.
});

test('boxes project outgoing normal velocity while floor/shore do not',()=>{
  const plane=createNativeHull({velocity:vec(0,2,0)}),box=createNativeHull({velocity:vec(0,2,0)});
  assert.equal(applyNativeRaceContact(plane,{kind:'floor',pointIndex:0,normal:vec(0,1,0),penetration:.1}),null);
  assert.equal(plane.points[0].velocity.y,2);
  assert.deepEqual(applyNativeRaceContact(box,{kind:'box',pointIndex:0,normal:vec(0,1,0),penetration:.1}),
    {boxImpactNative:0,markedBox:false});
  assert.equal(box.points[0].velocity.y,0);close(box.points[5].position.y-plane.points[5].position.y,.1);
});

test('box side exclusions and marked impact affect reports without weakening response',()=>{
  for(const pointIndex of [1,8,11]){
    assert.equal(applyNativeRaceContact(createNativeHull({velocity:vec(-2,0,0)}),
      {kind:'box',pointIndex,normal:vec(1,0,0),penetration:.1}),null);
  }
  const a=createNativeHull({velocity:vec(-2,0,0)}),b=createNativeHull({velocity:vec(-2,0,0)});
  const report=applyNativeRaceContact(a,{kind:'box',pointIndex:4,normal:vec(1,0,0),penetration:.1,flag:true});
  const plain=applyNativeRaceContact(b,{kind:'box',pointIndex:4,normal:vec(1,0,0),penetration:.1});
  close(report.boxImpactNative,plain.boxImpactNative*.4);assert.equal(report.markedBox,true);
  assert.deepEqual(a.points,b.points);
});

test('native finite-depth limits differ for shore and floor endpoints',()=>{
  for(const penetration of [0,.4,.401]){
    const shore=applyNativeRaceContact(createNativeHull({velocity:vec(-2,0,0)}),
      {kind:'shore',pointIndex:0,normal:vec(1,0,0),penetration});
    assert.equal(shore,null);
  }
  assert.ok(applyNativeRaceContact(createNativeHull({velocity:vec(0,-2,0)}),
    {kind:'floor',pointIndex:0,normal:vec(0,1,0),penetration:.4}));
});

test('render cadence retains all fixed ticks and yields the same time-indexed control trajectory',()=>{
  const input=t=>({throttle:true,steer:t<.4?0:t<.8?.4:-.2});
  const reference=run(1.2,input);
  for(const pieces of [24,36,72,144]){
    const a=createNativeRaceAdapter();
    for(let i=0;i<pieces;i++)stepNativeRaceAdapter(a,1.2/pieces,input);
    assert.equal(a.hull.ticks,120);assert.equal(a.logicalFrames,24);
    vectorClose(a.hull.center,reference.hull.center);vectorClose(a.hull.velocity,reference.hull.velocity);
    assert.deepEqual(a.lastFrame,reference.lastFrame);
  }
});

test('fractional dt and zero dt do not resample input or advance source frames',()=>{
  let calls=0;const a=createNativeRaceAdapter(),input=()=>{calls++;return {throttle:true};};
  stepNativeRaceAdapter(a,.006,input);assert.equal(calls,0);
  stepNativeRaceAdapter(a,0,input);assert.equal(calls,0);assert.equal(a.hull.ticks,0);
  stepNativeRaceAdapter(a,.004,input);assert.equal(calls,1);assert.equal(a.hull.ticks,1);
  stepNativeRaceAdapter(a,.04,input);assert.equal(calls,1);assert.equal(a.logicalFrames,1);
});

test('snapshot copies protect mutable force and contact state, with explicit rider assignment',()=>{
  const a=createNativeRaceAdapter({riderIndex:2,tuneB70:11});stepNativeRaceAdapter(a,.05,{throttle:true});
  assert.equal(a.hull.rider,2);assert.equal(a.water.profile.riderIndex,2);assert.equal(a.rider.riderIndex,2);
  const b=nativeRaceSnapshot(a);b.position.x=999;b.frame.up.y=999;b.source.contacts.floorImpactNative=99;
  assert.notEqual(a.hull.center.x,999);assert.notEqual(a.hull.frame.up.y,999);assert.equal(a.lastFrame.contacts.floorImpactNative,0);
});

test('invalid normalized controls and contact reports cannot silently propagate',()=>{
  const a=createNativeRaceAdapter();
  assert.throws(()=>stepNativeRaceAdapter(a,-1),RangeError);
  assert.throws(()=>stepNativeRaceAdapter(a,.01,{steer:2}),RangeError);
  assert.throws(()=>stepNativeRaceAdapter(a,.01,{rawXNative:20,steer:.5}),/either/);
  assert.equal(a.hull.ticks,0);assert.equal(a.remainder,0);
  assert.throws(()=>applyNativeRaceContact(a.hull,{kind:'floor',pointIndex:0,normal:vec(0,2,0)}),/unit length/);
  assert.throws(()=>createNativeRaceAdapter({contacts:{floor:4}}),/function/);
});

test('held source roll mutes working steering after preparation and applies point forces before contacts',()=>{
  let captured;
  const a=createNativeRaceAdapter({position:vec(0,3,0),
    sourceState:{actionState:{action:1,actionMagnitudeNative:.72,arcActive:true}},
    contacts:{shore:(h,c)=>{captured={points:structuredClone(h.points),action:c.action};}}});
  stepNativeRaceAdapter(a,.01,{rawXNative:70,heldButtons:0x8000});
  assert.equal(a.actionState.action,1);assert.equal(a.frame.prepared.jetStraight,true);
  assert.equal(a.lastControls.conditionedXNative,70);assert.equal(a.lastControls.workingXNative,0);
  close(a.frame.prepared.auxiliaryYawNative,.14);assert.equal(a.water.lastJet.angleIndex,0);
  // Prepared yaw remains active despite subsequent working-X muting. Roll acts
  // on individual rear/lower points, before the contact hook observes them.
  close(captured.points[0].velocity.x,(.14+.72)*2.5);
  close(captured.points[1].velocity.x,(.14-.72)*2.5);
  close(captured.points[3].velocity.x,-.14*2.5);
  close(captured.points[0].velocity.y,-.24);close(captured.points[1].velocity.y,-.24);
  assert.equal(captured.action.suppressDryCorrection,true);
});

test('gesture entry uses the old jet decision, held roll mutes later, and release keeps one straight-jet frame',()=>{
  const a=createNativeRaceAdapter({position:vec(0,10,0),velocity:vec(0,0,25)});
  stepNativeRaceAdapter(a,.05,{rawXNative:-70,heldButtons:0x8000});
  assert.equal(a.water.wetCount,0);assert.ok(a.lastFrame.frameSpeedNative>34);
  stepNativeRaceAdapter(a,.01,{rawXNative:70,heldButtons:0x8000});
  assert.equal(a.frame.action.entered,true);assert.equal(a.actionState.action,1);
  assert.equal(a.frame.prepared.jetStraight,false);assert.equal(a.lastControls.workingXNative,70);
  assert.ok(a.water.lastJet.angleIndex>0);
  stepNativeRaceAdapter(a,.05,{rawXNative:70,heldButtons:0x8000});
  assert.equal(a.frame.action.entered,false);assert.equal(a.lastControls.workingXNative,0);
  assert.equal(a.water.lastJet.angleIndex,0);
  stepNativeRaceAdapter(a,.04,{rawXNative:70,heldButtons:0x8000});
  stepNativeRaceAdapter(a,.01,{rawXNative:0,heldButtons:0x8000});
  assert.equal(a.actionState.action,0);assert.equal(a.frame.action.ended,true);
  assert.equal(a.frame.prepared.jetStraight,true);assert.equal(a.frame.action.suppressDryCorrection,false);
  stepNativeRaceAdapter(a,.05,{rawXNative:35,heldButtons:0x8000});
  assert.equal(a.frame.prepared.jetStraight,false);assert.ok(a.water.lastJet.angleIndex>0);
});

test('held flip keeps prepared trim while muting only working Y for subsequent water drag',()=>{
  const a=createNativeRaceAdapter({position:vec(0,3,0),jointWorld:vec(0,3.85,-.68),
    sourceState:{actionState:{action:4,actionMagnitudeNative:.55,arcActive:true}}});
  stepNativeRaceAdapter(a,.01,{rawYNative:-70,heldButtons:0x8000});
  assert.equal(a.actionState.action,4);assert.equal(a.lastControls.conditionedYNative,-70);
  assert.equal(a.lastControls.workingYNative,0);close(a.frame.prepared.trimMagnitudeNative,-.049);
  close(a.water.verticalDamping,.85);assert.equal(a.frame.action.muteTrim,true);
  assert.equal(a.frame.prepared.jetStraight,true);
});

test('actual dry reverse-Y gesture enters dive and current dive K is applied on its entry tick',()=>{
  const jointWorld=h=>vec(h.center.x,h.center.y+.85,h.center.z-.68);
  const a=createNativeRaceAdapter({position:vec(0,10,0),velocity:vec(0,0,25),jointWorld});
  stepNativeRaceAdapter(a,.05,{rawYNative:-70,heldButtons:0x8000});
  stepNativeRaceAdapter(a,.01,{rawYNative:70,heldButtons:0x8000});
  assert.equal(a.actionState.action,3);assert.equal(a.frame.action.entered,true);
  assert.equal(a.lastControls.workingYNative,70,'dive does not mute working Y');
  assert.equal(a.frame.prepared.jetStraight,false);close(a.water.buoyancyK,.003);
});

test('held dive expires after the thirty-first qualifying wet frame and ordinary K recovers on that tick',()=>{
  const a=createNativeRaceAdapter({surface:100,jointWorld:h=>vec(h.center.x,h.center.y+.85,h.center.z-.68),
    sourceState:{actionState:{action:3,diveWetFrames:29,arcActive:true}}});
  stepNativeRaceAdapter(a,.05,{rawYNative:70,heldButtons:0x8000});
  assert.equal(a.actionState.action,3);assert.equal(a.actionState.diveWetFrames,30);
  assert.equal(a.water.wetCount,12);close(a.water.buoyancyK,.003);
  stepNativeRaceAdapter(a,.01,{rawYNative:70,heldButtons:0x8000});
  assert.equal(a.actionState.action,0);assert.equal(a.actionState.diveWetFrames,31);
  assert.equal(a.frame.action.ended,true);close(a.water.buoyancyK,.004);
  assert.equal(a.frame.prepared.jetStraight,true);
});

test('source no-wet/no-solid frame count accumulates across wet intervals rather than tracking airtime',()=>{
  const a=createNativeRaceAdapter({position:vec(0,3,0),jointWorld:h=>vec(h.center.x,h.center.y+.85,h.center.z-.68),
    sourceState:{actionState:{action:3,noWetNoContactFrames:4,arcActive:true}}});
  const held={rawYNative:70,heldButtons:0x8000};
  stepNativeRaceAdapter(a,.05,held);assert.equal(a.actionState.noWetNoContactFrames,5);
  stepNativeRaceAdapter(a,.05,held,{surface:100});assert.equal(a.actionState.noWetNoContactFrames,5);
  stepNativeRaceAdapter(a,.05,held,{surface:-100});assert.equal(a.actionState.noWetNoContactFrames,6);
  stepNativeRaceAdapter(a,.05,{}, {surface:100,sourceState:{actionState:{action:0}}});
  assert.equal(a.actionState.arcActive,false);assert.equal(a.actionState.noWetNoContactFrames,6);
});

test('explicit source actor/control gates end manipulation without inferring a replacement animation',()=>{
  const a=createNativeRaceAdapter({sourceState:{actorState:23,actionState:{action:1,actionMagnitudeNative:.72}}});
  stepNativeRaceAdapter(a,.01,{rawXNative:70,heldButtons:0x8000});
  assert.equal(a.lastControls.muted,true);assert.equal(a.lastControls.throttle,false);
  assert.equal(a.lastControls.workingXNative,0);assert.equal(a.frame.actorState,23);
  assert.equal(a.actionState.action,0);assert.equal(a.frame.action.landingPending,true);
  assert.equal(a.water.lastJet.magnitudeNative,0);
});

test('source state providers are sampled once per logical frame and restored action does not reset each tick',()=>{
  const calls=[],a=createNativeRaceAdapter({sourceState:(h,c)=>{
    calls.push(c.logicalFrame);return c.logicalFrame===0?{actionState:{action:3,diveWetFrames:10,arcActive:true}}:{};
  },jointWorld:h=>vec(h.center.x,h.center.y+.85,h.center.z-.68),surface:100});
  stepNativeRaceAdapter(a,.12,{rawYNative:70,heldButtons:0x8000});
  assert.deepEqual(calls,[0,1,2]);assert.equal(a.actionState.diveWetFrames,13);
});

function authoredBridge(){
  const rest=Array.from({length:19},(_,i)=>vec(i*.02,.8+i*.01,-.4+i*.03)),calls=[];
  const articulatedRider=createNativeArticulatedRider({restTargets:rest,types:Array(19).fill(1)});
  let history=rest.map(p=>({...p}));
  const riderPose=(h,c)=>{
    calls.push(c.logicalFrame);
    const targets=rest.map(p=>vec(p.x+h.center.x+.02*(c.logicalFrame+1),p.y+h.center.y,p.z+h.center.z));
    const result={targets,historyTargets:history};history=targets.map(p=>({...p}));return result;
  };
  return {articulatedRider,riderPose,calls};
}

test('authored physical rider solves after tick5 and supplies joint2 only to the following frame',()=>{
  const bridge=authoredBridge(),a=createNativeRaceAdapter(bridge),initial={...bridge.articulatedRider.jointWorld};
  stepNativeRaceAdapter(a,.04,{throttle:true,trim:.3});
  assert.deepEqual(bridge.calls,[]);vectorClose(a.frame.prepared.jointWorld,initial);
  stepNativeRaceAdapter(a,.01,{throttle:true,trim:.3});
  assert.deepEqual(bridge.calls,[0]);assert.equal(bridge.articulatedRider.logicalFrames,1);
  vectorClose(a.frame.prepared.jointWorld,initial);
  const solved={...bridge.articulatedRider.jointWorld};assert.notDeepEqual(solved,initial);
  vectorClose(a.lastFrame.jointWorld,solved);
  stepNativeRaceAdapter(a,.01,{throttle:true,trim:.3});
  vectorClose(a.frame.prepared.jointWorld,solved);assert.deepEqual(bridge.calls,[0]);
  const snapshot=nativeRaceSnapshot(a);snapshot.source.jointWorld.x=999;
  assert.notEqual(bridge.articulatedRider.jointWorld.x,999);
  assert.throws(()=>createNativeRaceAdapter({...bridge}),/one adapter/);
});

test('action handling plus authored rider updates are render-cadence independent',()=>{
  const make=()=>{const bridge=authoredBridge();return {...bridge,adapter:createNativeRaceAdapter(bridge)};};
  const a=make(),b=make(),input={throttle:true,trim:.2};
  for(let i=0;i<20;i++)stepNativeRaceAdapter(a.adapter,.01,input);
  for(let i=0;i<12;i++)stepNativeRaceAdapter(b.adapter,1/60,input);
  assert.deepEqual(a.calls,b.calls);assert.deepEqual(a.articulatedRider,b.articulatedRider);
  vectorClose(a.adapter.hull.center,b.adapter.hull.center);
  assert.deepEqual(a.adapter.lastFrame,b.adapter.lastFrame);
  const roll=()=>createNativeRaceAdapter({position:vec(0,10,0),surface:-100,
    sourceState:{actionState:{action:1,actionMagnitudeNative:.72,arcActive:true}}});
  const c=roll(),d=roll(),held={rawXNative:70,heldButtons:0x8000};
  for(let i=0;i<50;i++)stepNativeRaceAdapter(c,.01,held);
  for(let i=0;i<30;i++)stepNativeRaceAdapter(d,1/60,held);
  vectorClose(c.hull.center,d.hull.center);assert.deepEqual(c.lastFrame,d.lastFrame);
});

test('missing authored pose provider and invalid restored actions fail explicitly',()=>{
  const bridge=authoredBridge();
  assert.throws(()=>createNativeRaceAdapter({articulatedRider:bridge.articulatedRider}),/riderPose/);
  assert.throws(()=>createNativeRaceAdapter({...bridge,jointWorld:vec(0,1,0)}),/not both/);
  assert.throws(()=>createNativeRaceAdapter({sourceState:{actionState:{action:5}}}),RangeError);
  const a=createNativeRaceAdapter(),before=nativeRaceSnapshot(a);
  assert.throws(()=>stepNativeRaceAdapter(a,.01,{}, {sourceState:{actionState:{action:8}}}),RangeError);
  assert.deepEqual(nativeRaceSnapshot(a),before);
  assert.throws(()=>stepNativeRaceAdapter(a,.01,{}, {sourceState:{crash:1}}),/boolean/);
});
