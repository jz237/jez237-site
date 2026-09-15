// A procedural sky driven by the real sun: a horizon-to-zenith gradient whose palette follows the
// sun's elevation through night, dawn, day and dusk; a sun disc and glow; two drifting cloud layers
// lit from the sun's side; stars after dark. The same palette feeds the lights, fog and the water's
// sky fallback so everything agrees about the hour.
import * as T from './vendor/three.module.js';
import {shared,skyColors} from './lake-surface.js';
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x);};
const mix3=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
// dawn and dusk sit low and purple, as the hero art does: the warmth lives in the sun's aureole and on the sun side of the horizon, not across the whole sky
const DAY={z:[.15,.34,.74],h:[.52,.68,.86]},GOLD={z:[.15,.13,.27],h:[.58,.31,.19]},DUSK={z:[.09,.075,.19],h:[.46,.21,.21]},NIGHT={z:[.008,.012,.032],h:[.030,.040,.070]};
// Palette for a sun elevation in degrees. Values are linear light.
export function skyPalette(e,cloud=0){
 let z,h;
 if(e>=25){z=DAY.z;h=DAY.h;}else if(e>=5){const t=smooth(5,25,e);z=mix3(GOLD.z,DAY.z,t);h=mix3(GOLD.h,DAY.h,t);}
 else if(e>=-4){const t=smooth(-4,5,e);z=mix3(DUSK.z,GOLD.z,t);h=mix3(DUSK.h,GOLD.h,t);}
 else{const t=smooth(-13,-4,e);z=mix3(NIGHT.z,DUSK.z,t);h=mix3(NIGHT.h,DUSK.h,t);}
 const night=1-smooth(-13,-2,e),overcast=cloud*.55*(1-.5*(1-smooth(2,20,e)));
 z=mix3(z,[.55*z[0]+.12,.55*z[1]+.12,.55*z[2]+.12],overcast);h=mix3(h,[.6*h[0]+.15,.6*h[1]+.15,.6*h[2]+.15],overcast);
 const warm=1-smooth(0,22,e);
 const sunColor=mix3([1,.93,.84],[1,.52,.26],warm);
 const sunIntensity=3.1*Math.pow(clamp((e+1.5)/14,0,1),.75)*(1-cloud*.75);
 const ambientIntensity=lerp(.36,1.15,smooth(-9,12,e))*(1-cloud*.25); // the sky lights the shade well before the sun clears the trees: by four degrees the hemisphere is most of the way up // a floor that keeps the deck and the near water readable before sunrise
 let fog=mix3(mix3(h,[.82,.84,.80],.35*(1-night)),[.26,.38,.52],warm*.85*(1-night));
 const mist=mix3(mix3(h,[.86,.86,.84],.4*(1-night)),[.80,.62,.74],warm*.65*(1-night));
 // the pink haze that sits on the horizon while the sun is low, fading to a pale grey-blue by mid-morning
 const haze=mix3([.72,.42,.50],[.86,.88,.94],smooth(2,18,e));
 return {zenith:z,horizon:h,night,sunColor,sunIntensity,ambientIntensity,fogColor:fog,mistColor:mist,fogDensity:lerp(.0012,.0030,cloud)*(1+night*.4)*(1+1.0*(1-smooth(2,20,e))*(1-night)),haze};
}
export function makeSky(scene){
 const u={...shared,...skyColors,cloud:{value:.2},sunElevation:{value:20},hazeColor:{value:new T.Color(.95,.62,.66)},skyDebug:{value:0},envPass:{value:0}};
 const mat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:u,vertexShader:`varying vec3 dir;void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform float time,wind,windDir,night,cloud,sunElevation,skyDebug,envPass;uniform vec3 hazeColor,skyHorizon,skyZenith,sun,sunColor;varying vec3 dir;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}float fbm(vec2 p){return noise(p)*.5+noise(p*2.03)*.25+noise(p*4.07)*.125+noise(p*8.1)*.0625;}
void main(){vec3 d=normalize(dir);float y=max(d.y,0.);float s=max(0.,dot(d,sun));
 float low=1.-clamp(sunElevation/25.,0.,1.);float up=step(-.02,sun.y);float lowSun=1.-smoothstep(2.,20.,sunElevation);
 // the horizon is warm only toward the sun; away from it the low sky goes purple, as it does
 float az=.5+.5*dot(normalize(vec3(d.x,0.,d.z)+vec3(1e-4)),normalize(vec3(sun.x,0.,sun.z)+vec3(1e-4)));
 vec3 coolHorizon=mix(skyHorizon,mix(skyZenith,vec3(.30,.19,.40),.5),.72*lowSun*(1.-night));
 vec3 horizonHere=mix(coolHorizon,skyHorizon,pow(az,mix(1.6,mix(7.,12.,envPass),lowSun))*(1.-envPass*.7));
 // the horizon band is thin at first light: by fifteen degrees up the sky is already the zenith's purple
 float band=mix(pow(y,.55),smoothstep(0.,.26,y)*.85+.15*pow(y,.55),lowSun*(1.-night));band=mix(band,pow(y,.7),pow(az,10.)*.45*lowSun*(1.-night)*(1.-envPass));
 vec3 col=mix(horizonHere,skyZenith,band);vec3 c0=col;
 // during the environment capture the sun's own terms are mostly dropped: the map lights shaded faces, and a whole hemisphere painted by one aureole makes every shadow peach
 float sunTerms=1.-envPass*.85;
 col+=sunColor*(pow(s,30.)*(.10+.30*low)+pow(s,70.)*.30*low)*(1.-night)*up*sunTerms;
 // the low sun's glow: a wide warm aureole and a tighter halo, then a softer, larger disc
 col+=sunColor*(pow(s,24.)*.10+pow(s,50.)*.18+pow(s,120.)*.8)*lowSun*(1.-night)*up*(1.-cloud*.6)*sunTerms;
 // the disc itself: small and intense (about a degree across), the halo is the bloom's job
 col+=sunColor*pow(s,mix(9000.,4000.,lowSun))*mix(9.,14.,lowSun)*up*(1.-cloud*.8)*sunTerms;
 vec3 c1=col;col=mix(col,mix(hazeColor,sunColor*.85,pow(s,8.)*.7),lowSun*pow(1.-y,4.)*.22*(1.-night)*pow(az,2.)*(1.-envPass*.7));vec3 c2=col;
 vec2 flow=vec2(cos(windDir),sin(windDir))*time*(.003+wind*.018);
 // two decks: broad stratocumulus clumps that keep their size down to the horizon, and a finer layer above
 vec2 p=d.xz/(y+.22)*1.1+flow;float n=fbm(p*.55)*.62+fbm(p*1.35+7.)*.38,n2=fbm(p*.47+flow*.5+11.);
 float dens=n*.75+n2*.25+(fbm(p*2.6+3.)-.5)*.12;float cA=.53-cloud*.30;float cover=smoothstep(cA,cA+.09,dens)*smoothstep(.0,.08,y);
 // thickness: the cores of a cloud are darker than the sky around it at first light (the hero's bodies sit below the sky in value); the thin edges take the light
 float thick=smoothstep(cA+.02,cA+.13,dens);
 // the rim: density falls off toward the sun where the cloud thins, and that edge catches the light
 vec2 toSun=normalize(vec2(sun.x,sun.z)+vec2(1e-4))*.09;float nS=fbm((p+toSun)*.55)*.62+fbm((p+toSun)*1.35+7.)*.38;float rim=clamp((dens-(nS*.75+n2*.25))*7.,0.,1.)*lowSun*up;
 float litDot=dot(normalize(vec3(d.x,.35,d.z)),normalize(vec3(sun.x,max(sun.y,.05),sun.z)));float lit=mix(clamp(.45+.55*litDot,0.,1.),pow(s,6.)*up,lowSun)*(1.-night)*(1.-envPass*.8);
 // clouds: pink-orange undersides toward the low sun, dark purple bodies in shade, a silver lining beside the disc
 vec3 cloudLit=mix(vec3(.96,.96,.95),mix(sunColor,vec3(1.,.55,.42),.4),min(1.,low*1.4)),cloudShade=mix(mix(vec3(.58,.62,.70),vec3(.075,.065,.085),lowSun),vec3(.24,.27,.33),cloud*(1.-.6*lowSun));
 vec3 cloudEdge=mix(mix(vec3(.80,.82,.88),mix(skyZenith,vec3(.40,.28,.38),.55),lowSun),cloudLit,clamp(lit*(1.-cloud*.45)+rim*pow(s,3.)*.9,0.,1.));
 vec3 cloudColor=mix(cloudEdge,cloudShade,thick*(1.-.55*lit))*(1.-night*.92);
 cloudColor+=sunColor*pow(s,10.)*.5*lowSun*(1.-night);
 col=mix(col,cloudColor,cover*.93);
 // high thin streaks near the horizon at first light: bands of constant elevation (rings in the projection), lit peach beside the sun and mauve away from it, the altostratus the picture's sun sits behind
 float streakV=0.;{float st=fbm(vec2(atan(p.y,p.x)*1.6+flow.x*.2,length(p)*3.6+17.));float streak=smoothstep(.44,.60,st)*smoothstep(.02,.07,y)*(1.-smoothstep(.22,.42,y))*lowSun*(1.-night)*(1.-envPass);streakV=streak;
  vec3 streakColor=mix(mix(skyZenith,vec3(.42,.28,.40),.5),cloudLit*.5,pow(s,4.)*.85);col=mix(col,streakColor,streak*.6);}
 vec3 c3=col;
 vec3 sd=floor(d*260.);float star=step(.9972,hash(sd.xy*1.7+sd.z*3.1))*night*(1.-cover);col+=vec3(.9,.92,1.)*star*smoothstep(.02,.25,y);
 col=mix(col,horizonHere,(1.-smoothstep(0.,.10,y))*(.55-.30*lowSun));
 if(skyDebug>.5)col=skyDebug<1.5?c0:skyDebug<2.5?c1:skyDebug<3.5?c2:skyDebug<4.5?c3:skyDebug<5.5?vec3(cover):vec3(streakV);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`});
 const sky=new T.Mesh(new T.SphereGeometry(1200,40,24),mat);sky.userData.skipReflection=false;scene.add(sky);
 return {mesh:sky,uniforms:u,
  apply(palette,sunDir,elevation,cloud){u.cloud.value=cloud;u.sunElevation.value=elevation;skyColors.night.value=palette.night;skyColors.daylight.value=smooth(-3,16,elevation);skyColors.skyHorizon.value.setRGB(...palette.horizon);skyColors.skyZenith.value.setRGB(...palette.zenith);skyColors.sun.value.set(sunDir.x,sunDir.y,sunDir.z).normalize();skyColors.sunColor.value.setRGB(...palette.sunColor);skyColors.fogColor.value.setRGB(...palette.fogColor);skyColors.fogDensity.value=palette.fogDensity;if(palette.haze)u.hazeColor.value.setRGB(...palette.haze);}
 };
}
