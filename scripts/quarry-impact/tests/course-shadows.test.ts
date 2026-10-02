import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {StaticQuarryShadows,fitStaticShadowCamera} from '../src/static-shadows';

const venue=(x:number)=>{const root=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(4,8,6),new T.MeshStandardMaterial());mesh.castShadow=true;mesh.position.set(x,4,0);root.add(mesh);return{root,mesh};};
const compile=(material:T.Material)=>{const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{} as Record<string,T.IUniform>};material.onBeforeCompile(shader as any,{}as T.WebGLRenderer);return shader;};
test('venue replacement retains one receiver patch, refits depth and disposes only old capture materials',()=>{
 const a=venue(-70),b=venue(130),shadows=new StaticQuarryShadows(a.root,new Set());
 shadows.bindReceivers(a.root);const before=compile(a.mesh.material),hook=a.mesh.material.onBeforeCompile,key=a.mesh.material.customProgramCacheKey(),matrix=before.uniforms.quarryStaticMatrix.value as T.Matrix4;
 const originalMatrix=matrix.clone(),sourceGeometry=a.mesh.geometry,oldMaterials=shadows.casterScene.children.map(o=>(o as T.Mesh).material as T.Material);
 let disposed=0,geometryDisposed=0;oldMaterials.forEach(m=>m.addEventListener('dispose',()=>disposed++));sourceGeometry.addEventListener('dispose',()=>geometryDisposed++);
 for(let i=0;i<10;i++){
  const next=i%2?a:b;shadows.replaceCasters(next.root,new Set());shadows.bindReceivers(next.root);shadows.bindReceivers(a.root);
  assert.equal(shadows.casterScene.children.length,1);assert.equal(a.mesh.material.onBeforeCompile,hook);assert.equal(a.mesh.material.customProgramCacheKey(),key);
  const shader=compile(a.mesh.material);assert.equal(shader.uniforms.quarryStaticMatrix.value,matrix);assert.equal((shader.vertexShader.match(/uniform mat4 quarryStaticMatrix/g)||[]).length,1);
  const fitted=fitStaticShadowCamera(shadows.bounds);assert.deepEqual(shadows.camera.projectionMatrix.toArray(),fitted.projectionMatrix.toArray());assert.deepEqual(shadows.camera.matrixWorldInverse.toArray(),fitted.matrixWorldInverse.toArray());
  const corner=new T.Vector3(next.mesh.position.x,4,0).project(shadows.camera);assert.ok(Math.max(Math.abs(corner.x),Math.abs(corner.y),Math.abs(corner.z))<1);
  assert.equal(shader.uniforms.quarryStaticEnabled.value,0,'old map must not shade the new venue before capture');
 }
 assert.equal(disposed,oldMaterials.length);assert.equal(geometryDisposed,0);assert.deepEqual(matrix.toArray(),originalMatrix.toArray());assert.equal(a.mesh.parent,a.root);assert.equal(b.mesh.parent,b.root);
 shadows.dispose();for(const v of [a,b]){v.mesh.geometry.dispose();v.mesh.material.dispose();}
});
test('an invalid empty replacement leaves the live caster set, camera and receiver uniforms intact',()=>{
 const a=venue(0),shadows=new StaticQuarryShadows(a.root,new Set());shadows.bindReceivers(a.root);const nodes=shadows.casterScene.children.slice(),stats=structuredClone(shadows.stats),shader=compile(a.mesh.material),matrix=(shader.uniforms.quarryStaticMatrix.value as T.Matrix4).clone();
 assert.throws(()=>shadows.replaceCasters(new T.Group(),new Set()),/no casters/);assert.deepEqual(shadows.casterScene.children,nodes);assert.deepEqual(shadows.stats,stats);assert.deepEqual((shader.uniforms.quarryStaticMatrix.value as T.Matrix4).toArray(),matrix.toArray());
 shadows.dispose();a.mesh.geometry.dispose();a.mesh.material.dispose();
});
