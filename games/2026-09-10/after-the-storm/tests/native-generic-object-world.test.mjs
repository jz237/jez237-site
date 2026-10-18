import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeGenericObjectWorld} from '../native-generic-object-world.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization} from '../native-race-state.js';
import {nativeStuntObjectResources} from '../native-stunt-object-resources.js';
import {nativeSineTableWords} from '../native-math-tables.js';

function make({near=false,activity624=-1,courseIndex=1}={}){
 const adapters=Array.from({length:2},()=>createNativeRaceAdapter({position:{x:near?.75:0,y:0,z:0}}));
 const water=createRaceWater({crafts:adapters.map(a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]})),baseAmplitudeNative:20,initialNoise:false});
 const resource=nativeStuntObjectResources({courseIndex,players:1});
 const fixedSphereWordsB138=Array(1536).fill(0);fixedSphereWordsB138[1]=0x42000000;fixedSphereWordsB138[7]=0x42800000;fixedSphereWordsB138[10]=5;
 let current=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),
  collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  fixedSphereWordsB138,fixedSphereGridWords1ce8:Array(166).fill(0x12340000),
  scene:{courseIndex,players:1,difficulty:2,mode620:11,objectCountFa40:0,ringCountB134:0,fixedSphereCountC938:2,forceStunt824c:0,rampFilterOverride8254:0,reverseDab68:0,alternate8250:0,activity624,simulation648:0}});
 current=prepareNativeRaceObjectLoading(current,{rampRows:[[4000,4000,0,0,0]],ringRows:[[3000,64,3000,0,0,90]],genericRows:[[near?0:1200,0,near?0:1200,8,0],[near?1:1800,0,near?0:1800,9,0]]}).state;
 current=prepareNativeRaceObjectInitialization(current,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resource.planeTemplatesByAddress}).state;
 const fragments=[],hits=[[],[]],objects=createNativeGenericObjectWorld({water,readRaceState:()=>current,commitRaceState:s=>current=s,onFragment:e=>fragments.push(e)});
 adapters.forEach((a,i)=>{a.contacts={primarySpheres:(h,c)=>{const r=objects.contact(h,c);hits[i].push(...r.contacts);}};if(near)for(const p of a.hull.points)p.velocity.x=-30;});
 const motion=[],transforms=[];
 const world=createNativeRaceWorld({adapters,water,humanIndices:[0,1],craftContacts:false,afterFrame:(w,c)=>{
  assert.ok(adapters.every(a=>a.hull.ticks===c.logicalFrame*5));assert.equal(water.frames,c.logicalFrame);
  // A preceding source stage may change the canonical owner between contacts
  // and motion. The bridge must read fresh state rather than cache a copy.
  const changed=nativeRaceStateSnapshot(current);changed.raceWords1f94[0]=c.logicalFrame;current=createNativeRaceState(changed);
  motion.push(objects.afterFrame(w,c));transforms.push(objects.updateTransforms(w,c,{sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:resource.planeTemplatesByAddress}));
 }});
 return {adapters,water,world,objects,fragments,hits,motion,transforms,state:()=>current};
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
