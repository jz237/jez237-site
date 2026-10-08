import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';import {CAR_KINDS} from '../src/rules';import {stockSetup} from '../src/garage';
import {ReplayRecorder,type ReplayDocument} from '../src/replay-data';import {ReplayScene,captureReplayFrame} from '../src/replay-scene';import {ReplayStudio} from '../src/replay-studio';
await R.init();const load=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const fx={emit(){},mark(){},detach(){}} as any;
function shape(c:Vehicle){const h=createHash('sha256');for(const m of [...c.panels,...c.glass]){h.update(String(m.visible));for(const key of ['position','normal','impactWear','impactAxis','transferPaint']){const a=m.geometry.attributes[key].array;h.update(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));}}return {hash:h.digest('hex'),frame:Array.from(captureReplayFrame([c],[],[0],1)),engine:c.engineDamage,left:c.damageLeft,right:c.damageRight,tyres:c.tyreDamage,wheelDamage:Array.from(c.wreckParts.wheelDamage),wheelShift:Array.from(c.wreckParts.wheelShift)};}
function record(){
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),cars=CAR_KINDS.map((kind,i)=>new Vehicle(i,kind,0x667788,scene,world,fx,stockSetup(kind))),epochs=cars.map(()=>0);
 cars.forEach((c,i)=>{c.place(i*8,0,.4);c.render(1);});const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,tyreModel:1,cars:cars.map(c=>({id:c.id,kind:c.kind,setup:c.setup})),props:0,created:'2026-10-07'});let time=0;cars.forEach((c,i)=>c.onVisualEvent=e=>{if(e.kind!=='hit')epochs[i]++;recorder.event(i,time,e);});const capture=()=>recorder.capture(time,()=>captureReplayFrame(cars,[],epochs,1),true);capture();
 try{for(let j=0;j<20;j++){time=j+1;for(const c of cars){const side=j%2?-1:1,point=c.model.localToWorld(new T.Vector3(side*1.4,.6,((j*7)%11-5)*.4)),dir=new T.Vector3(-side,-.07,.1).normalize().applyQuaternion(c.root.quaternion);if(j===9)c.repair();else if(j%5===4)c.hit(point,dir,18,time,true,new T.Color(0x994411));else c.scar(point,dir,new T.Color(0x2266aa));}capture();}return recorder.document();}finally{cars.forEach(c=>c.dispose());world.free();}
}
test('sliced full-roster reconstruction preserves every recorded mark, repair, tyre and final pose through changed requests',()=>{
 const doc=record(),world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),view=new ReplayScene(doc,scene,world,[],undefined,0),control=new ReplayScene(doc,scene,world,[],undefined,0);
 const complete=(at:number)=>{let calls=0;while(!view.seekChunk(at,0)){assert.ok(++calls<=doc.events.length);assert.ok(view.cars.every(c=>!c.root.visible),'partial geometry is hidden');}assert.ok(view.cars.every(c=>c.root.visible));control.seek(at);assert.deepEqual(view.cars.map(shape),control.cars.map(shape));return calls;};
 try{
  assert.equal(view.seekChunk(20,0),false);assert.equal(view.seekChunk(20,0),false);
  complete(0); // reverse before any completed seek: discard the partial history
  assert.ok(complete(20)>100,'one-event slices must actually yield');
  for(let i=0;i<15;i++)assert.equal(view.seekChunk(12,0),false);
  complete(5); // replace a rewind with a still earlier request
  assert.equal(view.seekChunk(20,0),false);complete(12);complete(20);complete(0);
  assert.equal(view.seekChunk(20,0),false);view.dispose();assert.ok(view.cars.every(c=>!c.root.parent));assert.equal(world.bodies.len(),control.cars.length,'closing a pending view releases its physics copies');
 }finally{if(view.cars[0].root.parent)view.dispose();control.dispose();world.free();}
});
function ui(){const nodes=new Map<string,any>();return {innerHTML:'',querySelector(selector:string){if(!nodes.has(selector))nodes.set(selector,{value:'',textContent:'',disabled:false,hidden:false,style:{},classList:{toggle(){}}});return nodes.get(selector);},querySelectorAll(){return[];}} as unknown as HTMLElement;}
const doc=()=>({meta:{version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-07'},frames:[{time:0,values:new Float32Array(56)},{time:20,values:new Float32Array(56)}],events:[],limited:false}) as ReplayDocument;
test('studio yields before opening, coalesces scrubs, blocks incomplete photos and preserves camera until ready',()=>{
 const root=new T.Group(),dom=ui(),calls:number[]=[];let ready=false,exits=0;
 const studio=new ReplayStudio(dom,[{id:0,kind:'coupe',root}]as any,doc(),time=>{calls.push(time);return ready;},()=>exits++);
 assert.equal(studio.seeking,true);assert.deepEqual(calls,[],'constructor cannot rebuild the history in an input handler');assert.equal(dom.querySelector<HTMLButtonElement>('#studio-photo')!.disabled,true);
 for(const at of [10,12,3])studio.seek(at);assert.deepEqual(calls,[]);studio.update(.016);assert.deepEqual(calls,[3]);
 const camera=new T.PerspectiveCamera();camera.position.set(20,30,40);studio.updateCamera(camera,{}as any,{}as any);assert.deepEqual(camera.position.toArray(),[20,30,40]);
 (dom.querySelector('#studio-photo') as any).onclick();assert.equal(studio.capturePending,false);assert.match(dom.querySelector('#studio-time')!.textContent!,/SEEKING/);
 studio.seek(7);studio.update(.016);assert.deepEqual(calls,[3,7]);ready=true;studio.update(.016);assert.equal(studio.seeking,false);assert.equal(studio.time,7);assert.equal(dom.querySelector<HTMLButtonElement>('#studio-photo')!.disabled,false);assert.doesNotMatch(dom.querySelector('#studio-time')!.textContent!,/SEEKING/);
 (dom.querySelector('#studio-photo') as any).onclick();assert.equal(studio.capturePending,true);studio.seek(12);assert.equal(studio.capturePending,false,'new seeks cannot export a stale pending frame');
 (dom.querySelector('#studio-exit') as any).onclick();assert.equal(exits,1,'Back stays enabled while reconstructing');
});
test('playback waits for each requested frame and pause remains available while seeking',()=>{
 let ready=false;const calls:number[]=[],studio=new ReplayStudio(ui(),[{id:0,kind:'coupe',root:new T.Group()}]as any,doc(),at=>{calls.push(at);return ready;},()=>{});
 studio.togglePlay();assert.equal(studio.time,0);assert.equal(studio.playing,true);studio.update(.05);studio.update(.05);assert.deepEqual(calls,[0,0]);assert.equal(studio.time,0);
 studio.togglePlay();assert.equal(studio.playing,false);ready=true;studio.update(.05);assert.equal(studio.seeking,false);assert.equal(studio.time,0);
 studio.togglePlay();studio.speed=2;studio.update(.05);assert.equal(studio.time,.1);assert.equal(studio.playing,true);
 studio.seek(20);studio.update(.05);assert.equal(studio.playing,false);assert.equal(studio.seeking,false);
});
test('the last slider tick reaches an off-grid recording end exactly',()=>{
 const recording=doc();recording.frames[1].time=20+1/60;
 const dom=ui(),studio=new ReplayStudio(dom,[{id:0,kind:'coupe',root:new T.Group()}]as any,recording,()=>true,()=>{});
 const slider=dom.querySelector<HTMLInputElement>('#studio-time-slider')!;
 slider.oninput!({target:{value:'20'}}as unknown as Event);assert.equal(studio.time,recording.frames[1].time);
 slider.oninput!({target:{value:'19.95'}}as unknown as Event);assert.equal(studio.time,19.95);
});
