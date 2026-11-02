// Triplanar procedural terrain material (MeshStandardMaterial + onBeforeCompile).
import * as THREE from 'three';
import {getDetailTexture} from './noise.mjs';

const lin=c=>new THREE.Color(c);

export function terrainMaterial(theme,opts={}){
  const industrial=theme.kind==='industrial'||opts.industrial;
  const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:industrial?.55:0,vertexColors:true,flatShading:false});
  const u={
    uDetail:{value:getDetailTexture()},uTime:{value:0},
    uRockBase:{value:lin(opts.base||theme.rock.base)},uRockDark:{value:lin(theme.rock.dark)},uRockLight:{value:lin(theme.rock.light)},
    uTop:{value:lin(opts.top||theme.top.color)},uTopRough:{value:theme.top.rough},uStrata:{value:opts.strata??theme.rock.strata},
    uWet:{value:theme.rock.wet},uCrystal:{value:lin(theme.crystal)},uVein:{value:opts.vein??(industrial?0:1)},
    uIndustrial:{value:industrial?1:0},uBump:{value:opts.bump??(industrial?1.2:2.2)},
    uWaterMask:{value:opts.waterMask||null},uHasWater:{value:opts.waterMask?1:0},uWaterTop:{value:opts.waterTop??-1e4},uLevelSize:{value:new THREE.Vector2(opts.cols||1,opts.rows||1)},
    uHeat:{value:opts.heat??(theme.key==='foundry'?1:0)},uPulse:{value:theme.key==='spire'?1:0},uAccent:{value:lin(theme.accent)}
  };
  m.userData.uniforms=u;
  m.onBeforeCompile=sh=>{
    Object.assign(sh.uniforms,u);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWPos;varying vec3 vWNormal;')
      .replace('#include <project_vertex>','#include <project_vertex>\nvWPos=(modelMatrix*vec4(transformed,1.)).xyz;vWNormal=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vWPos;varying vec3 vWNormal;
uniform sampler2D uDetail;uniform float uTime,uTopRough,uStrata,uWet,uVein,uIndustrial,uBump,uHasWater,uHeat,uPulse,uWaterTop;
uniform vec3 uRockBase,uRockDark,uRockLight,uTop,uCrystal,uAccent;uniform sampler2D uWaterMask;uniform vec2 uLevelSize;
float gH,gGrain,gWet,gVein,gUnder,gSeam,gLit;vec3 gCaus;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec4 tri4(vec3 p,vec3 w,float s){return texture2D(uDetail,p.zy*s)*w.x+texture2D(uDetail,p.xz*s)*w.y+texture2D(uDetail,p.xy*s)*w.z;}
// sharp caustic web (iterated warp), one sample per colour so the bright lines split into a faint spectrum
float caustic(vec2 p,float t){p=mod(p,6.2832)-250.;vec2 i=p;float c=1.;for(int n=0;n<4;n++){float tt=t*(1.-3.5/float(n+1));
  i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));}
  c/=4.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}
