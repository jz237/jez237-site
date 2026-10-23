import test from 'node:test';
import assert from 'node:assert/strict';
import {IMPACT_SPEED,impactSpeedFactor} from '../src/damage-rules';
import {ImpactAdjudicator} from '../src/impact-adjudication';
import {structuralDamage} from '../src/bodywork-response';
test('a typical derby hit is unchanged; slow shoves do less, fast smashes several times more',()=>{
 assert.ok(Math.abs(impactSpeedFactor(IMPACT_SPEED.ref)-1)<1e-12);
 assert.ok(impactSpeedFactor(4)<.5&&impactSpeedFactor(4)>=IMPACT_SPEED.min);
 assert.ok(impactSpeedFactor(13)>1.8&&impactSpeedFactor(13)<2);assert.ok(impactSpeedFactor(23)>4.3);
 assert.equal(impactSpeedFactor(80),IMPACT_SPEED.max);assert.equal(impactSpeedFactor(NaN),IMPACT_SPEED.min);
 for(let v=1;v<40;v++)assert.ok(impactSpeedFactor(v+1)>=impactSpeedFactor(v),'never less for a faster hit');
});
test('offline the adjudicator scales damage by closing speed up to the cap; online (no factor) is exactly as before',()=>{
 const c=(closing:number,impulse=12000)=>({key:'a|b',impulse,closing,damageScale:1});
 const plain=new ImpactAdjudicator().adjudicate([c(20)],1)[0].damage;
 assert.equal(plain,structuralDamage(12000,20),'no factor: the old impulse-only damage');
 const fast=new ImpactAdjudicator().adjudicate([c(20)],1,1,impactSpeedFactor,IMPACT_SPEED.cap)[0].damage;
 assert.ok(Math.abs(fast-plain*impactSpeedFactor(20))<1e-9);
 const huge=new ImpactAdjudicator().adjudicate([c(40,60000)],1,1,impactSpeedFactor,IMPACT_SPEED.cap)[0].damage;assert.equal(huge,IMPACT_SPEED.cap);
 const slow=new ImpactAdjudicator().adjudicate([c(5)],1,1,impactSpeedFactor,IMPACT_SPEED.cap)[0].damage;assert.ok(slow<structuralDamage(12000,5));
});
