import type {RunStats} from './session-telemetry';
import {dailyStreak} from './daily-record';
/** Long-term goals. Progress lives in profile.journey (cars driven, circuits raced, arenas
 * fought in, takedowns) and unlocked badges in profile.badges; both are optional so older
 * saves are untouched until the first banked event. */
export type Journey={kinds:string[];courses:string[];arenas:string[];takedowns:number};
type ProfileLike={events:number;wins:number;distance:number;knockouts:number;challenges:Record<string,{medal:number}>;daily?:Record<string,{medal:number}>;career?:{podiums?:Partial<Record<string,number>>};badges?:string[];journey?:Journey};
export type RunContext={run:RunStats;kind:string;mode:string;course?:string;arena?:string;takedowns?:number;daily?:boolean;dailyMedal?:number};
export type Achievement={id:string;name:string;description:string;done:(p:ProfileLike,c:RunContext|null,all:{kinds:number;courses:number;arenas:number})=>boolean};
const golds=(p:ProfileLike)=>Object.values(p.challenges).filter(r=>r.medal>=3).length;
export const ACHIEVEMENTS:readonly Achievement[]=[
 {id:'chequered',name:'Chequered',description:'Finish a race.',done:(p,c)=>!!c&&c.mode==='race'&&c.run.finished},
 {id:'top-step',name:'Top step',description:'Win a race.',done:(p,c)=>!!c&&c.mode==='race'&&c.run.finished&&(c.run.won??c.run.rank===1)},
 {id:'last-standing',name:'Last one standing',description:'Win a demolition derby.',done:(p,c)=>!!c&&c.mode==='derby'&&!!c.run.won},
 {id:'held-together',name:'Held together with tape',description:'Finish a race or survive a derby with 10% condition or less.',done:(p,c)=>!!c&&c.run.completed&&c.run.health>0&&c.run.health<=10&&(c.mode==='derby'||c.run.finished)},
 {id:'first-takedown',name:'First takedown',description:'Wreck an opponent in a race.',done:p=>(p.journey?.takedowns??0)>=1},
 {id:'scrap-merchant',name:'Scrap merchant',description:'Score 5 knockouts in total.',done:p=>p.knockouts>=5},
 {id:'breakers-yard',name:'Breaker’s yard',description:'Score 50 knockouts in total.',done:p=>p.knockouts>=50},
 {id:'collector',name:'Collector',description:'Drive 10 different cars.',done:p=>(p.journey?.kinds.length??0)>=10},
 {id:'full-garage',name:'Full garage',description:'Drive every car in the roster.',done:(p,c,all)=>(p.journey?.kinds.length??0)>=all.kinds},
 {id:'grand-tour',name:'Grand tour',description:'Race on 10 different circuits.',done:p=>(p.journey?.courses.length??0)>=10},
 {id:'every-road',name:'Every road',description:'Race on every circuit.',done:(p,c,all)=>(p.journey?.courses.length??0)>=all.courses},
 {id:'arena-regular',name:'Arena regular',description:'Fight a derby in every arena.',done:(p,c,all)=>(p.journey?.arenas.length??0)>=all.arenas},
 {id:'daily-driver',name:'Daily driver',description:'Win a medal in a Daily Event.',done:p=>Object.values(p.daily??{}).some(r=>r.medal>0)},
 {id:'habit-forming',name:'Habit forming',description:'Reach a 3-day Daily Event medal streak.',done:p=>dailyStreak(p.daily as never)>=3},
 {id:'goldsmith',name:'Goldsmith',description:'Win 10 gold challenge medals.',done:p=>golds(p)>=10},
 {id:'long-haul',name:'Long haul',description:'Drive 500 km in total.',done:p=>p.distance>=500000},
 {id:'silverware',name:'Silverware',description:'Earn a podium in a career championship.',done:p=>Object.values(p.career?.podiums??{}).some(v=>(v??0)>0)},
];
const ids=new Set(ACHIEVEMENTS.map(a=>a.id));
const strings=(v:unknown,max:number)=>Array.isArray(v)?[...new Set(v.filter((s):s is string=>typeof s==='string'&&s.length>0&&s.length<64))].slice(0,max):[];
export function normalizeBadges(v:unknown){const list=strings(v,ACHIEVEMENTS.length).filter(id=>ids.has(id));return list.length?list:undefined;}
export function normalizeJourney(v:unknown):Journey|undefined{
 if(!v||typeof v!=='object'||Array.isArray(v))return undefined;const o=v as Record<string,unknown>;
 return{kinds:strings(o.kinds,200),courses:strings(o.courses,200),arenas:strings(o.arenas,100),takedowns:typeof o.takedowns==='number'&&Number.isFinite(o.takedowns)?Math.max(0,Math.min(1e7,Math.floor(o.takedowns))):0};
}
/** Record the banked event and unlock anything newly earned (in list order). Returns the new badges. */
export function bankAchievements(profile:ProfileLike,context:RunContext|null,all:{kinds:number;courses:number;arenas:number}):Achievement[]{
 if(context&&(context.run.completed||context.run.distance>10)){
  const j=profile.journey??{kinds:[],courses:[],arenas:[],takedowns:0};
  const add=(list:string[],v:string|undefined)=>v&&!list.includes(v)?[...list,v]:list;
  profile.journey={kinds:add(j.kinds,context.kind),courses:context.mode==='race'?add(j.courses,context.course):j.courses,arenas:context.mode==='derby'?add(j.arenas,context.arena):j.arenas,takedowns:Math.min(1e7,j.takedowns+Math.max(0,Math.floor(context.takedowns??0)))};
 }
 const have=new Set(profile.badges??[]),fresh:Achievement[]=[];
 for(const a of ACHIEVEMENTS)if(!have.has(a.id)&&a.done(profile,context,all)){have.add(a.id);fresh.push(a);}
 if(fresh.length)profile.badges=ACHIEVEMENTS.filter(a=>have.has(a.id)).map(a=>a.id);
 return fresh;
}
