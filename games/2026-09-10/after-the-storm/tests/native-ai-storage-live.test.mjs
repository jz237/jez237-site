import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {prepareNativeRaceStateOperations} from '../native-race-state.js';
import {prepareNativeAIInitialization} from '../native-ai-initialization.js';
import {nativeAIDriverStateWrites,nativeAIDriverStateFromWords,NATIVE_AI_STORAGE_WORDS} from '../native-ai-storage.js';
import {createRaceWaterRandom} from '../race-water.js';
import {nativeAIBodyFields} from '../native-ai-body-fields.js';
import {seedNativeWaterNoise} from '../native-water-field.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
const make=(extra={})=>createRace({mode:'time',physics:'native',course:getCourse('greyhaven'),...extra});
const at=address=>(address-0x3c60)/4;
const floatBits=v=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,v);return d.getUint32(0);};

test('live water and AI setup consume one canonical stream while keeping the established noise',()=>{
 for(const mode of ['time','versus'])for(const seed of [0,17,996]){
  const s=make({mode,waveSeed:seed}),random=createRaceWaterRandom(seed),field={heightQ:new Int16Array(49152),velocityQ:new Int16Array(49152)};
  const noise=seedNativeWaterNoise(field,{amplitudeNative:s.raceWater.baseAmplitudeNative,random15:random});
  assert.equal(noise.randomCalls,98316);
  assert.deepEqual(s.raceWater.field.heightQ,field.heightQ);assert.deepEqual(s.raceWater.field.velocityQ,field.velocityQ);
  const snapshot=s.nativeLaunch.snapshot(),profiles=Array.from({length:4},(_,i)=>s.nativeHost.world.adapters[i]?.hull.rider??0);
  const init=prepareNativeAIInitialization({rngState:random.state,racerCount:s.racers.length,primaryHumanIndex:0,
   hullProfilesB64:profiles,avatarsB68:profiles,sourceOrder:snapshot.raceWords1f94.slice((0x26c0-0x1f94)/4,(0x26c0-0x1f94)/4+s.racers.length),
   retainedRoleWords:[0,0,0,0],adjacentRoleWord:0,objectTypes4c:[]});
  assert.equal(snapshot.scene.rngState4640,init.rngState);
  for(const p of init.nativeWordPatches)assert.equal(snapshot.aiWords3c60[(p.slot*0xe8+p.offset)/4],p.bits);
  assert.equal(snapshot.aiWords3c60[at(0x4110)],0);
 }
});

test('AI initialization preserves unlisted words and the real slot4 scratch alias atomically',()=>{
 const original=make(),retained=original.nativeLaunch.snapshot();
 retained.aiWords3c60=Array.from({length:NATIVE_AI_STORAGE_WORDS},(_,i)=>(0x55000000+i)>>>0);
 const runtime=createNativeRaceLaunchRuntime({racers:structuredClone(original.racers),players:1,courseIndex:1,initialState:retained});
 const input={hullProfilesB64:[3,-1,2,1],avatarsB68:[2,1,0,3],objectTypes4c:[9,1,9,1]};
 const before=runtime.snapshot(),prepared=runtime.initializeAI(input),expected=before.aiWords3c60.slice();
 for(const p of prepared.nativeWordPatches)expected[(p.slot*0xe8+p.offset)/4]=p.bits;
 for(const p of prepared.inverseOrderPatches)expected[at(0x4100)+p.index]=p.value>>>0;
 expected[at(0x4110)]=2;expected[at(0x4118)]=1;expected[at(0x411c)]=3;
 assert.deepEqual(runtime.snapshot().aiWords3c60,expected);
 assert.equal(expected[at(0x405c)],before.aiWords3c60[at(0x405c)]);
 assert.equal(expected[(0xe8+0x64)/4],before.aiWords3c60[(0xe8+0x64)/4]);
 const valid=runtime.snapshot();assert.throws(()=>runtime.initializeAI({...input,avatarsB68:[0]}));assert.deepEqual(runtime.snapshot(),valid);
 assert.throws(()=>prepareNativeRaceStateOperations(valid,[{kind:'aiWordWrite',wordIndex:0,value:5},
  {kind:'aiWordWrite',wordIndex:NATIVE_AI_STORAGE_WORDS,value:0}]));assert.deepEqual(runtime.snapshot(),valid);
});

