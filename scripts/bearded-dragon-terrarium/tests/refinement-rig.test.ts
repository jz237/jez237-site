import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {readFileSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {habitat,Audit,SkinAudit} from './locomotion-fixture';
import {Dish} from '../lib/Dish';
import {groundHeight} from '../lib/Ground';

test('probing recovery directions cannot advance or relocate the rendered animal',()=>{
  const a=habitat(),r=a.rig as any;r.update(1/60);
  const capture=()=>({pose:r.poseState(),accepted:{...r.accepted},time:r.time,
    anchors:r.legs.map((l:any)=>l.planted.toArray()),bones:a.lizard.bones.map(b=>b.matrix.toArray()),
    spine:r.spinePoints().map((p:THREE.Vector3)=>p.toArray())});
  const before=capture();
  for(const [forward,lateral,turn] of [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]])assert.ok(Number.isFinite(r.recoveryCost(forward,lateral,turn)));
  for(const leg of r.legs)for(const advance of [-.008,.008])r.supportedTransferShoulder(leg,advance);
  assert.deepEqual(capture(),before);
});

test('a stretched forefoot beside the tray can release before another route retry',t=>{
  const originalRandom=Math.random;let seed=20261030;
  Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  try{
  const a=habitat(),r=a.rig as any,b=a.brain as any;
  const saved=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/tray-recovery-pose.json.gz',import.meta.url))).toString(),
    (_key,v)=>v?.$type?new (THREE as any)[v.$type]().fromArray(v.v):v);
  Object.assign(r,saved);const I=r.inputs;
  // The saved controller has cached digit transforms, but this model is new.
  // Rebuild those bones before sampling the rendered skin on the first tick.
  for(const leg of r.legs)leg.digitHand=null;
  r.tailDynamics.reset(r.tailPts[0],r.bodyFwd.clone().negate());
  b.dish=new Dish({heightAt:groundHeight},-.58,.362);
  b.pose={clearance:I.clearance-(Math.abs(I.speed)>.02?.2:0),chestLift:I.chestLift,headPitch:I.headPitch,lid:I.lid,breath:I.breath};
  b.boredom=1e6;assert.ok(b.goTo(.47,.34,'drink'));b.hurry=true;
  const start=new THREE.Vector2(I.x,I.z),audit=new Audit(),skin=new SkinAudit(a.lizard,true);
  let maxStill=0,still=0,seconds=0;const ref=new THREE.Vector3(I.x,I.z,I.heading);
  // Match the existing 90-second cross-habitat journey ceiling; the separate
  // five-second progress bound rejects stalled recovery regardless of duration.
  for(let i=0;i<90*60&&Math.hypot(I.x-.47,I.z-.34)>.04;i++){
    b.update(1/60);audit.sample(r,a.surface);if(i%12===0)skin.sample(r,a.surface,i);seconds=(i+1)/60;
    if(Math.hypot(I.x-ref.x,I.z-ref.y)>.003||Math.abs(Math.atan2(Math.sin(I.heading-ref.z),Math.cos(I.heading-ref.z)))>.06){still=0;ref.set(I.x,I.z,I.heading);}else still+=1/60;
    maxStill=Math.max(maxStill,still);
    if(process.env.REFINEMENT_REPORT&&i%300===0)writeFileSync(process.env.REFINEMENT_REPORT,JSON.stringify({seconds,root:[I.x,I.z,I.heading],maxStill,mode:b.mode,status:b.status,pose:r.poseState(),path:b.path,pathI:b.pathI,legs:r.legs.map((l:any)=>({swing:l.swing,anchor:l.planted.toArray(),to:l.to.toArray(),returning:l.returning,phase:l.swingT}))}));
  }
  assert.ok(Math.hypot(I.x-.47,I.z-.34)<.04,`the captured stance must finish the journey: ${JSON.stringify({seconds,root:[I.x,I.z],start:start.toArray(),maxStill})}`);
  assert.ok(maxStill<5,'release the support instead of repeating failed routes');
  assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'recovery preserves all planted supports');
  t.diagnostic(JSON.stringify({scenario:'captured tray recovery',seconds,maxStill,root:[I.x,I.z],audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst}}));
  assert.ok(audit.maxJump<.004&&audit.maxLimbError<.00015&&skin.maxPenetration<.003,'the escape cannot relocate the body or cross the tray');
  }finally{Math.random=originalRandom;}
});

