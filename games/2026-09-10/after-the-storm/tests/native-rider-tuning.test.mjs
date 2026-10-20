import test from 'node:test';
import assert from 'node:assert/strict';
import {initialNativeSettings,nativeMenuTune,validateNativeSettings} from '../native-rider-tuning.js';
import {initialSave,validateSave,exportSave,importSave,replaceSave} from '../race-records.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativeRacePrimaryUpdate,prepareNativeNameEntryRecordCommit} from '../native-race-state.js';
import {nativeResultsRecordView} from '../native-results-record-view.js';
import {captureNativeRecordSession} from '../native-record-session.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
const course=getCourse('sunny-beach'),create=options=>createRace({physics:'native',mode:'time',course,...options});
const bytes=state=>state.saveWordsB280.flatMap(w=>[w>>>24,w>>>16&255,w>>>8&255,w&255]);
const traits=(state,player,rider)=>bytes(state).slice(24+(player*4+rider)*14+11,24+(player*4+rider)*14+14);
const ri=a=>(a-0x1f94)/4,layout=createNativeRaceCourseRuntime({course,difficulty:0,players:1}).primaryLayout;
function finish(race,time){
 const state=race.nativeLaunch.snapshot();Object.assign(state.scene,{phase650:3,activity624:-1,clockStopped817c:0});
 for(const [a,v]of [[0x2c2c,1],[0x2c24,0],[0x1fd8,0],[0x2ad4,time],[0x2aa8,30000]])state.raceWords1f94[ri(a)]=v;
 const recorded=prepareNativeRacePrimaryUpdate(layout,state,{samplesBySlot:[{bodyPositionNative:{x:0,y:0,z:0},priorBodyPointNative:{x:0,z:0}}]}).state;
 return prepareNativeNameEntryRecordCommit(recorded).state;
}

test('portable saves retain eight independent original profiles and modern tuning; old saves gain defaults',()=>{
 const save=initialSave();save.settings[2]={engine:.75};save.nativeSettings[0][2].tuneB70=11;save.nativeSettings[1][2].tuneB70=0;
 const restored=importSave(exportSave(save));assert.deepEqual(restored,save);
 restored.nativeSettings[0][2].tuneB70=7;assert.equal(save.nativeSettings[0][2].tuneB70,11);assert.equal(restored.nativeSettings[1][2].tuneB70,0);
 const old={version:1,records:{},settings:{2:{engine:.75}}},migrated=validateSave(old);
 assert.deepEqual(migrated.settings,old.settings);assert.deepEqual(migrated.nativeSettings,initialNativeSettings());
});

test('malformed original tuning rejects atomically before storage or live progress changes',()=>{
 const save=initialSave(),before=structuredClone(save);let writes=0;
 for(const invalid of [null,[],[[],[]],Array(2),[[...Array(4)],Array(4)],...[-1,12,1.5,NaN,Infinity,null,'5'].map(v=>{const s=initialNativeSettings();s[1][3].tuneB74=v;return s;})]){
  assert.throws(()=>replaceSave(save,{...save,nativeSettings:invalid},{setItem(){writes++;}}));assert.deepEqual(save,before);
 }
 assert.equal(writes,0);assert.deepEqual(validateNativeSettings(undefined),initialNativeSettings());
});

test('fresh canonical profiles have standard traits for all eight riders',()=>{
 const state=create().nativeLaunch.snapshot();
 for(let player=0;player<2;player++)for(let rider=0;rider<4;rider++)assert.deepEqual(traits(state,player,rider),[5,5,5]);
 assert.equal(state.scene.metadataCb32c,0);
});

