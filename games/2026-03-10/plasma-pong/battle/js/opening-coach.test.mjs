import test from 'node:test';import assert from 'node:assert/strict';
import {createOpeningCoach,advanceOpeningCoach,openingMessage} from './opening-coach.js';
test('tips wait for input, actual bolts and paddle returns, then allow time to read the objective',()=>{
 const p={x:0,z:0},stats={bolts:0,hits:0},c=createOpeningCoach(p,stats);
 p.x=3;advanceOpeningCoach(c,p,stats,30,false);assert.equal(c.stage,'move');
 p.x=5;advanceOpeningCoach(c,p,stats,1);assert.equal(c.stage,'fire');
 advanceOpeningCoach(c,p,stats,20);assert.equal(c.stage,'fire');
 stats.bolts++;advanceOpeningCoach(c,p,stats,0);assert.equal(c.stage,'return');
 stats.hits++;advanceOpeningCoach(c,p,stats,0);assert.equal(c.stage,'goal');
 advanceOpeningCoach(c,p,stats,0);assert.equal(c.stage,'goal');advanceOpeningCoach(c,p,stats,4);assert.equal(c.stage,'goal');advanceOpeningCoach(c,p,stats,1);assert.equal(c.stage,'done');
});
test('input instructions follow keyboard, mouse, touch and gamepad controls',()=>{
 assert.match(openingMessage('move','key')[1],/arrow/);assert.match(openingMessage('move','mouse')[1],/mouse/);assert.match(openingMessage('move','pad')[1],/stick/);assert.match(openingMessage('fire','touch')[1],/Tap FIRE/);assert.match(openingMessage('fire','pad')[1],/right trigger/);assert.match(openingMessage('return')[1],/automatic/);
});
