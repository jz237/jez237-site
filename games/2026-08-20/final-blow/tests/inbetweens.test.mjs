import test from 'node:test';
import assert from 'node:assert/strict';
import {createInbetweenSelector, INBETWEEN_BANKS, REPAIRED_CELLS} from '../engine/inbetweens.mjs';
test('transition drawings settle without changing canonical pose or timing',()=>{
 const select=createInbetweenSelector(), f={def:{id:'jez'}}, p={bank:'unified',frame:1};
 assert.equal(select(f,p,10,true).artBank,'inbetween-unified');
 assert.equal(select(f,p,11,true).artBank,'inbetween-unified');
 assert.deepEqual(select(f,p,12,true),p);
 assert.deepEqual(select(f,p,100,true),p);
 assert.equal(select(f,{...p,frame:2},101,true).artBank,'inbetween-unified');
});
test('late loads do not insert transitions and render samples cannot reset their age',()=>{
 const select=createInbetweenSelector(), f={def:{id:'benny'}}, p={bank:'unified',frame:1};
 assert.deepEqual(select(f,p,0,false),p);
 assert.deepEqual(select(f,p,1,true),p);
 select(f,{...p,frame:2},2,true);
 select(f,p,3,true,false);
 assert.deepEqual(select(f,{...p,frame:2},4,true),{...p,frame:2});
});
test('every repaired head and hand stays repaired even on long holds',()=>{
 for(const [id,banks] of Object.entries(REPAIRED_CELLS)) for(const [bank,frames] of Object.entries(banks)) for(const frame of frames){
  const select=createInbetweenSelector(),f={def:{id}},p={bank,frame};
  for(const tick of [0,1,2,120,600]) assert.equal(select(f,p,tick,true).artBank,`inbetween-${bank}`);
 }
});
test('scope remains Jez and Benny across all supported banks',()=>{
 const select=createInbetweenSelector();
 for(const bank of INBETWEEN_BANKS) assert.deepEqual(select({def:{id:'alan'}},{bank,frame:0},0,true),{bank,frame:0});
});
