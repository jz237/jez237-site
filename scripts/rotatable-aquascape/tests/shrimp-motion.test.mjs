import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createShrimpMotion,advanceShrimpMotion,shrimpAbdomen,shrimpCenters,shrimpJoints,swimmeretStroke} from '../lib/ShrimpMotion.ts';

test('shrimp shell segments hinge at connected joints and retain their shape',()=>{
 const s=createShrimpMotion(2),frames=Array.from({length:6},()=>new T.Matrix4());let travel=0;const tip=new T.Vector3(-.4,.1,0),rest=tip.clone();let minY=1;
 for(let i=0;i<2400;i++){
  const t=i/60,flight=t%20<9?(t%20)/9:null;advanceShrimpMotion(s,1/60,flight,flight===null?.025:.15,Math.sin(t));shrimpAbdomen(s,frames);
  for(let k=0;k<6;k++){assert.ok(Math.abs(frames[k].determinant()-1)<1e-8,'shell must not squash');const before=shrimpJoints[k].clone().applyMatrix4(k?frames[k-1]:new T.Matrix4()),after=shrimpJoints[k].clone().applyMatrix4(frames[k]);assert.ok(before.distanceTo(after)<1e-8,'adjacent segments share a pivot');}
  const end=tip.clone().applyMatrix4(frames[5]);travel=Math.max(travel,end.distanceTo(rest));minY=Math.min(minY,end.y);assert.ok(end.distanceTo(rest)<.085,'flex stays inside the existing contact clearance envelope');
 }
 assert.ok(travel>.035,'abdomen and tail must visibly change posture');assert.ok(minY>.015,'tail does not tuck through its supporting leaf');
});
test('swimmeret phase remains continuous through takeoff and landing and freezes on pause',()=>{
 const s=createShrimpMotion(0);let previous=s.cycle;
 for(let i=0;i<900;i++){advanceShrimpMotion(s,1/60,i>200&&i<650?(i-200)/450:null,i>200&&i<650?.15:.02,0);assert.ok(s.cycle>=previous&&s.cycle-previous<.4);previous=s.cycle;}
 const frozen=structuredClone(s);advanceShrimpMotion(s,0,0,.15,1);assert.deepEqual(s,frozen);
 s.swimming=1;const strokes=Array.from({length:5},(_,k)=>swimmeretStroke(s,k));for(let k=1;k<5;k++){let difference=0;for(let phase=0;phase<6.3;phase+=.2){s.cycle=phase;difference=Math.max(difference,Math.abs(swimmeretStroke(s,k).angle-swimmeretStroke(s,k-1).angle));}assert.ok(difference>.4,'adjacent pairs have staggered strokes');}assert.ok(strokes.every(p=>p.spread>=.38&&p.spread<=1&&p.fold>=0&&p.fold<=.5));
});
test('grazing shrimp make independent gentle posture adjustments',()=>{
 const a=createShrimpMotion(0),b=createShrimpMotion(3),frames=Array.from({length:6},()=>new T.Matrix4()),ys=[];let difference=0;
 for(let i=0;i<2400;i++){advanceShrimpMotion(a,1/60,null,0,0);advanceShrimpMotion(b,1/60,null,0,0);difference=Math.max(difference,Math.abs(a.curl-b.curl));shrimpAbdomen(a,frames);ys.push(shrimpCenters[5].clone().applyMatrix4(frames[5]).y);}
 assert.ok(Math.max(...ys)-Math.min(...ys)>.012,'a perched abdomen should not remain rigid');assert.ok(difference>.07,'animals do not share one posture loop');
});
