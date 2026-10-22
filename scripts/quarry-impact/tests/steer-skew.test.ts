import test from 'node:test';
import assert from 'node:assert/strict';
import {STEER_SKEW,steerSkew,skewFactor,skewWarning} from '../src/damage-handling';
test('a front corner knocked harder than the other shortens the lock toward that side; even knocks change nothing',()=>{
 assert.equal(steerSkew(.3,.3),0);assert.equal(steerSkew(.05,.02),0);
 assert.ok(steerSkew(.3,.05)<0,'front-left damage limits left (negative) steering');assert.ok(steerSkew(.05,.3)>0);
 assert.ok(Math.abs(steerSkew(1,0))<=STEER_SKEW.max+1e-12);assert.ok(Math.abs(steerSkew(.1,0))<Math.abs(steerSkew(.14,0)));
 assert.equal(steerSkew(NaN,NaN),0);
});
test('only steering toward the bent side is cut; the other way keeps full lock',()=>{
 const s=steerSkew(.3,0);
 assert.ok(skewFactor(-1,s)<1);assert.equal(skewFactor(1,s),1);assert.equal(skewFactor(0,s),1);assert.equal(skewFactor(-1,0),1);
 assert.ok(Math.abs(skewFactor(-.5,-.4)-.6)<1e-12);assert.equal(skewFactor(-1,NaN),1);
});
test('the HUD says which lock is short',()=>{
 assert.equal(skewWarning(0),'');assert.equal(skewWarning(-.05),'');assert.equal(skewWarning(-.4),'LEFT LOCK SHORT');assert.equal(skewWarning(.4),'RIGHT LOCK SHORT');
});
test('the mechanical report names the short lock',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.match(mechanicalReport({steerSkew:-.4}),/left lock short/);assert.match(mechanicalReport({steerSkew:.4}),/right lock short/);assert.equal(mechanicalReport({steerSkew:.05}),'');
});
