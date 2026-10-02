import test,{before} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,cloneCar} from '../src/assets';
import {CAR_KINDS} from '../src/rules';
import {vehicleWheelRadius} from '../src/classic-vehicle-specs';
import {vehicleFlatTyreRadius,tyreFailure} from '../src/tyre-condition';
import {wheelResponse} from '../src/wheel-physics';
import {TireContact} from '../src/wheel-mechanics';
import {measureTyreVisual,deformTyrePoint,deformTyreContactPoint,tyreCarcassRadius,tyreDeformationShader} from '../src/tyre-visual';

before(async()=>{
 const original=GLTFLoader.prototype.loadAsync;
 try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
});
const wheels=(root:T.Object3D)=>['FL','FR','RL','RR'].map(n=>root.getObjectByName('wheel_'+n)!);
const hash=(array:ArrayBufferView)=>createHash('sha256').update(new Uint8Array(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
const geometry=(root:T.Object3D)=>{const state:any[]=[];root.traverse(o=>{if(o instanceof T.Mesh)state.push({name:o.name,geometry:o.geometry,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([name,a])=>[name,hash(a.array)])),matrix:o.matrix.toArray(),cast:o.castShadow});});return state;};
const compile=(material:T.Material,library:'physical'|'depth'|'distanceRGBA')=>{const lib=T.ShaderLib[library],shader={uniforms:{},vertexShader:lib.vertexShader,fragmentShader:lib.fragmentShader};material.onBeforeCompile(shader as any,{} as T.WebGLRenderer);return shader as typeof shader&{uniforms:Record<string,{value:any}>};};

test('all44 real wheels retain rigid hardware and mesh buffers, with orientation-safe metal clearance',()=>{
 for(const kind of CAR_KINDS){
  const root=cloneCar(kind,0x567789);root.updateMatrixWorld(true);const before=geometry(root),contacts:TireContact[]=[];
  for(const wheel of wheels(root)){
   const measured=measureTyreVisual(wheel,kind),soft=new Set(measured.meshes.map(m=>m.mesh)),inverse=new T.Matrix4().makeScale(...wheel.scale.toArray()).multiply(wheel.matrixWorld.clone().invert());
   let metalSphere=0;const fixed=new Map<T.Mesh,T.Material>();
   wheel.traverse(o=>{if(!(o instanceof T.Mesh))return;if(!soft.has(o))fixed.set(o,o.material as T.Material);const p=o.geometry.attributes.position,m=inverse.clone().multiply(o.matrixWorld),point=new T.Vector3();for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(m);const r=Math.hypot(point.y,point.z),material=(o.material as T.Material).name;if(/tire|tyre/i.test(material)||material==='WheelViewBlocker'||kind==='coupe'&&material==='Structure hoses'&&r>.30)continue;metalSphere=Math.max(metalSphere,point.length());}});
   assert.ok(vehicleFlatTyreRadius(kind)>=metalSphere+.004999,kind+' metal clearance for all orientations');
   const contact=new TireContact(wheel,kind,vehicleWheelRadius(kind));contacts.push(contact);
   contact.setCondition({failure:1,radius:vehicleFlatTyreRadius(kind),baseRadius:vehicleWheelRadius(kind)});
   for(const[o,m]of fixed){assert.equal(o.material,m,kind+' metal material unchanged');assert.equal(o.customDepthMaterial,undefined);assert.equal(o.customDistanceMaterial,undefined);}
  }
  assert.deepEqual(geometry(root),before,kind+' no mesh, buffer, transform or shadow-caster change');contacts.forEach(c=>c.dispose());
 }
});

