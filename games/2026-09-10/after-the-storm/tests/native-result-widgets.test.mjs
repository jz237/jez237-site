import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceFadeSlotInitialization as prepare} from '../native-race-fade-initialization.js';
import {prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,base=hi(0x8930);
const fixture=()=>({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),scene:{}});
function initialize(state,type,selector,template=Array(11).fill(0)){
 return apply(state,prepare({hudWords7788:state.hudWords7788,type,selector,slotTemplateWords6c50:template}).operations).state;
}

test('allocator reads the kind halfword, picks the first free slot and leaves adjacent HUD data alone',()=>{
 const s=fixture();s.hudWords7788.fill(0x12345678);
 s.hudWords7788[base+11]=0x0000ffff;s.hudWords7788[base+33]=0;
 const before=structuredClone(s),out=initialize(s,1,1);
 assert.deepEqual(out.hudWords7788.slice(base+11,base+22),[0x10000,0x10000,80,93,0,0,0,0,0,0,0]);
 assert.deepEqual(out.hudWords7788.slice(0,base+11),s.hudWords7788.slice(0,base+11));
 assert.deepEqual(out.hudWords7788.slice(base+22),s.hudWords7788.slice(base+22));
 assert.deepEqual(s,before);
});

test('five allocations fill the pool, then no template is read and no writes are emitted',()=>{
 let s=fixture();for(let i=0;i<5;i++){
  s=initialize(s,4,i);assert.equal(s.hudWords7788[base+i*11],0x40000);
  assert.equal(s.hudWords7788[base+i*11+1],i<<16);assert.equal(s.hudWords7788[base+i*11+3],0xffffffd8);
  assert.equal(s.hudWords7788[base+i*11+10],i);
 }
 const p=prepare({hudWords7788:s.hudWords7788,type:1,selector:0,get slotTemplateWords6c50(){throw Error('unread');}});
 assert.deepEqual(p.operations,[]);assert.equal(p.diagnostic.full,true);
});

test('placement widgets use the recovered selector coordinates and retain template fields outside selected branches',()=>{
 const expected=[[82,84,0,0],[239,84,0,0],[80,101,1,101],[240,101,1,101],
  [80,76,1,76],[240,76,1,76],[80,186,1,186],[240,186,1,186]];
 expected.forEach(([x,y,mode,baseline],selector)=>{
  const h=initialize(fixture(),3,selector).hudWords7788;
  assert.equal(h[base],0x30000|mode);assert.equal(h[base+2],x);assert.equal(h[base+3],y);
  assert.equal(h[base+8],255);assert.equal(h[base+9],baseline);
 });
 const template=Array.from({length:11},(_,i)=>0xa1b20000+i*31),h=initialize(fixture(),3,8,template).hudWords7788;
 assert.equal(h[base],0x30000|(template[0]&65535));assert.equal(h[base+1],template[1]&65535);
 for(const i of [2,3,4,5,6,7,9,10])assert.equal(h[base+i],template[i]);assert.equal(h[base+8],255);
});

test('arguments truncate to unsigned16 before dispatch, while ignored branches read no HUD or template',()=>{
 const s=fixture(),h=initialize(s,65538,-65536).hudWords7788;
 assert.equal(h[base],0x20000);assert.equal(h[base+2],120);assert.equal(h[base+10],0);
 const other=initialize(s,2,-1).hudWords7788;assert.equal(other[base+2],58);assert.equal(other[base+10],65535);
 for(const [type,selector] of [[-1,0],[65541,0],[0,1]])assert.deepEqual(prepare({type,selector,
  get hudWords7788(){throw Error('unread HUD');},get slotTemplateWords6c50(){throw Error('unread template');}}).operations,[]);
 const p=prepare({type:-65536,selector:65536,slotTemplateWords6c50:Array(11).fill(7)});
 assert.equal(p.operations.length,55);assert.ok(p.operations.every(op=>op.value===7));
});

test('invalid inputs are transactional and prepared operations are immutable',()=>{
 const s=fixture(),before=structuredClone(s);
 assert.throws(()=>initialize(s,1,0,Array(10).fill(0)),/11 unsigned/);assert.deepEqual(s,before);
 for(const type of [NaN,0.5,2147483648])assert.throws(()=>prepare({type,selector:0}),/slot type/);
 const p=prepare({type:1,selector:0,hudWords7788:s.hudWords7788,slotTemplateWords6c50:Array(11).fill(0)});
 assert.ok(Object.isFrozen(p.operations));assert.ok(Object.isFrozen(p.operations[0]));assert.ok(Object.isFrozen(p.diagnostic));
});
