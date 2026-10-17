import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createTalusGeometry} from '../src/sable-talus';import {createSableLandscape} from '../src/sable-landscape';
test('talus fracture faces remain closed and bounded with distinct deterministic shapes',()=>{
 const signatures=new Set<string>();
 for(let v=0;v<4;v++){const g=createTalusGeometry(v),copy=createTalusGeometry(v);try{
  assert.deepEqual(g.attributes.position.array,copy.attributes.position.array);signatures.add(Array.from(g.attributes.position.array).join(','));
  const p=g.attributes.position,n=g.attributes.normal,edges=new Map<string,number>(),idx=g.index!;
  assert.ok(n.array.every(Number.isFinite));assert.ok(p.array.every(x=>Number.isFinite(x)&&Math.abs(x)<1.15));
  const key=(i:number)=>[p.getX(i),p.getY(i),p.getZ(i)].map(x=>x.toFixed(5)).join(',');
  for(let i=0;i<idx.count;i+=3)for(let j=0;j<3;j++){const edge=[key(idx.getX(i+j)),key(idx.getX(i+(j+1)%3))].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}
  assert.ok([...edges.values()].every(n=>n===2),'each geometric edge has two incident triangles');
 }finally{g.dispose();copy.dispose();}}assert.equal(signatures.size,4);
});
test('canyon keeps all 420 placements and releases shared rock resources once',()=>{
 const landscape=createSableLandscape(),rocks=landscape.root.children.filter(o=>o.name.startsWith('sable-talus-')) as T.InstancedMesh[];
 assert.equal(rocks.reduce((sum,r)=>sum+r.count,0),420);assert.equal(rocks.length,4);
 let materialDisposals=0,geometryDisposals=0,textureDisposals=0;const material=rocks[0].material as T.MeshStandardMaterial;
 material.addEventListener('dispose',()=>materialDisposals++);for(const r of rocks)r.geometry.addEventListener('dispose',()=>geometryDisposals++);
 for(const t of [material.map,material.normalMap,material.roughnessMap]){assert.ok(t);t.addEventListener('dispose',()=>textureDisposals++);}
 landscape.dispose();landscape.dispose();assert.equal(materialDisposals,1);assert.equal(geometryDisposals,4);assert.equal(textureDisposals,3);assert.equal(landscape.root.children.length,0);
});
