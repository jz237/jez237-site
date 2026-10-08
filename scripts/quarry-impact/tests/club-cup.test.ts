import test from 'node:test';
import assert from 'node:assert/strict';
import {CAR_KINDS} from '../src/rules.ts';
import {emptyRun,type RunStats} from '../src/session-telemetry.ts';
import {readProfile,settleRun} from '../src/progression.ts';
import {CLUB_KINDS,CLUB_ROUNDS,createClubCup,readClubCup,currentClubRound,beginClubRound,finishClubRound,rankClubRows,clubStandings,replayCupAwards,clubRoundRunId,type ClubRowInput} from '../src/club-cup.ts';
const uuid='35b8b621-c3ac-4c41-9fb3-e05a9aa0f671';
const create=()=>createClubCup('tern',uuid,1700000000000);
const copy=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
const run=():RunStats=>({...emptyRun(),seconds:96,distance:1200,damage:14,knockouts:1,drift:45,airtime:.8,maxSpeed:28,checkpoints:48,health:100,rank:0,completed:false,finished:false,recovered:true});
const race=():ClubRowInput[]=>Array.from({length:11},(_,slot)=>({slot,status:'finished',finishTime:90+slot,health:100-slot*3,progress:48,damage:slot*2}));
const derby=():ClubRowInput[]=>Array.from({length:11},(_,slot)=>({slot,status:slot<4?'survived':'wrecked',finishTime:null,health:slot<4?60-slot*10:0,progress:0,damage:100-slot*4}));
function completedCup(){let state=create();state=finishClubRound(beginClubRound(state),race(),run(),0);state=finishClubRound(beginClubRound(state),race(),run(),1);return finishClubRound(beginClubRound(state),derby(),run(),2);}

test('Club Cup selects every original car at player slot0, keeps one stable factory-stock eleven and fixed three-round schedule',()=>{
 assert.deepEqual([...CLUB_KINDS],CAR_KINDS.filter(k=>k!=='shuttle'&&k!=='regent'));assert.equal(CLUB_KINDS.length,11);
 for(const kind of CLUB_KINDS){const cup=createClubCup(kind,uuid,1700000000000),index=CLUB_KINDS.indexOf(kind);assert.equal(cup.roster[0].kind,kind);assert.deepEqual(cup.roster.map(r=>r.kind),[...CLUB_KINDS.slice(index),...CLUB_KINDS.slice(0,index)]);assert.deepEqual(cup.roster.map(r=>r.slot),Array.from({length:11},(_,i)=>i));assert.equal(new Set(cup.roster.map(r=>r.kind)).size,11);assert.equal(cup.phase,'ready');assert.equal(currentClubRound(cup)?.index,0);assert.deepEqual(readClubCup(JSON.stringify(cup)),cup);}
 assert.deepEqual(CLUB_ROUNDS.map(r=>[r.mode,r.course,r.laps,r.duration,r.stock]),[['race','quarry-v1',2,0,true],['race','ironfield-figure-eight-v1',2,0,true],['derby','quarry-v1',0,90,true]]);
 assert.throws(()=>createClubCup('hovercraft' as any,uuid,0));assert.throws(()=>createClubCup('tern','not-a-uuid',0));assert.throws(()=>createClubCup('tern',uuid,NaN));
});

test('race awards use actual finish times and stable slot ties, preserve post-finish wrecks and give every nonfinisher zero points',()=>{
 const rows=race();rows[0]={...rows[0],finishTime:100,health:0};rows[1]={...rows[1],finishTime:90};rows[2]={...rows[2],finishTime:90};
 rows[3]={...rows[3],status:'dnf',finishTime:null,progress:47};rows[4]={...rows[4],status:'wrecked',health:0,finishTime:null,progress:46};rows[5]={...rows[5],status:'retired',finishTime:null,progress:1000};
 const ranked=rankClubRows(create(),[...rows].reverse(),0);assert.deepEqual(ranked.slice(0,2).map(r=>r.slot),[1,2]);assert.deepEqual(ranked.filter(r=>r.status==='finished').map(r=>r.slot),[1,2,6,7,8,9,0,10]);assert.equal(ranked.find(r=>r.slot===0)?.points,7);assert.equal(ranked.at(-1)?.slot,5);
 for(const slot of [3,4,5])assert.equal(ranked.find(r=>r.slot===slot)?.points,0);
 const original=copy(run()),finished=finishClubRound(beginClubRound(create()),rows,original,0),stats=finished.results[0].runStats!,player=finished.results[0].rows.find(r=>r.slot===0)!;
 assert.equal(stats.rank,player.place);assert.equal(stats.health,0);assert.equal(stats.finished,true);assert.equal(stats.completed,true);assert.equal(stats.won,false);assert.equal(stats.recovered,true);for(const key of ['distance','damage','seconds','airtime'] as const)assert.equal(stats[key],original[key]);assert.deepEqual(original,run());
});

