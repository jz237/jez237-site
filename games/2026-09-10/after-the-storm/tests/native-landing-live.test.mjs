import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,authoredNativeHullLocalPoints} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeRaceBodyFields} from '../native-race-body-fields.js';
import {createNativeRaceState,prepareNativeRaceStuntMoveUpdate,prepareNativeRaceStuntAwardDisplay,
 nativeRaceStuntAwardsView} from '../native-race-state.js';
// Prepared airborne start; all subsequent roll, release, water contact and
// recovery use ordinary input and the actual hull/rider solvers.
function make({slot=0,landingTicks=0,enabled=true,sourceState={},recoveryMode}={}){
 const options={position:{x:0,y:8,z:0},velocity:{x:0,y:0,z:25}},initialHull=createNativeHull(options),bundle=createNativeLifecycleRider({initialHull});
 const recovery=recoveryMode===undefined?{}:{physicalMode:recoveryMode,state:createNativeRiderRecovery({riderIndex:0,actorState:7,contactMode:1-recoveryMode,hullDamping:initialHull.points.map(p=>p.damping)})};
 return createNativeRaceAdapter({...options,...bundle,surface:0,sourceState,riderRecovery:{courseDatumNative:0,...recovery},
  riderActions:{inputHistory:{gestureTick15f0:0,flag1600:0,sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:2048,quietFrames15fe:0},idleFramesC6c:0,idleChoice16c4:0,
   source:{state650:3,gestureWindowNative:3,idleThresholdNative:1000,poseCompletion:{finished2c2c:0,record2c24:0,racerIndex:slot,primaryRacerIndex:0,gameMode648:3}}},
  ...(enabled?{riderLanding:{landingTicks,localPointsNative:authoredNativeHullLocalPoints()}}:{})});
}
function run(heldFrames=1,hz=20,options={}){
 const a=make(options),audio=createNativeRaceContactAudio({players:1,courseIndex:1}),field=createNativeWaterField({datumNative:0}),events=[];
 audio.applyEffects([{kind:'externalCall',consumer:'800c21f4',arguments:[7,1]}]);audio.drain();
 const input=(_,frame)=>frame===0?{rawXNative:-70,heldButtons:0x8000}:frame<=heldFrames?{rawXNative:70,heldButtons:0x8000}:{};
 for(let i=0;i<hz*3;i++){
  let remaining=1/hz;
  while(remaining>1e-12){
  // Observe completed outer frames before a later partial frame is prepared.
  const dt=Math.min(remaining,(5-a.hull.ticks%5)*.01-a.remainder),previous=a.logicalFrames;
  stepNativeRaceAdapter(a,dt,input);remaining-=dt;
  if(a.logicalFrames!==previous){
   const l=a.lastFrame.landing;events.push({frame:a.logicalFrames,landing:structuredClone(l),action:a.lastFrame.actionState.action,actor:a.lastFrame.actorState});
   audio.advance([a],field,{recordFlags318:[0],recordMotion2c8:[0],recordPower12c:[0],recordPlace4:[0],sprayLeft1c5c:[0],sprayRight1c60:[0]});
  }
  }
 }
 return {a,events,commands:audio.drain()};
}

test('physical roll release waits for water and settles with one success cue after five completed frames',()=>{
 const {a,events,commands}=run(),release=events.find(e=>e.landing.landingTicks===-1),contact=events.find(e=>e.landing.landingTicks===5),settled=events.filter(e=>e.landing.settled);
 assert.equal(events[1].action,1);assert.ok(events[1].landing.arcNative>0&&events[1].landing.arcNative<10,'arc uses final-tick center displacement, not HUD frame travel');
 assert.ok(contact.frame>release.frame);assert.equal(settled.length,1);assert.equal(settled[0].frame-contact.frame,5);
 assert.equal(settled[0].landing.move,6);assert.equal(settled[0].landing.hullReset,false);
 const cues=commands.filter(c=>c.arguments[0]===0x06000b00);assert.equal(cues.length,1);assert.equal(cues[0].frame,settled[0].frame);
 assert.ok([10,19].includes(cues[0].arguments[1]));assert.equal(a.riderLanding.landingTicks,0);
 const snapshot=nativeRaceSnapshot(a);snapshot.source.landing.effects.push({kind:'bad'});assert.equal(a.lastFrame.landing.effects.length,0);
});

