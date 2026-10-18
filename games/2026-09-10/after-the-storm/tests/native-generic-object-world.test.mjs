import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeGenericObjectWorld} from '../native-generic-object-world.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceFixedSphereInitialization,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createNativeIceFragments,spawnNativeIceFragments,stepNativeIceFragments} from '../native-ice-fragments.js';
import {createNativeIceSplashes,queueNativeIceSplash,stepNativeIceSplashes} from '../native-ice-splashes.js';
import {captureNativeIcePresentation} from '../native-ice-presentation.js';

function make({near=false,activity624=-1,courseIndex=1,effects=false,fixed=false}={}){
 const adapters=Array.from({length:2},()=>createNativeRaceAdapter({position:{x:near?.75:0,y:0,z:0}}));
 const water=createRaceWater({crafts:adapters.map(a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]})),baseAmplitudeNative:20,initialNoise:false});
 const resource=nativeStuntObjectResources({courseIndex,players:1});
 const fixedSphereWordsB138=Array(1536).fill(0);fixedSphereWordsB138[1]=0x42000000;fixedSphereWordsB138[7]=0x42800000;fixedSphereWordsB138[10]=5;
 if(fixed){const bits=new DataView(new ArrayBuffer(4));for(const [i,v]of [[0,16],[2,27],[6,5000],[8,5000]]){bits.setFloat32(0,v);fixedSphereWordsB138[i]=bits.getUint32(0);}}
 let current=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),
  collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  fixedSphereWordsB138,fixedSphereGridWords1ce8:Array(166).fill(0x12340000),
  scene:{courseIndex,players:1,difficulty:2,mode620:11,objectCountFa40:0,ringCountB134:0,fixedSphereCountC938:2,forceStunt824c:0,rampFilterOverride8254:0,reverseDab68:0,alternate8250:0,activity624,simulation648:0,seed6f00:65535}});
 current=prepareNativeRaceObjectLoading(current,{rampRows:[[4000,4000,0,0,0]],ringRows:[[3000,64,3000,0,0,90]],genericRows:[[near?0:1200,0,near?0:1200,8,0],[near?1:1800,0,near?0:1800,9,0]]}).state;
 current=prepareNativeRaceObjectInitialization(current,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resource.planeTemplatesByAddress}).state;
 if(fixed)current=prepareNativeRaceFixedSphereInitialization(current).state;
 const draws=[],saveSeed=(kind,result)=>{draws.push({kind,seed:result.seed6f00,draws:result.randomDraws});current=prepareNativeRaceStateOperations(current,[{kind:'sourceHalfwordWrite',field:'seed6f00',value:result.seed6f00}]).state;return result;};
 const fragments=[],hits=[[],[]],objects=createNativeGenericObjectWorld({water,readRaceState:()=>current,commitRaceState:s=>current=s,onFragment:e=>fragments.push(e),objectIds:['ramp','ring','floating','ice'],
  ...(effects?{fragmentBurst:(pool,event)=>saveSeed('fragment',spawnNativeIceFragments(pool,{...event,seed6f00:current.scene.seed6f00})),
   splashAdvance:pool=>saveSeed('splash',stepNativeIceSplashes(pool,current.scene.seed6f00))}:{})});
 const fixedHits=[[],[]];
 adapters.forEach((a,i)=>{a.contacts={...(fixed?{fixedSpheres:(h,c)=>{const r=objects.fixedContact(h,c);fixedHits[i].push(...r.contacts);}}:{}),primarySpheres:(h,c)=>{const r=objects.contact(h,c);hits[i].push(...r.contacts);}};
  if(near||fixed)for(const p of a.hull.points)p.velocity.x=near?-30:20;});
 const motion=[],transforms=[];
 const world=createNativeRaceWorld({adapters,water,humanIndices:[0,1],craftContacts:false,afterFrame:(w,c)=>{
  assert.ok(adapters.every(a=>a.hull.ticks===c.logicalFrame*5));assert.equal(water.frames,c.logicalFrame);
  // A preceding source stage may change the canonical owner between contacts
  // and motion. The bridge must read fresh state rather than cache a copy.
  const changed=nativeRaceStateSnapshot(current);changed.raceWords1f94[0]=c.logicalFrame;current=createNativeRaceState(changed);
  motion.push(objects.afterFrame(w,c));transforms.push(objects.updateTransforms(w,c,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resource.planeTemplatesByAddress}));
  objects.afterEffects(w,c);
 }});
 return {adapters,water,world,objects,fragments,hits,fixedHits,motion,transforms,draws,state:()=>current,
  setActivity:v=>current=prepareNativeRaceStateOperations(current,[{kind:'sourceHalfwordWrite',field:'activity624',value:v&65535}]).state};
}

