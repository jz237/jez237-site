// Ray's lessons: a tutorial mode of five short lessons that watch what the player actually does
// and move on when they have done it. Each lesson sets the boat up (rig, hour, weather), then
// walks a list of steps; a step has a spoken line from Ray (`say`), a caption for keyboard players
// (`text`) and one for touch (`touch`), a `done` predicate over the frame snapshot, and optionally
// a retry rule (a lost fish sends you back to the hookset). Pure step machine; main.js feeds it
// snapshots and arranges the one thing the lake cannot promise, a bite, when a lesson needs one.
const lost=s=>s.lostCount>0;
const working=s=>s.phase==='retrieve'&&s.technique&&s.technique!=='dead stick'&&s.technique!=='idle'&&s.technique!=='sink';
export const LESSONS=[
 {id:'morning',title:'First Morning with Ray',minutes:8,blurb:'Cast, work the lure, bring it in, put on the lenses, set a hook, fight a fish and let it go.',
  setup:{rig:'finesse',hour:6.4,weather:'calm',anchored:true,polarized:false},
  steps:[
   {id:'cast',say:"Morning. Load the cast, let it go, and put it near the laydown on your left.",text:"Hold the mouse button to load the cast and let go to throw. Put it near the laydown on your left.",touch:"Hold CAST to load the cast and let go to throw. Put it near the laydown on your left.",done:s=>s.casts>0&&(s.phase==='flight'||s.phase==='retrieve')},
   {id:'work',say:"Now work it. Reel, then twitch the rod. The line at the bottom right names what you are doing.",text:"Hold Space to reel, tap F to twitch the rod. The readout names what you are doing.",touch:"Hold REEL, tap TWITCH. The readout names what you are doing.",done:s=>working(s)&&s.workedFor>=3},
   {id:'bring',say:"Bring it in. Reel until the lure is back at the boat.",text:"Reel until the lure is back at the boat.",touch:"Hold REEL until the lure is back at the boat.",done:s=>s.phase==='idle'&&s.casts>0},
   {id:'lenses',say:"Put on the lenses. The glare goes, and you can see into the water.",text:"Press P for the polarized lenses.",touch:"Tap the lenses button at the top right.",done:s=>!!s.polarized},
   {id:'bite',say:"Cast again toward the laydown and work it slowly. When the rod loads and the readout says set the hook, hit it.",text:"Cast toward the laydown and work it slowly. When the readout says SET THE HOOK, tap F.",touch:"Cast toward the laydown and work it slowly. When the readout says SET THE HOOK, tap TWITCH.",done:s=>s.phase==='fight'||s.hookedCount>0,needsFish:true},
   {id:'fight',say:"Keep it tight. When he jumps, bow the rod. When he runs, ease off and let the drag work. Reel when he sulks.",text:"When it jumps, tap S to bow the rod. When it runs, ease off and let the drag work. Reel when it sulks.",touch:"When it jumps, let go of REEL to bow. When it runs, ease off and let the drag work. Reel when it sulks.",done:s=>s.landedCount>0,retryOn:lost},
   {id:'release',say:"That is a fish. Save the photo if you like, then let him go. The rest of the lake is yours.",text:"Save the photo if you like, then release it from the card.",touch:"Save the photo if you like, then tap Release on the card.",done:s=>s.releasedCount>0}
  ]},
 {id:'rigs',title:'Rigs and the tackle box',minutes:6,blurb:'Six rigs on the boat, what each one is for, and the chain that breaks first.',
  setup:{rig:'finesse',hour:7.3,weather:'calm',anchored:true,polarized:true},
  steps:[
   {id:'tab',say:"Every rig on this boat is a chain: rod, reel, line, hook. The weakest link is the one that breaks. Flip through them.",text:"Press Tab to change rigs. The card at the top right names the chain and its weakest link.",touch:"Tap Tackle on the rail to change rigs. The card names the chain and its weakest link.",done:s=>s.rigChanges>=1},
   {id:'topwater',say:"Find the topwater rig. A bone walker on ten pound mono.",text:"Tab until the card says Topwater casting.",touch:"Tap Tackle until the card says Topwater casting.",done:s=>s.rigId==='topwater'},
   {id:'walk',say:"Cast it out and walk the dog: short pulses on the reel with a twitch between each. Watch it zigzag.",text:"Cast, then reel in short pulses and tap F between them until the readout says walking the dog.",touch:"Cast, then pulse REEL and tap TWITCH between pulses until the readout says walking the dog.",done:s=>s.technique==='walking the dog'&&s.workedFor>=2},
   {id:'float',say:"Now the float rig. A nightcrawler under a bobber on six pound line. The first fish most of us ever caught.",text:"Reel in, then Tab to the Float rig.",touch:"Reel in, then tap Tackle until the card says Float rig.",done:s=>s.rigId==='float'},
   {id:'floatcast',say:"Lob it out and leave it. A float rig fishes itself. Watch the bobber.",text:"Cast the float out and leave it. Do not reel.",touch:"Cast the float out and leave it. Do not reel.",done:s=>s.rigId==='float'&&s.phase==='retrieve'&&s.stillFor>=4},
   {id:'floatbite',say:"When it slides under, set the hook. Then bring him in.",text:"When the float slides under, tap F. Then reel it in.",touch:"When the float slides under, tap TWITCH. Then hold REEL.",done:s=>s.landedCount>0,needsFish:true,retryOn:lost,retryTo:'floatcast'},
   {id:'floatrelease',say:"Bluegill or bass, it counts. Let him go.",text:"Release it from the card.",touch:"Tap Release on the card.",done:s=>s.releasedCount>0}
  ]},
 {id:'holder',title:'The holder rod',minutes:7,blurb:'Park a bottom rig in the holder, fish a second rod while the bait soaks, and answer the bell.',
  setup:{rig:'bottom',hour:20.7,weather:'calm',anchored:true,polarized:false},
  steps:[
   {id:'bottomcast',say:"Night is catfish time. This is the bottom rig: cut bait on a circle hook. Cast it out and let it sink until the line goes slack.",text:"Cast the bottom rig out and wait for the sinker to hit bottom.",touch:"Cast the bottom rig out and wait for the sinker to hit bottom.",done:s=>s.rigId==='bottom'&&s.onBottom},
   {id:'park',say:"Set that rod in the holder. Circle hooks set themselves; you never swing on them.",text:"Press H to park the rod in the holder.",touch:"Tap Holder to park the rod.",done:s=>s.holder},
   {id:'second',say:"Now you have a free hand. Pick another rig and fish while the bait soaks.",text:"Tab to another rig and make a cast while the bait soaks.",touch:"Tap Tackle for another rig and make a cast while the bait soaks.",done:s=>s.holder&&s.rigId!=='bottom'&&s.castsSinceStep>0},
   {id:'bell',say:"When the bell goes, reel in what you are holding and grab the holder rod. Steady pressure. Do not jerk.",text:"When the bell rings, reel in, then press H to take the holder rod.",touch:"When the bell rings, reel in, then tap Holder to take the holder rod.",done:s=>s.tookHolder,needsHolderBite:true},
   {id:'catfight',say:"Cats dog it deep. Lift and reel down. Let the drag do the arguing.",text:"Lift the rod, reel down, and let the drag work on the runs.",touch:"Hold REEL on the lifts and let the drag work on the runs.",done:s=>s.landedCount>0,retryOn:lost,retryTo:'bottomcast'},
   {id:'catrelease',say:"Whiskers and all. Mind the spines when you lip him.",text:"Release it from the card.",touch:"Tap Release on the card.",done:s=>s.releasedCount>0}
  ]},
 {id:'reading',title:'Reading the water',minutes:4,blurb:'The lenses, the lure cam, the anchor and the map: where the fish are and how to see them.',
  setup:{rig:'finesse',hour:6.9,weather:'breeze',anchored:false,polarized:false},
  steps:[
   {id:'lenses',say:"Put the lenses on. The glare goes and the bottom shows.",text:"Press P for the polarized lenses.",touch:"Tap the lenses button at the top right.",done:s=>!!s.polarized},
   {id:'map',say:"Open the map. The laydowns, the dock, the weed bed, the riprap point: fish hold on all of it. Close it when you have a target.",text:"Press M for the map, look it over, then M again to close it.",touch:"Tap Map on the rail, look it over, then Back.",done:s=>s.mapOpened>0&&s.mapClosed>0},
   {id:'anchor',say:"The wind moves you. Drop the anchor when you like where you sit.",text:"Press X to drop the anchor.",touch:"Tap Anchor to drop it.",done:s=>!!s.anchored},
   {id:'lurecam',say:"Cast, then ride along with the lure. That is what the fish see.",text:"Cast, then press C for the lure cam.",touch:"Cast, then tap Cam for the lure cam.",done:s=>!!s.lureCam},
   {id:'lurecamback',say:"And back into the kayak. Read the surface: dimples are bait, a swirl is something eating it.",text:"Press C again to return to the kayak.",touch:"Tap Cam again to return to the kayak.",done:s=>!s.lureCam&&s.lureCamUsed>0}
  ]},
 {id:'moments',title:'Photos and the replay',minutes:5,blurb:'Land a fish on the squarebill, watch it back from under the water, and take the picture.',
  setup:{rig:'crank',hour:18.6,weather:'calm',anchored:true,polarized:true},
  steps:[
   {id:'catch',say:"Squarebill on braid. Crank it along the rocks and let it bang off them. Set when it loads up.",text:"Cast toward the riprap and reel steadily. When the readout says SET THE HOOK, tap F, then land it.",touch:"Cast toward the riprap and hold REEL. When the readout says SET THE HOOK, tap TWITCH, then land it.",done:s=>s.landedCount>0,needsFish:true,retryOn:lost,retryTo:'catch'},
   {id:'replay',say:"Before you let him go, watch it back. The last ten seconds, from the fish's side.",text:"Press R for the catch replay.",touch:"Tap Replay on the card.",done:s=>s.replayOpened>0},
   {id:'replayback',say:"That is the take. Close it when you have seen enough.",text:"Press Enter to close the replay.",touch:"Tap Back to close the replay.",done:s=>s.replayClosed>0},
   {id:'release',say:"Save the photo if you like, then let him go.",text:"Release it from the card.",touch:"Tap Release on the card.",done:s=>s.releasedCount>0},
   {id:'photo',say:"Photo mode is there any time: a free camera, the hour, the lenses. Take one and come back.",text:"Press O for photo mode, then Escape to come back.",touch:"Tap Camera on the rail for photo mode, then Back.",done:s=>s.photoOpened>0&&s.photoClosed>0}
  ]}
];
export const STEPS=LESSONS[0].steps;
export function lessonById(id){return LESSONS.find(l=>l.id===id)||null;}
export function createTutorial(lessonId='morning'){const lesson=lessonById(lessonId)||LESSONS[0];return {lesson:lesson.id,index:0,done:false,skipped:false,elapsed:0,stepTime:0,workedFor:0,stillFor:0,hookedCount:0,landedCount:0,lostCount:0,releasedCount:0,rigChanges:0,mapOpened:0,mapClosed:0,replayOpened:0,replayClosed:0,photoOpened:0,photoClosed:0,lureCamUsed:0,tookHolder:0,castsAtStep:null,helperAt:null,helperUsed:0,log:[]};}
export function currentStep(t){if(t.done)return null;const l=lessonById(t.lesson);return l.steps[t.index];}
function resetForRetry(t){t.lostCount=0;t.hookedCount=0;t.landedCount=0;t.tookHolder=0;t.helperAt=null;t.castsAtStep=null;t.stepTime=0;}
// snap: {phase, casts, technique, polarized, rigId, onBottom, holder, anchored, lureCam, dt, events:[type...]}
export function stepTutorial(t,snap){
 if(t.done)return {changed:false,finished:true,text:''};
 const lesson=lessonById(t.lesson);const steps=lesson.steps;
 const dt=snap.dt||0;t.elapsed+=dt;t.stepTime+=dt;
 for(const e of snap.events||[]){
  if(e==='hooked')t.hookedCount++;else if(e==='landed')t.landedCount++;else if(e==='lost'||e==='missed')t.lostCount++;else if(e==='released')t.releasedCount++;
  else if(e==='rig')t.rigChanges++;else if(e==='map_open')t.mapOpened++;else if(e==='map_close')t.mapClosed++;else if(e==='replay_open')t.replayOpened++;else if(e==='replay_close')t.replayClosed++;
  else if(e==='photo_open')t.photoOpened++;else if(e==='photo_close')t.photoClosed++;else if(e==='lurecam')t.lureCamUsed++;else if(e==='took_holder')t.tookHolder++;
 }
 if(working(snap))t.workedFor+=dt;else if(snap.phase!=='retrieve')t.workedFor=0;
 if(snap.phase==='retrieve'&&(snap.technique==='dead stick'||snap.technique==='idle'||snap.technique==='sink'))t.stillFor+=dt;else t.stillFor=0;
 if(t.castsAtStep===null)t.castsAtStep=snap.casts||0;
 const s={...snap,workedFor:t.workedFor,stillFor:t.stillFor,hookedCount:t.hookedCount,landedCount:t.landedCount,lostCount:t.lostCount,releasedCount:t.releasedCount,rigChanges:t.rigChanges,mapOpened:t.mapOpened,mapClosed:t.mapClosed,replayOpened:t.replayOpened,replayClosed:t.replayClosed,photoOpened:t.photoOpened,photoClosed:t.photoClosed,lureCamUsed:t.lureCamUsed,tookHolder:t.tookHolder,castsSinceStep:(snap.casts||0)-t.castsAtStep};
 const step=steps[t.index];let changed=false;
 if(step.retryOn&&step.retryOn(s)){const to=step.retryTo?Math.max(0,steps.findIndex(x=>x.id===step.retryTo)):Math.max(0,t.index-1);resetForRetry(t);t.index=to;t.castsAtStep=snap.casts||0;t.log.push({t:+t.elapsed.toFixed(1),retry:steps[t.index].id});changed=true;}
 else if(step.done(s)){t.log.push({t:+t.elapsed.toFixed(1),did:step.id});t.index++;t.stepTime=0;t.castsAtStep=snap.casts||0;t.helperAt=null;changed=true;if(t.index>=steps.length){t.done=true;return {changed:true,finished:true,text:''};}}
 const cur=steps[t.index];return {changed,finished:false,text:cur.text,touch:cur.touch||cur.text,say:cur.say,id:cur.id,index:t.index,of:steps.length,needsFish:!!cur.needsFish,needsHolderBite:!!cur.needsHolderBite};
}
// jump past the current step (the player knows this one, or the lake will not cooperate)
export function skipStep(t){if(t.done)return t;const steps=lessonById(t.lesson).steps;t.log.push({t:+t.elapsed.toFixed(1),skipped:steps[t.index].id});t.index++;t.stepTime=0;t.castsAtStep=null;t.helperAt=null;if(t.index>=steps.length)t.done=true;return t;}
export function skipTutorial(t){t.done=true;t.skipped=true;return t;}
export function progress(t){const steps=lessonById(t.lesson).steps;return {lesson:t.lesson,index:t.index,of:steps.length,id:t.done?null:steps[t.index].id,done:t.done,skipped:t.skipped};}
// the hub: which lessons are done, and which one to suggest next
export function lessonSummary(doneMap={}){const rows=LESSONS.map(l=>({id:l.id,title:l.title,minutes:l.minutes,blurb:l.blurb,steps:l.steps.length,done:!!doneMap[l.id]}));const next=rows.find(r=>!r.done);return {rows,next:next?next.id:null,completed:rows.filter(r=>r.done).length,total:rows.length};}
// the voice clip for a step: assets/voice/tut-<lesson>-<step>.mp3
export function stepClip(lessonId,stepId){return `assets/voice/tut-${lessonId}-${stepId}.mp3`;}
export function allStepLines(){const out=[];for(const l of LESSONS)for(const s of l.steps)out.push({lesson:l.id,step:s.id,text:s.say,file:stepClip(l.id,s.id)});return out;}
