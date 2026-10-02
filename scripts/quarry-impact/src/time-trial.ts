import {CAR_KINDS,isCarKind,type CarKind} from './rules';
import {COURSE_NAMES,isCourseId,type CourseId} from './course-id';
import type {RunStats} from './session-telemetry';

export const TIME_TRIAL_KEY='quarry-impact-time-trial-v1';
export type TimeTrialConfig={kind:CarKind;course:CourseId;direction:'forward'|'reverse'};
export type TimeTrialRecords={version:1;bests:Record<string,number>};
export type TimeTrialEvidence={
  run:RunStats|null;finished:boolean;health:number;passed:number;finishTime:number;
  demo:boolean;online:boolean;synthetic:boolean;stock:boolean;
};
export type TimeTrialResult={
  status:'finished'|'invalid'|'dnf';eligible:boolean;reason:string;time:number|null;
  previousBest:number|null;best:number|null;delta:number|null;newBest:boolean;
};
type ReadStorage=Pick<Storage,'getItem'>;
type WriteStorage=Pick<Storage,'setItem'>;
const MAX_SECONDS=86400;
const recordKeys=new Set(CAR_KINDS.flatMap(kind=>Object.keys(COURSE_NAMES).flatMap(course=>
  ['forward','reverse'].map(direction=>`${course}:${kind}:${direction}`))));
const emptyRecords=():TimeTrialRecords=>({version:1,bests:{}});
const validTime=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=MAX_SECONDS;
const plainObject=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);

export function isTimeTrialConfig(value:unknown):value is TimeTrialConfig{
  if(!plainObject(value))return false;
  return isCarKind(value.kind)&&isCourseId(value.course)&&(value.direction==='forward'||value.direction==='reverse');
}
export function timeTrialKey(config:TimeTrialConfig):string{
  if(!isTimeTrialConfig(config))throw new Error('Invalid Time Trial selection.');
  return `${config.course}:${config.kind}:${config.direction}`;
}
function validRecords(value:unknown):value is TimeTrialRecords{
  if(!plainObject(value)||value.version!==1||Object.keys(value).length!==2||!plainObject(value.bests))return false;
  const entries=Object.entries(value.bests);
  return entries.length<=recordKeys.size&&entries.every(([key,time])=>recordKeys.has(key)&&validTime(time));
}

/** Legacy race records have no comparable car/setup identity. Read only the
 * 66 known categories so one malformed entry cannot erase other valid PBs. */
export function readTimeTrialRecords(text?:string|null):TimeTrialRecords{
  if(typeof text!=='string'||text.length>16000)return emptyRecords();
  try{
    const value:unknown=JSON.parse(text);
    if(plainObject(value)&&value.version===1&&Object.keys(value).length===2&&plainObject(value.bests)){
      const records=emptyRecords();
      for(const key of recordKeys)if(Object.hasOwn(value.bests,key)&&validTime(value.bests[key]))records.bests[key]=value.bests[key];
      return records;
    }
  }catch{/* Missing or malformed browser data is not a record. */}
  return emptyRecords();
}
export function timeTrialBest(records:TimeTrialRecords,config:TimeTrialConfig):number|null{
  const key=timeTrialKey(config),value=Object.hasOwn(records.bests,key)?records.bests[key]:undefined;
  return validTime(value)?value:null;
}
export function loadTimeTrialRecords(storage?:ReadStorage):{records:TimeTrialRecords;warning:string}{
  try{return{records:readTimeTrialRecords((storage??globalThis.localStorage).getItem(TIME_TRIAL_KEY)),warning:''};}
  catch{return{records:emptyRecords(),warning:'Personal bests could not be loaded. New results will be kept for this session.'};}
}
/** The caller keeps the returned in-memory records even if this write fails. */
export function saveTimeTrialRecords(records:TimeTrialRecords,storage?:WriteStorage):boolean{
  if(!validRecords(records))return false;
  try{
    const bests=Object.fromEntries(Object.entries(records.bests).sort(([a],[b])=>a.localeCompare(b)));
    (storage??globalThis.localStorage).setItem(TIME_TRIAL_KEY,JSON.stringify({version:1,bests}));
    return true;
  }catch{return false;}
}

function rejection(evidence:TimeTrialEvidence):string{
  const e=evidence,r=e.run;
  if(!e.finished||!Number.isInteger(e.passed)||e.passed<24||!validTime(e.finishTime)||!Number.isFinite(e.health)||e.health<=0||e.health>100)
    return 'Finish the ordered lap with your car still running to set a personal best.';
  if(e.demo!==false||e.online!==false||e.synthetic!==false)return 'Only a manually driven offline Time Trial can set a personal best.';
  if(e.stock!==true)return 'Personal bests require the factory stock setup.';
  if(!r)return 'Driving telemetry is unavailable; this run cannot set a personal best.';
  if(r.recovered!==false)return 'Recovery was used. This practice finish cannot set a personal best.';
  if(r.finished!==true||r.completed!==true||!validTime(r.seconds)||Math.abs(r.seconds-e.finishTime)>1/60+1e-8||
    !Number.isInteger(r.checkpoints)||r.checkpoints<24||!Number.isFinite(r.health)||r.health<=0||r.health>100||
    ![r.distance,r.damage,r.knockouts,r.drift,r.airtime,r.maxSpeed,r.rank].every(n=>Number.isFinite(n)&&n>=0))
    return 'A complete timed lap was not verified by driving telemetry.';
  return '';
}

/** Evidence comes from the live ordered finish and fixed-step telemetry. This
 * is a local eligibility boundary, not authentication for imported scores. */
export function finishTimeTrialRecord(records:TimeTrialRecords,config:TimeTrialConfig,evidence:TimeTrialEvidence):{records:TimeTrialRecords;result:TimeTrialResult}{
  if(!validRecords(records))throw new Error('Invalid Time Trial records.');
  const key=timeTrialKey(config),previousBest=timeTrialBest(records,config),reason=rejection(evidence);
  const completed=evidence.finished===true&&Number.isInteger(evidence.passed)&&evidence.passed>=24&&validTime(evidence.finishTime)&&
    Number.isFinite(evidence.health)&&evidence.health>0&&evidence.health<=100;
  const time=completed?evidence.finishTime:null,eligible=reason==='';
  const newBest=eligible&&(previousBest===null||evidence.finishTime<previousBest);
  const next={version:1 as const,bests:{...records.bests,...(newBest?{[key]:evidence.finishTime}:{})}};
  return{records:next,result:{status:eligible?'finished':completed?'invalid':'dnf',eligible,reason,time,
    previousBest,best:newBest?evidence.finishTime:previousBest,
    delta:time!==null&&previousBest!==null?time-previousBest:null,newBest}};
}

/** Round once, then split integer hundredths so minute carry stays correct. */
export function formatTrialTime(seconds:number|null):string{
  if(seconds===null||!Number.isFinite(seconds)||seconds<0)return '—';
  const ticks=Math.round(seconds*100);
  return `${Math.floor(ticks/6000)}:${String(Math.floor(ticks/100)%60).padStart(2,'0')}.${String(ticks%100).padStart(2,'0')}`;
}
export function formatTrialDelta(seconds:number|null):string{
  if(seconds===null||!Number.isFinite(seconds))return '—';
  const magnitude=Math.round(Math.abs(seconds)*100)/100;
  if(magnitude===0)return seconds===0?'EVEN':'<0.01s '+(seconds<0?'FASTER':'SLOWER');
  return `${seconds<0?'−':'+'}${magnitude.toFixed(2)}s`;
}
