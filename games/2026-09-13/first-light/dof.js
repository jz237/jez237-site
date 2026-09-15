// The post pass: the frame is drawn into a colour target with a depth texture, then (1) the glow,
// a bright pass blurred at quarter resolution so the low sun bleeds over the tree line the way it
// does in a photograph, plus crepuscular rays: the sky's brightness radially smeared toward the
// sun's screen position, occluded by everything that is not sky (the trees), and (2) a single
// gather pass that blurs each pixel over a Poisson disc scaled by its circle of confusion, with
// taps weighted down when they are sharper than the centre so an in-focus fish does not smear over
// the soft cove behind it. Tone mapping, the grade and the output colour space are applied here,
// since Three leaves tone mapping off when it renders into a target.
import * as T from './vendor/three.module.js';
import {dofFor,gradeFor,glowFor} from './dof-model.js';
const POISSON=[[-.613,-.236],[.170,-.836],[-.299,.649],[.818,.184],[-.878,.239],[.464,.663],[.083,.275],[-.415,-.777],[.726,-.515],[-.129,-.478],[.377,-.158],[-.716,.592],[.104,.921],[-.026,-.981],[.985,-.108],[-.462,.111],[.609,.452],[-.223,.317],[.294,.081],[-.957,-.219],[.502,-.837],[-.586,-.532],[.161,.577],[.784,.593]];
const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
export function makeDoF(renderer){
 const size=new T.Vector2();renderer.getDrawingBufferSize(size);const floating=renderer.extensions.has('EXT_color_buffer_float');
 const rt=new T.WebGLRenderTarget(size.x,size.y,{depthBuffer:true,type:floating?T.HalfFloatType:T.UnsignedByteType});rt.depthTexture=new T.DepthTexture(size.x,size.y);
 // quarter-resolution glow targets: bright pass / blur ping-pong, and the rays
 const q=new T.Vector2();const qsize=()=>q.set(Math.max(64,size.x>>2),Math.max(36,size.y>>2));qsize();
 const mk=()=>new T.WebGLRenderTarget(q.x,q.y,{depthBuffer:false,type:rt.texture.type,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
 const bA=mk(),bB=mk(),sA=mk();
 const black=new T.DataTexture(new Uint8Array([0,0,0,255]),1,1);black.needsUpdate=true;
 const u={tColor:{value:rt.texture},tDepth:{value:rt.depthTexture},tBloom:{value:black},tShaft:{value:black},texel:{value:new T.Vector2(1/size.x,1/size.y)},near:{value:.1},far:{value:100},focus:{value:1},aperture:{value:0},maxCoc:{value:0},range:{value:0},sat:{value:1},contrast:{value:1},split:{value:0},vignette:{value:0},warm:{value:new T.Vector3(1,.86,.62)},cool:{value:new T.Vector3(.55,.6,.9)},bloom:{value:0},shaft:{value:0},shaftTint:{value:new T.Vector3(1,.7,.45)},glowDebug:{value:0},mist:{value:0},mistHeight:{value:2.2},mistColor:{value:new T.Vector3(.8,.78,.82)},mistTime:{value:0},camPos:{value:new T.Vector3()},invViewProj:{value:new T.Matrix4()}};
 const taps=POISSON.map(p=>`vec2(${p[0]},${p[1]})`).join(',');
 const mat=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,defines:{TAPS:24},vertexShader:VS,fragmentShader:`#include <packing>
uniform sampler2D tColor,tDepth,tBloom,tShaft;uniform vec2 texel;uniform float near,far,focus,aperture,maxCoc,range,sat,contrast,split,vignette,bloom,shaft,glowDebug,mist,mistHeight,mistTime;uniform vec3 warm,cool,shaftTint,mistColor,camPos;uniform mat4 invViewProj;varying vec2 vUv;
// the world point behind a pixel, from the depth buffer
vec3 worldAt(vec2 uv,float depth){vec4 h=invViewProj*vec4(uv*2.-1.,depth*2.-1.,1.);return h.xyz/h.w;}
float hash13(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float vnoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 float a=mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x),mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y),f.z);return a;}
const vec2 P[24]=vec2[24](${taps});
float viewDist(vec2 uv){return -perspectiveDepthToViewZ(texture2D(tDepth,uv).r,near,far);}
float coc(float d){return clamp(aperture*max(0.,abs(d-focus)-range*focus)/max(d,1e-3),0.,maxCoc);}
void main(){
 float cc=coc(viewDist(vUv));vec3 c=texture2D(tColor,vUv).rgb;
 if(cc>.6){float w=1.;for(int i=0;i<TAPS;i++){vec2 uv=vUv+P[i]*cc*texel;float wt=clamp(coc(viewDist(uv))/cc,0.,1.);c+=texture2D(tColor,uv).rgb*wt;w+=wt;}c/=w;}
 // the glow, added in linear light before tone mapping so it rolls off like an over-exposed film edge
 // the mist as a volume: the height fog between the eye and whatever the pixel shows, integrated
 // analytically and broken into wisps by a drifting noise, so it fills the gaps between the trees and
 // thickens along a long sight line instead of hanging as a flat sheet
 if(mist>0.){float dep=texture2D(tDepth,vUv).r;
  vec3 w=worldAt(vUv,min(dep,.99995));vec3 ray=w-camPos;float len=min(length(ray),420.);
  vec3 dir=ray/max(length(ray),1e-4);
  float y0=camPos.y,y1=camPos.y+dir.y*len;
  // integral of exp(-y/H) along the ray, in closed form
  float H=max(.4,mistHeight);
  float dy=(y1-y0);
  float integral=abs(dy)<1e-3?len*exp(-max(y0,0.)/H)
                             :len*H/dy*(exp(-max(y0,0.)/H)-exp(-max(y1,0.)/H));
  vec3 mid=camPos+dir*(len*.5);
  float wisp=vnoise(vec3(mid.x*.045+mistTime*.02,mid.y*.22,mid.z*.045))*.8+vnoise(vec3(mid.x*.12,mid.y*.5,mid.z*.12+mistTime*.05))*.4;
  float amount=clamp(integral*mist*(.45+wisp),0.,.92);
  c=mix(c,mistColor,amount);}
 c+=texture2D(tBloom,vUv).rgb*bloom+texture2D(tShaft,vUv).rgb*shaftTint*shaft;
 if(glowDebug>.5)c=glowDebug<1.5?texture2D(tBloom,vUv).rgb*bloom:texture2D(tShaft,vUv).rgb*shaftTint*shaft*4.;
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 // the grade, on the tonemapped frame: saturation, contrast about mid grey, split tone, vignette
 {vec3 g=gl_FragColor.rgb;float l=dot(g,vec3(.2126,.7152,.0722));g=mix(vec3(l),g,sat);
  // contrast about mid grey, but the darks keep their footing: below a quarter luminance the curve fades out, so a pre-dawn lake is dim, never crushed to black
  g=mix(g,(g-.5)*contrast+.5,smoothstep(0.,.25,l));
  float hl=smoothstep(.35,.85,l),sh=1.-smoothstep(.1,.55,l);g=mix(g,g*warm,split*hl*.6);g=mix(g,g*cool,split*sh*.5);
  vec2 v=vUv-.5;g*=1.-vignette*dot(v,v)*1.2;gl_FragColor.rgb=clamp(g,0.,1.);}
 #include <colorspace_fragment>
}`});
 // bright pass: everything above the threshold, with a soft knee; the sun disc and its aureole, glints, the moon
 const bu={tColor:{value:rt.texture},threshold:{value:.8},knee:{value:.4}};
 const bright=new T.ShaderMaterial({uniforms:bu,depthTest:false,depthWrite:false,vertexShader:VS,fragmentShader:`uniform sampler2D tColor;uniform float threshold,knee;varying vec2 vUv;
void main(){vec3 c=texture2D(tColor,vUv).rgb;float l=max(c.r,max(c.g,c.b));float k=knee*threshold;float soft=clamp(l-threshold+k,0.,2.*k);soft=soft*soft/(4.*k+1e-4);float w=max(soft,l-threshold)/max(l,1e-4);gl_FragColor=vec4(c*w,1.);}`});
 // separable blur, 9 taps, run twice at growing radius for a wide soft glow
 const ku={tex:{value:null},dir:{value:new T.Vector2(1,0)}};
 const blur=new T.ShaderMaterial({uniforms:ku,depthTest:false,depthWrite:false,vertexShader:VS,fragmentShader:`uniform sampler2D tex;uniform vec2 dir;varying vec2 vUv;
void main(){vec3 c=texture2D(tex,vUv).rgb*.227;c+=(texture2D(tex,vUv+dir*1.385).rgb+texture2D(tex,vUv-dir*1.385).rgb)*.316;c+=(texture2D(tex,vUv+dir*3.231).rgb+texture2D(tex,vUv-dir*3.231).rgb)*.070;c+=(texture2D(tex,vUv+dir*5.2).rgb+texture2D(tex,vUv-dir*5.2).rgb)*.012;gl_FragColor=vec4(c,1.);}`});
 // rays: march from the pixel toward the sun through the sky's brightness (depth at the far plane), so the trees on the skyline cut the beams
 const su={tColor:{value:rt.texture},tDepth:{value:rt.depthTexture},sunUV:{value:new T.Vector2(.5,.5)},decay:{value:.965},density:{value:.85},threshold:{value:.35}};
 const shaft=new T.ShaderMaterial({uniforms:su,depthTest:false,depthWrite:false,defines:{N:40},vertexShader:VS,fragmentShader:`uniform sampler2D tColor,tDepth;uniform vec2 sunUV;uniform float decay,density,threshold;varying vec2 vUv;
vec3 src(vec2 uv){if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return vec3(0.);float sky=step(.99995,texture2D(tDepth,uv).r);vec3 c=texture2D(tColor,uv).rgb;float l=dot(c,vec3(.3,.5,.2));return c*sky*smoothstep(threshold,threshold+.6,l);}
void main(){vec2 d=(vUv-sunUV)*density/float(N);vec2 uv=vUv;float illum=1.,wsum=0.;vec3 col=vec3(0.);
 for(int i=0;i<N;i++){uv-=d;col+=src(uv)*illum;wsum+=illum;illum*=decay;}
 gl_FragColor=vec4(col/max(wsum,1e-3),1.);}`});
 const quad=new T.Scene();const qm=new T.Mesh(new T.PlaneGeometry(2,2),mat);quad.add(qm);const cam=new T.Camera();
 function pass(material,target){qm.material=material;renderer.setRenderTarget(target);renderer.render(quad,cam);}
 return {rt,
  plan(view,opts){return dofFor(view,opts);},
  gradeOnly(opts){const g=gradeFor(opts);return g?{view:'grade',focus:1,aperture:0,maxCoc:0,range:0,taps:4,grade:g}:null;},
  glow(opts){return glowFor(opts);},
  // after the scene has been drawn into rt (and any overlays on top of it): the glow passes, then the gather to the screen
  // the volumetric mist needs the eye and the inverse of its view projection to unproject depth
  mistAmount(){return u.mist.value;},
  setMist({amount=0,height=2.2,colour=[.8,.78,.82],time=0}={}){u.mist.value=amount;u.mistHeight.value=height;u.mistColor.value.set(...colour);u.mistTime.value=time;},
  finish(camera,p){if(u.mist.value>0){camera.updateMatrixWorld();u.camPos.value.setFromMatrixPosition(camera.matrixWorld);u.invViewProj.value.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).invert();}u.near.value=camera.near;u.far.value=camera.far;u.focus.value=p.focus;u.aperture.value=p.aperture;u.maxCoc.value=p.maxCoc;u.range.value=p.range||0;const g=p.grade;u.sat.value=g?g.sat:1;u.contrast.value=g?g.contrast:1;u.split.value=g?g.split:0;u.vignette.value=g?g.vignette:0;if(g){u.warm.value.set(...g.warm);u.cool.value.set(...g.cool);}
   const t=Math.max(4,Math.min(24,p.taps|0));if(mat.defines.TAPS!==t){mat.defines.TAPS=t;mat.needsUpdate=true;}
   const gl=p.glow;
   // the blur step is a fraction of the frame, not of the quarter target, so the glow keeps its size on a phone's narrow frame
   const sx=1/320,sy=sx*q.x/q.y;
   if(gl&&gl.bloom>0){bu.threshold.value=gl.threshold;pass(bright,bA);ku.dir.value.set(sx,0);ku.tex.value=bA.texture;pass(blur,bB);ku.dir.value.set(0,sy);ku.tex.value=bB.texture;pass(blur,bA);
    if(gl.wide){ku.dir.value.set(2.6*sx,0);ku.tex.value=bA.texture;pass(blur,bB);ku.dir.value.set(0,2.6*sy);ku.tex.value=bB.texture;pass(blur,bA);}
    u.tBloom.value=bA.texture;u.bloom.value=gl.bloom;}else{u.tBloom.value=black;u.bloom.value=0;}
   if(gl&&gl.shaft>0&&gl.sunUV){su.sunUV.value.set(gl.sunUV[0],gl.sunUV[1]);su.decay.value=gl.decay;su.density.value=gl.density;su.threshold.value=gl.shaftThreshold;if(shaft.defines.N!==gl.samples){shaft.defines.N=gl.samples;shaft.needsUpdate=true;}pass(shaft,sA);u.tShaft.value=sA.texture;u.shaft.value=gl.shaft;u.shaftTint.value.set(...gl.tint);}else{u.tShaft.value=black;u.shaft.value=0;}
   qm.material=mat;renderer.setRenderTarget(null);renderer.render(quad,cam);},
  // multisampling into the colour target: the canvas's own antialiasing only ever touched the
  // full-screen quad, so until now the scene itself was unaliased. Ultra resolves 4 samples.
  setSamples(n){const want=Math.max(0,n|0);if(rt.samples===want)return rt.samples;rt.samples=want;rt.dispose();return rt.samples;},
  samples(){return rt.samples;},
  resize(){renderer.getDrawingBufferSize(size);rt.setSize(size.x,size.y);u.texel.value.set(1/size.x,1/size.y);qsize();bA.setSize(q.x,q.y);bB.setSize(q.x,q.y);sA.setSize(q.x,q.y);},
  size(){return [size.x,size.y];},
  glowSize(){return [q.x,q.y];},
  // 0 the frame, 1 the bloom buffer alone, 2 the rays alone (×4): for probes
  setDebug(v){u.glowDebug.value=v|0;}};
}
