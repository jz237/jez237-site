import test from 'node:test';import assert from 'node:assert/strict';
import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';import {CAR_KINDS} from '../src/rules';import {stockSetup} from '../src/garage';
import {markCollision} from './historical-scars';import {dentGeometry,prepareWreckGeometry} from '../src/wreck-geometry';import type {VehicleSurface} from '../src/vehicle-surface';
/** Make a small permanent dent on actual visible bodywork without changing
 * health or mechanical components. Collider witnesses can sit just beyond the
 * painted mesh; fall back to the nearest visible panel vertex in that case. */
function referenceMark(panels:readonly T.Mesh[],contact:T.Vector3,direction:T.Vector3,surface:VehicleSurface,paint?:T.Color){
 const strength=1.4,axis=direction.clone();if(axis.lengthSq()<1e-12)axis.set(0,0,-1);else axis.normalize();
 const eligible=panels.filter(p=>{
  if(!p.userData.wreckRest||p.userData.constructionRole==='engine')return false;
  for(let node:T.Object3D|null=p;node;node=node.parent)if(!node.visible)return false;
  return true;
 });
 // Center the small field on reachable bodywork. A collider witness may lie
 // outside the skin or in an open cockpit; a barely overlapping field can
 // otherwise change vertices by an invisible fraction of a millimetre.
 let at:T.Vector3|undefined,best=Infinity;const vertex=new T.Vector3();
 const bounds=new T.Box3();
 for(const panel of eligible){
  if(!panel.geometry.boundingBox)panel.geometry.computeBoundingBox();
  if(bounds.copy(panel.geometry.boundingBox!).applyMatrix4(panel.userData.wreckToModel).distanceToPoint(contact)**2>best)continue;
  const position=panel.geometry.attributes.position,toModel=panel.userData.wreckToModel as T.Matrix4;
  for(let i=0;i<position.count;i++){vertex.fromBufferAttribute(position,i).applyMatrix4(toModel);const distance=vertex.distanceToSquared(contact);if(distance<best){best=distance;at=vertex.clone();}}
 }
 if(!at)return false;
 let marked=false;
 for(const panel of eligible){
  if(dentGeometry(panel,at,axis,strength)>0){
   // Even a shallow dent needs an observable finish change. Reuse the existing
   // persistent primer/metal shader instead of adding a transient hit effect.
   const wear=panel.geometry.attributes.impactWear,position=panel.geometry.attributes.position;
   for(let i=0;i<position.count;i++){
    vertex.fromBufferAttribute(position,i).applyMatrix4(panel.userData.wreckToModel);
    const weight=Math.max(0,1-vertex.distanceTo(at)/.6);
    if(weight>0)wear.setXY(i,Math.min(1,wear.getX(i)+weight*.72),Math.min(1,wear.getY(i)+weight*.48));
   }
   wear.needsUpdate=true;surface.transfer(panel,at,8,paint);marked=true;
  }
 }
 return marked;
}

await R.init();const load=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const bytes=(a:ArrayBufferView)=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
function same(a:Vehicle,b:Vehicle){
 a.panels.forEach((p,i)=>{const q=b.panels[i];assert.equal(p.visible,q.visible);for(const key of Object.keys(p.geometry.attributes))assert.deepEqual(bytes(p.geometry.attributes[key].array),bytes(q.geometry.attributes[key].array),a.kind+' '+p.name+' '+key);assert.deepEqual(p.geometry.boundingBox,q.geometry.boundingBox);assert.deepEqual(p.geometry.boundingSphere,q.geometry.boundingSphere);});
}
test('historical nearest-first scars preserve every dent and paint byte on all eleven stock and armored cars',()=>{
 let oldReads=0,newReads=0;const times=[0,0];
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),setup={...stockSetup(kind),armor},cars=[0,1].map(i=>new Vehicle(i,kind,setup.paint,scene,world,{emit(){},mark(){},detach(){}}as any,setup));
  const reads=[0,0];for(let k=0;k<2;k++)for(const panel of cars[k].panels){const a=panel.geometry.attributes.position,get=a.getX;a.getX=function(i){reads[k]++;return get.call(this,i);};}
  try{
   for(let i=0;i<24;i++){
    if(i===12)cars.forEach(c=>c.repair());
    if(i===18)cars.forEach(c=>{c.panels.filter(p=>/hood|bumper/.test(p.name.toLowerCase())).forEach(p=>p.visible=false);});
    const point=new T.Vector3(Math.sin(i*2.41)*2.5,.3+(i%7)*.4,Math.cos(i*1.27)*4),direction=i===0?new T.Vector3():point.clone().negate().normalize(),paint=i%2?new T.Color(0x445599):undefined;
    for(const k of i%2?[1,0]:[0,1]){const t=performance.now();assert.equal((k?markCollision:referenceMark)(cars[k].panels,point,direction,cars[k].surfaceFinish,paint),true,kind+' scar '+i);times[k]+=performance.now()-t;}
    same(cars[0],cars[1]);
   }
   oldReads+=reads[0];newReads+=reads[1];
  }finally{cars.forEach(c=>c.dispose());world.free();}
 }
 assert.ok(newReads<oldReads,`nearest-first must reduce vertex reads: ${newReads}/${oldReads}`);
 console.log(JSON.stringify({oldReads,newReads,times}));
});
test('equal-distance witnesses retain original panel order and hidden panels cannot receive marks',()=>{
 const make=()=>{const root=new T.Group(),material=new T.MeshStandardMaterial();for(const side of [-1,1]){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([side,0,0,side*2,1,0,side*2,0,1],3));g.computeVertexNormals();const p=new T.Mesh(g,material);p.name='panel_test';root.add(p);}prepareWreckGeometry(root);const panels=root.children as T.Mesh[];panels.forEach(p=>p.geometry.computeBoundingBox());panels[1].geometry.boundingBox!.expandByScalar(3);return{root,panels,material};};
 const a=make(),b=make(),surface={transfer(){}}as unknown as VehicleSurface;
 try{
  for(const [fn,rig]of [[referenceMark,a],[markCollision,b]]as const)assert.ok(fn(rig.panels,new T.Vector3(),new T.Vector3(0,0,-1),surface));
  for(let i=0;i<2;i++)for(const key of Object.keys(a.panels[i].geometry.attributes))assert.deepEqual(bytes(a.panels[i].geometry.attributes[key].array),bytes(b.panels[i].geometry.attributes[key].array),key);
  assert.ok(b.panels[0].geometry.attributes.position.getZ(0)<0,'original first witness wins the exact tie');assert.equal(b.panels[1].geometry.attributes.position.getZ(0),0);
  b.root.visible=false;assert.equal(markCollision(b.panels,new T.Vector3(),new T.Vector3(),surface),false);
 }finally{for(const rig of [a,b]){rig.panels.forEach(p=>p.geometry.dispose());rig.material.dispose();}}
});
