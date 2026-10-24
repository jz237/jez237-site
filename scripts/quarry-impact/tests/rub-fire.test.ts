import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RUB_FIRE,rubHeat,rubHeatWarning} from '../src/damage-handling';
import {mechanicalReport} from '../src/wreck-report';
test('a tyre rubbing hard at speed heats until it catches; slower or lighter it cools',()=>{
 const dt=1/60;let h=0,t=0;while(h<RUB_FIRE.after&&t<60){h=rubHeat(h,1,RUB_FIRE.speed*1.25,dt);t+=dt;}
 assert.ok(t>8&&t<12,'about ten seconds flat out on a fully crushed corner: '+t.toFixed(1));
 assert.equal(rubHeat(0,RUB_FIRE.rub-.01,30,dt),0,'a light rub never heats');
 assert.equal(rubHeat(0,1,RUB_FIRE.speed-.1,dt),0,'too slow');
 assert.ok(Math.abs(rubHeat(5,0,30,1)-(5-RUB_FIRE.cool))<1e-9,'cools');
 assert.ok(rubHeat(RUB_FIRE.after*1.5,1,40,1)<=RUB_FIRE.after*1.5,'capped');
 assert.equal(rubHeat(Number.NaN,1,Number.NaN,dt),0);
 assert.equal(rubHeatWarning([0,RUB_FIRE.warn,0,0],[0,0,0,0]),'TYRE SMOKING · EASE OFF');
 assert.equal(rubHeatWarning([0,RUB_FIRE.warn,0,0],[0,1,0,0]),'','already alight: the fire says it');
 assert.equal(rubHeatWarning([0,RUB_FIRE.warn-.1,0,0],[0,0,0,0]),'');
});
test('rub fire lights the tyre like a brake fire, offline only, and is reported',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('this.rubHeat[i]=this.extendedDamage?rubHeat(this.rubHeat[i],r,this.speed,dt):0;'));
 assert.ok(vehicle.includes("if(this.rubHeat[i]>=RUB_FIRE.after&&!this.tyreAlight[i]&&this.health>0){this.tyreAlight[i]=1;this.rubFires++;this.igniteRequest=true;"));
 assert.ok(vehicle.includes('this.rubHeat.fill(0);this.rubFires=0;'),'reset with the car');
 assert.ok(main.includes("rubfire:{label:'TYRE ALIGHT',score:28}")&&main.includes("what==='rubfire'?`TYRE ON FIRE · ${corner}`:"));
 assert.ok(main.includes("player.extendedDamage?rubHeatWarning(player.rubHeat,player.tyreAlight):'',"));
 assert.ok(main.includes('brakeFire:p.brakeFires>0,rubFire:p.rubFires>0'));
 assert.ok(mechanicalReport({rubFire:true}).includes('tyre caught fire rubbing'));
});
