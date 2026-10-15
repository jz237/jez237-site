import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeFloatingWorld,nativeFloatingWaterHeight} from '../native-floating-world.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater,captureRaceWater,raceWaterHeight} from '../race-water.js';
import {queryNativeWaterField,locateNativeWaterCell} from '../native-water-field.js';
import {portDynamicObjectsForSelection} from '../source-port-course.js';
import {createSourceFloatingObjects,stepSourceFloatingObjects} from '../source-floating-objects.js';

const v=(x=0,y=0,z=0)=>({x,y,z}),near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const definition=(q={})=>({id:'float',x:30,y:-.5,z:30,...q});
const camera=a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]});
function make({count=1,definitions=[definition()],noise=true,observer=()=>{}}={}){
 const adapters=Array.from({length:count},(_,i)=>createNativeRaceAdapter({position:v(i*.1,0,i*.1)}));
 const water=createRaceWater({crafts:adapters.slice(0,2).map(camera),baseAmplitudeNative:20,initialNoise:noise});
 const floating=createNativeFloatingWorld({definitions,water});
 for(const a of adapters)a.contacts={primarySpheres:floating.contact};
 const world=createNativeRaceWorld({adapters,water,humanIndices:adapters.slice(0,2).map((_,i)=>i),afterFrame:(w,c)=>{
  observer(w,c,floating);floating.afterFrame(w,c);
 }});
 return {world,water,adapters,floating};
}

test('floating water uses the source plane expression, never the rendered height',()=>{
 const a=createNativeRaceAdapter(),water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20,initialNoise:false});
 const xNative=19,zNative=27,p=locateNativeWaterCell(xNative,zNative);
 for(const [i,height]of p.indices.entries())water.field.heightQ[height]=[0,80*256,110*256][i];
 const q=queryNativeWaterField(water.field,xNative,zNative),x=xNative*.025,z=zNative*.025;
 assert.notEqual(q.sourcePlaneQueryNative,q.renderHeightNative);
 near(nativeFloatingWaterHeight(water,x,z),q.sourcePlaneQueryNative*.025);
 assert.notEqual(nativeFloatingWaterHeight(water,x,z),raceWaterHeight(water,x,z));
 assert.throws(()=>nativeFloatingWaterHeight(captureRaceWater(water),x,z),/host/);
});

test('object motion waits for all hulls and the shared water frame',()=>{
 let calls=0;
 const {world,floating}=make({count:4,observer:(w,c,f)=>{
  calls++;assert.ok(w.adapters.every(a=>a.hull.ticks===c.logicalFrame*5));
  assert.equal(w.water.frames,c.logicalFrame);assert.equal(f.state.frames,c.logicalFrame-1);
 }});
 stepNativeRaceWorld(world,.1,[{},{},{},{}]);assert.equal(calls,2);assert.equal(floating.state.frames,2);
 assert.equal(floating.state.remainder,0);assert.equal(floating.diagnostics(world.adapters[0].hull).outerFrames,2);
});

test('the first object update samples newly evolved water, not the old or display surface',()=>{
 const definitions=[definition({x:0,z:0,y:-.4})],{world,water,floating}=make({definitions});
 // Move craft away without changing the controlled object's source location.
 for(const p of world.adapters[0].hull.points)p.position.x+=100;
 world.adapters[0].hull.center.x+=100;
 stepNativeRaceWorld(world,.05,[{}]);
 const reference=createSourceFloatingObjects(definitions);
 stepSourceFloatingObjects(reference,.05,{surface:(x,z)=>queryNativeWaterField(water.field,x/.025,z/.025).sourcePlaneQueryNative*.025});
 assert.deepEqual(floating.state.objects,reference.objects);
});

