import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {PUDDLE_SSR,reflectivePuddles} from '../src/puddle-reflections';
import {SOFT,softUniforms} from '../src/soft-particles';
const read=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
const physical='#include <common>\n#include <packing>\nvoid main() {\n\tvec4 diffuseColor;\n#include <lights_fragment_maps>\n#include <lights_fragment_end>\n}';
test('the water mirrors the picture: a march across the screen against the scene depth, the sky where it finds nothing',()=>{
  const own=new T.MeshPhysicalMaterial();own.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n//own');};own.customProgramCacheKey=()=>'own-water';
  const m=reflectivePuddles(own),shader={uniforms:{} as Record<string,T.IUniform>,vertexShader:'',fragmentShader:physical} as unknown as T.WebGLProgramParametersWithUniforms;
  m.onBeforeCompile(shader,{} as T.WebGLRenderer);const f=shader.fragmentShader;
  assert.ok(f.includes('//own')&&m.customProgramCacheKey()==='own-water|puddle-mirror','keeps its own edits and key');
  assert.equal(f.split('#include <packing>').length-1,1,'the depth helpers are not included twice');
  assert.ok(f.indexOf('vec4 puddleMirror(')>f.indexOf('#include <packing>')&&f.includes('uniform mat4 projectionMatrix;'));
  assert.ok(f.includes('void main() {\n\tif(softOccluded())discard;'),'hidden by hand behind what stands in front of it');
  assert.ok(f.includes('radiance=mix(radiance,mirror.rgb,mirror.a);')&&f.indexOf('radiance=mix(')<f.indexOf('#include <lights_fragment_end>'));
  assert.ok(shader.uniforms.sceneColor===softUniforms.sceneColor&&shader.uniforms.sceneDepth===softUniforms.sceneDepth);
  assert.ok(f.includes(`for(int i=0;i<${PUDDLE_SSR.steps};i++)`)&&f.includes(`for(int j=0;j<${PUDDLE_SSR.refine};j++)`));
  assert.ok(PUDDLE_SSR.first*PUDDLE_SSR.growth**(PUDDLE_SSR.steps-1)>=PUDDLE_SSR.reach,'the march can reach the far cliffs');
});
test('the puddles, rain puddles, wheel ripples and spray are drawn on the soft layer, the particles last',()=>{
  const world=read('world.ts'),rain=read('rain-puddles.ts'),splashes=read('puddle-splashes.ts');
  assert.ok(world.includes('softPuddle(p);this.puddleWater.push(p);')&&rain.includes('if(!wet)makeSoft(mesh);'));
  assert.ok(splashes.includes('makeSoft(this.spray);handDepthTest(this.spray.material as T.ShaderMaterial);')&&splashes.includes('makeSoft(this.rings);handDepthTest(this.rings.material as T.ShaderMaterial);'));
  assert.ok(SOFT.lights!==SOFT.layer&&SOFT.lights!==0);
});
