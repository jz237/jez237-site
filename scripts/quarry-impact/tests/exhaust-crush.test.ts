import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXHAUST_CRUSH,exhaustCrushes,exhaustCrushWarning} from '../src/damage-handling';
import {mechanicalReport} from '../src/wreck-report';
const passing=(()=>{for(let s=0;s<100;s++)if(exhaustCrushes(1,EXHAUST_CRUSH.damage,true,false,s))return s;return -1;})();
test('a big hit on a crushed rear can flatten the tailpipe while the exhaust is still on',()=>{
 assert.ok(passing>=0);
 assert.equal(exhaustCrushes(EXHAUST_CRUSH.rear-.01,99,true,false,passing),false,'rear not crushed enough');
 assert.equal(exhaustCrushes(1,EXHAUST_CRUSH.damage-.1,true,false,passing),false,'too small a hit');
 assert.equal(exhaustCrushes(1,99,false,false,passing),false,'not a rear hit');
 assert.equal(exhaustCrushes(1,99,true,true,passing),false,'no pipe left to crush');
 let n=0;for(let s=0;s<400;s++)if(exhaustCrushes(1,20,true,false,s))n++;assert.ok(Math.abs(n/400-EXHAUST_CRUSH.chance)<.08);
 assert.equal(exhaustCrushWarning(true,false),'EXHAUST CRUSHED · LOSING POWER');assert.equal(exhaustCrushWarning(true,true),'','torn off: clear again');
 assert.ok(mechanicalReport({exhaustCrushed:true}).includes('exhaust crushed'));
});
test('the crushed pipe costs power, coughs smoke and chokes the note until it is torn off, offline only',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes("if(this.extendedDamage&&!quiet&&this.health>0&&!this.exhaustCrushed&&exhaustCrushes(this.structuralDamage?.[1]??0,damage,zone==='rear',this.exhaustGone,this.id*29+this.bigHits))"));
 assert.ok(vehicle.includes('if(this.exhaustCrushed&&!this.exhaustGone&&running)this.misfireFactor*=EXHAUST_CRUSH.power;'));
 assert.ok(vehicle.includes('if(this.extendedDamage&&this.exhaustCrushed&&!this.exhaustGone&&this.health>0&&!(this.engineStall!>0)&&this.input.throttle>.4){this.crushPuff+=fxGap;'));
 assert.ok(vehicle.includes('this.exhaustCrushed=false;this.crushPuff=0;'),'reset with the car');
 assert.ok(audio.includes('exhaustLoudness(car.exhaustBlow)*(car.exhaustCrushed&&!car.exhaustGone?EXHAUST_CRUSH.sound:1)'));
 assert.ok(main.includes("what==='exhaustcrush'?'EXHAUST CRUSHED · LOSING POWER':")&&main.includes("what==='battery'||what==='rod'||what==='exhaustcrush'?1:0"));
 assert.ok(main.includes('exhaustCrushed:p.exhaustCrushed&&!p.exhaustGone,'));
});
