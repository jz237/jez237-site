import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeGhostCraft} from '../ghost-craft.js';

test('ghost shares detailed geometry without serializing live LOD or shader metadata',()=>{
 const scene=new T.Scene(),boat=new T.Group(),body=new T.Group(),geometry=new T.BoxGeometry(),material=new T.MeshPhysicalMaterial({color:0xe69344});
 const mesh=new T.Mesh(geometry,material);body.add(mesh);boat.add(body);scene.add(boat);
 const metadata={toJSON(){throw Error('Runtime cache must never be serialized');}};boat.userData=metadata;mesh.userData=metadata;material.userData=metadata;
 let geometryDisposed=0;geometry.addEventListener('dispose',()=>geometryDisposed++);
 const ghost=makeGhostCraft(scene,{boat,body}),copy=ghost.root.children[0].children[0];
 assert.equal(boat.userData,metadata);assert.equal(mesh.userData,metadata);assert.equal(material.userData,metadata);
 assert.equal(copy.geometry,geometry);assert.notEqual(copy.material,material);assert.equal(copy.material.opacity,.25);assert.equal(copy.material.depthWrite,false);assert.equal(copy.material.depthTest,true);assert.equal(copy.castShadow,false);
 const pose={x:10,z:-5,heading:.5,hydro:{y:2,pitch:.2,roll:-.1}};ghost.show(pose);assert.equal(ghost.root.visible,true);assert.deepEqual(ghost.root.position.toArray(),[10,2,-5]);assert.equal(boat.position.x,0);
 ghost.show(null);assert.equal(ghost.root.visible,false);ghost.dispose();assert.equal(ghost.root.parent,null);assert.equal(geometryDisposed,0);
});
