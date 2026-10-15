import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceStartControl as prepare} from '../native-race-start-control.js';

const BASE=0x80227788,CHARGE=0x80228a90,STAGE=0x80228d08,OFFSET=0x80228d0c,LIMIT=0x80228d10,LATCH=0x80228b58;
const index=a=>(a-BASE)/4;
function hud({charge=60,stage=1,offset=0,limit=100,latches=0}={}){
 const w=Array.from({length:1442},(_,i)=>(0x19000000+i)>>>0);
 for(const [a,v]of [[CHARGE,charge],[STAGE,stage],[OFFSET,offset],[LIMIT,limit],[LATCH,latches]])w[index(a)]=v>>>0;
 return w;
}
const input=(extra={})=>({phase650:1,activity624:-1,racerCount:1,pressedButtonsB58BySlot:[0],...extra});
const write=(a,v)=>({kind:'hudWrite',byteOffset:a-BASE,width:4,value:v>>>0});
const sound=(a,b)=>({kind:'audioEntry',consumer:'800c37f4',arguments:[a>>>0,b>>>0]});
const scene=(field,value)=>({kind:'sourceWordWrite',field,value});
function apply(state,ops){
 for(const op of ops){
  if(op.kind==='hudWrite'){
   const i=op.byteOffset>>>2;if(op.width===4)state.hud[i]=op.value;
   else{const shift=24-(op.byteOffset&3)*8;state.hud[i]=((state.hud[i]&~(255<<shift))|(op.value<<shift))>>>0;}
  }else if(op.kind==='recordWordWrite')state.records[op.racerIndex][op.wordIndex]=op.value;
  else if(op.kind==='sourceWordWrite')state[op.field]=op.value|0;
  else state.audio.push(op);
 }
}

test('actual retained retraction runs before charge and preserves duplicate source stores',()=>{
 assert.deepEqual(prepare(hud({stage:0,offset:100}),{phase650:1}).operations,[write(OFFSET,97)]);
 assert.deepEqual(prepare(hud({stage:0,offset:3}),{phase650:2}).operations,[write(OFFSET,0),write(OFFSET,0),write(STAGE,1)]);
 assert.deepEqual(prepare(hud({stage:0,offset:1}),{phase650:1}).operations,[write(OFFSET,-2),write(OFFSET,0),write(STAGE,1)]);
});

test('countdown audio precedes the actual charge write with raw register arguments',()=>{
 assert.deepEqual(prepare(hud({charge:60}),input()).operations,[sound(0x22,3),write(CHARGE,59)]);
 assert.deepEqual(prepare(hud({charge:15}),input({phase650:2})).operations,[sound(0x23,0),write(CHARGE,14)]);
 assert.deepEqual(prepare(hud({charge:-15}),{phase650:1}).operations,[sound(0x22,-2),write(CHARGE,-16),scene('phase650',3),write(STAGE,2)]);
});

test('new charge15 starts the clock in phase2 and new zero advances phase3',()=>{
 assert.deepEqual(prepare(hud({charge:16}),input()).operations,[write(CHARGE,15),scene('phase650',2),scene('clockStopped817c',0)]);
 assert.deepEqual(prepare(hud({charge:1}),input({phase650:2})).operations,[write(CHARGE,0),scene('phase650',3),write(STAGE,2)]);
 assert.deepEqual(prepare(hud({charge:0}),{phase650:1}).operations,[sound(0x22,-1),write(CHARGE,-1),scene('phase650',3),write(STAGE,2)]);
});