test('two physical riders share mixed object contacts, one ice break and later recoil-driven motion',()=>{
 const q=make({near:true}),before=q.state();stepNativeRaceWorld(q.world,.05,[{},{}]);
 assert.equal(q.fragments.length,1);assert.equal(q.fragments[0].sourceIndex,3);
 assert.equal(q.state().objectWordsC940[3*49+0xbc/4],1);
 assert.ok(q.hits[1].some(hit=>hit.index===3&&hit.broke),'descending rider order reaches ice first');
 assert.ok(q.hits[0].every(hit=>hit.index!==3),'later rider observes broken ice immediately');
 assert.ok(q.hits.flat().some(hit=>hit.index===2),'floating and ice share one source array');
 assert.deepEqual(q.motion[0].diagnostic.queries.map(q=>q.objectIndex),[2]);
 assert.equal(q.state().raceWords1f94[0],1);assert.equal(q.objects.diagnostics().outerFrames,1);
 assert.deepEqual(q.state().objectWordsC940.slice(0,49),before.objectWordsC940.slice(0,49));
 assert.deepEqual(q.state().objectWordsC940.slice(49,49+3),before.objectWordsC940.slice(49,49+3));
 assert.deepEqual(q.state().objectWordsC940.slice(49+0x30/4,49+0x40/4),before.objectWordsC940.slice(49+0x30/4,49+0x40/4));
 assert.deepEqual(q.state().collisionPlaneWordsFd78,before.collisionPlaneWordsFd78);
 assert.deepEqual(q.state().packedObjectMatrixWords0cd0,before.packedObjectMatrixWords0cd0);
 assert.equal(q.objects.snapshot()[3].broken,true);assert.equal(q.objects.snapshot()[3].renderKind,0);assert.equal(q.objects.snapshot()[3].age,1);
 assert.equal(q.objects.snapshot()[1].anglesDegrees[2],356);assert.equal(q.objects.diagnostics().transformUpdates,1);
});

test('the shared physical clock produces identical object state at30,60 and144 render updates',()=>{
 let expected;
 for(const hz of [30,60,144]){
  const q=make();for(let i=0;i<hz;i++)stepNativeRaceWorld(q.world,1/hz,[{},{}]);
  assert.equal(q.objects.diagnostics().outerFrames,20);assert.equal(q.objects.diagnostics().motionUpdates,20);
  assert.equal(q.objects.diagnostics().transformUpdates,20);assert.equal(q.objects.snapshot()[1].anglesDegrees[2],280);
  assert.equal(q.state().raceWords1f94[0],20);assert.ok(q.adapters.every(a=>a.hull.ticks===100));
  if(expected)assert.deepEqual(q.state().objectWordsC940,expected);else expected=q.state().objectWordsC940;
 }
});

test('inactive object motion preserves data, and duplicate/out-of-order frame calls reject',()=>{
 const q=make({activity624:0}),before=q.state().objectWordsC940;stepNativeRaceWorld(q.world,.05,[{},{}]);
 assert.deepEqual(q.state().objectWordsC940,before);assert.equal(q.objects.diagnostics().motionUpdates,0);
 assert.equal(q.objects.diagnostics().transformUpdates,0);assert.equal(q.objects.diagnostics().transformFrames,1);
 assert.throws(()=>q.objects.afterFrame(q.world,{logicalFrame:1,step:.05}),/exactly one/);
 assert.throws(()=>q.objects.contact(q.adapters[0].hull,{logicalFrame:0}),/current native/);
 assert.throws(()=>q.objects.updateTransforms(q.world,{logicalFrame:1,step:.05}),/completed object-motion/);
});

test('completed shared water reaches Southern fixed spheres before transforms and keeps hidden heights',()=>{
 for(const [courseIndex,activity624]of [[7,-1],[7,0],[1,-1]]){
  const q=make({courseIndex,activity624}),before=q.state();
  for(const datumNative of [-99,-100,-150]){
   stepNativeRaceWorld(q.world,.05,[{},{}],{waterOptions:{datumNative}});
   const reached=courseIndex===7&&activity624===-1,expected=before.fixedSphereWordsB138.slice();
   if(reached){const b=new DataView(new ArrayBuffer(4));b.setFloat32(0,datumNative);expected[1]=b.getUint32(0);}
   assert.equal(q.water.field.datumNative,datumNative);assert.deepEqual(q.state().fixedSphereWordsB138,expected);
   assert.deepEqual(q.state().fixedSphereGridWords1ce8,before.fixedSphereGridWords1ce8);
   assert.deepEqual(q.transforms.at(-1).diagnostic.fixedSphereRows,reached?[0]:[]);
   if(reached)assert.equal(q.transforms.at(-1).applied,true);
  }
 }
});

