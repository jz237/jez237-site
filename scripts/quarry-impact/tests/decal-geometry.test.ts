import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {decalGeometry,restIn} from '../src/decal-geometry';
const panel=()=>{const g=new T.PlaneGeometry(2,1,20,10);g.setAttribute('wreckPosition',g.attributes.position.clone());return g;};
test('a decal draws just the triangles it picks, from the panel’s own vertex buffers',()=>{
  const g=panel(),at=restIn(g,new T.Matrix4()),near=(i:number)=>at[i*3]>.8;
  const patch=decalGeometry(g,(a,b,c)=>near(a)||near(b)||near(c))!;
  assert.ok(patch.getAttribute('position')===g.getAttribute('position')&&patch.getAttribute('normal')===g.getAttribute('normal')&&patch.getAttribute('wreckPosition')===g.getAttribute('wreckPosition'),'shared buffers: it dents with the panel');
  assert.ok(patch.index!.count>0&&patch.index!.count<g.index!.count/5,`${patch.index!.count} of ${g.index!.count}`);
  assert.ok(patch.index!.array instanceof Uint16Array);
  assert.equal(decalGeometry(g,()=>false),null,'nothing picked');
});
test('a panel without an index is picked by its triangles in order',()=>{
  const g=panel().toNonIndexed(),patch=decalGeometry(g,a=>a<30)!;assert.deepEqual(Array.from(patch.index!.array),Array.from({length:30},(_,i)=>i));
});
test('rest positions come into the frame asked for',()=>{
  const g=panel(),at=restIn(g,new T.Matrix4().makeTranslation(5,0,0));assert.ok(Math.abs(at[0]-(g.attributes.wreckPosition.getX(0)+5))<1e-6);
});
