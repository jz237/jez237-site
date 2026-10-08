import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {stepTransmission,validTransmissionInput,validTransmissionState,type TransmissionVehicle} from '../src/transmission';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState} from '../src/vehicle-physics';
import {CAR_KINDS,type CarKind} from '../src/rules';
await R.init();
const dt=1/60,spec={gearStep:8,speedLimit:48};
const vehicle=(mode:'manual'|'clutch'='manual'):TransmissionVehicle=>({gear:1,rpm:850,speed:0,input:{throttle:1,transmission:{mode,up:false,down:false,clutch:0}}});
function shift(c:TransmissionVehicle,direction:'up'|'down',clutch=0){const input=c.input.transmission!;input.up=input.down=false;input.clutch=clutch;stepTransmission(c,spec,dt,true);input[direction]=true;for(let i=0;i<15;i++)stepTransmission(c,spec,dt,true);input[direction]=false;stepTransmission(c,spec,dt,true);}
test('manual selection reaches neutral/reverse, holding a key shifts once and opposite-direction engagement is guarded',()=>{
 const c=vehicle();assert.equal(stepTransmission(c,spec,dt,true),1);shift(c,'up');assert.equal(c.gear,2);c.input.transmission!.up=true;for(let i=0;i<180;i++)stepTransmission(c,spec,dt,true);assert.equal(c.gear,3);assert.ok(validTransmissionState(c.transmission));
 shift(c,'down');shift(c,'down');shift(c,'down');assert.equal(c.gear,-1);assert.equal(stepTransmission(c,spec,dt,true),0);shift(c,'down');assert.equal(c.gear,0);assert.ok(stepTransmission(c,spec,dt,true)<0);
 c.speed=-8;shift(c,'up');assert.equal(c.gear,-1);shift(c,'up');assert.equal(c.gear,-1);assert.ok(c.transmission!.notice>0);
 c.speed=0;shift(c,'up');assert.equal(c.gear,1);
});
test('manual clutch disconnects torque, requires engagement at shift completion and lets the engine rev in neutral',()=>{
 const c=vehicle('clutch');stepTransmission(c,spec,dt,true);shift(c,'up');assert.equal(c.gear,1);assert.ok(c.transmission!.notice>0);
 c.input.transmission!.up=true;stepTransmission(c,spec,dt,true);c.input.transmission!.clutch=1;for(let i=0;i<15;i++)assert.equal(stepTransmission(c,spec,dt,true),0);assert.equal(c.gear,2);
 shift(c,'down',1);shift(c,'down',1);assert.equal(c.gear,-1);for(let i=0;i<60;i++)stepTransmission(c,spec,dt,true);assert.ok(c.rpm>6000);
});
test('new gearbox validation rejects malformed controls and persisted state',()=>{
 const c=vehicle();assert.ok(validTransmissionInput(c.input.transmission));for(const patch of [{mode:'auto'},{up:1},{down:null},{clutch:-1},{clutch:2},{clutch:NaN}])assert.equal(validTransmissionInput({...c.input.transmission,...patch}),false);
 stepTransmission(c,spec,dt,true);for(const patch of [{mode:'auto'},{pending:6},{pending:.5},{delay:-1},{delay:NaN},{notice:Infinity}])assert.equal(validTransmissionState({...c.transmission,...patch}),false);
});
function drive(kind:CarKind,mode:'manual'|'clutch',action:'first'|'second'|'neutral'|'reverse'|'disconnected'|'shifting'){
 const world=new R.World({x:0,y:-9.81,z:0}),spec=vehicleSpecification(kind),car=createVehiclePhysics(R,world,kind,spec.mass);world.timestep=dt;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));car.body.setTranslation({x:0,y:1,z:0},true);
 const s:PhysicsState={health:100,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false,transmission:{mode,up:false,down:false,clutch:action==='disconnected'?1:0}}};
 try{stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt);s.gear=action==='neutral'?-1:action==='reverse'?0:action==='second'?2:1;
  for(let tick=0;tick<420;tick++){s.input.throttle=tick>=60?1:0;const t=s.input.transmission!;t.up=action==='shifting'&&s.speed>spec.gearStep*s.gear*.87&&s.gear<5;t.clutch=mode==='clutch'&&(action==='disconnected'||t.up)?1:0;stepVehiclePhysics(car.body,car.controller,kind,spec,s,dt);world.step();}
  return {speed:s.speed,z:car.body.translation().z,gear:s.gear,rpm:s.rpm};
 }finally{world.removeVehicleController(car.controller);world.free();}
}
test('every actual chassis obeys neutral, clutch, reverse and selected ratio, and can accelerate through manual shifts',()=>{
 for(const kind of CAR_KINDS){const first=drive(kind,'manual','first'),second=drive(kind,'manual','second'),neutral=drive(kind,'manual','neutral'),reverse=drive(kind,'manual','reverse'),clutch=drive(kind,'clutch','disconnected'),shifting=drive(kind,'manual','shifting');
  assert.ok(Math.abs(neutral.z)<.1,kind+' neutral');assert.ok(Math.abs(clutch.z)<.1,kind+' clutch');assert.ok(reverse.z<-8,kind+' reverse');assert.ok(second.speed>first.speed+2,kind+' gear range');assert.ok(shifting.speed>first.speed+5,`${kind} shifts ${shifting.speed} / ${first.speed}`);assert.ok(shifting.gear>=3,kind+' shifts');
 }
});

test('opposing shift buttons cancel even when the second button is pressed later',()=>{
 const c=vehicle();stepTransmission(c,spec,dt,true);c.input.transmission!.up=true;for(let i=0;i<30;i++)stepTransmission(c,spec,dt,true);assert.equal(c.gear,2);
 c.input.transmission!.down=true;for(let i=0;i<30;i++)stepTransmission(c,spec,dt,true);assert.equal(c.gear,2);
});
