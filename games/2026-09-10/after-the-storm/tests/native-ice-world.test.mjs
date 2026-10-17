import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeIceWorld} from '../native-ice-world.js';
import {nativePreparedIceStability} from '../native-impact-state.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeIceFragments,spawnNativeIceFragments,stepNativeIceFragments} from '../native-ice-fragments.js';
import {createNativeIceSplashes,queueNativeIceSplash,stepNativeIceSplashes} from '../native-ice-splashes.js';
const definition={id:'test-ice',runtimeKind:10,sourceGenericSphere:true,x:.4,y:0,z:.675,r:1.25};
const v=(x=0,y=0,z=0)=>({x,y,z});
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ice-owner-reference.json',import.meta.url)));
function make({count=2,active=()=>true,prior=0,fragmentBurst=null,splashAdvance=null}={}){
 const adapters=Array.from({length:count},()=>createNativeRaceAdapter()),water=createRaceWater({crafts:adapters.map(a=>({x:a.hull.center.x,z:a.hull.center.z,sourceForwardXZ:[0,1]})),baseAmplitudeNative:20});
 const ice=createNativeIceWorld({definitions:[definition],water,fragmentBurst,splashAdvance}),calls=[];
 for(const [index,a] of adapters.entries()){
  a.hull.points.forEach(p=>p.velocity=v(20));
  a.contacts={primarySpheres:(h,c)=>{if(prior)c.recordImpact({channel:'object',incomingNative:prior,normal:v(0,1)});calls.push({index,before:ice.snapshot()[0]});ice.contact(h,c);calls.at(-1).after=ice.snapshot()[0];}};
 }
 const world=createNativeRaceWorld({adapters,water,craftContacts:false,humanIndices:adapters.map((_,i)=>i),afterFrame:(w,c)=>{ice.afterFrame(w,c,{active:active()});ice.afterEffects(w,c);}});
 return {adapters,water,ice,world,calls};
}

test('ice breaks through actual native contacts, is shared across racers, and hides only after the object phase',()=>{
 const s=make();stepNativeRaceWorld(s.world,.01,[{},{}]);
 assert.deepEqual(s.calls.map(q=>q.index),[1,0]);
 assert.equal(s.calls[0].before.broken,false);assert.equal(s.calls[0].after.broken,true);assert.equal(s.calls[1].before.broken,true);
 assert.equal(s.ice.snapshot()[0].renderKind,1);assert.equal(s.ice.breakEvents().length,1);
 assert.equal(s.adapters[1].objectHitKind16d8,2);assert.ok(s.adapters[1].impacts.objectImpactNative>0);
 assert.equal(s.adapters[0].impacts.objectImpactNative,0);
 stepNativeRaceWorld(s.world,.04,[{},{}]);assert.equal(s.ice.snapshot()[0].renderKind,0);assert.equal(s.ice.snapshot()[0].age,1);assert.equal(s.ice.diagnostics().outerFrames,1);
});

test('activity gating retains intact presentation while the broken collider remains absent',()=>{
 let active=false;const s=make({active:()=>active});stepNativeRaceWorld(s.world,.1,[{},{}]);
 assert.equal(s.ice.snapshot()[0].broken,true);assert.equal(s.ice.snapshot()[0].renderKind,1);assert.equal(s.ice.snapshot()[0].age,0);
 active=true;stepNativeRaceWorld(s.world,.05,[{},{}]);assert.equal(s.ice.snapshot()[0].renderKind,0);assert.equal(s.ice.snapshot()[0].age,1);
 const before=s.ice.snapshot();stepNativeRaceWorld(s.world,1,[{},{}],{active:false});assert.deepEqual(s.ice.snapshot(),before);
});

