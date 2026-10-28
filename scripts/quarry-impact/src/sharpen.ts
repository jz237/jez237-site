import * as T from 'three';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
/** Contrast-adaptive sharpening, the last step of the picture: a five-tap sharpen whose strength backs off where the
 * neighbourhood is already contrasty, so fine detail (aggregate, lettering, panel edges) comes back after the reduced
 * render scale and the edge smoothing without ringing round hard edges. Stronger the lower the render scale
 * (SHARPEN.amount by graphics tier). Works on the finished display colours. */
export const SHARPEN={amount:{ultra:.3,high:.5,medium:.6}} as const;
export type SharpenTier=keyof typeof SHARPEN.amount;
export class SharpenPass extends Pass{
  readonly material=new T.ShaderMaterial({name:'sharpen',uniforms:{tDiffuse:{value:null},texel:{value:new T.Vector2(1,1)},sharpness:{value:SHARPEN.amount.high as number}},depthTest:false,depthWrite:false,
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 texel;uniform float sharpness;varying vec2 vUv;
void main(){
  vec4 centre=texture2D(tDiffuse,vUv);vec3 c=centre.rgb;
  vec3 n=texture2D(tDiffuse,vUv+vec2(0.,texel.y)).rgb,s=texture2D(tDiffuse,vUv-vec2(0.,texel.y)).rgb,e=texture2D(tDiffuse,vUv+vec2(texel.x,0.)).rgb,w=texture2D(tDiffuse,vUv-vec2(texel.x,0.)).rgb;
  vec3 lo=min(c,min(min(n,s),min(e,w))),hi=max(c,max(max(n,s),max(e,w)));
  // Room to sharpen before clipping, as a share of the local peak: little where the neighbourhood already spans the range.
  vec3 amp=sqrt(clamp(min(lo,1.-hi)/max(hi,vec3(1e-4)),0.,1.));
  vec3 weight=-amp/mix(8.,5.,sharpness);
  gl_FragColor=vec4(clamp((c+(n+s+e+w)*weight)/(1.+4.*weight),0.,1.),centre.a);
}`});
  private quad=new FullScreenQuad(this.material);
  /** Set the strength for a graphics tier. */
  setTier(tier:SharpenTier){this.material.uniforms.sharpness.value=SHARPEN.amount[tier];}
  override setSize(width:number,height:number){this.material.uniforms.texel.value.set(1/Math.max(1,width),1/Math.max(1,height));}
  override render(renderer:T.WebGLRenderer,writeBuffer:T.WebGLRenderTarget,readBuffer:T.WebGLRenderTarget){
    this.material.uniforms.tDiffuse.value=readBuffer.texture;renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);this.quad.render(renderer);
  }
  override dispose(){this.material.dispose();this.quad.dispose();}
}
