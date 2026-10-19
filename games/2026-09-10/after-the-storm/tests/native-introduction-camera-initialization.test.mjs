import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionCameraInitialization as prepare} from '../native-introduction-camera-initialization.js';
import {prepareNativeIntroductionCameraInitializationUpdate as update} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-introduction-camera-initialization.json',import.meta.url)));
const hi=a=>(a-0x7788)/4;
function input(c){const h=[...source.baseHud];for(const [i,v]of c.input.hudOverrides)h[i]=v;return {...c.input,hudWords7788:h};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
test('introduction camera setup matches complete original execution for every course/class and warm basis',()=>{
 assert.equal(source.caseCount,324);
 for(const c of source.cases){
  const v=input(c),before=structuredClone(v),q=prepare(v);
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.hudWords7788),c.hudSHA256);assert.deepEqual(v,before);
  assert.equal(q.diagnostic.scriptAddress,source.selectedScripts[`${v.courseIndex}:${v.difficulty}`]);
  assert.equal(q.diagnostic.scriptExecuted,false);assert.ok(Object.isFrozen(q.hudWords7788));
  for(let i=0;i<v.players;i++){
   const a=hi(0x7e98+i*0xe0),s=hi(0x8058+i*0x38);
   assert.deepEqual(q.hudWords7788.slice(a,a+56),v.hudWords7788.slice(a,a+56));
   assert.equal(q.hudWords7788[s],v.hudWords7788[s]);assert.equal(q.hudWords7788[s+2],0);
  }
 }
});
test('canonical initialization preserves cup points and uses retained scene values over external overrides',()=>{
 const seed=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
 const c=source.cases.find(c=>c.input.players===1&&c.input.courseIndex===1&&c.input.difficulty===2),v=input(c);
 seed.scene.main638=8;seed.scene.courseIndex=1;seed.profileWordsB330[2]=2;seed.profileWordsB330.splice(4,4,7,4,2,1);seed.hudWords7788=v.hudWords7788;
 const before=structuredClone(seed),q=update(seed,{datumNative:v.datumNative,players:2,courseIndex:0,difficulty:0,main638:9});
 assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.state.hudWords7788),c.hudSHA256);
 assert.deepEqual(q.state.profileWordsB330,seed.profileWordsB330);assert.deepEqual(q.state.raceWords1f94,seed.raceWords1f94);
 assert.deepEqual(q.state.scene,seed.scene);assert.deepEqual(seed,before);assert.equal(q.effects.length,2);
});
test('late invalid camera or degenerate warm basis cannot partially change caller state',()=>{
 const v=input(source.cases.find(c=>c.input.players===2)),original=structuredClone(v);
 v.hudWords7788[hi(0x7d8c)]=1;const bad=structuredClone(v);
 assert.throws(()=>prepare(v),/type5/);assert.deepEqual(v,bad);
 v.hudWords7788=original.hudWords7788;
 for(let i=0;i<3;i++)v.hudWords7788[hi(0x7f78+0x10+i*4)]=v.hudWords7788[hi(0x7f78+4+i*4)];
 const degenerate=structuredClone(v);assert.throws(()=>prepare(v),/Degenerate/);assert.deepEqual(v,degenerate);
 assert.throws(()=>prepare({...original,courseIndex:9}),/courseIndex/);
 assert.throws(()=>prepare({...original,difficulty:3}),/difficulty/);
 assert.throws(()=>prepare({...original,main638:0}),/main8/);
});
