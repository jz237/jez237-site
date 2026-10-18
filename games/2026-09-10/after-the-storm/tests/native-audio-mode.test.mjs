import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeAudioMode} from '../native-audio-mode.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-audio-mode-reference.json',import.meta.url)));
test('complete original mode entries preserve direct global writes, mode exceptions and ordered leaf calls',()=>{
 for(const c of reference.cases)assert.deepEqual(prepareNativeAudioMode(c.mode,c.parameter,c.input,c.context),c.expected,JSON.stringify({mode:c.mode,parameter:c.parameter,context:c.context}));
});
test('mode preparation leaves retained inputs unchanged and requires recovered course rows',()=>{
 const c=reference.cases.find(c=>c.mode===7),before=structuredClone(c);
 const out=prepareNativeAudioMode(c.mode,c.parameter,c.input,c.context);
 out.context.musicSelection=999;out.state.hold=255;assert.deepEqual(c,before);
 assert.throws(()=>prepareNativeAudioMode(7,9,c.input,c.context),/integer/);
 assert.throws(()=>prepareNativeAudioMode(7,1,c.input,{...c.context,cueBase7e05:-1}),/mode field/);
});
test('live mode transitions agree with original sequential execution including nested priority and delayed voice calls',()=>{
 const owner=createNativeRaceContactAudio({players:1,courseIndex:1});
 for(const c of reference.history){
  owner.applyEffects([{kind:'externalCall',consumer:'800c21f4',arguments:[c.mode,c.parameter]}]);
  const snapshot=owner.snapshot(),context={...snapshot.globals,audioMode:snapshot.audioMode};
  assert.deepEqual(Object.fromEntries(Object.keys(c.expected.context).map(k=>[k,context[k]])),c.expected.context);
  assert.deepEqual(snapshot.announcer,c.expected.state);
  assert.deepEqual(owner.drain().map(({consumer,arguments:args})=>({consumer,arguments:args})),c.expected.commands);
 }
});
