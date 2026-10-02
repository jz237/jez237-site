import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {readDemoOptions,DEFAULT_DEMO,demoCarKind,nextDemoMode} from '../src/demo-session';import {DemoDirector} from '../src/demo-director';import {CLASSIC_VEHICLES,classicWheelAnchors} from '../src/classic-vehicle-specs';import {loadCarWithoutImages} from '../tools/car-asset-audit';import {verifyDemoWorkshopRevision} from './demo-workshop-invariants';
test('demo preferences are bounded, persisted and independent of solo event settings',()=>{
 assert.deepEqual(readDemoOptions('invalid'),DEFAULT_DEMO);assert.deepEqual(readDemoOptions('{}'),DEFAULT_DEMO);
 const raw={version:1,field:24,lineup:'selected',loop:'stop',camera:'trackside',laps:20,duration:30};assert.deepEqual(readDemoOptions(JSON.stringify(raw)),raw);
 const bad=readDemoOptions(JSON.stringify({...raw,field:500,laps:-10,duration:1,camera:'__proto__',lineup:'invalid',loop:'invalid'}));assert.equal(bad.field,24);assert.equal(bad.laps,1);assert.equal(bad.duration,30);assert.equal(bad.camera,'director');assert.equal(bad.lineup,'mixed');assert.equal(bad.loop,'alternate');
});
test('demo event sequencing and all-selected fields do not silently change the chosen vehicle',()=>{
 assert.equal(nextDemoMode('derby','alternate'),'race');assert.equal(nextDemoMode('race','alternate'),'derby');assert.equal(nextDemoMode('race','repeat'),'race');assert.equal(nextDemoMode('derby','stop'),null);
 for(let id=0;id<24;id++)assert.equal(demoCarKind(id,'hatch','selected'),'hatch');assert.equal(demoCarKind(0,'hatch','mixed'),'hatch');assert.equal(new Set(Array.from({length:24},(_,id)=>demoCarKind(id,'coupe','mixed'))).size,9);
});
test('automatic following chooses active cars even with a fixed camera, and manual follow remains authoritative',()=>{
 const a={id:0,root:new T.Group(),current:new T.Vector3(),speed:0,health:0,finished:false},b={id:1,root:new T.Group(),current:new T.Vector3(5,0,0),speed:15,health:100,finished:false};b.root.position.copy(b.current);
 const d=new DemoDirector(),camera=new T.PerspectiveCamera(),orbit={target:new T.Vector3(),update(){}};
 d.select('chase');d.update([a,b]as any,camera,orbit as any,1/60,false);assert.equal(d.followed,1);assert.equal(d.activeView,'chase');d.follow(0);d.update([a,b]as any,camera,orbit as any,10,false);assert.equal(d.followed,0);
});
test('playable classics have distinct cabins, four aligned wheels and independently named damage panels',async()=>{
 const roofLengths:number[]=[];
 for(const kind of ['muscle','wagon']as const){
  const d=CLASSIC_VEHICLES[kind],car=(await loadCarWithoutImages(kind)).scene,panels:T.Mesh[]=[],roof=new T.Box3(),anchors=classicWheelAnchors(kind);
  for(const [i,name]of ['FL','FR','RL','RR'].entries())assert.deepEqual(car.getObjectByName('wheel_'+name)!.position.toArray(),Object.values(anchors.wheels[i]));
  let vertices=0,glazing=0;car.traverse(o=>{if(!(o instanceof T.Mesh))return;
   const p=o.geometry.getAttribute('position'),n=o.geometry.getAttribute('normal');vertices+=p.count;
   assert.equal(n.count,p.count);assert.ok(Array.from(p.array).every(Number.isFinite));assert.ok(Array.from(n.array).every(Number.isFinite));
   if(o.name.startsWith('panel_'))panels.push(o);if(o.name.startsWith('glass_'))glazing++;
   if(o.name.startsWith('panel_BodyRoof'))for(let i=0;i<p.count;i++){const point=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);if(point.y>1.3)roof.expandByPoint(point);}
  });
  assert.ok(vertices<65000,'Raw fleet geometry stays within the replacement model budget');assert.ok(panels.length>20);assert.ok(glazing>=6);
  assert.ok(car.getObjectByName('Structure_engine_block'));assert.ok(panels.some(p=>p.name.startsWith('panel_hood')));assert.ok(panels.some(p=>p.name.startsWith('panel_BodyDoorL')));
  for(const z of [-d.wheelbase/2,d.wheelbase/2])assert.equal(new T.Raycaster(new T.Vector3(-2,.55,z),new T.Vector3(1,0,0),0,1.3).intersectObjects(panels,false).length,0,'Wheel openings remain clear');
  roofLengths.push(roof.max.z-roof.min.z);
 }
 assert.ok(roofLengths[1]>roofLengths[0]+.8,'Estate has a longer cargo roof than the muscle coupe');
});
test('preceding demo and gameplay source is recoverable byte for byte',()=>verifyDemoWorkshopRevision());
