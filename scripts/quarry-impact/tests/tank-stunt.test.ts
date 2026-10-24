import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,stuntsText} from '../src/event-awards';
test('dropping a rival\'s fuel tank is a highlight and a stunt on the results line',()=>{
 const a=new EventAwards();a.tanked(0,2,12);a.tanked(0,3,40);a.tanked(-1,2,50);a.tanked(4,4,60);
 assert.equal(a.stunts(0).tanks,2);assert.equal(a.stunts(4).tanks,0,'not your own tank');
 assert.ok(stuntsText(a.stunts(0)).includes('2 TANKS DROPPED'));
 assert.deepEqual((a.highlights(5) as {label?:string}[]).map(m=>m.label),['TANK DOWN','TANK DOWN']);
});
