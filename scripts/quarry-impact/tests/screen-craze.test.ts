import test from 'node:test';
import assert from 'node:assert/strict';
import {CRAZE,crazePattern,trackCraze,type CrazeState} from '../src/screen-craze';
test('a crack pattern grows with the blow, stays within its radius and is the same every time for a seed',()=>{
 assert.deepEqual(crazePattern(3,0),[]);
 const small=crazePattern(7,.3),big=crazePattern(7,1);
 assert.ok(small.length>8&&big.length>small.length*1.5,`${small.length} vs ${big.length}`);
 for(const s of big){assert.ok(s.every(Number.isFinite));assert.ok(Math.hypot(s[2],s[3])<1.25);}
 assert.deepEqual(crazePattern(7,.6),crazePattern(7,.6));assert.notDeepEqual(crazePattern(7,.6),crazePattern(8,.6));
 assert.deepEqual(crazePattern(7,NaN),[]);
});
test('blows near an old crack deepen it; a blow elsewhere starts a new one; a repaired screen clears them',()=>{
 let s:CrazeState={centres:[],last:0};
 s=trackCraze(s,[0,0,0],.05,1);assert.equal(s.centres.length,0,'too light to crack');
 s=trackCraze(s,[0,0,0],.3,1);assert.equal(s.centres.length,1);assert.ok(s.centres[0].level>=CRAZE.first);
 const before=s.centres[0].level;s=trackCraze(s,[.1,0,0],.45,2);assert.equal(s.centres.length,1);assert.ok(s.centres[0].level>before);
 s=trackCraze(s,[.6,.1,0],.6,3);assert.equal(s.centres.length,2);
 const same=trackCraze(s,[.6,.1,0],.6,4);assert.deepEqual(same.centres,s.centres,'no new damage, no change');
 for(let k=0;k<8;k++)s=trackCraze(s,[-.8+k*.2,.4,0],.6+(k+1)*.04,10+k);assert.ok(s.centres.length<=CRAZE.centres);
 assert.ok(s.centres.every(c=>c.level<=1));
 assert.deepEqual(trackCraze(s,[0,0,0],0,9),{centres:[],last:0});
});
test('the clip outline is the convex hull of the projected screen corners',async()=>{
 const {hull}=await import('../src/screen-craze');
 const h=hull([{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10},{x:5,y:5},{x:NaN,y:1}]);
 assert.equal(h.length,4);assert.ok(!h.some(q=>q.x===5&&q.y===5));
 assert.equal(hull([{x:1,y:1}]).length,1);
});