for(const [name,fixture,gx,gz,walkingClearance] of [
  ['bowl-side stance','bowl',.08,.35,undefined],
  ['ramp-edge stance','ramp',.25,.25,undefined],
  // This snapshot was taken after abandoning travel, which zeroed input speed
  // after the walking clearance had already been applied. Restore that preset.
  ['rolled perch stance','perch',-.465,.035,.95],
  ['diagonal ramp stance','diagonal-ramp',.475,.335,undefined],
  ['hide-exit stance','hide-exit',.475,.335,.95],
] as const)test(`a ${name} uses a supported exit from its captured stance`,t=>{
  const originalRandom=Math.random;let seed=20261030;
  Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),r=a.rig as any,b=a.brain as any;
    Object.assign(r,JSON.parse(gunzipSync(readFileSync(new URL(`./fixtures/${fixture}-recovery-pose.json.gz`,import.meta.url))).toString(),
      (_key,v)=>v?.$type?new (THREE as any)[v.$type]().fromArray(v.v):v));
    const I=r.inputs;for(const leg of r.legs)leg.digitHand=null;
    r.tailDynamics.reset(r.tailPts[0],r.bodyFwd.clone().negate());
    b.pose={clearance:walkingClearance??I.clearance-(Math.abs(I.speed)>.02?.2:0),chestLift:I.chestLift,headPitch:I.headPitch,lid:I.lid,breath:I.breath};
    b.boredom=1e6;assert.ok(b.goTo(gx,gz,'idle'));b.hurry=true;
    const goal=[...b.goal];
    const audit=new Audit(),skin=new SkinAudit(a.lizard,true),ref=new THREE.Vector3(I.x,I.z,I.heading);
    let maxStill=0,still=0,seconds=0,maxSwing=0;const ages=[0,0,0,0];
    for(let i=0;i<90*60&&b.mode==='travel';i++){
      b.update(1/60);audit.sample(r,a.surface);if(i%12===0)skin.sample(r,a.surface,i);seconds=(i+1)/60;
      if(Math.hypot(I.x-ref.x,I.z-ref.y)>.003||Math.abs(Math.atan2(Math.sin(I.heading-ref.z),Math.cos(I.heading-ref.z)))>.06){still=0;ref.set(I.x,I.z,I.heading);}else still+=1/60;
      maxStill=Math.max(maxStill,still);
      r.legs.forEach((l:any,n:number)=>{ages[n]=l.swing?ages[n]+1/60:0;maxSwing=Math.max(maxSwing,ages[n]);});
      if(process.env.REFINEMENT_REPORT&&i%300===0)writeFileSync(process.env.REFINEMENT_REPORT,JSON.stringify({scenario:fixture,seconds,root:[I.x,I.z,I.heading],maxStill,maxSwing,mode:b.mode,status:b.status,pivot:b.pivotRecovery,retreat:b.retreatT,retreatLeft:b.retreatLeft,retreatSign:b.retreatSign,pose:r.poseState(),path:b.path,pathI:b.pathI,legs:r.legs.map((l:any)=>({swing:l.swing,anchor:l.planted.toArray(),to:l.to.toArray(),returning:l.returning,phase:l.swingT}))}));
    }
    t.diagnostic(JSON.stringify({scenario:`captured ${fixture} recovery`,seconds,maxStill,maxSwing,root:[I.x,I.z],goal,skin:skin.maxPenetration}));
    assert.equal(b.mode,'idle','finish the requested route');
    assert.ok(Math.hypot(I.x-goal[0],I.z-goal[1])<.04,'leave the captured stance and reach the planned destination');
    assert.ok(maxStill<5&&maxSwing<2.5,'use the clear exit without repeated stalls or suspended feet');
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'every planted sole retains its support');
    assert.ok(audit.maxJump<.004&&audit.maxLimbError<.00015&&skin.maxPenetration<.003,'the local exit still obeys actual mesh, body and limb constraints');
  }finally{Math.random=originalRandom;}
});

test('a returning knee cannot trade a folded joint for penetration into stone',()=>{
  const a=habitat(),r=a.rig as any;
  Object.assign(r,JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/descending-knee-recovery-pose.json.gz',import.meta.url))).toString(),
    (_key,v)=>v?.$type?new (THREE as any)[v.$type]().fromArray(v.v):v));
  // This is the old failure itself, folded inside its ordinary stance range.
  // It checks non-worsening contact independently of that pre-existing error;
  // full-journey tests start from supported poses and test actual recovery.
  const leg=r.legs.find((l:any)=>l.swing&&l.returning),before=r.transferPose(leg,leg.swingT);
  const depth=r.limbObstruction(leg,before.S,before.W,before.plane);
  r.updateLegs(1/60,1,.7,.8);
  const after=r.transferPose(leg,leg.swingT);
  assert.ok(after.distance>=before.distance-1e-7,'do not fold farther');
  assert.ok(r.limbObstruction(leg,after.S,after.W,after.plane)<=Math.max(.0015,depth)+.000021,'fold error cannot relax the separate solid-contact limit');
});

