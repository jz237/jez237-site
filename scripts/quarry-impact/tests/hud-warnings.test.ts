import test from 'node:test';
import assert from 'node:assert/strict';
import {HUD_WARNINGS,warningLine} from '../src/hud-warnings';
test('the warning line puts the urgent failures first and caps the list with a count of the rest',()=>{
 assert.equal(warningLine(['','']),'');
 assert.equal(warningLine(['TYRE RUBBING','GEARBOX DAMAGED · 3 GEARS']),'GEARBOX DAMAGED · 3 GEARS · TYRE RUBBING');
 const all=['TYRE RUBBING','EXHAUST BLOWING','ELECTRICAL FAULT','DAZED','FRAME BENT','TIE ROD SNAPPED','DIFF BROKEN'];
 assert.equal(warningLine(all),'DAZED · DIFF BROKEN · TIE ROD SNAPPED · +4');
 assert.equal(warningLine(all,10).split(' · ').length,all.length);assert.equal(HUD_WARNINGS.max,3);
 assert.equal(warningLine(['SOMETHING NEW','EXHAUST BLOWING']),'EXHAUST BLOWING · SOMETHING NEW','unknown warnings go last, in order');
});
