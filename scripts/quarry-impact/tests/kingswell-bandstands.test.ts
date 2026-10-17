import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createKingswellBandstands} from '../src/kingswell-bandstands';
import {createParkDunesWorld} from '../src/park-dunes-world';
import {KINGSWELL,COPPERFIELD} from '../src/park-dunes-courses';
test('all three bandstands fit their former footprints and clear the racing corridor',()=>{
 const world=createParkDunesWorld('kingswell-park-v1'),root=world.root.getObjectByName('kingswell-bandstands')!;
 assert.ok(root);assert.equal(root.userData.sites.length,3);
 const bounds=root.userData.bounds as T.Box3[];assert.ok(bounds.length>500);
 for(const b of bounds){const c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3());assert.ok(KINGSWELL.distance(c.x,c.z)-Math.hypot(s.x,s.z)/2>24,'track clearance');assert.ok(root.userData.sites.some((p:any)=>Math.abs(c.x-p.x)+s.x/2<=10&&Math.abs(c.z-p.z)+s.z/2<=10),'old reserved footprint');}
 const scenery=world.root.getObjectByName('kingswell-park-v1_scenery')!;
 for(const p of scenery.userData.placements.filter((p:any)=>p.kind==='tree'))for(const site of root.userData.sites)assert.ok(Math.abs(p.x-site.x)>=10+p.radius||Math.abs(p.z-site.z)>=10+p.radius,'no trees through roof');
 assert.equal(world.root.userData.solidRecords,KINGSWELL.solids);assert.ok(root.children.length<=10,'bounded material/geometry batches');world.dispose();
 const dunes=createParkDunesWorld('copperfield-dunes-v1');assert.equal(dunes.root.getObjectByName('kingswell-bandstands'),undefined);assert.equal(dunes.root.userData.solidRecords,COPPERFIELD.solids);dunes.dispose();
});
test('bandstand geometry is finite and shared resources are disposed once through the world',()=>{
 const world=createParkDunesWorld('kingswell-park-v1'),root=world.root.getObjectByName('kingswell-bandstands')!,resources=new Set<T.BufferGeometry|T.Material>(),instances:T.InstancedMesh[]=[];
 root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);for(const value of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(value));if(o instanceof T.InstancedMesh){instances.push(o);for(const value of o.instanceMatrix.array)assert.ok(Number.isFinite(value));}}});
 const counts=new Map<object,number>();for(const r of [...resources,...instances]){counts.set(r,0);r.addEventListener('dispose',()=>counts.set(r,counts.get(r)!+1));}world.dispose();world.dispose();for(const count of counts.values())assert.equal(count,1);
 const empty=createKingswellBandstands([]);assert.equal(empty.root.children.length,0);empty.dispose();empty.dispose();
});
