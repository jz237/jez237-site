import test from 'node:test';
import assert from 'node:assert/strict';import * as T from 'three';import {createReservoirIntake} from '../src/reservoir-intake';import {createReservoirShore} from '../src/reservoir-shore';import {createStadiumReservoirWorld} from '../src/stadium-reservoir-world';import {BRAMBLEBROOK} from '../src/stadium-reservoir-courses';
test('waterworks clear track, meet terrain, ground trees and release resources',()=>{
const a=createReservoirIntake(),shore=createReservoirShore(),w=createStadiumReservoirWorld('bramblebrook-reservoir-v1');
const hills=w.root.getObjectByName(BRAMBLEBROOK.id+'_surrounding_landscape')!;w.root.updateMatrixWorld(true);const ray=new T.Raycaster(),heights:number[]=[];
for(const x of [61,70,79])for(const z of [256,265,274]){ray.set(new T.Vector3(x,100,z),new T.Vector3(0,-1,0));const hit=ray.intersectObject(hills)[0];assert.ok(hit);assert.ok(hit.point.y>=-8&&hit.point.y<=6);heights.push(hit.point.y);}
let clearance=Infinity,triangles=0,step=0;const samples=BRAMBLEBROOK.samples;for(let i=0;i<samples.length;i++){const p=samples[i],q=samples[(i+1)%samples.length];step=Math.max(step,Math.hypot(p.x-q.x,p.z-q.z));}
for(const b of a.root.userData.bounds as T.Box3[]){let n=Infinity;for(const p of samples)n=Math.min(n,Math.hypot(Math.max(b.min.x-p.x,0,p.x-b.max.x),Math.max(b.min.z-p.z,0,p.z-b.max.z)));clearance=Math.min(clearance,n-step/2);}assert.ok(clearance>24);
shore.root.updateMatrixWorld(true);const land=shore.root.children[0] as T.Mesh;assert.ok(shore.root.userData.trees.length>150);for(const t of shore.root.userData.trees){ray.set(new T.Vector3(t.x,100,t.z),new T.Vector3(0,-1,0));const hit=ray.intersectObject(land)[0];assert.ok(hit&&Math.abs(hit.point.y-t.y)<.0001);}
const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();for(const art of [a,shore])art.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1);}});
let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();shore.dispose();a.dispose();shore.dispose();w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
console.log(JSON.stringify({pieces:a.root.userData.pieces,trees:shore.root.userData.trees.length,triangles,clearance,foundationRange:[Math.min(...heights),Math.max(...heights)],disposal:true}));

});

import {HOLLOWAY} from '../src/stadium-reservoir-courses';
test('reservoir-only scenery preserves stadium and collision records',()=>{
 for(const course of [BRAMBLEBROOK,HOLLOWAY]){const w=createStadiumReservoirWorld(course.id as 'bramblebrook-reservoir-v1'|'holloway-stadium-v1');assert.equal(w.root.userData.solidRecords,course.solids);for(const name of ['bramblebrook-intake-tower','bramblebrook-wooded-shore'])assert.equal(Boolean(w.root.getObjectByName(name)),course===BRAMBLEBROOK);w.dispose();}
});
test('complete world releases new shared resources exactly once',()=>{
 const w=createStadiumReservoirWorld('bramblebrook-reservoir-v1'),gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();w.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));w.dispose();w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});
