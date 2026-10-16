import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {applyNativeRiderResultCodes} from '../native-rider-lifecycle.js';
import {SUNNY_NATIVE_RETIREMENT_GEOMETRY} from '../native-sunny-support.js';
const create=(mode='time')=>createRace({mode,physics:'native',course:getCourse('greyhaven')});
const frames=(s,n)=>{const end=s.nativeHost.world.frames+n;for(let guard=0;s.nativeHost.world.frames<end;guard++){
 assert.ok(guard<n*10+10,'race unexpectedly stopped');stepRace(s,s.mode==='versus'?[{},{}]:{},1/60);
}};
const codes=s=>s.nativeHost.world.adapters.map(a=>a.riderLifecycle.state.selectedActor);

test('live result writes use the existing selectedActor owner and stay untouched on partial or paused frames',()=>{
 const s=create(),a=s.nativeHost.world.adapters[0];
 assert.deepEqual(codes(s),[-1]);assert.equal(Object.hasOwn(a,'bodyResultCode16c8'),false);
 stepRace(s,{},.01);assert.equal(a.lastResultCodeOperations,undefined);
 s.phase='paused';stepRace(s,{},.03);assert.equal(a.lastResultCodeOperations,undefined);
 s.phase='countdown';frames(s,1);assert.deepEqual(a.lastResultCodeOperations,[]);assert.deepEqual(codes(s),[-1]);
 assert.equal(a.riderLifecycle.state.selectionCountdown,10,'source startup delay holds while no result is selected');
});

test('descending actor hook applies both tie writes before the next rider decision and primary judging',()=>{
 const s=create('versus');frames(s,130);const w=s.nativeHost.world,original=w.beforeActor,events=[];
 for(const r of s.racers)r.finishTime=1.025;
 const primaryTicks=s.racers[0].sourceBuoys.logicalTicks;
 w.beforeActor=(world,c)=>{
  const a=world.adapters[c.racerIndex];
  assert.ok(world.adapters.every(q=>q.hull.ticks===c.logicalFrame*5));
  assert.equal(world.water.frames,c.logicalFrame-1);assert.equal(s.racers[0].sourceBuoys.logicalTicks,primaryTicks);
  assert.equal(a.lastFrame.logicalFrame,c.logicalFrame);assert.equal(a.riderLifecycle.state.phase,'ready');
  original(world,c);events.push({slot:c.racerIndex,codes:codes(s),ops:a.lastResultCodeOperations});
 };
 frames(s,1);
 assert.deepEqual(events.map(e=>e.slot),[1,0]);assert.deepEqual(events.map(e=>e.codes),[[3,3],[3,3]]);
 assert.deepEqual(events[0].ops.map(o=>[o.racerIndex,o.value]),[[1,3],[0,3]]);assert.deepEqual(events[1].ops,[]);
 assert.ok(w.adapters.every(a=>a.riderLifecycle.state.selectionCountdown===9),'each eligible actor consumes its first delay update');
 assert.equal(s.racers[0].sourceBuoys.logicalTicks,primaryTicks+1);assert.equal(s.result.winner,null);
});

test('live solo retirement samples actual hull point0 against the installed source grid',()=>{
 const s=create();frames(s,130);s.racers[0].dq='Prepared source retirement boundary';frames(s,1);
 const a=s.nativeHost.world.adapters[0],queries=a.lastResultCodeOperations.filter(o=>o.kind==='supportProbeQuery');
 assert.ok(queries.length>0);assert.equal(queries[0].consumer,'8007f448');
 const point=a.hull.points[0].position,scale=a.hull.scale;
 assert.equal(queries[0].positionNative.x,Math.fround(point.x/scale));
 assert.equal(queries[0].positionNative.z,Math.fround(point.z/scale));
 assert.equal(queries[0].positionNative.y,Math.fround(Math.fround(point.y/scale)-10));
 assert.deepEqual(codes(s),[5],'ordinary start area has no dry support in the source scan');
 assert.equal(SUNNY_NATIVE_RETIREMENT_GEOMETRY.floor.planes.length,231);
 assert.ok(Object.isFrozen(SUNNY_NATIVE_RETIREMENT_GEOMETRY.floor.planes[0]));
});

test('result writes validate every target before changing any owner and retain a selected code',()=>{
 const s=create('versus');frames(s,130);const owners=s.nativeHost.world.adapters.map(a=>a.riderLifecycle),before=owners.map(l=>l.state);
 assert.throws(()=>applyNativeRiderResultCodes(owners,[{kind:'bodyResultCodeWrite',racerIndex:0,value:3},
  {kind:'bodyResultCodeWrite',racerIndex:2,value:4}]),/racerIndex/);
 owners.forEach((l,i)=>assert.equal(l.state,before[i]));
 applyNativeRiderResultCodes(owners,[{kind:'bodyResultCodeWrite',racerIndex:0,value:6}]);
 assert.equal(owners[0].state.selectedActor,6);assert.equal(owners[0].state.selectionCountdown,10);
 stepNativeRaceHost(s.nativeHost,.05,[{},{}]);assert.equal(owners[0].state.selectedActor,6);
 assert.equal(owners[0].state.selectionCountdown,9);
 assert.deepEqual(s.nativeHost.world.adapters[0].lastResultCodeOperations,[]);
});
