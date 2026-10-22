import test from 'node:test';
import assert from 'node:assert/strict';
import {NURSE,nurseThrottle} from '../src/damage-handling';
test('a sick engine is nursed: forward throttle held back, reversing and light throttle untouched; a healthy one is not',()=>{
 assert.equal(nurseThrottle(1,false),1);assert.equal(nurseThrottle(1,true),NURSE.throttle);
 assert.equal(nurseThrottle(.4,true),.4);assert.equal(nurseThrottle(-1,true),-1);
});
test('the AI wrapper nurses only offline cars, after the seized check, on low oil or coolant',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(src.includes('const input=car.extendedDamage&&!online?.active?{...core,throttle:nurseThrottle(core.throttle,car.oilLevel<OIL.low||car.coolantLevel<COOLANT.low||car.steerLink.some(v=>v===0)||car.steerPlay>=STEER_PLAY.warn)}:core;'),'engine or steering trouble');
 assert.ok(src.indexOf('if(car.seized&&car.extendedDamage)return')<src.indexOf('nurseThrottle(core.throttle'));
});
