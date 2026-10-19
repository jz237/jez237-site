import test from 'node:test';
import assert from 'node:assert/strict';
import {ELIMINATION_INTERVAL,eliminationActive,nextElimination} from '../src/elimination-race';
import {readEventOptions} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
test('elimination applies only to custom lap races without a time limit',()=>{
 const on={elimination:true as const},off={};
 assert.equal(eliminationActive('race',true,false,'laps',on,off),true);assert.equal(eliminationActive('race',true,true,'laps',off,on),true,'demo reads its own options');
 assert.equal(eliminationActive('race',true,true,'laps',on,off),false);assert.equal(eliminationActive('derby',true,false,'laps',on,off),false);
 assert.equal(eliminationActive('race',false,false,'laps',on,off),false,'challenges and quick races keep their rules');assert.equal(eliminationActive('race',true,false,'ordered',on,off),false);
 assert.equal(eliminationActive('race',true,false,'laps',{elimination:true,raceDuration:120},off),false,'timed races win');
 assert.equal(ELIMINATION_INTERVAL,30);
});
test('the last running car goes out until one is left',()=>{
 assert.equal(nextElimination([4,1,7,2]),2);assert.equal(nextElimination([4,1]),1);assert.equal(nextElimination([4]),null);assert.equal(nextElimination([]),null);
});
test('event and demo options persist elimination only as an untimed, non-chase lap rule',()=>{
 assert.equal(readEventOptions(JSON.stringify({version:1,elimination:true})).elimination,true);
 assert.ok(!Object.hasOwn(readEventOptions(JSON.stringify({version:1,elimination:true,raceDuration:120})),'elimination'));
 assert.ok(!Object.hasOwn(readEventOptions(JSON.stringify({version:1,elimination:true,pursuit:true})),'elimination'));
 assert.ok(!Object.hasOwn(readEventOptions(JSON.stringify({version:1,elimination:'yes'})),'elimination'));
 assert.equal(readDemoOptions(JSON.stringify({version:1,elimination:true})).elimination,true);assert.ok(!Object.hasOwn(readDemoOptions(),'elimination'));
});
