import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {derbyTrafficClearance} from '../src/derby-driving';
import {derbyDrivingFixture} from './derby-driving-fixture';
import {verifyDerbyDrivingRevision} from './derby-driving-invariants';
const car=(id:number,x=0,z=0):DriverCar=>({id,current:{x,y:1,z},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:1,surface:'gravel'});

test('retreat accounts for car orientation and disabled traffic behind the driver',()=>{
 const c=car(0),wreck=car(1,0,-5);wreck.health=0;
 assert.equal(derbyTrafficClearance(c,[c,wreck],0,-1),0);
 wreck.current.x=5;assert.equal(derbyTrafficClearance(c,[c,wreck],0,-1),30);
 // A sideways vehicle has a longer cross-path footprint than a head-on one.
 wreck.current.x=3;assert.equal(derbyTrafficClearance(c,[c,wreck],0,-1),30);
 wreck.forward={x:1,y:0,z:0};wreck.right={x:0,y:0,z:-1};assert.ok(derbyTrafficClearance(c,[c,wreck],0,-1)<2);
});

test('a pinned car does not reverse into another car even when scenery rays report clear',()=>{
 const b=new DrivingBrain(),c=car(0),front=car(1,0,5),rear=car(2,0,-5);rear.health=0;
 for(let i=0;i<300;i++)assert.ok(b.update(c,[c,front,rear],'derby',1/60,()=>({front:24,left:24,right:24,rear:24})).throttle>=0);
});

test('recovery creates room before reattacking, then can abandon an immobile retreat',()=>{
 const b=new DrivingBrain(),c=car(0),other=car(1,0,5);
 let reversing=false,forward=false;
 for(let i=0;i<240;i++){const input=b.update(c,[c,other],'derby',1/60);if(input.throttle<0)reversing=true;if(reversing&&input.throttle>0)forward=true;}
 assert.ok(reversing&&forward,'An immobilized reverse must time out and try forward clearance');
 b.reset();c.speed=2;
 for(let i=0;i<80;i++)b.update(c,[c,other],'derby',1/60);
 c.speed=-4;c.current.z=-4;
 assert.ok(b.update(c,[c,other],'derby',1/60).throttle<0,'Four metres is insufficient run-up room');
 c.current.z=-14;
 assert.ok(b.update(c,[c,other],'derby',1/60).throttle>0,'After making room, drive out of the retreat');
 c.health=0;assert.equal(b.update(c,[c,other],'derby',1/60).brake,1);
});

test('real eight and 24-car fields rebuild momentum and produce repeated substantial impacts',async t=>{
 await R.init();
 for(const [count,mixed]of [[8,false],[8,true],[24,true]]as const){
  const result=derbyDrivingFixture(count,mixed);t.diagnostic(JSON.stringify(result));
  assert.ok(result.fastFraction>.27,'Drivers must regularly regain more than 6 m/s after initial contact');
  assert.ok(result.slowFraction<.34,'Low-speed congestion must occupy less than a third of settled driving time');
  assert.ok(result.strong>(count===24?190:45),'Measure real post-opening contacts above 6 m/s closing speed');
 }
});

test('previous AI and all earlier frozen revisions remain recoverable',()=>verifyDerbyDrivingRevision());
