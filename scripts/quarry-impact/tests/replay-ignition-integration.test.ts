import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {VehicleFire} from '../src/vehicle-fire';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {stockSetup} from '../src/garage';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
import {ReplayBurstPlayback} from '../src/replay-burst-audio';
import {Sound} from '../src/audio';
await R.init();
const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const w=new T.Group();w.name='wheel_'+name;model.add(w);}templates.set('tern',model);
const zones={front:85,rear:85,left:0,right:0,roof:0};
// Select a deterministic naturally explosive episode without bypassing ignition timers.
let explosiveSeed:number|undefined;
for(let i=0;i<512&&explosiveSeed===undefined;i++){
 const state=new VehicleThermalState(100,i/512);
 for(let j=0;j<3600;j++)if(state.advance(0,1/60,0,zones)){explosiveSeed=i/512;break;}
}
assert.notEqual(explosiveSeed,undefined);
test('real fire simulation records one burst and survives export, repair and replay transport',async()=>{
 for(const hz of [30,144]){
  const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),camera=new T.PerspectiveCamera();camera.position.set(0,4,18);camera.lookAt(0,1,0);camera.updateMatrixWorld();
  const car=new Vehicle(0,'tern',0x667788,scene,world,{emit(){},mark(){},detach(){}} as any,stockSetup('tern'));
  const fire=new VehicleFire(scene,()=>{},()=>explosiveSeed!);
  const r=new ReplayRecorder({version:1,mode:'derby',reverse:false,thermalModel:1,audioModel:1,cars:[{id:0,kind:'tern',setup:car.setup}],props:0,created:'2026-10-16'});
  const capture=(time:number,epoch=0)=>r.capture(time,()=>captureReplayFrame([car],[],[epoch],undefined,undefined,1,()=>0,1,fire.audio));
  let replay:ReplayScene|undefined;
  try{
   car.place(7,-3,.4);car.render(1);fire.update([car],1/hz,camera);capture(0);
   car.health=0;Object.assign(car.damageZones,zones);
   for(let i=1;i<=hz*60;i++){
    fire.update([car],1/hz,camera);
    for(const burst of fire.bursts)r.burst({time:i/hz,position:burst.position.toArray()});
    capture(i/hz);
   }
   assert.equal(r.bursts.length,1,`${hz}Hz: one real ignition burst`);
   assert.ok(r.frames.some(f=>f.values[f.values.length-4]>.65));
   car.health=100;fire.update([car],1/30,camera);capture(61,1);
   const doc=await readReplayFile(new File([await replayFile(r.document())],'ignition.qir'));
   assert.equal(doc.bursts!.length,1);assert.deepEqual(doc.bursts![0],r.bursts[0]);
   replay=new ReplayScene(doc,scene,world,[]);const event=doc.bursts![0];replay.seek(event.time);
   assert.ok(replay.thermalAudio[0].heat>.65);assert.ok(replay.thermalAudio[0].position.distanceTo(new T.Vector3().fromArray(event.position))<1e-5);
   const sound=new Sound(),heard:string[]=[];sound.ready=true;sound.ctx={currentTime:0}as any;sound.shot=id=>heard.push(id);
   const playback=new ReplayBurstPlayback(doc.bursts!,sound);
   playback.step(event.time-.01,event.time,true,false,true);assert.deepEqual(heard,['vehicle-burst','debris']);
   playback.step(event.time,event.time,true,false,true);assert.equal(heard.length,2);
   replay.seek(61);assert.equal(replay.thermalAudio[0].heat,0,'repair extinguishes recorded fire');
   playback.step(61,event.time,false,true,true);assert.equal(heard.length,2,'scrub back is silent');
   playback.step(event.time-.01,event.time,true,false,true);assert.equal(heard.length,4,'intentional replay crossing emits again');
  }finally{replay?.dispose();fire.dispose();car.dispose();world.free();}
 }
});
