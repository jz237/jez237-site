import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRiderLanding} from '../native-rider-landing.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-rider-landing-reference.json',import.meta.url)));
const ordinary={racerIndex:0,primaryRacerIndex:0,actorState:22,animationFrame:0,action:0,
 wetCount:0,anyWet:false,airborneFrames:6,floorContact:false,boxContact:false,recoveryState:0,crash:false,partial:false,upY:.75};

test('completed rider landing state and ordered side effects match original instructions',()=>{
 for(const c of reference.cases){const before=structuredClone(c);assert.deepEqual(prepareNativeRiderLanding(c.state,c.snapshot),c.expected);assert.deepEqual(c,before);}
});

test('release waits for contact, then settles once after five frames without continued contact',()=>{
 let s={landingTicks:-1,arcNative:40};
 for(let i=0;i<7;i++){s=prepareNativeRiderLanding(s,ordinary);assert.equal(s.landingTicks,-1);assert.equal(s.effects.length,0);}
 s=prepareNativeRiderLanding(s,{...ordinary,anyWet:true,wetCount:1});assert.equal(s.landingTicks,5);
 for(let i=0;i<4;i++){s=prepareNativeRiderLanding(s,ordinary);assert.equal(s.settled,false);}
 s=prepareNativeRiderLanding(s,ordinary);assert.equal(s.move,6);assert.equal(s.arcNative,30);
 assert.deepEqual(s.effects.map(e=>e.consumer),['800c35b4','80051ec0']);
 s=prepareNativeRiderLanding(s,ordinary);assert.equal(s.settled,false);assert.equal(s.effects.length,0);assert.equal(s.arcNative,30);
});

test('failed and partial landings repair the hull without success feedback or arc scaling',()=>{
 for(const extra of [{crash:true,partial:true},{actorState:23},{actorState:7,recoveryState:0},{partial:true},{actorState:24},{actorState:7,recoveryState:1}]){
  const out=prepareNativeRiderLanding({landingTicks:1,arcNative:40},{...ordinary,...extra});
  assert.ok([7,8].includes(out.move));assert.equal(out.arcNative,40);assert.deepEqual(out.effects.map(e=>e.consumer),['80051ec0']);
 }
 const second=prepareNativeRiderLanding({landingTicks:1,arcNative:40},{...ordinary,racerIndex:1});
 assert.equal(second.move,6);assert.deepEqual(second.effects.map(e=>e.consumer),['80051ec0']);
 assert.throws(()=>prepareNativeRiderLanding({},ordinary));
 assert.throws(()=>prepareNativeRiderLanding({landingTicks:0,arcNative:0},{...ordinary,crash:undefined}));
});
