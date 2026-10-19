import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {prepareNativeRaceMenuInitializationUpdate,nativeRaceMenuInputView} from '../native-race-state.js';
import {prepareNativeChampionshipStandingsFrame as step} from '../native-championship-standings-host.js';
import {createNativeChampionshipStandingsMenuWords,nativeChampionshipStandingsSourceViews,NATIVE_CHAMPIONSHIP_STANDINGS_DATA} from '../native-championship-standings-data.js';
import {NATIVE_CHAMPIONSHIP_SETUP_DATA} from '../native-championship-setup.js';
import {createNativeNameMenuClock} from '../native-name-menu-runtime.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-host.json',import.meta.url)));
const seed=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const templates={fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
function fixture(){
 const s=structuredClone(seed);s.scene.gameStateAb24=42;s.championshipMenuWords7a00=createNativeChampionshipStandingsMenuWords();
 for(let slot=0;slot<4;slot++)s.raceWords1f94[(0x2938-0x1f94)/4+slot*222+1]=slot;
 return prepareNativeRaceMenuInitializationUpdate(s,{consumer:'801ec0d4'},templates).state;
}
const views=s=>({...nativeChampionshipStandingsSourceViews(s,[0,1,2,3]),
 championshipCourseOrderAc14:NATIVE_CHAMPIONSHIP_SETUP_DATA.courseOrderAc14,otherAvatarsA9b4:[1,2,3]});
const input=held=>({rawControllers:[{heldButtons:held,rawXNative:0,rawYNative:0}],waterDatumNative:0,waterExtentNative:1024});
function ordered(q,state,latch){assert.deepEqual(q.stages,reference.cases.find(c=>c.state===state&&c.latch===latch).stages);}

test('complete menu frame follows the original dispatcher and preserves sampled input across scene entry',()=>{
 const initial=fixture(),before=structuredClone(initial),v=views(initial);
 assert.deepEqual(NATIVE_CHAMPIONSHIP_STANDINGS_DATA.courseWaves,reference.courseWaves);
 const a=step(initial,input(0x1000),v);ordered(a,52,1);
 assert.ok(a.waterScene);assert.equal(a.diagnostic.scoreInvocations,1);assert.equal(a.draw.kind,'black');
 assert.equal(nativeRaceMenuInputView(a.state).pressedButtons,0x1000);
 assert.equal(a.state.scene.inputTick1960,(initial.scene.inputTick1960+1)>>>0);
 assert.equal(a.state.scene.ambientD4b00,(initial.scene.ambientD4b00+1)>>>0);
 assert.equal(a.state.scene.toggleD9914,(initial.scene.toggleD9914+1)&3);
 assert.equal(a.state.graphicsCorners.renderBufferIndex,initial.graphicsCorners.renderBufferIndex^1);
 assert.equal(a.state.scene.graphicsFrame4b04,(initial.scene.graphicsFrame4b04+1)|0);
 assert.equal(a.state.scene.graphicsPointerE948>>>0,0x80198368+initial.scene.graphicsSelector4b0c*0xb2f0);
 assert.equal(a.state.scene.graphicsPointerE94c,a.state.scene.graphicsPointerE948);assert.equal(a.state.scene.matrixCountE950,0);
 assert.equal(a.state.scene.graphicsSelector4b0c,initial.scene.graphicsSelector4b0c^1);
 assert.equal(a.diagnostic.pendingGraphicsConsumers.includes('8006a264'),false);
 const b=step(a.state,input(0x1000),v);ordered(b,52,0);
 assert.equal(b.waterScene,null);assert.equal(b.diagnostic.scoreInvocations,0);
 assert.equal(nativeRaceMenuInputView(b.state).pressedButtons,0);
 assert.deepEqual(b.state.profileWordsB330,a.state.profileWordsB330);
 assert.equal(b.state.scene.graphicsPointerE948>>>0,0x80198368+a.state.scene.graphicsSelector4b0c*0xb2f0);
 assert.equal(b.state.scene.graphicsFrame4b04,(a.state.scene.graphicsFrame4b04+1)|0);
 const exiting=structuredClone(b.state);exiting.scene.gameStateAb24=53;exiting.scene.initLatch63c=0;
 ordered(step(exiting,input(0),v),53,0);
 exiting.scene.initLatch63c=1;const latchedExit=step(exiting,input(0),v);ordered(latchedExit,53,1);
 assert.equal(latchedExit.waterScene,null,'state53 setup call must not reseed water');
 assert.deepEqual(initial,before);assert.ok(Object.isFrozen(a.state));
 assert.equal(a.effects.some(o=>o.kind==='waterCellWrite'||o.kind==='waterPatchRequest'),false);
 assert.equal(a.diagnostic.physicalWorldUpdated,false);assert.equal(a.diagnostic.graphicsExecuted,false);
});

test('late display validation cannot commit earlier sampling, camera, water or clock preparation',()=>{
 const a=step(fixture(),input(0),views(seed)),before=structuredClone(a.state);
 assert.throws(()=>step(a.state,input(0x8000),{...views(seed),riderNamesB298:[]}),/name|rider/i);
 assert.deepEqual(a.state,before);
});

test('full standings preparation has identical source frames at30,60 and144Hz and holds during suspension',()=>{
 let expected;
 for(const hz of [30,60,144]){
  const clock=createNativeNameMenuClock();let s=fixture(),ticks=0,awards=0;const water=[];
  const v=views(s);
  for(let i=0;ticks<12;i++){
   if(i===3)clock.advance(30,false,()=>assert.fail('Paused menu advanced'));
   clock.advance(1/hz,true,()=>{
    const q=step(s,input(ticks>=2&&ticks<6?0x1000:0),v);s=q.state;ticks++;awards+=q.diagnostic.scoreInvocations;
    water.push(q.waterOperations);if(ticks===12)return false;
   });
  }
  assert.equal(awards,1);assert.equal(s.scene.inputTick1960,seed.scene.inputTick1960+12);
  const result={state:s,water};if(expected)assert.deepEqual(result,expected);else expected=result;
 }
});