vec3 causticRGB(vec2 p,float t){return vec3(caustic(p+vec2(.035,0.),t),caustic(p,t),caustic(p-vec2(.035,0.),t));}
vec3 perturbN(vec3 sp,vec3 sn,vec2 dH,float fd){vec3 sx=normalize(dFdx(sp)),sy=normalize(dFdy(sp));vec3 r1=cross(sy,sn),r2=cross(sn,sx);float det=dot(sx,r1)*fd;vec3 g=sign(det)*(dH.x*r1+dH.y*r2);return normalize(abs(det)*sn-g);}
`).replace('#include <map_fragment>',`
vec3 wn=normalize(vWNormal);vec3 tw=pow(abs(wn),vec3(4.));tw/=dot(tw,vec3(1.));
vec4 d=tri4(vWPos,tw,1./96.);vec4 d2=tri4(vWPos,tw,1./410.);vec4 d3=tri4(vWPos,tw,1./23.);
float n=d.r,crack=d.g,grain=d3.b,broad=d2.a;gGrain=grain;
vec3 rock=mix(uRockDark,uRockBase,smoothstep(.12,.78,n*.75+broad*.55));
rock=mix(rock,uRockLight,smoothstep(.62,.98,n*.8+d3.r*.35)*.45);
// sedimentary strata: warped bands with their own tint, thin dark partings between them
float sy=(vWPos.y+broad*46.+d.r*6.)/17.;float bid=floor(sy);float bf=fract(sy);float fw=min(.5,fwidth(sy)*1.5);
vec3 bandA=mix(uRockBase,uRockLight,h21(vec2(bid,3.7))*.75)*(.78+.34*h21(vec2(bid,8.1)));
vec3 bandB=mix(uRockBase,uRockLight,h21(vec2(bid+1.,3.7))*.75)*(.78+.34*h21(vec2(bid+1.,8.1)));
vec3 bandCol=mix(bandA,bandB,smoothstep(1.-fw-.12,1.,bf));
float parting=(1.-smoothstep(0.,.07+fw,min(bf,1.-bf)))*(1.-smoothstep(.3,.5,fw));
rock=mix(rock,bandCol*(.8+n*.4),uStrata*.7);rock*=1.-uStrata*parting*.28;
rock*=1.-smoothstep(.86,.98,crack)*.3*(1.-uIndustrial);
rock*=.86+.28*smoothstep(.2,.8,broad);
float up=smoothstep(.5,.86,wn.y+(n-.5)*.4+(grain-.5)*.15);
vec3 topc=uTop*(.72+grain*.5)*(.85+broad*.3);
vec3 col=mix(rock,topc,up*(1.-uIndustrial*.55));
gH=n*.7+d3.r*.35-smoothstep(.8,1.,crack)*.4*(1.-uIndustrial)+grain*.12-uStrata*parting*.5;
gSeam=0.;gLit=0.;
if(uIndustrial>.5){
  vec2 pp=abs(wn.x)>.6?vWPos.zy:(abs(wn.y)>.6?vWPos.xz:vWPos.xy);
  vec2 cs=vec2(40.,20.);vec2 f=fract(pp/cs);vec2 e=min(f,1.-f)*cs;float seam=1.-smoothstep(.4,1.6,min(e.x,e.y));
  vec2 rv=fract(pp/cs+.5);float rivet=1.-smoothstep(1.,1.8,length((rv-.5)*cs-vec2(cs.x*.42,cs.y*.36)));
  float panel=h21(floor(pp/cs));col*=.82+panel*.3;col*=1.-seam*.6;col+=rivet*.08;
  gH=gH*.25-seam*1.2+rivet*.6;gSeam=seam;
  if(vWPos.z<-240.){vec2 cid=floor(pp/cs);gLit=step(.975,h21(cid+7.3))*(1.-seam)*smoothstep(.0,.35,min(min(f.x,1.-f.x),min(f.y,1.-f.y)))*(.7+.3*sin(uTime*(2.+h21(cid)*5.)+cid.x));}
  float grime=smoothstep(.3,.9,broad+d.r*.4);col=mix(col,col*.55,grime*.5);
}
gVein=uVein*smoothstep(.9,.985,crack)*smoothstep(.68,.9,broad)*(1.-up);
gWet=uWet*(.35+.65*up);
gUnder=0.;gCaus=vec3(0.);
if(uHasWater>.5){vec3 sp=vWPos+wn*3.;vec2 tc=vec2(sp.x/20.,-sp.y/20.);float wm=texture2D(uWaterMask,(floor(tc)+.5)/uLevelSize).r;
  float wa=texture2D(uWaterMask,(floor(tc-vec2(0.,1.))+.5)/uLevelSize).r;gUnder=max(wm,wa*smoothstep(4.,0.,fract(tc.y)*20.));
  if(gUnder>.01){float dep=max(0.,uWaterTop-vWPos.y);gCaus=causticRGB(vWPos.xz*.028+vec2(vWPos.y*.009,0.),uTime*.55)*gUnder*exp(-dep*.009)*(.35+.65*max(0.,wn.y));}col*=mix(vec3(1.),vec3(.82,.93,.95),gUnder);gWet=max(gWet,gUnder);}
diffuseColor.rgb*=col;
`).replace('#include <roughnessmap_fragment>',`float roughnessFactor=roughness*(.75+gGrain*.45);roughnessFactor=mix(roughnessFactor,uTopRough,0.);roughnessFactor=mix(roughnessFactor,.42,gWet);roughnessFactor=mix(roughnessFactor,.35,gSeam*uIndustrial);`)
    .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
normal=perturbN(-vViewPosition,normal,vec2(dFdx(gH),dFdy(gH))*uBump*(1.-.75*smoothstep(350.,1100.,length(vViewPosition))),faceDirection);`)
    .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
float pulse=.75+.25*sin(uTime*2.2+vWPos.x*.031+vWPos.y*.05);
totalEmissiveRadiance+=uCrystal*gVein*1.1*pulse;
totalEmissiveRadiance+=vec3(.55,1.,1.)*gCaus*1.1;
totalEmissiveRadiance+=uAccent*gLit*.7;
if(uPulse>.5){float vv=smoothstep(.9,.985,d.g)*smoothstep(.6,.85,d2.a);totalEmissiveRadiance+=uAccent*vv*(.6+.6*sin(uTime*3.+vWPos.x*.02))*1.4;}
if(uHeat>.5){float glow=smoothstep(-150.,-430.,vWPos.y)*0.;totalEmissiveRadiance+=vec3(1.,.35,.08)*glow;}`);
  };
  m.customProgramCacheKey=()=>'terrain-'+(industrial?'i':'o')+(opts.waterMask?'w':'');
  return m;
}

// Glowing crystal material shared by shards, spikes and veins.
export function crystalMaterial(color,intensity=2.2,opts={}){
  const c=new THREE.Color(color);
  const m=new THREE.MeshPhysicalMaterial({color:c.clone().multiplyScalar(.32),emissive:c,emissiveIntensity:intensity*.55,roughness:.1,metalness:.1,
    clearcoat:1,clearcoatRoughness:.06,transparent:!!opts.transparent,opacity:opts.opacity??1,flatShading:true,envMapIntensity:1.1,iridescence:.5,iridescenceIOR:1.4});
  // facets glow at grazing angles and towards the tip, so shards read as lit crystal, not flat cards
  m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vLy;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLy=position.y;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vLy;').replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
      float fres=pow(max(1.-abs(dot(normalize(normal),normalize(vViewPosition))),0.),2.2);float tip=smoothstep(.5,1.,vLy);
      totalEmissiveRadiance*=.14+fres*1.35+tip*.85;`);};
  m.customProgramCacheKey=()=>'crystal';
  return m;
}
