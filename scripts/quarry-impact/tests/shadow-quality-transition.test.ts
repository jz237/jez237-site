import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {setSceneShadows} from '../src/rendering';
test('quality changes invalidate reused and hidden material programs once in both directions',()=>{
 const scene=new T.Scene(),geometry=new T.BoxGeometry(),shared=new T.MeshStandardMaterial(),other=new T.MeshPhysicalMaterial(),hidden=new T.Group();hidden.visible=false;
 scene.add(new T.Mesh(geometry,shared));hidden.add(new T.Mesh(geometry,[shared,other]));scene.add(hidden);
 const renderer={shadowMap:{enabled:true}}as Pick<T.WebGLRenderer,'shadowMap'>;
 const original=[shared.version,other.version];
 setSceneShadows(renderer,scene,false);assert.equal(renderer.shadowMap.enabled,false);assert.deepEqual([shared.version,other.version],original.map(v=>v+1));
 setSceneShadows(renderer,scene,false);assert.deepEqual([shared.version,other.version],original.map(v=>v+1));
 setSceneShadows(renderer,scene,true);assert.equal(renderer.shadowMap.enabled,true);assert.deepEqual([shared.version,other.version],original.map(v=>v+2));
 assert.equal(hidden.visible,false);assert.equal(scene.children.length,2);geometry.dispose();shared.dispose();other.dispose();
});
