// Watch Demo: Ray fishes the cove with the real simulation and the player's own input path.
// The angler brain scores spots, rigs and techniques against the conditions and says why; the
// technique executor turns a named retrieve into reel and twitch input with human jitter; the
// fight controller reads the fight state with a reaction delay; the director cuts to the lure cam
// when a fish follows, slows time for a jump, and holds the hero shot when one is landed. A dead-
// air governor keeps the episode moving. Everything Ray does is logged for the report.
import {activityByHour} from './species.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const SPOT_BASE={laydown:1,dock:.95,weedbed:.9,pads:.8,stump:.7,riprap:.75};
const TECH_FOR={walker:'walking the dog',worm:'lift & drop',squarebill:'stop & go'};
// --- the plan: which spot, which rig, which technique, and the sentence that explains it
export function planNext({hour,activity,spots,rigs,kayak,memory,random}){
 const lowLight=activity>.62;
 const scored=spots.map(s=>{const visits=memory.visits[s.type+':'+Math.round(s.x)]||0;const d=Math.hypot(s.x-kayak.x,s.z-kayak.z);
  let v=(SPOT_BASE[s.type]||.6)*(1-clamp(visits*.3,0,.75))*(1-clamp(d/320,0,.45));
  if(s.type==='pads'||s.type==='weedbed')v*=lowLight?1.15:.85;if(s.type==='riprap'||s.type==='dock')v*=lowLight?.9:1.15;
  return {spot:s,v:v*(1+(random()-.5)*.3)};}).sort((a,b)=>b.v-a.v);
 const pick=scored[0].spot;
 // rig: topwater in low light or over vegetation, squarebill on rock and wood in daylight, the worm when they refuse
 let rigIndex=lowLight?1:(pick.type==='riprap'||pick.type==='dock'||pick.type==='laydown')?2:0;
 if(memory.refusals>=2&&rigIndex!==0)rigIndex=0;
 const lure=rigs[rigIndex].lure,technique=TECH_FOR[lure]||'straight retrieve';
 const where={laydown:'the laydown',dock:'the dock',weedbed:'the weed bed',pads:'the pads',stump:'the stumps',riprap:'the riprap point'}[pick.type]||'that cover';
 let reason;
 if(memory.refusals>=2)reason=`They keep turning away. Slowing down: a worm on ${where}, lift and drop.`;
 else if(lowLight&&rigIndex===1)reason=`Low light and calm water. Walking the walker over ${where}.`;
 else if(rigIndex===2)reason=`Sun's up. Squarebill off ${where}, stop and go so it deflects.`;
 else reason=`Worm on ${where}, hopped along the bottom.`;
 memory.visits[pick.type+':'+Math.round(pick.x)]=(memory.visits[pick.type+':'+Math.round(pick.x)]||0)+1;memory.refusals=0;
 return {spot:pick,rigIndex,technique,reason};
}
// --- the executor: reel and twitch input for a named technique
export function createExecutor(technique,random){const ex={technique,t:0,phase:random()*2,reeling:false,twitch:false};return ex;}
export function stepExecutor(ex,dt,random){
 ex.t+=dt;ex.twitch=false;const j=()=>(random()-.5)*.25;
 switch(ex.technique){
  case 'walking the dog':ex.reeling=((ex.t*10)|0)%10<4;if(ex.t>ex.phase){ex.twitch=true;ex.phase=ex.t+.42+j();}break;
  case 'lift & drop':ex.reeling=((ex.t*10)|0)%20<7;if(ex.t>ex.phase){ex.twitch=true;ex.phase=ex.t+1.5+j()*2;}break;
  case 'stop & go':ex.reeling=((ex.t+ex.phase)%2.0)<1.2;break;
  case 'twitching':ex.reeling=true;if(ex.t>ex.phase){ex.twitch=true;ex.phase=ex.t+.9+j()*2;}break;
  case 'slow roll':ex.reeling=((ex.t*10)|0)%10<6;break;
  default:ex.reeling=true;
 }
 return {reeling:ex.reeling,twitch:ex.twitch};
}
// --- the fight controller: what a competent angler does, a beat late
export function fightControl(ft,skill,delayed){
 const st=delayed||ft.state;
 if(st==='JUMP')return {reeling:.85,sidePressure:0,rodUp:0};
 if(st==='RUN')return {reeling:.15,sidePressure:1,rodUp:.7};
 if(st==='HEADSHAKE')return {reeling:.95,sidePressure:0,rodUp:.8};
 if(st==='TIRED')return {reeling:1,sidePressure:0,rodUp:.6};
 return {reeling:.85,sidePressure:.4,rodUp:.7};
}
// --- the episode
export function createDemo(seed=1){
 return {seed,random:rng(seed),state:'open',stateTime:0,segment:0,castsAtSpot:0,casts:0,plan:null,executor:null,memory:{visits:{},refusals:0},
  events:[],decisions:[],coverage:[],captions:[],opened:false,rate:4,lastEventAt:0,encounters:0,strikes:0,landed:0,lost:0,elapsed:0,deadAir:0,fightDelay:.25,delayedState:null,delayClock:0,shot:'surface',shotUntil:0,slowmoUntil:0,hookAt:null,castPending:0,episodeDone:false,aimYaw:0,power:0,charge:false};
}
export function caption(d,text,seconds=4.5){d.captions.push({t:d.elapsed,text,seconds});return text;}
// game: the adapter main.js provides (see makeDemoAdapter there)
export function stepDemo(d,dt,game){
 d.elapsed+=dt;d.stateTime+=dt;
 const a=game.angling();
 // director: follows and strikes go to the lure cam, jumps slow time, a landing holds the hero shot
 const near=game.nearestFishState();
 if(a.phase==='retrieve'&&(near==='INSPECT'||near==='STRIKE')&&d.shot!=='lurecam'){d.shot='lurecam';d.shotUntil=d.elapsed+7;d.coverage.push({t:d.elapsed,event:near.toLowerCase(),shot:'lurecam'});if(near==='INSPECT'){d.encounters++;d.lastEventAt=d.elapsed;}}
 if(a.phase==='fight'){const ft=game.fight();if(ft&&ft.state==='JUMP'&&d.elapsed>d.slowmoUntil+2){d.slowmoUntil=d.elapsed+1.3;d.coverage.push({t:d.elapsed,event:'jump',shot:'slowmo+'+d.shot});}
  if(d.shot==='lurecam'&&d.elapsed>d.shotUntil)d.shot='surface';}
 else if(d.shot==='lurecam'&&(d.elapsed>d.shotUntil||a.phase!=='retrieve'))d.shot='surface';
 game.setShot(d.shot,d.elapsed<d.slowmoUntil?.35:1);
 // events from the angling layer
 for(const e of game.drainEvents()){d.events.push({t:d.elapsed,type:e.type,reason:e.reason});d.lastEventAt=d.elapsed;
  if(e.type==='bite'){d.strikes++;if(d.rate!==4){d.rate=4;game.setRate(4);}d.hookAt=d.elapsed+.25+d.random()*.35;caption(d,'There he is.',2);}
  if(e.type==='hooked')caption(d,['Fish on.','Got him.','Good fish, stay on.'][Math.floor(d.random()*3)],2.5);
  if(e.type==='missed'){d.memory.refusals++;caption(d,e.reason==='too early'?'Pulled it out of his mouth. Patience.':'Spat it. Let them take it next time.');}
  if(e.type==='lost'){d.lost++;d.memory.refusals++;caption(d,e.reason==='broke off'?'Broke off. That drag was set too tight for this line.':'Threw the hook on the shake. Keep it tight next time.');}
  if(e.type==='landed'){d.landed++;d.coverage.push({t:d.elapsed,event:'landed',shot:'hero'});caption(d,'That is a good one. Look at the shoulders on him.',5);}
  if(e.type==='released')caption(d,'Back you go.',2);}
 switch(d.state){
  case 'open':{if(!d.opened){d.opened=true;game.setRate(4);game.anchor(true);caption(d,game.openingLine(),6);}
   if(d.stateTime>6){d.state='plan';d.stateTime=0;}break;}
  case 'plan':{const p=planNext({hour:game.hour(),activity:game.activity(),spots:game.spots(),rigs:game.rigs(),kayak:game.kayak(),memory:d.memory,random:d.random});
   d.plan=p;d.decisions.push({t:d.elapsed,spot:p.spot.type,rig:p.rigIndex,technique:p.technique,reason:p.reason});caption(d,p.reason,6);game.setRig(p.rigIndex);d.castsAtSpot=0;d.segment++;
   d.state='travel';d.stateTime=0;game.anchor(false);game.setRate(12);d.rate=12;break;}
  case 'travel':{const k=game.kayak(),s=d.plan.spot,dist=Math.hypot(s.x-k.x,s.z-k.z);
   if(dist<24||d.stateTime>60){game.paddle(0,0);game.anchor(true);game.setRate(4);d.rate=4;d.state='cast';d.stateTime=0;break;}
   const yaw=Math.atan2(s.x-k.x,s.z-k.z);let rel=yaw-k.heading;rel=Math.atan2(Math.sin(rel),Math.cos(rel));game.paddle(Math.abs(rel)<.6?1:.4,clamp(rel*1.5,-1,1));break;}
  case 'cast':{if(a.phase!=='idle'){d.state='work';d.stateTime=0;break;}
   const k=game.kayak(),s=d.plan.spot;const ang=d.random()*6.283,r=d.random()*Math.max(2,s.r*.55);const tx=s.x+Math.cos(ang)*r,tz=s.z+Math.sin(ang)*r;
   const dist=Math.hypot(tx-k.x,tz-k.z);game.aimAt(tx,tz);const power=clamp((dist-6)/26+(d.random()-.5)*.1,.25,1);
   if(d.stateTime<.6){break;} // let the look settle on the target
   game.cast(power);d.casts++;d.castsAtSpot++;d.executor=createExecutor(d.plan.technique,d.random);d.state='work';d.stateTime=0;break;}
  case 'work':{
   if(a.phase==='flight'){game.input({reeling:false,twitch:false});break;}
   if(a.phase==='retrieve'){const inp=stepExecutor(d.executor,dt,d.random);game.input(inp);
    if(d.stateTime>45){game.input({reeling:true,twitch:false});}
    // the governor: a quiet stretch runs the clock forward so the light keeps changing
    const quiet=d.elapsed-d.lastEventAt>30;const want=quiet?12:4;if(d.rate!==want){d.rate=want;game.setRate(want);}break;}
   if(a.phase==='bite'){if(d.hookAt!==null&&d.elapsed>=d.hookAt){game.setHook();d.hookAt=null;}break;}
   if(a.phase==='fight'){const ft=game.fight();d.delayClock+=dt;if(d.delayClock>d.fightDelay){d.delayClock=0;d.delayedState=ft?ft.state:null;}game.fightInput(fightControl(ft,1,d.delayedState));break;}
   if(a.phase==='landed'){if(d.stateTime>7){game.release();d.state='cast';d.stateTime=0;}break;}
   // back to idle: decide whether to keep casting here
   game.input({reeling:false,twitch:false});game.fightInput(null);
   const sinceEvent=d.elapsed-d.lastEventAt;
   if(d.castsAtSpot>=6&&sinceEvent>60||d.memory.refusals>=2||sinceEvent>150){if(d.segment>=5){d.state='card';d.stateTime=0;}else{d.state='plan';d.stateTime=0;}}
   else{d.state='cast';d.stateTime=0;}
   break;}
  case 'card':{if(!d.carded){d.carded=true;caption(d,`${d.landed} landed, ${d.strikes} bites, ${d.casts} casts. ${d.landed?'Not a bad morning.':'They win some mornings.'}`,8);game.setRate(4);}
   if(d.stateTime>8){d.episodeDone=true;d.state='open';d.stateTime=0;d.segment=0;d.memory={visits:{},refusals:0};d.opened=false;d.carded=false;}break;}
 }
 // dead air: nothing happening for a while while working a lure → count it
 if(d.state==='work'&&a.phase==='retrieve'&&d.elapsed-d.lastEventAt>45)d.deadAir+=dt;
 return d.state;
}
export function demoReport(d){return {seed:d.seed,elapsed:+d.elapsed.toFixed(0),state:d.state,segment:d.segment,casts:d.casts,encounters:d.encounters,strikes:d.strikes,landed:d.landed,lost:d.lost,deadAirFraction:+(d.deadAir/Math.max(1,d.elapsed)).toFixed(3),decisions:d.decisions,coverage:d.coverage,events:d.events.map(e=>e.type+(e.reason?':'+e.reason:'')),captions:d.captions.map(c=>c.text)};}
