import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {damageDiagramSvg} from '../src/damage-diagram';
const base={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0]} as never as Parameters<typeof damageDiagramSvg>[0];
const svg=(faults:Record<string,unknown>,rearEngine=false)=>damageDiagramSvg({...base,rearEngine,faults} as never);
test('a car with another sitting on it groans like a pinned car',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(main.includes('if(!online?.active)for(const c of cars)c.underWeight=0;'),'cleared each step, so it stops when the car slides off');
 assert.ok(main.includes('o.underWeight=Math.max(o.underWeight,st.t);'));
 assert.ok(vehicle.includes('this.exhaustCrushed=false;this.crushPuff=0;this.underWeight=0;'),'reset with the car');
});
test('the damage diagram marks a flattened tailpipe while it is still on',()=>{
 assert.ok(/dd-exhaust-crushed" d="M24 103 /.test(svg({exhaustCrushed:true})));assert.ok(/dd-exhaust-crushed" d="M36 103 /.test(svg({exhaustCrushed:true},true)));
 assert.ok(!svg({exhaustCrushed:true,exhaustGone:true}).includes('dd-exhaust-crushed'),'torn off: the gone mark instead');
 assert.ok(readFileSync(new URL('../src/main.ts',import.meta.url),'utf8').includes('tyresAlight:player.tyreAlight,exhaustCrushed:player.exhaustCrushed}'));
});
