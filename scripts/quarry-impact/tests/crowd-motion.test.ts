import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {createVenueCrowd} from '../src/venue-crowd';
test('spectators animate connected arms without moving seats, torsos, or collision-free placements',()=>{
 const crowd=createVenueCrowd(Array.from({length:432},(_,i)=>({x:i%72*1.1,y:Math.floor(i/72)*.5,z:0,yaw:i%2*Math.PI,seated:true})));
 const meshes=crowd.root.children as T.InstancedMesh[],before=meshes.map(m=>Array.from(m.instanceMatrix.array));crowd.update(2);
 for(let i=0;i<meshes.length;i++){const m=meshes[i],after=Array.from(m.instanceMatrix.array);if(m.name==='crowd_torso'||m.name==='crowd_box')assert.deepEqual(after,before[i]);else assert.notDeepEqual(after,before[i]);assert.ok(after.every(Number.isFinite));}
 const limb=meshes.find(m=>m.name==='crowd_limb')!,pose=Array.from(limb.instanceMatrix.array);crowd.update(2.001);assert.deepEqual(Array.from(limb.instanceMatrix.array),pose);crowd.update(5);crowd.update(2);assert.deepEqual(Array.from(limb.instanceMatrix.array),pose);
 crowd.update(NaN);assert.deepEqual(Array.from(limb.instanceMatrix.array),pose);
 crowd.update(0);for(let i=0;i<meshes.length;i++)for(let j=0;j<before[i].length;j++)assert.ok(Math.abs(meshes[i].instanceMatrix.array[j]-before[i][j])<1e-5);
 // At 30 Hz, update costs are bounded by two existing buffer uploads, no new meshes.
 assert.equal(meshes.length,4);assert.equal(crowd.root.userData.spectatorCount,432);
 crowd.dispose();assert.doesNotThrow(()=>crowd.update(3));
});
