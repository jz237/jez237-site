import {simulateCornering} from './setup-cornering';
import R from '@dimforge/rapier3d-compat';
import {normalizeSetup,stockSetup,type Setup} from './garage';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from './vehicle-physics';
import type {CarKind} from './rules';

export type BenchmarkSurface='asphalt'|'gravel';
export type SetupBenchmark={acceleration:number|null;speed:number;braking:number|null;cornering:number|null};
const dt=1/60,target=100/3.6,stop=.1;
/** Paint and decals do not alter a physical measurement. */
export function benchmarkKey(kind:CarKind,input:Setup,surface:BenchmarkSurface){
 const s=normalizeSetup(input,kind);return JSON.stringify([kind,surface,s.engine,s.tires,s.armor,s.tune]);
}
/** A separate, intact car on a flat straight. Each yield bounds main-thread work.
 * Uses the same chassis, suspension, drive, tyres and brakes as an actual race. */
export function* simulateSetup(kind:CarKind,input:Setup,surface:BenchmarkSurface):Generator<void,SetupBenchmark>{
 const setup=normalizeSetup(input,kind),spec=vehicleSpecification(kind,setup);
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;
 try{
  world.createCollider(R.ColliderDesc.cuboid(50,.5,10000).setTranslation(0,-.5,0));
  const {body,controller}=createVehiclePhysics(R,world,kind,spec.mass,setup.armor);
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface,gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  body.setTranslation({x:0,y:1.2,z:0},true);
  const step=()=>{stepVehiclePhysics(body,controller,kind,spec,state,dt);world.step();return body.linvel().z;};
  // Settle under gravity before starting the clock, like the race countdown.
  for(let i=0;i<180;i++){step();if(i%60===59)yield;}
  let acceleration:number|null=null,previous=0,speed=0;
  state.input.throttle=1;
  for(let i=0;i<2400;i++){
   speed=step();
   if(acceleration===null&&speed>=target)acceleration=(i+(target-previous)/(speed-previous))*dt;
   previous=speed;if(i%60===59)yield;
  }
  const result:SetupBenchmark={acceleration,speed:speed*3.6,braking:null,cornering:null};
  // A standard 100 km/h entry, independent of acceleration ability. Settle
  // the same tuned chassis afresh so pitch at the end of the speed run does
  // not contaminate braking. No fake distance or force-derived estimate.
  body.setTranslation({x:0,y:1.2,z:0},true);body.setRotation({x:0,y:0,z:0,w:1},true);
  body.setLinvel({x:0,y:0,z:0},true);body.setAngvel({x:0,y:0,z:0},true);
  state.input.throttle=0;state.steering=0;
  for(let i=0;i<180;i++){step();if(i%60===59)yield;}
  body.setLinvel({x:0,y:0,z:target},true);state.input.brake=1;
  const start=body.translation().z;
  for(let i=0;i<1200;i++){
   const v=step();
   if(Math.abs(v)<=stop){result.braking=Math.max(0,body.translation().z-start);break;}
   if(i%60===59)yield;
  }
  if(!Number.isFinite(result.speed)||result.speed<0)throw new Error('The test car did not complete a valid straight run.');
  result.cornering=yield* simulateCornering(kind,setup,surface);
  return result;
 }finally{world.free();}
}
let initialized:Promise<void>|undefined;
const cache=new Map<string,SetupBenchmark>();
export async function benchmarkSetup(kind:CarKind,setup:Setup,surface:BenchmarkSurface,signal:AbortSignal):Promise<SetupBenchmark>{
 const aborted=()=>{if(signal.aborted)throw new DOMException('Test cancelled','AbortError');};
 aborted();const key=benchmarkKey(kind,setup,surface),cached=cache.get(key);if(cached)return {...cached};
 await(initialized??=R.init());aborted();
 const run=simulateSetup(kind,setup,surface);
 try{
  while(true){
   aborted();const result=run.next();
   if(result.done){if(cache.size>=64)cache.delete(cache.keys().next().value!);cache.set(key,result.value);return {...result.value};}
   await new Promise<void>(resolve=>setTimeout(resolve,0));
  }
 }finally{run.return({acceleration:null,speed:0,braking:null,cornering:null});}
}
export const benchmarkStock=(kind:CarKind,surface:BenchmarkSurface,signal:AbortSignal)=>benchmarkSetup(kind,stockSetup(kind),surface,signal);
