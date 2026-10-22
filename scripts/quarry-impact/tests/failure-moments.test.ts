import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards} from '../src/event-awards';
test('mechanical failures are highlight moments with their own captions, ranked against hits',()=>{
 const a=new EventAwards();
 a.failure(3,'ENGINE SEIZED',10,32);a.failure(5,'SPRING BROKEN',20,18);a.failure(-1,'X',1);a.failure(2,'',1);a.failure(1.5,'X',1);
 const h=a.highlights(5);
 assert.deepEqual(h.map(m=>[m.kind,m.attacker,m.victim,m.label]),[['failure',3,3,'ENGINE SEIZED'],['failure',5,5,'SPRING BROKEN']],'invalid ones are dropped, best first');
 a.reset();assert.equal(a.highlights(5).length,0);
});
test('main ranks each failure and captions the reel with the failure itself',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 for(const w of ['spring','shaft','diff','tierod','exhaust','brakefire'])assert.ok(new RegExp(`${w}:\\{label:'[A-Z ]+',score:\\d+\\}`).test(src),w);
 assert.ok(src.includes("eventAwards.failure(car.id,'ENGINE SEIZED',elapsed,32)")&&src.includes('${m.label??label[m.kind]}'));
});
