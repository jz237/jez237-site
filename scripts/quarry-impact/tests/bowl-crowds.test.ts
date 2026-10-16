import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createHarrowWorld} from '../src/harrow-world';import {createBriarhillWorld} from '../src/briarhill-world';
import {HARROW_BARRIERS} from '../src/harrow-arena';import {BRIARHILL_BARRIERS,briarhillHeight} from '../src/briarhill-arena';
for(const name of ['harrow','briarhill']as const)test(name+' crowds face the arena, stay above their terraces and animate in bounded batches',()=>{
 const world=name==='harrow'?createHarrowWorld():createBriarhillWorld(),crowd=world.root.getObjectByName(name+'_spectators')!;
 try{assert.equal(world.root.userData.solidRecords,name==='harrow'?HARROW_BARRIERS:BRIARHILL_BARRIERS);assert.ok(crowd.userData.spectatorCount>650);assert.ok(crowd.userData.spectatorCount<1000);assert.equal(crowd.children.length,4);assert.ok(crowd.userData.triangles<480000);
 const torso=crowd.getObjectByName('crowd_torso')as T.InstancedMesh,m=new T.Matrix4(),p=new T.Vector3(),face=new T.Vector3();
 for(let i=0;i<torso.count;i++){torso.getMatrixAt(i,m);p.setFromMatrixPosition(m);face.set(0,0,1).transformDirection(m);assert.ok(p.x*face.x+p.z*face.z< -45);assert.ok(Math.hypot(p.x,p.z)>(name==='harrow'?51:61));const ground=name==='harrow'?0:briarhillHeight(p.x,p.z);assert.ok(p.y>ground+.5&&p.y<ground+5);}
 const limbs=crowd.getObjectByName('crowd_limb')as T.InstancedMesh,before=Array.from(limbs.instanceMatrix.array);world.update(1);assert.notDeepEqual(Array.from(limbs.instanceMatrix.array),before);const tick=Array.from(limbs.instanceMatrix.array);world.update(1.001);assert.deepEqual(Array.from(limbs.instanceMatrix.array),tick);
 crowd.traverse(o=>{assert.equal(o.matrixAutoUpdate,false);assert.equal(o.castShadow,false);});console.log(name,{spectators:crowd.userData.spectatorCount,triangles:crowd.userData.triangles});
 }finally{world.dispose();world.dispose();assert.equal(world.root.children.length,0);world.update(2);}
});