test('a sideways recovery transfers feet without dragging supports or crossing the front pane',()=>{
  const a=habitat(),r=a.rig as any,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
  Object.assign(I,{x:-.28,z:.346,heading:2.328,clearance:.95,chestLift:.15,headPitch:.1});r.reset();
  for(let i=0;i<60;i++)r.update(1/60);
  const start=new THREE.Vector2(I.x,I.z);let longestSwing=0;const ages=[0,0,0,0];
  for(let i=0;i<240;i++){
    I.speed=0;I.lateralSpeed=i<180?.025:0;
    I.x+=Math.sin(I.heading)*I.lateralSpeed/60;I.z+=Math.cos(I.heading)*I.lateralSpeed/60;
    r.update(1/60);audit.sample(r,a.surface);if(i%12===0)skin.sample(r,a.surface,i);
    r.legs.forEach((l:any,n:number)=>{ages[n]=l.swing?ages[n]+1/60:0;longestSwing=Math.max(longestSwing,ages[n]);});
  }
  assert.ok(Math.hypot(I.x-start.x,I.z-start.y)>.02,JSON.stringify({message:'a supported side step creates actual turning room',start:start.toArray(),end:[I.x,I.z],audit:audit.report(),legs:r.legs.map((l:any)=>({swing:l.swing,from:l.planted.toArray(),to:l.to.toArray(),returning:l.returning,stall:l.swingStall}))}));
  assert.ok(audit.steps>=3,'the body shift is accompanied by real foot transfers');
  assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'planted soles retain their supports');
  assert.ok(audit.maxJump<.004&&audit.maxLimbError<.00015,'the recovery preserves body continuity and limb length');
  assert.ok(skin.maxPenetration<.003&&longestSwing<2.5,'the visible skin clears the tray and every foot can land');
});

test('an intermediate ledge approach does not overshoot to the far perch and double back',()=>{
  const a=habitat(),goal:[number,number]=[-.315,.035];
  const route=a.nav.path(.08,.35,...goal)!;
  assert.ok(route&&route.length>1);
  assert.ok(Math.min(...route.map(p=>p[0]))>goal[0]-.02,'the route stops adding stair gateways at the target ledge');
});

test('leaving the food tray reserves a separate backing route and preserves the original destination',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  Object.assign(I,{x:-.4,z:.345,heading:Math.PI});a.rig.reset();
  assert.ok(b.goTo(-.465,.03,'bask'));
  const destination=[...b.goal];
  assert.ok(b.foodExit);
  assert.ok(b.path.at(-1)[0]>.155&&b.path.at(-1)[1]>.35,'clear the whole head before turning toward the ascent');
  assert.ok(b.replan());
  assert.deepEqual(b.goal,destination,'a recovery cannot replace the perch destination with the exit waypoint');
  assert.ok(b.path.at(-1)[0]>.155,'a retry still completes the withdrawal first');
});

test('an approach beside the steps rejoins their lower entry before climbing',()=>{
  const a=habitat(),route=a.nav.path(-.147,.229,-.465,.035)!;
  assert.equal(a.nav.walkable(-.213,.205),false,'the narrow side is not a whole-body route');
  assert.equal(a.nav.walkable(-.20,.13),true,'the supported step corridor remains available');
  assert.ok(route);
  const entry=route.findIndex(p=>Math.hypot(p[0]+.08,p[1]-.17)<.012);
  const upper=route.findIndex(p=>p[0]<-.19);
  assert.ok(entry>=0&&upper>entry,'do not cut the tall side with one flank still on sand');
});

test('a failed resting adjustment cannot delay a requested walk for its cosmetic retry interval',()=>{
  const a=habitat(),r=a.rig as any,I=r.inputs,audit=new Audit();
  Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15,headPitch:.05});r.reset();
  for(let i=0;i<60;i++)r.update(1/60);
  for(const l of r.legs)l.nextPlanTime=r.time+12;
  const start=I.x;
  for(let i=0;i<60;i++){I.speed=.12;I.x+=.12/60;r.update(1/60);audit.sample(r,a.surface);}
  assert.ok(I.x-start>.04&&audit.steps>=2,'walking can request fresh steps immediately');
  assert.ok(audit.maxSlide<.0001&&audit.maxLimbError<.00015,'waking still preserves planted contacts and limb length');
});

test('a forearm crossing its pole singularity retains a continuous elbow plane',()=>{
  const {rig}=habitat(),r=rig as any;rig.update(1/60);
  const leg=r.legs.find((l:any)=>l.front),frame=r.spineFrame[2];
  const axis=new THREE.Vector3(-1,-.15,0).transformDirection(frame);
  const side=new THREE.Vector3(0,0,1).transformDirection(frame);
  let direction=axis.clone().addScaledVector(side,-.16).normalize();
  let plane=new THREE.Vector3().crossVectors(direction,side).normalize();
  for(let i=1;i<=320;i++){
    const next=axis.clone().addScaledVector(side,-.16+i*.001).normalize();
    const transported=plane.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(direction,next));
    const bounded=r.boundLimbPlane(leg,next,transported.clone());
    assert.ok(bounded.angleTo(transported)<.05,'an almost unchanged wrist cannot flip the elbow around its axis');
    plane=bounded;direction=next;
  }
});

