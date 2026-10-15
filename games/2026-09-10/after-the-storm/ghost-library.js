import {COURSES} from './courses.js';
import {validateGhost,keepBestGhost} from './time-trial-ghost.js';

export const MAX_SAVED_GHOSTS=9;
export const MAX_SAVED_GHOST_BYTES=1200000;
const courseIds=new Set(COURSES.filter(c=>c.id!=='practice').map(c=>c.id));
// Reuse the recorded wave seed when starting this setup. A new random sea is
// never silently compared against a ghost recorded on another wave sequence.
export function trialSetupKey(setup){
 const t=setup.tune??{};
 return JSON.stringify([setup.course,setup.layoutRevision??0,setup.difficulty??0,setup.laps??3,setup.seaState,setup.rider,t.engine??0,t.grip??0,t.handling??0]);
}
export function validateGhostLibrary(value){
 if(!Array.isArray(value)||value.length>MAX_SAVED_GHOSTS)throw Error('Invalid saved time-trial ghosts.');
 const keys=new Set();let bytes=2;
 return value.map(raw=>{
  const ghost=validateGhost(raw),key=trialSetupKey(ghost.setup);
  if(!courseIds.has(ghost.setup.course)||keys.has(key))throw Error('Unknown or duplicate time-trial ghost.');
  keys.add(key);bytes+=JSON.stringify(ghost).length+1;
  if(bytes>MAX_SAVED_GHOST_BYTES)throw Error('Saved time-trial ghosts are too large.');
  return ghost;
 });
}
export function findTrialGhost(library,setup){
 const key=trialSetupKey(setup);
 return (library??[]).find(g=>trialSetupKey(g.setup)===key)??null;
}
export function saveTrialGhost(save,candidate){
 const ghost=validateGhost(candidate),library=validateGhostLibrary(save.ghosts??[]),key=trialSetupKey(ghost.setup);
 if(!courseIds.has(ghost.setup.course))throw Error('Unknown ghost venue.');
 const previous=library.find(g=>trialSetupKey(g.setup)===key);
 // Wave seeds normally match because start reuses them. If the user imported
 // another run for the same setup, compare total times without combining paths.
 const best=previous&&previous.setup.waveSeed!==ghost.setup.waveSeed?(previous.duration<=ghost.duration?previous:ghost):keepBestGhost(previous,ghost);
 if(best===previous)return false;
 const next=[best,...library.filter(g=>trialSetupKey(g.setup)!==key)].slice(0,MAX_SAVED_GHOSTS);
 while(next.length>1&&JSON.stringify(next).length>MAX_SAVED_GHOST_BYTES)next.pop();
 save.ghosts=validateGhostLibrary(next);return true;
}
export function restoreTrialGhosts(save,erased){
 const next=[...validateGhostLibrary(save.ghosts??[])];
 for(const old of validateGhostLibrary(erased)){
  const key=trialSetupKey(old.setup),at=next.findIndex(g=>trialSetupKey(g.setup)===key);
  if(at>=0){if(old.duration<next[at].duration)next[at]=old;}
  else if(next.length<MAX_SAVED_GHOSTS)next.push(old);
 }
 // Newly earned setups take priority if an undo reaches the storage budget.
 while(next.length>1&&JSON.stringify(next).length>MAX_SAVED_GHOST_BYTES)next.pop();
 save.ghosts=validateGhostLibrary(next);
}
