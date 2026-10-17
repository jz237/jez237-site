import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeContactAudioMaterials,nativeHullAudioPrefix,consumeNativeWetAudio} from '../native-contact-audio.js';
import {consumeNativeImpactAudio} from '../native-impact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-contact-audio-reference.json',import.meta.url)));
const context={raceMode:0,channel:0,mixerLane:0};

test('all nine course contact palettes match original material-selection instructions',()=>{
 for(const c of reference.materials)assert.deepEqual(nativeContactAudioMaterials(c.courseIndex),c.expected);
 const a=nativeContactAudioMaterials(1);a.surfaceCode=0;assert.equal(nativeContactAudioMaterials(1).surfaceCode,52);
 for(const course of [-1,9,.5,NaN])assert.throws(()=>nativeContactAudioMaterials(course));
});
test('156 original packet-prefix executions match speed, signed pitch and landing clamp arithmetic',()=>{
 for(const c of reference.prefixCases)assert.deepEqual(nativeHullAudioPrefix(c.input),c.expected,JSON.stringify(c.input));
});
test('1170 original wet-consumer executions match landing thresholds, signed bytes and dry timers',()=>{
 for(const c of reference.wetCases)assert.deepEqual(consumeNativeWetAudio(c.input,c.context),c.expected,JSON.stringify(c));
});
test('landing emits once, then the retained wet latch produces steady engine-water control',()=>{
 const packet=Array(32).fill(0);packet[3]=81;packet[31]=40;
 const first=consumeNativeWetAudio(packet,context);
 assert.deepEqual(first.commands,[{consumer:'bffec',arguments:[2,12,115]},
  {consumer:'c53d4',arguments:[0x06000006,0xffffffff]}]);
 assert.equal(first.packet[7],1);assert.equal(packet[7],0);
 const second=consumeNativeWetAudio(first.packet,context);
 assert.deepEqual(second.commands,[{consumer:'c53d4',arguments:[0x06000006,127]}]);
 assert.deepEqual(second.packet.slice(10,12),[0,0]);
 second.packet[3]=0;
 const airborne=consumeNativeWetAudio(second.packet,context);
 assert.deepEqual(airborne.commands,[{consumer:'c53d4',arguments:[0x06000006,0]}]);
 assert.equal(airborne.packet[7],0);
 assert.deepEqual(consumeNativeWetAudio(airborne.packet,context).packet.slice(10,12),[0,1]);
});
test('wet transition runs before marked-box contact gating and course palette selection',()=>{
 const packet=Array(32).fill(0);packet[3]=81;packet[18]=64;packet[19]=127;packet[20]=1;packet[31]=40;
 const g={...nativeContactAudioMaterials(8),channel:0,mixerLane:0,pairedImpact:0,pairedVariant:0,random4562c:0};
 assert.deepEqual(consumeNativeImpactAudio(packet,g).commands,[]);
 const wet=consumeNativeWetAudio(packet,context),impact=consumeNativeImpactAudio(wet.packet,g);
 assert.deepEqual(impact.commands,[{consumer:'bffec',arguments:[2,61,127]}]);
 assert.equal(impact.packet[13],7);
});
test('packet31 retains previous speed through both consumers and inputs remain untouched',()=>{
 const packet=Array(32).fill(0);packet[0]=80;packet[31]=15;packet[3]=20;packet[18]=24;packet[19]=127;packet[20]=1;
 const before=structuredClone(packet),wet=consumeNativeWetAudio(packet,context);
 assert.deepEqual(wet.commands[0],{consumer:'bffec',arguments:[2,14,100]});
 const impact=consumeNativeImpactAudio(wet.packet,{...nativeContactAudioMaterials(1),channel:0,mixerLane:0,pairedImpact:0,pairedVariant:0,random4562c:0});
 assert.deepEqual(impact.commands,[{consumer:'bffec',arguments:[2,25,63]}]);
 assert.equal(impact.packet[31],15);assert.deepEqual(packet,before);
});
test('invalid prepared data reject without changing packet or source fields',()=>{
 const input=structuredClone(reference.prefixCases[0].input),before=structuredClone(input);
 for(const [key,value] of [['frameSpeedNative',-1],['record2c8',.5],['bodyBfc',Infinity],['verticalFrameB7c',1e20],['landingC7e',65536]]){
  const candidate={...input,[key]:value,landingC7e:key==='landingC7e'?value:1};assert.throws(()=>nativeHullAudioPrefix(candidate));
 }
 assert.deepEqual(input,before);
 for(const bad of [Array(31).fill(0),Array(32).fill(256),Array(32).fill(-1)])assert.throws(()=>consumeNativeWetAudio(bad,context));
 assert.throws(()=>consumeNativeWetAudio(Array(32).fill(0),{...context,channel:3}));
});
