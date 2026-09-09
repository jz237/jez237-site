import assert from 'node:assert/strict';
import * as T from 'three';
import { createAccessories, beltPath, DRIVE } from '../app/engine-accessories.ts';
import { OpeningSequence } from './opening.ts';
import { inInspectionWindow, sectionEngine, windowClipping } from '../app/inspection-windows.ts';
import { cylinderState, ORDER, L } from './mechanics.ts';

const root=new T.Group(),crank=new T.Group(),parts=[];root.add(crank);
const drive=createAccessories(root,crank,(mesh,part)=>parts.push({mesh,part}));
const pulley=name=>parts.find(p=>p.part.name===name).mesh.parent;
for(const angle of [0,90,719.9,720,720.1,1440,10000]) {
  crank.rotation.z=-angle*Math.PI/180;drive.update(angle);
  assert.ok(Math.abs(pulley('Water-pump pulley').rotation.z+angle*Math.PI/180*.45/.32)<1e-10);
  assert.ok(Math.abs(pulley('Alternator pulley').rotation.z+angle*Math.PI/180*1.8)<1e-10);
  assert.equal(pulley('Crank accessory pulley').parent,crank);
}
const path=beltPath();assert.ok(path.getPointAt(0).distanceTo(path.getPointAt(1))<1e-9);
for(let n=0;n<=2000;n++){const point=path.getPointAt(n/2000);for(const p of DRIVE) assert.ok(Math.hypot(point.x-p.x,point.y-p.y)>p.r-.001,'Belt cuts through a pulley');}
for(const p of DRIVE){let contact=0;for(let n=0;n<2000;n++){const q=path.getPointAt(n/2000);if(Math.abs(Math.hypot(q.x-p.x,q.y-p.y)-p.r)<.001)contact++;}assert.ok(contact>20,'Pulley has no belt wrap');}
assert.ok(inInspectionWindow(cylinderState(1,0).z));assert.ok(inInspectionWindow(cylinderState(3,0).z));
assert.ok(!inInspectionWindow(cylinderState(5,0).z));assert.ok(!inInspectionWindow(cylinderState(7,0).z));
const opening=new OpeningSequence(false);
assert.deepEqual(opening.sample(0),{active:true,assembled:true,cut:0});
assert.equal(opening.sample(1100).cut,0);assert.ok(Math.abs(opening.sample(2200).cut-.5)<1e-9);
assert.deepEqual(opening.sample(3300),{active:false,assembled:false,cut:1});
opening.replay();assert.equal(opening.sample(4000).assembled,true);opening.cancel();assert.equal(opening.sample(4001).active,false);
const reduced=new OpeningSequence(true);assert.equal(reduced.sample(0).active,false);reduced.replay();assert.equal(reduced.sample(100).active,false);
opening.replay();opening.setReduced(true);assert.equal(opening.sample(5000).active,false);
for(let a=0;a<=1440;a++)for(let id=1;id<=8;id++){const s=cylinderState(id,a);assert.ok(Math.abs(Math.hypot(s.x-s.pinX,s.y-s.pinY)-L)<1e-10);}
ORDER.forEach((id,i)=>assert.equal(cylinderState(id,i*90).cycle,0));
// Registration must include arbitrary future parts and every material slot,
// while leaving the exhibit stage and stencil helpers alone.
const engine=new T.Group(),outside=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());
const plane=new T.Plane(new T.Vector3(1,0,0),0);
const nested=new T.Group();engine.add(nested);
const shell=new T.Mesh(new T.BoxGeometry(),[new T.MeshStandardMaterial(),new T.MeshBasicMaterial()]);
shell.castShadow=true;nested.add(shell);
const particles=new T.Points(new T.BufferGeometry(),new T.PointsMaterial());nested.add(particles);
const helper=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial());helper.userData.sectionHelper=true;nested.add(helper);
const registered=sectionEngine(engine,plane);
assert.equal(registered.size,3);
for(const material of [...shell.material,particles.material])assert.equal(material.clippingPlanes[0],plane);
assert.equal(shell.customDepthMaterial.clippingPlanes[0],plane);
assert.equal(outside.material.clippingPlanes,null);assert.equal(helper.material.clippingPlanes,null);
const shader={uniforms:{},vertexShader:'#include <common>\n#include <project_vertex>',fragmentShader:'#include <common>\n#include <clipping_planes_fragment>'};
windowClipping(shell.material[0]);shell.material[0].onBeforeCompile(shader,{});
assert.equal(shader.fragmentShader.match(/uniform float inspectionWindows/g).length,1);
assert.ok(shader.fragmentShader.includes('inspectionWindows<0.5'));
assert.ok(shader.vertexShader.includes('modelMatrix*vec4(transformed,1.0)'));
console.log('Verified whole-engine section registration, material arrays, window shader, shadow clipping and helper exclusions.');
console.log('Verified belt tangency/wrap, continuous pulley ratios across 720°, window selection, opening/replay/cancel/reduced-motion, and linkage motion across two cycles.');
