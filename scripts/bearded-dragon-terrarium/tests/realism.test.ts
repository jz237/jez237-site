import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {footTransfer} from '../lib/FootTransfer';
import {touchesPrey} from '../lib/PreyContact';
import {DragonNeeds} from '../lib/DragonNeeds';
import {LizardRig} from '../lib/LizardRig';
import {model,Audit} from './locomotion-fixture';

test('foot transfers start exactly at support and approach contact with zero velocity',()=>{
 const from=new THREE.Vector3(0,0,0),to=new THREE.Vector3(.045,.025,0);
 for(const [top,settling] of [[.025,false],[.04,false],[.025,true]] as const){
  assert.ok(footTransfer(from,to,top,0,.01,settling).distanceTo(from)<1e-12);
  assert.ok(footTransfer(from,to,top,1,.01,settling).distanceTo(to)<1e-12);
  assert.ok(footTransfer(from,to,top,.000001,.01,settling).distanceTo(from)/.000001<.0001);
  assert.ok(footTransfer(from,to,top,.999999,.01,settling).distanceTo(to)/.000001<.0001);
 }
});

test('delayed steps lift from their anchor and natural-speed walks retain measured support timing',()=>{
 for(const speed of [.06,.12,.24]){
  const rig=new LizardRig(model(),{heightAt:()=>0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0)}) as any;
  Object.assign(rig.inputs,{x:-.4,clearance:1.15,chestLift:.15});rig.reset();
  const audit=new Audit(),air=[0,0,0,0];let distance=0;
  for(let i=0;i<150;i++){
   const before=rig.legs.map((l:any)=>({swing:l.swing,foot:rig.footPosition(l)})),x=rig.inputs.x;
   rig.inputs.x+=speed/60;rig.inputs.speed=speed;rig.update(1/60);
   distance+=rig.inputs.x-x;audit.sample(rig);
   rig.legs.forEach((l:any,k:number)=>{
    if(l.swing)air[k]++;
    if(!before[k].swing&&l.swing)assert.ok(rig.footPosition(l).distanceTo(before[k].foot)<1e-9,'lift-off never skips into the arc');
   });
  }
  assert.ok(distance/2.5>speed*.9,'the real gait supports the requested everyday/pursuit speed');
  assert.ok(audit.maxSlide<.0001&&audit.maxLimbError<.00015);
  const fore=1-(air[0]+air[1])/300,hind=1-(air[2]+air[3])/300;
  assert.ok(fore>.55&&fore<.85&&hind>fore+.04&&hind<.9,'hind feet carry longer support than forefeet');
 }
});

test('feeding needs swept physical contact and cannot capture through a wall',()=>{
 const a=new THREE.Vector3(),b=new THREE.Vector3(.03,0,0);
 assert.ok(touchesPrey(new THREE.Vector3(.015,.005,0),a,b,.01));
 assert.equal(touchesPrey(new THREE.Vector3(.015,.035,0),a,b,.018),false,'no old four-centimetre capture halo');
 const wall={projectPoint:(_p:THREE.Vector3,q:THREE.Vector3)=>{q.z+=.005;return true;}};
 assert.equal(touchesPrey(new THREE.Vector3(.015,.005,0),a,b,.01,wall),false);
});

test('feeding, drinking and rest change bounded drives without frame-rate dependence',()=>{
 const a=new DragonNeeds(),b=new DragonNeeds();
 for(let i=0;i<60;i++)a.update(1/60,.01,false);
 for(let i=0;i<30;i++)b.update(1/30,.02,false);
 assert.ok(Math.abs(a.fatigue-b.fatigue)<1e-12&&Math.abs(a.thirst-b.thirst)<1e-12);
 a.eat(1);assert.equal(a.wantsPrey,false);
 a.drink(1);assert.equal(a.thirst,0);
 a.update(180,0,true);assert.equal(a.fatigue,0);
});

test('a gaze target crossing behind the neck cannot flip the head from side to side',()=>{
 const r=new LizardRig(model(),{heightAt:()=>0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0)}) as any;
 Object.assign(r.inputs,{tracking:true,clearance:1,chestLift:.15});r.reset();
 for(let i=0;i<120;i++)r.update(1/60);
 let previous=r.snout.clone(),jump=0;
 for(let i=0;i<240;i++){
  r.inputs.look=new THREE.Vector3(.07,.015,.0005*Math.sin(i));r.update(1/60);
  jump=Math.max(jump,r.snout.distanceTo(previous));previous.copy(r.snout);
 }
 assert.ok(jump<.008,`the head remains continuous as a nearby target changes side: ${jump}`);
});
