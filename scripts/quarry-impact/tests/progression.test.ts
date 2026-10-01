import {verifyProgressionRevision} from './progression-invariants.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionTelemetry,emptyRun,type RunStats} from '../src/session-telemetry.ts';
import {CHALLENGES,challengeMedal,challengeValue,lowerIsBetter} from '../src/challenges.ts';
import {readProfile,settleRun,levelFor} from '../src/progression.ts';

function lapRun():RunStats{return {...emptyRun(),seconds:64,distance:700,checkpoints:24,finished:true,completed:true,rank:1};}
test('thirty authored challenges have unique identities, valid timing, ordered medal targets and every discipline',()=>{
  assert.equal(CHALLENGES.length,30);assert.equal(new Set(CHALLENGES.map(c=>c.id)).size,30);
  for(const family of ['racing','impact','stunts'])assert.equal(CHALLENGES.filter(c=>c.discipline===family).length,10);
  for(const c of CHALLENGES){
    assert.ok(c.limit>=30&&c.limit<=360);assert.ok(c.description.length>25);
    assert.ok(c.medals.every(Number.isFinite));
    for(let i=1;i<3;i++)assert.ok(lowerIsBetter(c)?c.medals[i]<c.medals[i-1]:c.medals[i]>c.medals[i-1]);
    if(c.mode==='race')assert.ok(c.laps!>=1&&c.laps!<=3);
  }
});
test('racing medals require all ordered checkpoints, actual finish, no recovery and the health objective',()=>{
  const sprint=CHALLENGES.find(c=>c.id==='first-lap')!,clean=CHALLENGES.find(c=>c.id==='clean-coupe')!;
  const r=lapRun();assert.equal(challengeMedal(sprint,r),3);
  for(const mutation of [{checkpoints:23},{finished:false},{completed:false},{recovered:true},{seconds:111}])assert.equal(challengeMedal(sprint,{...r,...mutation}),0);
  assert.equal(challengeMedal(clean,{...r,health:74}),0);assert.equal(challengeMedal(clean,{...r,health:75}),3);
  const podium=CHALLENGES.find(c=>c.id==='podium')!;
  assert.equal(challengeMedal(podium,{...r,checkpoints:48,rank:2}),2);
  for(const rank of [0,-1,1.5,4])assert.equal(challengeMedal(podium,{...r,checkpoints:48,rank}),0);
});
test('survival medals require active engagement and the full duration',()=>{
  const c=CHALLENGES.find(c=>c.id==='survivor')!;
  const r={...emptyRun(),completed:true,seconds:45,health:80,damage:15};
  assert.equal(challengeMedal(c,r),3);
  for(const mutation of [{damage:0},{seconds:44},{health:0},{completed:false}])assert.equal(challengeMedal(c,{...r,...mutation}),0);
});
test('live score and medal calculations use actual units for speed, drifts, jumps and combo',()=>{
  const r={...emptyRun(),completed:true,maxSpeed:35,airtime:2,drift:130,distance:1300,damage:200,knockouts:2};
  assert.equal(challengeValue(CHALLENGES.find(c=>c.metric==='speed')!,r),126);
  assert.equal(challengeValue(CHALLENGES.find(c=>c.metric==='combo')!,r),250);
  for(const c of CHALLENGES.filter(c=>!lowerIsBetter(c)&&c.metric!=='condition')){
    const value=challengeValue(c,r);assert.equal(challengeMedal(c,r),c.medals.filter(t=>value>=t).length);
  }
});
test('telemetry agrees across fixed steps and ignores pause, invalid samples and wheelspin',()=>{
  const values=[];
  for(const hz of [30,60,120]){
    const t=new SessionTelemetry();
    for(let n=0;n<hz*10;n++)t.sample(1/hz,{speed:12,lateral:4,grounded:4,height:0,health:100,checkpoints:0});
    values.push(t.stats);
    assert.ok(Math.abs(t.stats.drift-120)<1e-6);assert.ok(Math.abs(t.stats.distance-Math.hypot(12,4)*10)<1e-6);
    const before=JSON.stringify(t.stats);
    for(const dt of [0,-1,1,NaN])t.sample(dt,{speed:12,lateral:4,grounded:4,height:0,health:100,checkpoints:0});
    t.sample(.016,{speed:NaN,lateral:0,grounded:4,height:0,health:100,checkpoints:0});assert.equal(JSON.stringify(t.stats),before);
  }
  const idle=new SessionTelemetry();for(let i=0;i<60;i++)idle.sample(1/60,{speed:0,lateral:0,grounded:4,height:0,health:100,checkpoints:0});assert.equal(idle.stats.distance,0);assert.equal(idle.stats.drift,0);
});
test('airtime requires a significant jump and a living landing; recovery cancels the jump',()=>{
  const t=new SessionTelemetry(),sample=(grounded:number,height:number,health=100)=>t.sample(1/60,{speed:14,lateral:0,grounded,height,health,checkpoints:0});
  for(let i=0;i<20;i++)sample(0,.1);sample(4,0);assert.equal(t.stats.airtime,0);
  for(let i=0;i<60;i++)sample(0,1);assert.equal(t.stats.airtime,0);sample(4,0);assert.ok(Math.abs(t.stats.airtime-1)<1e-6);
  const first=t.stats.airtime;for(let i=0;i<60;i++)sample(0,1);sample(4,0,0);assert.equal(t.stats.airtime,first);
  for(let i=0;i<60;i++)sample(0,1);t.recover();sample(4,0);assert.equal(t.stats.airtime,first);assert.equal(t.stats.recovered,true);
});
test('damage and knockouts do not count overkill or hitting an already disabled car',()=>{
  const t=new SessionTelemetry();t.impact(1,10,0);t.impact(1,0,0);t.impact(1,10,0);t.impact(2,30,20);t.impact(3,10,30);
  assert.equal(t.stats.damage,30);assert.equal(t.stats.knockouts,1);
});
test('event settlement, reload and duplicate callbacks preserve exactly-once rewards',()=>{
  let p=readProfile();const r=lapRun(),c=CHALLENGES[0];
  const first=settleRun(p,'event-1',r,c);assert.equal(first.medal,3);assert.equal(p.events,1);assert.equal(p.wins,1);assert.equal(p.challenges[c.id].attempts,1);
  const persisted=JSON.stringify(p);p=readProfile(persisted);const duplicate=settleRun(p,'event-1',r,c);assert.equal(duplicate.duplicate,true);assert.deepEqual(p,JSON.parse(persisted));
  const second=settleRun(p,'event-2',r,c);assert.equal(first.xp.racing-second.xp.racing,450);assert.equal(p.challenges[c.id].medal,3);assert.equal(p.challenges[c.id].attempts,2);
});
test('aborted sessions retain earned driving XP but cannot claim a challenge medal or event win',()=>{
  const p=readProfile(),r={...lapRun(),completed:false};const a=settleRun(p,'abort',r,CHALLENGES[0]);
  assert.ok(a.xp.racing>0);assert.equal(a.medal,0);assert.equal(p.events,0);assert.equal(p.wins,0);
  const fresh=readProfile();const idle=settleRun(fresh,'idle',{...emptyRun(),seconds:120,completed:true,rank:1},CHALLENGES[0]);
  assert.equal(idle.qualified,false);assert.equal(fresh.events,0);assert.equal(fresh.xp.racing,0);assert.equal(fresh.challenges[CHALLENGES[0].id].attempts,1);
  settleRun(fresh,'idle',{...emptyRun(),seconds:120,completed:true},CHALLENGES[0]);assert.equal(fresh.challenges[CHALLENGES[0].id].attempts,1);
});
test('save parser bounds corruption, unknown challenge keys and event history',()=>{
  for(const text of ['null','[]','invalid','{"version":999}'])assert.deepEqual(readProfile(text),readProfile());
  const p=readProfile(JSON.stringify({version:1,xp:{racing:-100,impact:'x',stunts:9e15},events:1,wins:100,settled:Array.from({length:500},(_,i)=>String(i)),challenges:{unknown:{medal:3},'first-lap':{medal:7,attempts:-2,best:-3}}}));
  assert.deepEqual(p.xp,{racing:0,impact:0,stunts:1e9});assert.equal(p.wins,1);assert.equal(p.settled.length,256);assert.equal(p.challenges.unknown,undefined);assert.deepEqual(p.challenges['first-lap'],{medal:3,best:null,attempts:0});
  for(const xp of [0,149,150,449,450,100000]){const l=levelFor(xp);assert.ok(l.fraction>=0&&l.fraction<1);assert.ok(l.required>0);}
  assert.equal(levelFor(0).level,1);assert.equal(levelFor(150).level,2);assert.equal(levelFor(450).level,3);
});

test('progression changes retain exact recoverable garage-release bytes',verifyProgressionRevision);
