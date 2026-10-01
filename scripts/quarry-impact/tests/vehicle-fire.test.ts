import {restoreGarageBytes} from './garage-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {unitNoise} from '../src/vehicle-fire-profile';
import {VehicleFire} from '../src/vehicle-fire';
import type {Vehicle} from '../src/vehicle';
import {DEFINITIONS} from '../src/rules';
import {DAYLIGHT_DIRECTION} from '../src/static-shadows';
import {restoreFireBytes} from './fire-invariants';
import {restoreWreckFinishBytes} from './wreck-finish-invariants';
import {Effects} from '../src/effects';
import type R from '@dimforge/rapier3d-compat';
const damaged={front:85,rear:0,left:0,right:0,roof:0};
test('only a minority of severely damaged engine bays ignites, and a rarer subset bursts once per repair',()=>{
 let total=0,fires=0;
 for(let seed=0;seed<512;seed++){
  const state=new VehicleThermalState(100,seed/512);let bursts=0;
  assert.equal(state.advance(0,1/60,100,damaged),false,'final blows do not automatically explode');
  for(let i=0;i<5400;i++)if(state.advance(0,1/60,0,damaged))bursts++;
  assert.ok(bursts<=1);total+=bursts;if(state.burning)fires++;assert.ok(state.heat<.01,'finite fuel burns down');
  const frozen=JSON.stringify(state);state.advance(0,0);state.advance(0,NaN);assert.equal(JSON.stringify(state),frozen);
  state.advance(100,1/60);assert.equal(state.exploded,false);assert.equal(state.criticalTime,0);assert.equal(state.heat,0);
 }
 assert.ok(fires>90&&fires<160,`expected roughly 24%, got ${fires}/512`);
 assert.ok(total>3&&total<25,`bursts remain rare, got ${total}/512`);
 const warm=new VehicleThermalState(100,.123);for(let i=0;i<5400;i++)assert.equal(warm.advance(16,1/60,0,damaged),false,'moderate fire cannot explode');
});
test('thermal progression agrees across 30,60,144Hz',()=>{
 const seed=Array.from({length:512},(_,i)=>i/512).find(s=>unitNoise(s)<.24)!;
 const run=(hz:number)=>{const s=new VehicleThermalState(100,seed);for(let i=0;i<hz*20;i++)s.advance(12,1/hz,0,damaged);return s;};
 const a=run(60);for(const hz of [30,144]){const b=run(hz);assert.ok(Math.abs(a.heat-b.heat)<.003);assert.ok(Math.abs(a.smoke-b.smoke)<.003);assert.ok(Math.abs(a.burnTime-b.burnTime)<.04);}
});
test('actual renderer keeps bounded world-space plumes at rotated engine bays and completely resets',()=>{
 const scene=new T.Scene(),camera=new T.PerspectiveCamera();camera.position.set(0,4,18);camera.lookAt(0,2,0);camera.updateMatrixWorld();
 let sparks=0;const fire=new VehicleFire(scene,(_p,n)=>sparks+=n);
 const cars=Array.from({length:8},(_,id)=>({id,kind:['coupe','sedan','hatch'][id%3],health:100,root:new T.Group(),velocity:new T.Vector3(),damageZones:{...damaged}})as unknown as Vehicle);
 cars.forEach((c,i)=>{c.root.position.set((i%4-1.5)*3,1,Math.floor(i/4)*5);if(i===1)c.root.rotation.z=Math.PI;});
 fire.update(cars,1/60,camera);cars.forEach(c=>c.health=0);
 const seed=Array.from({length:512},(_,i)=>i/512).find(s=>unitNoise(s)<.24&&unitNoise(s+2.13)>.3)!;
 for(const e of fire.emitters.values())e.state=new VehicleThermalState(100,seed);
 assert.ok(fire.mesh.material.uniforms.sunView.value.distanceTo(DAYLIGHT_DIRECTION.clone().transformDirection(camera.matrixWorldInverse))<1e-12,'smoke illumination follows the same HDRI sun as the quarry');
 fire.update(cars,1/60,camera);assert.equal(fire.bursts.length,0);
 const rolled=cars[1],emitter=fire.emitters.get(1)!,local=emitter.profile.sites.reduce((a,b)=>a.base>b.base?a:b),expected=new T.Vector3(local.x,local.y,local.z).applyQuaternion(rolled.root.quaternion).add(rolled.root.position);
 assert.ok(fire.emitters.get(1)!.origin.distanceTo(expected)<1e-8);
 for(let i=0;i<900;i++)fire.update(cars,1/60,camera);
 assert.ok(fire.stats.active>150&&fire.stats.active<=640);assert.equal(fire.stats.lights,2);assert.ok(fire.bursts.length<=1);assert.ok(sparks>30);
 assert.ok(fire.particles.some(p=>p.life>0&&p.kind===0&&p.age>3.5),'long smoke lifetime survives an eight-car fire without early pool eviction');
 assert.ok(fire.particles.some(p=>p.life>0&&p.kind===0&&p.p.y>3),'smoke rises even from overturned car');
 const paused=JSON.stringify(fire.stats);fire.update(cars,0,camera);assert.equal(JSON.stringify(fire.stats),paused);
 const oldPuff=fire.particles.find(p=>p.owner===0&&p.kind===0&&p.life>0)!,oldPlace=oldPuff.p.clone();cars[0].root.position.x+=20;fire.update(cars,1/60,camera);
 assert.ok(oldPuff.p.distanceTo(oldPlace)<.1,'already emitted smoke remains in world space when car moves');
 const flame=fire.particles.find(p=>p.owner===0&&p.kind===1&&p.life>0&&p.life-p.age>.03)!;const anchor=flame.p.clone();cars[0].root.position.x+=10;fire.update(cars,1/60,camera);assert.ok(Math.abs(flame.p.x-anchor.x-10)<.1,'live flames remain attached to the leaking vehicle');
 cars.forEach(c=>c.health=100);fire.update(cars,1/60,camera);assert.equal(fire.stats.active,0);assert.ok(fire.audio.every(a=>a.heat===0));
 fire.reset();assert.equal(fire.stats.emitters.length,0);assert.equal(fire.mesh.geometry.instanceCount,0);fire.dispose();assert.equal(scene.children.length,0);
});
test('fire revision preserves prior sources, simulation and original 35 ElevenLabs clips',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
 const revision=JSON.parse(read('source/fire-revision.json').toString());
 for(const [p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreWreckFinishBytes(p,read(p))),e.after,p);assert.equal(hash(restoreFireBytes(p,read(p))),e.before,p);}
 const record=JSON.parse(read('source/coupe-realism-physics.json').toString());for(const[p,h]of Object.entries(record.sourceHashes))assert.equal(hash(restoreGarageBytes(p,read(p))),h,p);
 const audio=JSON.parse(read('public/audio/manifest.json').toString());assert.equal(audio.length,38);
 for(const clip of audio){assert.equal(hash(read('source/audio/'+clip.id+'.mp3')),clip.sha256);if(clip.runtimeSha256)assert.equal(hash(read('public/audio/'+clip.file)),clip.runtimeSha256);}
 for(const id of ['fire-roar','fire-crackle'])assert.equal(audio.find((a:any)=>a.id===id).params.loop,true);
});
test('reset immediately clears uploaded spark opacity even before the next simulation frame',()=>{
 const previous=globalThis.window;
 (globalThis as any).window={innerHeight:1440};
 try{
  const fx=new Effects(new T.Scene(),{} as R.World);fx.emit(new T.Vector3(),12,1,1);fx.update(1/60);
  assert.ok(fx.alphas.some(v=>v>0));fx.reset();assert.ok(fx.alphas.every(v=>v===0));assert.ok(fx.sizes.every(v=>v===0));assert.ok(fx.particles.every(p=>p.life===0));
 }finally{(globalThis as any).window=previous;}
});
