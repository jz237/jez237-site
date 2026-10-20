import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createNativeCourseEffectsHost} from '../native-course-effects-host.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {createNativeRaceState} from '../native-race-state.js';
import {NATIVE_EFFECT_CONTROL_INITIAL_WORDS} from '../source-effect-controls.js';
import {createNativeRaceSpray} from '../native-race-spray.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const init=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-effects-initialization.json.gz',import.meta.url))));
const assets=Object.fromEntries([0,2].map(i=>[i,new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)))]));
const hash=b=>createHash('sha256').update(Buffer.from(b)).digest('hex');
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return hash(b);};
const bits=new DataView(new ArrayBuffer(4)),float=w=>{bits.setUint32(0,w);return bits.getFloat32(0);},F=Math.fround,e=a=>(a-0x790)/4;
const make=(options={})=>createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay(){},...options}});

function owner(c,{retained=true}={}){
 let state=structuredClone(createNativeRaceMemory({racers:Array.from({length:c.input.racerCount},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:c.input.courseIndex,players:1,mode620:4})),commits=0;
 state.actorWordsF060=[...init.actorWordsF060];
 if(retained){state.effectWords0790=[...init.baseEffectWords];state.effectControlWords6d60=[...c.input.effectControlWords6d60];}
 state=createNativeRaceState(state);
 const host=createNativeCourseEffectsHost({readRaceState:()=>state,commitRaceState:q=>{state=createNativeRaceState(q);commits++;},
  worldScale:.025,graphicsBuffers:[init.baseGraphicsBytes,init.baseGraphicsBytes]});
 return {host,read:()=>state,commits:()=>commits,input:{clockLow32:c.input.clockLow32,bodyWordsBySlot:structuredClone(init.bodyWordsBySlot),queryNative:()=>c.input.waterValue}};
}

test('effect host commits the exact original AE7C4 result into the shared owner and both retained buffers',()=>{
 // Course scenes9-11 have no fresh race memory; their AE7C4 branches are
 // covered by the pure initializer tests.
 const cases=init.cases.filter(c=>c.input.courseIndex<=8);assert.equal(cases.length,36);
 for(const [i,c]of cases.entries()){
  const o=owner(c),before=o.read();
  assert.throws(()=>o.host.advanceMotion({}),/Initialize scene effects/);assert.throws(()=>o.host.prepareDisplay({}),/Initialize scene effects/);assert.throws(()=>o.host.levels(),/Initialize/);
  const q=o.host.initialize(o.input);
  assert.equal(o.commits(),1);assert.notEqual(o.read(),before);
  assert.equal(digest(o.read().effectWords0790),c.effectSHA256,'case '+i);assert.deepEqual(o.read().effectControlWords6d60,c.effectControlWords6d60);
  assert.equal(o.read().scene.seed6f00,c.seed6f00);assert.equal(o.read().scene.rngState4640,before.scene.rngState4640);
  assert.deepEqual(o.host.graphicsBuffers().map(hash),c.graphicsSHA256,'graphics case '+i);
  assert.equal(o.host.presentation(),null);assert.deepEqual(q.diagnostic.queries,c.queries);
  assert.deepEqual(o.host.levels(),Array.from({length:c.input.racerCount},()=>({left:0,right:0})));
  assert.throws(()=>o.host.initialize(o.input),/only once/);assert.equal(o.commits(),1);
 }
});

test('fresh web effect storage starts from the loaded ROM controls and never replaces retained storage',()=>{
 assert.deepEqual(NATIVE_EFFECT_CONTROL_INITIAL_WORDS.slice(12,21),init.cases[0].input.effectControlWords6d60.slice(12,21));
 assert.equal(NATIVE_EFFECT_CONTROL_INITIAL_WORDS[21],1);
 const palette=[...Buffer.from(new Uint32Array(NATIVE_EFFECT_CONTROL_INITIAL_WORDS.slice(12,21)).buffer).swap32()];
 for(const course of [0,2,5]){
  const c=init.cases.find(c=>c.input.courseIndex===course),o=owner(c,{retained:false});
  assert.throws(()=>o.host.initialize(o.input,{freshWebScene:1}),/explicit/);assert.equal(o.commits(),0);
  o.host.initialize(o.input,{freshWebScene:true});const controls=o.read().effectControlWords6d60;
  assert.deepEqual(controls.slice(9,12),palette.slice(course*3,course*3+3),'course palette '+course);
  assert.equal(controls[21],0,'AE7C4 clears its loaded latch');assert.deepEqual(controls.slice(12,21),NATIVE_EFFECT_CONTROL_INITIAL_WORDS.slice(12,21));
  assert.equal(o.read().effectWords0790[0],Math.min(4,c.input.racerCount+Number(course===0)));
  const retained=owner(c);assert.throws(()=>retained.host.initialize(retained.input,{freshWebScene:true}),/cannot replace/);assert.equal(retained.commits(),0);
 }
});

test('a late participant query failure leaves canonical state and retained buffers untouched and allows retry',()=>{
 const c=init.cases.find(c=>c.input.racerCount===4&&c.input.courseIndex===1),o=owner(c),before=o.read(),buffers=o.host.graphicsBuffers();let calls=0;
 assert.throws(()=>o.host.initialize({...o.input,queryNative:()=>{if(++calls===4)throw new Error('missing plane');return c.input.waterValue;}}),/missing plane/);
 assert.equal(o.read(),before);assert.equal(o.commits(),0);assert.equal(o.host.graphicsBuffers(),buffers);
 o.host.initialize(o.input);assert.equal(digest(o.read().effectWords0790),c.effectSHA256);
});

test('live Dolphin effects start after actors and before AI, with the first dolphin in the extra slot',()=>{
 const s=make(),h=s.nativeHost,start=h.effectStartup.state,actors=h.actorStartup.state.actorWordsF060;
 assert.equal(h.spray,undefined);assert.equal(h.sprayLevels().length,1);
 assert.equal(start.effectWords0790[0],2);assert.equal(start.effectWords0790[e(0x7a08)],1);
 assert.equal(start.effectWords0790[e(0x7a04)],Array.from({length:30},(_,i)=>actors[i*47]).indexOf(6));
 assert.deepEqual(start.actorWordsF060,actors);assert.equal(start.scene.rngState4640,h.actorStartup.state.scene.rngState4640);
 assert.equal(start.scene.seed6f00,0);assert.equal(start.effectControlWords6d60[21],0);assert.deepEqual(start.effectControlWords6d60.slice(9,12),[255,255,255]);
 const live=s.nativeLaunch.snapshot();assert.deepEqual(live.effectWords0790,start.effectWords0790);assert.equal(live.scene.rngState4640,h.aiInitialization.rngState);
 assert.ok(h.effectStartup.effects.length>0&&h.effectStartup.effects.every(op=>op.kind==='presentationEffectVertexWrite'));
 assert.throws(()=>s.nativeLaunch.createCourseEffectsHost({worldScale:.025,graphicsBuffers:[[],[]]}),/only once/);
});

test('B2ABC reads completed bodies and the preceding actor pose; rider levels match the separate spray reconstruction',()=>{
 const s=make(),h=s.nativeHost,spray=createNativeRaceSpray({adapters:h.world.adapters,field:s.raceWater.field,courseIndex:0}),advance=h.advanceSceneEffects;
 let frames=0,audible=0,checked=0;
 h.advanceSceneEffects=()=>{
  const before=s.nativeLaunch.snapshot(),actor=before.effectWords0790[e(0x7a04)]*47,a=o=>float(before.actorWordsF060[actor+o/4]);
  spray.advance(s.nativeLaunch.sprayInputs(),s.nativeLaunch.cameraStorage.read());advance();frames++;
  const after=h.lastSceneEffects.state.effectWords0790,f=at=>float(after[e(at)]);
  // Shared AE210 scratch retains the last slot: the extra actor, as AD418 left it.
  assert.equal(f(0x79bc),F(a(0x64)+F(96*a(0x30))));assert.equal(f(0x79c4),F(a(0x6c)+F(96*a(0x38))));assert.equal(f(0x79c0),F(a(0x68)-5));
  assert.deepEqual(h.lastSceneEffects.state.actorWordsF060,before.actorWordsF060);
  assert.deepEqual(h.sprayLevels(),spray.levels(),'frame '+frames);checked++;if(spray.levels()[0].left||spray.levels()[0].right)audible++;
 };
 for(let i=0;i<1200;i++)stepRace(s,{throttle:1,steer:i%300<150?.6:-.5},1/60);
 assert.equal(frames,400);assert.equal(checked,400);assert.ok(audible>20,'spray levels exercised '+audible);
 assert.equal(h.sceneEffects.snapshot().frames,400);assert.equal(h.sceneEffects.snapshot().displays,400);
});

test('scene effects freeze on pause, match at30/60/144Hz and reconstruct on restart',()=>{
 const results=[];
 for(const hz of [30,60,144]){
  const shown=[],s=make({onEffectsDisplay:p=>shown.push(p.draws)});
  for(let i=0;i<hz*3;i++)stepRace(s,{throttle:1,steer:.3},1/hz);
  results.push({shown,state:s.nativeLaunch.snapshot(),buffers:s.nativeHost.sceneEffects.graphicsBuffers()});
 }
 assert.equal(results[0].shown.length,60);
 for(const r of results.slice(1))assert.deepEqual(r,results[0]);
 const families=new Set(results[0].shown.flatMap(draws=>draws.map(d=>d.family)));
 for(const family of ['spray','wake','droplet'])assert.ok(families.has(family),family);
 const shown=[],s=make({onEffectsDisplay:p=>shown.push(p)}),h=s.nativeHost;
 for(let i=0;i<60;i++)stepRace(s,{throttle:1},1/60);
 const state=s.nativeLaunch.snapshot(),count=shown.length,presentation=h.sceneEffects.presentation();s.phase='paused';
 for(let i=0;i<60;i++)stepRace(s,{throttle:1},1/60);
 assert.equal(shown.length,count);assert.deepEqual(s.nativeLaunch.snapshot(),state);assert.equal(h.sceneEffects.presentation(),presentation);
 const a=make(),b=make();assert.deepEqual(a.nativeHost.effectStartup.state,b.nativeHost.effectStartup.state);
});

test('display tickets are atomic, single-use and rejected after any intervening canonical update',()=>{
 const s=make(),h=s.nativeHost,other=make().nativeHost;
 for(let i=0;i<30;i++)stepRace(s,{throttle:1},1/60);
 const state=s.nativeLaunch.snapshot(),clock=[0,0],ticket=h.sceneEffects.prepareDisplay({clockStartWords:clock,clockEndWords:clock});
 assert.deepEqual(s.nativeLaunch.snapshot(),state,'preparation leaves the owner untouched');
 assert.throws(()=>other.sceneEffects.commitDisplay(ticket),/uncommitted/);assert.throws(()=>h.sceneEffects.commitDisplay({...ticket}),/uncommitted/);
 stepRace(s,{throttle:1},1/20);assert.throws(()=>h.sceneEffects.commitDisplay(ticket),/stale/);
 const fresh=h.sceneEffects.prepareDisplay({clockStartWords:clock,clockEndWords:clock});h.sceneEffects.commitDisplay(fresh);
 assert.equal(h.sceneEffects.presentation(),fresh.presentation);assert.throws(()=>h.sceneEffects.commitDisplay(fresh),/uncommitted/);
 assert.throws(()=>h.sceneEffects.prepareDisplay({clockStartWords:[0],clockEndWords:clock}),/clockStartWords/);
});

test('an explicit browser clock seeds the separate effect stream; an invalid clock fails before startup commits',()=>{
 let now=0x123456789abcn;const s=make({sourceClock:()=>now});
 assert.equal(s.nativeHost.effectStartup.state.scene.seed6f00,0x9abc);
 for(let i=0;i<9;i++){now+=781250n;stepRace(s,{throttle:1},1/60);}
 const words=s.nativeLaunch.snapshot().effectWords0790;assert.equal(s.nativeHost.world.frames,3);
 assert.equal(words[e(0x7b34)],3);assert.equal(words[e(0x7b54)],3);assert.equal(words[e(0x7b18)],0);assert.equal(words[e(0x7b1c)],0);
 assert.throws(()=>make({sourceClock:()=>1}),/unsigned64/);assert.throws(()=>make({sourceClock:()=>1n<<64n}),/unsigned64/);
 assert.throws(()=>make({onEffectsDisplay:1}),/display consumer/);
});

test('native Time trial runs the scene-effects owner without course actors and keeps one spray owner',()=>{
 let shown=0;const s=createRace({mode:'time',physics:'native',course:getCourse('amber',1),difficulty:1,nativeSceneEffects:{onDisplay:()=>shown++}}),h=s.nativeHost;
 assert.equal(h.spray,undefined);assert.equal(h.courseActors,undefined);assert.equal(h.effectStartup.state.effectWords0790[0],1);assert.equal(h.effectStartup.state.effectWords0790[e(0x7a08)],0);
 const spray=createNativeRaceSpray({adapters:h.world.adapters,field:s.raceWater.field,courseIndex:s.course.sourceWaterCourseIndex}),advance=h.advanceSceneEffects;let audible=0;
 h.advanceSceneEffects=()=>{spray.advance(s.nativeLaunch.sprayInputs(),s.nativeLaunch.cameraStorage.read());advance();assert.deepEqual(h.sprayLevels(),spray.levels());if(spray.levels()[0].left)audible++;};
 for(let i=0;i<900;i++)stepRace(s,{throttle:1,steer:i%240<120?.4:-.3},1/60);
 assert.equal(shown,h.world.frames);assert.ok(audible>20);
 for(const options of [{mode:'time',course:getCourse('amber',1)},{mode:'stunt',course:getCourse('amber',1)},{mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay(){}}}])
  assert.throws(()=>createRace({...options,nativeSceneEffects:{onDisplay(){}}}),/Separate scene effects/);
 assert.throws(()=>createRace({mode:'time',physics:'native',course:getCourse('amber',1),difficulty:1,nativeSceneEffects:{onDisplay:1}}),/display consumer/);
});

