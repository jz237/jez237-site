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
 const u={tColor:{value:rt.texture},tDepth:{value:rt.depthTexture},tBloom:{value:black},tShaft:{value:black},texel:{value:new T.Vector2(1/size.x,1/size.y)},near:{value:.1},far:{value:100},focus:{value:1},aperture:{value:0},maxCoc:{value:0},range:{value:0},sat:{value:1},contrast:{value:1},split:{value:0},vignette:{value:0},warm:{value:new T.Vector3(1,.86,.62)},cool:{value:new T.Vector3(.55,.6,.9)},bloom:{value:0},shaft:{value:0},shaftTint:{value:new T.Vector3(1,.7,.45)}};
 const taps=POISSON.map(p=>`vec2(${p[0]},${p[1]})`).join(',');
 const mat=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,defines:{TAPS:24},vertexShader:VS,fragmentShader:`#include <packing>
uniform sampler2D tColor,tDepth,tBloom,tShaft;uniform vec2 texel;uniform float near,far,focus,aperture,maxCoc,range,sat,contrast,split,vignette,bloom,shaft;uniform vec3 warm,cool,shaftTint;varying vec2 vUv;
const vec2 P[24]=vec2[24](${taps});
float viewDist(vec2 uv){return -perspectiveDepthToViewZ(texture2D(tDepth,uv).r,near,far);}
float coc(float d){return clamp(aperture*max(0.,abs(d-focus)-range*focus)/max(d,1e-3),0.,maxCoc);}
void main(){
 float cc=coc(viewDist(vUv));vec3 c=texture2D(tColor,vUv).rgb;
 if(cc>.6){float w=1.;for(int i=0;i<TAPS;i++){vec2 uv=vUv+P[i]*cc*texel;float wt=clamp(coc(viewDist(uv))/cc,0.,1.);c+=texture2D(tColor,uv).rgb*wt;w+=wt;}c/=w;}
 // the glow, added in linear light before tone mapping so it rolls off like an over-exposed film edge
 c+=texture2D(tBloom,vUv).rgb*bloom+texture2D(tShaft,vUv).rgb*shaftTint*shaft;
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
  finish(camera,p){u.near.value=camera.near;u.far.value=camera.far;u.focus.value=p.focus;u.aperture.value=p.aperture;u.maxCoc.value=p.maxCoc;u.range.value=p.range||0;const g=p.grade;u.sat.value=g?g.sat:1;u.contrast.value=g?g.contrast:1;u.split.value=g?g.split:0;u.vignette.value=g?g.vignette:0;if(g){u.warm.value.set(...g.warm);u.cool.value.set(...g.cool);}
   const t=Math.max(4,Math.min(24,p.taps|0));if(mat.defines.TAPS!==t){mat.defines.TAPS=t;mat.needsUpdate=true;}
   const gl=p.glow;
   if(gl&&gl.bloom>0){bu.threshold.value=gl.threshold;pass(bright,bA);ku.dir.value.set(1/q.x,0);ku.tex.value=bA.texture;pass(blur,bB);ku.dir.value.set(0,1/q.y);ku.tex.value=bB.texture;pass(blur,bA);
    if(gl.wide){ku.dir.value.set(2.6/q.x,0);ku.tex.value=bA.texture;pass(blur,bB);ku.dir.value.set(0,2.6/q.y);ku.tex.value=bB.texture;pass(blur,bA);}
    u.tBloom.value=bA.texture;u.bloom.value=gl.bloom;}else{u.tBloom.value=black;u.bloom.value=0;}
   if(gl&&gl.shaft>0&&gl.sunUV){su.sunUV.value.set(gl.sunUV[0],gl.sunUV[1]);su.decay.value=gl.decay;su.density.value=gl.density;su.threshold.value=gl.shaftThreshold;if(shaft.defines.N!==gl.samples){shaft.defines.N=gl.samples;shaft.needsUpdate=true;}pass(shaft,sA);u.tShaft.value=sA.texture;u.shaft.value=gl.shaft;u.shaftTint.value.set(...gl.tint);}else{u.tShaft.value=black;u.shaft.value=0;}
   qm.material=mat;renderer.setRenderTarget(null);renderer.render(quad,cam);},
  resize(){renderer.getDrawingBufferSize(size);rt.setSize(size.x,size.y);u.texel.value.set(1/size.x,1/size.y);qsize();bA.setSize(q.x,q.y);bB.setSize(q.x,q.y);sA.setSize(q.x,q.y);},
  size(){return [size.x,size.y];},
  glowSize(){return [q.x,q.y];}};
}
