import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceResultDisplayUpdate as display,prepareNativeRaceI1DisplayUpdate as legacy,
 prepareNativeRaceFadeAdvance,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
const ii=a=>(a-0x9440)/4,hi=a=>(a-0x7788)/4,ri=(slot,word)=>(0x2938-0x1f94)/4+slot*222+word;
function fixture(players=1){
 const s={scene:{initLatch63c:0,gameStateAb24:40,players,racerCount:players,courseIndex:1,mode608:players-1,mode620:players-1,
  activity624:-1,event628:0,phase650:3,simulation648:3,main638:1,specialAb64:0,ready6fc:0,result6f0:0,
  primaryHumanIndex:0,secondaryHumanIndex:1,missesEnabled72e:1,pressed65a:0,reverseDab68:0,nameIndexA9b0:0},
  raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),i1Words9440:Array(168).fill(0),
  profileWordsB330:Array(52).fill(0),saveWordsB280:Array(34).fill(0)};
 s.i1Words9440[0]=0xffffffff;return s;
}
const inputs={externalReturns:{'8009328c':0x81050000,'801e5554':0x81050020,'802c6b38':0x81050040},
 bodyResultCode16c8BySlot:[2,1,3,4],expandTransitions:true,fadeTemplateWords6cc0:Array(9).fill(0),slotTemplateWords6c50:Array(11).fill(0)};
const calls=r=>r.effects.filter(e=>e.kind==='externalCall').map(e=>e.consumer);
const advanceFade=s=>prepareNativeRaceFadeAdvance(s,{fadeTemplateWords6cc0:inputs.fadeTemplateWords6cc0});

test('full dispatcher enters solo finish once and waits until the next logical display to decrement',()=>{
 const s=fixture();s.raceWords1f94[ri(0,189)]=1;s.raceWords1f94[ri(0,103)]=12345;
 const before=structuredClone(s),r=display(s,inputs);
 assert.deepEqual(s,before);assert.equal(r.state.scene.gameStateAb24,42);assert.equal(r.state.scene.initLatch63c,1);
 assert.equal(r.state.i1Words9440[ii(0x9504)],140);assert.equal(r.state.i1Words9440[ii(0x9508)],0);
 assert.equal(calls(r).includes('802c6fe0'),false);assert.equal(calls(r).includes('802c6550'),false);
 assert.equal(r.displayListHead,0x81050028);
 const next=display(r.state,inputs);assert.equal(next.state.scene.initLatch63c,0);assert.equal(next.state.i1Words9440[ii(0x9504)],139);
 assert.equal(calls(next).includes('801de3cc'),false);assert.equal(calls(next).includes('800c21f4'),false);
 assert.ok(calls(legacy(s,inputs)).includes('802c6fe0'),'existing pending-call API remains unchanged');
});

test('two-player finish keeps winner write after inline reset and never awards a second win',()=>{
 const s=fixture(2);s.raceWords1f94[ri(1,189)]=1;
 const r=display(s,inputs);assert.equal(r.state.scene.gameStateAb24,42);assert.equal(r.state.hudWords7788[hi(0x8aa8)],2);
 assert.deepEqual(r.state.profileWordsB330.slice(48,50),[0,1]);assert.equal(r.operations.at(-1).byteOffset,0x8aa8-0x7788);
 assert.equal(r.displayListHead,0x81050028);assert.equal(calls(r).includes('802c6b38'),false);
 const next=display(r.state,inputs);assert.deepEqual(next.state.profileWordsB330.slice(48,50),[0,1]);
 assert.equal(calls(next).includes('800c1f60'),false);
});

test('tie dispatch observes fade completion after CPU fade advancement and routes once',()=>{
 const start=fixture(2);for(let slot=0;slot<2;slot++){start.raceWords1f94[ri(slot,189)]=1;start.raceWords1f94[ri(slot,103)]=100;}
 let s=display(start,inputs).state;assert.equal(s.scene.gameStateAb24,44);assert.equal(s.scene.result6f0,3);
 assert.equal(s.hudWords7788[hi(0x8aa8)],3);let routed=0,frames=0;
 for(;frames<150;frames++){
  s=advanceFade(s).state;const r=display(s,inputs);s=r.state;
  if(calls(r).includes('801ece50')){assert.deepEqual(calls(r).slice(-2),['800ad3c4','801ece50']);routed++;break;}
 }
 assert.equal(routed,1);assert.ok(frames>=100&&frames<150);
 const cleared=display(advanceFade(s).state,inputs);assert.equal(calls(cleared).includes('801ece50'),false);
 assert.deepEqual(s.profileWordsB330.slice(48,50),[0,0]);
});

