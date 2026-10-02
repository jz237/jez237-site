import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildVanAsset} from '../src/van-asset';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {attachVehicleArmor} from '../src/vehicle-armor';
import {classicWheelAnchors} from '../src/classic-vehicle-specs';
import {createVehiclePhysics,vehicleSpecification} from '../src/vehicle-physics';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {readVanCoachworkPrevious,verifyVanCoachworkRevision} from './van-coachwork-invariants';

const bytes=readVanCoachworkPrevious('public/models/van.glb');
const previous=(await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'')).scene;
const authored=buildVanAsset(),published=(await loadCarWithoutImages('van')).scene;
const critical=['panel_RoofVan','panel_CargoSideVanL','panel_CargoSideVanR','panel_CargoBlankVanL','panel_CargoBlankVanR','panel_RearCornerVan-1','panel_RearCornerVan1','panel_CargoDoorSurroundVanTop','panel_CargoDoorSurroundVanReturn-1','panel_CargoDoorSurroundVanReturn1','panel_CargoDoorSurroundVanTopReturn'];
const mesh=(root:T.Object3D,name:string)=>{const value=root.getObjectByName(name);assert.ok(value instanceof T.Mesh,name);return value;};
const vector=(attribute:T.BufferAttribute|T.InterleavedBufferAttribute,i:number)=>new T.Vector3().fromBufferAttribute(attribute,i);
const key=(p:T.Vector3)=>p.toArray().map(x=>Number(x.toFixed(6))).join(',');
const bufferHash=(array:ArrayBufferView)=>createHash('sha256').update(new Uint8Array(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
const geometryState=(o:T.Mesh)=>Object.fromEntries(Object.entries(o.geometry.attributes).map(([name,a])=>[name,bufferHash(a.array)]));
function triangles(o:T.Mesh){
 const p=o.geometry.attributes.position,index=o.geometry.index,result:T.Triangle[]=[];
 for(let i=0;i<(index?.count??p.count);i+=3)result.push(new T.Triangle(...[0,1,2].map(j=>vector(p,index?index.getX(i+j):i+j).applyMatrix4(o.matrixWorld))as[T.Vector3,T.Vector3,T.Vector3]));
 return result;
}
function distanceToSurface(p:T.Vector3,faces:T.Triangle[]){const target=new T.Vector3();return Math.sqrt(Math.min(...faces.map(t=>t.closestPointToPoint(p,target).distanceToSquared(p))));}
function checkSeam(points:T.Vector3[],faces:T.Triangle[],name:string){
 assert.ok(points.length>=4,name+' samples');
 for(let i=0;i<points.length-1;i++)for(const t of [0,.25,.5,.75,1]){
  const p=points[i].clone().lerp(points[i+1],t),distance=distanceToSurface(p,faces);
  assert.ok(distance<2e-6,`${name}: gap ${distance}m at ${p.toArray()}`);
 }
}

test('formed roof and rear quarters are closed outward solids within the unchanged fleet budget',()=>{
 let vertices=0;authored.traverse(o=>{if(o instanceof T.Mesh)vertices+=o.geometry.attributes.position.count;});
 assert.ok(vertices<65000,`Carrier vertices ${vertices}`);
 for(const root of [authored,published])for(const name of critical){
  const o=mesh(root,name),p=o.geometry.attributes.position,n=o.geometry.attributes.normal,edges=new Map<string,number>();let volume=0;
  for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite),name+' finite geometry');
  for(let i=0;i<p.count;i+=3){
   const vertices=[0,1,2].map(j=>vector(p,i+j)),face=vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0]));
   assert.ok(face.lengthSq()>1e-18,name+' nondegenerate face');volume+=vertices[0].dot(vertices[1].clone().cross(vertices[2]))/6;
   for(let j=0;j<3;j++){
    const normal=vector(n,i+j);assert.ok(Math.abs(normal.length()-1)<1e-6,name+' unit normal');assert.ok(face.dot(normal)>-1e-10,name+' outward shading');
    const edge=[key(vertices[j]),key(vertices[(j+1)%3])].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);
   }
  }
  assert.ok(volume>1e-6,name+' positive signed volume');assert.ok([...edges.values()].every(count=>count===2),name+' closed skin and returns');
 }
 for(const name of critical){
  const actual=geometryState(mesh(published,name)),source=mesh(authored,name),expected=geometryState(source),uv=Float32Array.from(source.geometry.attributes.uv.array);
  // The production exporter converts V to glTF's top-origin convention.
  for(let i=1;i<uv.length;i+=2)uv[i]=1-uv[i];expected.uv=bufferHash(uv);
  assert.deepEqual(actual,expected,name+' exported geometry');
 }
 assert.notEqual(bufferHash(mesh(previous,'panel_RoofVan').geometry.attributes.position.array),bufferHash(mesh(published,'panel_RoofVan').geometry.attributes.position.array));
});