test('actual shared ice contact consumes canonical random state once and advances fragments only after the water frame',()=>{
 const race=createRace({course:getCourse('greyhaven'),mode:'time',physics:'native'}),runtime=race.nativeLaunch;
 const before=runtime.snapshot(),seed=before.scene.seed6f00;let active=false;
 const s=make({fragmentBurst:runtime.spawnIceFragments,active:()=>active});
 stepNativeRaceWorld(s.world,.01,[{},{}]);
 assert.equal(s.ice.breakEvents().length,1);
 const event=s.ice.breakEvents()[0],expected=spawnNativeIceFragments(createNativeIceFragments(),{...event,seed6f00:seed});
 assert.deepEqual(s.ice.fragmentSnapshot(),expected.state);
 const presentation=s.ice.presentationSnapshot();assert.equal(presentation.objects[0].visible,true);
 assert.deepEqual(presentation.fragments.filter(f=>f.active).map(f=>f.generation),[1,2,3,4,5,6,7,8]);
 presentation.fragments[0].position.x=98765;assert.notEqual(s.ice.presentationSnapshot().fragments[0].position.x,98765);
 const after=runtime.snapshot();assert.equal(after.scene.seed6f00,expected.seed6f00);
 after.scene.seed6f00=seed;assert.deepEqual(after,before,'fragment draws change only the canonical halfword seed');
 stepNativeRaceWorld(s.world,.04,[{},{}]);assert.deepEqual(s.ice.fragmentSnapshot(),expected.state);
 active=true;stepNativeRaceWorld(s.world,.05,[{},{}]);assert.deepEqual(s.ice.fragmentSnapshot(),stepNativeIceFragments(expected.state));
 assert.equal(s.ice.presentationSnapshot().objects[0].visible,false);
 const held=s.ice.fragmentSnapshot();stepNativeRaceWorld(s.world,1,[{},{}],{active:false});assert.deepEqual(s.ice.fragmentSnapshot(),held);
 held.slots[0].position[0]=123456;assert.notEqual(s.ice.fragmentSnapshot().slots[0].position[0],123456);
 assert.equal(runtime.snapshot().scene.seed6f00,expected.seed6f00,'other racer and fragment motion consume no extra draws');
});

test('a retained stronger C50 suppresses the ice break without suppressing physical contact',()=>{
 const s=make({prior:100});stepNativeRaceWorld(s.world,.01,[{},{}]);
 assert.equal(s.ice.snapshot()[0].broken,false);assert.equal(s.ice.breakEvents().length,0);
 assert.equal(s.adapters[1].impacts.objectImpactNative,100);assert.equal(s.adapters[1].objectHitKind16d8,1);assert.ok(s.ice.diagnostics(s.adapters[1].hull).hull.contacts>0);
 assert.deepEqual(s.adapters[1].impacts.normal,v(0,1));
});

test('splash phase shares canonical seed after fragments and advances despite inactive object motion, but not browser pause',()=>{
 const runtime=createRace({course:getCourse('greyhaven'),mode:'time',physics:'native'}).nativeLaunch;
 const seed=runtime.snapshot().scene.seed6f00;
 const s=make({active:()=>false,fragmentBurst:runtime.spawnIceFragments,splashAdvance:runtime.advanceIceSplashes});
 stepNativeRaceWorld(s.world,.01,[{},{}]);
 const event=s.ice.breakEvents()[0],burst=spawnNativeIceFragments(createNativeIceFragments(),{...event,seed6f00:seed});
 const queued=queueNativeIceSplash(createNativeIceSplashes(),burst.splashPositionNative);
 assert.deepEqual(s.ice.splashSnapshot(),queued);assert.equal(runtime.snapshot().scene.seed6f00,burst.seed6f00);
 const first=stepNativeIceSplashes(queued,burst.seed6f00);stepNativeRaceWorld(s.world,.04,[{},{}]);
 assert.deepEqual(s.ice.splashSnapshot(),first.state);assert.equal(runtime.snapshot().scene.seed6f00,first.seed6f00);
 assert.deepEqual(s.ice.fragmentSnapshot(),burst.state,'object activity holds solid fragments');
 assert.equal(first.state.slots[0].age,1);
 const firstDisplay=s.ice.presentationSnapshot().splashes;assert.equal(firstDisplay[0].generation,1);assert.equal(firstDisplay[0].age,1);assert.equal(firstDisplay[0].active,true);
 const second=stepNativeIceSplashes(first.state,first.seed6f00);stepNativeRaceWorld(s.world,.05,[{},{}]);
 assert.deepEqual(s.ice.splashSnapshot(),second.state);assert.equal(runtime.snapshot().scene.seed6f00,second.seed6f00);
 const secondDisplay=s.ice.presentationSnapshot().splashes;assert.equal(secondDisplay[0].generation,1);assert.equal(secondDisplay[0].age,2);assert.equal(secondDisplay[1].generation,2);
 const before=runtime.snapshot();stepNativeRaceWorld(s.world,1,[{},{}],{active:false});
 assert.deepEqual(runtime.snapshot(),before);assert.deepEqual(s.ice.splashSnapshot(),second.state);
 assert.throws(()=>s.ice.afterEffects(s.world,{logicalFrame:s.world.frames,step:.05}),/once/);
});