test('native Stunt runs the scene-effects owner in place of the human spray owner, away from Dolphin Park',()=>{
 for(const id of ['citadel','port']){
  let shown=0;const s=createRace({mode:'stunt',physics:'native',course:getCourse(id,1),difficulty:1,nativeSceneEffects:{onDisplay:()=>shown++}}),h=s.nativeHost;
  assert.equal(h.spray,undefined);assert.equal(h.effectStartup.state.effectWords0790[0],1);assert.equal(h.sprayLevels().length,1);
  const spray=createNativeRaceSpray({adapters:h.world.adapters,field:s.raceWater.field,courseIndex:s.course.sourceWaterCourseIndex}),advance=h.advanceSceneEffects;let audible=0;
  h.advanceSceneEffects=()=>{spray.advance(s.nativeLaunch.sprayInputs(),s.nativeLaunch.cameraStorage.read());advance();assert.deepEqual(h.sprayLevels(),spray.levels());if(spray.levels()[0].left)audible++;};
  for(let i=0;i<600;i++)stepRace(s,{throttle:1,steer:i%240<120?.4:-.3},1/60);
  assert.equal(shown,h.world.frames);assert.ok(audible>20,id+' spray levels exercised '+audible);assert.ok(h.lastStunt,'Stunt judging still runs');
 }
 assert.throws(()=>createRace({mode:'stunt',physics:'native',course:getCourse('practice'),nativeSceneEffects:{onDisplay(){}}}),/Separate scene effects/);
});

