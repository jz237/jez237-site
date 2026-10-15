import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeMathRand,prepareNativeRaceSpeedDisplay} from '../native-race-speed-display.js';
import {createNativeRaceState,prepareNativeRaceStateOperations} from '../native-race-state.js';

const ri=a=>(a-0x1f94)/4;
function fixture(count=1,seed=0){return {raceWords1f94:Array.from({length:1693},(_,i)=>(0x65000000+i)>>>0),
 hudWords7788:Array.from({length:1442},(_,i)=>(0x76000000+i)>>>0),scene:{racerCount:count,...(seed===undefined?{}:{seed6f00:seed})}};}
const body=(frameSpeedB98=50,speedBbc=60,speedBc0=50)=>({frameSpeedB98,speedBbc,speedBc0});
function sample(state,rows){return prepareNativeRaceSpeedDisplay(state,{bodyFieldsBySlot:rows});}
const wordWrites=(r,address)=>r.operations.filter(o=>o.kind==='raceWordWrite'&&o.wordIndex===ri(address)).map(o=>o.value|0);

test('source Math_Rand uses its separate16-bit recurrence and signed low-product return',()=>{
 assert.deepEqual(prepareNativeMathRand({seed6f00:0,argumentU32:3}),{value:0,operations:[{kind:'sourceHalfwordWrite',field:'seed6f00',value:1}]});
 assert.deepEqual(prepareNativeMathRand({seed6f00:65535,argumentU32:3}),{value:2,operations:[{kind:'sourceHalfwordWrite',field:'seed6f00',value:65532}]});
 assert.equal(prepareNativeMathRand({seed6f00:65535,argumentU32:0xffffffff}).value,-1);
 const zero=prepareNativeMathRand({seed6f00:65535,argumentU32:0});assert.equal(zero.value,0);assert.equal(zero.operations[0].value,65532);
 assert.ok(Object.isFrozen(zero.operations[0]));
});

test('upper branch stores target before seed, then jitter, then the eased canonical display',()=>{
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=0;const before=structuredClone(q),r=sample(q,[body()]);
 assert.deepEqual(r.operations,[{kind:'raceWordWrite',wordIndex:ri(0x2c04),value:30},
  {kind:'sourceHalfwordWrite',field:'seed6f00',value:1},{kind:'raceWordWrite',wordIndex:ri(0x2c04),value:28},
  {kind:'raceWordWrite',wordIndex:ri(0x2c00),value:4}]);
 assert.equal(r.diagnostic.randomDraws,1);assert.deepEqual(q,before);assert.ok(Object.isFrozen(r.operations));
});

test('below-threshold speed consumes no seed and preserves the faster downward easing',()=>{
 const q=fixture(1,undefined);q.raceWords1f94[ri(0x2c00)]=100;delete q.scene.seed6f00;
 Object.defineProperty(q.scene,'seed6f00',{get(){throw new Error('Unused seed was read');}});
 const r=sample(q,[body(47.5)]);assert.deepEqual(wordWrites(r,0x2c04),[35]);assert.deepEqual(wordWrites(r,0x2c00),[84]);
 assert.equal(r.diagnostic.randomDraws,0);assert.equal(r.operations.length,2);
});

test('threshold equality selects RNG and upper branch preserves its unclamped negative jitter',()=>{
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=0;const r=sample(q,[body(48)]);
 assert.deepEqual(wordWrites(r,0x2c04),[0,-2]);assert.deepEqual(wordWrites(r,0x2c00),[-2]);
 assert.equal(r.diagnostic.samples[0].upperBranch,true);
});

test('upper clamp is a separate later store and never erases the intermediate182',()=>{
 const q=fixture(1,65535);q.raceWords1f94[ri(0x2c00)]=0;const r=sample(q,[body(60)]);
 assert.deepEqual(wordWrites(r,0x2c04),[180,182,180]);assert.deepEqual(wordWrites(r,0x2c00),[4]);
 assert.equal(r.operations[1].kind,'sourceHalfwordWrite');
});

test('prepared synthetic boundary retains source float32 rounding before integer conversion',()=>{
 // Independently checked against the actual numeric consumer. Computing the
 // same interpolation with unrounded host doubles produces a different target.
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=0;
 const r=sample(q,[body(24.24189567565918,53.14078140258789,16.09092903137207)]);
 assert.deepEqual(wordWrites(r,0x2c04),[63,61]);assert.deepEqual(wordWrites(r,0x2c00),[4]);
});

test('zero/negative span retains source use of raw speed before fraction clamps',()=>{
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=0;
 assert.deepEqual(wordWrites(sample(q,[body(50,50,50)]),0x2c04),[180,178]);
 assert.deepEqual(wordWrites(sample(q,[body(22,10,20)]),0x2c04),[180,178]);
 assert.deepEqual(wordWrites(sample(q,[body(-2,-50,-10)]),0x2c04),[0,-2]);
});

