import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeStuntRingAudio} from '../native-stunt-ring-audio.js';
import {prepareNativeAnnouncer,freshNativeAnnouncer} from '../native-announcer.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-ring-audio-reference.json',import.meta.url)));
const call=(consumer,...args)=>({kind:'externalCall',consumer,arguments:args});

test('ring sound and commentary commands match270 original executions on all nine courses',()=>{
 for(const c of reference.cases)assert.deepEqual(prepareNativeStuntRingAudio(c.streak,c.courseIndex),c.expected);
 assert.throws(()=>prepareNativeStuntRingAudio(1,9),/Invalid/);
 assert.throws(()=>prepareNativeStuntRingAudio(0x100000000,0),/Invalid/);
});

test('full streak comparisons stay distinct from the sound byte, and full-course commentary follows the milestone',()=>{
 assert.deepEqual(prepareNativeStuntRingAudio(260,1),[
  {consumer:'c53d4',arguments:[0x06000f01,4]},{consumer:'c53d4',arguments:[0x06000f00,0x25]}]);
 const commands=prepareNativeStuntRingAudio(12,1);
 assert.deepEqual(commands.slice(2),[
  {consumer:'c3464',arguments:[106,20,20,20]},{consumer:'c3464',arguments:[107,20,32,30]}]);
 for(const raceMode of [0,1,2,3]){
  const g={raceMode,courseIndex:1,audioMode:7,delay7cd8:0};let state=freshNativeAnnouncer();
  for(const c of commands.slice(2))state=prepareNativeAnnouncer(state,c,g).state;
  assert.deepEqual(state,raceMode===3?{...freshNativeAnnouncer(),delayedNote:107,delay:20,delayedPriority:32,delayedHold:30}:freshNativeAnnouncer());
 }
 const blocked={...freshNativeAnnouncer(),delayedNote:99,delay:5,delayedPriority:90,delayedHold:30};
 assert.deepEqual(prepareNativeAnnouncer(blocked,commands.at(-1),{raceMode:3,courseIndex:1,audioMode:7,delay7cd8:0}).state,blocked);
});

test('the actual ring entry updates the shared announcer slot and finish transitions cancel its pending voice',()=>{
 const owner=createNativeRaceContactAudio({players:1,courseIndex:1});
 owner.applyEffects([call('800c21f4',1,3),call('800c21f4',7,1)]);owner.clearPendingSounds();
 assert.equal(owner.snapshot().globals.raceMode,3);
 owner.applyEffects([call('800c3628',4)]);
 assert.deepEqual(owner.snapshot().announcer,{...freshNativeAnnouncer(),delayedNote:100,delay:20,delayedPriority:16,delayedHold:10});
 owner.applyEffects([call('800c3628',12)]);
 assert.deepEqual(owner.snapshot().announcer,{...freshNativeAnnouncer(),delayedNote:107,delay:20,delayedPriority:32,delayedHold:30});
 owner.applyEffects([call('800c21f4',6,0)]);
 assert.equal(owner.snapshot().announcer.delayedHold,0);assert.equal(owner.snapshot().announcer.delay,0);
 const before=owner.snapshot();owner.applyEffects([{kind:'recordWordWrite',consumer:'800c3628',arguments:[4]}]);
 assert.deepEqual(owner.snapshot(),before,'unrelated record writes cannot be interpreted as audio calls');
});
