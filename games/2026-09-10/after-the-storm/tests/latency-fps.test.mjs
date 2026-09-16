import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {wakeTrail,wakeHeight,recordWake,clearWakeTrail} from '../wake-field.js';
import {createWakeSampler} from '../wake-sampler.js';
import {createInputSampler,playerInput} from '../player-input.js';
import {touchState} from '../touch-controls.js';
import {touchHelm} from '../riding-controls.js';
import {prepareRenderTransforms,restoreRenderTransforms} from '../render-transforms.js';
import {createRuntimeProbe} from '../runtime-probe.js';
import {wave,craftFields} from '../simulation.js';
import {advanceSpray} from '../spray-physics.js';

test('spatial wake batches preserve exact sums at negative coordinates, bin edges, packet expiry and reset',()=>{
 clearWakeTrail();const sampler=createWakeSampler();
 for(let i=0;i<96;i++)recordWake((i*37%101)-50,(i*13%101)-50,i*.12,i*.17,.4+i%9*.14);
 let nonzero=0;
 for(const time of [0,.2,7,12,18,29.4,40])for(const storm of [0,.6,1]){
  sampler.prepare(time,storm);
  for(let i=0;i<4000;i++){
   const x=i%4===0?(i%13-6)*16+1e-10:(i*11.137%140)-70,z=(i*9.713%140)-70;
   const expected=wakeHeight(x,z,time,storm);if(expected!==0)nonzero++;
   assert.equal(sampler.height(x,z),expected,`${time}/${storm}/${x}/${z}`);
  }
 }
 assert.ok(nonzero>500);clearWakeTrail();sampler.prepare(12,1);assert.equal(sampler.height(0,0),0);
 recordWake(0,0,12,0,1.4);sampler.prepare(13,1);assert.equal(sampler.height(.3,0),wakeHeight(.3,0,13,1));
});

test('droplets follow identical positions, velocity and size with prepared wakes and reused wind',()=>{
 clearWakeTrail();for(let i=0;i<96;i++)recordWake(i%12-6,Math.floor(i/12)-4,0,i*.13,1.2);
 craftFields.forEach((c,i)=>Object.assign(c,{x:i*3,z:i,power:.8,heading:i*.5}));
 const sampler=createWakeSampler(),a=new Float32Array([0,2,0]),b=a.slice();
 const p={vx:2,vy:3,vz:1,size:.08,mist:true,atomize:.3},q={...p};
 for(let i=0;i<240;i++){const t=i/60;sampler.prepare(t,.65);
  advanceSpray(p,a,0,1/60,.65,(x,z)=>wave(x,z,t,.65)+.02,t);
  advanceSpray(q,b,0,1/60,.65,(x,z,wind)=>wave(x,z,t,.65,wind,sampler.height)+.02,t);
  assert.deepEqual(b,a);assert.deepEqual(q,p);
 }
});

test('reused control records retain mappings and clear released touch keys without affecting player two',()=>{
 const sample=createInputSampler(),touch=touchState(),keys={ArrowUp:true,KeyA:true};touch.press(1,'KeyW');
 const pair=sample(keys,touch.read(),[],true),first=pair[0],second=pair[1];
 assert.deepEqual(first,playerInput({...keys,...touch.keys()},null,0,true));
 assert.deepEqual(second,playerInput(keys,null,1,true));touch.release(1);
 assert.equal(sample(keys,touch.read(),[],true),pair);assert.equal(pair[0],first);assert.equal(pair[1],second);assert.equal(first.throttle,0);assert.equal(second.throttle,1);
 const pads=[{axes:[.7,.3],buttons:Array.from({length:16},(_,i)=>({pressed:i===6,value:i===7?.6:0}))}];
 assert.deepEqual(sample({},touch.read(),pads),playerInput({},pads[0]));
 const input={steer:.5,throttle:1,brake:true},before={...input};
 assert.equal(touchHelm(input,{enabled:true,active:true,steering:true,steer:-.2,autoThrottle:true},input),input);
 assert.equal(input.throttle,0);assert.equal(input.steer,-.2);assert.equal(touchHelm(before,{enabled:true,active:true}).throttle,0);assert.deepEqual(before,{steer:.5,throttle:1,brake:true});
});

test('three water views reuse exact object matrices and the next view refreshes moved objects',()=>{
 const scene=new T.Scene(),parent=new T.Group(),child=new T.Object3D();scene.add(parent);parent.add(child);parent.position.set(4,2,3);child.position.set(1,0,2);
 let updates=0;const update=scene.updateMatrixWorld.bind(scene);scene.updateMatrixWorld=()=>{updates++;update();};
 const automatic=prepareRenderTransforms(scene),expected=child.matrixWorld.clone();
 try{for(let pass=0;pass<3;pass++){if(scene.matrixWorldAutoUpdate)scene.updateMatrixWorld();assert.deepEqual(child.matrixWorld,expected);}}
 finally{restoreRenderTransforms(scene,automatic);}
 assert.equal(updates,1);assert.equal(scene.matrixWorldAutoUpdate,true);
 parent.position.x=8;const next=prepareRenderTransforms(scene);assert.equal(child.matrixWorld.elements[12],9);restoreRenderTransforms(scene,next);assert.equal(updates,2);
 scene.matrixWorldAutoUpdate=false;const manual=prepareRenderTransforms(scene);restoreRenderTransforms(scene,manual);assert.equal(updates,2);assert.equal(scene.matrixWorldAutoUpdate,false);
});

test('input timing reports only consumed events and labels submission separately from presentation',()=>{
 const p=createRuntimeProbe(3);p.event(10,12);p.begin();p.consume(15);p.renderBegin(19);p.renderEnd(23);p.frame(16.7,14,14,18,24,true);
 const s=p.snapshot();assert.equal(s.inputSamples,1);assert.equal(s.eventToSimulation.mean,5);assert.equal(s.eventToRenderSubmission.mean,14);assert.equal(s.render.mean,4);
 p.event(25,26);p.frame(16.7,25,25,26,28,false);p.consume(30);p.frame(16.7,29,29,30,32,true);assert.equal(p.snapshot().inputSamples,1);
 p.event(-1,30);p.event(31,30);p.event(1,2000);p.consume(2001);p.frame(16.7,2000,2000,2001,2003,true);assert.equal(p.snapshot().inputSamples,1);
});
