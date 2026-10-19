import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyChallenge} from '../src/daily-event';
import {dailyKey,dailyStreak,isDailyChallenge,isDailyKey,normalizeDaily,DAILY_KEEP} from '../src/daily-record';
import {CAR_KINDS} from '../src/rules';
import {isCourseId} from '../src/course-id';
import {isArenaId} from '../src/arena-id';
import {challengeMedal,challengeCourse} from '../src/challenges';
import {readProfile,settleRun,PROFILE_KEY} from '../src/progression';
import {SAVE_KEYS,exportSave,readSave} from '../src/save-backup';
const days=(n:number,start='2026-10-19')=>Array.from({length:n},(_,i)=>{const d=new Date(start+'T12:00:00');d.setDate(d.getDate()+i);return dailyKey(d);});
test('each day has one deterministic, valid event and the calendar varies cars, venues and modes',()=>{
 assert.deepEqual(dailyChallenge('2026-10-19'),dailyChallenge('2026-10-19'));assert.notDeepEqual(dailyChallenge('2026-10-19'),dailyChallenge('2026-10-20'));
 const events=days(60).map(k=>dailyChallenge(k));
 for(const c of events){
  assert.ok(isDailyChallenge(c));assert.ok(CAR_KINDS.includes(c.car));assert.ok(c.medals[0]!==c.medals[2]);
  if(c.mode==='race'){assert.ok(isCourseId(c.course));assert.equal(challengeCourse(c),c.course);assert.ok(c.medals[0]>c.medals[1]&&c.medals[1]>c.medals[2]&&c.medals[2]>20,'time medals tighten and stay plausible');assert.equal(c.limit,c.medals[0]);assert.ok(c.laps===1||c.laps===2);}
  else{assert.equal(c.mode,'derby');assert.ok(isArenaId(c.arena));assert.ok(c.medals[0]<c.medals[1]&&c.medals[1]<c.medals[2]);}
 }
 assert.ok(events.some(c=>c.mode==='race')&&events.some(c=>c.mode==='derby'),'both races and derbies');
 assert.ok(new Set(events.map(c=>c.car)).size>=12,'many cars');assert.ok(new Set(events.map(c=>c.course??c.arena)).size>=15,'many venues');
 assert.throws(()=>dailyChallenge('2026-13-40'));assert.equal(isDailyKey('2026-10-19'),true);assert.equal(isDailyKey('19/10/2026'),false);
});
test('daily results settle once into profile.daily, survive reload and backup, and leave fixed challenges alone',async()=>{
 const key='2026-10-19',c=dailyChallenge(key),profile=readProfile();
 const run:any={completed:true,recovered:false,finished:true,health:90,seconds:c.mode==='race'?c.medals[2]:c.limit,checkpoints:24*(c.laps??1),distance:2000,damage:c.mode==='race'?5:c.medals[2]+20,knockouts:c.mode==='race'?0:c.medals[2],rank:1,drift:0,airtime:0,combo:0,maxSpeed:30};
 const award=settleRun(profile,'run-1',run,c);assert.ok(award.medal>=1,'a strong run medals');assert.equal(settleRun(profile,'run-1',run,c).duplicate,true);
 assert.equal(profile.daily![key].attempts,1);assert.equal(profile.daily![key].medal,award.medal);assert.equal(profile.challenges[c.id],undefined,'daily ids never enter the fixed challenge records');
 assert.equal(challengeMedal(c,{...run,recovered:true}),0);
 const reloaded=readProfile(JSON.stringify(profile));assert.deepEqual(reloaded.daily,profile.daily);
 settleRun(reloaded,'run-2',{...run,completed:false},c);assert.equal(reloaded.daily![key].attempts,2,'an unfinished active run is an attempt');assert.equal(reloaded.daily![key].medal,award.medal,'and keeps the earlier medal');
 const data=new Map(SAVE_KEYS.map(k=>[k,null]as const))as Map<string,string|null>;data.set(PROFILE_KEY,JSON.stringify(profile));
 const backup=await readSave(await exportSave({getItem:k=>data.get(k)??null}));assert.deepEqual(readProfile(backup.entries[PROFILE_KEY]!).daily,profile.daily);
 assert.ok(!Object.hasOwn(readProfile(JSON.stringify({version:1})),'daily'),'old saves are unchanged');
});
test('streak counts consecutive medal days ending today or yesterday; history is bounded and sanitised',()=>{
 const rec=(medal:number)=>({medal,best:1,attempts:1});
 const book={'2026-10-16':rec(1),'2026-10-17':rec(2),'2026-10-18':rec(3)};
 assert.equal(dailyStreak(book,'2026-10-18'),3);assert.equal(dailyStreak(book,'2026-10-19'),3,'today still open');assert.equal(dailyStreak(book,'2026-10-20'),0,'a missed day resets');
 assert.equal(dailyStreak({...book,'2026-10-17':rec(0)},'2026-10-18'),1);
 const big=Object.fromEntries(days(DAILY_KEEP+20,'2026-01-01').map(k=>[k,rec(1)]));big['not-a-date']=rec(3) as any;big['2026-02-30']={medal:9,best:-1,attempts:-4} as any;
 const clean=normalizeDaily(big)!;assert.equal(Object.keys(clean).length,DAILY_KEEP);assert.ok(!('not-a-date' in clean));
 for(const r of Object.values(clean)){assert.ok(r.medal>=0&&r.medal<=3&&r.attempts>=0);}
 assert.equal(normalizeDaily([]),undefined);
});
