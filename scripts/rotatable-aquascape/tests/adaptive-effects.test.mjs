import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {AdaptiveEffects,effectProfiles} from '../lib/AdaptiveEffects.ts';
import {installAdaptiveShadowFilter} from '../lib/AdaptiveShadowFilter.ts';
import {AquariumLighting} from '../lib/AquariumLighting.ts';
import {ReflectionPool} from '../lib/ReflectionPool.ts';
import {AquariumWater} from '../lib/AquariumWater.ts';

const frames=(controller,ms,seconds)=>{let changes=0;for(let t=0;t<seconds*1000;t+=ms)changes+=Number(controller.observe(ms));return changes;};
test('fast computers and stable 30 Hz displays retain every full effect',()=>{
 for(const interval of [8.33,16.67,33.33]){const c=new AdaptiveEffects();assert.equal(frames(c,interval,120),0);assert.equal(c.level,0);}
 const c=new AdaptiveEffects();for(let i=0;i<7200;i++)c.observe(i%120===0?100:16.67);assert.equal(c.level,0);
});
test('only sustained slow frames reduce effects and levels stop changing at a usable rate',()=>{
 const c=new AdaptiveEffects();frames(c,66.7,3);assert.equal(c.level,0);
 frames(c,66.7,2);assert.equal(c.level,1);
 frames(c,33.3,60);assert.equal(c.level,1);
 frames(c,66.7,15);assert.equal(c.level,3);
 assert.equal(frames(c,66.7,30),0);assert.equal(c.level,3);
});
test('full effects recover gradually and an unsuccessful recovery backs off',()=>{
 const c=new AdaptiveEffects();frames(c,66.7,20);assert.equal(c.level,3);
 frames(c,16.7,8);assert.equal(c.level,3);
 frames(c,16.7,9);assert.equal(c.level,2);
 frames(c,66.7,5);assert.equal(c.level,3);assert.equal(c.recoveryDelay,24000);
 frames(c,16.7,15);assert.equal(c.level,3);
 frames(c,16.7,90);assert.equal(c.level,0);
});
test('loading, tab interruptions and explicit resets cannot accumulate a downgrade',()=>{
 const c=new AdaptiveEffects();for(let i=0;i<20;i++){frames(c,80,3);c.reset();}assert.equal(c.level,0);
 for(const bad of [0,NaN,Infinity,800]){c.observe(bad);frames(c,66.7,1);assert.equal(c.level,0);}
});
test('lighter effects change only contact targets and anti-aliasing; full dimensions and settings restore',()=>{
 const a=new AquariumLighting(new T.Scene(),new T.PerspectiveCamera());a.resize(1904,794);
 for(const profile of effectProfiles){a.setEffects(profile.aoScale,profile.contact,profile.samples);assert.equal(a.beauty.width,1904);assert.equal(a.beauty.height,794);assert.equal(a.beauty.samples,profile.samples);assert.equal(a.contactEnabled,profile.contact);assert.equal(a.contact.gtaoRenderTarget.width,Math.round(1904*profile.aoScale));assert.equal(a.contact.gtaoMaterial.defines.SAMPLES,16);assert.equal(a.contact.pdMaterial.defines.SAMPLES,16);}
 a.setEffects(1,true,2);assert.equal(a.contact.gtaoRenderTarget.height,794);assert.equal(a.contact.pdMaterial.uniforms.radius.value,4);assert.equal(a.beauty.samples,2);a.dispose();
});
test('reflection fallbacks retain geometry and depth data, invalidate images, and exactly restore sizes',()=>{
 const pool=new ReflectionPool(),mirror=pool.add(new Reflector(new T.PlaneGeometry(3,2),{textureWidth:768,textureHeight:1024,multisample:2}));
 const geometry=mirror.geometry,target=mirror.getRenderTarget();target.depthTexture=new T.DepthTexture(768,1024);
 const depth=target.depthTexture,texture=target.texture;
 assert.equal(pool.setEffects(.65,0),true);assert.equal(target.width,499);assert.equal(target.height,666);assert.equal(target.samples,0);assert.equal(mirror.forceUpdate,true);
 assert.equal(pool.setEffects(.65,0),false);assert.equal(pool.setEffects(1,2),true);
 assert.equal(target.width,768);assert.equal(target.height,1024);assert.equal(target.samples,2);assert.equal(target.depthTexture,depth);assert.equal(target.texture,texture);assert.equal(mirror.geometry,geometry);target.dispose();
});
test('simple PCF is a runtime branch; the original shader and prior material customization remain intact',()=>{
 const scene=new T.Scene(),material=new T.MeshPhysicalMaterial(),simple={value:0};let before=0;
 material.onBeforeCompile=s=>{before++;s.fragmentShader+='\n// authored detail';};scene.add(new T.Mesh(new T.BoxGeometry(),material));
 installAdaptiveShadowFilter(scene,simple);const shader={uniforms:{},fragmentShader:'#include <shadowmap_pars_fragment>'};material.onBeforeCompile(shader,{});
 assert.equal(before,1);assert.equal(shader.uniforms.aquariumSimpleShadows,simple);assert.ok(shader.fragmentShader.includes('// authored detail'));
 const restored=shader.fragmentShader.replace('uniform float aquariumSimpleShadows;\n','').replace('\n if(aquariumSimpleShadows>.5){shadow=texture(shadowMap,shadowCoord.xyz);}else{\n ','').replace('\n }\n','').replace('\n// authored detail','');
 assert.equal(restored,T.ShaderChunk.shadowmap_pars_fragment);
 simple.value=1;assert.equal(shader.uniforms.aquariumSimpleShadows.value,1);
});
test('light water reflections preserve surface geometry, ripples and Fresnel with a reversible uniform',()=>{
 const water=new AquariumWater(new ReflectionPool()),positions=water.children.map(s=>s.geometry.getAttribute('position'));
 water.advancedReflections.value=0;water.update(4,2,1);
 water.children.forEach((surface,i)=>{assert.equal(surface.geometry.getAttribute('position'),positions[i]);assert.equal(surface.material.uniforms.advancedReflections,water.advancedReflections);assert.ok(surface.material.fragmentShader.includes('waterFresnel'));});
 water.advancedReflections.value=1;assert.equal(water.children[0].material.uniforms.advancedReflections.value,1);
});
