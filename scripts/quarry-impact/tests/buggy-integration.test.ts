import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars,templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {CAR_KINDS,DEFINITIONS,isCarKind} from '../src/rules';
import {classicWheelAnchors} from '../src/classic-vehicle-specs';
import {stockSetup,readGarage,exportSetup,importSetup} from '../src/garage';
import {demoCarKind,DEFAULT_DEMO} from '../src/demo-session';
import {DemoDirector} from '../src/demo-director';
import {fireProfile} from '../src/vehicle-fire-profile';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {Simulation} from '../multiplayer/simulation';
import {STEP,NEUTRAL,type Snapshot} from '../multiplayer/protocol';
import {stockOnlineSetup} from '../src/online-setup';
import {applyComponentImpact,freshComponents} from '../src/component-damage';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {OnlineView} from '../src/online-view';

await R.init();
const originalLoad=GLTFLoader.prototype.loadAsync;
try{
  GLTFLoader.prototype.loadAsync=async url=>{
    const name=/\/([^/]+)\.glb$/.exec(String(url))?.[1];
    assert.ok(name&&(name==='wheel-machining'||isCarKind(name)),`Unexpected model ${url}`);
    return loadCarWithoutImages(name);
  };
  await loadCars(()=>{});
}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const near=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const zero={x:0,y:0,z:0};
function pose(car:Vehicle,x=2,y=3,z=4,yaw=.6){
  const p=new T.Vector3(x,y,z),q=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw);
  car.body.setTranslation(p,true);car.body.setRotation(q,true);car.body.setLinvel(zero,true);car.body.setAngvel(zero,true);
  car.previous.copy(p);car.current.copy(p);car.previousQ.copy(q);car.currentQ.copy(q);car.root.position.copy(p);car.root.quaternion.copy(q);car.root.updateMatrixWorld(true);
}
function hit(car:Vehicle,point:T.Vector3,damage:number,time=.5){
  car.root.updateMatrixWorld(true);
  car.hit(point.clone().applyMatrix4(car.root.matrixWorld),new T.Vector3(0,0,point.z<0?1:-1).applyQuaternion(car.root.quaternion),damage,time,true);
}
const force=(car:Vehicle)=>{car.body.setLinvel(zero,true);car.input={throttle:1,steer:0,brake:0,handbrake:false};car.preStep(STEP);return [0,1,2,3].reduce((sum,i)=>sum+Math.abs(car.controller.wheelEngineForce(i)??0),0);};
const damageShape=(car:Vehicle)=>({engine:car.engineDamage,wheels:Array.from(car.wreckParts.wheelDamage),panels:car.panels.map(p=>{const a=p.geometry.attributes.position.array;return{name:p.name,visible:p.visible,positions:createHash('sha256').update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength)).digest('hex')};})});
function linkagePose(car:Vehicle){
  car.model.updateMatrixWorld(true);const links:{name:string;matrix:number[]}[]=[];
  car.model.traverse(o=>{if(o.name.startsWith('suspension_'))links.push({name:o.name,matrix:o.matrix.toArray()});});
  return links.sort((a,b)=>a.name.localeCompare(b.name));
}
function nearLinkage(actual:ReturnType<typeof linkagePose>,expected:ReturnType<typeof linkagePose>){
  assert.deepEqual(actual.map(m=>m.name),expected.map(m=>m.name));
  actual.forEach((m,i)=>m.matrix.forEach((value,j)=>near(value,expected[i].matrix[j],2e-6)));
}

