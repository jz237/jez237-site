import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {createVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {createVehicleDrive} from '../src/drivetrain/chassis';
import {steeringLimit,brakeFactor,overheat,RADIATOR} from '../src/damage-handling';
await R.init();
test('front compression bends the steering, damaged corners lose brake and a crushed radiator overheats',()=>{
 assert.equal(steeringLimit(undefined),1);assert.equal(steeringLimit([0,0,0,0,0]),1);assert.ok(steeringLimit([1,0,0,0,0])<.7);assert.ok(steeringLimit([.5,1,1,1,1])>steeringLimit([1,0,0,0,0]),'only the front matters');
 assert.equal(brakeFactor(0),1);assert.ok(brakeFactor(1)<.6);
 assert.equal(overheat(.2,RADIATOR.onset,1,10),.2,'an intact radiator never overheats');
 let e=.2;for(let i=0;i<60*60;i++)e=overheat(e,1,1,1/60);assert.ok(e>.45&&e<=RADIATOR.cap,'a minute flat out adds about a third');
 let idle=.2;for(let i=0;i<60*60;i++)idle=overheat(idle,1,0,1/60);assert.ok(idle>.2&&idle<e,'idling heats more slowly');
 assert.equal(overheat(RADIATOR.cap,1,1,100),RADIATOR.cap);
});
const drive=(extra:Partial<PhysicsState>,input:(t:number)=>Partial<PhysicsState['input']>,seconds:number)=>{
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(800,.5,800).setTranslation(0,-.5,0));
 const spec=vehicleSpecification('sedan'),{body,controller}=createVehiclePhysics(R,world,'sedan',spec.mass),dt=createVehicleDrive(body,controller,'sedan');
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false},...extra};
 try{body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<90;i++){dt.step(spec,state,1/60);world.step();}
  const heading=()=>{const q=body.rotation();return Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.x*q.x));};let turned=0,last=heading();
  for(let i=0;i<seconds*60;i++){Object.assign(state.input,input(i/60));dt.step(spec,state,1/60);world.step();const h=heading();let d=h-last;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;turned+=d;last=h;}
  const p=body.translation();return{x:p.x,z:p.z,yaw:turned,speed:state.speed};}finally{world.free();}
};
test('bent steering widens the turn and a weak front-left brake pulls the car under braking',()=>{
 const turn=(limit:number)=>drive({steerLimit:limit},t=>({throttle:t<3?1:.4,steer:t<3?0:.5}),5);
 const straight=turn(1),bent=turn(steeringLimit([1,0,0,0,0]));console.log(JSON.stringify({straight,bent}));
 assert.ok(Math.abs(bent.yaw)<Math.abs(straight.yaw)*.85,'less rotation with bent steering');
 const brake=(bias:number[])=>drive({brakeBias:bias},t=>({throttle:t<4?1:0,brake:t<4?0:1}),6);
 const even=brake([1,1,1,1]),weak=brake([brakeFactor(1),1,1,1]);console.log(JSON.stringify({even,weak}));
 assert.ok(Math.abs(weak.x)>Math.abs(even.x)+.15||Math.abs(weak.yaw)>Math.abs(even.yaw)+.02,'braking pulls off line');
});
test('a loose bonnet lifts in the airflow at speed but not when crawling or barely loose',async()=>{
 const {hoodWindLift}=await import('../src/wreck-attachments');
 assert.equal(hoodWindLift(10,1),0);assert.equal(hoodWindLift(40,.2),0);
 assert.ok(hoodWindLift(30,1)>.5&&hoodWindLift(30,1)<=.55);assert.ok(hoodWindLift(22,1)>0&&hoodWindLift(22,1)<hoodWindLift(30,1));
 assert.equal(hoodWindLift(-30,1),hoodWindLift(30,1),'reversing too');
});
test('a damaged tyre leaks while rolling until it fails, and the HUD calls it a slow puncture',async()=>{
 const {leakTyre,LEAK}=await import('../src/damage-handling');const {tyreWarning}=await import('../src/tyre-feedback');const {tyreFailure}=await import('../src/tyre-condition');
 assert.equal(leakTyre(.2,20,1),.2,'light scuffs hold air');assert.equal(leakTyre(.6,0,10),.6,'no leak while parked');assert.equal(leakTyre(LEAK.flat,20,10),LEAK.flat);
 let d=.6,t=0;while(tyreFailure(d)<.9&&t<600){d=leakTyre(d,20,1/10);t+=1/10;}assert.ok(t>40&&t<200,`a 0.6 tyre goes flat in ${t.toFixed(0)} s at speed`);
 let worse=.68,t2=0;while(tyreFailure(worse)<.9&&t2<600){worse=leakTyre(worse,20,1/10);t2+=1/10;}assert.ok(t2<t,'worse damage leaks faster');
 assert.equal(tyreWarning([.5,0,0,0]),'','not shown unless enabled');assert.equal(tyreWarning([.5,0,0,0],true),'SLOW PUNCTURE · FL');
 assert.match(tyreWarning([1,.5,0,0],true),/FLAT TYRE · FL/,'a real flat takes precedence');
});
test('a damaged damper lets its corner bounce longer after a drop',async()=>{
 const {damperFactor,DAMPER_LOSS}=await import('../src/damage-handling');
 assert.equal(damperFactor(0),1);assert.equal(damperFactor(1),1-DAMPER_LOSS);
 const settle=(bias:number[])=>{const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(80,.5,80).setTranslation(0,-.5,0));
  const spec=vehicleSpecification('sedan'),{body,controller}=createVehiclePhysics(R,world,'sedan',spec.mass),dt=createVehicleDrive(body,controller,'sedan');
  const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,damperBias:bias,input:{throttle:0,brake:0,steer:0,handbrake:false}};
  try{body.setTranslation({x:0,y:1.6,z:0},true);let motion=0;for(let i=0;i<240;i++){dt.step(spec,state,1/60);world.step();if(i>60)motion+=Math.abs(body.linvel().y)/60;}return motion;}finally{world.free();}};
 const healthy=settle([1,1,1,1]),blown=settle([1-DAMPER_LOSS,1-DAMPER_LOSS,1-DAMPER_LOSS,1-DAMPER_LOSS]);console.log(JSON.stringify({healthy,blown}));
 assert.ok(blown>healthy*1.2,'more vertical motion after landing');
});
