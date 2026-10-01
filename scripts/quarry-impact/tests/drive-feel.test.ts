import {restoreGarageBytes} from './garage-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {DERBY_ARENA,DerbyArenaPhysics,arenaBarrier,expandedArenaFloor} from '../src/derby-arena';
import {createQuarryPhysics,landscapeHeight} from '../src/quarry-layout';
import {structuralDamage,bodyworkDentDamage,impactAudioSeverity} from '../src/bodywork-response';
import {dentGeometry,prepareWreckGeometry} from '../src/wreck-geometry';
import {PuddleSplashes,puddleDepth,type Puddle} from '../src/puddle-splashes';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
import type {Vehicle} from '../src/vehicle';
import {restoreDriveFeelBytes} from './drive-feel-invariants';
import {restoreStructuralBytes} from './structural-realism-invariants';
import {quarryArenaSurface} from '../src/scenery-arena-material';
await R.init();
const water:Puddle={id:0,x:0,z:0,level:.025,radius:4,aspect:.6,phases:[.1,.2,.3,.4]};

test('expanded solo derby provides contiguous physical barriers and restores the original layout on leaving',()=>{
 const world=new R.World({x:0,y:-9.81,z:0}),original=createQuarryPhysics(R,world,false),arena=new DerbyArenaPhysics(world,original.walls,original.statics);
 try{
  const fences=[...original.statics].filter(([id])=>id.startsWith('fence-')).map(([id,c])=>({id,c,p:{...c.translation()},half:c.shape.type===1?c.halfExtents():null}));
  assert.ok(Math.PI*64**2/(Math.PI*46**2)>1.9);assert.equal(arena.walls.length,96);arena.setMode(true);assert.equal(arena.expanded,true);
  assert.ok(original.walls.every(c=>!c.isEnabled()));assert.ok(arena.walls.every(c=>c.isEnabled()));
  for(let i=0;i<96;i++){const p=arenaBarrier(i),next=arenaBarrier((i+1)%96);assert.ok(Math.abs(Math.hypot(p.x-18,p.z-14)-64)<1e-10);assert.ok(Math.hypot(next.x-p.x,next.z-p.z)<4.44);assert.ok(Math.abs(arena.walls[i].translation().y-landscapeHeight(p.x,p.z)-.58)<1e-5);}
  arena.setMode(false);assert.ok(arena.walls.every(c=>!c.isEnabled()));
  for(const f of fences){const p=f.c.translation();for(const k of ['x','y','z']as const)assert.ok(Math.abs(p[k]-f.p[k])<1e-5);if(f.half)assert.deepEqual(f.c.halfExtents(),f.half);}
  arena.setMode(true,true);assert.equal(arena.expanded,false);assert.ok(original.walls.every(c=>c.isEnabled()));assert.ok(arena.walls.every(c=>!c.isEnabled()));
 }finally{world.free();}
});
test('expanded driving surface follows the actual quarry terrain and points upward',()=>{
 const g=expandedArenaFloor(),p=g.attributes.position,n=g.attributes.normal;
 for(let i=0;i<p.count;i++){assert.ok(Math.abs(p.getY(i)-landscapeHeight(p.getX(i),p.getZ(i))-.018)<.00002);assert.ok(n.getY(i)>.95);}
 g.dispose();assert.equal(DERBY_ARENA.spawnRadius,43);
});
test('expanded arena extends gravel deposits across the new footprint while retaining actual puddle wetness coordinates',()=>{
 const original=T.TextureLoader.prototype.load;T.TextureLoader.prototype.load=function(){return new T.Texture();};
 try{
  const shader={vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{}};
  const m=quarryArenaSurface({x:18,z:14,radius:63.45});m.onBeforeCompile(shader as any,{}as T.WebGLRenderer);
  assert.match(shader.fragmentShader,/depositWorld=\(arenaWorld-vec2\(18\.000000,14\.000000\)\)\*45\.0\/63\.450000/);
  assert.match(shader.fragmentShader,/arenaWet=texture2D\(arenaMask,\(arenaWorld\+48\.0\)\/96\.0\)\.a/);
  assert.match(shader.fragmentShader,/smoothstep\(61\.450000,63\.450000,length\(arenaWorld/);
 }finally{T.TextureLoader.prototype.load=original;}
});
test('puddle contact matches the uneven shoreline and rejects airborne or dry tires',()=>{
 assert.equal(puddleDepth(water,0,0,0),1);assert.equal(puddleDepth(water,0,.3,0),0);assert.equal(puddleDepth(water,0,0,3),0);assert.equal(puddleDepth(water,5,0,0),0);
 for(let i=0;i<192;i++){const a=i/192*Math.PI*2,edge=1+Math.sin(a*3+.1*6.28)*.105+Math.sin(a*5+.2*6.28)*.066+Math.sin(a*11+.3*6.28)*.025+Math.sin(a*23+.4*6.28)*.008;assert.equal(puddleDepth(water,Math.cos(a)*4*(edge+.001),.025,-Math.sin(a)*4*.6*(edge+.001)),0);assert.ok(puddleDepth(water,Math.cos(a)*4*(edge-.02),.025,-Math.sin(a)*4*.6*(edge-.02))>0);}
});
const wetCar=(speed:number,grounded=true)=>({id:0,health:100,velocity:new T.Vector3(0,0,speed),right:new T.Vector3(1,0,0),controller:{wheelContactPoint:(i:number)=>({x:i%2?.8:-.8,y:0,z:i<2?1:-1}),wheelIsInContact:()=>grounded}}as unknown as Vehicle);
test('tire spray and ripples scale with speed, pause exactly, have bounded pools and reset immediately',()=>{
 const run=(speed:number,hz=60)=>{const scene=new T.Scene(),fx=new PuddleSplashes(scene,()=>.5);for(let i=0;i<hz;i++)fx.update([wetCar(speed)],[water],1/hz,true);return fx;};
 const slow=run(2),fast=run(15);assert.ok(fast.emitted>slow.emitted*3);assert.ok(fast.stats.active>slow.stats.active);assert.ok(fast.stats.ripples>0);assert.equal(fast.stats.wetWheels,4);
 for(const hz of [30,144]){const b=run(15,hz);assert.equal(b.emitted,fast.emitted);assert.equal(b.stats.active,fast.stats.active);}
 assert.equal(run(0).emitted,0);const air=new PuddleSplashes(new T.Scene());air.update([wetCar(15,false)],[water],.05,true);assert.equal(air.emitted,0);
 const paused=JSON.stringify(fast.drops);fast.update([wetCar(15)],[water],0,true);assert.equal(JSON.stringify(fast.drops),paused);
 for(let i=0;i<600;i++)fast.update(Array.from({length:8},(_,id)=>Object.assign(wetCar(45),{id})),[water],1/60,true);
 assert.ok(fast.stats.active<=768&&fast.stats.ripples<=48);for(let i=0;i<120;i++)fast.update([],[water],1/60,false);assert.equal(fast.stats.active,0);assert.equal(fast.stats.ripples,0);
 fast.reset();assert.equal(fast.emitted,0);assert.equal(fast.spray.geometry.instanceCount,0);assert.equal(fast.rings.geometry.instanceCount,0);
});
test('low-speed pushing no longer crushes a car; hard hits retain weighty audio and gradual body deformation',()=>{
 for(let i=0;i<600;i++)assert.equal(structuralDamage(12000,.4),0);
 assert.equal(structuralDamage(2800,15),0);assert.ok(structuralDamage(9000,12)>3&&structuralDamage(9000,12)<5);assert.equal(structuralDamage(60000,30),23);assert.ok(impactAudioSeverity(9000)>8);
 const sheet=(damage:number)=>{const root=new T.Group(),panel=new T.Mesh(new T.PlaneGeometry(2,1,20,10),new T.MeshStandardMaterial());panel.name='panel_test';root.add(panel);prepareWreckGeometry(root);const original=new Float32Array(panel.geometry.attributes.position.array);dentGeometry(panel,new T.Vector3(),new T.Vector3(0,0,-1),damage);return Math.max(...Array.from(panel.geometry.attributes.position.array).map((v,i)=>Math.abs(v-original[i])));};
 assert.ok(sheet(bodyworkDentDamage(5))<sheet(5)*.5);assert.ok(sheet(bodyworkDentDamage(23))>sheet(bodyworkDentDamage(5))*3);
});
test('low health or crushed doors alone cannot ignite; engine-bay smoke is distinct from burning fuel',()=>{
 for(let i=0;i<64;i++)for(const zones of [{front:0,rear:0,left:100,right:0,roof:0},{front:0,rear:0,left:0,right:0,roof:100}]){
  const s=new VehicleThermalState(100,i/64);for(let j=0;j<600;j++)s.advance(0,.05,0,zones);assert.equal(s.heat,0);assert.equal(s.smoke,0);assert.equal(s.exploded,false);
 }
 const s=new VehicleThermalState(100,.1);for(let i=0;i<600;i++)s.advance(35,.05,0,{front:65,rear:0,left:0,right:0,roof:0});assert.equal(s.heat,0);assert.ok(s.smoke>0&&s.smoke<.33);assert.equal(s.soot,0);
});
test('this revision remains reversible and preserves every shared server input and original model',()=>{
 const read=(p:string)=>fs.readFileSync(new URL('../'+p,import.meta.url)),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),revision=JSON.parse(read('source/drive-feel-revision.json').toString());
 for(const[p,e]of Object.entries<any>(revision.files)){assert.equal(hash(restoreStructuralBytes(p,read(p))),e.after,p);assert.equal(hash(restoreDriveFeelBytes(p,read(p))),e.before,p);}
 const shared=JSON.parse(read('source/coupe-realism-physics.json').toString());for(const[p,h]of Object.entries(shared.sourceHashes))assert.equal(hash(restoreGarageBytes(p,read(p))),h,p);
 const packed=JSON.parse(read('source/model-packing.json').toString());for(const e of Object.values<any>(packed.models))assert.equal(hash(read('public/'+e.source)),e.sourceSha256);
});
