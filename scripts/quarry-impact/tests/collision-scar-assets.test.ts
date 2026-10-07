import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {CAR_KINDS} from '../src/rules';
import {ReplayRecorder,readReplayFile,replayFile} from '../src/replay-data';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
const shape=(car:Vehicle)=>car.panels.map(m=>({visible:m.visible,p:Array.from(m.geometry.attributes.position.array),wear:Array.from(m.geometry.attributes.impactWear.array),paint:Array.from(m.geometry.attributes.transferPaint.array)}));
function same(a:ReturnType<typeof shape>,b:ReturnType<typeof shape>){
 assert.equal(a.length,b.length);for(let i=0;i<a.length;i++){assert.equal(a[i].visible,b[i].visible);for(const field of ['p','wear','paint']as const)for(let j=0;j<a[i][field].length;j++)assert.ok(Math.abs(a[i][field][j]-b[i][field][j])<2e-5,`panel ${i} ${field} ${j}`);}
}
test('every real car has visible cosmetic dents, intact mechanics, repair and exact compressed replay backseeks',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 for(const kind of CAR_KINDS){
  const scene=new T.Scene(),world=new R.World({x:0,y:0,z:0}),setup=stockSetup(kind);
  const car=new Vehicle(0,kind,setup.paint,scene,world,{emit(){},mark(){},detach(){}}as any,setup);car.place(10,5,.7);car.render(1);
  const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-07'});let time=0,epoch=0;
  car.onVisualEvent=e=>{if(e.kind!=='hit')epoch++;recorder.event(0,time,e);};
  const capture=()=>recorder.capture(time,()=>captureReplayFrame([car],[],[epoch]),true);
  capture();const intact=shape(car),mechanics=[...car.wreckParts.wheelDamage,...car.wreckParts.wheelShift.flatMap(v=>v.toArray()),car.engineDamage,car.tyreDamage];
  for(const [local,direction]of [[new T.Vector3(0,.8,4),new T.Vector3(0,0,-1)],[new T.Vector3(-2,.8,0),new T.Vector3(1,0,0)],[new T.Vector3(0,.8,-4),new T.Vector3(0,0,1)],[new T.Vector3(0,3,0),new T.Vector3(0,-1,0)]]as const){
   time++;const before=shape(car);car.root.updateMatrixWorld(true);
   assert.equal(car.scar(car.model.localToWorld(local.clone()),direction.clone().applyQuaternion(car.root.quaternion),new T.Color(0xff4422)),true,kind);
   const after=shape(car);let shift=0;for(let i=0;i<after.length;i++)for(let j=0;j<after[i].p.length;j++)shift=Math.max(shift,Math.abs(after[i].p[j]-before[i].p[j]));
   assert.ok(shift>.003,`${kind}: ${shift} must exceed a numerical-only change`);capture();
  }
  const damaged=shape(car);assert.equal(car.health,100);assert.equal(car.damageLeft+car.damageRight,0);
  assert.deepEqual([...car.wreckParts.wheelDamage,...car.wreckParts.wheelShift.flatMap(v=>v.toArray()),car.engineDamage,car.tyreDamage],mechanics);
  car.health=0;time=5;assert.ok(car.scar(car.model.localToWorld(new T.Vector3(2,.8,0)),new T.Vector3(-1,0,0)));capture();const wrecked=shape(car);assert.equal(car.health,0);
  time=6;car.repair();capture();same(shape(car),intact);
  const doc=await readReplayFile(new File([await replayFile(recorder.document())],'scars.qir'));
  assert.equal(doc.events.filter(e=>e.scar).length,5);assert.ok(doc.events.filter(e=>e.scar).every(e=>e.damage===0));
  const view=new ReplayScene(doc,scene,world,[]);
  for(const [at,expected]of [[6,intact],[4,damaged],[0,intact],[5,wrecked],[4,damaged],[6,intact]]as const){view.seek(at);same(shape(view.cars[0]),expected);}
  view.dispose();car.dispose();world.free();
 }
});
