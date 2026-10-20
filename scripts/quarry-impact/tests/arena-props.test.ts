import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {createArenaProps,ARENA_PROP_SPOTS,arenaPropCount} from '../src/arena-props';
import {quarryReplayProps} from '../src/quarry-tyres';
import {ONLINE_ARENA_IDS} from '../src/online-events';
await R.init();
test('loose arena props stand still until struck, fly when hit, and reset for the next event',()=>{
 for(const [arena,spots] of Object.entries(ARENA_PROP_SPOTS)){
  assert.ok(!ONLINE_ARENA_IDS.includes(arena as never),arena+' is offline-only, so props never need server sync');
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(200,.5,200).setTranslation(0,-.5,0));
  const root=new T.Group(),loose=createArenaProps(R,world,root,spots);
  try{
   assert.equal(loose.props.length,arenaPropCount(arena),arena+' recorded prop count');
   for(let i=0;i<180;i++)world.step();loose.update();
   const drift=Math.max(...loose.props.map(p=>p.mesh.position.distanceTo(p.start)));assert.ok(drift<.08,`${arena} props settle in place (${drift.toFixed(3)} m)`);
   const first=loose.props[0];first.body.applyImpulse({x:first.body.mass()*12,y:first.body.mass()*2,z:0},true);for(let i=0;i<60;i++)world.step();loose.update();
   assert.ok(first.mesh.position.distanceTo(first.start)>3,arena+' a struck prop flies');
   loose.reset();loose.update();assert.ok(loose.props.every(p=>p.mesh.position.distanceTo(p.start)<1e-6),arena+' reset');
  }finally{loose.dispose();world.free();}
 }
 assert.equal(arenaPropCount('harrow-bowl-v1'),0);assert.equal(arenaPropCount(undefined),0);
});
test('replays recorded before an arena had loose props still load with none',()=>{
 assert.deepEqual(quarryReplayProps([1,2,3],0),[]);assert.deepEqual(quarryReplayProps([1,2,3],3),[1,2,3]);assert.throws(()=>quarryReplayProps([1,2,3],2));
});
