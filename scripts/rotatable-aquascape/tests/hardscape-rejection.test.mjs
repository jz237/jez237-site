import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {clearHardscape} from '../lib/TankSpace.ts';
import {hardscapeObstacles} from './cory-habitat-fixture.mjs';
function original(p,obstacles,bodyRadius=.23){for(let pass=0;pass<8;pass++){let touched=false;for(const obstacle of obstacles){const delta=p.clone().sub(obstacle.center),dist=delta.length(),clearance=obstacle.radius+bodyRadius;if(dist<clearance-1e-7){if(dist<.001)delta.set(0,1,0);else delta.divideScalar(dist);p.copy(obstacle.center).addScaledVector(delta,clearance+.0001);touched=true;}}if(!touched)break;}return p;}
test('hardscape rejection preserves exact multi-contact resolution',async()=>{
 const obstacles=await hardscapeObstacles();let seed=723;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),poses=[];
 for(let i=0;i<10000;i++)poses.push({p:new T.Vector3(rnd()*11-5.5,rnd()*6,rnd()*5.5-2.75),radius:.05+rnd()*.6});
 for(const o of obstacles)for(const eps of [-1e-9,0,1e-9])poses.push({p:o.center.clone().add(new T.Vector3(o.radius+.23-1e-7+eps,0,0)),radius:.23},{p:o.center.clone(),radius:.23});
 for(const {p,radius} of poses)assert.deepEqual(clearHardscape(p.clone(),obstacles,radius).toArray(),original(p.clone(),obstacles,radius).toArray());
 if(process.env.CLEAR_BENCH){const run=fn=>{const t=performance.now();for(const {p,radius} of poses)fn(p.clone(),obstacles,radius);return performance.now()-t;};run(original);run(clearHardscape);const before=[],after=[];for(let i=0;i<6;i++){before.push(run(original));after.push(run(clearHardscape));}console.log(JSON.stringify({poses:poses.length,before,after}));}
});
