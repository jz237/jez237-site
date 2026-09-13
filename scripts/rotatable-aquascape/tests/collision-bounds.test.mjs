import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {sphereMayReachBox,CollisionCandidates} from '../lib/CollisionBounds.ts';

test('bounding rejection preserves exact sphere/triangle contacts, including thin surfaces',()=>{
 let seed=237;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const point=()=>new T.Vector3(random()*8-4,random()*5,random()*4-2),closest=new T.Vector3();
 let rejected=0,contacts=0;
 for(let i=0;i<16000;i++){
  const triangle=new T.Triangle(point(),point(),point()),box=new T.Box3().setFromPoints([triangle.a,triangle.b,triangle.c]);
  if(i%4===0){triangle.b.y=triangle.a.y;triangle.c.y=triangle.a.y;box.setFromPoints([triangle.a,triangle.b,triangle.c]);}
  const p=i%3===0?triangle.getMidpoint(new T.Vector3()):point(),r=random()*.35;
  triangle.closestPointToPoint(p,closest);const reference=closest.distanceToSquared(p)<r*r;
  const candidate=sphereMayReachBox(p,r,box);if(!candidate)rejected++;
  assert.equal(candidate&&closest.distanceToSquared(p)<r*r,reference);
  if(reference)contacts++;
  if(box.distanceToPoint(p)<r)assert.equal(candidate,true);
 }
 assert.ok(rejected>3000&&contacts>3000);
});

test('cached spatial lists preserve every candidate and its order across cell boundaries and eviction',()=>{
 const cells=new Map(),items=Array.from({length:11},(_,id)=>({id}));
 for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)for(let z=-5;z<=5;z++)cells.set(`${x},${y},${z}`,[items[Math.abs(x+y+z)%11],items[Math.abs(x*3+y+z*2)%11]]);
 const cache=new CollisionCandidates(cells);
 const reference=(p,r)=>{const found=new Set();for(let x=Math.floor((p.x-r)/.5);x<=Math.floor((p.x+r)/.5);x++)for(let y=Math.floor((p.y-r)/.5);y<=Math.floor((p.y+r)/.5);y++)for(let z=Math.floor((p.z-r)/.5);z<=Math.floor((p.z+r)/.5);z++)for(const item of cells.get(`${x},${y},${z}`)||[])found.add(item);return [...found];};
 for(let i=0;i<900;i++){const p=new T.Vector3(Math.sin(i*.31)*3,Math.sin(i*.71)*3,Math.cos(i*.19)*3),r=i%2?.48:.24;assert.deepEqual(cache.nearby(p,r),reference(p,r));assert.equal(cache.nearby(p,r),cache.nearby(p,r));}
 for(const x of [-.5000001,-.5,-.4999999,0,.4999999,.5,.5000001]){const p=new T.Vector3(x,x,x);assert.deepEqual(cache.nearby(p,.48),reference(p,.48));}
 assert.ok(cache.cached.size<=384);
});
