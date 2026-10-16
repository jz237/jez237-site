import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeCourseMenuReturn as course,prepareNativeRiderMenuReturn as rider} from '../native-menu-return-initialization.js';
import {prepareNativeMenuReturnUpdate as update} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const views={riderOrder6ef0:[2,0,3,1],defaultRiderTraits:[[-128,-1,127],[5,9,-12],[0,-64,64],[37,-19,11]],
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
function fixture(){const state=createRace({physics:'native',mode:'time',course:getCourse('sunny-beach')}).nativeLaunch.snapshot();
 Object.assign(state.scene,{gameStateAb24:81,fieldA9ac:0,riderSelectionA9c0:1,secondRiderSelectionA9c4:2,riderFlagA9c8:9,secondRiderFlagA9cc:7,courseSelectionA9d0:6,pendingPlayers60c:1});return state;}
test('course return retains selection unless fresh, resets source scene and expands fades before audio',()=>{
 for(const latch of [0,1,32768,65535]){
  const state=fixture();state.scene.fieldA9ac=latch;const before=structuredClone(state),q=update(state,'course',views),s=q.state.scene;
  assert.deepEqual([s.previousGameState634,s.gameStateAb24,s.main638,s.courseIndex,s.players,s.simulation648,s.phase650],[81,20,5,1,1,1,0]);
  assert.equal(s.courseSelectionA9d0,latch?0:6);assert.equal(s.fieldA9ac,latch);
  assert.deepEqual(q.effects.map(op=>[op.consumer,op.arguments]),[['800c21f4',[10,0]],['800c6ad0',[1]]]);
  assert.equal(q.state.hudWords7788[(0x7c80-0x7788)/4],1);
  const fade=q.operations.findIndex(op=>op.kind==='hudWrite'&&op.byteOffset===0x8a10-0x7788),audio=q.operations.findIndex(op=>op.consumer==='800c21f4');assert.ok(fade>=0&&audio>fade);
  assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.scene));
 }
});
test('rider return handles signed pending players, reset selection, aliased slots and signed traits',()=>{
 for(const pending of [-32768,0,1,2,32767])for(const fresh of [0,65535]){
  const state=fixture();Object.assign(state.scene,{pendingPlayers60c:pending,fieldA9ac:fresh,secondaryHumanIndex:0});
  const q=update(state,'rider',views),two=pending!==1,body=q.effects.filter(op=>op.kind==='bodyTuneWordWrite');
  assert.equal(q.state.scene.players,two?2:1);assert.equal(q.state.scene.racerCount,two?2:1);
  assert.deepEqual(body.slice(0,4).map(op=>op.value),fresh?[2,0,(-64)>>>0,64]:[0,(-128)>>>0,(-1)>>>0,127]);
  assert.equal(body.length,two?8:4);assert.ok(body.every(op=>op.racerIndex===0));
  if(two)assert.deepEqual(body.slice(4).map(op=>op.value),fresh?[1,5,9,(-12)>>>0]:[3,37,(-19)>>>0,11]);
  assert.equal(q.state.scene.secondRiderSelectionA9c4,fresh?3:2);assert.equal(q.state.scene.riderFlagA9c8,fresh?0:9);
  assert.equal(q.state.scene.courseIndex,9);assert.equal(q.state.scene.specialAb64,0);
  assert.deepEqual(q.effects.find(op=>op.consumer==='80096960').arguments,[3,0,1,2,3]);
 }
});
test('rider mode selects exact audio entry; unread second-player selection is not required in solo',()=>{
 for(const [mode,sound]of [[0,2],[1,1],[4,0],[11,3],[-1,undefined],[12,undefined]]){
  const state=fixture();state.scene.mode608=mode;delete state.scene.secondRiderSelectionA9c4;delete state.scene.secondaryHumanIndex;
  const calls=rider(state,views).operations.filter(op=>op.consumer==='800c21f4');
  assert.deepEqual(calls.map(op=>op.arguments),sound===undefined?[]:[[1,sound]]);
 }
});
test('bad late fade and selected trait inputs reject atomically without executing callbacks',()=>{
 const state=fixture(),before=structuredClone(state);
 for(const [destination,bad]of [['course',{...views,slotTemplateWords6c50:[]}],['rider',{...views,defaultRiderTraits:[[128,0,0],...views.defaultRiderTraits.slice(1)]}],['title',views]]){
  assert.throws(()=>update(state,destination,bad),RangeError);assert.deepEqual(state,before);
 }
 assert.throws(()=>course({scene:{gameStateAb24:81,fieldA9ac:-1}}),RangeError);
 assert.throws(()=>rider({...state,scene:{...state.scene,riderSelectionA9c0:4}},views),RangeError);
});
