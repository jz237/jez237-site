import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { describeCar, currentPhysicsInvariants, loadCarWithoutImages, readProject, sha256 } from '../tools/car-asset-audit';
import { loadCars, templates } from '../src/assets';
import { assertHeadwallEvolution, headwallBaseline } from './quarry-headwall-invariants';
import { quarryColliderLayout } from '../src/quarry-layout';
import { Vehicle } from '../src/vehicle';
import type { Dent } from '../multiplayer/protocol';

const baseline=JSON.parse(readProject('tests/fixtures/coupe-rear-baseline.json').toString());
function exactOrBijectiveQuarterPositions(current:any,original:any,name:string){
  if(!/^panel_rear_quarter_[LR]$/.test(name)){assert.deepEqual(current,original,`${name} forward-region positions must remain exact`);return;}
  assert.equal(current.minimumWorldZ,original.minimumWorldZ);assert.equal(current.vertices,original.vertices,'quarter vertex counts cannot change outside the rear edit');
  const p=current.positions as number[],q=original.positions as number[];assert.equal(p.length,q.length);assert.equal(p.length,current.vertices*3);
  const remaining=new Map<string,number>();for(let i=0;i<p.length;i+=3)remaining.set(p.slice(i,i+3).join(','),i);
  const oldMissing:number[]=[];for(let i=0;i<q.length;i+=3){const key=q.slice(i,i+3).join(',');if(!remaining.delete(key))oldMissing.push(i);}
  const candidates=[...remaining.values()];assert.equal(oldMissing.length,candidates.length);
  const edges=oldMissing.map(i=>candidates.map((j,k)=>({k,distance:Math.hypot(p[j]-q[i],p[j+1]-q[i+1],p[j+2]-q[i+2])})).filter(v=>v.distance<=2.5e-7).sort((a,b)=>a.distance-b.distance).map(v=>v.k));
  const owner=new Int32Array(candidates.length).fill(-1);
  function match(from:number,seen:Set<number>):boolean{for(const to of edges[from]){if(seen.has(to))continue;seen.add(to);if(owner[to]===-1||match(owner[to],seen)){owner[to]=from;return true;}}return false;}
  for(let i=0;i<oldMissing.length;i++)assert.ok(match(i,new Set()),`${name} must have a bijection to original forward points within2.5e-7m, allowing only measured inner-sheet/export rounding`);
}

test('coupe appearance retains every damage/glass identity, wheel pivot, embedded image and valid mesh',async()=>{
  const car=await describeCar('coupe');
  assert.ok(car.triangles<=baseline.car.triangles+15000,'rear detailing stays within the approved additional15k triangle budget');
  assert.ok(car.bytes<25*1024*1024,'single static asset stays below the Pages file limit');
  const modelManifest=JSON.parse(readProject('source/model-manifest.json').toString()).find((m:any)=>m.file===car.file);
  const refinementManifest=JSON.parse(readProject('source/vehicle-refinement-manifest.json').toString()).files.find((m:any)=>m.path===car.file);
  for(const entry of [modelManifest,refinementManifest]){assert.ok(entry);assert.equal(entry.sha256,car.sha256);assert.equal(entry.bytes,car.bytes);}
  assert.equal(refinementManifest.triangles,car.triangles,'provenance must describe the actual exported geometry');
  assert.deepEqual(car.panelIds,baseline.car.panelIds);assert.deepEqual(car.glassIds,baseline.car.glassIds);
  assert.deepEqual(car.rawPanelIds,baseline.car.rawPanelIds);assert.deepEqual(car.rawGlassIds,baseline.car.rawGlassIds);
  assert.deepEqual(car.wheels,baseline.car.wheels,'all four steering/suspension animation pivots must remain exact');
  assert.deepEqual(car.duplicateNames,[]);
  assert.deepEqual([...car.materials].sort((a,b)=>a.name.localeCompare(b.name)),[...baseline.car.materials].sort((a:any,b:any)=>a.name.localeCompare(b.name)),
    'all existing material parameters and texture bindings remain exact');
  assert.deepEqual(car.images.map(i=>({name:i.name,mimeType:i.mimeType,sha256:i.sha256})).sort((a,b)=>a.name.localeCompare(b.name)),
    baseline.car.images.map((i:any)=>({name:i.name,mimeType:i.mimeType,sha256:i.sha256})).sort((a:any,b:any)=>a.name.localeCompare(b.name)),
    'rear detailing must reuse the existing embedded image bytes');
  for(const mesh of car.meshes){
    assert.ok(mesh.finite,`${mesh.name} attributes must be finite`);assert.ok(mesh.vertices>0&&mesh.triangles>0&&Number.isInteger(mesh.triangles));
    assert.ok(mesh.maxIndex<mesh.vertices,`${mesh.name} indices stay within the position attribute`);
    assert.equal(mesh.attributes.normal?.count,mesh.vertices);assert.ok(mesh.materials.length>0&&mesh.materials.every((m:string)=>m.length>0));
    for(let axis=0;axis<3;axis++)assert.ok(Number.isFinite(mesh.worldBounds.min[axis])&&Number.isFinite(mesh.worldBounds.max[axis])&&mesh.worldBounds.max[axis]>=mesh.worldBounds.min[axis]);
    if(mesh.name.startsWith('panel_')||mesh.name.startsWith('glass_')){
      const old=baseline.car.meshes.find((m:any)=>m.name===mesh.name);assert.ok(old);
      exactOrBijectiveQuarterPositions(mesh.forwardRegion,old.forwardRegion,mesh.name);
      if(mesh.name.startsWith('glass_')){assert.deepEqual(mesh.attributes,old.attributes);assert.equal(mesh.indicesSHA256,old.indicesSHA256);}
    }
  }
});

