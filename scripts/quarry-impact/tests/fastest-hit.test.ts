import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,FASTEST_HIT,awardsHtml} from '../src/event-awards';
const cars=[{id:0,inflicted:30,health:60},{id:1,inflicted:20,health:50},{id:2,inflicted:5,health:40}];
test('the fastest damaging hit gets its own card with the speed in km/h',()=>{
 const e=new EventAwards();e.hit(1,2,8,false,1,12);e.hit(0,1,4,false,2,22.3);e.hit(2,0,20,false,3,15);
 const fastest=e.awards('derby',cars).find(a=>a.key==='fastest')!;
 assert.equal(fastest.id,0);assert.equal(fastest.victim,1);assert.equal(fastest.detail,'80 km/h impact');assert.equal(fastest.title,'FASTEST HIT');
 assert.equal(e.awards('derby',cars).find(a=>a.key==='hit')!.id,2,'the biggest hit is still the most damage');
 assert.match(awardsHtml(e.awards('derby',cars),i=>'Car '+i),/data-award="fastest"/);
});
test('slow scrapes do not earn it, callers without a speed never do, and reset clears it',()=>{
 const e=new EventAwards();e.hit(0,1,30,false,1,FASTEST_HIT.min-.5);e.hit(1,0,30,false,2);
 assert.equal(e.awards('derby',cars).find(a=>a.key==='fastest'),undefined);
 e.hit(0,1,5,false,3,25);e.reset();assert.equal(e.awards('derby',cars).find(a=>a.key==='fastest'),undefined);
 const z=new EventAwards();assert.equal(z.hit(0,0,10,false,0,30),false);assert.equal(z.awards('derby',cars).find(a=>a.key==='fastest'),undefined,'no self hits');
});
