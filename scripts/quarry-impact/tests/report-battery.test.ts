import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mechanicalReport} from '../src/wreck-report';
import {damageDiagramSvg} from '../src/damage-diagram';
const base={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0]} as never as Parameters<typeof damageDiagramSvg>[0];
const svg=(faults:Record<string,unknown>,rearEngine=false)=>damageDiagramSvg({...base,rearEngine,faults} as never);
test('the mechanic report names a battery thrown out, next to the other electrical faults',()=>{
 assert.ok(mechanicalReport({batteryOut:true}).includes('battery thrown out'));
 assert.ok(!mechanicalReport({}).includes('battery'));
 const both=mechanicalReport({throttleCable:true,batteryOut:true,belt:'flat'});
 assert.ok(both.indexOf('throttle cable snapped')<both.indexOf('battery thrown out')&&both.indexOf('battery thrown out')<both.indexOf('battery flat'),'worst first');
});
test('the damage diagram marks the empty battery tray in the engine bay, front or rear engine',()=>{
 assert.ok(/dd-battery-out" x="16" y="20"/.test(svg({batteryOut:true})),'front engine bay');
 assert.ok(/dd-battery-out" x="16" y="86"/.test(svg({batteryOut:true},true)),'rear engine bay');
 assert.ok(!svg({}).includes('dd-battery-out'));
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('throttleCable:p.throttleCable,handbrakeCable:p.handbrakeCable,batteryOut:p.batteryOut,'),'in the end-of-event report');
 assert.ok(main.includes('throttleCable:player.throttleCable,handbrakeCable:player.handbrakeCable,batteryOut:player.batteryOut'),'on the live diagram');
});
