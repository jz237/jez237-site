import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {FENWICK_COURSES} from '../src/fenwick-course';import {createFenwickWorld} from '../src/fenwick-world';import {addFenwickGroundDetail} from '../src/fenwick-ground';
for(const course of FENWICK_COURSES)test(`${course.id}: clay detail preserves physical course, grid orientation and texture ownership`,()=>{
 const before=JSON.stringify({samples:course.samples,solids:course.solids,checkpoints:course.checkpoints});
 const material=new T.MeshStandardMaterial(),atlas=new T.Texture(),oldCompile=material.onBeforeCompile,oldKey=material.customProgramCacheKey;material.map=atlas;
 const detail=addFenwickGroundDetail(material,course);let released=0,atlasReleased=0;atlas.addEventListener('dispose',()=>atlasReleased++);detail.textures.forEach(t=>t.addEventListener('dispose',()=>released++));
 const shader:any={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};material.onBeforeCompile(shader,{} as any);
 assert.equal(material.map,atlas);assert.equal(detail.textures.length,7);assert.ok(material.normalMap);assert.equal(material.customProgramCacheKey(),'fenwick-photo-clay-v1');
 const start=shader.uniforms.fenwickStart.value as T.Vector4,p=course.point(0),q=course.point(.0001),dx=q.x-p.x,dz=q.z-p.z;
 assert.equal(start.x,p.x);assert.equal(start.y,p.z);assert.ok(Math.abs(dx*start.z-dz*start.w)<1e-8,'grid transverse axis is perpendicular to course heading');assert.ok(dx*start.w+dz*start.z>0,'grid longitudinal axis follows course heading');
 assert.ok(shader.fragmentShader.includes('aggregate=coursePaint*clayDetail;'));assert.ok(shader.fragmentShader.includes('float courseMark=max(gridPaint,'));assert.ok(!shader.fragmentShader.includes('float courseMark=max(courseWeights.b,'),'no invented curb paint');
 detail.dispose();detail.dispose();assert.equal(released,7);assert.equal(atlasReleased,0);assert.equal(material.onBeforeCompile,oldCompile);assert.equal(material.customProgramCacheKey,oldKey);
 const world=createFenwickWorld(course.id),ground=world.root.getObjectByName('fenwick_clay_ground') as T.Mesh<T.PlaneGeometry,T.MeshStandardMaterial>;
 assert.equal(world.root.userData.solidRecords,course.solids);assert.equal(ground.geometry.parameters.width,440);assert.equal(ground.geometry.parameters.height,360);assert.ok(ground.material.normalMap);let normalReleased=0;ground.material.normalMap!.addEventListener('dispose',()=>normalReleased++);world.dispose();world.dispose();assert.equal(normalReleased,1);
 assert.equal(JSON.stringify({samples:course.samples,solids:course.solids,checkpoints:course.checkpoints}),before);
});
