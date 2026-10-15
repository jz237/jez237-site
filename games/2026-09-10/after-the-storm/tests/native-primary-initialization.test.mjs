import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createNativeSineTableWords,nativePhaseSine,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
import {createNativePrimaryCourseData,prepareNativePrimaryInitialization} from '../native-primary-initialization.js';
import {nativeRaceLookupAngle} from '../native-race-direction-warning.js';
import {getCourse} from '../courses.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';

test('reconstructed sine initialization matches the complete original4096-word output',()=>{
 const words=createNativeSineTableWords(),bytes=Buffer.alloc(4096*4);words.forEach((w,i)=>bytes.writeUInt32BE(w,i*4));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'d17c26e2bb68d3afa50a650f624a3a3750d52aa7fef20d5077cd0297827372f6');
 assert.equal(words.length,4096);assert.equal(nativePhaseSine(-1),nativePhaseSine(4095));
 assert.equal(nativeRaceLookupAngle(0,NATIVE_ANGLE_TABLE_WORDS),90);
 assert.equal(nativeRaceLookupAngle(1,NATIVE_ANGLE_TABLE_WORDS),0);
 assert.equal(nativeRaceLookupAngle(-1,NATIVE_ANGLE_TABLE_WORDS),180);
 assert.equal(nativeRaceLookupAngle(1.000001,NATIVE_ANGLE_TABLE_WORDS),0);
});

test('Dolphin26/27 retain ordinary/guide groups while other courses classify both as alternate rows',()=>{
 const rows=[[0,0,3,0],[1000,0,26,90],[1000,1000,27,180],[0,1000,0,270]];
 const dolphin=createNativePrimaryCourseData({rows,courseIndex:0}),sunny=createNativePrimaryCourseData({rows,courseIndex:1});
 assert.deepEqual(dolphin.nodes.map(n=>n.routeGroupC0),[0,0,1,0]);
 assert.deepEqual(sunny.nodes.map(n=>n.routeGroupC0),[0,2,2,0]);
 assert.deepEqual(createSourceBuoyLayout({rows,courseIndex:0}).nodes.map(n=>n.routeGroup),[0,0,1,0]);
 assert.equal(dolphin.nodes[0].nextSourceRowA0,1);assert.equal(sunny.nodes[0].nextSourceRowA0,3);
 assert.equal(dolphin.nodes[0].halfWidthNative8c,370);assert.equal(sunny.nodes[0].halfWidthNative8c,500);
 assert.equal(createNativePrimaryCourseData({rows,courseIndex:0,mode620:11}).nodes[0].halfWidthNative8c,500);
});

test('selected Sunny course rows initialize complete source geometry, inverse judging links and retained words',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const c=getCourse('greyhaven',difficulty),rows=c.sourceRouteRowsByClass[difficulty],initial=rows.map((_,i)=>Array.from({length:65},(_,j)=>0x14000000+i*65+j));
  const d=createNativePrimaryCourseData({rows,courseIndex:1,initialRecordWordsBySourceRow:initial});
  assert.equal(d.nodes.length,rows.length);assert.equal(d.finishSourceRow,0);
  const first=difficulty===3?1:2;
  assert.equal(d.nodes[0].nextSourceRowA0,first);assert.equal(d.nodes[first].previousSourceRowA8,0);
  for(const [i,n]of d.nodes.entries()){
   assert.deepEqual(n.referenceNativeXZ,{x:rows[i][0],z:rows[i][1]});
   assert.equal(d.recordWordsBySourceRow[i][0xdc/4],initial[i][0xdc/4],'unwritten source data survives');
   assert.ok(d.recordWordsBySourceRow[i].slice(0x3c/4,0x60/4).every(w=>w===0));
   assert.equal(d.recordWordsBySourceRow[i][0xb4/4],i===rows.length-1?0:i+1,'actual B4 is the raw forward link');
  }
  assert.deepEqual(initial[0],Array.from({length:65},(_,j)=>0x14000000+j),'initializer does not mutate retained input');
 }
});

test('the primary initializer rejects incomplete words and out-of-bound source graph links',()=>{
 assert.throws(()=>createNativePrimaryCourseData({rows:[],courseIndex:1}));
 assert.throws(()=>createNativePrimaryCourseData({rows:[[0,0,3,-1]],courseIndex:1}));
 assert.throws(()=>prepareNativePrimaryInitialization({recordWordsBySourceRow:[Array(64).fill(0)],courseIndex:1,mode620:0,finishSourceRow:0,angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS}));
});
