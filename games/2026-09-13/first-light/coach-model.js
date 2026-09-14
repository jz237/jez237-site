// Ray's coaching: the hotspots he would fish right now, from the same numbers the demo planner uses,
// and short tips that fire on what the player is doing, each with a cooldown so he never nags.
// Pure and node-tested; main.js builds the context and shows the lines.
import {scoreRig} from './demo.js';
import {RIGS,LURES} from './tackle.js';
import {SPECIES} from './species.js';
const WHERE={laydown:'the laydown',dock:'the dock',weedbed:'the weed bed',pads:'the pads',stump:'the stumps',riprap:'the riprap point'};
const NAME={laydown:'Laydown',dock:'Dock',weedbed:'Weed bed',pads:'Lily pads',stump:'Stump field',riprap:'Riprap point'};
export function hotspots({features=[],hour=7,sunrise=6.5,sunset=19.5,cond=null,activity=.5,caught={},rigs=RIGS,lures=LURES,species=SPECIES,top=3}={}){
 const lowLight=activity>.62,night=hour>sunset+.4||hour<sunrise-.4;const out=[];
 for(const f of features){let best=null;for(let i=0;i<rigs.length;i++){const lure=lures[rigs[i].lure];if(!lure)continue;const sc=scoreRig(f.type,rigs[i],lure,{hour,sunrise,sunset,species,caught,lowLight,cond,night});if(!best||sc.value>best.value)best={value:sc.value,rig:rigs[i].id,rigIndex:i,lure:lure.name,target:sc.target};}
  if(best&&best.value>0)out.push({type:f.type,x:f.x,z:f.z,name:NAME[f.type]||f.type,where:WHERE[f.type]||f.type,...best});}
 out.sort((a,b)=>b.value-a.value);
 // three different places: a second stump or laydown within 60 m of a picked one is the same spot
 const picked=[];for(const h of out){if(picked.length>=top)break;if(picked.some(p=>p.type===h.type&&Math.hypot(p.x-h.x,p.z-h.z)<60))continue;picked.push(h);}
 return picked.map((h,i)=>({...h,rank:i+1}));
}
export function hotspotLine(h){if(!h)return '';const sp=h.target?species(h.target):'fish';return `Hotspot now: ${h.name} · ${sp} on ${h.lure.toLowerCase()}`;}
function species(id){const s=SPECIES[id];return s?s.name.toLowerCase():id;}
export const COACH_COOLDOWN=300;
const TIPS=[
 {id:'idle',when:c=>c.phase==='idle'&&c.idleSeconds>25&&c.casts>0&&c.cover,text:c=>`Nothing happens with the lure in the boat. Cast at ${c.cover.where}, ${c.cover.m} m ${c.cover.word}.`},
 {id:'first',when:c=>c.casts===0&&c.idleSeconds>18,text:()=>'Hold the mouse button to load the cast, let go to throw. Aim near cover: fish live on it.'},
 {id:'thin',when:c=>c.phase==='retrieve'&&c.lureDepthBed<.5&&c.elevation>25,text:()=>'That is thin water in bright light. Work the weed edge or the point instead.'},
 {id:'stale',when:c=>c.castsHere>=5&&c.sinceBite>90,text:c=>`Five casts here and nothing. Move, or change the retrieve. ${c.hotspot?c.hotspot.name+' should be going.':''}`.trim()},
 {id:'worm',when:c=>c.lure==='worm'&&c.technique==='straight retrieve'&&c.retrieves>=2,text:()=>'A worm wants lift and drop: twitch with F, then let it fall on a slack line.'},
 {id:'topwater',when:c=>c.family==='topwater'&&c.elevation>30,text:()=>'Topwater is a first-light and last-light bait. Bright sun, go deeper: the worm or the squarebill.'},
 {id:'early',when:c=>c.missedEarly>=2,text:()=>'Wait a beat on the take before you set. Let him turn with it.'},
 {id:'broke',when:c=>c.brokeOff>=2,text:()=>'Broke off again. When he runs, side pressure with A and D and stop reeling; the drag does the work.'},
 {id:'cats',when:c=>c.night&&c.unlocked.includes('bottom')&&c.rig!=='bottom'&&c.sinceBite>120,text:()=>'Cats move after dark: cut bait on the bottom, rod in the holder (H), and fish a second rod while it soaks.'},
 {id:'hotspot',when:c=>c.hotspot&&c.hotspot.dist>60&&c.sinceBite>180&&c.castsHere>=3,text:c=>`${c.hotspot.name} should be good now, ${species(c.hotspot.target)} on ${c.hotspot.lure.toLowerCase()}. It is ${c.hotspot.dist} m ${c.hotspot.word}.`},
];
export function createCoach(){return {fired:{},last:null,count:0};}
// returns a tip {id,text} or null; the same tip waits COACH_COOLDOWN seconds before it can fire again
export function coachTip(coach,ctx,t){if(!ctx||ctx.enabled===false)return null;for(const tip of TIPS){const at=coach.fired[tip.id];if(at!==undefined&&t-at<COACH_COOLDOWN)continue;if(tip.when(ctx)){coach.fired[tip.id]=t;coach.last={id:tip.id,text:tip.text(ctx),t};coach.count++;return coach.last;}}return null;}
