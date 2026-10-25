import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SPLASHES,createRainSplashes} from '../src/rain-splashes';
test('raindrops land round the camera on the ground, open out and fade, and land again elsewhere',()=>{
  let seed=7;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const scene=new T.Scene(),splashes=createRainSplashes(scene,random),cam=new T.PerspectiveCamera(),ground=(x:number,z:number)=>.5+x*.01-z*.02;cam.position.set(10,3,-4);
  assert.ok(!splashes.mesh.visible&&scene.getObjectByName('rain_splashes')===splashes.mesh,'hidden until it rains');
  splashes.update(cam,ground,1/60);assert.equal(splashes.landed,0,'nothing while inactive');
  splashes.setActive(true);splashes.update(cam,ground,1/60);assert.equal(splashes.landed,SPLASHES.count,'all land at once, spread through their lives');
  const geo=splashes.mesh.geometry as T.InstancedBufferGeometry,off=geo.getAttribute('offset') as T.InstancedBufferAttribute,ph=geo.getAttribute('phase') as T.InstancedBufferAttribute;
  let near=true,onGround=true,phases=new Set<number>();for(let i=0;i<SPLASHES.count;i++){const x=off.getX(i),y=off.getY(i),z=off.getZ(i);near&&=Math.hypot(x-10,z+4)<=SPLASHES.reach+1e-9;onGround&&=Math.abs(y-(ground(x,z)+.03))<1e-6;phases.add(Math.round(ph.getX(i)*10));}
  assert.ok(near&&onGround,'within reach of the camera, just on the ground');assert.ok(phases.size>=8,'staggered');
  for(let k=0;k<60;k++)splashes.update(cam,ground,1/60);assert.ok(splashes.landed>SPLASHES.count*2,'landing again within a second');
  let inRange=true;for(let i=0;i<SPLASHES.count;i++)inRange&&=ph.getX(i)>=0&&ph.getX(i)<1;assert.ok(inRange);
  splashes.update(cam,()=>NaN,1);let fallback=true;for(let i=0;i<SPLASHES.count;i++)fallback&&=Number.isFinite(off.getY(i));assert.ok(fallback,'no ground: at the camera height');
  splashes.setActive(false);assert.ok(!splashes.mesh.visible);const n=splashes.landed;splashes.update(cam,ground,1);assert.equal(splashes.landed,n);
  splashes.dispose();assert.equal(scene.getObjectByName('rain_splashes'),undefined);
});
test('main lands raindrops in an offline rain event, on the course\'s ground',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("rainSplashes??=createRainSplashes(scene);rainSplashes.setActive(raining&&!online?.active);"));
  assert.ok(main.includes("rainSplashes?.update(camera,activeVenue.course.height,state==='paused'?0:dt);"));
});
