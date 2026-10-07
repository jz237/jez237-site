import test from 'node:test';import assert from 'node:assert/strict';
import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';import {CAR_KINDS} from '../src/rules';import {stockSetup} from '../src/garage';
import {dentGeometry} from '../src/wreck-geometry';
import {Effects} from '../src/effects';import {withWreckBatch,queueWreckNormals,cancelWreckNormals} from '../src/wreck-batch';
import {ReplayRecorder} from '../src/replay-data';import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
await R.init();const load=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}}as any;
const bytes=(a:ArrayBufferView)=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
function same(a:Vehicle,b:Vehicle){
 for(const key of ['health','engineDamage','damageLeft','damageRight']as const)assert.equal(a[key],b[key],key);
 assert.deepEqual(a.tyreDamage,b.tyreDamage);assert.deepEqual(a.wreckParts.wheelDamage,b.wreckParts.wheelDamage);assert.deepEqual(a.wreckParts.wheelShift,b.wreckParts.wheelShift);
 const am=[...a.panels,...a.glass],bm=[...b.panels,...b.glass];assert.equal(am.length,bm.length);
 am.forEach((m,i)=>{const n=bm[i];assert.equal(m.visible,n.visible,m.name);for(const key of ['position','normal','impactWear','impactAxis','transferPaint'])assert.deepEqual(bytes(m.geometry.attributes[key].array),bytes(n.geometry.attributes[key].array),a.kind+' '+m.name+' '+key);for(const g of [m.geometry,n.geometry]){if(!g.boundingBox)g.computeBoundingBox();if(!g.boundingSphere)g.computeBoundingSphere();}assert.deepEqual(m.geometry.boundingBox,n.geometry.boundingBox);assert.deepEqual(m.geometry.boundingSphere,n.geometry.boundingSphere);});
}
function strike(c:Vehicle,i:number){
 const side=i%2?-1:1,local=new T.Vector3(side*1.4,.5+(i%3)*.27,((i*7)%11-5)*.42),direction=new T.Vector3(-side,-.07,.1).normalize().applyQuaternion(c.root.quaternion),point=c.model.localToWorld(local),paint=new T.Color(i%2?0x994411:0x2266aa);
 if(i%5===4)c.hit(point,direction,18,i,true,paint);else assert.ok(c.scar(point,direction,paint),c.kind+' contact must mark');
}
test('nested and failed synchronous scopes flush once; repairs and disposal can cancel work',()=>{
 const a=new T.Mesh(),b=new T.Mesh();let calls=0;const finish=()=>calls++;
 assert.equal(withWreckBatch(()=>{queueWreckNormals(a,finish);withWreckBatch(()=>queueWreckNormals(a,finish));assert.equal(calls,0);return 42;}),42);assert.equal(calls,1);
 assert.throws(()=>withWreckBatch(()=>{queueWreckNormals(a,finish);queueWreckNormals(b,finish);cancelWreckNormals(b);throw Error('interrupted');}),/interrupted/);assert.equal(calls,2);
 queueWreckNormals(a,finish);assert.equal(calls,3,'a prior failure cannot strand batch depth');
});
test('all eleven vehicles keep exact immediate damage, finish attributes, repairs and mechanics after batched hits',()=>{
 for(const kind of CAR_KINDS){const worlds=[new R.World({x:0,y:0,z:0}),new R.World({x:0,y:0,z:0})],cars=worlds.map(w=>new Vehicle(0,kind,0x334466,new T.Scene(),w,fx,stockSetup(kind)));
 try{
  cars.forEach(c=>{c.place(11,7,.63);c.render(1);});
  for(let block=0;block<3;block++){
   const apply=(c:Vehicle)=>{for(let i=0;i<15;i++){if(block===1&&i===7)c.repair();strike(c,block*15+i);}};
   apply(cars[0]);withWreckBatch(()=>apply(cars[1]));same(cars[0],cars[1]);
  }
  cars[0].repair();withWreckBatch(()=>{strike(cars[1],0);cars[1].repair();});same(cars[0],cars[1]);
  const versions=cars[1].panels.map(p=>(p.geometry.attributes.normal as T.BufferAttribute).version);
  withWreckBatch(()=>{strike(cars[1],1);cars[1].dispose();});assert.deepEqual(cars[1].panels.map(p=>(p.geometry.attributes.normal as T.BufferAttribute).version),versions,'disposed normals cannot be rebuilt by the pending queue');
 }finally{cars[0].dispose();if(cars[1].root.parent)cars[1].dispose();worlds.forEach(w=>w.free());}}
});
test('real detached debris receives finished normals before its geometry is cloned',()=>{
 const previous=(globalThis as any).window;(globalThis as any).window={innerHeight:720};const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),effects=new Effects(scene,world),cars=[0,1].map(i=>new Vehicle(i,'coupe',0x336699,scene,world,fx,stockSetup('coupe')));
 try{
  const a=cars[0].panels.find(p=>p.name.includes('bumper'))!,b=cars[1].panels.find(p=>p.name===a.name)!;assert.ok(a&&b);
  const point=new T.Vector3().fromBufferAttribute(a.geometry.attributes.position,10).applyMatrix4(a.userData.wreckToModel),direction=new T.Vector3(0,0,-1);
  assert.ok(dentGeometry(a,point,direction,12)>0);effects.detach(a,new T.Vector3());
  const normal=b.geometry.attributes.normal as T.BufferAttribute,version=normal.version;
  withWreckBatch(()=>{assert.ok(dentGeometry(b,point,direction,12)>0);assert.equal(normal.version,version);effects.detach(b,new T.Vector3());assert.ok(normal.version>version);});
  for(const key of ['position','normal','impactWear','impactAxis','transferPaint'])assert.deepEqual(bytes(effects.debris[0].mesh.geometry.attributes[key].array),bytes(effects.debris[1].mesh.geometry.attributes[key].array),key);
 }finally{effects.reset();cars.forEach(c=>c.dispose());world.free();(globalThis as any).window=previous;}
});
test('dense replay seeks preserve all normals and paint across repairs, forward replay and repeated backwards seeks',()=>{
 const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),kind='coupe',setup=stockSetup(kind),car=new Vehicle(0,kind,setup.paint,scene,world,fx,setup);
 car.place(10,5,.7);car.render(1);const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-07'});let time=0,epoch=0;car.onVisualEvent=e=>{if(e.kind!=='hit')epoch++;recorder.event(0,time,e);};const capture=()=>recorder.capture(time,()=>captureReplayFrame([car],[],[epoch]),true);capture();
 for(let i=0;i<48;i++){time=i+1;if(i===23)car.repair();else strike(car,i);capture();}
 const view=new ReplayScene(recorder.document(),scene,world,[]);
 try{
  for(const at of [48,0,22,24,47,48]){view.seek(at);const control=new ReplayScene(recorder.document(),scene,world,[]);try{for(let t=0;t<=at;t++)control.seek(t);same(view.cars[0],control.cars[0]);}finally{control.dispose();}}
 }finally{view.dispose();car.dispose();world.free();}
});
