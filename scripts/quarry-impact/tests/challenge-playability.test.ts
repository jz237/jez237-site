import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {CHALLENGES,challengeCourse,challengeVenueName,type Challenge} from '../src/challenges';
import {CAR_KINDS} from '../src/rules';
import {COURSE_NAMES} from '../src/course-id';
import {getRaceCourse} from '../src/race-course';
import {readProfile,settleRun} from '../src/progression';
import {emptyRun} from '../src/session-telemetry';

test('the original thirty challenge definitions remain exactly unchanged after the catalogue extension',()=>{
 const original=JSON.stringify(CHALLENGES.slice(0,30));
 assert.equal(createHash('sha256').update(original).digest('hex'),'027c250b727dac72ea1fe7e99d6af35ab2b166f9b76bffecc824b7c3fe0e3d86');
});

test('the expanded catalogue covers all vehicles and preserves the first eight added events',()=>{
 assert.equal(CHALLENGES.length,53);
 assert.equal(new Set(CHALLENGES.map(c=>c.id)).size,53);
 assert.deepEqual([...new Set(CHALLENGES.map(c=>c.car))].sort(),[...CAR_KINDS].sort());
 const originalCars=new Set(CHALLENGES.slice(0,30).map(c=>c.car)),added=CHALLENGES.slice(30,38);
 assert.deepEqual(added.map(c=>c.car).sort(),CAR_KINDS.filter(kind=>kind!=='shuttle'&&kind!=='regent'&&!originalCars.has(kind)).sort());
 assert.deepEqual([...new Set(added.filter(c=>c.mode==='race').map(challengeCourse))].sort(),['quarry-v1','ironfield-figure-eight-v1'].sort());
 for(const c of CHALLENGES){
  if(c.mode==='race')assert.equal(getRaceCourse(challengeCourse(c)).checkpoints.length,24,'Existing medal gate count is valid on '+c.id);
  else assert.equal(challengeCourse(c),'quarry-v1','Arena and ramp events stay at Quarry');
  if(c.mode==='playground')assert.equal(c.traffic,false);
 }
});

test('challenge course labels share valid race identities and constrain invalid or non-race choices to Quarry',()=>{
 const race=CHALLENGES.find(c=>c.mode==='race')!;
 for(const value of [undefined,null,'obsolete-course']){
  const c={...race,course:value} as Challenge;
  assert.equal(challengeCourse(c),'quarry-v1');assert.equal(challengeVenueName(c),COURSE_NAMES['quarry-v1']);
 }
 const ironfield={...race,course:'ironfield-figure-eight-v1'} as Challenge;
 assert.equal(challengeCourse(ironfield),'ironfield-figure-eight-v1');assert.equal(challengeVenueName(ironfield),'Ironfield Raceway');
 for(const mode of ['derby','playground'] as const){
  assert.equal(challengeCourse({...ironfield,mode}),'quarry-v1');assert.equal(challengeVenueName({...ironfield,mode}),'Blackridge Quarry');
 }
});

test('old profile records and all new challenge records survive reload without duplicating an award',()=>{
 // Explicit unit scoring input: this proves save compatibility, not a driven event.
 const profile=readProfile();
 for(const c of CHALLENGES){
  const run={...emptyRun(),completed:true,finished:true,seconds:c.metric==='condition'?c.limit:Math.min(c.limit,30),distance:2000,
   health:100,damage:1000,knockouts:8,drift:1000,airtime:20,maxSpeed:60,checkpoints:(c.laps??1)*24,rank:1};
  const award=settleRun(profile,'catalogue-save-'+c.id,run,c);assert.equal(award.medal,3,c.id);
 }
 const saved=JSON.stringify(profile),reloaded=readProfile(saved);assert.deepEqual(reloaded,profile);
 assert.equal(Object.keys(reloaded.challenges).length,53);
 const beforeDuplicate=JSON.stringify(reloaded);
 const duplicate=settleRun(reloaded,'catalogue-save-'+CHALLENGES[37].id,emptyRun(),CHALLENGES[37]);
 assert.equal(duplicate.duplicate,true);assert.equal(JSON.stringify(reloaded),beforeDuplicate);
});
