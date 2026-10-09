import {normalizeSetup,stockSetup,type Setup} from './garage';
import {performanceRating,type PerformanceClass} from './performance-class';
import {CAR_KINDS,isCarKind,type CarKind} from './rules';
import {COURSE_NAMES,isCourseId,type CourseId} from './course-id';
import type {RunStats} from './session-telemetry';

export const TIME_TRIAL_KEY='quarry-impact-time-trial-v1';
export type TimeTrialConfig={kind:CarKind;course:CourseId;direction:'forward'|'reverse';performanceClass?:PerformanceClass;setup?:Setup};
export type TimeTrialRecords={version:1;bests:Record<string,number>;builds?:Record<string,Setup>};
export type TimeTrialEvidence={
  run:RunStats|null;finished:boolean;health:number;passed:number;finishTime:number;
  demo:boolean;online:boolean;synthetic:boolean;stock:boolean;selectionMatches?:boolean;setup?:Setup;
};
export type TimeTrialResult={
  status:'finished'|'invalid'|'dnf';eligible:boolean;reason:string;time:number|null;
  previousBest:number|null;best:number|null;delta:number|null;newBest:boolean;
};
type ReadStorage=Pick<Storage,'getItem'>;
type WriteStorage=Pick<Storage,'setItem'>;
const MAX_SECONDS=86400;
const categories=CAR_KINDS.flatMap(kind=>Object.keys(COURSE_NAMES).flatMap(course=>
  (['forward','reverse'] as const).map(direction=>({kind,course:course as CourseId,direction}))));
const recordConfigs=new Map(categories.flatMap(c=>[undefined,'D','C','B','A'].map(grade=>{
 const performanceClass=grade as PerformanceClass|undefined;
 return [`${c.course}:${c.kind}:${c.direction}`+(grade?`:pp1:${grade}`:''),{...c,...(performanceClass?{performanceClass}:{})}] as const;
})));
const recordKeys=new Set(recordConfigs.keys());
// Include bounded performance-only build metadata; cosmetics are not part of a lap's setup record.
export const TIME_TRIAL_STORE_LIMIT=128+[...recordKeys].reduce((size,key)=>size+key.length+32+(key.includes(':pp1:')?key.length+600:0),0);
const emptyRecords=():TimeTrialRecords=>({version:1,bests:{}});
const validTime=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=MAX_SECONDS;
const plainObject=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);

