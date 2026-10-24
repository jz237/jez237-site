import test from 'node:test';
import assert from 'node:assert/strict';
import {PUSH_BURN,pushBurn,CLUTCH,clutchGrip,clutchSlips} from '../src/damage-handling';
test('only full throttle against a car that will not move cooks the clutch',()=>{
 assert.equal(pushBurn(1,.5,1),PUSH_BURN.rate);assert.equal(pushBurn(-1,0,1),PUSH_BURN.rate,'shoving in reverse too');
 assert.equal(pushBurn(PUSH_BURN.throttle-.1,0,1),0,'easing on it');assert.equal(pushBurn(1,PUSH_BURN.speed+.1,1),0,'still moving: nothing is stopping it');
 assert.equal(pushBurn(1,0,0),0);assert.equal(pushBurn(NaN,0,1),0);
});
test('about ten seconds of pinning in all leaves the clutch slipping at full throttle; a single short pin does not',()=>{
 const after=(seconds:number)=>clutchGrip(0,pushBurn(1,0,seconds));
 assert.ok(!clutchSlips(after(3),1),'a three-second pin');
 assert.ok(clutchSlips(after(12),1),'twelve seconds of pushing');
 assert.ok(clutchGrip(0,1)>=CLUTCH.floor,'never below the floor');
});
test('the pinner, and only while the pin holds, strains its clutch',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(src.includes("cars.find(v=>v.id===pushes[pin.push].by):undefined;if(!pin||!by)continue;\n    by.strainClutch(dt);"));
});
