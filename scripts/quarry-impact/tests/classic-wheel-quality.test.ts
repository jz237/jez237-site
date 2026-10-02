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
import {verifyClassicWheelRevision} from './classic-wheel-invariants';

import {classicWheelAnchors} from '../src/classic-vehicle-specs';
const kinds=['tern','marten'] as const;
type Kind=typeof kinds[number];
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const previousHashes={tern:'4a62b42a8d15969bb77a45f929fa0e346cef7b87bc0d761fe3c46bbde7d972a4',marten:'82384796a34f7203caa22b6b013253b3672cd2c4c7c6e01e4ceb2afc402ba8e9'};
const previousBytes=Object.fromEntries(kinds.map(kind=>{
 const bytes=gunzipSync(readFileSync(new URL('./fixtures/classic-wheel/public-models-'+kind+'.glb.gz',import.meta.url)));
 assert.equal(hash(bytes),previousHashes[kind],kind+' reference is the actual GLB published before this wheel revision');return[kind,bytes];
})) as Record<Kind,Buffer>;
const previousModel=(kind:Kind)=>new GLTFLoader().parseAsync(Uint8Array.from(previousBytes[kind]).buffer,'');
const published={} as Record<Kind,T.Group>,current={} as Record<Kind,T.Group>,previousPrepared={} as Record<Kind,T.Group>,currentPrepared={} as Record<Kind,T.Group>;
for(const kind of kinds){published[kind]=(await previousModel(kind)).scene;current[kind]=(await loadCarWithoutImages(kind)).scene;}
await R.init();
const originalLoad=GLTFLoader.prototype.loadAsync;
try{
 GLTFLoader.prototype.loadAsync=async url=>{const name=/\/([^/]+)\.glb$/.exec(String(url))![1];return kinds.includes(name as Kind)?previousModel(name as Kind):loadCarWithoutImages(name);};
 await loadCars(()=>{});for(const kind of kinds)previousPrepared[kind]=templates.get(kind)!;
 GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);
 await loadCars(()=>{});for(const kind of kinds)currentPrepared[kind]=templates.get(kind)!;
}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const corners=['FL','FR','RL','RR'] as const,zero={x:0,y:0,z:0},dt=1/60;
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const near=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const arrayBytes=(array:ArrayBufferView)=>Buffer.from(array.buffer,array.byteOffset,array.byteLength);
const insideWheel=(o:T.Object3D)=>{for(let p=o.parent;p;p=p.parent)if(/^wheel_(FL|FR|RL|RR)$/.test(p.name))return true;return false;};
// Only these four existing sill geometries were explicitly approved for arch clearance.
// Their material, hierarchy and transforms remain part of the strict byte comparison.
const revisedSills=new Set(['panel_SillTernL','panel_SillTernR','panel_SillMartenL','panel_SillMartenR']);
const materialState=(material:T.Material)=>{const state=material.toJSON();delete state.uuid;delete state.metadata;return state;};
function nonWheelState(root:T.Object3D){
 const state:any[]=[];
 root.traverse(o=>{
  if(insideWheel(o))return;
  const row:any={name:o.name,parent:o.parent?.name??'',type:o.type,p:o.position.toArray(),q:o.quaternion.toArray(),scale:o.scale.toArray()};
  if(o instanceof T.Mesh){if(!revisedSills.has(o.name)){row.attributes=Object.fromEntries(Object.entries(o.geometry.attributes).map(([name,a])=>[name,{itemSize:a.itemSize,normalized:a.normalized,bytes:arrayBytes(a.array)}]));row.index=o.geometry.index?arrayBytes(o.geometry.index.array):null;}row.materials=(Array.isArray(o.material)?o.material:[o.material]).map(materialState);}
  state.push(row);
 });return state;
}
function counts(root:T.Object3D){let meshes=0,triangles=0,vertices=0,casters=0;root.traverse(o=>{if(o instanceof T.Mesh){meshes++;vertices+=o.geometry.attributes.position.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;casters+=Number(o.castShadow);}});return{meshes,triangles,vertices,casters};}
function geometryHash(root:T.Object3D){const digest=createHash('sha256');root.traverse(o=>{if(!(o instanceof T.Mesh))return;digest.update(o.name);for(const [name,a]of Object.entries(o.geometry.attributes)){digest.update(name);digest.update(arrayBytes(a.array));}if(o.geometry.index)digest.update(arrayBytes(o.geometry.index.array));});return digest.digest('hex');}
function stockSignature(car:Vehicle){
  const h=createHash('sha256');
  car.model.traverse(o=>{
    h.update(JSON.stringify([o.name,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray()]));
    if(o instanceof T.Mesh){
      for(const key of Object.keys(o.geometry.attributes).sort()){const a=o.geometry.attributes[key].array;h.update(key);h.update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));}
      for(const m of (Array.isArray(o.material)?o.material:[o.material]) as T.MeshPhysicalMaterial[])h.update(JSON.stringify([m.name,m.color?.toArray(),m.roughness,m.metalness,m.clearcoat,m.clearcoatRoughness,m.emissive?.toArray(),m.emissiveIntensity,m.opacity]));
    }
  });return h.digest('hex');
}

