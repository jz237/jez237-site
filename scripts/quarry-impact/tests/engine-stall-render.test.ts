import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {ReplayRecorder,replayFile,readReplayFile,encodeReplay,decodeReplay,replayCarStride} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {Sound} from '../src/audio';
import {classicEngineVoice} from '../src/classic-vehicle-specs';
await R.init();const originalLoad=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=originalLoad;}
const zero={x:0,y:0,z:0},fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
function pose(c:Vehicle){c.place(0,0,0);c.render(1);c.root.updateMatrixWorld(true);}
function hit(c:Vehicle,damage:number){const p=new T.Vector3(0,0,c.kind==='marten'?-1.7:1.7).applyMatrix4(c.root.matrixWorld);c.hit(p,new T.Vector3(0,0,-1),damage,1,true);}

test('rendered fleet scars always mark without mechanical damage; armored structural impacts stall and ordinary reposition preserves the stall',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const world=new R.World(zero),setup=stockSetup(kind);setup.armor=armor;const car=new Vehicle(0,kind,setup.paint,new T.Scene(),world,fx,setup);
  try{
   pose(car);const point=new T.Vector3(0,0,DEFINITIONS[kind].halfLength).applyMatrix4(car.root.matrixWorld),events:any[]=[];car.onVisualEvent=e=>events.push(e);
   assert.ok(car.scar(point,new T.Vector3(0,0,-1)),kind+' visibly marked');assert.equal(car.health,100);assert.equal(car.engineStall,0);assert.equal(car.engineDamage,0);assert.ok(events.at(-1).scar);
   hit(car,50);assert.ok(car.engineStall!>0,kind+' structural hit stalls');assert.ok(car.health>0);const stalled=car.engineStall;
   car.place(3,4,.4);assert.equal(car.engineStall,stalled);car.repair();assert.equal(car.engineStall,0);assert.equal(car.health,100);
  }finally{car.dispose();world.free();}
 }
});

test('new compressed replays restore stall phases and countdown through backward seeks and repair while old replays never infer stalls',async()=>{
 for(const tyreModel of [undefined,1] as const)for(const engineModel of [undefined,1] as const){
  const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('marten'),car=new Vehicle(0,'marten',setup.paint,scene,world,fx,setup);pose(car);
  const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'marten',setup}],props:0,created:'2026-10-07',...(tyreModel?{tyreModel}:{}),...(engineModel?{engineModel}:{})});let time=0;car.onVisualEvent=e=>recorder.event(0,time,e);
  const capture=(at:number)=>recorder.capture(at,()=>captureReplayFrame([car],[],[0],tyreModel,engineModel),true);
  try{
   capture(0);time=1;hit(car,36);const stall=car.engineStall!;assert.ok(stall>0);capture(1);
   car.input.throttle=1;for(let i=0;i<30;i++)car.preStep(1/60);capture(2);
   for(let i=0;i<180;i++)car.preStep(1/60);capture(3);time=4;car.repair();capture(4);
   const raw=encodeReplay(recorder.document()),doc=await readReplayFile(new File([await replayFile(recorder.document())],'stall.qir'));
   assert.deepEqual(doc,decodeReplay(raw));assert.deepEqual(encodeReplay(decodeReplay(encodeReplay(doc))),encodeReplay(doc));assert.equal(replayCarStride(doc.meta),56+(tyreModel?24:0)+(engineModel?1:0));
   const replay=new ReplayScene(doc,scene,world,[]);try{
    for(const at of [0,.5,1,1.5,2,2.9,3,4,1,0,3,2,4]){
     replay.seek(at);const expected=at<1||at>=3?0:at<2?stall-.5*(at-1):stall-.5;
     if(engineModel)near(replay.cars[0].engineStall!,expected);else assert.equal(replay.cars[0].engineStall,undefined,'old visual hits cannot create new mechanical state');
     if(engineModel&&at===2.9)assert.ok(replay.cars[0].rpm<300,'stall phase cannot interpolate into a running engine early');
    }
   }finally{replay.dispose();}
   if(engineModel){for(const bad of [-1,2.9,NaN]){const copy=structuredClone(doc);copy.frames[0].values[replayCarStride(copy.meta)-1]=bad;assert.throws(()=>decodeReplay(encodeReplay(copy)),/supported/);}}
   assert.equal(car.engineStall,0,'replay leaves live vehicle alone');
  }finally{car.dispose();world.free();}
 }
});

class Param{value=0;setTargetAtTime(v:number){this.value=v;}setValueAtTime(v:number){this.value=v;}}
class Node{gain=new Param();playbackRate=new Param();positionX=new Param();positionY=new Param();positionZ=new Param();stopped=false;disconnected=false;connect(n:any){return n;}disconnect(){this.disconnected=true;}start(){}stop(){this.stopped=true;}}
test('positional sound mutes combustion during stall, plays starter only while cranking, and cleans up on pause and car replacement',async()=>{
 const sound=new Sound(),nodes:Node[]=[];let suspends=0;const listener=Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,new Param()]));
 sound.ctx={sampleRate:48000,currentTime:1,listener,state:'running',suspend:async()=>{suspends++;},createBuffer:(_channels:number,n:number,rate:number)=>({duration:n/rate,copyToChannel(data:Float32Array){assert.equal(data.length,n);}}),createBufferSource:()=>{const n=new Node();nodes.push(n);return n;},createGain:()=>new Node(),createPanner:()=>new Node()} as any;
 sound.ready=true;sound.engineBus=new Node() as any;sound.fxBus=new Node() as any;
 for(const name of ['idle','low','mid','high','load','damaged'])sound.buffers.set(classicEngineVoice('marten').bank+'-'+name,{duration:1} as AudioBuffer);
 for(const name of ['tires','gravel','scrape'])sound.buffers.set(name,{duration:1} as AudioBuffer);
 const car:any={id:0,kind:'marten',health:60,engineDamage:.5,engineStall:1,rpm:0,current:new T.Vector3(3,4,5),velocity:new T.Vector3(),speed:8,slip:5,surface:'gravel',gear:1,input:{throttle:0},controller:{wheelIsInContact:()=>true}};
 sound.attach([car]);const loops=sound.loops.get(0)!;assert.ok(loops.has('starter'));const camera=new T.PerspectiveCamera();
 sound.update([car],camera,1/60);assert.equal(loops.get('starter')!.gain.gain.value,0);for(const key of ['idle','low','mid','high','load','damaged'])assert.equal(loops.get(key)!.gain.gain.value,0);assert.ok(loops.get('gravel')!.gain.gain.value>0,'coasting contact sound survives');
 car.input.throttle=1;car.rpm=220;sound.update([car],camera,1/60);near(loops.get('starter')!.gain.gain.value,.13);assert.equal(loops.get('starter')!.pan.positionZ.value,5);
 await sound.pause(true);assert.equal(suspends,1);car.engineStall=0;car.rpm=1550;sound.update([car],camera,1/60);assert.equal(loops.get('starter')!.gain.gain.value,0);assert.ok(loops.get('idle')!.gain.gain.value>0);
 car.engineStall=1;car.health=0;sound.update([car],camera,1/60);assert.equal(loops.get('starter')!.gain.gain.value,0);
 sound.clearCars();assert.equal(sound.loops.size,0);assert.ok(nodes.every(n=>n.stopped&&n.disconnected));
});
