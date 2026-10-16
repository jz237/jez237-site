import test from 'node:test';import assert from 'node:assert/strict';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {PursuitDriving} from '../src/pursuit-driving';
import {PursuitSession,soloPursuitRules} from '../src/pursuit';
const car=(id:number,x:number,z:number):DriverCar=>({id,current:{x,y:1,z},velocity:{x:0,y:0,z:10},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:10,health:100,finished:false,nextCheckpoint:1,surface:'asphalt'});
const route=[{x:200,z:200},{x:200,z:300},{x:250,z:300}],open=()=>({front:30,left:30,right:30,rear:30});
const session=()=>new PursuitSession(soloPursuitRules([0,1,2],0,60));
test('pursuer intercepts on a remote road without steering back to a derby arena',()=>{
 const brain=new DrivingBrain(),driver=new PursuitDriving(brain),runner=car(0,205,218),chaser=car(1,200,200);
 const a=driver.update(session(),chaser,[runner,chaser],.2,0,route,open,()=>true);assert.ok(a.throttle>0);assert.ok(a.steer>0);assert.equal(brain.memory.get(1)?.phase,'pursuit intercept');
 const normal=new DrivingBrain().update(chaser,[runner,chaser],'race',.2,open,route);assert.ok(a.steer>normal.steer);
});
test('attack ignores the chosen runner for braking but keeps teammate and barrier avoidance',()=>{
 const runner=car(0,200,205),chaser=car(1,200,200);runner.speed=0;runner.velocity.z=0;
 const drive=(extra:DriverCar[]=[],probe=open)=>new PursuitDriving(new DrivingBrain()).update(session(),chaser,[runner,chaser,...extra],.2,0,route,probe,()=>true);
 const attack=drive();assert.equal(attack.brake,0);assert.ok(attack.throttle>0);
 const ally=car(2,200,203);ally.speed=0;ally.velocity.z=0;assert.ok(drive([ally]).brake>0);
 assert.ok(drive([],()=>({front:2,left:10,right:1,rear:10})).brake>0);
});
test('blocked corridor follows the road, and interception also checks the predicted point',()=>{
 const runner=car(0,205,218),chaser=car(1,200,200),cars=[runner,chaser],brain=new DrivingBrain(),driver=new PursuitDriving(brain);
 const routed=driver.update(session(),chaser,cars,.2,0,route,open,()=>false),expected=new DrivingBrain().update(chaser,cars,'race',.2,open,route);assert.deepEqual(routed,expected);
 let checked=0;const predicted=new PursuitDriving(new DrivingBrain()).update(session(),chaser,cars,.2,0,route,open,p=>{checked++;return p.z<=218});assert.equal(checked,2);assert.deepEqual(predicted,expected);
});
test('runner keeps race driving and terminal events brake every participant',()=>{
 const s=session(),runner=car(0,200,200),chaser=car(1,200,190),cars=[runner,chaser],driver=new PursuitDriving(new DrivingBrain());
 assert.deepEqual(driver.update(s,runner,cars,.2,0,route,open,()=>true),new DrivingBrain().update(runner,cars,'race',.2,open,route));
 s.update([{id:0,health:0,finished:false,finishTime:0}],1);assert.deepEqual(driver.update(s,chaser,cars,.2,1,route,open,()=>true),{throttle:0,steer:0,brake:1,handbrake:false});
});

test('overshot pursuers brake then reverse towards a close runner, preserving rear safety',()=>{
 const chaser=car(1,200,210),runner=car(0,202,204);runner.velocity.z=0;runner.speed=0;
 const drive=(others:DriverCar[]=[],probe=open)=>new PursuitDriving(new DrivingBrain()).update(session(),chaser,[runner,chaser,...others],.2,0,route,probe,()=>true);
 assert.deepEqual(drive(),{throttle:0,steer:0,brake:1,handbrake:false});
 chaser.speed=0;chaser.velocity.z=0;const backing=drive();assert.ok(backing.throttle<0);assert.ok(backing.steer>0);assert.equal(backing.brake,0);
 assert.ok(drive([],()=>({front:30,left:30,right:30,rear:1})).throttle>=0,'Scenery blocks the reverse attack');
 const ally=car(2,200,207);assert.ok(drive([ally]).throttle>=0,'An ally blocks the rear corridor');ally.health=0;assert.ok(drive([ally]).throttle>=0,'Wrecks also block the rear corridor');
 runner.current.z=190;assert.ok(drive().throttle>=0,'Distant runners use road navigation');
});

test('slow close contact backs out for a run-up, keeps the runner target and abandons stale maneuvers on route return',()=>{
 const chaser=car(1,200,200),runner=car(0,200,205),ally=car(2,205,200);chaser.speed=runner.speed=0;chaser.velocity.z=runner.velocity.z=0;
 const brain=new DrivingBrain(),driver=new PursuitDriving(brain),s=session();let input;
 for(let i=0;i<90;i++)input=driver.update(s,chaser,[runner,chaser,ally],1/60,i/60,route,open,()=>true);
 assert.equal(brain.memory.get(1)?.target,0);assert.equal(brain.memory.get(1)?.derby?.kind,'back out');assert.ok(input!.throttle<0);
 assert.ok(brain.memory.get(1)!.derby!.x>190,'Maneuver remains on the remote road');
 runner.current.z=290;driver.update(s,chaser,[runner,chaser,ally],1/60,2,route,open,()=>true);assert.equal(brain.memory.get(1)?.derby,undefined);
});
