import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {driverFigure} from '../src/driver-figure';
import {HAND,STEER_ARMS,handReach,newHandState,steerArms} from '../src/driver-arms';
const arms=(f:T.Object3D)=>f.children.filter((o):o is T.Mesh=>o instanceof T.Mesh&&o.geometry instanceof T.CylinderGeometry&&Math.abs(o.rotation.x)>.5).sort((a,b)=>a.position.x-b.position.x);
const ends=(arm:T.Mesh)=>{arm.parent!.updateMatrixWorld(true);const h=(arm.geometry as T.CylinderGeometry).parameters.height/2;return [arm.localToWorld(new T.Vector3(0,-h,0)),arm.localToWorld(new T.Vector3(0,h,0))];};
test('the right hand goes to the handbrake while it is pulled, and to the lever for a moment at each gear change',()=>{
  const s=newHandState(1);for(let i=0;i<30;i++)handReach(s,false,1,1/60);assert.equal(s.reach,0,'no change, no reach');
  for(let i=0;i<Math.ceil(60/HAND.rate)+1;i++)handReach(s,true,1,1/60);assert.equal(s.reach,1,'on the handbrake');
  for(let i=0;i<Math.ceil(60/HAND.rate)+1;i++)handReach(s,false,1,1/60);assert.equal(s.reach,0,'back on the wheel');
  handReach(s,false,2,1/60);assert.ok(s.reach>0&&s.shift>0,'a gear change sends it to the lever');
  for(let i=0;i<Math.round(HAND.shift*60)+Math.ceil(60/HAND.rate)+2;i++)handReach(s,false,2,1/60);assert.equal(s.reach,0,'and back');
  const t=newHandState(3);handReach(t,false,3,1/60);assert.equal(t.shift,0,'starting in a gear is no change');handReach(t,false,NaN,1/60);assert.equal(t.gear,3);assert.equal(handReach(t,true,3,0),0);
});
test('reaching, the right arm swings down and in about its shoulder; the left hand stays on the wheel',()=>{
  const figure=driverFigure(0xd23a2a),[left,right]=arms(figure);steerArms(figure,STEER_ARMS.lock*.5,0);
  const leftPose=ends(left).map(v=>v.clone()),rest=ends(right).map(v=>v.clone());
  steerArms(figure,STEER_ARMS.lock*.5,1);const [shoulder,hand]=ends(right),[ls,lh]=ends(left);
  assert.ok(shoulder.distanceTo(rest[0])<1e-6&&Math.abs(shoulder.distanceTo(hand)-rest[0].distanceTo(rest[1]))<1e-6,'about its shoulder, whole');
  assert.ok(hand.y<rest[1].y-.05&&hand.x<rest[1].x-.03,'down and in toward the tunnel');
  assert.ok(ls.distanceTo(leftPose[0])<1e-9&&lh.distanceTo(leftPose[1])<1e-9,'the left hand keeps steering');
  steerArms(figure,STEER_ARMS.lock*.5,0);assert.ok(ends(right)[1].distanceTo(rest[1])<1e-6,'back on the wheel where it was');
  steerArms(figure,0,NaN);assert.ok(Number.isFinite(right.rotation.x));
});
