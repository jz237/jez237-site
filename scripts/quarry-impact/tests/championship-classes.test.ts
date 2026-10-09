import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {GRID_LINEUPS,gridPool,type GridLineup} from '../src/grid-rules';
import {classEligible,performanceRating,type ClassLimit} from '../src/performance-class';
import {CLUB_CUP_KEY,CLUB_SERIES,clubRoster,createClubCup,readClubCup,beginClubRound,finishClubRound,clubRounds,type ClubCupState} from '../src/club-cup';
import {CLUB_RECORDS_KEY,clubRecordKey,readClubRecords,recordClubFinish} from '../src/club-records';
import {exportSave,readSave} from '../src/save-backup';
import {readProfile} from '../src/progression';
import {awardCareerPodiums} from '../src/career';
const id='08f09f83-cd9e-4db9-972e-3d99bd654578';
const limits=['D','C','B'] as const;
const lineups=Object.keys(GRID_LINEUPS) as GridLineup[];
function complete(cup:ClubCupState){for(const r of clubRounds(cup)){cup=beginClubRound(cup);cup=finishClubRound(cup,cup.roster.map(c=>({slot:c.slot,status:r.mode==='race'?'finished':'survived',finishTime:r.mode==='race'?60+c.slot:null,health:100-c.slot,progress:24*r.laps,damage:0})));}return cup;}

test('class-limited championships intersect all vehicle rules with actual stock ratings at 2, 11 and 24 entrants',()=>{
 for(const kind of CAR_KINDS)for(const limit of limits)for(const lineup of lineups)for(const field of [2,11,24]){
  if(!classEligible(kind,undefined,limit)){assert.throws(()=>createClubCup(kind,id,0,'club','novice',lineup,field,limit),/class limit/);continue;}
  const cup=createClubCup(kind,id,0,'club','novice',lineup,field,limit),pool=gridPool(kind,lineup).filter(k=>classEligible(k,undefined,limit));
  assert.equal(cup.roster.length,field);assert.equal(cup.roster[0].kind,kind);assert.equal(cup.classLimit,limit);
  assert.ok(cup.roster.every(r=>pool.includes(r.kind)));
  if(field===24)assert.deepEqual(new Set(cup.roster.map(r=>r.kind)),new Set(pool),'Every eligible model participates');
  assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);
 }
 assert.equal(performanceRating('shuttle').grade,'D');assert.equal(new Set(clubRoster('shuttle','mixed',24,'D').map(r=>r.kind)).size,1);
});

test('invalid class tags, over-limit entrants and forged restricted rosters cannot load or start',()=>{
 const cup=createClubCup('trail',id,0,'park-dunes-tour','novice','mixed',24,'C');
 for(const classLimit of ['A','open','c',null,1]){
  assert.equal(readClubCup(JSON.stringify({...cup,classLimit})),null);
  assert.throws(()=>createClubCup('trail',id,0,'club','novice','mixed',24,classLimit as ClassLimit));
 }
 const forged=structuredClone(cup) as any;forged.roster[1].kind='coupe';assert.equal(readClubCup(JSON.stringify(forged)),null);
 assert.equal(readClubCup(JSON.stringify({...cup,classLimit:'D'})),null);
});

test('class caps survive every round, signed backup, interrupted reload and completion in every championship',async()=>{
 for(const series of CLUB_SERIES)for(const limit of limits){
  let cup=createClubCup('shuttle',id,0,series.id,'novice','mixed',2,limit);const roster=JSON.stringify(cup.roster);
  for(const round of clubRounds(cup)){
   cup=beginClubRound(cup);
   const backup=await readSave(await exportSave({getItem:k=>k===CLUB_CUP_KEY?JSON.stringify(cup):null}));
   cup=readClubCup(backup.entries[CLUB_CUP_KEY])!;assert.equal(cup.classLimit,limit);assert.equal(JSON.stringify(cup.roster),roster);
   cup=finishClubRound(cup,cup.roster.map(r=>({slot:r.slot,status:round.mode==='race'?'finished':'survived',finishTime:round.mode==='race'?60+r.slot:null,health:100-r.slot,progress:24*round.laps,damage:0})));
  }
  const records=recordClubFinish(readClubRecords(),cup),restored=await readSave(await exportSave({getItem:k=>k===CLUB_CUP_KEY?JSON.stringify(cup):k===CLUB_RECORDS_KEY?JSON.stringify(records):null}));
  assert.equal(cup.phase,'complete');assert.deepEqual(readClubRecords(restored.entries[CLUB_RECORDS_KEY]),records);assert.deepEqual(readClubCup(restored.entries[CLUB_CUP_KEY]),cup);
 }
});

test('open record identities remain unchanged; classes retain separate records without multiplying career podium points',()=>{
 let records=readClubRecords();
 for(const classLimit of [undefined,...limits]){
  const cup=complete(createClubCup('shuttle',id,0,'park-dunes-tour','novice','mixed',24,classLimit));
  records=recordClubFinish(records,cup);assert.equal(recordClubFinish(records,cup),records);
 }
 assert.equal(clubRecordKey('club','amateur','mixed','coupe'), 'club:amateur');
 assert.equal(clubRecordKey('club','amateur','weight','trail',24), 'club:amateur:weight:trail:field-24');
 assert.equal(records.best.length,4);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);
 assert.equal(new Set(records.best.map(r=>clubRecordKey(r.series,r.difficulty,r.lineup,r.kind,r.field,r.classLimit))).size,4);
 const profile=readProfile();assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
 for(const patch of [{classLimit:'A'},{classLimit:null},{classLimit:'D',kind:'coupe'}])assert.equal(readClubRecords(JSON.stringify({version:1,best:[{...records.best[0],...patch}]})).best.length,0);
});
