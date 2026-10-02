import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {measureTyreVisual,deformTyreContactPoint} from '../src/tyre-visual';
import {vehicleFlatTyreRadius} from '../src/tyre-condition';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {verifyBuggyWheelRevision} from './buggy-wheel-invariants';

const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const previousBytes=gunzipSync(readFileSync(new URL('./fixtures/buggy-wheel/public-models-buggy.glb.gz',import.meta.url)));
assert.equal(hash(previousBytes),'6ca99cb7cc7aaf305ecbe3cb7c71b20b9d10628c59aaaa1035d3cb39b84876e5','Reference is the actual GLB shipped at git737ef40, not rebuilt candidate geometry');
const previousModel=()=>new GLTFLoader().parseAsync(Uint8Array.from(previousBytes).buffer,'');
const published=(await previousModel()).scene,current=(await loadCarWithoutImages('buggy')).scene;
await R.init();
const originalLoad=GLTFLoader.prototype.loadAsync;
let previousPrepared:T.Group;
try{
 GLTFLoader.prototype.loadAsync=async url=>{const name=/\/([^/]+)\.glb$/.exec(String(url))![1];return name==='buggy'?previousModel():loadCarWithoutImages(name);};
 await loadCars(()=>{});previousPrepared=templates.get('buggy')!;
 GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);
 await loadCars(()=>{});
}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const currentPrepared=templates.get('buggy')!,corners=['FL','FR','RL','RR'] as const,zero={x:0,y:0,z:0},dt=1/60;
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const near=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const arrayBytes=(array:ArrayBufferView)=>Buffer.from(array.buffer,array.byteOffset,array.byteLength);
const insideWheel=(o:T.Object3D)=>{for(let p=o.parent;p;p=p.parent)if(/^wheel_(FL|FR|RL|RR)$/.test(p.name))return true;return false;};
const materialState=(material:T.Material)=>{const state=material.toJSON();delete state.uuid;delete state.metadata;return state;};
function nonWheelState(root:T.Object3D){
 const state:any[]=[];
 root.traverse(o=>{
  if(insideWheel(o))return;
  const row:any={name:o.name,parent:o.parent?.name??'',type:o.type,p:o.position.toArray(),q:o.quaternion.toArray(),scale:o.scale.toArray()};
  if(o instanceof T.Mesh){row.attributes=Object.fromEntries(Object.entries(o.geometry.attributes).map(([name,a])=>[name,{itemSize:a.itemSize,normalized:a.normalized,bytes:arrayBytes(a.array)}]));row.index=o.geometry.index?arrayBytes(o.geometry.index.array):null;row.materials=(Array.isArray(o.material)?o.material:[o.material]).map(materialState);}
  state.push(row);
 });return state;
}
function counts(root:T.Object3D){let meshes=0,triangles=0,vertices=0,casters=0;root.traverse(o=>{if(o instanceof T.Mesh){meshes++;vertices+=o.geometry.attributes.position.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;casters+=Number(o.castShadow);}});return{meshes,triangles,vertices,casters};}
function geometryHash(root:T.Object3D){const digest=createHash('sha256');root.traverse(o=>{if(!(o instanceof T.Mesh))return;digest.update(o.name);for(const [name,a]of Object.entries(o.geometry.attributes)){digest.update(name);digest.update(arrayBytes(a.array));}if(o.geometry.index)digest.update(arrayBytes(o.geometry.index.array));});return digest.digest('hex');}
function makeCar(world:R.World,armor=0,previous=false,id=0){
 if(previous)templates.set('buggy',previousPrepared);
 try{const setup={...stockSetup('buggy'),armor};return new Vehicle(id,'buggy',setup.paint,new T.Scene(),world,fx,setup);}
 finally{templates.set('buggy',currentPrepared);}
}
function flatRig(previous=false,armor=0){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const car=makeCar(world,armor,previous),p=new T.Vector3(0,.89,0);car.body.setTranslation(p,true);car.current.copy(p);car.previous.copy(p);car.root.position.copy(p);car.root.updateMatrixWorld(true);
 return{world,car,step(time:number){car.preStep(dt);world.step();car.postStep(dt,time);car.render(1);},dispose(){car.dispose();world.free();}};
}
function strike(car:Vehicle,time:number){car.root.updateMatrixWorld(true);car.hit(new T.Vector3(-.85,-.56,1.2).applyMatrix4(car.root.matrixWorld),new T.Vector3(1,0,0).applyQuaternion(car.root.quaternion),23,time,true);}
function physicsState(car:Vehicle){return{p:car.body.translation(),q:car.body.rotation(),v:car.body.linvel(),av:car.body.angvel(),gear:car.gear,rpm:car.rpm,speed:car.speed,steering:car.steering,health:car.health,engine:car.engineDamage,tyres:car.tyreDamage,wheelDamage:Array.from(car.wreckParts.wheelDamage),wheelShift:car.wreckParts.wheelShift.map(v=>v.toArray()),wheels:corners.map((_,i)=>({radius:car.controller.wheelRadius(i),suspension:car.controller.wheelSuspensionLength(i),rotation:car.controller.wheelRotation(i),force:car.controller.wheelEngineForce(i),contact:car.controller.wheelIsInContact(i)}))};}

