import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {damageDiagramSvg} from '../src/damage-diagram';
const base={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0]} as never as Parameters<typeof damageDiagramSvg>[0];
const svg=(faults:Record<string,unknown>,rearEngine=false)=>damageDiagramSvg({...base,rearEngine,faults} as never);
test('the damage diagram shows a thrown rod across the engine and flames beside burning tyres',()=>{
 assert.ok(/dd-rod" d="M27.4 17 /.test(svg({rodThrown:true})),'front engine');assert.ok(/dd-rod" d="M27.4 87 /.test(svg({rodThrown:true},true)),'rear engine');
 assert.ok(svg({rodThrown:true}).includes('dd-rod-chunk')&&svg({rodThrown:true}).includes('fill="#141210"'),'the chunk is dark, to show on a red zone');
 const fire=svg({tyresAlight:[1,0,0,1]});assert.equal((fire.match(/dd-tyre-fire/g)??[]).length,2,'one flame per burning tyre');
 assert.ok(fire.includes('M2.6 28.5 ')&&fire.includes('M57.4 86.5 '),'beside the front-left and rear-right wheels');
 const none=svg({});assert.ok(!none.includes('dd-rod')&&!none.includes('dd-tyre-fire'));
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('batteryOut:player.batteryOut,rodThrown:player.rodThrown,tyresAlight:player.tyreAlight'));
});
