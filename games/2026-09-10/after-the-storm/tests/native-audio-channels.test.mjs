import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeAudioChannel,resetNativeAudioPacket} from '../native-audio-channels.js';
import {consumeNativeImpactAudio} from '../native-impact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-audio-channels-reference.json',import.meta.url)));
const context=()=>structuredClone(reference.cases[0].context);

test('864 complete original channel-entry executions preserve all globals, packet bytes and command order',()=>{
 for(const c of reference.cases)assert.deepEqual(prepareNativeAudioChannel(c.entry,c.input,c.context),c.expected,JSON.stringify(c));
});
test('256 original packet resets retain every byte outside the source reset stores',()=>{
 for(const c of reference.resets)assert.deepEqual(resetNativeAudioPacket(c.input),c.expected);
});
test('the real primary entry includes the enable and rank-delay prefix absent from Ghidra function boundaries',()=>{
 const packet=Array(32).fill(19),g=context();g.primaryMuted=1;g.rankDelay=23;
 const entry=prepareNativeAudioChannel('800bfdd0',packet,g),inner=prepareNativeAudioChannel('800bfde4',packet,g);
 assert.equal(entry.globals.primaryMuted,0);assert.equal(entry.globals.rankDelay,400);
 assert.equal(inner.globals.primaryMuted,1);assert.equal(inner.globals.rankDelay,23);
 assert.deepEqual(entry.commands,inner.commands);assert.deepEqual(entry.packet,inner.packet);
 assert.deepEqual(entry.commands.map(c=>c.arguments[0]),[0x01000000,0x01000200,0x04000000,0x06000000]);
});
test('alternate start retains its packet argument when it selects the secondary mixer channel',()=>{
 const packet=Array.from({length:32},(_,i)=>i),g=context();g.courseIndex=1;g.raceMode=0;g.primaryMuted=1;g.secondaryMuted=1;
 const out=prepareNativeAudioChannel('800bfe70',packet,g);
 assert.equal(out.globals.primaryMuted,1);assert.equal(out.globals.secondaryMuted,0);
 assert.deepEqual(out.packet,resetNativeAudioPacket(packet));
 assert.deepEqual(out.commands[0],{consumer:'800c538c',arguments:[0x01000300,0x3f800000]});
 assert.deepEqual(packet,Array.from({length:32},(_,i)=>i));assert.equal(g.secondaryMuted,1);
 g.raceMode=2;
 assert.deepEqual(prepareNativeAudioChannel('800bfe70',packet,g),{packet,globals:g,commands:[]});
});
test('course-zero alternate start preserves the companion flag and rank cooldown',()=>{
 const packet=Array(32).fill(99),g=context();g.courseIndex=0;g.primaryCompanionFlag=71;g.rankDelay=18;
 const out=prepareNativeAudioChannel('800bfe70',packet,g);
 assert.equal(out.globals.primaryCompanionFlag,71);assert.equal(out.globals.rankDelay,18);
 assert.equal(out.globals.alternateEngine,1);assert.equal(out.globals.primaryMuted,0);
 assert.deepEqual(out.commands,[{consumer:'800c538c',arguments:[0x01000200,0x3f800000]}]);
});
test('packet restart preserves impact suppression and previous speed rather than replaying the previous contact',()=>{
 const input=Array(32).fill(0);input[13]=6;input[22]=24;input[31]=40;
 const started=prepareNativeAudioChannel('800bfdd0',input,context()),packet=started.packet;
 packet[18]=24;packet[19]=127;packet[20]=1;
 const out=consumeNativeImpactAudio(packet,{channel:0,mixerLane:0,surfaceCode:52,markedBoxCode:44,floorCode:0,
  pairedImpact:0,pairedVariant:0,random4562c:0});
 assert.deepEqual(out.commands,[]);assert.equal(out.packet[13],5);assert.equal(out.packet[31],40);
});
test('stops leave packets and unrelated channel state intact and reject invalid requests atomically',()=>{
 const packet=Array(32).fill(81),g=context();g.primaryMuted=0;g.secondaryMuted=0;
 const stopped=prepareNativeAudioChannel('800bfd34',packet,g);
 assert.deepEqual(stopped.packet,packet);assert.equal(stopped.globals.primaryMuted,1);assert.equal(stopped.globals.secondaryMuted,0);
 assert.deepEqual(stopped.commands,[{consumer:'800c53d4',arguments:[0x06000004,0xffffffff]}]);
 const before=structuredClone([packet,g]);
 assert.throws(()=>prepareNativeAudioChannel('80000000',packet,g));
 assert.throws(()=>prepareNativeAudioChannel('800bfdd0',packet,{...g,primaryPitchBits:NaN}));
 assert.throws(()=>resetNativeAudioPacket(Array(32).fill(-1)));
 assert.deepEqual([packet,g],before);
});
