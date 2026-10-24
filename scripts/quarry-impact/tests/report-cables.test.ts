import test from 'node:test';
import assert from 'node:assert/strict';
import {mechanicalReport} from '../src/wreck-report';
test('the mechanical report names a dropped or lost fuel tank and parted throttle and handbrake cables',()=>{
 assert.ok(mechanicalReport({tank:'gone'}).includes('fuel tank torn off'));assert.ok(mechanicalReport({tank:'down'}).includes('fuel tank dragging'));
 assert.ok(mechanicalReport({throttleCable:true}).includes('throttle cable snapped'));assert.ok(mechanicalReport({handbrakeCable:true}).includes('handbrake cable snapped'));
 const r=mechanicalReport({outOfFuel:true,tank:'gone'});assert.ok(r.indexOf('out of fuel')<r.indexOf('fuel tank torn off'),'why it stopped, then what did it');
 assert.equal(mechanicalReport({}),'');
});
test('main feeds the player car\'s tank and cables into the report',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(src.includes("mechanicalReport({engineOut:p.engineOut,tank:p.tankGone?'gone':p.tankDown?'down':undefined,throttleCable:p.throttleCable,handbrakeCable:p.handbrakeCable,"));
});
