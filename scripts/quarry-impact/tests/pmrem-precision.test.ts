import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {createPMREMGenerator} from '../src/rendering';

test('PMREM materials are upgraded to highp as the generator creates them',()=>{
 const generator=createPMREMGenerator({} as T.WebGLRenderer) as unknown as Record<string,T.ShaderMaterial|null>;
 for(const key of ['_cubemapMaterial','_equirectMaterial','_blurMaterial','_ggxMaterial']){
  assert.equal(generator[key],null);
  const material=new T.ShaderMaterial({vertexShader:'precision mediump float;\nprecision mediump int;\nvoid main(){}',fragmentShader:'precision mediump float;\nvoid main(){}'});
  generator[key]=material;
  assert.equal(generator[key],material);
  assert.doesNotMatch(material.vertexShader+material.fragmentShader,/mediump/);
  assert.match(material.fragmentShader,/precision highp float/);
  generator[key]=null;assert.equal(generator[key],null);
 }
});

test('the installed three.js still creates PMREM shaders through the hooked fields',()=>{
 const source=readFileSync(new URL('../node_modules/three/src/extras/PMREMGenerator.js',import.meta.url),'utf8');
 for(const key of ['_cubemapMaterial','_equirectMaterial','_blurMaterial','_ggxMaterial'])assert.match(source,new RegExp('this\\.'+key+' = _get'),key);
 assert.match(source,/precision mediump float/,'if three switches to highp the hook becomes a harmless no-op');
});