test('two racers share identical ice, fragment, random, impact and physical histories at30/60/144Hz',()=>{
 const runs=[];
 for(const hz of [30,60,144]){
  let seed=65535;const fragmentBurst=(pool,event)=>{const result=spawnNativeIceFragments(pool,{...event,seed6f00:seed});seed=result.seed6f00;return result;},splashAdvance=pool=>{const result=stepNativeIceSplashes(pool,seed);seed=result.seed6f00;return result;};
  const s=make({fragmentBurst,splashAdvance});for(let i=0;i<hz;i++)stepNativeRaceWorld(s.world,1/hz,[{},{}]);
  runs.push({objects:s.ice.snapshot(),events:s.ice.breakEvents(),seed,fragments:s.ice.fragmentSnapshot(),splashes:s.ice.splashSnapshot(),racers:s.adapters.map(a=>({points:a.hull.points,impacts:a.impacts,hitKind:a.objectHitKind16d8}))});
 }
 assert.deepEqual(runs[0],runs[1]);assert.deepEqual(runs[1],runs[2]);
});

test('prepared stability uses source profile and frame actor float32 scaling',()=>{
 for(const q of reference.thresholds)assert.equal(nativePreparedIceStability(q.rider,q.actor),q.stability);
 assert.throws(()=>nativePreparedIceStability(4,22));
});

test('260 object updates match original removal and age saturation while racer simulation is frozen',()=>{
 const a=createNativeRaceAdapter({sourceState:{simulationState:0,actorState:22}}),water=createRaceWater({crafts:[{x:0,z:0,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20});
 const ice=createNativeIceWorld({definitions:[definition,{...definition,id:'broken-ice'}],water});ice.state.nodes[1].broken=true;
 const world=createNativeRaceWorld({adapters:[a],water,humanIndices:[0],afterFrame:(w,c)=>ice.afterFrame(w,c)});
 for(const expected of reference.displayFrames){stepNativeRaceWorld(world,.05,[{}]);assert.deepEqual(ice.snapshot().map(q=>({renderKind:q.renderKind,age:q.age})),expected.objects);}
 assert.equal(world.frames,260);assert.equal(a.hull.ticks,0);
});

test('host selects the course ice owner and keeps real Glacier native admission closed',()=>{
 const course={...getCourse('greyhaven'),hazardsForPlayers:()=>[definition]},s=createRace({course,mode:'time',physics:'native'});
 assert.equal(s.nativeHost.ice.snapshot().length,1);assert.equal(s.nativeHost.floating,null);
 assert.deepEqual(s.nativeIce,s.nativeHost.ice.presentationSnapshot());
 stepRace(s,{},.01);assert.equal(s.nativeHost.ice.diagnostics().objectCount,1);assert.deepEqual(s.nativeIce,s.nativeHost.ice.presentationSnapshot());
 assert.throws(()=>createRace({course:getCourse('glacier'),mode:'time',physics:'native'}),/preview/);
});
