import {CHALLENGES,type Discipline} from './challenges';
import type {DriverProfile} from './progression';
export type CareerGroup={id:string;title:string;discipline:Discipline;description:string;cost:number;events:readonly string[]};
export const CAREER_GROUPS:readonly CareerGroup[]=[
 {id:'club-racing',title:'Club Racing',discipline:'racing',description:'Three stock machines. Learn the circuit and bring them home.',cost:0,events:['first-lap','hatch-sprint','sedan-sprint']},
 {id:'small-car-tour',title:'Small Car Tour',discipline:'racing',description:'Take the Rook and Tern through Ironfield, then protect the rear-engine Marten.',cost:3,events:['rook-ironfield','tern-ironfield','marten-home']},
 {id:'endurance-racing',title:'Endurance Racing',discipline:'racing',description:'Longer races, an estate at the crossing, and a three-lap podium fight.',cost:3,events:['double-duty','millhaven-haul','champion']},
 {id:'first-impacts',title:'First Impacts',discipline:'impact',description:'Earn your place through clean hits and active survival.',cost:0,events:['first-contact','hatch-impact','survivor']},
 {id:'heavy-duty',title:'Heavy Duty',discipline:'impact',description:'Put the Utility, Carrier and V8 coupe to work in the arena.',cost:3,events:['utility-impact','carrier-survival','coupe-impact']},
 {id:'wrecking-crew',title:'Wrecking Crew',discipline:'impact',description:'Finish weakened opponents and keep your own car running.',cost:3,events:['wreck-one','wreck-coupe','wreck-hatch']},
 {id:'open-road',title:'Open Road',discipline:'stunts',description:'Build speed, explore in the Bramble, and learn to hold a drift.',cost:0,events:['speed-coupe','bramble-roam','first-drift']},
 {id:'gravel-artists',title:'Gravel Artists',discipline:'stunts',description:'Link longer slides and carry momentum across the quarry.',cost:3,events:['long-drift','hatch-drift','distance-sedan']},
 {id:'flight-school',title:'Flight School',discipline:'stunts',description:'Land jumps in three different cars, including the open-frame Ravine.',cost:3,events:['air-coupe','air-hatch','ravine-flight']},
];
const eventIds=new Set(CAREER_GROUPS.flatMap(g=>g.events));
export const careerGroupFor=(id:string)=>CAREER_GROUPS.find(g=>g.events.includes(id));
export function careerEarned(profile:Pick<DriverProfile,'challenges'>){return [...eventIds].reduce((sum,id)=>sum+Math.max(0,Math.min(3,Math.floor(profile.challenges[id]?.medal??0))),0);}
/** Unlocks share the profile's atomic save. Medal points are derived, so repeated
 * callbacks, retries and old challenge results cannot mint duplicate currency. */
export function normalizeCareerUnlocks(value:unknown,profile:Pick<DriverProfile,'challenges'>):string[]{
 let available=careerEarned(profile);const unlocked:string[]=[];
 if(Array.isArray(value))for(const id of value.slice(0,64)){
  const group=CAREER_GROUPS.find(g=>g.id===id&&g.cost>0);
  if(!group||unlocked.includes(group.id)||available<group.cost)continue;
  available-=group.cost;unlocked.push(group.id);
 }
 return unlocked;
}
export function careerStatus(profile:DriverProfile){
 const purchased=normalizeCareerUnlocks(profile.career?.unlocked,profile),earned=careerEarned(profile);
 const open=CAREER_GROUPS.filter(g=>g.cost===0||purchased.includes(g.id));
 const spent=CAREER_GROUPS.filter(g=>purchased.includes(g.id)).reduce((n,g)=>n+g.cost,0);
 return {earned,spent,available:earned-spent,open:open.map(g=>g.id),completed:CAREER_GROUPS.filter(g=>g.events.every(id=>(profile.challenges[id]?.medal??0)>0)).length,medals:[...eventIds].filter(id=>(profile.challenges[id]?.medal??0)>0).length};
}
export function unlockCareerGroup(profile:DriverProfile,id:string):DriverProfile|null{
 const group=CAREER_GROUPS.find(g=>g.id===id),status=careerStatus(profile);
 if(!group||status.open.includes(id)||status.available<group.cost)return null;
 return {...profile,career:{unlocked:[...normalizeCareerUnlocks(profile.career?.unlocked,profile),id]}};
}
export function careerChallenge(profile:DriverProfile,id:string){
 const group=careerGroupFor(id);
 return group&&careerStatus(profile).open.includes(group.id)?CHALLENGES.find(c=>c.id===id):undefined;
}
