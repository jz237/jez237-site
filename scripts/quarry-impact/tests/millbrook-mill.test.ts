import test from 'node:test';
import assert from 'node:assert/strict';import * as T from 'three';import {createMillbrookMill} from '../src/millbrook-mill';import {MILLBROOK} from '../src/canal-pass-courses';
test('mill is finite, clears the racing corridor, fits the canal and disposes once',()=>{
const a=createMillbrookMill(),points=MILLBROOK.samples;let step=0,clearance=Infinity,triangles=0;for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length];step=Math.max(step,Math.hypot(p.x-q.x,p.z-q.z));}
for(const b of a.root.userData.bounds as T.Box3[]){let nearest=Infinity;for(const p of points){const dx=Math.max(b.min.x-p.x,0,p.x-b.max.x),dz=Math.max(b.min.z-p.z,0,p.z-b.max.z);nearest=Math.min(nearest,Math.hypot(dx,dz));}clearance=Math.min(clearance,nearest-step/2);}
assert.ok(clearance>24);const wheel=a.root.userData.wheelBounds as T.Box3;assert.ok(wheel.min.z>=-14.5&&wheel.max.z<=4.5,'Wheel remains within canal water footprint');assert.ok(wheel.max.x<-20,'Wheel clears existing footbridge');assert.ok(wheel.min.z>-2,'Wheel clears the moored boat');assert.ok(wheel.min.y<.1&&wheel.max.y>.1,'Wheel reaches water level');const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();a.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1);if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);console.log(JSON.stringify({pieces:a.root.userData.pieces,triangles,clearance,wheelBounds:{min:wheel.min.toArray(),max:wheel.max.toArray()},disposal:true}));

});

import {createCanalPassWorld} from '../src/canal-pass-world';import {GRANITE_PASS} from '../src/canal-pass-courses';
test('only Millbrook receives the mill and collision records stay intact',()=>{
 for(const course of [MILLBROOK,GRANITE_PASS]){const w=createCanalPassWorld(course.id as 'millbrook-canal-v1'|'granite-pass-v1');assert.equal(w.root.userData.solidRecords,course.solids);assert.equal(Boolean(w.root.getObjectByName('millbrook-brick-mill')),course===MILLBROOK);w.dispose();}
});
test('clearing the mill footprint leaves all other seeded prop placements unchanged',async()=>{
 const {readMillbrookMillPrevious}=await import('./millbrook-mill-invariants');const ts=await import('typescript');
 const before=readMillbrookMillPrevious('src/course-scenery.ts').toString().replace(/from '(\.\/[^']+)'/g,(_m,path)=>"from '"+new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href+"'");
 const code=ts.transpileModule(before.replace("from 'three'","from '"+import.meta.resolve('three')+"'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const old=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const previous=old.createCourseScenery(MILLBROOK,'canal'),current=createCanalPassWorld('millbrook-canal-v1');
 const expected=previous.root.userData.placements.filter((p:any)=>!((p.kind==='tree'||p.kind==='rock')&&[[0,26,27,14],[-27,12,8,13],[10,10,13,6]].some(([cx,cz,w,d])=>Math.abs(p.x-cx)<w+p.radius*1.2&&Math.abs(p.z-cz)<d+p.radius*1.2)));
 assert.deepEqual(current.root.getObjectByName('millbrook-canal-v1_scenery')!.userData.placements,expected);previous.dispose();current.dispose();
});
