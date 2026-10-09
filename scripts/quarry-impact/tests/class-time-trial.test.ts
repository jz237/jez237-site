import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {COURSE_NAMES,type CourseId} from '../src/course-id';
import {stockSetup,normalizeSetup,importSetup,exportSetup} from '../src/garage';
import {emptyRun} from '../src/session-telemetry';
import * as Trial from '../src/time-trial';
import * as Ghost from '../src/trial-ghost';
import {exportSave,readSave} from '../src/save-backup';
const base={kind:'trail' as const,course:'millbrook-canal-v1' as const,direction:'forward' as const};
const config=Trial.classTimeTrial(base,normalizeSetup({...stockSetup('trail'),engine:2,tires:2,armor:1,tune:{gearing:.5,compression:-.3}},'trail'));
const evidence=(c:Trial.TimeTrialConfig,seconds=60):Trial.TimeTrialEvidence=>({run:{...emptyRun(),seconds,health:80,checkpoints:24,finished:true,completed:true},finished:true,health:80,passed:24,finishTime:seconds,demo:false,online:false,synthetic:false,stock:!c.performanceClass,selectionMatches:true,setup:Trial.timeTrialSetup(c)});
const lap=(c:Trial.TimeTrialConfig):Ghost.TrialGhost=>({version:1,config:Trial.copyTimeTrialConfig(c),time:24,gates:Array.from({length:24},(_,i)=>i+1),frames:Array.from({length:241},(_,i)=>[i/10,i/10,1,0,0,0,0,1])});

test('stock and class categories are independent; faster class records retain the exact winning performance setup',()=>{
 const initial=Trial.finishTimeTrialRecord(Trial.readTimeTrialRecords(),base,evidence(base,70)).records;
 const good=Trial.finishTimeTrialRecord(initial,config,evidence(config));assert.ok(good.result.eligible&&good.result.newBest);assert.equal(Trial.timeTrialBest(good.records,base),70);
 const key=Trial.timeTrialKey(config);assert.equal(good.records.builds![key].engine,2);assert.equal(good.records.builds![key].tune.compression,-.3);
 const slower=Trial.classTimeTrial(base,{...config.setup!,tune:{...config.setup!.tune,gearing:-.8}});
 assert.equal(Trial.timeTrialKey(slower),key);assert.deepEqual(Trial.finishTimeTrialRecord(good.records,slower,evidence(slower,65)).records,good.records);
 const fast=Trial.finishTimeTrialRecord(good.records,slower,evidence(slower,55));assert.equal(fast.records.builds![key].tune.gearing,-.8);
 assert.equal(Trial.timeTrialBest(fast.records,base),70);assert.equal(Trial.timeTrialBest(fast.records,{...slower,direction:'reverse'}),null);
 const restored=importSetup(exportSetup(slower.kind,fast.records.builds![key]),slower.kind);assert.deepEqual(restored,fast.records.builds![key]);
});

test('class eligibility requires matching car/course/build evidence, manual driving and the complete unrecovered live lap',()=>{
 for(const change of [(e:Trial.TimeTrialEvidence)=>e.selectionMatches=false,(e:Trial.TimeTrialEvidence)=>delete e.setup,(e:Trial.TimeTrialEvidence)=>e.setup!.engine=0,(e:Trial.TimeTrialEvidence)=>e.setup!.engine=99,(e:Trial.TimeTrialEvidence)=>e.setup!.tune.gearing=-1,(e:Trial.TimeTrialEvidence)=>e.synthetic=true,(e:Trial.TimeTrialEvidence)=>e.online=true,(e:Trial.TimeTrialEvidence)=>e.demo=true,(e:Trial.TimeTrialEvidence)=>e.run!.recovered=true,(e:Trial.TimeTrialEvidence)=>e.passed=23,(e:Trial.TimeTrialEvidence)=>e.run!.seconds+=1]){
  const e=evidence(config);change(e);const r=Trial.finishTimeTrialRecord(Trial.readTimeTrialRecords(),config,e);assert.equal(r.result.eligible,false);assert.deepEqual(r.records,{version:1,bests:{}});
 }
 assert.equal(Trial.isTimeTrialConfig({...config,performanceClass:config.performanceClass==='A'?'D':'A'}),false);
 assert.equal(Trial.isTimeTrialConfig({...base,setup:config.setup}),false);
 assert.equal(Trial.isTimeTrialConfig({...config,setup:{...config.setup,engine:99}}),false);
 const copy=Trial.copyTimeTrialConfig(config);copy.setup!.tune.gearing=-1;assert.equal(config.setup!.tune.gearing,.5);
});