test('released carcasses retain tread depth, develop bounded folds, and leave legacy rubber and beads exact',()=>{
 let samples=0;
 for(const kind of CAR_KINDS)for(const wheel of wheels(cloneCar(kind,0x567789))){
  const {profile,meshes}=measureTyreVisual(wheel,kind),intact=vehicleWheelRadius(kind),flat=vehicleFlatTyreRadius(kind);
  const foldRadius=T.MathUtils.lerp(profile.rimRadius,profile.outerRadius,.45),foldCondition={failure:1,radius:flat,baseRadius:intact};
  const crest=deformTyrePoint(new T.Vector3(profile.halfWidth,foldRadius,0),profile,foldCondition),valley=deformTyrePoint(new T.Vector3(profile.halfWidth,foldRadius/Math.SQRT2,foldRadius/Math.SQRT2),profile,foldCondition);
  assert.ok(crest.x-valley.x>.009,'released sidewalls have visible bounded folds, not another smooth inflated profile');
  for(const mechanical of [0,.6,1])for(const damage of [undefined,0,.72,.76,.82,.88,.92,1]){
   const base=wheelResponse(mechanical,-1,12,intact,0,flat).radius,physical=wheelResponse(mechanical,-1,12,intact,damage,flat).radius,failure=tyreFailure(damage),condition=damage===undefined?undefined:{failure,radius:physical,baseRadius:base};
   let maximum=0;
   for(const record of meshes){const p=record.mesh.geometry.attributes.position,point=new T.Vector3(),deformed=new T.Vector3();
    for(let i=0;i<p.count;i++){
     point.fromBufferAttribute(p,i).applyMatrix4(record.toWheel);deformTyrePoint(point,profile,condition,record.maskRadius,deformed);samples++;
     assert.ok(deformed.toArray().every(Number.isFinite));assert.ok(Math.abs(deformed.x-point.x)<=.01920001,'bounded unpressurized folds');
     if(!failure||Math.hypot(point.y,point.z)<=Math.max(profile.rimRadius,record.maskRadius))assert.deepEqual(deformed.toArray(),point.toArray(),'legacy, bead and masked rigid vertices stay exact');
     if(/tire|tyre/i.test((record.mesh.material as T.Material).name))maximum=Math.max(maximum,Math.hypot(deformed.y,deformed.z));
    }
   }
   const expected=failure?tyreCarcassRadius(profile,condition!):profile.outerRadius;
   assert.ok(Math.abs(maximum-expected)<1e-7,`${kind}: actual rubber radius ${maximum} must match retained carcass ${expected}`);
   if(failure===1){assert.ok(maximum>physical+.015,'unloaded carcass must not become a uniformly small round tyre');assert.ok(maximum<=profile.outerRadius,'pressure loss cannot grow the outer envelope');}
  }
 }
 assert.ok(samples>100000,'actual authored rubber vertices sampled');
});

test('actual loaded rubber makes a broad rim-safe flat patch on a recorded plane through spin, camber and partial failure',()=>{
 let exactContactVertices=0,largestBulge=0;
 for(const kind of CAR_KINDS){
  const wheel=wheels(cloneCar(kind,0x567789))[0],{profile,meshes}=measureTyreVisual(wheel,kind),intact=vehicleWheelRadius(kind),flat=vehicleFlatTyreRadius(kind);
  for(const damage of [.76,.82,.88,1])for(const spin of [0,.73,2.4]){
   const failure=tyreFailure(damage),physical=wheelResponse(.6,-1,12,intact,damage,flat).radius,base=wheelResponse(.6,-1,12,intact,0,flat).radius,condition={failure,radius:physical,baseRadius:base};
   // A tilted road is independent of the wheel's spin, steering and camber.
   const roadRotation=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),.13),normal=new T.Vector3(0,1,0).applyQuaternion(roadRotation),plane=new T.Vector4(normal.x,normal.y,normal.z,-.001);
   const pose=new T.Matrix4().compose(normal.clone().multiplyScalar(physical+.001),roadRotation.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(spin,.58,.22))),new T.Vector3(1,1,1));
   const contact={wheelToWorld:pose,plane,load:1.3,active:1},point=new T.Vector3(),deformed=new T.Vector3(),world=new T.Vector3();
   const along=new T.Vector3(0,0,1),patchBounds=[Infinity,-Infinity];let patchCount=0;
   for(const record of meshes){const p=record.mesh.geometry.attributes.position;
    for(let i=0;i<p.count;i++){
     point.fromBufferAttribute(p,i).applyMatrix4(record.toWheel);deformTyreContactPoint(point,profile,condition,contact,record.maskRadius,deformed);
     assert.ok(deformed.toArray().every(Number.isFinite));world.copy(deformed).applyMatrix4(pose);const height=world.dot(normal)-.001;
     assert.ok(height>=-2e-7,`${kind}: loaded rubber cannot pass through its physical contact plane (${height})`);
     if(Math.hypot(point.y,point.z)<=Math.max(profile.rimRadius,record.maskRadius))assert.ok(deformed.distanceTo(point)<1e-12,'loaded contact leaves bead and masked hardware exact');
     const airborne=deformTyrePoint(point,profile,condition,record.maskRadius);
     if(Math.abs(height)<1e-7&&/tire|tyre/i.test((record.mesh.material as T.Material).name)){patchCount++;const distance=world.dot(along);patchBounds[0]=Math.min(patchBounds[0],distance);patchBounds[1]=Math.max(patchBounds[1],distance);}
     largestBulge=Math.max(largestBulge,Math.abs(deformed.x-airborne.x));
     const replay=deformTyreContactPoint(point,profile,condition,contact,record.maskRadius);
     assert.deepEqual(replay.toArray(),deformed.toArray(),'same recorded pose/contact inputs reproduce exact visual state');
    }
   }
   assert.ok(patchCount>=3,kind+' has actual tyre vertices meeting the road');
   if(failure===1)assert.ok(patchBounds[1]-patchBounds[0]>.10,kind+' full failure has a broad flat patch, not point contact');
   exactContactVertices+=patchCount;
  }
 }
 assert.ok(exactContactVertices>1000);assert.ok(largestBulge>.03,'loaded sidewall spreads visibly around the rigid rim');
});