test('an ordinary60-call countdown has four ordered cues and does not own elapsed race time',()=>{
 const records=Array.from({length:4},(_,i)=>Array.from({length:222},(_,j)=>0x31000000+i*256+j));
 const state={hud:hud(),records:structuredClone(records),phase650:1,clockStopped817c:1,audio:[]};
 for(let frame=1;frame<=60;frame++){
  apply(state,prepare(state.hud,input({phase650:state.phase650})).operations);
  if(frame===44){assert.equal(state.phase650,1);assert.equal(state.clockStopped817c,1);}
  if(frame===45){assert.equal(state.phase650,2);assert.equal(state.clockStopped817c,0);}
 }
 assert.equal(state.hud[index(CHARGE)],0);assert.equal(state.hud[index(STAGE)],2);assert.equal(state.phase650,3);
 assert.deepEqual(state.audio,[sound(0x22,3),sound(0x22,2),sound(0x22,1),sound(0x23,0)]);
 assert.deepEqual(state.records,records,'canonical timer/record words are entirely untouched without an input edge');
});

test('launch timing distances0..4 award power5..1 before both flags and the latch',()=>{
 for(let distance=0;distance<=4;distance++)for(const sign of [-1,1]){
  const charge=15+sign*distance,ops=prepare(hud({charge}),input({pressedButtonsB58BySlot:[0x8000]})).operations;
  const start=ops[0].kind==='audioEntry'?1:0;
  assert.deepEqual(ops.slice(start,start+4),[
   {kind:'recordWordWrite',racerIndex:0,wordIndex:75,value:5-distance},
   {kind:'recordWordWrite',racerIndex:0,wordIndex:197,value:1},
   {kind:'recordWordWrite',racerIndex:0,wordIndex:10,value:1},
   {kind:'hudWrite',byteOffset:LATCH-BASE,width:1,value:1}]);
 }
});

test('distance5..14 latches the edge without inventing power or checkpoint flags',()=>{
 for(const charge of [1,10,20,29]){
  const ops=prepare(hud({charge}),input({pressedButtonsB58BySlot:[0x2000]})).operations;
  assert.equal(ops.some(o=>o.kind==='recordWordWrite'),false);
  assert.deepEqual(ops.find(o=>o.kind==='hudWrite'&&o.width===1),{kind:'hudWrite',byteOffset:LATCH-BASE,width:1,value:1});
 }
 for(const charge of [0,30,31])assert.equal(prepare(hud({charge}),{phase650:1}).operations.some(o=>o.width===1),false);
});

test('launch uses actual pressedB58 A or B bits, not held or working buttons',()=>{
 const q=input({pressedButtonsB58BySlot:[0],heldButtonsB50:0x8000,workingButtonsB56:0x8000});
 assert.equal(prepare(hud({charge:16}),q).operations.some(o=>o.kind==='recordWordWrite'),false);
 for(const edge of [0x8000,0x2000,0xa000])assert.equal(prepare(hud({charge:16}),input({pressedButtonsB58BySlot:[edge]})).operations.filter(o=>o.kind==='recordWordWrite').length,3);
 for(const edge of [0x1000,0x10,0])assert.equal(prepare(hud({charge:16}),input({pressedButtonsB58BySlot:[edge]})).operations.some(o=>o.width===1),false);
});

test('signed latch bytes isolate all four racers and reject a second edge until the real owner resets them',()=>{
 const h=hud({charge:16,latches:0x0001ff00});
 const state={hud:h,records:Array.from({length:4},()=>Array(222).fill(0x45454545)),phase650:1,audio:[]};
 const q=input({racerCount:4,pressedButtonsB58BySlot:[0x8000,0x8000,0x8000,0x2000]});
 const first=prepare(h,q).operations;assert.deepEqual(first.filter(o=>o.kind==='recordWordWrite').map(o=>o.racerIndex),[0,0,0,3,3,3]);
 apply(state,first);assert.equal(state.hud[index(LATCH)],0x0101ff01);
 const next=prepare(state.hud,{...q,phase650:2}).operations;assert.equal(next.some(o=>o.kind==='recordWordWrite'),false);
 assert.equal(state.records[1][75],0x45454545);assert.equal(state.records[2][75],0x45454545);
});