test('two human cameras and twelve Port objects share deterministic30/60/144Hz histories',()=>{
 const results=[];
 for(const hz of [30,60,144]){
  const s=make({count:2,definitions:portDynamicObjectsForSelection({playerCount:2})});
  for(let i=0;i<hz;i++)stepNativeRaceWorld(s.world,1/hz,[{throttle:true},{throttle:true,steer:.2}]);
  assert.equal(s.floating.state.frames,20);assert.equal(s.water.frames,20);results.push(s);
 }
 for(const s of results.slice(1)){
  assert.deepEqual(s.floating.snapshot(),results[0].floating.snapshot());
  assert.deepEqual(captureRaceWater(s.water),captureRaceWater(results[0].water));
 }
});

test('actual dynamic contacts recoil objects each hull tick without a floor/contact-drive report',()=>{
 const {world,floating,adapters}=make({definitions:[definition({x:.4,y:.05,z:.675})],noise:false});
 const before=floating.snapshot();stepNativeRaceWorld(world,.01,[{}]);const after=floating.snapshot();
 assert.notDeepEqual(after[0].position,before[0].position);assert.notDeepEqual(after[0].velocity,before[0].velocity);
 assert.equal(floating.state.frames,0);assert.ok(floating.diagnostics(adapters[0].hull).hull.contacts>0);
 assert.deepEqual(adapters[0].contactWindow,{shoreImpactNative:0,floorImpactNative:0,boxImpactNative:0,markedBox:false});
 stepNativeRaceWorld(world,.05,[{}]);assert.equal(floating.diagnostics(adapters[0].hull).hull.logicalFrame,1);
});

test('inactive object motion advances outer ownership but retains its state without catch-up',()=>{
 const a=createNativeRaceAdapter(),water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20});
 const floating=createNativeFloatingWorld({definitions:[definition()],water});let active=false;
 const world=createNativeRaceWorld({adapters:[a],water,afterFrame:(w,c)=>floating.afterFrame(w,c,{active})});
 const initial=floating.snapshot();stepNativeRaceWorld(world,.1,[{}]);assert.deepEqual(floating.snapshot(),initial);
 assert.equal(floating.state.frames,0);assert.equal(floating.diagnostics(a.hull).outerFrames,2);
 active=true;stepNativeRaceWorld(world,.05,[{}]);assert.equal(floating.state.frames,1);
 assert.equal(floating.diagnostics(a.hull).outerFrames,3);
});

test('generic floating contact feeds C50 native impacts while leaving geometry channels and contact drive alone',()=>{
 const {world,floating,adapters}=make({definitions:[definition({x:.4,y:.05,z:.675})],noise:false}),a=adapters[0];
 for(const p of a.hull.points)p.velocity=v(10);
 stepNativeRaceWorld(world,.01,[{}]);const diagnostic=floating.diagnostics(a.hull).hull.impact;
 assert.ok(a.impacts.objectImpactNative>0);assert.equal(a.impacts.objectImpactNative,Math.fround(diagnostic.maximum*.01/a.hull.scale));
 assert.deepEqual(a.impacts.normal,Object.fromEntries(Object.entries(diagnostic.normal).map(([k,n])=>[k,Math.fround(n)])));
 assert.equal(a.impacts.fixedSphereImpactNative,0);assert.equal(a.impacts.floorImpactNative,0);assert.equal(a.impacts.boxImpactNative,0);
 assert.deepEqual(a.contactWindow,{shoreImpactNative:0,floorImpactNative:0,boxImpactNative:0,markedBox:false});
});

test('pause/snapshots cannot advance object motion or expose mutable physics vectors',()=>{
 const {world,floating}=make();stepNativeRaceWorld(world,.017,[{}]);const before=floating.snapshot(),water=captureRaceWater(world.water);
 stepNativeRaceWorld(world,1,null,{active:false});assert.deepEqual(floating.snapshot(),before);assert.deepEqual(captureRaceWater(world.water),water);
 const view=floating.snapshot();view[0].position.x=999;view[0].velocity.y=999;assert.deepEqual(floating.snapshot(),before);
 assert.throws(()=>floating.afterFrame(world,{logicalFrame:5,step:.05}),/exactly one/);
});
