import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {NATIVE_COURSE_ACTOR_ROUTE_WORDS} from '../source-course-actor-route-tables.js';
const bank=i=>new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)));
// Families change type in play (Drake Lake's birds land: type1 flying, type2 perched).
const COURSES={greyhaven:{banks:[3,2],families:[3,4,7,8,9],count:11},amber:{banks:[0],families:[6],count:3},reed:{banks:[6,4],families:[1,2,10],count:10},glacier:{banks:[8],families:[13],count:5}};
function run(id,{mode='time',hz=30,seconds=6}={}){
 const displays=[],s=createRace({mode,physics:'native',course:getCourse(id,0),difficulty:0,
  nativeCourseActors:{assets:Object.fromEntries(COURSES[id].banks.map(i=>[i,bank(i)])),onDisplay:(p,r)=>displays.push({p,r})}});
 for(let i=0;i<hz*seconds;i++)stepRace(s,{throttle:1,steer:.2},1/hz);
 return {s,displays};
}

test('route tables follow the original 800E6C78 pointers into one shared block',()=>{
 assert.deepEqual(NATIVE_COURSE_ACTOR_ROUTE_WORDS.map(t=>t.length/7),[88,87,86,40,39,31,20,19,11]);
 // Overlapping course pointers: Sunny Beach starts one row after Dolphin Park.
 assert.deepEqual(NATIVE_COURSE_ACTOR_ROUTE_WORDS[1],NATIVE_COURSE_ACTOR_ROUTE_WORDS[0].slice(7));
});

test('primary-route courses run their original actor families with the course actor host',()=>{
 for(const [id,expected]of Object.entries(COURSES)){
  const {s,displays}=run(id),w=s.nativeLaunch.snapshot().actorWordsF060,types={};
  for(let a=0;a<30;a++){const t=w[a*47];if(t)types[t]=(types[t]||0)+1;}
  assert.ok(Object.keys(types).every(t=>expected.families.includes(Number(t))),id+' '+JSON.stringify(types));assert.equal(Object.values(types).reduce((a,b)=>a+b,0),expected.count,id);assert.equal(displays.length,s.nativeHost.world.frames,id);
  assert.deepEqual([0,1].map(slot=>displays.at(-1).r[(0x9c+slot*8)/4]>>>0).filter(b=>b!==0xffffffff),expected.banks,id);
  assert.ok(s.nativeHost.sceneEffects,id+' keeps the scene-effects owner');
 }
});

test('course actors are identical at30 and60Hz and also run in a native championship round',()=>{
 const a=run('amber',{hz:30}),b=run('amber',{hz:60});
 assert.deepEqual(a.s.nativeLaunch.snapshot().actorWordsF060,b.s.nativeLaunch.snapshot().actorWordsF060);
 const cup=run('amber',{mode:'championship',seconds:4});assert.equal(cup.s.racers.length,4);assert.ok(cup.displays.length>0);
 assert.throws(()=>createRace({mode:'time',physics:'native',course:getCourse('citadel',0),nativeCourseActors:{assets:{},onDisplay(){}}}),/primary-route actor course/);
});
