import test from 'node:test';
import assert from 'node:assert/strict';
import {touchState} from '../touch-controls.js';
import {playerInput} from '../player-input.js';

test('independent thumbs steer and accelerate, releasing steering retains throttle',()=>{
 const touch=touchState();touch.press(1,'KeyW');touch.press(2,'KeyA');
 let input=playerInput(touch.keys());assert.equal(input.throttle,1);assert.equal(input.steer,.8);
 touch.release(2);input=playerInput(touch.keys());assert.equal(input.throttle,1);assert.equal(input.steer,0);
 touch.press(3,'Space');assert.equal(playerInput(touch.keys()).brake,true);
 touch.clear();input=playerInput(touch.keys());assert.equal(input.throttle,0);assert.equal(input.brake,false);
});
test('cancelled pointer and repeated release cannot release another finger on the same control',()=>{
 const touch=touchState();touch.press(7,'KeyW');touch.press(8,'KeyW');touch.release(7);touch.release(7);
 assert.equal(playerInput(touch.keys()).throttle,1);touch.release(8);assert.equal(playerInput(touch.keys()).throttle,0);
});
test('touch actions use existing gameplay mapping and do not control the second rider',()=>{
 const touch=touchState();for(const [id,key] of ['KeyW','KeyD','KeyB','KeyF','Digit1','KeyR'].entries())touch.press(id,key);
 const first=playerInput(touch.keys(),null,0,true),second=playerInput(touch.keys(),null,1,true);
 assert.equal(first.steer,-.8);assert.equal(first.dampen,true);assert.equal(first.dive,true);assert.equal(first.trick,'flip');assert.equal(first.rescue,true);
 assert.equal(second.throttle,0);assert.equal(second.steer,0);assert.equal(second.rescue,false);
});
