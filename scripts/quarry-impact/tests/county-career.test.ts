import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {CHALLENGES,challengeMedal,challengeCourse} from '../src/challenges';
import {CAREER_GROUPS,careerStatus,unlockCareerGroup,careerChallenge} from '../src/career';
import {PROFILE_KEY,readProfile,settleRun} from '../src/progression';
import {COURSE_NAMES} from '../src/course-id';
import {emptyRun} from '../src/session-telemetry';
import {exportSave,readSave} from '../src/save-backup';

test('the published 38 events remain byte-equivalent in the expanded catalogue',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(CHALLENGES.slice(0,38))).digest('hex'),'fbd550eab946fe1c5a392bcef05402081d2d5a9a51c4efb65b785f568ee761b3');
 const career=CAREER_GROUPS.flatMap(g=>g.events).map(id=>CHALLENGES.find(c=>c.id===id)!);
 assert.deepEqual(new Set(career.map(challengeCourse)),new Set(Object.keys(COURSE_NAMES)));
 assert.ok(career.some(c=>c.car==='shuttle'));
});
test('new medals require every lap, deadline and condition; recoveries and incomplete runs cannot earn them',()=>{
 for(const c of CHALLENGES.slice(38)){
  const run={...emptyRun(),completed:true,finished:true,seconds:c.medals[2],health:100,checkpoints:c.laps!*24,rank:1};
  assert.equal(challengeMedal(c,run),3,c.id);
  for(const patch of [{seconds:c.limit+1},{checkpoints:c.laps!*24-1},{finished:false},{completed:false},{recovered:true},...(c.minHealth?[{health:c.minHealth-1}]:[])])assert.equal(challengeMedal(c,{...run,...patch}),0,c.id+JSON.stringify(patch));
 }
});
test('old earned medals and purchased groups survive; both new groups unlock and save without duplicate rewards',async()=>{
 const old=readProfile();for(const id of ['first-lap','hatch-sprint','sedan-sprint'])old.challenges[id]={medal:3,best:60,attempts:1};
 let profile=unlockCareerGroup(old,'flight-school')!;
 const original=JSON.stringify(profile);assert.equal(careerStatus(profile).available,6);
 assert.deepEqual(readProfile(original),profile);
 for(const group of CAREER_GROUPS.slice(9)){
  assert.equal(careerChallenge(profile,group.events[0]),undefined);
  profile=unlockCareerGroup(profile,group.id)!;
  for(const id of group.events){
   const c=careerChallenge(profile,id)!;assert.ok(c);
   const run={...emptyRun(),completed:true,finished:true,seconds:c.medals[2],health:100,checkpoints:c.laps!*24,distance:1000,rank:1};
   const before=careerStatus(profile).earned;assert.equal(settleRun(profile,'county-'+id,run,c).medal,3);assert.equal(careerStatus(profile).earned,before+3);
   const saved=JSON.stringify(profile);assert.equal(settleRun(profile,'county-'+id,run,c).duplicate,true);assert.equal(JSON.stringify(profile),saved);
   settleRun(profile,'county-repeat-'+id,run,c);assert.equal(careerStatus(profile).earned,before+3);
  }
 }
 assert.equal(careerStatus(profile).completed,3);assert.equal(careerStatus(profile).available,18);
 const save=await readSave(await exportSave({getItem:key=>key===PROFILE_KEY?JSON.stringify(profile):null}));
 assert.deepEqual(readProfile(save.entries[PROFILE_KEY]),profile);
 assert.deepEqual(profile.challenges['first-lap'],old.challenges['first-lap']);
 assert.ok(profile.career!.unlocked.includes('flight-school'));
});
