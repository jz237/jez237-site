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
function recording(tyreModel?:1,engineModel?:1,audioModel?:1){
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),car=new Vehicle(9,'tern',0x667788,scene,world,effects,stockSetup('tern'));
 const meta:ReplayMeta={version:1,mode:'race',reverse:false,cars:[{id:9,kind:'tern',setup:car.setup}],props:0,created:'2026-10-16',...(tyreModel?{tyreModel}:{}),...(engineModel?{engineModel}:{}),...(audioModel?{audioModel}:{})};
 try{car.place(0,0,.4);car.render(1);car.input.throttle=.8;car.surface='asphalt';car.remoteGrounded=true;car.scraping=.2;car.engineStall=.4;
  const first=captureReplayFrame([car],[],[0],tyreModel,engineModel,audioModel,()=>.6);
  car.input.throttle=0;car.surface='mud';car.remoteGrounded=false;car.scraping=0;car.engineStall=.2;
  const last=captureReplayFrame([car],[],[0],tyreModel,engineModel,audioModel,()=>0);
  return {meta,frames:[{time:0,values:first},{time:1,values:last}],events:[],limited:false} satisfies ReplayDocument;
 }finally{car.dispose();world.free();}
}
test('all legacy, tyre, engine and audio layouts round trip without shifting engine counters',()=>{
 for(const tyres of [undefined,1]as const)for(const engine of [undefined,1]as const)for(const audio of [undefined,1]as const){
  const doc=recording(tyres,engine,audio);assert.equal(doc.frames[0].values.length,56+(tyres?24:0)+(engine?1:0)+(audio?4:0));
  assert.deepEqual(decodeReplay(encodeReplay(doc)),doc);
 }
});
test('import rejects unsupported audio schemas and invalid channel values',()=>{
 for(const [channel,value]of [[0,1.01],[0,-1.01],[1,3],[1,.5],[2,.5],[3,-.1],[3,1.1],[3,NaN]]){
  const doc=recording(1,1,1);doc.frames[0].values[replayCarStride(doc.meta)-4+channel]=value;assert.throws(()=>decodeReplay(encodeReplay(doc)));
 }
 const doc=recording(1,1,1);(doc.meta as any).audioModel=2;assert.throws(()=>decodeReplay(encodeReplay(doc)));
});
test('real replay copies restore audio across interpolation, rewind, checkpoints and teleports',()=>{
 const doc=decodeReplay(encodeReplay(recording(1,1,1))),world=new R.World({x:0,y:0,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]);
 try{for(const time of [0,.5,1,0,.5]){
  view.seek(time);const car=view.cars[0];assert.ok(Math.abs(car.input.throttle-.8*(1-time))<1e-6);assert.ok(Math.abs(car.scraping-.6*(1-time))<1e-6);assert.ok(Math.abs(car.engineStall!-(.4-.2*time))<1e-6);
  assert.equal(car.remoteGrounded,time<1);assert.equal(car.surface,time<1?'asphalt':'mud');
 }
 doc.frames[1].values[54]=1;view.seek(.5);assert.ok(Math.abs(view.cars[0].scraping-.6)<1e-6,'teleport boundaries hold the prior audio state');
 }finally{view.dispose();world.free();}
});
test('legacy recordings do not invent scraping or throttle',()=>{
 const doc=recording(undefined,1),world=new R.World({x:0,y:0,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]);
 try{view.seek(.5);assert.equal(view.cars[0].scraping,0);assert.equal(view.cars[0].input.throttle,0);assert.equal(view.cars[0].remoteGrounded,false);assert.ok(Math.abs(view.cars[0].engineStall!-.3)<1e-6);}finally{view.dispose();world.free();}
});
test('playback audio waits for readiness and stays silent during pause, seeking, photo and exit',()=>{
 const calls:string[]=[],sound={ready:false,attach(){calls.push('attach');},clearCars(){calls.push('clear');},async pause(value:boolean){calls.push(value?'pause':'resume');}},audio=new ReplayAudioTransport(sound);
 audio.reset();calls.length=0;assert.equal(audio.sync(true,false,[]),false);assert.deepEqual(calls,[]);
 sound.ready=true;assert.equal(audio.sync(true,false,[]),true);assert.deepEqual(calls,['attach','resume']);calls.length=0;
 audio.sync(true,false,[]);assert.deepEqual(calls,[]);
 assert.equal(audio.sync(true,true,[]),false);assert.deepEqual(calls,['pause','clear']);calls.length=0;
 audio.sync(false,false,[]);assert.deepEqual(calls,[]);audio.sync(true,false,[]);assert.deepEqual(calls,['attach','resume']);
 calls.length=0;audio.reset();assert.deepEqual(calls,['pause','clear']);assert.equal(audio.sync(false,false,[]),false);
});
test('decoded replay scraping reaches the actual sound mixer and stops on the separated frame',async()=>{
 const {Sound}=await import('../src/audio'),sound=new Sound(),doc=decodeReplay(encodeReplay(recording(1,1,1))),world=new R.World({x:0,y:0,z:0}),view=new ReplayScene(doc,new T.Scene(),world,[]);
 const parameter=()=>({value:0,setTargetAtTime(v:number){this.value=v;}}),loop={source:{playbackRate:parameter(),stop(){},disconnect(){}},gain:{gain:parameter(),disconnect(){}},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter(),disconnect(){}}};
 sound.ready=true;sound.ctx={currentTime:0,listener:Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,parameter()]))}as any;sound.shot=()=>{};sound.loops.set(9,new Map([['scrape',loop]])as any);
 try{view.seek(0);sound.update(view.cars,new T.PerspectiveCamera(),1/60);assert.ok(Math.abs(loop.gain.gain.value-.072)<1e-6);view.seek(1);sound.update(view.cars,new T.PerspectiveCamera(),1/60);assert.equal(loop.gain.gain.value,0);view.seek(0);sound.update(view.cars,new T.PerspectiveCamera(),1/60);assert.ok(loop.gain.gain.value>0);}finally{sound.clearCars();view.dispose();world.free();}
});
