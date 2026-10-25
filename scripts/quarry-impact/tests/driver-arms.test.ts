import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {driverFigure} from '../src/driver-figure';
import {bailOut} from '../src/driver-bail';
import {STEER_ARMS,armLift,steerArms} from '../src/driver-arms';
const arms=(f:T.Object3D)=>f.children.filter((o):o is T.Mesh=>o instanceof T.Mesh&&o.geometry instanceof T.CylinderGeometry&&Math.abs(o.rotation.x)>.5).sort((a,b)=>a.position.x-b.position.x);
const ends=(arm:T.Mesh)=>{arm.parent!.updateMatrixWorld(true);const h=(arm.geometry as T.CylinderGeometry).parameters.height/2;return [arm.localToWorld(new T.Vector3(0,-h,0)),arm.localToWorld(new T.Vector3(0,h,0))];};
test('the hands follow the wheel: turning right lifts the left hand and drops the right, about fixed shoulders',()=>{
  assert.equal(armLift(STEER_ARMS.lock*2),STEER_ARMS.reach);assert.equal(armLift(-STEER_ARMS.lock),-STEER_ARMS.reach);assert.equal(armLift(0),0);assert.equal(armLift(NaN),0);
  const figure=driverFigure(0xd23a2a),[left,right]=arms(figure);assert.ok(left&&right&&left.position.x<0&&right.position.x>0);
  const rest=[left,right].map(a=>ends(a).map(v=>v.clone()));
  steerArms(figure,STEER_ARMS.lock);const turned=[left,right].map(ends);
  let ok=turned[0][1].y>rest[0][1].y+.05&&turned[1][1].y<rest[1][1].y-.05;
  [0,1].forEach(i=>{ok&&=turned[i][0].distanceTo(rest[i][0])<1e-6&&Math.abs(turned[i][0].distanceTo(turned[i][1])-rest[i][0].distanceTo(rest[i][1]))<1e-6;});
  assert.ok(ok,'left hand up, right hand down, shoulders still, arms whole');
  steerArms(figure,-STEER_ARMS.lock);const mirrored=[left,right].map(ends);assert.ok(mirrored[0][1].y<rest[0][1].y-.05&&mirrored[1][1].y>rest[1][1].y+.05,'and the other way turning left');
  steerArms(figure,0);let back=true;[left,right].forEach((a,i)=>{const e=ends(a);back&&=e[0].distanceTo(rest[i][0])<1e-6&&e[1].distanceTo(rest[i][1])<1e-6;});assert.ok(back,'straight ahead is the old pose');
});
test('a driver out of the car is left alone',()=>{
  const figure=driverFigure(0x2f6fd8),car=new T.Group(),scene=new T.Group();car.add(figure);scene.add(car);steerArms(figure,.3);
  bailOut(figure,car,scene,()=>0);const before=figure.children.map(o=>o.position.clone());steerArms(figure,.6);
  assert.ok(arms(figure).length===0&&figure.children.every((o,i)=>o.position.equals(before[i])),'the arms hang from shoulders now');
});
test('main moves offline drivers\' hands with their steering',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(state!=='paused')for(const c of cars){if(!c.extendedDamage)continue;const d=c.root.children.find(o=>o.name==='driver');if(!d)continue;let h=handStates.get(c);if(!h){h=newHandState(c.gear);handStates.set(c,h);}")&&main.includes('steerArms(d,c.steering,handReach(h,!!c.input?.handbrake,c.gear,dt));}'));
});
