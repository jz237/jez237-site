import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../vendor/three.module.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {nativeRiderPresentation} from '../native-rider-presentation.js';
import {riderPose,ridingAttitude} from '../rider-pose.js';
import {wipeoutPose} from '../rider-actions.js';
import {RIDER_TARGET_BONES} from '../rider-target-pose.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame,windowRacerHudSpeed} from '../player-window-presentation.js';

// Real detailed meshes loaded from the local repository. There is no WebGL,
// browser page, network access, input injection or second simulation in these
// renderer assertions. The exported update is also the live child draw path.
const oldFetch=globalThis.fetch,oldWarn=console.warn;let updatePlayerWindowCraft,makeJetSki;
try{
 globalThis.fetch=async url=>{const path=new URL(url);assert.equal(path.protocol,'file:');try{return new Response(await readFile(path));}catch{return new Response('',{status:404});}};
 console.warn=()=>{};
 ({updatePlayerWindowCraft}=await import('../player-window-renderer.js'));
 ({makeJetSki}=await import('../jetski.js'));
}finally{globalThis.fetch=oldFetch;console.warn=oldWarn;}
const meshMetadata=JSON.parse(await readFile(new URL('../assets/coastal-rider.json',import.meta.url),'utf8'));
const ABSENT=Symbol('absent');
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const nearPoint=(a,b)=>a.toArray().forEach((n,i)=>near(n,b[i]));
function water(state){return {native:captureRaceWater(state.raceWater),level:0,wake:[],impacts:[],craft:[]};}
function nativeState(){return createRace({mode:'versus',physics:'native',course:getCourse('greyhaven'),rider:0,secondRider:0});}
function displayPose(offset=0,frame=10){
 const p=riderPose();
 const targets=Object.fromEntries(Object.entries(p.targets).map(([name,pair])=>[name,pair.map(point=>[point[0]+offset,point[1]+offset*2,point[2]-offset])]));
 return {targets,yaw:.1,headYaw:-.2,diagnostics:{presentationOnly:true,source:'solved-19-world-points',coordinateSpace:'craft-local-world-units',sourceLogicalFrame:frame,
  pelvisLengthWorld:.15,pelvisAxis:'hip-midpoint-to-root',collapsedSegments:[],torsoEndpoint:'solved-shoulder-midpoint',axialTwist:'existing-mesh-convention'}};
}
function basicFrame(pose=ABSENT){
 const state=createRace({mode:'versus'}),frame=captureWindowFrame(state,water(state));
 if(pose!==ABSENT)for(const [i,r]of frame.racers.entries()){
  r.nativeRiderPose=structuredClone(pose);r.nativeTelemetry={hudSpeed:61+i,actorState:22,logicalFrame:10,clockUnits:500,animationFrame:10,controlActorState:22,wetCount:8,anyWet:true,frameSpeedNative:34};
 }
 return frame;
}
function freeze(value){if(value&&typeof value==='object'&&!ArrayBuffer.isView(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function vessel(){
 const previous=globalThis.document;
 globalThis.document={createElement(name){assert.equal(name,'canvas');return {width:0,height:0,getContext(){return {fillRect(){},fillText(){}};}};}};
 try{
  const v=makeJetSki(new T.Group(),{salvage:false});v.ridingMotion={};v.stuntCalls=[];v.stuntRig={update(...args){v.stuntCalls.push(args);}};return v;
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}

test('actual two-player native capture keeps independent physical targets/HUD values and excludes simulation ownership',()=>{
 const s=nativeState();let startup=0;
 while((s.phase==='countdown'||s.nativeHost.world.adapters.some(a=>a.riderLifecycle.state.actorState===15))&&startup++<900)stepRace(s,[{},{}],1/60);
 assert.ok(startup<900,'both source starting riders complete through normal stepping');
 const ticks=s.nativeHost.world.ticks,frames=s.raceWater.frames;
 for(let i=0;i<3;i++)stepRace(s,[{throttle:1,steer:.2},{throttle:0,steer:-.4,dampen:true}],1/60);
 const wire=captureWindowFrame(s,water(s)),read=readWindowFrame(structuredClone(wire));assert.ok(read);
 assert.equal(read.racers.length,2);assert.equal(s.nativeHost.world.ticks,ticks+5);assert.equal(s.raceWater.frames,frames+1);
 for(const [i,r]of read.racers.entries()){
  assert.equal(r.player,i);assert.deepEqual(r.nativeRiderPose,s.racers[i].nativeRiderPose);
  assert.equal(r.nativeTelemetry.hudSpeed,s.racers[i].nativeTelemetry.hudSpeed);assert.equal(r.nativeTelemetry.actorState,22);assert.equal(r.nativeTelemetry.logicalFrame,frames+1);
  assert.equal(Object.keys(r.nativeRiderPose.targets).length,15);assert.equal(r.nativeTelemetry.impacts,undefined);assert.equal(r.nativeTelemetry.physicalControls,undefined);
  assert.equal(r.nativeTelemetry.recovery,undefined);assert.equal(r.nativeTelemetry.derived,undefined);assert.equal(r.sourceBuoys,undefined);
 }
 assert.equal(read.racers[0].throttle,1);assert.equal(read.racers[1].throttle,0);
 assert.notDeepEqual(read.racers[0].nativeRiderPose.targets,read.racers[1].nativeRiderPose.targets);
 assert.equal(read.primaryBuoys.length,59);assert.equal(read.primaryBuoys[2].sourceRow,2);
 assert.equal(read.primaryBuoys[2].velocityNative,undefined);assert.equal(read.primaryBuoys[2].physicsEnabled,undefined);
 assert.equal(read.nativeHost,undefined);assert.equal(read.world,undefined);assert.equal(read.water.native.field,undefined);
 const saved=structuredClone(wire);read.racers[0].nativeRiderPose.targets.handL[0][0]=999;read.racers[0].nativeRiderPose.diagnostics.collapsedSegments.push('head');
 read.primaryBuoys[2].position.x=999;read.primaryBuoys[0].endpoints[0].x=999;
 assert.deepEqual(wire,saved);assert.notEqual(s.racers[0].nativeRiderPose.targets.handL[0][0],999);
});

test('optional physical rider data rejects malformed anatomy, unbounded values and invalid provenance',()=>{
 const valid=basicFrame(displayPose());assert.ok(readWindowFrame(valid));
 for(const alter of [
  p=>delete p.targets.footR,p=>p.targets.extra=[[0,0,0],[0,1,0]],p=>p.targets.head=[[0,1,0]],
  p=>p.targets.handL[0][0]=NaN,p=>p.targets.handL[0][0]=10001,p=>p.yaw=Infinity,p=>p.headYaw=-10001,
  p=>p.diagnostics.sourceLogicalFrame=-1,p=>p.diagnostics.sourceLogicalFrame=1.2,p=>p.diagnostics.presentationOnly=false,
  p=>p.diagnostics.source='visual-bone-read',p=>p.diagnostics.coordinateSpace='world',p=>p.diagnostics.pelvisLengthWorld=0,
  p=>p.diagnostics.collapsedSegments=['head','head'],p=>p.diagnostics.collapsedSegments=['notABone']
 ]){
  const bad=structuredClone(valid);alter(bad.racers[0].nativeRiderPose);assert.equal(readWindowFrame(bad),null);
 }
 for(const value of [undefined,false,[],{}]){const bad=structuredClone(valid);bad.racers[1].nativeRiderPose=value;assert.equal(readWindowFrame(bad),null);}
});

test('optional native telemetry and primary display rows reject malformed packets instead of modern fallback',()=>{
 const valid=basicFrame(displayPose());valid.primaryBuoys=[{sourceRow:2,classification:1,fixed:false,renderEnabled:true,position:{x:50,y:0,z:30},endpoints:[{x:49,y:0,z:30},{x:51,y:0,z:30}]}];
 for(const alter of [t=>t.hudSpeed=NaN,t=>t.hudSpeed=.5,t=>t.actorState=-1,t=>delete t.actorState,t=>t.logicalFrame=Infinity,t=>t.animationFrame=-1,t=>t.clockUnits=Infinity,t=>t.wetCount=13,t=>t.anyWet=1,t=>t.frameSpeedNative=-.1]){
  const bad=structuredClone(valid);alter(bad.racers[1].nativeTelemetry);assert.equal(readWindowFrame(bad),null);
 }
 for(const alter of [
  f=>f.primaryBuoys=undefined,f=>f.primaryBuoys=Array(65).fill(f.primaryBuoys[0]),f=>f.primaryBuoys.push(structuredClone(f.primaryBuoys[0])),
  f=>f.primaryBuoys[0].sourceRow=-1,f=>f.primaryBuoys[0].renderEnabled=1,f=>f.primaryBuoys[0].position.x=Infinity,
  f=>f.primaryBuoys[0].position.z=1e9+1,f=>f.primaryBuoys[0].endpoints[0].y=NaN,f=>f.primaryBuoys[0].endpoints.length=1
 ]){const bad=structuredClone(valid);alter(bad);assert.equal(readWindowFrame(bad),null);}
 const view=readWindowFrame({...valid,primaryBuoys:valid.primaryBuoys.map(q=>({...q,velocityNative:{x:1,y:2,z:3},hull:{solver:'private'}}))});
 assert.ok(view);assert.equal(view.primaryBuoys[0].velocityNative,undefined);assert.equal(view.primaryBuoys[0].hull,undefined);
});

test('compatible physical window targets blend only endpoints while source frame, actor, HUD and fixed spans stay discrete',()=>{
 const a=basicFrame(displayPose()),b=basicFrame(displayPose(.4,11));a.time=1;b.time=1.05;
 for(const r of b.racers){r.nativeTelemetry.hudSpeed=99;r.nativeTelemetry.actorState=23;r.nativeTelemetry.logicalFrame=11;r.nativeRiderPose.yaw=.8;}
 a.primaryBuoys=[{sourceRow:2,classification:1,fixed:false,renderEnabled:true,position:{x:50,y:0,z:30},endpoints:[{x:49,y:-1,z:30},{x:51,y:-1,z:30}]}];
 b.primaryBuoys=[{...structuredClone(a.primaryBuoys[0]),renderEnabled:false,position:{x:54,y:2,z:26},endpoints:[{x:45,y:-2,z:31},{x:55,y:-2,z:31}]}];
 const saved=structuredClone([a,b]);freeze(a);freeze(b);const middle=interpolateWindowFrame(a,b,1.0125);near(middle.primaryBuoys[0].position.x,51);
 for(const [i,r]of middle.racers.entries()){
  for(const bone of RIDER_TARGET_BONES)for(let j=0;j<2;j++)a.racers[i].nativeRiderPose.targets[bone][j].forEach((n,k)=>near(r.nativeRiderPose.targets[bone][j][k],n+[.1,.2,-.1][k]));
  assert.equal(r.nativeRiderPose.yaw,.1);assert.deepEqual(r.nativeRiderPose.diagnostics,a.racers[i].nativeRiderPose.diagnostics);
  assert.equal(r.nativeRiderPose.diagnostics.sourceLogicalFrame,10);assert.equal(r.nativeTelemetry.logicalFrame,10);assert.equal(r.nativeTelemetry.actorState,22);assert.equal(windowRacerHudSpeed(r),61+i);
  assert.equal(r.nativeRiderPose.windowPresentation.policy,'display-endpoints-only');assert.equal(new Set(Object.values(r.nativeRiderPose.targets).flat()).size,30);
 }
 assert.equal(middle.primaryBuoys[0].renderEnabled,true);assert.deepEqual(middle.primaryBuoys[0].endpoints,a.primaryBuoys[0].endpoints);
 middle.racers[1].nativeRiderPose.targets.footR[1][0]=999;middle.racers[1].nativeTelemetry.actorState=999;middle.primaryBuoys[0].endpoints[0].x=999;
 assert.deepEqual([a,b],saved);
 for(const [time,expected]of [[1,a],[1.05,b]]){
  const sampled=interpolateWindowFrame(a,b,time);assert.deepEqual(sampled.racers[0].nativeRiderPose,expected.racers[0].nativeRiderPose);
  assert.deepEqual(sampled.racers[0].nativeTelemetry,expected.racers[0].nativeTelemetry);assert.deepEqual(sampled.primaryBuoys,expected.primaryBuoys);
 }
});

test('native/modern/null/identity boundaries and phase changes select detached recorded physical samples',()=>{
 for(const [first,last]of [[displayPose(),ABSENT],[ABSENT,displayPose(.4)],[displayPose(),null],[null,displayPose(.4)]]){
  const a=basicFrame(first),b=basicFrame(last);a.time=1;b.time=2;
  const middle=interpolateWindowFrame(a,b,1.5),end=interpolateWindowFrame(a,b,2);
  for(const [sample,source]of [[middle,a],[end,b]]){
   assert.equal(Object.hasOwn(sample.racers[0],'nativeRiderPose'),Object.hasOwn(source.racers[0],'nativeRiderPose'));
   assert.deepEqual(sample.racers[0].nativeRiderPose,source.racers[0].nativeRiderPose);
   if(sample.racers[0].nativeRiderPose)assert.notEqual(sample.racers[0].nativeRiderPose,source.racers[0].nativeRiderPose);
  }
 }
 const a=basicFrame(displayPose()),b=basicFrame(displayPose(.4));a.time=1;b.time=2;b.racers[0].id=3;
 assert.deepEqual(interpolateWindowFrame(a,b,1.5).racers[0].nativeRiderPose,a.racers[0].nativeRiderPose);
 b.phase='paused';const held=interpolateWindowFrame(a,b,1.5);assert.deepEqual(held.racers[0].nativeRiderPose,b.racers[0].nativeRiderPose);
 held.racers[0].nativeRiderPose.targets.head[0][0]=999;assert.notEqual(b.racers[0].nativeRiderPose.targets.head[0][0],999);
});

test('repeated paused window sampling cannot step shared hulls, articulated riders, water, buoy motion or counters',()=>{
 const s=nativeState();s.phase='running';const a=readWindowFrame(captureWindowFrame(s,water(s)));
 for(let i=0;i<3;i++)stepRace(s,[{throttle:1,steer:.3},{throttle:1,steer:-.2}],1/60);
 const b=readWindowFrame(captureWindowFrame(s,water(s)));s.phase='paused';
 const fingerprint=()=>JSON.stringify({time:s.time,phase:s.phase,racers:s.racers,
  ticks:s.nativeHost.world.ticks,frames:s.nativeHost.world.frames,remainder:s.nativeHost.world.remainder,
  adapters:s.nativeHost.world.adapters.map(a=>({snapshot:nativeRaceSnapshot(a),hull:a.hull,rider:a.articulatedRider,controls:a.controlState})),
  anchors:s.nativeHost.bundles.map(b=>b.anchorState),water:captureRaceWater(s.raceWater),primary:s.nativeHost.primary.state});
 const before=fingerprint(),recorded=structuredClone([a,b]);freeze(a);freeze(b);
 for(let i=0;i<120;i++){
  const f=interpolateWindowFrame(a,b,(i%5)*.0125);f.racers[0].nativeRiderPose.targets.handL[0][0]=999;f.primaryBuoys[2].position.x=999;
 }
 assert.equal(fingerprint(),before);assert.deepEqual([a,b],recorded);
});

test('child detailed meshes place solved physical endpoints through the actual full craft transform exactly once',()=>{
 const v=vessel(),position={x:37,y:-4,z:81},heading=1.1,pitch=-.35,roll=.42,hull=createNativeHull({position,heading,pitch,roll}),bundle=createAuthoredNativeRider({initialHull:hull});
 const p=nativeRiderPresentation(bundle.articulatedRider,hull),q=basicFrame().racers[0];Object.assign(q,{x:position.x,z:position.z,heading,turn:.9,speed:30,nativeRiderPose:p,wipeout:{elapsed:.7,duration:2.6,side:1}});
 Object.assign(q.hydro,{y:position.y,pitch,roll,wet:.5});Object.assign(q.stunt,{trick:'flip',angle:2,pose:'handstand',poseTime:5});
 const before=structuredClone(p),movement=updatePlayerWindowCraft(v,q,{time:5,dt:1/60});v.boat.updateMatrixWorld(true);
 assert.equal(v.rider.userData.nativePhysical,true);assert.equal(v.rider.visible,true);assert.equal(v.stuntCalls[0][0],'');assert.equal(movement.wipeoutAmount,0);
 assert.deepEqual(v.rider.position.toArray(),[0,0,0]);assert.deepEqual(v.rider.rotation.toArray().slice(0,3),[0,0,0]);assert.deepEqual(v.ridingMotion,{});
 near(v.boat.rotation.y,heading);near(v.body.rotation.x,pitch);near(v.body.rotation.y,0);near(v.body.rotation.z,roll);
 for(const [bone,index]of [['head',0],['forearmL',5],['handL',6],['thighL',8],['shinL',9],['footL',10],['forearmR',13],['handR',14],['thighR',16],['shinR',17],['footR',18]]){
  // Each rig scales its own rest length; the built-in fallback's differ from the detailed mesh.
  const group=v.rider.getObjectByName(bone),endpoint=new T.Vector3(0,group.userData.restLength??meshMetadata.bones[bone].length,0).applyMatrix4(group.matrixWorld);
  nearPoint(endpoint,Object.values(bundle.articulatedRider.points[index].position));
 }
 const held=v.rider.children.map(g=>g.matrix.clone());for(let i=0;i<60;i++)updatePlayerWindowCraft(v,q,{time:100+i,dt:.2});
 v.boat.updateMatrixWorld(true);v.rider.children.forEach((g,i)=>assert.ok(g.matrix.equals(held[i]),g.name));assert.deepEqual(p,before);assert.deepEqual(v.ridingMotion,{});
});

test('child modern path retains authored bank, stunt rotation, wipeout offset and world-speed HUD fallback',()=>{
 const v=vessel(),q=basicFrame().racers[0];Object.assign(q,{x:5,z:-2,heading:.7,turn:.8,speed:10,wipeout:{elapsed:.7,duration:2.6,side:-1}});
 Object.assign(q.hydro,{y:.3,pitch:.15,roll:-.1,wet:.7});Object.assign(q.stunt,{trick:'flip',angle:.9,pose:'handstand',poseTime:2});
 const expected=ridingAttitude({},q.hydro,q.turn,q.speed,1/60),fallen=wipeoutPose(q.wipeout);updatePlayerWindowCraft(v,q,{time:2,dt:1/60});
 near(v.body.rotation.x,expected.pitch-.9);near(v.body.rotation.z,expected.roll);nearPoint(v.rider.position,[fallen.x,fallen.y,fallen.z]);
 assert.equal(v.rider.visible,false);assert.equal(v.stuntCalls[0][0],'handstand');assert.equal(v.rider.userData.nativePhysical,false);assert.equal(windowRacerHudSpeed(q),36);
 q.nativeTelemetry={hudSpeed:77,actorState:22,logicalFrame:10};assert.equal(windowRacerHudSpeed(q),77);
});
