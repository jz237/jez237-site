import test from 'node:test';
import assert from 'node:assert/strict';
import {initialSave,validateSave,exportSave,importSave} from '../race-records.js';
import {beginGhostRace,recordGhostFrame,finishGhostRace} from '../time-trial-ghost.js';
import {validateGhostLibrary,findTrialGhost,saveTrialGhost,restoreTrialGhosts} from '../ghost-library.js';

function ghost(duration=1,seed=17){
 const state={mode:'time',phase:'running',time:0,waveSeed:seed,difficulty:0,laps:3,seaState:'course',course:{id:'greyhaven',layoutRevision:3,gates:[{},{}]},racers:[{id:0,x:0,z:0,heading:0,speed:12,turn:0,hydro:{y:.1,pitch:0,roll:0},lap:1,next:1,passed:0,misses:0,lapTimes:[],finishTime:null,dq:''}]};
 const rec=beginGhostRace(state);
 for(let i=1;i<=duration*20;i++){state.time=i/20;state.racers[0].z=state.time*12;recordGhostFrame(rec,state);}
 const r=state.racers[0];state.phase='results';r.lap=4;r.passed=6;r.lapTimes=[duration/3,duration/3,duration/3];r.finishTime=duration;
 return finishGhostRace(rec,state);
}
test('saved ghosts survive a portable save without changing time records',()=>{
 const save=initialSave(),g=ghost();assert.ok(saveTrialGhost(save,g));
 const imported=importSave(exportSave(save));assert.deepEqual(imported.ghosts[0],g);assert.deepEqual(imported.records,{});
 assert.equal(findTrialGhost(imported.ghosts,{...g.setup,waveSeed:999}).setup.waveSeed,17);
 assert.equal(findTrialGhost(imported.ghosts,{...g.setup,tune:{engine:1}}),null);
});

test('custom-water revisions select their own saved wave seed and retain older ghosts',()=>{
 const base=ghost(),old={...base,setup:{...base.setup,seaState:'surf'}},current={...base,setup:{...base.setup,seaState:'surf',waterRevision:1,waveSeed:33}};
 const library=validateGhostLibrary([old,current]);
 assert.equal(findTrialGhost(library,{...current.setup,waveSeed:999}).setup.waveSeed,33);
 assert.equal(findTrialGhost(library,old.setup).setup.waveSeed,17);
 assert.equal(findTrialGhost([old],current.setup),null);
});
test('slower trials cannot replace a saved ghost; a faster full run replaces it',()=>{
 const save=initialSave();saveTrialGhost(save,ghost(2));assert.equal(saveTrialGhost(save,ghost(3)),false);assert.equal(saveTrialGhost(save,ghost(1)),true);assert.equal(save.ghosts.length,1);assert.equal(save.ghosts[0].duration,1);
});
test('old saves migrate without ghosts and malformed ghost imports fail before replacement',()=>{
 const old=initialSave();delete old.ghosts;delete old.preferences.ghost;assert.deepEqual(validateSave(old).ghosts,[]);assert.equal(validateSave(old).preferences.ghost,true);
 const save=initialSave();save.ghosts=[{...ghost(),data:'!!!!'}];assert.throws(()=>validateSave(save),/ghost/i);
 assert.throws(()=>validateGhostLibrary([ghost(),ghost()]),/duplicate/i);
});
test('undoing a ghost erase retains faster runs and other setups earned afterward',()=>{
 const save=initialSave();saveTrialGhost(save,ghost(2));const erased=save.ghosts;save.ghosts=[];
 saveTrialGhost(save,ghost(1));const second=ghost(3);saveTrialGhost(save,{...second,setup:{...second.setup,course:'amber'}});
 restoreTrialGhosts(save,erased);assert.equal(save.ghosts.length,2);assert.equal(findTrialGhost(save.ghosts,ghost().setup).duration,1);assert.ok(save.ghosts.some(g=>g.setup.course==='amber'));
});
