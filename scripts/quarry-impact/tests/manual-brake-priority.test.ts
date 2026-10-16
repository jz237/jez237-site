import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS} from '../src/rules';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
await R.init();
test('manual braking retains all four brakes under simultaneous throttle across every chassis',()=>{
const results=[];
for(const kind of CAR_KINDS)for(const throttle of [0,1]){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
 const spec=vehicleSpecification(kind),{body,controller}=createVehiclePhysics(R,world,kind,spec.mass);
 const state:PhysicsState={health:100,damageLeft:0,damageRight:0,steering:0,speed:0,slip:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,steer:0,brake:1,handbrake:false,transmission:{mode:'manual',up:false,down:false,clutch:0}}};
 try{body.setTranslation({x:0,y:1.2,z:0},true);for(let i=0;i<180;i++){body.wakeUp();stepVehiclePhysics(body,controller,kind,spec,state,1/60);world.step();}
 body.setLinvel({x:0,y:0,z:15},true);state.gear=3;state.input.throttle=throttle;
 let commands:any;
 for(let i=0;i<60;i++){stepVehiclePhysics(body,controller,kind,spec,state,1/60);if(i===0)commands=Array.from({length:4},(_,j)=>({drive:controller.wheelEngineForce(j),brake:controller.wheelBrake(j)}));world.step();}
 results.push({kind,throttle,brake:1,initialSpeed:15,finalSpeed:state.speed,commands});
 }finally{world.free();}
}
for(let i=0;i<results.length;i+=2){const brake=results[i],both=results[i+1];assert.ok(brake.finalSpeed<12,brake.kind+' brake-only slows down');assert.ok(both.finalSpeed<12,both.kind+' combined pedals slow down by at least 3 m/s in one second');for(const wheel of both.commands){assert.equal(wheel.drive,0,both.kind+' brake priority removes powered-wheel brake bypass');assert.ok(wheel.brake>0,both.kind+' every wheel receives service braking');}}
});