test('the loaded Ravine keeps its exposed cockpit, larger wheels and suspension through a real Vehicle repair',()=>{
  const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('buggy');setup.paint=0x256b8e;
  const car=new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup);
  try{
    assert.ok(templates.has('buggy'));assert.equal(DEFINITIONS.buggy.name,'RAVINE 1800');assert.equal(car.glass.length,0,'The open cage has no imaginary glazing');
    assert.ok(car.model.getObjectByName('panel_CageMainRavine'));assert.ok(car.model.getObjectByName('panel_CageFrontRavine'));
    const paint=car.panels.map(p=>p.material as T.MeshPhysicalMaterial).find(m=>m.name==='paint_Ravine');assert.ok(paint);assert.equal(paint.color.getHex(),setup.paint);
    const anchors=classicWheelAnchors('buggy');near(-car.model.position.y,.96);
    for(let i=0;i<4;i++){
      const expected={x:(i%2?1:-1)*.85,y:.40,z:(i<2?1:-1)*1.20};assert.deepEqual(anchors.wheels[i],expected);
      near(car.wheels[i].position.x,expected.x);near(car.wheels[i].position.y,expected.y);near(car.wheels[i].position.z,expected.z);
      near(car.controller.wheelRadius(i)!, .38);near(car.controller.wheelSuspensionRestLength(i)!, .44);near(car.controller.wheelMaxSuspensionTravel(i)!, .32);
    }
    pose(car);const initial=damageShape(car);hit(car,new T.Vector3(-.85,-.56,-1.20),36);car.preStep(STEP);
    assert.ok(car.wreckParts.wheelDamage[2]>.5);assert.notDeepEqual(damageShape(car),initial);
    car.repair();assert.deepEqual(damageShape(car),initial);assert.equal(car.health,100);
    for(let i=0;i<4;i++){near(car.controller.wheelRadius(i)!, .38);near(car.controller.wheelSuspensionRestLength(i)!, .44);near(car.controller.wheelMaxSuspensionTravel(i)!, .32);}
    car.preStep(STEP);
    for(let i=0;i<4;i++)near(car.controller.wheelSuspensionRestLength(i)!, .44);
  }finally{car.dispose();world.free();}
});

test('Ravine rear impacts reduce engine torque while an equal front impact retains the air-cooled powertrain',()=>{
  const world=new R.World(zero),scene=new T.Scene(),rear=new Vehicle(0,'buggy',DEFINITIONS.buggy.color,scene,world,fx),front=new Vehicle(1,'buggy',DEFINITIONS.buggy.color,scene,world,fx);
  try{
    pose(rear);pose(front,12);hit(rear,new T.Vector3(0,0,-1.45),36);hit(front,new T.Vector3(0,0,1.45),36);
    assert.equal(rear.health,front.health);assert.ok(rear.engineDamage!>.4);assert.equal(front.engineDamage,0);
    // Compare persistent power loss after the independently tested transient restart.
    assert.ok(rear.engineStall!>0&&front.engineStall!>0);rear.engineStall=front.engineStall=0;
    const reduced=force(rear),condition=rear.engineDamage;rear.engineDamage=0;const sameWheels=force(rear);rear.engineDamage=condition;
    assert.ok(reduced<sameWheels*.8,'The engine itself reduces drive independently of damaged rear wheels');
    assert.equal(Math.abs(rear.controller.wheelEngineForce(0)!),0);assert.ok(rear.controller.wheelEngineForce(2)!>0);
    const profile=fireProfile('buggy',.25);assert.equal(profile.engineZone,'rear');assert.equal(profile.fuelZone,'front');assert.equal(profile.waterCooled,false);
    assert.ok(profile.sites.filter(s=>s.name.startsWith('engine-')).every(s=>s.z<-.9));assert.ok(profile.sites.find(s=>s.name==='front-leak')!.z>0);
    assert.ok(rear.wreckFinish.bay.value.z<-.9,'Scorch deposits originate around the rear engine');
    const thermal=new VehicleThermalState(),zones={front:0,rear:18,left:0,right:0,roof:0};
    for(let i=0;i<600;i++)thermal.advance(40,STEP,0,zones,profile.engineZone,profile.waterCooled);
    assert.equal(thermal.smoke,0,'An air-cooled buggy cannot emit radiator steam');
  }finally{rear.dispose();front.dispose();world.free();}
});

