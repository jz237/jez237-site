import test from 'node:test';
import assert from 'node:assert/strict';
import {damageDiagramSvg} from '../src/damage-diagram';
const base={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0]} as never as Parameters<typeof damageDiagramSvg>[0];
const svg=(faults:Record<string,unknown>,rearEngine=false)=>damageDiagramSvg({...base,rearEngine,faults} as never);
test('the damage diagram marks the fuel tank dragging or gone at the tank end, and parted throttle and handbrake cables',()=>{
 const down=svg({tank:'down'}),gone=svg({tank:'gone'});
 assert.ok(down.includes('dd-tank-down')&&!down.includes('dd-tank-gone'));assert.ok(gone.includes('dd-tank-gone'));
 assert.ok(/dd-tank dd-tank-down" x="25" y="96"/.test(down),'behind a front engine');assert.ok(/y="9"/.test(svg({tank:'down'},true)),'ahead of a rear engine');
 assert.ok(svg({throttleCable:true}).includes('dd-throttle-cable'));assert.ok(svg({handbrakeCable:true}).includes('dd-handbrake-cable'));
 const none=svg({});assert.ok(!none.includes('dd-tank')&&!none.includes('cable'));
});
