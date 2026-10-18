import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
import {nativeContactImmersion} from '../native-contact-audio.js';
import {consumeNativeImpactAudio} from '../native-impact-audio.js';
import {createNativeImpactState} from '../native-impact-state.js';
import {createNativeWaterField,queryNativeWaterField} from '../native-water-field.js';
import {createRace} from '../race-core.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {getCourse} from '../courses.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
const call=(consumer,...args)=>({kind:'externalCall',consumer,arguments:args});
const start=owner=>owner.applyEffects([call('800bfdd0',0x80192610),call('800bfef8',0x80192630)]);
const field=()=>createNativeWaterField({datumNative:20});
function advance(owner,adapters,field,recordFlags318,recordMotion2c8,recordPower12c=adapters.map(()=>0),recordPlace4=adapters.map(()=>0)){
 owner.advance(adapters,field,{recordFlags318,recordMotion2c8,recordPower12c,recordPlace4,
  sprayLeft1c5c:adapters.map(()=>0),sprayRight1c60:adapters.map(()=>0)});
}
function body(frame,{speed=50,vertical=0,wet=1,landing=0,simulation=3,impacts=createNativeImpactState(),rider=0}={}){
 return {logicalFrames:frame,pendingFrameCompletion:false,frame:{simulationState:simulation,startCenter:{x:0,y:-vertical,z:0},controls:{heldButtons:0}},
  hull:{scale:1,rider,lateralMotionBfc:0,center:{x:speed,y:0,z:0},frame:{forward:{x:0,y:0,z:1}},points:[0,1,2].map(()=>({position:{x:64,y:0,z:0}}))},
  water:{profile:{contactForceNative:1,peakForceNative:1,lowSpeedForceRatio:1},forceNative:0},dryContactFrames16d0:0,
  lastFrame:{actorState:22,animationFrame:0},riderLifecycle:{state:{crashCountdown:0}},wetState:{wetCountC78:wet?12:0,wetFlagC7c:wet,landingC7e:landing},impacts,objectHitKind16d8:0};
}

test('live actor audio reads raw buttons, completed recovery and retained animation events',()=>{
 const owner=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();
 const inputs=[[22,0,5,0x8000],[7,55,0,0],[7,56,0,0],[7,58,0,0],[24,0,0,0],[22,0,0,0]];
 const expected=[[1,2,0],[0,2,0],[0,0,0],[0,0,1],[0,1,1],[0,0,1]];
 for(let i=0;i<inputs.length;i++){
  const [actor,animation,crash,buttons]=inputs[i],b=body(i+1);
  b.lastFrame.actorState=actor;b.lastFrame.animationFrame=animation;b.riderLifecycle.state.crashCountdown=crash;
  b.frame.controls={heldButtons:buttons,engineMask:0,throttle:false};
  advance(owner,[b],f,[0],[0]);const packet=owner.snapshot().packets[0];
  assert.deepEqual([packet[4],packet[21],packet[28]],expected[i]);
 }
 assert.deepEqual(owner.drain(),[],'new packet fields must not invent unconnected voice playback');
});

test('live crash and remount voices follow the original zero-to-event edge for both actual riders',()=>{
 const owner=createNativeRaceContactAudio({players:2,courseIndex:1}),f=field();start(owner);
 const events=[[22,0],[22,5],[22,5],[24,0],[22,0],[24,0]];
 for(let i=0;i<events.length;i++){
  const bodies=[body(i+1,{rider:0}),body(i+1,{rider:3})];
  for(const b of bodies){b.lastFrame.actorState=events[i][0];b.riderLifecycle.state.crashCountdown=events[i][1];}
  advance(owner,bodies,f,[0,0],[0,0]);const commands=owner.drain().filter(c=>c.consumer==='c53d4'&&c.arguments[0]>>>8===0x06000a);
  if(i===1||i===5){
   const variant=((Math.imul(i+1,1664525)+1013904223)>>>0)&1,offset=i===5?2:0;
   assert.deepEqual(commands.map(c=>c.arguments),[[0x06000a01,variant+offset],[0x06000a02,12+variant+offset]]);
  }else assert.deepEqual(commands,[],'holding or changing a nonzero event must not replay the voice');
  assert.deepEqual(owner.snapshot().packets.map(p=>p[23]),owner.snapshot().packets.map(p=>p[21]));
 }
 assert.equal(owner.snapshot().globals.riderEvent7ca4,1);
});

