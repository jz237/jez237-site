import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('wing mirrors stand out from the body for a passing car to clip off, checked with the open doors',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 const spans=vehicle.slice(vehicle.indexOf('  mirrorSpans(){'),vehicle.indexOf('  openDoorSpans(){'));
 assert.ok(spans.includes("if(!a.name.startsWith('mirror')||!a.members.some(m=>m.mesh.visible))continue;"),'only mirrors still on');
 assert.ok(spans.includes('from:world({x:side*DEFINITIONS[this.kind].halfWidth*.85,y,z}),to:world({x:tip+side*.04,y,z})'),'from the body side out past the tip');
 assert.ok(spans.includes('if(!this.extendedDamage)return out;'),'offline only');
 assert.ok(main.includes('for(const {name,from,to} of [...c.openDoorSpans(),...c.mirrorSpans()]){'));
 assert.ok(main.includes("if(name.startsWith('mirror')){if(c.ripAssembly(name)){mirrorsClipped++;"),'a clipped mirror is not counted as a door');
});
