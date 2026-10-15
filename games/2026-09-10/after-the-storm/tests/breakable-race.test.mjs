import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,adjudicateGate} from '../race-core.js';
import {createHydro} from '../hydrodynamics.js';
import {hazardBroken,breakableEvents,fragmentPose,MAX_FRAGMENT_LIFETIME} from '../breakable-hazards.js';
import {obstaclePosition} from '../course-environment.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';

// Sphere collision uses the two body-axis points (0,.05,+.675/- .225),
// independently of the twelve water/floor probes. Expanded sphere radius is
// 1.25+.30=1.55. At center Z=-2.2, the leading point is Z=-1.525,Y=.05:
// sqrt(1.525^2+.05^2)=1.52582 <1.55, so the ordinary-speed tests really contact.
// The limiting craft-center reach is about1.55+.675=2.225, not2.7 metres.
const CONTACT_Z=2.2;

// An independent deep-water test circuit, without Glacier's route, floor or AI.
// Calm sea still runs the actual distributed water solver, not a mocked step.
function fixture({mode='time',hazard={},breakable=true,id='breakable-fixture',time=10}={}){
 const block={id:'fixture-ice',x:0,y:0,z:0,r:1.25,probeRadius:.3,type:'ice',fixed:true,
  ...(breakable?{breakable:{sourceIndexByRider:[0,1,2,3],nativeVelocityScale:.5}}:{fixedSphere:true}),...hazard};
 const gate=(x,z,tx,tz)=>({x,z,tx,tz,side:0,width:80});
 const course={id,name:'Breakable fixture',theme:'coast',storm:0,ground:()=>-20,
  anchors:[[0,-100],[100,100],[-100,100]],gates:[gate(0,-100,0,1),gate(100,100,-1,0),gate(-100,100,0,-1)],
  boundary:[[-1000,-1000],[1000,-1000],[1000,1000],[-1000,1000]],
  rocks:[block],ramps:[],crossbars:[],iceSheets:[],resistance:[],mooredBoats:[]};
 const state=createRace({course,mode,seaState:'calm',waveSeed:17});state.phase='running';state.time=time;
 return {state,block,racer:state.racers[0]};
}

function place(racer,{x=0,y=0,z=-CONTACT_Z,speed=6,heading=0,pose=null}={}){
 Object.assign(racer,{x,z,heading,vx:Math.sin(heading)*speed,vz:Math.cos(heading)*speed,speed,turn:0,yawVelocity:0,
  recover:0,collision:0,wipeout:null,out:0,next:1,finishTime:null,dq:''});
 racer.hydro={...createHydro(),initialized:true,y,wet:y>2?0:1,intake:y>2?0:1};
 Object.assign(racer.stunt,{pose,poseTime:pose?1:0,trick:null,lastCommand:pose||''});
}

const tick=(state,input={})=>stepRace(state,input,1/60);
const breaks=state=>state.events.filter(event=>event.text==='ICE BLOCK SHATTERED');

test('race collision and break event use authored fixed XYZ, including absolute height through a tide change',()=>{
 const centers=[];
 for(const time of [10,200]){
  const below=fixture({id:'tempest',time,hazard:{y:4}});place(below.racer,{y:0});const start=below.racer.z;
  tick(below.state);assert.equal(hazardBroken(below.state.breakables,below.block),false);
  assert.equal(below.racer.collision,0);assert.ok(below.racer.z>start,'a craft below the block is not hit by a water-relative cylinder');
  const atHeight=fixture({id:'tempest',time,hazard:{y:4}});place(atHeight.racer,{y:4});tick(atHeight.state);
  assert.equal(hazardBroken(atHeight.state.breakables,atHeight.block),true);
  const event=breakableEvents(atHeight.state.breakables,atHeight.state.time)[0];
  assert.deepEqual(event.center,{x:0,y:4,z:0});assert.equal(atHeight.racer.collision,1);
  assert.ok(atHeight.racer.vz<0,'the contact at the fixed height resolves');
  assert.deepEqual(obstaclePosition(atHeight.block,time),{x:0,z:0});
  centers.push({center:event.center,seaLevel:atHeight.state.weather.seaLevel});
 }
 assert.deepEqual(centers[0].center,centers[1].center);
 assert.ok(Math.abs(centers[0].seaLevel-centers[1].seaLevel)>1,'the test actually changes the water datum');
});

