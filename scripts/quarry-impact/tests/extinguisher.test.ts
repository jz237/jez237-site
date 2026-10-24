import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXTINGUISHER,extinguisherHint} from '../src/damage-handling';
import {warningLine} from '../src/hud-warnings';
test('the extinguisher hint shows only on fire with a charge left, and fire and smoke outrank other warnings',()=>{
 assert.equal(EXTINGUISHER.charges,2);assert.equal(EXTINGUISHER.key,'KeyG');
 assert.equal(extinguisherHint(true,2),'ON FIRE · G EXTINGUISHER ×2');
 assert.equal(extinguisherHint(true,0),'');assert.equal(extinguisherHint(false,2),'');
 const line=warningLine(['TIE ROD SNAPPED','DIFF BROKEN','GEARBOX 3 GEARS','TYRE SMOKING · EASE OFF','ON FIRE · G EXTINGUISHER ×1']);
 assert.ok(line.startsWith('ON FIRE · G EXTINGUISHER ×1 · TYRE SMOKING · EASE OFF'),line);
 assert.ok(warningLine(['TIE ROD SNAPPED','DIFF BROKEN','FRAME BENT','BATTERY GONE · NO STARTER']).includes('+1'),'a thrown battery ranks with the starter');
});
test('G puts the fire out through the douse path, offline only, and only spends a charge on a fire',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),fire=readFileSync(new URL('../src/vehicle-fire.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('if(!this.extendedDamage||this.health<=0||this.extinguishers<=0||!this.burning)return false;'));
 assert.ok(vehicle.includes('this.extinguishers--;this.extinguished++;this.extinguishRequest=true;this.tyreAlight.fill(0);this.brakeFire.fill(0);this.rubHeat.fill(0);'));
 assert.ok(vehicle.includes('get burning(){return this.onFire||this.tyreAlight.some(Boolean);}'));
 assert.ok(vehicle.includes('this.extinguishers=EXTINGUISHER.charges;this.extinguished=0;this.extinguishRequest=false;this.onFire=false;'),'a fresh pair each event');
 assert.ok(vehicle.includes('this.douseRequest=inWater>=2&&Math.abs(this.speed)>1.5;'),'the water douse is unchanged');
 assert.ok(fire.includes('if(car.extendedDamage&&(car.douseRequest||car.extinguishRequest)){car.douseRequest=false;car.extinguishRequest=false;if(state.douse())car.onDoused?.();}'),'the request waits for the fire update');
 assert.ok(fire.includes('car.fireHeat=state.heat;car.onFire=state.burning;'));
 assert.ok(main.includes("if(!demo&&e.code===EXTINGUISHER.key&&state==='playing'&&!Object.values(drivingControls.keys).some(binding=>binding.includes(e.code))){"),'not when G is bound to driving');
 assert.ok(main.includes("${!online?.active&&!demo?'<kbd>G</kbd> EXTINGUISHER ':''}"),'on the controls strip offline');
});
