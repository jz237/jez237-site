import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DRIVER} from '../src/driver-figure';
test('every car has a driver in the seat, placed from its own model, hidden from inside and freed with the car',()=>{
 assert.ok(DRIVER.headroom>=.2&&DRIVER.head<=.15,'the helmet stays under the roof');
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes('figure.position.set(Math.min(min.x,max.x)*DRIVER.side*2,Math.max(min.y,max.y)-DRIVER.headroom-DRIVER.head,(min.z+max.z)/2-Math.abs(max.z-min.z)*DRIVER.back);car.root.add(figure);'));
 assert.ok(main.includes("for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)d.visible=!(inside&&c===viewed);}"),'not in the way of the hood and dashboard views');
 assert.ok(vehicle.includes("{const driver=this.root.children.find(o=>o.name==='driver');if(driver)disposeDriver(driver);}"));
});