test('retirement qualification delay enters notice without dispatching its new state twice',()=>{
 let s=fixture();s.raceWords1f94[ri(0,187)]=2;s.i1Words9440[ii(0x9510)]=1;
 s=display(s,inputs).state;assert.equal(s.scene.gameStateAb24,41);assert.equal(s.i1Words9440[ii(0x950c)],120);
 for(let i=0;i<119;i++)s=display(s,inputs).state;
 assert.equal(s.i1Words9440[ii(0x950c)],1);const end=display(s,inputs);
 assert.equal(end.state.scene.gameStateAb24,45);assert.equal(end.state.scene.previousGameState634,41);
 assert.equal(end.state.scene.returnState630,102);assert.equal(end.state.scene.initLatch63c,1);
 assert.equal(calls(end).includes('802c7570'),false);assert.deepEqual(end.effects.at(-1).arguments,[3,0]);
});

test('same-call fade initialization replaces stale completion before result routing',()=>{
 const s=fixture();s.scene.gameStateAb24=42;s.scene.pressed65a=0x8000;s.hudWords7788[hi(0x8a14)]=1;
 const r=display(s,inputs);assert.equal(r.state.i1Words9440[ii(0x9500)],1);
 assert.equal(r.state.hudWords7788[hi(0x8a14)]&65535,0);assert.equal(calls(r).includes('800ad3c4'),false);
 assert.equal(calls(r).includes('801ec20c'),false);
});

test('late missing result data is atomic and init early return needs no presentation dependencies',()=>{
 const s=fixture();s.raceWords1f94[ri(0,189)]=1;const before=structuredClone(s);
 assert.throws(()=>display(s,{...inputs,bodyResultCode16c8BySlot:undefined}),/body result code/);assert.deepEqual(s,before);
 assert.throws(()=>display(s,{...inputs,slotTemplateWords6c50:Array(10).fill(0)}),/11 unsigned words/);assert.deepEqual(s,before);
 assert.throws(()=>display(s,{...inputs,externalReturns:{}}),/actual return/);assert.deepEqual(s,before);
 s.scene.initLatch63c=1;const early=display(s);assert.equal(early.displayListHead,null);assert.deepEqual(calls(early),['80093c44']);
 assert.equal(early.state.scene.gameStateAb24,40);assert.equal(early.state.scene.initLatch63c,0);
 assert.throws(()=>display(s,{expandTransitions:1}),/boolean/);assert.throws(()=>display(s,{expandEstimates:1}),/boolean/);
});

test('return-stage restores activity and event before the selected pending menu reset',()=>{
 const s=fixture();Object.assign(s.scene,{gameStateAb24:43,activity624:0,event628:2,returnState630:40});
 s.i1Words9440[ii(0x959c)+38]=0x802c5cf8;s.hudWords7788[hi(0x8a14)]=1;
 const r=display(s,inputs);assert.equal(r.state.scene.activity624,-1);assert.equal(r.state.scene.event628,0);
 assert.deepEqual(calls(r).slice(-2),['8009345c','800ad3c4']);
 assert.equal(r.displayListHead,0x81050008);assert.deepEqual(prepareNativeRaceStateOperations(s,r.operations).state,r.state);
});

test('two-player retirement stops the clock and starts its fade on the sixty-first following display',()=>{
 const start=fixture(2);start.scene.clockStopped817c=0;start.raceWords1f94[ri(0,187)]=1;
 const withoutFakeHead={...inputs,externalReturns:{'8009328c':0x81050000,'801e5554':0x81050020}};
 let s=display(start,withoutFakeHead).state;assert.equal(s.scene.gameStateAb24,41);
 assert.equal(s.i1Words9440[ii(0x96a4)],0);assert.equal(s.i1Words9440[ii(0x96a0)],0);assert.equal(s.scene.clockStopped817c,0);
 for(let i=1;i<=60;i++){
  s=display(advanceFade(s).state,withoutFakeHead).state;assert.equal(s.i1Words9440[ii(0x96a4)],i);
  assert.equal(s.scene.clockStopped817c,1);assert.equal(s.i1Words9440[ii(0x96a0)],0);
 }
 const r=display(advanceFade(s).state,withoutFakeHead);s=r.state;
 assert.equal(s.i1Words9440[ii(0x96a4)],61);assert.equal(s.i1Words9440[ii(0x96a0)],2);
 assert.equal(s.hudWords7788[hi(0x8a10)]>>>16,1);assert.equal(s.hudWords7788[hi(0x8a14)]&65535,0);
 assert.equal(calls(r).includes('801e6fb0'),false);
 const source=fixture(2);source.scene.gameStateAb24=41;source.scene.clockStopped817c=0;
 source.i1Words9440[ii(0x96a4)]=0x7fffffff;source.i1Words9440[ii(0x96a0)]=7;
 const wrapped=display(source,withoutFakeHead);assert.equal(wrapped.state.i1Words9440[ii(0x96a4)],0x80000000);
 assert.equal(wrapped.state.scene.clockStopped817c,0);assert.equal(wrapped.state.i1Words9440[ii(0x96a0)],7);
 const resumed=display(wrapped.state,withoutFakeHead);assert.equal(resumed.state.scene.clockStopped817c,1);
});

