import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {rootBranches,taperedRoot,buildRootSystem,wrapCutawayRoots} from '../lib/RootAnatomy.ts';
test('every lateral root grows continuously from its parent, with finer branch orders',()=>{
 const branches=rootBranches();assert.ok(branches.length>600);
 for(const b of branches){
  if(b.parent>=0){const parent=branches[b.parent];assert.ok(b.curve.getPoint(0).distanceTo(parent.curve.getPoint(b.attachment))<1e-10);assert.ok(b.radius<parent.radius);}
  for(let j=0;j<=20;j++){const p=b.curve.getPoint(j/20);assert.ok(p.toArray().every(Number.isFinite));assert.ok(p.y<=.00001);}
 }
});
test('cutaway roots extend around both side faces while retaining batched connected geometry',()=>{
 for(const [seed,x,width,side] of [[733,-.95,1.85,-1],[381,1.16,1.7,1]]){
  const group=wrapCutawayRoots(buildRootSystem(seed),new T.Vector3(x,3.28,1.03),width,1);
  assert.equal(group.children.length,2);
  const p=group.children[0].geometry.attributes.position;
  let exposed=0,furthest=1.1;
  for(let i=0;i<p.count;i++){
   assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)));
   if(p.getX(i)*side>2.475&&p.getZ(i)<.95){exposed++;furthest=Math.min(furthest,p.getZ(i));}
   assert.ok(Math.abs(p.getX(i))<2.55,'wrapped roots follow the side face');
  }
  assert.ok(exposed>100&&furthest<.6,'a visible network extends beyond the front corner');
  group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
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
