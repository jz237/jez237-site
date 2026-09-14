// Big Bass: the kayak tournament format as fished in the real kayak series. Catch, photo on the
// board, release; best five bass by length, total inches. The rivals are other kayaks on the same
// cove: they fish with the same planner scores and the same species tables, but at the level of
// rates (a cast every so often, a bass landed with a probability that follows the planner's own
// value for their spot and rig) rather than as fully simulated boats. Pure, node-testable.
import {SPECIES} from './species.js';
import {scoreRig} from './demo.js';
import {LURES,RIGS} from './tackle.js';
export const BASS=new Set(['largemouth','smallmouth']);
export const LIMIT=5;
export const TOURNEY_SECONDS=20*60;
export const RIVALS=[{name:'Kim',skill:1.08},{name:'Dale',skill:.92},{name:'Marisol',skill:1.0}];
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const IN=0.0254;
export function createTournament({seed=1,rivals=RIVALS,spots=[]}={}){
 const random=rng(seed);
 return {seed,random,elapsed:0,over:false,closed:false,casts0:0,casts:0,player:{name:'You',fish:[]},
  rivals:rivals.map((r,i)=>({name:r.name,skill:r.skill,fish:[],spot:null,rig:1,replanAt:0,castClock:2+i*3,lastCatch:null})),spots,log:[]};
}
// best five by length, total inches
export function bestFive(fish){return fish.slice().sort((a,b)=>b.lengthIn-a.lengthIn).slice(0,LIMIT);}
export function totalInches(fish){return +bestFive(fish).reduce((s,f)=>s+f.lengthIn,0).toFixed(1);}
export function isBass(species){return BASS.has(species);}
// the player's fish comes from the real sim; only bass count, and only the best five stay on the board
export function recordPlayerCatch(t,c){if(t.closed||!isBass(c.species))return false;t.player.fish.push({species:c.species,lengthIn:+(+c.lengthIn).toFixed(1),at:t.elapsed});t.log.push({t:+t.elapsed.toFixed(0),who:'You',lengthIn:c.lengthIn,species:c.species});return true;}
// a rival re-plans like Ray: best (spot, rig) by the planner's score for bass, with a little noise
export function rivalPlan(t,rival,{hour=7,sunrise=6.5,sunset=19.5,cond=null,lowLight=true}={}){
 let best=null,bv=-1;const bassOnly={largemouth:SPECIES.largemouth,smallmouth:SPECIES.smallmouth};
 for(const s of t.spots){for(let i=0;i<3;i++){const lure=LURES[RIGS[i].lure];const sc=scoreRig(s.type,RIGS[i],lure,{hour,sunrise,sunset,species:bassOnly,lowLight,cond});const taken=t.rivals.filter(o=>o!==rival&&o.spot===s).length;const v=sc.value*(1+(t.random()-.5)*.3)*(1-.4*taken);if(v>bv){bv=v;best={spot:s,rig:i,value:v};}}}
 rival.spot=best?best.spot:null;rival.rig=best?best.rig:1;rival.value=best?best.value:0;return best;
}
// per-second rival step: casts at their own pace, a bass now and then, with a length from the species' own distribution bent by skill
export function stepRivals(t,dt,env){
 const out=[];if(t.closed)return out;
 for(const r of t.rivals){
  if(t.elapsed>=r.replanAt){rivalPlan(t,r,env);r.replanAt=t.elapsed+240+t.random()*120;if(r.spot)out.push({who:r.name,type:'move',spot:r.spot.type});}
  r.castClock-=dt;if(r.castClock>0)continue;r.castClock=25+t.random()*20;
  // the chance a cast turns into a landed bass: the planner's value for the spot, normalised, times skill
  const p=Math.min(.35,(r.value||0)/60*.16*r.skill);
  if(t.random()<p){const sp=t.random()<.75?'largemouth':'smallmouth';const [l0,l1]=SPECIES[sp].sizeRange;const L=l0+Math.pow(t.random(),1.6/r.skill)*(l1-l0);const lengthIn=+(L/IN).toFixed(1);
   r.fish.push({species:sp,lengthIn,at:t.elapsed});r.lastCatch={species:sp,lengthIn,spot:r.spot?r.spot.type:'?'};t.log.push({t:+t.elapsed.toFixed(0),who:r.name,lengthIn,species:sp});out.push({who:r.name,type:'catch',species:sp,lengthIn,spot:r.spot?r.spot.type:'?'});}
 }
 return out;
}
export function tick(t,dt){if(t.over)return false;t.elapsed+=dt;if(t.elapsed>=TOURNEY_SECONDS){t.elapsed=TOURNEY_SECONDS;t.over=true;return true;}return false;}
export function close(t){t.over=true;t.closed=true;return t;}
export function remaining(t){return Math.max(0,TOURNEY_SECONDS-t.elapsed);}
// standings: everyone by total inches, ties by the biggest fish
export function standings(t){
 const rows=[{name:'You',fish:t.player.fish},...t.rivals.map(r=>({name:r.name,fish:r.fish}))].map(x=>({name:x.name,count:Math.min(LIMIT,x.fish.length),total:totalInches(x.fish),big:x.fish.length?Math.max(...x.fish.map(f=>f.lengthIn)):0}));
 rows.sort((a,b)=>b.total-a.total||b.big-a.big);return rows.map((r,i)=>({...r,place:i+1}));
}
export function playerPlace(t){return standings(t).find(r=>r.name==='You').place;}
export function ordinal(n){return n+(n===1?'st':n===2?'nd':n===3?'rd':'th');}
export function summary(t){const st=standings(t);const me=st.find(r=>r.name==='You');const leader=st[0];return `${me.total} in · ${me.count} bass · ${ordinal(me.place)} of ${st.length}${leader.name!=='You'?' · '+leader.name+' leads with '+leader.total+' in':''}`;}
export function boardScore(t){return Math.round(totalInches(t.player.fish)*10);}
export function boardNamespace(key){return `first-light-bigbass-${key}`;}
