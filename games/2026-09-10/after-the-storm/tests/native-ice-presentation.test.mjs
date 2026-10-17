import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {captureNativeIcePresentation,nativeIceOwnerPresentation,sampleNativeIcePresentation,nativeIceFragmentPose,nativeIceSplashPose} from '../native-ice-presentation.js';
import {createNativeIceSplashes,queueNativeIceSplash,stepNativeIceSplashes} from '../native-ice-splashes.js';
import {createNativeIceFragments,spawnNativeIceFragments,stepNativeIceFragments} from '../native-ice-fragments.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame} from '../player-window-presentation.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ice-presentation-reference.json',import.meta.url)));
const object={id:'ice-0',renderKind:1,position:{x:2,y:0,z:3}},generations=Array.from({length:16},(_,i)=>i+1);
const spawn=()=>spawnNativeIceFragments(createNativeIceFragments(),{positionNative:[80,0,120],velocityNative:[4,5,-6],seed6f00:17}).state;
const view=pool=>nativeIceOwnerPresentation([object],pool,.025,generations);
const splashView=pool=>nativeIceOwnerPresentation([object],null,.025,[],pool,Array.from({length:8},(_,i)=>i+1));

test('splash display retains source placement,32-unit extent and all seven discrete frame ages',()=>{
 let pool=queueNativeIceSplash(createNativeIceSplashes(),[80,24,120]),seed=17;
 for(let age=1;age<=8;age++){
  const result=stepNativeIceSplashes(pool,seed);pool=result.state;seed=result.seed6f00;
  const display=splashView(pool),s=display.splashes[0],source=pool.slots[0];
  assert.deepEqual(Object.values(s.position),source.position.map(x=>x*.025));assert.equal(s.size,source.scale*.8);
  assert.equal(s.age,age);assert.equal(s.active,age<8);
  assert.deepEqual(nativeIceSplashPose(s),age<8?{position:s.position,size:s.size,frame:age-1}:null);
 }
});

test('splash frames validate and detach display data, including legacy snapshots',()=>{
 const pool=stepNativeIceSplashes(queueNativeIceSplash(createNativeIceSplashes(),[0,24,0]),17).state,a=splashView(pool);
 a.splashes[0].seed6f00=17;const b=captureNativeIcePresentation(a);b.splashes[0].position.x=999;
 assert.notEqual(a.splashes[0].position.x,999);assert.equal(b.splashes[0].seed6f00,undefined);
 delete a.splashes[0].seed6f00;
 for(const edit of [v=>v.splashes.pop(),v=>v.splashes[0].generation=0,v=>v.splashes[0].age=8,v=>v.splashes[0].size=-1,v=>v.splashes[0].position.z=Infinity]){
  const c=structuredClone(a);edit(c);assert.throws(()=>captureNativeIcePresentation(c));
 }
 assert.equal(captureNativeIcePresentation(view(spawn())).splashes,undefined);
 const next=structuredClone(a);next.splashes[0].age=2;
 assert.deepEqual(sampleNativeIcePresentation(a,next,.999).splashes,a.splashes);
 assert.deepEqual(sampleNativeIcePresentation(a,next,1).splashes,next.splashes);
 next.splashes[0].generation++;next.splashes[0].position.x=400;
 assert.deepEqual(sampleNativeIcePresentation(a,next,.5).splashes,a.splashes);
});

test('source fragment transform arguments match original B4ABC display producer',()=>{
 for(const q of reference.cases){
  // The retirement boundary fixture has a synthetic null display-list pointer;
  // give it authored variant0 for presentation without changing transform data.
  const pool=structuredClone(q.input);for(const s of pool.slots)if(s.active&&s.variant<0)s.variant=0;
  const result=nativeIceOwnerPresentation([],pool,.025,generations);
  assert.equal(result.fragments.filter(f=>f.active).length,q.expected.length);
  for(const e of q.expected){const f=result.fragments[e.slot];assert.equal(f.angleDegrees,e.angleDegrees);
   assert.deepEqual(Object.values(f.axis),e.axis);assert.deepEqual(Object.values(f.position),e.positionNative.map(x=>x*.025));}
 }
});

