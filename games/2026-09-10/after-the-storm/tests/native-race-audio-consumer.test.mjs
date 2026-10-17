import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {consumeNativeRiderAudio,consumeNativeRaceAudio} from '../native-race-audio-consumer.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-race-audio-consumer-reference.json',import.meta.url)));

test('216 original rider-tail executions match event latches, signed rider codes and water acknowledgement',()=>{
 for(const [i,c]of reference.tailCases.entries())assert.deepEqual(consumeNativeRiderAudio(c.input,c.context),c.expected,`tail ${i}`);
});
test('336 complete original C010C executions match packet/global state and every ordered leaf command',()=>{
 for(const [i,c]of reference.cases.entries())assert.deepEqual(consumeNativeRaceAudio(c.input,c.context),c.expected,`complete ${i}`);
});
test('mode4 requires the actual retained secondary stack byte and leaves prior speed uncommitted',()=>{
 const packet=Array(32).fill(0);packet[24]=1;packet[0]=60;packet[31]=17;
 assert.throws(()=>consumeNativeRaceAudio(packet,{audioMode:4,channel:1}),/Invalid native race audio field/);
 const result=consumeNativeRaceAudio(packet,{audioMode:4,channel:1,retainedMode4LaneByte:255});
 assert.deepEqual(result.commands,[{consumer:'bffec',arguments:[1,1,127]}]);
 assert.equal(result.packet[24],0);assert.equal(result.packet[31],17);
 assert.deepEqual(consumeNativeRaceAudio(packet,{audioMode:4,channel:0}).commands,[{consumer:'bffec',arguments:[2,1,127]}]);
 assert.deepEqual(consumeNativeRaceAudio(packet,{audioMode:4,channel:2}).packet,packet);
});
test('rider-event voices latch once and rearm only after the event clears',()=>{
 let packet=Array(32).fill(0);packet[21]=2;packet[27]=3;
 let context={channel:0,mixerLane:0,random4562c:1,riderEvent7ca4:0};
 const first=consumeNativeRiderAudio(packet,context);packet=first.packet;context=first.context;
 assert.deepEqual(first.commands,[{consumer:'c317c',arguments:[0,13]}]);assert.equal(context.riderEvent7ca4,1);
 assert.deepEqual(consumeNativeRiderAudio(packet,context).commands,[]);
 packet[21]=0;packet=consumeNativeRiderAudio(packet,context).packet;
 packet[21]=1;assert.deepEqual(consumeNativeRiderAudio(packet,context).commands,[{consumer:'c317c',arguments:[0,15]}]);
});
test('rank cooldown suppresses announcements while updating remembered place; modes outside racing are inert',()=>{
 const c=structuredClone(reference.cases[0]);c.context.rankDelay=10;c.context.raceMode=0;c.context.channel=0;
 c.input[25]=0;c.input[26]=3;
 const result=consumeNativeRaceAudio(c.input,c.context);
 assert.equal(result.context.rankDelay,10);assert.equal(result.context.rankPlaceWord,0);assert.equal(result.packet[26],0);
 assert.equal(result.commands.some(c=>c.consumer==='c1eb8'),false);
 assert.deepEqual(consumeNativeRaceAudio(c.input,{audioMode:6,channel:0}),{packet:c.input,context:{audioMode:6,channel:0},commands:[]});
});
test('complete consumer preserves caller-owned state and rejects incomplete racing globals',()=>{
 const c=structuredClone(reference.cases[0]),before=structuredClone(c);
 consumeNativeRaceAudio(c.input,c.context);assert.deepEqual(c,before);
 delete c.context.riderEvent7ca4;assert.throws(()=>consumeNativeRaceAudio(c.input,c.context));
 assert.deepEqual(c.input,before.input);
});
