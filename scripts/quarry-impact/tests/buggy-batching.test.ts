import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup,type Setup} from '../src/garage';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';

await R.init();
const originalLoad=GLTFLoader.prototype.loadAsync;
try{
  GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);
  await loadCars(()=>{});
}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const publishedBytes=readFileSync(new URL('../public/models/buggy.glb',import.meta.url));
assert.equal(createHash('sha256').update(publishedBytes).digest('hex'),'6ca99cb7cc7aaf305ecbe3cb7c71b20b9d10628c59aaaa1035d3cb39b84876e5','The independent reference is the unchanged published Ravine GLB');
const published=(await loadCarWithoutImages('buggy')).scene;
const prepared=templates.get('buggy')!,corners=['FL','FR','RL','RR'] as const;
const zero={x:0,y:0,z:0};
const fx={emit(){},mark(){},detach(mesh:T.Mesh){mesh.visible=false;},reset(){}} as any;
const materialDescription=(material:T.Material)=>{const json=material.toJSON();delete json.uuid;delete json.metadata;return JSON.stringify(json);};
const arrayHash=(array:ArrayBufferView)=>createHash('sha256').update(new Uint8Array(array.buffer,array.byteOffset,array.byteLength)).digest('hex');

// Restore only these assemblies from the published, unbatched GLB. The rest of
// the real Vehicle pipeline is identical, including material isolation, damage,
// wheel telemetry and replay. No candidate-derived shock geometry is a baseline.
const unbatched=prepared.clone(true),materials=new Map<string,T.Material>();
prepared.traverse(o=>{if(o instanceof T.Mesh)materials.set((o.material as T.Material).name,o.material as T.Material);});
for(const corner of corners){
  const name='suspension_'+corner+'_shock',group=unbatched.getObjectByName(name)!,original=published.getObjectByName(name)!;
  group.clear();
  for(const child of original.children){const mesh=child.clone(true) as T.Mesh;mesh.material=materials.get((mesh.material as T.Material).name)!;group.add(mesh);}
  assert.equal(group.children.length,5);
}
function withUnbatched<TValue>(create:()=>TValue):TValue{
  templates.set('buggy',unbatched);
  try{return create();}finally{templates.set('buggy',prepared);}
}
function counts(root:T.Object3D){
  let meshes=0,triangles=0,casters=0;
  root.traverse(o=>{if(o instanceof T.Mesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;if(o.castShadow)casters++;}});
  return{meshes,triangles,casters};
}
function pose(car:Vehicle){
  const position=new T.Vector3(7.25,2.85,-11.4),rotation=new T.Quaternion().setFromEuler(new T.Euler(.18,.67,-.13));
  car.body.setTranslation(position,true);car.body.setRotation(rotation,true);
  car.previous.copy(position);car.current.copy(position);car.previousQ.copy(rotation);car.currentQ.copy(rotation);
  car.root.position.copy(position);car.root.quaternion.copy(rotation);car.root.updateMatrixWorld(true);
}
function shockVertices(car:Vehicle,corner:typeof corners[number]){
  car.root.updateMatrixWorld(true);
  const group=car.model.getObjectByName('suspension_'+corner+'_shock')!;
  const result=new Map<string,{material:string;positions:number[];normals:number[];uv:number[];castShadow:boolean;receiveShadow:boolean}>();
  for(const mesh of group.children){
    assert.ok(mesh instanceof T.Mesh);const material=mesh.material as T.Material;
    const row=result.get(material.name)??{material:materialDescription(material),positions:[],normals:[],uv:[],castShadow:mesh.castShadow,receiveShadow:mesh.receiveShadow};result.set(material.name,row);
    const geometry=mesh.geometry,p=geometry.attributes.position,n=geometry.attributes.normal,uv=geometry.attributes.uv,normalMatrix=new T.Matrix3().getNormalMatrix(mesh.matrixWorld);
    for(let i=0;i<(geometry.index?.count??p.count);i++){
      const index=geometry.index?geometry.index.getX(i):i;
      row.positions.push(...new T.Vector3().fromBufferAttribute(p,index).applyMatrix4(mesh.matrixWorld).toArray());
      row.normals.push(...new T.Vector3().fromBufferAttribute(n,index).applyMatrix3(normalMatrix).normalize().toArray());
      row.uv.push(uv.getX(index),uv.getY(index));
    }
  }
  return result;
}
function compareShocks(actual:Vehicle,reference:Vehicle){
  let maxPositionError=0,maxNormalError=0,triangles=0;
  for(const corner of corners){
    const a=shockVertices(actual,corner),b=shockVertices(reference,corner);assert.deepEqual([...a.keys()].sort(),[...b.keys()].sort());
    for(const [name,left]of a){
      const right=b.get(name)!;assert.equal(left.material,right.material);assert.equal(left.castShadow,right.castShadow);assert.equal(left.receiveShadow,right.receiveShadow);
      assert.deepEqual(left.uv,right.uv);assert.equal(left.positions.length,right.positions.length);triangles+=left.positions.length/9;
      for(let i=0;i<left.positions.length;i++){
        maxPositionError=Math.max(maxPositionError,Math.abs(left.positions[i]-right.positions[i]));
        maxNormalError=Math.max(maxNormalError,Math.abs(left.normals[i]-right.normals[i]));
      }
    }
  }
  assert.equal(triangles,1952);assert.ok(maxPositionError<1e-7,`Position rounding ${maxPositionError}m`);assert.ok(maxNormalError<1e-12,`Normal error ${maxNormalError}`);
  return maxPositionError;
}
function damageState(car:Vehicle){
  return{health:car.health,engine:car.engineDamage,wheels:Array.from(car.wreckParts.wheelDamage),panels:car.panels.map(mesh=>({name:mesh.name,visible:mesh.visible,attributes:Object.fromEntries(['position','normal','impactWear','transferPaint'].map(name=>[name,arrayHash(mesh.geometry.attributes[name].array)]))}))};
}
function cachedState(){
  const hash=createHash('sha256');
  prepared.traverse(o=>{hash.update(JSON.stringify([o.name,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray()]));if(!(o instanceof T.Mesh))return;for(const [name,attribute]of Object.entries(o.geometry.attributes)){hash.update(name);hash.update(arrayHash(attribute.array));}hash.update(materialDescription(o.material as T.Material));});
  return hash.digest('hex');
}

