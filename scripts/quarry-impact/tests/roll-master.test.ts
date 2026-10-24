import test from 'node:test';
import assert from 'node:assert/strict';
import {EventAwards} from '../src/event-awards';
const car=(id:number)=>({id,inflicted:0,health:50,finished:false});
test('the driver who rolled the most cars is the roll master; each roll is a ROLLOVER highlight',()=>{
 const a=new EventAwards();
 a.rolled(2,0,10);a.rolled(2,1,20);a.rolled(1,3,30);a.rolled(4,4,31);a.rolled(-1,3,32);
 const award=a.awards('derby',[car(0),car(1),car(2),car(3)] as never).find(x=>x.key==='roller');
 assert.ok(award);assert.equal(award!.id,2);assert.equal(award!.value,2);assert.equal(award!.detail,'rolled 2 cars');
 a.reset();assert.ok(!a.awards('derby',[car(0)] as never).some(x=>x.key==='roller'),'nothing rolled, no award');
});
