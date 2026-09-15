import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {rootBranches,taperedRoot,buildRootSystem} from '../lib/RootAnatomy.ts';
test('every lateral root grows continuously from its parent, with finer branch orders',()=>{
 const branches=rootBranches();assert.ok(branches.length>600);
 for(const b of branches){
  if(b.parent>=0){const parent=branches[b.parent];assert.ok(b.curve.getPoint(0).distanceTo(parent.curve.getPoint(b.attachment))<1e-10);assert.ok(b.radius<parent.radius);}
  for(let j=0;j<=20;j++){const p=b.curve.getPoint(j/20);assert.ok(p.toArray().every(Number.isFinite));assert.ok(p.y<=.00001);}
 }
});
test('root tubes taper to fine tips and have finite surface normals',()=>{
 for(const branch of rootBranches().filter((b,i)=>i<9)){
  const g=taperedRoot(branch),p=g.getAttribute('position'),n=g.getAttribute('normal'),sides=branch.order===0?7:5;
  const first=new T.Vector3().fromBufferAttribute(p,0).distanceTo(branch.curve.getPointAt(0)),last=new T.Vector3().fromBufferAttribute(p,p.count-sides-1).distanceTo(branch.curve.getPointAt(1));
  assert.ok(last<first*.12&&last>0);assert.ok([...n.array].every(Number.isFinite));g.dispose();
 }
});
test('detailed roots batch branches and hairs into two draws per specimen',()=>{
 const root=buildRootSystem();assert.equal(root.children.length,2);const bounds=new T.Box3().setFromObject(root);assert.ok(bounds.min.y> -2.1&&bounds.max.y<.05);assert.ok(bounds.min.x> -1.7&&bounds.max.x<1.7);
 root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
});
