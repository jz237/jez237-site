import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROD,OIL,rodStress,rodAtSeize} from '../src/oil-starvation';
import {mechanicalReport} from '../src/wreck-report';
test('revving a dry, battered engine builds rod stress; lifting bleeds it away',()=>{
 const dt=1/60,low=OIL.low-.05;let s=0;for(let i=0;i<Math.ceil(ROD.after/dt)+1;i++)s=rodStress(s,low,ROD.engine,ROD.rpm,1,dt);
 assert.ok(s>=ROD.after,'held long enough');
 assert.equal(rodStress(0,OIL.low,ROD.engine,ROD.rpm,1,dt),0,'oil in it');
 assert.equal(rodStress(0,low,ROD.engine-.01,ROD.rpm,1,dt),0,'engine not battered enough');
 assert.equal(rodStress(0,low,ROD.engine,ROD.rpm-1,1,dt),0,'below the revs');
 assert.ok(Math.abs(rodStress(1,low,ROD.engine,ROD.rpm,ROD.throttle-.01,1)-(1-ROD.ease))<1e-9,'off the throttle it eases');
 assert.equal(rodStress(Number.NaN,low,1,9000,1,0),0);
 assert.equal(rodAtSeize(ROD.rpm,ROD.throttle),true);assert.equal(rodAtSeize(ROD.rpm-1,1),false);assert.equal(rodAtSeize(9000,.5),false,'nursed: a quiet seize');
});
test('a thrown rod kills the engine loudly, offline only, and the report says so instead of a plain seize',()=>{
 const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes('if(this.rodStress>=ROD.after||seizes(this.oilLevel,this.engineDamage)&&rodAtSeize(this.rpm,this.input.throttle))this.throwRod();'));
 assert.ok(vehicle.includes('this.rodThrown=true;this.seized=true;this.engineStall=MAX_ENGINE_RESTART;this.rpm=0;'),'dead like a seize');
 assert.ok(vehicle.includes('this.fx.detach(chunk,')&&vehicle.includes('chunk.removeFromParent();chunk.geometry.dispose();(chunk.material as T.Material).dispose();'),'a chunk of block flies out; its source mesh is freed');
 assert.ok(vehicle.includes('this.rodStress=0;this.rodThrown=false;'),'reset with the car');
 assert.ok(main.includes("rod:{label:'ROD THROUGH THE BLOCK',score:34}")&&main.includes("what==='rod'?'ROD THROUGH THE BLOCK':"));
 assert.ok(main.includes('rodThrown:p.rodThrown,'));
 const r=mechanicalReport({seized:true,rodThrown:true});assert.ok(r.includes('rod through the block')&&!r.includes('engine seized'));
 assert.ok(mechanicalReport({seized:true}).includes('engine seized'));
});
