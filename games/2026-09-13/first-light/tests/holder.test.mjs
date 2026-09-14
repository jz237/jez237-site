import test from 'node:test';import assert from 'node:assert/strict';
import {HOLDER,createHolder,canPark,parkRod,holderTarget,holderBite,stepHolder,takeHolder,tipBounce,holderSnapshot,holderLine} from '../holder.js';
test('only a circle-hook bait resting on the bottom can go in the holder',()=>{
 assert.equal(canPark({phase:'retrieve',circle:true,onBottom:true,reeling:false}),true);
 assert.equal(canPark({phase:'retrieve',circle:false,onBottom:true,reeling:false}),false,'a crankbait is not a bottom rig');
 assert.equal(canPark({phase:'retrieve',circle:true,onBottom:false,reeling:false}),false,'still sinking');
 assert.equal(canPark({phase:'retrieve',circle:true,onBottom:true,reeling:true}),false,'you are reeling it');
 assert.equal(canPark({phase:'idle',circle:true,onBottom:true,reeling:false}),false);
});
test('park, soak, a bite with a pickup window, the drop if you are slow, and the hand-over',()=>{
 const h=createHolder();const fish={id:'cat'};
 assert.equal(holderTarget(h),null);assert.equal(takeHolder(h),null);assert.equal(stepHolder(h,1,0),null);
 assert.equal(parkRod(h,{rigIndex:5,rig:'bottom',lure:'Cut bait on a sinker',bait:{x:10,y:-2.1,z:4},lineOut:18,t:100}),true);
 assert.equal(parkRod(h,{rigIndex:5,rig:'bottom',lure:'x',bait:{x:1,y:-1,z:1},lineOut:5,t:100}),false,'one holder');
 const tgt=holderTarget(h);assert.equal(tgt.technique,'dead stick');assert.equal(tgt.family,'bait');assert.equal(tgt.inWater,true);assert.equal(tgt.speed,0);assert.equal(tgt.y,-2.1);
 let t=100;for(let i=0;i<70;i++){t+=1;assert.equal(stepHolder(h,1,t),null);}
 let snap=holderSnapshot(h,t);assert.equal(snap.soak,70);assert.equal(snap.bite,false);assert.match(holderLine(snap),/soaking 1:10/);
 assert.equal(holderBite(h,fish,t),true);assert.equal(holderBite(h,fish,t),false,'one bite at a time');
 assert.ok(Math.abs(tipBounce(h,t+.07))>.02,'the tip bounces right after the take');assert.equal(tipBounce(h,t+HOLDER.bounceSeconds+1),0,'and settles');
 assert.match(holderLine(holderSnapshot(h,t+1)),/grab it/);
 const dropped=stepHolder(h,1,t+HOLDER.pickupSeconds+.5);assert.equal(dropped.type,'holder_dropped');assert.equal(dropped.fish,fish);assert.equal(h.bite,null,'the rod keeps soaking');
 assert.equal(holderBite(h,fish,t+20),true);const taken=takeHolder(h);assert.equal(taken.rigIndex,5);assert.equal(taken.lineOut,18);assert.equal(taken.bite.fish,fish);assert.deepEqual(taken.bait,{x:10,y:-2.1,z:4});
 assert.equal(h.rod,null);assert.equal(holderSnapshot(h,0),null);assert.equal(holderLine(null),'');
});
