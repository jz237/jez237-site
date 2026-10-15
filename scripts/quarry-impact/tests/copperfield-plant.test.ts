import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createCopperfieldPlant} from '../src/copperfield-plant';import {createParkDunesWorld} from '../src/park-dunes-world';import {KINGSWELL,COPPERFIELD} from '../src/park-dunes-courses';
test('plant clears the racing corridor and its main foundation meets the bank',()=>{
 const w=createParkDunesWorld('copperfield-dunes-v1'),a=createCopperfieldPlant(),hills=w.root.getObjectByName('copperfield-dunes-v1_surrounding_landscape')!;w.root.updateMatrixWorld(true);const ray=new T.Raycaster();
 for(let x=-266;x<=-238;x++)for(let z=-103;z<=-81;z++){ray.set(new T.Vector3(x,100,z),new T.Vector3(0,-1,0));const h=ray.intersectObject(hills)[0];assert.ok(h);assert.ok(h.point.y>=0&&h.point.y<=9,'Bank must meet main foundation');}
 // Silo legs occupy y6..20, with footings down to y3. The actual bank must meet them.
 for(const z of [-104,-80])for(const dx of [-3.7,3.7])for(const dz of [-3.7,3.7]){ray.set(new T.Vector3(-277+dx,100,z+dz),new T.Vector3(0,-1,0));const h=ray.intersectObject(hills)[0];assert.ok(h&&h.point.y>=3&&h.point.y<20,'Silo support meets the bank');}
 for(const b of a.root.userData.bounds as T.Box3[]){const c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3());assert.ok(COPPERFIELD.distance(c.x,c.z)-Math.hypot(s.x,s.z)/2>24);}
 a.root.traverse(o=>{if(o instanceof T.Mesh){for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});a.dispose();w.dispose();
});
test('plant is Copperfield-only, preserves collision records and clears intersecting decoration',()=>{
 for(const course of [KINGSWELL,COPPERFIELD]){const w=createParkDunesWorld(course.id as 'kingswell-park-v1'|'copperfield-dunes-v1');assert.equal(w.root.userData.solidRecords,course.solids);assert.equal(Boolean(w.root.getObjectByName('copperfield-aggregate-works')),course===COPPERFIELD);assert.equal(Boolean(w.root.getObjectByName('kingswell-clubhouse')),course===KINGSWELL);
 if(course===COPPERFIELD){const placements=w.root.getObjectByName(course.id+'_scenery')!.userData.placements;assert.ok(placements.some((p:any)=>p.kind==='aggregate-conveyor'));for(const p of placements.filter((p:any)=>p.kind==='tree'||p.kind==='rock'))for(const[cx,cz,hx,hz]of [[-249.5,-91.5,34.5,19.5],[-247,-59,9,23]])assert.ok(Math.abs(p.x-cx)>=hx+p.radius*1.2||Math.abs(p.z-cz)>=hz+p.radius*1.2);}
 w.dispose();}
});
test('complete course releases all plant materials and shared geometry once',()=>{
 const w=createParkDunesWorld('copperfield-dunes-v1'),gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();w.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});let ng=0,nm=0;gs.forEach(g=>g.addEventListener('dispose',()=>ng++));ms.forEach(m=>m.addEventListener('dispose',()=>nm++));w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);w.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});

test('clearing the plant footprint leaves all other seeded prop placements unchanged',async()=>{
 const {readCopperfieldPlantPrevious}=await import('./copperfield-plant-invariants');const ts=await import('typescript');
 const before=readCopperfieldPlantPrevious('src/course-scenery.ts').toString().replace(/from '(\.\/[^']+)'/g,(_m,path)=>"from '"+new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href+"'");
 const code=ts.transpileModule(before.replace("from 'three'","from '"+import.meta.resolve('three')+"'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const old=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const previous=old.createCourseScenery(COPPERFIELD,'dunes'),current=createParkDunesWorld('copperfield-dunes-v1');
 const expected=previous.root.userData.placements.filter((p:any)=>!((p.kind==='tree'||p.kind==='rock')&&[[-249.5,-91.5,34.5,19.5],[-247,-59,9,23]].some(([cx,cz,w,d])=>Math.abs(p.x-cx)<w+p.radius*1.2&&Math.abs(p.z-cz)<d+p.radius*1.2)));
 assert.deepEqual(current.root.getObjectByName('copperfield-dunes-v1_scenery')!.userData.placements,expected);previous.dispose();current.dispose();
});
