import test from 'node:test';
import assert from 'node:assert/strict';
import {readableVfx} from '../engine/vfx-bridge.mjs';
import {createReadableReset, READABLE_RESET} from '../engine/demo-choreo.mjs';

test('CPU effects clear before recovery without changing the simulation or projectile cues',()=>{
  const smoke=Object.freeze({kind:'element',sheet:'smoke',max:1,life:1,size:100,alpha:1});
  const reduced=readableVfx(smoke,true);
  assert.equal(smoke.life,1);
  assert.equal(reduced.size,65);
  assert.equal(reduced.max,0.5);
  assert.equal(readableVfx({...smoke,life:0.49},true),null);
  const spark=readableVfx({kind:'hitSpark',max:1,life:1,size:100,shards:12},true);
  assert.equal(spark.alpha,1,'contact remains bright');
  assert.equal(spark.shards,4);
  assert.equal(spark.max,0.8);
  const projectile=Object.freeze({kind:'projectile',max:1,life:0.2,size:100});
  assert.equal(readableVfx(projectile,true),projectile);
  assert.equal(readableVfx(smoke,false),smoke,'ordinary play retains its effects');
});

function fighter(x){return {x,grounded:true,wakeupFrames:0,hitstunFrames:0,blockstunFrames:0,dizzyFrames:0,tauntFrames:0};}
test('resets separate both fighters only after recovery and stop at a bounded time',()=>{
  const reset=createReadableReset();
  const view={phase:'fight',tick:100,stageMinX:0,stageMaxX:1280,fighters:[fighter(500),fighter(660)]};
  reset.completed();reset.completed();
  view.fighters[0].attacking={};
  assert.equal(reset.step(0,view),null);
  view.fighters[0].attacking=null;
  assert.equal(reset.step(0,view,false),null,'planned sequences retain control');
  assert.equal(reset.step(0,view).left,true);
  assert.equal(reset.step(1,view).right,true);
  assert.equal(reset.snapshot().ticks,1,'two sides count one simulation tick');
  view.fighters[1].x=900;
  const hold=reset.step(0,view);
  assert.equal(hold.guard,true);
  assert.ok(!hold.left&&!hold.right,'no oscillating steps at comfortable range');
  view.tick+=READABLE_RESET.duration;
  assert.equal(reset.step(0,view),null);
  reset.completed();reset.completed();
  assert.equal(reset.step(0,view),null,'cooldown prevents continuous resets');
  view.tick+=READABLE_RESET.rearm;
  assert.ok(reset.step(0,view));
  view.fighters[0].hitstunFrames=3;
  assert.equal(reset.step(0,view),null,'a new incoming hit hands control back');
});
