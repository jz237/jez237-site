import test from 'node:test';
import assert from 'node:assert/strict';
import {ARENA_NAMES,resolveArenaId} from '../src/arena-id';
import {CLUB_SERIES,createClubCup,beginClubRound,currentClubRound,finishClubRound,readClubCup,clubStandings,replayCupAwards} from '../src/club-cup';
import {recordClubFinish,readClubRecords} from '../src/club-records';
import {awardCareerPodiums,careerStatus} from '../src/career';
import {readProfile} from '../src/progression';
import {SessionTelemetry} from '../src/session-telemetry';
import {CLUB_CUP_KEY} from '../src/club-cup';
import {exportSave,readSave,restoreSave} from '../src/save-backup';

const id='08f09f83-cd9e-4db9-972e-3d99bd654578';
test('a saved demolition tour visits every arena, restarts only interrupted rounds and settles exact whole-field standings',()=>{
 for(const field of [2,11,24]){
  let cup=createClubCup('regent',id,1000,'demolition-tour','amateur','mixed',field);
  const visited:string[]=[],profile=readProfile();
  while(currentClubRound(cup)){
   cup=beginClubRound(cup);const before=JSON.stringify(cup);
   cup=readClubCup(before)!;assert.ok(cup);assert.equal(JSON.stringify(beginClubRound(cup)),before);
   const round=currentClubRound(cup)!;visited.push(resolveArenaId(round.arena));
   assert.equal(round.mode,'derby');assert.equal(round.duration,90);
   const rows=cup.roster.map(({slot})=>({slot,status:slot===field-1?'wrecked' as const:'survived' as const,finishTime:null,health:slot===field-1?0:100-slot,progress:0,damage:slot*2}));
   const stats=new SessionTelemetry().stats;Object.assign(stats,{seconds:round.duration,damage:10,health:100,completed:true});
   cup=finishClubRound(cup,rows,stats,round.index);
   assert.deepEqual(finishClubRound(cup,rows,stats,round.index),cup);
   assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);
   replayCupAwards(profile,cup);const saved=JSON.stringify(profile);replayCupAwards(profile,cup);assert.equal(JSON.stringify(profile),saved);
  }
  assert.deepEqual(visited,Object.keys(ARENA_NAMES));assert.equal(cup.phase,'complete');
  assert.deepEqual(clubStandings(cup)[0],{slot:0,kind:'regent',points:100,wins:4,place:1});
  const records=recordClubFinish(readClubRecords(),cup);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);
  assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
  const restored=readProfile(JSON.stringify(profile));assert.equal(careerStatus(restored).available,3);
  assert.equal(awardCareerPodiums(restored,records),0);
 }
});
test('legacy derby rounds keep Quarry and new tour saves cannot substitute an arena or reorder results',()=>{
 for(const series of CLUB_SERIES.filter(s=>s.id!=='demolition-tour'))for(const round of series.rounds.filter(r=>r.mode==='derby'))assert.equal(resolveArenaId(round.arena),'quarry-arena-v1');
 const cup=createClubCup('sedan',id,0,'demolition-tour','expert','selected',2);
 assert.equal(readClubCup(JSON.stringify({...cup,arena:'foundry-yard-v1'})),null);
 const result=finishClubRound(beginClubRound(cup),[{slot:0,status:'retired',finishTime:null,health:90,progress:0,damage:50},{slot:1,status:'survived',finishTime:null,health:10,progress:0,damage:2}]);
 assert.equal(result.results[0].rows.find(r=>r.slot===0)!.points,0);
 assert.equal(result.results[0].rows[0].slot,1);
 assert.equal(readClubCup(JSON.stringify({...result,results:[{...result.results[0],round:'foundry-survival'}]})),null);
 assert.equal(currentClubRound(result)!.arena,'harrow-bowl-v1');
});
test('portable backup preserves the exact interrupted arena tour and prior results',async()=>{
 let cup=createClubCup('tern',id,0,'demolition-tour','expert','selected',2);
 cup=finishClubRound(beginClubRound(cup),cup.roster.map(({slot})=>({slot,status:'survived',finishTime:null,health:80-slot,progress:0,damage:25+slot})));
 cup=beginClubRound(cup);
 const data=new Map([[CLUB_CUP_KEY,JSON.stringify(cup)]]),source={getItem:(key:string)=>data.get(key)??null};
 const backup=await readSave(await exportSave(source)),targetData=new Map<string,string>();
 await restoreSave({getItem:(key:string)=>targetData.get(key)??null,setItem:(key:string,value:string)=>{targetData.set(key,value);},removeItem:(key:string)=>{targetData.delete(key);}},backup);
 const restored=readClubCup(targetData.get(CLUB_CUP_KEY));assert.deepEqual(restored,cup);
 assert.equal(currentClubRound(restored!)!.arena,'harrow-bowl-v1');
});
