import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createSableGroundcover} from '../src/sable-groundcover';
import {createSableWorld} from '../src/sable-world';
import {SABLE} from '../src/sable-course';
test('groundcover leaves the racing corridor clear with bounded render cost and finite geometry',()=>{
 const cover=createSableGroundcover();let instances=0,meshes=0,nearest=Infinity;const matrix=new T.Matrix4();
 cover.root.traverse(o=>{if(!(o instanceof T.Mesh))return;meshes++;const p=o.geometry.getAttribute('position');for(let i=0;i<p.array.length;i++)assert.ok(Number.isFinite(p.array[i]));if(o instanceof T.InstancedMesh){instances+=o.count;for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);assert.ok(matrix.elements.every(Number.isFinite));}}});
 for(const p of cover.root.userData.placements)nearest=Math.min(nearest,SABLE.distance(p.x,p.z)-p.radius);
 assert.ok(nearest>24,'conservative vegetation/gravel clearance '+nearest);assert.ok(instances>3000&&instances<5000);assert.equal(meshes,3);
 // Each resource is released exactly once, including repeated teardown.
 const resources=new Set<T.BufferGeometry|T.Material>();cover.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}});
 let released=0;for(const resource of resources)resource.addEventListener('dispose',()=>released++);
 cover.dispose();cover.dispose();assert.equal(released,resources.size);assert.equal(cover.root.children.length,0);
});
test('integrated world owns exactly one groundcover layer and disposes it',async()=>{
 const world=createSableWorld();await world.ready;const covers=world.root.getObjectsByProperty('name','sable-groundcover');assert.equal(covers.length,1);assert.equal(covers[0].matrixAutoUpdate,false);world.dispose();assert.equal(covers[0].children.length,0);
});