test('the roof has a broad smooth crown and its curved rear/side seams meet without daylight slots',()=>{
 published.updateMatrixWorld(true);previous.updateMatrixWorld(true);
 const roof=mesh(published,'panel_RoofVan'),oldRoof=mesh(previous,'panel_RoofVan');
 const roofHit=(m:T.Mesh,x:number)=>{const hit=new T.Raycaster(new T.Vector3(x,2.3,-1),new T.Vector3(0,-1,0)).intersectObject(m)[0];assert.ok(hit,`Roof at x${x}`);return hit;};
 const centre=roofHit(roof,0),shoulder=roofHit(roof,.6),edge=roofHit(roof,.794);
 assert.ok(centre.point.y>1.930&&centre.point.y<=1.933001);assert.ok(centre.point.y-shoulder.point.y<.008,'Broad pressing reaches the rolled eaves');
 assert.ok(roofHit(oldRoof,0).point.y-roofHit(oldRoof,.6).point.y>.025,'Frozen earlier roof has the narrower crown');
 assert.ok(edge.point.y>1.875&&edge.point.y<1.890,'Eave turns down into the retained side height');
 const normals:T.Vector3[]=[];
 for(let x=.63;x<=.79001;x+=.01){const hit=roofHit(roof,x);assert.ok(hit.normal);assert.ok(hit.normal.y>0);assert.ok(hit.normal.x>=-.001);normals.push(hit.normal.clone().normalize());}
 assert.ok(normals.at(-1)!.x>.55,'The shoulder rolls towards the side rather than ending as a flat slab');
 for(let i=1;i<normals.length;i++)assert.ok(normals[i-1].dot(normals[i])>.94,'No isolated hard highlight band on the roll');
 const rear=new Map<number,T.Vector3>(),p=roof.geometry.attributes.position;
 for(let i=0;i<p.count;i++)if(Math.abs(p.getY(i)-1.875)<1e-6){const point=vector(p,i),x=Number(point.x.toFixed(6));if(point.z<0&&(!rear.has(x)||point.z<rear.get(x)!.z))rear.set(x,point);}
 checkSeam([...rear.values()].sort((a,b)=>a.x-b.x),['panel_RearCornerVan-1','panel_RearCornerVan1','panel_CargoDoorSurroundVanTop'].flatMap(n=>triangles(mesh(published,n))),'roof/rear portal');
 for(const side of [-1,1]){
  const corner=mesh(published,'panel_RearCornerVan'+side),positions=corner.geometry.attributes.position,seam=new Map<number,T.Vector3>();
  for(let i=0;i<positions.count;i++)if(Math.abs(positions.getZ(i)+2.12)<1e-6){const point=vector(positions,i);seam.set(Number(point.y.toFixed(6)),point);}
  const suffix=side<0?'L':'R',sidePanels=['panel_CargoSideVan'+suffix,'panel_CargoBlankVan'+suffix].map(n=>mesh(published,n));
  checkSeam([...seam.values()].sort((a,b)=>a.y-b.y),sidePanels.flatMap(triangles),'quarter/cargo side '+side);
  for(const y of [.60,.85,1.04,1.10,1.14,1.4,1.7,1.81,1.87])for(const z of [-2.1201,-2.12,-2.1199]){
   const hit=new T.Raycaster(new T.Vector3(side*1.3,y,z),new T.Vector3(-side,0,0)).intersectObjects([...sidePanels,corner])[0];assert.ok(hit&&Math.abs(hit.point.x)>.79,'No open longitudinal corner seam');
  }
 }
});

