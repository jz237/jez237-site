import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SOFT,SOFT_FRAGMENT,SOFT_OCCLUSION,SOFT_UNIFORMS,SoftParticlesPass,handDepthTest,makeSoft,softUniforms} from '../src/soft-particles';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),effects=readFileSync(new URL('../src/effects.ts',import.meta.url),'utf8');
type Call={target:string;what:string;layers:number;background:unknown};
function fakeRenderer(){
  const calls:Call[]=[];let target='screen';
  const renderer={autoClear:true,setRenderTarget(t:T.WebGLRenderTarget|null){target=t?.texture.name??'screen';},
    render(o:T.Object3D,camera:T.Camera){calls.push({target,what:o.name||o.type,layers:camera.layers.mask,background:(o as T.Scene).background});}};
  return {renderer:renderer as unknown as T.WebGLRenderer,calls,get clear(){return renderer.autoClear;}};
}
const buffer=(name:string)=>{const t=new T.WebGLRenderTarget(4,4,{depthTexture:new T.DepthTexture(4,4)});t.texture.name=name;return t;};
function stage(){
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(52,1,.1,850),points=makeSoft(new T.Points(new T.BufferGeometry(),new T.ShaderMaterial())),sun=new T.DirectionalLight(),hidden=new T.Group(),buried=makeSoft(new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial()));
  scene.name='scene';scene.background=new T.Color(1,0,0);hidden.visible=false;hidden.add(buried);scene.add(points,sun,hidden);return {scene,camera,points,sun,buried};
}
test('a puff fades where it meets the scene, over part of its radius, and thins out right by the camera',()=>{
  assert.ok(SOFT_FRAGMENT.includes('texelFetch(sceneDepth,ivec2(gl_FragCoord.xy),0)')&&SOFT_FRAGMENT.includes('perspectiveDepthToViewZ'));
  assert.ok(SOFT_FRAGMENT.includes(`radius*${SOFT.fade.toFixed(2)}`)&&SOFT.fade>0&&SOFT.fade<=1);
  assert.ok(SOFT_FRAGMENT.includes('if(softOn<.5)return fade;'),'depth-tested as before when the depth cannot be read');
  assert.ok(SOFT.near[0]<SOFT.near[1]&&SOFT_UNIFORMS.includes('#include <packing>')&&SOFT_UNIFORMS.includes('sceneColor'));
  const o=makeSoft(new T.Object3D());assert.ok(o.layers.isEnabled(SOFT.layer)&&!o.layers.isEnabled(0),'only on its own layer: the scene pass never draws it');
});
test('after ambient occlusion: the scene drawn again through the soft layer and the lights, onto the picture, no copy, no background',()=>{
  const r=fakeRenderer(),{scene,camera,points,sun,buried}=stage(),pass=new SoftParticlesPass(scene,camera,()=>true),write=buffer('write'),read=buffer('read');
  pass.render(r.renderer,write,read);
  assert.deepEqual(r.calls,[{target:'read',what:'scene',layers:(1<<SOFT.layer)|(1<<SOFT.lights),background:null}]);
  assert.ok(sun.layers.isEnabled(SOFT.lights)&&sun.layers.isEnabled(0),'lights join the soft draw and stay in the scene pass');
  assert.ok(softUniforms.sceneDepth.value===write.depthTexture&&softUniforms.sceneColor.value===write.texture&&softUniforms.softOn.value===1&&!pass.needsSwap&&!pass.swapped);
  assert.equal((points.material as T.Material).depthTest,false);assert.equal((buried.material as T.Material).depthTest,true,'what is put away is left alone');
  assert.ok(r.clear&&camera.layers.mask===1&&(scene.background as T.Color).r===1&&scene.matrixWorldAutoUpdate,'the renderer, camera and scene are left as they were');
});
test('without ambient occlusion: the picture is copied across and drawn on there, leaving the depth behind',()=>{
  const r=fakeRenderer(),{scene,camera,points}=stage(),pass=new SoftParticlesPass(scene,camera,()=>false),write=buffer('write'),read=buffer('read');
  pass.render(r.renderer,write,read);
  assert.equal(r.calls.length,2);assert.equal(r.calls[0].target,'write');assert.equal(r.calls[1].target,'write');assert.equal(r.calls[1].what,'scene');
  assert.ok(softUniforms.sceneDepth.value===read.depthTexture&&softUniforms.sceneColor.value===read.texture&&pass.needsSwap&&pass.swapped);
  // Nothing to draw: no copy, no swap.
  points.visible=false;r.calls.length=0;pass.render(r.renderer,write,read);assert.equal(r.calls.length,0);assert.ok(!pass.needsSwap&&!pass.swapped);
});
test('a shader material can be depth-tested by hand: it discards what lies behind the scene',()=>{
  assert.ok(SOFT_OCCLUSION.includes('if(softOn<.5)return false;')&&SOFT_OCCLUSION.includes(`>scene+${SOFT.behind.toFixed(2)}`));
  const m=handDepthTest(new T.ShaderMaterial({uniforms:{own:{value:1}},fragmentShader:'uniform float own;void main(){gl_FragColor=vec4(own);}'}));
  assert.ok(m.fragmentShader.includes('void main(){if(softOccluded())discard;gl_FragColor')&&m.uniforms.sceneDepth===softUniforms.sceneDepth&&m.uniforms.own.value===1);
});
test('main draws the soft layer after the ambient occlusion and before the haze, which then finds the depth where it was left',()=>{
  assert.ok(effects.includes('makeSoft(this.points);this.points.renderOrder=10;')&&effects.includes('...softUniforms }')&&effects.includes('softParticle(vDepth,vRadius,min(1.,r))'));
  const ao=main.indexOf('composer.addPass(ao);\ncomposer.addPass(softParticles);\n'),haze=main.indexOf('composer.addPass(heatHaze);');assert.ok(ao>0&&ao<haze);
  assert.ok(main.includes('const softParticles = new SoftParticlesPass(scene, camera, () => ao.enabled);'));
  assert.ok(main.includes('const heatHaze = new HeatHazePass(() => ao.enabled || softParticles.swapped);'));
});
