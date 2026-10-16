import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createStadiumScenery} from '../src/stadium-scenery';import {HOLLOWAY} from '../src/stadium-reservoir-courses';import {createStadiumReservoirWorld} from '../src/stadium-reservoir-world';
test('Holloway venue furniture keeps full footprints outside driving and recovery space',()=>{
 const art=createStadiumScenery();try{
 const placements=art.root.userData.placements;
 assert.equal(placements.filter((p:any)=>p.kind==='covered-stand').length,10);
 assert.equal(placements.filter((p:any)=>p.kind==='pit-garages').length,1);
 assert.equal(placements.filter((p:any)=>p.kind==='stadium-entry').length,2);
 for(const p of placements)for(let x=-p.w/2;x<=p.w/2;x++)for(let z=-p.d/2;z<=p.d/2;z++)assert.ok(HOLLOWAY.distance(p.x+x,p.z+z)>=23,p.kind);
 assert.ok(art.root.children.length<=10,'shared batches cap draw calls');
 }finally{art.dispose();}
});
test('integrated Holloway scenery preserves collision geometry and disposes resources once',()=>{
 const before=JSON.stringify(HOLLOWAY.solids),world=createStadiumReservoirWorld('holloway-stadium-v1');assert.ok(world.root.getObjectByName('holloway-venue'));assert.equal(world.root.userData.solidRecords,HOLLOWAY.solids);assert.equal(JSON.stringify(HOLLOWAY.solids),before);
 const resources=new Set<T.BufferGeometry|T.Material|T.InstancedMesh>();world.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}if(o instanceof T.InstancedMesh)resources.add(o);});let count=0;for(const r of resources)r.addEventListener('dispose',()=>count++);world.dispose();world.dispose();assert.equal(count,resources.size);
});

test('Holloway crowd faces the circuit, animates through the venue, and clears the racing corridor',()=>{
 const world=createStadiumReservoirWorld('holloway-stadium-v1'),crowd=world.root.getObjectByName('holloway-spectators')!,torso=crowd.getObjectByName('crowd_torso') as T.InstancedMesh,limb=crowd.getObjectByName('crowd_limb') as T.InstancedMesh,matrix=new T.Matrix4();
 assert.ok(crowd.userData.spectatorCount>1200);assert.equal(crowd.children.length,4);
 for(let i=0;i<torso.count;i++){torso.getMatrixAt(i,matrix);const z=matrix.elements[14],facing=new T.Vector3(0,0,1).transformDirection(matrix);assert.ok(facing.z*z<0);assert.ok(HOLLOWAY.distance(matrix.elements[12],z)>23);}
 const fixed=Array.from(torso.instanceMatrix.array),before=Array.from(limb.instanceMatrix.array);assert.equal(typeof world.update,'function');world.update?.(3);assert.notDeepEqual(Array.from(limb.instanceMatrix.array),before);assert.deepEqual(Array.from(torso.instanceMatrix.array),fixed);world.dispose();assert.doesNotThrow(()=>world.update?.(4));
 const reservoir=createStadiumReservoirWorld('bramblebrook-reservoir-v1');assert.equal(reservoir.update,undefined);reservoir.dispose();
});
