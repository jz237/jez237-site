// First Morning with Ray: a guided first ten minutes that watches what the player actually does and
// moves on when they have done it. Cast, work the lure, bring it in, put on the lenses, set a hook,
// fight, release. Skippable at any point. Pure step machine; main.js feeds it snapshots and
// arranges the one thing the lake cannot promise, a bite, when the lesson needs one.
export const STEPS=[
 {id:'cast',text:"Morning. Hold the mouse button to load the cast and let go to throw. Put it near the laydown on your left.",done:s=>s.casts>0&&(s.phase==='flight'||s.phase==='retrieve')},
 {id:'work',text:"Now work it. Hold Space to reel, tap F to twitch the rod. The line at the bottom right names what you are doing.",done:s=>s.phase==='retrieve'&&s.technique&&s.technique!=='dead stick'&&s.technique!=='idle'&&s.workedFor>=3},
 {id:'bring',text:"Bring it in. Reel until the lure is back at the boat.",done:s=>s.phase==='idle'&&s.casts>0},
 {id:'lenses',text:"Put on the lenses (P). The glare goes, and you can see into the water.",done:s=>!!s.polarized},
 {id:'bite',text:"Cast again toward the laydown and work it slowly. When the rod loads and the readout says SET THE HOOK, tap F.",done:s=>s.phase==='fight'||s.hookedCount>0,needsFish:true},
 {id:'fight',text:"Keep it tight. When it jumps, tap S to bow the rod. When it runs, ease off and let the drag work. Reel when it sulks.",done:s=>s.landedCount>0,retryOn:s=>s.lostCount>0},
 {id:'release',text:"That is a fish. Save the photo if you like, then release it. The rest of the lake is yours.",done:s=>s.releasedCount>0}
];
export function createTutorial(){return {index:0,done:false,skipped:false,elapsed:0,stepTime:0,workedFor:0,hookedCount:0,landedCount:0,lostCount:0,releasedCount:0,helperAt:null,helperUsed:0,log:[]};}
export function currentStep(t){return t.done?null:STEPS[t.index];}
// snap: {phase, casts, technique, polarized, dt, events:[type...]}
export function stepTutorial(t,snap){
 if(t.done)return {changed:false,finished:true,text:''};
 const dt=snap.dt||0;t.elapsed+=dt;t.stepTime+=dt;
 for(const e of snap.events||[]){if(e==='hooked')t.hookedCount++;if(e==='landed')t.landedCount++;if(e==='lost'||e==='missed')t.lostCount++;if(e==='released')t.releasedCount++;}
 if(snap.phase==='retrieve'&&snap.technique&&snap.technique!=='dead stick'&&snap.technique!=='idle')t.workedFor+=dt;else if(snap.phase!=='retrieve')t.workedFor=0;
 const s={...snap,workedFor:t.workedFor,hookedCount:t.hookedCount,landedCount:t.landedCount,lostCount:t.lostCount,releasedCount:t.releasedCount};
 const step=STEPS[t.index];let changed=false;
 if(step.retryOn&&step.retryOn(s)){t.lostCount=0;t.index=Math.max(0,t.index-1);t.stepTime=0;t.helperAt=null;t.log.push({t:+t.elapsed.toFixed(1),retry:STEPS[t.index].id});changed=true;}
 else if(step.done(s)){t.log.push({t:+t.elapsed.toFixed(1),did:step.id});t.index++;t.stepTime=0;changed=true;if(t.index>=STEPS.length){t.done=true;return {changed:true,finished:true,text:''};}}
 const cur=STEPS[t.index];return {changed,finished:false,text:cur.text,id:cur.id,needsFish:!!cur.needsFish};
}
export function skipTutorial(t){t.done=true;t.skipped=true;return t;}
export function progress(t){return {index:t.index,of:STEPS.length,id:t.done?null:STEPS[t.index].id,done:t.done,skipped:t.skipped};}
