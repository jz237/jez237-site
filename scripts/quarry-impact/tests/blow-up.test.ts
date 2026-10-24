import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BOOM,primesTank} from '../src/blow-up';
test('a long fire, leaking fuel or a dropped tank primes the tank to go up',()=>{
 assert.equal(primesTank(0,false,BOOM.prime-.1),false,'not yet');
 assert.equal(primesTank(0,false,BOOM.prime),true,'burning long enough');
 assert.equal(primesTank(.31,false,0),true,'leaking fuel');assert.equal(primesTank(0,true,0),true,'tank hanging down');
 assert.ok(BOOM.lift>=5&&BOOM.parts>=4&&BOOM.hold>1,'a real launch and shower, and time to see it');
});
test('blowing up throws, strips and destroys the car, offline only, and the event waits for it',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),fire=readFileSync(new URL('../src/vehicle-fire.ts',import.meta.url),'utf8');
 assert.ok(fire.includes('if(car.extendedDamage&&state.burning&&primesTank(car.fuelLeak,car.tankDown,state.burnTime))state.primeFuelBlast();'));
 const blow=vehicle.slice(vehicle.indexOf('  blowUp(){'),vehicle.indexOf('  wreckBurst(direction:T.Vector3){'));
 assert.ok(blow.includes('if(!this.extendedDamage||this.blownUp)return false;this.blownUp=true;'),'once');
 assert.ok(blow.includes('this.body.applyImpulse({x:0,y:m*BOOM.lift,z:0},true);this.body.applyTorqueImpulse('),'thrown into the air, tumbling');
 assert.ok(blow.includes('for(const g of this.glass){if(!g.visible)continue;g.visible=false;'),'every window blown out');
 assert.ok(blow.includes('this.health=0;return true;'),'destroyed');
 assert.ok(main.includes('const car=cars.find(c=>c.id===burst.id);if(car)carBlowsUp(car,burst.position);'),'on the fire system\'s burst');
 assert.ok(main.includes('if(online?.active||!car.blowUp())return;blowUps++;blowUpHold=elapsed+BOOM.hold;car.igniteRequest=true;'));
 assert.ok(main.includes("if(!sound.clip('car-explosion',at,1,3))"));
 assert.ok(main.includes("toast(car.id===0?'YOUR CAR BLEW UP':"));
 assert.ok(main.includes("if (mode === 'derby' && !(elapsed<blowUpHold)) {"),'the derby does not end on a car still in the air');
 assert.ok(main.includes("&& !(elapsed<blowUpHold)) finish('RETIRED · DAMAGE');"));
});
