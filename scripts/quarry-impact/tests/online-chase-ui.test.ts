import test from 'node:test';import assert from 'node:assert/strict';
import {onlineChaseControls} from '../src/online-chase-ui';import {readOnlineEventControls} from '../src/online-event-ui';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';
const fields:Record<string,string>={'online-chase':'chase','online-chase-duration':'60','online-laps':'2','online-direction':'reverse','online-race-format':'laps','online-derby-format':'survival','online-duration':'300','online-race-finish':'laps'};
const root=(runners:number[],values=fields)=>({querySelector:(id:string)=>({value:values[id.slice(1)]}),querySelectorAll:()=>runners.map(id=>({dataset:{chaseRunner:String(id)}}))})as unknown as ParentNode;
test('host runner selections produce explicit slots and bounded Chase time',()=>{
 const rules=readOnlineEventControls(root([1,7]));assert.deepEqual(rules?.chase,{version:1,runners:[1,7],duration:60});assert.equal(rules?.direction,'reverse');assert.equal(rules?.laps,2);
 assert.equal(readOnlineEventControls(root([])),null);assert.equal(readOnlineEventControls(root([0],{...fields,'online-chase-duration':'0'})),null);
 assert.equal(readOnlineEventControls(root([0],{...fields,'online-chase':'race'}))?.chase,undefined);
});
test('team selector names are escaped and unsupported servers cannot select Chase',()=>{
 const html=onlineChaseControls(DEFAULT_ONLINE_EVENT,false,8,[{id:1,name:'<img src=x>',kind:'coupe',host:false,connected:true}]);assert.match(html,/id="online-chase" disabled/);assert.ok(html.includes('&lt;img src=x&gt;'));assert.equal((html.match(/data-chase-runner=/g)??[]).length,8);
 const enabled=onlineChaseControls({...DEFAULT_ONLINE_EVENT,chase:{version:1,runners:[1],duration:60}},true,24,[]);assert.equal((enabled.match(/data-chase-runner=/g)??[]).length,24);assert.match(enabled,/data-chase-runner="1" checked/);
});
