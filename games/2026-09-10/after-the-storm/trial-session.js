import {ghostWaterRevision,beginGhostRace,recordGhostFrame,finishGhostRace,ghostCompatible,ghostMetadata,ghostSample} from './time-trial-ghost.js';
import {findTrialGhost,saveTrialGhost} from './ghost-library.js';
import {makeGhostCraft} from './ghost-craft.js';
import {writeSave} from './race-records.js';

export function createTrialSession({scene,vesselFor,saved,storage}){
 let recorder=null,ghost=null,craft=null,tune={};
 const status=document.createElement('p');status.id='ghostResult';status.hidden=true;status.setAttribute('role','status');
 document.getElementById('recordForm').before(status);
 const note=document.createElement('span');note.id='ghostNote';note.hidden=true;
 document.querySelector('#racehud .timing').append(note);
 const format=t=>Math.floor(t/60)+':'+(t%60).toFixed(3).padStart(6,'0');
 function refresh(state){
  ghost=null;craft?.dispose();craft=null;
  if(state?.mode!=='time'||state.demoRun)return;
  const candidate=findTrialGhost(saved.ghosts,ghostMetadata(state,{tune}));
  if(candidate&&ghostCompatible(candidate,state,{tune})){ghost=candidate;craft=makeGhostCraft(scene,vesselFor(state.racers[0]));}
 }
 return {
  waveSeed(setup,fallback){return findTrialGhost(saved.ghosts,{...setup,waterRevision:ghostWaterRevision(setup.seaState)})?.setup.waveSeed??fallback;},
  begin(state,selectedTune){
   tune={...selectedTune};recorder=beginGhostRace(state,{tune});status.hidden=true;status.textContent='';refresh(state);
  },
  step(state){if(recorder)recordGhostFrame(recorder,state);},
  finish(state){
   if(!recorder)return;
   const candidate=finishGhostRace(recorder,state);recorder=null;
   if(!candidate)return;
   const improved=saveTrialGhost(saved,candidate);
   status.textContent=improved?(writeSave(storage,saved)?'Best run ghost saved · '+format(candidate.duration):'Best run ghost kept for this session. Browser storage is unavailable.'):'Your faster saved ghost was kept.';
   status.hidden=false;
  },
  render(state,active){
   const show=active&&state.mode==='time'&&!state.demoRun&&['running','paused'].includes(state.phase)&&saved.preferences.ghost!==false;
   craft?.show(show&&ghost?ghostSample(ghost,state.time):null);
   note.hidden=!active||state.mode!=='time'||state.demoRun;
   if(!note.hidden)note.textContent=ghost?'GHOST '+format(ghost.duration)+(saved.preferences.ghost===false?' · hidden':''):'Complete this trial to save a ghost';
  },
  refresh,
  get details(){return {recording:!!recorder,frames:recorder?.frames.length??0,invalid:recorder?.invalid??null,ghost:ghost?{time:ghost.duration,frames:ghost.count,seed:ghost.setup.waveSeed}:null,visible:craft?.root.visible??false,saved:saved.ghosts?.length??0};}
 };
}
