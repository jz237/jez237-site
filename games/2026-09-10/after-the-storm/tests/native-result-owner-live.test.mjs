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

test('ordinary solo finish enters the source result stage with the actual body delay and initialized finish notice',()=>{
 const s=create();frames(s,130);s.racers[0].finishTime=3.75;frames(s,1);
 const state=s.nativeLaunch.snapshot(),h=a=>state.hudWords7788[(a-0x7788)/4],i=a=>state.i1Words9440[(a-0x9440)/4];
 assert.equal(s.phase,'results');assert.equal(state.scene.gameStateAb24,42);assert.equal(state.scene.previousGameState634,40);
 assert.equal(state.scene.initLatch63c,1);assert.equal(state.scene.field62a,0);
 const code=codes(s)[0];assert.notEqual(code,-1);
 assert.equal(i(0x9504),({1:130,2:140,3:100,4:120,5:110})[code]??100);
 assert.equal(i(0x9500),0);assert.equal(i(0x9508),0);
 assert.equal(h(0x8930),0x10000);assert.equal(h(0x8938),80);assert.equal(h(0x893c),93);
 assert.ok(state.hudWords7788.slice((0x895c-0x7788)/4,(0x8a0c-0x7788)/4).every(w=>w===0));
 assert.deepEqual(s.nativeLaunch.advanceStatus(codes(s)).effects,[]);assert.deepEqual(s.nativeLaunch.snapshot(),state);
});

test('ordinary solo retirement enters source stage41 and initializes its notice and delay fade',()=>{
 const s=create();frames(s,130);s.racers[0].dq='Prepared retirement boundary';frames(s,1);
 const state=s.nativeLaunch.snapshot(),h=a=>state.hudWords7788[(a-0x7788)/4];
 assert.equal(s.phase,'results');assert.equal(state.scene.gameStateAb24,41);
 assert.equal(h(0x8930),0x40000);assert.equal(h(0x8938),80);assert.equal(h(0x893c)|0,-40);assert.equal(h(0x8958),0);
 assert.equal(h(0x8a10),0x10000);assert.equal(h(0x8a18)&65535,120);assert.equal(h(0x8a1c)>>>16,4);
 assert.deepEqual(s.nativeLaunch.advanceStatus(codes(s)).effects,[]);assert.deepEqual(s.nativeLaunch.snapshot(),state);
});

test('ordinary versus result entry awards exactly one win, with tie and double retirement awarding neither',()=>{
 for(const kind of ['p1','p2','tie','double-dq']){
  const s=create('versus');frames(s,130);
  if(kind==='double-dq')s.racers.forEach(r=>r.dq='Prepared simultaneous retirement');
  else s.racers.forEach((r,i)=>{if(kind==='tie'||kind===`p${i+1}`)r.finishTime=3.75;});
  frames(s,1);const state=s.nativeLaunch.snapshot(),tie=kind==='tie'||kind==='double-dq';
  assert.equal(s.phase,'results');assert.equal(state.scene.gameStateAb24,tie?44:42);
  assert.deepEqual(state.profileWordsB330.slice(48,50),[kind==='p1'?1:0,kind==='p2'?1:0]);
  assert.equal(state.hudWords7788[(0x8aa8-0x7788)/4],tie?3:kind==='p1'?1:2);
  assert.ok(state.hudWords7788.slice((0x8930-0x7788)/4,(0x8a0c-0x7788)/4).every(w=>w===0));
  for(let i=0;i<3;i++)s.nativeLaunch.advanceStatus(codes(s));
  assert.deepEqual(s.nativeLaunch.snapshot(),state,'entry cannot re-award a win or reset a result timer');
 }
});
