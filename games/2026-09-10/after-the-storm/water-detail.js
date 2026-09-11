import * as T from './vendor/three.module.js';

// Periodic spectral slope texture. Mipmapping removes subpixel shimmer at distance.
// Blue stores focused refracted light obtained by splatting the same slope field.
const N=256,slopes=new Float32Array(N*N*2),flux=new Float32Array(N*N);
let seed=1729;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const bands=Array.from({length:30},(_,i)=>{const k=2+Math.floor(random()*19),a=random()*Math.PI*2;return [Math.round(Math.cos(a)*k),Math.round(Math.sin(a)*k),random()*6.283,(.8+random()*.4)/Math.sqrt(k)];});
for(let y=0;y<N;y++)for(let x=0;x<N;x++){let sx=0,sz=0;for(const[kx,kz,ph,a]of bands){const c=Math.cos((kx*x+kz*y)/N*Math.PI*2+ph)*a;sx+=c*kx;sz+=c*kz;}const i=(y*N+x)*2;slopes[i]=sx*.013;slopes[i+1]=sz*.013;}
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*2,px=x+slopes[i]*12,pz=y+slopes[i+1]*12,ix=Math.floor(px),iz=Math.floor(pz),fx=px-ix,fz=pz-iz;for(let dz=0;dz<2;dz++)for(let dx=0;dx<2;dx++)flux[((iz+dz+N*2)%N)*N+(ix+dx+N*2)%N]+=(dx?fx:1-fx)*(dz?fz:1-fz);}
const data=new Uint8Array(N*N*4);for(let i=0;i<N*N;i++){data[i*4]=Math.round(T.MathUtils.clamp(slopes[i*2]*.5+.5,0,1)*255);data[i*4+1]=Math.round(T.MathUtils.clamp(slopes[i*2+1]*.5+.5,0,1)*255);data[i*4+2]=Math.round(Math.min(1,flux[i]/3)*255);data[i*4+3]=255;}
export const waterDetail=new T.DataTexture(data,N,N,T.RGBAFormat);waterDetail.wrapS=waterDetail.wrapT=T.RepeatWrapping;waterDetail.minFilter=T.LinearMipmapLinearFilter;waterDetail.magFilter=T.LinearFilter;waterDetail.generateMipmaps=true;waterDetail.needsUpdate=true;

