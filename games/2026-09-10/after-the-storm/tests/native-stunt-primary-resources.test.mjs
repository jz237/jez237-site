import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {nativeStuntPrimaryRows} from '../native-stunt-primary-resources.js';
import {createNativePrimaryCourseData} from '../native-primary-initialization.js';
import {SUNNY_NATIVE_GEOMETRY} from '../source-sunny-course.js';
import {SUNSET_NATIVE_GEOMETRY} from '../source-sunset-course.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-stunt-primary-resources-reference.json',import.meta.url)));
function hash(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}

test('all nine Stunt routes match original71E70/735EC on retained and fresh-zero storage',()=>{
 assert.equal(reference.cases.length,18);
 for(const c of reference.cases){
  const rows=nativeStuntPrimaryRows(c);assert.equal(rows.length,c.count);
  const input={rows,courseIndex:c.courseIndex,mode620:11};
  if(c.policy==='retained')input.initialRecordWordsBySourceRow=rows.map((_,i)=>Array.from({length:65},(_,j)=>0x14000000+i*65+j));
  const before=structuredClone(input),actual=createNativePrimaryCourseData(input);
  assert.equal(hash(actual.recordWordsBySourceRow.flat()),c.recordWordsSha256,`${c.courseIndex}/${c.policy}`);
  assert.equal(actual.finishSourceRow,c.finishSourceRow);assert.deepEqual(input,before);
  assert.ok(actual.nodes.some(n=>n.classification98===3));
  assert.ok(actual.nodes.filter(n=>n.classification98===2||n.classification98===3).every(n=>n.checkpointFlag9c===1));
 }
});

test('selected Stunt route rows remain immutable and reject unsupported source courses',()=>{
 assert.deepEqual(Array.from({length:9},(_,courseIndex)=>nativeStuntPrimaryRows({courseIndex}).length),[4,20,10,11,11,6,8,6,7]);
 const rows=nativeStuntPrimaryRows({courseIndex:8});
 assert.ok(Object.isFrozen(rows)&&rows.every(Object.isFrozen));assert.throws(()=>rows[0][0]=0,TypeError);
 for(const courseIndex of [-1,9,1.5,NaN,undefined,'1'])assert.throws(()=>nativeStuntPrimaryRows({courseIndex}),RangeError);
});

test('Sunny and Sunset tables agree with the independently recovered high-resolution course route metadata',()=>{
 assert.deepEqual(nativeStuntPrimaryRows({courseIndex:1}),SUNNY_NATIVE_GEOMETRY.stuntRoute);
 assert.deepEqual(nativeStuntPrimaryRows({courseIndex:2}),SUNSET_NATIVE_GEOMETRY.stuntRoute);
});
