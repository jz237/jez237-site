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

test('contact shading uses a half-size target with the scene depth and matching camera projection',()=>{
  let target=null;const draws=[];
  const renderer={getRenderTarget:()=>target,setRenderTarget:value=>{target=value;},
    render:scene=>draws.push({material:scene.children[0].material,target})};
  const post=createPostFX(THREE,renderer),camera=new THREE.PerspectiveCamera(38,1.7,.1,100000);
  try{
    post.setSize(801,601,1.5);post.setIntensity(0);post.setPresentation(camera,true,.4);post.composite();
    assert.equal(draws.length,2);
    const contact=draws[0],composite=draws[1];
    assert.equal(contact.target.width,600);assert.equal(contact.target.height,450);
    assert.equal(contact.target.depthBuffer,false);
    assert.equal(contact.material.uniforms.uDepth.value,post.renderTarget.depthTexture);
    assert.deepEqual(contact.material.uniforms.uInverseProjection.value.elements,
      camera.projectionMatrixInverse.elements);
    assert.equal(contact.material.uniforms.uRadius.value,162);
    assert.equal(contact.material.uniforms.uTexel.value.y,1/901);
    assert.equal(composite.target,null);
    assert.equal(composite.material.uniforms.uContactMap.value,contact.target.texture);
    assert.deepEqual(composite.material.uniforms.uEffectSize.value.toArray(),[600,450]);
    draws.length=0;post.setSize(1,1,1);post.setPresentation(camera,true,0);post.composite();
    assert.equal(draws[0].target.width,1);assert.equal(draws[0].target.height,1);
  }finally{post.dispose();}
});

test('contact passes are skipped for flat and lightweight views, even when bloom is disabled',()=>{
  let target=null;const draws=[];
  const renderer={getRenderTarget:()=>target,setRenderTarget:value=>{target=value;},
    render:scene=>draws.push({target,contact:scene.children[0].material.uniforms.uContact?.value})};
  const post=createPostFX(THREE,renderer),camera=new THREE.PerspectiveCamera();
  try{
    post.setIntensity(0);post.setPresentation(camera,false,0);post.composite();
    assert.equal(draws.length,1);assert.equal(draws[0].contact,0);
    draws.length=0;post.setPresentation(camera,true,0);post.composite(true);
    assert.equal(draws.length,1);assert.equal(draws[0].target,null);assert.equal(draws[0].contact,0);
    draws.length=0;post.composite();
    assert.equal(draws.length,2);assert.equal(draws[1].contact,1,'lightweight capture restores contact state');
    draws.length=0;post.setIntensity(.3);post.composite();
    assert.equal(draws.length,5,'one contact pass, three bloom passes and final composition');
  }finally{post.dispose();}
});

test('disposing post effects releases the contact target and shader',()=>{
  let target=null;const draws=[];
  const renderer={getRenderTarget:()=>target,setRenderTarget:value=>{target=value;},
    render:scene=>draws.push({target,material:scene.children[0].material})};
  const post=createPostFX(THREE,renderer);
  post.setIntensity(0);post.setPresentation(new THREE.PerspectiveCamera(),true,0);post.composite();
  let targets=0,materials=0;
  draws[0].target.addEventListener('dispose',()=>targets++);
  draws[0].material.addEventListener('dispose',()=>materials++);
  post.dispose();assert.equal(targets,1);assert.equal(materials,1);
});
