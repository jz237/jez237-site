import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRacePlacementFeedback as prepare} from '../native-race-placement-feedback.js';
const hi=a=>(a-0x7788)/4,ri=(slot,o)=>(0x2938-0x1f94)/4+slot*222+o/4;
const op=(a,v)=>({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});
const at=(r,a)=>r.operations.filter(x=>x.byteOffset===a-0x7788);
function fixture(count=2,players=1){
 const v={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),scene:{players,racerCount:count,primaryHumanIndex:0,secondaryHumanIndex:1,phase650:3},
 bodiesBySlot:Array.from({length:4},(_,i)=>({field15c0:0,positionNativeXZ:{x:0,z:i*200}}))};
 for(let i=0;i<4;i++){v.raceWords1f94[ri(i,4)]=i;v.raceWords1f94[ri(i,0x320)]=1;v.hudWords7788[hi(0x8de8)+i]=1;}
 return v;
}
function commit(v,result){for(const w of result.operations)v.hudWords7788[w.byteOffset/4]=w.value;}
function pulseFixture(){const v=fixture();v.hudWords7788[hi(0x8d28+0x14+4)]=28;return v;}

test('placement target stores precede per-view offsets and easing',()=>{
 const v=fixture(),r=prepare(v);
 assert.deepEqual(r.operations.slice(0,3),[op(0x8d28+12,0),op(0x8d28+0x14+12,24),op(0x8d28+0x14+12,28)]);
 assert.deepEqual(at(r,0x8d28+0x14+4),[op(0x8d28+0x14+4,4)]);
 assert.deepEqual(at(r,0x8d28+0x14+8),[op(0x8d28+0x14+8,8)]);
 assert.deepEqual(at(r,0x8d28+0x14),[op(0x8d28+0x14,2)]);
});

test('small row gaps snap while negative motion clears its lateral target',()=>{
 const v=fixture(1);v.hudWords7788[hi(0x8d2c)]=10;v.hudWords7788[hi(0x8d28)]=6;
 let r=prepare(v);assert.deepEqual(at(r,0x8d2c),[op(0x8d2c,6)]);assert.deepEqual(at(r,0x8d30),[op(0x8d30,0)]);assert.deepEqual(at(r,0x8d28),[op(0x8d28,4)]);
 v.hudWords7788[hi(0x8d2c)]=3;v.hudWords7788[hi(0x8d28)]=2;r=prepare(v);
 assert.deepEqual(at(r,0x8d2c),[op(0x8d2c,0)]);assert.deepEqual(at(r,0x8d28),[op(0x8d28,0)]);
});

test('signed32 displacement and place multiplication retain source wrap',()=>{
 const v=fixture(1);v.hudWords7788[hi(0x8d2c)]=0x80000000;
 assert.deepEqual(at(prepare(v),0x8d2c),[op(0x8d2c,0)]);
 v.raceWords1f94[ri(0,4)]=0x80000000;
 assert.deepEqual(at(prepare(v),0x8d34),[op(0x8d34,0)]);
});

test('each human view applies its own strict signed placement comparison',()=>{
 const v=fixture(3,2);v.scene.secondaryHumanIndex=2;const r=prepare(v);
 assert.deepEqual(at(r,0x8d28+0x14+12),[op(0x8d28+0x14+12,24),op(0x8d28+0x14+12,28)]);
 assert.deepEqual(at(r,0x8d28+0x50+0x14+12),[op(0x8d28+0x50+0x14+12,24)]);
 assert.deepEqual(at(r,0x8d28+0x50+0x28+12),[op(0x8d28+0x50+0x28+12,48)]);
});

test('body15c0 offset has accelerating descent and asymmetric one-step ascent',()=>{
 const v=fixture(1,0);v.bodiesBySlot[0].field15c0=2;const positions=[],rates=[];
 for(let i=0;i<5;i++){commit(v,prepare(v));positions.push(v.hudWords7788[hi(0x8dc8)]|0);rates.push(v.hudWords7788[hi(0x8de8)]|0);}
 assert.deepEqual(positions,[-2,-5,-9,-14,-15]);assert.deepEqual(rates,[2,3,4,5,1]);
 v.bodiesBySlot[0].field15c0=0;commit(v,prepare(v));assert.equal(v.hudWords7788[hi(0x8dc8)]|0,-14);
 commit(v,prepare(v));assert.equal(v.hudWords7788[hi(0x8dc8)]|0,-13);
});

test('body flagone selects minusfive and unknown states use the source zero branch',()=>{
 const v=fixture(1,0);v.bodiesBySlot[0].field15c0=1;
 assert.deepEqual(prepare(v).operations.slice(0,3),[op(0x8dd8,-5),op(0x8de8,2),op(0x8dc8,-2)]);
 v.bodiesBySlot[0].field15c0=-1;
 assert.deepEqual(prepare(v).operations.slice(0,2),[op(0x8de8,1),op(0x8dd8,0)]);
});

