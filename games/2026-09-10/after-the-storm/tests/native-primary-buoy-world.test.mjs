import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryBuoyWorld} from '../native-primary-buoy-world.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {createSourcePrimaryBuoys,stepSourcePrimaryBuoys,snapshotSourcePrimaryBuoys} from '../source-primary-buoys.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater,captureRaceWater} from '../race-water.js';
import {queryNativeWaterField} from '../native-water-field.js';
import {getCourse} from '../courses.js';

const v=(x=0,y=0,z=0)=>({x,y,z});
const camera=a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]});
const layout=(x=30,z=30)=>createSourceBuoyLayout({courseIndex:1,nodes:[{sourceRow:7,x,z,tx:1,tz:0,classification:0}]});
function make({count=1,selected=layout(),afterJudge=()=>{},active=()=>true}={}){
 const adapters=Array.from({length:count},()=>createNativeRaceAdapter());
 const water=createRaceWater({crafts:adapters.slice(0,2).map(camera),baseAmplitudeNative:20});
 const primary=createNativePrimaryBuoyWorld({layout:selected,water});
 for(const a of adapters)a.contacts={racingBuoys:primary.contact};
 const world=createNativeRaceWorld({adapters,water,humanIndices:adapters.slice(0,2).map((_,i)=>i),afterFrame:(w,c)=>{
  afterJudge(w,c,primary);primary.afterFrame(w,c,{active:active()});
 }});
 return {adapters,water,primary,world,selected};
}

test('primary object update follows all hulls, shared water and adjudication exactly once',()=>{
 let judged=0;
 const s=make({count:4,afterJudge:(world,c,primary)=>{
  judged++;assert.ok(world.adapters.every(a=>a.hull.ticks===c.logicalFrame*5));
  assert.equal(world.water.frames,c.logicalFrame);assert.equal(primary.state.motionFrames,c.logicalFrame-1);
 }});
 stepNativeRaceWorld(s.world,.1,[{},{},{},{}]);assert.equal(judged,2);assert.equal(s.primary.state.motionFrames,2);
 assert.equal(s.primary.diagnostics(s.adapters[0].hull).motionUpdates,2);
});

test('first primary motion samples the newly evolved source-plane field and preserves loaderY0',()=>{
 const s=make(),initial=s.primary.snapshot();assert.equal(initial[0].position.y,0);
 stepNativeRaceWorld(s.world,.05,[{}]);
 const reference=createSourcePrimaryBuoys(s.selected);
 stepSourcePrimaryBuoys(reference,{queryNative:(x,z)=>queryNativeWaterField(s.water.field,x,z).sourcePlaneQueryNative});
 assert.deepEqual(s.primary.snapshot(),snapshotSourcePrimaryBuoys(reference));
});

test('actual primary recoil updates the shared object immediately and reports C38 before its motion pass',()=>{
 const s=make({count:2,selected:layout(.4,.675)}),calls=[];
 s.adapters.forEach((a,index)=>{for(const p of a.hull.points)p.velocity=v(10);
  a.contacts={racingBuoys:(h,c)=>{calls.push({index,before:s.primary.positionForSourceRow(7)});s.primary.contact(h,c);
   calls.at(-1).after=s.primary.positionForSourceRow(7);}};
 });
 stepNativeRaceWorld(s.world,.01,[{},{}]);assert.deepEqual(calls.map(q=>q.index),[1,0]);
 assert.notDeepEqual(calls[0].after,calls[0].before);assert.deepEqual(calls[1].before,calls[0].after);
 assert.equal(s.primary.state.motionFrames,0);assert.ok(s.adapters[1].impacts.primaryBuoyImpactNative>0);
 assert.equal(s.adapters[1].impacts.fixedSphereImpactNative,0);assert.equal(s.adapters[1].impacts.floorImpactNative,0);
});

test('actual Sunny class-selected primary arrays and source-water histories are refresh-independent',()=>{
 const selected=getCourse('greyhaven',1).sourceBuoyLayout,results=[];
 for(const hz of [30,60,144]){
  const s=make({count:2,selected});for(let i=0;i<hz;i++)stepNativeRaceWorld(s.world,1/hz,[{throttle:true},{throttle:true,steer:.2}]);results.push(s);
 }
 for(const s of results.slice(1)){
  assert.deepEqual(s.primary.snapshot(),results[0].primary.snapshot());assert.deepEqual(captureRaceWater(s.water),captureRaceWater(results[0].water));
 }
});

test('motion gate and world pause retain state without deferred motion or input catch-up',()=>{
 let active=false;const s=make({active:()=>active}),initial=s.primary.snapshot();
 stepNativeRaceWorld(s.world,.1,[{}]);assert.deepEqual(s.primary.snapshot(),initial);assert.equal(s.primary.diagnostics().outerFrames,2);
 active=true;stepNativeRaceWorld(s.world,.05,[{}]);assert.equal(s.primary.state.motionFrames,1);
 const before=s.primary.snapshot(),field=captureRaceWater(s.water);let calls=0;
 stepNativeRaceWorld(s.world,.5,[()=>{calls++;return {};}],{active:false});assert.equal(calls,0);
 assert.deepEqual(s.primary.snapshot(),before);assert.deepEqual(captureRaceWater(s.water),field);
});

test('presentation and lookup are detached, and invalid outer ownership cannot advance buoy motion',()=>{
 const s=make(),before=s.primary.snapshot(),p=s.primary.positionForSourceRow(7);p.x=99;
 const snapshot=s.primary.snapshot();snapshot[0].position.x=99;snapshot[0].endpoints[0].x=99;
 assert.deepEqual(s.primary.snapshot(),before);assert.throws(()=>s.primary.positionForSourceRow(999),/Unknown/);
 assert.throws(()=>s.primary.afterFrame(s.world,{logicalFrame:1,step:.05}),/exactly one/);assert.equal(s.primary.state.motionFrames,0);
 assert.throws(()=>createNativePrimaryBuoyWorld({layout:s.selected,water:captureRaceWater(s.water)}),/host/);
});
