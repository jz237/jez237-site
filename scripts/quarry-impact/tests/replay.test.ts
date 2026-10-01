import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {ReplayRecorder,REPLAY_STRIDE,encodeReplay,decodeReplay,replayBracket,replayFile,readReplayFile,type ReplayDocument,type ReplayMeta} from '../src/replay-data';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
import {verifyReplayRevision} from './replay-invariants';
const meta:ReplayMeta={version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-01'};
const frame=(x=0,epoch=0)=>{const data=new Float32Array(REPLAY_STRIDE);data[0]=x;data[6]=1;data[14]=100;for(let j=0;j<4;j++)data[15+j*8+6]=1;data[54]=epoch;return data;};
const document=():ReplayDocument=>({meta,frames:[{time:0,values:frame()},{time:1,values:frame(10)}],events:[],limited:false});
const minimal=()=>{const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const w=new T.Group();w.name='wheel_'+name;model.add(w);}templates.set('coupe',model);};
test('recording samples at 20 Hz, excludes duplicate timestamps and stops at the duration bound',()=>{
  const r=new ReplayRecorder(meta);for(let i=0;i<=120;i++)r.capture(i/60,()=>frame(i));assert.equal(r.frames.length,41);r.capture(2,()=>frame(),true);assert.equal(r.frames.length,41);r.capture(2.01,()=>frame(),true);assert.equal(r.frames.length,42);r.capture(1801,()=>frame());assert.equal(r.limited,true);
  const atLimit=new ReplayRecorder(meta);atLimit.capture(0,()=>frame());atLimit.capture(1800,()=>frame(),true);atLimit.event(0,1800.01,{kind:'repair',pose:[0,0,0,0,0,0,1]});assert.equal(atLimit.limited,true);assert.equal(atLimit.events.length,0);assert.doesNotThrow(()=>decodeReplay(encodeReplay(atLimit.document())));
  const saved=r.document();r.frames.push({time:1802,values:frame()});assert.equal(saved.frames.length,42,'snapshot frame list is independent');
});
test('binary replay round trips typed poses, event details and custom setup',()=>{
  const doc=document();doc.meta={...meta,cars:[{...meta.cars[0],setup:{...stockSetup('coupe'),paint:0xf06020,armor:3}}]};doc.events=[{kind:'hit',car:0,time:.5,pose:[0,1,0,0,0,0,1],point:[1,0,1],direction:[-1,0,0],damage:15,health:100,paint:0x40566d}];
  const loaded=decodeReplay(encodeReplay(doc));assert.deepEqual(loaded,doc);assert.equal(loaded.frames[1].values[0],10);
});
test('gzip replay file import/export is usable and malformed or oversized inputs fail',async()=>{
  const doc=document(),blob=await replayFile(doc);const decoded=await readReplayFile(new File([blob],'test.qir'));assert.deepEqual(decoded,doc);
  assert.throws(()=>decodeReplay(new Uint8Array(12)));const valid=encodeReplay(doc);assert.throws(()=>decodeReplay(valid.subarray(0,valid.length-1)));
  const poisoned=document();poisoned.frames[1].values[0]=NaN;assert.throws(()=>decodeReplay(encodeReplay(poisoned)));
  for(const events of [[{kind:'hit',time:0,car:0,pose:[0,0,0,0,0,0,1],point:[0,0,0],direction:[0,0,1],damage:Infinity,health:100}],[{kind:'repair',time:0,car:100,pose:[0,0,0,0,0,0,1]}]])assert.throws(()=>decodeReplay(encodeReplay({...document(),events}as ReplayDocument)));
  await assert.rejects(readReplayFile({size:65*1024*1024}as File),/64 MB/);
});
test('replay bracket clamps boundaries and interpolates nonuniform frame times',()=>{
  const doc=document();assert.equal(replayBracket(doc.frames,-1).alpha,0);assert.equal(replayBracket(doc.frames,.25).alpha,.25);assert.equal(replayBracket(doc.frames,999).a,doc.frames[1]);assert.equal(replayBracket(doc.frames,999).alpha,0);
});
test('playback interpolates positions, keeps teleports discontinuous and does not change live physics',async()=>{
  await R.init();minimal();const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),live=new Vehicle(99,'coupe',0xffffff,scene,world,{emit(){},mark(){},detach(){}}as any);live.place(30,10,.7);live.body.setLinvel({x:1,y:2,z:3},true);
  const before={p:{...live.body.translation()},q:{...live.body.rotation()},v:{...live.body.linvel()},health:live.health};const doc=document(),view=new ReplayScene(doc,scene,world,[]);view.seek(.5);assert.equal(view.cars[0].current.x,5);assert.equal(view.cars[0].body.isEnabled(),false);
  doc.frames[1].values[54]=1;view.seek(.75);assert.equal(view.cars[0].current.x,0);view.seek(1);assert.equal(view.cars[0].current.x,10);view.dispose();assert.deepEqual({p:{...live.body.translation()},q:{...live.body.rotation()},v:{...live.body.linvel()},health:live.health},before);assert.equal(world.bodies.len(),1);live.dispose();world.free();
});
test('unwrapped wheel angles avoid reverse-spinning interpolation and paint matches the recorded car',async()=>{
  await R.init();minimal();const doc=document();doc.meta={...meta,cars:[{...meta.cars[0],setup:{...stockSetup('coupe'),paint:0xc43212}}]};doc.frames[1].values[22]=10;
  const world=new R.World({x:0,y:-9.81,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]);view.seek(.5);const expected=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-5);assert.ok(Math.abs(view.cars[0].wheels[0].quaternion.dot(expected))>.99999);assert.equal(view.cars[0].paintColor.getHex(),0xc43212);view.dispose();world.free();
});
test('vehicle recording observes local impact, jump and repair without changing armor damage',async()=>{
  await R.init();minimal();const setup=stockSetup('coupe');setup.armor=3;const world=new R.World({x:0,y:-9.81,z:0}),car=new Vehicle(0,'coupe',setup.paint,new T.Scene(),world,{emit(){},mark(){},detach(){}}as any,setup),r=new ReplayRecorder({...meta,cars:[{...meta.cars[0],setup}]});car.place(5,3,1);
  car.onVisualEvent=e=>r.event(0,.5,e);const local=new T.Vector3(1,0,2),point=local.clone().applyQuaternion(car.currentQ).add(car.current);car.hit(point,new T.Vector3(0,0,-1),20,.5);assert.equal(r.events.length,1);assert.ok(new T.Vector3().fromArray(r.events[0].point!).distanceTo(local)<1e-6);assert.equal(r.events[0].damage,20);assert.ok(car.health>85);
  car.place(8,4,.2,true);assert.deepEqual(r.events.map(e=>e.kind),['hit','jump','repair']);assert.equal(car.health,100);const data=captureReplayFrame([car],[],[1]);assert.equal(data.length,REPLAY_STRIDE);assert.equal(data[54],1);car.dispose();world.free();
});
test('replay additions preserve exact recoverable previous release sources',verifyReplayRevision);
