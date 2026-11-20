// ---- shared noise helpers -------------------------------------------------
float hash11(float n){ return fract(sin(n*127.1)*43758.5453); }
float hash21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2  hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float hash31(vec3 p3){ p3=fract(p3*.1031); p3+=dot(p3,p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }
float n2(vec2 x){
    vec2 i=floor(x), f=fract(x); f=f*f*f*(f*(f*6.-15.)+10.);
    return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y);
}
float n3(vec3 x){
    vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
    return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x), mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x), f.y),
               mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x), mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x), f.y), f.z);
}
const mat2 M2=mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 p,int oct){ float a=.5,s=0.; for(int i=0;i<oct;i++){ s+=a*n2(p); p=M2*p+vec2(3.1,1.7); a*=.5; } return s; }
float ridged(vec2 p,int oct){ float a=.5,s=0.,w=1.; for(int i=0;i<oct;i++){ float n=1.-abs(2.*n2(p)-1.); n*=n; s+=a*n*w; w=clamp(n*1.6,0.,1.); p=M2*p+vec2(3.1,1.7); a*=.5; } return s; }
float fbm3(vec3 p,int oct){ float a=.5,s=0.; for(int i=0;i<oct;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.3); a*=.5; } return s; }
