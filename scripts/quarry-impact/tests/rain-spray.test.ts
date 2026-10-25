import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {PuddleSplashes,RAIN_SPRAY} from '../src/puddle-splashes';
import type {Vehicle} from '../src/vehicle';
const car=(speed:number,id=0,health=100,grounded=true)=>({id,health,velocity:new T.Vector3(0,0,speed),right:new T.Vector3(1,0,0),controller:{wheelContactPoint:(i:number)=>({x:i%2?.8:-.8,y:0,z:i<2?1:-1}),wheelIsInContact:()=>grounded}}as unknown as Vehicle);
const run=(cars:Vehicle[],film:number,seconds=1)=>{const fx=new PuddleSplashes(new T.Scene(),()=>.5);for(let i=0;i<Math.round(seconds*60);i++)fx.update(cars,[],1/60,true,false,film);return fx;};
test('in the rain every wheel on the wet road throws a fine spray that grows with speed, up to a cap',()=>{
  const slow=run([car(6)],1),fast=run([car(15)],1),flat=run([car(40)],1);
  assert.equal(fast.sprayWheels,4);assert.ok(fast.sprayed>slow.sprayed*1.8,'faster, more spray');
  assert.ok(Math.abs(fast.sprayed-4*Math.min(RAIN_SPRAY.max,RAIN_SPRAY.rate*15))<=4,'about rate x speed per wheel per second');
  assert.ok(Math.abs(flat.sprayed-4*RAIN_SPRAY.max)<=4,'capped');
  assert.equal(fast.emitted,0,'no puddle splashes off the puddles');
  for(const fx of [run([car(15)],0),run([car(RAIN_SPRAY.from-.5)],1),run([car(15,0,0)],1),run([car(15,0,100,false)],1)])assert.equal(fx.sprayed,0,'dry, slow, wrecked or airborne: none');
  const half=run([car(15)],.5);assert.ok(half.sprayed<fast.sprayed*.6&&half.sprayed>fast.sprayed*.4,'film scales it');
});
test('the spray is faint, trails behind the wheel slower than the car, rises and falls back to the road',()=>{
  const fx=run([car(15)],1,.3);const live=fx.drops.filter(d=>d.life>0);assert.ok(live.length>0);
  assert.ok(live.every(d=>d.alpha===RAIN_SPRAY.alpha&&d.v.z<15*RAIN_SPRAY.trail[1]+1e-9&&d.level<0&&d.size>=RAIN_SPRAY.size[0]),'faint, trailing, dies at the road');
  for(let i=0;i<120;i++)fx.update([],[],1/60,false,false,1);assert.equal(fx.stats.active,0,'all gone after a couple of seconds');
  const many=run(Array.from({length:24},(_,id)=>car(30,id)),1,2);assert.ok(many.stats.active<=many.capacity);
  many.reset();assert.ok(many.sprayed===0&&many.sprayWheels===0);
});
test('main sprays only in an offline rain event',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("puddleSplashes?.update(cars,activeVenue.puddles,effectsActive?dt:0,state==='playing',true,eventLighting==='rain'&&!online?.active?1:0);"));
});
