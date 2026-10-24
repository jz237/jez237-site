import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards,STILL_STANDING} from '../src/event-awards';
test('STILL STANDING goes to the running car with the most of itself gone, never a wreck or a whole car',()=>{
 const a=new EventAwards(),car=(id:number,health:number,partsGone?:number)=>({id,inflicted:0,health,partsGone});
 const award=a.awards('derby',[car(0,40,STILL_STANDING),car(1,0,9),car(2,10,STILL_STANDING+2),car(3,90,1)]).find(x=>x.key==='standing');
 assert.ok(award);assert.equal(award!.id,2,'the wreck (#2) does not count');assert.equal(award!.detail,`finished with ${STILL_STANDING+2} parts gone`);
 assert.ok(!a.awards('derby',[car(0,50,STILL_STANDING-1),car(1,50)]).some(x=>x.key==='standing'),'not stripped enough');
});