test('colour and both shadow programs share failure geometry and contact inputs without enabling old classic contact effects',()=>{
 for(const kind of CAR_KINDS){const wheel=wheels(cloneCar(kind,0x567789))[0],contact=new TireContact(wheel,kind,vehicleWheelRadius(kind));
  for(const record of measureTyreVisual(wheel,kind).meshes){
   const o=record.mesh,colour=compile(o.material as T.Material,'physical'),depth=compile(o.customDepthMaterial!,'depth'),distance=compile(o.customDistanceMaterial!,'distanceRGBA');
   for(const shader of[colour,depth,distance]){
    assert.ok(shader.vertexShader.includes(tyreDeformationShader));
    for(const [name,value]of Object.entries({tireFailure:contact.failure,tireRadius:contact.radius,tireBaseRadius:contact.baseRadius,tireGround:contact.plane,tireContact:contact.active,tireLoad:contact.load}))assert.equal(shader.uniforms[name],value);
    assert.ok(shader.vertexShader.includes('tyreWorld=(modelMatrix*vec4(transformed,1.)).xyz;'));
   }
   assert.ok(distance.vertexShader.includes('worldPosition.xyz+=tireGround.xyz*tyreLift'));
   assert.equal(colour.uniforms.tireLegacy.value,record.legacy?1:0,'previously unmodified materials stay intact until explicit failure');
   assert.ok(depth.vertexShader.includes('float tyreEnabled=step(.000001,tireFailure)*vTyreAffected;'),'healthy shadows remain the previous rigid silhouette');
   if(record.maskRadius)assert.equal(colour.uniforms.tireProfile.value.w,.30,'coupe brake details excluded by the rubber vertex mask');
  }
  contact.dispose();
 }
});

test('per-corner condition, reset and shadow disposal leave other cars and cached geometry intact',()=>{
 const a=cloneCar('buggy',0x887755),b=cloneCar('buggy',0x887755),before=geometry(b),wa=wheels(a),wb=wheels(b),ca=wa.map(w=>new TireContact(w,'buggy',.38)),cb=wb.map(w=>new TireContact(w,'buggy',.38));
 const shadowPrograms:T.Material[]=[];a.traverse(o=>{if(o instanceof T.Mesh){if(o.customDepthMaterial)shadowPrograms.push(o.customDepthMaterial);if(o.customDistanceMaterial)shadowPrograms.push(o.customDistanceMaterial);}});
 let disposed=0;shadowPrograms.forEach(m=>m.addEventListener('dispose',()=>disposed++));
 ca[0].setCondition({failure:1,radius:.266,baseRadius:.38});assert.equal(ca[0].failure.value,1);assert.ok([...ca.slice(1),...cb].every(c=>c.failure.value===0));
 assert.equal(ca[0].radius.value,.266);assert.equal(ca[0].baseRadius.value,.38);
 ca[0].plane.value.set(0,1,0,-1);ca[0].active.value=1;ca[0].load.value=2;ca[0].dirt.value=.7;ca[0].reset();
 assert.equal(ca[0].failure.value,0);assert.equal(ca[0].radius.value,.38);assert.equal(ca[0].active.value,0);assert.equal(ca[0].load.value,0);assert.equal(ca[0].dirt.value,0);
 ca.forEach(c=>c.dispose());ca.forEach(c=>c.dispose());assert.equal(disposed,shadowPrograms.length,'owned shadow programs disposed once');assert.deepEqual(geometry(b),before);
 const fresh=cloneCar('buggy',0x887755);assert.deepEqual(geometry(fresh).map(x=>x.attributes),before.map(x=>x.attributes),'later clones retain pristine cached geometry');cb.forEach(c=>c.dispose());
});