test('native Championship runs one four-slot scene-effects owner and shares its effect storage between commits',()=>{
 let shown=0;const s=createRace({mode:'championship',physics:'native',course:getCourse('amber',0),difficulty:0,nativeSceneEffects:{onDisplay:()=>shown++}}),h=s.nativeHost;
 assert.equal(h.spray,undefined);assert.equal(h.effectStartup.state.effectWords0790[0],4);assert.equal(h.sprayLevels().length,4);
 for(let i=0;i<90;i++)stepRace(s,{throttle:1},1/30);
 assert.equal(shown,h.world.frames);
 // Copy-on-write: unrelated commits reuse the frozen effect array instead of copying it.
 const a=s.nativeLaunch.snapshot().effectWords0790;s.nativeLaunch.advanceInputClock();
 assert.equal(s.nativeLaunch.snapshot().effectWords0790,a);assert.ok(Object.isFrozen(a));
});

test('a native two-player race draws the effects once per view, as 933C4 does, with one shared owner',()=>{
 const shown=[0,0],counts=[[],[]];
 const s=createRace({mode:'versus',physics:'native',course:getCourse('amber',1),difficulty:1,rider:0,secondRider:2,nativeSceneEffects:{onDisplay:(p,view)=>{shown[view]++;counts[view].push(p.draws.length);}}}),h=s.nativeHost;
 assert.equal(h.spray,undefined);assert.equal(h.effectStartup.state.effectWords0790[0],2);assert.equal(h.sprayLevels().length,2);
 const spray=createNativeRaceSpray({adapters:h.world.adapters,field:s.raceWater.field,courseIndex:s.course.sourceWaterCourseIndex}),advance=h.advanceSceneEffects;let audible=0;
 h.advanceSceneEffects=()=>{spray.advance(s.nativeLaunch.sprayInputs(),s.nativeLaunch.cameraStorage.read());advance();assert.deepEqual(h.sprayLevels(),spray.levels());if(spray.levels().some(l=>l.left))audible++;};
 for(let i=0;i<600;i++)stepRace(s,[{throttle:1,steer:i%240<120?.4:-.3},{throttle:1,steer:i%200<100?-.3:.4}],1/30);
 assert.deepEqual(shown,[h.world.frames,h.world.frames]);assert.ok(audible>20);
 // Each view skips its own rider's effects, so the two lists differ.
 assert.ok(counts[0].some((n,i)=>n!==counts[1][i]));assert.equal(s.nativeLaunch.snapshot().scene.fieldAb2c,0);
});
