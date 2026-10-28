import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SOFT,SOFT_FRAGMENT,SOFT_UNIFORMS,SoftParticlesPass,makeSoft,softUniforms} from '../src/soft-particles';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),effects=readFileSync(new URL('../src/effects.ts',import.meta.url),'utf8');
type Call={target:string;what:string;depthTest?:boolean;layer?:boolean};
function fakeRenderer(){
  const calls:Call[]=[];let target='screen';
  const renderer={autoClear:true,setRenderTarget(t:T.WebGLRenderTarget|null){target=t?.texture.name??'screen';},
    render(o:T.Object3D,camera:T.Camera){calls.push({target,what:o.name||o.type,depthTest:((o as T.Mesh).material as T.Material)?.depthTest,layer:o.layers.test(camera.layers)});}};
  return {renderer:renderer as unknown as T.WebGLRenderer,calls,get clear(){return renderer.autoClear;}};
}
const buffer=(name:string)=>{const t=new T.WebGLRenderTarget(4,4,{depthTexture:new T.DepthTexture(4,4)});t.texture.name=name;return t;};
test('a puff fades where it meets the scene, over part of its radius, and thins out right by the camera',()=>{
  assert.ok(SOFT_FRAGMENT.includes('texelFetch(sceneDepth,ivec2(gl_FragCoord.xy),0)')&&SOFT_FRAGMENT.includes('perspectiveDepthToViewZ'));
  assert.ok(SOFT_FRAGMENT.includes(`radius*${SOFT.fade.toFixed(2)}`)&&SOFT.fade>0&&SOFT.fade<=1);
  assert.ok(SOFT_FRAGMENT.includes('if(softOn<.5)return fade;'),'depth-tested as before when the depth cannot be read');
  assert.ok(SOFT.near[0]<SOFT.near[1]&&SOFT_UNIFORMS.includes('#include <packing>'));
  const o=makeSoft(new T.Object3D());assert.ok(o.layers.isEnabled(SOFT.layer)&&!o.layers.isEnabled(0),'only on its own layer: the scene pass never draws it');
});
test('after ambient occlusion: drawn onto the picture, reading the depth in the other target, no copy and no swap',()=>{
  const r=fakeRenderer(),camera=new T.PerspectiveCamera(52,1,.1,850),points=makeSoft(new T.Points(new T.BufferGeometry(),new T.ShaderMaterial()));points.name='points';
  const pass=new SoftParticlesPass(()=>[points],camera,()=>true),write=buffer('write'),read=buffer('read');
  pass.render(r.renderer,write,read);
  assert.deepEqual(r.calls,[{target:'read',what:'points',depthTest:false,layer:true}]);
  assert.ok(softUniforms.sceneDepth.value===write.depthTexture&&softUniforms.softOn.value===1&&!pass.needsSwap&&!pass.swapped);
  assert.ok(r.clear&&!camera.layers.isEnabled(SOFT.layer),'the renderer and camera are left as they were');
});
test('without ambient occlusion: the picture is copied across and drawn on there, leaving the depth behind',()=>{
  const r=fakeRenderer(),camera=new T.PerspectiveCamera(),points=makeSoft(new T.Points(new T.BufferGeometry(),new T.ShaderMaterial()));points.name='points';
  const pass=new SoftParticlesPass(()=>[points],camera,()=>false),write=buffer('write'),read=buffer('read');
  pass.render(r.renderer,write,read);
  assert.equal(r.calls.length,2);assert.equal(r.calls[0].target,'write');assert.deepEqual(r.calls[1],{target:'write',what:'points',depthTest:false,layer:true});
  assert.ok(softUniforms.sceneDepth.value===read.depthTexture&&pass.needsSwap&&pass.swapped);
  // Nothing to draw: no copy, no swap.
  points.visible=false;r.calls.length=0;pass.render(r.renderer,write,read);assert.equal(r.calls.length,0);assert.ok(!pass.needsSwap&&!pass.swapped);
});
test('main draws the particles soft: after ambient occlusion, before the haze, which then finds the depth where it was left',()=>{
  assert.ok(effects.includes('makeSoft(this.points);')&&effects.includes('...softUniforms }')&&effects.includes('softParticle(vDepth,vRadius,min(1.,r))'));
  const ao=main.indexOf('composer.addPass(ao);\ncomposer.addPass(softParticles);\n'),haze=main.indexOf('composer.addPass(heatHaze);');assert.ok(ao>0&&ao<haze);
  assert.ok(main.includes('const softParticles = new SoftParticlesPass(() => fx ? [fx.points] : [], camera, () => ao.enabled);'));
  assert.ok(main.includes('const heatHaze = new HeatHazePass(() => ao.enabled || softParticles.swapped);'));
});