test('new fixed portal preserves the original doors, wheel anchors, floor and clear cargo opening with fitted armor',()=>{
 const names:string[]=[];
 previous.traverse(o=>{if(o instanceof T.Mesh&&(/^panel_CargoDoorVan[LR]/.test(o.name)||/^(Structure_floor_Van|Interior_Carrier_(cargo_floor|cab_floor))/.test(o.name)))names.push(o.name);});
 assert.ok(names.length>20);
 for(const name of names){
  const before=mesh(previous,name),after=mesh(published,name);assert.deepEqual(geometryState(after),geometryState(before),name+' untouched tooling');
  assert.ok(after.matrix.elements.every((value,i)=>Math.abs(value-before.matrix.elements[i])<1e-7),name+' unchanged placement');
 }
 for(const name of ['FL','FR','RL','RR']){
  const before=previous.getObjectByName('wheel_'+name)!,after=published.getObjectByName('wheel_'+name)!;
  assert.deepEqual(after.position.toArray(),before.position.toArray());assert.deepEqual(after.scale.toArray(),before.scale.toArray());
  before.traverse(o=>{if(o instanceof T.Mesh)assert.deepEqual(geometryState(mesh(after,o.name)),geometryState(o),o.name+' unchanged wheel tooling');});
 }
 for(const armor of [0,3]){
  const root=published.clone(true);attachVehicleArmor(root,'van',armor);root.updateMatrixWorld(true);const fixed:T.Mesh[]=[];
  root.traverse(o=>{if(o instanceof T.Mesh&&!/^panel_CargoDoorVan[LR]/.test(o.name))fixed.push(o);});
  // The unchanged bumper reaches y.554; probe the usable opening above it.
  for(const x of [-.75,-.5,0,.5,.75])for(const y of [.58,.8,1.1,1.4,1.74]){
   const hits=new T.Raycaster(new T.Vector3(x,y,-2.6),new T.Vector3(0,0,1),0,.55).intersectObjects(fixed);
   assert.equal(hits.length,0,`Armor${armor} keeps the original cargo opening clear at ${x},${y}`);
  }
  if(armor){const rear=mesh(root,'panel_Reinforcement_rear_steel'),bounds=new T.Box3().setFromObject(rear);assert.ok(bounds.max.y<.48,'Rear reinforcement remains below door sweep');}
 }
});

await R.init();
/** Probe the actual hull along exterior vertex and triangle-interior normals.
 * A positive error is collision protruding beyond the visible surface. */
function hullMismatch(root:T.Group,roof:R.Collider){
 root.updateMatrixWorld(true);const values:{name:string;error:number;point:number[]}[]=[];
 for(const name of ['panel_RoofVan','panel_RearCornerVan-1','panel_RearCornerVan1','panel_CargoDoorSurroundVanTop']){
  const o=mesh(root,name),p=o.geometry.attributes.position,n=o.geometry.attributes.normal;
  for(let i=0;i<p.count;i+=3)for(const weights of [[1,0,0],[0,1,0],[0,0,1],[1/3,1/3,1/3],[.5,.25,.25]]){
   const point=new T.Vector3(),normal=new T.Vector3();for(let j=0;j<3;j++){point.addScaledVector(vector(p,i+j),weights[j]);normal.addScaledVector(vector(n,i+j),weights[j]);}
   point.applyMatrix4(o.matrixWorld);normal.transformDirection(o.matrixWorld);
   if(name==='panel_RoofVan'?normal.y<=.001:name.includes('Corner')?normal.z>=-.01:normal.z>=-.5)continue;
   const origin=point.clone().addScaledVector(normal,.3),direction=normal.clone().negate(),visible=new T.Raycaster(origin,direction,0,.6).intersectObject(o)[0];if(!visible)continue;
   origin.y-=classicWheelAnchors('van').modelOffset;const physical=roof.castRay(new R.Ray(origin,direction),.6,true);if(physical<0)continue;
   values.push({name,error:visible.distance-physical,point:point.toArray()});
  }
 }
 assert.ok(values.length>300);return values.sort((a,b)=>b.error-a.error);
}

test('actual roof and rear-corner collision fit does not develop larger phantom shoulders',t=>{
 const world=new R.World({x:0,y:0,z:0}),rig=createVehiclePhysics(R,world,'van',vehicleSpecification('van').mass);world.step();
 try{
  const old=hullMismatch(previous,rig.roof),current=hullMismatch(published,rig.roof),quarter=current.find(v=>v.name.includes('Corner'))!;
  t.diagnostic(JSON.stringify({previousWorst:old[0],currentWorst:current[0],currentQuarter:quarter}));
  assert.ok(current[0].error<.045,'No phantom collider shoulder beyond45mm');assert.ok(current[0].error<=old[0].error+.006,'No material growth beyond the preceding approximation');
  assert.ok(quarter.error<.025,'Rounded portal stays close to actual rear hull');
 }finally{world.removeVehicleController(rig.controller);world.free();}
});

