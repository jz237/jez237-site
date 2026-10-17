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
const call=(consumer,...args)=>({kind:'externalCall',consumer,arguments:args});
const start=owner=>owner.applyEffects([call('800bfdd0',0x80192610),call('800bfef8',0x80192630)]);
const field=()=>createNativeWaterField({datumNative:20});
function body(frame,{speed=50,vertical=0,wet=1,landing=0,simulation=3,impacts=createNativeImpactState(),rider=0}={}){
 return {logicalFrames:frame,pendingFrameCompletion:false,frame:{simulationState:simulation,startCenter:{x:0,y:-vertical,z:0}},
  hull:{scale:1,rider,lateralMotionBfc:0,center:{x:speed,y:0,z:0},frame:{forward:{x:0,y:0,z:1}},points:[0,1,2].map(()=>({position:{x:64,y:0,z:0}}))},
  water:{profile:{contactForceNative:1,peakForceNative:1,lowSpeedForceRatio:1},forceNative:0},dryContactFrames16d0:0,
  lastFrame:{actorState:22},wetState:{wetCountC78:wet?12:0,wetFlagC7c:wet,landingC7e:landing},impacts,objectHitKind16d8:0};
}

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
 a.advance([left,right],f,[0,0],[90,180]);
 assert.deepEqual(a.snapshot().packets.map(p=>p.slice(0,4)),[[72,40,244,1],[72,80,15,1]]);
 assert.deepEqual(a.drain(),[],'producing engine inputs must not play unimplemented engine commands');
 const next=createNativeRaceContactAudio({players:1,courseIndex:1});
 assert.throws(()=>next.advance([left],f,[0]),/source record/);
 assert.equal(next.snapshot().frame,0);
});

test('packet production precedes channel start, and impacts read the previous consumed speed',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field(),impacts=createNativeImpactState();impacts.racerImpactNative=.1;
 a.advance([body(1,{impacts})],f,[0],[0]);assert.equal(a.snapshot().packets[0][0],72);assert.equal(a.snapshot().packets[0][31],0);assert.deepEqual(a.drain(),[]);
 start(a);a.advance([body(2,{impacts})],f,[0],[0]);
 assert.deepEqual(a.drain(),[{frame:2,player:0,consumer:'bffec',arguments:[2,21,63]}]);
 assert.equal(a.snapshot().packets[0][31],72);assert.equal(a.snapshot().packets[0][13],7);
 a.advance([body(2,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],7);
 a.advance([body(3,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],6);
});

test('two human landings use independent wet latches and lanes, then drain only once',()=>{
 const a=createNativeRaceContactAudio({players:2,courseIndex:2}),f=field();start(a);
 a.advance([body(1,{wet:0}),body(1,{wet:0,rider:1})],f,[0,0],[0,0]);
 a.advance([body(2,{landing:1,vertical:-1}),body(2,{landing:1,vertical:-1,rider:1})],f,[0,0],[0,0]);
 assert.deepEqual(a.drain(),[0,1].map(player=>({frame:2,player,consumer:'bffec',arguments:[player?5:2,11,121]})));
 assert.deepEqual(a.drain(),[]);a.advance([body(3),body(3,{rider:1})],f,[0,0],[0,0]);assert.deepEqual(a.drain(),[]);
});

test('inactive source frames retain motion; physics scalar query supplies immersion rather than render height',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();start(a);
 // A sloped triangular cell makes the normalized query differ from its mesh.
 const location=queryNativeWaterField(f,64,0);location.indices.forEach((index,i)=>f.heightQ[index]=i*25*256);
 a.advance([body(1,{vertical:2})],f,[0],[0]);const previous=a.snapshot(),q=queryNativeWaterField(f,64,0);
 assert.notEqual(q.sourcePlaneQueryNative,q.renderHeightNative);
 assert.equal(previous.packets[0][15],nativeContactImmersion({waterQueryNative:q.sourcePlaneQueryNative,point90YNative:0,pointD0YNative:0}));
 a.advance([body(2,{speed:0,vertical:0,simulation:0})],f,[0],[0]);assert.deepEqual(a.snapshot().motion,previous.motion);
 assert.equal(a.snapshot().packets[0][0],previous.packets[0][0]);
 const exposed=a.snapshot();exposed.packets[0][0]=255;assert.notEqual(a.snapshot().packets[0][0],255);
});

test('source stops and result mode suppress consumption without erasing retained cooldown',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:7}),f=field(),impacts=createNativeImpactState();impacts.shoreImpactNative=1;start(a);
 a.advance([body(1,{impacts})],f,[0],[0]);a.drain();const cooldown=a.snapshot().packets[0][13];
 a.applyEffects([call('800c1f60',4)]);a.advance([body(2,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().packets[0][13],cooldown);
 start(a);assert.equal(a.snapshot().packets[0][13],cooldown);
 a.applyEffects([call('800c21f4',4,0)]);a.advance([body(3,{impacts})],f,[0],[0]);assert.deepEqual(a.drain(),[]);assert.equal(a.snapshot().audioMode,4);
});

test('suspended rendering has a bounded contact backlog, preserving the newest events',()=>{
 const a=createNativeRaceContactAudio({players:1,courseIndex:1}),f=field();start(a);
 for(let i=1;i<=80;i++){const impacts=createNativeImpactState();impacts[i%2?'shoreImpactNative':'fixedSphereImpactNative']=1;a.advance([body(i,{impacts})],f,[0],[0]);}
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
