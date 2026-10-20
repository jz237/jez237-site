import test from 'node:test';
import assert from 'node:assert/strict';
import {EngineMisfire,MISFIRE_ONSET,MISFIRE_POWER} from '../src/engine-misfire';
const run=(damage:number,throttle=1,seconds=30,seed=7)=>{const m=new EngineMisfire(seed);let cut=0,cuts=0,backfires=0,was=1;for(let i=0;i<seconds*60;i++){const f=m.update(1/60,damage,throttle);if(f<1)cut+=1/60;if(f<1&&was===1)cuts++;if(m.backfire)backfires++;was=f;}return{cut,cuts,backfires};};
test('a healthy or lightly damaged engine never misfires, and lifting off stops it',()=>{
 for(const d of [0,.1,MISFIRE_ONSET])assert.equal(run(d).cuts,0);
 assert.equal(run(1,0).cuts,0,'no misfires off throttle');
});
test('misfires grow more frequent and longer with damage and some end in backfires',()=>{
 const mid=run(.55),bad=run(1);
 assert.ok(mid.cuts>3&&bad.cuts>mid.cuts,JSON.stringify({mid,bad}));
 assert.ok(bad.cut>mid.cut,'more time cut');assert.ok(bad.cut<30*.35,'still drivable');
 assert.ok(bad.backfires>0&&bad.backfires<=bad.cuts);
 const m=new EngineMisfire(3);let low=1;for(let i=0;i<600;i++)low=Math.min(low,m.update(1/60,1,1));assert.equal(low,MISFIRE_POWER);
});
test('misfires are deterministic from the seed and reset cleanly',()=>{
 assert.deepEqual(run(.8,1,20,11),run(.8,1,20,11));
 const m=new EngineMisfire(5);for(let i=0;i<300;i++)m.update(1/60,1,1);m.reset();assert.ok(m.factor===1&&!m.backfire);
 const fresh=new EngineMisfire(5),a:number[]=[],b:number[]=[];for(let i=0;i<300;i++){a.push(m.update(1/60,1,1));b.push(fresh.update(1/60,1,1));}assert.deepEqual(a,b);
});
test('a misfire cut reaches the wheels through the drivetrain',async()=>{
 const R=(await import('@dimforge/rapier3d-compat')).default;await R.init();
 const {createVehiclePhysics,vehicleSpecification}=await import('../src/vehicle-physics');const {createVehicleDrive}=await import('../src/drivetrain/chassis');
 const run=(factor:number)=>{const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(800,.5,800).setTranslation(0,-.5,0));
  const spec=vehicleSpecification('coupe'),{body,controller}=createVehiclePhysics(R,world,'coupe',spec.mass),drive=createVehicleDrive(body,controller,'coupe');
  const state={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt' as const,gear:1,rpm:850,misfireFactor:factor,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  try{body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<90;i++){drive.step(spec,state,1/60);world.step();}state.input.throttle=1;for(let i=0;i<120;i++){drive.step(spec,state,1/60);world.step();}return state.speed;}finally{world.free();}};
 const full=run(1),cut=run(MISFIRE_POWER);assert.ok(cut<full*.6,`${cut} vs ${full}`);
});