test('prepared Ravine shocks preserve published triangles, finishes and moving poses with eight fewer meshes',t=>{
  let maximum=0;
  for(const armor of [0,3]){
    const world=new R.World(zero),scene=new T.Scene(),setup={...stockSetup('buggy'),armor};
    const create=()=>new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup),reference=withUnbatched(create),actual=create();
    const originalLengths=[reference,actual].map(car=>car.controller.wheelSuspensionLength.bind(car.controller));
    const originalRotations=[reference,actual].map(car=>car.controller.wheelRotation.bind(car.controller));
    try{
      const before=counts(reference.model),after=counts(actual.model);
      assert.equal(before.meshes,armor?120:112);assert.equal(after.meshes,before.meshes-8);assert.equal(after.triangles,before.triangles);assert.equal(after.casters,before.casters);
      assert.deepEqual(after,{meshes:armor?112:104,triangles:armor?37914:35130,casters:armor?43:39});
      for(const corner of corners){assert.equal(actual.model.getObjectByName('suspension_'+corner+'_shock')!.children.length,3);assert.ok(actual.model.getObjectByName('Ravine_spring_'+corner));assert.ok(actual.model.getObjectByName('Ravine_shock_shaft_'+corner));}
      const poses=[{travel:[0,0,0,0],steer:0,camber:0,spin:0},{travel:[.32,0,0,0],steer:.7,camber:.12,spin:2.3},{travel:[-.32,.32,.32,-.32],steer:-.7,camber:-.1,spin:5.1},{travel:[-.32,-.32,-.32,-.32],steer:.3,camber:.05,spin:Math.PI}];
      for(const p of poses){
        for(const car of [reference,actual]){pose(car);car.steering=p.steer;car.controller.wheelSuspensionLength=i=>.44-p.travel[i];car.controller.wheelRotation=()=>p.spin;car.render(1);car.wheels.forEach((wheel,i)=>wheel.rotateZ((i%2?1:-1)*p.camber));car.syncSuspension();}
        maximum=Math.max(maximum,compareShocks(actual,reference));
      }
      assert.deepEqual(damageState(actual),damageState(reference));
    }finally{[reference,actual].forEach((car,i)=>{car.controller.wheelSuspensionLength=originalLengths[i];car.controller.wheelRotation=originalRotations[i];car.dispose();});world.free();}
  }
  t.diagnostic(`World position rounding <= ${maximum}m; triangle counts, materials, UVs, normals and shadow casters preserved.`);
});