test('settled next-place proximity pulse ticks again in the initialization call',()=>{
 for(const [distance,writes]of [[255,[2,3]],[256,[1,2]],[511,[1,2]],[512,[]]]){
  const v=pulseFixture();v.bodiesBySlot[1].positionNativeXZ={x:distance,z:0};
  assert.deepEqual(at(prepare(v),0x8d28+0x14+16),writes.map(x=>op(0x8d28+0x14+16,x)));
 }
});

test('new pulse masking happens before the common active-counter increment',()=>{
 const v=pulseFixture();v.hudWords7788[hi(0x8d28+0x14+16)]=6;v.bodiesBySlot[1].positionNativeXZ={x:0,z:0};
 assert.deepEqual(at(prepare(v),0x8d28+0x14+16),[op(0x8d28+0x14+16,0)]);
 v.hudWords7788[hi(0x8d28+0x14+16)]=7;v.bodiesBySlot[1].positionNativeXZ.x=512;
 assert.deepEqual(at(prepare(v),0x8d28+0x14+16),[op(0x8d28+0x14+16,8),op(0x8d28+0x14+16,0)]);
});

test('existing pulses advance while completion, finish, progress, or phase blocks a fresh pulse',()=>{
 for(const gate of ['completion','finish','legal-lap','nearest-row','phase']){
  const v=pulseFixture();v.hudWords7788[hi(0x8d28+0x14+16)]=3;delete v.bodiesBySlot[0].positionNativeXZ;delete v.bodiesBySlot[1].positionNativeXZ;
  if(gate==='completion')v.raceWords1f94[(0x1fd4-0x1f94)/4]=1;
  else if(gate==='finish')v.raceWords1f94[ri(1,0x2f4)]=1;
  else if(gate==='legal-lap')v.raceWords1f94[ri(1,0x320)]=0;
  else if(gate==='nearest-row')v.raceWords1f94[ri(1,0x310)]=1;
  else v.scene.phase650=2;
  assert.deepEqual(at(prepare(v),0x8d28+0x14+16),[op(0x8d28+0x14+16,4)],gate);
 }
});

test('place-change state advances1to2to3to0 with same-call easing',()=>{
 const v=fixture(0,0);v.hudWords7788[hi(0x8a9c)]=1;const flags=[],offsets=[];
 for(let i=0;i<8;i++){commit(v,prepare(v));flags.push(v.hudWords7788[hi(0x8a9c)]);offsets.push(v.hudWords7788[hi(0x8df8)]);}
 assert.deepEqual(flags,[2,2,2,3,3,3,3,0]);assert.deepEqual(offsets,[1,2,3,4,3,2,1,0]);
 assert.equal(v.hudWords7788[hi(0x8dfc)],0);
});

test('already-at-target place-change state can transition twice in one call',()=>{
 const v=fixture(0,0);v.hudWords7788[hi(0x8a9c)]=1;v.hudWords7788[hi(0x8df8)]=4;
 assert.deepEqual(prepare(v).operations,[op(0x8a9c,2),op(0x8dfc,4),op(0x8a9c,3),op(0x8dfc,0)]);
 v.hudWords7788[hi(0x8a9c)]=99;v.hudWords7788[hi(0x8dfc)]=4;
 assert.deepEqual(prepare(v).operations,[op(0x8a9c,3),op(0x8dfc,0)]);
});

test('phase-independent row globals keep source stores without active views or racers',()=>{
 const v={scene:{players:-1,racerCount:0},hudWords7788:Array(1442).fill(0)};
 assert.deepEqual(prepare(v).operations,[op(0x8a9c,0),op(0x8dfc,0)]);
 v.scene.racerCount=1;v.bodiesBySlot=[{field15c0:2}];
 assert.deepEqual(prepare(v).operations.slice(0,3),[op(0x8dd8,-15),op(0x8de8,1),op(0x8dc8,-1)]);
});

test('all retained words remain caller-owned and late failures are atomic',()=>{
 const v=fixture(),before=structuredClone(v);delete v.bodiesBySlot[1].field15c0;const invalid=structuredClone(v);
 assert.throws(()=>prepare(v),/field15c0/);assert.deepEqual(v,invalid);
 const valid=fixture(),result=prepare(valid),saved=structuredClone(result);assert.deepEqual(valid,before);
 valid.hudWords7788.fill(7);valid.raceWords1f94.fill(8);assert.deepEqual(result,saved);assert.equal(Object.isFrozen(result.operations),true);
});

test('raw span holes and absent actual body flags reject rather than synthesize defaults',()=>{
 const v=fixture();delete v.hudWords7788[7];assert.throws(()=>prepare(v),/word/);
 const w=fixture();delete w.raceWords1f94[7];assert.throws(()=>prepare(w),/word/);
 const x=fixture(1,0);x.bodiesBySlot=[{}];assert.throws(()=>prepare(x),/field15c0/);
});
