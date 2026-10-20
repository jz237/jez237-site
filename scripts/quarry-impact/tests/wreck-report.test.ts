import test from 'node:test';
import assert from 'node:assert/strict';
import {wreckReport} from '../src/wreck-report';
test('the wreck report sums up the player car in one line',()=>{
 assert.equal(wreckReport({wheelsLost:0,partsGone:0,health:100}),'WRECK REPORT · barely a scratch');
 assert.equal(wreckReport({wheelsLost:0,partsGone:0,health:70,engineDamage:.01,structure:[.05,0,0,0,0]}),'WRECK REPORT · cosmetic damage only');
 assert.equal(wreckReport({wheelsLost:1,partsGone:7,health:20,engineDamage:.42,structure:[.45,.2,0,.6,0]}),'WRECK REPORT · 1 wheel lost · 7 parts gone · engine 58% · right side crushed 60%');
 assert.match(wreckReport({wheelsLost:2,partsGone:1,health:5}),/2 wheels lost · 1 part gone/);
});