test('every original menu position reaches physics and the selected player/rider save bytes',()=>{
 for(let rider=0;rider<4;rider++)for(let position=0;position<12;position++){
  const tune={tuneB6c:position,tuneB70:11-position,tuneB74:position};
  const race=create({rider,nativeTunes:[tune]}),state=race.nativeLaunch.snapshot(),profile=race.nativeHost.world.adapters[0].water.profile;
  assert.deepEqual(traits(state,0,rider),Object.values(tune));
  for(const key of Object.keys(tune))assert.equal(profile[key],tune[key]);
  assert.equal(state.scene.metadataCb32c,1);assert.equal(state.scene.riderFlagA9c8,1);
  assert.deepEqual(traits(state,1,rider),[5,5,5]);
 }
});

test('two players on the same rider own different tune banks and physical coefficients',()=>{
 const race=create({mode:'versus',rider:2,secondRider:2,nativeTunes:[{tuneB6c:0,tuneB70:0,tuneB74:0},{tuneB6c:11,tuneB70:11,tuneB74:11}]}),state=race.nativeLaunch.snapshot();
 assert.deepEqual(traits(state,0,2),[0,0,0]);assert.deepEqual(traits(state,1,2),[11,11,11]);
 const profiles=race.nativeHost.world.adapters.map(a=>a.water.profile);
 for(const key of ['steeringDegrees','pivotSpeedNative','waterLateralRetention'])assert.notEqual(profiles[0][key],profiles[1][key]);
 assert.equal(state.scene.secondRiderFlagA9cc,1);
});

test('changed engine tuning alters actual motion after the original countdown',()=>{
 const run=value=>{const race=create({nativeTunes:[{tuneB70:value}]});let ticks=0;
  while((race.phase==='countdown'||race.nativeHost.world.adapters[0].riderLifecycle.state.actorState===15)&&ticks++<600)stepRace(race,{},1/60);
  assert.ok(ticks<600);for(let i=0;i<120;i++)stepRace(race,{throttle:1},1/60);
  assert.ok(Number.isFinite(race.racers[0].speed));return race.racers[0].speed;
 };
 assert.ok(Math.abs(run(0)-run(11))>.1);
});

test('custom records keep attribution when restarting or resetting tuning, without relabeling old rows',()=>{
 const tune={tuneB6c:1,tuneB70:8,tuneB74:11},first=finish(create({rider:3,nativeTunes:[tune]}),110000),session=captureNativeRecordSession(first),before=structuredClone(session);
 let rows=nativeResultsRecordView(first).rows;assert.equal(rows[0].tuned,true);assert.equal(rows.at(-1).tuned,true);assert.equal(rows[0].initials,'E.N');
 const retry=create({rider:3,nativeTunes:[tune],nativeRecordSession:session});assert.deepEqual(traits(retry.nativeLaunch.snapshot(),0,3),[1,8,11]);
 assert.equal(retry.nativeLaunch.snapshot().scene.metadataCb32c,1);
 const standard=create({rider:3,nativeTunes:[nativeMenuTune()],nativeRecordSession:session}),final=finish(standard,100000);
 assert.equal(standard.nativeLaunch.snapshot().scene.metadataCb32c,0);assert.deepEqual(traits(standard.nativeLaunch.snapshot(),0,3),[5,5,5]);
 rows=nativeResultsRecordView(final).rows;assert.deepEqual(rows.slice(0,2).map(r=>[r.timeMs,r.rider,r.tuned,r.initials]),[[100000,3,false,'E.N'],[110000,3,true,'E.N']]);
 const other=create({rider:0,nativeRecordSession:session});assert.deepEqual(traits(other.nativeLaunch.snapshot(),0,3),[1,8,11]);assert.deepEqual(session,before);
});