export const waterFragment=`
uniform sampler2D refraction,reflection,depthMap,detailMap,foamMap;uniform vec2 foamCenter;uniform float foamSpan;
uniform float night;uniform vec2 viewportOrigin,viewportSize;
uniform sampler2D terrainMap;uniform float terrainSpan,customTerrain;
uniform vec3 eye,sun,skyHorizon,skyZenith;uniform float near,far;uniform vec3 reefs[7];
varying vec3 worldP;varying vec4 mirrorP;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float linearDepth(float d){return near*far/(far-d*(far-near));}
float floorH(vec2 p){float result=0.;if(customTerrain>.5){vec2 encodedHeight=texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).rg;result=-16.+dot(encodedHeight,vec2(256.,1.))/257.*100.;}else{float x=p.x,z=p.y;float outer=length(vec2(x/1.04,(z+15.)/1.25));float g=-7.+max(0.,outer-125.)*.22;g+=sin(x*.04)*.5+sin(z*.053+x*.025)*.65;g+=5.8*exp(-((x+77.)*(x+77.)+(z-25.)*(z-25.))/1500.);g+=5.4*exp(-((x-87.)*(x-87.)+(z+52.)*(z+52.))/1350.);g+=2.4*exp(-((x+32.)*(x+32.)+(z+166.)*(z+166.))/1600.);if(z< -170.)g-=min(16.,(-z-170.)*.16)*exp(-x*x/12500.);result=g;}return result;}

void main(){
 vec2 p=worldP.xz;vec3 V=normalize(eye-worldP);float dist=length(eye-worldP);
 vec3 surface=waveSurface(p);float e=.10;
 vec2 wakeSlope=vec2(jetWake(p+vec2(e,0))+impactHeight(p+vec2(e,0))-jetWake(p-vec2(e,0))-impactHeight(p-vec2(e,0)),jetWake(p+vec2(0,e))+impactHeight(p+vec2(0,e))-jetWake(p-vec2(0,e))-impactHeight(p-vec2(0,e)))/(2.*e)+wakeSurface(p).yz;
 vec2 flow=vec2(time*.013,-time*.009);vec2 r1=texture2D(detailMap,p*.145+flow).rg*2.-1.;
 vec2 rotated=mat2(.8,-.6,.6,.8)*p;vec2 r2=texture2D(detailMap,rotated*.37-flow*1.7).rg*2.-1.;
 float detailStrength=(.055+storm*.075)*(1.-smoothstep(75.,300.,dist)*.6);
 // Capillary ripples travel with the longer waves instead of sliding as a single sheet.
 vec2 drift=surface.yz*.24;
 vec2 r3=texture2D(detailMap,p*.82+drift-flow*2.3).rg*2.-1.;
 vec2 ripple=(r1+r2*.52+r3*.22)*detailStrength;
 // Rain impacts are independent short-lived expanding rings, rather than a global ripple loop.
 if(storm>.32){vec2 grid=p*1.6;vec2 cell=floor(grid);for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
  vec2 c=cell+vec2(float(i),float(j));float cycle=time*1.4+hash(c);float epoch=floor(cycle);vec2 point=c+vec2(hash(c+epoch),hash(c+epoch+23.));vec2 delta=(grid-point)/1.6;float age=fract(cycle);float d=length(delta);float ring=d-age*.43;
  float energy=exp(-ring*ring*1100.)*(1.-age)*smoothstep(.01,.10,age);ripple+=normalize(delta+vec2(.001))*(ring>0.?1.:-1.)*energy*(storm-.32)*.035;
 }}
 vec3 N=normalize(vec3(-surface.y-wakeSlope.x-ripple.x,1.,-surface.z-wakeSlope.y-ripple.y));
 float nv=max(.001,dot(N,V)),fresnel=.0204+.9796*pow(1.-nv,5.);
 vec2 uv=(gl_FragCoord.xy-viewportOrigin)/viewportSize;vec2 screenSlope=(viewMatrix*vec4(N.x,0.,N.z,0.)).xy;
 float initialDepth=max(0.,linearDepth(texture2D(depthMap,uv).r)-linearDepth(gl_FragCoord.z));
 vec2 offset=screenSlope*.045*(1.-exp(-initialDepth*.7))/(1.+dist*.018);vec2 ruv=clamp(uv+offset,vec2(.002),vec2(.998));
 float ownDepth=linearDepth(gl_FragCoord.z),bgDepth=linearDepth(texture2D(depthMap,ruv).r);
 if(bgDepth<ownDepth+.035){ruv=uv;bgDepth=linearDepth(texture2D(depthMap,uv).r);}
 float thickness=max(0.,bgDepth-ownDepth)*dist/max(.1,ownDepth);float verticalDepth=max(0.,worldP.y-floorH(p));
 vec3 transmission=exp(-vec3(.32,.105,.065)*thickness);
 vec3 scatter=mix(vec3(.007,.055,.063),vec3(.009,.031,.042),storm)*(1.-night*.75);
 vec3 below=texture2D(refraction,ruv).rgb;vec3 refracted=below*transmission+scatter*(1.-transmission);
 vec2 muv=mirrorP.xy/mirrorP.w*.5+.5;vec2 reflectUV=clamp(muv+screenSlope*.032,vec2(.002),vec2(.998));
 float roughness=.055+storm*.045;float blur=clamp(roughness*16.+dist*.003,0.,3.4);
 vec3 reflected=texture2D(reflection,reflectUV,blur).rgb;
 vec3 reflectedRay=reflect(-V,N);vec3 skyFallback=mix(skyHorizon,skyZenith,pow(max(0.,reflectedRay.y),.4))*(1.-storm*.65)*(1.-night*.75);
 float mirrorEdge=max(abs(reflectUV.x-.5),abs(reflectUV.y-.5));reflected=mix(reflected,skyFallback,smoothstep(.46,.5,mirrorEdge));
 vec3 col=mix(refracted,reflected,fresnel);
 // Broad wave-face lighting is intentionally stronger than capillary detail:
 // reveal the existing displaced troughs and crests at racing distance.
 float faceLight=smoothstep(-.16,.22,-dot(surface.yz,sun.xz));
 col*=.80+.28*faceLight;
 col+=vec3(.004,.026,.024)*smoothstep(.1,1.2,worldP.y-seaLevel)*faceLight*(1.-night);
 // Forward scattering through thinner, backlit crests gives water depth without
 // a uniform neon rim. It vanishes under thick storm cloud or at night.
 float backlight=pow(max(0.,dot(V,-sun)),4.),crest=clamp((worldP.y-seaLevel+.15)*.65,0.,1.);
 col+=vec3(.035,.23,.19)*backlight*crest*(1.-nv)*(.25+.75*max(0.,dot(N,sun)))*(1.-storm*.8)*(1.-night);
 // Finite sun highlight with slope variance to soften distant glints and prevent aliasing.
 vec3 H=normalize(V+sun);float nh=max(0.,dot(N,H)),nl=max(0.,dot(N,sun));float variance=dot(dFdx(N),dFdx(N))+dot(dFdy(N),dFdy(N));
 float alpha2=roughness*roughness+min(.04,variance*.32);float denom=nh*nh*(alpha2-1.)+1.;float distribution=alpha2/(3.14159265*denom*denom);
 float smithV=2.*nv/(nv+sqrt(alpha2+(1.-alpha2)*nv*nv));float smithL=2.*nl/(nl+sqrt(alpha2+(1.-alpha2)*nl*nl));
 float spec=distribution*smithV*smithL*.0204/max(.02,4.*nv*nl);
 col+=vec3(1.,.80,.53)*min(12.,spec)*nl*2.4*(1.-storm*.88)*(1.-night*.97);
 float turbulence=noise(p*2.7+vec2(time*.07,-time*.04))*.6+noise(p*8.1-time*.025)*.4;
 vec2 foamUV=(p-foamCenter)/foamSpan+.5;float foamInside=step(0.,foamUV.x)*step(foamUV.x,1.)*step(0.,foamUV.y)*step(foamUV.y,1.);vec2 history=texture2D(foamMap,foamUV).rg*foamInside;float foam=history.r*smoothstep(.34,.78,turbulence)*.50,bubbles=history.g*.4;
 // Landing wash expands from the contact point and breaks apart, remaining in
 // world space after the rider has left. Its ring follows the shared pressure wave.
 for(int i=0;i<12;i++){vec4 w=impactWaves[i];float age=time-w.z;if(w.w<=0.||age<0.||age>7.)continue;
  float radius=length(p-w.xy),front=radius-(.65+age*2.6);
  foam+=exp(-front*front*2.5-age*.85)*w.w*6.*smoothstep(.22,.72,turbulence)*(1.-exp(-age*12.));
  bubbles+=exp(-radius*radius/(1.+age*2.))*exp(-age*.9)*w.w*3.;
 }
 // A narrow advancing foam lip, broken lace behind it, and aerated shallow wash.
 // Depth is measured against the moving surface, so the edge travels up the beach.
 float shore=1.-smoothstep(.12,1.45,verticalDepth);
 float lip=exp(-pow((verticalDepth-.13)/.16,2.));
 float lace=noise(p*1.25+surface.yz*.4-vec2(time*.13,time*.09));
 float wash=smoothstep(.28,.70,lace*.65+turbulence*.35);
 foam+=lip*(.42+.75*wash)+shore*wash*(.26+history.r*.65);
 bubbles+=shore*.2;
 for(int r=0;r<7;r++){float gap=length(p-reefs[r].xy)-reefs[r].z;foam+=exp(-gap*gap*3.)*smoothstep(.42,.8,turbulence+.12*sin(time*1.7+float(r)))*(.20+storm*.12);}
 for(int i=0;i<64;i++){vec4 w=wake[i];float age=time-w.z;if(age>=0.&&age<18.&&w.w>.02){vec2 delta=p-w.xy-vec2(.16,-.11)*storm*age;float spread=.55+age*.65;if(dot(delta,delta)<(spread+3.)*(spread+3.)){
  float along=dot(delta,vec2(sin(wakeHeading[i]),cos(wakeHeading[i]))),across=dot(delta,vec2(cos(wakeHeading[i]),-sin(wakeHeading[i])));
  float ed=abs(across)-spread;float fade=exp(-age*.27);float foamPatch=smoothstep(.28,.69,turbulence);
  float arms=exp(-ed*ed*7./(1.+age*.3))*.28;float churn=exp(-across*across/(.18+age*.23))*.44;
  float trail=exp(-along*along*.34)*w.w;
  foam+=(arms+churn)*trail*fade*(.15+.85*foamPatch);
  bubbles+=exp(-across*across/(.5+age*.28))*trail*exp(-age*.19)*.24;
 }}}
 // Scattered spilling caps on elevated, steep crests, including fair-weather surf.
 // Large patches survive at distance; fine lace is filtered away toward the horizon.
 float steepness=length(surface.yz);
 float capPatch=noise(p*.15+surface.yz*.8-vec2(time*.10,time*.06));
 vec2 px=dFdx(p),py=dFdy(p),gx=dFdx(surface.yz),gy=dFdy(surface.yz);
 float determinant=px.x*py.y-px.y*py.x;
 float curvature=-(gx.x*py.y-gy.x*px.y+gy.y*px.x-gx.y*py.x)
  /(abs(determinant)>.000001?determinant:.000001);
 float cap=smoothstep(.55,1.5,surface.x)*smoothstep(.024,.085,curvature)
  *(1.-smoothstep(.32,.70,steepness))
  *smoothstep(.40,.67,capPatch);
 float capLace=mix(smoothstep(.24,.65,turbulence),.72,smoothstep(55.,180.,dist));
 foam+=cap*capLace*1.35;
 // Subsurface aeration persists after the white surface foam disperses.
 col=mix(col,mix(vec3(.10,.32,.30),vec3(.055,.15,.17),storm),clamp(bubbles,0.,.65)*(1.-fresnel));
 float cells=texture2D(detailMap,p*1.9+drift-flow*.6).b;
 float cover=clamp(1.-exp(-foam*1.8),0.,.94);
 vec3 foamColor=mix(vec3(.70,.77,.73),vec3(.32,.41,.43),storm)*(.85+.30*cells)*(1.-night*.72);
 col=mix(col,foamColor,cover);
 float fog=1.-exp(-dist*dist*.0000016*(1.+storm*3.));col=mix(col,mix(vec3(.50,.61,.63),vec3(.20,.28,.32),storm)*(1.-night*.8),fog);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

