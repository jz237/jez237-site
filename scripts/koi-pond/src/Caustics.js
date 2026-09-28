// Authored moving interference patterns, shared by the floor and fish materials.
export const causticGLSL=`
vec2 cellHash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float causticLight(vec2 p,float t){
 p=p*2.55+vec2(sin(p.y*3.7+t*.47)+sin(p.x*2.3-t*.27)*.35,cos(p.x*3.1-t*.38)+sin(p.y*2.5+t*.31)*.35)*.38;
 vec2 cell=floor(p),f=fract(p);float first=8.,second=8.;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
  vec2 g=vec2(float(x),float(y)),h=cellHash(cell+g);
  vec2 q=g+.5+.36*sin(t*.53+h*6.283)-f;float d=dot(q,q);
  if(d<first){second=first;first=d;}else second=min(second,d);
 }
 float edge=sqrt(second)-sqrt(first);
 float shimmer=.58+.42*sin(p.x*1.3+p.y*.71+t*.67);
 return (exp(-edge*27.)*.94+exp(-edge*7.)*.13)*shimmer;
}`;
export function addCaustics(material,clock,strength=.34){
 const prior=material.onBeforeCompile;
 material.onBeforeCompile=function(s,...args){prior.call(this,s,...args);s.uniforms.pondClock=clock;
 s.vertexShader='varying vec3 causticWorld;\n'+s.vertexShader;
 s.vertexShader=s.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 cp=vec4(transformed,1.);\n#ifdef USE_INSTANCING\ncp=instanceMatrix*cp;\n#endif\ncausticWorld=(modelMatrix*cp).xyz;');
 s.fragmentShader='varying vec3 causticWorld;uniform float pondClock;\n'+causticGLSL+'\n'+s.fragmentShader;
 s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`float wet=1.-smoothstep(-.04,.03,causticWorld.y);float caustic=causticLight(causticWorld.xz,pondClock);outgoingLight*=1.+wet*caustic*${strength.toFixed(3)};\n#include <opaque_fragment>`);
 };
 const oldKey=material.customProgramCacheKey.bind(material);const key=oldKey();material.customProgramCacheKey=()=>key+'-pond-caustics-'+strength;
}
