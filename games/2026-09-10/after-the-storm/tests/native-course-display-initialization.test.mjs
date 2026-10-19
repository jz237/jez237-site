import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeCourseDisplayInitialization as prepare} from '../native-course-display-initialization.js';
import {NATIVE_COURSE_DISPLAY_ROWS} from '../native-course-display-data.js';
import {createNativeRaceState,prepareNativeCourseDisplayInitializationUpdate as update,prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-course-display-initialization.json',import.meta.url)));
const hash=v=>createHash('sha256').update(v).digest('hex');
test('full course display initialization matches72 original executions and loaded numeric rows',()=>{
 assert.equal(hash(JSON.stringify(NATIVE_COURSE_DISPLAY_ROWS)),source.originalNumericDataSha256);
 for(const c of source.cases){
  const input={...c.input,courseRows9964:source.courseRows9964},before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,c.expected.operations);assert.deepEqual(q.displayWordsB058,c.expected.displayWordsB058);assert.deepEqual(q.lightWords4160,c.expected.lightWords4160);
  const bytes=Buffer.from(Array.from({length:0x3630*2},(_,i)=>(i*17+53)&255)),original=Buffer.from(bytes);
  for(const op of q.operations.filter(o=>o.kind==='courseDisplayGraphicsWrite')){
   const at=op.bufferIndex*0x3630+op.byteOffset;
   if(op.width===1)bytes.writeUInt8(op.value,at);else bytes.writeUInt16BE(op.value,at);
  }
  assert.equal(hash(bytes),c.expected.graphicsSha256);
  for(let buffer=0;buffer<2;buffer++)for(let vertex=0xe0;vertex<0x1c0;vertex+=16)for(const i of [0,1,4,5]){
   const at=buffer*0x3630+vertex+i;assert.equal(bytes[at],original[at],'retained vertex X/Z');
  }
  assert.deepEqual(input,before);assert.ok(Object.isFrozen(q.displayWordsB058));
 }
});
test('canonical display owners initialize together and preserve adjacent game records and saved names',()=>{
 const s=createNativeRaceState({raceWords1f94:Array(1693).fill(17),hudWords7788:Array(1442).fill(31),saveWordsB280:Array(34).fill(59),
  scene:{courseIndex:4,main638:21,initLatch63c:1}}),before=structuredClone(s);
 const q=update(s,{waterExtent2498:1024});assert.equal(q.diagnostic.endingOverride,true);
 assert.deepEqual(q.state.courseDisplayWordsB058.slice(0,68),NATIVE_COURSE_DISPLAY_ROWS[10]);
 assert.deepEqual(q.state.courseDisplayWordsB058.slice(68),NATIVE_COURSE_DISPLAY_ROWS[4]);
 assert.equal(q.effects.length,224);assert.equal(q.state.scene.initLatch63c,1);
 assert.deepEqual(q.state.saveWordsB280,before.saveWordsB280);assert.deepEqual(q.state.raceWords1f94,before.raceWords1f94);assert.deepEqual(q.state.hudWords7788,before.hudWords7788);
 assert.deepEqual(createNativeRaceState(q.state),q.state);assert.deepEqual(s,before);
 assert.throws(()=>apply(q.state,[{kind:'courseDisplayWrite',byteOffset:0,width:4,value:1},{kind:'courseLightWrite',byteOffset:12,width:4,value:0}]),/offset/);
 assert.deepEqual(q.state.courseDisplayWordsB058.slice(0,68),NATIVE_COURSE_DISPLAY_ROWS[10]);
});
test('invalid lighting and late ending rows reject atomically while unused rows stay unread',()=>{
 const input={courseIndex:4,main638:9,waterExtent2498:1024,courseRows9964:structuredClone(source.courseRows9964)};
 input.courseRows9964[10]=null;assert.doesNotThrow(()=>prepare(input));
 const before=structuredClone(input);assert.throws(()=>prepare({...input,main638:21}),/selected course/);assert.deepEqual(input,before);
 input.courseRows9964[4][43]=0x7fc00000;const bad=structuredClone(input);
 assert.throws(()=>prepare(input),/lighting conversion/);assert.deepEqual(input,bad);
 assert.throws(()=>prepare({...input,courseIndex:12}),/courseIndex/);
});
