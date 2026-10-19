import test from 'node:test';
import assert from 'node:assert/strict';
import {CHALLENGES,challengeCourse,challengeVenueName,challengeMedal} from '../src/challenges';
import {CAREER_GROUPS,careerGroupFor} from '../src/career';
import {isArenaId} from '../src/arena-id';
const byId=(id:string)=>CHALLENGES.find(c=>c.id===id)!;
test('Ashcombe Club Day races three cars on Ashcombe Lanes, one of them in reverse',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='ashcombe-club-day')!;assert.equal(group.discipline,'racing');assert.equal(group.events.length,3);
 for(const id of group.events){const c=byId(id);assert.equal(c.mode,'race');assert.equal(challengeCourse(c),'ashcombe-lanes-v1');assert.equal(challengeVenueName(c),'Ashcombe Lanes');assert.equal(careerGroupFor(id),group);assert.ok(c.medals[0]>c.medals[1]&&c.medals[1]>c.medals[2],'time medals tighten');}
 assert.deepEqual(group.events.map(id=>byId(id).car),['saber','tordal','starfin']);assert.equal(byId('ashcombe-tordal').direction,'reverse');assert.equal(byId('ashcombe-starfin').laps,2);
});
test('Round the Island derbies run in Kestrel Ring and name it, while older derbies stay at Quarry',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='round-the-island')!;assert.equal(group.discipline,'impact');
 for(const id of group.events){const c=byId(id);assert.equal(c.mode,'derby');assert.equal(c.arena,'kestrel-ring-v1');assert.ok(isArenaId(c.arena));assert.equal(challengeVenueName(c),'Kestrel Ring');assert.equal(challengeCourse(c),'quarry-v1');}
 assert.deepEqual(group.events.map(id=>byId(id).metric),['damage','knockouts','condition']);
 const survivor=byId('kestrel-survivor'),run={completed:true,recovered:false,health:40,damage:20,seconds:75,rank:1,knockouts:0,drift:0,distance:0,maxSpeed:0,airtime:0,combo:0} as any;
 assert.equal(challengeMedal(survivor,run),2);assert.equal(challengeMedal(survivor,{...run,damage:10}),0,'minimum damage still applies');
 // Later arena career groups (Last Rites, Sprinkles and Scrap) name their own arenas; every derby before them stays at Quarry.
 for(const c of CHALLENGES.filter(c=>c.mode==='derby'&&!c.id.startsWith('kestrel-')&&!c.id.startsWith('ravenhill-')&&!c.id.startsWith('cornet-'))){assert.equal(c.arena,undefined);assert.equal(challengeVenueName(c),'Blackridge Quarry');}
});
test('Thornby Hill Day races three cars on Thornby Hill, one of them in reverse',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='thornby-hill-day')!;assert.equal(group.discipline,'racing');
 for(const id of group.events){const c=byId(id);assert.equal(challengeCourse(c),'thornby-hill-v1');assert.equal(challengeVenueName(c),'Thornby Hill');assert.ok(c.medals[0]>c.medals[1]&&c.medals[1]>c.medals[2]);}
 assert.equal(byId('thornby-saber').direction,'reverse');assert.equal(byId('thornby-morrow').laps,2);
});
test('challenge ids stay unique and every career event exists exactly once',()=>{
 assert.equal(new Set(CHALLENGES.map(c=>c.id)).size,CHALLENGES.length);
 const events=CAREER_GROUPS.flatMap(g=>g.events);assert.equal(new Set(events).size,events.length);for(const id of events)assert.ok(CHALLENGES.some(c=>c.id===id),id);
});
