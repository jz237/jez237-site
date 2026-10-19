import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import * as T from '../vendor/three.module.js';
import {makeNativeActorRenderer,prepareNativeActorMeshes} from '../native-actor-render.js';
import {prepareNativeActorPresentation} from '../native-actor-presentation.js';
const identity=()=>new T.Matrix4().toArray();
const draw=(actorIndex=0,partOffset=8)=>({bufferIndex:0,actorIndex,resourceIndex:0,partOffset,matrixWorld:identity(),material:'actor',surface:null,lighting:{ambient:[.2,.3,.4],directional:[]},fog:{color:[128,128,128,255],multiplier:128,offset:0}});
function resource(){return {geometry:new T.SphereGeometry(1,64,40),material:new T.MeshPhysicalMaterial({map:new T.Texture(),roughness:.3,clearcoat:.8}),localMatrix:identity()};}
const close=(a,b)=>a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<1e-10,`${i}: ${v} / ${b[i]}`));

test('high-resolution geometry, texture and physical material are preserved with explicit unit conversion',()=>{
 const root=new T.Group(),part=resource(),geometryBefore=part.geometry.attributes.position.array.slice(),map=part.material.map;
 root.position.set(20,30,40);root.rotation.y=.7;root.scale.set(2,3,4);
 part.localMatrix=new T.Matrix4().makeScale(100,100,100).setPosition(1,2,3).toArray();
 const d=draw(2);d.matrixWorld=new T.Matrix4().makeRotationY(.3).scale(new T.Vector3(.05,.05,.05)).setPosition(10,20,30).toArray();
 const seen=[],r=makeNativeActorRenderer(root,{getPart:value=>{seen.push(value);return part;}});
 assert.deepEqual(r.update({draws:[d]}),{parts:1,actors:1});root.updateMatrixWorld(true);
 const mesh=root.children[0].children[0],expected=new T.Matrix4().fromArray(d.matrixWorld).multiply(new T.Matrix4().fromArray(part.localMatrix));
 close(mesh.matrixWorld.elements,expected.elements);assert.equal(mesh.geometry,part.geometry);assert.equal(mesh.material,part.material);assert.equal(mesh.material.map,map);
 assert.equal(mesh.geometry.attributes.position.count,2665);assert.deepEqual(mesh.geometry.attributes.position.array,geometryBefore);assert.equal(mesh.userData.nativeActor,d);assert.deepEqual(seen,[d]);assert.equal(mesh.matrixAutoUpdate,false);
 // A moved parent is cancelled on the next update; native world coordinates
 // stay absolute instead of acquiring a second root placement/scale.
 root.position.set(-2,7,12);r.update({draws:[d]});root.updateMatrixWorld(true);close(mesh.matrixWorld.elements,expected.elements);
 let disposal=0;for(const value of [part.geometry,part.material,map])value.addEventListener('dispose',()=>disposal++);
 r.dispose();r.dispose();assert.equal(disposal,0);assert.equal(root.children.length,0);assert.throws(()=>r.update({draws:[]}),/disposed/);
});

test('source part ordering and alternate surfaces reach the resolver and retained meshes are reused',()=>{
 const root=new T.Group(),a=resource(),b=resource(),order=[],r=makeNativeActorRenderer(root,{getPart:d=>{order.push([d.actorIndex,d.partOffset,d.surface]);return d.surface==='actor12-overlay'?b:a;}});
 const draws=[draw(7,16),{...draw(7,8),surface:'actor12-overlay'},draw(2,12)];
 assert.deepEqual(r.update({draws}),{parts:3,actors:2});const group=root.children[0],meshes=[...group.children];
 assert.deepEqual(order,[[7,16,null],[7,8,'actor12-overlay'],[2,12,null]]);assert.deepEqual(meshes.map(m=>m.renderOrder),[0,1,2]);assert.equal(meshes[1].material,b.material);
 r.update({draws:[draw(2,12)]});assert.equal(group.children[0],meshes[0]);assert.deepEqual(meshes.map(m=>m.visible),[true,false,false]);
 r.update({draws:[]});assert.ok(meshes.every(m=>!m.visible));r.dispose();
});

test('late missing resources, invalid transforms or singular parent leave visible parts unchanged',()=>{
 const root=new T.Group(),part=resource(),r=makeNativeActorRenderer(root,{getPart:d=>d.resourceIndex===1?null:part});r.update({draws:[draw()]});
 const group=root.children[0],mesh=group.children[0],before=mesh.matrix.clone(),metadata=mesh.userData.nativeActor;
 const invalid=[{...draw(),resourceIndex:1},{...draw(),matrixWorld:identity().slice(0,15)},{...draw(),matrixWorld:identity().map(()=>NaN)}];
 for(const bad of invalid){assert.throws(()=>r.update({draws:[{...draw(3),matrixWorld:new T.Matrix4().makeTranslation(5,6,7).toArray()},bad]}));assert.equal(group.children.length,1);assert.ok(mesh.matrix.equals(before));assert.equal(mesh.userData.nativeActor,metadata);assert.equal(mesh.visible,true);}
 root.scale.x=0;assert.throws(()=>r.update({draws:[]}),/invertible/);assert.equal(mesh.visible,true);
 assert.throws(()=>prepareNativeActorMeshes({draws:[draw()]},()=>({...part,localMatrix:null})),/part conversion/);r.dispose();
});

test('all original display cases retain complete matrices including projective partial writes',()=>{
 const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-display.json.gz',import.meta.url))));
 const root=new T.Group(),part=resource(),r=makeNativeActorRenderer(root,{getPart:()=>part}),group=root.children[0];let projective=0;
 for(const c of evidence.cases){
  const p=prepareNativeActorPresentation({matrixBuffers:Array.from({length:2},()=>Array.from({length:192},()=>evidence.baseMatrixWords).flat()),lightBuffers:Array.from({length:2},()=>evidence.baseLightBytes)},c.operations.filter(o=>/^presentation(?:Actor(?:Matrix|Part|Material|Surface|RetainedMatrix)|Light|Fog|GraphicsSync)/.test(o.kind)),{worldScale:.025});
  r.update(p);root.updateMatrixWorld(true);
  for(const [i,d]of p.draws.entries()){
   assert.deepEqual(group.children[i].matrixWorld.elements,d.matrixWorld);assert.equal(group.children[i].frustumCulled,false);
   if(d.matrixWorld[3]!==0||d.matrixWorld[7]!==0||d.matrixWorld[11]!==0||d.matrixWorld[15]!==1)projective++;
  }
  assert.equal(group.children.filter(m=>m.visible).length,p.draws.length);
 }
 assert.ok(projective>0);r.dispose();
});
