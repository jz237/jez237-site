import test from 'node:test';
import assert from 'node:assert/strict';
import {CombatScoreboard} from '../src/event-rules';
import {DESTRUCTION_POINTS} from '../src/derby-moments';
test('destruction points add to a driver\'s score derby total; nothing or nonsense adds nothing',()=>{
 const board=new CombatScoreboard();
 const before=board.points(3);board.destruction(3,DESTRUCTION_POINTS.engine);board.destruction(3,DESTRUCTION_POINTS.rolled);
 assert.equal(board.points(3)-before,DESTRUCTION_POINTS.engine+DESTRUCTION_POINTS.rolled);
 board.destruction(3,0);board.destruction(3,-20);board.destruction(3,NaN);assert.equal(board.points(3)-before,DESTRUCTION_POINTS.engine+DESTRUCTION_POINTS.rolled);
 assert.ok(DESTRUCTION_POINTS.engine>DESTRUCTION_POINTS.rolled&&DESTRUCTION_POINTS.rolled>DESTRUCTION_POINTS.pit&&DESTRUCTION_POINTS.pit>DESTRUCTION_POINTS.wing);
});
