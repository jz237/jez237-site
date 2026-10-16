import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeRaceState,prepareNativeRacePrimaryUpdate,prepareNativeNameEntryRecordCommit} from '../native-race-state.js';
import {nativeResultsRecordView} from '../native-results-record-view.js';
import {captureNativeRecordSession} from '../native-record-session.js';
const ri=a=>(a-0x1f94)/4,course=getCourse('sunny-beach'),layout=createNativeRaceCourseRuntime({course,difficulty:0,players:1}).primaryLayout;
const create=(rider,extra={})=>createRace({physics:'native',mode:'time',rider,course,...extra});
function finish(race,time=110000){
 const state=race.nativeLaunch.snapshot();Object.assign(state.scene,{phase650:3,activity624:-1,clockStopped817c:0});
 for(const [a,v]of [[0x2c2c,1],[0x2c24,0],[0x1fd8,0],[0x2ad4,time],[0x2aa8,30000]])state.raceWords1f94[ri(a)]=v;
 return prepareNativeRacePrimaryUpdate(layout,state,{samplesBySlot:[{bodyPositionNative:{x:0,y:0,z:0},priorBodyPointNative:{x:0,z:0}}]}).state;
}
test('every selected rider owns both total and best-lap records through the real primary record phase',()=>{
 for(let rider=0;rider<4;rider++){
  const race=create(rider);assert.equal(race.nativeLaunch.snapshot().scene.metadataD9b0,rider);
  const state=finish(race),rows=nativeResultsRecordView(state).rows;
  assert.equal(rows[0].timeMs,110000);assert.equal(rows[0].rider,rider);assert.equal(rows.at(-1).rider,rider);
  const named=prepareNativeNameEntryRecordCommit(state),namedRows=nativeResultsRecordView(named.state).rows;
  assert.equal(namedRows[0].initials,'YOU');assert.equal(namedRows.at(-1).initials,'YOU');
 }
});
test('switching riders retains old record attribution while new results use the newly selected rider',()=>{
 const old=finish(create(3),110000),session=captureNativeRecordSession(old),next=create(2,{nativeRecordSession:session});
 assert.equal(session.version,2);assert.equal(Object.hasOwn(session,'metadataD9b0'),false);assert.equal(Object.hasOwn(session,'nameIndexA9b0'),false);
 assert.equal(next.nativeLaunch.snapshot().scene.metadataD9b0,2);
 const final=finish(next,100000),rows=nativeResultsRecordView(final).rows;
 assert.deepEqual(rows.slice(0,2).map(r=>[r.timeMs,r.rider]),[[100000,2],[110000,3]]);
});
test('name fallback and record attribution read one source word, rejecting the old overlapping alias',()=>{
 const state=structuredClone(finish(create(3))),bytes=new DataView(new ArrayBuffer(136));
 state.saveWordsB280.forEach((v,i)=>bytes.setUint32(i*4,v));
 for(const [j,b]of [69,76,73].entries())bytes.setUint8(24+3*14+j,b);
 state.saveWordsB280=Array.from({length:34},(_,i)=>bytes.getUint32(i*4));
 const named=prepareNativeNameEntryRecordCommit(state),rows=nativeResultsRecordView(named.state).rows;
 assert.equal(rows[0].rider,3);assert.equal(rows[0].initials,'ELI');assert.equal(rows.at(-1).initials,'ELI');
 assert.throws(()=>createNativeRaceState({...state,scene:{...state.scene,nameIndexA9b0:0}}),/Unknown or overlapping/);
});