test('a physical rider water-entry edge emits drum1 once and acknowledges its source packet',()=>{
 const owner=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();start(owner);
 const q=queryNativeWaterField(f,64,0).sourcePlaneQueryNative;
 for(let i=0;i<4;i++){
  const b=body(i+1);b.lastFrame.actorState=23;b.articulatedRider={jointWorld:{x:64,y:i===2?q:q-1,z:0}};
  advance(owner,[b],f,[0],[0]);const hits=owner.drain().filter(c=>c.consumer==='bffec'&&c.arguments[1]===1);
  assert.equal(hits.length,i===0||i===3?1:0);if(hits.length)assert.deepEqual(hits[0].arguments,[2,1,127]);
  assert.equal(owner.snapshot().packets[0][24],0);assert.equal(owner.snapshot().packets[0][31],owner.snapshot().packets[0][0]);
 }
});

test('live engine channels use physical wetness, canonical power and real source start events',()=>{
 const f=field(),owner=createNativeRaceContactAudio({players:2,courseIndex:1});start(owner);
 const left=body(1,{speed:20}),right=body(1,{speed:50,wet:0});left.frame.controls.heldButtons=0x8000;
 advance(owner,[left,right],f,[0,0],[90,180],[5,1],[0,1]);
 const mix=owner.engineChannels();assert.ok(mix.every(c=>c.enabled));assert.deepEqual(mix.map(c=>c.program),[1,2]);
 assert.ok(mix[1].frequency>mix[0].frequency);assert.deepEqual(mix.map(c=>c.pan),[0,127]);
 assert.deepEqual(owner.snapshot().packets.map(p=>p[14]),[5,1]);assert.equal(owner.snapshot().packets[0][6],1);
 mix[0].frequency=999;assert.notEqual(owner.engineChannels()[0].frequency,999);
 owner.applyEffects([{kind:'audioEntry',consumer:'800c37f4',arguments:[0x23,0]}]);assert.equal(owner.snapshot().globals.engineGate7ca0,1);
 owner.applyEffects([call('800c21f4',7,1)]);assert.equal(owner.snapshot().globals.engineGate7ca0,0);assert.ok(owner.engineChannels().every(c=>!c.enabled));
 const idle=gate=>{const a=createNativeRaceContactAudio({players:1,courseIndex:1});start(a);if(gate)a.applyEffects([{kind:'audioEntry',consumer:'800c37f4',arguments:[0x23,0]}]);const b=body(1,{speed:0});b.frame.controls.heldButtons=0x8000;advance(a,[b],f,[0],[0]);return a;};
 assert.ok(idle(false).drain().some(c=>c.consumer==='bffec'&&c.arguments[1]===15));
 assert.ok(!idle(true).drain().some(c=>c.consumer==='bffec'&&c.arguments[1]===15));
});

test('actual source start reaches the engine gate and audio histories are render-rate independent',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const race=createRace({mode:'versus',physics:'native',course:getCourse('greyhaven'),waveSeed:123});
  for(let i=0;i<hz*6;i++)stepNativeRaceHost(race.nativeHost,1/hz,[{throttle:1},{throttle:0}]);
  const audio=race.nativeContactAudio;assert.equal(audio.snapshot().globals.engineGate7ca0,1);
  histories.push({channels:audio.engineChannels(),packets:audio.snapshot().packets,globals:audio.snapshot().globals,frame:audio.snapshot().frame,
   effectPoll:audio.snapshot().effectPoll,commands:audio.drain()});
 }
 assert.deepEqual(histories[1],histories[0]);assert.deepEqual(histories[2],histories[0]);
});

test('120 original immersion executions preserve midpoint rounding and byte clamp thresholds',()=>{
 const reference=JSON.parse(readFileSync(new URL('./fixtures/native-contact-immersion-reference.json',import.meta.url)));
 for(const c of reference.cases)assert.equal(nativeContactImmersion(c.input),c.expected,JSON.stringify(c.input));
});

test('human impact channels do not require or consume the rival paired-voice random value',()=>{
 const p=Array(32).fill(0);p[18]=0x14;p[19]=127;p[31]=60;
 const c={surfaceCode:52,markedBoxCode:44,floorCode:0,pairedImpact:1,pairedVariant:0,mixerLane:0,channel:0};
 assert.equal(consumeNativeImpactAudio(p,c).commands[0].arguments[2],127);
 assert.throws(()=>consumeNativeImpactAudio(p,{...c,channel:2}),/integer/);
 assert.equal(consumeNativeImpactAudio(p,{...c,channel:2,random4562c:3}).commands.length,2);
});

