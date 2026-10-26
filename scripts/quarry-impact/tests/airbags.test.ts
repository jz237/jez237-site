import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {AIRBAG,airbagShape,Airbags} from '../src/airbags';
test('a bag fills in a blink, holds a moment, then sags and droops for good',()=>{
  assert.deepEqual(airbagShape(-1),{size:0,droop:0,limp:0},'packed away');assert.equal(airbagShape(NaN).size,0);
  const half=airbagShape(AIRBAG.fill/2);assert.ok(half.size>.5&&half.size<1,'filling fast');
  assert.deepEqual(airbagShape(AIRBAG.fill+AIRBAG.hold/2),{size:1,droop:0,limp:0},'full');
  const sagging=airbagShape(AIRBAG.fill+AIRBAG.hold+AIRBAG.sag/2);assert.ok(sagging.droop>0&&sagging.droop<1);
  assert.deepEqual(airbagShape(99),{size:1,droop:1,limp:1},'hanging limp');
});
// A cabin: side walls 0.7 m out, the dash 0.5 m ahead, both seen from inside; the driver's helmet on the right (−x).
const cabin=()=>{const root=new T.Group(),walls:T.Mesh[]=[],wall=(w:number,h:number,x:number,z:number,turn:number)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({side:T.DoubleSide}));m.position.set(x,.8,z);m.rotation.y=turn;m.layers.mask=0;root.add(m);walls.push(m);};
  wall(3,1.5,.7,0,Math.PI/2);wall(3,1.5,-.7,0,Math.PI/2);wall(1.4,1.5,0,.5,0);
  const driver=new T.Group();driver.name='driver';driver.position.set(-.4,1,-.1);root.add(driver);root.position.set(4,0,-2);root.rotation.y=.8;return {root,driver,walls};};
test('the bags fit the cabin: on their own sides, inside the walls, against the dash, hidden until they fire',()=>{
  const {root,driver,walls}=cabin(),bags=new Airbags(root,driver,walls),[d,p]=bags.bags;
  assert.ok(bags.bags.length===2&&bags.bags.every(b=>!b.mesh.visible&&b.mesh.parent===root),'two, packed away');
  assert.ok(Math.abs(d.at.x-(-.38))<1e-6&&Math.abs(d.at.y-(1+AIRBAG.driver.drop))<1e-6&&Math.abs(d.at.z-.26)<1e-6,"the driver's at the wheel, clear of the door");
  assert.ok(Math.abs(p.at.x-.26)<1e-6&&Math.abs(p.at.z-.18)<1e-6,"the passenger's across the car, against the dash");
  const open=new Airbags(new T.Group().add(new T.Group()),Object.assign(new T.Group(),{name:'driver'}));const [od,op]=open.bags;
  assert.ok(Math.abs(od.at.z-AIRBAG.driver.reach)<1e-6&&Math.abs(op.at.z-AIRBAG.passenger.reach)<1e-6,'nothing to go by: their reach');
});
test('they fire once, fill, sag, and a mended car has them packed away again',()=>{
  const {root,driver,walls}=cabin(),bags=new Airbags(root,driver,walls);
  assert.equal(bags.deploy(),true);assert.equal(bags.deploy(),false,'once');
  bags.update(.1);assert.ok(bags.bags.every(b=>b.mesh.visible&&Math.abs(b.mesh.scale.x-b.size[0])<1e-6),'full');
  bags.update(2);assert.ok(bags.bags.every(b=>b.mesh.scale.y<b.size[1]&&b.mesh.position.y<b.at.y),'sagged and drooped');
  assert.equal(bags.points([]).length,2);bags.reset();assert.ok(!bags.deployed&&bags.bags.every(b=>!b.mesh.visible));
  bags.dispose();assert.ok(!root.children.some(o=>o.name==='airbag'));
});
test('main fits them to modern offline cars and fires them when the front is crushed',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&driver&&!isClassicKind(type))airbags.set(car,new Airbags(car.root,driver,[...car.panels,...car.glass]));"),'modern cars only');
  assert.ok(main.includes("const bags=airbags.get(c);if(bags&&(c.structuralDamage?.[0]??0)>=AIRBAG.front&&bags.deploy()){airbagsFired++;"),'by the front crush');
  assert.ok(main.includes('if(bags?.deployed&&(c.structuralDamage?.[0]??0)<AIRBAG.front/4)bags.reset();'),'repacked on repair');
  assert.ok(main.includes('towStraps.get(c)?.dispose();towStraps.delete(c);airbags.get(c)?.dispose();airbags.delete(c);'),'cleared between events');
});