// Weld only coincident coordinates for topology checks. Component volumes catch
// a wholly reversed enclosed lug even when its vertex normals are also reversed.
function closedOutward(mesh:T.Mesh){
 const geometry=mesh.geometry,p=geometry.attributes.position,n=geometry.attributes.normal,count=(geometry.index?.count??p.count)/3;
 const parent=Array.from({length:count},(_,i)=>i),volume:number[]=[],edges=new Map<string,{face:number;direction:number}[]>();
 const find=(i:number):number=>parent[i]===i?i:(parent[i]=find(parent[i]));
 const key=(v:T.Vector3)=>v.toArray().map(x=>Math.round(x*1e6)).join(',');
 for(const [name,a]of Object.entries(geometry.attributes))assert.ok(Array.from(a.array).every(Number.isFinite),mesh.name+' finite '+name);
 for(let face=0;face<count;face++){
  const ids=[0,1,2].map(j=>geometry.index?.getX(face*3+j)??face*3+j),q=ids.map(i=>new T.Vector3().fromBufferAttribute(p,i));
  const cross=q[1].clone().sub(q[0]).cross(q[2].clone().sub(q[0]));assert.ok(cross.lengthSq()>1e-18,mesh.name+' nondegenerate face '+face);
  for(const i of ids){const normal=new T.Vector3().fromBufferAttribute(n,i);near(normal.length(),1,2e-6);assert.ok(cross.dot(normal)>=-1e-10,mesh.name+' outward shaded face '+face);}
  volume.push(q[0].dot(q[1].clone().cross(q[2]))/6);
  for(let j=0;j<3;j++){const a=key(q[j]),b=key(q[(j+1)%3]),edge=a<b?a+'|'+b:b+'|'+a,rows=edges.get(edge)??[];rows.push({face,direction:a<b?1:-1});edges.set(edge,rows);}
 }
 for(const [edge,rows]of edges){assert.equal(rows.length,2,mesh.name+' closed edge '+edge);assert.equal(rows[0].direction+rows[1].direction,0,mesh.name+' consistent winding');parent[find(rows[1].face)]=find(rows[0].face);}
 const components=new Map<number,number>();for(let face=0;face<count;face++){const id=find(face);components.set(id,(components.get(id)??0)+volume[face]);}
 for(const signed of components.values())assert.ok(signed>1e-12,mesh.name+' every closed component points outward');
 return components.size;
}

