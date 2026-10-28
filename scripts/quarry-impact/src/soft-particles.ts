import * as T from 'three';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
/** Soft particles: dust, smoke, steam and sparks are drawn after the scene (and its ambient occlusion) against the scene's
 * depth, so a puff fades out where it meets the ground, a wall or a car (over SOFT.fade of its radius) instead of being
 * cut off along a hard line, and thins out within SOFT.near m of the camera instead of filling the screen. The particles
 * live on SOFT.layer, which the scene pass and the reflections never draw. */
export const SOFT={layer:5,fade:.85,near:[.6,2.2]} as const;
/** Shared by every soft particle material: the scene's depth (null while it cannot be sampled) and the camera's range. */
export const softUniforms={sceneDepth:{value:null as T.Texture|null},softOn:{value:0},cameraNear:{value:.1},cameraFar:{value:850}};
/** Fragment code for a soft particle: `alpha` faded by how far in front of the scene the particle's surface is, for a
 * particle `depth` m from the camera with world radius `radius`, `r` 0 at its centre to 1 at its rim. */
export const SOFT_FRAGMENT=`
float softParticle(float depth,float radius,float r){
 float fade=1.-smoothstep(${SOFT.near[1].toFixed(2)},${SOFT.near[0].toFixed(2)},depth);
 if(softOn<.5)return fade;
 float scene=-perspectiveDepthToViewZ(texelFetch(sceneDepth,ivec2(gl_FragCoord.xy),0).x,cameraNear,cameraFar);
 float front=depth-radius*sqrt(max(0.,1.-r*r))*.5;
 return fade*smoothstep(0.,max(.02,radius*${SOFT.fade.toFixed(2)}),scene-front);
}`;
export const SOFT_UNIFORMS='#include <packing>\nuniform sampler2D sceneDepth;uniform float softOn,cameraNear,cameraFar;';
/** Puts an object on the soft particle layer. */
export function makeSoft(o:T.Object3D){o.layers.set(SOFT.layer);return o;}
export class SoftParticlesPass extends Pass{
  /** Whether this frame's particles were drawn onto the other target (the scene's depth is then left in the one to be
   * written next, as after ambient occlusion). */
  swapped=false;
  private copy=new FullScreenQuad(new T.ShaderMaterial({name:'soft-particles-copy',uniforms:{tDiffuse:{value:null}},depthTest:false,depthWrite:false,
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform sampler2D tDiffuse;varying vec2 vUv;void main(){gl_FragColor=texture2D(tDiffuse,vUv);}'}));
  constructor(private objects:()=>readonly T.Object3D[],private camera:T.PerspectiveCamera,private depthInWrite:()=>boolean){super();this.needsSwap=false;}
  override render(renderer:T.WebGLRenderer,writeBuffer:T.WebGLRenderTarget,readBuffer:T.WebGLRenderTarget){
    const objects=this.objects().filter(o=>o.visible);
    // Once ambient occlusion has run, the picture is in one target and the scene's depth in the other: draw onto the
    // picture and read the depth. Otherwise both share a target, which cannot be sampled while it is drawn into: copy the
    // picture across and draw there (one full-screen copy), leaving the depth behind.
    const inWrite=this.depthInWrite(),depth=(inWrite?writeBuffer:readBuffer).depthTexture;
    this.swapped=this.needsSwap=!inWrite&&!!depth&&objects.length>0;
    if(this.swapped){(this.copy.material as T.ShaderMaterial).uniforms.tDiffuse.value=readBuffer.texture;renderer.setRenderTarget(writeBuffer);this.copy.render(renderer);}
    softUniforms.sceneDepth.value=depth;softUniforms.softOn.value=depth?1:0;
    softUniforms.cameraNear.value=this.camera.near;softUniforms.cameraFar.value=this.camera.far;
    for(const o of objects)((o as T.Mesh).material as T.Material).depthTest=!depth;
    const clear=renderer.autoClear;renderer.autoClear=false;this.camera.layers.enable(SOFT.layer);
    renderer.setRenderTarget(this.renderToScreen?null:this.swapped?writeBuffer:readBuffer);
    for(const o of objects)renderer.render(o,this.camera);
    this.camera.layers.disable(SOFT.layer);renderer.autoClear=clear;
  }
  override dispose(){(this.copy.material as T.Material).dispose();this.copy.dispose();}
}
