import test from 'node:test';
import assert from 'node:assert/strict';
import {wreckReport} from '../src/wreck-report';
test('the wreck report says how many times the car rolled',()=>{
 assert.match(wreckReport({wheelsLost:0,partsGone:3,health:40,rolls:1}),/rolled once/);
 assert.match(wreckReport({wheelsLost:0,partsGone:3,health:40,rolls:2}),/rolled twice/);
 assert.match(wreckReport({wheelsLost:0,partsGone:3,health:40,rolls:4}),/rolled 4 times/);
 assert.doesNotMatch(wreckReport({wheelsLost:0,partsGone:3,health:40}),/rolled/);
});
