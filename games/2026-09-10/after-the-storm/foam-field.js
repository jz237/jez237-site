import * as T from './vendor/three.module.js';
// A moving world-space foam atlas. Previous foam is reprojected and advected,
// so breaking crests leave patches which persist through subsequent troughs.
export function makeFoamField(renderer,common,uniforms){
 const targets=[0,1].map(()=>new T.WebGLRenderTarget(128,128,{depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter}));
 const u={...uniforms,previousFoam:{value:targets[0].texture},foamCenter:{value:new T.Vector2()},previousCenter:{value:new T.Vector2()},foamSpan:{value:240},previousSpan:{value:240},foamDt:{value:0},foamReady:{value:0}};
 const material=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,vertexShader:'varying vec2 uvP;void main(){uvP=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:common+`
 uniform sampler2D previousFoam,terrainMap;uniform vec2 foamCenter,previousCenter;uniform float foamSpan,previousSpan,foamDt,foamReady,customTerrain,terrainSpan;varying vec2 uvP;
 float floorDepth(vec2 p){vec2 rg=texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).rg;return -16.+dot(rg,vec2(256.,1.))/257.*100.;}
 void main(){vec2 p=(uvP-.5)*foamSpan+foamCenter;vec2 drift=vec2(.35,-.24)*storm;vec2 oldUV=(p-drift*foamDt-previousCenter)/previousSpan+.5;
 float inside=step(0.,oldUV.x)*step(oldUV.x,1.)*step(0.,oldUV.y)*step(oldUV.y,1.);vec2 old=texture2D(previousFoam,oldUV).rg*inside*foamReady;
 vec2 q=p-swellShift(p);float h;vec2 shift,grad;mat2 J;swellAt(q,h,shift,grad,J);float compression=1.-(J[0][0]*J[1][1]-J[0][1]*J[1][0]);
 float crest=smoothstep(.16,.34,compression)*smoothstep(.12,.7,storm);
 float bottom=floorDepth(p),depth=seaLevel+h-bottom;
 float breaker=customTerrain*(1.-smoothstep(.4,2.3,depth))*smoothstep(.02,.35,depth)*smoothstep(.03,.6,h)*(0.25+storm*.75);
 float source=max(crest*.25,breaker*1.25);float density=clamp(old.r*exp(-foamDt*.4)+source*foamDt,0.,1.);
 float bubbles=clamp(old.g*exp(-foamDt*.16)+source*foamDt*.3,0.,1.);gl_FragColor=vec4(density,bubbles,0.,1.);}`});
 const scene=new T.Scene(),quad=new T.Mesh(new T.PlaneGeometry(2,2),material),camera=new T.Camera();scene.add(quad);let index=0,elapsed=0,frames=0,resolution=128;
 return {texture:targets[0].texture,center:u.foamCenter,span:u.foamSpan,update(dt,x,z,quality,span=240){
  if(dt<=0)return;elapsed+=dt;if(frames++%2)return;const nextSize=quality==='high'?128:quality==='medium'?96:64;
  if(nextSize!==resolution){resolution=nextSize;targets.forEach(t=>t.setSize(resolution,resolution));u.foamReady.value=0;}
  u.previousSpan.value=u.foamSpan.value;u.foamSpan.value=span;u.previousCenter.value.copy(u.foamCenter.value);u.foamCenter.value.set(Math.floor(x/4)*4,Math.floor(z/4)*4);u.foamDt.value=Math.min(elapsed,.15);elapsed=0;
  u.previousFoam.value=targets[index].texture;index=1-index;const previous=renderer.getRenderTarget();renderer.setRenderTarget(targets[index]);renderer.render(scene,camera);renderer.setRenderTarget(previous);u.foamReady.value=1;this.texture=targets[index].texture;
 },reset(){u.foamReady.value=0;elapsed=0;},dispose(){targets.forEach(t=>t.dispose());material.dispose();quad.geometry.dispose();}};
}
