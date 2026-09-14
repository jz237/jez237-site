import test from 'node:test';import assert from 'node:assert/strict';
import {createClock,stepClock,skipToHour,setHour,hourOfDay,fromLocal,localParts,tzOffsetMinutes} from '../game-clock.js';
test('simulated time runs at the chosen rate',()=>{const c=createClock({start:0,rate:4});stepClock(c,10);assert.equal(c.ms,40000);c.rate=1;stepClock(c,1);assert.equal(c.ms,41000);});
test('real mode tracks the wall clock',()=>{const c=createClock({start:0,mode:'real'});stepClock(c,1,123456);assert.equal(c.ms,123456);});
test('local conversions round-trip across daylight saving',()=>{
 for(const parts of [{year:2026,month:1,day:15,hour:6,minute:30},{year:2026,month:7,day:4,hour:20,minute:15},{year:2026,month:11,day:1,hour:1,minute:30}]){
  const ms=fromLocal(parts);const back=localParts(ms);assert.equal(back.hour,parts.hour);assert.equal(back.minute,parts.minute);assert.equal(back.day,parts.day);}
 assert.equal(tzOffsetMinutes(fromLocal({year:2026,month:7,day:4,hour:12})),-240);
 assert.equal(tzOffsetMinutes(fromLocal({year:2026,month:1,day:4,hour:12})),-300);
});
test('skip lands on the next occurrence of the requested hour',()=>{
 const c=createClock({start:fromLocal({year:2026,month:9,day:13,hour:9}),rate:4});
 const target=skipToHour(c,5.5,{duration:2});
 assert.ok(Math.abs(hourOfDay(target)-5.5)<1/60);assert.equal(localParts(target).day,14);
 stepClock(c,1);assert.ok(c.ms>c.skip.from&&c.ms<target);stepClock(c,1.5);assert.equal(c.ms,target);assert.equal(c.skip,null);
 setHour(c,19);assert.ok(Math.abs(hourOfDay(c.ms)-19)<1/60);
});
