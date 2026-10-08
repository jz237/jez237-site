import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {COURSE_NAMES,type CourseId} from '../src/course-id';
import {SessionTelemetry} from '../src/session-telemetry';
import {TIME_TRIAL_KEY,finishTimeTrialRecord,formatTrialDelta,formatTrialTime,isTimeTrialConfig,loadTimeTrialRecords,readTimeTrialRecords,saveTimeTrialRecords,timeTrialBest,timeTrialKey,type TimeTrialConfig,type TimeTrialEvidence,type TimeTrialRecords} from '../src/time-trial';

const config:TimeTrialConfig={kind:'tern',course:'ironfield-figure-eight-v1',direction:'forward'};
/** Fixed-step samples exercise the production telemetry contract. Position and
 * ordered gate legitimacy belong to actual-main/Vehicle acceptance, not this
 * pure model fixture. */
function evidence():TimeTrialEvidence{
  const telemetry=new SessionTelemetry();
  for(let i=0;i<1800;i++)telemetry.sample(1/60,{speed:18,lateral:0,grounded:4,height:0,health:73,checkpoints:Math.floor((i+1)/75)});
  Object.assign(telemetry.stats,{finished:true,completed:true,won:false});
  return{run:telemetry.stats,finished:true,health:73,passed:24,finishTime:telemetry.stats.seconds,demo:false,online:false,synthetic:false,stock:true};
}
function at(seconds:number):TimeTrialEvidence{const value=evidence();value.finishTime=seconds;value.run!.seconds=seconds;return value;}

test('all registered car/course/direction identities round-trip independently without borrowing a different personal best',()=>{
  let records=readTimeTrialRecords();const identities=new Set<string>();let time=30;
  for(const kind of CAR_KINDS)for(const course of Object.keys(COURSE_NAMES) as CourseId[])for(const direction of ['forward','reverse'] as const){
    const selection={kind,course,direction};assert.equal(timeTrialBest(records,selection),null);
    const next=finishTimeTrialRecord(records,selection,at(time));identities.add(timeTrialKey(selection));
    assert.equal(next.result.newBest,true);assert.equal(next.result.best,time);records=next.records;time+=.0123456789;
  }
  const expected=CAR_KINDS.length*Object.keys(COURSE_NAMES).length*2;assert.equal(expected,234);assert.equal(identities.size,expected);assert.equal(Object.keys(records.bests).length,expected);
  let saved='';assert.equal(saveTimeTrialRecords(records,{setItem(key,text){assert.equal(key,TIME_TRIAL_KEY);saved=text;}}),true);
  assert.deepEqual(readTimeTrialRecords(saved),records);
  const untouched=JSON.stringify(records);const loaded=readTimeTrialRecords(saved);loaded.bests[timeTrialKey(config)]=1;
  assert.equal(JSON.stringify(records),untouched,'Loaded stores do not share caller-owned references');
});

test('the strict versioned codec rejects poisoned or oversized stores without repairing records into qualifying results',()=>{
  const key=timeTrialKey(config),valid={version:1,bests:{[key]:31.123456789}};
  const invalid:unknown[]=[null,[],{}, {version:2,bests:valid.bests},{...valid,legacyBest:10},{version:1,bests:[]},
    {version:1,bests:{[key]:'31'}},{version:1,bests:{[key]:0}},{version:1,bests:{[key]:-1}},
    {version:1,bests:{[key]:86400.001}},{version:1,bests:{[key]:null}},
    {version:1,bests:{'unknown:tern:forward':12}},
    {version:1,bests:{'ironfield-figure-eight-v1:tern:opposing':12}},
    {best:{[key]:5}}];
  for(const value of invalid)assert.deepEqual(readTimeTrialRecords(JSON.stringify(value)),{version:1,bests:{}});
  for(const text of ['{broken',`{"version":1,"bests":{"__proto__":4}}`,`{"version":1,"bests":{"${key}":1e309}}`,' '.repeat(16001)])
    assert.deepEqual(readTimeTrialRecords(text),{version:1,bests:{}});
  assert.deepEqual(readTimeTrialRecords(JSON.stringify(valid)),valid);assert.equal(({} as Record<string,unknown>).polluted,undefined);
  const mixed={version:1,bests:{...valid.bests,'unknown:tern:forward':12,[timeTrialKey({...config,direction:'reverse'})]:'31'}};
  assert.deepEqual(readTimeTrialRecords(JSON.stringify(mixed)),valid,'Malformed neighbors cannot erase valid personal bests');
  assert.equal(isTimeTrialConfig({...config,direction:'opposing'}),false);assert.equal(isTimeTrialConfig({...config,course:'future-course'}),false);
  assert.equal(isTimeTrialConfig({...config,kind:'__proto__'}),false);assert.equal(isTimeTrialConfig(null),false);
  assert.throws(()=>timeTrialKey({...config,course:'unknown'} as TimeTrialConfig),/selection/);
});

