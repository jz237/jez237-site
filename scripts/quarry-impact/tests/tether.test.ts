import test from 'node:test';
import assert from 'node:assert/strict';
import {TETHER,tethers,tetherLife,tetherAge} from '../src/bumper-lock';
test('about TETHER.chance of torn-off bumpers stay on their wire, the same bumper always the same way',()=>{
 let tied=0;for(let seed=0;seed<1000;seed++)if(tethers(seed))tied++;
 assert.ok(Math.abs(tied/1000-TETHER.chance)<.05,`${tied} of 1000`);assert.equal(tethers(17),tethers(17));assert.ok(!tethers(NaN));
});
test('the wire holds for TETHER.min..min+span seconds, and wears through twice as fast when dragged at speed',()=>{
 for(let seed=0;seed<200;seed++){const life=tetherLife(seed);assert.ok(life>=TETHER.min&&life<TETHER.min+TETHER.span);}
 assert.equal(tetherLife(NaN),TETHER.min);
 assert.ok(Math.abs(tetherAge(0,TETHER.fast-1,.5)-.5)<1e-12,'cruising');assert.ok(Math.abs(tetherAge(0,-(TETHER.fast+1),.5)-.5*TETHER.fastRate)<1e-12,'flat out, either way');
 assert.equal(tetherAge(1,5,0),1);assert.ok(Number.isNaN(tetherAge(NaN,5,.1)));
 assert.ok(TETHER.length>=1&&TETHER.snap>TETHER.length&&TETHER.spark>0);
});
