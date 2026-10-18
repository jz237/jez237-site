import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createNativeCourseObjectStartup} from '../native-course-object-startup.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-course-object-resources-reference.json',import.meta.url)));
function hash(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
const create=(course='greyhaven',options={})=>createRace({course:getCourse(course,options.difficulty??0),mode:'time',physics:'native',...options});
function frames(s,n,input={}){const target=s.nativeHost.world.frames+n;while(s.nativeHost.world.frames<target)stepRace(s,input,1/60);}

test('fresh web course-object startup matches all108 original ordinary object/plane/fixed-grid images',()=>{
 for(const c of reference.checks){
  const actual=createNativeCourseObjectStartup(c);
  for(const [key,expected]of Object.entries(c.hashes))assert.equal(hash(actual.storage[key]),expected,`${c.courseIndex}/${c.players}/${c.difficulty}/${c.reverseDab68}: ${key}`);
  for(const [key,value]of Object.entries(actual.counts))assert.equal(value,c[key],key);
  assert.deepEqual(actual.objectKinds4c,Array.from({length:actual.counts.objectCountFa40},(_,i)=>actual.storage.objectWordsC940[i*49+19]|0));
  assert.ok(Object.isFrozen(actual.storage.objectWordsC940));
 }
});

test('all32 admitted live course/player/class starts use the original complete object owner and AI indices',()=>{
 for(const [course,courseIndex]of [['greyhaven',1],['amber',2],['tempest',7],['glacier',8]])for(const difficulty of [0,1,2,3])for(const mode of ['time','versus']){
  const s=create(course,{difficulty,mode}),a=s.nativeLaunch.snapshot(),objects=s.nativeHost.objects;
  const c=reference.checks.find(c=>c.courseIndex===courseIndex&&c.players===(mode==='time'?1:2)&&c.difficulty===[0,1,2,2][difficulty]&&c.reverseDab68===Number(difficulty===3));
  assert.ok(c);assert.equal(s.sourceSphereGrid,null);assert.ok(s.nativeHost.provenance.canonicalCourseObjects);
  for(const [key,expected]of Object.entries(c.hashes))assert.equal(hash(a[key]),expected,`${course}/${difficulty}/${mode}: ${key}`);
  assert.equal(s.nativeHost.contacts.boxes,objects.boxContact);assert.equal(s.nativeHost.contacts.fixedSpheres,objects.fixedContact);assert.equal(s.nativeHost.contacts.primarySpheres,objects.contact);
  assert.equal(objects.snapshot().length,a.scene.objectCountFa40);
  const indices=objects.snapshot().filter(o=>o.runtimeKind===1).map(o=>o.sourceIndex);
  assert.deepEqual(s.nativeHost.aiInitialization.proximityObjectIndicesPrefix,indices);
  assert.equal(a.aiWords3c60[(0x4110-0x3c60)/4],indices.length);
  assert.deepEqual(a.aiWords3c60.slice((0x4118-0x3c60)/4,(0x4118-0x3c60)/4+indices.length),indices);
  assert.throws(()=>s.nativeLaunch.createObjectWorld({water:s.raceWater}),/only once/);
  const snapshot=objects.snapshot(),fixed=objects.fixedSnapshot();
  if(snapshot.length)snapshot[0].positionNative[0]=12345;
  if(fixed.length)fixed[0].position.y=12345;
  assert.deepEqual(s.nativeLaunch.snapshot(),a,'display snapshots do not write either owner');
 }
});

test('live canonical contacts, motion and transform phases share pause and activity gates across both players',()=>{
 for(const mode of ['time','versus'])for(const activity624 of [-1,0]){
  const initial=create('glacier',{mode}).nativeLaunch.snapshot();
  Object.assign(initial.scene,{activity624,simulation648:0,phase650:3});
  // Prepared broken source row:6E0F4 owns hiding/age, independently of hull simulation.
  const row=Array.from({length:initial.scene.objectCountFa40},(_,i)=>i).find(i=>initial.objectWordsC940[i*49+19]===10);
  initial.objectWordsC940[row*49+0xbc/4]=1;
  const s=create('glacier',{mode,nativeInitialRaceState:initial}),host=s.nativeHost;
  frames(s,3,mode==='versus'?[{},{}]:{});
  const a=s.nativeLaunch.snapshot(),o=host.objects.snapshot()[row];
  assert.equal(host.world.ticks,0);assert.equal(host.objects.diagnostics().outerFrames,3);
  assert.equal(host.objects.diagnostics().motionUpdates,activity624===-1?3:0);
  assert.equal(o.age,activity624===-1?3:0);assert.equal(o.renderKind,activity624===-1?0:1);
  assert.equal(s.nativeIce.objects.find(q=>q.id===o.id).visible,activity624!==-1);
  const water=captureRaceWater(s.raceWater);s.phase='paused';stepRace(s,{},1);
  assert.deepEqual(s.nativeLaunch.snapshot(),a);assert.deepEqual(captureRaceWater(s.raceWater),water);
 }
});

test('custom diagnostic objects require explicit authored selection and retained source storage is never silently reset',()=>{
 const course={...getCourse('greyhaven'),dynamicObjectsForPlayers:()=>[{id:'custom-gate',x:40,y:-.5,z:40}]};
 assert.throws(()=>create('greyhaven',{course}),/authored object layout/);
 const custom=create('greyhaven',{course,nativeObjectLayout:'authored'});
 assert.equal(custom.nativeHost.objects,null);assert.equal(custom.nativeHost.floating.snapshot().length,1);
 const initial=create().nativeLaunch.snapshot();delete initial.fixedSphereGridWords1ce8;
 assert.throws(()=>create('greyhaven',{nativeInitialRaceState:initial}),/retained object/);
});