test('course-zero glyph advances before result entry and retains its shared style writes',()=>{
 const s=fixture();Object.assign(s.scene,{courseIndex:0,mode608:4,mode620:4,ready6fc:0,
  field704:2,field708:0,field70c:1,field710:2,field714:3});
 s.raceWords1f94[ri(0,189)]=1;
 for(const [a,v]of [[0x96a8,1],[0x96ac,1],[0x96b0,9],[0x96b4,100],[0x96c0,0],[0x96cc,6]])s.i1Words9440[ii(a)]=v;
 const r=display(s,{...inputs,externalReturns:{...inputs.externalReturns,'802c6bd8':0x81050060}});
 assert.equal(r.state.i1Words9440[ii(0x96b4)],98);assert.equal(r.state.scene.gameStateAb24,42);
 assert.equal(r.state.scene.style6e2c,100);assert.equal(r.state.hudWords7788[hi(0x8a48)],255);
 assert.equal(r.diagnostic.sequenceCalls.length,1);assert.equal(calls(r).includes('802c6bd8'),false);
 const glyph=r.operations.findIndex(o=>o.consumer==='courseZeroSequenceGlyph'),enter=r.operations.findIndex(o=>o.field==='gameStateAb24');
 assert.ok(glyph>=0&&glyph<enter);assert.equal(r.displayListHead,0x81050068);
});

test('result dispatcher commits unfinished estimates at their call before the pending cup menu',()=>{
 const s=fixture();Object.assign(s.scene,{gameStateAb24:42,mode608:4,mode620:4,racerCount:2,configuredLaps728:3});
 s.profileWordsB330[0]=1;s.i1Words9440[ii(0x9500)]=1;s.hudWords7788[hi(0x8a14)]=1;
 for(let i=0;i<2;i++){s.raceWords1f94[ri(i,0)]=3;s.raceWords1f94[ri(i,1)]=i;s.raceWords1f94[ri(i,103)]=1000;}
 const bits=n=>{const v=new DataView(new ArrayBuffer(4));v.setFloat32(0,n);return v.getUint32(0);};
 const nodes=Array.from({length:2},(_,i)=>{const row=Array(65).fill(0);row[2]=bits(i*100);row[0x74/4]=bits(1);
  row[0x88/4]=bits(100);row[0x98/4]=i?3:0;row[0xa0/4]=1-i;row[0xa8/4]=1-i;return row;});
 const input={...inputs,expandEstimates:true,primaryRecordWordsBySourceRow:nodes,bodyPositionsNativeBySlot:[{x:0,z:100},{x:0,z:100}]};
 const before=structuredClone(s),r=display(s,input);
 assert.deepEqual(s,before);assert.equal(r.state.raceWords1f94[ri(0,103)],1135);assert.equal(r.state.raceWords1f94[ri(1,103)],1144);
 assert.equal(calls(r).includes('80077f5c'),false);
 const latch=r.operations.findIndex(o=>o.kind==='raceWordWrite'&&o.wordIndex===(0x1fd4-0x1f94)/4);
 assert.ok(latch>=0&&latch<r.operations.findIndex(o=>o.consumer==='801ec0d4'));
 assert.throws(()=>display(s,{...inputs,expandEstimates:true}),/primary|body/i);assert.deepEqual(s,before);
 const repeated=display(r.state,{...inputs,expandEstimates:true});assert.deepEqual(repeated.state.raceWords1f94,r.state.raceWords1f94);
});

test('world then fade then result dispatch advances once per logical frame at30/60/144Hz',()=>{
 let reference;
 for(const hz of [30,60,144]){
  let s=fixture(),menus=0,displayFrames=0;Object.assign(s.scene,{simulation648:0,pressed65a:0x8000});s.raceWords1f94[ri(0,189)]=1;
  const adapter=createNativeRaceAdapter({sourceState:()=>({actorState:22,simulationState:s.scene.simulation648})});
  const water=createRaceWater({crafts:[{x:0,y:0,z:0,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20,initialNoise:false});
  const world=createNativeRaceWorld({adapters:[adapter],water,afterFrame:(w,c)=>{
   assert.equal(w.water.frames,c.logicalFrame);s=advanceFade(s).state;const r=display(s,inputs);s=r.state;displayFrames++;
   if(calls(r).includes('801ec20c')){menus++;return false;}
  }});
  for(let i=0;i<hz*12&&menus===0;i++)stepNativeRaceWorld(world,1/hz,[{}]);
  assert.equal(menus,1);assert.equal(world.frames,displayFrames);assert.equal(world.ticks,0);
  assert.equal(world.remainder,0);assert.equal(s.i1Words9440[ii(0x9504)],0);
  const result={state:s,world:nativeRaceWorldSnapshot(world),displayFrames,menus};
  if(reference)assert.deepEqual(result,reference);else reference=structuredClone(result);
 }
});
