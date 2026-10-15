import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceFadePropertiesInitialization as properties,prepareNativeRaceFadeSlotsReset as reset} from '../native-race-fade-initialization.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceFadePropertiesUpdate,
 prepareNativeRaceFadeSlotsResetUpdate} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4;
const fixture=()=>createNativeRaceState({raceWords1f94:Array(1693).fill(0x91827364),
 hudWords7788:Array.from({length:1442},(_,i)=>0x62000000+i),scene:{activity624:-1,event628:7}});
const template=[0x11223344,0xaabbccdd,0x55667788,0x12345678,0x91a2b3c4,0xd5e6f708,0x192a3b4c,0x5d6e7f80,0xabcdef01];
const input=type=>({fadeTemplateWords6cc0:template,type,rate:4,selector:0});

test('main fade properties preserve template latch fields and exact neighboring halfwords',()=>{
 const state=fixture(),before=nativeRaceStateSnapshot(state),result=prepareNativeRaceFadePropertiesUpdate(state,input(2)),hud=result.state.hudWords7788;
 assert.deepEqual(result.operations.slice(0,9).map(o=>o.value),template);
 assert.equal(hud[hi(0x8a10)],0x00020000);assert.equal(hud[hi(0x8a14)],0xaabbccdd);
 assert.equal(hud[hi(0x8a18)],0x55660000);assert.equal(hud[hi(0x8a1c)],0x00040000);
 assert.equal(hud[hi(0x8a20)],0);assert.equal(hud[hi(0x8a24)],255);
 assert.deepEqual(hud.slice(hi(0x8a28),hi(0x8a34)),template.slice(6));
 assert.equal(hud[hi(0x8a0c)],state.hudWords7788[hi(0x8a0c)]);assert.equal(hud[hi(0x8a34)],state.hudWords7788[hi(0x8a34)]);
 assert.deepEqual(result.state.scene,state.scene);assert.deepEqual(result.effects,[]);assert.deepEqual(nativeRaceStateSnapshot(state),before);
});

test('types4 and6 share a kind but only6 clears the retained8a30 halfword before its header',()=>{
 const a=prepareNativeRaceFadePropertiesUpdate(fixture(),input(4)),b=prepareNativeRaceFadePropertiesUpdate(fixture(),input(6));
 assert.equal(a.state.hudWords7788[hi(0x8a30)],0xabcd0001);assert.equal(b.state.hudWords7788[hi(0x8a30)],1);
 assert.equal(a.state.hudWords7788[hi(0x8a10)],0x00040000);assert.equal(b.state.hudWords7788[hi(0x8a10)],0x00040000);
 assert.deepEqual(b.operations[9],{kind:'hudWrite',byteOffset:0x8a30-0x7788,width:2,value:0});
 assert.equal(a.state.hudWords7788[hi(0x8a28)],0x00460041);
 const c=prepareNativeRaceFadePropertiesUpdate(fixture(),input(5));assert.equal(c.state.hudWords7788[hi(0x8a28)],0xfef70041);
});

test('white channel writes retain source reverse order and differ in their final alpha',()=>{
 for(const type of[3,7]){
  const p=properties(input(type));assert.deepEqual(p.operations.slice(-4).map(o=>o.byteOffset),[0x8a24,0x8a22,0x8a20,0x8a26].map(a=>a-0x7788));
  const result=prepareNativeRaceFadePropertiesUpdate(fixture(),input(type));
  assert.equal(result.state.hudWords7788[hi(0x8a20)],0x00ff00ff);
  assert.equal(result.state.hudWords7788[hi(0x8a24)],type===7?0x00ff00ff:0x00ff0000);
 }
});

test('rate and selector store actual low16 bits without signed-value clamps',()=>{
 const p=prepareNativeRaceFadePropertiesUpdate(fixture(),{...input(1),rate:-1,selector:-2147483648});
 assert.equal(p.state.hudWords7788[hi(0x8a18)],0x55660000);assert.equal(p.state.hudWords7788[hi(0x8a1c)],0xffff0000);
});

test('unselected property types still copy the template and never require unread rate or selector',()=>{
 for(const type of[-2147483648,-1,0,8,2147483647]){
  const value={fadeTemplateWords6cc0:template,type,get rate(){throw Error('unread rate');},get selector(){throw Error('unread selector');}};
  const p=properties(value);assert.equal(p.operations.length,9);assert.equal(p.diagnostic.propertiesSet,false);
 }
});

test('main slot reset writes five44-byte slots and leaves the following property span alone',()=>{
 const state=fixture(),slotTemplateWords6c50=Array.from({length:11},(_,i)=>0xabc00000+i),
  result=prepareNativeRaceFadeSlotsResetUpdate(state,{slotTemplateWords6c50});
 assert.equal(result.operations.length,55);for(let slot=0;slot<5;slot++)
  assert.deepEqual(result.state.hudWords7788.slice(hi(0x8930)+slot*11,hi(0x8930)+(slot+1)*11),slotTemplateWords6c50);
 assert.equal(result.state.hudWords7788[hi(0x8a0c)],state.hudWords7788[hi(0x8a0c)]);
 assert.equal(result.state.hudWords7788[hi(0x8a10)],state.hudWords7788[hi(0x8a10)]);
 assert.deepEqual(result.state.raceWords1f94,state.raceWords1f94);
});

test('numeric outputs are frozen and detached; invalid late property reads cannot commit the preceding template',()=>{
 const value={...input(2),fadeTemplateWords6cc0:template.slice()},p=properties(value);value.fadeTemplateWords6cc0[0]=0;
 assert.equal(p.operations[0].value,template[0]);assert.ok(Object.isFrozen(p.operations[0]));assert.ok(Object.isFrozen(p.diagnostic));
 const state=fixture(),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceFadePropertiesUpdate(state,{...input(2),rate:NaN}),/fade rate/);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 assert.throws(()=>properties({...input(1),fadeTemplateWords6cc0:Array(9)}),/unsigned|fadeTemplate/);
 assert.throws(()=>reset({slotTemplateWords6c50:Array(10).fill(0)}),/11 unsigned/);
});
