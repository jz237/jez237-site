import assert from 'node:assert/strict';
import * as T from 'three';
import {stabilizeFishPasses} from '../StableFishPasses.ts';
const scene=new T.Group(),clock={value:3.5};
const source=new T.MeshPhysicalMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,opacity:.57});
source.onBeforeCompile=shader=>{shader.uniforms.clock=clock;};
source.customProgramCacheKey=()=> 'independent-fish-wave';
const geometry=new T.PlaneGeometry(2,2,8,8),a=new T.Mesh(geometry,source),b=new T.Mesh(geometry,source);a.name=b.name='fin';b.position.x=3;scene.add(a,b);scene.updateMatrixWorld(true);
const rays=[];
for(const side of [-1,1])for(const x of [-.67,0,.28,3.16])rays.push(new T.Raycaster(new T.Vector3(x,.33,side*2),new T.Vector3(0,0,-side)));
const expected=rays.map(r=>r.intersectObjects([a,b]).map(h=>({point:h.point.toArray(),uv:h.uv.toArray(),face:h.faceIndex,object:h.object.id})));
const stats=stabilizeFishPasses(scene);assert.deepEqual(stats,{meshes:2,materials:2,geometries:1});
assert.equal(a.geometry,b.geometry);assert.notEqual(a.geometry,geometry);
assert.equal(a.geometry.index,geometry.index);
for(const key of Object.keys(geometry.attributes))assert.equal(a.geometry.attributes[key],geometry.attributes[key],'no duplicated or changed vertex buffers');
assert.equal(a.material,b.material);assert.deepEqual(a.material.map(m=>m.side),[T.BackSide,T.FrontSide]);
for(const material of a.material){assert.equal(material.opacity,.57);assert.equal(material.depthWrite,false);assert.equal(material.transparent,true);assert.equal(material.customProgramCacheKey(),'independent-fish-wave');const shader={uniforms:{}};material.onBeforeCompile(shader);assert.equal(shader.uniforms.clock,clock);}
assert.deepEqual(a.geometry.groups,[{start:0,count:384,materialIndex:0},{start:0,count:384,materialIndex:1}]);
assert.deepEqual(rays.map(r=>r.intersectObjects([a,b]).map(h=>({point:h.point.toArray(),uv:h.uv.toArray(),face:h.faceIndex,object:h.object.id}))),expected,'both sides retain exact picking results without duplicate hits');
assert.equal(stabilizeFishPasses(scene).meshes,0,'idempotent');
for(const tweak of [m=>m.depthWrite=true,m=>m.transmission=.3,m=>m.forceSinglePass=true,m=>m.transparent=false]){const material=source.clone();tweak(material);const mesh=new T.Mesh(geometry,material);mesh.name='fin';assert.equal(stabilizeFishPasses(mesh).meshes,0);assert.equal(mesh.geometry,geometry);}
console.log('Stable fish passes preserve buffers, draw order, shader uniforms, transparency and two-sided identification.');
