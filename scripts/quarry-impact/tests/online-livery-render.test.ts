import {newLayer} from '../src/livery-data';
import {stockSetup} from '../src/garage';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {Simulation} from '../multiplayer/simulation';
import {STEP,type Snapshot} from '../multiplayer/protocol';
import {structuralDamage} from '../src/bodywork-response';
import {OnlineView} from '../src/online-view';
await R.init();
const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|wheel-machining)\.glb$/.exec(String(url))![1]);
try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const humans=new Set([0,1,2,3,4,5,6,7]);
const envelope=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const near=(a:number,b:number,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
test('remote designs survive repair/rebuild without per-frame atlas updates',()=>{
 const sim=new Simulation(R,'playground'),world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();let cars:Vehicle[]=[];
 const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}}as any,()=>cars,c=>cars=c),s=envelope(sim);s.liverySupport=true;s.liveryRevision=1;
 const design=[newLayer('number','right'),newLayer('stripe','top')];view.network.liveries={revision:1,cars:s.cars.map(c=>({id:c.id,kind:c.kind,layers:c.id===0?design:[]}))};
 try{view.receive(s);const car=cars.find(c=>c.id===0)!;assert.deepEqual(car.setup.livery,design);let updates=0;const original=car.livery.set.bind(car.livery);car.livery.set=layers=>{updates++;original(layers);};
 s.cars.forEach(c=>delete c.dents);for(let i=0;i<20;i++){s.tick++;view.receive(s);}assert.equal(updates,0,'steady snapshots must not normalize/rasterize decals');
 s.cars[0].repair++;view.receive(s);assert.deepEqual(car.setup.livery,design);assert.equal(updates,0);
 view.network.liveries={...view.network.liveries,revision:2,cars:view.network.liveries.cars.map(c=>({...c,layers:[]}))};s.liveryRevision=2;view.receive(s);assert.equal(updates,1);assert.deepEqual(car.setup.livery,[]);
 view.network.liveries={revision:3,cars:s.cars.map(c=>({id:c.id,kind:c.kind,layers:c.id===0?design:[]}))};s.liveryRevision=3;s.tick=0;view.receive(s);assert.notEqual(cars.find(c=>c.id===0),car);assert.deepEqual(cars.find(c=>c.id===0)!.setup.livery,design);
 }finally{cars.forEach(c=>c.dispose());sim.dispose();world.free();}
});
