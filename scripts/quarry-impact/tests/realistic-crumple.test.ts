import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {crushGeometry,prepareWreckGeometry,repairWreckGeometry} from '../src/wreck-geometry';
import {finishPaint} from '../src/car-materials';
// Boolean assertions only around Three.js objects.
const slab=()=>{const g=new T.BoxGeometry(2,1.4,4.4,4,4,8);g.translate(0,.7,0);const m=new T.Mesh(g,new T.MeshPhysicalMaterial());m.name='panel_slab';const root=new T.Group();root.add(m);prepareWreckGeometry(root);return m;};
const frame={x:1,z:2.2,top:1.4};
test('crumple records how far each vertex has moved from the authored shape, and repair clears it',()=>{
 const m=slab(),g=m.geometry,c=g.attributes.crumple;
 try{
  assert.ok(!!c&&c.itemSize===3&&c.count===g.attributes.position.count,'every prepared panel carries a crumple vector per vertex');
  assert.ok((c.array as Float32Array).every(v=>v===0),'untouched bodywork does not crumple');
  crushGeometry(m,[1,0,0,0,0],frame);
  const p=g.attributes.position,original=m.userData.original as Float32Array;let worst=0,moved=0;
  for(let i=0;i<c.array.length;i++){worst=Math.max(worst,Math.abs(c.array[i]-(p.array[i]-original[i])));if(Math.abs(c.array[i])>.05)moved++;}
  assert.ok(worst<1e-6&&moved>0,'crumple equals the crushed offset');
  repairWreckGeometry(m);
  assert.ok((c.array as Float32Array).every(v=>v===0),'repair clears it');
 }finally{g.dispose();(m.material as T.Material).dispose();}
});
test('deferred crushes catch up when normals are refreshed',async()=>{
 const {refreshWreckNormals}=await import('../src/wreck-geometry');
 const m=slab(),c=m.geometry.attributes.crumple;
 try{
  crushGeometry(m,[0,0,1,0,0],frame,true);
  assert.ok((c.array as Float32Array).every(v=>v===0),'deferred: nothing until the refresh');
  refreshWreckNormals(m);
  assert.ok((c.array as Float32Array).some(v=>v>.1),'the side crush shows up after the refresh');
 }finally{m.geometry.dispose();(m.material as T.Material).dispose();}
});
test('paint shaders fold creases into the lighting normal and the clearcoat',()=>{
 for(const contact of [false,true]){
  const material=new T.MeshPhysicalMaterial({clearcoat:1});finishPaint(material,contact);
  const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{}} as unknown as T.WebGLProgramParametersWithUniforms;
  material.onBeforeCompile(shader,{} as T.WebGLRenderer);
  const v=shader.vertexShader,f=shader.fragmentShader;
  assert.ok(v.includes('attribute vec3 crumple;')&&v.includes('vCrumple = crumple;'),'vertex shader reads crumple');
  assert.ok(f.includes('normal=crumpleBump(')&&f.includes('clearcoatNormal=crumpleBump('),'both normals are bumped');
  assert.ok(f.indexOf('float crumpleHeight')<f.indexOf('normal=crumpleBump('),'height is ready before the normal is perturbed');
  assert.ok(material.customProgramCacheKey().includes('crumple'),'new program cache key');
  material.dispose();
 }
});
