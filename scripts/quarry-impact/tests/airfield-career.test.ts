import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {CHALLENGES} from '../src/challenges';
import {CAREER_GROUPS,CAREER_SERIES,awardCareerPodiums,careerStatus,unlockCareerGroup} from '../src/career';
import {CLUB_SERIES,CLUB_CUP_KEY,createClubCup,beginClubRound,finishClubRound,readClubCup,clubRounds} from '../src/club-cup';
import {CLUB_RECORDS_KEY,readClubRecords,recordClubFinish} from '../src/club-records';
import {PROFILE_KEY,readProfile} from '../src/progression';
import {exportSave,readSave} from '../src/save-backup';
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('all 47 existing challenges, 12 career groups and eight championship schedules remain exact',()=>{
 assert.equal(hash(CHALLENGES.slice(0,47)),'8c17f6b6756b87f8a764eec2ed16d2acfa753b8347e668afdf2013802232e845');
 assert.equal(hash(CAREER_GROUPS.slice(0,12)),'ee12fd5ed193ec61185019a570f0e1333f582dc80e968e74ef252b13a924f847');
 assert.equal(hash(CLUB_SERIES.slice(0,8)),'73b670dd4b7104f1b57abfd26e73d116f442aed77349a9ad8058757f33b02021');
 assert.deepEqual(CAREER_SERIES,CLUB_SERIES.map(s=>s.id));
});

test('Airfield & Rally portable saves retain every interrupted round, standings, records and spent podium points',async()=>{
 for(const field of [2,11,24]){
  let cup=createClubCup('regent','08f09f83-cd9e-4db9-972e-3d99bd654578',100,'airfield-rally','novice','mixed',field);
  assert.deepEqual(clubRounds(cup).map(r=>[r.course,r.direction]),[['merefield-airfield-v1','forward'],['millhaven-rally-v1','forward'],['merefield-airfield-v1','reverse'],['millhaven-rally-v1','reverse']]);
  for(const round of clubRounds(cup)){
   cup=beginClubRound(cup);
   const interrupted=await readSave(await exportSave({getItem:key=>key===CLUB_CUP_KEY?JSON.stringify(cup):null}));
   assert.deepEqual(readClubCup(interrupted.entries[CLUB_CUP_KEY]),cup);
   cup=finishClubRound(cup,cup.roster.map(r=>({slot:r.slot,status:'finished',finishTime:60+r.slot,health:100-r.slot,progress:24,damage:r.slot})));
   assert.equal(cup.results.length,round.index+1);
  }
  const records=recordClubFinish(readClubRecords(),cup),profile=readProfile();
  assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
  const unlocked=unlockCareerGroup(profile,'airfield-timber')!;assert.ok(unlocked);assert.equal(careerStatus(unlocked).available,0);
  const entries={[CLUB_CUP_KEY]:JSON.stringify(cup),[CLUB_RECORDS_KEY]:JSON.stringify(records),[PROFILE_KEY]:JSON.stringify(unlocked)};
  const restored=await readSave(await exportSave({getItem:key=>entries[key]??null}));
  assert.deepEqual(readClubCup(restored.entries[CLUB_CUP_KEY]),cup);assert.deepEqual(readClubRecords(restored.entries[CLUB_RECORDS_KEY]),records);assert.deepEqual(readProfile(restored.entries[PROFILE_KEY]),unlocked);
  assert.equal(awardCareerPodiums(unlocked,records),0);assert.equal(careerStatus(unlocked).available,0);
 }
});