test('faster-only personal bests retain full precision, preserve the original store and make duplicate finalization harmless',()=>{
  const initial=Object.freeze({version:1 as const,bests:Object.freeze({[timeTrialKey(config)]:31.123456789})});
  const fast=finishTimeTrialRecord(initial,config,at(31.123456780));
  assert.equal(fast.result.newBest,true);assert.equal(fast.result.previousBest,31.123456789);assert.equal(fast.result.best,31.123456780);
  assert.ok(fast.result.delta!<0);assert.equal(initial.bests[timeTrialKey(config)],31.123456789);
  assert.equal(formatTrialTime(fast.result.time),formatTrialTime(fast.result.previousBest),'Display rounding never decides PB eligibility');
  const duplicate=finishTimeTrialRecord(fast.records,config,at(31.123456780));assert.equal(duplicate.result.newBest,false);assert.equal(duplicate.result.delta,0);
  const slow=finishTimeTrialRecord(fast.records,config,at(40));assert.equal(slow.result.newBest,false);assert.equal(slow.result.status,'finished');
  assert.deepEqual(slow.records,fast.records);assert.equal(slow.result.best,31.123456780);
  assert.equal(formatTrialDelta(fast.result.delta),'<0.01s FASTER');
});

test('only living ordered finishes with matching real telemetry can qualify, while ordinary damage remains eligible',()=>{
  const records=readTimeTrialRecords();const legitimate=finishTimeTrialRecord(records,config,evidence());
  assert.equal(legitimate.result.eligible,true);assert.equal(legitimate.result.status,'finished');assert.ok(legitimate.result.time!>29);
  const reject=(mutate:(value:TimeTrialEvidence)=>void,status:'invalid'|'dnf')=>{
    const value=evidence();mutate(value);const next=finishTimeTrialRecord(records,config,value);
    assert.equal(next.result.eligible,false);assert.equal(next.result.newBest,false);assert.equal(next.result.status,status);assert.ok(next.result.reason);
    assert.deepEqual(next.records,records);
  };
  reject(e=>e.finished=false,'dnf');reject(e=>e.health=0,'dnf');reject(e=>e.health=NaN,'dnf');reject(e=>e.passed=23,'dnf');reject(e=>e.passed=24.5,'dnf');
  reject(e=>e.finishTime=Infinity,'dnf');reject(e=>e.finishTime=0,'dnf');reject(e=>e.finishTime=86401,'dnf');
  reject(e=>e.run=null,'invalid');reject(e=>e.run!.finished=false,'invalid');reject(e=>e.run!.completed=false,'invalid');
  reject(e=>e.run!.checkpoints=23,'invalid');reject(e=>e.run!.seconds-=.02,'invalid');reject(e=>e.run!.seconds=NaN,'invalid');
  reject(e=>e.run!.health=0,'invalid');reject(e=>e.run!.distance=NaN,'invalid');
  const step=evidence();step.finishTime+=1/60;assert.equal(finishTimeTrialRecord(records,config,step).result.eligible,true);
});