test('batched shocks preserve actual impact, repair and compressed replay through backwards seeks',async()=>{
  const world=new R.World(zero),scene=new T.Scene(),setup={...stockSetup('buggy'),armor:3},create=()=>new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup),reference=withUnbatched(create),actual=create();
  const originalLengths=[reference,actual].map(car=>car.controller.wheelSuspensionLength.bind(car.controller));let length=.44,time=0;
  const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'buggy',setup}],props:0,created:'2026-10-03T00:00:00Z'});
  actual.onVisualEvent=event=>recorder.event(0,time,event);
  const frames:ReturnType<typeof damageState>[]=[];
  const capture=(at:number)=>{
    for(const car of [reference,actual]){car.render(1);car.wreckParts.poseAt(at,0);car.wreckParts.wheelsPose();car.syncSuspension();}
    assert.deepEqual(damageState(actual),damageState(reference));compareShocks(actual,reference);frames.push(damageState(actual));recorder.capture(at,()=>captureReplayFrame([actual],[],[0]),true);
  };
  try{
    for(const car of [reference,actual]){pose(car);car.controller.wheelSuspensionLength=i=>i===0?length:.44;}
    capture(0);time=.5;length=.26;
    for(const car of [reference,actual])car.hit(new T.Vector3(-.85,-.56,1.2).applyMatrix4(car.root.matrixWorld),new T.Vector3(0,0,-1).applyQuaternion(car.root.quaternion),36,time,true,new T.Color(0x984e36));
    capture(1);assert.notDeepEqual(frames[1],frames[0]);assert.ok(actual.wreckParts.wheelDamage[0]>0);
    time=1.5;length=.66;
    for(const car of [reference,actual])car.hit(new T.Vector3(0,0,-1.45).applyMatrix4(car.root.matrixWorld),new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion),28,time,true);
    capture(2);time=2.5;length=.44;reference.repair();actual.repair();capture(3);assert.deepEqual(frames[3],frames[0]);
    const document=await readReplayFile(new File([await replayFile(recorder.document())],'batched-ravine.qir'));
    const replay=new ReplayScene(document,scene,world,[]),original=withUnbatched(()=>new ReplayScene(document,scene,world,[]));
    try{for(const at of [0,1,2,3,1,0,2,3,0]){replay.seek(at);original.seek(at);assert.deepEqual(damageState(replay.cars[0]),damageState(original.cars[0]));compareShocks(replay.cars[0],original.cars[0]);}}finally{replay.dispose();original.dispose();}
    assert.deepEqual(damageState(actual),frames[3]);
  }finally{[reference,actual].forEach((car,i)=>{car.controller.wheelSuspensionLength=originalLengths[i];car.dispose();});world.free();}
});

test('vehicle damage and disposal retain cached shock buffers and independent live materials',()=>{
  const before=cachedState(),cachedMeshes:T.Mesh[]=[];
  prepared.traverse(o=>{if(o instanceof T.Mesh&&o.parent?.name.startsWith('suspension_')&&o.parent.name.endsWith('_shock'))cachedMeshes.push(o);});
  let cacheDisposals=0;const disposed=()=>cacheDisposals++;
  const geometries=new Set(cachedMeshes.map(m=>m.geometry)),materials=new Set(cachedMeshes.map(m=>m.material as T.Material));
  geometries.forEach(g=>g.addEventListener('dispose',disposed));materials.forEach(m=>m.addEventListener('dispose',disposed));
  const world=new R.World(zero),scene=new T.Scene(),setup:Setup=stockSetup('buggy'),create=()=>new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup),first=create(),survivor=create();let firstAlive=true;
  try{
    pose(first);pose(survivor);const pristine=damageState(survivor),survivorMaterials=new Map(cachedMeshes.map(m=>[m.name,(survivor.model.getObjectByName(m.name) as T.Mesh).material]));
    for(const cached of cachedMeshes){const a=first.model.getObjectByName(cached.name) as T.Mesh,b=survivor.model.getObjectByName(cached.name) as T.Mesh;assert.equal(a.geometry,cached.geometry);assert.equal(b.geometry,cached.geometry);assert.notEqual(a.material,b.material);assert.notEqual(a.material,cached.material);}
    first.hit(new T.Vector3(-.85,-.56,1.2).applyMatrix4(first.root.matrixWorld),new T.Vector3(0,0,-1),32,.5,true);first.repair();first.dispose();firstAlive=false;
    assert.equal(cacheDisposals,0);assert.equal(cachedState(),before);assert.deepEqual(damageState(survivor),pristine);
    for(const [name,material]of survivorMaterials)assert.equal((survivor.model.getObjectByName(name) as T.Mesh).material,material);
    const fresh=create();try{pose(fresh);assert.deepEqual(damageState(fresh),pristine);compareShocks(fresh,survivor);for(const cached of cachedMeshes)assert.equal((fresh.model.getObjectByName(cached.name) as T.Mesh).geometry,cached.geometry);}finally{fresh.dispose();}
    assert.equal(cacheDisposals,0);assert.equal(cachedState(),before);
  }finally{if(firstAlive)first.dispose();survivor.dispose();world.free();geometries.forEach(g=>g.removeEventListener('dispose',disposed));materials.forEach(m=>m.removeEventListener('dispose',disposed));}
});