function makeCar(kind:Kind,world:R.World,armor=0,previous=false,id=0){
 if(previous)templates.set(kind,previousPrepared[kind]);
 try{const setup={...stockSetup(kind),armor};return new Vehicle(id,kind,setup.paint,new T.Scene(),world,fx,setup);}
 finally{templates.set(kind,currentPrepared[kind]);}
}
function flatRig(kind:Kind,previous=false,armor=0){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));
 const car=makeCar(kind,world,armor,previous),p=new T.Vector3(0,.89,0);car.body.setTranslation(p,true);car.current.copy(p);car.previous.copy(p);car.root.position.copy(p);car.root.updateMatrixWorld(true);
 return{world,car,step(time:number){car.preStep(dt);world.step();car.postStep(dt,time);car.render(1);},dispose(){car.dispose();world.free();}};
}
function strike(car:Vehicle,time:number){
 car.root.updateMatrixWorld(true);const anchor=classicWheelAnchors(car.kind as Kind),local=new T.Vector3().copy(anchor.wheels[0]);local.y-=anchor.modelOffset;
 car.hit(local.applyMatrix4(car.root.matrixWorld),new T.Vector3(1,0,0).applyQuaternion(car.root.quaternion),23,time,true);
}
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

test('Tern and Marten preserve all published body bytes except the four explicitly revised sill geometries',t=>{
 for(const kind of kinds){
  const before=published[kind],after=current[kind];assert.deepEqual(nonWheelState(after),nonWheelState(before),kind+' only wheel descendants and exact named sill buffers may change');
  for(const corner of corners){const a=before.getObjectByName('wheel_'+corner)!,b=after.getObjectByName('wheel_'+corner)!;assert.notEqual(geometryHash(a),geometryHash(b),kind+' receives new wheel geometry');assert.deepEqual(b.position.toArray(),a.position.toArray());assert.deepEqual(b.quaternion.toArray(),a.quaternion.toArray());assert.deepEqual(b.scale.toArray(),a.scale.toArray());}
  const bytes=readFileSync(new URL('../public/models/'+kind+'.glb',import.meta.url));assert.deepEqual(bytes,readFileSync(new URL('../public/models/'+kind+'-candidate.glb',import.meta.url)));
  const oldCounts=counts(before),newCounts=counts(after),oldWheel=counts(before.getObjectByName('wheel_FL')!),newWheel=counts(after.getObjectByName('wheel_FL')!);
  const sillDelta=Array.from(revisedSills).reduce((sum,name)=>{const a=before.getObjectByName(name),b=after.getObjectByName(name);return sum+(a&&b?counts(b).vertices-counts(a).vertices:0);},0);
  assert.equal(newCounts.vertices-oldCounts.vertices,4*(newWheel.vertices-oldWheel.vertices)+sillDelta);
  t.diagnostic(JSON.stringify({kind,published:oldCounts,candidate:newCounts,publishedWheel:oldWheel,candidateWheel:newWheel,bytes:bytes.length}));
 }
});

