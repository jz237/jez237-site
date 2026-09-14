import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {ceramicPacking} from '../../living-aquascape/lib/aquarium/CanisterMedia.ts';
import {ringExtent,ringSeparation} from '../lib/CanisterPacking.ts';

test('all 126 saved ceramic poses clear their neighbors, floor, wall and polishing pad',()=>{
 const up=new T.Vector3(0,1,0),rings=ceramicPacking.map(p=>{const rotation=new T.Quaternion(...p.slice(3));return {position:new T.Vector3(...p.slice(0,3)),rotation,axis:up.clone().applyQuaternion(rotation)};});
 assert.equal(rings.length,126);
 for(let i=0;i<rings.length;i++){
  const ring=rings[i],bottom=ring.position.y-ringExtent(ring.axis,up),top=ring.position.y+ringExtent(ring.axis,up);
  assert.ok(Math.abs(ring.rotation.length()-1)<1e-6);assert.ok(bottom>=0);assert.ok(top<1.03,'below polishing pad');
  assert.ok(Math.hypot(ring.position.x,ring.position.z)+Math.hypot(.105,.095)<1.06,'inside basket wall');
  let support=bottom<.001;
  for(let j=0;j<i;j++){const separation=ringSeparation(ring,rings[j]);assert.ok(separation>=-1e-6,`rings ${i} and ${j} penetrate`);if(separation<.001)support=true;}
  assert.ok(support,`ring ${i} is unsupported`);
 }
});
