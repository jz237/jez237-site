// The lake surface: dielectric Fresnel split into s and p polarisation (the lenses remove the
// s-polarised glare, and near Brewster's angle the water opens up), depth-guided screen-space
// refraction through Beer-Lambert freshwater, a mip-blurred planar reflection with sky fallback,
// wind-scaled capillary ripples, the ripple field's slopes, rain rings, wind lanes and foam.
export const lakeFragment=`
uniform sampler2D refraction,reflection,depthMap,detailMap,foamMap;uniform vec2 foamCenter;uniform float foamSpan;
uniform float night,daylight,sunGlint,polarized,clarity;uniform vec2 viewportOrigin,viewportSize;
uniform vec3 eye,sun,sunColor,skyHorizon,skyZenith,fogColor;uniform float near,far,fogDensity;
varying vec3 worldP;varying vec4 mirrorP;varying vec3 broadSurface;varying vec2 disturbanceSlope;varying float fetchV;uniform vec3 waterScatter,waterAbsorption;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float linearDepth(float d){return near*far/(far-d*(far-near));}
float floorH(vec2 p){vec2 rg=texture2D(terrainMap,clamp(p/terrainSpan+.5,vec2(0.),vec2(1.))).rg;return -16.+dot(rg,vec2(256.,1.))/257.*100.;}
void main(){
 vec2 p=worldP.xz;vec3 V=normalize(eye-worldP);float dist=length(eye-worldP);
 vec3 surface=broadSurface;vec2 wakeSlope=disturbanceSlope+rippleSlope(p);
 vec2 flow=vec2(time*.013,-time*.009);vec2 r1=texture2D(detailMap,p*.145+flow).rg*2.-1.;
 vec2 rotated=mat2(.8,-.6,.6,.8)*p;vec2 r2=texture2D(detailMap,rotated*.37-flow*1.7).rg*2.-1.;
 float breeze=clamp(wind*fetchV*1.4+.06,0.,1.);
 float detailStrength=(.05+breeze*.06)*(1.-smoothstep(75.,300.,dist)*.6);
 vec2 drift=surface.yz*.24;
 vec2 r3=texture2D(detailMap,p*.82+drift-flow*2.3).rg*2.-1.;
 vec2 ripple=(r1+r2*.52+r3*.22)*detailStrength;
 if(rain>.02){vec2 grid=p*1.6;vec2 cell=floor(grid);for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
  vec2 c=cell+vec2(float(i),float(j));float cycle=time*1.4+hash(c);float epoch=floor(cycle);vec2 point=c+vec2(hash(c+epoch),hash(c+epoch+23.));vec2 delta=(grid-point)/1.6;float age=fract(cycle);float d=length(delta);float ring=d-age*.43;
  float energy=exp(-ring*ring*1100.)*(1.-age)*smoothstep(.01,.10,age);ripple+=normalize(delta+vec2(.001))*(ring>0.?1.:-1.)*energy*rain*.05;
 }}
 vec3 N=normalize(vec3(-surface.y-wakeSlope.x-ripple.x,1.,-surface.z-wakeSlope.y-ripple.y));
 float nv=max(.001,dot(N,V));
 float ior=1.333,cosI=nv,sinT2=(1.-cosI*cosI)/(ior*ior),cosT=sqrt(max(0.,1.-sinT2));
 float rs=(cosI-ior*cosT)/(cosI+ior*cosT),rp=(ior*cosI-cosT)/(ior*cosI+cosT);rs*=rs;rp*=rp;
 float fresnel=mix(.5*(rs+rp),.5*(rp+.1*rs),polarized);
 vec2 uv=(gl_FragCoord.xy-viewportOrigin)/viewportSize;vec2 screenSlope=(viewMatrix*vec4(N.x,0.,N.z,0.)).xy;
 float initialDepth=max(0.,linearDepth(texture2D(depthMap,uv).r)-linearDepth(gl_FragCoord.z));
 vec2 offset=screenSlope*.045*(1.-exp(-initialDepth*.7))/(1.+dist*.018);vec2 ruv=clamp(uv+offset,vec2(.002),vec2(.998));
 float ownDepth=linearDepth(gl_FragCoord.z),bgDepth=linearDepth(texture2D(depthMap,ruv).r);
 if(bgDepth<ownDepth+.035){ruv=uv;bgDepth=linearDepth(texture2D(depthMap,uv).r);}
 float thickness=max(0.,bgDepth-ownDepth)*dist/max(.1,ownDepth);float verticalDepth=max(0.,worldP.y-floorH(p));
 vec3 transmission=exp(-waterAbsorption*thickness/clarity);
 // before the light comes the water body takes the sky's colour, not the daylight green of a lit lake
 float lowSunW=1.-smoothstep(.03,.34,sun.y);
 vec3 scatter=mix(waterScatter,vec3(.075,.135,.21),lowSunW*.6)*(1.-night*.8)*(.28+.72*daylight);
 vec3 below=texture2D(refraction,ruv).rgb;vec3 refracted=below*transmission+scatter*(1.-transmission);
 // the mirror lookup is pushed further by each ripple while the sun is low: a facet tilted by a degree swings a grazing reflection by two, so the disc's reflection breaks into the long shimmering column of a dawn photograph
 vec2 muv=mirrorP.xy/mirrorP.w*.5+.5;vec2 reflectUV=clamp(muv+screenSlope*vec2(.7,1.7)*mix(.032,.085,lowSunW*(1.-night)),vec2(.002),vec2(.998));
 float roughness=.13+breeze*.08;float blur=clamp(roughness*16.+dist*.003,0.,3.4);
 vec3 reflected=texture2D(reflection,reflectUV,blur).rgb;
 vec3 reflectedRay=reflect(-V,N);
 // the fallback beyond the mirror's edge follows the sky shader: the horizon is warm only toward the sun, purple away from it while the sun is low
 float fbAz=.5+.5*dot(normalize(vec3(reflectedRay.x,0.,reflectedRay.z)+vec3(1e-4)),normalize(vec3(sun.x,0.,sun.z)+vec3(1e-4)));float fbLow=1.-smoothstep(.03,.34,sun.y);
 vec3 fbCool=mix(skyHorizon,mix(skyZenith,vec3(.30,.19,.40),.5),.72*fbLow*(1.-night));vec3 fbHorizon=mix(fbCool,skyHorizon,pow(fbAz,mix(1.6,12.,fbLow)));
 vec3 skyFallback=mix(fbHorizon,skyZenith,pow(max(0.,reflectedRay.y),.4));
 float mirrorEdge=max(abs(reflectUV.x-.5),abs(reflectUV.y-.5));reflected=mix(reflected,skyFallback,smoothstep(.46,.5,mirrorEdge));
 vec3 col=mix(refracted,reflected,fresnel);
 float faceLight=smoothstep(-.16,.22,-dot(surface.yz,sun.xz));
 col*=.86+.22*faceLight*breeze;
 float backlight=pow(max(0.,dot(V,-sun)),4.),crest=clamp((worldP.y-seaLevel+.02)*4.,0.,1.);
 col+=vec3(.035,.20,.16)*backlight*crest*(1.-nv)*(.25+.75*max(0.,dot(N,sun)))*breeze*.5*sunGlint*(1.-lowSunW)*(1.-night);
 vec3 H=normalize(V+sun);float nh=max(0.,dot(N,H)),nl=max(0.,dot(N,sun));float variance=dot(dFdx(N),dFdx(N))+dot(dFdy(N),dFdy(N));
 float alpha2=roughness*roughness+min(.04,variance*.32);float denom=nh*nh*(alpha2-1.)+1.;float distribution=alpha2/(3.14159265*denom*denom);
 float smithV=2.*nv/(nv+sqrt(alpha2+(1.-alpha2)*nv*nv));float smithL=2.*nl/(nl+sqrt(alpha2+(1.-alpha2)*nl*nl));
 float spec=distribution*smithV*smithL*.0204/max(.02,4.*nv*nl);
 col+=sunColor*min(12.,spec)*nl*2.4*mix(1.,5.,lowSunW)*sunGlint*(1.-night*.97)*mix(1.,.35,polarized);
 float turbulence=noise(p*2.7+vec2(time*.07,-time*.04))*.6+noise(p*8.1-time*.025)*.4;
 vec2 foamUV=(p-foamCenter)/foamSpan+.5;float foamInside=step(0.,foamUV.x)*step(foamUV.x,1.)*step(0.,foamUV.y)*step(foamUV.y,1.);vec2 history=texture2D(foamMap,foamUV).rg*foamInside;float foam=history.r*smoothstep(.27,.76,turbulence)*.72,bubbles=history.g*.4;
 for(int i=0;i<12;i++){vec4 w=impactWaves[i];float age=time-w.z;if(w.w<=0.||age<0.||age>7.)continue;
  float radius=length(p-w.xy),front=radius-(.65+age*2.6);
  foam+=exp(-front*front*2.5-age*.85)*w.w*6.*smoothstep(.22,.72,turbulence)*(1.-exp(-age*12.));
  bubbles+=exp(-radius*radius/(1.+age*2.))*exp(-age*.9)*w.w*3.;
 }
 vec2 windAxis=vec2(cos(windDir),sin(windDir));vec2 laneUV=vec2(dot(p,windAxis)*.05-time*.02,dot(p,vec2(-windAxis.y,windAxis.x))*.9);
 float lanes=smoothstep(.72,.9,noise(laneUV)*.7+noise(laneUV*2.3)*.3)*smoothstep(.45,.95,wind)*fetchV*.35;
 foam+=lanes;
 float shore=1.-smoothstep(.06,.6,verticalDepth);
 foam+=shore*smoothstep(.3,.7,noise(p*1.25+surface.yz*.4-vec2(time*.13,time*.09)))*(.08+wind*.35);
 col=mix(col,vec3(.10,.30,.28),clamp(bubbles,0.,.65)*(1.-fresnel));
 float cells=texture2D(detailMap,p*1.9+drift-flow*.6).b;
 float cover=clamp(1.-exp(-foam*1.45),0.,.88);
 vec3 foamColor=vec3(.80,.86,.84)*(.78+.22*cells+.12*max(0.,dot(N,sun)))*(1.-night*.72);
 col=mix(col,foamColor,cover);
 col*=mix(vec3(1.),vec3(1.,.94,.80),polarized*.45);
 float fog=1.-exp(-dist*dist*fogDensity*fogDensity);col=mix(col,fogColor,fog);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
