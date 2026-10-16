import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';import {loadCars} from '../src/assets';import {Vehicle} from '../src/vehicle';import {stockSetup} from '../src/garage';import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import{ReplayRecorder,readReplayFile,replayFile}from'../src/replay-data';import{captureReplayFrame,ReplayScene}from'../src/replay-scene';
test('all armored production cars lose protection locally, repair it, and replay the resolved damage exactly',async()=>{
 await R.init();const old=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>{const match=/\/models\/([a-z-]+)\.glb$/.exec(String(url));assert.ok(match);return loadCarWithoutImages(match[1]);};try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=old;}
 for(const kind of CAR_KINDS){const world=new R.World({x:0,y:0,z:0}),scene=new T.Scene(),setup={...stockSetup(kind),armor:3},car=new Vehicle(0,kind,setup.paint,scene,world,{emit(){},mark(){},detach(){}}as any,setup);car.place(0,0,0);car.render(1);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-16'});let time=0,epoch=0;car.onVisualEvent=e=>{if(e.kind!=='hit')epoch++;recorder.event(0,time,e);};const capture=()=>recorder.capture(time,()=>captureReplayFrame([car],[],[epoch]),true);capture();
 const front=new T.Vector3(0,car.root.position.y,DEFINITIONS[kind].halfLength),direction=new T.Vector3(0,0,-1),loss=[];
 for(let i=0;i<10;i++){const health=car.health;time++;car.collisionHit(front,direction,8,time);loss.push(health-car.health);capture();}
 assert.ok(loss[9]>loss[0],kind+' repeated front hits lose armor');assert.ok(car.health>0);
 const damagedHealth=car.health,structure=[...car.structuralDamage!];time++;car.collisionHit(new T.Vector3(0,car.root.position.y,-DEFINITIONS[kind].halfLength),new T.Vector3(0,0,1),8,time);assert.ok(Math.abs(damagedHealth-car.health-loss[0])<1e-8,kind+' rear armor remains intact');capture();
 time++;car.repair();capture();assert.deepEqual(car.structuralDamage,[0,0,0,0,0]);
 const doc=await readReplayFile(new File([await replayFile(recorder.document())],'armor.qir')),view=new ReplayScene(doc,scene,world,[]);
 view.seek(10);assert.ok(Math.abs(view.cars[0].health-damagedHealth)<1e-4);for(let i=0;i<5;i++)assert.ok(Math.abs(view.cars[0].structuralDamage![i]-structure[i])<1e-5,kind+' replay structure');view.seek(12);assert.equal(view.cars[0].health,100);view.seek(10);assert.ok(Math.abs(view.cars[0].health-damagedHealth)<1e-4);
 view.dispose();car.dispose();world.free();
 }
});
