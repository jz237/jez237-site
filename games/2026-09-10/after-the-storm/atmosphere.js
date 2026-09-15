import {panoramaGLSL} from './sky-panorama.js';
import {cloudGLSL} from './weather-light.js';
// A continuous world-space cloud slab. The same coverage field shades the
// water and shore; integration gives the clouds depth instead of flat patches.
export const atmosphereFragment=`
uniform float storm,skyNight,skySteps;uniform vec3 skyHorizon,skyZenith,skySun;varying vec3 dir;
${cloudGLSL}
${panoramaGLSL}
float volumeHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
uniform highp sampler3D cloudVolume;
float volumeNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return texture(cloudVolume,(i+f+.5)/32.).r;}
float cloudDensity(vec3 p){
 float coverage=cloudCoverAt(p.xz);
 vec3 q=(p+vec3(weatherTime*1.2,0.,-weatherTime*.43))*.018;
 float billow=volumeNoise(q)*.58+volumeNoise(q*2.03+13.7)*.30+volumeNoise(q*4.11+29.3)*.12;
 float top=205.+coverage*70.;
 float envelope=smoothstep(173.,189.,p.y)*(1.-smoothstep(top-24.,top,p.y));
 return smoothstep(.43,.70,coverage*.68+billow*.42)*envelope;
}
void main(){
 vec3 d=normalize(dir),sun=normalize(skySun);float y=max(0.,d.y),mu=max(0.,dot(d,sun));
 float haze=exp(-y*5.5);vec3 horizon=mix(skyHorizon,vec3(.66,.73,.76),.22);
 vec3 col=mix(skyZenith,horizon,haze);
 if(panoramaReady>.5)col=panoramaRadiance(d,sun,skyHorizon,skyZenith,skyNight,storm);
 col+=vec3(.28,.17,.075)*pow(mu,7.)*(1.-storm*.6);
 col+=vec3(1.,.84,.59)*smoothstep(.99972,.99994,mu)*3.*(1.-skyNight);
 col+=vec3(.20,.15,.09)*pow(mu,110.);
 float sunGap=1.-cloudCoverAt(cameraPosition.xz+sun.xz*190./max(.12,sun.y));
 col+=vec3(.13,.10,.055)*pow(mu,18.)*sunGap*(1.-storm)*(1.-skyNight);
 float localFront=frontAt(cameraPosition.xz,weatherTime);
 col=mix(col,vec3(.23,.31,.36)+y*vec3(.015,.035,.055),storm*.24+localFront*.18);
 if(d.y>.005 && panoramaReady<.5){
  float start=max(0.,(175.-cameraPosition.y)/d.y),end=(260.-cameraPosition.y)/d.y;
  float stepLength=(end-start)/skySteps,transmission=1.;vec3 scattered=vec3(0.);
  for(int i=0;i<32;i++){
   if(float(i)>=skySteps)break;
   float jitter=volumeHash(vec3(gl_FragCoord.xy,2.));
   vec3 p=cameraPosition+d*(start+(float(i)+.38+jitter*.24)*stepLength);
   float density=cloudDensity(p),optical=density*min(stepLength,90.)*.040;
   float alpha=1.-exp(-optical);
   float shadow=exp(-(cloudDensity(p+sun*18.)*.85+cloudDensity(p+sun*45.)*1.2+cloudDensity(p+sun*85.)*.8));
   float heightLight=smoothstep(177.,245.,p.y);
   float front=frontAt(p.xz,weatherTime),grey=clamp(storm*.6+front*.35,0.,1.);
   vec3 fill=mix(vec3(.37,.45,.50),vec3(.15,.22,.27),grey);
   vec3 light=fill+vec3(.70,.68,.61)*shadow*(.45+.55*heightLight)*(1.-grey*.5);
   light+=vec3(.55,.43,.26)*pow(mu,12.)*shadow*(1.-density)*.6;
   scattered+=transmission*alpha*light;transmission*=1.-alpha;
  }
  vec3 clouds=col*transmission+scattered;
  col=mix(col,clouds,smoothstep(.035,.16,d.y)*(1.-smoothstep(1300.,4200.,start)));
 }
 // The distant rain curtain is the actual moving boundary, never a billboard.
 float denominator=dot(d.xz,vec2(.86,-.51));
 if(abs(denominator)>.02){
  float distance=-frontDistance(cameraPosition.xz,weatherTime)/denominator;
  vec3 hit=cameraPosition+d*distance;
  float streak=cloudNoise(vec2(dot(hit.xz,vec2(.51,.86))*.024,weatherTime*.045))*.65+.35;
  float curtain=frontEnabled*smoothstep(20.,120.,distance)*(1.-smoothstep(900.,1600.,distance))*smoothstep(-8.,25.,hit.y)*(1.-smoothstep(120.,190.,hit.y))*streak*.42;
  col=mix(col,vec3(.25,.33,.38),curtain);
 }
 if(panoramaReady<.5)col*=1.-skyNight*.75;gl_FragColor=vec4(col,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
