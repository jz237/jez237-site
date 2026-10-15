import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceWaveSelection as prepare} from '../native-race-wave-selection.js';

const write=(field,value)=>({kind:'sourceWordWrite',field,value});
const unused=()=>{throw new Error('unused source input was read');};

test('kind0 uses pending signed player count and explicit signed course halfwords',()=>{
 const one={kind:0,pendingPlayers60c:1,courseIndex:1,courseWaves1P:[20,-32768,32767],get courseWavesOther(){return unused();},get rngState4640(){return unused();}};
 const v=prepare(one);assert.equal(v.waveValue,-32768);assert.deepEqual(v.operations,[write('state600',0)]);
 assert.equal(v.rngCalls,0);assert.equal(Object.hasOwn(v,'rngState4640'),false);
 for(const pendingPlayers60c of [-32768,-1,0,2,32767]){
  const q=prepare({kind:0,pendingPlayers60c,courseIndex:2,courseWavesOther:[0,-12,32767]});
  assert.equal(q.waveValue,32767);assert.deepEqual(q.operations,[write('state600',0)]);
 }
});

test('fixed kinds do not read course tables, pending count or RNG state',()=>{
 for(const [kind,waveValue]of [[1,10],[2,40]]){
  const input={kind};for(const field of ['courseIndex','courseWaves1P','courseWavesOther','pendingPlayers60c','rngState4640'])Object.defineProperty(input,field,{get:unused});
  const v=prepare(input);assert.equal(v.waveValue,waveValue);assert.equal(v.rngCalls,0);
  assert.deepEqual(v.operations,[write('state600',1)]);assert.equal(Object.hasOwn(v,'rngState4640'),false);
 }
});

test('random kind consumes the retained unsigned word once after the mode write',()=>{
 // Independently checked against the actual bounded source and shared RNG.
 for(const [seed,next,wave]of [[0,12345,17],[1,1103527590,16],[0xffffffff,3191464396,22],[0x12345678,191992145,10]]){
  const v=prepare({kind:3,rngState4640:seed});assert.equal(v.waveValue,wave);assert.equal(v.rngState4640,next);assert.equal(v.rngCalls,1);
  assert.deepEqual(v.operations,[write('state600',1),write('rngState4640',next)]);
 }
});

test('selection is detached and does not mutate or invent a retained seed',()=>{
 const input={kind:0,pendingPlayers60c:1,courseIndex:0,courseWaves1P:[27]},copy=structuredClone(input),v=prepare(input);
 assert.deepEqual(input,copy);input.courseWaves1P[0]=99;assert.equal(v.waveValue,27);
 assert.equal(Object.isFrozen(v),true);assert.equal(Object.isFrozen(v.operations),true);assert.equal(Object.isFrozen(v.operations[0]),true);
 assert.throws(()=>{v.operations[0].value=9;},TypeError);
 assert.throws(()=>prepare({kind:3}),/rngState4640/);
});

test('uninitialized kinds and invalid required source fields reject atomically',()=>{
 for(const kind of [-1,4,NaN,1.5,undefined])assert.throws(()=>prepare({kind}),/kind/);
 for(const rngState4640 of [-1,0x100000000,1.5,NaN])assert.throws(()=>prepare({kind:3,rngState4640}),/rngState4640/);
 const base={kind:0,pendingPlayers60c:1,courseIndex:0,courseWaves1P:[20]};
 assert.throws(()=>prepare({...base,pendingPlayers60c:32768}),/pendingPlayers60c/);
 assert.throws(()=>prepare({...base,courseIndex:1}),/courseIndex/);
 assert.throws(()=>prepare({...base,courseWaves1P:[32768]}),/courseWaves1P/);
 assert.throws(()=>prepare({...base,courseWaves1P:new Array(1)}),/courseWaves1P/);
 assert.throws(()=>prepare({...base,courseWaves1P:[20,,40]}),/courseWaves1P/);
 assert.throws(()=>prepare(null),/input/);
});