test('recovery, demo, online, synthetic control and nonstock attempts never change an existing best or fabricate DNF time',()=>{
  const records=finishTimeTrialRecord(readTimeTrialRecords(),config,at(60)).records;
  for(const change of [
    (e:TimeTrialEvidence)=>e.run!.recovered=true,(e:TimeTrialEvidence)=>e.demo=true,
    (e:TimeTrialEvidence)=>e.online=true,(e:TimeTrialEvidence)=>e.synthetic=true,(e:TimeTrialEvidence)=>e.stock=false,
    (e:TimeTrialEvidence)=>delete (e as Partial<TimeTrialEvidence>).synthetic,
  ]){
    const e=evidence();change(e);const next=finishTimeTrialRecord(records,config,e);
    assert.equal(next.result.status,'invalid');assert.equal(next.result.eligible,false);assert.equal(next.result.best,60);
    assert.equal(next.result.time,e.finishTime,'Practice finishes retain an honest finish time');assert.deepEqual(next.records,records);
  }
  const dnf=evidence();dnf.finished=false;dnf.health=0;
  const result=finishTimeTrialRecord(records,config,dnf).result;assert.equal(result.status,'dnf');assert.equal(result.time,null);assert.equal(result.delta,null);assert.equal(result.best,60);
});

test('storage failures keep session results usable and a later successful write persists all of them without changing unrelated storage',()=>{
  const saved=new Map<string,string>([['quarry-impact-v1','legacy bytes'],['quarry-profile-v1','profile bytes']]);
  const storage={getItem:(key:string)=>saved.get(key)??null,setItem:(key:string,value:string)=>{saved.set(key,value);}};
  const records=finishTimeTrialRecord(readTimeTrialRecords(),config,evidence()).records;
  assert.equal(saveTimeTrialRecords(records,{setItem(){throw new Error('QuotaExceededError');}}),false);
  assert.ok(timeTrialBest(records,config)!>29);
  const slower=finishTimeTrialRecord(records,config,at(40));assert.equal(slower.result.newBest,false);
  assert.equal(saveTimeTrialRecords(slower.records,storage),true);assert.deepEqual(loadTimeTrialRecords(storage),{records,warning:''});
  assert.equal(saved.get('quarry-impact-v1'),'legacy bytes');assert.equal(saved.get('quarry-profile-v1'),'profile bytes');
  const failed=loadTimeTrialRecords({getItem(){throw new Error('SecurityError');}});assert.deepEqual(failed.records,{version:1,bests:{}});assert.match(failed.warning,/session/);
  let writes=0;assert.equal(saveTimeTrialRecords({version:1,bests:{oops:10}},{setItem(){writes++;}}),false);assert.equal(writes,0);
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  try{Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('Blocked storage getter');}});assert.equal(saveTimeTrialRecords(records),false);assert.match(loadTimeTrialRecords().warning,/session/);}
  finally{if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else delete (globalThis as {localStorage?:Storage}).localStorage;}
});

test('hundredths formatting handles minute carry, zero, invalid values and honest sub-hundredth improvements',()=>{
  for(const [value,expected]of [[0,'0:00.00'],[31.123456789,'0:31.12'],[59.999,'1:00.00'],[125.6,'2:05.60'],[86400,'1440:00.00'],[null,'—'],[NaN,'—'],[Infinity,'—'],[-1,'—']] as const)
    assert.equal(formatTrialTime(value),expected);
  assert.equal(formatTrialDelta(-1.236),'−1.24s');assert.equal(formatTrialDelta(2.125),'+2.13s');assert.equal(formatTrialDelta(0),'EVEN');
  assert.equal(formatTrialDelta(.0001),'<0.01s SLOWER');assert.equal(formatTrialDelta(-.0001),'<0.01s FASTER');assert.equal(formatTrialDelta(null),'—');
});
