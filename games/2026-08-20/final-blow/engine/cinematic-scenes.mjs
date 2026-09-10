// Scene direction is separate from combat hit detection. Its clocks are
// sampled, never advanced here, so pauses and replay seeks are deterministic.
import {getGraphicFatality} from './fatalities.mjs';

// Keep the authored presentation consistent wherever the live game asks for
// labels or aftermath metadata, without changing archived projectile profiles.
export function cinematicFatalityProfile(id,variant=0) {
 const original=getGraphicFatality(id,variant);
 const paintedProfiles={
  'jez:0':['cable-lock','CABLE LOCK','UPPER BODY CABLE PULL','torso','CORDED MOUSE','CABLE CAST','UPPER BODY BIND','FINAL CABLE PULL','MOUSE CABLE'],
  'jez:1':['low-cable-reap','LOW CABLE REAP','LOW CABLE PULL','torso','CORDED MOUSE','LOW CABLE CAST','ANKLE BIND','LOW CABLE REAP','MOUSE CABLE'],
  'benny:0':['cross-cut','CROSS CUT','CLOSE BLADE COMBINATION','torso','BLADE','BLADE DRAW','CLOSE OPENING CUT','CROSS FINAL CUT','HANDHELD BLADE'],
  'benny:1':['rising-cut','RISING CUT','RISING BLADE COMBINATION','head','BLADE','BLADE DRAW','RISING OPENING CUT','RISING FINAL CUT','HANDHELD BLADE'],
  'alan:0':['body-pressure','BODY PRESSURE','TWO BODY BLOWS','torso','HEAVY HANDS','FISTS RAISED','BODY PRESSURE','FINAL BODY BLOW','BARE FISTS'],
  'alan:1':['overhead-hammer','OVERHEAD HAMMER','TWO-HANDED OVERHEAD STRIKE','head','HEAVY HANDS','HANDS RAISED','OVERHEAD WIND-UP','OVERHEAD HAMMER','CLASPED FISTS'],
  'ali:0':['return-cut','RETURN CUT','OUTBOUND AND RETURNING DISC','torso','VINYL RECORD','DISC READY','OUTBOUND CUT','RETURN CUT','VINYL DISC'],
 };
 const fields=paintedProfiles[`${id}:${variant}`];
 if(fields){const [profileId,title,caption,limb,special,projectileSetup,projectileAction,projectileFinale,device]=fields;
  return {...original,id:profileId,title,caption,limb,special,projectileSetup,projectileAction,projectileFinale,device};}

 if(id==='post'&&variant===1)return {...original,id:'paint-and-kick',title:'FINAL COAT',
  caption:'PAINT AND KICK',limb:'torso',special:'SPRAY PAINT',projectileSetup:'CAN PRIMED',
  projectileAction:'PAINT SCREEN',projectileFinale:'FINAL KICK',device:'SPRAY CAN'};
 if(id==='post'&&variant===0)return {...original,id:'wire-pull',title:'WIRE PULL',
  caption:'CABLE PULLDOWN',limb:'torso',projectileSetup:'CABLE GRIP',
  projectileAction:'WIRE PULL',projectileFinale:'FINAL PULLDOWN',device:'TAUT WIRE CABLE'};
 if(id==='donald'&&variant===1)return {...original,id:'final-club',title:'FINAL CLUB',
  caption:'OVERHEAD DRIVER STRIKE',limb:'head',special:'GOLF CLUB',projectileSetup:'CLUB RAISED',
  projectileAction:'OVERHEAD DRIVE',projectileFinale:'FINAL CLUB',device:'GOLD DRIVER'};
 if(id==='donald'&&variant===0)return {...original,id:'tee-shot',title:'TEE SHOT',
  caption:'GOLDEN DRIVE',limb:'torso',projectileSetup:'ADDRESS THE BALL',
  projectileAction:'TEE SHOT',projectileFinale:'GOLDEN DRIVE',device:'GOLD DRIVER'};
 if(id==='devil'&&variant===0)return {...original,id:'wing-cross',title:'WING CROSS',
  caption:'CROSSING WING STRIKE',limb:'torso',special:'WINGS',projectileSetup:'WINGS RAISED',
  projectileAction:'WING CROSS',projectileFinale:'FINAL WING PASS',device:'CROSSING WING EDGES'};
 if(id==='devil'&&variant===1)return {...original,id:'hoof-stamp',title:'HOOF STAMP',
  caption:'HELLFIRE GROUND STAMP',limb:'torso',special:'HELLFIRE',projectileSetup:'HOOF RAISED',
  projectileAction:'HELLFIRE STAMP',projectileFinale:'ASHEN COLLAPSE',device:'SCORCHED GROUND'};
 if(id==='deathblow'&&variant===0)return {...original,id:'wheel-pass',title:'WHEEL PASS',
  caption:'STEEL CUTTER SWEEP',limb:'torso',special:'PIZZA CUTTER',projectileSetup:'CUTTER DRAW',
  projectileAction:'STEEL WHEEL PASS',projectileFinale:'FINAL CUT',device:'HANDHELD STEEL CUTTER'};
 if(id==='deathblow'&&variant===1)return {...original,id:'ground-drive',title:'GROUND DRIVE',
  caption:'GAUNTLET GROUND STRIKE',limb:'torso',special:'GAUNTLETS',projectileSetup:'OVERHEAD WIND-UP',
  projectileAction:'GROUND CONTACT',projectileFinale:'FAULTLINE COLLAPSE',device:'ARMORED GAUNTLETS'};
 if(id==='cyraxx'&&variant===0)return {...original,id:'swarm-rise',title:'SWARM RISE',
  caption:'RISING SWARM',limb:'torso',projectileSetup:'SWARM GATHER',
  projectileAction:'SWARM RISE',projectileFinale:'SWARM COLLAPSE',device:'RISING BED-BUG SWARM'};
 if(id==='cyraxx'&&variant===1)return {...original,id:'dead-air',title:'DEAD AIR',
  caption:'FEEDBACK RELEASE',limb:'torso',special:'FEEDBACK',projectileSetup:'DEEP BREATH',
  projectileAction:'FEEDBACK BUILD',projectileFinale:'FEEDBACK RELEASE',device:'VOCAL PRESSURE WAVE'};
 if(id==='commissioner'&&variant===0)return {...original,id:'cane-lock',title:'CANE LOCK',
  caption:'HOOK, PULL, BODY STRIKE',limb:'torso',special:'CANE',projectileSetup:'CANE DRAW',
  projectileAction:'CANE HOOK',projectileFinale:'FINAL BODY STRIKE',device:'SILVER-HANDLED CANE'};
 if(id==='commissioner'&&variant===1)return {...original,id:'final-verdict',title:'FINAL VERDICT',
  caption:'OVERHEAD CANE STRIKE',limb:'head',special:'CANE',projectileSetup:'CANE RAISED',
  projectileAction:'OVERHEAD WIND-UP',projectileFinale:'FINAL VERDICT',device:'SILVER-HANDLED CANE'};
 if(id!=='ali'||variant!==1)return original;
 return {...original,id:'bass-drop',title:'BASS DROP',caption:'BOOMBOX PRESSURE BLAST',limb:'torso',
  special:'BOOMBOX',projectileSetup:'BOOMBOX DRAW',projectileAction:'BASS CHARGE',
  projectileFinale:'BASS DROP',device:'BOOMBOX PRESSURE PULSE'};
}

