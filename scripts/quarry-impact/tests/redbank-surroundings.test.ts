import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createRedbankWorld} from '../src/redbank-world';import {REDBANK,REDBANK_SOLIDS} from '../src/redbank-course';
test('Redbank scenery keeps trees and paddock beyond playable bounds and preserves road collision records',()=>{
 const world=createRedbankWorld();try{
  const scenery=world.root.getObjectByName('redbank_surroundings')!;assert.ok(scenery);assert.equal(world.root.userData.solidRecords,REDBANK_SOLIDS);
  assert.equal(scenery.userData.treePositions.length,170);
  for(const p of scenery.userData.treePositions)for(const dx of [-5,5])for(const dz of [-5,5])assert.ok(REDBANK.outside(p.x+dx,0,p.z+dz),'tree canopy clears recovery rectangle');
  const trunks=scenery.getObjectByName('redbank_surroundings_cylinder') as T.InstancedMesh,matrix=new T.Matrix4(),position=new T.Vector3(),rotation=new T.Quaternion(),scale=new T.Vector3();
  scenery.userData.treePositions.forEach((p:{x:number;z:number},i:number)=>{trunks.getMatrixAt(i,matrix);matrix.decompose(position,rotation,scale);const ground=Math.abs(p.x)>240||Math.abs(p.z)>190?1.7:1.8;assert.ok(Math.abs(position.y-scale.y/2-ground)<1e-5,'trunk feet sit on the rendered outer apron');});
  for(const p of scenery.userData.propCenters)assert.ok(REDBANK.outside(p.x,0,p.z));
  assert.ok(scenery.userData.spectatorCount>200);
  let draws=0,triangles=0;scenery.traverse(o=>{if(o instanceof T.Mesh){draws++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));if(o instanceof T.InstancedMesh){assert.ok(o.instanceMatrix.array.every(Number.isFinite));assert.ok(o.boundingSphere&&Number.isFinite(o.boundingSphere.radius));}}});
  assert.ok(draws<=12,`draws ${draws}`);assert.ok(triangles<300000,`triangles ${triangles}`);
  const crowd=scenery.getObjectByName('venue_spectators')!,arms=crowd.children.filter(o=>o instanceof T.InstancedMesh) as T.InstancedMesh[];const before=arms.map(o=>Array.from(o.instanceMatrix.array));world.update(1);world.update(2);assert.ok(arms.some((o,i)=>o.instanceMatrix.array.some((n,j)=>n!==before[i][j])),'spectators animate after scenery transforms are frozen');
  console.log(JSON.stringify({draws,triangles,spectators:scenery.userData.spectatorCount}));
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);}
});
