import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshNativeAnnouncer,prepareNativeAnnouncer,advanceNativeRaceAnnouncer} from '../native-announcer.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-announcer-reference.json',import.meta.url)));
const context={raceMode:0,courseIndex:1,audioMode:7,delay7cd8:0};
test('original instruction executions preserve priority, byte stores, course/mode gates and delayed slot history',()=>{
 for(const c of [...reference.cases,...reference.history])assert.deepEqual(prepareNativeAnnouncer(c.input,c.command,c.context),c.expected,JSON.stringify(c));
});
test('original BF370 racing timers run voice selection before decrementing its newly selected hold',()=>{
 for(const c of reference.timers)assert.deepEqual(advanceNativeRaceAnnouncer(c.input,c.context),c.expected,JSON.stringify(c));
});
test('blocked delayed notes do not retry and a zero delay does not play immediately',()=>{
 let state=freshNativeAnnouncer();const step=(consumer,...args)=>{const r=prepareNativeAnnouncer(state,{consumer,arguments:args},context);state=r.state;return r;};
 step('c32a0',10,100,10);step('c33c8',80,1,50,30);assert.deepEqual(step('c3494').commands,[]);
 assert.equal(state.delay,0);assert.equal(state.delayedHold,10);
 for(let i=0;i<20;i++)assert.deepEqual(step('c3494').commands,[]);
 step('c33c8',90,0,100,30);assert.deepEqual(step('c3494').commands,[]);
 step('c33c8',94,1,100,30);assert.deepEqual(step('c3494').commands,[{consumer:'c53d4',arguments:[0x06000c00,94]}]);assert.equal(state.hold,29);
});
