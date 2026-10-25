import * as T from 'three';
import {Pass,FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
/** Heat haze (offline): hot air shimmers whatever is seen through it. Each heat source is a column of rising air over a
 * base point: a burning car (HAZE.fire), a running engine's tailpipe (HAZE.exhaust, HAZE.exhaust.idle at tickover and full
 * at full throttle, HAZE.exhaust.rain of that in the rain), a hot bonnet past HAZE.bonnet.from of heat and anything burning on
 * the ground (HAZE.ground: oil and fuel slicks, props, debris; its width clamped to HAZE.ground.radius, fires closer than
 * HAZE.ground.merge m sharing one column). One full-screen
 * pass bends the picture inside each column with noise rising at HAZE.rate, by up to `pixels` on a 1080-line screen and
 * fading out by HAZE.far m; anything standing in front of a column stays sharp (scene depth). At most HAZE.max columns,
 * nearest the camera first. */
export const HAZE={max:12,far:60,rate:3.2,fire:{radius:1.7,rise:5,pixels:9},exhaust:{radius:.3,rise:1.2,pixels:2.4,idle:.3,rain:.3},
  bonnet:{radius:.8,rise:1.3,pixels:1.8,from:.55,rain:.3},ground:{radius:[.5,2.4],rise:3.4,pixels:6,merge:.6}} as const;
export type HeatSource={x:number;y:number;z:number;radius:number;rise:number;pixels:number};
const clamp01=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
/** How hard a tailpipe shimmers (pixels): HAZE.exhaust.idle at tickover up to full at full throttle; none from a dead engine. */
export const exhaustHaze=(throttle:number,running:boolean,wet:boolean)=>running?HAZE.exhaust.pixels*(HAZE.exhaust.idle+(1-HAZE.exhaust.idle)*clamp01(throttle))*(wet?HAZE.exhaust.rain:1):0;
/** How hard a hot bonnet shimmers (pixels): nothing below HAZE.bonnet.from of heat, full when the engine is at its hottest. */
export const bonnetHaze=(heat:number,wet:boolean)=>HAZE.bonnet.pixels*clamp01((heat-HAZE.bonnet.from)/(1-HAZE.bonnet.from))*(wet?HAZE.bonnet.rain:1);
/** A ground fire's column (burning slick, prop or debris) at its burn level 0–1, or null once it has burnt out. */
export function groundHaze(f:{x:number;y:number;z:number;radius:number},level:number):HeatSource|null{
  const l=clamp01(level);if(l<=0)return null;
  return{x:f.x,y:f.y,z:f.z,radius:Math.max(HAZE.ground.radius[0],Math.min(HAZE.ground.radius[1],Number.isFinite(f.radius)?f.radius:0)),rise:HAZE.ground.rise,pixels:HAZE.ground.pixels*l};
}
/** Add a heat source, folding it into one already within `gap` m across the ground (a burning stack of tyres is one
 * column, at the strongest of its fires, from the lowest of them). */
export function addHeat(list:HeatSource[],s:HeatSource,gap=HAZE.ground.merge){
  const near=list.find(o=>Math.hypot(o.x-s.x,o.z-s.z)<gap);
  if(!near){list.push(s);return;}
  near.pixels=Math.max(near.pixels,s.pixels);near.radius=Math.max(near.radius,s.radius);near.rise=Math.max(near.rise,s.rise);near.y=Math.min(near.y,s.y);
}
/** How hard a car fire shimmers (pixels), with its heat 0–1. */
export const fireHaze=(heat:number,burning:boolean)=>burning?HAZE.fire.pixels*Math.max(.35,clamp01(heat)):0;
export type HazeColumn={u:number;v:number;width:number;height:number;pixels:number;depth:number;radius:number};
const view=new T.Vector3(),ndc=new T.Vector3();
/** Where a source's column lands on screen (uv centre, half width/height in uv), its strength there in pixels and its
 * distance in front of the camera; null when behind the camera, off screen, too far or too faint. */
export function hazeColumn(s:HeatSource,camera:T.PerspectiveCamera):HazeColumn|null{
  if(![s.x,s.y,s.z,s.radius,s.rise,s.pixels].every(Number.isFinite)||s.pixels<=0)return null;
  view.set(s.x,s.y+s.rise/2,s.z).applyMatrix4(camera.matrixWorldInverse);const depth=-view.z;
  if(depth<camera.near+.3||depth>HAZE.far)return null;
  ndc.copy(view).applyMatrix4(camera.projectionMatrix);
  const span=2*depth*Math.tan(T.MathUtils.degToRad(camera.fov)/2),height=s.rise/2/span,width=s.radius/span/camera.aspect;
  const u=ndc.x*.5+.5,v=ndc.y*.5+.5;if(u+width<0||u-width>1||v+height<0||v-height>1)return null;
  const pixels=s.pixels*(1-depth/HAZE.far);return pixels>.05?{u,v,width,height,pixels,depth,radius:s.radius}:null;
}
/** Bends the picture inside each heat column; disabled whenever there is nothing hot in view. */
export class HeatHazePass extends Pass{
  readonly material:T.ShaderMaterial;
  private quad:FullScreenQuad;
  // Drawn here first, then copied on: the scene's depth may belong to the composer target this pass writes to, and a
  // target cannot be sampled while it is being drawn into.
  private target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false});
  private copy=new FullScreenQuad(new T.ShaderMaterial({name:'heat-haze-copy',uniforms:{tDiffuse:{value:null}},depthTest:false,depthWrite:false,
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform sampler2D tDiffuse;varying vec2 vUv;void main(){gl_FragColor=texture2D(tDiffuse,vUv);}'}));
  /** Columns drawn this frame (QA). */
  columns=0;
  constructor(private depthInWrite:()=>boolean){
    super();
    const boxes=Array.from({length:HAZE.max},()=>new T.Vector4()),info=Array.from({length:HAZE.max},()=>new T.Vector4());
    this.material=new T.ShaderMaterial({name:'heat-haze',defines:{MAX:HAZE.max},
      uniforms:{tDiffuse:{value:null},tDepth:{value:null},time:{value:0},count:{value:0},boxes:{value:boxes},info:{value:info},resolution:{value:new T.Vector2(1,1)},cameraNear:{value:.1},cameraFar:{value:850}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`#include <packing>
uniform sampler2D tDiffuse;uniform sampler2D tDepth;uniform float time,cameraNear,cameraFar;uniform vec2 resolution;uniform int count;uniform vec4 boxes[MAX];uniform vec4 info[MAX];varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
  float depth=-perspectiveDepthToViewZ(texture2D(tDepth,vUv).x,cameraNear,cameraFar);vec2 off=vec2(0.);
  for(int i=0;i<MAX;i++){
    if(i>=count)break;vec4 b=boxes[i];vec2 q=(vUv-b.xy)/b.zw;if(abs(q.x)>=1.||abs(q.y)>=1.)continue;
    float column=(1.-smoothstep(.3,1.,abs(q.x)))*smoothstep(-1.,-.65,q.y)*(1.-smoothstep(.15,1.,q.y));
    float behind=smoothstep(info[i].y-info[i].z*1.6,info[i].y-info[i].z*.4,depth);
    vec2 p=vec2(q.x*4.5,q.y*7.-time*${HAZE.rate.toFixed(2)})+float(i)*7.31;
    vec2 n=vec2(noise(p*vec2(1.,1.6))+.5*noise(p*2.3+5.7),noise(p*vec2(1.3,1.2)+19.1)+.5*noise(p*2.1+11.3))/1.5-.5;
    off+=n*2.*column*behind*info[i].x;
  }
  gl_FragColor=texture2D(tDiffuse,vUv+off/resolution);
}`,depthTest:false,depthWrite:false});
    this.quad=new FullScreenQuad(this.material);this.enabled=false;
  }
  /** Lay out this frame's columns, nearest first, and switch the pass off when none is in view. */
  setSources(sources:readonly HeatSource[],camera:T.PerspectiveCamera,time:number){
    const u=this.material.uniforms,columns=sources.map(s=>hazeColumn(s,camera)).filter((c):c is HazeColumn=>!!c).sort((a,b)=>a.depth-b.depth).slice(0,HAZE.max);
    const scale=u.resolution.value.y/1080;
    columns.forEach((c,i)=>{u.boxes.value[i].set(c.u,c.v,c.width,c.height);u.info.value[i].set(c.pixels*scale,c.depth,c.radius,0);});
    u.count.value=this.columns=columns.length;u.time.value=Number.isFinite(time)?time%1000:0;u.cameraNear.value=camera.near;u.cameraFar.value=camera.far;this.enabled=columns.length>0;
  }
  override setSize(width:number,height:number){const w=Math.max(1,width),h=Math.max(1,height);this.material.uniforms.resolution.value.set(w,h);this.target.setSize(w,h);}
  override render(renderer:T.WebGLRenderer,writeBuffer:T.WebGLRenderTarget,readBuffer:T.WebGLRenderTarget){
    // The scene's depth stays in the target the scene was drawn into: the other buffer once ambient occlusion has run.
    const u=this.material.uniforms;u.tDiffuse.value=readBuffer.texture;u.tDepth.value=(this.depthInWrite()?writeBuffer:readBuffer).depthTexture;
    renderer.setRenderTarget(this.target);this.quad.render(renderer);
    (this.copy.material as T.ShaderMaterial).uniforms.tDiffuse.value=this.target.texture;renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);this.copy.render(renderer);
  }
  override dispose(){this.material.dispose();this.quad.dispose();this.target.dispose();(this.copy.material as T.Material).dispose();this.copy.dispose();}
}
