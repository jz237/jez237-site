import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceStatusPrelude as prepare} from '../native-race-status-prelude.js';
const index=a=>(a-0x7788)/4;
const write=(a,v)=>({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});
function fixture(values={},scene={mode620:1,players:2}){
 const hudWords7788=Array.from({length:1442},(_,i)=>0x16000000+i);
 for(const [a,v]of Object.entries({0x8aa4:0,0x8aa8:0,0x8e00:0,0x8e04:0,0x8e08:0,0x8e0c:0,...values}))hudWords7788[index(Number(a))]=v>>>0;
 return {hudWords7788,scene};
}

test('status panels move by the literal30 without a coordinate clamp or render delta',()=>{
 assert.deepEqual(prepare(fixture({0x8aa4:1,0x8b50:300,0x8b54:20},{mode620:0})).operations,
  [write(0x8b50,330),write(0x8b54,-10),write(0x8aa4,2)]);
 assert.deepEqual(prepare(fixture({0x8aa4:1,0x8b50:289,0x8b54:100},{mode620:0})).operations,
  [write(0x8b50,319),write(0x8b54,70)]);
 assert.deepEqual(prepare(fixture({0x8aa4:2},{mode620:0})).operations,[]);
});

test('panel integer wrapping uses the new signed coordinate for the completion gate',()=>{
 assert.deepEqual(prepare(fixture({0x8aa4:1,0x8b50:2147483647,0x8b54:-2147483648},{mode620:4})).operations,
  [write(0x8b50,-2147483619),write(0x8b54,2147483618)]);
});

test('versus events set both statuses then reset and advance the visited counters in the same call',()=>{
 for(const [event,statuses]of [[1,[1,2]],[2,[2,1]]])assert.deepEqual(prepare(fixture({0x8aa8:event})).operations,
  [write(0x8e00,statuses[0]),write(0x8e04,statuses[1]),write(0x8aa8,0),write(0x8e0c,0),write(0x8e08,0),write(0x8e08,1),write(0x8e0c,1)]);
});

test('other nonzero events preserve their actual secondary-first store order',()=>{
 assert.deepEqual(prepare(fixture({0x8aa8:-1},{mode620:1,players:0})).operations,
  [write(0x8e04,3),write(0x8e00,3),write(0x8aa8,0),write(0x8e0c,0),write(0x8e08,0)]);
});

test('retained status counters saturate independently and nonzero negative statuses remain active',()=>{
 assert.deepEqual(prepare(fixture({0x8e00:-1,0x8e04:1,0x8e08:2147483647,0x8e0c:-2147483648})).operations,[write(0x8e0c,-2147483647)]);
 assert.deepEqual(prepare(fixture({0x8e00:0,0x8e04:0,0x8e08:77,0x8e0c:88})).operations,[]);
});

test('player prefix and mode gate preserve unvisited status/timer history',()=>{
 assert.deepEqual(prepare(fixture({0x8e00:1,0x8e04:1,0x8e08:77,0x8e0c:88},{mode620:1,players:1})).operations,[write(0x8e08,78)]);
 assert.deepEqual(prepare(fixture({0x8aa8:1},{mode620:0})).operations,[]);
 assert.deepEqual(prepare(fixture({0x8e00:1},{mode620:1,players:-1})).operations,[]);
});

test('preparation is detached, immutable and validates bounded conditional inputs',()=>{
 const q=fixture({0x8aa8:2}),before=structuredClone(q),r=prepare(q);assert.deepEqual(q,before);
 assert(Object.isFrozen(r.operations[0]));assert.throws(()=>{r.operations[0].value=0;},TypeError);
 assert.throws(()=>prepare(fixture({},{})),/mode620/);
 assert.throws(()=>prepare(fixture({},{mode620:1})),/players/);
 assert.throws(()=>prepare(fixture({},{mode620:1,players:3})),/players/);
 assert.throws(()=>prepare({hudWords7788:[],scene:{mode620:0}}),/1442/);
});