test('live sound prefix takes record motion and signed hull slip from their separate owners',()=>{
 const a=createNativeRaceContactAudio({players:2,courseIndex:1}),f=field(),left=body(1),right=body(1,{rider:1});
 left.hull.lateralMotionBfc=-2.5;right.hull.lateralMotionBfc=3.8;
 advance(a,[left,right],f,[0,0],[90,180]);
 assert.deepEqual(a.snapshot().packets.map(p=>p.slice(0,4)),[[72,40,244,1],[72,80,15,1]]);
 assert.deepEqual(a.drain(),[],'producing engine inputs must not play unimplemented engine commands');
 const next=createNativeRaceContactAudio({players:1,courseIndex:1});
 assert.throws(()=>advance(next,[left],f,[0]),/source record/);
 assert.equal(next.snapshot().frame,0);
});

test('power and place come from canonical human slots and retain native byte stores',()=>{
 const race=createRace({mode:'versus',physics:'native',course:getCourse('greyhaven')}),retained=race.nativeLaunch.snapshot();
 const base=(0x2938-0x1f94)/4,stride=222;
 for(const [slot,power,place,motion]of [[0,259,-1,90],[1,-1,258,180]]){
  retained.raceWords1f94[base+slot*stride+0x12c/4]=power>>>0;
  retained.raceWords1f94[base+slot*stride+1]=place>>>0;
  retained.raceWords1f94[base+slot*stride+0x2c8/4]=motion;
 }
 retained.scene.primaryHumanIndex=1;retained.scene.secondaryHumanIndex=0;
 const runtime=createNativeRaceLaunchRuntime({players:2,courseIndex:1,initialState:retained,
  racers:race.racers.map(r=>({...r,sourceBuoys:{...r.sourceBuoys}}))});
 const records=runtime.contactAudioInputs();assert.deepEqual(records.slots,[1,0]);
 assert.deepEqual(records.recordPower12c,[-1,259]);assert.deepEqual(records.recordPlace4,[258,-1]);
 const owner=createNativeRaceContactAudio({players:2,courseIndex:1});
 owner.advance([body(1,{rider:1}),body(1)],field(),{...records,sprayLeft1c5c:[0,0],sprayRight1c60:[0,0]});
 assert.deepEqual(owner.snapshot().packets.map(p=>[p[1],p[14],p[25]]),[[80,255,2],[40,3,255]]);
 records.recordPower12c[0]=12;assert.equal(runtime.contactAudioInputs().recordPower12c[0],-1);
 const before=owner.snapshot(),invalid={...runtime.contactAudioInputs(),recordPlace4:[0,NaN]};
 assert.throws(()=>owner.advance([body(2),body(2)],field(),invalid),/source record/);assert.deepEqual(owner.snapshot(),before);
});

test('rider-water events follow the physical joint and strict source query, independently of hull wetness',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field(),cell=queryNativeWaterField(f,64,0);
 cell.indices.forEach((index,i)=>f.heightQ[index]=i*25*256);
 const query=queryNativeWaterField(f,64,0);assert.notEqual(query.sourcePlaneQueryNative,query.renderHeightNative);
 const fall=(frame,y,actor=23)=>{
  const b=body(frame,{wet:0});b.lastFrame.actorState=actor;
  b.articulatedRider={jointWorld:{x:64,y,z:0}};return b;
 };
 advance(a,[fall(1,query.sourcePlaneQueryNative-1)],f,[0],[0]);
 assert.deepEqual(a.snapshot().riderWater,[{bodyC84:0,bodyC86:1}]);
 assert.equal(a.snapshot().packets[0][24],1);assert.equal(a.snapshot().packets[0][3],0);
 advance(a,[fall(2,query.sourcePlaneQueryNative-1)],f,[0],[0]);assert.equal(a.snapshot().packets[0][24],0);
 advance(a,[fall(3,query.sourcePlaneQueryNative)],f,[0],[0]);
 assert.deepEqual(a.snapshot().riderWater,[{bodyC84:1,bodyC86:0}]);
 advance(a,[fall(4,query.sourcePlaneQueryNative-1,7)],f,[0],[0]);assert.equal(a.snapshot().riderWater[0].bodyC86,0);
 assert.deepEqual(a.drain(),[],'unimplemented mode4 playback must not invent a mixer lane');
 const copy=a.snapshot();copy.riderWater[0].bodyC86=1;assert.equal(a.snapshot().riderWater[0].bodyC86,0);
});