test('every attainable car/class/course/direction record and recorded build survives bounded storage and signed export',async()=>{
 const records:Trial.TimeTrialRecords={version:1,bests:{},builds:{}};let count=0;
 for(const kind of CAR_KINDS){
  const builds=new Map();for(const engine of [0,1,2,3])for(const tires of [0,3])for(const armor of [0,3]){const c=Trial.classTimeTrial({...base,kind},{...stockSetup(kind),engine,tires,armor});builds.set(c.performanceClass,c.setup);}
  for(const course of Object.keys(COURSE_NAMES) as CourseId[])for(const direction of ['forward','reverse'] as const){
   const stock={kind,course,direction};records.bests[Trial.timeTrialKey(stock)]=40.123456789;
   for(const setup of builds.values()){const c=Trial.classTimeTrial(stock,setup),key=Trial.timeTrialKey(c);records.bests[key]=35.987654321;records.builds![key]=setup;count++;}
  }
 }
 let saved='';assert.ok(Trial.saveTimeTrialRecords(records,{setItem(_k,text){saved=text;}}));assert.ok(saved.length<Trial.TIME_TRIAL_STORE_LIMIT);assert.ok(count>1500);
 assert.deepEqual(Trial.readTimeTrialRecords(saved),records);
 const backup=await readSave(await exportSave({getItem:k=>k===Trial.TIME_TRIAL_KEY?saved:null}));assert.deepEqual(Trial.readTimeTrialRecords(backup.entries[Trial.TIME_TRIAL_KEY]),records);
 const corrupt=structuredClone(records);delete corrupt.builds![Object.keys(corrupt.builds!)[0]];assert.equal(Trial.saveTimeTrialRecords(corrupt,{setItem(){throw Error('Must reject before writing');}}),false);
 assert.equal(Object.keys(Trial.readTimeTrialRecords(JSON.stringify(corrupt)).bests).length,Object.keys(records.bests).length-1,'Bad class metadata cannot destroy neighboring or stock PBs');
});

test('local class boards compare cars while excluding stock, other classes, other directions and unverified shared laps',()=>{
 let records=Trial.readTimeTrialRecords();
 for(const kind of ['trail','wagon','regent'] as const){const c=Trial.classTimeTrial({...base,kind},stockSetup(kind));records=Trial.finishTimeTrialRecord(records,c,evidence(c,kind==='wagon'?40:50)).records;}
 const selected=Trial.classTimeTrial(base,stockSetup('trail')),rows=Trial.timeTrialLeaderboard(records,selected);assert.equal(rows.length,3);assert.equal(rows[0].kind,'wagon');assert.ok(rows.every(r=>r.points<=164));
 assert.equal(Trial.timeTrialLeaderboard(records,{...selected,direction:'reverse'}).length,0);assert.equal(Trial.timeTrialLeaderboard(records,base).length,0);
 const stored=JSON.stringify(records);Ghost.addSharedGhost(Ghost.readGhostLibrary(),{name:'Rival',ghost:lap(selected)});assert.equal(JSON.stringify(records),stored);
});

test('class ghosts retain their actual build through exchange and signed saves without crossing stock/class categories',async()=>{
 const g=lap(config),shared=await Ghost.importTrialGhost(await Ghost.exportTrialGhost(g,'Class driver'));assert.deepEqual(shared.ghost,g);
 let library=Ghost.readGhostLibrary();library=Ghost.addSharedGhost(library,shared);assert.equal(Ghost.sharedTrialGhost(library,base),null);assert.deepEqual(Ghost.sharedTrialGhost(library,config),shared);
 const other=Trial.classTimeTrial(base,stockSetup('trail'));assert.notEqual(other.performanceClass,config.performanceClass);assert.equal(Ghost.sharedTrialGhost(library,other),null);
 const portable=await readSave(await exportSave({getItem:k=>k===Ghost.TRIAL_GHOST_KEY?JSON.stringify(library):null}));assert.deepEqual(Ghost.readGhostLibrary(portable.entries[Ghost.TRIAL_GHOST_KEY]),library);
 const bad=JSON.parse(await Ghost.exportTrialGhost(g,'Class driver'));bad.ghost.config.setup.tune.gearing=-1;await assert.rejects(Ghost.importTrialGhost(JSON.stringify(bad)),/checksum/);
});