test('new Ravine wheels preserve every published non-wheel buffer, material, transform and suspension',t=>{
 assert.deepEqual(nonWheelState(current),nonWheelState(published),'Only descendants of the four existing wheel groups may change');
 for(const corner of corners){const before=published.getObjectByName('wheel_'+corner)!,after=current.getObjectByName('wheel_'+corner)!;assert.notEqual(geometryHash(after),geometryHash(before),corner+' actually receives the new geometry');assert.deepEqual(after.position.toArray(),before.position.toArray());assert.deepEqual(after.quaternion.toArray(),before.quaternion.toArray());assert.deepEqual(after.scale.toArray(),before.scale.toArray());}
 const bytes=readFileSync(new URL('../public/models/buggy.glb',import.meta.url));assert.deepEqual(bytes,readFileSync(new URL('../public/models/buggy-candidate.glb',import.meta.url)));
 const before=counts(published),after=counts(current),oldWheel=counts(published.getObjectByName('wheel_FL')!),newWheel=counts(current.getObjectByName('wheel_FL')!);
 assert.equal(after.vertices-before.vertices,4*(newWheel.vertices-oldWheel.vertices),'The full asset delta is confined to the four wheels');
 t.diagnostic(JSON.stringify({published:before,candidate:after,publishedWheel:oldWheel,candidateWheel:newWheel,bytes:bytes.length}));
});

test('actual exported wheel shells are closed and outward with the original tyre and metal clearance envelopes',t=>{
 let components=0,faces=0;
 current.updateMatrixWorld(true);
 for(const [i,corner]of corners.entries()){
  const wheel=current.getObjectByName('wheel_'+corner)!;assert.deepEqual(wheel.position.toArray(),[(i%2?1:-1)*.85,.40,(i<2?1:-1)*1.20]);
  const inverse=wheel.matrixWorld.clone().invert();let rubberRadius=0,rubberWidth=0,metalRadius=0,metalSphere=0;
  wheel.traverse(o=>{
   if(!(o instanceof T.Mesh))return;components+=closedOutward(o);faces+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
   assert.equal(o.geometry.attributes.uv.count,o.geometry.attributes.position.count,'Every vertex has a finite exported UV');
   const p=o.geometry.attributes.position,toWheel=inverse.clone().multiply(o.matrixWorld),rubber=/tire/i.test((o.material as T.Material).name),q=new T.Vector3();
   for(let j=0;j<p.count;j++){q.fromBufferAttribute(p,j).applyMatrix4(toWheel);const radius=Math.hypot(q.y,q.z);if(rubber){rubberRadius=Math.max(rubberRadius,radius);rubberWidth=Math.max(rubberWidth,Math.abs(q.x));}else{metalRadius=Math.max(metalRadius,radius);metalSphere=Math.max(metalSphere,q.length());}}
  });
  near(rubberRadius,.38,1e-6);near(rubberWidth,.145,1e-6);assert.ok(metalRadius<=.20800005,corner+' rigid metal radial envelope');assert.ok(metalSphere<=.2344135,corner+' rigid metal sphere includes camber/spin');
  assert.ok(vehicleFlatTyreRadius('buggy')>=metalRadius+.015&&vehicleFlatTyreRadius('buggy')>=metalSphere+.005,'Existing physical flat radius clears every metal vertex');
 }
 t.diagnostic(`${faces} actual GLB faces and ${components} closed components audited.`);
});

