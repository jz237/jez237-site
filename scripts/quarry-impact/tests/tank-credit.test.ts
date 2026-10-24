import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DESTRUCTION_POINTS} from '../src/derby-moments';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('dropping a rival\'s tank and running it dry are credited to the driver who did it, in the feed and in points',()=>{
 const f=new DerbyEventFeed();f.note(0,'VESPER GT #1','tank',3);assert.ok(derbyFeedMarkup(f.visible(3),0).includes('TANK DOWN'));
 f.note(0,'VESPER GT #1','dry',20);assert.ok(derbyFeedMarkup(f.visible(20),0).includes('RAN DRY'));
 assert.ok(DESTRUCTION_POINTS.dry>DESTRUCTION_POINTS.tank&&DESTRUCTION_POINTS.dry<DESTRUCTION_POINTS.burnt,'running it dry is a takedown, worth less than burning it out');
});
test('main records who dropped each tank at the contact, and a car retired OUT OF FUEL is that driver\'s takedown',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(src.includes('const tankInA=!a?.tankDown,tankInB=!b?.tankDown;'),'tank state captured before the hit');
 assert.ok(src.includes("if(!was||!victim.tankDown)continue;tankBy.set(victim.id,attacker.id);"));
 assert.ok(src.includes("const by=reason==='OUT OF FUEL'?cars.find(v=>v.id===tankBy.get(c.id)):undefined;"));
 assert.ok(src.includes('wreckedBy.set(c.id,by.id);eventAwards.hit(by.id,c.id,0,true,elapsed,0);combat.hit(by.id,c.id,before,0,elapsed);'));
 assert.ok(src.includes('knockedBy.clear();tankBy.clear();'),'cleared each event');
});