test('derby standings use final health then damage, distinguish real wrecks from retirement and keep position points for genuine wrecks',()=>{
 let cup=finishClubRound(beginClubRound(create()),race(),run(),0);cup=finishClubRound(beginClubRound(cup),race(),run(),1);
 const rows=derby();rows[0]={...rows[0],health:50,damage:20};rows[1]={...rows[1],health:50,damage:25};rows[2]={...rows[2],health:50,damage:25};rows[3]={...rows[3],status:'retired',health:100,damage:1000};
 const ranked=rankClubRows(cup,[...rows].reverse(),2);assert.deepEqual(ranked.slice(0,3).map(r=>r.slot),[1,2,0]);assert.equal(ranked.at(-1)?.slot,3);assert.equal(ranked.at(-1)?.points,0);assert.ok(ranked.filter(r=>r.status==='wrecked').every(r=>r.health===0&&r.points>0));
 for(const invalid of [{slot:4,status:'wrecked',health:1},{slot:0,status:'survived',health:0},{slot:0,status:'finished',finishTime:90},{slot:0,status:'dnf'}]){const bad=copy(rows);bad[invalid.slot]={...bad[invalid.slot],...invalid} as ClubRowInput;assert.throws(()=>rankClubRows(cup,bad,2));}
 const final=finishClubRound(beginClubRound(cup),rows,run(),2);assert.equal(final.phase,'complete');assert.equal(currentClubRound(final),null);assert.equal(final.results.length,3);assert.deepEqual(readClubCup(JSON.stringify(final)),final);
});

test('immutable progression resumes a running round, rejects stale/conflicting callbacks and derives standings without saved totals',()=>{
 const pristine=create(),before=JSON.stringify(pristine),running=beginClubRound(pristine);assert.equal(JSON.stringify(pristine),before);assert.equal(running.phase,'running');assert.deepEqual(beginClubRound(running),running);assert.equal(readClubCup(JSON.stringify(running))?.phase,'running');
 const rows=race(),observed=run(),first=finishClubRound(running,rows,observed,0);assert.equal(first.phase,'ready');assert.equal(first.results.length,1);assert.deepEqual(finishClubRound(first,rows,observed,0),first);assert.deepEqual(finishClubRound(first,rows),first);
 const next=beginClubRound(first);assert.deepEqual(finishClubRound(next,rows,observed,0),next);assert.equal(next.results.length,1);const changed=copy(rows);changed[0]={...changed[0],finishTime:5};assert.throws(()=>finishClubRound(next,changed,observed,0));assert.throws(()=>finishClubRound(next,rows,observed,2));
 const snapshot=JSON.stringify(first);(rows[0] as any).health=1;observed.distance=0;assert.equal(JSON.stringify(first),snapshot);assert.ok(Object.isFrozen(first.results[0].rows[0]));assert.ok(Object.isFrozen(first.results[0].runStats));assert.throws(()=>{(first.results[0].rows as any).push({});});
 const all=completedCup(),standings=clubStandings(all);assert.equal(standings[0].slot,0);assert.equal(standings[0].points,75);assert.equal(standings[0].wins,3);assert.deepEqual(clubStandings(create()).map(r=>r.slot),Array.from({length:11},(_,i)=>i));assert.throws(()=>beginClubRound(all));assert.deepEqual(finishClubRound(all,derby(),run(),2),all);
});

