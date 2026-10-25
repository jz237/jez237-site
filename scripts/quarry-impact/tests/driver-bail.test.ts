import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BAIL,shouldBail,bailOut,strollAway} from '../src/driver-bail';
import {driverFigure,DRIVER} from '../src/driver-figure';
test('a driver gets out once their car is burning or blown up and has all but stopped for a moment',()=>{
 assert.equal(shouldBail(true,false,1,BAIL.delay),true);assert.equal(shouldBail(false,true,0,BAIL.delay+1),true,'blown up');
 assert.equal(shouldBail(true,false,BAIL.speed+1,9),false,'not while it is still moving');assert.equal(shouldBail(true,false,0,BAIL.delay-.1),false,'not at once');
 assert.equal(shouldBail(false,false,0,9),false,'a car that is not burning keeps its driver');assert.equal(shouldBail(true,false,NaN,9),false);
});
test('the driver climbs out of their own door, walks clear and stands on the floor watching the car',()=>{
 const scene=new T.Scene(),car=new T.Group();car.position.set(5,.4,-3);car.rotation.y=.5;scene.add(car);
 const figure=driverFigure(0xd23a2a);figure.position.set(-.45,.9,.1);figure.userData.sway={frames:3};figure.userData.look=.8;figure.children[1].rotation.y=Math.PI/2+.8;car.add(figure);
 const floor=()=>.25;bailOut(figure,car,scene,floor);
 assert.ok(figure.parent===scene&&!!figure.getObjectByName('driver_legs'),'out of the car, on its own legs');assert.ok(figure.userData.sway===undefined&&figure.children[1].rotation.y===Math.PI/2,'no sway, eyes front');
 const legBottom=()=>{figure.updateMatrixWorld(true);return Math.min(...figure.getObjectByName('driver_legs')!.children.map(h=>new T.Box3().setFromObject(h).min.y));};
 assert.ok(Math.abs(legBottom()-.25)<.02,'feet on the floor');
 const door=new T.Vector3(-1,0,0).applyQuaternion(car.quaternion),start=figure.position.clone();assert.ok(start.clone().sub(car.position).setY(0).dot(door)>BAIL.door*.9,'out of the driver\'s (-x) side');
 for(let i=0;i<200;i++)strollAway(figure,1/60);const gone=figure.position.clone().sub(car.position).setY(0);
 assert.ok(Math.abs(gone.length()-BAIL.door-BAIL.walk)<.05&&gone.dot(door)>0,'walked clear');
 const facing=new T.Vector3(0,0,1).applyQuaternion(figure.quaternion);assert.ok(facing.dot(gone.clone().normalize())<-.99,'turned round to watch the car');
 assert.ok(Math.abs(legBottom()-.25)<.02&&figure.getObjectByName('driver_legs')!.children.every(h=>h.rotation.x===0),'standing still');
 const arms=figure.children.filter(o=>o instanceof T.Mesh&&(o as T.Mesh).geometry instanceof T.CylinderGeometry&&o.parent===figure);assert.ok(arms.length===2&&arms.every(a=>Math.abs(a.rotation.x)<.2),'arms hanging');
 while(BAIL.watch-figure.userData.bail.watched>2/60)strollAway(figure,1/60);assert.ok(figure.visible,'watches a while');for(let i=0;i<4;i++)strollAway(figure,1/60);assert.equal(figure.visible,false,'then gone over the barrier');
 assert.ok(DRIVER.head>0);
});
test('offline drivers bail out every frame they should, walk on, and are freed with the next event',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(shouldBail(c.onFire,c.blownUp,c.speed,t)){bailOut(d,c.root,scene,(x,z)=>fx.floorAt(x,z,c.current.y));bailed.push(d);}"));
 assert.ok(main.includes("for(const f of bailed)strollAway(f,dt);")&&main.includes("for(const f of bailed)disposeDriver(f);bailed.length=0;"));
});
