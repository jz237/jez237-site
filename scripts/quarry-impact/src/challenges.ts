import type {CarKind,Mode} from './rules';
import type {RunStats} from './session-telemetry';
import {COURSE_NAMES,resolveCourseId,type CourseId} from './course-id';
export type Discipline='racing'|'impact'|'stunts';
export type ChallengeMetric='time'|'position'|'damage'|'knockouts'|'condition'|'drift'|'distance'|'speed'|'airtime'|'combo';
export type Challenge={id:string;title:string;description:string;discipline:Discipline;mode:Mode;car:CarKind;metric:ChallengeMetric;limit:number;medals:[number,number,number];laps?:number;minHealth?:number;minDamage?:number;traffic?:boolean;course?:CourseId};
const race=(id:string,title:string,car:CarKind,laps:number,medals:[number,number,number],minHealth=0):Challenge=>({id,title,car,laps,medals,metric:'time',mode:'race',discipline:'racing',limit:medals[0],minHealth,description:`Finish ${laps} ${laps===1?'lap':'laps'}${minHealth?` with at least ${minHealth}% condition`:''}. No recoveries.`});
const event=(id:string,title:string,car:CarKind,metric:Exclude<ChallengeMetric,'time'|'position'>,limit:number,medals:[number,number,number],description:string):Challenge=>({id,title,car,metric,limit,medals,description,mode:['damage','knockouts','condition'].includes(metric)?'derby':'playground',discipline:['damage','knockouts','condition'].includes(metric)?'impact':'stunts',traffic:false,...(metric==='condition'?{minDamage:15}:{})});
export const CHALLENGES:readonly Challenge[]=[
  race('first-lap','First lap','coupe',1,[110,85,65]),
  race('hatch-sprint','Pocket rocket','hatch',1,[110,82,62]),
  race('sedan-sprint','Heavy metal sprint','sedan',1,[115,88,68]),
  race('double-duty','Double duty','coupe',2,[220,170,130]),
  race('hatch-double','Small car, long fight','hatch',2,[220,165,125]),
  race('three-lap','The long way home','sedan',3,[330,265,210]),
  race('clean-coupe','Bring it home','coupe',1,[130,95,75],75),
  race('clean-hatch','Handle with care','hatch',2,[260,200,160],65),
  {id:'podium',title:'Podium hunter',car:'sedan',laps:2,medals:[3,2,1],metric:'position',mode:'race',discipline:'racing',limit:260,description:'Finish two laps on the podium. Gold requires first place. No recoveries.'},
  {id:'champion',title:'Quarry champion',car:'coupe',laps:3,medals:[3,2,1],metric:'position',mode:'race',discipline:'racing',limit:350,minHealth:20,description:'Finish three laps on the podium with at least 20% condition.'},
  event('first-contact','First contact','sedan','damage',60,[30,65,100],'Deal damage to opponents in a one-minute derby.'),
  event('coupe-impact','V8 punch','coupe','damage',90,[70,130,200],'Use the coupe to deliver sustained damage. Armor and overkill do not inflate the score.'),
  event('hatch-impact','Punch above your weight','hatch','damage',90,[60,115,180],'Keep the hatch moving and damage heavier opponents.'),
  event('heavy-impact','Heavy hitter','sedan','damage',120,[100,190,290],'Chain high-speed intercepts across a two-minute derby.'),
  event('wreck-one','Final blow','sedan','knockouts',120,[1,2,3],'Deliver the final impact to knock out opponents.'),
  event('wreck-coupe','Wrecking crew','coupe','knockouts',150,[1,2,4],'Finish weakened opponents without wasting hits on wrecks.'),
  event('wreck-hatch','Giant killer','hatch','knockouts',150,[1,2,3],'Take down larger cars with the lightweight hatch.'),
  event('survivor','Survivor','sedan','condition',45,[20,45,70],'Survive 45 seconds with condition remaining. Deal at least 15 damage to qualify.'),
  event('steel-nerves','Nerves of steel','coupe','condition',75,[15,35,60],'Stay alive for 75 seconds and deal at least 15 damage.'),
  event('last-light','Lightweight endurance','hatch','condition',90,[10,30,55],'Protect the hatch for 90 seconds while dealing at least 15 damage.'),
  event('first-drift','Sideways introduction','coupe','drift',60,[25,70,130],'Accumulate controlled drift distance above 25 km/h. Ground contact is required.'),
  event('long-drift','Gravel artist','coupe','drift',90,[90,180,300],'Link sustained drifts across the quarry floor.'),
  event('hatch-drift','Four-wheel flourish','hatch','drift',90,[60,130,220],'Use the handbrake to rotate the all-wheel-drive hatch.'),
  event('speed-coupe','V8 velocity','coupe','speed',75,[90,110,125],'Reach a measured ground speed. Use the circuit, not wheelspin.'),
  event('speed-sedan','Express service','sedan','speed',75,[85,105,120],'Find a clear line and build speed in the sedan.'),
  event('mile-maker','Cover ground','hatch','distance',90,[600,950,1300],'Drive as far as possible in 90 seconds. Airborne travel does not count.'),
  event('distance-sedan','Endurance shakedown','sedan','distance',120,[800,1300,1800],'Keep momentum for two minutes and explore the whole quarry.'),
  event('air-coupe','Flight school','coupe','airtime',120,[.6,1.5,3],'Use the playground ramps and land jumps. Tiny bumps and unfinished falls do not count.'),
  event('air-hatch','Light air','hatch','airtime',120,[.6,1.5,3],'Accumulate landed airtime in the hatch.'),
  event('all-rounder','Quarry all-rounder','coupe','combo',120,[100,240,400],'Combine drift distance and landed jumps: one point per drift metre, 60 per airborne second.'),
  event('bramble-roam','V8 ground tour','muscle','distance',60,[250,500,750],'Cover ground in the stock Bramble for one minute. Keep it moving; airborne travel does not count.'),
  {...race('millhaven-haul','Estate endurance','wagon',2,[190,125,95],35),course:'ironfield-figure-eight-v1'},
  event('utility-impact','Utility work','utility','damage',60,[25,45,60],'Deliver actual opponent damage in a one-minute stock Utility derby. Keep room for another run-up.'),
  {...race('rook-ironfield','Small circuit, big heart','compact',1,[100,65,47]),course:'ironfield-figure-eight-v1'},
  event('carrier-survival','Keep the load moving','van','condition',45,[20,40,60],'Survive 45 seconds in the stock Carrier with condition remaining. Deal at least 15 damage to qualify.'),
  {...race('tern-ironfield','Tern at the crossing','tern',1,[95,62,45]),course:'ironfield-figure-eight-v1'},
  race('marten-home','Rear-engine return','marten',1,[100,65,43],60),
  event('ravine-flight','Ravine flight school','buggy','airtime',120,[.5,.7,.8],'Find a quarry ramp and land the stock Ravine. Only significant jumps with a living landing count.'),
  {...race('shuttle-cinderbank','Last bus around','shuttle',2,[150,100,78]),course:'cinderbank-oval-v1'},
  {...race('tern-bracken','Front-wheel trail','tern',1,[115,72,50]),course:'bracken-rallycross-v1'},
  {...race('ravine-redbank','Dirt stadium dash','buggy',1,[100,65,40]),course:'redbank-jump-v1'},
  {...race('marten-ashford','Rear-engine precision','marten',1,[125,80,55],40),course:'ashford-autodrome-v1'},
  {...race('shuttle-ironfield','Crossing service','shuttle',1,[110,70,50],40),course:'ironfield-figure-eight-v1'},
  {...race('bramble-ashford','V8 road endurance','muscle',2,[250,155,105],25),course:'ashford-autodrome-v1'},
  {...race('coupe-pinecrest','Ridge ascent','coupe',1,[150,95,68]),course:'pinecrest-ridge-v1'},
  {...race('buggy-pinecrest','Woodland runner','buggy',1,[150,95,68]),course:'pinecrest-ridge-v1'},
  {...race('shuttle-pinecrest','Uphill service','shuttle',2,[300,195,140],25),course:'pinecrest-ridge-v1'},
  {...race('regent-dockside','Dockside heavyweight','regent',1,[160,100,70]),course:'dockside-loop-v1'},
  {...race('carrier-dockside','Harbor double shift','van',2,[300,195,135],25),course:'dockside-loop-v1'},
  {...race('buggy-fairground','Fairground flyer','buggy',1,[150,95,65]),course:'fairground-scramble-v1'},
  {...race('coupe-merefield','Runway perimeter','coupe',1,[130,85,60]),course:'merefield-airfield-v1'},
  {...race('regent-millhaven','Timber heavyweight','regent',1,[160,100,65],35),course:'millhaven-rally-v1'},
  {...race('shuttle-millhaven','Mill shuttle endurance','shuttle',2,[320,200,135],25),course:'millhaven-rally-v1'},
];
/** Only circuit challenges select another venue; the arena and ramps stay at Quarry. */
export const challengeCourse=(c:Challenge):CourseId=>c.mode==='race'?resolveCourseId(c.course):'quarry-v1';
export const challengeVenueName=(c:Challenge)=>COURSE_NAMES[challengeCourse(c)];
export function challengeValue(c:Challenge,r:RunStats){
  switch(c.metric){case'time':return r.seconds;case'position':return r.rank;case'damage':return r.damage;case'knockouts':return r.knockouts;case'condition':return r.health;case'drift':return r.drift;case'distance':return r.distance;case'speed':return r.maxSpeed*3.6;case'airtime':return r.airtime;case'combo':return r.drift+r.airtime*60;}
}
export const lowerIsBetter=(c:Challenge)=>c.metric==='time'||c.metric==='position';
export function challengeMedal(c:Challenge,r:RunStats):number {
  if(!r.completed||r.recovered||r.health<(c.minHealth??0)||r.damage<(c.minDamage??0))return 0;
  if(c.mode==='race'&&(!r.finished||r.checkpoints<(c.laps??3)*24||r.seconds>c.limit+.001))return 0;
  if(c.metric==='position'&&(!Number.isInteger(r.rank)||r.rank<1))return 0;
  if(c.metric==='condition'&&(r.seconds<c.limit-.05||r.health<=0))return 0;
  const value=challengeValue(c,r);if(!Number.isFinite(value))return 0;
  return c.medals.reduce((medal,threshold,i)=> (lowerIsBetter(c)?value<=threshold:value>=threshold)?i+1:medal,0);
}
export function formatChallengeValue(c:Challenge,value:number){
  if(c.metric==='time')return value.toFixed(1)+' s';
  if(c.metric==='position')return '#'+Math.round(value);
  if(c.metric==='condition')return Math.round(value)+'%';
  if(c.metric==='speed')return Math.round(value)+' km/h';
  if(c.metric==='airtime')return value.toFixed(1)+' s';
  if(c.metric==='drift'||c.metric==='distance')return Math.round(value)+' m';
  return Math.round(value).toString();
}
