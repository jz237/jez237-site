import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('hooking, tearing and a snapping wire are heard; the player in a lock feels it',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 const lock=src.slice(src.indexOf('function tryLock('),src.indexOf('function stepLocks('));
 assert.ok(lock.includes("sound.shot('impact-heavy',at,.5,{rate:.8,delay:0,duration:.5})")&&lock.includes('recordRumbleImpact(.3)'),'the clunk of a snag');
 const step=src.slice(src.indexOf('function stepLocks('),src.indexOf('function stepLocks(')+2500);
 assert.ok(step.includes("sound.shot('impact-light',at,.7,{rate:1.35")&&step.includes("sound.shot('suspension',at,.5")&&step.includes('recordRumbleImpact(.35)'),'the bumper tearing away');
 const wires=src.slice(src.indexOf('function stepTethers('),src.indexOf('function stepTethers(')+1500);
 assert.ok(wires.includes("sound.shot('impact-light',at,.35,{rate:1.9"),'a wire snapping');
});
