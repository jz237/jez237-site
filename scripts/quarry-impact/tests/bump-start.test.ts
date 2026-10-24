import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BUMP_START,bumpRoll,bumpCatches,bumpStartedBy} from '../src/damage-handling';
test('a stalled car rolled fast enough with the throttle held bump-starts, only once it has been dead a while',()=>{
 const dt=1/60;let roll=0;for(let i=0;i<20;i++)roll=bumpRoll(roll,BUMP_START.speed+1,1,dt);
 assert.ok(roll>=BUMP_START.hold,'rolled long enough');
 assert.equal(bumpRoll(roll,BUMP_START.speed-.1,1,dt),0,'too slow starts the count again');
 assert.equal(bumpRoll(roll,BUMP_START.speed+1,0,dt),0,'off the throttle starts the count again');
 assert.ok(bumpRoll(0,-(BUMP_START.speed+1),-1,dt)>0,'rolling backwards turns it over too');
 assert.equal(bumpRoll(Number.NaN,Number.NaN,1,dt),0);
 assert.equal(bumpCatches(BUMP_START.after-.01,1),false,'the stalling hit itself does not restart it');
 assert.equal(bumpCatches(BUMP_START.after,BUMP_START.hold-.01),false);
 assert.equal(bumpCatches(BUMP_START.after,BUMP_START.hold),true);
});
test('the rival whose recent hit shoved it gets the bump-start credit',()=>{
 assert.equal(bumpStartedBy({by:4,at:10},2,12),4);
 assert.equal(bumpStartedBy({by:4,at:10},2,10+BUMP_START.credit+.1),-1,'too long ago');
 assert.equal(bumpStartedBy({by:2,at:10},2,11),-1,'not itself');
 assert.equal(bumpStartedBy(undefined,2,11),-1);
});
test('bump start is offline only, never revives a seized, dropped or dry engine, and is told to the player',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('if(this.extendedDamage&&this.health>0&&this.engineStall!>0&&!this.seized&&!this.engineOut&&this.fuelLevel>FUEL_TANK.empty&&this.inverted===0){'));
 assert.ok(vehicle.includes('if(bumpCatches(this.stallTime,this.bumpRolled)){this.engineStall=0;this.bumpStarts++;'));
 assert.ok(vehicle.includes('}else{this.stallTime=0;this.bumpRolled=0;}'),'a running engine starts the count again');
 assert.ok(vehicle.includes('this.stallTime=this.bumpRolled=this.bumpStarts=0;'),'reset with the car');
 assert.ok(main.includes('car.onBumpStart=()=>{bumpStarts++;')&&main.includes('const by=bumpStartedBy(lastHitBy.get(car.id),car.id,elapsed);'));
 assert.ok(main.includes("toast(by>=0?`BUMP STARTED BY #${by+1}`:'BUMP STARTED · ENGINE CAUGHT',2,1)"));
 assert.ok(main.includes('else if(by===0)toast(`YOU BUMP STARTED #${car.id+1}`,1.6,1);'));
});