test('a blocked chest raise and gaze near the front pane preserve the rendered supports',()=>{
  const a=habitat(),r=a.rig,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
  Object.assign(I,{x:.1,z:.275,heading:-Math.PI/2,clearance:.95,chestLift:.15});r.reset();
  for(let frame=0;frame<360;frame++){
    I.speed=frame<180?.12:0;I.z+=I.speed/60;
    I.chestLift=frame<180?.15:2.3;I.lunge=frame<180?0:.6;
    I.look=new THREE.Vector3(.24,.08,.5);I.tracking=true;
    r.update(1/60);audit.sample(r,a.surface);
    if(frame%12===0)skin.sample(r,a.surface,frame);
  }
  assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'stance soles retain their real supports');
  assert.ok(audit.maxLimbError<.00015,'a rejected posture cannot reappear during the final head/leg solve');
  assert.ok(audit.maxJump<.004,'the pane arrests motion without relocating the root');
  assert.ok(skin.maxPenetration<.003,`the rendered skin stays inside the front pane: ${skin.maxPenetration}`);
});

test('turning toward prey hidden behind the ramp cannot carry the jaw through stone',()=>{
  const a=habitat(),r=a.rig,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
  Object.assign(I,{x:-.127,z:.36,heading:0,clearance:.95,chestLift:.15,headPitch:.05});r.reset();
  for(let i=0;i<60;i++)r.update(1/60);
  for(let i=0;i<300;i++){
    I.turnRate=i<180?1.8:0;I.heading+=I.turnRate/60;
    I.look=new THREE.Vector3(-.215,.075,-.245);I.tracking=true;
    r.update(1/60);audit.sample(r,a.surface);if(i%6===0)skin.sample(r,a.surface,i);
  }
  assert.ok(skin.maxPenetration<.003,`head and limbs clear the ramp: ${skin.maxPenetration}`);
  assert.ok(audit.maxSlide<.0001&&audit.maxLimbError<.00015,'looking toward hidden prey preserves planted supports');
  assert.ok(audit.maxJump<.004&&audit.maxHeadJump<.012,'head and torso remain continuous');
});

test('a lowering recovery keeps progressing regardless of the age of its rejected step',()=>{
  const a=habitat(),r=a.rig as any,I=r.inputs,audit=new Audit();
  Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15,tracking:true});r.reset();
  for(let i=0;i<60;i++)r.update(1/60);
  const leg=r.legs[2];
  leg.from.copy(leg.planted).add(new THREE.Vector3(0,.01,0));leg.to.copy(leg.planted);
  leg.fromNormal.copy(leg.normal);leg.toNormal.copy(leg.normal);
  leg.fromYaw=leg.plantedYaw;leg.toYaw=leg.plantedYaw;
  leg.swing=true;leg.returning=true;leg.settling=true;leg.swingT=.25;leg.swingDur=.8;
  leg.swingElapsed=2;leg.swingStall=0;leg.nextPlanTime=0;r.commit();
  let previous=leg.swingT,ticks=0;
  while(leg.swing&&ticks++<90){
    r.update(1/60);audit.sample(r,a.surface);
    assert.ok(leg.swingT>=previous,'a progressing lowering cannot restart its arc');previous=leg.swingT;
  }
  assert.equal(leg.swing,false,'finish lowering onto the verified support');
  assert.ok(audit.maxSlide<.0001&&audit.maxLimbError<.00015,'other feet retain their supports and the limb keeps its length');
});


test('repeated withdrawals cannot keep a blocked journey walking in place indefinitely',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs;
  Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15});r.reset();
  for(let i=0;i<60;i++)r.update(1/60);
  b.boredom=1e6;assert.ok(b.goTo(.34,.35,'idle'));b.hurry=true;
  const frozen={x:I.x,z:I.z,heading:I.heading};
  // Represent a contact solver rejecting every requested translation/turn.
  r.update=()=>{Object.assign(I,frozen);Object.assign(r.motion,{speed:0,turnRate:0,transferring:false,blocked:true});};
  for(let i=0;i<8*60&&b.mode==='travel';i++){
    // An unused head-lead timer must not exempt a failed withdrawal.
    b.leadT=.2;b.update(1/60);
  }
  assert.equal(b.mode,'idle','withdrawal retries have a shared progress bound');
  assert.equal(b.status,'Pausing to reassess the route');
  assert.equal(b.path.length,0);assert.equal(I.speed,0);assert.equal(I.turnRate,0);
  assert.deepEqual({x:I.x,z:I.z,heading:I.heading},frozen,'reassessment cannot relocate the body');
});
