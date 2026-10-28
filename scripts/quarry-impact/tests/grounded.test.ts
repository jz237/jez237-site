import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CONTACT,ContactShadows,contactStrength} from '../src/contact-shadows';
import {TURF,turf} from '../src/turf';
const read=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
test('a footprint is darkest with the car on the ground and gone once it is well up in the air',()=>{
  assert.equal(contactStrength(0),CONTACT.opacity);assert.ok(contactStrength(.5)<CONTACT.opacity&&contactStrength(.5)>0);
  assert.equal(contactStrength(CONTACT.fade[1]+.1),0);assert.equal(contactStrength(NaN),0);
});
test('one footprint per shown car, sized to its body, on the floor under it; none while the sun shadows are live',()=>{
  const scene=new T.Scene(),shadows=new ContactShadows(scene),root=new T.Object3D(),hidden=new T.Object3D();hidden.visible=false;
  const cars=[{current:new T.Vector3(3,.45,4),currentQ:new T.Quaternion(),kind:'a',root},{current:new T.Vector3(9,3.5,9),currentQ:new T.Quaternion(),kind:'a',root},{current:new T.Vector3(0,.45,0),currentQ:new T.Quaternion(),kind:'a',root:hidden},{current:new T.Vector3(0,.45,0),currentQ:new T.Quaternion(),kind:'missing',root}];
  shadows.update(cars,{a:{halfLength:2,halfWidth:1}},()=>0,true);
  assert.equal(shadows.mesh.count,1,'not the one in the air, the hidden one or one of no known size');
  const m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();shadows.mesh.getMatrixAt(0,m);m.decompose(p,q,s);
  assert.ok(Math.abs(p.x-3)<1e-9&&Math.abs(p.y-CONTACT.lift)<1e-9&&Math.abs(s.x-(2+CONTACT.spread*2))<1e-6&&Math.abs(s.z-(4+CONTACT.spread*2))<1e-6);
  shadows.update(cars,{a:{halfLength:2,halfWidth:1}},()=>0,false);assert.equal(shadows.mesh.count,0);assert.equal(shadows.mesh.visible,false);
  shadows.dispose();assert.equal(scene.children.length,0);
});
test('plain venue green becomes photographed turf, patchy and toned, keeping its own hue',()=>{
  const m=turf(new T.MeshStandardMaterial({color:0x5e7a3c})),shader={uniforms:{} as Record<string,T.IUniform>,vertexShader:'#include <worldpos_vertex>\n',fragmentShader:'#include <map_fragment>\n'} as unknown as T.WebGLProgramParametersWithUniforms;
  m.onBeforeCompile(shader,{} as T.WebGLRenderer);
  assert.ok(shader.vertexShader.includes('vTurf=(modelMatrix*turfAt).xyz;')&&shader.fragmentShader.includes(`texture2D(turfPhoto,q/${TURF.scale.toFixed(1)})`)&&shader.uniforms.turfPhoto.value instanceof T.Texture);
  assert.ok(shader.fragmentShader.includes('vec3 hue=diffuseColor.rgb/')&&m.customProgramCacheKey().endsWith('|turf'));
  assert.equal(turf(new T.MeshStandardMaterial()).onBeforeCompile!==undefined,true);
});
test('main lays the footprints only without the sun shadows; Kestrel Ring and Moorfield grass is turf',()=>{
  assert.ok(read('main.ts').includes('contactShadows?.update(cars, DEFINITIONS, (x, z, near) => Math.max(fx.floorAt(x, z, near), fx.groundHeight(x, z) + .018), !shadowsLive && !!fx);'));
  assert.ok(read('kestrel-ring-world.ts').includes('const grassMaterial=turf(')&&read('kestrel-ring-world.ts').includes('apronMaterial=turf(')&&read('moorfield-speedbowl-world.ts').includes('apronMaterial=turf('));
});
