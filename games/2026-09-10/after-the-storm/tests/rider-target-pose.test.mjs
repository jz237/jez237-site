import test from 'node:test';
import assert from 'node:assert/strict';
import {riderPose} from '../rider-pose.js';
import {RIDER_TARGET_BONES,prepareRiderTargetPose} from '../rider-target-pose.js';

test('explicit full anatomy is copied without animation, IK or aliases between shared joints',()=>{
 const source=riderPose('',0,0,{steering:.37}),before=structuredClone(source),p=prepareRiderTargetPose(source);
 assert.equal(Object.keys(p.targets).length,15);assert.deepEqual(Object.keys(p.targets),RIDER_TARGET_BONES);
 assert.deepEqual(p.targets,source.targets);assert.equal(new Set(Object.values(p.targets).flat()).size,30);
 assert.ok(Math.abs(p.steering-.37)<1e-12);assert.equal(p.yaw,0);
 p.targets.handL[0][0]=999;assert.deepEqual(source,before);
 assert.notEqual(p.targets.forearmL[1][0],999);
 for(let i=0;i<100;i++)assert.deepEqual(prepareRiderTargetPose(source).targets,before.targets);
});

test('root/head yaw remain explicit and a collapsed physical segment is preserved',()=>{
 const source=riderPose();source.yaw=.6;source.headYaw=-.2;source.targets.head[1]=[...source.targets.head[0]];
 source.targets.handR[1]=[...source.targets.handL[1]];
 const p=prepareRiderTargetPose(source);assert.equal(p.yaw,.6);assert.equal(p.headYaw,-.2);assert.equal(p.steering,0);
 assert.deepEqual(p.targets.head[0],p.targets.head[1]);
});

test('malformed or partial anatomy is rejected before a renderer can retain stale bones',()=>{
 const p=riderPose();
 for(const invalid of [null,{}, {targets:[]}, {...p,yaw:Infinity},{...p,headYaw:NaN},
  {...p,targets:{...p.targets,extra:[[0,0,0],[0,1,0]]}},
  {...p,targets:{...p.targets,head:[[0,0,0]]}},
  {...p,targets:{...p.targets,handL:[[0,0,NaN],[0,1,0]]}},
  {...p,targets:{...p.targets,torso:[[-1e308,0,0],[1e308,0,0]]}}
 ])assert.throws(()=>prepareRiderTargetPose(invalid));
 const missing=structuredClone(p);delete missing.targets.footR;assert.throws(()=>prepareRiderTargetPose(missing),/footR/);
});
