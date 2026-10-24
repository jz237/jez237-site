import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIRE_SPREAD} from '../src/vehicle';
test('a car left burning sets its engine-end tyres alight; putting the fire out restarts the clock',()=>{
 assert.equal(FIRE_SPREAD.tyres,8);
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
 const cook=vehicle.slice(vehicle.indexOf('  cook(heat:number,dt:number,engineRear:boolean){'),vehicle.indexOf('  /** A part torn off while the car is burning hard'));
 assert.ok(cook.includes("if(!this.extendedDamage||!(heat>.3)||!(dt>0))return;"),'offline, and only a real fire counts');
 assert.ok(cook.includes("if(this.burnTime>=FIRE_SPREAD.tyres&&this.health>0)for(const i of engineRear?[2,3]:[0,1])if(!this.tyreAlight[i]&&!this.wreckParts.wheelLost[i]){this.tyreAlight[i]=1;this.fireSpreads++;this.onBreak?.('tyrefire',i);}"),'the engine-end tyres');
 assert.ok(vehicle.includes('if(!this.onFire)this.burnTime=0;}'),'out, the clock restarts');
 assert.ok(vehicle.includes('this.rubHeat.fill(0);this.burnTime=0;'),'the extinguisher resets it too');
 assert.ok(main.includes("tyrefire:{label:'FIRE SPREAD TO THE TYRES',score:24}")&&main.includes("what==='tyrefire'?`FIRE SPREADING · ${corner} TYRE ALIGHT`:"));
 assert.ok(audio.includes("tyrefire:{id:'vehicle-burst',volume:.45,rate:.8,duration:.9}"));
});
