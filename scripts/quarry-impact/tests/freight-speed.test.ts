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

test('all 59 existing challenges, 16 career groups and eleven championship schedules remain exact',()=>{
 assert.equal(hash(CHALLENGES.slice(0,59)),'6c7d31d775346744f61ae92383f22ebdcbeba158ab21fa502b7fdf79a854ba82');
 assert.equal(hash(CAREER_GROUPS.slice(0,16)),'fef4e383f75b6c5b58dc24aefc271118cc3c81859a9ccd74541321e13dff54d4');
 assert.equal(hash(CLUB_SERIES.slice(0,11)),'1c5da068f4725f05a0f63ac1e01ac0bb204e61bc5e12eb65891169287dee05f8');
 assert.deepEqual(CAREER_SERIES,CLUB_SERIES.map(s=>s.id));
});

test('Freight & Speed portable saves retain every interrupted round, standings, records and spent podium points',async()=>{
 for(const field of [2,11,24]){
  let cup=createClubCup('regent','08f09f83-cd9e-4db9-972e-3d99bd654578',100,'freight-speed','novice','mixed',field);
  assert.deepEqual(clubRounds(cup).map(r=>[r.course,r.direction]),[['rookvale-yard-v1','forward'],['elmsworth-speedway-v1','forward'],['rookvale-yard-v1','forward'],['elmsworth-speedway-v1','reverse']]);
  for(const round of clubRounds(cup)){
   cup=beginClubRound(cup);
   const interrupted=await readSave(await exportSave({getItem:key=>key===CLUB_CUP_KEY?JSON.stringify(cup):null}));
   assert.deepEqual(readClubCup(interrupted.entries[CLUB_CUP_KEY]),cup);
   cup=finishClubRound(cup,cup.roster.map(r=>({slot:r.slot,status:'finished',finishTime:60+r.slot,health:100-r.slot,progress:(round.race?6:24)*round.laps,damage:r.slot})));
   assert.equal(cup.results.length,round.index+1);
  }
  const records=recordClubFinish(readClubRecords(),cup),profile=readProfile();
  assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
  const unlocked=unlockCareerGroup(profile,'freight-runners')!;assert.ok(unlocked);assert.equal(careerStatus(unlocked).available,0);
  const entries={[CLUB_CUP_KEY]:JSON.stringify(cup),[CLUB_RECORDS_KEY]:JSON.stringify(records),[PROFILE_KEY]:JSON.stringify(unlocked)};
  const restored=await readSave(await exportSave({getItem:key=>entries[key]??null}));
  assert.deepEqual(readClubCup(restored.entries[CLUB_CUP_KEY]),cup);assert.deepEqual(readClubRecords(restored.entries[CLUB_RECORDS_KEY]),records);assert.deepEqual(readProfile(restored.entries[PROFILE_KEY]),unlocked);
  assert.equal(awardCareerPodiums(unlocked,records),0);assert.equal(careerStatus(unlocked).available,0);
 }
});

test('waypoint challenge medals require all stations, a living finish, the time limit and no recovery',()=>{
 for(const c of CHALLENGES.filter(c=>c.race)){
  const run={...emptyRun(),seconds:c.medals[2],health:100,checkpoints:6,finished:true,completed:true};assert.equal(challengeMedal(c,run),3);
  for(const patch of [{checkpoints:5},{finished:false},{completed:false},{recovered:true},{health:0},{seconds:c.limit+1}])assert.equal(challengeMedal(c,{...run,...patch}),0);
  const course=getRaceCourse(c.course!),a=new WaypointRace(c.race!,1,c.seed!,course.checkpoints,course.waypointStations),b=new WaypointRace(c.race!,1,c.seed!,course.checkpoints,course.waypointStations);
  const order:number[]=[];for(let i=0;i<6;i++){assert.deepEqual(a.available(0),b.available(0));const id=a.available(0)[0];order.push(id);a.sample(0,a.stations[id]);b.sample(0,b.stations[id]);}assert.ok(a.get(0).finished);assert.equal(new Set(order).size,6);
 }
});
