import test from 'node:test';
import assert from 'node:assert/strict';
import {wreckReport} from '../src/wreck-report';
test('the wreck report sums up the player car in one line',()=>{
 assert.equal(wreckReport({wheelsLost:0,partsGone:0,health:100}),'WRECK REPORT · barely a scratch');
 assert.equal(wreckReport({wheelsLost:0,partsGone:0,health:70,engineDamage:.01,structure:[.05,0,0,0,0]}),'WRECK REPORT · cosmetic damage only');
 assert.equal(wreckReport({wheelsLost:1,partsGone:7,health:20,engineDamage:.42,structure:[.45,.2,0,.6,0]}),'WRECK REPORT · 1 wheel lost · 7 parts gone · engine 58% · right side crushed 60%');
 assert.match(wreckReport({wheelsLost:2,partsGone:1,health:5}),/2 wheels lost · 1 part gone/);
});
test('the mechanical line lists what broke, worst first, capped; nothing broken leaves it out',async()=>{
 const {mechanicalReport,MECHANICAL_LIMIT}=await import('../src/wreck-report');
 assert.equal(mechanicalReport({}),'');assert.equal(mechanicalReport({tieRods:0,gearsLost:0,springs:0}),'');
 assert.equal(mechanicalReport({seized:true,springs:2,tieRods:1}),'MECHANICAL · engine seized · tie rod snapped · 2 springs broken');
 assert.equal(mechanicalReport({gearsLost:1,shafts:1}),'MECHANICAL · 1 driveshaft snapped · 1 gear stripped');
 const all=mechanicalReport({seized:true,outOfFuel:true,diffBroken:true,tieRods:2,shafts:1,gearsLost:3,clutchSlipping:true,springs:1,exhaust:true,doorsTorn:2});
 assert.ok(all.startsWith('MECHANICAL · engine seized · out of fuel · diff broken · 2 tie rods snapped')&&all.endsWith(' · +4 more')&&all.split(' · ').length===MECHANICAL_LIMIT+2);
});
test('the mechanical line names a brake fire early and a burst radiator instead of plain overheating',async()=>{
 const {mechanicalReport}=await import('../src/wreck-report');
 assert.equal(mechanicalReport({brakeFire:true,overheating:true,radiatorBurst:true}),'MECHANICAL · brake fire · radiator burst');
 assert.equal(mechanicalReport({overheating:true}),'MECHANICAL · overheating');
});
