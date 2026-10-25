import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {STRAP,swingStrap,strapTears,towStrap,TowStraps,type StrapSwing} from '../src/tow-straps';
const still=():StrapSwing=>({pitch:0,pitchV:0,roll:0,rollV:0});
const settle=(s:StrapSwing,accel:{x:number;z:number},velocity:{x:number;z:number},end:number,seconds=3)=>{for(let i=0;i<seconds*60;i++)swingStrap(s,accel,velocity,end,1/60);return s;};
test('the oncoming air streams the rear strap out behind and lays the front one against its bumper',()=>{
  const rear=settle(still(),{x:0,z:0},{x:0,z:25},-1),front=settle(still(),{x:0,z:0},{x:0,z:25},1);
  assert.ok(Math.abs(rear.pitch-Math.atan2(STRAP.air*625,9.81))<.02,'rear out at the drag angle');assert.equal(front.pitch,-STRAP.tuck,'front tucked, never into the body');
  assert.ok(Math.abs(settle(still(),{x:0,z:0},{x:0,z:0},-1).pitch)<1e-6,'at rest it hangs straight down');
  const reverse=settle(still(),{x:0,z:0},{x:0,z:-15},1);assert.ok(reverse.pitch>.3,'backing up streams the front one out');
});
test('accelerating throws a strap back, braking forward, cornering to the side, within its limits',()=>{
  const hard=(az:number,end:number)=>{const s=still();for(let i=0;i<20;i++)swingStrap(s,{x:0,z:az},{x:0,z:0},end,1/60);return s.pitch;};
  assert.ok(hard(8,-1)>.1&&hard(8,1)<0,'accelerating: rear out, front in');assert.ok(hard(-9,1)>.1&&hard(-9,-1)<0,'braking: front out, rear in');
  const corner=settle(still(),{x:-6,z:0},{x:0,z:0},-1);assert.ok(corner.roll>.3,'a left-hand bend (accelerating toward -x) swings it to +x');
  const wild=settle(still(),{x:1e9,z:-1e9},{x:NaN,z:Infinity},1,1);assert.ok(wild.pitch<=STRAP.max&&Math.abs(wild.roll)<=STRAP.roll&&Number.isFinite(wild.pitch),'clamped and finite');
  const s=still();swingStrap(s,{x:3,z:3},{x:0,z:0},-1,NaN);assert.deepEqual(s,still(),'no time, no swing');
});
test('a strap tears away with a smashed or fallen panel',()=>{
  assert.equal(strapTears(0,true),false);assert.equal(strapTears(STRAP.tear,true),false);assert.equal(strapTears(STRAP.tear+1,true),true);
  assert.equal(strapTears(0,false),true,'gone with the panel');assert.equal(strapTears(NaN,true),false);
});
test('the strap is a webbing loop on a steel eye, its flat face across the car',()=>{
  const strap=towStrap(0xd8241c),loop=strap.getObjectByName('tow_strap_loop') as T.Mesh;
  assert.ok(strap.name==='tow_strap'&&!!strap.getObjectByName('tow_eye')&&!!strap.getObjectByName('tow_strap_swing')&&loop instanceof T.Mesh,'parts named');
  loop.geometry.computeBoundingBox();const size=loop.geometry.boundingBox!.getSize(new T.Vector3()),top=loop.geometry.boundingBox!.max.y;
  assert.ok(Math.abs(size.y-STRAP.loop)<.01&&Math.abs(size.x-STRAP.width)<.005&&size.z<STRAP.open+.01&&Math.abs(top)<.01,'hangs its length below the eye, its width across');
});
// A plain car: one box of bodywork, 4 m long, its bottom 0.15 m up, kept off every layer as the draw batches leave it.
const car=()=>{const root=new T.Group(),body=new T.Mesh(new T.BoxGeometry(1.8,.8,4),new T.MeshStandardMaterial());body.name='panel_body';body.position.y=.55;body.userData.damage=0;body.layers.mask=0;root.add(body);root.position.set(5,0,-3);root.rotation.y=.4;return {root,body};};
test('a strap hangs off each bumper, swings with the car, tears off a smashed bumper and is back when it is mended',()=>{
  const {root,body}=car(),torn:T.Mesh[]=[];const straps=new TowStraps(root,[body],2,STRAP.colours[0],loop=>torn.push(loop));
  assert.deepEqual(straps.straps.map(s=>s.end),[-1,1],'one each end');
  for(const s of straps.straps){const p=s.group.position;assert.ok(Math.abs(Math.abs(p.z)-2-STRAP.proud)<1e-3&&Math.sign(p.z)===s.end&&Math.abs(Math.abs(p.x)-STRAP.side)<1e-6&&Math.abs(p.y-(.15+STRAP.low+STRAP.lift))<1e-3,'on the bumper face, up from the lowest ray to meet it');
    assert.ok(s.group.parent===root,'carried by the car');}
  assert.ok(straps.straps[0].group.position.x<0&&straps.straps[1].group.position.x>0,'rear to the right, front to the left');
  const forward=new T.Vector3(0,0,1).applyQuaternion(root.quaternion);for(let i=0;i<120;i++)straps.update(forward.clone().multiplyScalar(20),1/60);
  const [rear,front]=straps.swings;assert.ok(rear>.5&&front<0,'streams back at speed');
  assert.ok(Math.abs(straps.straps[0].swing.rotation.x-rear)<1e-3,'drawn as it swings');
  body.userData.damage=STRAP.tear+2;straps.update(forward.clone().multiplyScalar(20),1/60);
  assert.equal(straps.torn,2);assert.equal(torn.length,2);assert.ok(straps.straps.every(s=>!s.group.visible)&&torn.every(l=>l.name==='tow_strap_loop'),'both torn off');
  body.userData.damage=0;straps.update(forward.clone().multiplyScalar(20),1/60);assert.ok(straps.straps.every(s=>s.group.visible&&!s.torn),'mended');
  body.visible=false;straps.update(new T.Vector3(),1/60);assert.equal(straps.torn,4,'a fallen-off panel takes them');
  straps.dispose();assert.equal(straps.straps.length,0);assert.ok(!root.children.some(o=>o.name==='tow_strap'),'removed');
});
test('no bodywork in reach, no strap',()=>{
  const root=new T.Group(),far=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial());far.position.set(0,.5,0);root.add(far);
  assert.equal(new TowStraps(root,[far],2,0xffffff,()=>{}).straps.length,0,'a panel well inside the car is not a bumper');
});
test('main hangs straps on offline cars and swings, tears and clears them',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage)towStraps.set(car,new TowStraps(car.root,car.panels,DEFINITIONS[type].halfLength,STRAP.colours[i%STRAP.colours.length],loop=>fx.detach(loop,car.velocity.clone().multiplyScalar(.6))));'),'offline cars');
  assert.ok(main.includes('{lampDangles.get(c)?.update(c.velocity,dt);towStraps.get(c)?.update(c.velocity,dt);}'),'swung with the lamps');
  assert.ok(main.includes('towStraps.get(c)?.dispose();towStraps.delete(c);'),'cleared between events');
});
