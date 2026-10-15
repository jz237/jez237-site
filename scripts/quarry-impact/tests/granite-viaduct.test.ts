import test from 'node:test';
import assert from 'node:assert/strict';import * as T from 'three';
import {createGraniteViaduct} from '../src/granite-viaduct';import {createCanalPassWorld} from '../src/canal-pass-world';import {GRANITE_PASS} from '../src/canal-pass-courses';
test('viaduct clears track, meets actual hillside and disposes once',()=>{
const a=createGraniteViaduct(),w=createCanalPassWorld('granite-pass-v1');
const hills=w.root.getObjectByName('granite-pass-v1_surrounding_landscape')!;assert.ok(hills);w.root.updateMatrixWorld(true);
const ray=new T.Raycaster(),heights:number[]=[];
for(let i=0;i<8;i++)for(const dx of [-2,0,2])for(const dz of [-5,0,5]){ray.set(new T.Vector3(-98+i*28+dx,100,220+dz),new T.Vector3(0,-1,0));const hit=ray.intersectObject(hills)[0];assert.ok(hit,'Actual scenery terrain under pier');assert.ok(hit.point.y>=0&&hit.point.y<46,'Pier meets hillside below the deck');heights.push(hit.point.y);}
let clearance=Infinity,step=0,triangles=0;const samples=GRANITE_PASS.samples;
for(let i=0;i<samples.length;i++){const a=samples[i],b=samples[(i+1)%samples.length];step=Math.max(step,Math.hypot(a.x-b.x,a.z-b.z));}
for(const b of a.root.userData.bounds as T.Box3[]){let nearest=Infinity;for(const p of samples)nearest=Math.min(nearest,Math.hypot(Math.max(b.min.x-p.x,0,p.x-b.max.x),Math.max(b.min.z-p.z,0,p.z-b.max.z)));clearance=Math.min(clearance,nearest-step/2);}
assert.ok(clearance>24);const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();
a.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));triangles+=(o.geometry.index?.count??o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1);}});
let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));a.dispose();a.dispose();w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
console.log(JSON.stringify({pieces:a.root.userData.pieces,triangles,clearance,pierTerrainRange:[Math.min(...heights),Math.max(...heights)],disposal:true}));

});

import {MILLBROOK} from '../src/canal-pass-courses';
test('Granite Pass receives viaduct, Millbrook keeps mill, collision records stay intact',()=>{
 for(const course of [GRANITE_PASS,MILLBROOK]){const w=createCanalPassWorld(course.id as 'granite-pass-v1'|'millbrook-canal-v1');assert.equal(w.root.userData.solidRecords,course.solids);assert.equal(Boolean(w.root.getObjectByName('granite-railway-viaduct')),course===GRANITE_PASS);assert.equal(Boolean(w.root.getObjectByName('millbrook-brick-mill')),course===MILLBROOK);w.dispose();}
});
test('clearing the viaduct footprint leaves all other seeded prop placements unchanged',async()=>{
 const {readGraniteViaductPrevious}=await import('./granite-viaduct-invariants');const ts=await import('typescript');
 const before=readGraniteViaductPrevious('src/course-scenery.ts').toString().replace(/from '(\.\/[^']+)'/g,(_m,path)=>"from '"+new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href+"'");
 const code=ts.transpileModule(before.replace("from 'three'","from '"+import.meta.resolve('three')+"'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const old=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const previous=old.createCourseScenery(GRANITE_PASS,'pass'),current=createCanalPassWorld('granite-pass-v1');
 const expected=previous.root.userData.placements.filter((p:any)=>!((p.kind==='tree'||p.kind==='rock')&&[[0,220,113,11]].some(([cx,cz,w,d])=>Math.abs(p.x-cx)<w+p.radius*1.2&&Math.abs(p.z-cz)<d+p.radius*1.2)));
 assert.deepEqual(current.root.getObjectByName('granite-pass-v1_scenery')!.userData.placements,expected);previous.dispose();current.dispose();
});
