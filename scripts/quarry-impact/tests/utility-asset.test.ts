import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import * as T from 'three';
import {buildUtilityAsset} from '../src/utility-asset';import{buildMuscleAsset}from'../src/muscle-asset';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import{prepareWreckGeometry,dentGeometry,repairWreckGeometry}from'../src/wreck-geometry';import{WreckAttachments}from'../src/wreck-attachments';
const obj=readFileSync(new URL('../public/models/brightretro-muscle/FireGTO.obj',import.meta.url),'utf8');

test('utility conversion preserves the front cabin while extending the rear axle and keeping round tires',()=>{
 const car=buildUtilityAsset(obj),original=buildMuscleAsset(obj);const front=car.getObjectByName('wheel_FL')!,rear=car.getObjectByName('wheel_RL')!;
 assert.ok(Math.abs(front.position.z+rear.position.z)<1e-6);assert.ok(Math.abs(front.position.z-rear.position.z-3.05)<1e-6);
 for(const name of ['FL','FR','RL','RR']){const wheel=car.getObjectByName('wheel_'+name)!,box=new T.Box3().setFromObject(wheel);assert.ok(Math.abs((box.max.y-box.min.y)/2-.375)<1e-5);assert.ok(Math.abs(Math.abs(wheel.position.x)-.79)<1e-5);}
 // The forward body is translated to the new axle midpoint, not stretched.
 const source=original.children.find(o=>o.name.startsWith('glass_Windshield'))as T.Mesh,converted=car.children.find(o=>o.name.startsWith('glass_Windshield'))as T.Mesh;
 assert.ok(new T.Box3().setFromObject(source).getSize(new T.Vector3()).distanceTo(new T.Box3().setFromObject(converted).getSize(new T.Vector3()))<1e-5);
 let vertices=0;car.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;for(const name of ['position','normal','uv'])assert.ok(Array.from(o.geometry.attributes[name].array).every(Number.isFinite));});assert.ok(vertices<80000);
});

test('cargo bed is open above its floor and wheelhouses stay inside the body',()=>{
 const car=buildUtilityAsset(obj);car.updateMatrixWorld(true);
 for(const x of [-.3,0,.3])for(const z of [-1.15,-1.75,-2.4]){const hit=new T.Raycaster(new T.Vector3(x,3,z),new T.Vector3(0,-1,0)).intersectObject(car,true)[0];assert.ok(hit);assert.match(hit.object.name,/^panel_BedFloor/);assert.ok(hit.point.y>.62&&hit.point.y<.66);}
 for(const side of [-1,1]){const bounds=new T.Box3().setFromObject(car.getObjectByName('panel_BedWheelhouse'+side)!);assert.ok(bounds.min.x>=-.756&&bounds.max.x<=.756,'Cargo wheelhouses must not cover the outer tires');assert.ok(bounds.max.y>.79&&bounds.max.y<.81);}
});

test('rear lamps and cab glazing remain visible after conversion',()=>{
 const car=buildUtilityAsset(obj);car.updateMatrixWorld(true);
 for(const side of [-1,1]){const hit=new T.Raycaster(new T.Vector3(side*.775,.815,-4),new T.Vector3(0,0,1)).intersectObject(car,true)[0];assert.ok(hit);assert.match(hit.object.name,/^panel_TailLampLens/);}
 const glass=new T.Raycaster(new T.Vector3(0,1.24,-2),new T.Vector3(0,0,1)).intersectObject(car,true)[0];assert.ok(glass);assert.equal(glass.object.name,'glass_Rear');
});

test('cargo sides dent and repair; hood and both complete doors retain their damage assemblies',()=>{
 const car=buildUtilityAsset(obj);prepareWreckGeometry(car);const attachments=new WreckAttachments(car,['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!),.914);
 for(const name of ['hood','door-left','door-right']){const group=attachments.assemblies.find(a=>a.name===name)!;assert.ok(group);assert.ok(group.members.some(p=>p.mesh.name.endsWith('InnerShell')));}
 const side=car.getObjectByName('panel_BedInnerSide-1')as T.Mesh,before=Array.from(side.geometry.attributes.position.array),contact=new T.Vector3(-.70,.82,-1.9);
 assert.ok(dentGeometry(side,contact,new T.Vector3(1,0,0),30)>0);assert.notDeepEqual(Array.from(side.geometry.attributes.position.array),before);repairWreckGeometry(side);assert.deepEqual(Array.from(side.geometry.attributes.position.array),before);
 const door=attachments.assemblies.find(a=>a.name==='door-left')!;attachments.hit(door.bounds.getCenter(new T.Vector3()),new T.Vector3(1,0,0),65);assert.ok(door.loose>0);attachments.reset();for(const p of door.members)assert.ok(p.mesh.matrix.equals(p.matrix));
});

test('embedded utility export retains body shape, wheel locations and cargo features',async()=>{
 const source=buildUtilityAsset(obj),loaded=(await loadCarWithoutImages('utility-candidate')).scene;const a=new T.Box3().setFromObject(source),b=new T.Box3().setFromObject(loaded);assert.ok(a.min.distanceTo(b.min)<1e-5&&a.max.distanceTo(b.max)<1e-5);
 for(const name of ['wheel_FL','wheel_FR','wheel_RL','wheel_RR','panel_BedFloor','panel_CabRearUpper','glass_Rear','panel_hoodInnerShell','panel_BodyDoorLInnerShell','panel_TailLampLens-1']){const original=source.getObjectByName(name)!,copy=loaded.getObjectByName(name)!;assert.ok(copy,name);assert.ok(original.position.distanceTo(copy.position)<1e-6);}
});


test('longer cargo body preserves rear wheel-arch shape and closes the raked cabin sides',()=>{
 const car=buildUtilityAsset(obj),donor=buildMuscleAsset(obj);
 car.updateMatrixWorld(true);donor.updateMatrixWorld(true);
 const shift=car.getObjectByName('wheel_RL')!.position.z-donor.getObjectByName('wheel_RL')!.position.z;
 const points:T.Vector3[]=[];
 car.traverse(o=>{if(!(o instanceof T.Mesh)||!(o.material as T.Material).name.startsWith('paint'))return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++)points.push(o.localToWorld(new T.Vector3().fromBufferAttribute(a,i)));});
 let checked=0;
 donor.traverse(o=>{if(!(o instanceof T.Mesh)||!(o.material as T.Material).name.startsWith('paint'))return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){
  const p=o.localToWorld(new T.Vector3().fromBufferAttribute(a,i));
  if(Math.abs(p.x)<.80||p.y<.30||p.y>1||p.z< -1.80||p.z> -1.0)continue;
  p.z+=shift;assert.ok(points.some(q=>q.distanceToSquared(p)<1e-10),'Rear wheel opening must translate without stretching');checked++;
 }});
 assert.ok(checked>30,'Test must sample the actual rear outer quarter');
 const centerShift=car.getObjectByName('wheel_FL')!.position.z-donor.getObjectByName('wheel_FL')!.position.z;
 for(const side of [-1,1])for(const y of [1.05,1.20,1.40]){
  const rearZ=-.91+(y-1.01)*.20;
  const ray=new T.Raycaster(new T.Vector3(side*2,y,(rearZ-.82)/2+centerShift),new T.Vector3(-side,0,0));
  const hit=ray.intersectObject(car,true)[0];assert.ok(hit);assert.match(hit.object.name,/^panel_CabRearReturn/);
 }
});
