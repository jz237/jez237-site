// The depth-of-field pass: the frame is drawn into a colour target with a depth texture, then a
// single gather pass blurs each pixel over a Poisson disc scaled by its circle of confusion, with
// taps weighted down when they are sharper than the centre so an in-focus fish does not smear over
// the soft cove behind it. Tone mapping and the output colour space are applied here, since Three
// leaves both off when it renders into a target.
import * as T from './vendor/three.module.js';
import {dofFor,gradeFor} from './dof-model.js';
const POISSON=[[-.613,-.236],[.170,-.836],[-.299,.649],[.818,.184],[-.878,.239],[.464,.663],[.083,.275],[-.415,-.777],[.726,-.515],[-.129,-.478],[.377,-.158],[-.716,.592],[.104,.921],[-.026,-.981],[.985,-.108],[-.462,.111],[.609,.452],[-.223,.317],[.294,.081],[-.957,-.219],[.502,-.837],[-.586,-.532],[.161,.577],[.784,.593]];
export function makeDoF(renderer){
 const size=new T.Vector2();renderer.getDrawingBufferSize(size);const floating=renderer.extensions.has('EXT_color_buffer_float');
 const rt=new T.WebGLRenderTarget(size.x,size.y,{depthBuffer:true,type:floating?T.HalfFloatType:T.UnsignedByteType});rt.depthTexture=new T.DepthTexture(size.x,size.y);
 const u={tColor:{value:rt.texture},tDepth:{value:rt.depthTexture},texel:{value:new T.Vector2(1/size.x,1/size.y)},near:{value:.1},far:{value:100},focus:{value:1},aperture:{value:0},maxCoc:{value:0},range:{value:0},sat:{value:1},contrast:{value:1},split:{value:0},vignette:{value:0},warm:{value:new T.Vector3(1,.86,.62)},cool:{value:new T.Vector3(.55,.6,.9)}};
 const taps=POISSON.map(p=>`vec2(${p[0]},${p[1]})`).join(',');
 const mat=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,defines:{TAPS:24},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`#include <packing>
uniform sampler2D tColor,tDepth;uniform vec2 texel;uniform float near,far,focus,aperture,maxCoc,range,sat,contrast,split,vignette;uniform vec3 warm,cool;varying vec2 vUv;
const vec2 P[24]=vec2[24](${taps});
float viewDist(vec2 uv){return -perspectiveDepthToViewZ(texture2D(tDepth,uv).r,near,far);}
float coc(float d){return clamp(aperture*max(0.,abs(d-focus)-range*focus)/max(d,1e-3),0.,maxCoc);}
void main(){
 float cc=coc(viewDist(vUv));vec3 c=texture2D(tColor,vUv).rgb;
 if(cc>.6){float w=1.;for(int i=0;i<TAPS;i++){vec2 uv=vUv+P[i]*cc*texel;float wt=clamp(coc(viewDist(uv))/cc,0.,1.);c+=texture2D(tColor,uv).rgb*wt;w+=wt;}c/=w;}
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
 const quad=new T.Scene();quad.add(new T.Mesh(new T.PlaneGeometry(2,2),mat));const cam=new T.Camera();
 return {rt,
  plan(view,opts){return dofFor(view,opts);},
  gradeOnly(opts){const g=gradeFor(opts);return g?{view:'grade',focus:1,aperture:0,maxCoc:0,range:0,taps:4,grade:g}:null;},
  // after the scene has been drawn into rt (and any overlays on top of it): blur to the screen
  finish(camera,p){u.near.value=camera.near;u.far.value=camera.far;u.focus.value=p.focus;u.aperture.value=p.aperture;u.maxCoc.value=p.maxCoc;u.range.value=p.range||0;const g=p.grade;u.sat.value=g?g.sat:1;u.contrast.value=g?g.contrast:1;u.split.value=g?g.split:0;u.vignette.value=g?g.vignette:0;if(g){u.warm.value.set(...g.warm);u.cool.value.set(...g.cool);}
   const t=Math.max(4,Math.min(24,p.taps|0));if(mat.defines.TAPS!==t){mat.defines.TAPS=t;mat.needsUpdate=true;}
   renderer.setRenderTarget(null);renderer.render(quad,cam);},
  resize(){renderer.getDrawingBufferSize(size);rt.setSize(size.x,size.y);u.texel.value.set(1/size.x,1/size.y);},
  size(){return [size.x,size.y];}};
}
