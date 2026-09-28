import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {captureNorthForest} from '../tools/north-forest-edge-audit';

test('foreground card replacements render actual shared branch geometry and four verge LOD groups',async()=>{
 const positions=new Set<string>();let draws=0,triangles=0;
 const snapshot=await captureNorthForest(parent=>{
  const materials=new Set<T.Material>(),geometries=new Set<T.BufferGeometry>();
  parent.traverse(o=>{if(o instanceof T.Mesh&&o.name!=='bank-rim-branch-trees'){materials.add(o.material as T.Material);geometries.add(o.geometry);}});
  parent.traverse(o=>{if(!(o instanceof T.InstancedMesh)||o.name!=='bank-rim-branch-trees')return;
   assert.ok(materials.has(o.material as T.Material),'reuse existing photographic material');assert.ok(geometries.has(o.geometry),'reuse actual scanned branch geometry');
   const tri=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;assert.ok(tri>2,'not a replacement silhouette plane');triangles+=tri*o.count;draws++;
   const m=new T.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);positions.add(m.elements[12]+':'+m.elements[14]);assert.ok(m.elements.every(Number.isFinite));assert.ok(Math.hypot(m.elements[12],m.elements[14])>170);}
  });
  assert.equal(parent.children.filter(o=>o.name.startsWith('bank-verge-')).length,4);
 });
 assert.equal(positions.size,38);assert.equal(draws,9);assert.ok(triangles>500_000&&triangles<2_000_000);assert.equal(snapshot.cards.length,294);
});
