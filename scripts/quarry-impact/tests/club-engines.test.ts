import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules';
import {GRID_LINEUPS,gridPool,type GridLineup} from '../src/grid-rules';
import {classEligible,performanceRating,type ClassLimit} from '../src/performance-class';
import {CLUB_CUP_KEY,CLUB_SERIES,clubVehicleSetup,clubRoster,createClubCup,readClubCup,beginClubRound,finishClubRound,clubRounds,type ClubCupState} from '../src/club-cup';
import {CLUB_RECORDS_KEY,clubRecordKey,readClubRecords,recordClubFinish} from '../src/club-records';
import {exportSave,readSave} from '../src/save-backup';
import {readProfile} from '../src/progression';
import {awardCareerPodiums} from '../src/career';
const id='08f09f83-cd9e-4db9-972e-3d99bd654578';
const limits=['D','C','B'] as const;
const lineups=Object.keys(GRID_LINEUPS) as GridLineup[];
function complete(cup:ClubCupState){for(const r of clubRounds(cup)){cup=beginClubRound(cup);cup=finishClubRound(cup,cup.roster.map(c=>({slot:c.slot,status:r.mode==='race'?'finished':'survived',finishTime:r.mode==='race'?60+c.slot:null,health:100-c.slot,progress:24*r.laps,damage:0})));}return cup;}

test('class-matched cups retain every intended model and eligible stock chassis engines',()=>{
 for(const kind of CAR_KINDS)for(const limit of limits)for(const lineup of lineups){const cup=createClubCup(kind,id,0,'club','novice',lineup,24,limit,'class-v1');assert.deepEqual(new Set(cup.roster.map(r=>r.kind)),new Set([kind,...gridPool(kind,lineup)]));assert.equal(cup.roster[0].kind,kind);assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);for(const r of cup.roster){const setup=clubVehicleSetup(cup,r.kind)!;assert.ok(classEligible(r.kind,setup,limit));assert.equal(setup.tires,0);assert.equal(setup.armor,0);}}
 const legacy=createClubCup('shuttle',id,0,'club','novice','mixed',24,'D');assert.equal(new Set(legacy.roster.map(r=>r.kind)).size,1);assert.equal(clubVehicleSetup(legacy,'shuttle'),undefined);assert.deepEqual(readClubCup(JSON.stringify(legacy)),legacy);
});
test('policy survives interrupted rounds and signed backups; records stay separate without duplicating career rewards',async()=>{
 let records=readClubRecords();for(const policy of [undefined,'class-v1']as const){const cup=complete(createClubCup('shuttle',id,0,'club','novice','mixed',24,'D',policy));records=recordClubFinish(records,cup);const saved=await readSave(await exportSave({getItem:k=>k===CLUB_CUP_KEY?JSON.stringify(cup):k===CLUB_RECORDS_KEY?JSON.stringify(records):null}));assert.deepEqual(readClubCup(saved.entries[CLUB_CUP_KEY]),cup);assert.deepEqual(readClubRecords(saved.entries[CLUB_RECORDS_KEY]),records);}
 assert.equal(records.best.length,2);const original=clubRecordKey('club','novice','mixed','shuttle',24,'D');assert.notEqual(original,clubRecordKey('club','novice','mixed','shuttle',24,'D','class-v1'));const profile=readProfile();assert.equal(awardCareerPodiums(profile,{version:1,best:[records.best[0]]}),3);const before=structuredClone(profile);assert.equal(awardCareerPodiums(profile,records),0);assert.deepEqual(profile,before);
 const running=beginClubRound(createClubCup('coupe',id,0,'club','novice','mixed',24,'D','class-v1'));assert.deepEqual(readClubCup(JSON.stringify(running)),running);
 for(const enginePolicy of ['bad',null,1])assert.equal(readClubCup(JSON.stringify({...running,enginePolicy})),null);assert.equal(readClubCup(JSON.stringify({...running,classLimit:undefined})),null);
 const forged=structuredClone(running)as any;forged.roster[1].kind='coupe';assert.equal(readClubCup(JSON.stringify(forged)),null);
});