test('the exported carcass has continuous shaded seams and the wheel face has a recessed physical dish',()=>{
 current.updateMatrixWorld(true);
 for(const [i,corner]of corners.entries()){
  const wheel=current.getObjectByName('wheel_'+corner)!,inverse=wheel.matrixWorld.clone().invert(),side=i%2?1:-1;
  const carcass=wheel.getObjectByName('Tire_Ravine_'+corner) as T.Mesh,p=carcass.geometry.attributes.position,n=carcass.geometry.attributes.normal,toWheel=inverse.clone().multiply(carcass.matrixWorld),normalMatrix=new T.Matrix3().getNormalMatrix(toWheel),welded=new Map<string,T.Vector3>();
  let seams=0;
  for(let j=0;j<p.count;j++){
   const point=new T.Vector3().fromBufferAttribute(p,j).applyMatrix4(toWheel);if(Math.hypot(point.y,point.z)<.24)continue;
   const key=point.toArray().map(x=>Math.round(x*1e6)).join(','),normal=new T.Vector3().fromBufferAttribute(n,j).applyMatrix3(normalMatrix).normalize(),previous=welded.get(key);
   if(previous){assert.ok(previous.distanceTo(normal)<2e-6,corner+' smooth rubber normals agree at duplicated triangle and UV-seam vertices');seams++;}else welded.set(key,normal);
  }
  assert.ok(seams>100,'Actual smooth carcass seams are sampled');
  const extent=(name:string)=>{const mesh=wheel.getObjectByName(name) as T.Mesh,positions=mesh.geometry.attributes.position,matrix=inverse.clone().multiply(mesh.matrixWorld);let outer=-Infinity;for(let j=0;j<positions.count;j++)outer=Math.max(outer,side*new T.Vector3().fromBufferAttribute(positions,j).applyMatrix4(matrix).x);return outer;};
  const lip=extent('Wheel_Ravine_Barrel_'+corner),hub=extent('Wheel_Ravine_Hub_'+corner);
  assert.ok(lip-hub>.02,corner+' hub is physically recessed behind the rolled lip');
  for(let spoke=0;spoke<6;spoke++){
   const mesh=wheel.getObjectByName('Wheel_Ravine_Spoke_'+corner+spoke) as T.Mesh,positions=mesh.geometry.attributes.position,matrix=inverse.clone().multiply(mesh.matrixWorld);let inner=-Infinity,outer=-Infinity;
   for(let j=0;j<positions.count;j++){const point=new T.Vector3().fromBufferAttribute(positions,j).applyMatrix4(matrix),radius=Math.hypot(point.y,point.z);if(radius<.075)inner=Math.max(inner,side*point.x);if(radius>.16)outer=Math.max(outer,side*point.x);}
   assert.ok(Number.isFinite(inner)&&Number.isFinite(outer));assert.ok(outer-inner>.02,corner+' spoke has a concave dish, not a flat strip');assert.ok(outer<lip,corner+' spoke foot fits inside the outer lip');
  }
 }
});

test('prepared wheels retain four material batches and one caster while real driving stays exact against the shipped artwork',()=>{
 for(const armor of [0,3]){
  const previous=flatRig(true,armor),candidate=flatRig(false,armor);
  try{
   assert.deepEqual(nonWheelState(candidate.car.model),nonWheelState(previous.car.model),'Runtime preparation keeps body and suspension untouched');
   assert.equal(counts(candidate.car.model).meshes,armor?112:104);assert.equal(counts(candidate.car.model).casters,armor?43:39);
   for(const wheel of candidate.car.wheels){assert.equal(counts(wheel).meshes,4);assert.equal(counts(wheel).casters,1);const names:string[]=[];wheel.traverse(o=>{if(o instanceof T.Mesh)names.push((o.material as T.Material).name);});assert.deepEqual(names.sort(),['Ravine cast alloy','Ravine machined alloy','Structure Ravine steel','Tire Ravine all terrain'].sort());}
   const original=geometryHash(candidate.car.model);
   for(let tick=0;tick<420;tick++){
    for(const rig of [previous,candidate]){
     if([120,135,150].includes(tick))strike(rig.car,tick*dt);
     if(tick===300)rig.car.repair();
     rig.car.input={throttle:tick<180?0:tick<250?.7:tick<330?0:-.4,steer:tick>=210&&tick<270?.2:0,brake:tick>=250&&tick<300?1:0,handbrake:false};rig.step((tick+1)*dt);
    }
    assert.deepEqual(physicsState(candidate.car),physicsState(previous.car),`armor${armor} tick${tick}: wheel artwork cannot change physics state`);
   }
   assert.equal(geometryHash(candidate.car.model),original,'A real repair restores all deformed body buffers while wheel buffers remain immutable');
  }finally{previous.dispose();candidate.dispose();}
 }
});

