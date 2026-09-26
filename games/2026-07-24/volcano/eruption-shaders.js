/* Photographic terrain remains stationary. Ash is a newly integrated 3D density
   field on every frame; no eruption photograph is sampled by the volume pass. */
window.VolcanoShaders = {
landscape: `
uniform sampler2D uScene;
uniform vec4 uXf;
uniform float uTime,uIntensity,uFlow,uPulse,uHaze,uSteam,uSpill,uDust,uAge;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=(vUv-uXf.zw)/uXf.xy; uv.y=1.0-uv.y;
 vec3 raw=texture(uScene,uv).rgb;
 float mask=smoothstep(0.025,0.15,raw.r-max(raw.g,raw.b))*smoothstep(0.46,0.49,uv.y)*smoothstep(0.405,0.445,uv.x);
 float distanceDown=max(0.0,uv.y-0.478);
 float front=1.0-smoothstep(uAge*0.012+0.025,uAge*0.012+0.058,distanceDown);
 vec2 material=vec2(uv.x*310.0+noise(uv*35.0)*2.0,uv.y*240.0-uTime*2.8);
 float crust=noise(material)*0.62+noise(material*2.3)*0.25+noise(material*5.1)*0.13;
 float cracks=smoothstep(0.44,0.71,crust);
 float heat=clamp(uFlow*(0.30+0.38*uIntensity)*front,0.0,1.7);
 vec3 rock=vec3(0.07+dot(raw,vec3(0.21,0.72,0.07))*0.18);
 vec3 molten=raw*(0.58+0.70*cracks);
 molten+=vec3(0.16,0.035,0.002)*smoothstep(0.73,0.88,crust)*mask;
 vec3 col=mix(raw,mix(rock,molten,clamp(heat*1.50,0.0,1.0)),mask);
 float light=exp(-length((uv-vec2(0.493,0.481))*vec2(1.0,1.6))*27.0);
 col+=vec3(1.0,0.24,0.035)*light*(0.015+uPulse*0.045)*uSpill;
 // Tiny temperature-dependent refraction only above the crater; terrain never bends.
 float air=(1.0-smoothstep(0.463,0.480,uv.y))*exp(-pow((uv.x-0.493)*42.0,2.0))*exp(-abs(uv.y-0.47)*28.0);
 vec2 shimmer=vec2(sin(uv.y*480.0+uTime*8.0),sin(uv.x*520.0-uTime*5.7))*0.00055*air*uHaze*uIntensity;
 if(air>0.005) col=mix(col,texture(uScene,uv+shimmer).rgb,air);
 float ground=smoothstep(0.50,0.65,uv.y);
 col=mix(col,col*vec3(0.89,0.9,0.91),uDust*ground*0.10);
 fc=vec4(pow(max(col,vec3(0.0)),vec3(2.2)),1.0);
}`,
volume: `
precision highp sampler3D;
uniform sampler3D uNoise;
uniform vec4 uXf;
uniform float uTime,uWind,uTurb,uBuoy,uHistory[64],uSteps,uSpill,uCooling;
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return texture(uNoise,(i+f+0.5)/64.0).r;}
float fbm(vec3 p){return n3(p)*0.57+n3(p*2.07+13.1)*0.28+n3(p*4.19-7.6)*0.15;}
float history(float age){float at=clamp(age*2.0,0.0,62.99);int i=int(at);return mix(uHistory[i],uHistory[i+1],fract(at));}
float density(vec3 p){
 float y=p.y;
 if(y<0.0||y>0.72)return 0.0;
 float rise=0.022+0.010*uBuoy;
 float source=history(max(0.0,y-0.09)/rise);
 float spread=pow(max(y,0.001),0.85);
 vec2 center=vec2(uWind*y*0.80+0.40*y*y,0.0);
 center+=vec2(sin(y*12.0-uTime*0.10),cos(y*9.0-uTime*0.08))*y*0.065;
 vec2 crossSection=p.xz-center;
 float radius=(0.021+spread*0.32+smoothstep(0.17,0.42,y)*0.09)*mix(0.45,1.15,smoothstep(0.0,1.8,source));
 float swell=n3(vec3(4.2,y*18.0-uTime*0.44,8.1));
 radius*=0.65+0.75*swell;
 if(length(crossSection)>radius*1.85)return 0.0;
 // Noise moves upwards with the material; small eddies evolve independently.
 vec3 material=vec3(crossSection.x,y-uTime*(0.022+0.010*uBuoy),crossSection.y);
 float broad=smoothstep(0.25,0.75,fbm(material*29.0+vec3(1.3,0.0,3.1)));
 float fine=fbm(material*91.0+vec3(uTime*0.11,0.0,-uTime*0.055));
 // An advancing head is rounded and turbulent, never clipped to a horizontal age slice.
 float headOffset=0.085*pow(length(crossSection)/max(radius,0.02),2.0)+(broad-0.50)*0.085;
 source=history(max(0.0,y+headOffset)/rise);
 if(source<0.003)return 0.0;
 float billow=radius*(0.42+1.24*broad)-length(crossSection);
 float edge=(fine-0.46)*radius*(0.42+uTurb*0.22);
 float body=smoothstep(-radius*0.08,radius*0.38,billow+edge);
 float detail=mix(0.55,1.35,fine);
 float cap=smoothstep(0.0,0.005,y);
 return body*detail*cap*min(source,2.0)*exp(-y*uCooling*0.5);
}
void main(){
 vec2 uv=(vUv-uXf.zw)/uXf.xy;uv.y=1.0-uv.y;
 vec2 xy=vec2((uv.x-0.493)*1.776,0.487-uv.y);
 if(xy.y<0.0||xy.y>0.72){fc=vec4(0.0);return;}
 float center=uWind*xy.y*0.8+0.40*xy.y*xy.y;
 float maxRadius=0.04+pow(xy.y,0.85)*0.90;
 if(abs(xy.x-center)>maxRadius){fc=vec4(0.0);return;}
 vec3 sum=vec3(0.0);float transmission=1.0;
 vec3 light=normalize(vec3(-0.65,0.6,0.7));
 float stepSize=0.60/uSteps;
 float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
 for(int i=0;i<64;i++){
  if(float(i)>=uSteps||transmission<0.012)break;
  vec3 p=vec3(xy,0.30-(float(i)+jitter)*stepSize);
  float d=density(p);
  if(d<0.006)continue;
  float shadow=density(p+light*0.020)*0.020+density(p+light*0.055)*0.044+density(p+light*0.11)*0.060;
  float sunlight=exp(-shadow*48.0);
  float rim=pow(sunlight,2.0);
  vec3 ambient=vec3(0.009,0.014,0.021);
  vec3 lit=ambient+vec3(0.075,0.070,0.065)*sunlight+vec3(0.007,0.010,0.015)*rim;
  float hot=exp(-max(p.y,0.0)*21.0)*exp(-length(p.xz)*13.0)*uSpill;
  lit+=vec3(0.65,0.09,0.008)*hot*min(history(p.y/0.035),1.8);
  float a=1.0-exp(-d*stepSize*95.0);
  sum+=lit*a*transmission;transmission*=1.0-a;
 }
 fc=vec4(sum,1.0-transmission);
}`,
composite: `uniform sampler2D uVolume;void main(){fc=texture(uVolume,vUv);}`
};
