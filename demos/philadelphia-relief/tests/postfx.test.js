import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createPostFX } from '../src/postfx.js';
import { createCityUniforms } from '../src/city-lighting.js';

test('cloud composition retains world altitude under rotated cameras and skips disabled cloud draws',()=>{
  let target=null;
  const draws=[];
  const renderer={getRenderTarget:()=>target,setRenderTarget:value=>{target=value;},
    render:scene=>draws.push({material:scene.children[0].material,target})};
  const post=createPostFX(THREE,renderer),lighting=createCityUniforms(THREE);
  const sky={uSunDir:{value:new THREE.Vector3(.3,.8,.4)},uSunColor:{value:new THREE.Vector3(1,1,1)},
    uHorizon:{value:new THREE.Vector3(.5,.6,.7)},uNight:{value:0}};
  const camera=new THREE.PerspectiveCamera(40,1.5,.1,100000);
  try{
    post.setSize(801,601,1);post.setIntensity(0);
    post.renderClouds(camera,sky,lighting,'balanced');
    assert.equal(draws.length,0,'clear skies need no cloud render target pass');
    lighting.uCloudCoverage.value=.65;
    for(const eye of [[0,800,2000],[900,4000,-3000],[-12000,12000,1500]]){
      camera.position.set(...eye);camera.lookAt(0,10,0);camera.updateMatrixWorld();
      post.setPresentation(camera,true,0);
      post.renderClouds(camera,sky,lighting,'balanced');
      const cloud=draws.at(-1);
      assert.equal(cloud.target.width,400);assert.equal(cloud.target.height,300);
      assert.equal(cloud.material.uniforms.uCoverage.value,.65);
      post.composite();
      const u=draws.at(-1).material.uniforms;
      for(const height of [0,900,1599,1601,2400]){
        const world=new THREE.Vector3(120,height,-70);
        const view=world.clone().applyMatrix4(camera.matrixWorldInverse);
        const reconstructed=u.uCameraHeight.value+u.uViewWorldY.value.dot(view);
        assert.ok(Math.abs(reconstructed-height)<1e-8,'cloud altitude must not depend on orbit angle');
      }
      assert.equal(u.uCloudBase.value,1600);
      assert.equal(u.uCloudsOn.value,1);
    }
    lighting.uCloudBase.value=7600;lighting.uCloudCoverage.value=0;
    const before=draws.length;post.renderClouds(camera,sky,lighting,'performance');
    assert.equal(draws.length,before);post.composite();
    const u=draws.at(-1).material.uniforms;
    assert.equal(u.uCloudsOn.value,0);assert.equal(u.uCloudBase.value,7600);
    assert.equal(u.uReflections.value,0);
  }finally{post.dispose();}
});
