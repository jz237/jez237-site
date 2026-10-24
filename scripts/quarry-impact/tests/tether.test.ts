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
test('doors, bonnets and boot lids can hang on too, less often than bumpers, each from the edge it was hinged on',async()=>{
 const {TETHER_CHANCE,tetherKind,tetherMount}=await import('../src/bumper-lock');
 assert.equal(tetherKind('rear-bumper'),'bumper');assert.equal(tetherKind('door-rear-left'),'door');
 for(const n of ['hood','boot','tailgate','engine-lid'])assert.equal(tetherKind(n),'lid',n);
 for(const n of ['mirror-left','wing-left','cargo-left','drop-tailgate','hatch'])assert.equal(tetherKind(n),null,n);
 assert.ok(TETHER_CHANCE.door<TETHER_CHANCE.bumper&&TETHER_CHANCE.lid<TETHER_CHANCE.bumper&&TETHER_CHANCE.lid>0);
 let tied=0;for(let seed=0;seed<1000;seed++)if(tethers(seed,TETHER_CHANCE.door))tied++;assert.ok(Math.abs(tied/1000-TETHER_CHANCE.door)<.05);
 const min={x:-1,y:.4,z:-.5},max={x:-.8,y:1.2,z:.7};
 assert.deepEqual(tetherMount('door-left',min,max),{x:-.9,y:.8,z:.7},'a door hangs from its front (hinge) edge');
 assert.deepEqual(tetherMount('hood',{x:-.7,y:.9,z:1},{x:.7,y:1.1,z:2.2}),{x:0,y:1.1,z:1},'a bonnet from its back edge');
 assert.deepEqual(tetherMount('boot',{x:-.7,y:.9,z:-2.2},{x:.7,y:1.1,z:-1.4}),{x:0,y:1.1,z:-1.4},'a boot lid from its front edge');
});
