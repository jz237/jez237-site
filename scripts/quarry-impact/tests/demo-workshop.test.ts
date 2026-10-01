import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {readDemoOptions,DEFAULT_DEMO,demoCarKind,nextDemoMode} from '../src/demo-session';import {DemoDirector} from '../src/demo-director';import {buildClassicVehicle,CLASSIC_VEHICLES} from '../src/classic-vehicles';import {verifyDemoWorkshopRevision} from './demo-workshop-invariants';
test('demo preferences are bounded, persisted and independent of solo event settings',()=>{
 assert.deepEqual(readDemoOptions('invalid'),DEFAULT_DEMO);assert.deepEqual(readDemoOptions('{}'),DEFAULT_DEMO);
 const raw={version:1,field:24,lineup:'selected',loop:'stop',camera:'trackside',laps:20,duration:30};assert.deepEqual(readDemoOptions(JSON.stringify(raw)),raw);
 const bad=readDemoOptions(JSON.stringify({...raw,field:500,laps:-10,duration:1,camera:'__proto__',lineup:'invalid',loop:'invalid'}));assert.equal(bad.field,24);assert.equal(bad.laps,1);assert.equal(bad.duration,30);assert.equal(bad.camera,'director');assert.equal(bad.lineup,'mixed');assert.equal(bad.loop,'alternate');
});
test('demo event sequencing and all-selected fields do not silently change the chosen vehicle',()=>{
 assert.equal(nextDemoMode('derby','alternate'),'race');assert.equal(nextDemoMode('race','alternate'),'derby');assert.equal(nextDemoMode('race','repeat'),'race');assert.equal(nextDemoMode('derby','stop'),null);
 for(let id=0;id<24;id++)assert.equal(demoCarKind(id,'hatch','selected'),'hatch');assert.equal(demoCarKind(0,'hatch','mixed'),'hatch');assert.equal(new Set(Array.from({length:24},(_,id)=>demoCarKind(id,'coupe','mixed'))).size,5);
});
test('automatic following chooses active cars even with a fixed camera, and manual follow remains authoritative',()=>{
 const a={id:0,root:new T.Group(),current:new T.Vector3(),speed:0,health:0,finished:false},b={id:1,root:new T.Group(),current:new T.Vector3(5,0,0),speed:15,health:100,finished:false};b.root.position.copy(b.current);
 const d=new DemoDirector(),camera=new T.PerspectiveCamera(),orbit={target:new T.Vector3(),update(){}};
 d.select('chase');d.update([a,b]as any,camera,orbit as any,1/60,false);assert.equal(d.followed,1);assert.equal(d.activeView,'chase');d.follow(0);d.update([a,b]as any,camera,orbit as any,10,false);assert.equal(d.followed,0);
});
test('classic models have distinct silhouettes, four correctly spaced wheels, cabins and individually named damage panels',()=>{
 const dimensions:number[]=[];
 for(const kind of ['muscle','wagon']as const){const d=CLASSIC_VEHICLES[kind],car=buildClassicVehicle(kind),bounds=new T.Box3().setFromObject(car),panels:T.Mesh[]=[],glass:T.Mesh[]=[];dimensions.push(bounds.max.z-bounds.min.z);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=car.getObjectByName('wheel_'+name)!;assert.ok(w);assert.equal(w.position.z,(i<2?1:-1)*d.wheelbase/2);assert.equal(w.position.x,(i%2?1:-1)*(d.halfWidth-.04));}
 car.traverse(o=>{if(o instanceof T.Mesh){if(o.name.startsWith('panel_'))panels.push(o);if(o.name.startsWith('glass_'))glass.push(o);const p=o.geometry.getAttribute('position');assert.ok(Array.from(p.array).every(Number.isFinite));}});
 assert.ok(panels.length>=30);assert.ok(glass.length>=6);assert.ok(car.getObjectByName('Structure engine block'));assert.ok(car.getObjectByName('panel_hood'));assert.ok(car.getObjectByName('panel_BodyDoorL'));
 assert.ok(bounds.max.y>1.8&&bounds.max.y<2.2);assert.ok(bounds.min.y>.1);
 for(const z of [-d.wheelbase/2,d.wheelbase/2]){const ray=new T.Raycaster(new T.Vector3(-2,.9,z),new T.Vector3(1,0,0),0,1.3);assert.equal(ray.intersectObjects(panels,false).length,0,'Wheel openings must remain clear');}
 }assert.ok(dimensions[1]-dimensions[0]>.4);
});
test('preceding demo and gameplay source is recoverable byte for byte',()=>verifyDemoWorkshopRevision());