test('all four source slots share RNG in order while lower branches do not advance it',()=>{
 const q=fixture(4,65535);for(let i=0;i<4;i++)q.raceWords1f94[ri(0x2c00+i*0x378)]=0;
 const r=sample(q,[body(50),body(0),body(50),body(50)]);
 assert.deepEqual(r.operations.filter(o=>o.kind==='sourceHalfwordWrite').map(o=>o.value),[65532,65517,65442]);
 assert.deepEqual(r.diagnostic.samples.map(s=>s.target2c04),[32,0,32,32]);assert.equal(r.diagnostic.randomDraws,3);
 for(let i=0;i<4;i++)assert.equal(wordWrites(r,0x2c00+i*0x378).length,1);
});

test('equal values still emit actual stores and minimum-step snapping does not overshoot',()=>{
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=35;
 assert.deepEqual(wordWrites(sample(q,[body(47.5)]),0x2c00),[35]);
 q.raceWords1f94[ri(0x2c00)]=34;assert.deepEqual(wordWrites(sample(q,[body(47.5)]),0x2c00),[35]);
 q.raceWords1f94[ri(0x2c00)]=36;assert.deepEqual(wordWrites(sample(q,[body(47.5)]),0x2c00),[35]);
});

test('source signed32 gap overflow is retained instead of repaired with a wider absolute difference',()=>{
 const q=fixture();q.raceWords1f94[ri(0x2c00)]=0x80000000;
 assert.deepEqual(wordWrites(sample(q,[body(0)]),0x2c00),[0]);
 q.raceWords1f94[ri(0x2c00)]=0x7fffffff;
 assert.deepEqual(wordWrites(sample(q,[body(0)]),0x2c00),[1610612736]);
});

test('zero racers reads neither body samples nor seed and changes no canonical words',()=>{
 const q=fixture(0);Object.defineProperty(q.scene,'seed6f00',{get(){throw new Error('Unused seed');}});
 const r=prepareNativeRaceSpeedDisplay(q);assert.deepEqual(r.operations,[]);assert.equal(r.diagnostic.randomDraws,0);
});

test('canonical commit changes only source display words and the external halfword',()=>{
 const q=fixture(2,65535);q.scene.mode620=4;
 q.raceWords1f94[ri(0x2c00)]=0;q.raceWords1f94[ri(0x2c00+0x378)]=100;
 const state=createNativeRaceState(q),r=sample(state,[body(60),body(47.5)]),committed=prepareNativeRaceStateOperations(state,r.operations);
 assert.equal(committed.state.scene.seed6f00,65532);assert.equal(committed.state.scene.mode620,4);
 const touched=new Set([ri(0x2c00),ri(0x2c04),ri(0x2c00+0x378),ri(0x2c04+0x378)]);
 for(let i=0;i<1693;i++)if(!touched.has(i))assert.equal(committed.state.raceWords1f94[i],q.raceWords1f94[i]);
 assert.deepEqual(committed.state.hudWords7788,q.hudWords7788);assert.deepEqual(committed.effects,[]);
 assert.equal(Object.hasOwn(r,'state'),false);assert.equal(Object.hasOwn(committed.state,'speed'),false);
});

test('active samples/seed are explicit and all late validation failures are atomic',()=>{
 const q=fixture();delete q.scene.seed6f00;const before=structuredClone(q);
 assert.throws(()=>sample(q,[body()]),/seed6f00/);assert.deepEqual(q,before);
 assert.throws(()=>prepareNativeRaceSpeedDisplay(q),/body fields/);
 const late=fixture(2);const lateBefore=structuredClone(late);
 assert.throws(()=>sample(late,[body(),body(NaN)]),/float32/);assert.deepEqual(late,lateBefore);
 assert.throws(()=>sample(late,[body()]),/body fields/);
 for(const n of [-1,5,1.5]){const bad=fixture(n);assert.throws(()=>sample(bad,[body()]),/racerCount/);}
});

test('unsupported conversion/owner/halfword inputs fail without guessed defaults',()=>{
 const q=fixture();assert.throws(()=>sample(q,[body(-1,0,0)]),/FCSR/);
 assert.throws(()=>sample(q,[body(Infinity)]),/float32/);
 assert.throws(()=>sample({...q,raceWords1f94:q.raceWords1f94.slice(1)},[body()]),/1693/);
 assert.throws(()=>sample({...q,hudWords7788:q.hudWords7788.slice(1)},[body()]),/1442/);
 for(const seed6f00 of [-1,65536,1.5,undefined])assert.throws(()=>prepareNativeMathRand({seed6f00,argumentU32:3}),/seed6f00/);
 for(const argumentU32 of [-1,4294967296,1.5])assert.throws(()=>prepareNativeMathRand({seed6f00:0,argumentU32}),/argumentU32/);
});

test('sparse canonical owners are rejected rather than interpreted as zero words',()=>{
 const q=fixture(0);delete q.raceWords1f94[ri(0x2c00)];assert.throws(()=>prepareNativeRaceSpeedDisplay(q),/raceWords1f94/);
 const h=fixture(0);delete h.hudWords7788[1];assert.throws(()=>prepareNativeRaceSpeedDisplay(h),/hudWords7788/);
});
