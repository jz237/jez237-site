import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFenwickLandscape,fenwickLandscapeHeight} from '../src/fenwick-landscape';
test('meadow has ground relief, grouped tree density and owned surface textures',()=>{
 const world=createFenwickLandscape(),ground=world.root.getObjectByName('fenwick_outer_land') as T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;
 const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <alphamap_fragment>\n#include <normal_fragment_maps>\n#include <roughnessmap_fragment>'};
 ground.material.onBeforeCompile(shader as any,{} as any);
 assert.match(shader.fragmentShader,/coursePair/);assert.ok(ground.material.normalMap);
 const uniforms=shader.uniforms as Record<string,{value:unknown}>;const textures=new Set<T.Texture>([ground.material.normalMap!]);for(const entry of Object.values(uniforms))if(entry.value instanceof T.Texture)textures.add(entry.value);
 let released=0;textures.forEach(t=>t.addEventListener('dispose',()=>released++));
 const trees=world.root.userData.treePlaces as {x:number;y:number;z:number}[];
 const sectors=Array(36).fill(0);for(const p of trees){sectors[Math.floor((Math.atan2(p.z,p.x)+Math.PI)/(2*Math.PI)*36)%36]++;assert.equal(p.y,fenwickLandscapeHeight(p.x,p.z));}
 assert.ok(Math.max(...sectors)>Math.min(...sectors)*3+10,'groves produce open and dense views');
 for(const x of [-220,0,220])assert.equal(fenwickLandscapeHeight(x,180),-.04,'venue margin remains recessed and flat');
 assert.ok(ground.geometry.attributes.color.array.every(Number.isFinite));world.dispose();world.dispose();assert.equal(released,textures.size);
});
