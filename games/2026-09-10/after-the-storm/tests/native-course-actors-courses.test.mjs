import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {NATIVE_COURSE_ACTOR_ROUTE_WORDS} from '../source-course-actor-route-tables.js';
const bank=i=>new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)));
// Families change type in play (Drake Lake's birds land: type1 flying, type2 perched).
// banks: animated assets to load; slots: banks the course selects (Port Blue's bank7 is static).
const COURSES={greyhaven:{banks:[3,2],families:[3,4,7,8,9],count:11},amber:{banks:[0],families:[6],count:3},reed:{banks:[6,4],families:[1,2,10],count:10},glacier:{banks:[8],families:[13],count:5},
 citadel:{banks:[3],families:[3,4],count:5},port:{banks:[],slots:[7],families:[12],count:1},tempest:{banks:[1,3],families:[1,3,4],count:5}};
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

test('seven courses run their original actor families with the course actor host',()=>{
 for(const [id,expected]of Object.entries(COURSES)){
  const {s,displays}=run(id),w=s.nativeLaunch.snapshot().actorWordsF060,types={};
  for(let a=0;a<30;a++){const t=w[a*47];if(t)types[t]=(types[t]||0)+1;}
  assert.ok(Object.keys(types).every(t=>expected.families.includes(Number(t))),id+' '+JSON.stringify(types));assert.equal(Object.values(types).reduce((a,b)=>a+b,0),expected.count,id);assert.equal(displays.length,s.nativeHost.world.frames,id);
  assert.deepEqual([0,1].map(slot=>displays.at(-1).r[(0x9c+slot*8)/4]>>>0).filter(b=>b!==0xffffffff),expected.slots??expected.banks,id);
  assert.ok(s.nativeHost.sceneEffects,id+' keeps the scene-effects owner');
 }
});

test('course actors are identical at30 and60Hz and also run in a native championship round',()=>{
 const a=run('amber',{hz:30}),b=run('amber',{hz:60});
 assert.deepEqual(a.s.nativeLaunch.snapshot().actorWordsF060,b.s.nativeLaunch.snapshot().actorWordsF060);
 const cup=run('amber',{mode:'championship',seconds:4});assert.equal(cup.s.racers.length,4);assert.ok(cup.displays.length>0);
 assert.throws(()=>createRace({mode:'time',physics:'native',course:getCourse('neon',1),difficulty:1,nativeCourseActors:{assets:{},onDisplay(){}}}),/original actor course/);
 assert.equal(run('tempest').s.nativeLaunch.snapshot().scene.secondaryCount,47);
});

test('native Stunt runs the original course actors, with Dolphin Park reading no secondary route',()=>{
 for(const id of ['reed','glacier']){
  const {s,displays}=run(id,{mode:'stunt'}),w=s.nativeLaunch.snapshot().actorWordsF060;let count=0;
  for(let a=0;a<30;a++){const t=w[a*47];if(t){count++;assert.ok(COURSES[id].families.includes(t),id+' family '+t);}}
  assert.equal(count,COURSES[id].count,id);assert.equal(displays.length,s.nativeHost.world.frames,id);assert.ok(s.nativeHost.lastStunt,id+' Stunt judging still runs');
 }
 // 71E70's Stunt branch selects no alternate routes, even for the dolphins.
 let effects=0;const s=createRace({mode:'stunt',physics:'native',course:getCourse('practice'),
  nativeCourseActors:{assets:{0:bank(0),2:bank(2)},onDisplay(){},onEffectsDisplay:()=>effects++}});
 for(let i=0;i<180;i++)stepRace(s,{throttle:1,steer:.2},1/30);
 const snap=s.nativeLaunch.snapshot();
 assert.equal(snap.scene.secondaryCount,0);assert.equal(snap.effectWords0790[0],2,'Dolphin extra effect slot');
 assert.ok(snap.actorWordsF060.some((_,i)=>i%47===0&&snap.actorWordsF060[i]===6),'dolphins swim');assert.equal(effects,s.nativeHost.world.frames);
 assert.throws(()=>createRace({mode:'stunt',physics:'native',course:getCourse('neon',1),difficulty:1,nativeCourseActors:{assets:{},onDisplay(){}}}),/original actor course/);
});
