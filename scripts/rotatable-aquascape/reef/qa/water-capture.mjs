import assert from 'node:assert/strict';
import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReefReflections} from '../ReefReflections.ts';
import {reefBackGlass} from '../ReefBackGlass.ts';
const pool=new ReefReflections(),scene=new T.Scene(),camera=new T.PerspectiveCamera(24,1.7,.1,120);
camera.position.set(0,3.25,17.7);camera.lookAt(0,2.67,0);camera.updateMatrixWorld();
const original=camera.projectionMatrix.clone(),observed=[];
const surfaces=[];
for(const underside of [1,0]){
 const s=new Reflector(new T.PlaneGeometry(10,4.6),{textureWidth:1024,textureHeight:1024});
 s.material.name='AquariumWaterReflection';s.material.uniforms.underside={value:underside};s.material.uniforms.advancedReflections={value:1};
 s.rotation.x=Math.PI/2;s.position.y=5.45;s.onBeforeRender=(_r,_s,c)=>observed.push({underside,camera:c,projection:c.projectionMatrix.clone()});
 scene.add(s);pool.add(s);surfaces.push(s);
}
scene.updateMatrixWorld(true);pool.prepare({},scene,camera);pool.prepare({},scene,camera);
assert.equal(observed.length,4);
assert.deepEqual(camera.projectionMatrix.elements,original.elements,'capture must not change the viewing camera');
const lower=observed.filter(o=>o.underside===1),upper=observed.filter(o=>o.underside===0);
assert.equal(lower[0].camera,lower[1].camera,'reuse the overscan camera');
assert.equal(lower[0].projection.elements[0],original.elements[0],'horizontal coverage unchanged');
assert.equal(lower[0].projection.elements[5],original.elements[5]/1.5);
assert.equal(upper[0].camera,camera,'above-water capture remains unchanged');
assert.equal(surfaces[0].getRenderTarget().height,1536);
assert.equal(surfaces[1].getRenderTarget().height,1024);
assert.equal(lower[0].projection.elements[5]*1536,original.elements[5]*1024,'preserve vertical samples per view angle');
for(const point of [new T.Vector3(1,5,-2),new T.Vector3(-2,1,0)]){
 const v=point.clone().applyMatrix4(camera.matrixWorldInverse),a=v.clone().applyMatrix4(original),b=v.clone().applyMatrix4(lower[0].projection);
 assert.ok(Math.abs(a.x-b.x)<1e-12);assert.ok(Math.abs(a.y-b.y*1.5)<1e-12);
}
pool.setEffects(.65,0);assert.equal(surfaces[0].getRenderTarget().height,Math.round(1536*.65));
assert.equal(surfaces[0].getRenderTarget().samples,0,'automatic performance controls retained');
surfaces[0].material.uniforms.advancedReflections.value=0;pool.setEffects(.65,0);
assert.equal(surfaces[0].getRenderTarget().height,surfaces[0].getRenderTarget().width,'planar fallback drops unused overscan');
pool.prepare({},scene,camera);assert.equal(observed.at(-2).projection.elements[5],original.elements[5]);
surfaces[0].material.uniforms.advancedReflections.value=1;pool.setEffects(1,2);
assert.equal(surfaces[0].getRenderTarget().height,1536,'full coverage restores with advanced effects');
for(const s of surfaces){s.geometry.dispose();s.dispose();}
console.log('Reef water capture passed: vertical coverage, unchanged view, pixel density, reused camera, adaptive resolution.');

const rearPool=new ReefReflections(),clock={value:0},daylight={value:1};
const rear=reefBackGlass(rearPool,clock,daylight);scene.add(rear);scene.updateMatrixWorld(true);
assert.equal(rear.material.uniforms.daylight,daylight,'reflection tint uses live daylight, not a cloned stale value');
assert.ok(rearPool.visible(camera).includes(rear),'rear reflection is managed by the shared capture budget');
assert.equal(rear.getRenderTarget().width,1024);rearPool.setEffects(.65,0);assert.equal(rear.getRenderTarget().width,666);assert.equal(rear.getRenderTarget().samples,0);
rear.geometry.dispose();rear.dispose();
console.log('Rear glass: live uniforms, shared scheduling and adaptive capture size passed.');