test('a fast hull cannot tunnel through the whole block between race ticks',()=>{
 const {state,block,racer}=fixture();place(racer,{z:-8,speed:600});
 stepRace(state,{},1/30);
 assert.equal(hazardBroken(state.breakables,block),true);assert.equal(breaks(state).length,1);
 assert.ok(racer.z<-2,'swept hull contact stops the craft on the entry side');assert.ok(racer.vz<0);
 assert.ok([racer.x,racer.z,racer.vx,racer.vz,racer.hydro.y,racer.hydro.vy].every(Number.isFinite));
 const clear=fixture();clear.state.course.rocks=[];place(clear.racer,{z:-8,speed:600});stepRace(clear.state,{},1/30);
 assert.ok(clear.racer.z>5,'without a sweep the same step would carry the entire hull past the block');
});

test('weak impacts still collide, while source stance factors can break the same block at low speed',()=>{
 const normal=fixture();place(normal.racer,{speed:1});tick(normal.state);
 assert.equal(hazardBroken(normal.state.breakables,normal.block),false);assert.equal(normal.racer.collision,1);
 assert.ok(normal.racer.vz<0);assert.equal(breaks(normal.state).length,0);
 for(const pose of ['handstand','backwards','stand']){
  const posed=fixture();place(posed.racer,{speed:1,pose});tick(posed.state,{trick:pose});
  assert.equal(hazardBroken(posed.state.breakables,posed.block),true,pose+' lowers the threshold');
  assert.equal(breaks(posed.state).length,1);assert.ok(posed.racer.vz<0,'breaking never skips the initial response');
  const event=breakableEvents(posed.state.breakables,posed.state.time)[0];assert.ok(event.threshold<1);
 }
});

test('the breaking contact resolves exactly like the equivalent nonbreaking fixed sphere',()=>{
 const fixed=fixture({breakable:false});place(fixed.racer);tick(fixed.state);
 const ice=fixture();place(ice.racer);tick(ice.state);
 assert.equal(hazardBroken(ice.state.breakables,ice.block),true);assert.equal(hazardBroken(fixed.state.breakables,fixed.block),false);
 assert.equal(ice.racer.collision,1);assert.ok(ice.racer.z< -CONTACT_Z);assert.ok(ice.racer.vz<0);
 assert.deepEqual([ice.racer.x,ice.racer.z,ice.racer.vx,ice.racer.vz,ice.racer.hydro.y,ice.racer.hydro.vy],
  [fixed.racer.x,fixed.racer.z,fixed.racer.vx,fixed.racer.vz,fixed.racer.hydro.y,fixed.racer.hydro.vy]);
});

test('a first-player break removes collision for the later second player in the same simulation tick',()=>{
 const {state,block}=fixture({mode:'versus'}),[first,second]=state.racers;
 place(first);place(second,{z:CONTACT_Z,heading:Math.PI});const before=second.z;
 tick(state,[{},{}]);
 assert.equal(hazardBroken(state.breakables,block),true);assert.equal(breaks(state).length,1);assert.equal(breaks(state)[0].rider,first.id);
 assert.equal(first.collision,1);assert.ok(first.vz<0);
 assert.equal(second.collision,0);assert.ok(second.z<before&&second.vz< -5,'second player continues through the removed contact');
 assert.equal(breakableEvents(state.breakables,state.time).length,1);
 const solid=fixture({mode:'versus',breakable:false});place(solid.state.racers[0]);place(solid.state.racers[1],{z:CONTACT_Z,heading:Math.PI});
 tick(solid.state,[{},{}]);assert.equal(solid.state.racers[1].collision,1);assert.ok(solid.state.racers[1].vz>0,'the second approach would collide while the sphere is intact');
});

