import test from'node:test';import assert from'node:assert/strict';
import{awardCareerPodiums,careerEarned,careerStatus,unlockCareerGroup,CAREER_SERIES}from'../src/career';import{readProfile,PROFILE_KEY}from'../src/progression';import{CLUB_SERIES,createClubCup,beginClubRound,finishClubRound,clubRounds,clubStandings,readClubCup}from'../src/club-cup';import{readClubRecords,recordClubFinish,type ClubRecord}from'../src/club-records';import{exportSave,readSave}from'../src/save-backup';
const record=(patch:Partial<ClubRecord>={}):ClubRecord=>({series:'road-rally',difficulty:'novice',kind:'tern',place:3,points:40,wins:0,...patch});
test('championship podiums add only best medal points across difficulty, cars and rules and can unlock a career group',()=>{
 const profile=readProfile();assert.equal(awardCareerPodiums(profile,{version:1,best:[record()]}),1);assert.equal(careerEarned(profile),1);assert.equal(awardCareerPodiums(profile,{version:1,best:[record(),record({difficulty:'expert',lineup:'same-model',kind:'buggy'})]}),0);assert.equal(awardCareerPodiums(profile,{version:1,best:[record({place:1})]}),2);assert.equal(careerEarned(profile),3);
 const next=unlockCareerGroup(profile,'flight-school')!;assert.equal(careerStatus(next).available,0);assert.equal(next.career?.podiums?.['road-rally'],3);assert.deepEqual(readProfile(JSON.stringify(next)),next);assert.equal(awardCareerPodiums(next,{version:1,best:[record({place:2}),record({place:1})]}),0);assert.equal(careerStatus(next).available,0);
});
test('zero-point and non-podium completions do not reward; malformed podium saves cannot mint points',()=>{
 const profile=readProfile();for(const patch of [{points:0,place:1},{place:4},{place:11},{place:NaN},{place:1.5},{points:NaN}])assert.equal(awardCareerPodiums(profile,{version:1,best:[record(patch)]}),0);assert.equal(profile.career,undefined);
 const loaded=readProfile(JSON.stringify({...profile,career:{unlocked:['flight-school'],podiums:{'road-rally':3,club:99,sprint:-1,tour:1.5,unknown:3}}}));assert.deepEqual(loaded.career,{unlocked:['flight-school'],podiums:{'road-rally':3}});assert.equal(careerStatus(loaded).available,0);
});
test('all six championship IDs are career paths; Road & Rally persists its four complete rounds and both Ashford directions',()=>{
 assert.deepEqual(CAREER_SERIES,CLUB_SERIES.map(s=>s.id));let cup=createClubCup('tern','08f09f83-cd9e-4db9-972e-3d99bd654578',100,'road-rally','novice');assert.deepEqual(clubRounds(cup).map(r=>[r.course,r.direction]),[['cinderbank-oval-v1','forward'],['bracken-rallycross-v1','forward'],['ashford-autodrome-v1','forward'],['ashford-autodrome-v1','reverse']]);
 for(let i=0;i<4;i++){cup=finishClubRound(beginClubRound(cup),cup.roster.map(r=>({slot:r.slot,status:'finished',finishTime:60+r.slot,health:100,progress:24,damage:0})));cup=readClubCup(JSON.stringify(cup))!;assert.equal(cup.results.length,i+1);}
 assert.equal(cup.phase,'complete');assert.equal(clubStandings(cup)[0].points,100);const profile=readProfile();assert.equal(awardCareerPodiums(profile,recordClubFinish(readClubRecords(),cup)),3);assert.equal(awardCareerPodiums(profile,recordClubFinish(readClubRecords(),cup)),0);
});
test('career podiums and spent unlocks round-trip through portable saves; older profiles keep their canonical shape',async()=>{
 const old=readProfile();assert.equal(old.career,undefined);const profile=readProfile();awardCareerPodiums(profile,{version:1,best:[record({place:1})]});const next=unlockCareerGroup(profile,'heavy-duty')!;const saved=await readSave(await exportSave({getItem:key=>key===PROFILE_KEY?JSON.stringify(next):null}));assert.deepEqual(readProfile(saved.entries[PROFILE_KEY]),next);assert.equal(careerStatus(readProfile(saved.entries[PROFILE_KEY])).available,0);
});
