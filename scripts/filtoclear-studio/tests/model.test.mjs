import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import {buildFilter} from '../model.js';
import {PARTS,LESSONS,explosionOffset} from '../data.js';
const f=buildFilter({textures:false});
test('every selectable assembly has geometry, a description and a valid lesson reference',()=>{
 assert.equal(new Set(PARTS.map(p=>p.id)).size,32);assert.equal(f.parts.size,32);
 for(const p of f.parts.values()){assert.ok(p.meshes.length>0,p.id);assert.ok(p.description.length>30,p.id);assert.ok(p.detail.length>30,p.id);for(const m of p.meshes)assert.equal(m.userData.part,p.id);}
 for(const l of LESSONS)assert.ok(f.parts.has(l.part));
});
test('assembled foam order follows the 5200 manual: blue, red, blue, purple',()=>{
 const stack=f.foam.toSorted((a,b)=>b.base.y-a.base.y).map(p=>p.id);
 assert.deepEqual(stack,['foam-top','foam-red','foam-blue','foam-purple']);
});
test('explosion remains finite and continuously reversible over its full travel',()=>{
 for(const a of [0,.01,.2,.5,.8,1,.7,.1,0]){f.pose(a,false);f.root.updateMatrixWorld(true);for(const p of f.parts.values()){assert.ok(p.object.position.toArray().every(Number.isFinite));const b=new THREE.Box3().setFromObject(p.object);assert.ok([...b.min.toArray(),...b.max.toArray()].every(Number.isFinite),p.id);assert.ok(b.getSize(new THREE.Vector3()).length()>0,p.id);}}
 for(const p of f.parts.values())assert.ok(p.object.position.distanceTo(p.base)<1e-9,p.id);
 for(const p of f.parts.values()){const a=explosionOffset(p.offset,.501,p.delay),b=explosionOffset(p.offset,.5,p.delay);assert.ok(Math.hypot(...a.map((v,i)=>v-b[i]))<.1);}
});
test('all four foam layers and their neighboring supports are separated in exploded view',()=>{
 f.pose(1);f.root.updateMatrixWorld(true);const boxes=f.foam.toSorted((a,b)=>a.object.position.y-b.object.position.y).map(p=>new THREE.Box3().setFromObject(p.object));
 for(let i=1;i<boxes.length;i++)assert.ok(boxes[i].min.y-boxes[i-1].max.y>.3);
});
test('cleaning lifts the bottom plate and compresses the foam, then restores the assembly',()=>{
 f.pose(0,false,1);assert.ok(f.parts.get('base-plate').object.position.y>f.parts.get('base-plate').base.y+.3);
 for(const p of f.foam)assert.ok(p.object.scale.y<.9);
 f.pose(0,false,0);for(const p of f.parts.values()){assert.ok(p.object.position.distanceTo(p.base)<1e-9);assert.equal(p.object.scale.y,1);}
});
test('cutaway opens the shell, foam and supports and restores every front sector',()=>{
 f.pose(0,true);assert.ok(f.fronts.every(p=>!p.visible));f.pose(0,false);assert.ok(f.fronts.every(p=>p.visible));
});

test('cutaway exposes all four foam cores while keeping the rear media and model positions intact',()=>{
 f.pose(0,true);
 for(const p of f.foam){assert.ok(p.meshes.some(m=>m.visible),p.id);assert.ok(p.meshes.some(m=>!m.visible),p.id);assert.ok(p.object.position.distanceTo(p.base)<1e-9);}
 for(const id of ['mesh','base-plate','spacer-top']){const p=f.parts.get(id);assert.ok(p.meshes.some(m=>m.visible));assert.ok(p.meshes.some(m=>!m.visible));}
 f.pose(1,false);for(const p of f.foam)assert.ok(p.meshes.every(m=>m.visible));
 f.pose(0,true,1);f.pose(0,false,0);for(const p of f.parts.values())assert.ok(p.object.position.distanceTo(p.base)<1e-9);
});
