import test from 'node:test';
import assert from 'node:assert/strict';import * as T from 'three';import {createHazelwoodLookout} from '../src/hazelwood-lookout';import {HAZELWOOD} from '../src/coast-forest-courses';
test('lookout clears track, meets terrain and releases resources',()=>{
const a=createHazelwoodLookout(),points=HAZELWOOD.samples;let step=0,clearance=Infinity,triangles=0;
for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length];step=Math.max(step,Math.hypot(p.x-q.x,p.z-q.z));}
for(const b of a.root.userData.bounds as T.Box3[]){let n=Infinity;for(const p of points)n=Math.min(n,Math.hypot(Math.max(b.min.x-p.x,0,p.x-b.max.x),Math.max(b.min.z-p.z,0,p.z-b.max.z)));clearance=Math.min(clearance,n-step/2);}assert.ok(clearance>24);
const heights:number[]=[];for(const x of [2,14])for(const z of [-16,-4])for(const dx of [-1,1])for(const dz of [-1,1]){const h=HAZELWOOD.height(x+dx,z+dz);assert.ok(h>=0&&h<=5);heights.push(h);}
const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();a.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1);if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();a.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);console.log(JSON.stringify({pieces:a.root.userData.pieces,triangles,clearance,footingHeightRange:[Math.min(...heights),Math.max(...heights)],disposal:true}));

});

import {createCoastForestWorld} from '../src/coast-forest-world';import {SEABROOK} from '../src/coast-forest-courses';
test('Hazelwood-only landmark preserves coastal venue and collision records',()=>{
 for(const course of [HAZELWOOD,SEABROOK]){const w=createCoastForestWorld(course.id as 'hazelwood-forest-v1'|'seabrook-coast-v1');assert.equal(w.root.userData.solidRecords,course.solids);assert.equal(Boolean(w.root.getObjectByName('hazelwood-timber-lookout')),course===HAZELWOOD);w.dispose();}
});
test('clearing the lookout footprint leaves all other seeded prop placements unchanged',async()=>{
 const {readHazelwoodLookoutPrevious}=await import('./hazelwood-lookout-invariants');const ts=await import('typescript');
 const before=readHazelwoodLookoutPrevious('src/course-scenery.ts').toString().replace(/from '(\.\/[^']+)'/g,(_m,path)=>"from '"+new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href+"'");
 const code=ts.transpileModule(before.replace("from 'three'","from '"+import.meta.resolve('three')+"'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const old=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const previous=old.createCourseScenery(HAZELWOOD,'forest'),current=createCoastForestWorld('hazelwood-forest-v1');
 const expected=previous.root.userData.placements.filter((p:any)=>!((p.kind==='tree'||p.kind==='rock')&&[[8,-10,9,10]].some(([cx,cz,w,d])=>Math.abs(p.x-cx)<w+p.radius*1.2&&Math.abs(p.z-cz)<d+p.radius*1.2)));
 assert.deepEqual(current.root.getObjectByName('hazelwood-forest-v1_scenery')!.userData.placements,expected);previous.dispose();current.dispose();
});
