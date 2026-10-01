import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {newLayer} from '../src/livery';
import {ReplayRecorder,decodeReplay,encodeReplay} from '../src/replay-data';
import {captureReplayFrame,ReplayScene} from '../src/replay-scene';
test('all actual cars retain livery coordinates through damage, repair and replay without shared-material pollution',async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
 for(const kind of ['coupe','sedan','hatch']as const){const setup=stockSetup(kind);setup.livery=[newLayer('number','right'),newLayer('checker','top')];const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;}} as any;
 const car=new Vehicle(0,kind,setup.paint,scene,world,fx,setup),stock=new Vehicle(1,kind,0xffffff,scene,world,fx);car.place(0,0,0);car.render(1);
 const panels=car.panels.filter(m=>m.geometry.hasAttribute('liveryNormal'));assert.ok(panels.length>2,kind);assert.ok(stock.panels.every(m=>!m.geometry.hasAttribute('liveryNormal')),'stock cars allocate no artwork attributes');
 const coords=panels.map(m=>Array.from(m.geometry.attributes.wreckPosition.array)),normals=panels.map(m=>Array.from(m.geometry.attributes.liveryNormal.array));assert.ok(normals.flat().every(Number.isFinite));
 const m=panels[0].material as T.MeshPhysicalMaterial,s={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(s as any,{} as any);assert.ok(s.fragmentShader.indexOf('texture2D(liveryAtlas')<s.fragmentShader.indexOf('float dust='),'artwork beneath wear');assert.ok(s.fragmentShader.includes('wreckChar'));assert.ok(s.fragmentShader.includes('carDirt'));assert.equal((s.uniforms as any).liveryAtlas,car.livery.atlas);
 const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind,setup}],props:0,created:'2026-10-01'});car.onVisualEvent=e=>recorder.event(0,1,e);recorder.capture(0,()=>captureReplayFrame([car],[],[0]),true);
 car.root.updateMatrixWorld(true);car.hit(car.model.localToWorld(new T.Vector3(-1,.9,1.1)),new T.Vector3(1,0,0),65,1);recorder.capture(1,()=>captureReplayFrame([car],[],[0]),true);
 for(let i=0;i<panels.length;i++){assert.deepEqual(Array.from(panels[i].geometry.attributes.wreckPosition.array),coords[i]);assert.deepEqual(Array.from(panels[i].geometry.attributes.liveryNormal.array),normals[i]);}
 car.repair();const doc=decodeReplay(encodeReplay(recorder.document())),view=new ReplayScene(doc,scene,world,[]);assert.deepEqual(view.cars[0].setup.livery,setup.livery);view.seek(1);view.seek(0);assert.deepEqual(view.cars[0].setup.livery,setup.livery);
 let disposed=0;car.livery.atlas.value=new T.DataTexture(new Uint8Array(4),1,1);car.livery.atlas.value.addEventListener('dispose',()=>disposed++);car.livery.finishAtlas.value=new T.DataTexture(new Uint8Array(4),1,1);car.livery.finishAtlas.value.addEventListener('dispose',()=>disposed++);car.livery.set([]);assert.equal(disposed,2);view.dispose();car.dispose();stock.dispose();world.free();
 }
});