test('physical over-rotation fails without success feedback; a secondary successful rider also stays quiet',()=>{
 const failed=run(12),settled=failed.events.filter(e=>e.landing.settled);
 assert.equal(settled.length,1);assert.equal(settled[0].landing.move,8);assert.equal(settled[0].actor,23);
 assert.deepEqual(settled[0].landing.effects.map(e=>e.consumer),['80051ec0']);
 assert.equal(failed.commands.filter(c=>c.arguments[0]===0x06000b00).length,0);
 const second=run(1,20,{slot:1});assert.equal(second.events.find(e=>e.landing.settled).landing.move,6);
 assert.equal(second.commands.filter(c=>c.arguments[0]===0x06000b00).length,0);
});

test('landing state, physical history and feedback match at30/60/144Hz',()=>{
 const runs=[30,60,144].map(hz=>{const {a,events,commands}=run(5,hz);return {events,commands,hull:a.hull,rider:a.articulatedRider,action:a.actionState,landing:a.riderLanding};});
 assert.deepEqual(runs[1],runs[0]);assert.deepEqual(runs[2],runs[0]);
});

test('an unarmed splash earns no result; intact hull physics is unchanged by landing observation',()=>{
 const a=make(),b=make({enabled:false});
 for(let i=0;i<60;i++){stepNativeRaceAdapter(a,.05,{});stepNativeRaceAdapter(b,.05,{});assert.equal(a.lastFrame.landing.settled,false);assert.deepEqual(a.hull,b.hull);}
 assert.equal(a.actionState.field15ecBits,0);
});

test('a prepared folded hull repairs only positions when its landing countdown expires during simulation0',()=>{
 const a=make({landingTicks:1,sourceState:{simulationState:0}});
 [a.hull.points[0].position,a.hull.points[2].position]=[a.hull.points[2].position,a.hull.points[0].position];
 const before=structuredClone(a.hull);
 stepNativeRaceAdapter(a,.05,{});
 assert.equal(a.lastFrame.landing.settled,true);assert.equal(a.lastFrame.landing.hullReset,true);assert.equal(a.hull.ticks,0);
 assert.notDeepEqual(a.hull.points.map(p=>p.position),before.points.map(p=>p.position));
 assert.deepEqual(a.hull.points.map(({position,...p})=>p),before.points.map(({position,...p})=>p));
 for(const key of ['center','frame','velocity','restLengths','sprayMotionNative'])assert.deepEqual(a.hull[key],before[key]);
 stepNativeRaceAdapter(a,.05,{});assert.equal(a.lastFrame.landing.settled,false);
});

test('actor7 landing reads the actual physical mode157c independently of the contact mode',()=>{
 for(const mode of [0,1]){
  const a=make({landingTicks:1,sourceState:{simulationState:0},recoveryMode:mode});
  stepNativeRaceAdapter(a,.05,{});assert.equal(a.riderLifecycle.state.contactMode,1-mode);
  assert.equal(a.lastFrame.landing.move,mode===0?8:7);assert.deepEqual(a.lastFrame.landing.effects.map(e=>e.consumer),['80051ec0']);
 }
});

test('actual physical landing results feed canonical Stunt scoring and later HUD transfer',()=>{
 for(const [heldFrames,expectedTotal]of [[1,58],[12,0]]){
  const a=make();let state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),
   scene:{activity624:-1,mode620:11,main638:1,gameStateAb24:40}}),awards=[],firstPaid=null;
  const input=(_,frame)=>frame===0?{rawXNative:-70,heldButtons:0x8000}:frame<=heldFrames?{rawXNative:70,heldButtons:0x8000}:{};
  for(let frame=1;frame<=60;frame++){
   stepNativeRaceAdapter(a,.05,input);
   const actual=nativeRaceBodyFields(a),retained=new DataView(new ArrayBuffer(4));
   retained.setUint32(0,a.actionState.field15ecBits);
   assert.equal(actual.stuntMove1604,a.lastFrame.landing.move);
   assert.equal(actual.stuntArc15ecNative,retained.getFloat32(0),'scoring reads the retained action owner');
   const scored=prepareNativeRaceStuntMoveUpdate(state,{racerIndex:0,move:actual.stuntMove1604,primaryArcNative:actual.stuntArc15ecNative});
   awards.push(...scored.awards.map(award=>({frame,...award})));
   state=prepareNativeRaceStuntAwardDisplay(scored.state).state;
   if(firstPaid===null&&nativeRaceStuntAwardsView(state).totals.total>0)firstPaid=frame;
  }
  assert.equal(nativeRaceStuntAwardsView(state).totals.total,expectedTotal);
  if(expectedTotal){
   assert.deepEqual(awards,[{frame:24,kind:'trick',points:58,finish:false}]);assert.equal(firstPaid,46);
   assert.equal(state.raceWords1f94[(0x3a00-0x1f94)/4],1,'positive-roll completion comes from the actual rotation group');
  }else{assert.deepEqual(awards,[]);assert.equal(firstPaid,null);}
 }
});
