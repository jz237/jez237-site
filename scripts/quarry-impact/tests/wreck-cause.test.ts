import test from 'node:test';
import assert from 'node:assert/strict';
import {BURNT_OUT,wreckCause} from '../src/wreck-cause';
const base={engineOut:false,fireHeat:0,wheelsLost:0,seized:false,fuel:.5};
test('a finished car reads how it went out, the most telling cause first',()=>{
 assert.equal(wreckCause(base),'WRECKED');
 assert.equal(wreckCause({...base,engineOut:true,fireHeat:1,wheelsLost:4}),'ENGINE OUT');
 assert.equal(wreckCause({...base,fireHeat:BURNT_OUT+.1,wheelsLost:3}),'BURNT OUT');
 assert.equal(wreckCause({...base,fireHeat:BURNT_OUT}),'WRECKED','a warm car is not a burnt-out one');
 assert.equal(wreckCause({...base,wheelsLost:2,seized:true}),'NO WHEELS');assert.equal(wreckCause({...base,wheelsLost:1}),'WRECKED');
 assert.equal(wreckCause({...base,seized:true,fuel:0}),'SEIZED');assert.equal(wreckCause({...base,fuel:0}),'NO FUEL');
 assert.equal(wreckCause({...base,fuel:NaN}),'WRECKED');
});