test('post-countdown restoration reads actual signed16 activity and never clamps its offset to the limit',()=>{
 const h=hud({stage:2,offset:98,limit:100});
 assert.deepEqual(prepare(h,{phase650:3,activity624:-1}).operations,[write(OFFSET,104),write(STAGE,0)]);
 for(const activity624 of [-32768,0,1,32767])assert.deepEqual(prepare(h,{phase650:3,activity624}).operations,[]);
 assert.deepEqual(prepare(hud({stage:1}),{phase650:3}).operations,[]);
 assert.deepEqual(prepare(hud({stage:2,offset:0}),{phase650:0,activity624:-1}).operations,[write(OFFSET,6)]);
});

test('any nonzero stage still enters countdown while source phase is1 or2',()=>{
 for(const stage of [-2147483648,-1,1,2,2147483647])assert.deepEqual(prepare(hud({charge:31,stage}),{phase650:2}).operations,[write(CHARGE,30)]);
});

test('integer subtract/add wrap and INT_MIN absolute wrap are literal source behavior',()=>{
 assert.deepEqual(prepare(hud({stage:0,offset:-2147483648}),{phase650:1}).operations,[write(OFFSET,2147483645)]);
 assert.deepEqual(prepare(hud({stage:2,offset:2147483647}),{phase650:3,activity624:-1}).operations,[write(OFFSET,-2147483643)]);
 assert.deepEqual(prepare(hud({charge:-2147483648}),{phase650:1}).operations,[write(CHARGE,2147483647)]);
 const ops=prepare(hud({charge:-2147483633}),input({pressedButtonsB58BySlot:[0x8000]})).operations;
 assert.deepEqual(ops.filter(o=>o.kind==='recordWordWrite'),[
  {kind:'recordWordWrite',racerIndex:0,wordIndex:75,value:5},
  {kind:'recordWordWrite',racerIndex:0,wordIndex:197,value:1},
  {kind:'recordWordWrite',racerIndex:0,wordIndex:10,value:1}]);
});

test('conditional source inputs are required only when their reads occur',()=>{
 assert.doesNotThrow(()=>prepare(hud({stage:0}),{phase650:1}));
 assert.doesNotThrow(()=>prepare(hud({charge:31}),{phase650:1}));
 assert.doesNotThrow(()=>prepare(hud({charge:16}),{phase650:1,racerCount:0}));
 assert.throws(()=>prepare(hud({charge:16}),{phase650:1}),/racerCount/);
 assert.throws(()=>prepare(hud({stage:2}),{phase650:3}),/activity624/);
});

test('preparation is atomic and every operation is a detached immutable value',()=>{
 const h=hud({charge:15}),q=input({racerCount:2,pressedButtonsB58BySlot:[0x8000,NaN]}),before=structuredClone(h);
 assert.throws(()=>prepare(h,q),/pressedButtonsB58/);assert.deepEqual(h,before);
 const result=prepare(h,input({pressedButtonsB58BySlot:[0xa000]}));
 assert(Object.isFrozen(result)&&Object.isFrozen(result.operations)&&Object.isFrozen(result.operations[0].arguments));
 assert.throws(()=>{result.operations[0].arguments[0]=99;},TypeError);assert.deepEqual(h,before);
});

test('malformed raw spans and unsupported input domains reject instead of manufacturing neutral state',()=>{
 assert.throws(()=>prepare(Array(1441).fill(0),input()),/1442/);
 const h=hud();h[9]=1.5;assert.throws(()=>prepare(h,input()),/HUD word/);
 assert.throws(()=>prepare(hud(),{}),/phase650/);
 assert.throws(()=>prepare(hud({charge:15}),input({racerCount:5})),/racerCount/);
 assert.throws(()=>prepare(hud({charge:15}),input({pressedButtonsB58BySlot:[65536]})),/pressedButtonsB58/);
 assert.throws(()=>prepare(hud({stage:2}),{phase650:3,activity624:65535}),/activity624/);
});
