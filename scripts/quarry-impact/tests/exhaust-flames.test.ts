import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {FLAME,SHIFT_FLAME,shiftFlame,flameSize,ExhaustFlames} from '../src/exhaust-flames';
test('an old car revved out and floored spits flame on the upshift; nothing else does',()=>{
  assert.equal(shiftFlame(2,3,SHIFT_FLAME.rpm+100,1,true),true);
  assert.equal(shiftFlame(2,3,SHIFT_FLAME.rpm+100,1,false),false,'a modern car');assert.equal(shiftFlame(2,3,SHIFT_FLAME.rpm-100,1,true),false,'short-shifted');
  assert.equal(shiftFlame(2,3,SHIFT_FLAME.rpm+100,SHIFT_FLAME.throttle-.05,true),false,'off the floor');assert.equal(shiftFlame(3,2,9000,1,true),false,'changing down');
  assert.equal(shiftFlame(0,1,9000,1,true),false,'out of neutral');assert.equal(shiftFlame(NaN,2,9000,1,true),false);
});
test('a flame is full at once and shrinks away over its life',()=>{
  assert.equal(flameSize(0),1);assert.ok(flameSize(FLAME.life/2)<1&&flameSize(FLAME.life/2)>0);assert.equal(flameSize(FLAME.life),0);assert.equal(flameSize(-1),0);assert.equal(flameSize(NaN),0);
});
test('a pop throws a tongue of flame out of the pipe the way it points, then it goes; the oldest give way',()=>{
  const scene=new T.Scene(),flames=new ExhaustFlames(scene,()=>.5);assert.equal(scene.children.filter(o=>o.name==='exhaust_flame').length,FLAME.pool);assert.equal(flames.burning,0);
  const back=new T.Vector3(1,0,1).normalize();flames.flash(new T.Vector3(3,.4,-2),back);const f=flames.flames[0];
  assert.ok(f.group.visible&&f.group.position.equals(new T.Vector3(3,.4,-2))&&flames.burning===1,'out at the pipe');
  const tip=new T.Vector3(0,0,-1).applyQuaternion(f.group.quaternion);assert.ok(tip.distanceTo(back)<1e-6,'pointing out of it');
  const box=new T.Box3().setFromObject(f.outer);assert.ok(box.getSize(new T.Vector3()).length()>FLAME.length*.9,'full length');
  flames.step(FLAME.life/2);assert.ok(f.group.scale.x<1&&f.group.visible,'shrinking');flames.step(FLAME.life);assert.ok(!f.group.visible&&flames.burning===0,'gone');
  for(let i=0;i<FLAME.pool+2;i++)flames.flash(new T.Vector3(),new T.Vector3(0,0,-1));assert.equal(flames.burning,FLAME.pool);assert.equal(flames.flashes,FLAME.pool+3);
  flames.reset();assert.equal(flames.burning,0);
});
test('main throws flame with every backfire and on the high-revving upshift, offline',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('car.onBackfire=p=>{sound.backfire(p);exhaustFlames.flash(p,steamAt.copy(car.forward).negate());};'),'every pop');
  assert.ok(main.includes('if(shiftFlame(before,c.gear,revs,c.input.throttle,isClassicKind(c.kind))){shiftFlames++;'),'the upshift');
  assert.ok(main.includes('exhaustFlames.step(state===\'paused\'||state===\'inspect\'?0:dt);')&&main.includes('rollingCaps.reset();exhaustFlames.reset();'),'stepped and cleared');
});
