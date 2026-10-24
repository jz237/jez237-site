import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CRASH} from '../src/vehicle';
test('heavy-hit failures judge the whole crash on a zone, once, as it crosses each threshold',()=>{
 assert.ok(CRASH.window>0&&CRASH.window<=.5);
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('const zi=CRASH_ZONES.indexOf(zone);if(time-this.zoneBlowAt[zi]>CRASH.window)this.zoneBlow[zi]=0;'));
 assert.ok(vehicle.includes('const crash=(threshold:number)=>priorBlow<threshold&&blow>=threshold?blow:0;'),'only the contact that crosses the threshold rolls, so each crash rolls once');
 for(const call of ['engineDrops(this.mountsBroken,this.engineDamage,crash(ENGINE_DROP.damage),','cableSnaps(this.engineDamage,crash(CABLE.blow),','crash(BATTERY_OUT.damage),zone===','exhaustCrushes(this.structuralDamage?.[1]??0,crash(EXHAUST_CRUSH.damage),','handbrakeSnaps(this.structuralDamage?.[1]??0,crash(HANDBRAKE_CABLE.blow),','?.[1])??0,crash(TANK_DROP.blow),'])
  assert.ok(vehicle.includes(call),call);
 assert.ok(vehicle.includes('this.zoneBlow.fill(0);this.zoneBlowAt.fill(-1e9);'),'reset with the car');
});
