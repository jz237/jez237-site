import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUB_KINDS,CLUB_SERIES,CLUB_ROUNDS,clubRoster,clubRounds,createClubCup,beginClubRound,finishClubRound,readClubCup,clubStandings,replayCupAwards,type ClubSeriesId,type ClubCupState} from '../src/club-cup';
import {GRID_LINEUPS,gridPool,type GridLineup} from '../src/grid-rules';
import {recordClubFinish,readClubRecords,clubRecordKey} from '../src/club-records';
import {readProfile} from '../src/progression';
import {SessionTelemetry} from '../src/session-telemetry';
import {getRaceCourse,courseGridSlot} from '../src/race-course';
const id='08f09f83-cd9e-4db9-972e-3d99bd654578';
const rules=Object.keys(GRID_LINEUPS) as GridLineup[];
function complete(cup:ClubCupState){
 for(const round of clubRounds(cup)){
  const run=new SessionTelemetry().stats;Object.assign(run,{seconds:80,distance:1200,checkpoints:24*round.laps,damage:10});
  cup=finishClubRound(beginClubRound(cup),cup.roster.map(({slot})=>({slot,status:round.mode==='race'?'finished':'survived',finishTime:round.mode==='race'?80+slot:null,health:100-slot,progress:24*round.laps,damage:10})),run);
 }
 return cup;
}
test('every selected car and restriction creates an exact eligible eleven-car saved field in all five series',()=>{
 let cases=0;
 for(const kind of CLUB_KINDS)for(const lineup of rules)for(const series of CLUB_SERIES){
  const cup=createClubCup(kind,id,1000,series.id,'expert',lineup),pool=gridPool(kind,lineup);
  assert.equal(cup.roster.length,11);assert.equal(cup.roster[0].kind,kind);assert.ok(cup.roster.every(r=>pool.includes(r.kind)));assert.deepEqual(cup.roster,clubRoster(kind,lineup));
  assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);assert.deepEqual(readClubCup(JSON.stringify(beginClubRound(cup))),beginClubRound(cup));
  const finished=complete(cup);assert.equal(finished.phase,'complete');assert.equal(clubStandings(finished)[0].points,25*series.rounds.length);assert.deepEqual(readClubCup(JSON.stringify(finished)),finished);
  const profile=readProfile();replayCupAwards(profile,finished);const before=JSON.stringify(profile);assert.ok(replayCupAwards(profile,finished).every(a=>a.duplicate));assert.equal(JSON.stringify(profile),before);cases++;
 }
 assert.equal(cases,220);
});
test('legacy mixed rosters and schedules stay exact; malformed restrictions and substituted entrants are rejected',()=>{
 for(const kind of CLUB_KINDS){const cup=createClubCup(kind,id,0);assert.equal(cup.lineup,undefined);assert.equal(cup.series,undefined);assert.equal(clubRounds(cup),CLUB_ROUNDS);assert.deepEqual(cup.roster,CLUB_KINDS.map((_,slot)=>({slot,kind:CLUB_KINDS[(CLUB_KINDS.indexOf(kind)+slot)%11]})));}
 const cup=createClubCup('tern',id,0,'dirt','novice','drivetrain');assert.ok(cup.roster.every(r=>r.kind==='tern'));
 for(const patch of [{lineup:'bad'},{lineup:null},{lineup:'mixed'},{roster:cup.roster.map((r,i)=>i===3?{...r,kind:'sedan'}:r)},{roster:cup.roster.slice(0,10)}])assert.equal(readClubCup(JSON.stringify({...cup,...patch})),null);
 assert.throws(()=>createClubCup('tern',id,0,'dirt','novice','bad' as GridLineup));
});
test('Dirt & Air drives Bracken then Redbank forward and reverse without changing older schedules',()=>{
 const rounds=CLUB_SERIES.find(s=>s.id==='dirt')!.rounds;assert.equal(rounds.length,3);
 assert.deepEqual(rounds.map(r=>[r.course,r.direction]),[['bracken-rallycross-v1','forward'],['redbank-jump-v1','forward'],['redbank-jump-v1','reverse']]);
 for(const round of rounds){const course=getRaceCourse(round.course);for(let slot=0;slot<11;slot++){const point=courseGridSlot(course,slot,round.direction!);assert.ok([point.x,point.z,point.yaw].every(Number.isFinite));}}
 assert.deepEqual(CLUB_SERIES.slice(0,4).map(s=>s.rounds.length),[3,3,4,5]);assert.equal(CLUB_SERIES.reduce((n,s)=>n+s.rounds.length,0),18);
});
test('restricted records separate selected car and field rule; mixed records keep their legacy identity',()=>{
 let records=readClubRecords();
 for(const kind of ['tern','sedan'] as const)for(const lineup of rules){records=recordClubFinish(records,complete(createClubCup(kind,id,0,'dirt','amateur',lineup)));}
 assert.equal(records.best.length,7);assert.equal(records.best.filter(r=>!r.lineup).length,1);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);
 const repeated=recordClubFinish(records,complete(createClubCup('tern',id,0,'dirt','amateur','weight')));assert.equal(repeated,records);
 for(const bad of [{...records,best:[...records.best,records.best[0]]},{version:1,best:[{...records.best[0],lineup:'bad'}]},{version:1,best:[{...records.best[0],points:76}]}])assert.deepEqual(readClubRecords(JSON.stringify(bad)),{version:1,best:[]});
 const keys=new Set<string>();for(const series of CLUB_SERIES)for(const difficulty of ['novice','amateur','expert'] as const)for(const kind of CLUB_KINDS)for(const lineup of rules)keys.add(clubRecordKey(series.id,difficulty,lineup,kind));assert.equal(keys.size,510);
 const all={version:1,best:[...keys].map(key=>{const [series,difficulty,lineup,kind]=key.split(':');return{series,difficulty,kind:kind??'tern',place:1,points:0,wins:0,...(lineup?{lineup}:{})};})};assert.equal(readClubRecords(JSON.stringify(all)).best.length,510);
});
