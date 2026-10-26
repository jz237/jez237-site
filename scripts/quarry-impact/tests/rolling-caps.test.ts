import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {ROLL,CAP,capHeight,rollStep,RollingCaps,fitHubcaps} from '../src/rolling-caps';
// A hubcap: a thin disc 0.2 m across the axle `axle` (a world direction), at `at`.
const capOn=(axle:T.Vector3,at:T.Vector3)=>{const m=new T.Mesh(new T.CylinderGeometry(.2,.2,.02,24),new T.MeshStandardMaterial());m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axle.clone().normalize());m.position.copy(at);new T.Group().add(m);m.updateMatrixWorld(true);return m;};
test('a coin stands its radius up and lies its half thickness down',()=>{
  assert.equal(capHeight(.2,.02,0),.2);assert.ok(Math.abs(capHeight(.2,.02,Math.PI/2)-.01)<1e-9);assert.ok(capHeight(.2,.02,.5)<.2&&capHeight(.2,.02,.5)>.01);
});
test('rolling, it slows, leans over more the slower it goes, and curves round to its lean',()=>{
  const c={speed:6,lean:0,yaw:0,spin:0};rollStep(c,.2,.05);assert.ok(Math.abs(c.speed-(6-ROLL.drag*.05))<1e-9&&c.lean===0&&c.yaw===0&&c.spin>0,'upright and straight while fast');
  const slow={speed:1,lean:0,yaw:0,spin:0};for(let i=0;i<20;i++)rollStep(slow,.2,1/60);assert.ok(slow.lean>.1&&slow.yaw>0,'leans and turns');
  const done={speed:.01,lean:.5,yaw:0,spin:0};rollStep(done,.2,1);assert.equal(done.speed,0,'never backwards');
  const stuck={speed:2,lean:.3,yaw:0,spin:0};rollStep(stuck,.2,NaN);assert.deepEqual(stuck,{speed:2,lean:.3,yaw:0,spin:0},'no time, no change');
});
test('a knocked-off cap flies, lands on its rim, rolls away, wobbles down flat and lies there, clanking',()=>{
  const scene=new T.Scene(),clanks:number[]=[],caps=new RollingCaps(scene,()=>0,(_,loud)=>clanks.push(loud));
  const source=capOn(new T.Vector3(1,0,0),new T.Vector3(.9,.35,1.3)),cap=caps.launch(source,new T.Vector3(1,0,0),new T.Vector3(3,1.5,6));
  assert.ok(!source.visible&&scene.children.includes(cap.mesh)&&cap.mesh.name==='rolling_hubcap','off the wheel, into the world');
  assert.ok(Math.abs(cap.radius-.2)<.005&&Math.abs(cap.thickness-.02)<.003&&cap.p.distanceTo(new T.Vector3(.9,.35,1.3))<1e-6,'measured as a coin where it was');
  const seen=new Set<string>();for(let i=0;i<60*12;i++){caps.step(1/60);seen.add(cap.phase);}
  assert.deepEqual([...seen],['flying','rolling','settling','flat'],'every phase in turn');
  assert.ok(Math.abs(cap.p.y-.01)<1e-6&&Math.abs(cap.lean-Math.PI/2)<1e-9,'lying flat on the floor');
  assert.ok(Math.hypot(cap.p.x-.9,cap.p.z-1.3)>3,'it got somewhere');assert.ok(clanks.length===2&&clanks[0]>0,'a clank landing and one lying down');
  const at=cap.p.clone();for(let i=0;i<60;i++)caps.step(1/60);assert.ok(cap.p.equals(at),'and it stays there');assert.equal(caps.moving,0);
});
test('a wall in the way stops it dead; the oldest go; a new event clears them',()=>{
  const caps=new RollingCaps(new T.Scene(),(x)=>x>2?1:0),cap=caps.launch(capOn(new T.Vector3(0,0,1),new T.Vector3(0,.3,0)),new T.Vector3(0,0,1),new T.Vector3(5,0,0));
  for(let i=0;i<60*6;i++)caps.step(1/60);assert.ok(cap.p.x<2.1&&cap.phase==='flat','stopped short of the wall, then fell');
  for(let i=0;i<ROLL.max+3;i++)caps.launch(capOn(new T.Vector3(1,0,0),new T.Vector3(0,.3,0)),new T.Vector3(1,0,0),new T.Vector3(0,2,0));
  assert.equal(caps.caps.length,ROLL.max);assert.equal(caps.rolled,ROLL.max+4);caps.reset();assert.equal(caps.caps.length,0);
});
// A wheel on a classic tyre: tyre and rim cylinders about the wheel's x axis.
const wheel=(x:number,tyre='Classic Tire',extra?:string)=>{const w=new T.Group();w.name='wheel';w.position.set(x,.33,1.3);
  const along=(r:number,h:number,name:string)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,h,24).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name}));m.name='detail_'+name;w.add(m);return m;};
  along(.33,.22,tyre);along(.2,.18,'Rim');if(extra)along(.12,.03,extra);return w;};
test('classic wheels without a cap get a chrome dish on the outer face; others are left alone',()=>{
  const root=new T.Group(),left=wheel(.8),right=wheel(-.8),modern=wheel(.8,'Tireside'),capped=wheel(-.8,'Classic Tire','Rook Brushed Chrome');root.add(left,right,modern,capped);root.position.set(5,0,2);root.rotation.y=.6;
  assert.equal(fitHubcaps(root,[left,right,modern,capped,undefined]),2,'only the two plain classic wheels');
  const cap=(w:T.Object3D)=>w.getObjectByName('hubcap_fitted') as T.Mesh|undefined;
  assert.ok(cap(left)&&cap(right)&&!cap(modern)&&!cap(capped),'fitted where it should be');
  assert.ok(cap(left)!.position.x>0&&cap(right)!.position.x<0,'on the outer face of each');
  cap(left)!.geometry.computeBoundingBox();const size=cap(left)!.geometry.boundingBox!.getSize(new T.Vector3());
  assert.ok(Math.abs(size.y/2-.2*CAP.size)<.005&&size.x<CAP.dome+.001,"the rim's size, a shallow dome");
  assert.ok(/hub ?cap/i.test(cap(left)!.name),'named so a knock pops it');
});
test('the vehicle rolls a popped cap where it can, and main fits caps and rolls them offline',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.fx.rollCap)this.fx.rollCap(o,new T.Vector3(1,0,0).transformDirection(w.matrixWorld),fling);else this.fx.detach(o,fling);'),'rolled, else debris');
  assert.ok(main.includes('fx.rollCap = (cap, axle, velocity) => rollingCaps.launch(cap, axle, velocity);')&&main.includes('if(car.extendedDamage)fitHubcaps(car.root,car.wheels);'),'offline');
  assert.ok(main.includes('puddleSplashes?.reset();gravelRoost.reset();rollingCaps.reset();')&&main.includes("rollingCaps.step(state==='paused'||state==='inspect'?0:dt);"),'stepped, cleared between events');
});
