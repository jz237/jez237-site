import test from 'node:test';import assert from 'node:assert/strict';
import {pursuitTerrainClear} from '../src/pursuit-corridor';
import {PursuitTargeting} from '../src/pursuit-targeting';import {PursuitSession,soloPursuitRules} from '../src/pursuit';
test('pursuers keep an exposed runner in reach beyond the old 22-metre cutoff',()=>{
 const targeting=new PursuitTargeting(),session=new PursuitSession(soloPursuitRules([0,1],0,120));const runner={id:0,x:0,z:45,vx:0,vz:0,health:100},chaser={...runner,id:1,z:0};
 assert.equal(targeting.intent(session,chaser,[runner,chaser],0,()=>true).kind,'intercept');assert.equal(targeting.intent(session,chaser,[runner,chaser],1,()=>false).kind,'route');runner.z=61;assert.equal(targeting.intent(session,chaser,[runner,chaser],2,()=>true).kind,'route');
});
test('long shortcuts reject cliffs, steep cross-slopes and world edges across car width',()=>{
 const from={x:0,z:0},to={x:0,z:50};const check=(height:(x:number,z:number)=>number,outside=(x:number,y:number,z:number)=>false)=>pursuitTerrainClear(from,to,1,height,outside);
 assert.equal(check(()=>0),true);assert.equal(check((x,z)=>z*.1),true);assert.equal(check((x,z)=>z>22&&z<28?10:0),false);assert.equal(check((x,z)=>x>1&&z>22&&z<28?10:0),false);assert.equal(check(()=>0,(x,y,z)=>z>30),false);assert.equal(check(()=>NaN),false);assert.equal(check(x=>x>1?5:0),false);
});

import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {PursuitDriving} from '../src/pursuit-driving';
test('completed Chase back-out resumes an attack instead of avoiding its runner as run-up traffic',()=>{
 const car=(id:number,z:number):DriverCar=>({id,kind:'coupe',current:{x:200,y:1,z},velocity:{x:0,y:0,z:8},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:8,health:100,finished:false,nextCheckpoint:1,surface:'asphalt'});
 const chaser=car(1,200),runner=car(0,205);runner.speed=0;runner.velocity.z=0;const cars=[runner,chaser],brain=new DrivingBrain(),driver=new PursuitDriving(brain),s=new PursuitSession(soloPursuitRules([0,1],0,120)),route=[{x:200,z:180},{x:200,z:300}];const probe=()=>({front:30,left:30,right:30,rear:30});
 driver.update(s,chaser,cars,1/60,0,route,probe,()=>true);brain.memory.get(1)!.derby={kind:'back out',x:200,z:184,startX:200,startZ:200,time:4,slow:0};
 const input=driver.update(s,chaser,cars,1/60,1,route,probe,()=>true);assert.equal(brain.memory.get(1)!.derby,undefined);assert.ok(input.throttle>0);assert.equal(input.brake,0);assert.equal(brain.memory.get(1)!.phase,'pursuit intercept');
});

test('stationary-runner squads leave two attackers active and keep reserve destinations stable',()=>{
 const s=new PursuitSession(soloPursuitRules([0,1,2,3,4],0,120)),ai=new PursuitTargeting(),runner={id:0,x:0,z:0,vx:0,vz:0,health:90},cars=[runner,...[1,2,3,4].map(id=>({...runner,id,x:id*2,z:-12}))];
 const intents=cars.slice(1).map(car=>ai.intent(s,car,cars,0,()=>true));assert.equal(intents.filter(i=>i.kind==='intercept').length,2);assert.equal(intents.filter(i=>i.kind==='stage').length,2);
 const reserve=cars[3],before=intents[2].point;reserve.x+=2;assert.deepEqual(ai.intent(s,reserve,cars,1,()=>true).point,before);assert.equal(ai.intent(s,reserve,cars,10,()=>true).kind,'intercept');runner.vz=6;assert.ok(cars.slice(1).every(car=>ai.intent(s,car,cars,11,()=>true).kind==='intercept'));ai.reset();
});
