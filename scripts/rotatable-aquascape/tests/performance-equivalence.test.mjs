import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createNormalUpdater} from '../lib/DeformedNormals.ts';
import {Tetra3D} from '../lib/Tetra3D.ts';
import {Invertebrates} from '../lib/Invertebrates.ts';
import {fishBody,fishTouch,grazerBody,bodiesOverlap} from '../lib/GrazerCollision.ts';

// Frozen pre-optimization reference: broad rejection must preserve both misses
// and the exact correction point, including initially intersecting bodies.
function originalTouch(fish,body){
 const from=fish.previous??fish.position,steps=Math.max(1,Math.ceil(from.distanceTo(fish.position)/.025)),p=new T.Vector3(),safe=from.clone();
 for(let i=0;i<=steps;i++){p.copy(from).lerp(fish.position,i/steps);if(bodiesOverlap(fishBody(fish,p),body,.006)){
  if(i===0){const away=p.clone().sub(body[2]?.center??body[0].center);if(away.lengthSq()<1e-8)away.set(0,1,0);away.normalize();for(let j=0;j<50&&bodiesOverlap(fishBody(fish,safe),body);j++)safe.addScaledVector(away,.02);}
  return safe;
 }safe.copy(p);}
 return null;
}

test('conservative fish sweep matches detailed contact results across fast motion, pitch and depth',()=>{
 let seed=873;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),v=()=>new T.Vector3(random()*2-1,random()*2-1,random()*2-1);
 const up=new T.Vector3(0,1,0),forward=new T.Vector3(1,0,0);
 for(let i=0;i<4000;i++){
  const position=v(),fish={id:1,position,previous:i%7?position.clone().addScaledVector(v(),i%4===0?3:.08):undefined,forward:v().normalize(),size:.2+random()*.9};
  const body=grazerBody(v().multiplyScalar(i%2?4:.2),up,forward,i%5===0);
  assert.deepEqual(fishTouch(fish,body),originalTouch(fish,body),`contact ${i}`);
 }
});

test('specialized normals match every body and fin normal throughout varied swimming',()=>{
 const fish=new Tetra3D(new T.Texture());
 for(let frame=0;frame<40;frame++){
  fish.update(frame*.1,(frame%9)*.16,new T.Texture(),.65,.4,1,.03,(frame%7)/6);
  fish.meshes.forEach(mesh=>{
   const reference=mesh.geometry.clone();reference.computeVertexNormals();
   assert.deepEqual(mesh.geometry.getAttribute('normal').array,reference.getAttribute('normal').array);
   reference.dispose();
  });
 }
 fish.dispose();
});

test('normal updater keeps zero-area faces finite and preserves index winding',()=>{
 for(const indexed of [false,true]){
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,1,0,0],3));if(indexed)g.setIndex([0,1,2,3,4,5]);
  const reference=g.clone();reference.computeVertexNormals();createNormalUpdater(g)();
  assert.deepEqual(g.getAttribute('normal').array,reference.getAttribute('normal').array);
  assert.ok(g.getAttribute('normal').array.every(Number.isFinite));g.dispose();reference.dispose();
 }
});


test('plain shrimp pose matrices preserve every articulated part of the original Object3D path',()=>{
 const make=()=>new Invertebrates(new T.Scene(),()=>0,[],undefined,[],()=>0,true),actual=make(),reference=make(),dummy=new T.Object3D(),up=new T.Vector3(0,1,0);
 reference.part=function(a,pool,x,y,z,sx,sy,sz,rz=0,ry=0,rx=0){dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.bodyFrame?this.posed.multiplyMatrices(this.bodyFrame,dummy.matrix):dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;};
 reference.rod=function(a,pool,x,y,z,ex,ey,ez,r){this.link.set(ex-x,ey-y,ez-z);dummy.position.set((x+ex)/2,(y+ey)/2,(z+ez)/2);dummy.quaternion.setFromUnitVectors(up,this.end.copy(this.link).normalize());dummy.scale.set(r,this.link.length(),r);dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.bodyFrame?this.posed.multiplyMatrices(this.bodyFrame,dummy.matrix):dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;};
 for(let frame=0;frame<30;frame++){
  actual.poseSpecimen(.035);reference.poseSpecimen(.035);
  actual.pools.forEach((pool,i)=>assert.deepEqual(pool.instanceMatrix.array,reference.pools[i].instanceMatrix.array));
 }
 actual.dispose();reference.dispose();
});


test('paused fish retain their exact pose without redundant normal or vertex uploads',()=>{
 const fish=new Tetra3D(new T.Texture());fish.update(1,.6,new T.Texture(),.65,.4,1,.03,.4);
 const versions=fish.meshes.map(m=>[m.geometry.getAttribute('position').version,m.geometry.getAttribute('normal').version]);
 for(let i=0;i<60;i++)fish.update(1,.6,new T.Texture(),.65,.4,1,0,.4);
 assert.deepEqual(fish.meshes.map(m=>[m.geometry.getAttribute('position').version,m.geometry.getAttribute('normal').version]),versions);
 fish.update(1,.7,new T.Texture(),.65,.4,1,0,.4);
 assert.ok(fish.meshes.every((m,i)=>m.geometry.getAttribute('position').version>versions[i][0]));fish.dispose();
});

test('linear world-position reconstruction matches normalized reconstruction for aquarium camera rotations',()=>{
 for(let i=0;i<100;i++){
  const view=new T.Matrix4().makeRotationFromEuler(new T.Euler(i*.17,i*.23,i*.31)),v=new T.Vector3(Math.sin(i)*4,Math.cos(i)*2,3+i*.1),e=view.elements;
  const rotate=p=>new T.Vector3(e[0]*p.x+e[1]*p.y+e[2]*p.z,e[4]*p.x+e[5]*p.y+e[6]*p.z,e[8]*p.x+e[9]*p.y+e[10]*p.z);
  const before=rotate(v.clone().normalize()).normalize().multiplyScalar(v.length()),after=rotate(v);
  assert.ok(before.distanceTo(after)<1e-12);
 }
});