test('broken state survives actual lap adjudication, paused steps, and shore recovery',()=>{
 const {state,block,racer}=fixture();place(racer);tick(state);const token=state.breakables;
 assert.equal(hazardBroken(token,block),true);
 racer.next=0;racer.x=0;racer.z=-99;assert.equal(adjudicateGate(state,racer,0,-101),true);assert.equal(racer.lap,2);
 state.phase='paused';const time=state.time,position=[racer.x,racer.z];tick(state,{throttle:1});
 assert.equal(state.time,time);assert.deepEqual([racer.x,racer.z],position);assert.equal(state.breakables,token);assert.equal(hazardBroken(token,block),true);
 state.phase='running';state.course.ground=(x,z)=>x>20?2:-20;
 place(racer,{x:30,z:30,speed:0});racer.lap=2;racer.passed=3;racer.lastWater={x:0,z:-30,heading:0};const previousHydro=racer.hydro;
 tick(state,{rescue:true});assert.equal(racer.event,'BACK IN THE WATER');assert.equal(racer.x,0);assert.equal(racer.z,-30);
 assert.notEqual(racer.hydro,previousHydro);assert.equal(racer.hydro.initialized,false);assert.equal(racer.lap,2);assert.equal(racer.passed,3);
 assert.equal(state.breakables,token);assert.equal(hazardBroken(token,block),true);
 // Returning to the same world location cannot recreate the obstacle.
 place(racer);tick(state);assert.equal(racer.collision,0);assert.ok(racer.vz>0);assert.equal(breaks(state).length,1);
});

test('a fresh createRace restores intact collision without mutating course definitions',()=>{
 const original=fixture(),before=structuredClone(original.block);place(original.racer);tick(original.state);
 assert.equal(hazardBroken(original.state.breakables,original.block),true);assert.deepEqual(original.block,before);
 const fresh=createRace({course:original.state.course,mode:'time',seaState:'calm'});fresh.phase='running';fresh.time=10;place(fresh.racers[0]);
 assert.notEqual(fresh.breakables,original.state.breakables);assert.equal(hazardBroken(fresh.breakables,original.block),false);
 assert.equal(hazardBroken(original.state.breakables,original.block),true);tick(fresh);
 assert.equal(hazardBroken(fresh.breakables,original.block),true);assert.equal(fresh.racers[0].collision,1);assert.ok(fresh.racers[0].vz<0);
});

test('instant replay records an actual break and preserves intact ice and debris after live expiry',()=>{
 const {state,block,racer}=fixture(),recorder=createRecorder();place(racer);
 recordMoment(recorder,state,null);const beforeTime=state.time;
 assert.equal(recorder.frames.length,1);assert.equal(hazardBroken(recorder.frames[0].breakables,block),false);
 tick(state);assert.equal(hazardBroken(state.breakables,block),true);
 const event=breakableEvents(state.breakables,state.time)[0];assert.ok(event);
 // Three genuine 20Hz recorded moments straddle the impact; no fabricated
 // frame state or break token is inserted into the recorder.
 for(let i=0;i<6;i++){tick(state);recordMoment(recorder,state,null);}
 assert.ok(recorder.frames.length>=3);
 const clip={frames:[...recorder.frames]},afterTime=recorder.frames[1].time+.01;
 const before=replaySample(clip,beforeTime),after=replaySample(clip,afterTime);
 assert.equal(hazardBroken(before.breakables,block),false);assert.equal(hazardBroken(after.breakables,block),true);
 assert.notEqual(after.breakables,state.breakables);assert.ok(Object.isFrozen(after.breakables));
 const replayEvent=breakableEvents(after.breakables,after.time)[0];assert.equal(replayEvent,event);
 assert.equal(replayEvent.fragments.length,8);
 const fragment=replayEvent.fragments[0],pose=fragmentPose(replayEvent,fragment,after.time);assert.ok(pose&&pose.opacity>0);
 while(state.time<event.time+MAX_FRAGMENT_LIFETIME+.1){tick(state);recordMoment(recorder,state,null);breakableEvents(state.breakables,state.time);}
 assert.equal(breakableEvents(state.breakables,state.time).length,0,'live debris has actually expired and been pruned');
 const late=replaySample({frames:recorder.frames},state.time);assert.equal(hazardBroken(late.breakables,block),true);
 assert.equal(breakableEvents(late.breakables,late.time).length,0);
 assert.equal(hazardBroken(replaySample(clip,beforeTime).breakables,block),false,'a later live break cannot alter the intact frame');
 const rewound=replaySample(clip,afterTime),rewoundEvent=breakableEvents(rewound.breakables,rewound.time)[0];
 assert.equal(rewoundEvent,event);assert.deepEqual(fragmentPose(rewoundEvent,fragment,rewound.time),pose);
 assert.equal(hazardBroken(state.breakables,block),true);assert.equal(breaks(state).length,1,'replay sampling never adds a live impact');
});
