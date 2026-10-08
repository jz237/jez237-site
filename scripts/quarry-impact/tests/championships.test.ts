import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUB_SERIES,CLUB_ROUNDS,clubRounds,clubSeries,createClubCup,readClubCup,beginClubRound,currentClubRound,finishClubRound,rankClubRows,clubStandings,replayCupAwards,type ClubRowInput} from '../src/club-cup';
import {readClubRecords,recordClubFinish} from '../src/club-records';
import {readProfile} from '../src/progression';
import {SessionTelemetry} from '../src/session-telemetry';
import {getRaceCourse,courseRoute} from '../src/race-course';
const uuid='08f09f83-cd9e-4db9-972e-3d99bd654578';
function complete(series:typeof CLUB_SERIES[number]['id'],difficulty:'novice'|'amateur'|'expert'='amateur',place=1){
 let cup=createClubCup('buggy',uuid,1000,series,difficulty);
 while(currentClubRound(cup)){
  const round=currentClubRound(cup)!;
  const rows:ClubRowInput[]=cup.roster.map(({slot})=>{const order=slot===0?place-1:slot<place?slot-1:slot;return {slot,status:round.mode==='race'?'finished':'survived',finishTime:round.mode==='race'?80+order:null,health:100-order,progress:24*round.laps,damage:10};});
  const stats=new SessionTelemetry().stats;Object.assign(stats,{seconds:80,distance:1200,checkpoints:24*round.laps,damage:10});
  const running=beginClubRound(cup);cup=finishClubRound(running,rows,stats);
  assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);assert.deepEqual(finishClubRound(cup,rows,stats,round.index),cup);
 }
 return cup;
}
test('four series complete every round with canonical standings, real course routes and recoverable XP',()=>{
 for(const series of CLUB_SERIES)for(const difficulty of ['novice','amateur','expert'] as const){
  for(const round of series.rounds){assert.equal(getRaceCourse(round.course).id,round.course);if(round.mode==='race')assert.equal(courseRoute(getRaceCourse(round.course),round.direction==='reverse'?'reverse':'forward').length,24);}
  const cup=complete(series.id,difficulty);assert.equal(cup.phase,'complete');assert.equal(cup.results.length,series.rounds.length);assert.equal(clubStandings(cup)[0].slot,0);assert.equal(clubStandings(cup)[0].points,25*series.rounds.length);
  const profile=readProfile();assert.equal(replayCupAwards(profile,cup).length,series.rounds.length);const before=JSON.stringify(profile);assert.ok(replayCupAwards(profile,cup).every(a=>a.duplicate));assert.equal(JSON.stringify(profile),before);
  assert.throws(()=>beginClubRound(cup));assert.throws(()=>rankClubRows(cup,[],series.rounds.length));
 }
});
test('legacy original cups keep their schema, schedule and interrupted progress',()=>{
 const cup=createClubCup('tern',uuid,1000);assert.equal(cup.series,undefined);assert.equal(cup.difficulty,undefined);assert.equal(clubSeries(cup).id,'club');assert.equal(clubRounds(cup),CLUB_ROUNDS);
 const running=beginClubRound(cup);assert.deepEqual(readClubCup(JSON.stringify(running)),running);assert.equal(currentClubRound(running)?.index,0);
 for(const patch of [{series:'unknown'},{difficulty:'impossible'},{series:'sprint',phase:'complete'},{results:[{index:0,round:'bracken-circuit',rows:[]}]}])assert.equal(readClubCup(JSON.stringify({...cup,...patch})),null);
});
test('best records are separate by difficulty, survive reload/new cups and do not worsen or duplicate',()=>{
 let records=readClubRecords();records=recordClubFinish(records,complete('sprint','novice',3));assert.equal(records.best[0].place,3);
 records=recordClubFinish(records,complete('sprint','novice',1));const gold=records;
 assert.equal(recordClubFinish(records,complete('sprint','novice',2)),gold);assert.equal(recordClubFinish(records,complete('sprint','novice',1)),gold);
 records=recordClubFinish(records,complete('sprint','expert',2));records=recordClubFinish(records,complete('gauntlet','expert',1));assert.equal(records.best.length,3);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);
 assert.equal(recordClubFinish(records,createClubCup('tern',uuid,0,'tour','novice')),records);
 for(const bad of [{version:2,best:[]},{version:1,best:[...records.best,records.best[0]]},{version:1,best:[{...records.best[0],points:999}]},{version:1,best:[{...records.best[0],kind:'bad'}]}])assert.deepEqual(readClubRecords(JSON.stringify(bad)),{version:1,best:[]});
});
test('new reverse and opposing series persist rules across interrupted round restarts',()=>{
 for(const series of CLUB_SERIES.slice(1)){
  const finished=complete(series.id,'expert');
  for(let index=0;index<series.rounds.length;index++){
   const saved=readClubCup(JSON.stringify({...finished,phase:'running',results:finished.results.slice(0,index)}))!;
   assert.ok(saved);assert.equal(currentClubRound(saved)?.direction,series.rounds[index].direction);assert.equal(currentClubRound(beginClubRound(saved))?.index,index);assert.equal(saved.difficulty,'expert');
  }
 }
});
