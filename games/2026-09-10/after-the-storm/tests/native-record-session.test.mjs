import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureGlobalRun} from '../global-scores.js';
import {captureNativeRecordSession as capture,restoreNativeRecordSession as restore} from '../native-record-session.js';
import {prepareNativeNameMenuFrame} from '../native-name-menu-runtime.js';
import {prepareNativeNameEntryInitializationUpdate} from '../native-race-state.js';
const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
const neutral={heldButtons:0,rawXNative:0,rawYNative:0};
const create=(options={})=>createRace({physics:'native',mode:'time',course:getCourse('sunny-beach'),...options});
function namedResult(){
 const state=create().nativeLaunch.snapshot();
 state.scene.gameStateAb24=100;state.scene.initLatch63c=0;state.scene.freshNameAb6c=0;
 state.nameEntryWords61c4[1]=5;state.hudWords7788[hi(0x88e8)]=0x41424300;
 for(const [base,time]of [[0x202c,108250],[0x22d4,35150]])state.raceWords1f94.splice(ri(base),5,time,2,1,0,0);
 state.raceWords1f94[ri(0x2650)]=1;state.raceWords1f94[ri(0x2654)]=1;
 state.raceWords1f94[ri(0x2664)]=1;state.raceWords1f94[ri(0x2694)]=1;
 // Complete the actual name commit/menu handoff; the result times above are
 // fixture inputs, not a fabricated browser finish or persisted leaderboard.
 return structuredClone(prepareNativeNameMenuFrame(state,neutral).state);
}

test('retry retains the completed source record and initials while resetting clocks, flags and physical state',()=>{
 const before=namedResult(),session=capture(before),next=create({nativeRecordSession:session});
 const state=next.nativeLaunch.snapshot(),rows=next.nativeLaunch.resultsRecordView().rows;
 assert.equal(rows[0].timeMs,108250);assert.equal(rows[0].initials,'ABC');assert.equal(rows[0].rider,2);assert.equal(rows[0].tuned,true);
 assert.equal(rows.at(-1).timeMs,35150);assert.equal(rows.at(-1).initials,'ABC');
 assert.equal(state.raceWords1f94[ri(0x1fe4)],108250);assert.equal(state.raceWords1f94[ri(0x1fe8)],35150);
 for(const address of [0x2650,0x2654,0x2928,0x2ad4])assert.equal(state.raceWords1f94[ri(address)],0);
 assert.equal(state.scene.gameStateAb24,40);assert.equal(state.scene.phase650,0);assert.equal(next.nativeHost.world.frames,0);
 assert.equal(state.scene.freshNameAb6c,0);assert.equal(state.scene.field700,0x41424300);
 const nameState=structuredClone(state);nameState.scene.gameStateAb24=100;
 const initialized=prepareNativeNameEntryInitializationUpdate(nameState,{wheelAngleWord62f4:0x40c90fdb});
 assert.equal(initialized.state.hudWords7788[hi(0x88e8)],0x41424300);assert.equal(initialized.state.nameEntryWords61c4[(0x61e4-0x61c4)/4],3);
 while(next.nativeHost.world.frames<58)stepRace(next,{},1/60);
 assert.ok(next.racers[0].raceTime>0&&next.racers[0].raceTime<1);assert.equal(next.nativeLaunch.resultsRecordView().rows[0].timeMs,108250);
 assert.equal(next.nativePreview,true);assert.equal(next.demoRun,true);
 assert.equal(captureGlobalRun(next),null);
});

test('warm source reset retains all course tails, reverse/stunt records and setup order without a cold overwrite',()=>{
 const before=namedResult();
 for(const [a,v]of [[0x220c,123456],[0x2374,23456],[0x2464,120000],[0x2898,654321],[0x26c0,2],[0x26c4,3],[0x26c8,0],[0x26cc,1]])before.raceWords1f94[ri(a)]=v;
 const session=capture(before),state=create({nativeRecordSession:session}).nativeLaunch.snapshot();
 for(const a of [0x220c,0x2374,0x2464,0x2898,0x26c0,0x26c4,0x26c8,0x26cc])assert.equal(state.raceWords1f94[ri(a)],before.raceWords1f94[ri(a)]);
 assert.equal(state.raceWords1f94[ri(0x293c)],2);assert.equal(state.scene.cold8224,0);
 const cold=create().nativeLaunch.snapshot();assert.equal(cold.raceWords1f94[ri(0x220c)],599999);assert.equal(cold.raceWords1f94[ri(0x2898)],0);
});

test('record snapshots are detached, bounded and do not carry physical, HUD, controller or race-clock ownership',()=>{
 const original=namedResult(),session=capture(original),fresh=create().nativeLaunch.snapshot(),merged=restore(fresh,session);
 assert(Object.isFrozen(session)&&Object.isFrozen(session.recordSetupWords1ff0));assert.equal(session.recordSetupWords1ff0.length,594);
 original.raceWords1f94[ri(0x202c)]=12;assert.equal(merged.raceWords1f94[ri(0x202c)],108250);
 for(let i=0;i<1693;i++)if(i<ri(0x1ff0)||i>=ri(0x2938))assert.equal(merged.raceWords1f94[i],fresh.raceWords1f94[i]);
 assert.equal(merged.hudWords7788,fresh.hudWords7788);assert.equal(merged.menuWordsE658,fresh.menuWordsE658);
 assert.equal(session.raceWords1f94,undefined);assert.equal(session.hudWords7788,undefined);
 assert.equal(fresh.raceWords1f94[ri(0x202c)],599999);
});

test('malformed or competing session inputs reject without altering a retained book',()=>{
 const state=namedResult(),session=capture(state),before=structuredClone(state);
 for(const corrupt of [{version:2},{recordSetupWords1ff0:[]},{recordSetupWords1ff0:Array(594).fill(-1)},
  {saveWordsB280:[]},{freshNameAb6c:65536},{nameIndexA9b0:8}]){
  assert.throws(()=>restore(state,{...session,...corrupt}),RangeError);assert.deepEqual(state,before);
 }
 assert.throws(()=>create({nativeRecordSession:session,nativeInitialRaceState:state}),/fresh ordinary/);
 assert.throws(()=>createRace({nativeRecordSession:session}),/native physics/);
});