const originalLoad=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const fx={emit(){},mark(){},detach(o:T.Mesh){o.visible=false;}}as any;
// Replay stores health as Float32. Preserve exact geometry buffers while
// ignoring sub-picometre pose roundoff from world/local event conversion.
const precise=(value:number)=>Number(value.toFixed(12));
const state=(car:Vehicle)=>({health:Math.fround(car.health),engine:car.engineDamage,wheels:[...car.wreckParts.wheelDamage],panels:car.panels.map(o=>({name:o.name,visible:o.visible,geometry:geometryState(o),matrix:o.matrix.toArray().map(precise)})),hinges:car.wreckParts.assemblies.map(a=>({name:a.name,loose:precise(a.loose)}))});

test('actual roof/corner dents and original cargo hinges survive repair and compressed backwards replay',async()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),setup=stockSetup('van');setup.armor=3;
 const car=new Vehicle(0,'van',setup.paint,scene,world,fx,setup);car.place(2,4,.2);car.render(1);car.root.updateMatrixWorld(true);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'van',setup}],props:0,created:'2026-10-03T00:00:00Z'});let eventTime=0;
 car.onVisualEvent=event=>recorder.event(0,eventTime,event);const states:ReturnType<typeof state>[]=[];
 const capture=(at:number)=>{car.wreckParts.poseAt(at,0);car.root.updateMatrixWorld(true);states.push(state(car));recorder.capture(at,()=>captureReplayFrame([car],[],[0]),true);};
 const fixedNames=['panel_RoofVan','panel_RearCornerVan-1','panel_CargoDoorSurroundVanTop','panel_CargoDoorSurroundVanReturn-1'],fixed=fixedNames.map(n=>mesh(car.model,n)),matrices=fixed.map(o=>o.matrix.toArray());
 const hit=(point:T.Vector3,direction:T.Vector3,damage:number)=>car.hit(point.applyMatrix4(car.model.matrixWorld),direction.applyQuaternion(car.root.quaternion),damage,eventTime,true);
 try{
  capture(0);eventTime=.25;hit(new T.Vector3(-.72,1.91,-1.0),new T.Vector3(.2,-1,0).normalize(),32);capture(.5);
  assert.notDeepEqual(geometryState(fixed[0]),states[0].panels.find(p=>p.name===fixed[0].name)!.geometry,'Roof pressing receives a real dent');
  eventTime=1.25;hit(new T.Vector3(-.82,1.55,-2.17),new T.Vector3(0,0,1),42);capture(1.5);
  assert.notDeepEqual(geometryState(fixed[1]),states[0].panels.find(p=>p.name===fixed[1].name)!.geometry,'Rear corner receives a real dent');
  const door=car.wreckParts.assemblies.find(a=>a.name==='cargo-left')!;assert.ok(door.loose>0);assert.ok(door.members.some(m=>m.mesh.name==='panel_CargoDoorVanLStamping'));
  const delta=door.members[0].mesh.matrix.clone().multiply(door.members[0].matrix.clone().invert());
  for(const member of door.members){const d=member.mesh.matrix.clone().multiply(member.matrix.clone().invert());assert.ok(d.elements.every((value,i)=>Math.abs(value-delta.elements[i])<1e-6),member.mesh.name+' one retained hinge');}
  assert.deepEqual(fixed.map(o=>o.matrix.toArray()),matrices,'New fixed coachwork does not follow the barn door');
  eventTime=2.25;car.repair();capture(2.5);assert.deepEqual(states[3],states[0],'Repair restores all geometry, finish and hinges');
  const document=await readReplayFile(new File([await replayFile(recorder.document())],'carrier-coachwork.qir')),replay=new ReplayScene(document,scene,world,[]);
  try{for(const [time,index]of [[0,0],[.5,1],[1.5,2],[2.5,3],[.5,1],[0,0],[1.5,2],[2.5,3]]){replay.seek(time);assert.deepEqual(state(replay.cars[0]),states[index],`Replay state at${time}`);}}finally{replay.dispose();}
 }finally{car.dispose();world.free();}
});

test('coachwork changes retain the preceding published asset and source revision',verifyVanCoachworkRevision);
