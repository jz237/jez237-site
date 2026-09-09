import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecoverySelector,plantedNormal} from '../engine/painted-recovery.mjs';
import {createFootworkSelector} from '../engine/painted-footwork.mjs';
const fighter=id=>({def:{id},x:500,vx:0,facing:1,grounded:true});
test('both pilots retract punches and kicks in order without replacing contact',()=>{
 for(const id of ['jez','benny'])for(const limb of ['punch','kick']){
  const select=createRecoverySelector(),f=fighter(id);
  f.attacking={kind:'light',limb,activeStartFrame:5,activeEndFrame:10,totalFrames:26};
  const cells=[];
  for(let tick=0;tick<26;tick++){
   f.attackFrame=tick;const p=select(f,tick,true);
   if(tick<10)assert.equal(p,null);else if(!cells.includes(p.frame))cells.push(p.frame);
  }
  assert.deepEqual(cells,limb==='kick'?[4,5,6,7]:[0,1,2,3]);
  f.attacking.animation={};assert.equal(select(f,26,true),null);
 }
});
test('a new atlas cannot replace a move that started without it',()=>{
 const f=fighter('jez'),select=createRecoverySelector();f.attacking={kind:'light',activeStartFrame:5,activeEndFrame:10,totalFrames:26};
 f.attackFrame=1;select(f,1,false);f.attackFrame=12;assert.equal(select(f,12,true),null);
});
test('a confirmed link can gather the hand before startup, never during contact',()=>{
 const f={...fighter('jez'),cancelledFrom:'light',attackFrame:1,attacking:{kind:'heavy',activeStartFrame:10,activeEndFrame:15,totalFrames:30}};
 const select=createRecoverySelector();assert.equal(select(f,1,true).frame,2);
 f.attackFrame=10;assert.equal(select(f,10,true),null);
});
test('defense distinguishes impact strength and height at the actual hit tick',()=>{
 const select=createRecoverySelector(),f={...fighter('benny'),blockstunFrames:15,lastImpactTick:100};
 for(const [low,heavy,frame] of [[false,false,8],[false,true,9],[true,false,10],[true,true,11]]){
  f.crouch=low;f.lastHitHeavy=heavy;assert.equal(select(f,100,true).frame,frame);
 }
 f.crouch=false;assert.equal(select(f,108,true).frame,8);
 f.hitstunFrames=8;assert.equal(select(f,108,true),null,'being hit outranks a block');
});
test('planted normals include kicks but never suppress traveling specials or aerial motion',()=>{
 for(const limb of ['punch','kick'])assert.ok(plantedNormal({...fighter('jez'),attacking:{kind:'heavy',limb}}));
 for(const extra of [{grounded:false},{attacking:{kind:'special'}},{attacking:{kind:'heavy',advanceSpeed:200}}])
  assert.equal(plantedNormal({...fighter('jez'),attacking:{kind:'heavy'},...extra}),false);
});
test('a direction change plants the feet briefly before the new shuffle begins',()=>{
 const f=fighter('alan'),select=createFootworkSelector();f.vx=150;
 for(let tick=0;tick<20;tick++){f.x+=2.5;select(f,f,tick,true);}
 f.vx=-150;f.x-=2.5;assert.equal(select(f,f,20,true).frame,5);
 f.x-=2.5;assert.equal(select(f,f,21,true).frame,5);
 f.x-=10;assert.notEqual(select(f,f,24,true).frame,5);
});
