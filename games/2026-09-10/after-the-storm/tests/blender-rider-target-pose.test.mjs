import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../vendor/three.module.js';
import {riderPose} from '../rider-pose.js';
import {installFallbackRider} from '../fallback-rider.js';

// Real high-resolution assets through a local filesystem fixture. No network,
// WebGL, browser tab, UI action, or physics clock is involved in these tests.
const oldFetch=globalThis.fetch;let makeBlenderRider,installBlenderRider;
try{
 globalThis.fetch=async url=>{
  const path=new URL(url);assert.equal(path.protocol,'file:');assert.ok(path.pathname.includes('/after-the-storm/assets/'));
  try{return new Response(await readFile(path));}catch{return new Response('',{status:404});}
 };
 ({makeBlenderRider,installBlenderRider}=await import('../blender-rider.js'));
}finally{globalThis.fetch=oldFetch;}
const meta=JSON.parse(await readFile(new URL('../assets/coastal-rider.json',import.meta.url),'utf8'));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const nearPoint=(a,b)=>a.toArray().forEach((n,i)=>near(n,b[i]));
const matrices=rider=>rider.root.children.map(g=>g.matrix.clone());
const pose=()=>{
 const p=riderPose();p.targets.head=[[.08,1.47,.12],[.19,1.79,.24]];
 p.targets.handL=[[-.53,1.18,.61],[-.48,1.13,.75]];p.yaw=.17;p.headYaw=-.23;return p;
};

test('explicit targets pose the original detailed geometry directly and retain materials, shadows and LOD references',()=>{
 const rider=makeBlenderRider(new T.Group()),p=pose(),before=structuredClone(p),meshes=[];
 rider.root.traverse(m=>{if(m.isMesh)meshes.push({m,geometry:m.geometry,material:m.material,lod:m.userData.lodGeometry,roughness:m.material.roughness});});
 rider.root.position.set(9,-3,4);rider.root.rotation.set(.4,.6,-.2);
 rider.update('somersault',99,1,{targetPose:p,speed:100,impact:100,compression:.38,steering:2,dt:1});
 rider.root.updateMatrixWorld(true);
 assert.equal(rider.root.userData.nativePhysical,true);assert.equal(rider.root.userData.riderMotion.nativePhysical,true);
 assert.deepEqual(rider.root.position.toArray(),[0,0,0]);near(rider.root.rotation.x,0);near(rider.root.rotation.y,.17);near(rider.root.rotation.z,0);
 const rootTransform=new T.Matrix4().makeRotationY(.17);
 for(const [name,[a,b]]of Object.entries(p.targets)){
  const g=rider.root.getObjectByName(name);nearPoint(g.position,a);
  const end=new T.Vector3(0,meta.bones[name].length,0).applyMatrix4(g.matrixWorld);
  nearPoint(end,new T.Vector3(...b).applyMatrix4(rootTransform).toArray());
 }
 for(const {m,geometry,material,lod,roughness}of meshes){
  assert.equal(m.geometry,geometry);assert.equal(m.material,material);assert.equal(m.userData.lodGeometry,lod);
  assert.equal(m.material.roughness,roughness);assert.equal(m.castShadow,true);assert.equal(m.receiveShadow,true);
 }
 assert.deepEqual(p,before);
 const held=matrices(rider);
 for(let i=0;i<100;i++){rider.update('handstand',1000+i,i%2?1:-1,{targetPose:p,dt:.2,speed:80,impact:i});rider.root.updateMatrixWorld(true);}
 rider.root.children.forEach((g,i)=>assert.ok(g.matrix.equals(held[i]),g.name+' held target drifted'));
});

test('physical target renders do not advance modern animation memory',()=>{
 const a=makeBlenderRider(new T.Group()),b=makeBlenderRider(new T.Group());
 for(let i=0;i<60;i++)a.update('somersault',10+i,1,{targetPose:pose(),speed:100,impact:20});
 a.update('',1/60,1,{speed:30});b.update('',1/60,1,{speed:30});
 a.root.updateMatrixWorld(true);b.root.updateMatrixWorld(true);
 a.root.children.forEach((g,i)=>assert.ok(g.matrix.equals(b.root.children[i].matrix),g.name+' modern path changed'));
 assert.deepEqual(a.root.userData.riderMotion,b.root.userData.riderMotion);assert.equal(a.root.userData.nativePhysical,false);
});

test('invalid targetPose cannot partially change detailed bones or physical metadata',()=>{
 const rider=makeBlenderRider(new T.Group());rider.root.updateMatrixWorld(true);const before=matrices(rider),motion=structuredClone(rider.root.userData.riderMotion);
 const invalid=pose();delete invalid.targets.footR;assert.throws(()=>rider.update('',2,1,{targetPose:invalid}),/footR/);
 rider.root.updateMatrixWorld(true);rider.root.children.forEach((g,i)=>assert.ok(g.matrix.equals(before[i])));
 assert.deepEqual(rider.root.userData.riderMotion,motion);assert.equal(rider.root.userData.nativePhysical,false);
});

test('installed updateRider forwards targetPose and replaces a lazy fallback without double-disposing shared meshes',()=>{
 const body=new T.Group(),old=new T.Group(),geometry=new T.BoxGeometry(.1,.3,.1),material=new T.MeshStandardMaterial();body.add(old);
 const first=new T.Mesh(geometry,material),second=new T.Mesh(geometry,material);old.add(first,second);
 const vessel={body,rider:old};installFallbackRider(vessel,{bindings:[{bone:'torso',mesh:first},{bone:'head',mesh:second}]});
 vessel.updateRider({targetPose:pose()});let disposed=0;geometry.addEventListener('dispose',()=>disposed++);
 assert.equal(installBlenderRider(vessel),true);assert.equal(disposed,1);assert.equal(old.parent,null);assert.notEqual(vessel.rider,old);
 vessel.updateRider({time:30,turn:1,targetPose:pose()});assert.equal(vessel.rider.userData.nativePhysical,true);
 nearPoint(vessel.rider.getObjectByName('handL').position,[-.53,1.18,.61]);
});