test('old garage saves survive the eleventh vehicle and mixed demos include the buggy with steady automatic viewing',()=>{
  const previous=stockSetup('marten');previous.armor=2;previous.tune.differential=.4;
  const garage=readGarage(JSON.stringify({version:1,cars:{marten:{setup:previous}}}));assert.deepEqual(garage.cars.marten.setup,previous);assert.deepEqual(garage.cars.buggy.setup,stockSetup('buggy'));
  const custom=stockSetup('buggy');custom.engine=2;custom.armor=1;custom.tune.suspension=-.4;
  assert.deepEqual(importSetup(exportSetup('buggy',custom),'buggy'),custom);assert.throws(()=>importSetup(exportSetup('buggy',custom),'marten'));
  assert.equal(CAR_KINDS.length,11);assert.equal(CAR_KINDS.at(-1),'buggy');
  for(const selected of CAR_KINDS){const first=Array.from({length:CAR_KINDS.length},(_,i)=>demoCarKind(i,selected,'mixed'));assert.equal(first[0],selected);assert.equal(new Set(first).size,11);assert.ok(first.includes('buggy'));}
  for(let i=0;i<24;i++)assert.equal(demoCarKind(i,'buggy','selected'),'buggy');assert.equal(DEFAULT_DEMO.camera,'director');
  const world=new R.World(zero),scene=new T.Scene(),car=new Vehicle(0,'buggy',custom.paint,scene,world,fx,custom),director=new DemoDirector(),camera=new T.PerspectiveCamera(52,16/9,.1,850),orbit={target:new T.Vector3(),update(){}} as any;
  try{
    pose(car,0,.9,0,0);let maximumAngle=0;
    for(let i=0;i<1440;i++){
      car.root.rotation.y=i*STEP*5;car.root.position.set(Math.sin(i*STEP*.25)*8,.9,Math.cos(i*STEP*.25)*8);car.current.copy(car.root.position);car.speed=8;car.health=100-(i%70);
      const prior=camera.quaternion.clone();director.update([car],camera,orbit,STEP,false);if(i)maximumAngle=Math.max(maximumAngle,prior.angleTo(camera.quaternion));
      assert.equal(director.activeView,'drone');assert.equal(director.followed,0);assert.ok(camera.position.toArray().every(Number.isFinite));
    }
    assert.ok(maximumAngle<Math.PI/180,`New buggy produces no impact/spin camera cuts (${maximumAngle*180/Math.PI} degrees/frame)`);
  }finally{car.dispose();world.free();}
});

test('buggy deformations and component condition survive compressed replay, repair and repeated backwards seeks',async()=>{
  const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('buggy'),car=new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup);pose(car);car.render(1);
  const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'buggy',setup}],props:0,created:'2026-10-02T18:00:00Z'});let time=0;
  car.onVisualEvent=event=>recorder.event(0,time,event);const frames:ReturnType<typeof damageShape>[]=[];
  const capture=(at:number)=>{car.wreckParts.poseAt(at,0);recorder.capture(at,()=>captureReplayFrame([car],[],[0]),true);frames.push(damageShape(car));};
  try{
    capture(0);time=.5;hit(car,new T.Vector3(0,0,-1.45),32,time);capture(1);
    time=1.5;hit(car,new T.Vector3(.25,-.1,1.5),22,time);capture(2);
    time=2.5;car.repair();capture(3);
    assert.notDeepEqual(frames[1],frames[0]);assert.notDeepEqual(frames[2].panels,frames[1].panels);assert.deepEqual(frames[3],frames[0]);
    const doc=await readReplayFile(new File([await replayFile(recorder.document())],'ravine.qir'));assert.equal(doc.meta.cars[0].kind,'buggy');
    const replay=new ReplayScene(doc,scene,world,[]);
    try{for(const at of [0,1,2,3,1,0,2,3,0]){replay.seek(at);assert.deepEqual(damageShape(replay.cars[0]),frames[at],`Replay at ${at}s`);}}
    finally{replay.dispose();}
    assert.deepEqual(damageShape(car),frames[3],'Replay seeking leaves the live vehicle untouched');
  }finally{car.dispose();world.free();}
});

