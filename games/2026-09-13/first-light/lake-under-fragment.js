// The surface seen from below: water-to-air Fresnel with total internal reflection outside Snell's
// window, the above-water world refracted through the window (the same refraction target, rendered
// from the underwater camera with the surface hidden), the underwater world mirrored across the
// surface where reflection is total (a flipped mirror pass on High, the deep colour elsewhere), the
// sun's glow through the window, and absorption along the path to the eye.
export const lakeUnderFragment=`
uniform sampler2D refraction,reflection,depthMap,detailMap;
uniform float night,polarized,clarity,underMirror;uniform vec2 viewportOrigin,viewportSize;
uniform vec3 eye,sun,sunColor,skyHorizon,skyZenith,fogColor;uniform float near,far,fogDensity;
varying vec3 worldP;varying vec4 mirrorP;varying vec3 broadSurface;varying vec2 disturbanceSlope;varying float fetchV;uniform vec3 waterScatter,waterAbsorption;
void main(){
 vec2 p=worldP.xz;vec3 toEye=eye-worldP;float dist=length(toEye);vec3 V=toEye/dist;
 vec3 surface=broadSurface;vec2 wakeSlope=disturbanceSlope+rippleSlope(p);
 vec2 flow=vec2(time*.013,-time*.009);vec2 r1=texture2D(detailMap,p*.145+flow).rg*2.-1.;
 vec2 rotated=mat2(.8,-.6,.6,.8)*p;vec2 r2=texture2D(detailMap,rotated*.37-flow*1.7).rg*2.-1.;
 float breeze=clamp(wind*fetchV*1.4+.06,0.,1.);float detailStrength=(.006+breeze*.06)*(1.-smoothstep(40.,120.,dist)*.6);
 vec2 r3=texture2D(detailMap,p*.82+surface.yz*.24-flow*2.3).rg*2.-1.;
 vec2 ripple=(r1+r2*.52+r3*.22)*detailStrength;
 vec3 Nup=normalize(vec3(-surface.y-wakeSlope.x-ripple.x,1.,-surface.z-wakeSlope.y-ripple.y));vec3 N=-Nup;
 float cosI=clamp(dot(N,V),.001,1.);
 float n1=1.333,sinT2=n1*n1*(1.-cosI*cosI);
 vec2 uv=(gl_FragCoord.xy-viewportOrigin)/viewportSize;vec2 screenSlope=(viewMatrix*vec4(Nup.x,0.,Nup.z,0.)).xy;
 float R=1.;vec3 above=vec3(0.);
 if(sinT2<1.){float cosT=sqrt(1.-sinT2);float rs=(n1*cosI-cosT)/(n1*cosI+cosT),rp=(cosI-n1*cosT)/(cosI+n1*cosT);R=.5*(rs*rs+rp*rp);
  float edge=smoothstep(.5,1.,sinT2);vec2 ruv=clamp(uv+screenSlope*(.05+edge*.16),vec2(.002),vec2(.998));above=texture2D(refraction,ruv).rgb*(1.-edge*.35);}
 vec2 muv=mirrorP.xy/mirrorP.w*.5+.5;vec2 reflectUV=clamp(muv+screenSlope*.03,vec2(.002),vec2(.998));
 vec3 deep=fogColor*.85;
 vec3 mirrored=underMirror>.5?texture2D(reflection,reflectUV,1.5).rgb:deep;
 float mirrorEdge=max(abs(reflectUV.x-.5),abs(reflectUV.y-.5));mirrored=mix(mirrored,deep,smoothstep(.44,.5,mirrorEdge));
 vec3 col=above*(1.-R)+mirrored*R;
 // the sun through the window: a soft glow toward its refracted position, and glitter on the ripples
 float toSun=max(0.,dot(-V,sun));col+=sunColor*(pow(toSun,14.)*.9+pow(toSun,120.)*1.6)*(1.-R)*(1.-night*.95);
 vec3 H=normalize(V+sun);float nh=max(0.,dot(Nup,H));col+=sunColor*pow(nh,80.)*.35*(1.-night);
 float fog=1.-exp(-dist*dist*fogDensity*fogDensity);col=mix(col,fogColor,fog);
 gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
