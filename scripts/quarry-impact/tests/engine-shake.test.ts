import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SHAKE,EngineShake,NO_SHAKE,plantedWheelY} from '../src/engine-shake';
const run=(s:EngineShake,seconds:number,...a:[boolean,number,number,number,boolean,number])=>{let peak=0,low=0;for(let i=0;i<Math.round(seconds*60);i++){const o=s.step(1/60,...a);peak=Math.max(peak,-o.roll);low=Math.min(low,-o.roll);}return {peak,low};};
test('a stab of throttle rocks the body over (left side up), it settles at the torque lean, then springs back past level on the lift',()=>{
 const s=new EngineShake();const stab=run(s,1.5,true,1,0,1,false,0);
 assert.ok(stab.peak>SHAKE.torque*1.15,'overshoots on the stab');assert.ok(Math.abs(-s.out.roll-SHAKE.torque)<SHAKE.idle*1.5,'settles at the lean');
 const lift=run(s,1.5,true,0,0,1,false,0);assert.ok(lift.low<-SHAKE.torque*.15,'swings back past level');assert.ok(Math.abs(s.out.roll)<SHAKE.idle*1.5,'and settles');
 const broken=new EngineShake();run(broken,1.5,true,1,0,1,true,0);assert.ok(Math.abs(-broken.out.roll-SHAKE.torque*SHAKE.mounts)<SHAKE.idle*1.5,'broken mounts lean further');
 const moving=new EngineShake();run(moving,1.5,true,1,1,1,false,SHAKE.fade*2);assert.ok(Math.abs(moving.out.roll)<1e-9&&moving.out.lift===0,'no rock or buzz at speed');
});
test('the idle buzz is faint on a sound engine and a shudder on a battered one; a dead engine is still',()=>{
 const sound=run(new EngineShake(),2,true,0,0,1,false,0),worn=run(new EngineShake(),2,true,0,1,1,false,0);
 assert.ok(sound.peak>0&&sound.peak<=SHAKE.idle,'faint');assert.ok(worn.peak>SHAKE.rough*.8,'rough');
 const dead=new EngineShake();run(dead,1,false,1,1,0,true,0);assert.deepEqual({...dead.out},{...NO_SHAKE});assert.equal(dead.kicks,0);
 const s=new EngineShake();s.step(1/60,true,0,1,.5,false,0);s.step(1/60,true,0,1,.5,false,0);assert.equal(s.kicks,1,'a misfire kicks once');
 s.step(1/60,true,0,1,1,false,0);s.step(1/60,true,0,1,.2,false,0);assert.equal(s.kicks,2,'the next misfire kicks again');
 s.reset();assert.equal(s.kicks,0);assert.deepEqual({...s.out},{...NO_SHAKE});
 const n=new EngineShake();n.step(1/60,true,NaN,NaN,NaN,false,NaN);n.step(0,true,1,1,0,true,0);assert.ok(Number.isFinite(n.out.roll)&&Number.isFinite(n.out.lift));
});
test('the wheels stay where they were while the body rolls and pitches',()=>{
 const model=new T.Group(),wheel=new T.Object3D();model.add(wheel);model.position.y=.4;
 const shake={roll:SHAKE.torque*SHAKE.mounts,pitch:-SHAKE.rough,lift:.006};let ok=true;
 for(const [x,z] of [[.8,1.3],[-.8,1.3],[.8,-1.3],[-.8,-1.3]]){
  model.rotation.set(0,0,0);model.position.y=.4;wheel.position.set(x,-.6,z);model.updateMatrixWorld(true);const before=wheel.getWorldPosition(new T.Vector3()).y;
  model.rotation.set(shake.pitch,0,shake.roll);model.position.y=.4+shake.lift;wheel.position.y=plantedWheelY(-model.position.y-.2,x,z,shake);model.updateMatrixWorld(true);
  ok&&=Math.abs(wheel.getWorldPosition(new T.Vector3()).y-before)<.002;
 }
 assert.ok(ok,'planted within 2 mm');
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('const shake=this.extendedDamage?this.engineShake.out:NO_SHAKE;')&&vehicle.includes('this.model.rotation.set(shake.pitch,0,shake.roll);this.model.position.y=this.modelY+shake.lift;'));
 assert.ok(vehicle.includes('if(this.extendedDamage)this.engineShake.step(dt,this.health>0&&!(this.engineStall!>0)&&!this.engineOut,'));
});