test('exposed buggy linkage follows rendered wheel travel and reconstructs compressed suspension poses after backwards seeks',async()=>{
  const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('buggy'),car=new Vehicle(0,'buggy',setup.paint,scene,world,fx,setup);pose(car);
  const original=car.controller.wheelSuspensionLength.bind(car.controller);let frontLeft=.44;
  // Feed deterministic controller telemetry into the production renderer; the
  // physics fixture separately verifies real suspension contact and travel.
  car.controller.wheelSuspensionLength=i=>i===0?frontLeft:.44;
  const recorder=new ReplayRecorder({version:1,mode:'playground',reverse:false,cars:[{id:0,kind:'buggy',setup}],props:0,created:'2026-10-02T18:00:00Z'});
  const poses:ReturnType<typeof linkagePose>[]=[];
  const capture=(at:number)=>{car.render(1);recorder.capture(at,()=>captureReplayFrame([car],[],[0]),true);poses.push(linkagePose(car));};
  try{
    capture(0);assert.ok(poses[0].length>0,'Production batching must retain animated linkage meshes');
    for(const corner of ['FL','FR','RL','RR']){
      assert.ok(poses[0].some(p=>p.name.startsWith('suspension_'+corner+'_')),corner+' has exposed running gear');
      assert.ok(poses[0].some(p=>p.name==='suspension_'+corner+'_shock'),corner+' retains its animated coilover group');
    }
    frontLeft=.26;capture(1);near(car.wheels[0].position.y,.58);
    assert.notDeepEqual(poses[1].filter(p=>p.name.startsWith('suspension_FL_')),poses[0].filter(p=>p.name.startsWith('suspension_FL_')),'Bump travel moves the visible control arms and coilover');
    assert.notDeepEqual(poses[1].find(p=>p.name==='suspension_FL_shock'),poses[0].find(p=>p.name==='suspension_FL_shock'),'The coilover parent transforms with the wheel instead of leaving its internal meshes suspended at rest');
    assert.deepEqual(poses[1].filter(p=>!p.name.startsWith('suspension_FL_')),poses[0].filter(p=>!p.name.startsWith('suspension_FL_')),'Independent suspension does not move the other three corners');
    frontLeft=.60;capture(2);assert.notDeepEqual(poses[2],poses[1]);
    const doc=await readReplayFile(new File([await replayFile(recorder.document())],'ravine-suspension.qir')),replay=new ReplayScene(doc,scene,world,[]);
    try{for(const at of [0,1,2,0,2,1,0]){replay.seek(at);nearLinkage(linkagePose(replay.cars[0]),poses[at]);}}
    finally{replay.dispose();}
    car.repair();frontLeft=.44;car.render(1);nearLinkage(linkagePose(car),poses[0]);
    assert.ok(linkagePose(car).every(p=>p.matrix.every(Number.isFinite)));
  }finally{car.controller.wheelSuspensionLength=original;car.dispose();world.free();}
});

test('buggy links, coilovers and wheels keep independent materials without body-wear shader attributes',()=>{
  const world=new R.World(zero),scene=new T.Scene(),cars=[0,1].map(id=>new Vehicle(id,'buggy',DEFINITIONS.buggy.color,scene,world,fx));
  const animated=(car:Vehicle)=>{
    const meshes:T.Mesh[]=[];
    car.model.traverse(o=>{if(!(o instanceof T.Mesh))return;for(let p:T.Object3D|null=o;p;p=p.parent)if(p.name.startsWith('suspension_')||p.name.startsWith('wheel_')){meshes.push(o);break;}});
    return meshes;
  };
  const materials=(meshes:T.Mesh[])=>new Set(meshes.flatMap(o=>Array.isArray(o.material)?o.material:[o.material]));
  const compile=(material:T.Material)=>{
    const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{} as Record<string,T.IUniform>};
    material.onBeforeCompile(shader as any,{} as T.WebGLRenderer);return shader;
  };
  const bodyAttributes=['wreckPosition','transferPaint','impactWear','restPosition','impactAxis','liveryNormal'];
  const bodyTokens=/wreckPosition|transferPaint|impactWear|restPosition|impactAxis|liveryNormal|vWreckRest|vWreckWear|vImpactWear|vTransferredPaint|vCoatingRest|carCoating|carSurfacePhase|wreckSoot|wreckBay|liveryAtlas|bodyNoise|bodySilt/;
  try{
    const firstAnimated=materials(animated(cars[0])),secondAnimated=materials(animated(cars[1]));
    assert.ok(firstAnimated.size>=2,'The fixture includes different steel and coilover finishes');
    for(const m of firstAnimated)assert.equal(secondAnimated.has(m),false,'Separate cars do not share mutable animated materials');
    for(const car of cars){
      const moving=animated(car),movingMaterials=materials(moving),bodyMaterials=materials(car.panels),bodyNames=new Set([...bodyMaterials].map(m=>m.name));
      assert.ok([...movingMaterials].some(m=>bodyNames.has(m.name)),'Authored metal names overlap across body and suspension, exercising the former sharing bug');
      assert.ok(moving.some(m=>m.parent?.name==='suspension_FL_shock'&&!m.name.startsWith('suspension_')),'Unnamed-as-suspension children of a shock group are included');
      assert.ok(moving.some(m=>m.parent?.name==='wheel_FL'&&(m.material as T.Material).name==='Structure Ravine steel'),'Batched wheel brake steel is included');
      for(const mesh of moving)for(const name of bodyAttributes)assert.equal(mesh.geometry.getAttribute(name),undefined,`${mesh.name} does not supply ${name}`);
      for(const material of movingMaterials){
        assert.equal(bodyMaterials.has(material),false,material.name+' has an independent animated shader instance');
        const shader=compile(material);assert.doesNotMatch(shader.vertexShader+'\n'+shader.fragmentShader,bodyTokens,material.name+' must not read missing body-space attributes');
        assert.ok(Object.keys(shader.uniforms).every(name=>!/^wreck|^carCoating|^carSurfacePhase|^livery/.test(name)),material.name+' does not retain body wear uniforms');
        assert.doesNotMatch(material.customProgramCacheKey(),/quarry-contact-paint|quarry-layered-paint|persistent-wet-silt|wreck-scars|livery-atlas/);
      }
      const bodyPaint=car.panels.map(p=>p.material as T.Material).find(m=>m.name==='paint_Ravine');assert.ok(bodyPaint);
      const bodyShader=compile(bodyPaint);assert.match(bodyShader.vertexShader,/wreckPosition/);assert.match(bodyShader.vertexShader,/transferPaint/);assert.match(bodyShader.fragmentShader,/carCoating/);
    }
  }finally{cars.forEach(car=>car.dispose());world.free();}
});

