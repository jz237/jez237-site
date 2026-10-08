import test from 'node:test';
import assert from 'node:assert/strict';
import {CAREER_GROUPS,careerStatus,careerChallenge,unlockCareerGroup} from '../src/career';
import {CHALLENGES} from '../src/challenges';
import {readProfile,settleRun} from '../src/progression';
import {emptyRun} from '../src/session-telemetry';
import {CAR_KINDS} from '../src/rules';
const lap=(seconds=64)=>({...emptyRun(),seconds,distance:700,health:100,checkpoints:24,finished:true,completed:true,rank:1});
test('career has nine unique groups, 27 distinct actual events and all eleven playable cars',()=>{
 assert.equal(CAREER_GROUPS.length,9);assert.equal(new Set(CAREER_GROUPS.map(g=>g.id)).size,9);const ids=CAREER_GROUPS.flatMap(g=>g.events);assert.equal(ids.length,27);assert.equal(new Set(ids).size,27);
 for(const g of CAREER_GROUPS){assert.equal(g.events.length,3);for(const id of g.events)assert.equal(CHALLENGES.find(c=>c.id===id)?.discipline,g.discipline);}
 assert.deepEqual(new Set(ids.map(id=>CHALLENGES.find(c=>c.id===id)!.car)),new Set(CAR_KINDS));
 const p=readProfile(),s=careerStatus(p);assert.equal(s.available,0);assert.equal(s.open.length,3);assert.equal(s.completed,0);
 for(const g of CAREER_GROUPS)for(const id of g.events)assert.equal(!!careerChallenge(p,id),g.cost===0);
 assert.equal(careerChallenge(p,'not-an-event'),undefined);
});
test('real settlement derives medal points once and can open any discipline atomically',()=>{
 let p=readProfile();const c=CHALLENGES[0];settleRun(p,'bronze',lap(100),c);assert.equal(careerStatus(p).available,1);assert.equal(unlockCareerGroup(p,'flight-school'),null);
 settleRun(p,'gold',lap(),c);assert.equal(careerStatus(p).available,3);settleRun(p,'gold',lap(),c);settleRun(p,'repeat',lap(),c);assert.equal(careerStatus(p).available,3);
 const prior=JSON.stringify(p),next=unlockCareerGroup(p,'flight-school')!;assert.equal(JSON.stringify(p),prior,'caller can persist before committing');assert.equal(careerStatus(next).available,0);assert.equal(careerStatus(next).earned,3);assert.equal(careerChallenge(next,'ravine-flight')?.car,'buggy');assert.equal(unlockCareerGroup(next,'flight-school'),null);
 p=readProfile(JSON.stringify(next));assert.deepEqual(careerStatus(p),careerStatus(next));assert.equal(careerStatus(p).open.includes('flight-school'),true);
 settleRun(p,'lower',lap(100),c);assert.equal(careerStatus(p).available,0);
});
test('old medals receive credit, all branches are reachable, and invalid or unaffordable saved unlocks are rejected',()=>{
 const p=readProfile();for(const g of CAREER_GROUPS)for(const id of g.events)p.challenges[id]={medal:3,best:1,attempts:1};
 assert.equal(careerStatus(p).earned,81);let current=p;for(const g of CAREER_GROUPS.filter(g=>g.cost))current=unlockCareerGroup(current,g.id)!;
 assert.equal(careerStatus(current).open.length,9);assert.equal(careerStatus(current).completed,9);assert.equal(careerStatus(current).available,63);
 const fresh=readProfile(JSON.stringify({version:1,career:{unlocked:['flight-school','invalid','flight-school']}}));assert.deepEqual(fresh.career?.unlocked,[]);
 const legacy=readProfile(JSON.stringify({...p,career:undefined}));assert.equal(legacy.career,undefined);assert.equal(careerStatus(legacy).earned,81);
 legacy.challenges={...readProfile().challenges,'first-lap':{medal:3,best:64,attempts:1}};
 const malformed=readProfile(JSON.stringify({...legacy,career:{unlocked:['invalid','club-racing','flight-school','flight-school','wrecking-crew']}}));assert.deepEqual(malformed.career?.unlocked,['flight-school']);assert.equal(careerStatus(malformed).available,0);
});
test('failed, recovered or abandoned runs cannot earn career points',()=>{
 for(const patch of [{finished:false},{recovered:true},{completed:false},{checkpoints:23},{seconds:111}]){const p=readProfile();settleRun(p,'invalid',{...lap(),...patch},CHALLENGES[0]);assert.equal(careerStatus(p).earned,0);}
});
