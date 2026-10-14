import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {PoseInterpolation} from '../lib/PoseInterpolation';
import {SimulationClock} from '../lib/SimulationClock';

test('144 Hz presentation moves continuously between 60 Hz poses without moving a planted hand',()=>{
  const torso=new THREE.Bone(),hand=new THREE.Bone(),camera=new THREE.PerspectiveCamera();
  torso.matrixAutoUpdate=hand.matrixAutoUpdate=false;
  hand.matrix.makeTranslation(.1,.02,.03);
  const pose=new PoseInterpolation([torso,hand,camera]),clock=new SimulationClock();
  pose.capture();let time=0,last=-1,advances=0;
  const fixed=hand.matrix.clone();
  for(let frame=0;frame<288;frame++){
    clock.advance(1/144,dt=>{time+=dt;torso.matrix.makeTranslation(time*.12,0,0);camera.position.x=time*.1;pose.capture();});
    const accepted=torso.matrix.clone(),cameraX=camera.position.x;
    pose.render(clock.alpha,()=>{
      assert.deepEqual(hand.matrix.elements,fixed.elements);
      const x=torso.matrix.elements[12];
      if(frame>4){assert.ok(Math.abs(x-last-.12/144)<1e-10,'uniform screen-space progress at every display frame');advances++;}
      last=x;
    });
    assert.deepEqual(torso.matrix.elements,accepted.elements,'rendering restores the accepted physics pose');
    assert.equal(camera.position.x,cameraX);
  }
  assert.ok(advances>280);
});

test('render interpolation takes the short rotation and restores state even if rendering fails',()=>{
  const bone=new THREE.Bone();bone.matrixAutoUpdate=false;
  bone.matrix.makeRotationY(Math.PI-.1);const pose=new PoseInterpolation([bone]);pose.capture();
  bone.matrix.makeRotationY(-Math.PI+.1);pose.capture();const accepted=bone.matrix.clone();
  assert.throws(()=>pose.render(.5,()=>{assert.ok(bone.matrix.elements[0]<-.999);throw Error('lost graphics context');}));
  assert.deepEqual(bone.matrix.elements,accepted.elements);
});

test('the livelier tempo preserves fixed contact increments through uneven display timing',()=>{
  const run=(pattern:number[])=>{
    const clock=new SimulationClock(1.5);let wall=0,steps=0,simulation=0;
    for(let i=0;wall<4-1e-10;i++){
      const elapsed=Math.min(pattern[i%pattern.length],4-wall);wall+=elapsed;
      clock.advance(elapsed,dt=>{assert.equal(dt,1/60);steps++;simulation+=dt;});
    }
    return {steps,simulation};
  };
  const expected=run([1/60]);assert.equal(expected.steps,360);
  for(const cadence of [[1/10],[1/30],[1/144],[.012,.15,.008,.04,.02]])assert.deepEqual(run(cadence),expected);
});