test('candidate buggy authority survives wire transport and a cold start with matching rendered component state',()=>{
  const setup=stockOnlineSetup('buggy');setup.engine=2;setup.armor=1;
  const authority=new Simulation(R,'playground',Array(8).fill('buggy'),8,Array.from({length:8},()=>structuredClone(setup))),cold=new Simulation(R,'playground');
  const world=new R.World(zero),scene=new T.Scene();let rendered:Vehicle[]=[];
  const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}} as any,()=>rendered,cars=>rendered=cars);
  try{
    authority.phase='playing';const source=authority.cars[0],point={x:0,y:0,z:-1.45},direction={x:0,y:0,z:1};
    applyComponentImpact(source.state.components!,'buggy',point,direction,24);source.state.health=76;source.state.dents=[{id:1,localPoint:point,localDirection:direction,damage:24,repair:0}];
    const saved:Snapshot={...authority.snapshot(true),members:[],ack:{}},wire=decodeSnapshotWire(encodeSnapshotWire(saved)) as Snapshot;
    assert.deepEqual(JSON.parse(JSON.stringify(wire)),JSON.parse(JSON.stringify(saved)));
    cold.restore(wire);const restored=cold.cars[0];assert.equal(restored.kind,'buggy');assert.equal(restored.state.kind,'buggy');assert.deepEqual(restored.specification,source.specification);near(restored.body.mass(),source.body.mass(),.001);assert.deepEqual(restored.state.components,source.state.components);
    for(let i=0;i<4;i++){near(restored.controller.wheelRadius(i)!, .38);near(restored.controller.wheelSuspensionRestLength(i)!, .44);}
    // Exercise the candidate renderer directly. Public online validation still
    // negotiates only the existing deployed server's three-vehicle roster.
    view.receive(wire);assert.equal(rendered[0].kind,'buggy');assert.equal(rendered[0].engineDamage,source.state.components!.engineDamage);assert.deepEqual(Array.from(rendered[0].wreckParts.wheelDamage),source.state.components!.wheelDamage);
    const legacy=structuredClone(wire);legacy.cars.forEach(c=>delete c.components!.engineDamage);cold.restore(legacy);assert.deepEqual(cold.cars[0].state.components,source.state.components,'Complete older hit history reconstructs a rear engine after cold start');
    assert.equal(legacy.cars[0].components!.engineDamage,undefined,'Restoring does not mutate saved data');
    cold.cars.slice(1).forEach(c=>c.body.setEnabled(false));cold.setInput(0,{...NEUTRAL,throttle:1,brake:0});cold.step(new Set([0]));assert.ok(cold.cars[0].controller.wheelEngineForce(2)!>0);assert.equal(Math.abs(cold.cars[0].controller.wheelEngineForce(0)!),0);
    assert.equal(cold.recover(0),true);assert.deepEqual(cold.cars[0].state.components,freshComponents());
    const recovered:Snapshot={...cold.snapshot(true),members:[],ack:{}};view.receive(recovered);assert.equal(rendered[0].engineDamage,0);assert.equal(rendered[0].health,100);
  }finally{rendered.forEach(car=>car.dispose());world.free();authority.dispose();cold.dispose();}
});