test('storage codec rejects malformed, poisoned and internally tampered saves rather than repairing rank, points, roster or telemetry',()=>{
 const final=completedCup(),text=JSON.stringify(final);assert.deepEqual(readClubCup(text),final);assert.equal(JSON.stringify(readClubCup(text)),text);
 const poisons:((v:any)=>void)[]=[
  v=>{v.version=2;},v=>{v.id='constructor';},v=>{v.created=-1;},v=>{v.roster[0].kind='marten';},v=>{v.roster[1]=v.roster[0];},v=>{v.roster[0].setup={armor:3};},v=>{v.phase='ready';},v=>{v.results.reverse();},v=>{v.results[0].index=2;},v=>{v.results[0].round='quarry-survival';},v=>{v.results[0].rows.pop();},v=>{v.results[0].rows[1].slot=0;},v=>{v.results[0].rows.reverse();},v=>{v.results[0].rows[0].place=2;},v=>{v.results[0].rows[0].points=999;},v=>{v.results[0].rows[0].finishTime=null;},v=>{v.results[0].rows[0].finishTime=10000;},v=>{v.results[2].rows[4].health=1;},v=>{v.results[2].rows[0].health=0;},v=>{v.results[2].rows[4].finishTime=90;},v=>{v.results[2].rows[0].damage=-1;},v=>{v.results[0].runStats.rank=2;},v=>{v.results[0].runStats.health=0;},v=>{v.results[0].runStats.finished=false;},v=>{v.results[0].runStats.won=false;},v=>{v.results[0].runStats.completed=false;},v=>{v.results[0].runStats.seconds='96';},v=>{v.results[0].runStats.distance=1e99;},v=>{v.results[0].runStats.knockouts=.5;},v=>{v.results[0].runStats.extraXp=900;},v=>{v.points=999;},v=>{Object.defineProperty(v,'__proto__',{value:{polluted:true},enumerable:true});},
 ];
 for(const poison of poisons){const bad=copy(final);poison(bad);assert.equal(readClubCup(JSON.stringify(bad)),null,String(poison));}
 for(const bad of [undefined,null,'','null','[]','{}','invalid',text.slice(0,-5),' '.repeat(100001),text.replace('"seconds":96','"seconds":1e999')])assert.equal(readClubCup(bad),null);
 assert.equal(({} as any).polluted,undefined);
 const bad=copy(final);(bad.results[0].runStats as any).distance=Infinity;const profile=readProfile(),prior=JSON.stringify(profile);assert.throws(()=>replayCupAwards(profile,bad));assert.equal(JSON.stringify(profile),prior,'validation precedes any award mutation');
});

test('saved results recover XP after profile-write failure and repeated callbacks/reloads award each real run exactly once',()=>{
 const cup=completedCup(),saved=new Map<string,string>();let rejectProfile=false;const storage={get:(key:string)=>saved.get(key),set:(key:string,value:string)=>{if(key==='profile'&&rejectProfile)throw new Error('QuotaExceededError');saved.set(key,value);}};storage.set('cup',JSON.stringify(cup));storage.set('profile',JSON.stringify(readProfile()));
 // The result write succeeded but the first profile write failed. Reload the
 // independently persisted values, run the real settlement helper, then retry.
 let profile=readProfile(storage.get('profile')),loaded=readClubCup(storage.get('cup'))!;const first=replayCupAwards(profile,loaded);assert.equal(first.length,3);assert.ok(first.every(a=>!a.duplicate&&a.qualified));const credited=JSON.stringify(profile);
 rejectProfile=true;assert.throws(()=>storage.set('profile',JSON.stringify(profile)),/QuotaExceededError/);rejectProfile=false;profile=readProfile(storage.get('profile'));loaded=readClubCup(storage.get('cup'))!;replayCupAwards(profile,loaded);assert.equal(JSON.stringify(profile),credited);storage.set('profile',JSON.stringify(profile));
 profile=readProfile(storage.get('profile'));const duplicate=replayCupAwards(profile,loaded);assert.ok(duplicate.every(a=>a.duplicate));assert.equal(JSON.stringify(profile),credited);assert.equal(profile.events,3);assert.equal(profile.wins,3);
 const direct=readProfile();cup.results.forEach(r=>settleRun(direct,clubRoundRunId(cup,r.index),r.runStats!));assert.deepEqual(profile,direct,'cup awards use the unchanged real settleRun amounts, with no trophy XP');
 assert.deepEqual(profile.settled,Array.from({length:3},(_,index)=>`club:${uuid}:round:${index}`));
});

test('current-cup receipt refresh survives over 256 ordinary awards and profile reloads without duplicate cup XP',()=>{
 const cup=completedCup();let profile=readProfile();replayCupAwards(profile,cup);const initial=copy(profile),ordinary={...emptyRun(),seconds:10,distance:120,health:100};
 for(let i=0;i<600;i++){const awards=replayCupAwards(profile,cup);assert.ok(awards.every(a=>a.duplicate));settleRun(profile,'ordinary:'+i,ordinary);profile=readProfile(JSON.stringify(profile));}
 assert.equal(profile.xp.racing,initial.xp.racing+600*10);assert.equal(profile.xp.impact,initial.xp.impact);assert.equal(profile.xp.stunts,initial.xp.stunts);assert.equal(profile.events,3);assert.equal(profile.wins,3);assert.equal(profile.settled.length,256);
 for(let index=0;index<3;index++)assert.ok(profile.settled.includes(clubRoundRunId(cup,index)));assert.ok(replayCupAwards(profile,cup).every(a=>a.duplicate));
});

