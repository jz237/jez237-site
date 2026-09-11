import test from 'node:test';import assert from 'node:assert/strict';
import {initialSave,recordKey,scoreKey,addRecord,addScore,readSave,writeSave,exportSave,importSave,eraseRecords,restoreRecords,validateSave} from '../race-records.js';
test('old layout times and scores survive reload without entering current leaderboards',()=>{
 const save=initialSave();Object.assign(save,{unlocked:3,reached:['greyhaven','practice','citadel'],names:['Mara','Jonas'],settings:{0:{engine:.5}},dolphin:true});
 const legacy={course:'citadel',difficulty:2,layoutRevision:0},current={course:'citadel',difficulty:2};
 addRecord(save,{...legacy,time:20,bestLap:5,rider:0,initials:'OLD'});addScore(save,{...legacy,score:99999,rider:0,initials:'OLD'});
 assert.equal(save.records[recordKey(current)],undefined);assert.equal(save.scores[scoreKey(current)],undefined);
 addRecord(save,{...current,time:250,bestLap:70,rider:1,initials:'NEW'});addScore(save,{...current,score:1200,rider:1,initials:'NEW'});
 assert.equal(save.records[recordKey(current)].times[0].time,250);assert.equal(save.scores[scoreKey(current)][0].score,1200);
 let data;const storage={getItem:()=>data,setItem:(k,v)=>data=v};assert.ok(writeSave(storage,save));const reloaded=readSave(storage);assert.deepEqual(reloaded,save);assert.deepEqual(importSave(exportSave(save)),save);
 assert.equal(reloaded.records['citadel/2/3'].times[0].time,20);assert.equal(reloaded.scores['citadel/2'][0].score,99999);
});
test('layout revisions, class and lap count isolate record scopes, including erase and undo',()=>{
 const save=initialSave(),a={course:'amber',layoutRevision:2},b={course:'amber',layoutRevision:3};
 for(const entry of [a,b]){addRecord(save,{...entry,time:200,bestLap:50,rider:0,initials:'ABC'});addScore(save,{...entry,score:500,rider:0,initials:'ABC'});}
 assert.notEqual(recordKey(a),recordKey(b));assert.notEqual(scoreKey(a),scoreKey(b));assert.notEqual(recordKey(a),recordKey({...a,laps:4}));assert.notEqual(scoreKey(a),scoreKey({...a,difficulty:1}));
 const before=structuredClone(save),undo=eraseRecords(save,{...b,kind:'time'});assert.equal(save.records[recordKey(b)],undefined);assert.deepEqual(save.records[recordKey(a)],before.records[recordKey(a)]);restoreRecords(save,undo);assert.deepEqual(save,before);
 assert.equal(recordKey({course:'practice'}),'practice/0/3');assert.equal(scoreKey({course:'practice'}),'practice/0');
});
test('import accepts archived revisions but rejects malformed layout keys',()=>{
 for(const suffix of ['layout-0','layout--1','layout-1x','layout-1000','__proto__','layout-1/extra']){const save=initialSave();save.records['citadel/0/3/'+suffix]={times:[],lap:null};assert.throws(()=>validateSave(save));}
});