test('Normal uses factory physics while preserving the selected Custom profile for the next launch',()=>{
 const tune={tuneB6c:0,tuneB70:11,tuneB74:2},normal=create({rider:2,nativeTunes:[tune],nativeTuneModes:['normal']});
 const state=normal.nativeLaunch.snapshot(),profile=normal.nativeHost.world.adapters[0].water.profile;
 assert.deepEqual(traits(state,0,2),[0,11,2]);assert.equal(state.scene.riderFlagA9c8,0);assert.equal(state.scene.metadataCb32c,0);
 for(const key of Object.keys(tune))assert.equal(profile[key],5);
 const custom=create({rider:2,nativeTunes:[tune],nativeTuneModes:['custom'],nativeRecordSession:captureNativeRecordSession(state)});
 for(const key of Object.keys(tune))assert.equal(custom.nativeHost.world.adapters[0].water.profile[key],tune[key]);
 assert.equal(custom.nativeLaunch.snapshot().scene.metadataCb32c,1);assert.deepEqual(traits(custom.nativeLaunch.snapshot(),0,2),[0,11,2]);
});

test('Custom at the default positions remains a Custom record; Normal with a saved tune is a Normal record',()=>{
 const custom=finish(create({nativeTunes:[nativeMenuTune()],nativeTuneModes:['custom']}),110000);
 assert.equal(nativeResultsRecordView(custom).rows[0].tuned,true);
 const normal=finish(create({nativeTunes:[{tuneB70:11}],nativeTuneModes:['normal'],nativeRecordSession:captureNativeRecordSession(custom)}),100000);
 assert.deepEqual(nativeResultsRecordView(normal).rows.slice(0,2).map(r=>[r.timeMs,r.tuned]),[[100000,false],[110000,true]]);
});

test('same-rider players independently choose Normal and Custom and preserve both saved profiles',()=>{
 const tune={tuneB6c:11,tuneB70:1,tuneB74:0},race=create({mode:'versus',rider:1,secondRider:1,nativeTunes:[tune,tune],nativeTuneModes:['normal','custom']});
 const state=race.nativeLaunch.snapshot();assert.equal(state.scene.riderFlagA9c8,0);assert.equal(state.scene.secondRiderFlagA9cc,1);
 assert.deepEqual(traits(state,0,1),[11,1,0]);assert.deepEqual(traits(state,1,1),[11,1,0]);
 assert.equal(race.nativeHost.world.adapters[0].water.profile.tuneB6c,5);assert.equal(race.nativeHost.world.adapters[1].water.profile.tuneB6c,11);
});

test('save modes round-trip, earlier tuning saves migrate, and invalid modes cannot overwrite progress',()=>{
 const save=initialSave();save.nativeSettings[1][3].tuneB70=11;save.nativeTuneModes=['normal','custom'];
 assert.deepEqual(importSave(exportSave(save)),save);
 const old=structuredClone(save);delete old.nativeTuneModes;assert.deepEqual(validateSave(old).nativeTuneModes,['normal','custom']);
 let writes=0;for(const invalid of [null,[],['normal'],['normal','invalid'],['normal',1],Array(2)]){
  assert.throws(()=>replaceSave(save,{...save,nativeTuneModes:invalid},{setItem(){writes++;}}));
 }
 assert.equal(writes,0);assert.deepEqual(save.nativeTuneModes,['normal','custom']);
});

for(const mode of ['normal','custom'])test(`${mode} setup completes three genuine laps with correct tuning attribution`,()=>{
 const race=create({nativeTunes:[{tuneB70:11}],nativeTuneModes:[mode]}),racer=race.racers[0],pilot=createNativeRacePilot({course:race.course});
 const after=race.nativeHost.world.afterFrame;
 race.nativeHost.world.afterFrame=(...args)=>{const out=after(...args);return race.phase==='postrace'?false:out;};
 for(let frame=0;frame<180*60&&race.phase!=='postrace';frame++)stepRace(race,()=>pilot.input(race,racer),1/60);
 assert.equal(race.phase,'postrace');assert.equal(racer.dq,'');assert.equal(racer.lapTimes.length,3);assert.equal(racer.passed,race.course.gates.length*3);
 assert.ok(racer.finishTime>60&&racer.finishTime<180);
 const rows=nativeResultsRecordView(race.nativeLaunch.snapshot()).rows;assert.equal(rows[0].tuned,mode==='custom');
});
