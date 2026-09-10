import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Vector3,Quaternion} from '../vendor/three.module.js';
import {riderPose} from '../rider-pose.js';

test('Blender rider export has human-scale bounds and finite articulated geometry',()=>{
 const base=new URL('../assets/',import.meta.url),meta=JSON.parse(readFileSync(new URL('coastal-rider.json',base),'utf8')),data=readFileSync(new URL('coastal-rider.bin',base));
 const up=new Vector3(0,1,0),v=new Vector3(),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 assert.equal(Object.keys(meta.bones).length,15);
 for(const part of meta.meshes){
  const bone=meta.bones[part.bone];assert.ok(bone&&meta.materials[part.material]);assert.ok(part.offset+part.vertices*24<=data.length);assert.equal(part.vertices%3,0);
  const start=new Vector3(...bone.start),q=new Quaternion().setFromUnitVectors(up,new Vector3(...bone.end).sub(start).normalize());
  for(let i=0;i<part.vertices;i++){
   const o=part.offset+i*24;v.set(data.readFloatLE(o),data.readFloatLE(o+4),data.readFloatLE(o+8)).applyQuaternion(q).add(start);
   for(const [k,x] of v.toArray().entries()){assert.ok(Number.isFinite(x));min[k]=Math.min(min[k],x);max[k]=Math.max(max[k],x);}
   assert.ok(Math.abs(Math.hypot(data.readFloatLE(o+12),data.readFloatLE(o+16),data.readFloatLE(o+20))-1)<.001);
  }
 }
 assert.ok(min[0]>-.7&&max[0]<.7);assert.ok(min[1]>.3&&max[1]<1.9);assert.ok(min[2]>-.65&&max[2]<.85);
 const glb=readFileSync(new URL('Coastal Rider.glb',base));assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(8),glb.length);
});
test('riding grip follows steering while feet stay planted and torso absorbs impacts',()=>{
 const neutral=riderPose('',0,0),turn=riderPose('',0,1,{steering:.3}),hit=riderPose('',0,0,{impact:8});
 for(const side of ['L','R']){
  assert.deepEqual(turn.targets['foot'+side],neutral.targets['foot'+side]);
  assert.deepEqual(turn.targets['forearm'+side][1],turn.targets['hand'+side][0]);
  const a=neutral.targets['hand'+side][0],b=turn.targets['hand'+side][0];
  assert.ok(Math.abs(Math.hypot(a[0],a[2]-.66)-Math.hypot(b[0],b[2]-.66))<1e-8);
 }
 assert.ok(hit.targets.torso[1][1]<neutral.targets.torso[1][1]);
});
test('all stunt poses keep finite connected joints and a full somersault returns to its start',()=>{
 for(const pose of ['stand','handstand','backwards','somersault'])for(const t of [0,.3,.7,1.05]){
  const p=riderPose(pose,t,.5);assert.equal(Object.keys(p.targets).length,15);
  for(const points of Object.values(p.targets))for(const point of points)assert.ok(point.every(Number.isFinite));
  for(const side of ['L','R'])assert.deepEqual(p.targets['upperArm'+side][1],p.targets['forearm'+side][0]);
 }
 const a=riderPose('somersault',0),b=riderPose('somersault',1.05);
 for(const key in a.targets)for(let i=0;i<2;i++)for(let j=0;j<3;j++)assert.ok(Math.abs(a.targets[key][i][j]-b.targets[key][i][j])<1e-8);
});