test('the four revised sills retain their exterior bounds but leave the actual wheel-opening disks clear',()=>{
 for(const kind of kinds){
  const title=kind==='tern'?'Tern':'Marten';current[kind].updateMatrixWorld(true);published[kind].updateMatrixWorld(true);
  for(const side of [-1,1]){
   const name='panel_Sill'+title+(side<0?'L':'R'),before=published[kind].getObjectByName(name) as T.Mesh,after=current[kind].getObjectByName(name) as T.Mesh;
   assert.ok(before&&after);assert.notEqual(geometryHash(before),geometryHash(after));
   const oldBounds=new T.Box3().setFromObject(before),bounds=new T.Box3().setFromObject(after);
   for(const axis of ['x','y','z'] as const){near(bounds.min[axis],oldBounds.min[axis],2e-5);near(bounds.max[axis],oldBounds.max[axis],2e-5);}
   closedOutward(after);
   let baselineHits=0;
   for(const anchor of classicWheelAnchors(kind).wheels.filter(p=>Math.sign(p.x)===side)){
    const centre=new T.Vector3(anchor.y,anchor.z,0),g=after.geometry,p=g.attributes.position;
    for(let face=0;face<(g.index?.count??p.count)/3;face++){
     const points=[0,1,2].map(j=>{const q=new T.Vector3().fromBufferAttribute(p,g.index?.getX(face*3+j)??face*3+j).applyMatrix4(after.matrixWorld);return new T.Vector3(q.y,q.z,0);});
     const triangle=new T.Triangle(...points as [T.Vector3,T.Vector3,T.Vector3]);
     const distance=triangle.getArea()>1e-12?triangle.closestPointToPoint(centre,new T.Vector3()).distanceTo(centre):Math.min(...points.map((a,j)=>{const b=points[(j+1)%3],ab=b.clone().sub(a),length=ab.lengthSq(),t=length?T.MathUtils.clamp(centre.clone().sub(a).dot(ab)/length,0,1):0;return a.clone().addScaledVector(ab,t).distanceTo(centre);}));
     assert.ok(distance>Math.hypot(.32,.096)+1e-5,name+' no projected sill triangle crosses the tyre envelope, including steering');
    }
    for(const y of [.332,.342,.352,.362])for(const dz of [-.28,-.14,0,.14,.28]){
     const ray=new T.Raycaster(new T.Vector3(side*1.3,y,anchor.z+dz),new T.Vector3(-side,0,0),0,2.6);
     baselineHits+=Number(ray.intersectObject(before,false).length>0);assert.equal(ray.intersectObject(after,false).length,0,name+' sill no longer crosses the visible wheel opening');
    }
   }
   assert.ok(baselineHits>=20,'Independent old GLB confirms the sampled rays catch the former obstruction');
  }
 }
});

test('all exported wheel shells have finite outward closed faces and retain the physical tyre and rigid-rim envelopes',t=>{
 let components=0,faces=0;
 for(const kind of kinds){current[kind].updateMatrixWorld(true);
  for(const [i,corner]of corners.entries()){
   const wheel=current[kind].getObjectByName('wheel_'+corner)!;assert.deepEqual(wheel.position.toArray(),Object.values(classicWheelAnchors(kind).wheels[i]));
   const inverse=wheel.matrixWorld.clone().invert();let rubberRadius=0,rubberWidth=0,metalRadius=0,metalSphere=0;
   wheel.traverse(o=>{
    if(!(o instanceof T.Mesh))return;components+=closedOutward(o);faces+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;
    assert.equal(o.geometry.attributes.uv.count,o.geometry.attributes.position.count);
    const p=o.geometry.attributes.position,toWheel=inverse.clone().multiply(o.matrixWorld),rubber=/tire/i.test((o.material as T.Material).name),q=new T.Vector3();
    for(let j=0;j<p.count;j++){q.fromBufferAttribute(p,j).applyMatrix4(toWheel);const radius=Math.hypot(q.y,q.z);if(rubber){rubberRadius=Math.max(rubberRadius,radius);rubberWidth=Math.max(rubberWidth,Math.abs(q.x));}else{metalRadius=Math.max(metalRadius,radius);metalSphere=Math.max(metalSphere,q.length());}}
   });
   near(rubberRadius,.32,1e-6);near(rubberWidth,.096,1e-6);assert.ok(metalRadius<=.19000005,kind+' '+corner+' rigid radial envelope');assert.ok(metalSphere<=.2065465,kind+' '+corner+' rigid spherical envelope');
   assert.ok(vehicleFlatTyreRadius(kind)>=metalRadius+.015&&vehicleFlatTyreRadius(kind)>=metalSphere+.005);
  }
 }
 t.diagnostic(`${faces} exported faces and ${components} closed components audited.`);
});

