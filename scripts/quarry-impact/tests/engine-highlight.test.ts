import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards} from '../src/event-awards';
test('an engine dropping out is a highlight that outranks an ordinary failure',()=>{
 const a=new EventAwards();a.failure(4,'DIFF BROKEN',10);a.failure(2,'ENGINE OUT',20,34);
 const one=a.highlights(1);assert.equal(one[0].label,'ENGINE OUT','picked first when only one fits');assert.equal(one[0].victim,2);
 assert.deepEqual(a.highlights(5).map(m=>m.label),['DIFF BROKEN','ENGINE OUT'],'shown in time order');
});
