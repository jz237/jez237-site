import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FrameBudget} from '../src/FrameBudget.ts';
test('sustained slow frames request simpler graphics; fast frames and isolated stalls do not',()=>{
 const slow=new FrameBudget();let changed=false;for(let i=0;i<100;i++)changed=slow.sample(.1,true,true)||changed;assert(changed);
 const fast=new FrameBudget();for(let i=0;i<1000;i++)assert(!fast.sample(i===500?.2:1/60,true,true));
});
test('loading and hidden tabs do not affect automatic quality; severe foreground slowness does',()=>{
 const g=new FrameBudget();for(let i=0;i<100;i++){assert(!g.sample(1,true,false));assert(!g.sample(1,false,true));}assert.equal(g.warmup,0);
 let changed=false;for(let i=0;i<50;i++)changed=g.sample(.8,true,true)||changed;assert(changed);
});
