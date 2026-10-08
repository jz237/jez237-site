import {normalizeCareerUnlocks,normalizeCareerPodiums} from './career';
import { CHALLENGES, challengeMedal, challengeValue, lowerIsBetter, type Challenge, type Discipline } from './challenges';
import type {RunStats} from './session-telemetry';
export const PROFILE_KEY='quarry-impact-driver-v1';
export type ChallengeRecord={medal:number;best:number|null;attempts:number};
export type DriverProfile={version:1;career?:{unlocked:string[];podiums?:Partial<Record<import('./club-cup').ClubSeriesId,number>>};xp:Record<Discipline,number>;events:number;wins:number;distance:number;damage:number;knockouts:number;challenges:Record<string,ChallengeRecord>;settled:string[]};
export type Award={xp:Record<Discipline,number>;medal:number;improved:boolean;duplicate:boolean;qualified:boolean};
const num=(v:unknown,max=1e9)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
const obj=(v:unknown):Record<string,any>=>v&&typeof v==='object'&&!Array.isArray(v)?v as any:{};
export function readProfile(json?:string|null):DriverProfile {
  let raw:Record<string,any>={};try{const p=obj(JSON.parse(json??'{}'));if(p.version===1)raw=p;}catch{}
  const xp=obj(raw.xp),records=obj(raw.challenges);
  const profile:DriverProfile={version:1,xp:{racing:Math.floor(num(xp.racing)),impact:Math.floor(num(xp.impact)),stunts:Math.floor(num(xp.stunts))},events:Math.floor(num(raw.events)),wins:Math.floor(Math.min(num(raw.wins),num(raw.events))),distance:num(raw.distance),damage:num(raw.damage),knockouts:Math.floor(num(raw.knockouts)),
    challenges:Object.fromEntries(CHALLENGES.flatMap(c=>{const r=obj(records[c.id]);return Object.keys(r).length?[[c.id,{medal:Math.floor(num(r.medal,3)),best:typeof r.best==='number'&&Number.isFinite(r.best)&&r.best>=0?r.best:null,attempts:Math.floor(num(r.attempts))}]]:[];})),
    settled:Array.isArray(raw.settled)?raw.settled.filter((id:unknown)=>typeof id==='string'&&id.length<100).slice(-256):[]};
  if(raw.career!==undefined){const career=obj(raw.career);profile.career={unlocked:[],...(career.podiums!==undefined?{podiums:normalizeCareerPodiums(career.podiums)}:{})};profile.career.unlocked=normalizeCareerUnlocks(career.unlocked,profile);}
  return profile;
}
export function levelFor(xp:number){
  const level=Math.floor((Math.sqrt(1+8*num(xp)/150)-1)/2)+1;
  const start=150*(level-1)*level/2,next=150*level*(level+1)/2;
  return {level,earned:Math.floor(num(xp)-start),required:next-start,fraction:(num(xp)-start)/(next-start)};
}
export const DISCIPLINES:Record<Discipline,{label:string;description:string}>={
  racing:{label:'RACER',description:'Distance, checkpoints and race finishes'},
  impact:{label:'WRECKER',description:'Actual opponent damage and knockouts'},
  stunts:{label:'SHOWMAN',description:'Controlled drifts and landed airtime'},
};
/** Called exactly once per finalized run. Keep event IDs in the save so duplicate
 * result callbacks and retries cannot award the same run twice. */
export function settleRun(profile:DriverProfile,id:string,run:RunStats,challenge?:Challenge):Award {
  const award:Award={xp:{racing:0,impact:0,stunts:0},medal:0,improved:false,duplicate:profile.settled.includes(id),qualified:false};
  if(award.duplicate)return award;
  profile.settled.push(id);profile.settled=profile.settled.slice(-256);
  const active=num(run.seconds,86400)>=3&&(num(run.distance)>10||num(run.damage)>1||num(run.drift)>1);
  if(!active){
    if(challenge&&run.completed){
      const old=profile.challenges[challenge.id]??{medal:0,best:null,attempts:0};
      profile.challenges[challenge.id]={...old,attempts:old.attempts+1};
    }
    return award;
  }
  award.qualified=true;
  award.xp.racing=Math.floor(num(run.distance,1e6)/12+num(run.checkpoints,10000)*4+(run.finished?100:0));
  award.xp.impact=Math.floor(num(run.damage,10000)*3+num(run.knockouts,100)*60);
  award.xp.stunts=Math.floor(num(run.drift,1e6)*.6+num(run.airtime,1000)*35);
  if(challenge){
    const old=profile.challenges[challenge.id]??{medal:0,best:null,attempts:0};
    award.medal=challengeMedal(challenge,run);award.improved=award.medal>old.medal;
    const value=challengeValue(challenge,run),valid=award.medal>0;
    profile.challenges[challenge.id]={medal:Math.max(old.medal,award.medal),attempts:old.attempts+1,best:valid&&(old.best===null||(lowerIsBetter(challenge)?value<old.best:value>old.best))?value:old.best};
    award.xp[challenge.discipline]+=Math.max(0,award.medal-old.medal)*150;
  }
  for(const key of Object.keys(award.xp) as Discipline[]){award.xp[key]=Math.min(100000,award.xp[key]);profile.xp[key]=Math.min(1e9,profile.xp[key]+award.xp[key]);}
  profile.events+=run.completed?1:0;profile.wins+=run.completed&&(run.won??(run.rank===1&&run.health>0))?1:0;
  profile.distance=Math.min(1e9,profile.distance+num(run.distance,1e6));profile.damage=Math.min(1e9,profile.damage+num(run.damage,10000));profile.knockouts=Math.min(1e9,profile.knockouts+num(run.knockouts,100));
  return award;
}
