import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WHEEL_RIP,wheelRips} from '../src/damage-handling';
const passing=(()=>{for(let s=0;s<100;s++)if(wheelRips(.5,.5,WHEEL_RIP.damage,s))return s;return -1;})();
test('a big blow right at a knocked wheel tears it off',()=>{
 assert.ok(passing>=0);
 assert.equal(wheelRips(WHEEL_RIP.reach+.01,1,99,passing),false,'too far from the wheel');
 assert.equal(wheelRips(.5,WHEEL_RIP.wheel-.01,99,passing),false,'an untouched wheel holds');
 assert.equal(wheelRips(.5,1,WHEEL_RIP.damage-.1,passing),false,'too small a blow');
 let n=0;for(let s=0;s<400;s++)if(wheelRips(.5,1,30,s))n++;assert.ok(Math.abs(n/400-WHEEL_RIP.chance)<.08);
});
test('one crash\'s contacts are totalled per wheel and judged once, offline only',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('if(best>=0&&gap<=WHEEL_RIP.reach){if(time-this.wheelBlowAt[best]>WHEEL_RIP.window){this.wheelBlow[best]=0;this.wheelBlowRolled[best]=0;}this.wheelBlowAt[best]=time;this.wheelBlow[best]+=damage;}'),'the blow is the sum of the contacts in the window');
 assert.ok(vehicle.includes('!this.wheelBlowRolled[best]&&this.wheelBlow[best]>=WHEEL_RIP.damage&&(this.wheelBlowRolled[best]=1)&&wheelRips('),'the chance is rolled once per blow');
 assert.ok(vehicle.includes('this.tearOffWheel(best,direction.clone().normalize(),false);'),'thrown along the blow');
 assert.ok(vehicle.includes('this.wheelsRipped=0;this.wheelBlow.fill(0);this.wheelBlowAt.fill(-1e9);this.wheelBlowRolled.fill(0);'),'reset with the car');
});