test('AI retained fields round-trip without touching traits, scratch, or another slot',()=>{
 const snapshot=make().nativeLaunch.snapshot(),words=snapshot.aiWords3c60.slice();
 const driver=nativeAIDriverStateFromWords(words,2),modified={...driver,flag94:7,fieldE0:2,lastRawXNative:-12,
  motionState:{...driver.motionState,stuckFrames:13,dryMarkedContact:1,previousMotionDirection:{x:-0,y:.25,z:-.75}}};
 const operations=nativeAIDriverStateWrites(modified,2),next=prepareNativeRaceStateOperations(snapshot,operations).state;
 assert.deepEqual(nativeAIDriverStateFromWords(next.aiWords3c60,2),modified);
 const written=new Set(operations.map(o=>o.wordIndex));
 for(let i=0;i<words.length;i++)if(!written.has(i))assert.equal(next.aiWords3c60[i],words[i]);
 assert.equal(next.aiWords3c60[(2*0xe8+0xc4)/4],floatBits(-0));
});

test('start-phase AI retains its bank and shared navigation; invalid driving input commits nothing',()=>{
 const s=make();stepNativeRaceHost(s.nativeHost,.05,[{}]);
 const runtime=s.nativeLaunch,before=runtime.snapshot(),body=nativeAIBodyFields(s.nativeHost.world.adapters[0]);
 const r=runtime.sampleAI(0,{bodiesBySlot:[body],waterField:s.raceWater.field});
 assert.equal(r.frame.phase,'start');assert.deepEqual(runtime.snapshot(),before);
 const retained=make().nativeLaunch.snapshot();retained.scene.phase650=3;
 const driving=make({nativeInitialRaceState:retained});stepNativeRaceHost(driving.nativeHost,.05,[{}]);
 const current=driving.nativeLaunch.snapshot(),b=nativeAIBodyFields(driving.nativeHost.world.adapters[0]);
 assert.throws(()=>driving.nativeLaunch.sampleAI(0,{bodiesBySlot:[b],waterField:driving.raceWater.field,geometry:{}}));
 assert.deepEqual(driving.nativeLaunch.snapshot(),current);
});

test('actual completed solo race hands control to the source driver with no further human polling',()=>{
 const s=make(),pilot=createNativeRacePilot({course:s.course});
 for(let i=0;i<16000&&s.phase!=='results';i++)stepRace(s,()=>pilot.input(s,s.racers[0]),.05);
 assert.equal(s.phase,'results');assert.notEqual(s.racers[0].finishTime,null);assert.equal(s.racers[0].dq,'');
 const host=s.nativeHost,a=host.world.adapters[0];
 // Continue the actual completed host explicitly. Browser result-overlay and
 // menu scheduling remain a separate integration; this is no fake finish flag.
 host.onFrame=null;host.onLaunchFrame=null;
 let polls=0,selectedAt=-1;
 for(let i=0;i<180;i++){
  const selected=a.riderLifecycle.state.selectionCountdown<0;
  stepNativeRaceHost(host,.05,[()=>{assert.equal(selected,false);polls++;return {}; }]);
  if(selected){selectedAt=i;break;}
 }
 assert.ok(selectedAt>=0);assert.equal(host.lastAIInput.frame.phase,'driving');
 const before=s.nativeLaunch.snapshot(),state=s.nativeLaunch.aiDriverState(0);
 let menuPolls=0;
 for(let i=0;i<20;i++){
  stepNativeRaceHost(host,.05,[()=>{throw new Error('AI must bypass the human device');}],{
   menuInputs:()=>{menuPolls++;return [{continue:i===0||i===10}];}});
  assert.equal(s.nativeLaunch.menuInputView().pressedButtons,i===0||i===10?0x1000:0);
 }
 assert.equal(menuPolls,20,'physical menu samples continue independently of AI-selected rider input');
 assert.equal(polls,selectedAt);assert.equal(a.lastControls.controlOrigin,'ai');
 assert.notDeepEqual(s.nativeLaunch.aiDriverState(0),state);
 assert.equal(s.nativeLaunch.snapshot().scene.previousNavigationD9874,s.nativeLaunch.aiRecords()[0].navigationSourceRow);
 assert.equal(s.nativeLaunch.snapshot().scene.rngState4640,before.scene.rngState4640);
 const finished=s.nativeLaunch.snapshot(),last=host.lastAIInput;
 stepNativeRaceHost(host,.3,[{}],{active:false});assert.deepEqual(s.nativeLaunch.snapshot(),finished);assert.equal(host.lastAIInput,last);
});
