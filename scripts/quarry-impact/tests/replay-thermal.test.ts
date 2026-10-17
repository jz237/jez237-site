import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
import {replayCarStride,encodeReplay,decodeReplay,type ReplayMeta,type ReplayDocument} from '../src/replay-data';
import {ReplayAudioTransport} from '../src/replay-audio';
await R.init();
const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}templates.set('tern',model);
const effects={emit(){},mark(){},detach(){}} as any;
function recording(tyreModel?:1,engineModel?:1,audioModel?:1,thermalModel?:1){
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),car=new Vehicle(9,'tern',0x667788,scene,world,effects,stockSetup('tern'));
 const meta:ReplayMeta={version:1,mode:'race',reverse:false,cars:[{id:9,kind:'tern',setup:car.setup}],props:0,created:'2026-10-16',...(tyreModel?{tyreModel}:{}),...(engineModel?{engineModel}:{}),...(audioModel?{audioModel}:{}),...(thermalModel?{thermalModel}:{})};
 try{car.place(0,0,.4);car.render(1);car.input.throttle=.8;car.surface='asphalt';car.remoteGrounded=true;car.scraping=.2;car.engineStall=.4;
  const first=captureReplayFrame([car],[],[0],tyreModel,engineModel,audioModel,()=>.6,thermalModel,[{id:9,heat:.8,position:new T.Vector3(10,2,30),burst:0}]);
  car.input.throttle=0;car.surface='mud';car.remoteGrounded=false;car.scraping=0;car.engineStall=.2;
  const last=captureReplayFrame([car],[],[0],tyreModel,engineModel,audioModel,()=>0,thermalModel,[]);
  return {meta,frames:[{time:0,values:first},{time:1,values:last}],events:[],limited:false} satisfies ReplayDocument;
 }finally{car.dispose();world.free();}
}

test('thermal channels preserve every prior layout and reject corrupt imports',()=>{
 for(const tyres of [undefined,1]as const)for(const engine of [undefined,1]as const)for(const audio of [undefined,1]as const){const doc=recording(tyres,engine,audio,1);assert.deepEqual(decodeReplay(encodeReplay(doc)),doc);assert.equal(doc.frames[0].values[replayCarStride(doc.meta)-3],10);}
 for(const heat of [-.1,1.1,NaN]){const doc=recording(1,1,1,1);doc.frames[0].values[replayCarStride(doc.meta)-4]=heat;assert.throws(()=>decodeReplay(encodeReplay(doc)));}
 const invalid=recording(1,1,1,1);(invalid.meta as any).thermalModel=2;assert.throws(()=>decodeReplay(encodeReplay(invalid)));
});
test('fire sources interpolate, extinguish, rewind and respect repair discontinuities',()=>{
 const doc=decodeReplay(encodeReplay(recording(1,1,1,1))),world=new R.World({x:0,y:0,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]);
 try{for(const t of [0,.5,1,0]){view.seek(t);assert.equal(view.thermalAudio.length,1);const e=view.thermalAudio[0];assert.equal(e.id,9);assert.ok(Math.abs(e.heat-.8*(1-t))<1e-6);assert.equal(e.burst,0);assert.ok(Math.abs(view.cars[0].input.throttle-.8*(1-t))<1e-6,'driving channels have not shifted');assert.ok(Math.abs(view.cars[0].engineStall!-(.4-.2*t))<1e-6);}
 doc.frames[1].values[54]=1;view.seek(.5);assert.ok(Math.abs(view.thermalAudio[0].heat-.8)<1e-6);assert.equal(view.thermalAudio[0].position.x,10);
 }finally{view.dispose();world.free();}
 const old=recording(1,1,1),oldWorld=new R.World({x:0,y:0,z:0}),oldView=new ReplayScene(old,new T.Scene(),oldWorld,[]);try{oldView.seek(.5);assert.deepEqual(oldView.thermalAudio,[]);assert.equal(decodeReplay(encodeReplay(old)).meta.thermalModel,undefined);}finally{oldView.dispose();oldWorld.free();}
});
test('recorded fire heat drives the real spatial mixer and extinguishes its loops',async()=>{
 const {Sound}=await import('../src/audio');const doc=recording(1,1,1,1),world=new R.World({x:0,y:0,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]),sound=new Sound();
 const parameter=()=>({value:0,setTargetAtTime(v:number){this.value=v;}}),loop=()=>({source:{playbackRate:parameter(),stop(){},disconnect(){}},gain:{gain:parameter(),disconnect(){}},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter(),disconnect(){}}}),roar=loop(),crackle=loop();
 sound.ready=true;sound.ctx={currentTime:0}as any;sound.loops.set(9,new Map([['fire-roar',roar],['fire-crackle',crackle]])as any);
 try{view.seek(0);sound.thermal(view.thermalAudio,[]);assert.ok(Math.abs(roar.gain.gain.value-.168)<1e-6);assert.ok(Math.abs(crackle.gain.gain.value-.128)<1e-6);assert.equal(roar.pan.positionX.value,10);assert.equal(roar.pan.positionY.value,2);assert.equal(roar.pan.positionZ.value,30);view.seek(1);sound.thermal(view.thermalAudio,[]);assert.equal(roar.gain.gain.value,0);assert.equal(crackle.gain.gain.value,0);view.seek(0);sound.thermal(view.thermalAudio,[]);assert.ok(roar.gain.gain.value>0);}finally{sound.clearCars();view.dispose();world.free();}
});
