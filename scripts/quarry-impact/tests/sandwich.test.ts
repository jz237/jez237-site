import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DESTRUCTION_POINTS} from '../src/derby-moments';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),body=src.slice(src.indexOf('function pinCars('),src.indexOf('/** The results line of the player'));
test('a car squeezed between two cars is a SANDWICH: one feed line, credited to the car driving into it',()=>{
 assert.ok(body.includes('if(strong&&far&&Math.abs(far.input.throttle)>Math.abs(strong.input.throttle))pin={push:pin.against,against:pin.push};'),'the driving car is the pinner');
 assert.ok(body.includes("sandwiches++;pinFed.add(c.id);if(mode==='derby')derbyFeed.note(by.id,displayedDriver(by),'sandwich',elapsed);"),'one SANDWICH line, no PINNED line as well');
 const f=new DerbyEventFeed();f.note(0,'VESPER GT #1','sandwich',4);assert.ok(derbyFeedMarkup(f.visible(4),0).includes('<strong>SANDWICH'));
});
test('the car on the far side shares the credit only if it is driving in too; a parked car or a wreck gets nothing',()=>{
 assert.ok(body.includes('const shares=!!other&&Math.abs(other.input.throttle)>=PIN_FEEL.partner;'));
 assert.ok(body.includes('if(shares){eventAwards.pinned(other.id,c.id,elapsed);if(scoreDerby())combat.destruction(other.id,DESTRUCTION_POINTS.sandwich);}'));
 assert.ok(DESTRUCTION_POINTS.sandwich>0&&DESTRUCTION_POINTS.sandwich<DESTRUCTION_POINTS.pin,'the partner\'s share is less than the pin');
});
