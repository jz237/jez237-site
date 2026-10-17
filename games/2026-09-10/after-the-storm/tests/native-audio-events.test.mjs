import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeAudioEvent} from '../native-audio-events.js';
import {consumeNativeRaceAudio} from '../native-race-audio-consumer.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-audio-events-reference.json',import.meta.url)));
const context=()=>({...reference.cases[0].context,audioMode:7,eventGate7cb8:0,raceMode:0});

test('773 complete original event-handler executions match global writes and ordered sound calls',()=>{
 for(const [i,c]of reference.cases.entries())assert.deepEqual(prepareNativeAudioEvent(c.event,c.parameter,c.context),c.expected,`event ${i}`);
});
test('race start owns the engine gate and distinct audio delays; countdown does not advance them',()=>{
 const g=context(),start=prepareNativeAudioEvent(0x23,0,g);
 assert.equal(start.context.engineGate7ca0,1);assert.equal(start.context.rankDelay,320);
 assert.equal(start.context.delay7cd8,10);assert.equal(start.context.delay7cd4,180);
 assert.deepEqual(start.commands,[{consumer:'c53d4',arguments:[0x06000f00,0x23]},
  {consumer:'c3320',arguments:[10,100,60]}]);
 const countdown=prepareNativeAudioEvent(0x22,3,start.context);
 assert.deepEqual(countdown.context,start.context);assert.deepEqual(countdown.commands.at(-1),{consumer:'c3320',arguments:[13,90,1]});
});
test('start-event state feeds the complete packet consumer without an independent gate or timer copy',()=>{
 const prepared=JSON.parse(readFileSync(new URL('./fixtures/native-race-audio-consumer-reference.json',import.meta.url))).cases[0].context;
 const g={...prepared,...context(),courseIndex:1,engineGate7ca0:0,alternateEngine:0,primaryStart:0,random4562c:0};
 const packet=Array(32).fill(0);packet[3]=packet[4]=packet[7]=1;
 const idle=consumeNativeRaceAudio(packet,g),started=prepareNativeAudioEvent(0x23,0,g);
 const running=consumeNativeRaceAudio(packet,started.context);
 assert.equal(idle.context.primaryStart,1);assert.equal(idle.packet[29],28);
 assert.equal(running.context.primaryStart,0);assert.equal(running.packet[29],19);
 assert.equal(running.context.rankDelay,320);assert.equal(running.context.delay7cd8,10);
 assert.equal(running.commands.some(c=>c.consumer==='bffec'&&c.arguments[1]===15),false);
});
test('versus secondary finish is acknowledged once while primary finish retains its source behavior',()=>{
 const g={...context(),raceMode:1,eventLatch7ca8:0,field7c98:1};
 const first=prepareNativeAudioEvent(0x21,128,g),second=prepareNativeAudioEvent(0x21,128,first.context);
 assert.equal(first.context.eventLatch7ca8,1);assert.equal(first.context.delay7cec,18);
 assert.deepEqual(first.commands.map(c=>c.consumer),['c53d4','c1eb8','c15c8','c1674','c33c8']);
 assert.deepEqual(second.commands.map(c=>c.consumer),['c53d4','c1eb8']);
 assert.deepEqual(prepareNativeAudioEvent(0x21,0,g).commands.map(c=>c.consumer),['c53d4','c1eb8']);
});
test('repeated event counts announce on the fourth and twelfth events and retain signed32 wrap',()=>{
 let g={...context(),counter7cf4:0};const voiced=[];
 for(let i=1;i<=13;i++){
  const result=prepareNativeAudioEvent(0x35,0,g);g=result.context;
  if(result.commands.some(c=>c.consumer==='c32a0'))voiced.push(i);
 }
 assert.deepEqual(voiced,[4,12]);assert.equal(g.delay7cf0,100);
 assert.equal(prepareNativeAudioEvent(0x35,0,{...g,counter7cf4:2147483647}).context.counter7cf4,-2147483648);
});
test('event preparation leaves caller context untouched and requires real retained fields',()=>{
 const g=context(),before=structuredClone(g);prepareNativeAudioEvent(0x21,0,g);assert.deepEqual(g,before);
 for(const edit of [q=>delete q.field7c98,q=>q.primaryPowerByte=256,q=>q.random4562c=-1,q=>q.rankDelay=NaN]){
  const bad=structuredClone(g);edit(bad);assert.throws(()=>prepareNativeAudioEvent(0x23,0,bad));
 }
});
