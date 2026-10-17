import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeEngineEnvelope,consumeNativeEngineAudio,consumeNativeSprayAudio} from '../native-engine-audio.js';
import {consumeNativeWetAudio} from '../native-contact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-engine-audio-reference.json',import.meta.url)));

test('56 original envelope executions match signed loads, speed reset and throttle suppression',()=>{
 for(const [i,c]of reference.envelopeCases.entries())assert.deepEqual(prepareNativeEngineEnvelope(c.input),c.expected,`envelope ${i}`);
});
test('474 original engine executions match every speed/boost entry and all mixer channels',()=>{
 for(const [i,c]of reference.engineCases.entries())assert.deepEqual(consumeNativeEngineAudio(c.input,c.context,c.envelope),c.expected,`engine ${i}`);
});
test('108 consecutive original frames match retained pitch and throttle surge decay',()=>{
 for(const [i,c]of reference.historyCases.entries())assert.deepEqual(consumeNativeEngineAudio(c.input,c.context,c.envelope),c.expected,`history ${i}`);
});
test('132 original spray executions match thresholds, alternate engines, course variants and channel suppression',()=>{
 for(const [i,c]of reference.sprayCases.entries())assert.deepEqual(consumeNativeSprayAudio(c.input,c.context),c.expected,`spray ${i}`);
});
test('72 continuous original executions match the envelope, wet, engine and spray sequence',()=>{
 for(const [i,c]of reference.combinedCases.entries()){
  const prepared=prepareNativeEngineEnvelope(c.input),wet=consumeNativeWetAudio(prepared.packet,c.context);
  const engine=consumeNativeEngineAudio(wet.packet,c.context,prepared.envelope),spray=consumeNativeSprayAudio(engine.packet,engine.context);
  assert.deepEqual({packet:spray.packet,context:engine.context,commands:[...wet.commands,...engine.commands,...spray.commands]},c.expected,`combined ${i}`);
 }
});
test('envelope is prepared before wet transitions and engine consumes the resulting wet latch',()=>{
 const p=Array(32).fill(0);p[0]=40;p[1]=60;p[8]=60;p[4]=p[6]=p[7]=1;
 const prepared=prepareNativeEngineEnvelope(p),g=structuredClone(reference.engineCases[0].context);
 const wet=consumeNativeWetAudio(prepared.packet,{raceMode:0,channel:0,mixerLane:0});
 assert.equal(wet.packet[7],0);assert.deepEqual(prepared.envelope,{volume:116,speedIndex:40});
 const actual=consumeNativeEngineAudio(wet.packet,g,prepared.envelope);
 const markedWet=wet.packet.slice();markedWet[7]=1;
 const manuallyAdjusted=consumeNativeEngineAudio(markedWet,g,{volume:132,speedIndex:72});
 assert.deepEqual(actual.commands,manuallyAdjusted.commands);assert.deepEqual(actual.context,manuallyAdjusted.context);
 assert.equal(actual.commands.at(-1).arguments[1],0x3f800000);
});
test('consumers preserve caller-owned packets and context and reject invalid retained state',()=>{
 const c=structuredClone(reference.engineCases[0]),before=structuredClone(c);
 consumeNativeEngineAudio(c.input,c.context,c.envelope);prepareNativeEngineEnvelope(c.input);
 assert.deepEqual(c,before);
 for(const edit of [q=>q.input[29]=30,q=>q.input[29]=255,q=>q.context.channel=3,q=>q.context.primaryPitchBits=0x7f800000,q=>q.context.rivalPanByte=-1,q=>q.envelope.volume=NaN]){
  const invalid=structuredClone(c);edit(invalid);assert.throws(()=>consumeNativeEngineAudio(invalid.input,invalid.context,invalid.envelope));
 }
});