test('shared mixed objects produce one canonical-seed burst and independent splash phase with read-only presentation',()=>{
 const q=make({near:true,activity624:0,effects:true}),seed=q.state().scene.seed6f00;
 stepNativeRaceWorld(q.world,.01,[{},{}]);
 assert.equal(q.objects.breakEvents().length,1);assert.equal(q.fragments.length,1);
 const event=q.objects.breakEvents()[0];assert.equal(event.sourceIndex,3);assert.equal(event.id,'ice');
 const burst=spawnNativeIceFragments(createNativeIceFragments(),{...event,seed6f00:seed}),queued=queueNativeIceSplash(createNativeIceSplashes(),burst.splashPositionNative);
 assert.deepEqual(q.objects.fragmentSnapshot(),burst.state);assert.deepEqual(q.objects.splashSnapshot(),queued);
 assert.equal(q.state().scene.seed6f00,burst.seed6f00);assert.deepEqual(q.draws,[{kind:'fragment',seed:burst.seed6f00,draws:16}]);
 assert.throws(()=>q.objects.afterEffects(q.world,{logicalFrame:0,step:.05}),/completed transform/);
 const display=q.objects.presentationSnapshot();assert.equal(display.objects.length,1);assert.equal(display.objects[0].id,'ice');assert.equal(display.objects[0].visible,true);
 assert.deepEqual(display.fragments.filter(f=>f.active).map(f=>f.generation),[1,2,3,4,5,6,7,8]);
 assert.deepEqual(captureNativeIcePresentation(display),display);
 display.objects[0].position.x=98765;display.fragments[0].position.x=98765;
 assert.notEqual(q.objects.presentationSnapshot().objects[0].position.x,98765);assert.notEqual(q.objects.presentationSnapshot().fragments[0].position.x,98765);
 const first=stepNativeIceSplashes(queued,burst.seed6f00);stepNativeRaceWorld(q.world,.04,[{},{}]);
 assert.deepEqual(q.objects.fragmentSnapshot(),burst.state,'activity holds fragments');assert.deepEqual(q.objects.splashSnapshot(),first.state);
 assert.equal(q.state().scene.seed6f00,first.seed6f00);assert.equal(q.objects.presentationSnapshot().splashes[0].generation,1);
 assert.equal(q.objects.presentationSnapshot().objects[0].visible,true);
 q.setActivity(-1);const second=stepNativeIceSplashes(first.state,first.seed6f00);stepNativeRaceWorld(q.world,.05,[{},{}]);
 assert.deepEqual(q.objects.fragmentSnapshot(),stepNativeIceFragments(burst.state));assert.deepEqual(q.objects.splashSnapshot(),second.state);
 assert.equal(q.state().scene.seed6f00,second.seed6f00);assert.equal(q.objects.presentationSnapshot().objects[0].visible,false);
 assert.equal(q.objects.snapshot()[3].age,1);assert.equal(q.objects.diagnostics().effectsFrames,2);
 const before={state:q.state(),fragments:q.objects.fragmentSnapshot(),splashes:q.objects.splashSnapshot(),display:q.objects.presentationSnapshot(),draws:q.draws.slice()};
 stepNativeRaceWorld(q.world,1,[{},{}],{active:false});
 assert.deepEqual({state:q.state(),fragments:q.objects.fragmentSnapshot(),splashes:q.objects.splashSnapshot(),display:q.objects.presentationSnapshot(),draws:q.draws},before);
 assert.throws(()=>q.objects.afterEffects(q.world,{logicalFrame:q.world.frames,step:.05}),/once/);
});

test('mixed contact, object, fragment, splash and random histories match at30,60 and144 render updates',()=>{
 const runs=[];
 for(const hz of [30,60,144]){
  const q=make({near:true,effects:true});for(let i=0;i<hz;i++)stepNativeRaceWorld(q.world,1/hz,[{},{}]);
  runs.push({state:q.state(),objects:q.objects.snapshot(),events:q.objects.breakEvents(),fragments:q.objects.fragmentSnapshot(),splashes:q.objects.splashSnapshot(),presentation:q.objects.presentationSnapshot(),draws:q.draws,
   riders:q.adapters.map(a=>({points:a.hull.points,impacts:a.impacts,hitKind:a.objectHitKind16d8}))});
 }
 assert.deepEqual(runs[0],runs[1]);assert.deepEqual(runs[1],runs[2]);assert.equal(runs[0].events.length,1);
});

test('two physical riders query the same canonical fixed grid and retain separate C3C impact maxima',()=>{
 const q=make({fixed:true}),before=q.state();stepNativeRaceWorld(q.world,.01,[{},{}]);
 assert.ok(q.fixedHits.every(h=>h.length>0));assert.ok(q.fixedHits.flat().every(h=>h.index===0));
 assert.ok(q.adapters.every(a=>a.impacts.fixedSphereImpactNative>0));
 assert.ok(q.adapters.every(a=>a.impacts.objectImpactNative===0));
 assert.deepEqual(q.state().fixedSphereWordsB138,before.fixedSphereWordsB138);assert.deepEqual(q.state().fixedSphereGridWords1ce8,before.fixedSphereGridWords1ce8);
 assert.ok(q.adapters.every(a=>q.objects.diagnostics(a.hull).hull.fixedContacts>0));
 const runs=[];
 for(const hz of [30,60,144]){
  const s=make({fixed:true});for(let i=0;i<hz;i++)stepNativeRaceWorld(s.world,1/hz,[{},{}]);
  runs.push({state:s.state(),hits:s.fixedHits,points:s.adapters.map(a=>a.hull.points),impacts:s.adapters.map(a=>a.impacts)});
 }
 assert.deepEqual(runs[0],runs[1]);assert.deepEqual(runs[1],runs[2]);
});