function deformedRubber(car:Vehicle,index=0){
 car.root.updateMatrixWorld(true);const wheel=car.wheels[index],contact=car.tireContacts[index],measured=measureTyreVisual(wheel,'buggy');
 const condition={failure:contact.failure.value,radius:contact.radius.value,baseRadius:contact.baseRadius.value},surface={wheelToWorld:wheel.matrixWorld.clone(),plane:contact.plane.value,load:contact.load.value,active:contact.active.value};
 const positions:number[]=[],q=new T.Vector3(),out=new T.Vector3();let patch=0,lowest=Infinity;
 for(const record of measured.meshes){
  // Use the actual construction-time shader transform. Re-measuring it after
  // a world-space pose can turn a centreline x=0 into signed rounding noise,
  // which is not the fixed input used by the production sidewall shader.
  const shader={uniforms:{} as Record<string,T.IUniform>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};
  (record.mesh.material as T.Material).onBeforeCompile(shader as any,{} as T.WebGLRenderer);
  const toWheel=shader.uniforms.tireToWheel.value as T.Matrix4,mask=shader.uniforms.tireProfile.value.w as number,p=record.mesh.geometry.attributes.position;
  for(let i=0;i<p.count;i++){
  q.fromBufferAttribute(p,i).applyMatrix4(toWheel);deformTyreContactPoint(q,contact.profile,condition,surface,mask,out).applyMatrix4(wheel.matrixWorld);positions.push(...out.toArray());
  const height=out.x*surface.plane.x+out.y*surface.plane.y+out.z*surface.plane.z+surface.plane.w;lowest=Math.min(lowest,height);if(Math.abs(height)<1e-7)patch++;
 }}
 return{positions,patch,lowest,failure:contact.failure.value,active:contact.active.value,load:contact.load.value};
}

test('new loaded tread survives actual tyre damage, repair and compressed backwards replay without moving rigid buffers',async()=>{
 const rig=flatRig(),car=rig.car,setup=stockSetup('buggy'),original=geometryHash(car.wheels[0]);let time=0;
 const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'buggy',setup}],props:0,created:'2026-10-02',tyreModel:1});car.onVisualEvent=e=>recorder.event(0,time,e);
 const shapes:ReturnType<typeof deformedRubber>[]=[];
 const capture=(at:number)=>{car.render(1);shapes[at]=deformedRubber(car);recorder.capture(at,()=>captureReplayFrame([car],[],[0],1),true);};
 let replay:ReplayScene|undefined;
 try{
  for(let i=0;i<180;i++)rig.step((i+1)*dt);capture(0);
  time=.25;strike(car,time);time=.50;strike(car,time);for(let i=0;i<60;i++)rig.step(time+(i+1)*dt);capture(1);
  time=1.25;strike(car,time);for(let i=0;i<60;i++)rig.step(time+(i+1)*dt);capture(2);
  assert.ok(shapes[1].failure>0&&shapes[1].failure<1);assert.equal(shapes[2].failure,1);assert.equal(shapes[2].active,1);assert.ok(shapes[2].load>0);assert.ok(shapes[2].patch>10,'The new actual tread vertices form a loaded contact patch');assert.ok(shapes[2].lowest>=-2e-6,'Loaded rubber stays above its recorded road plane');
  assert.equal(geometryHash(car.wheels[0]),original,'Tyre failure changes shader inputs, not metal or rubber buffers');
  time=2.25;car.repair();for(let i=0;i<60;i++)rig.step(time+(i+1)*dt);capture(3);assert.equal(shapes[3].failure,0);
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'ravine-wheel-quality.qir'));replay=new ReplayScene(doc,car.scene,rig.world,[]);
  for(const at of [0,1,2,3,1,0,2,3,0]){
   replay.seek(at);const other=replay.cars[0],actual=deformedRubber(other),expected=shapes[at];assert.equal(other.body.isEnabled(),false);near(actual.failure,expected.failure);assert.equal(actual.active,expected.active);near(actual.load,expected.load);assert.equal(actual.positions.length,expected.positions.length);
   actual.positions.forEach((n,i)=>assert.ok(Math.abs(n-expected.positions[i])<=2e-5,`replay${at}s rubber coordinate${i}: ${n} != ${expected.positions[i]}`));assert.equal(geometryHash(other.wheels[0]),original,'Repeated seeks cannot rewrite the cached wheel');
  }
  assert.equal(geometryHash(car.wheels[0]),original);assert.equal(car.tireContacts[0].failure.value,0,'Replay seeks leave the repaired live car intact');
 }finally{replay?.dispose();rig.dispose();}
});

test('wheel quality extends the immutable tyre release without changing the driving kernel or calm camera',verifyBuggyWheelRevision);
