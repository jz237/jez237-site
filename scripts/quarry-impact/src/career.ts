import type {ClubRecords} from './club-records';
import type {ClubSeriesId} from './club-cup';
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
 {id:'county-tour',title:'County Tour',discipline:'racing',description:'A bus on the oval, a hatch on mixed surfaces, and a buggy in the dirt stadium.',cost:3,events:['shuttle-cinderbank','tern-bracken','ravine-redbank']},
 {id:'road-masters',title:'Road Masters',discipline:'racing',description:'Protect the Marten and Shuttle, then bring the Bramble through two technical laps.',cost:3,events:['marten-ashford','shuttle-ironfield','bramble-ashford']},
 {id:'ridge-runners',title:'Ridge Runners',discipline:'racing',description:'Climb Pinecrest in a coupe and buggy, then keep the Shuttle running for two laps.',cost:3,events:['coupe-pinecrest','buggy-pinecrest','shuttle-pinecrest']},
 {id:'harbor-weekend',title:'Harbor Weekend',discipline:'racing',description:'Run the Regent and Carrier around Dockside, then take the Ravine onto Fairground dirt.',cost:3,events:['regent-dockside','carrier-dockside','buggy-fairground']},
 {id:'airfield-timber',title:'Airfield & Timber',discipline:'racing',description:'Sprint around Merefield, protect the Regent at Millhaven, and finish a two-lap Shuttle run.',cost:3,events:['coupe-merefield','regent-millhaven','shuttle-millhaven']},
 {id:'banger-weekend',title:'Banger Weekend',discipline:'racing',description:'Race the Tern on clay, carry the Shuttle through the crossing and protect the Regent at Alderwick.',cost:3,events:['tern-fenwick','shuttle-fenwick','regent-alderwick']},
 {id:'stunt-park',title:'Stunt Park',discipline:'stunts',description:'Build approach speed, complete the loop and land the gap jump in the Ravine.',cost:3,events:['ravine-alderwick-speed','ravine-alderwick-loop','ravine-alderwick-gap']},
 {id:'freight-runners',title:'Freight Runners',discipline:'racing',description:'Learn the freight stations, choose open-yard shortcuts and follow changing dispatches.',cost:3,events:['carrier-rookvale','ravine-rookvale','regent-rookvale']},
 {id:'banked-racers',title:'Banked Racers',discipline:'racing',description:'Master Elmsworth banking, reverse the Shuttle and hold the Bramble together for two laps.',cost:3,events:['tern-elmsworth','shuttle-elmsworth','bramble-elmsworth']},
 {id:'canyon-crossers',title:'Canyon Crossers',discipline:'racing',description:'Cross the gravel crests, bring the Shuttle home in reverse and complete a heavyweight double lap.',cost:3,events:['ravine-sable','shuttle-sable','regent-sable']},
 {id:'heath-runners',title:'Heath Runners',discipline:'racing',description:'Find grip on Willowbank gravel, reverse the ridge and preserve the Bramble over two laps.',cost:3,events:['tern-willowbank','marten-willowbank','bramble-willowbank']},
 {id:'club-specialists',title:'Club Specialists',discipline:'racing',description:'Find asphalt grip in the Tern, reverse the Marten and complete a heavyweight two-lap run at Westmere.',cost:3,events:['tern-westmere','marten-westmere','regent-westmere']},
 {id:'ridge-crossers',title:'Ridge Crossers',discipline:'racing',description:'Carry the Ravine over Harrowstone crests, reverse the Shuttle and finish two laps in the Bramble.',cost:3,events:['ravine-harrowstone','shuttle-harrowstone','bramble-harrowstone']},
];
export const CAREER_SERIES:readonly ClubSeriesId[]=['club','sprint','tour','gauntlet','dirt','road-rally','woodland','county-weekender','airfield-rally','banger-weekend','demolition-tour','freight-speed','heath-canyon','club-ridge'];
export function normalizeCareerPodiums(value:unknown):Partial<Record<ClubSeriesId,number>>{
 const v=value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
 return Object.fromEntries(CAREER_SERIES.flatMap(id=>Number.isInteger(v[id])&&(v[id] as number)>=1&&(v[id] as number)<=3?[[id,v[id]]]:[]));
}
export function awardCareerPodiums(profile:DriverProfile,records:ClubRecords){
 const podiums=normalizeCareerPodiums(profile.career?.podiums);let gained=0;
 for(const r of records.best){if(!CAREER_SERIES.includes(r.series)||!Number.isFinite(r.points)||r.points<=0||!Number.isInteger(r.place)||r.place<1||r.place>3)continue;const medal=4-r.place,prior=podiums[r.series]??0;if(medal>prior){podiums[r.series]=medal;gained+=medal-prior;}}
 if(gained)profile.career={unlocked:profile.career?.unlocked??[],podiums};
 return gained;
}
const eventIds=new Set(CAREER_GROUPS.flatMap(g=>g.events));
export const careerGroupFor=(id:string)=>CAREER_GROUPS.find(g=>g.events.includes(id));
export function careerEarned(profile:Pick<DriverProfile,'challenges'|'career'>){return Object.values(normalizeCareerPodiums(profile.career?.podiums)).reduce((a,b)=>a+b,0)+[...eventIds].reduce((sum,id)=>sum+Math.max(0,Math.min(3,Math.floor(profile.challenges[id]?.medal??0))),0);}
/** Unlocks share the profile's atomic save. Medal points are derived, so repeated
 * callbacks, retries and old challenge results cannot mint duplicate currency. */
export function normalizeCareerUnlocks(value:unknown,profile:Pick<DriverProfile,'challenges'|'career'>):string[]{
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
 return {...profile,career:{...profile.career,unlocked:[...normalizeCareerUnlocks(profile.career?.unlocked,profile),id]}};
}
export function careerChallenge(profile:DriverProfile,id:string){
 const group=careerGroupFor(id);
 return group&&careerStatus(profile).open.includes(group.id)?CHALLENGES.find(c=>c.id===id):undefined;
}
