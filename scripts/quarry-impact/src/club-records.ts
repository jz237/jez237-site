import {CLUB_SERIES,clubSeries,clubStandings,readClubCup,type ClubCupState,type ClubSeriesId} from './club-cup';
import {isAIDifficulty,readAIDifficulty,type AIDifficulty} from './ai-difficulty';
import {CLUB_KINDS} from './club-cup';
import type {CarKind} from './rules';

export const CLUB_RECORDS_KEY='quarry-impact-championship-records-v1';
export type ClubRecord=Readonly<{series:ClubSeriesId;difficulty:AIDifficulty;place:number;points:number;wins:number;kind:CarKind}>;
export type ClubRecords=Readonly<{version:1;best:readonly ClubRecord[]}>;
/** One personal best per series/difficulty. Finishing or reloading twice cannot
 * add rewards or inflate counts. Original v1 cup saves remain valid entries. */
export function readClubRecords(text?:string|null):ClubRecords{
 const empty:ClubRecords={version:1,best:[]};
 if(!text||text.length>10000)return empty;
 try{
  const v=JSON.parse(text);if(v?.version!==1||!Array.isArray(v.best)||v.best.length>12)return empty;
  const keys=new Set<string>(),best:ClubRecord[]=[];
  for(const r of v.best){
   if(!r||!CLUB_SERIES.some(s=>s.id===r.series)||!isAIDifficulty(r.difficulty)||!CLUB_KINDS.includes(r.kind))return empty;
   const rounds=clubSeries(r).rounds.length,key=r.series+':'+r.difficulty;
   if(keys.has(key)||!Number.isInteger(r.place)||r.place<1||r.place>11||!Number.isInteger(r.points)||r.points<0||r.points>25*rounds||!Number.isInteger(r.wins)||r.wins<0||r.wins>rounds)return empty;
   keys.add(key);best.push({series:r.series,difficulty:r.difficulty,place:r.place,points:r.points,wins:r.wins,kind:r.kind});
  }
  return {version:1,best};
 }catch{return empty;}
}
export function recordClubFinish(records:ClubRecords,cup:ClubCupState):ClubRecords{
 const state=readClubCup(JSON.stringify(cup));if(!state||state.phase!=='complete')return records;
 const player=clubStandings(state).find(r=>r.slot===0)!,series=clubSeries(state).id,difficulty=readAIDifficulty(state.difficulty);
 const candidate:ClubRecord={series,difficulty,place:player.place,points:player.points,wins:player.wins,kind:player.kind};
 const best=[...records.best],index=best.findIndex(r=>r.series===series&&r.difficulty===difficulty),prior=best[index];
 if(prior&&(prior.place<candidate.place||prior.place===candidate.place&&(prior.points>candidate.points||prior.points===candidate.points&&prior.wins>=candidate.wins)))return records;
 if(index<0)best.push(candidate);else best[index]=candidate;
 return {version:1,best};
}
