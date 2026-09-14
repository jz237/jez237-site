// A moving world-space foam and shoreline-wetness atlas (After the Storm's design). On a lake the
// sources are wind lanes and whitecaps on rough days, wake foam behind the kayak, splash aeration
// from the ripple field, and the wet band where small waves lap the bank.
import {wetSandGLSL} from './wet-sand.js';
import * as T from './vendor/three.module.js';
export function makeFoamField(renderer,common,uniforms){
 const floatingHistory=renderer.extensions.has('EXT_color_buffer_float');
 const targets=[0,1].map(()=>new T.WebGLRenderTarget(128,128,{type:floatingHistory?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter}));
 const u={...uniforms,historyByte:{value:floatingHistory?0:1},historyFrame:{value:0},previousFoam:{value:targets[0].texture},foamCenter:{value:new T.Vector2()},previousCenter:{value:new T.Vector2()},foamSpan:{value:240},previousSpan:{value:240},foamDt:{value:0},foamReady:{value:0}};
 const material=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,vertexShader:'varying vec2 uvP;void main(){uvP=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:common+wetSandGLSL+`
 uniform sampler2D previousFoam;uniform vec2 foamCenter,previousCenter;uniform float historyByte,historyFrame,foamSpan,previousSpan,foamDt,foamReady;varying vec2 uvP;
 float floorDepth(vec2 p){vec2 rg=texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).rg;return -16.+dot(rg,vec2(256.,1.))/257.*100.;}
 void main(){vec2 p=(uvP-.5)*foamSpan+foamCenter;vec2 drift=vec2(cos(windDir),sin(windDir))*.4*wind;vec2 oldUV=(p-drift*foamDt-previousCenter)/previousSpan+.5;
 float inside=step(0.,oldUV.x)*step(oldUV.x,1.)*step(0.,oldUV.y)*step(oldUV.y,1.);vec2 old=texture2D(previousFoam,oldUV).rg*inside*foamReady;
 vec2 beachUV=(p-previousCenter)/previousSpan+.5;
 float beachInside=step(0.,beachUV.x)*step(beachUV.x,1.)*step(0.,beachUV.y)*step(beachUV.y,1.);
 vec2 oldBeach=texture2D(previousFoam,beachUV).ba*beachInside*foamReady;
 float amp=windAmp*fetchAt(p);vec3 surface=waveSurface(p,amp);float h=surface.x;
 vec2 direction=normalize(surface.yz+vec2(.001));
 float curvature=h*2.-waveSurface(p+direction*1.5,amp).x-waveSurface(p-direction*1.5,amp).x;
 float crest=smoothstep(.006,.04,curvature)*smoothstep(.03,.09,h)*smoothstep(.6,1.,wind);
 float bottom=floorDepth(p),depth=height(p)-bottom;
 float lap=(1.-smoothstep(.05,.9,depth))*smoothstep(.0,.08,depth)*wind*.9;
 float splash=clamp(abs(rippleHeight(p))*30.,0.,1.);
 float source=max(max(crest*.45,lap),splash*.8);
 float decay=exp(-foamDt*.55),bubbleDecay=exp(-foamDt*.25);
 float density=clamp(old.r*decay+source*(1.-decay)/.55,0.,1.);
 float bubbles=clamp(old.g*bubbleDecay+source*(1.-bubbleDecay)*1.5,0.,1.);
 float wakeFoam=0.;
 for(int i=0;i<64;i++){vec4 w=wake[i];float age=time-w.z;
  if(w.w<=.02||age<0.||age>18.)continue;
  vec2 d=p-w.xy;float spread=.55+age*.65;
  if(dot(d,d)>(spread+4.)*(spread+4.))continue;
  vec2 f=vec2(sin(wakeHeading[i]),cos(wakeHeading[i]));
  float a=dot(d,f),b=dot(d,vec2(f.y,-f.x)),edge=abs(b)-spread;
  wakeFoam+=(exp(-edge*edge*3./(1.+age*.4))*.28+exp(-b*b/(.35+age*.3))*.52)*exp(-a*a/(1.8+age*.15)-age*.25)*w.w;
 }
 density=max(density,min(.95,wakeFoam*.6));bubbles=max(bubbles,min(.7,wakeFoam*.4));
 float drainage=.9+.2*sin(p.x*.18+p.y*.11)*sin(p.y*.23-p.x*.07);
 vec2 beach=wetSandStep(oldBeach,depth,foamDt,drainage);
 if(historyByte>.5){float jitter=fract(sin(dot(floor(p),vec2(12.9898,78.233))+historyFrame*1.618)*43758.5453);beach=floor(beach*255.+jitter)/255.;}
 gl_FragColor=vec4(density,bubbles,beach);}`});
 const scene=new T.Scene(),quad=new T.Mesh(new T.PlaneGeometry(2,2),material),camera=new T.Camera();scene.add(quad);let index=0,elapsed=0,frames=0,resolution=128;
 return {texture:targets[0].texture,center:u.foamCenter,span:u.foamSpan,update(dt,x,z,quality,span=240){
  if(dt<=0)return;elapsed+=dt;if(frames++%2)return;const nextSize=quality==='high'?256:quality==='medium'?160:96;
  if(nextSize!==resolution){resolution=nextSize;for(let i=0;i<2;i++){targets[i].dispose();targets[i]=new T.WebGLRenderTarget(resolution,resolution,{type:floatingHistory?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter});}u.foamReady.value=0;}
  u.previousSpan.value=u.foamSpan.value;u.foamSpan.value=span;u.previousCenter.value.copy(u.foamCenter.value);u.foamCenter.value.set(Math.floor(x/4)*4,Math.floor(z/4)*4);u.foamDt.value=Math.min(elapsed,2);elapsed=0;
  u.historyFrame.value++;u.previousFoam.value=targets[index].texture;index=1-index;const previous=renderer.getRenderTarget();renderer.setRenderTarget(targets[index]);renderer.render(scene,camera);renderer.setRenderTarget(previous);u.foamReady.value=1;this.texture=targets[index].texture;
 },reset(){u.foamReady.value=0;elapsed=0;},dispose(){targets.forEach(t=>t.dispose());material.dispose();quad.geometry.dispose();}};
}
