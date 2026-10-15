import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createSableLandscape} from '../src/sable-landscape';
import {SABLE} from '../src/sable-course';
test('every cliff triangle stays outside the racing corridor, not just its vertices',()=>{
 const world=createSableLandscape(),mesh=world.root.children[0] as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>,p=mesh.geometry.attributes.position,index=mesh.geometry.index!;
 let minimum=Infinity;
 for(let i=0;i<index.count;i+=3){const points=[0,1,2].map(j=>new T.Vector2(p.getX(index.getX(i+j)),p.getZ(index.getX(i+j))));const centre=points.reduce((sum,v)=>sum.add(v),new T.Vector2()).multiplyScalar(1/3);const radius=Math.max(...points.map(v=>v.distanceTo(centre)));minimum=Math.min(minimum,SABLE.distance(centre.x,centre.y)-radius);}
 // Distance to the route is 1-Lipschitz; the enclosing disk bounds every triangle point.
 assert.ok(minimum>24,'conservative triangle clearance '+minimum);
 assert.ok([...p.array].every(Number.isFinite));assert.equal(p.count,20790);
 const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <color_fragment>'} as any;mesh.material.onBeforeCompile(shader,{} as any);const photo=shader.uniforms.canyonPhoto.value;
 let released=0;for(const item of [photo,mesh.geometry,mesh.material])item.addEventListener('dispose',()=>released++);
 world.dispose();world.dispose();assert.equal(released,3);assert.equal(world.root.children.length,0);
});
