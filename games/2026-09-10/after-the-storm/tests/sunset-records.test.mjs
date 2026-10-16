import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse} from '../courses.js';
import {createRace} from '../race-core.js';
import {initialSave,addRecord,addScore,recordKey,scoreKey,exportSave,importSave} from '../race-records.js';
import {captureGlobalRun,globalBoardKey} from '../global-scores.js';
import {ghostMetadata,ghostKey} from '../time-trial-ghost.js';
import {findTrialGhost} from '../ghost-library.js';

test('source Sunset preserves archived map records while starting separate times, scores and ghost scopes',()=>{
 const save=initialSave(),legacy={course:'amber',difficulty:2,layoutRevision:6},s=createRace({course:getCourse('amber',2),difficulty:2,mode:'time'});
 addRecord(save,{...legacy,time:200,bestLap:60,rider:0,initials:'OLD'});
 addScore(save,{...legacy,score:9999,rider:0,initials:'OLD'});
 const current={course:s.course.id,difficulty:s.difficulty};
 assert.equal(s.course.layoutRevision,7);
 assert.notEqual(recordKey(legacy),recordKey(current));assert.notEqual(scoreKey(legacy),scoreKey(current));
 assert.equal(save.records[recordKey(current)],undefined);assert.equal(save.scores[scoreKey(current)],undefined);
 addRecord(save,{...current,time:240,bestLap:75,rider:0,initials:'NEW'});
 addScore(save,{...current,score:2000,rider:0,initials:'NEW'});
 const restored=importSave(exportSave(save));
 assert.equal(restored.records[recordKey(legacy)].times[0].time,200);
 assert.equal(restored.records[recordKey(current)].times[0].time,240);
 assert.equal(restored.scores[scoreKey(legacy)][0].score,9999);
 assert.equal(restored.scores[scoreKey(current)][0].score,2000);
 const setup=ghostMetadata(s),oldSetup={...setup,layoutRevision:6};
 assert.notEqual(ghostKey(oldSetup),ghostKey(setup));
 assert.equal(findTrialGhost([{setup:oldSetup}],setup),null);
});

test('both global Sunset boards separate the recovered geometry from old public results',()=>{
 for(const mode of ['time','stunt']){
  const s=createRace({course:getCourse('amber'),mode}),run=captureGlobalRun(s);
  assert.ok(run);assert.equal(run.board.layoutRevision,7);
  assert.notEqual(globalBoardKey(run.board),globalBoardKey({...run.board,layoutRevision:6}));
 }
});
