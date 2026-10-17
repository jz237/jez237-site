import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {programWarmupView} from '../src/program-warmup';
import {createSableWorld} from '../src/sable-world';
test('warmup excludes inactive subtrees but retains hidden active damage and LOD content without scene mutations',()=>{
 const scene=new T.Scene(),active=new T.Group(),inactive=new T.Group(),light=new T.DirectionalLight(),geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial();inactive.visible=false;
 const mesh=new T.Mesh(geometry,material),brokenPart=new T.Mesh(geometry,material),lod=new T.LOD(),near=new T.Mesh(geometry,material),far=new T.Mesh(geometry,material),inactiveMesh=new T.Mesh(geometry,material);brokenPart.visible=false;far.visible=false;lod.addLevel(near,0);lod.addLevel(far,100);active.add(mesh,brokenPart,lod);inactive.add(inactiveMesh);scene.add(light,active,inactive);
 const before=scene.toJSON(),view=programWarmupView(scene,new Set([inactive])),visited:T.Object3D[]=[],facadeVisible:T.Object3D[]=[];view.traverse(o=>visited.push(o));view.traverseVisible(o=>facadeVisible.push(o));
 assert.ok(visited.includes(mesh)&&visited.includes(brokenPart)&&visited.includes(near)&&visited.includes(far));assert.ok(!visited.includes(inactive)&&!visited.includes(inactiveMesh));assert.deepEqual(facadeVisible,[view],'the extra compile light pass cannot duplicate scene lights');assert.deepEqual(scene.toJSON(),before);assert.equal(mesh.parent,active);assert.equal(inactiveMesh.parent,inactive);assert.equal(view.children.length,0);geometry.dispose();material.dispose();
});
test('real cached Sable contributes no materials while excluded, and every mesh returns on activation',async()=>{
 const world=createSableWorld();await world.ready;const scene=new T.Scene(),vehicle=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial());scene.add(world.root,vehicle);world.root.visible=false;
 const all:T.Object3D[]=[];scene.traverse(o=>{if(o instanceof T.Mesh)all.push(o);});assert.ok(all.length>60);
 const inactive:T.Object3D[]=[];programWarmupView(scene,new Set([world.root])).traverse(o=>{if(o instanceof T.Mesh)inactive.push(o);});assert.deepEqual(inactive,[vehicle]);
 const active:T.Object3D[]=[];programWarmupView(scene,new Set()).traverse(o=>{if(o instanceof T.Mesh)active.push(o);});assert.deepEqual(active,all);assert.equal(world.root.visible,false);assert.equal(world.root.parent,scene);
 world.dispose();vehicle.geometry.dispose();(vehicle.material as T.Material).dispose();
});
