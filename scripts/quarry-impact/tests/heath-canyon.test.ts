import {emptyRun} from '../src/session-telemetry';
import {WaypointRace} from '../src/waypoint-race';
import {getRaceCourse} from '../src/race-course';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {CHALLENGES,challengeMedal} from '../src/challenges';
import {CAREER_GROUPS,CAREER_SERIES,awardCareerPodiums,careerStatus,unlockCareerGroup} from '../src/career';
import {CLUB_SERIES,CLUB_CUP_KEY,createClubCup,beginClubRound,finishClubRound,readClubCup,clubRounds} from '../src/club-cup';
import {CLUB_RECORDS_KEY,readClubRecords,recordClubFinish} from '../src/club-records';
import {PROFILE_KEY,readProfile} from '../src/progression';
import {exportSave,readSave} from '../src/save-backup';
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('all 65 existing challenges, 18 career groups and twelve championship schedules remain exact',()=>{
 assert.equal(hash(CHALLENGES.slice(0,65)),'de089d8329d2b5d2d4313fa06d54d574c9edaab9f48eb7576c6b2b9e6592e25e');
 assert.equal(hash(CAREER_GROUPS.slice(0,18)),'531f5d4b5fcc005d3a93ddfa3777259ecde75ce241fb95f03f4efc7319729b23');
 assert.equal(hash(CLUB_SERIES.slice(0,12)),'1ca296dcfd9eb3ce901c5dbc6cffbc3ef0fa3868474db689cc74b43f6d99bfaf');
 assert.deepEqual(CAREER_SERIES,CLUB_SERIES.map(s=>s.id));
});

test('Heath & Canyon portable saves retain every interrupted round, standings, records and spent podium points',async()=>{
 for(const field of [2,11,24]){
  let cup=createClubCup('regent','08f09f83-cd9e-4db9-972e-3d99bd654578',100,'heath-canyon','novice','mixed',field);
  assert.deepEqual(clubRounds(cup).map(r=>[r.course,r.direction]),[['sable-canyon-v1','forward'],['willowbank-heath-v1','forward'],['sable-canyon-v1','reverse'],['willowbank-heath-v1','reverse']]);
  for(const round of clubRounds(cup)){
   cup=beginClubRound(cup);
   const interrupted=await readSave(await exportSave({getItem:key=>key===CLUB_CUP_KEY?JSON.stringify(cup):null}));
   assert.deepEqual(readClubCup(interrupted.entries[CLUB_CUP_KEY]),cup);
   cup=finishClubRound(cup,cup.roster.map(r=>({slot:r.slot,status:'finished',finishTime:60+r.slot,health:100-r.slot,progress:(round.race?6:24)*round.laps,damage:r.slot})));
   assert.equal(cup.results.length,round.index+1);
  }
  const records=recordClubFinish(readClubRecords(),cup),profile=readProfile();
  assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
  const unlocked=unlockCareerGroup(profile,'canyon-crossers')!;assert.ok(unlocked);assert.equal(careerStatus(unlocked).available,0);
  const entries={[CLUB_CUP_KEY]:JSON.stringify(cup),[CLUB_RECORDS_KEY]:JSON.stringify(records),[PROFILE_KEY]:JSON.stringify(unlocked)};
  const restored=await readSave(await exportSave({getItem:key=>entries[key]??null}));
  assert.deepEqual(readClubCup(restored.entries[CLUB_CUP_KEY]),cup);assert.deepEqual(readClubRecords(restored.entries[CLUB_RECORDS_KEY]),records);assert.deepEqual(readProfile(restored.entries[PROFILE_KEY]),unlocked);
  assert.equal(awardCareerPodiums(unlocked,records),0);assert.equal(careerStatus(unlocked).available,0);
 }
});

test('new lap medals require the complete declared route, a living finish, retained condition and no recovery',()=>{
 for(const c of CHALLENGES.slice(65)){
  const run={...emptyRun(),seconds:c.medals[2],health:100,checkpoints:24*c.laps!,finished:true,completed:true};assert.equal(challengeMedal(c,run),3);
  for(const patch of [{checkpoints:run.checkpoints-1},{finished:false},{completed:false},{recovered:true},{health:c.minHealth!-1},{health:0},{seconds:c.limit+1}])assert.equal(challengeMedal(c,{...run,...patch}),0);
  assert.equal(challengeMedal(c,{...run,seconds:c.medals[1]}),2);assert.equal(challengeMedal(c,{...run,seconds:c.medals[0]}),1);
 }
});