const identity={
 jez:{ko:'NEON LAST WORD',strike:'palm',finish:['cross-step','cord-sweep'],accent:'neon'},
 benny:{ko:'LAST CALL',strike:'cross',finish:['close-cut','rising-cut'],accent:'electric'},
 alan:{ko:'HEAVY HAND',strike:'body-hook',finish:['body-pressure','overhead'],accent:'dust'},
 ali:{ko:'FINAL BEAT',strike:'side-kick',finish:['disc-return','bass-drop'],accent:'rhythm'},
 commissioner:{ko:'CASE CLOSED',strike:'cane',finish:['cane-lock','gavel'],accent:'paper'},
 cyraxx:{ko:'DEAD AIR',strike:'backfist',finish:['swarm-rise','feedback'],accent:'static'},
 deathblow:{ko:'FAULTLINE',strike:'uppercut',finish:['wheel-pass','ground-drive'],accent:'concrete'},
 devil:{ko:'HELLFALL',strike:'wing',finish:['wing-cross','hoof-stamp'],accent:'ember'},
 donald:{ko:'FINAL DRIVE',strike:'club',finish:['tee-shot','club-return'],accent:'metal'},
 post:{ko:'FINAL COAT',strike:'shoulder',finish:['wire-pull','paint-sweep'],accent:'paint'},
};
export const CINEMATIC_FIGHTERS=Object.freeze(Object.keys(identity));
export function cinematicBanks(id) {
 if(!CINEMATIC_FIGHTERS.includes(id))return [];
 return ['cinema-ko','cinema-strike',...(['jez','benny','alan','ali','cyraxx','commissioner','deathblow','donald','post','devil'].includes(id)?['cinema-body-ko']:[]),
  'portrait',...(id==='post'?['cinema-strike-low']:[]),...(id==='ali'?['disc']:[]),...(['jez','benny','alan','ali','commissioner','cyraxx','deathblow','donald','post','devil'].includes(id)?['cinema-overhead-ko']:[]),
  ...(['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post'].includes(id)?['cinema-fatal-0','cinema-fatal-1']:[])];
}
export const CINEMATIC_KO_SECONDS=1.3;
export const CINEMATIC_KO_LANDING_TICK=31;
export const CINEMATIC_KO_VICTORY_SECONDS=1.65;
// Sample the scene clock rather than scheduling a wall-clock timeout. Pausing
// or slowing the animation must preserve the quiet contact/landing interval.
export function cinematicMusicGain(relativeImpact) {
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 if(relativeImpact<-.9)return 1;
 if(relativeImpact<-.35)return 1-.92*smooth((relativeImpact+.9)/.55);
 if(relativeImpact<1)return .08;
 return .08+.92*smooth((relativeImpact-1)/.65);
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

// Curated sequences exclude generated drawings that switched the striking arm.
const strikeCells={jez:[0,1,3,4,5,6,7,8,9,11,12,14,15],benny:[0,1,3,4,5,6,8,9,10,11,13,14,15],
 // The generated final row changed body scale. Recover through the consistent
 // wind-up drawings instead; never display the shrunken replacement poses.
 alan:[0,1,2,3,4,5,6,7,8,9,10,6,5,4,2,0],ali:Array.from({length:16},(_,i)=>i),
 commissioner:[0,1,2,3,4,5,6,8,9,10,11,6,5,12,14,15],
 cyraxx:[0,1,2,3,5,6,7,7,8,9,11,14,15],
 deathblow:Array.from({length:16},(_,i)=>i),devil:Array.from({length:16},(_,i)=>i),
 // Omit the premature low dip; recover from extended to retracted club.
 donald:[0,1,3,4,5,6,7,7,8,10,9,11,12,13,14,15],
 // Narrow stance keeps the advancing shoulder clear of the opponent's feet.
 post:[0,1,2,4,5,3,6,7,8,9,10,11,12,13,14,15]};
const strikeTimes=[-.5,-.38,-.28,-.2,-.14,-.08,-.035,0,.055,.115,.22,.32,.42];
const alanStrikeTimes=[-.5,-.43,-.35,-.27,-.19,-.13,-.075,-.025,0,.05,.1,.16,.22,.29,.36,.44];
const aliStrikeTimes=[-.5,-.44,-.36,-.28,-.2,-.12,-.055,0,.05,.1,.17,.23,.29,.35,.41,.48];
const deathblowStrikeTimes=aliStrikeTimes;
export function cinematicStrikeFrame(id,relativeImpact,bank='cinema-strike') {
 const cells=bank==='cinema-strike-low'?Array.from({length:16},(_,i)=>i):strikeCells[id];if(!cells)return null;
 const times=id==='deathblow'?deathblowStrikeTimes:['alan','devil'].includes(id)?alanStrikeTimes:['ali','commissioner','donald','post'].includes(id)?aliStrikeTimes:strikeTimes;
 let i=0;while(i<cells.length-1&&relativeImpact>=times[i+1])i++;
 return cells[i];
}
export function createKnockoutScene(id,winner,attackerX,victimX,width=1280,victimId=null) {
 if(!strikeCells[id]||!cinematicBanks(id).includes('cinema-strike'))return null;
 // Close shoulder contact requires a paired narrow brace, not a wide guard.
 // Shorter victims use a dedicated bent-knee shoulder sequence.
 if(id==='post'&&!cinematicBanks(victimId).includes('cinema-body-ko'))return null;
 const direction=attackerX<=victimX?1:-1;
 const reactionTravel=id==='ali'?60:id==='deathblow'?35:0;
 const outerMargin=220+reactionTravel;
 const victimTarget=clamp(victimX,direction===1?540:outerMargin,direction===1?width-outerMargin:width-540);
 const attackerTarget=victimTarget-direction*(id==='post'&&victimId==='devil'?200:id==='post'?(['alan','ali','commissioner','deathblow','donald','post','devil'].includes(victimId)?150:120):id==='alan'?190:id==='deathblow'?210:id==='ali'?220:id==='cyraxx'?230:320);
 const approach=Math.max(.35,Math.abs(attackerTarget-attackerX)/350);
 const impact=approach+.5;
 return {id,winner,direction,attackerX,victimX,attackerTarget,victimTarget,approach,impact,
  reactionTravel,reactionLift:id==='deathblow'?52:0,
  attackerBank:id==='post'&&victimId==='devil'?'cinema-strike-low':'cinema-strike', victimBank:['post','alan'].includes(id)?'cinema-body-ko':'cinema-ko',
  hitHeight:id==='post'&&victimId==='devil'?.45:id==='alan'?.60:id==='deathblow'?.85:id==='commissioner'?.75:.65,hitOffset:id==='post'?(['alan','ali','commissioner','deathblow','donald','post','devil'].includes(victimId)?70:50):['alan','cyraxx','deathblow'].includes(id)?0:['ali','commissioner'].includes(id)?25:55,
  swingCue:id==='ali'?'roundhouse-swing':'heavy',impactCue:id==='ali'?'roundhouse-impact':'hit-heavy',
  objectCue:id==='commissioner'?'object-cane':null,
  duration:impact+4.9,impactPlayed:false,landingPlayed:false};
}
export function sampleKnockoutScene(scene,elapsed) {
 const approach=clamp(elapsed/scene.approach,0,1);
 const relative=elapsed-scene.impact;
 const recoil=clamp(relative/.65,0,1);
 const arc=clamp(relative/(CINEMATIC_KO_LANDING_TICK/60),0,1);
 return {
  attackerX:scene.attackerX+(scene.attackerTarget-scene.attackerX)*approach,
  victimX:scene.victimX+(scene.victimTarget-scene.victimX)*approach+scene.direction*(scene.reactionTravel||0)*(1-(1-recoil)**3),
  victimLift:(scene.reactionLift||0)*4*arc*(1-arc),
  walking:elapsed<scene.approach,
  attackerFrame:cinematicStrikeFrame(scene.id,relative,scene.attackerBank),
  victimFrame:relative>=0?knockoutFrame(relative):null,
  impact:relative>=0,landing:relative>=CINEMATIC_KO_LANDING_TICK/60,
  victory:relative>=CINEMATIC_KO_VICTORY_SECONDS,
 };
}
export function cinematicPortraitOpacity(relativeImpact,reducedMotion=false) {
 if(relativeImpact<-.85||relativeImpact>=-.28)return 0;
 if(reducedMotion)return 1;
 return Math.min(1,(relativeImpact+.85)/.08,(-.28-relativeImpact)/.08);
}

// Dedicated cable choreography. Each variant owns its timings, attacker art
// and reaction path; the caller retains its existing effect/voice metadata.
export function paintedFatalityScript(id,variant,script) {
 if(id==='benny')return bennyFatalityScript(variant,script);
 if(id==='alan'&&variant===0)return alanPressureScript(script);
 if(id==='alan'&&variant===1)return alanOverheadScript(script);
 if(id==='ali'&&variant===0)return aliDiscScript(script);
 if(id==='ali'&&variant===1)return aliBassScript(script);
 if(id==='commissioner'&&variant===1)return commissionerGavelScript(script);
 if(id==='commissioner'&&variant===0)return commissionerLockScript(script);
 if(id==='cyraxx'&&variant===1)return cyraxxFeedbackScript(script);
 if(id==='cyraxx'&&variant===0)return cyraxxSwarmScript(script);
 if(id==='deathblow'&&variant===1)return deathblowGroundScript(script);
 if(id==='deathblow'&&variant===0)return deathblowWheelScript(script);
 if(id==='devil'&&variant===1)return devilStampScript(script);
 if(id==='devil'&&variant===0)return devilWingScript(script);
 if(id==='donald'&&variant===0)return donaldTeeScript(script);
 if(id==='donald'&&variant===1)return donaldClubScript(script);
 if(id==='post'&&variant===0)return postWireScript(script);
 if(id==='post'&&variant===1)return postPaintScript(script);
 if(id!=='jez')return script;
 const low=variant===1;
 const labels=low?['LOW CABLE CAST','ANKLE BIND','LOW CABLE REAP']:['HIGH CABLE CAST','UPPER BODY BIND','FINAL CABLE PULL'];
 const impacts=script.impacts.map((i,index)=>({...i,label:labels[index],t:i.t+(low?(i.final?.35:.12):0)}));
 const [prime,trap,finish]=impacts;
 const duration=Math.max(script.duration+(low?.35:0),finish.t+1.5);
 const times=[0,.2,prime.t-.2,prime.t-.1,prime.t,prime.t+.08,trap.t,trap.t+.14,
   finish.t-.55,finish.t-.32,finish.t-.14,finish.t,finish.t+.18,finish.t+.35,finish.t+.65,duration];
 const first=script.keys[0],last=script.keys.at(-1);
 const key=(index,extra={})=>({...first,t:times[index],ax:low?-255:-270,ay:0,vx:0,vy:0,
  ar:0,vr:0,zoom:1,v:'ext4:5',vf:15,...extra});
 const keys=[
  key(0),key(1),key(2),key(3),key(4,{contact:true}),key(5),
  key(6,{contact:true,v:'ext4:2',vx:low?10:-12}),
  key(7,{v:low?'ext4:3':'ext4:2',vx:low?18:-26,vr:low?.06:-.045}),
  key(8,{vx:low?18:-26,v:'ext4:5'}),
  key(9,{ax:low?-264:-282,vx:low?15:-28,v:'ext4:5'}),
  key(10,{ax:low?-277:-292,vx:low?10:-32,v:'ext4:5'}),
  key(11,{ax:low?-290:-300,vx:low?10:-32,v:low?'ext4:3':'ext4:4',contact:true}),
  key(12,{ax:low?-288:-304,vx:low?32:14,vy:low?0:38,vr:low?.45:.18,v:'ext4:3'}),
  key(13,{ax:low?-284:-302,vx:low?48:32,vy:low?0:16,vr:low?.9:.62,v:'ext4:8'}),
  key(14,{ax:-290,vx:65,vr:1.35,v:'ext4:8',vPlain:'ext4:15',gravity:true}),
  {...key(15,{ax:-290,vx:65,vr:1.35}),a:last.a,af:last.af,v:'ext4:8',vPlain:'ext4:15'},
 ];
 return {...script,duration,impacts,keys,intactImpact:true,paintedBank:`cinema-fatal-${low?1:0}`,
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function postPaintScript(script) {
 const times=[0,.25,.5,.8,1.05,1.3,1.55,1.85,2.1,2.25,2.5,2.8,3.1,3.4,3.75,4.4];
 const key=(t,ax,vx=0)=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.4,combo:'FINAL COAT',portraitAt:.85,intactImpact:true,paintSpray:true,
  paintedBank:'cinema-fatal-1',victimBank:'cinema-body-ko',victimBraceFrames:[{t:0,frame:0},{t:1.05,frame:1}],
  foleyCues:[{t:.8,kind:'object-paint',audioCue:'vfx-paint'},{t:1.85,kind:'roundhouse-swing'}],
  keys:[key(0,-370),key(.8,-350),key(1.3,-340),key(1.85,-270),{...key(2.1,-240),contact:true},key(2.5,-310,45),key(3.2,-355,95),key(4.4,-355,95)],
  impacts:[{...script.impacts.at(-1),t:2.1,label:'FINAL KICK',final:true,projectilePhase:null,foley:'roundhouse-impact',hitHeight:1.05,hitOffset:65}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
export function postWireGrip(frame) {
 const points=[[178,108],[258,88],[200,148],[258,104],[260,118],[200,128],[140,128],[140,128],[140,142],[140,142]];
 return points[frame]||null;
}
export function postWireHeight(elapsed) {
 const progress=Math.max(0,Math.min(1,(elapsed-1.8)/.7));
 return .78-.18*progress*progress*(3-2*progress);
}
export function releasedPostWire(elapsed,start,end,floor,direction=1) {
 if(elapsed<2.5)return null;
 const age=elapsed-2.5,drop=600*age*age;
 const drift=18*Math.min(1,age/.6)*direction;
 const a={x:start.x-drift,y:Math.min(floor,start.y+drop)};
 const b={x:end.x,y:Math.min(floor,end.y+drop)};
 const sag=3+24*Math.min(1,age/.35);
 return {start:a,end:b,control:{x:(a.x+b.x)/2,y:Math.min(floor+4,(a.y+b.y)/2+sag)},
  settled:a.y===floor&&b.y===floor};
}
function postWireScript(script) {
 const times=[0,.25,.5,.8,1.05,1.3,1.55,1.8,2,2.15,2.5,2.8,3.1,3.4,3.7,4.4];
 const key=(t,ax,vx=0)=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.4,combo:'WIRE PULL',portraitAt:.9,intactImpact:true,wirePull:true,
  paintedBank:'cinema-fatal-0',victimBank:'cinema-overhead-ko',
  victimBraceFrames:[{t:0,frame:0},{t:1.05,frame:1},{t:1.55,frame:2}],
  foleyCues:[{t:.8,kind:'object-wires'},{t:1.55,kind:'object-wires'}],
  keys:[key(0,-420),key(1.05,-420),key(1.55,-450,-35),{...key(2.15,-485,-90),contact:true},key(2.5,-485,-110),key(3.2,-485,-110),key(4.4,-485,-110)],
  impacts:[{...script.impacts.at(-1),t:2.15,label:'FINAL PULLDOWN',final:true,projectilePhase:null,foley:'object-wires',hitHeight:.75}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function donaldClubScript(script) {
 const times=[0,.2,.45,.7,.95,1.3,1.65,1.82,1.95,2.08,2.35,2.65,2.95,3.25,3.65,4.25];
 const key=(t,ax,vx=0)=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.25,combo:'FINAL CLUB',portraitAt:1.05,intactImpact:true,
  paintedBank:'cinema-fatal-1',victimBank:'cinema-overhead-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.65,kind:'heavy'}],
  keys:[key(0,-410),key(1.3,-370),key(1.82,-305),{...key(1.95,-285),contact:true},key(2.4,-350,35),key(3.2,-380,75),key(4.25,-380,75)],
  impacts:[{...script.impacts.at(-1),t:1.95,label:'FINAL CLUB',final:true,projectilePhase:null,foley:'object-golfball',hitHeight:1.2,hitOffset:65}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
export function cinematicTeeBall(elapsed) {
 if(elapsed<.42||elapsed>=2.34)return null;
 const travel=Math.max(0,Math.min(1,(elapsed-1.9)/.22));
 return {travel,alpha:1-Math.max(0,(elapsed-2.12)/.22),rebound:Math.max(0,(elapsed-2.12)/.22)};
}
function donaldTeeScript(script) {
 const times=[0,.2,.45,.7,.95,1.3,1.7,1.82,1.9,2.03,2.3,2.55,2.9,3.2,3.55,4.25];
 const key=(t,vx=0)=>({...script.keys[0],t,ax:-480,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.25,combo:'TEE SHOT',portraitAt:1.1,intactImpact:true,teeBall:true,
  paintedBank:'cinema-fatal-0',victimBank:'cinema-body-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.7,kind:'heavy'},{t:1.9,kind:'object-golfball'}],
  keys:[key(0),key(1.9),{...key(2.12),contact:true},key(2.6,35),key(3.2,85),key(4.25,85)],
  impacts:[{...script.impacts.at(-1),t:2.12,label:'GOLDEN DRIVE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:.95}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function devilWingScript(script) {
 const times=[0,.2,.45,.7,.95,1.3,1.65,1.82,1.95,2.12,2.4,2.7,3,3.3,3.65,4.25];
 const key=(t,ax,vx=0)=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.25,combo:'WING CROSS',portraitAt:1.05,intactImpact:true,
  paintedBank:'cinema-fatal-0',victimBank:'cinema-body-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.65,kind:'heavy'}],
  keys:[key(0,-450),key(1.3,-410),key(1.82,-365),{...key(1.95,-345),contact:true},key(2.4,-380,40),key(3,-420,80),key(4.25,-420,80)],
  impacts:[{...script.impacts.at(-1),t:1.95,label:'WING CROSS',final:true,projectilePhase:null,foley:'roundhouse-impact',hitHeight:.78,hitOffset:25}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function devilStampScript(script) {
 const times=[0,.25,.5,.75,1,1.3,1.65,1.8,1.9,2.1,2.4,2.7,3,3.3,3.7,4.3];
 const key=(t,vx=0)=>({...script.keys[0],t,ax:-380,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.3,combo:'HOOF STAMP',portraitAt:1.05,intactImpact:true,
  groundWave:true,groundOrigin:-245,groundEmbers:true,
  paintedBank:'cinema-fatal-1',victimBank:'cinema-overhead-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.8,kind:'heavy'},{t:1.9,kind:'object-brick'}],
  keys:[key(0),key(1.9),{...key(2.08),contact:true},key(2.6,25),key(3.2,65),key(4.3,65)],
  impacts:[{...script.impacts.at(-1),t:2.08,label:'ASHEN COLLAPSE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:.15}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function deathblowWheelScript(script) {
 const times=[0,.2,.45,.7,1,1.5,1.72,1.9,2.02,2.2,2.45,2.7,3,3.3,3.65,4.25];
 const key=(t,ax,vx=0)=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.25,combo:'WHEEL PASS',portraitAt:1.05,intactImpact:true,
  paintedBank:'cinema-fatal-0',victimBank:'cinema-body-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.5,kind:'heavy'}],
  keys:[key(0,-390),key(1,-355),{...key(1.72,-265),contact:true},key(1.9,-305,15),key(2.3,-330,30),key(3,-360,70),key(4.25,-360,70)],
  impacts:[{...script.impacts.at(-1),t:1.72,label:'STEEL WHEEL PASS',final:true,projectilePhase:null,foley:'object-xacto',hitHeight:1.05,hitOffset:55}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
export function cinematicGroundWave(elapsed) {
 if(elapsed<1.9||elapsed>=2.65)return null;
 const travel=Math.min(1,(elapsed-1.9)/.18);
 const fade=1-Math.max(0,(elapsed-2.08)/.57);
 return {travel,alpha:fade,age:elapsed-1.9};
}
export function cinematicFoleyBetween(script,previous,current) {
 if(current<=previous)return [];
 return (script.foleyCues||[]).filter(cue=>cue.t>previous&&cue.t<=current);
}
function deathblowGroundScript(script) {
 const times=[0,.2,.45,.7,.95,1.2,1.6,1.8,1.9,2.05,2.3,2.6,2.9,3.2,3.6,4.2];
 const key=(t,vx=0)=>({...script.keys[0],t,ax:-360,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.2,combo:'GROUND DRIVE',portraitAt:1.05,intactImpact:true,groundWave:true,
  foleyCues:[{t:1.8,kind:'heavy'},{t:1.9,kind:'object-brick'}],
  paintedBank:'cinema-fatal-1',victimBank:'cinema-overhead-ko',victimBraceFrames:[{t:0,frame:0}],
  keys:[key(0),key(1.9),{...key(2.08),contact:true},key(2.6,25),key(3.2,70),key(4.2,70)],
  impacts:[{...script.impacts.at(-1),t:2.08,label:'FAULTLINE COLLAPSE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:.15}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
export function cinematicSwarm(elapsed,reducedMotion=false) {
 if(elapsed<1.05||elapsed>=3.3)return [];
 return Array.from({length:reducedMotion?12:28},(_,i)=>{
  const start=1.05+(i%7)*.035;
  const progress=Math.max(0,Math.min(1,(elapsed-start)/(1.9-start)));
  const settle=Math.max(0,Math.min(1,(elapsed-1.9)/1.4));
  const spread=(i%7-3)*5;
  return {progress,settle,spread,
   lift:Math.sin(progress*Math.PI)*(24+i%4*7),
   drift:reducedMotion?0:Math.sin(elapsed*9+i*2.4)*4,
   size:2.4+i%3*.5,alpha:Math.min(1,Math.max(0,(elapsed-start)*10))*(1-settle)};
 });
}
function cyraxxSwarmScript(script) {
 const times=[0,.22,.5,.78,1.05,1.28,1.5,1.72,1.9,2.1,2.4,2.7,3,3.35,3.7,4.3];
 const key=(t,vx=0)=>({...script.keys[0],t,ax:-360,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v:'ext4:5',vf:15});
 return {...script,duration:4.3,combo:'SWARM RISE',portraitAt:.85,intactImpact:true,swarmRise:true,
  paintedBank:'cinema-fatal-0',victimBank:'cinema-overhead-ko',victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.05,kind:'object-bedbugs'}],
  keys:[key(0),key(1.72),{...key(1.9),contact:true},key(2.4,25),key(3,65),key(4.3,65)],
  impacts:[{...script.impacts.at(-1),t:1.9,label:'SWARM RISE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:1.15}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
export function cinematicFeedbackPulse(elapsed,reducedMotion=false) {
 if(elapsed<1.94||elapsed>=2.34)return null;
 const travel=Math.max(0,Math.min(1,(elapsed-1.94)/.16));
 const fade=1-Math.max(0,Math.min(1,(elapsed-2.1)/.24));
 return {travel,alpha:fade*(reducedMotion?.24:.48),radius:18+travel*24};
}
function cyraxxFeedbackScript(script) {
 const times=[0,.22,.45,.7,.95,1.3,1.7,1.94,2.1,2.25,2.5,2.8,3.1,3.4,3.75,4.25];
 const key=(t,vx=0,v='ext4:5')=>({...script.keys[0],t,ax:-360,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration:4.25,combo:'DEAD AIR',intactImpact:true,feedbackPulse:true,paintedBank:'cinema-fatal-1',victimBank:'cinema-body-ko',
  victimBraceFrames:[{t:0,frame:0}],
  foleyCues:[{t:1.94,kind:'object-bedbugs',audioCue:'vfx-feedback'}],
  keys:[key(0),key(1.94),{...key(2.1,0,'ext4:4'),contact:true},key(2.4,35,'ext4:3'),key(3,85,'ext4:15'),key(4.25,85,'ext4:15')],
  impacts:[{...script.impacts.at(-1),t:2.1,label:'FEEDBACK RELEASE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:1.05}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function commissionerLockScript(script) {
 const times=[0,.25,.55,.82,1,1.15,1.4,1.65,2.1,2.45,2.6,2.7,2.9,3.2,3.7,4.5];
 const key=(t,ax,vx=0,v='ext4:5')=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration:4.5,combo:'CANE LOCK',intactImpact:true,paintedBank:'cinema-fatal-0',victimBank:'cinema-body-ko',
  victimSpacing:{jez:10},
  victimBraceFrames:[{t:0,frame:0},{t:1,frame:1},{t:1.15,frame:2},{t:1.4,frame:1},{t:1.65,frame:0}],
  keys:[key(0,-400),key(.82,-310),{...key(1,-280,0,'ext4:2'),contact:true},key(1.4,-430,-200,'ext4:3'),key(1.8,-430,-200),
   {...key(2.6,-480,-200,'ext4:4'),contact:true},key(2.9,-505,-100,'ext4:3'),key(3.4,-530,-40,'ext4:15'),key(4.5,-530,-40,'ext4:15')],
  impacts:[{...script.impacts[0],t:1,label:'CANE HOOK',final:false,projectilePhase:null,foley:'object-cane',hitHeight:.95,hitOffset:55},
   {...script.impacts.at(-1),t:2.6,label:'FINAL BODY STRIKE',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:1.05,hitOffset:25}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function commissionerGavelScript(script) {
 const times=[0,.2,.45,.7,.95,1.3,1.82,1.98,2.1,2.18,2.32,2.6,2.95,3.3,3.65,4.1];
 const key=(t,ax,vx=0,v='ext4:5')=>({...script.keys[0],t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration:4.1,combo:'FINAL VERDICT',intactImpact:true,paintedBank:'cinema-fatal-1',victimBank:'cinema-overhead-ko',
  victimSpacing:{devil:12},
  victimBraceFrames:[{t:0,frame:0}],
  keys:[key(0,-420),key(.95,-370),key(1.82,-350),{...key(2.1,-340,0,'ext4:4'),contact:true},key(2.4,-370,30,'ext4:3'),key(3,-400,65,'ext4:15'),key(4.1,-400,65,'ext4:15')],
  impacts:[{...script.impacts.at(-1),t:2.1,label:'FINAL VERDICT',final:true,projectilePhase:null,foley:'object-cane',hitHeight:1.2,hitOffset:75}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function aliBassScript(script) {
 const times=[0,.22,.48,.78,1.05,1.3,1.52,1.72,1.86,2.05,2.35,2.65,2.95,3.3,3.65,4.15];
 const key=(t,vx=0,v='ext4:5')=>({...script.keys[0],t,ax:-380,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration:4.15,paintedBank:'cinema-fatal-1',intactImpact:true,bassPulse:true,combo:'BASS DROP',signatureSpecial:'BOOMBOX',portraitAt:1.1,victimBank:'cinema-body-ko',
  victimBraceFrames:[{t:0,frame:0}],
  keys:[key(0),key(1.72),{...key(1.86,0,'ext4:4'),contact:true},key(2.15,30,'ext4:3'),key(2.8,85,'ext4:15'),key(4.15,85,'ext4:15')],
  impacts:[{...script.impacts.at(-1),t:1.86,label:'BASS DROP',final:true,projectilePhase:null,foley:'hit-heavy',audioCue:'vfx-bass',hitHeight:.85}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
// A scene-clock wave front reaches the victim at the authored contact frame.
// No particle simulation: pausing or seeking cannot leave a pulse behind.
export function cinematicBassPulse(elapsed,reducedMotion=false) {
 if(elapsed<1.72||elapsed>=2.1)return null;
 const travel=clamp((elapsed-1.72)/.14,0,1);
 const fade=1-clamp((elapsed-1.86)/.24,0,1);
 return {x:-180+180*travel,y:-250+63*travel,
  radius:reducedMotion?28:28+30*travel,alpha:fade*(reducedMotion?.32:.65)};
}
function aliDiscScript(script) {
 const times=[0,.2,.4,.7,1.05,1.25,1.36,1.52,1.9,2.2,2.65,2.85,3.05,3.3,3.7,4.2];
 const key=(t,vx=0,v='ext4:5')=>({...script.keys[0],t,ax:-380,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration:4.2,paintedBank:'cinema-fatal-0',discFlight:true,portraitAt:1.1,victimBank:'cinema-body-ko',
  victimBraceFrames:[{t:0,frame:0},{t:1.7,frame:1},{t:1.78,frame:2},{t:1.88,frame:3},{t:2.02,frame:2},{t:2.12,frame:1},{t:2.22,frame:0}],
  keys:[key(0),key(1.7,0,'ext4:2'),key(1.95,0,'ext4:3'),key(2.2),
   {...key(2.4,0,'ext4:4'),contact:true},key(2.65,20,'ext4:3'),key(3.1,50,'ext4:15'),key(4.2,50,'ext4:15')],
  impacts:[{...script.impacts[0],t:1.7,label:'OUTBOUND CUT',final:false,projectilePhase:null,foley:'object-vinyl',hitHeight:1},
   {...script.impacts.at(-1),t:2.4,label:'RETURN CUT',final:true,projectilePhase:null,foley:'object-vinyl',hitHeight:1}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
// Local stage coordinates: the disc exists only between the empty-hand release
// and the painted catch. Sampling the scene clock makes pause/replay exact.
export function cinematicDiscFlight(elapsed) {
 const keys=[[1.25,-170,-280],[1.7,0,-240],[2.05,110,-260],[2.4,0,-240],[2.85,-273,-310]];
 if(elapsed<keys[0][0]||elapsed>=keys.at(-1)[0])return null;
 let i=0;while(i<keys.length-2&&elapsed>=keys[i+1][0])i++;
 const a=keys[i],b=keys[i+1],t=(elapsed-a[0])/(b[0]-a[0]);
 return {x:a[1]+(b[1]-a[1])*t,y:a[2]+(b[2]-a[2])*t,spin:(elapsed-1.25)*18};
}
function alanOverheadScript(script) {
 const final=2.1,duration=4.05,first=script.keys[0];
 const cells=[0,2,1,3,4,5,7,6,10,9,8,11,12,13,14,15];
 const times=[0,.18,.34,.55,.78,1.05,1.4,1.94,final,2.18,2.26,2.4,2.65,2.9,3.35,duration];
 const key=(t,ax,vx=0,v='ext4:5')=>({...first,t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15});
 return {...script,duration,intactImpact:true,paintedBank:'cinema-fatal-1',victimBank:'cinema-body-ko',
  victimBanks:{jez:'cinema-overhead-ko',benny:'cinema-overhead-ko',alan:'cinema-overhead-ko',ali:'cinema-overhead-ko',commissioner:'cinema-overhead-ko',cyraxx:'cinema-overhead-ko',deathblow:'cinema-overhead-ko',donald:'cinema-overhead-ko',post:'cinema-overhead-ko',devil:'cinema-overhead-ko'},
  victimSpacing:{alan:18,commissioner:22,deathblow:24,donald:14,post:24,devil:40},
  victimBraceFrames:[{t:0,frame:0}],
  keys:[key(0,-335),key(.78,-285),key(1.4,-270),{...key(final,-225,0,'ext4:4'),contact:true},
   key(2.4,-250,35,'ext4:3'),key(2.95,-290,75,'ext4:15'),key(duration,-290,75,'ext4:15')],
  impacts:[{...script.impacts.at(-1),t:final,label:'OVERHEAD HAMMER',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:1.05}],
  paintedFrames:times.map((t,i)=>({t,frame:cells[i]}))};
}
function alanPressureScript(script) {
 const contact=1.05,final=2.8,duration=4.65;
 const times=[0,.25,.55,.75,.94,contact,1.22,1.5,2.2,2.56,final,3.02,3.2,3.48,3.8,duration];
 const first=script.keys[0];
 const key=(t,ax,vx=0,v='ext4:5',contact=false)=>({...first,t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15,contact});
 const keys=[key(0,-340),key(.55,-275),key(contact,-220,0,'ext4:2',true),
  key(1.3,-265,20,'ext4:3'),key(1.6,-285,20),key(2.2,-285,20),
  key(final,-200,20,'ext4:4',true),key(3.02,-240,45,'ext4:3'),
  key(3.5,-285,75,'ext4:15'),key(duration,-285,75,'ext4:15')];
 return {...script,duration,keys,intactImpact:true,paintedBank:'cinema-fatal-0',victimBank:'cinema-body-ko',
  victimBraceFrames:[{t:0,frame:0},{t:contact,frame:1},{t:contact+.08,frame:2},
   {t:contact+.16,frame:3},{t:contact+.32,frame:2},{t:contact+.44,frame:1},{t:contact+.56,frame:0}],
  impacts:[{...script.impacts[0],t:contact,label:'BODY PRESSURE',sound:'heavy',final:false,projectilePhase:null,foley:'hit-heavy',hitHeight:.8},
   {...script.impacts.at(-1),t:final,label:'FINAL BODY BLOW',sound:'final',final:true,projectilePhase:null,foley:'hit-heavy',hitHeight:.8}],
  paintedFrames:times.map((t,frame)=>({t,frame}))};
}
function bennyFatalityScript(variant,script) {
 const rising=variant===1;
 const contact=script.impacts[0].t+.2;
 const final=script.impacts.at(-1).t+(rising?.28:0);
 const duration=Math.max(script.duration,final+1.6);
 const impacts=[
  {...script.impacts[0],t:.15,label:'BLADE DRAW',projectilePhase:'prime'},
  {...script.impacts[1],t:contact,label:rising?'RISING OPENING CUT':'CLOSE OPENING CUT',projectilePhase:'trap'},
  {...script.impacts.at(-1),t:final,label:rising?'RISING FINAL CUT':'CROSS FINAL CUT',projectilePhase:'kill',final:true},
 ];
 const times=rising?[0,.15,contact-.36,contact-.27,contact-.18,contact-.11,contact-.05,contact,
  final-.5,final-.34,final-.12,final,final+.14,final+.28,final+.5,duration]
  :[0,.15,contact-.12,contact-.06,contact,contact+.06,contact+.18,contact+.3,
  final-.45,final-.18,final-.075,final,final+.14,final+.28,final+.5,duration];
 const first=script.keys[0];
 const key=(t,ax,vx=0,v='ext4:5',contact=false)=>({...first,t,ax,ay:0,vx,vy:0,ar:0,vr:0,zoom:1,v,vf:15,contact});
 const keys=[key(0,-340),key(.15,-310),key(contact-.15,-250),key(contact,-235,10,'ext4:2',true),
  key(contact+.18,-302,24,'ext4:3'),key(contact+.42,-328,28),key(final-.5,-330,28),
  key(final-.13,-248,28),key(final,-220,28,'ext4:4',true),key(final+.18,-250,50,'ext4:3'),
  key(final+.55,-310,84,'ext4:15'),key(duration,-320,90,'ext4:15')];
 keys.at(-1).vPlain='ext4:15';
 return {...script,duration,impacts,keys,paintedBank:`cinema-fatal-${rising?1:0}`,
  paintedFrames:times.map((t,frame)=>({t,frame:!rising&&frame===3?2:frame}))};
}
export function paintedFatalityFrame(script,elapsed) {
 if(!script.paintedFrames)return null;
 return script.paintedFrames.reduce((frame,key)=>elapsed>=key.t?key.frame:frame,0);
}

export function knockoutFrame(elapsed){
 // Slow anticipation, a fast loss of support, then a longer settle.
 const times=[0,.07,.14,.21,.28,.34,.40,.46,.52,.60,.69,.79,.9,1.02,1.16,1.3];
 let frame=0;while(frame<15&&elapsed>=times[frame+1])frame++;return frame;
}

export function cinematicScene(fighterId,kind='knockout',variant=0){
 const fighter=identity[fighterId];if(!fighter)return null;
 const fatality=kind==='fatality';variant=variant===1?1:0;
 const profile=fatality?cinematicFatalityProfile(fighterId,variant):null;
 const impact=fatality?(variant===0?3.15:3.55):.72;
 const duration=impact+(fatality?2.35:2.1);
 return {
  id:`${fighterId}-${kind}-${variant}`,fighterId,kind,variant,
  title:profile?.title||fighter.ko,gesture:fatality?fighter.finish[variant]:fighter.strike,
  accent:fighter.accent,projectile:profile?.projectileId||null,impact,duration,
  // Inserts can crop dedicated portraits. The stage itself never rescales.
  arenaScale:1,
  beats:[
   {at:0,id:'anticipation',shot:'wide',music:.3},
   {at:impact*(fatality?.23:.25),id:'intent',shot:'portrait',music:.16},
   {at:impact-.22,id:'commit',shot:'wide',music:.06},
   {at:impact,id:'impact',shot:'wide',music:.04},
   {at:impact+.16,id:'reaction',shot:'wide',music:.08},
   {at:impact+1.3,id:'aftermath',shot:'wide',music:.18},
   {at:duration-.35,id:'victory',shot:'wide',music:.4},
  ],
  art:{attacker:`cinema-${kind}-${variant}`,victim:'cinema-ko'},
 };
}

export function sampleCinematicScene(scene,elapsed){
 if(!scene)return null;elapsed=clamp(Number.isFinite(elapsed)?elapsed:0,0,scene.duration);
 const beat=scene.beats.reduce((current,next)=>next.at<=elapsed?next:current,scene.beats[0]);
 return {...beat,elapsed,arenaScale:1,victimFrame:knockoutFrame(Math.max(0,elapsed-scene.impact)),
  showPortrait:beat.shot==='portrait',announceVictory:beat.id==='victory',
  complete:elapsed>=scene.duration};
}







// Material-specific landing dressing. Randomness is supplied by the caller's
// visual stream; these particles never participate in combat collision.
export const CINEMATIC_SURFACES=Object.freeze({
 somerset:{material:'water',mark:'splash',color:'#91a8b0',wet:true},
 cruise:{material:'water',mark:'splash',color:'#b4d8dc',wet:true},
 janney:{material:'soil',mark:'dent',color:'#967352',wet:false},
 vet:{material:'grit',mark:'skid',color:'#77736b',wet:false},
 wildwood:{material:'wood',mark:'splinter',color:'#b18b5d',wet:false},
 buffet:{material:'tile',mark:'dent',color:'#b7b4a3',wet:false},
});
// Fine directional contact spray for painted scenes; never palette-colored orbs.
export function cinematicContactParticles(x,y,direction,{quality=1,reducedMotion=false,random=Math.random}={}) {
 const count=reducedMotion?3:Math.round(12*Math.max(0,Math.min(1,quality)));
 return Array.from({length:count},(_,i)=>{
  const mist=i%4===3,life=mist?.28:.3+random()*.18;
  return {kind:mist?'mist':'sweat',x:x+(random()-.5)*8,y:y+(random()-.5)*10,
   vx:direction*(65+random()*150),vy:-25-random()*100,gravity:mist?45:540,
   drag:mist?.94:.985,life,max:life,size:mist?4+random()*3:.65+random()*1.05,
   color:mist?'#b6ac98':'#e3ddd0'};
 });
}
export function cinematicLanding(stage,x,floor,{force=.7,quality=1,reducedMotion=false,random=Math.random}={}) {
 const surface=CINEMATIC_SURFACES[stage]||CINEMATIC_SURFACES.vet;
 force=Math.max(.4,Math.min(1.35,force));quality=Math.max(0,Math.min(1,quality));
 const count=reducedMotion?0:Math.round((surface.wet?14:10)*quality);
 const particles=[];
 for(let i=0;i<count;i++) {
  const direction=i%2?1:-1;
  const life=surface.wet?.9:5.5;
  particles.push({kind:surface.wet?'sweat':'debris',cinematicMaterial:surface.material,
   x:x+(random()-.5)*64,y:floor-3,groundY:floor-2+random()*4,
   vx:direction*(50+random()*135)*force,vy:-(40+random()*105)*force,
   gravity:surface.wet?620:760,drag:.987,rotation:random()*Math.PI,spin:(random()-.5)*8,
   life,max:life,size:surface.wet?1.2+random()*1.5:1.5+random()*2.8,
   color:surface.color,bounced:false,resting:false});
 }
 if(!surface.wet&&!reducedMotion)for(let i=0;i<Math.round(5*quality);i++) {
  particles.push({kind:'dust',cinematicMaterial:'dust',x:x+(random()-.5)*64,y:floor-4,
   vx:(random()-.5)*75,vy:-12-random()*20,gravity:-4,drag:.97,
   life:1.2,max:1.2,size:5+random()*6,color:surface.color});
 }
 return {surface,particles,ripple:surface.wet?{kind:'cinematicRipple',x,y:floor,
  width:70+force*45,life:reducedMotion?.35:1.15,max:reducedMotion?.35:1.15,
  still:reducedMotion,color:surface.color}:null};
}
// Called after the shared ballistic step. Wet droplets disappear on contact;
// hard fragments bounce once, settle, then remain through the aftermath.
export function settleCinematicParticle(particle) {
 if(!particle.cinematicMaterial||particle.cinematicMaterial==='dust')return;
 if(particle.resting) {
  particle.y=particle.groundY;particle.vx=particle.vy=particle.spin=0;return;
 }
 if(particle.y<particle.groundY||particle.vy<=0)return;
 particle.y=particle.groundY;
 if(particle.cinematicMaterial==='water'){particle.life=0;return;}
 if(!particle.bounced&&particle.vy>65) {
  particle.bounced=true;particle.vy*=-.18;particle.vx*=.45;particle.spin*=.35;
 } else {
  particle.resting=true;particle.vx=particle.vy=particle.spin=0;
 }
}

// Presentation samples never write back into the deterministic simulation.
export function captureMotion(fighter) {
  return { x: fighter.x, y: fighter.y, animTime: fighter.animTime,
    walkTime: fighter.walkTime, strideTime: fighter.strideTime, vx: fighter.vx, vy: fighter.vy, attackTime: fighter.attackTime,
    attacking: fighter.attacking, facing: fighter.facing, grounded: fighter.grounded };
}

export function interpolateMotion(fighter, previous, alpha) {
  if (!previous || Math.hypot(fighter.x - previous.x, fighter.y - previous.y) > 100
    || fighter.cinematicFrame != null) return fighter;
  const t = Math.max(0, Math.min(1, alpha));
  const result = { ...fighter };
  for (const key of ["x", "y", "vx", "vy", "animTime", "walkTime", "strideTime", "attackTime"]) {
    if (key === "attackTime" && fighter.attacking !== previous.attacking) continue;
    if ((key === "animTime" || key === "walkTime") && fighter[key] < previous[key]) continue;
    if (Number.isFinite(previous[key]) && Number.isFinite(fighter[key])) {
      result[key] = previous[key] + (fighter[key] - previous[key]) * t;
    }
  }
  return result;
}

// A fixed wide shot: independent of pose, spacing, HUD height or frame time.
// Full-size stage coordinates are 1280x720 with the floor at y=600.
export function fixedDemoFrame() {
  return { scale: 0.72, x: 1280 * (1 - 0.72) / 2, y: 560 - 600 * 0.72 };
}

// Blend feet-anchored lean, recoil and landing compression between simulation ticks.
// Combat poses and hit timing stay discrete.
export function interpolateBodyMotion(current, previous, alpha) {
  if (!previous) return current;
  const t = Math.max(0, Math.min(1, alpha));
  const result = { ...current };
  for (const key of ["rotation", "flipRotation", "scaleX", "scaleY", "offsetX", "offsetY"]) {
    if (Number.isFinite(previous[key]) && Number.isFinite(current[key])) {
      // A completed flip must not interpolate backwards through a full turn.
      if (key === "flipRotation" && Math.abs(current[key] - previous[key]) > Math.PI) continue;
      result[key] = previous[key] + (current[key] - previous[key]) * t;
    }
  }
  return result;
}
