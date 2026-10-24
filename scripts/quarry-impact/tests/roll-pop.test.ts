import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLL_POP,rollPops,DOOR_SWING,doorUnlatched} from '../src/door-swing';
test('about ROLL_POP.chance of latched doors and lids spring on a roll, the same door on the same roll always the same way',()=>{
 let popped=0;for(let seed=0;seed<1000;seed++)if(rollPops(seed))popped++;
 assert.ok(Math.abs(popped/1000-ROLL_POP.chance)<.05,`${popped} of 1000`);assert.equal(rollPops(42),rollPops(42));assert.ok(!rollPops(NaN));
});
test('a sprung latch is a broken latch: the door then swings like any battered door, kicked open',()=>{
 assert.ok(!doorUnlatched(0,0),'a sound door is latched');assert.ok(doorUnlatched(0,DOOR_SWING.latchDamage),'the roll breaks the latch without loosening the hinges');
 assert.ok(ROLL_POP.kick>0&&ROLL_POP.kick<10);
});
test('the roll springs latches from inside the roll moment, once per roll, for doors and lids only',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 const at=src.indexOf('this.rollShedDone=true;this.rolls++;'),pop=src.indexOf('rollPops(this.id*31+this.popRolls++)');
 assert.ok(at>0&&pop>at&&pop-at<700,'inside the once-per-roll block');
 assert.ok(src.includes("if(!(a.name.startsWith('door')||lidKind(a.name))||!a.members.some(m=>m.mesh.visible)||doorUnlatched(a.loose,a.damage)"));
});
