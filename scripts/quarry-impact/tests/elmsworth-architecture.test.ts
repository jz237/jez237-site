import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createSpeedwayArchitecture} from '../src/elmsworth-architecture';
import {createElmsworthWorld} from '../src/elmsworth-world';
import {ELMSWORTH} from '../src/elmsworth-course';

test('grandstand structures leave the racing and recovery corridor clear',()=>{
 const art=createSpeedwayArchitecture();
 // Distance to an AABB is conservative for every rotated piece. Subtract half
 // the largest sample interval to cover the complete intervening course line.
 const points=ELMSWORTH.samples;
 let interval=0;for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length];interval=Math.max(interval,Math.hypot(p.x-q.x,p.z-q.z));}
 let clearance=Infinity;
 for(const b of art.root.userData.bounds as T.Box3[]){
  let nearest=Infinity;for(const p of points){const dx=Math.max(b.min.x-p.x,0,p.x-b.max.x),dz=Math.max(b.min.z-p.z,0,p.z-b.max.z);nearest=Math.min(nearest,Math.hypot(dx,dz));}
  clearance=Math.min(clearance,nearest-interval/2);
 }
 assert.ok(clearance>24,`Minimum conservative clearance ${clearance}m`);
 art.root.traverse(o=>{if(o instanceof T.Mesh){for(const v of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(v));if(o instanceof T.InstancedMesh)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));}});
 art.dispose();art.dispose();
});
test('speedway owns the architecture without changing collision records and releases resources once',()=>{
 const art=createElmsworthWorld();assert.equal(art.root.userData.solidRecords,ELMSWORTH.solids);assert.ok(art.root.getObjectByName('elmsworth-grandstand-architecture'));
 const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();art.root.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});
 let ng=0,nm=0;for(const g of gs)g.addEventListener('dispose',()=>ng++);for(const m of ms)m.addEventListener('dispose',()=>nm++);
 art.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);art.dispose();assert.equal(ng,gs.size);assert.equal(nm,ms.size);
});
