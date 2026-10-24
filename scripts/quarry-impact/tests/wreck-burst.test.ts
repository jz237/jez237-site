import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WRECK_BURST} from '../src/vehicle';
test('a fast takedown bursts the hanging parts off along the blow, offline only',()=>{
 assert.ok(WRECK_BURST.closing>=10&&WRECK_BURST.max<=4,'only big hits, and a capped shower');
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 const burst=vehicle.slice(vehicle.indexOf('  wreckBurst(direction:T.Vector3){'),vehicle.indexOf('  ripAssembly(name:string,quiet=false){'));
 assert.ok(burst.includes('if(!this.extendedDamage)return 0;'));
 assert.ok(burst.includes('if(n>=WRECK_BURST.max)break;if(a.loose<WRECK_BURST.loose||!a.members.some(m=>m.mesh.visible))continue;if(this.ripAssembly(a.name))n++;'),'only what was already hanging loose');
 assert.ok(burst.includes('for(const d of this.fx.debris)if(!before.has(d)){'),'only the new pieces get the kick');
 assert.ok(main.includes('if(wreck&&!online?.active&&closing>=WRECK_BURST.closing)a.wreckBurst(a.current.clone().sub(b.current));'));
 assert.ok(main.includes('if(wreck&&!online?.active&&closing>=WRECK_BURST.closing)b.wreckBurst(b.current.clone().sub(a.current));'));
 assert.ok(vehicle.includes('this.burnTime=0;this.fireSpreads=0;this.wreckBursts=0;'),'reset with the car');
});
