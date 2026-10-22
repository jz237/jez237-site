import test from 'node:test';
import assert from 'node:assert/strict';
import {BELT,beltSlip,beltSnaps,beltSqueal,beltHeat,drainBattery,batteryCut,batteryLights,beltWarning} from '../src/damage-handling';
import {deadReason} from '../src/mechanical-dnf';
import {synthSqueal} from '../src/damage-rattle';
test('a crushed front slips the belt, more the harder it is crushed; past BELT.snap it snaps on most cars',()=>{
 assert.equal(beltSlip(.1),0);assert.ok(beltSlip(.18)>0&&beltSlip(.18)<beltSlip(.24));assert.equal(beltSlip(.9),1);assert.equal(beltSlip(NaN),0);
 const n=Array.from({length:40},(_,id)=>id).filter(id=>beltSnaps(.6,id)).length;assert.ok(n>=16&&n<=34,`${n}/40`);
 assert.equal(Array.from({length:40},(_,id)=>id).filter(id=>beltSnaps(BELT.snap-.01,id)).length,0);
});
test('it squeals under load, not at idle',()=>{
 assert.equal(beltSqueal(.8,.2),0);assert.ok(beltSqueal(.8,1)>beltSqueal(.8,.6)&&beltSqueal(.8,1)>beltSqueal(.4,1));assert.equal(beltSqueal(0,1),0);
});
test('with no water pump the engine heats up to a cap; with no alternator the battery runs flat in about BELT.battery seconds',()=>{
 let e=0;for(let i=0;i<600;i++)e=beltHeat(e,1,.1);assert.ok(e>.15&&e<=BELT.cap);
 let b=1,t=0;while(b>0&&t<1000){b=drainBattery(b,true,.5);t+=.5;}assert.ok(Math.abs(t-BELT.battery)<1);
 assert.equal(drainBattery(.5,false,10),.5,'a stalled engine does not drain it here');
});
test('a low battery sputters the ignition more as it drains and dims the lights; flat, it is dead',()=>{
 const share=(l:number)=>Array.from({length:400},(_,k)=>k*BELT.slot).filter(c=>batteryCut(l,c,3)).length/400;
 assert.equal(share(.5),0);assert.ok(share(.05)>share(.15)&&share(.15)>0);assert.equal(share(0),1);
 const lit=(l:number)=>Array.from({length:400},(_,k)=>k*.12).filter(c=>batteryLights(l,c,3)).length/400;
 assert.equal(lit(.8),1);assert.ok(lit(.1)<lit(.3)&&lit(.3)<1);assert.equal(lit(0),0);
 assert.equal(deadReason({health:50,batteryFlat:true,driven:[2,3]}),'BATTERY FLAT');assert.equal(deadReason({health:50,driven:[2,3]}),'');
});
test('the HUD follows the belt and battery',()=>{
 assert.equal(beltWarning(.1,false,1),'');assert.equal(beltWarning(.5,false,1),'BELT SLIPPING');assert.equal(beltWarning(0,true,.9),'FAN BELT SNAPPED');
 assert.equal(beltWarning(0,true,.2),'BATTERY LOW');assert.equal(beltWarning(0,true,0),'BATTERY FLAT');
});
test('the squeal loop is a second, finite, audible, unclipped and seamless',()=>{
 const s=synthSqueal(48000);assert.equal(s.length,48000);let peak=0;for(const v of s){assert.ok(Number.isFinite(v));peak=Math.max(peak,Math.abs(v));}
 assert.ok(peak>.1&&peak<=.45);assert.ok(Math.abs(s[0])<1e-6&&Math.abs(s[s.length-1])<1e-6);
});
