import {CAR_KINDS,DEFINITIONS,type CarKind} from './rules';
import {COURSE_NAMES,type CourseId} from './course-id';
import {ARENA_NAMES,type ArenaId} from './arena-id';
import {getRaceCourse} from './race-course';
import type {Challenge} from './challenges';
import {DAILY_PREFIX,dailyKey,isDailyKey} from './daily-record';
import type {LightingMood} from './lighting-presets';
/** One fixed event per local calendar day: the same car, venue and rules for everyone on
 * that date, a medal to chase and a streak for coming back. Records live in profile.daily. */
function seeded(key:string){let h=2166136261;for(const ch of key){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return()=>{h=(Math.imul(h^(h>>>15),2246822507)+0x6d2b79f5)>>>0;h^=h>>>13;return (h>>>0)/4294967296;};}
const pick=<T,>(r:()=>number,list:readonly T[])=>list[Math.floor(r()*list.length)%list.length];
const RACE_TITLES=['Morning run','Lunchtime scramble','Afternoon dash','Twilight sprint','Sunday drive','Paper round'];
const DERBY_TITLES:Record<'damage'|'knockouts'|'condition',string[]>={damage:['Panel beater','Dent quota','Pay the bodyshop'],knockouts:['Last orders','Scrap collection','Lights out'],condition:['Keep it in one piece','Still standing','Brace for impact']};
/** The day's event. Medal times scale with circuit length, laps and the car's power to weight,
 * using the same medal-to-AI-lap ratios as the fixed challenges. */
export function dailyChallenge(key=dailyKey()):Challenge{
 if(!isDailyKey(key))throw Error('Invalid daily key');
 const r=seeded('quarry-daily:'+key),car=pick(r,CAR_KINDS) as CarKind,spec=DEFINITIONS[car],id=DAILY_PREFIX+key;
 if(r()<.62){
  const course=pick(r,Object.keys(COURSE_NAMES)) as CourseId,direction=r()<.4?'reverse' as const:'forward' as const,laps=r()<.3?2:1,minHealth=pick(r,[25,35,40,50]);
  const power=Math.max(.85,Math.min(1.3,Math.sqrt(7/(spec.force/spec.mass)))),lap=getRaceCourse(course).length/18.5*power;
  const round5=(v:number)=>Math.round(v*laps/5)*5,medals:[number,number,number]=[round5(lap*2.934),round5(lap*2.121),round5(lap*1.616)];
  return{id,title:`${pick(r,RACE_TITLES)}: ${COURSE_NAMES[course]}`,car,laps,medals,metric:'time',mode:'race',discipline:'racing',limit:medals[0],minHealth,course,...(direction==='reverse'?{direction}:{}),
   description:`Today's event: ${laps} ${laps===1?'lap':'laps'}${direction==='reverse'?' in reverse':''} of ${COURSE_NAMES[course]} in the ${spec.name}, finishing with at least ${minHealth}% condition. No recoveries. A new event starts at midnight.`};
 }
 const arena=pick(r,Object.keys(ARENA_NAMES)) as ArenaId,metric=pick(r,['damage','knockouts','condition'] as const);
 const tiers={damage:{limit:90,medals:[70,130,200] as [number,number,number],text:'Deal as much damage as you can in 90 seconds.'},knockouts:{limit:150,medals:[1,2,4] as [number,number,number],text:'Score the final blow on as many opponents as you can in two and a half minutes.'},condition:{limit:75,medals:[15,35,60] as [number,number,number],text:'Survive 75 seconds with as much condition as you can keep, dealing at least 15 damage.'}}[metric];
 return{id,title:`${pick(r,DERBY_TITLES[metric])}: ${ARENA_NAMES[arena]}`,car,metric,limit:tiers.limit,medals:tiers.medals,mode:'derby',discipline:'impact',traffic:false,arena,...(metric==='condition'?{minDamage:15}:{}),
  description:`Today's event in ${ARENA_NAMES[arena]} with the ${spec.name}. ${tiers.text} A new event starts at midnight.`};
}
/** Each day also has its own light: mostly clear, sometimes a warm afternoon, overcast or a dusk run with headlights. */
export function dailyLighting(key=dailyKey()):LightingMood{
 if(!isDailyKey(key))throw Error('Invalid daily key');
 const r=seeded('quarry-daily-light:'+key)(),moods:LightingMood[]=['midday','midday','afternoon','overcast','dusk','dusk'];
 return moods[Math.floor(r*moods.length)%moods.length];
}
