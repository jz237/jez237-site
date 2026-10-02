import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {ReplayRecorder,decodeReplay,encodeReplay} from '../src/replay-data';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
const shape=(car:Vehicle)=>[...car.panels,...car.glass].map(m=>({visible:m.visible,p:Array.from(m.geometry.attributes.position.array),n:Array.from(m.geometry.attributes.normal.array)}));
function same(actual:ReturnType<typeof shape>,expected:ReturnType<typeof shape>){
  assert.equal(actual.length,expected.length);for(let i=0;i<actual.length;i++){assert.equal(actual[i].visible,expected[i].visible,'detached assembly visibility');for(const key of ['p','n']as const){assert.equal(actual[i][key].length,expected[i][key].length);for(let j=0;j<actual[i][key].length;j++)assert.ok(Math.abs(actual[i][key][j]-expected[i][key][j])<2e-5,`mesh ${i} ${key}[${j}] differs`);}}
}
test('recorded actual-car dents, detachments and repairs survive file exchange and repeated backward seeks',async()=>{
  await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|wheel-machining)\.glb$/.exec(String(url))![1]);
  try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
  for(const kind of ['coupe','sedan','hatch']as const){
    const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),setup=stockSetup(kind),car=new Vehicle(0,kind,setup.paint,scene,world,{emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any,setup);car.place(10,5,.7);car.render(1);
    const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-01'});let time=0,epoch=0;car.onVisualEvent=e=>{if(e.kind!=='hit')epoch++;recorder.event(0,time,e);};const capture=()=>recorder.capture(time,()=>captureReplayFrame([car],[],[epoch]),true);
    capture();const intact=shape(car);
    // The rendered root can lag behind the physics pose. Record the transform used by damage itself.
    car.current.x+=.2;time=1;
    for(const [local,direction,damage]of [[new T.Vector3(.1,.95,2),new T.Vector3(0,0,-1),23],[new T.Vector3(-1,1.1,.1),new T.Vector3(1,0,.1).normalize(),24],[new T.Vector3(0,.8,2),new T.Vector3(0,0,-1),23]]as const){car.root.updateMatrixWorld(true);car.hit(car.model.localToWorld(local.clone()),direction.clone().applyQuaternion(car.root.quaternion),damage,time);}
    const mirror=car.panels.find(m=>String(m.userData.detachAssembly).startsWith('mirror'))!;car.health=100;car.root.updateMatrixWorld(true);car.hit(new T.Box3().setFromObject(mirror).getCenter(new T.Vector3()),new T.Vector3(1,0,0).applyQuaternion(car.root.quaternion),80,time);
    capture();const damaged=shape(car);assert.notDeepEqual(damaged,intact);assert.ok(damaged.some(m=>!m.visible),'real detached parts captured');
    time=2;car.repair();capture();const repaired=shape(car);same(repaired,intact);
    time=3;car.root.updateMatrixWorld(true);car.hit(car.model.localToWorld(new T.Vector3(.5,.9,-2)),new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion),18,time);capture();const final=shape(car);
    const doc=decodeReplay(encodeReplay(recorder.document())),view=new ReplayScene(doc,scene,world,[]);
    for(const [at,expected]of [[3,final],[0,intact],[1,damaged],[2,repaired],[3,final],[.5,intact],[1,damaged]]as const){view.seek(at);same(shape(view.cars[0]),expected);same(shape(car),final);}
    view.dispose();car.dispose();world.free();
  }
});