test('road tyres have smooth carcass seams and genuinely open pressed vents with appropriate recessed or domed centres',()=>{
 for(const kind of kinds){
  const title=kind==='tern'?'Tern':'Marten',ventCount=kind==='tern'?8:10;current[kind].updateMatrixWorld(true);
  for(const [i,corner]of corners.entries()){
   const wheel=current[kind].getObjectByName('wheel_'+corner)!,side=i%2?1:-1,inverse=wheel.matrixWorld.clone().invert();
   const carcass=wheel.getObjectByName('Tire_'+title+'_Carcass_'+corner) as T.Mesh,p=carcass.geometry.attributes.position,n=carcass.geometry.attributes.normal,toWheel=inverse.clone().multiply(carcass.matrixWorld),normalMatrix=new T.Matrix3().getNormalMatrix(toWheel),welded=new Map<string,T.Vector3>();let seams=0;
   for(let j=0;j<p.count;j++){
    const point=new T.Vector3().fromBufferAttribute(p,j).applyMatrix4(toWheel);if(Math.hypot(point.y,point.z)<.22)continue;
    const key=point.toArray().map(x=>Math.round(x*1e6)).join(','),normal=new T.Vector3().fromBufferAttribute(n,j).applyMatrix3(normalMatrix).normalize(),previous=welded.get(key);
    if(previous){assert.ok(previous.distanceTo(normal)<2e-6,kind+' smooth rubber normals agree across duplicated and seam vertices');seams++;}else welded.set(key,normal);
   }
   assert.ok(seams>100);
   const dish=wheel.getObjectByName('Wheel_'+title+'_PressedDish_'+corner) as T.Mesh;
   const cast=(y:number,z:number,target:T.Object3D=dish,from=side)=>{
    const origin=new T.Vector3(from*.5,y,z).applyMatrix4(wheel.matrixWorld),direction=new T.Vector3(-from,0,0).transformDirection(wheel.matrixWorld);
    return new T.Raycaster(origin,direction,0,1).intersectObject(target,true);
   };
   for(let vent=0;vent<ventCount;vent++){
    const angle=(vent+.5)*Math.PI*2/ventCount,web=vent*Math.PI*2/ventCount;
    for(const radius of [.128,.132,.136])for(const from of [side,-side])assert.equal(cast(Math.cos(angle)*radius,Math.sin(angle)*radius,dish,from).length,0,kind+' each vent passes through the actual sheet from both sides');
    assert.ok(cast(Math.cos(web)*.132,Math.sin(web)*.132).length>0,kind+' the material between adjacent vents remains solid');
   }
   // Radial sections of the same pressing must not acquire arbitrary polygon
   // ridges between vents. The rejected candidate passed closure but had about
   // 10 mm of azimuth-dependent depth variation on nominally round sections.
   for(const radius of [.080,.096,.112,.154,.164,.170]){
    const depths=Array.from({length:64},(_,j)=>{const angle=(j+.21)*Math.PI*2/64,hit=cast(Math.cos(angle)*radius,Math.sin(angle)*radius)[0];assert.ok(hit,kind+' solid radial section');return side*hit.point.clone().applyMatrix4(inverse).x;});
    // A 24-sided outer ring has at most 1.49 mm radial chord sag at R.174.
    // With the shoulder’s 1:1 axial/radial slope this permits 1.5 mm depth
    // spread; the inner dish keeps 1 mm and the flat vent band stays exact.
    const tolerance=radius>.15?.0015:.001;
    assert.ok(Math.max(...depths)-Math.min(...depths)<tolerance,kind+' round pressed radial section at '+radius);
    if(radius===.112)for(const depth of depths)near(depth,.053,2e-6);
   }
   const centre=cast(0,0,wheel)[0];assert.ok(centre);
   assert.equal(centre.object.name,'Wheel_'+title+(kind==='marten'?'_DomedCap_':'_CentreCap_')+corner,'The visible hub centre is a real closed cap, not an unnoticed axial hole');
   const centreX=side*centre.point.clone().applyMatrix4(inverse).x;
   const lip=wheel.getObjectByName('Wheel_'+title+'_Barrel_'+corner) as T.Mesh,lp=lip.geometry.attributes.position,lm=inverse.clone().multiply(lip.matrixWorld);let lipX=-Infinity;
   for(let j=0;j<lp.count;j++)lipX=Math.max(lipX,side*new T.Vector3().fromBufferAttribute(lp,j).applyMatrix4(lm).x);
   if(kind==='marten')assert.ok(centreX-lipX>.01,'Marten has its domed period centre');
   else{
    const hubSheet=cast(.03,0)[0];assert.ok(hubSheet);const hubX=side*hubSheet.point.clone().applyMatrix4(inverse).x;
    assert.ok(lipX-hubX>.005,'Tern mounting dish is recessed behind the rolled lip; the small centre cap may protrude');
    for(let lug=0;lug<4;lug++){
     const angle=lug*Math.PI/2,y=Math.cos(angle)*.051,z=Math.sin(angle)*.051;
     assert.equal(cast(y,z).length,0,'The bolt hole is actually open through the Tern pressing');
     const bolt=cast(y,z,wheel)[0];assert.ok(bolt?.object.name.includes('RecessedLug'),'Actual recessed hardware occupies the bolt hole');
     const rim=cast(y-Math.sin(angle)*.01645,z+Math.cos(angle)*.01645)[0];assert.ok(rim);
     assert.ok(side*(rim.point.clone().applyMatrix4(inverse).x-bolt.point.clone().applyMatrix4(inverse).x)>.001,'Lug head sits below its formed recess lip');
    }
   }
  }
 }
});

