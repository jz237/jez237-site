import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeSourceMooredCraft} from '../source-moored-craft.js';
import {createSourceSunsetCourse} from '../source-sunset-course.js';
import {polygonDistance} from '../classic-courses.js';

test('static launch decks align with all recovered shore vertices without altering physical geometry',()=>{
 const course=createSourceSunsetCourse(polygonDistance),before=JSON.stringify(course.sourceShoresByPlayerCount),parent=new T.Group();
 const material=new T.MeshStandardMaterial(),materials=Object.fromEntries(['hull','deck','cabin','glass','metal','rubber'].map(k=>[k,material]));
 assert.equal(course.geometryForPlayers(2).sourceMooredCraft.length,0);
 for(const craft of course.geometryForPlayers(1).sourceMooredCraft){
  const view=makeSourceMooredCraft(parent,craft,materials);parent.updateMatrixWorld(true);
  const deck=view.root.getObjectByName('static-source-deck'),positions=deck.geometry.attributes.position;
  const worldVertices=Array.from({length:positions.count},(_,i)=>new T.Vector3().fromBufferAttribute(positions,i).applyMatrix4(deck.matrixWorld));
  for(const [x,z] of craft.outline)assert.ok(worldVertices.some(p=>Math.hypot(p.x-x,p.z-z)<1e-5),'every source footprint corner is visible');
  const hull=view.root.getObjectByName('static-source-hull');hull.geometry.computeBoundingBox();
  assert.ok(Math.abs(hull.geometry.boundingBox.min.y+1.1)<1e-6);assert.ok(Math.abs(hull.geometry.boundingBox.max.y-.65)<1e-6);
  view.root.traverse(mesh=>{if(!mesh.isMesh)return;for(const attr of Object.values(mesh.geometry.attributes))assert.ok(Array.from(attr.array).every(Number.isFinite));});
  assert.equal(view.root.userData.dynamic,undefined);assert.equal(view.root.userData.sourceMooredCraft.sourceHeight,null);
  view.dispose();
 }
 assert.equal(JSON.stringify(course.sourceShoresByPlayerCount),before);assert.equal(parent.children.length,0);material.dispose();
});

test('switching player layouts disposes every static craft geometry once and keeps shared materials alive',()=>{
 const course=createSourceSunsetCourse(polygonDistance),parent=new T.Group(),material=new T.MeshStandardMaterial();let materialDisposals=0;
 material.addEventListener('dispose',()=>materialDisposals++);
 const materials=Object.fromEntries(['hull','deck','cabin','glass','metal','rubber'].map(k=>[k,material]));
 const views=course.sourceMooredCraft.map(c=>makeSourceMooredCraft(parent,c,materials));let meshes=0,disposals=0;
 parent.traverse(mesh=>{if(mesh.isMesh){meshes++;mesh.geometry.addEventListener('dispose',()=>disposals++);}});
 assert.equal(parent.children.length,2);assert.ok(meshes>100,'full cabin, rails, deck and fittings are present');
 for(const view of views){view.dispose();view.dispose();}
 assert.equal(disposals,meshes);assert.equal(materialDisposals,0);assert.equal(parent.children.length,0);material.dispose();
});
