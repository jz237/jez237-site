import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';import * as T from 'three';
import{stepTransmission,manualEngineBrake,transmissionNotice,validTransmissionState,gearboxGrindSamples,type TransmissionVehicle}from'../src/transmission';
import{createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,type PhysicsState}from'../src/vehicle-physics';
import{CAR_KINDS,type CarKind}from'../src/rules';import{Sound}from'../src/audio';
await R.init();const dt=1/60,spec={gearStep:8,speedLimit:48};
function car():TransmissionVehicle{return{speed:24,rpm:5000,gear:3,input:{throttle:0,transmission:{mode:'clutch',up:false,down:false,clutch:0}}};}
test('road-driven downshift revs exceed the limiter, add resistance and recover when the clutch disconnects',()=>{
 const c=car();stepTransmission(c,spec,dt,true);c.gear=1;const normal=manualEngineBrake({...c,gear:3},spec);
 for(let i=0;i<60;i++)stepTransmission(c,spec,dt,true);assert.ok(c.rpm>6600&&c.rpm<=10000);assert.ok(transmissionNotice(c).includes('OVER-REV'));assert.ok(manualEngineBrake(c,spec)>normal);
 c.input.transmission!.clutch=1;assert.equal(manualEngineBrake(c,spec),0);for(let i=0;i<60;i++)stepTransmission(c,spec,dt,true);assert.ok(c.rpm<1000);assert.ok(!transmissionNotice(c).includes('OVER-REV'));
 c.input.transmission!.clutch=0;c.gear=-1;assert.equal(manualEngineBrake(c,spec),0);delete c.input.transmission;assert.equal(manualEngineBrake(c,spec),0);assert.equal(transmissionNotice(c),'');
});
test('failed clutch engagement grinds once, briefly cuts drive and recovers without changing gear',()=>{
 const c=car();c.speed=3;c.input.throttle=1;stepTransmission(c,spec,dt,true);c.input.transmission!.up=true;
 for(let i=0;i<13;i++)stepTransmission(c,spec,dt,true);assert.equal(c.gear,1);assert.ok(c.transmission!.grind!>.4);assert.ok(transmissionNotice(c).includes('CLUTCH REQUIRED'));assert.equal(stepTransmission(c,spec,dt,true),0);
 for(let i=0;i<60;i++)stepTransmission(c,spec,dt,true);assert.equal(c.transmission!.grind,0);assert.ok(stepTransmission(c,spec,dt,true)>0);assert.equal(c.gear,1,'Holding shift does not retrigger grinding');
 c.input.transmission!.up=false;stepTransmission(c,spec,dt,true);c.input.transmission!.clutch=1;c.input.transmission!.up=true;for(let i=0;i<14;i++)stepTransmission(c,spec,dt,true);assert.equal(c.gear,2);assert.equal(c.transmission!.grind,0);
 for(const grind of [-1,.46,NaN,Infinity,null,'1'])assert.equal(validTransmissionState({...c.transmission,grind}),false);assert.ok(validTransmissionState({...c.transmission,grind:undefined}));
});
function coast(kind:CarKind,mode:'engaged'|'clutch'|'neutral'|'automatic',air=false){
 const w=new R.World({x:0,y:air?0:-9.81,z:0});w.timestep=dt;const spec=vehicleSpecification(kind);w.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const{body,controller}=createVehiclePhysics(R,w,kind,spec.mass);
 const state:PhysicsState={health:100,engineStall:0,damageLeft:0,damageRight:0,speed:0,slip:0,steering:0,surface:'asphalt',gear:1,rpm:850,input:{throttle:0,brake:0,steer:0,handbrake:false,transmission:{mode:'clutch',up:false,down:false,clutch:mode==='clutch'?1:0}}};
 body.setTranslation({x:0,y:air?20:1.2,z:0},true);
 try{for(let i=0;i<180;i++){stepVehiclePhysics(body,controller,kind,spec,state,dt);w.step();}
  // Standardised rolling entry is a physics fixture, not a gameplay finish.
  body.setLinvel({x:0,y:0,z:20},true);state.gear=mode==='neutral'?-1:2;if(mode==='automatic')delete state.input.transmission;
  for(let i=0;i<180;i++){stepVehiclePhysics(body,controller,kind,spec,state,dt);w.step();}
  return{speed:state.speed,distance:body.translation().z};
 }finally{w.free();}
}
test('every chassis loses more rolling speed in gear; an open clutch, neutral and airborne wheels disconnect engine braking',()=>{
 const evidence=[];for(const kind of CAR_KINDS){const engaged=coast(kind,'engaged'),clutch=coast(kind,'clutch'),neutral=coast(kind,'neutral'),automatic=coast(kind,'automatic');assert.ok(engaged.speed<clutch.speed-.5,kind);assert.ok(engaged.distance<clutch.distance,kind);assert.ok(Math.abs(clutch.speed-neutral.speed)<.001);assert.ok(Math.abs(automatic.speed-neutral.speed)<.001);evidence.push({kind,engaged,clutch});}
 assert.ok(Math.abs(coast('coupe','engaged',true).speed-coast('coupe','neutral',true).speed)<.001);console.log(JSON.stringify(evidence));
});
test('grind samples are deterministic, finite and bounded',()=>{
 const a=gearboxGrindSamples(48000),b=gearboxGrindSamples(48000);assert.equal(a.length,21600);assert.deepEqual(a,b);assert.ok(a.every(Number.isFinite));assert.ok(a.some(v=>Math.abs(v)>.1));assert.ok(a.every(v=>Math.abs(v)<1));
});
test('actual mixer keeps an over-rev audible, fades grinding, and silences both for wreck inspection',()=>{
 const parameter=()=>({value:0,setTargetAtTime(v:number){this.value=v;}}),loop=()=>({source:{playbackRate:parameter()},gain:{gain:parameter()},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter()}});
 const sound=new Sound();sound.ready=true;sound.ctx={currentTime:0,listener:Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,parameter()]))}as any;sound.shot=()=>{};
 const c={...car(),id:0,kind:'coupe',health:100,rpm:10000,current:new T.Vector3(),velocity:new T.Vector3(),controller:{wheelIsInContact:()=>true},transmission:{mode:'clutch',up:true,down:false,pending:null,delay:0,notice:1,grind:.4}};
 const high=loop(),grind=loop();sound.loops.set(0,new Map([['high',high],['gear-grind',grind]])as any);sound.update([c]as any,new T.PerspectiveCamera(),dt);assert.ok(high.gain.gain.value>.3);assert.ok(grind.gain.gain.value>0);
 c.transmission.grind=0;sound.update([c]as any,new T.PerspectiveCamera(),dt);assert.equal(grind.gain.gain.value,0);sound.update([c]as any,new T.PerspectiveCamera(),dt,true);assert.equal(high.gain.gain.value,0);
});

