import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeImpactAudioPacket,consumeNativeImpactAudio} from '../native-impact-audio.js';
import {createNativeImpactState} from '../native-impact-state.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-impact-audio-reference.json',import.meta.url)));
const consumer=JSON.parse(readFileSync(new URL('./fixtures/native-impact-audio-consumer-reference.json',import.meta.url)));
const input=()=>({impacts:createNativeImpactState(),objectHitKind16d8:0,frameSpeedNative:0,recordFlag318:0});

test('1004 original instruction cases match collision priority, volume and retained type bytes',()=>{
 for(const c of reference.cases)assert.deepEqual(nativeImpactAudioPacket(c.input,c.previousType),c.expected,JSON.stringify(c.input));
});
test('a tiny higher-priority racer impact overrides a strong ice break; marked boxes use their separate code',()=>{
 const c=input();c.impacts.racerImpactNative=.0001;c.impacts.objectImpactNative=10;c.objectHitKind16d8=2;
 assert.deepEqual(nativeImpactAudioPacket(c,99),{type:0x14,strength:1,trigger:1});
 c.impacts.racerImpactNative=0;assert.deepEqual(nativeImpactAudioPacket(c,99),{type:2,strength:127,trigger:1});
 c.impacts.objectImpactNative=0;c.impacts.boxImpactNative=.1;c.impacts.markedBox=true;
 assert.deepEqual(nativeImpactAudioPacket(c,99),{type:0x40,strength:46,trigger:1});
});
test('no-contact packets retain type at zero volume; malformed inputs cannot mutate the owner',()=>{
 const c=input(),before=JSON.stringify(c);assert.deepEqual(nativeImpactAudioPacket(c,73),{type:73,strength:0,trigger:1});
 assert.equal(JSON.stringify(c),before);
 assert.deepEqual(nativeImpactAudioPacket({...c,recordFlag318:1,frameSpeedNative:-0},73),{type:40,strength:0,trigger:1});
 for(const edit of [q=>q.impacts.boxImpactNative=-1,q=>q.impacts.markedBox=1,q=>q.frameSpeedNative=Infinity,q=>q.recordFlag318=.5,q=>q.impacts.racerImpactNative=1e9]){
  const q=structuredClone(c);edit(q);assert.throws(()=>nativeImpactAudioPacket(q,0));
 }
 assert.throws(()=>nativeImpactAudioPacket(c,256));
});
test('2600 original consumer executions match cooldown, speed bands, ice one-shots and paired crash commands',()=>{
 for(const c of consumer.cases)assert.deepEqual(consumeNativeImpactAudio(c.input,c.context),c.expected,JSON.stringify({packet:c.input,context:c.context}));
});
test('ice break consumes its code even at zero volume and cannot replay on the next silent frame',()=>{
 const c=input();c.impacts.objectImpactNative=10;c.objectHitKind16d8=2;
 const p=Array(32).fill(0),g={channel:0,mixerLane:0,surfaceCode:28,markedBoxCode:64,floorCode:65,pairedImpact:0,pairedVariant:0,random4562c:0};
 const selected=nativeImpactAudioPacket(c,0);p[18]=selected.type;p[19]=0;p[20]=selected.trigger;
 const before=JSON.stringify([p,g]),first=consumeNativeImpactAudio(p,g);assert.equal(JSON.stringify([p,g]),before);
 assert.deepEqual(first.commands,[{consumer:'c53d4',arguments:[0x06000700,0x13]}]);assert.equal(first.packet[18],0);
 const next=nativeImpactAudioPacket(input(),first.packet[18]);first.packet[18]=next.type;first.packet[19]=next.strength;first.packet[20]=next.trigger;
 assert.deepEqual(consumeNativeImpactAudio(first.packet,first.context).commands,[]);
});
test('repeated producer/consumer frames preserve the native re-trigger interval and softer cooldown gain',()=>{
 const c=input();c.impacts.primaryBuoyImpactNative=1;
 let packet=Array(32).fill(0),context={channel:0,mixerLane:0,surfaceCode:28,markedBoxCode:64,floorCode:65,pairedImpact:0,pairedVariant:0,random4562c:0};packet[31]=40;
 const heard=[];
 for(let frame=0;frame<9;frame++){
  const q=nativeImpactAudioPacket(c,packet[18]);packet[18]=q.type;packet[19]=q.strength;packet[20]=q.trigger;
  const result=consumeNativeImpactAudio(packet,context);packet=result.packet;context=result.context;
  for(const command of result.commands)heard.push({frame,...command});
 }
 assert.deepEqual(heard,[{frame:0,consumer:'bffec',arguments:[2,25,127]},
  {frame:4,consumer:'bffec',arguments:[2,25,79]},{frame:8,consumer:'bffec',arguments:[2,25,79]}]);
});
