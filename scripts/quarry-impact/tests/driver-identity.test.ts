import test from 'node:test';import assert from 'node:assert/strict';
import {driverLabel,resultDriverLabel} from '../src/driver-identity';
import {standingsTable} from '../src/standings-view';
import {derbyFeedMarkup} from '../src/derby-event-feed';
test('human and AI labels use stable one-based slots, independent of ranking or local player order',()=>{
 const members=[{id:23,name:'GUEST',connected:true},{id:0,name:'HOST',connected:true}];
 assert.equal(driverLabel({id:23,kind:'kite'},members),'GUEST · #24');
 assert.equal(driverLabel({id:0,kind:'kite'},members),'HOST · #1');
 assert.equal(driverLabel({id:14,kind:'kite'},members),'KITE 2000 #15');
 assert.equal(driverLabel({id:0,kind:'kite'},[{...members[1],connected:false}]),'KITE 2000 #1');
 assert.equal(driverLabel({id:0,kind:'kite'}),'KITE 2000 #1');
 assert.equal(resultDriverLabel('GUEST · #24',true),'GUEST · #24 · YOU');
});
test('untrusted driver text remains text in results, standings and collision notices',()=>{
 const label=driverLabel({id:1,kind:'kite'},[{id:1,name:'<img src=x onerror="bad"> & guest',connected:true}]);
 const result=resultDriverLabel(label,false);assert.ok(result.includes('&lt;img'));assert.ok(!result.includes('<img'));
 const feed=derbyFeedMarkup([{id:1,driver:1,name:label,kind:'knockout',count:1,time:0}],1);assert.ok(feed.includes('&lt;img'));assert.ok(!feed.includes('<img'));
 const standings=standingsTable([{id:1,name:label,health:99,player:false,followed:false,detail:'1 PTS'}]);assert.ok(standings.includes('&lt;img'));assert.ok(!standings.includes('<img'));
});
