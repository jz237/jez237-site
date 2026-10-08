import {isGridLineup,type GridLineup} from './grid-rules';
import {CLUB_SERIES,isClubField,clubSeries,clubStandings,readClubCup,type ClubCupState,type ClubSeriesId} from './club-cup';
import {isAIDifficulty,readAIDifficulty,type AIDifficulty} from './ai-difficulty';
import {CAR_KINDS,isCarKind} from './rules';
import type {CarKind} from './rules';

export const CLUB_RECORDS_KEY='quarry-impact-championship-records-v1';
export type ClubRecord=Readonly<{series:ClubSeriesId;difficulty:AIDifficulty;place:number;points:number;wins:number;kind:CarKind;lineup?:GridLineup;field?:number}>;
export type ClubRecords=Readonly<{version:1;best:readonly ClubRecord[]}>;
export function clubRecordKey(series:ClubSeriesId,difficulty:AIDifficulty,lineup:GridLineup|undefined,kind:CarKind,field=11){
 return `${series}:${difficulty}`+(!lineup||lineup==='mixed'?'':`:${lineup}:${kind}`)+(field===11?'':`:field-${field}`);
}
/** Mixed fields retain one personal best per series/difficulty/field size. Restricted
 * fields separate each selected car and lineup rule as well. Finishing or reloading twice cannot
 * add rewards or inflate counts. Original v1 cup saves remain valid entries. */
export function readClubRecords(text?:string|null):ClubRecords{
 const empty:ClubRecords={version:1,best:[]};
 if(!text||text.length>3_000_000)return empty;
 try{
  const v=JSON.parse(text);if(v?.version!==1||!Array.isArray(v.best)||v.best.length>CLUB_SERIES.length*3*(1+3*CAR_KINDS.length)*23)return empty;
  const keys=new Set<string>(),best:ClubRecord[]=[];
  for(const r of v.best){
   if(!r||!CLUB_SERIES.some(s=>s.id===r.series)||!isAIDifficulty(r.difficulty)||!isCarKind(r.kind)||r.lineup!==undefined&&!isGridLineup(r.lineup)||r.field!==undefined&&!isClubField(r.field))return empty;
   const rounds=clubSeries(r).rounds.length,key=clubRecordKey(r.series,r.difficulty,r.lineup,r.kind,r.field);
   if(keys.has(key)||!Number.isInteger(r.place)||r.place<1||r.place>(r.field??11)||!Number.isInteger(r.points)||r.points<0||r.points>25*rounds||!Number.isInteger(r.wins)||r.wins<0||r.wins>rounds)return empty;
   keys.add(key);best.push({series:r.series,difficulty:r.difficulty,place:r.place,points:r.points,wins:r.wins,kind:r.kind,...(r.lineup&&r.lineup!=='mixed'?{lineup:r.lineup}:{}),...(r.field!==undefined&&r.field!==11?{field:r.field}:{})});
  }
  return {version:1,best};
 }catch{return empty;}
}
export function recordClubFinish(records:ClubRecords,cup:ClubCupState):ClubRecords{
 const state=readClubCup(JSON.stringify(cup));if(!state||state.phase!=='complete')return records;
 const player=clubStandings(state).find(r=>r.slot===0)!,series=clubSeries(state).id,difficulty=readAIDifficulty(state.difficulty);
 const candidate:ClubRecord={series,difficulty,place:player.place,points:player.points,wins:player.wins,kind:player.kind,...(state.lineup&&state.lineup!=='mixed'?{lineup:state.lineup}:{}),...(state.field!==undefined&&state.field!==11?{field:state.field}:{})};
 const best=[...records.best],index=best.findIndex(r=>clubRecordKey(r.series,r.difficulty,r.lineup,r.kind,r.field)===clubRecordKey(series,difficulty,candidate.lineup,candidate.kind,candidate.field)),prior=best[index];
 if(prior&&(prior.place<candidate.place||prior.place===candidate.place&&(prior.points>candidate.points||prior.points===candidate.points&&prior.wins>=candidate.wins)))return records;
 if(index<0)best.push(candidate);else best[index]=candidate;
 return {version:1,best};
}
