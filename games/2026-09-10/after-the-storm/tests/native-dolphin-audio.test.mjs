import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeDolphinAudio as prepare} from '../native-dolphin-audio.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-audio.json.gz',import.meta.url))));
function setup(c){const actorWordsF060=[...e.baseActorWords];for(const [i,w]of c.input.actorOverrides)actorWordsF060[i]=w;return {...c.input,actorWordsF060};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('complete dolphin packet consumption matches original numeric stores and fully expanded sound commands',()=>{
 assert.equal(e.cases.length,432);assert.equal(e.instructions,8394);
 for(const [i,c]of e.cases.entries()){
  const input=setup(c),before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256);
  assert.deepEqual(input,before);assert.ok(Object.isFrozen(q.actorWordsF060));
 }
});
test('audio gates preserve pending cues and read no unused distance or race-mode input',()=>{
 const input=setup(e.cases[0]);input.actorWordsF060[0x1608/4]=0x7fc00000;
 for(const audioContext of [{audioMode:0},{audioMode:7,courseIndex:1}]){
  const q=prepare({...input,audioContext});assert.deepEqual(q.operations,[]);assert.deepEqual(q.actorWordsF060,input.actorWordsF060);
 }
 assert.throws(()=>prepare({...input,audioContext:{audioMode:7,courseIndex:0,raceMode:0}}),/Nonfinite dolphin audio distance/);
});
test('late invalid packet input cannot commit prior cue acknowledgements',()=>{
 const input=setup(e.cases.find(c=>c.operations.some(o=>o.kind==='presentationActorWrite')));
 input.actorWordsF060[0x1608/4]=0x7fc00000;const before=structuredClone(input);
 assert.throws(()=>prepare(input),/Nonfinite dolphin audio distance/);assert.deepEqual(input,before);
});