test('retirement banks only observed driving XP, never a finish or win; optional missing telemetry cannot create awards',()=>{
 const rows=race();rows[0]={...rows[0],status:'retired',finishTime:null,progress:17};const observed={...run(),finished:true,won:true,completed:true,rank:1};
 const cup=finishClubRound(beginClubRound(create()),rows,observed,0),player=cup.results[0].rows.find(r=>r.slot===0)!,stats=cup.results[0].runStats!;
 assert.equal(player.points,0);assert.equal(stats.finished,false);assert.equal(stats.won,false);assert.equal(stats.completed,false);assert.equal(stats.rank,11);assert.equal(stats.seconds,observed.seconds);
 const profile=readProfile();assert.ok(replayCupAwards(profile,cup)[0].qualified);assert.equal(profile.events,0);assert.equal(profile.wins,0);assert.equal(profile.xp.racing,Math.floor(observed.distance/12+observed.checkpoints*4));
 const unstored=finishClubRound(beginClubRound(create()),race());assert.equal(Object.hasOwn(unstored.results[0],'runStats'),false);assert.deepEqual(replayCupAwards(readProfile(),readClubCup(JSON.stringify(unstored))!),[]);
});


test('equal cup points break ties by round wins then stable entry slot, independently of input row order',()=>{
 const order=(a:number,b:number)=>{const slots=Array.from({length:11},(_,i)=>i).filter(i=>i!==0&&i!==1);slots.splice(a,0,0);slots.splice(b,0,1);return slots;};
 const raceOrder=(slots:number[]):ClubRowInput[]=>race().map(row=>({...row,finishTime:90+slots.indexOf(row.slot)}));
 // 25+2+3 versus 20+5+5 gives 30 points apiece, but only slot0 has a win.
 const first=finishClubRound(beginClubRound(create()),raceOrder(Array.from({length:11},(_,i)=>i)));
 const secondOrder=order(8,7),second=finishClubRound(beginClubRound(first),raceOrder(secondOrder));
 const finalOrder=order(7,7),last=derby().map(row=>({...row,status:'survived' as const,health:100-finalOrder.indexOf(row.slot)}));
 const final=finishClubRound(beginClubRound(second),last),standing=clubStandings(final),a=standing.find(r=>r.slot===0)!,b=standing.find(r=>r.slot===1)!;
 assert.equal(a.points,30);assert.equal(b.points,30);assert.equal(a.wins,1);assert.equal(b.wins,0);assert.ok(a.place<b.place);
 const lowFirst=[2,3,0,1,4,5,6,7,8,9,10],lowSecond=[2,3,1,0,4,5,6,7,8,9,10];
 let tie=finishClubRound(beginClubRound(create()),raceOrder(lowFirst));tie=finishClubRound(beginClubRound(tie),raceOrder(lowSecond).reverse());const tied=clubStandings(tie),one=tied.find(r=>r.slot===0)!,two=tied.find(r=>r.slot===1)!;
 assert.equal(one.points,29);assert.equal(two.points,29);assert.equal(one.wins,0);assert.equal(two.wins,0);assert.ok(one.place<two.place);
});


test('selective cup-save failure pins existing receipts without settling new unpersisted rounds',()=>{
 const first=finishClubRound(beginClubRound(create()),race(),run(),0),next=finishClubRound(beginClubRound(first),race(),run(),1);
 let profile=readProfile();replayCupAwards(profile,first);const firstXP=copy(profile.xp),ordinary={...emptyRun(),seconds:10,distance:120};
 // The stored cup still has only round0; round1 exists in memory after its
 // write failed. Other event profile writes continue to succeed and reload.
 for(let i=0;i<300;i++){const preserved=replayCupAwards(profile,next,false);assert.equal(preserved.length,1);assert.equal(preserved[0].duplicate,true);settleRun(profile,'ordinary:'+i,ordinary);profile=readProfile(JSON.stringify(profile));}
 assert.equal(profile.events,1);assert.equal(profile.xp.racing,firstXP.racing+300*10);assert.ok(profile.settled.includes(clubRoundRunId(first,0)));assert.ok(!profile.settled.includes(clubRoundRunId(next,1)));
 const before=copy(profile),resumed=replayCupAwards(profile,readClubCup(JSON.stringify(next))!,true);assert.deepEqual(resumed.map(a=>a.duplicate),[true,false]);assert.equal(profile.events,2);assert.equal(profile.xp.racing-before.xp.racing,firstXP.racing);
 const unchanged=readProfile(),initial=JSON.stringify(unchanged);assert.deepEqual(replayCupAwards(unchanged,next,false),[]);assert.equal(JSON.stringify(unchanged),initial);
});
