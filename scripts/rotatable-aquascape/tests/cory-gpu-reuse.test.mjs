import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {CoryModels} from '../lib/CoryModels.ts';
import {indexExactVertices} from '../lib/ExactVertexIndex.ts';
// Expanded attribute hashes from the full-detail, unindexed a086137c3 models.
const originalHashes=['8ac22e9c0eb13783257ac66a83e238773aa19f472e02dd19caa94ff5640c6853','4c8d38c0a99e332e98165e239ce8f387141814084d9ef2d33a5bfa3f12ad9566'];
test('indexed Corydoras retain every original triangle attribute bit and articulation seam',()=>{
 const models=new CoryModels(6);
 for(const [id,mesh] of models.meshes.entries()){
  const g=mesh.geometry,h=createHash('sha256');
  for(const [name,a] of Object.entries(g.attributes).sort(([a],[b])=>a.localeCompare(b))){
   if(a.isInstancedBufferAttribute)continue;
   const bits=new Uint32Array(a.array.buffer,a.array.byteOffset,a.array.length),expanded=new Uint32Array(g.index.count*a.itemSize);
   for(let i=0;i<g.index.count;i++)for(let k=0;k<a.itemSize;k++)expanded[i*a.itemSize+k]=bits[g.index.getX(i)*a.itemSize+k];
   // Eye vertices now use an explicit non-breathing region, 11 instead of 9.
   // Normalize only that intentional articulation label for the original proof;
   // positions, normals, colors, UVs and all other region bits must still match.
   if(name==='coryPart'){const parts=new Float32Array(expanded.buffer);for(let i=0;i<parts.length;i++)if(parts[i]===11)parts[i]=9;}
   h.update(name);h.update(new Uint8Array(expanded.buffer));
  }
  assert.equal(h.digest('hex'),originalHashes[id]);
  assert.ok(g.attributes.position.count<g.index.count*.23);
 }
});
test('exact indexing keeps close positions, signed zero, normals, UV and joint differences',()=>{
 const g=new T.BufferGeometry(),points=[0,0,0, 0,0,0, 0,0,0, 1e-9,0,0, -0,0,0, 0,0,0, 0,0,0];
 g.setAttribute('position',new T.Float32BufferAttribute(points,3));
 g.setAttribute('normal',new T.Float32BufferAttribute([0,1,0, 0,1,0, 0,-1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0],3));
 g.setAttribute('uv',new T.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,1,0,0,0],2));
 g.setAttribute('joint',new T.Float32BufferAttribute([0,0,0,0,0,0,1],1));
 indexExactVertices(g);assert.deepEqual([...g.index.array],[0,0,1,2,3,4,5]);
});
test('surface and depth shaders share the center pose and retain independent fin/body deformation',()=>{
 const models=new CoryModels(2);
 for(const mesh of models.meshes)for(const [material,base] of [[mesh.material,T.ShaderLib.standard],[mesh.customDepthMaterial,T.ShaderLib.depth]]){
  const shader={vertexShader:base.vertexShader,fragmentShader:base.fragmentShader,uniforms:{}};material.onBeforeCompile(shader,{});
  assert.equal(shader.vertexShader.split('coryPose(position)').length-1,1);
  assert.ok(shader.vertexShader.indexOf('vec3 coryCenter=coryPose(position);')<shader.vertexShader.indexOf('vec3 transformed=coryCenter;'));
  assert.match(shader.vertexShader,/coryPose\(position\+t\*\.001\)-coryCenter/);
  assert.match(shader.vertexShader,/coryPose\(position\+b\*\.001\)-coryCenter/);
  assert.match(shader.vertexShader,/attribute vec4 coryMotion/);
 }
});