test('ice display is detached, bounded and excludes random, physical and contact state',()=>{
 const pool=spawn(),a=view(pool);a.seed6f00=17;a.fragments[0].velocity=[1,2,3];a.objects[0].broken=true;
 const b=captureNativeIcePresentation(a);assert.equal(b.seed6f00,undefined);assert.equal(b.fragments[0].velocity,undefined);assert.equal(b.objects[0].broken,undefined);
 b.fragments[0].position.x=500;b.objects[0].position.x=500;assert.notEqual(a.fragments[0].position.x,500);assert.equal(object.position.x,2);
 for(const edit of [v=>v.objects.push(v.objects[0]),v=>v.fragments.pop(),v=>v.fragments[0].generation=0,v=>v.fragments[0].position.x=Infinity,v=>v.fragments[0].axis.z=1e10,v=>v.fragments[0].active=1,v=>v.version=2]){
  const c=structuredClone(a);edit(c);assert.throws(()=>captureNativeIcePresentation(c));
 }
 assert.throws(()=>captureNativeIcePresentation(undefined));assert.equal(captureNativeIcePresentation(null),null);
});

test('interpolation holds removal, birth and reused slots until their exact recorded boundary',()=>{
 const pool=spawn(),a=view(pool),b=view(stepNativeIceFragments(pool));b.objects[0].visible=false;
 const before=structuredClone([a,b]),m=sampleNativeIcePresentation(a,b,.5);
 assert.equal(m.objects[0].visible,true);assert.equal(m.fragments[0].position.x,(a.fragments[0].position.x+b.fragments[0].position.x)/2);
 assert.equal(m.fragments[0].angleDegrees,-4);assert.deepEqual(sampleNativeIcePresentation(a,b,1),b);
 for(const change of [v=>v.fragments[0].generation++,v=>v.fragments[0].active=false,v=>v.fragments[0].variant=7]){
  const next=structuredClone(b);change(next);assert.deepEqual(sampleNativeIcePresentation(a,next,.99).fragments[0],a.fragments[0]);
 }
 assert.deepEqual(sampleNativeIcePresentation(null,b,.5),null);assert.deepEqual(sampleNativeIcePresentation(null,b,1),b);
 assert.deepEqual([a,b],before);const pose=nativeIceFragmentPose(m.fragments[0]);assert.ok(Math.abs(Math.hypot(...pose.quaternion)-1)<1e-12);
 assert.equal(nativeIceFragmentPose(a.fragments[10]),null);
});

test('replay and second-player frames retain historical ice after live pool reuse',()=>{
 const s=createRace({mode:'versus',course:getCourse('greyhaven')}),pool=spawn(),rec=createRecorder();s.phase='running';s.time=1;s.nativeIce=view(pool);
 s.nativeIce.splashes=splashView(stepNativeIceSplashes(queueNativeIceSplash(createNativeIceSplashes(),[80,24,120]),17).state).splashes;
 const water={level:0,wake:[],impacts:[],craft:[]},wireA=captureWindowFrame(s,water);recordMoment(rec,s,water);
 s.time=1.05;s.nativeIce=view(stepNativeIceFragments(pool));s.nativeIce.objects[0].visible=false;
 s.nativeIce.splashes=structuredClone(wireA.nativeIce.splashes);s.nativeIce.splashes[0].age=2;
 const wireB=captureWindowFrame(s,water);recordMoment(rec,s,water);
 const a=readWindowFrame(structuredClone(wireA)),b=readWindowFrame(structuredClone(wireB));assert.ok(a&&b);
 s.nativeIce.fragments[0].generation=99;s.nativeIce.fragments[0].position.x=999;
 s.nativeIce.splashes[0].generation=99;s.nativeIce.splashes[0].position.x=999;
 const clip={frames:rec.frames};
 for(const time of [1,1.025,1.05])assert.deepEqual(replaySample(clip,time).nativeIce,interpolateWindowFrame(a,b,time).nativeIce);
 const middle=replaySample(clip,1.025);assert.equal(middle.nativeIce.objects[0].visible,true);middle.nativeIce.fragments[0].position.x=999;
 assert.notEqual(rec.frames[0].nativeIce.fragments[0].position.x,999);
 assert.notEqual(rec.frames[0].nativeIce.splashes[0].position.x,999);
 for(const invalid of [undefined,{version:2}, {...wireA.nativeIce,fragments:[]}]){
  // An empty pool is supported for an explicit owner with no fragment producer.
  const result=readWindowFrame({...wireA,nativeIce:invalid});if(invalid?.version===1)assert.ok(result);else assert.equal(result,null);
 }
 assert.deepEqual(interpolateWindowFrame(b,b,1.05).nativeIce,b.nativeIce);
});
