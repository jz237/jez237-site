import test from 'node:test';import assert from 'node:assert/strict';
import {transform} from 'esbuild';import R from '@dimforge/rapier3d-compat';
import * as Physics from '../src/vehicle-physics';
import {CAR_KINDS,type CarKind} from '../src/rules';import {stockSetup} from '../src/garage';
import {clubRoster} from '../src/club-cup';
import {readTrailPrevious} from './trail-invariants';
await R.init();const dt=1/60;
async function previous(file:string){const source=readTrailPrevious(file).toString();const compiled=await transform(source.replace(/from\s*['"]([^'"]+)['"]/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});return import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));}
const prior=await previous('src/vehicle-physics.ts'),oldCups=await previous('src/club-cup.ts');
function rig(kind:CarKind,api:typeof Physics=Physics){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const setup=stockSetup(kind);setup.engine=2;setup.armor=1;const spec=api.vehicleSpecification(kind,setup),car=api.createVehiclePhysics(R,world,kind,spec.mass,setup.armor);car.body.setTranslation({x:0,y:1.3,z:0},true);
 const state:Physics.PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'gravel',gear:1,rpm:850,input:{throttle:0,steer:0,brake:0,handbrake:false}};
 return{world,car,state,step(){api.stepVehiclePhysics(car.body,car.controller,kind,spec,state,dt);world.step();},free(){world.free();}};
}
test('all thirteen preceding vehicles retain exact physical trajectories after the new AWD chassis is added',()=>{
 for(const kind of CAR_KINDS.filter(k=>k!=='trail')){const a=rig(kind,prior),b=rig(kind);try{
  for(let i=0;i<600;i++){const input={throttle:i>=120&&i<400?1:i>=480?-.6:0,brake:i>=400&&i<480?1:0,steer:i>=240&&i<380?.3:0,handbrake:i>=360&&i<385};
   a.state.input=input;b.state.input=input;a.step();b.step();assert.deepEqual(b.car.body.translation(),a.car.body.translation(),kind+' tick '+i);assert.deepEqual(b.car.body.rotation(),a.car.body.rotation());assert.deepEqual(b.car.body.linvel(),a.car.body.linvel());
  }
 }finally{a.free();b.free();}}
});
test('every existing championship roster remains identical for all supported field sizes and lineup restrictions',()=>{
 for(const kind of CAR_KINDS.filter(k=>k!=='trail'))for(let size=2;size<=24;size++)for(const lineup of ['mixed','selected','drivetrain','weight']as const)assert.deepEqual(clubRoster(kind,lineup,size),oldCups.clubRoster(kind,lineup,size),`${kind}/${size}/${lineup}`);
});
