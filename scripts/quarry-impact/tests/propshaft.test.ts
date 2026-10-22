import test from 'node:test';
import assert from 'node:assert/strict';
import {PROPSHAFT,hasPropshaft,propBend,propVibration,fatigueProp,propWarning} from '../src/damage-handling';
test('only front-engined rear- and four-wheel-drive cars have a propshaft',()=>{
 assert.equal(hasPropshaft('front',false),false);assert.equal(hasPropshaft('rear',false),true);assert.equal(hasPropshaft('all',false),true);assert.equal(hasPropshaft('rear',true),false);
});
test('hard landings bend it a little more each time; a crushed rear kinks it; gentle knocks do nothing',()=>{
 assert.equal(propBend(0,PROPSHAFT.fall,0),0);assert.equal(propBend(0,5,PROPSHAFT.crush),0);
 const once=propBend(0,11,0),twice=propBend(once,11,0);assert.ok(once>0&&twice>once);
 assert.ok(propBend(0,0,.6)>.3);assert.equal(propBend(.5,0,PROPSHAFT.crush+.02),.5,'a crush floor never straightens a bent shaft');
 assert.equal(propBend(.9,40,1),1);assert.equal(propBend(NaN,NaN,NaN),0);
});
test('a bent shaft shakes with the square of speed; a straight one never does',()=>{
 assert.equal(propVibration(0,40),0);assert.equal(propVibration(.5,0),0);
 assert.ok(Math.abs(propVibration(.5,20)*4-propVibration(.5,40))<1e-9||propVibration(.5,40)===PROPSHAFT.cap);
 assert.ok(propVibration(1,200)<=PROPSHAFT.cap);assert.equal(propVibration(.5,-20),propVibration(.5,20));
});
test('driven fast it fatigues and snaps within a minute or so; pottering about never wears it',()=>{
 let w=0,t=0;for(;w<1&&t<600;t+=.1)w=fatigueProp(w,propVibration(.6,30),.1);
 assert.ok(t>8&&t<90,`snaps in ${t.toFixed(1)} s`);
 let slow=0;for(let i=0;i<6000;i++)slow=fatigueProp(slow,propVibration(.6,12),.1);assert.equal(slow,0);
 assert.equal(fatigueProp(NaN,NaN,.1),0);
});
test('the HUD warns of a bent shaft and of a snapped one',()=>{
 assert.equal(propWarning(0,false),'');assert.equal(propWarning(.3,false),'PROPSHAFT BENT');assert.equal(propWarning(0,true),'PROPSHAFT SNAPPED');
});
test('the mechanical report names a snapped or bent propshaft',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.match(mechanicalReport({propshaft:'snapped'}),/propshaft snapped/);assert.match(mechanicalReport({propshaft:'bent'}),/propshaft bent/);
 assert.equal(mechanicalReport({}),'');
});
