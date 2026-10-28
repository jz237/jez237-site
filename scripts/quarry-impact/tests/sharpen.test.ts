import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SHARPEN,SharpenPass} from '../src/sharpen';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
test('a contrast-adaptive five-tap sharpen: it backs off where the neighbourhood is already contrasty',()=>{
  const pass=new SharpenPass(),f=pass.material.fragmentShader;
  assert.ok(f.includes('vec3 amp=sqrt(clamp(min(lo,1.-hi)/max(hi,vec3(1e-4)),0.,1.));')&&f.includes('(c+(n+s+e+w)*weight)/(1.+4.*weight)'),'weights sum to one: flat areas are untouched');
  pass.setSize(800,400);assert.ok(pass.material.uniforms.texel.value.equals(new T.Vector2(1/800,1/400)));
  for(const tier of ['ultra','high','medium'] as const){pass.setTier(tier);assert.equal(pass.material.uniforms.sharpness.value,SHARPEN.amount[tier]);}
  assert.ok(SHARPEN.amount.ultra<SHARPEN.amount.high&&SHARPEN.amount.high<SHARPEN.amount.medium,'more where the render scale is lower');
  pass.dispose();
});
test('the last step of the picture, after the edge smoothing, set by the graphics tier',()=>{
  assert.ok(main.includes('composer.addPass(new SMAAPass());\n// Fine detail back after the reduced render scale and the edge smoothing (the last step).\nconst sharpen = new SharpenPass();\ncomposer.addPass(sharpen);'));
  assert.equal(main.lastIndexOf('composer.addPass('),main.indexOf('composer.addPass(sharpen);'),'nothing after it');
  assert.ok(main.includes("  ao.enabled = quality !== 'medium';\n  sharpen.setTier(quality);"));
});