test('packet production precedes channel start, and impacts read the previous consumed speed',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field(),impacts=createNativeImpactState();impacts.racerImpactNative=.1;
 advance(a,[body(1,{impacts})],f,[0],[0]);assert.equal(a.snapshot().packets[0][0],72);assert.equal(a.snapshot().packets[0][31],0);assert.deepEqual(a.drain(),[]);
 start(a);advance(a,[body(2,{impacts})],f,[0],[0]);
 assert.deepEqual(a.drain(),[{frame:2,player:0,consumer:'bffec',arguments:[2,21,63]}]);
 assert.equal(a.snapshot().packets[0][31],72);assert.equal(a.snapshot().packets[0][13],7);
 advance(a,[body(2,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],7);
 advance(a,[body(3,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],6);
});

test('two human landings use independent wet latches and lanes, then drain only once',()=>{
 const a=createNativeRaceContactAudio({players:2,courseIndex:2}),f=field();start(a);
 advance(a,[body(1,{wet:0}),body(1,{wet:0,rider:1})],f,[0,0],[0,0]);
 advance(a,[body(2,{landing:1,vertical:-1}),body(2,{landing:1,vertical:-1,rider:1})],f,[0,0],[0,0]);
 assert.deepEqual(a.drain(),[0,1].map(player=>({frame:2,player,consumer:'bffec',arguments:[player?5:2,11,121]})));
 assert.deepEqual(a.drain(),[]);advance(a,[body(3),body(3,{rider:1})],f,[0,0],[0,0]);assert.deepEqual(a.drain(),[]);
});

test('inactive source frames retain motion; physics scalar query supplies immersion rather than render height',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();start(a);
 // A sloped triangular cell makes the normalized query differ from its mesh.
 const location=queryNativeWaterField(f,64,0);location.indices.forEach((index,i)=>f.heightQ[index]=i*25*256);
 advance(a,[body(1,{vertical:2})],f,[0],[0]);const previous=a.snapshot(),q=queryNativeWaterField(f,64,0);
 assert.notEqual(q.sourcePlaneQueryNative,q.renderHeightNative);
 assert.equal(previous.packets[0][15],nativeContactImmersion({waterQueryNative:q.sourcePlaneQueryNative,point90YNative:0,pointD0YNative:0}));
 advance(a,[body(2,{speed:0,vertical:0,simulation:0})],f,[0],[0]);assert.deepEqual(a.snapshot().motion,previous.motion);
 assert.equal(a.snapshot().packets[0][0],previous.packets[0][0]);
 const exposed=a.snapshot();exposed.packets[0][0]=255;assert.notEqual(a.snapshot().packets[0][0],255);
});

test('source stops and result mode suppress consumption without erasing retained cooldown',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:7}),f=field(),impacts=createNativeImpactState();impacts.shoreImpactNative=1;start(a);
 advance(a,[body(1,{impacts})],f,[0],[0]);a.drain();const cooldown=a.snapshot().packets[0][13];
 a.applyEffects([call('800c1f60',4)]);advance(a,[body(2,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],cooldown);
 start(a);assert.equal(a.snapshot().packets[0][13],cooldown);
 a.applyEffects([call('800c21f4',4,0)]);advance(a,[body(3,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().audioMode,4);
});

test('suspended rendering has a bounded contact backlog, preserving the newest events',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();start(a);
 for(let i=1;i<=80;i++){const impacts=createNativeImpactState();impacts[i%2?'shoreImpactNative':'fixedSphereImpactNative']=1;advance(a,[body(i,{impacts})],f,[0],[0]);}
 assert.equal(a.snapshot().pending,64);assert.equal(a.snapshot().dropped,16);const events=a.drain();assert.equal(events[0].frame,17);assert.equal(events.at(-1).frame,80);
});

test('fresh live one/two-player races enable channels from source fade completion, once per physics frame',()=>{
 for(const mode of ['time','versus']){
  const s=createRace({mode,physics:'native',course:getCourse('greyhaven')}),a=s.nativeContactAudio,h=s.nativeHost;
  assert.equal(a.snapshot().globals.primaryMuted,1);
  const inputs=s.racers.map(()=>({}));let enabledAt=null;
  for(let i=0;i<80;i++){
   const previous=a.snapshot();stepNativeRaceHost(h,.05,inputs);const current=a.snapshot();
   if(previous.globals.primaryMuted&&current.globals.primaryMuted===0){enabledAt=current.frame;assert.equal(h.lastHUD.fade.completion,1);assert.equal(current.packets[0][31],0);}
  }
  assert.ok(enabledAt>1&&enabledAt<80);assert.equal(a.snapshot().globals.primaryMuted,0);assert.equal(a.snapshot().globals.secondaryMuted,0);
  assert.equal(a.snapshot().frame,h.world.frames);const before=a.snapshot();stepNativeRaceHost(h,0,inputs);assert.deepEqual(a.snapshot(),before);
  const retained=s.nativeLaunch.snapshot();retained.hudWords7788[(0x8a14-0x7788)/4]=0;
  const resumed=createRace({mode,physics:'native',course:getCourse('greyhaven'),nativeInitialRaceState:retained});
  assert.equal(resumed.nativeLaunch.snapshot().hudWords7788[(0x8a14-0x7788)/4],0);
 }
});
