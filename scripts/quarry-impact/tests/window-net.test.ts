import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WINDOW_NET,DRIVER} from '../src/driver-figure';
test('derby cars carry a window net beside the driver, at window height, freed with the car',()=>{
 assert.ok(WINDOW_NET.inset<1&&WINDOW_NET.inset>.7,'inside the body line, behind the glass');
 assert.ok(DRIVER.headroom>=.2&&DRIVER.headroom<=.25,'the driver sits at a believable height');
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(!attract&&!online?.active&&mode==='derby'){const net=windowNet();net.position.set(Math.min(min.x,max.x)*WINDOW_NET.inset,figure.position.y+.02,figure.position.z);car.root.add(net);}"));
 assert.ok(vehicle.includes("{const net=this.root.children.find(o=>o.name==='window_net');if(net)disposeWindowNet(net);}"));
});
