// A procedural sky driven by the real sun: a horizon-to-zenith gradient whose palette follows the
// sun's elevation through night, dawn, day and dusk; a sun disc and glow; two drifting cloud layers
// lit from the sun's side; stars after dark. The same palette feeds the lights, fog and the water's
// sky fallback so everything agrees about the hour.
import * as T from './vendor/three.module.js';
import {shared,skyColors} from './lake-surface.js';
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x);};
const mix3=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const DAY={z:[.15,.34,.74],h:[.52,.68,.86]},GOLD={z:[.22,.34,.60],h:[.98,.68,.42]},DUSK={z:[.09,.12,.30],h:[.72,.40,.36]},NIGHT={z:[.008,.012,.032],h:[.030,.040,.070]};
// Palette for a sun elevation in degrees. Values are linear light.
export function skyPalette(e,cloud=0){
 let z,h;
 if(e>=25){z=DAY.z;h=DAY.h;}else if(e>=5){const t=smooth(5,25,e);z=mix3(GOLD.z,DAY.z,t);h=mix3(GOLD.h,DAY.h,t);}
 else if(e>=-4){const t=smooth(-4,5,e);z=mix3(DUSK.z,GOLD.z,t);h=mix3(DUSK.h,GOLD.h,t);}
 else{const t=smooth(-13,-4,e);z=mix3(NIGHT.z,DUSK.z,t);h=mix3(NIGHT.h,DUSK.h,t);}
 const night=1-smooth(-13,-2,e),overcast=cloud*.55;
 z=mix3(z,[.55*z[0]+.12,.55*z[1]+.12,.55*z[2]+.12],overcast);h=mix3(h,[.6*h[0]+.15,.6*h[1]+.15,.6*h[2]+.15],overcast);
 const warm=1-smooth(0,22,e);
 const sunColor=mix3([1,.93,.84],[1,.52,.26],warm);
 const sunIntensity=3.1*Math.pow(clamp((e+1.5)/14,0,1),.75)*(1-cloud*.75);
 const ambientIntensity=lerp(.14,1.15,smooth(-9,18,e))*(1-cloud*.25);
 const fog=mix3(h,[.82,.84,.80],warm*.25*(1-night));
 return {zenith:z,horizon:h,night,sunColor,sunIntensity,ambientIntensity,fogColor:fog,fogDensity:lerp(.0012,.0030,cloud)*(1+night*.4)};
}
export function makeSky(scene){
 const u={...shared,...skyColors,cloud:{value:.2},sunElevation:{value:20}};
 const mat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:u,vertexShader:`varying vec3 dir;void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform float time,wind,windDir,night,cloud,sunElevation;uniform vec3 skyHorizon,skyZenith,sun,sunColor;varying vec3 dir;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}float fbm(vec2 p){return noise(p)*.5+noise(p*2.03)*.25+noise(p*4.07)*.125+noise(p*8.1)*.0625;}
void main(){vec3 d=normalize(dir);float y=max(d.y,0.);float s=max(0.,dot(d,sun));
 vec3 col=mix(skyHorizon,skyZenith,pow(y,.55));
 float low=1.-clamp(sunElevation/25.,0.,1.);float up=step(-.02,sun.y);
 col+=sunColor*(pow(s,6.)*(.10+.30*low)+pow(s,70.)*.30*low)*(1.-night)*up;
 col+=sunColor*pow(s,1400.)*4.*up*(1.-cloud*.8);
 vec2 flow=vec2(cos(windDir),sin(windDir))*time*(.003+wind*.018);
 vec2 p=d.xz/(y+.16)*1.7+flow;float n=fbm(p),n2=fbm(p*.47+flow*.5+11.);
 float cover=smoothstep(.64-cloud*.46,.84-cloud*.32,n*.7+n2*.3)*smoothstep(.0,.10,y);
 float lit=clamp(.45+.55*dot(normalize(vec3(d.x,.35,d.z)),normalize(vec3(sun.x,max(sun.y,.05),sun.z))),0.,1.);
 vec3 cloudLit=mix(vec3(.96,.96,.95),sunColor,low*.75),cloudShade=mix(vec3(.58,.62,.70),vec3(.24,.27,.33),cloud);
 vec3 cloudColor=mix(cloudShade,cloudLit,lit*(1.-cloud*.45))*(1.-night*.92);
 col=mix(col,cloudColor,cover*.93);
 vec3 sd=floor(d*260.);float star=step(.9972,hash(sd.xy*1.7+sd.z*3.1))*night*(1.-cover);col+=vec3(.9,.92,1.)*star*smoothstep(.02,.25,y);
 col=mix(col,skyHorizon,(1.-smoothstep(0.,.14,y))*.55);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`});
 const sky=new T.Mesh(new T.SphereGeometry(1200,40,24),mat);sky.userData.skipReflection=false;scene.add(sky);
 return {mesh:sky,uniforms:u,
  apply(palette,sunDir,elevation,cloud){u.cloud.value=cloud;u.sunElevation.value=elevation;skyColors.night.value=palette.night;skyColors.skyHorizon.value.setRGB(...palette.horizon);skyColors.skyZenith.value.setRGB(...palette.zenith);skyColors.sun.value.set(sunDir.x,sunDir.y,sunDir.z).normalize();skyColors.sunColor.value.setRGB(...palette.sunColor);skyColors.fogColor.value.setRGB(...palette.fogColor);skyColors.fogDensity.value=palette.fogDensity;}
 };
}
