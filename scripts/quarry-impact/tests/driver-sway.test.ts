import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SWAY,newDriverSway,stepDriverSway,swayDriver,DRIVER_DUCK,duckDriver} from '../src/driver-sway';
const run=(ax:number,az:number,seconds:number,s=newDriverSway())=>{for(let t=0;t<seconds;t+=1/60)stepDriverSway(s,ax,az,1/60);return s;};
test('a steady corner leans the driver away from the turn, braking pitches them forward and power presses them into the seat',()=>{
 const steady=SWAY.gain*8/SWAY.omega**2;
 assert.ok(Math.abs(run(8,0,3).roll-steady)<.01,'0.8 g sideways settles at gain·a/ω²');assert.ok(Math.abs(run(-8,0,3).roll+steady)<.01,'mirrors the other way');
 assert.ok(Math.abs(run(0,-8,3).pitch-steady)<.01,'braking: forward');assert.equal(run(0,8,3).pitch,-SWAY.pitchBack,'hard power: stopped by the seat back');
 const still=run(0,0,2);assert.ok(still.roll===0&&still.pitch===0,'no motion, no sway');
 const s=newDriverSway();stepDriverSway(s,5,5,0);stepDriverSway(s,5,5,-1);stepDriverSway(s,5,5,NaN);assert.ok(s.roll===0&&s.pitch===0,'no time, no step');
});
test('a hard hit whips the driver within the seat limits and they settle again',()=>{
 const s=newDriverSway();stepDriverSway(s,5000,-5000,1/60);let roll=0,pitch=0;
 for(let t=0;t<.6;t+=1/60){stepDriverSway(s,0,0,1/60);roll=Math.max(roll,Math.abs(s.roll));pitch=Math.max(pitch,s.pitch);}
 assert.ok(roll>.2&&roll<=SWAY.maxRoll&&pitch>.2&&pitch<=SWAY.maxPitch,`whipped hard but held by the seat (roll ${roll.toFixed(2)}, pitch ${pitch.toFixed(2)})`);
 run(0,0,2.5,s);assert.ok(Math.abs(s.roll)<.01&&Math.abs(s.pitch)<.01,'settled');
});
test('the figure turns about its hips from the car root\'s own motion, and a teleport restarts it without a jolt',()=>{
 const car=new T.Group(),figure=new T.Group();figure.position.set(-.4,.9,.1);car.add(figure);
 const hipWorld=()=>{car.updateMatrixWorld(true);return new T.Vector3(0,-SWAY.hip,0).applyMatrix4(figure.matrixWorld).sub(car.position);};
 const rest=hipWorld();let v=0;
 for(let i=0;i<40;i++){car.position.z+=12/60;swayDriver(figure,car,1/60);}
 assert.ok(Math.abs(figure.rotation.x)<1e-6&&Math.abs(figure.rotation.z)<1e-6,'a steady 12 m/s cruise does not sway');
 for(let i=0;i<30;i++){v+=9/60;car.position.x+=v/60;car.position.z+=12/60;swayDriver(figure,car,1/60);}
 assert.ok(figure.rotation.z>.1,'sideways acceleration leans the figure');assert.ok(hipWorld().distanceTo(rest)<1e-9,'the hips stay in the seat');
 car.position.x+=40;swayDriver(figure,car,1/60);swayDriver(figure,car,1/60);const after=figure.userData.sway.rollRate;
 swayDriver(figure,car,1/60);assert.ok(Math.abs(figure.userData.sway.rollRate-after)<1,'a 40 m jump is a restart, not a hit');
 const before=figure.rotation.z;swayDriver(figure,car,0);assert.equal(figure.rotation.z,before,'no time, no change');
 for(let i=0;i<20;i++){car.position.z+=15/60;swayDriver(figure,car,1/60);}const cruising={...figure.userData.sway,velocity:figure.userData.sway.velocity.clone()};
 for(let i=0;i<30;i++)swayDriver(figure,car,1/60);assert.ok(figure.userData.sway.pitch===cruising.pitch&&figure.userData.sway.velocity.equals(cruising.velocity),'a frozen simulation holds the driver as they were');
 car.position.z+=15/60;swayDriver(figure,car,1/60);assert.ok(Math.abs(figure.userData.sway.pitchRate-cruising.pitchRate)<.05,'and resuming at the same speed is no jolt');
});
test('every car\'s driver sways each frame except while paused',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(state!=='paused')for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)swayDriver(d,c.root,dt);}"));
});
test('a crushed roof slumps the driver down and in by the clearance it took or its structural crush, never through the roof',()=>{
 const make=()=>{const car=new T.Group(),figure=new T.Group();figure.position.set(-.5,1,0);car.add(figure);car.position.set(3,0,-2);car.rotation.y=.4;
  const roof=new T.Mesh(new T.BoxGeometry(2,.04,2),new T.MeshBasicMaterial());roof.name='panel_roof';roof.position.y=1+DRIVER_DUCK.head+.12;car.add(roof);
  const trim=new T.Mesh(new T.BoxGeometry(2,.02,2),new T.MeshBasicMaterial());trim.name='panel_inner_Interior';trim.position.y=1+.05;car.add(trim);return {car,figure,roof,trim};};
 const {car,figure,roof,trim}=make();
 assert.equal(duckDriver(figure,car,[roof,trim],0),0,'the intact cabin is the reference; interior trim under the helmet is not the roof');
 roof.position.y-=.1;const drop=duckDriver(figure,car,[roof,trim],0);const room=DRIVER_DUCK.head+.12+.02-.1;assert.ok(Math.abs(drop-(DRIVER_DUCK.head+DRIVER_DUCK.margin-room))<1e-6,`the roof came down: they slump by the clearance lost (${drop})`);
 assert.ok(Math.abs(figure.position.y-(1-drop))<1e-9&&figure.position.x>-.5,'down and in, before any sway frame');
 roof.visible=false;assert.ok(Math.abs(duckDriver(figure,car,[roof,trim],.6)-DRIVER_DUCK.crush*.6)<1e-9,'roof glass gone: the structural crush still pushes them down');
 assert.equal(duckDriver(figure,car,[roof,trim],5),DRIVER_DUCK.max,'never more than a slump');assert.equal(duckDriver(figure,car,[roof,trim],NaN),0);
 roof.visible=true;roof.position.y+=.1;assert.equal(duckDriver(figure,car,[roof,trim],0),0,'repaired: back in the seat');assert.equal(figure.userData.seat.x,-.5);
 const swaying=make();swaying.figure.userData.sway={...newDriverSway(),frames:3};const at=swaying.figure.position.clone();duckDriver(swaying.figure,swaying.car,[swaying.roof],.5);
 assert.ok(swaying.figure.position.equals(at)&&swaying.figure.userData.seat.y<1,'a swaying driver moves to the new seat on the next sway step');
});
test('every driver is measured once intact, then again whenever the roof crush changes',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("for(const c of cars){const d=c.root.children.find(o=>o.name==='driver'),roof=c.structuralDamage?.[4]??0;if(d&&(d.userData.roofSeen===undefined||Math.abs(d.userData.roofSeen-roof)>.004)){d.userData.roofSeen=roof;duckDriver(d,c.root,[...c.panels,...c.glass],roof);}}"));
});