test('coupe rear detailing cannot change other cars, handling, deployed server inputs or quarry colliders',()=>{
  for(const [file,expected] of Object.entries(baseline.protectedFiles)){
    // This milestone also authorizes trilinear interpolation of the existing
    // paint silt noise. Keep its old hash as provenance, not a physics invariant.
    if(file==='src/car-materials.ts')continue;
    if(file==='src/assets.ts'){
      // The later daylight calibration changes only this scene-level intensity.
      // Restore its exact original statement in memory and compare every byte
      // against the immutable car-era fixture; car loading/batching stay frozen.
      const bytes=readProject(file),current=Buffer.from('scene.environmentIntensity = 0.28;'),original=Buffer.from('scene.environmentIntensity = 0.5;');
      const at=bytes.indexOf(current);assert.ok(at>=0,'the approved daylight statement must exist exactly');
      assert.equal(bytes.indexOf(current,at+current.length),-1,'only one intensity statement may receive this exception');
      const restored=Buffer.concat([bytes.subarray(0,at),original,bytes.subarray(at+current.length)]);
      assert.equal(sha256(restored),expected,'restoring only the approved environment intensity must recover the original assets.ts bytes');
      continue;
    }
    assert.equal(sha256(readProject(file)),expected,`${file} must remain byte-identical`);
  }
  const physics=currentPhysicsInvariants();assert.equal(physics.workerInputs.length,16);assert.ok(physics.workerInputs.filter(i=>i.available&&i.file!=='src/quarry-layout.ts').every(i=>i.unchanged));
  assert.ok(physics.workerInputs.filter(i=>!i.available).every(i=>i.file==='multiplayer/.generated/rapier-worker.mjs'),'only the build-generated WASM adapter may be absent in a fresh checkout');
  assert.deepEqual(headwallBaseline.colliders.map((s:{id:string;hash:string})=>({id:s.id,sha256:s.hash})),baseline.physics.colliders);
  assert.equal(headwallBaseline.colliders.length,1543);
  assertHeadwallEvolution(quarryColliderLayout()); // Intentional later world change; original car proof above remains frozen.
});

let prepared:Promise<void>|undefined;
async function productionTemplates(){
  if(!prepared)prepared=(async()=>{
    const original=GLTFLoader.prototype.loadAsync;
    GLTFLoader.prototype.loadAsync=async url=>{
      const match=/\/(coupe|sedan|hatch)\.glb$/.exec(String(url));assert.ok(match);return loadCarWithoutImages(match[1]);
    };
    try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
    await R.init();
  })();
  return prepared;
}
function damageCar(){
  const world=new R.World({x:0,y:-9.81,z:0}),calls={emit:0,detach:0};
  const car=new Vehicle(0,'coupe',0xa11b26,new T.Scene(),world,{emit(){calls.emit++;},mark(){},detach(panel:T.Mesh){calls.detach++;panel.visible=false;}} as any);
  car.place(0,0,0);car.root.updateMatrixWorld(true);
  return {car,calls,close(){car.dispose();world.free();}};
}
function capture(car:Vehicle){return car.panels.map(panel=>({name:panel.name,visible:panel.visible,damage:panel.userData.damage,
  positions:new Float32Array(panel.geometry.getAttribute('position').array),normals:new Float32Array(panel.geometry.getAttribute('normal').array),wear:new Float32Array(panel.geometry.getAttribute('impactWear').array)}));}
function applyDent(car:Vehicle,dent:Dent,quiet:boolean,time:number){
  car.root.updateMatrixWorld(true);
  const point=car.root.localToWorld(new T.Vector3(dent.localPoint.x,dent.localPoint.y,dent.localPoint.z));
  const direction=new T.Vector3(dent.localDirection.x,dent.localDirection.y,dent.localDirection.z).transformDirection(car.root.matrixWorld);
  car.hit(point,direction,dent.damage,time,quiet);
}

