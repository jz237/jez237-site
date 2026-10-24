import test from 'node:test';
import assert from 'node:assert/strict';
import {TANK_DROP,tankDrops} from '../src/damage-handling';
import {FUEL_TANK,fuelFeed,drainFuel} from '../src/oil-starvation';
test('a big hit on a crushed tank end drops the fuel tank; a light one, the far end or a sound tank end does not',()=>{
 assert.ok(tankDrops(TANK_DROP.crush,TANK_DROP.blow,true));assert.ok(tankDrops(.9,30,true));
 assert.ok(!tankDrops(TANK_DROP.crush-.01,30,true),'tank end not crushed enough');assert.ok(!tankDrops(.9,TANK_DROP.blow-.1,true),'a knock');
 assert.ok(!tankDrops(.9,30,false),'a hit at the other end');assert.ok(!tankDrops(NaN,30,true)&&!tankDrops(.9,NaN,true));
});
test('torn off, the tank leaves only fumes: the open lines run the car dry within seconds, sputtering on the way',()=>{
 let level=TANK_DROP.reserve,t=0;assert.ok(level<FUEL_TANK.low,'already below the sputtering line');
 while(level>FUEL_TANK.empty&&t<60){level=drainFuel(level,TANK_DROP.leak,1/60);t+=1/60;}
 assert.ok(t>2&&t<10,`${t.toFixed(1)} s on fumes`);assert.equal(fuelFeed(level,0,0,1),0,'dry: the engine dies');
 assert.ok(TANK_DROP.after>2&&TANK_DROP.hot>TANK_DROP.speed&&TANK_DROP.leak>0&&TANK_DROP.leak<=1);
});
test('the tank dropping and tearing off are failure moments big enough for the crowd',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 const scores=Object.fromEntries([...src.matchAll(/(\w+):\{label:'[A-Z ]+',score:(\d+)\}/g)].map(m=>[m[1],+m[2]]));
 assert.ok(scores.tank>=22&&scores.tankoff>=22);assert.ok(src.includes("what==='tank'?'FUEL TANK DOWN':what==='tankoff'?'FUEL TANK GONE · ON FUMES':"));
});
