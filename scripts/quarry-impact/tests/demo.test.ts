import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {DemoDirector,DEMO_CAMERAS,type DemoCamera} from '../src/demo-director';
import {VehicleFire} from '../src/vehicle-fire';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import {fireProfile,unitNoise} from '../src/vehicle-fire-profile';
import {restoreDemoBytes} from './demo-invariants';
import {restorePerformanceBytes} from './performance-invariants';
import type {Vehicle} from '../src/vehicle';
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js';
test('new release preserves the exact preceding release and all shared server inputs',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
 const manifest=JSON.parse(read('source/demo-revision.json').toString());
 for(const [p,e]of Object.entries<any>(manifest.files)){assert.equal(hash(restorePerformanceBytes(p,read(p))),e.after,p);assert.equal(hash(restoreDemoBytes(p,read(p))),e.before,p);}
 const shared=JSON.parse(read('source/coupe-realism-physics.json').toString());for(const[p,h]of Object.entries(shared.sourceHashes))assert.equal(hash(read(p)),h,p);
});
test('each camera keeps a finite view above the terrain, including overturned targets',()=>{
 const director=new DemoDirector(),camera=new T.PerspectiveCamera(52,16/9,.1,850),root=new T.Group();
 root.position.set(0,1,0);root.rotation.z=Math.PI;
 const car={id:0,root,current:root.position,speed:12,health:5,finished:false}as Vehicle;
 const orbit={target:new T.Vector3(),enabled:false,update(){}}as unknown as OrbitControls;
 for(const view of Object.keys(DEMO_CAMERAS)as DemoCamera[]){director.select(view);director.update([car],camera,orbit,1/60,false);assert.ok(camera.position.toArray().every(Number.isFinite));assert.ok(camera.position.y>=.65);assert.ok(camera.quaternion.toArray().every(Number.isFinite));}
 director.select('overview');director.update([car],camera,orbit,1/60,true);assert.ok(camera.position.y>200);
});
test('fire sources differ by car and damaged side, preserving world-space buoyancy',()=>{
 const profiles=Array.from({length:20},(_,i)=>fireProfile('coupe',i/20));
 assert.equal(new Set(profiles.map(p=>JSON.stringify(p.sites))).size,20);
 const camera=new T.PerspectiveCamera(),scene=new T.Scene();camera.position.set(0,4,12);camera.lookAt(0,1,0);
 const root=new T.Group(),car={id:0,kind:'coupe',root,health:8,velocity:new T.Vector3(),wreckParts:{zones:{front:0,rear:48,left:0,right:0,roof:0}}}as unknown as Vehicle;
 root.position.y=1;root.rotation.z=Math.PI;
 const seed=Array.from({length:512},(_,i)=>i/512).find(s=>unitNoise(s)<.24)!;
 const fire=new VehicleFire(scene,()=>{},()=>seed);for(let i=0;i<1200;i++)fire.update([car],1/60,camera);
 const e=fire.emitters.get(0)!;assert.equal(e.sites.reduce((a,b)=>a.weight>b.weight?a:b).name,'rear-leak');assert.ok(e.origin.z<0);
 assert.ok(fire.particles.some(p=>p.life>0&&p.kind===0&&p.p.y>2));
 const frozen=JSON.stringify(fire.stats);fire.update([car],NaN,camera);assert.equal(JSON.stringify(fire.stats),frozen);
 fire.dispose();
});
test('rare explosions have consistent delay at different simulation rates and never repeat',()=>{
 const seed=Array.from({length:1000},(_,i)=>i/1000).find(s=>unitNoise(s)<.24&&unitNoise(s+9.37)<.12&&unitNoise(s+2.13)>.3)!;
 const run=(hz:number)=>{const state=new VehicleThermalState(100,seed);let ignition=0;for(let i=0;i<90*hz;i++)if(state.advance(0,1/hz,0,{front:85,rear:0,left:0,right:0,roof:0})){assert.equal(ignition,0);ignition=(i+1)/hz;}return ignition;};
 const time=run(60);assert.ok(time>15&&time<45);for(const hz of [30,144])assert.ok(Math.abs(time-run(hz))<.10);
});
