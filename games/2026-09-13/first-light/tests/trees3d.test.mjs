import test from 'node:test';import assert from 'node:assert/strict';
import {pickNearest,treeScale,TARGET_HEIGHT,CAPACITY,REACH,TREES_3D,CARD_FADE,CARD_FADE_DEFAULT} from '../trees3d-model.js';
test('the near-bank trees: the nearest inside the reach, capped, and every species scaled to the same height',()=>{
 const pts=[];for(let i=0;i<300;i++)pts.push({x:i*1.2-100,z:0,scale:1,stretch:1});
 const near=pickNearest(pts,0,0,8,20);
 assert.equal(near.length,8,'the cap holds');
 const d=near.map(i=>Math.abs(pts[i].x));
 assert.deepEqual(d,[...d].sort((a,b)=>a-b),'nearest first');
 assert.ok(Math.max(...d)<20,'nothing beyond the reach');
 assert.equal(pickNearest(pts,5000,5000,8,20).length,0,'an empty shore picks nothing');
 assert.ok(pickNearest(pts,0,0).length<=CAPACITY);
 for(const spec of TREES_3D){
  const s=treeScale(spec.height,{scale:1,stretch:1});
  assert.ok(Math.abs(spec.height*s-TARGET_HEIGHT)<1e-6,spec.id+' stands at the target height');
 }
 const small=treeScale(14,{scale:.2,stretch:.2}),big=treeScale(14,{scale:3,stretch:3});
 assert.ok(small>=.6*.999&&big<=1.3*1.001,'the point size is clamped to a believable range');
});
test('the cards hand over to the real trees: they are gone before the reach ends, and the plain tiers keep the close fade',()=>{
 assert.ok(CARD_FADE[0]<CARD_FADE[1],'the ultra fade is a band');
 assert.ok(CARD_FADE[1]<=REACH,'no card is still growing where a real tree has stopped');
 assert.ok(CARD_FADE[0]>CARD_FADE_DEFAULT[1],'the ultra band starts beyond where the plain one has finished');
 assert.deepEqual(CARD_FADE_DEFAULT,[28,62]);
});
