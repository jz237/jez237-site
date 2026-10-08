import test from 'node:test';import assert from 'node:assert/strict';
import {CLUB_CUP_KEY,CLUB_FIELDS,CLUB_KINDS,CLUB_SERIES,clubRoster,createClubCup,readClubCup,beginClubRound,currentClubRound,finishClubRound,rankClubRows,clubStandings,replayCupAwards,type ClubCupState,type ClubRowInput} from '../src/club-cup';
import {CLUB_RECORDS_KEY,readClubRecords,recordClubFinish,clubRecordKey} from '../src/club-records';
import {CAR_KINDS} from '../src/rules';import {GRID_LINEUPS,gridPool,type GridLineup} from '../src/grid-rules';
import {readProfile} from '../src/progression';import {awardCareerPodiums} from '../src/career';
import {SessionTelemetry} from '../src/session-telemetry';import {exportSave,readSave,restoreSave} from '../src/save-backup';
const id='12345678-1234-4234-8234-123456789abc';
function complete(cup:ClubCupState,last=false){
 while(currentClubRound(cup)){
  const round=currentClubRound(cup)!;
  const rows:ClubRowInput[]=cup.roster.map(({slot})=>{const order=last?(slot+cup.roster.length-1)%cup.roster.length:slot;return {slot,status:round.mode==='race'?'finished':'survived',finishTime:round.mode==='race'?80+order:null,health:100-order,progress:24*round.laps,damage:10};});
  const stats=new SessionTelemetry().stats;Object.assign(stats,{seconds:80,distance:1200,checkpoints:24*round.laps,damage:10,rank:cup.roster.length});
  cup=finishClubRound(beginClubRound(cup),rows,stats);assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);
 }
 return cup;
}
test('every selectable size, vehicle, series and restriction produces a stable eligible saved field',()=>{
 for(const field of CLUB_FIELDS)for(const kind of CAR_KINDS)for(const lineup of Object.keys(GRID_LINEUPS) as GridLineup[])for(const series of CLUB_SERIES){
  const cup=createClubCup(kind,id,0,series.id,'expert',lineup,field),pool=gridPool(kind,lineup);
  assert.equal(cup.roster.length,field);assert.equal(cup.roster[0].kind,kind);assert.ok(cup.roster.every(r=>pool.includes(r.kind)));assert.equal(cup.field,field===11?undefined:field);
  const running=beginClubRound(cup);assert.deepEqual(readClubCup(JSON.stringify(running)),running);
 }
 assert.equal(new Set(clubRoster('coupe','mixed',24).map(r=>r.kind)).size,12);
 for(const kind of CLUB_KINDS)assert.deepEqual(clubRoster(kind).map(r=>r.kind),CLUB_KINDS.map((_,slot)=>CLUB_KINDS[(slot+CLUB_KINDS.indexOf(kind))%11]));
});
test('all series complete with 2 and 24 entrants, whole-field results, honest lower positions and duplicate-safe rewards',()=>{
 for(const field of [2,24])for(const series of CLUB_SERIES){
  const cup=complete(createClubCup('shuttle',id,0,series.id,'novice','mixed',field));assert.equal(cup.phase,'complete');assert.equal(clubStandings(cup).length,field);
  for(const round of cup.results){assert.equal(round.rows.length,field);assert.ok(round.rows.every(r=>Number.isFinite(r.points)));assert.ok(round.rows.slice(11).every(r=>r.points===0));}
  const profile=readProfile();replayCupAwards(profile,cup);const before=JSON.stringify(profile);assert.ok(replayCupAwards(profile,cup).every(r=>r.duplicate));assert.equal(JSON.stringify(profile),before);
  const records=recordClubFinish(readClubRecords(),cup);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);assert.equal(awardCareerPodiums(profile,records),3);assert.equal(awardCareerPodiums(profile,records),0);
 }
 const tail=complete(createClubCup('shuttle',id,0,'sprint','expert','selected',24),true);assert.equal(clubStandings(tail).find(r=>r.slot===0)!.place,12);assert.equal(tail.results[0].runStats!.rank,24);assert.equal(tail.results[0].rows.find(r=>r.slot===0)!.points,0);
});
test('reject truncated, duplicated, out-of-field and mismatched saved results without silently shrinking a cup',()=>{
 const cup=createClubCup('tern',id,0,'club','amateur','selected',24);
 for(const field of [null,1,25,2.5,'24'])assert.equal(readClubCup(JSON.stringify({...cup,field})),null);
 for(const roster of [cup.roster.slice(0,11),[...cup.roster.slice(0,23),cup.roster[0]]])assert.equal(readClubCup(JSON.stringify({...cup,roster})),null);
 for(const field of [1,25,NaN,2.5])assert.throws(()=>createClubCup('coupe',id,0,'club','amateur','mixed',field));
 const rows:ClubRowInput[]=cup.roster.map(({slot})=>({slot,status:'finished',finishTime:80+slot,health:100,progress:48,damage:0}));
 assert.throws(()=>rankClubRows(cup,rows.slice(0,23)));assert.throws(()=>rankClubRows(cup,[...rows.slice(0,23),{...rows[23],slot:24}]));
});
test('record categories separate field sizes, retain legacy keys and accept Shuttle records across reload and portable saves',async()=>{
 let records=readClubRecords();for(const field of [2,11,12,24])records=recordClubFinish(records,complete(createClubCup('shuttle',id,0,'sprint','novice','selected',field)));
 assert.equal(records.best.length,4);assert.deepEqual(readClubRecords(JSON.stringify(records)),records);
 assert.equal(clubRecordKey('club','amateur','mixed','coupe'), 'club:amateur');assert.equal(clubRecordKey('club','amateur','selected','coupe',11),'club:amateur:selected:coupe');
 assert.equal(recordClubFinish(records,complete(createClubCup('shuttle',id,0,'sprint','novice','selected',24))),records);
 for(const patch of [{field:1},{field:25},{field:2,place:3},{field:'24'}])assert.deepEqual(readClubRecords(JSON.stringify({version:1,best:[{...records.best[0],...patch}]})),{version:1,best:[]});
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
 const interrupted=beginClubRound(createClubCup('shuttle',id,0,'club','expert','mixed',24));storage.setItem(CLUB_CUP_KEY,JSON.stringify(interrupted));storage.setItem(CLUB_RECORDS_KEY,JSON.stringify(records));
 const backup=await readSave(await exportSave(storage));data.clear();await restoreSave(storage,backup);assert.deepEqual(readClubCup(storage.getItem(CLUB_CUP_KEY)),interrupted);assert.deepEqual(readClubRecords(storage.getItem(CLUB_RECORDS_KEY)),records);
});
