import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {REFLECT,streakFade,createWetReflections} from '../src/wet-reflections';
test('each lit lamp lays a streak on the wet road toward the camera, fading with distance, warm for heads and red for tails',()=>{
  assert.equal(streakFade(.5),0,'nothing right underfoot');assert.ok(streakFade(5)>streakFade(30));assert.equal(streakFade(REFLECT.far),0);assert.equal(streakFade(NaN),0);
  const scene=new T.Scene(),r=createWetReflections(scene),cam=new T.PerspectiveCamera();cam.position.set(0,3,20);
  r.update([{x:0,y:.6,z:0,tail:false},{x:2,y:.9,z:-1,tail:true},{x:0,y:.6,z:REFLECT.far+30,tail:false}],cam,(x,z)=>.1);
  assert.equal(r.mesh.count,2,'too far: none');const m=new T.Matrix4(),c=new T.Color(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();
  r.mesh.getMatrixAt(0,m);m.decompose(p,q,s);assert.ok(Math.abs(p.y-.12)<1e-6&&Math.abs(p.x)<1e-9&&Math.abs(s.z-REFLECT.length)<1e-6,'on the ground under the lamp, its length');
  const along=new T.Vector3(0,0,1).applyQuaternion(q);assert.ok(along.z>.99,'pointing at the camera');
  r.mesh.getColorAt(0,c);const warm=c.clone();r.mesh.getColorAt(1,c);assert.ok(warm.r>0&&warm.g>warm.b&&c.r>c.g*3,'warm white head, red tail');
  r.update([],cam,()=>0);assert.equal(r.mesh.count,0);r.clear();r.dispose();assert.equal(scene.getObjectByName('wet_reflections'),undefined);
});
test('the car lights report where their lit, unsmashed lamps shine from; main lays them in an offline rain event',()=>{
  const lights=readFileSync(new URL('../src/car-lights.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(lights.includes('if(lit)for(const side of headSides)if(side.lamps.some(i=>!(broken&1<<i)))')&&lights.includes('for(const side of tailSides)if(side.lamps.some(i=>!(broken&1<<(i+16))))'));
  assert.ok(main.includes("if(eventLighting==='rain'&&!online?.active){wetReflections??=createWetReflections(scene);glowList.length=0;for(const c of cars)if(c.extendedDamage)carLights.get(c)?.glows(glowList,c.root);wetReflections.update(glowList,camera,activeVenue.course.height);}"));
});
