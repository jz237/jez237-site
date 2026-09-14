// Interactive surface disturbances: a GPU ping-pong 2D wave equation (Verlet, damped) on a 48 m atlas
// that follows the focus in 4 m steps with exact reprojection, as the foam atlas does. Impulses
// (pebble, lure splashdown, boils, jumps, wake stamps) are splatted in the step pass. Nothing is ever
// read back; physics that needs a height queries the analytic impulses instead.
import * as T from './vendor/three.module.js';
import {RIPPLE,rippleTier,waveK} from './ripple-math.js';
export const rippleGLSL=`uniform sampler2D rippleMap;uniform vec2 rippleCenter;uniform float rippleSpan,rippleTexel;
float rippleHeight(vec2 p){vec2 uv=(p-rippleCenter)/rippleSpan+.5;float inside=smoothstep(0.,.08,uv.x)*smoothstep(0.,.08,1.-uv.x)*smoothstep(0.,.08,uv.y)*smoothstep(0.,.08,1.-uv.y);return texture2D(rippleMap,clamp(uv,vec2(0.),vec2(1.))).r*inside;}
vec2 rippleSlope(vec2 p){float e=rippleSpan*rippleTexel;return vec2(rippleHeight(p+vec2(e,0.))-rippleHeight(p-vec2(e,0.)),rippleHeight(p+vec2(0.,e))-rippleHeight(p-vec2(0.,e)))/(2.*e);}`;
export function makeRippleField(renderer,quality='high'){
 const floating=renderer.extensions.has('EXT_color_buffer_float');
 let res=rippleTier(quality).res;
 const make=()=>new T.WebGLRenderTarget(res,res,{type:floating?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter,format:T.RGBAFormat});
 let targets=[make(),make()],index=0;
 const uniforms={rippleMap:{value:targets[0].texture},rippleCenter:{value:new T.Vector2()},rippleSpan:{value:RIPPLE.span},rippleTexel:{value:1/res}};
 const u={prev:{value:targets[0].texture},center:uniforms.rippleCenter,prevCenter:{value:new T.Vector2()},span:uniforms.rippleSpan,prevSpan:{value:RIPPLE.span},texel:{value:1/res},k:{value:waveK(res)},damping:{value:RIPPLE.damping},ready:{value:0},impulses:{value:Array.from({length:32},()=>new T.Vector4())},impulseCount:{value:0},byteMode:{value:floating?0:1}};
 const material=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,vertexShader:'varying vec2 uvP;void main(){uvP=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 uniform sampler2D prev;uniform vec2 center,prevCenter;uniform float span,prevSpan,texel,k,damping,ready,byteMode;uniform vec4 impulses[32];uniform int impulseCount;varying vec2 uvP;
 vec2 fetchH(vec2 uv){float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.)*ready;vec2 v=texture2D(prev,uv).rg;if(byteMode>.5)v=(v-.5)*.2;return v*inside;}
 void main(){vec2 p=(uvP-.5)*span+center;vec2 ouv=(p-prevCenter)/prevSpan+.5;
  vec2 c=fetchH(ouv);float lap=fetchH(ouv-vec2(texel,0.)).r+fetchH(ouv+vec2(texel,0.)).r+fetchH(ouv-vec2(0.,texel)).r+fetchH(ouv+vec2(0.,texel)).r-4.*c.r;
  float h=c.r+(c.r-c.g)*damping+k*lap;
  for(int i=0;i<32;i++){if(i>=impulseCount)break;vec4 im=impulses[i];vec2 d=p-im.xy;h+=im.w*exp(-dot(d,d)/(2.*im.z*im.z));}
  float edge=smoothstep(0.,.07,uvP.x)*smoothstep(0.,.07,1.-uvP.x)*smoothstep(0.,.07,uvP.y)*smoothstep(0.,.07,1.-uvP.y);h*=mix(.92,1.,edge);
  vec2 outv=vec2(h,c.r);if(byteMode>.5)outv=outv*5.+.5;
  gl_FragColor=vec4(outv,0.,1.);}`});
 const scene=new T.Scene(),quad=new T.Mesh(new T.PlaneGeometry(2,2),material),camera=new T.Camera();scene.add(quad);
 let pending=[],accumulator=0;
 return {uniforms,get texture(){return targets[index].texture;},quality,
  addImpulse(x,z,radius=.15,amplitude=.01){pending.push([x,z,radius,amplitude]);},
  setQuality(q){const next=rippleTier(q).res;this.quality=q;if(next===res)return;res=next;targets.forEach(t=>t.dispose());targets=[make(),make()];index=0;u.ready.value=0;u.texel.value=1/res;u.k.value=waveK(res);uniforms.rippleTexel.value=1/res;},
  update(dt,x,z){
   accumulator=Math.min(accumulator+dt,RIPPLE.dt*3);let steps=0;
   while(accumulator>=RIPPLE.dt-1e-6&&steps<3){accumulator-=RIPPLE.dt;steps++;
    u.prevSpan.value=uniforms.rippleSpan.value;u.prevCenter.value.copy(uniforms.rippleCenter.value);uniforms.rippleCenter.value.set(Math.floor(x/4)*4,Math.floor(z/4)*4);
    const n=Math.min(32,pending.length);for(let i=0;i<n;i++)u.impulses.value[i].set(...pending[i]);u.impulseCount.value=n;pending=pending.slice(n);
    u.prev.value=targets[index].texture;index=1-index;const previous=renderer.getRenderTarget();renderer.setRenderTarget(targets[index]);renderer.render(scene,camera);renderer.setRenderTarget(previous);u.ready.value=1;uniforms.rippleMap.value=targets[index].texture;}
  },
  reset(){u.ready.value=0;pending=[];},dispose(){targets.forEach(t=>t.dispose());material.dispose();quad.geometry.dispose();}};
}
