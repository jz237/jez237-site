import test from 'node:test';import assert from 'node:assert/strict';import {armorWearMultiplier,armorWearWarning} from '../src/armor-wear';import{CAR_KINDS,DEFINITIONS}from'../src/rules';
test('armor loss is local, bounded, monotone and absent for legacy or unarmored cars',()=>{
 for(const kind of CAR_KINDS){const p={x:0,y:0,z:DEFINITIONS[kind].halfLength},d={x:0,y:0,z:-1},base=1/1.54;
 assert.equal(armorWearMultiplier(kind,[0,0,0,0,0],p,d,base),1);assert.equal(armorWearMultiplier(kind,[0,1,1,1,1],p,d,base),1);
 let previous=1;for(let i=0;i<=100;i++){const factor=armorWearMultiplier(kind,[i/100,0,0,0,0],p,d,base);assert.ok(factor>=previous&&factor<=1/base);previous=factor;}
 assert.ok(Math.abs(previous*base-1)<1e-10);assert.equal(armorWearMultiplier(kind,undefined,p,d,base),1);assert.equal(armorWearMultiplier(kind,[1,1,1,1,1],p,d,1),1);
 }
});

test('HUD identifies only weakened armored sectors',()=>{assert.equal(armorWearWarning(3,[.8,0,.9,0,0]),'ARMOR WEAK: FRONT / LEFT');assert.equal(armorWearWarning(0,[1,1,1,1,1]),'');assert.equal(armorWearWarning(3,undefined),'');assert.equal(armorWearWarning(3,[.4,0,0,0,0]),'');});
