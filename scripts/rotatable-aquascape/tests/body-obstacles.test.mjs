import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {bodyObstacleCandidates} from '../lib/BodyObstacles.ts';
import {angelBody} from '../lib/AngelfishMotion.ts';
import {coryBody} from '../lib/Corydoras.ts';
import {hardscapeObstacles} from './cory-habitat-fixture.mjs';
test('whole-body obstacle rejection preserves exact contact decisions across tank poses and live scenery',async()=>{
 const obstacles=await hardscapeObstacles();let seed=723,hits=0,omitted=0;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<3500;i++){
  const p=new T.Vector3(rnd()*10-5,rnd()*5,rnd()*5-2.5),yaw=rnd()*6.28,pitch=rnd()*.6-.3;
  const body=i%2?angelBody(p,yaw,pitch,.64,rnd(),rnd()*10):coryBody(p,new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),.568,pitch),margin=i%2?0:.01;
  const narrow=list=>body.some(b=>list.some(o=>b.center.distanceToSquared(o.center)<=(b.radius+o.radius+margin)**2));
  const candidates=bodyObstacleCandidates(body,obstacles,margin);assert.equal(narrow(candidates),narrow(obstacles));if(narrow(candidates))hits++;omitted+=obstacles.length-candidates.length;
 }
 assert.ok(hits>500);assert.ok(omitted>3500*obstacles.length*.7);
 const body=[{center:new T.Vector3(),radius:1}],o={center:new T.Vector3(9,0,0),radius:1};
 assert.equal(bodyObstacleCandidates(body,[o]).length,0);o.center.x=2;assert.equal(bodyObstacleCandidates(body,[o]).length,1);o.center.x=3;o.radius=2;assert.equal(bodyObstacleCandidates(body,[o]).length,1);
});
