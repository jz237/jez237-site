import * as T from './vendor/three.module.js';
// A moving world-space foam atlas. Previous foam is reprojected and advected,
// so breaking crests leave patches which persist through subsequent troughs.
export function makeFoamField(renderer,common,uniforms){
 const targets=[0,1].map(()=>new T.WebGLRenderTarget(128,128,{type:renderer.extensions.has('EXT_color_buffer_float')?T.HalfFloatType:T.UnsignedByteType,depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter}));
 const u={...uniforms,previousFoam:{value:targets[0].texture},foamCenter:{value:new T.Vector2()},previousCenter:{value:new T.Vector2()},foamSpan:{value:240},previousSpan:{value:240},foamDt:{value:0},foamReady:{value:0}};
 const material=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,vertexShader:'varying vec2 uvP;void main(){uvP=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:common+`
 uniform sampler2D previousFoam,terrainMap;uniform vec2 foamCenter,previousCenter;uniform float foamSpan,previousSpan,foamDt,foamReady,customTerrain,terrainSpan;varying vec2 uvP;
 float floorDepth(vec2 p){vec2 rg=texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).rg;return -16.+dot(rg,vec2(256.,1.))/257.*100.;}
 void main(){vec2 p=(uvP-.5)*foamSpan+foamCenter;vec2 drift=vec2(.35,-.24)*storm;vec2 oldUV=(p-drift*foamDt-previousCenter)/previousSpan+.5;
 float inside=step(0.,oldUV.x)*step(oldUV.x,1.)*step(0.,oldUV.y)*step(oldUV.y,1.);vec2 old=texture2D(previousFoam,oldUV).rg*inside*foamReady;
 // Wet sand stays fixed to the beach, rather than drifting with surface foam.
 vec2 beachUV=(p-previousCenter)/previousSpan+.5;
 float beachInside=step(0.,beachUV.x)*step(beachUV.x,1.)*step(0.,beachUV.y)*step(beachUV.y,1.);
 float oldWet=texture2D(previousFoam,beachUV).b*beachInside*foamReady;
 vec2 q=p-swellShift(p);float h;vec2 shift,grad;mat2 J;swellAt(q,h,shift,grad,J);float compression=1.-(J[0][0]*J[1][1]-J[0][1]*J[1][0]);
 // Include the same variable surf sets that lift the hulls and rendered water.
 vec3 surface=waveSurface(p);h=surface.x;
 vec2 direction=normalize(surface.yz+vec2(.001));
 float curvature=h*2.-waveSurface(p+direction*1.5).x-waveSurface(p-direction*1.5).x;
 float crest=smoothstep(.018,.13,curvature)*smoothstep(.25,1.15,h)
  *smoothstep(.10,.32,length(surface.yz));
 crest=max(crest,smoothstep(.16,.34,compression)*storm*.35);
 float bottom=floorDepth(p),depth=height(p)-bottom;
 float breaker=customTerrain*(1.-smoothstep(.3,2.1,depth))*smoothstep(.01,.18,depth)
  *(.28+.72*smoothstep(-.1,.7,h));
 float source=max(crest*.30,breaker*1.3);
 // Analytic accumulation remains stable when rendering is throttled.
 float decay=exp(-foamDt*.55),bubbleDecay=exp(-foamDt*.2);
 float density=clamp(old.r*decay+source*(1.-decay)/.55,0.,1.);
 float bubbles=clamp(old.g*bubbleDecay+source*(1.-bubbleDecay)*1.5,0.,1.);
 // Advected Kelvin arms and aerated prop-wash, evaluated per atlas texel.
 // Each packet is born behind a real, water-loaded hull; no screen-space trail.
 float wakeFoam=0.;
 for(int i=0;i<64;i++){vec4 w=wake[i];float age=time-w.z;
  if(w.w<=.02||age<0.||age>18.)continue;
  vec2 d=p-w.xy-vec2(.16,-.11)*storm*age;float spread=.55+age*.65;
  if(dot(d,d)>(spread+4.)*(spread+4.))continue;
  vec2 f=vec2(sin(wakeHeading[i]),cos(wakeHeading[i]));
  float a=dot(d,f),b=dot(d,vec2(f.y,-f.x)),edge=abs(b)-spread;
  wakeFoam+=(exp(-edge*edge*3./(1.+age*.4))*.28+exp(-b*b/(.35+age*.3))*.52)
    *exp(-a*a/(1.8+age*.15)-age*.25)*w.w;
 }
 density=max(density,min(.95,wakeFoam));bubbles=max(bubbles,min(.7,wakeFoam*.55));
 float inundated=customTerrain*smoothstep(-.06,.15,depth);
 float wet=max(oldWet*exp(-foamDt*.045),inundated);
 gl_FragColor=vec4(density,bubbles,wet,1.);}`});
 const scene=new T.Scene(),quad=new T.Mesh(new T.PlaneGeometry(2,2),material),camera=new T.Camera();scene.add(quad);let index=0,elapsed=0,frames=0,resolution=128;
 return {texture:targets[0].texture,center:u.foamCenter,span:u.foamSpan,update(dt,x,z,quality,span=240){
  if(dt<=0)return;elapsed+=dt;if(frames++%2)return;const nextSize=quality==='high'?256:quality==='medium'?160:96;
  if(nextSize!==resolution){resolution=nextSize;targets.forEach(t=>t.setSize(resolution,resolution));u.foamReady.value=0;}
  u.previousSpan.value=u.foamSpan.value;u.foamSpan.value=span;u.previousCenter.value.copy(u.foamCenter.value);u.foamCenter.value.set(Math.floor(x/4)*4,Math.floor(z/4)*4);u.foamDt.value=Math.min(elapsed,1);elapsed=0;
  u.previousFoam.value=targets[index].texture;index=1-index;const previous=renderer.getRenderTarget();renderer.setRenderTarget(targets[index]);renderer.render(scene,camera);renderer.setRenderTarget(previous);u.foamReady.value=1;this.texture=targets[index].texture;
 },reset(){u.foamReady.value=0;elapsed=0;},dispose(){targets.forEach(t=>t.dispose());material.dispose();quad.geometry.dispose();}};
}
