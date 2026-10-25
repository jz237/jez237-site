import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BATTERY_OUT,batteryThrown,batteryOutWarning,noBatteryHint} from '../src/damage-handling';
import {deadReason} from '../src/mechanical-dnf';
const passing=(()=>{for(let s=0;s<100;s++)if(batteryThrown(true,0,BATTERY_OUT.damage,true,s))return s;return -1;})();
test('a big engine-end hit throws the battery only with the bonnet gone or the bay crushed',()=>{
 assert.ok(passing>=0,'some hits throw it');
 assert.equal(batteryThrown(false,BATTERY_OUT.crush-.01,99,true,passing),false,'bonnet on and bay intact');
 assert.equal(batteryThrown(false,BATTERY_OUT.crush,BATTERY_OUT.damage,true,passing),true,'crushed bay');
 assert.equal(batteryThrown(true,0,BATTERY_OUT.damage-.1,true,passing),false,'too small a hit');
 assert.equal(batteryThrown(true,1,99,false,passing),false,'not the engine end');
 assert.equal(batteryThrown(true,1,Number.NaN,true,passing),false);
 let thrown=0;for(let s=0;s<400;s++)if(batteryThrown(true,1,20,true,s))thrown++;
 assert.ok(Math.abs(thrown/400-BATTERY_OUT.chance)<.08,'about BATTERY_OUT.chance of qualifying hits');
});
test('no battery: the HUD says so, and a stalled car without one starts the dead-car countdown',()=>{
 assert.equal(batteryOutWarning(true),'BATTERY GONE · NO STARTER');assert.equal(batteryOutWarning(false),'');
 assert.equal(noBatteryHint(true,50,1),'NO BATTERY · GET SHOVED TO BUMP START');
 assert.equal(noBatteryHint(true,50,0),'','running: no hint');assert.equal(noBatteryHint(false,50,1),'');
 assert.equal(deadReason({health:50,noBattery:true,driven:[2,3]}),'NO BATTERY');
 assert.equal(deadReason({health:50,noBattery:false,driven:[2,3]}),'');
});
test('battery out is offline only, cranks nothing, darkens the lights and silences the starter',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('if(this.extendedDamage&&!quiet&&this.health>0&&!this.batteryOut){'));
 assert.ok(vehicle.includes('if(this.batteryOut&&crankRequested(this.health,this.engineStall,this.input.throttle))this.engineStall=Math.min(MAX_ENGINE_RESTART,this.engineStall!+dt);'),'the restart is given straight back');
 assert.ok(vehicle.includes("this.fx.detach(battery,"),'thrown out as a loose part');
 assert.ok(vehicle.includes('battery.removeFromParent();battery.geometry.dispose();(battery.material as T.Material).dispose();'),'the source mesh is freed');
 assert.ok(vehicle.includes('this.batteryOut=false;'),'reset with the car');
 assert.ok(main.includes('carLights.get(c)?.set((dusk||wet&&c.extendedDamage)&&c.health>0&&!c.electricalCut&&!c.batteryOut&&'));
 assert.ok(main.includes('noBattery:c.batteryOut&&c.engineStall!>0,'));
 assert.ok(main.includes("what==='battery'?'BATTERY THROWN OUT · NO STARTER':"));
 assert.ok(main.includes("battery:{label:'BATTERY THROWN OUT',score:22}"));
 assert.ok(audio.includes("v=car.health>0&&car.engineStall!>0&&car.rpm>0&&!car.batteryOut?.13:0;"));
});