const canonical=(v:unknown):string=>JSON.stringify(v,(_k,x)=>plainObject(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
/** Preserve the complete selected garage build while fixing its category for this attempt. */
export function classTimeTrial(config:Pick<TimeTrialConfig,'kind'|'course'|'direction'>,input:Setup):TimeTrialConfig{
 const setup=normalizeSetup(input,config.kind);
 return {kind:config.kind,course:config.course,direction:config.direction,performanceClass:performanceRating(config.kind,setup).grade,setup};
}
export function isTimeTrialConfig(value:unknown):value is TimeTrialConfig{
 if(!plainObject(value)||!isCarKind(value.kind)||!isCourseId(value.course)||(value.direction!=='forward'&&value.direction!=='reverse'))return false;
 if(value.performanceClass===undefined)return value.setup===undefined;
 return ['D','C','B','A'].includes(value.performanceClass as string)&&plainObject(value.setup)&&
  canonical(value.setup)===canonical(normalizeSetup(value.setup,value.kind))&&performanceRating(value.kind,value.setup as Setup).grade===value.performanceClass;
}
export function copyTimeTrialConfig(c:TimeTrialConfig):TimeTrialConfig{
 if(!isTimeTrialConfig(c))throw Error('Invalid Time Trial selection.');
 const base={kind:c.kind,course:c.course,direction:c.direction};
 return c.performanceClass?classTimeTrial(base,c.setup!):base;
}
export const timeTrialSetup=(c:TimeTrialConfig):Setup=>c.performanceClass?normalizeSetup(c.setup,c.kind):stockSetup(c.kind);
export const timeTrialBuildLabel=(c:TimeTrialConfig)=>c.performanceClass?`Garage build · Class ${c.performanceClass} · ${performanceRating(c.kind,c.setup).points} PP`:'Factory stock';
export function timeTrialKey(config:TimeTrialConfig):string{
 if(!isTimeTrialConfig(config))throw new Error('Invalid Time Trial selection.');
 return `${config.course}:${config.kind}:${config.direction}`+(config.performanceClass?`:pp1:${config.performanceClass}`:'');
}
function performanceBuild(kind:CarKind,setup:Setup):Setup{return normalizeSetup({...setup,paint:stockSetup(kind).paint,trim:stockSetup(kind).trim,livery:[]},kind);}
function validBuild(key:string,value:unknown):value is Setup{
 const c=recordConfigs.get(key);return !!c?.performanceClass&&plainObject(value)&&
  canonical(value)===canonical(performanceBuild(c.kind,value as Setup))&&performanceRating(c.kind,value as Setup).grade===c.performanceClass;
}
export function timeTrialLeaderboard(records:TimeTrialRecords,config:TimeTrialConfig){
 if(!config.performanceClass)return [];
 return Object.entries(records.bests).flatMap(([key,time])=>{
  const c=recordConfigs.get(key),setup=records.builds?.[key];
  return c?.course===config.course&&c.direction===config.direction&&c.performanceClass===config.performanceClass&&validTime(time)&&validBuild(key,setup)?[{key,kind:c.kind,time,setup:normalizeSetup(setup,c.kind),points:performanceRating(c.kind,setup).points}]:[];
 }).sort((a,b)=>a.time-b.time||a.kind.localeCompare(b.kind));
}
function validRecords(value:unknown):value is TimeTrialRecords{
 if(!plainObject(value)||value.version!==1||Object.keys(value).some(k=>!['version','bests','builds'].includes(k))||!plainObject(value.bests)||value.builds!==undefined&&!plainObject(value.builds))return false;
 const builds=value.builds as Record<string,unknown>|undefined,entries=Object.entries(value.bests);
 return entries.length<=recordKeys.size&&entries.every(([key,time])=>recordKeys.has(key)&&validTime(time)&&(!recordConfigs.get(key)?.performanceClass||validBuild(key,builds?.[key])))&&
  Object.entries(builds??{}).every(([key,setup])=>Object.hasOwn(value.bests as object,key)&&validBuild(key,setup));
}
/** Keep older stock PB bytes and salvage valid neighbors. Class results also require their recorded build. */
export function readTimeTrialRecords(text?:string|null):TimeTrialRecords{
 if(typeof text!=='string'||text.length>TIME_TRIAL_STORE_LIMIT)return emptyRecords();
 try{
  const v:unknown=JSON.parse(text);
  if(plainObject(v)&&v.version===1&&Object.keys(v).every(k=>['version','bests','builds'].includes(k))&&plainObject(v.bests)){
   const records=emptyRecords(),builds:Record<string,Setup>={};
   for(const key of recordKeys)if(Object.hasOwn(v.bests,key)&&validTime(v.bests[key])){
    if(recordConfigs.get(key)?.performanceClass){const build=plainObject(v.builds)?v.builds[key]:undefined;if(!validBuild(key,build))continue;builds[key]=normalizeSetup(build,recordConfigs.get(key)!.kind);}
    records.bests[key]=v.bests[key];
   }
   if(Object.keys(builds).length)records.builds=builds;
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
    (storage??globalThis.localStorage).setItem(TIME_TRIAL_KEY,JSON.stringify({version:1,bests,...(records.builds?{builds:records.builds}:{})}));
    return true;
  }catch{return false;}
}

function rejection(config:TimeTrialConfig,evidence:TimeTrialEvidence):string{
  const e=evidence,r=e.run;
  if(!e.finished||!Number.isInteger(e.passed)||e.passed<24||!validTime(e.finishTime)||!Number.isFinite(e.health)||e.health<=0||e.health>100)
    return 'Finish the ordered lap with your car still running to set a personal best.';
  if(e.demo!==false||e.online!==false||e.synthetic!==false)return 'Only a manually driven offline Time Trial can set a personal best.';
  if(config.performanceClass){
    if(e.selectionMatches!==true||!e.setup||canonical(e.setup)!==canonical(config.setup))return 'The driven car, course or build changed. Retry with the locked class setup.';
  }else if(e.stock!==true)return 'Personal bests require the factory stock setup.';
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
  const key=timeTrialKey(config),previousBest=timeTrialBest(records,config),reason=rejection(config,evidence);
  const completed=evidence.finished===true&&Number.isInteger(evidence.passed)&&evidence.passed>=24&&validTime(evidence.finishTime)&&
    Number.isFinite(evidence.health)&&evidence.health>0&&evidence.health<=100;
  const time=completed?evidence.finishTime:null,eligible=reason==='';
  const newBest=eligible&&(previousBest===null||evidence.finishTime<previousBest);
  const builds={...records.builds,...(newBest&&config.performanceClass?{[key]:performanceBuild(config.kind,config.setup!)}:{})};
  const next={version:1 as const,bests:{...records.bests,...(newBest?{[key]:evidence.finishTime}:{})},...(Object.keys(builds).length?{builds}:{})};
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