test('actual grinding state survives validated binary snapshots and cold authority restore',async()=>{
 const {Simulation}=await import('../multiplayer/simulation'),{NEUTRAL}=await import('../multiplayer/protocol'),{validOnlineSnapshot}=await import('../src/network-validation'),{encodeSnapshotWire,decodeSnapshotWire}=await import('../src/snapshot-wire');
 const sim=new Simulation(R,'playground'),cold=new Simulation(R,'playground'),humans=new Set([0,1,2,3,4,5,6,7]);
 try{sim.phase='playing';sim.cars.slice(1).forEach(c=>c.body.setEnabled(false));sim.world.gravity={x:0,y:0,z:0};sim.cars[0].body.setTranslation({x:0,y:10,z:0},true);
  sim.setInput(0,{...NEUTRAL,brake:0,throttle:1,transmission:{mode:'clutch',up:true,down:false,clutch:0}});for(let i=0;i<14;i++)sim.step(humans);
  const snapshot={...sim.snapshot(true),members:[],ack:{},transmissionSupport:true as const},wire=decodeSnapshotWire(encodeSnapshotWire(snapshot))as typeof snapshot;
  assert.ok(wire.cars[0].transmission!.grind!>0);assert.ok(validOnlineSnapshot(wire));cold.restore(wire);assert.deepEqual(cold.cars[0].state.transmission,sim.cars[0].state.transmission);
  const corrupt=structuredClone(wire);corrupt.cars[0].transmission!.grind=9;assert.equal(validOnlineSnapshot(corrupt),false);
  assert.ok(cold.recover(0));assert.equal(cold.cars[0].state.transmission,undefined);
 }finally{sim.dispose();cold.dispose();}
});
