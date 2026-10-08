import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {COURSE_NAMES} from '../src/course-id';
import * as G from '../src/trial-ghost';
import {timeTrialBest,type TimeTrialConfig} from '../src/time-trial';
import {exportSave,readSave,SAVE_KEYS} from '../src/save-backup';
const config:TimeTrialConfig={kind:'tern',course:'cinderbank-oval-v1',direction:'forward'};
function lap(c=config):G.TrialGhost{return{version:1,config:{...c},time:24,gates:Array.from({length:24},(_,i)=>i+1),frames:Array.from({length:241},(_,i)=>[i/10,i/10,1,0,0,0,0,1])};}
const library=():G.GhostLibrary=>({version:1,enabled:true,ghosts:[lap()]});
test('all 144 categories export/import precise frames and gates, including names and reverse direction',async()=>{
 let count=0;
 for(const kind of CAR_KINDS)for(const course of Object.keys(COURSE_NAMES))for(const direction of ['forward','reverse'] as const){
  const ghost=lap({kind,course:course as TimeTrialConfig['course'],direction});
  const text=await G.exportTrialGhost(ghost,'Racer <&> 🏁');
  assert.deepEqual(await G.importTrialGhost(text),{name:'Racer <&> 🏁',ghost});count++;
 }
 assert.equal(count,144);
});
test('tampered/truncated/oversized or malformed ghost files cannot become rivals',async()=>{
 const text=await G.exportTrialGhost(lap(),'Driver');
 for(const mutate of [(v:any)=>v.ghost.time=25,(v:any)=>v.ghost.frames[1][1]+=2,(v:any)=>v.ghost.gates.pop(),(v:any)=>v.ghost.config.direction='opposing',(v:any)=>v.name='Other',(v:any)=>v.checksum='0'.repeat(64)]){
  const bad=JSON.parse(text);mutate(bad);await assert.rejects(G.importTrialGhost(JSON.stringify(bad)));
 }
 for(const bad of [text.slice(0,-1),' '.repeat(G.MAX_SHARED_GHOST_BYTES+1),'null','{}'])await assert.rejects(G.importTrialGhost(bad));
 await assert.rejects(G.exportTrialGhost(lap(),'a'.repeat(33)));await assert.rejects(G.exportTrialGhost(lap(),'A\nB'));
});
test('shared rivals never change personal records/ghosts and only match their full category',async()=>{
 const original=library(),before=JSON.stringify(original),records={version:1 as const,bests:{'cinderbank-oval-v1:tern:forward':24}};
 const fast=lap();fast.time=12;fast.frames=fast.frames.map(f=>[f[0]/2,...f.slice(1)] as G.GhostFrame);fast.gates=fast.gates.map(t=>t/2);
 const rival=await G.importTrialGhost(await G.exportTrialGhost(fast,'Fast friend'));
 const shared=G.addSharedGhost(original,rival);rival.ghost.frames[0][1]=999;
 assert.equal(JSON.stringify(original),before);assert.equal(timeTrialBest(records,config),24);assert.deepEqual(shared.ghosts,original.ghosts);
 assert.equal(G.findTrialGhost(shared,config,24)?.time,24);assert.equal(G.raceTrialGhost(shared,config,24)?.ghost.time,12);
 assert.equal(G.raceTrialGhost(shared,{...config,direction:'reverse'},24),null);
 assert.equal(G.raceTrialGhost(shared,config,24)?.ghost.frames[0][1],0,'owned copy');
 assert.equal(G.raceTrialGhost({...shared,target:undefined},config,24)?.ghost.time,24);
 const result={status:'finished' as const,eligible:true,reason:'',time:23,previousBest:24,best:23,delta:-1,newBest:true};
 const next=G.settleTrialGhost(shared,config,result,null);assert.deepEqual(next.shared,shared.shared);assert.equal(next.target,'shared');
 assert.equal(G.raceTrialGhost(next,config,23)?.ghost.time,12);
 assert.equal(G.sharedTrialGhost(G.removeSharedGhost(shared,config),config),null);
});
test('shared library bounds, replacement and read validation preserve personal ghost storage',()=>{
 let shared=library();
 for(const kind of CAR_KINDS)shared=G.addSharedGhost(shared,{name:kind,ghost:lap({...config,kind})});
 assert.equal(shared.shared?.length,8);assert.deepEqual(shared.ghosts,library().ghosts);
 shared=G.addSharedGhost(shared,{name:'replacement',ghost:lap({...config,kind:'shuttle'})});assert.equal(shared.shared?.length,8);
 assert.equal(G.sharedTrialGhost(shared,{...config,kind:'shuttle'})?.name,'replacement');
 assert.deepEqual(G.readGhostLibrary(JSON.stringify(shared)),shared);
 assert.deepEqual(G.readGhostLibrary(JSON.stringify({...shared,shared:[{name:'bad',ghost:{}},shared.shared![0],shared.shared![0]]})).shared,[shared.shared![0]]);
 const bloated=library();bloated.ghosts=Array.from({length:16},()=>({...lap(),frames:Array.from({length:6001},(_,i)=>[i/10,1000.1234,1000.1234,1000.1234,0,0,0,1] as G.GhostFrame)}));
 const before=JSON.stringify(bloated);assert.throws(()=>G.addSharedGhost(bloated,{name:'Friend',ghost:lap()}),/storage is full/);assert.equal(JSON.stringify(bloated),before);
 assert.equal(G.saveGhostLibrary(shared,{setItem(){throw Error('quota');}}),false);
});
test('old signed save shape stays unchanged and new shared opponents survive portable backup',async()=>{
 const values=new Map<string,string>();const storage={getItem:(key:string)=>values.get(key)??null};
 values.set(G.TRIAL_GHOST_KEY,JSON.stringify(library()));
 const old=await exportSave(storage,'2026-10-08T10:00:00Z'),oldEntries=(await readSave(old)).entries;
 assert.deepEqual(G.readGhostLibrary(oldEntries[G.TRIAL_GHOST_KEY]),library());
 assert.equal(Object.hasOwn(JSON.parse(oldEntries[G.TRIAL_GHOST_KEY]!), 'shared'),false);
 const shared=G.addSharedGhost(library(),{name:'Friend',ghost:lap()});values.set(G.TRIAL_GHOST_KEY,JSON.stringify(shared));
 const backup=await readSave(await exportSave(storage));assert.deepEqual(G.readGhostLibrary(backup.entries[G.TRIAL_GHOST_KEY]),shared);
 assert.equal(Object.keys(backup.entries).length,SAVE_KEYS.length);
});
