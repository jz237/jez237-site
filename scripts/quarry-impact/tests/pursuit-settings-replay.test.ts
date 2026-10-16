import test from 'node:test';import assert from 'node:assert/strict';
import {DEFAULT_EVENT,readEventOptions} from '../src/event-rules';import {DEFAULT_DEMO,readDemoOptions} from '../src/demo-session';
import {encodeReplay,decodeReplay,REPLAY_STRIDE,type ReplayDocument} from '../src/replay-data';import {defaultReplayName} from '../src/replay-library';import {stockSetup} from '../src/garage';import {validOnlineEventRules,DEFAULT_ONLINE_EVENT} from '../src/online-events';
test('chase preferences round-trip without changing legacy defaults or opening unsupported online rules',()=>{
 assert.equal(readEventOptions().pursuit,undefined);assert.equal(readDemoOptions().pursuit,undefined);
 for(const value of [true,false,'true',1]){assert.equal(readEventOptions(JSON.stringify({...DEFAULT_EVENT,pursuit:value})).pursuit,value===true?true:undefined);assert.equal(readDemoOptions(JSON.stringify({...DEFAULT_DEMO,pursuit:value})).pursuit,value===true?true:undefined);}
 assert.equal(validOnlineEventRules({...DEFAULT_ONLINE_EVENT,pursuit:true}),false);
});
test('Chase replays retain mode identity and reject malformed/nonrace flags',()=>{
 const values=new Float32Array(REPLAY_STRIDE);values[6]=1;values[14]=100;for(let j=0;j<4;j++)values[15+j*8+6]=1;
 const doc:ReplayDocument={meta:{version:1,mode:'race',pursuit:true,reverse:true,cars:[{id:0,kind:'coupe',setup:stockSetup('coupe')}],props:0,created:'2026-10-16'},frames:[{time:0,values}],events:[],limited:false};
 assert.deepEqual(decodeReplay(encodeReplay(doc)),doc);assert.match(defaultReplayName(doc),/Chase/);
 for(const pursuit of [false,'true',1])assert.throws(()=>decodeReplay(encodeReplay({...doc,meta:{...doc.meta,pursuit} as any})));
 assert.throws(()=>decodeReplay(encodeReplay({...doc,meta:{...doc.meta,mode:'derby'}})));
 const legacy=structuredClone(doc);delete legacy.meta.pursuit;assert.deepEqual(decodeReplay(encodeReplay(legacy)),legacy);
});