test('prepared wheel batches stay bounded and FWD/RWD driving remains exact against the shipped wheel artwork',t=>{
 for(const kind of kinds)for(const armor of [0,3]){
  const previous=flatRig(kind,true,armor),candidate=flatRig(kind,false,armor);
  try{
   assert.deepEqual(nonWheelState(candidate.car.model),nonWheelState(previous.car.model),kind+' runtime body preparation stays byte exact');
   const oldCounts=counts(previous.car.model),newCounts=counts(candidate.car.model);
   for(const wheel of candidate.car.wheels){assert.equal(counts(wheel).meshes,4,'Four actual wheel material batches');assert.equal(counts(wheel).casters,1);}
   assert.equal(newCounts.meshes,oldCounts.meshes-4);assert.equal(newCounts.casters,oldCounts.casters);
   assert.equal(newCounts.triangles,kind==='tern'?(armor?70280:67464):(armor?63098:60154),'Reviewed prepared triangle cost');
   if(armor===0)assert.equal(stockSignature(previous.car),kind==='tern'?'b70740825080bdbad4370f6d721e3cdd53e3b688d7eee5fb2f6ab71e7b11311e':'47c7f70f57bab55eaa74df133073606a622b328a88fab95f94b4fe44f0dff42f','Frozen actual GLB reproduces the preceding independently published stock signature');
   t.diagnostic(JSON.stringify({kind,armor,published:oldCounts,candidate:newCounts}));
   const original=geometryHash(candidate.car.model);
   for(let tick=0;tick<420;tick++){
    for(const rig of [previous,candidate]){
     if([120,135,150].includes(tick))strike(rig.car,tick*dt);
     if(tick===300)rig.car.repair();
     rig.car.input={throttle:tick<180?0:tick<250?.7:tick<330?0:-.4,steer:tick>=210&&tick<270?.2:0,brake:tick>=250&&tick<300?1:0,handbrake:false};rig.step((tick+1)*dt);
    }
    assert.deepEqual(physicsState(candidate.car),physicsState(previous.car),`${kind} armor${armor} tick${tick}: artwork cannot alter physical state`);
   }
   assert.equal(geometryHash(candidate.car.model),original);
  }finally{previous.dispose();candidate.dispose();}
 }
});

function deformedRubber(car:Vehicle,index=0){
 car.root.updateMatrixWorld(true);const wheel=car.wheels[index],contact=car.tireContacts[index],measured=measureTyreVisual(wheel,car.kind);
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

test('both new road tyres restore loaded partial/full failure, repair and compressed backwards replay without touching rigid buffers',async()=>{
 for(const kind of kinds){
 const rig=flatRig(kind),car=rig.car,setup=stockSetup(kind),original=geometryHash(car.wheels[0]);let time=0;
 const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-02',tyreModel:1});car.onVisualEvent=e=>recorder.event(0,time,e);
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
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],kind+'-wheel-quality.qir'));replay=new ReplayScene(doc,car.scene,rig.world,[]);
  for(const at of [0,1,2,3,1,0,2,3,0]){
   replay.seek(at);const other=replay.cars[0],actual=deformedRubber(other),expected=shapes[at];assert.equal(other.body.isEnabled(),false);near(actual.failure,expected.failure);assert.equal(actual.active,expected.active);near(actual.load,expected.load);assert.equal(actual.positions.length,expected.positions.length);
   actual.positions.forEach((n,i)=>assert.ok(Math.abs(n-expected.positions[i])<=2e-5,`replay${at}s rubber coordinate${i}: ${n} != ${expected.positions[i]}`));assert.equal(geometryHash(other.wheels[0]),original,'Repeated seeks cannot rewrite the cached wheel');
  }
  assert.equal(geometryHash(car.wheels[0]),original);assert.equal(car.tireContacts[0].failure.value,0,'Replay seeks leave the repaired live car intact');
 }finally{replay?.dispose();rig.dispose();}
 }
});

test('classic wheel quality extends the immutable Ravine release while preserving physics, tyre shaders, donor assets and calm camera',verifyClassicWheelRevision);