test('actual loaded coupe rear panels deform locally, detach reproducibly, and repair restores the original asset',async()=>{
  await productionTemplates();const {car,calls,close}=damageCar();
  try{
    assert.equal(car.panels.length,29);assert.equal(car.glass.length,5);assert.equal(car.wheels.length,4);assert.ok(car.brakeLights.size>0,'real rear lamps remain connected to the brake material');
    let drawMeshes=0;templates.get('coupe')!.traverse(o=>{if(o instanceof T.Mesh)drawMeshes++;});
    assert.ok(drawMeshes<=baseline.car.runtime.meshes+2,'real production batching stays within two extra coupe draws');
    const original=capture(car),rear=car.panels.find(p=>p.name==='panel_bumper_rear001')!,front=car.panels.find(p=>p.name==='panel_bumper_front')!;
    assert.ok(rear&&front);const bounds=new T.Box3().setFromObject(rear),point=bounds.getCenter(new T.Vector3());point.z=bounds.min.z+.015;
    const local=car.root.worldToLocal(point.clone()),dents:Dent[]=[12,11,9].map((damage,i)=>({id:i+1,repair:0,damage,localPoint:{x:local.x+(i-1)*.14,y:local.y,z:local.z},localDirection:{x:0,y:0,z:1}}));
    dents.forEach((dent,i)=>applyDent(car,dent,false,i+1));const damaged=capture(car),health=car.health;
    assert.equal(health,68);assert.ok(calls.emit>0&&calls.detach>0);assert.equal(rear.visible,false,'substantial repeated rear impacts detach the bumper');
    const changed=damaged.find(p=>p.name===rear.name)!;assert.notDeepEqual(changed.positions,original.find(p=>p.name===rear.name)!.positions);
    assert.deepEqual(front.geometry.getAttribute('position').array,original.find(p=>p.name===front.name)!.positions,'rear impact must not alter the distant front bumper');
    let duplicateVertices=0;
    for(const panel of damaged){const before=original.find(p=>p.name===panel.name)!,welds=new Map<string,number[]>();for(let i=0;i<panel.positions.length;i+=3){
      assert.ok(Number.isFinite(panel.positions[i])&&Number.isFinite(panel.positions[i+1])&&Number.isFinite(panel.positions[i+2]));
      assert.ok(Math.hypot(panel.positions[i]-before.positions[i],panel.positions[i+1]-before.positions[i+1],panel.positions[i+2]-before.positions[i+2])<=.900001);
      const key=Array.from(before.positions.slice(i,i+3)).join(','),value=Array.from(panel.positions.slice(i,i+3));
      if(welds.has(key)){duplicateVertices++;assert.deepEqual(value,welds.get(key),'actual exported UV/normal seam duplicates must remain welded after impact');}else welds.set(key,value);
    }}
    assert.ok(duplicateVertices>100,'the actual asset must exercise exported seam duplication');
    car.repair();assert.equal(car.health,100);assert.deepEqual(capture(car),original,'repair restores every actual panel vertex, normal, wear value and visibility');
    const effectsBefore={...calls};JSON.parse(JSON.stringify(dents)).forEach((dent:Dent,i:number)=>applyDent(car,dent,true,i+1));
    assert.deepEqual(capture(car),damaged,'serialized rejoin history must reproduce actual rear damage bitwise');assert.equal(car.health,health);assert.deepEqual(calls,effectsBefore,'historical damage cannot spawn fresh sounds or debris');
    car.repair();const window=car.glass.find(p=>p.name==='glass_BodyRearwindow')!,glassPoint=new T.Box3().setFromObject(window).getCenter(new T.Vector3());
    car.hit(glassPoint,new T.Vector3(0,0,1),18,10,true);assert.equal(window.visible,true);assert.ok(window.userData.damage>0,'laminated rear glass should crack');
    car.repair();assert.equal(window.userData.damage,0);assert.equal((window.material as T.Material).userData.glassState.damage.value,0);
  }finally{close();}
});

test('serialized rear dents follow the actual coupe across a changed world pose without changing the damage shape',async()=>{
  await productionTemplates();const a=damageCar(),b=damageCar();
  try{
    b.car.place(20,-30,.73);b.car.root.updateMatrixWorld(true);
    const rear=a.car.panels.find(p=>p.name==='panel_bumper_rear001')!,bounds=new T.Box3().setFromObject(rear),point=bounds.getCenter(new T.Vector3());point.z=bounds.min.z+.05;
    const p=a.car.root.worldToLocal(point),dent:Dent={id:1,repair:0,damage:12,localPoint:{x:p.x,y:p.y,z:p.z},localDirection:{x:0,y:0,z:1}};
    applyDent(a.car,dent,true,1);applyDent(b.car,JSON.parse(JSON.stringify(dent)),true,1);
    const aa=capture(a.car),bb=capture(b.car);assert.equal(a.car.health,b.car.health);
    for(let panel=0;panel<aa.length;panel++){
      assert.equal(aa[panel].name,bb[panel].name);assert.equal(aa[panel].visible,bb[panel].visible);
      for(let i=0;i<aa[panel].positions.length;i++)assert.ok(Math.abs(aa[panel].positions[i]-bb[panel].positions[i])<2e-6,'local network contacts remain attached to the same rear sheet metal at a new world pose');
    }
  }finally{a.close();b.close();}
});
