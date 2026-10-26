import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {FLAP,swingFlap,flapTears,mudFlap,MudFlaps,type FlapSwing} from '../src/mud-flaps';
const still=():FlapSwing=>({pitch:0,pitchV:0,roll:0,rollV:0});
const settle=(s:FlapSwing,accel:{x:number;z:number},velocity:{x:number;z:number},seconds=3)=>{for(let i=0;i<seconds*60;i++)swingFlap(s,accel,velocity,1/60);return s;};
test('the air streams a flap back off its tyre; braking and turning swing it; never into the tread',()=>{
  assert.ok(Math.abs(settle(still(),{x:0,z:0},{x:0,z:0}).pitch)<1e-6,'hanging straight at rest');
  const fast=settle(still(),{x:0,z:0},{x:0,z:20});assert.ok(Math.abs(fast.pitch-Math.atan2(FLAP.air*400,9.81))<.02,'back at the drag angle');
  const braking=still();for(let i=0;i<20;i++)swingFlap(braking,{x:0,z:-12},{x:0,z:0},1/60);assert.equal(braking.pitch,-FLAP.tuck,'never forward into the tyre');
  const reverse=settle(still(),{x:0,z:0},{x:0,z:-15});assert.equal(reverse.pitch,-FLAP.tuck,'backing up presses it to the tyre');
  assert.ok(settle(still(),{x:-6,z:0},{x:0,z:0}).roll>.3,'cornering swings it out');
  const wild=settle(still(),{x:1e9,z:-1e9},{x:NaN,z:1e9},1);assert.ok(Number.isFinite(wild.pitch)&&wild.pitch<=FLAP.max&&Math.abs(wild.roll)<=FLAP.roll);
});
test('a wrecked or lost wheel tears its flap away',()=>{
  assert.equal(flapTears(FLAP.tear,false),false);assert.equal(flapTears(FLAP.tear+.01,false),true);assert.equal(flapTears(0,true),true);assert.equal(flapTears(NaN,false),false);
});
test('a flap hangs from its top edge, the tyre\'s width across, with a stripe along its foot',()=>{
  const f=mudFlap(.3,.4,0xd8241c),box=new T.Box3().setFromObject(f);assert.ok(['mud_flap_swing','mud_flap_sheet','mud_flap_stripe'].every(n=>!!f.getObjectByName(n)));
  assert.ok(Math.abs(box.max.y)<.01&&Math.abs(box.min.y+.4)<.01&&Math.abs(box.max.x-box.min.x-.3)<.01,'hanging its height, its width across');
});
// Four wheels: hubs 0.37 m up at ±0.8 across and ±1.3 along, tyres 0.22 wide.
const car=()=>{const root=new T.Group(),wheels=[[.8,1.3],[-.8,1.3],[.8,-1.3],[-.8,-1.3]].map(([x,z])=>{const w=new T.Group();w.position.set(x,.37,z);
  w.add(new T.Mesh(new T.CylinderGeometry(.37,.37,.22,16).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name:'Tire'})));root.add(w);return w;});root.position.set(3,0,-2);root.rotation.y=.4;return {root,wheels};};
test('a flap behind each wheel, swinging with the car, torn off a wrecked wheel and back on a mended one',()=>{
  const {root,wheels}=car(),torn:T.Mesh[]=[],flaps=new MudFlaps(root,wheels,.37,1,s=>torn.push(s));
  assert.equal(flaps.flaps.length,4);const f=flaps.flaps[2];
  assert.ok(Math.abs(f.group.position.z-(-1.3-.37-FLAP.gap))<1e-6&&Math.abs(f.group.position.y-(.37+.37*FLAP.top))<1e-6,'behind the tread, from over the hub');
  const box=new T.Box3().setFromObject(f.group).applyMatrix4(root.matrixWorld.clone().invert());assert.ok(Math.abs(box.min.y-FLAP.clear)<.01,'down to just off the ground');
  const forward=new T.Vector3(0,0,1).applyQuaternion(root.quaternion),damage=[0,0,0,0],lost=[false,false,false,false];
  for(let i=0;i<120;i++)flaps.update(forward.clone().multiplyScalar(18),damage,lost,1/60);assert.ok(flaps.swings.every(s=>s>.3)&&Math.abs(f.swing.rotation.x-f.state.pitch)<1e-9,'trailing back at speed');
  damage[2]=.8;flaps.update(forward.clone().multiplyScalar(18),damage,lost,1/60);assert.ok(flaps.torn===1&&torn.length===1&&!f.group.visible,'torn off the wrecked wheel');
  lost[3]=true;flaps.update(new T.Vector3(),damage,lost,1/60);assert.equal(flaps.torn,2,'gone with a lost wheel');
  damage[2]=0;flaps.update(new T.Vector3(),damage,lost,1/60);assert.ok(f.group.visible&&!f.torn,'back on when mended');
  flaps.dispose();assert.ok(!root.children.some(o=>o.name==='mud_flap'));
});
test('main hangs flaps on offline cars with arches and swings them every frame of play',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&type!=='buggy')mudFlaps.set(car,new MudFlaps(car.root,car.wheels,vehicleWheelRadius(type),car.id,sheet=>fx.detach(sheet,car.velocity.clone().multiplyScalar(.6))));"),'offline, not the buggy');
  assert.ok(main.includes('mudFlaps.get(c)?.update(c.velocity,c.wreckParts.wheelDamage,c.wreckParts.wheelLost,dt);')&&main.includes('mudFlaps.get(c)?.dispose();mudFlaps.delete(c);'),'swung, cleared');
});
test('a flap catches the stones its tyre throws: they drop behind it and kick it back',()=>{
  const {root,wheels}=car(),flaps=new MudFlaps(root,wheels,.37,1,()=>{}),f=flaps.flaps[2];
  assert.equal(flaps.catchStone(2),true);assert.ok(f.state.pitchV===FLAP.kick&&flaps.caught===1,'kicked back');
  flaps.update(new T.Vector3(),[0,0,.9,0],[false,false,false,false],1/60);assert.equal(flaps.catchStone(2),false,'a torn flap catches nothing');assert.equal(flaps.catchStone(7),false);
  assert.ok(FLAP.catch>0&&FLAP.catch<1&&FLAP.drop<.5,'most caught, the rest fly');
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.includes('caught=Math.random()<FLAP.catch&&!!mudFlaps.get(c)?.catchStone(i)')&&main.includes('c.wheelSpins[i]*(caught?FLAP.drop:1)'),'in the roost');
});
