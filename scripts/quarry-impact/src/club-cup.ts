import {gridPool,isGridLineup,type GridLineup} from './grid-rules';
import {isCarKind,type CarKind,type Mode} from './rules';
import type {CourseId} from './course-id';
import {isAIDifficulty,type AIDifficulty} from './ai-difficulty';
import type {RunStats} from './session-telemetry';
import {settleRun,type Award,type DriverProfile} from './progression';

export const CLUB_CUP_KEY='quarry-impact-club-cup-v1';
/** Version 1 keeps its roster/order even if a later release adds more cars. */
export const CLUB_KINDS=Object.freeze(['coupe','sedan','hatch','muscle','wagon','utility','compact','van','tern','marten','buggy'] as const);
export const CLUB_FIELDS=Object.freeze(Array.from({length:23},(_,i)=>i+2));
export const isClubField=(value:unknown):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=2&&value<=24;
// Freeze new field rosters too: later vehicle additions must not rewrite saved cups.
const FIELD_KINDS=Object.freeze([...CLUB_KINDS,'shuttle'] as const);
export const CLUB_POINTS=Object.freeze([25,20,16,13,11,9,7,5,3,2,1] as const);
export type ClubRoundId='quarry-circuit'|'ironfield-circuit'|'quarry-survival'|'cinderbank-sprint'|'cinderbank-reverse'|'bracken-sprint'|'cinderbank-circuit'|'bracken-circuit'|'ironfield-opposing'|'quarry-opposing'|'bracken-reverse'|'quarry-finale'|'redbank-sprint'|'redbank-reverse'|'ashford-sprint'|'ashford-reverse'|'pinecrest-climb'|'pinecrest-return'|'dockside-sprint'|'dockside-return'|'fairground-sprint'|'fairground-return';
export type ClubRound=Readonly<{index:number;id:ClubRoundId;name:string;mode:Mode;course:CourseId;laps:number;duration:number;stock:true;direction?:'forward'|'reverse'|'opposing'}>;
export const CLUB_ROUNDS:readonly ClubRound[]=Object.freeze([
 Object.freeze({index:0,id:'quarry-circuit',name:'Quarry Circuit',mode:'race',course:'quarry-v1',laps:2,duration:0,stock:true} as const),
 Object.freeze({index:1,id:'ironfield-circuit',name:'Ironfield Raceway',mode:'race',course:'ironfield-figure-eight-v1',laps:2,duration:0,stock:true} as const),
 Object.freeze({index:2,id:'quarry-survival',name:'Quarry Survival',mode:'derby',course:'quarry-v1',laps:0,duration:90,stock:true} as const),
]);
export type ClubSeriesId='club'|'sprint'|'tour'|'gauntlet'|'dirt'|'road-rally'|'woodland'|'county-weekender';
export type ClubSeries=Readonly<{id:ClubSeriesId;name:string;description:string;rounds:readonly ClubRound[]}>;
const round=(index:number,id:ClubRoundId,name:string,course:CourseId,laps=1,direction:ClubRound['direction']='forward'):ClubRound=>Object.freeze({index,id,name,course,laps,direction,mode:'race',duration:0,stock:true});
export const CLUB_SERIES:readonly ClubSeries[]=Object.freeze([
 Object.freeze({id:'club',name:'Club Cup',description:'Two circuit races and a survival finale. The original three-round championship.',rounds:CLUB_ROUNDS}),
 Object.freeze({id:'sprint',name:'Sprint Series',description:'Three quick one-lap races, including a reverse oval and the Bracken rallycross finale.',rounds:Object.freeze([
  round(0,'cinderbank-sprint','Cinderbank Sprint','cinderbank-oval-v1'),
  round(1,'cinderbank-reverse','Cinderbank Reverse','cinderbank-oval-v1',1,'reverse'),
  round(2,'bracken-sprint','Bracken Sprint','bracken-rallycross-v1'),
 ])}),
 Object.freeze({id:'tour',name:'Four Course Tour',description:'Two laps at four established venues. Carry your points from Quarry to the elevated Bracken finale.',rounds:Object.freeze([
  round(0,'quarry-circuit','Quarry Circuit','quarry-v1',2),
  round(1,'ironfield-circuit','Ironfield Raceway','ironfield-figure-eight-v1',2),
  round(2,'cinderbank-circuit','Cinderbank Speedway','cinderbank-oval-v1',2),
  round(3,'bracken-circuit','Bracken Rallycross','bracken-rallycross-v1',2),
 ])}),
 Object.freeze({id:'gauntlet',name:'Wreckers Gauntlet',description:'Five rounds of opposing traffic, reverse rallycross and survival derbies. Repairs between rounds keep you in the fight.',rounds:Object.freeze([
  round(0,'ironfield-opposing','Ironfield Head-On','ironfield-figure-eight-v1',1,'opposing'),
  Object.freeze({...CLUB_ROUNDS[2],index:1}),
  round(2,'quarry-opposing','Quarry Head-On','quarry-v1',1,'opposing'),
  round(3,'bracken-reverse','Bracken Reverse','bracken-rallycross-v1',2,'reverse'),
  Object.freeze({...CLUB_ROUNDS[2],index:4,id:'quarry-finale' as const,name:'Last Car Standing',duration:120}),
 ])}),
 Object.freeze({id:'dirt',name:'Dirt & Air',description:'Rallycross into two dirt stadium sprints. Finish the Redbank tabletop in both directions.',rounds:Object.freeze([
  round(0,'bracken-sprint','Bracken Rallycross','bracken-rallycross-v1'),
  round(1,'redbank-sprint','Redbank Jump Circuit','redbank-jump-v1'),
  round(2,'redbank-reverse','Redbank Reverse','redbank-jump-v1',1,'reverse'),
 ])}),
 Object.freeze({id:'road-rally',name:'Road & Rally',description:'Four one-lap races from the speedway to rallycross, then Ashford in both directions.',rounds:Object.freeze([
  round(0,'cinderbank-sprint','Cinderbank Sprint','cinderbank-oval-v1'),
  round(1,'bracken-sprint','Bracken Rallycross','bracken-rallycross-v1'),
  round(2,'ashford-sprint','Ashford Autodrome','ashford-autodrome-v1'),
  round(3,'ashford-reverse','Ashford Reverse','ashford-autodrome-v1',1,'reverse'),
 ])}),
 Object.freeze({id:'woodland',name:'Woodland Trophy',description:'Three gravel and hill rounds: Pinecrest in both directions, then Bracken rallycross.',rounds:Object.freeze([
  round(0,'pinecrest-climb','Pinecrest Climb','pinecrest-ridge-v1'),
  round(1,'pinecrest-return','Pinecrest Return','pinecrest-ridge-v1',1,'reverse'),
  round(2,'bracken-sprint','Bracken Finale','bracken-rallycross-v1'),
 ])}),
 Object.freeze({id:'county-weekender',name:'County Weekender',description:'Four races across Dockside asphalt and Fairground dirt. Master both courses in both directions.',rounds:Object.freeze([
  round(0,'dockside-sprint','Dockside Sprint','dockside-loop-v1'),
  round(1,'fairground-sprint','Fairground Scramble','fairground-scramble-v1'),
  round(2,'dockside-return','Dockside Return','dockside-loop-v1',1,'reverse'),
  round(3,'fairground-return','Fairground Return','fairground-scramble-v1',1,'reverse'),
 ])}),
]);
export function clubRoster(kind:CarKind,lineup:GridLineup='mixed',field=11){
 requireValue(isCarKind(kind)&&isGridLineup(lineup)&&isClubField(field),'selected car or field rule');
 const eligible=gridPool(kind,lineup),pool=(kind==='regent'?['regent',...(field===11?CLUB_KINDS:FIELD_KINDS)] as CarKind[]:field===11?(kind==='shuttle'?['shuttle',...CLUB_KINDS] as CarKind[]:CLUB_KINDS):FIELD_KINDS).filter(k=>eligible.includes(k)),offset=pool.indexOf(kind);
 return Array.from({length:field},(_,slot)=>({slot,kind:pool[(offset+slot)%pool.length]}));
}
export const clubSeries=(cup?:Pick<ClubCupState,'series'>|null):ClubSeries=>CLUB_SERIES.find(s=>s.id===(cup?.series??'club'))!;
export const clubRounds=(cup?:Pick<ClubCupState,'series'>|null)=>clubSeries(cup).rounds;
export type ClubStatus='finished'|'survived'|'wrecked'|'dnf'|'retired';
export type ClubRowInput=Readonly<{slot:number;status:ClubStatus;finishTime:number|null;health:number;progress:number;damage:number}>;
export type ClubResultRow=ClubRowInput&Readonly<{place:number;points:number}>;
export type ClubRoundResult=Readonly<{index:number;round:ClubRoundId;rows:readonly ClubResultRow[];runStats?:Readonly<RunStats>}>;
export type ClubCupState=Readonly<{version:1;id:string;created:number;series?:ClubSeriesId;difficulty?:AIDifficulty;lineup?:GridLineup;field?:number;roster:readonly Readonly<{slot:number;kind:CarKind}>[];phase:'ready'|'running'|'complete';results:readonly ClubRoundResult[]}>;
export type ClubStanding=Readonly<{slot:number;kind:CarKind;points:number;wins:number;place:number}>;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function requireValue(condition:unknown,message:string):asserts condition{if(!condition)throw new Error('Invalid Club Cup: '+message);}
function object(value:unknown,required:readonly string[],optional:readonly string[]=[]):Record<string,unknown>{
 requireValue(value!==null&&typeof value==='object'&&!Array.isArray(value),'expected object');
 const v=value as Record<string,unknown>;
 requireValue(required.every(k=>Object.hasOwn(v,k))&&Object.keys(v).every(k=>required.includes(k)||optional.includes(k)),'unexpected or missing fields');return v;
}
function number(value:unknown,min:number,max:number,integer=false):number{
 requireValue(typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max&&(!integer||Number.isInteger(value)),'number out of range');return value;
}
function freeze<T>(value:T):T{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
const rowFields=['slot','status','finishTime','health','progress','damage'] as const;
function canonicalRows(value:unknown,index:number,rounds:readonly ClubRound[]=CLUB_ROUNDS,field=11):readonly ClubResultRow[]{
 requireValue(Array.isArray(value)&&value.length===field,'every round needs the complete field');
 const round=rounds[index];requireValue(round,'round index');
 const rows:ClubRowInput[]=value.map(raw=>{
  const v=object(raw,rowFields,['place','points']);const slot=number(v.slot,0,field-1,true),health=number(v.health,0,100),progress=number(v.progress,-100,1e6),damage=number(v.damage,0,10000);
  requireValue(['finished','survived','wrecked','dnf','retired'].includes(v.status as string),'status');const status=v.status as ClubStatus;
  if(round.mode==='race')requireValue(status!=='survived','race status');
  else requireValue(status==='survived'||status==='wrecked'||status==='retired','derby status');
  // Finishers retain their real result even if they are hit after crossing the line.
  if(status==='finished')number(v.finishTime,Number.MIN_VALUE,86400);else requireValue(v.finishTime===null,'only finishers have a time');
  if(status==='wrecked')requireValue(health===0,'wrecked entrant still has health');
  if(status==='survived')requireValue(health>0,'survivor has no health');
  if(status==='dnf')requireValue(health>0,'disabled entrant must be recorded as wrecked');
  return {slot,status,finishTime:v.finishTime as number|null,health,progress,damage};
 });
 requireValue(new Set(rows.map(r=>r.slot)).size===field,'duplicate or missing slot');
 rows.sort((a,b)=>{
  const retired=Number(a.status==='retired')-Number(b.status==='retired');if(retired)return retired;
  if(round.mode==='derby')return b.health-a.health||b.damage-a.damage||a.slot-b.slot;
  const finished=Number(b.status==='finished')-Number(a.status==='finished');if(finished)return finished;
  if(a.status==='finished'&&b.status==='finished')return a.finishTime!-b.finishTime!||a.slot-b.slot;
  return b.progress-a.progress||a.slot-b.slot;
 });
 return freeze(rows.map((r,i)=>({...r,place:i+1,points:r.status==='finished'||(round.mode==='derby'&&r.status!=='retired')?(CLUB_POINTS[i]??0):0})));
}
const statFields=['seconds','distance','damage','knockouts','drift','airtime','maxSpeed','checkpoints','health','rank','finished','completed','recovered'] as const;
function stats(value:unknown):RunStats{
 const v=object(value,statFields,['won']);
 const bounds:Record<string,number>={seconds:86400,distance:1e6,damage:10000,knockouts:100,drift:1e6,airtime:1000,maxSpeed:1000,checkpoints:10000,health:100,rank:24};
 for(const [key,max]of Object.entries(bounds))number(v[key],0,max,key==='knockouts'||key==='checkpoints'||key==='rank');
 for(const key of ['finished','completed','recovered'])requireValue(typeof v[key]==='boolean','invalid telemetry flag');
 if(Object.hasOwn(v,'won'))requireValue(typeof v.won==='boolean','invalid win flag');
 return {...v} as RunStats;
}
function outcomeStats(value:unknown,rows:readonly ClubResultRow[]):Readonly<RunStats>{
 const observed=stats(value),player=rows.find(r=>r.slot===0)!;
 return freeze({...observed,rank:player.place,health:player.health,finished:player.status==='finished',won:player.place===1&&player.points>0,completed:player.status!=='retired'});
}
function sameRows(a:readonly ClubResultRow[],b:readonly ClubResultRow[]){return a.length===b.length&&a.every((r,i)=>[...rowFields,'place','points'].every(k=>r[k as keyof ClubResultRow]===b[i][k as keyof ClubResultRow]));}
function sameStats(a:Readonly<RunStats>|undefined,b:Readonly<RunStats>|undefined){return a===undefined||b===undefined?a===b:[...statFields,'won'].every(k=>a[k as keyof RunStats]===b[k as keyof RunStats]);}
function validate(value:unknown):ClubCupState{
 const v=object(value,['version','id','created','roster','phase','results'],['series','difficulty','lineup','field']);requireValue(v.version===1&&typeof v.id==='string'&&UUID.test(v.id),'version or UUID');number(v.created,0,8640000000000000,true);
 requireValue(v.series===undefined||CLUB_SERIES.some(s=>s.id===v.series),'series');
 requireValue(v.difficulty===undefined||isAIDifficulty(v.difficulty),'difficulty');
 requireValue(v.lineup===undefined||isGridLineup(v.lineup),'field rule');
 requireValue(v.field===undefined||isClubField(v.field),'field size');const field=v.field as number|undefined;
 const rounds=clubRounds({series:v.series as ClubSeriesId|undefined});
 requireValue(Array.isArray(v.roster)&&v.roster.length===(field??11),'roster');
 const first=object(v.roster[0],['slot','kind']).kind;requireValue(isCarKind(first),'selected car');
 const expected=clubRoster(first as CarKind,v.lineup as GridLineup|undefined,field);
 const roster=v.roster.map((raw,i)=>{const r=object(raw,['slot','kind']);requireValue(r.slot===i&&r.kind===expected[i].kind,'roster order or field eligibility');return {slot:i,kind:r.kind as CarKind};});
 requireValue(Array.isArray(v.results)&&v.results.length<=rounds.length,'results');
 requireValue(v.phase==='ready'||v.phase==='running'||v.phase==='complete','phase');requireValue((v.phase==='complete')===(v.results.length===rounds.length),'phase/result count');
 const results=v.results.map((raw,index)=>{
  const r=object(raw,['index','round','rows'],['runStats']);requireValue(r.index===index&&r.round===rounds[index].id,'round order');const rows=canonicalRows(r.rows,index,rounds,field);
  requireValue(Array.isArray(r.rows)&&r.rows.every((row,i)=>{const x=object(row,[...rowFields,'place','points']);return Object.keys(x).every(k=>x[k]===rows[i][k as keyof ClubResultRow]);}),'noncanonical result order, rank or points');
  const runStats=Object.hasOwn(r,'runStats')?stats(r.runStats):undefined;
  if(runStats)requireValue(sameStats(runStats,outcomeStats(runStats,rows)),'telemetry outcome disagrees with results');
  return {index,round:rounds[index].id,rows,...(runStats?{runStats}:{})};
 });
 return freeze({version:1,id:v.id,created:v.created as number,...(v.series?{series:v.series as ClubSeriesId}:{}),...(v.difficulty?{difficulty:v.difficulty as AIDifficulty}:{}),...(v.lineup?{lineup:v.lineup as GridLineup}:{}),...(field!==undefined?{field}:{}),roster,phase:v.phase,results});
}
/** Reject the whole save rather than repairing rankings, awards or poisoned fields. */
export function readClubCup(text?:string|null):ClubCupState|null{
 if(typeof text!=='string'||text.length>100000)return null;try{return validate(JSON.parse(text));}catch{return null;}
}
export function createClubCup(kind:CarKind,id:string,created:number,series?:ClubSeriesId,difficulty?:AIDifficulty,lineup?:GridLineup,field=11):ClubCupState{
 requireValue(isCarKind(kind),'selected car');
 return validate({version:1,id,created,...(series?{series}:{}),...(difficulty?{difficulty}:{}),...(lineup&&lineup!=='mixed'?{lineup}:{}),...(field!==11?{field}:{}),roster:clubRoster(kind,lineup,field),phase:'ready',results:[]});
}
export function currentClubRound(cup:ClubCupState):ClubRound|null{return clubRounds(cup)[validate(cup).results.length]??null;}
export function beginClubRound(cup:ClubCupState):ClubCupState{
 const state=validate(cup);requireValue(state.phase!=='complete','cup already complete');return freeze({...state,phase:'running' as const});
}
export function rankClubRows(cup:ClubCupState,rows:readonly ClubRowInput[],roundIndex=validate(cup).results.length):readonly ClubResultRow[]{
 validate(cup);const rounds=clubRounds(cup);number(roundIndex,0,rounds.length-1,true);return canonicalRows(rows,roundIndex,rounds,cup.roster.length);
}
/** Persist the returned result before settling XP. Pass the captured round index
 * from main so a delayed callback cannot complete a different, newly started round. */
export function finishClubRound(cup:ClubCupState,rows:readonly ClubRowInput[],runStats?:RunStats,roundIndex?:number):ClubCupState{
 const state=validate(cup),rounds=clubRounds(state),index=roundIndex??(state.phase==='running'?state.results.length:state.results.length-1);number(index,0,rounds.length-1,true);
 const ranked=canonicalRows(rows,index,rounds,state.roster.length),observed=runStats===undefined?undefined:outcomeStats(runStats,ranked),prior=state.results[index];
 if(prior){requireValue(sameRows(prior.rows,ranked)&&(observed===undefined||sameStats(prior.runStats,observed)),'attempted to change a recorded result');return state;}
 requireValue(state.phase==='running'&&index===state.results.length,'round is not running');
 const result:ClubRoundResult={index,round:rounds[index].id,rows:ranked,...(observed?{runStats:observed}:{})},results=[...state.results,result];
 return freeze({...state,phase:results.length===rounds.length?'complete' as const:'ready' as const,results});
}
export function clubStandings(cup:ClubCupState):readonly ClubStanding[]{
 const state=validate(cup),rows=state.roster.map(r=>({...r,points:0,wins:0}));
 for(const result of state.results)for(const row of result.rows){rows[row.slot].points+=row.points;rows[row.slot].wins+=row.place===1&&row.points>0?1:0;}
 rows.sort((a,b)=>b.points-a.points||b.wins-a.wins||a.slot-b.slot);return freeze(rows.map((r,i)=>({...r,place:i+1})));
}
export const clubRoundRunId=(cup:ClubCupState,index:number)=>`club:${cup.id}:round:${index}`;
/** Uses the existing profile receipt list; never stores a second XP total in the
 * cup. Call again after reload if saving the profile failed after saving results.
 * If the cup write failed, false only refreshes existing receipts: it never
 * awards an unpersisted result, even while ordinary profile writes still work. */
export function replayCupAwards(profile:DriverProfile,cup:ClubCupState,allowUnsettled=true):Award[]{
 const state=validate(cup),recorded=state.results.filter(result=>result.runStats);
 // The one current cup is refreshed on boot and before every ordinary award.
 // Keep its existing receipts inside readProfile's unchanged 256-entry window.
 const present=recorded.map(result=>clubRoundRunId(state,result.index)).filter(id=>profile.settled.includes(id));
 if(present.length){const retained=new Set(present);profile.settled=[...profile.settled.filter(id=>!retained.has(id)),...present].slice(-256);}
 return recorded.filter(result=>allowUnsettled||profile.settled.includes(clubRoundRunId(state,result.index))).map(result=>settleRun(profile,clubRoundRunId(state,result.index),result.runStats!));
}
