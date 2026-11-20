// 69 NORTH — a procedural film for "Distant Early Warning" (live).
// Every pixel is computed; every motion is driven by features extracted from the track.
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uJit;
uniform float uSeed;
uniform float uDur;
uniform sampler2D uHeight;   // baked heightfield
uniform sampler2D uSpec;     // mel spectrogram  (x=time, y=band)
uniform sampler2D uFeat;     // feature tracks   (x=time, y=feature)
uniform float uA[NF];        // features at this instant
uniform float uKT[8];        // last kick times
uniform float uKS[8];        // last kick strengths
uniform float uST[4];        // last snare times
uniform float uBeat;         // continuous beat position (0 at band entry)
uniform float uShotT0;       // fast-cut passages: start time of the current shot
uniform float uShotK;        //   ordinal of that shot
uniform float uShotV;        //   extra snowcat speed during that shot
uniform int   uShotId;       //   camera angle of that shot (0 = the passage's own camera)
layout(location=0) out vec4 fragColor;
layout(location=1) out vec4 fragKit;      // the drum kit, premultiplied; composited after depth of field

#define A(i) uA[i]
#define PI 3.14159265
#define TAU 6.2831853
float feat(int i,float t){ return texture(uFeat,vec2(clamp(t/uDur,0.,1.),(float(i)+.5)/float(NF))).r; }
float spec(float t,float b){ return texture(uSpec,vec2(clamp(t/uDur,0.,1.),clamp(b,0.01,.99))).r; }    // full mix
float specH(float t,float b){ return texture(uSpec,vec2(clamp(t/uDur,0.,1.),clamp(b,0.01,.99))).g; }   // everything but the drums

// ---- timeline (seconds, snapped to beats of this performance) -------------
const float T1=24.96, T2=47.12, T3=58.05, T4=86.24, T3B=72.56, T5=97.53, T6=123.51, T7=161.92,
            T8=172.98, T8C=199.31, T9=213.955, T10=224.04, T11=238.75, T11B=246.63, T12=254.56,
            T12B=278.22, T13=301.575, TEND=315.53;

// ---- scene state ------------------------------------------------------------
int   gWorld;
float gTod,gAlert,gScope,gStorm,gBeam,gAur,gNS,gFade,gSnow,gSeaAmp,gWhite,gRing,gSweepMul,gHot,gLocal,gRed,gSweepAbs;
float gDof,gFocus,gDepth,gMinH,gGlit,gVOn,gVLamp,gVX,gFlash,gCrowd;
vec3  gVP,gVF,gVR,gVU;
vec3  gRo,gTa; float gFl,gRoll,gTop;
vec3  gKeyDir,gKeyCol,gAmb,gFxCol,gRingCol,gAurLo,gAurHi,gSunDir,gMoonDir,gGlowCol;

float H(vec2 p){ return textureLod(uHeight,p/8192.+.5,0.).r; }
float gy(vec2 p){ return max(textureLod(uHeight,p/8192.+.5,3.).r,0.); }
void cam(vec3 ro,vec3 ta,float fl,float roll){ gRo=ro; gTa=ta; gFl=fl; gRoll=roll; }
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,s,-s,c); }

// =============================================================================
//  ARCTIC WORLD
// =============================================================================
const float SP=640., PAD=14.; const vec3 BEACON=vec3(1.,.06,.03);
vec3 stLocal(vec3 p,out float idx){ idx=clamp(floor(p.x/SP+.5),-gNS,gNS); return p-vec3(idx*SP,PAD,0.); }
float sweepAngle(float idx){ return gSweepAbs+idx*.9; }

float sdBox(vec3 p,vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
float sdCyl(vec3 p,float r,float h){ vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h); return min(max(d.x,d.y),0.)+length(max(d,0.)); }
float sdCapX(vec3 p,float r,float h){ p.x-=clamp(p.x,-h,h); return length(p)-r; }
float sdHut(vec3 h){
    float hut=sdBox(h-vec3(0,2.2,0),vec3(5.,2.2,3.2))-.08;
    float roof=max(max(abs(h.z)*.53+(h.y-4.3)*.85-1.9,abs(h.x)-5.5),4.3-h.y);
    return min(hut,roof);
}
const vec3 DOME=vec3(0.,16.5,0.), TOWER=vec3(27.,0.,-9.), HUT1=vec3(-25.,0.,11.), HUT2=vec3(-39.,0.,-7.);
vec2 station(vec3 q){
    vec2 r=vec2(sdBox(q-vec3(0,3.6,0),vec3(9.,3.6,8.))-.2,1.);
    float c=sdCyl(q-vec3(0,8.3,0),6.6,1.3); if(c<r.x) r=vec2(c,1.);
    float d=length(q-DOME)-9.5; if(d<r.x) r=vec2(d,2.);
    vec3 t=q-TOWER; float ty=clamp(t.y,0.,44.); float w=mix(2.7,.55,ty/44.);
    float legs=max(length(vec2(abs(t.x)-w,abs(t.z)-w))-.17,abs(t.y-22.)-22.);
    float k=abs(fract(t.y/5.5)-.5)*2.;
    float br=min(length(vec2(t.x-w*(2.*k-1.),abs(t.z)-w)),length(vec2(t.z-w*(2.*k-1.),abs(t.x)-w)))-.085;
    br=max(br,abs(t.y-22.)-22.);
    float tw=min(min(legs,br*.7),sdCyl(t-vec3(0,46.4,0),.13,2.6));
    if(tw<r.x) r=vec2(tw,3.);
    vec3 h2=q-HUT2; h2.xz=mat2(.8,.6,-.6,.8)*h2.xz;
    float hut=min(sdHut(q-HUT1),sdHut(h2)); if(hut<r.x) r=vec2(hut,4.);
    float tk=min(sdCapX(q-vec3(-11.,2.1,-20.),1.9,4.),sdCapX(q-vec3(-11.,2.1,-25.5),1.9,4.)); if(tk<r.x) r=vec2(tk,5.);
    float wh=sdCyl(q-vec3(7.,11.,6.),.07,4.); if(wh<r.x) r=vec2(wh,3.);
    return r;
}
float marchStation(vec3 ro,vec3 rd,float tmax,out float mat){
    float t=0.; mat=0.;
    for(int i=0;i<110;i++){
        vec3 p=ro+rd*t; float idx; vec3 q=stLocal(p,idx);
        float bd=length(q-vec3(-4.,20.,0.))-62.;
        if(bd>3.){ t+=bd; if(t>tmax) return -1.; continue; }
        vec2 r=station(q);
        if(r.x<.0012*t+.004){ mat=r.y; return t; }
        t+=r.x*.85; if(t>tmax) return -1.;
    }
    return -1.;
}
vec3 stationN(vec3 q){ vec2 e=vec2(.02,0.); return normalize(vec3(station(q+e.xyy).x-station(q-e.xyy).x,station(q+e.yxy).x-station(q-e.yxy).x,station(q+e.yyx).x-station(q-e.yyx).x)); }

// ---- the snowcat: one vehicle working its way east along the Line -------------
float seg(float t,float a,float b){ return clamp((t-a)/(b-a),0.,1.); }
float vehX(float t){
    float e=seg(t,254.6,281.); e=e*e*(3.-2.*e);
    return -700.+140.*seg(t,0.,25.)+130.*seg(t,25.,47.)+40.*seg(t,47.,58.)+80.*seg(t,58.,86.)+10.*seg(t,86.,97.6)+65.*seg(t,97.6,123.6)
           +5.*seg(t,123.6,173.)+80.*seg(t,173.,199.4)+10.*seg(t,199.4,238.8)+40.*seg(t,238.8,254.6)+54.*e;
}
float vehZ(float x){ return -30.-58.*smoothstep(-60.,-420.,x)+30.*sin(x*.0045+1.)*smoothstep(-90.,-320.,x)+7.*sin(x*.021)*smoothstep(-40.,-140.,x); }
vec3 vehAt(float x){ float z=vehZ(x); return vec3(x,H(vec2(x,z)),z); }
void vehSetup(float x){
    gVX=x; vec3 a=vehAt(x-2.4), b=vehAt(x+2.4);
    gVP=.5*(a+b); gVF=normalize(b-a); gVR=normalize(cross(vec3(0,1,0),gVF)); gVU=cross(gVF,gVR);
}
vec3 vehLocal(vec3 p){ vec3 d=p-gVP; return vec3(dot(d,gVF),dot(d,gVU),dot(d,gVR)); }
vec2 vehSDF(vec3 q){
    vec3 t=vec3(abs(q.x)-1.5,q.y-.56,abs(q.z)-1.16);                                    // four track pods
    float pod=max(sdBox(t,vec3(.95,.34,.26))-.2, dot(vec2(abs(t.x),t.y),vec2(.5,.866))-.82);
    vec2 r=vec2(pod,1.);
    float axle=sdBox(vec3(abs(q.x)-1.5,q.y-.75,q.z),vec3(.12,.1,1.1)); if(axle<r.x) r=vec2(axle,1.);
    float hull=sdBox(q-vec3(-.25,1.52,0.),vec3(2.3,.46,.98))-.08; if(hull<r.x) r=vec2(hull,2.);
    vec3 c=q-vec3(.9,2.55,0.);
    float cab=max(sdBox(c,vec3(1.0,.56,.9))-.1, dot(c.xy-vec2(1.05,-.1),vec2(.94,.34)));   // raked windscreen
    cab=max(cab,abs(c.z)+c.y*.16-1.02);                                                    // tumblehome
    if(cab<r.x) r=vec2(cab,3.);
    float box=sdBox(q-vec3(-1.5,2.32,0.),vec3(1.0,.34,.9))-.05; if(box<r.x) r=vec2(box,2.);
    float lamp=length(vec3(q.x-2.07,q.y-1.62,abs(q.z)-.68))-.19; if(lamp<r.x) r=vec2(lamp,4.);
    float bar=sdBox(q-vec3(1.35,3.3,0.),vec3(.07,.07,.72)); if(bar<r.x) r=vec2(bar,1.);
    float fl=sdCyl(q-vec3(.5,3.34,0.),.13,.13); if(fl<r.x) r=vec2(fl,5.);
    float stack=sdCyl(q-vec3(-.25,2.9,.82),.07,.75); if(stack<r.x) r=vec2(stack,1.);
    float whip=sdCyl(q-vec3(-2.2,3.9,-.7),.02,1.3); if(whip<r.x) r=vec2(whip,1.);
    return r;
}
float marchVeh(vec3 ro,vec3 rd,float tmax,out float mat){
    mat=0.; if(gVOn<.5) return -1.;
    vec3 oc=ro-(gVP+gVU*2.2); float b=dot(oc,rd), h=b*b-dot(oc,oc)+5.2*5.2; if(h<0.) return -1.;
    h=sqrt(h); float t=max(-b-h,0.), te=min(-b+h,tmax); if(t>te) return -1.;
    for(int i=0;i<70;i++){ vec2 r=vehSDF(vehLocal(ro+rd*t)); if(r.x<.0008*t+.003){ mat=r.y; return t; } t+=r.x*.9; if(t>te) return -1.; }
    return -1.;
}
const vec3 LAMP=vec3(1.,.86,.6), AMBER=vec3(1.,.5,.06);
vec3 vehLampPos(float sd){ return gVP+gVF*2.3+gVU*1.62+gVR*.68*sd; }
vec3 vehBeamAx(){ return normalize(gVF-gVU*.07); }
vec3 vehLight(vec3 p,vec3 n){            // headlights falling on the ground and on anything ahead
    if(gVOn<.5||gVLamp<.01) return vec3(0);
    vec3 d=p-(gVP+gVF*2.2+gVU*1.62); float r2=dot(d,d); if(r2>4e4) return vec3(0);
    vec3 dn=d*inversesqrt(r2); float c=dot(dn,vehBeamAx());
    float spot=smoothstep(.82,.985,c)+.22*smoothstep(.2,.9,c);
    return LAMP*gVLamp*spot*(.12+max(dot(n,-dn),0.))*300./(r2+24.);
}
float coneGlow(vec3 ro,vec3 rd,float tmax,vec3 S,vec3 bd,float r0,float spread,float len){
    vec3 w0=ro-S; float bb=dot(rd,bd),dd=dot(rd,w0),ee=dot(bd,w0); float den=max(1.-bb*bb,1e-4);
    float sc=max((ee-bb*dd)/den,.4); float tc=clamp(dot(S+bd*sc-ro,rd),0.,tmax);
    sc=max(dot(ro+rd*tc-S,bd),.4);
    float dist=length((ro+rd*tc)-(S+bd*sc)); float rad=r0+spread*sc;
    return exp(-pow(dist/rad,2.))/(rad*max(sqrt(den),.3))*exp(-sc/len)*smoothstep(.3,3.,sc);
}
// snow glitter: round, view-dependent glints, cross-faded between scales so they stay about a pixel wide
float glitter(vec3 p,vec3 n,vec3 rd,float t){
    float lv=log2(max(t,5.)/5.), l0=floor(lv), fr=lv-l0, acc=0.; vec3 hv=normalize(gKeyDir-rd);
    for(int k=0;k<2;k++){
        float sc=24.*exp2(-(l0+float(k))); vec2 g=p.xz*sc, id=floor(g), f=fract(g)-.5;
        float h=hash21(id+float(k)*17.3+l0*3.1);
        if(h>.55){ vec2 o=(hash22(id+5.1)-.5)*.56; float d=length(f-o);
            vec3 fn=normalize(n+(vec3(hash22(id+1.7),hash21(id+9.2)).xzy-.5)*1.25);
            acc+=smoothstep(.2,.03,d)*pow(max(dot(fn,hv),0.),34.)*(k==0?1.-fr:fr)*(h-.55)/.45; }
    }
    return acc;
}

float marchTerrain(vec3 ro,vec3 rd,float tmax){
    float t=.3, lh=0., lt=0.;
    for(int i=0;i<300;i++){
        vec3 p=ro+rd*t; float h=p.y-H(p.xz);
        if(h<.0015*t){ // refine
            t=mix(lt,t,clamp(lh/(lh-h+1e-5),0.,1.)); return t;
        }
        lh=h; lt=t;
        t+=max(h*.5,.02+.003*t);
        if(t>tmax||(rd.y>0.&&p.y>1200.)) return -1.;
    }
    return t;
}
float shadowT(vec3 p,vec3 l){
    float res=1.,t=3.;
    for(int i=0;i<36;i++){
        vec3 q=p+l*t; float h=q.y-H(q.xz);
        res=min(res,10.*h/t); if(res<.02) break;
        t+=max(h*.6,4.+t*.05); if(t>1800.) break;
    }
    return clamp(res,0.,1.);
}
vec3 terrainN(vec2 p,float t){
    float e=max(2.2,.0018*t);
    vec3 n=normalize(vec3(H(p-vec2(e,0))-H(p+vec2(e,0)),2.*e,H(p-vec2(0,e))-H(p+vec2(0,e))));
    float dA=smoothstep(900.,40.,t);
    vec2 g=vec2(n2(p*.28+vec2(.3,0))-n2(p*.28-vec2(.3,0)), n2(p*.28+vec2(0,.3))-n2(p*.28-vec2(0,.3)));
    g+=.6*vec2(n2(p*vec2(.25,1.9)+vec2(.3,0))-n2(p*vec2(.25,1.9)-vec2(.3,0)), n2(p*vec2(.25,1.9)+vec2(0,.3))-n2(p*vec2(.25,1.9)-vec2(0,.3)));
    n=normalize(n+vec3(-g.x,0.,-g.y)*.2*dA);
    float dB=smoothstep(130.,5.,t);
    if(dB>.01){ vec2 q=p*vec2(.8,2.4)+7.; const float e2=.11;
        vec2 g2=vec2(fbm(q+vec2(e2,0),3)-fbm(q-vec2(e2,0),3),fbm(q+vec2(0,e2),3)-fbm(q-vec2(0,e2),3));
        vec2 q3=p*vec2(3.1,7.5); g2+=.35*vec2(n2(q3+vec2(e2,0))-n2(q3-vec2(e2,0)),n2(q3+vec2(0,e2))-n2(q3-vec2(0,e2)));
        n=normalize(n+vec3(-g2.x,0.,-g2.y)*1.5*dB); }
    return n;
}

// ---- sea --------------------------------------------------------------------
float seaH(vec2 p,float t){
    float a=gSeaAmp/(1.+t*.0012), T=uTime;
    return a*(.9*sin(dot(p,vec2(.021,.012))+T*.9)+.5*sin(dot(p,vec2(-.013,.034))+T*1.15+1.3)+.28*sin(dot(p,vec2(.05,-.03))+T*1.7));
}
vec3 seaN(vec2 p,float t){
    float e=.6;
    float hx=seaH(p+vec2(e,0),t)-seaH(p-vec2(e,0),t), hz=seaH(p+vec2(0,e),t)-seaH(p-vec2(0,e),t);
    float att=1./(1.+t*.004);
    vec2 q=p*.16+vec2(uTime*.22,uTime*.13), q2=p*.55-vec2(uTime*.3,uTime*.21);
    vec2 r=vec2(n2(q+vec2(.25,0))-n2(q-vec2(.25,0)),n2(q+vec2(0,.25))-n2(q-vec2(0,.25)))*1.1
          +vec2(n2(q2+vec2(.25,0))-n2(q2-vec2(.25,0)),n2(q2+vec2(0,.25))-n2(q2-vec2(0,.25)))*.5;
    r*=att*(.11+.05*gSeaAmp);
    return normalize(vec3(-hx/(2.*e)-r.x,1.,-hz/(2.*e)-r.y));
}
vec3 voro(vec2 x){
    vec2 n=floor(x),f=fract(x),mg=vec2(0),mr=vec2(0); float md=8.;
    for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){ vec2 g=vec2(i,j),o=hash22(n+g),r=g+o-f; float d=dot(r,r); if(d<md){md=d;mr=r;mg=g;} }
    md=8.;
    for(int j=-2;j<=2;j++)for(int i=-2;i<=2;i++){ vec2 g=mg+vec2(i,j),o=hash22(n+g),r=g+o-f; if(dot(mr-r,mr-r)>1e-5) md=min(md,dot(.5*(mr+r),normalize(r-mr))); }
    return vec3(md,hash21(n+mg+7.7),length(mr));
}

// ---- sky ----------------------------------------------------------------------
vec3 skyBase(vec3 rd){
    float y=max(rd.y,0.);
    vec2 rh=normalize(rd.xz+vec2(1e-5)); float sa=max(dot(rh,normalize(gSunDir.xz)),0.);
    vec3 night=mix(vec3(.016,.030,.046),vec3(.0015,.003,.009),pow(y,.45));
    vec3 twH=mix(vec3(.10,.07,.16),vec3(1.5,.42,.10),pow(sa,3.)), twZ=vec3(.02,.045,.14);
    vec3 tw=mix(twH,twZ,smoothstep(0.,.5,pow(y,.6)));
    vec3 dyH=mix(vec3(.34,.36,.48),vec3(1.25,.66,.30),pow(sa,3.)), dyZ=vec3(.05,.13,.34);
    vec3 dy=mix(dyH,dyZ,smoothstep(0.,.6,pow(y,.55)));
    vec3 c=gTod<.5?mix(night,tw,smoothstep(0.,.5,gTod)):mix(tw,dy,smoothstep(.5,1.,gTod));
    c+=gAlert*vec3(.11,.006,.004)*exp(-y*5.)*(.5+.9*A(F_RMS));
    return c;
}
vec3 stars(vec3 rd){
    vec3 c=vec3(0);
    for(int l=0;l<2;l++){
        float sc=l==0?170.:390.; vec3 p=rd*sc, id=floor(p), f=fract(p)-.5; float h=hash31(id+float(l)*7.);
        if(h>.9){ vec3 o=(vec3(hash31(id+1.3),hash31(id+2.7),hash31(id+3.9))-.5)*.6; float d=length(f-o); float b=(h-.9)/.1;
            float h5=hash31(id+5.); float tw=(.7+.3*sin(uTime*(2.+7.*h5)+h*40.))*(1.+gCrowd*(.15+1.3*pow(.5+.5*sin(uTime*(9.+11.*h5)+h*77.),3.)));
            c+=mix(vec3(.65,.78,1.),vec3(1.,.82,.62),hash31(id+4.))*smoothstep(.16,0.,d)*b*b*tw*(l==0?2.2:1.); }
    }
    float mw=exp(-pow(dot(rd,normalize(vec3(.5,.35,-.8)))*3.4,2.));
    c+=vec3(.022,.03,.05)*mw*(.3+fbm(rd.xz*5.+rd.y*3.,4));
    return c;
}
vec3 aurora(vec3 ro,vec3 rd,float jit){
    if(rd.y<.015||gAur<.002) return vec3(0);
    vec3 acc=vec3(0); const int N=44;
    float mid=A(F_MID), hi=A(F_HI);
    for(int i=0;i<N;i++){
        float fi=(float(i)+jit)/float(N);
        float h=mix(1000.,3400.,fi);
        float t=(h-ro.y)/rd.y;
        vec2 q=(ro.xz*.35+rd.xz*t)*.00017;
        vec2 w=q+.5*vec2(fbm(q*.8+vec2(0.,uTime*.014),3),fbm(q*.8+vec2(5.2,-uTime*.011),3))-.25;
        float u=w.y*1.25+.5*sin(w.x*.9+uTime*.04)+.15;
        float id=floor(u), line=1.-abs(fract(u)-.5)*2.;
        float d=pow(line,10.)+.05*pow(line,2.);
        float patch=smoothstep(.3,.62,fbm(vec2(w.x*.9+id*3.7,id*1.3+uTime*.03),3));
        float along=w.x*46.+id*17.;
        float ray=.5+.5*n2(vec2(along,uTime*(.5+1.2*hi)+id*9.));
        float sb=specH(uTime,abs(fract(w.x*.33+id*.37)*2.-1.)*.9+.03);
        float prof=smoothstep(0.,.07,fi)*exp(-fi*3.4);
        vec3 c=mix(gAurLo,gAurHi,smoothstep(.02,.6,fi));
        acc+=c*d*patch*(.35+.65*ray)*prof*(.3+2.2*sb*sb);
    }
    return acc*smoothstep(.015,.22,rd.y)*mix(1.,.3,smoothstep(.35,.9,rd.y))*gAur*(7.5/float(N));
}
vec3 skyFull(vec3 ro,vec3 rd,float jit){
    vec3 c=skyBase(rd);
    float nightK=1.-smoothstep(.12,.62,gTod);
    c+=stars(rd)*nightK*(1.-.8*gStorm)*(.7+.6*A(F_AIR));
    // moon
    float md=dot(rd,gMoonDir);
    c+=nightK*(vec3(1.,.95,.86)*smoothstep(.99992,.99996,md)*9.*(.75+.25*n2(rd.xy*400.))+vec3(.5,.6,.8)*(.02*pow(max(md,0.),300.)+.05*pow(max(md,0.),3000.)));
    c+=aurora(ro,rd,jit);
    // sun
    float sd=max(dot(rd,gSunDir),0.); float up=smoothstep(-.02,.02,gSunDir.y+.012);
    c+=smoothstep(.2,.6,gTod)*(vec3(1.,.55,.2)*(pow(sd,60.)*.9+pow(sd,8.)*.25)*(.4+up)*(1.+.9*gCrowd)+up*vec3(1.,.8,.55)*(smoothstep(.99985,.99995,sd)*40.+pow(sd,1500.)*3.));
    // storm cloud deck
    if(gStorm>.01&&rd.y>.01){
        float t=(900.-ro.y)/rd.y; vec2 q=(ro.xz+rd.xz*t)*.00075+vec2(uTime*.03,uTime*.012);
        float dn=smoothstep(.36,.7,fbm(q,6));
        vec3 cc=mix(vec3(.05,.012,.012),vec3(.22,.03,.02),fbm(q*2.3+4.,3))*(.6+A(F_RMS)*1.4);
        float fl=0.;
        for(int i=0;i<4;i++){ float age=uTime-uST[i]; if(age<0.||age>1.) continue; vec2 cp=(hash22(vec2(uST[i]*13.7,3.))-.5)*5.+ro.xz*.00075+vec2(0.,1.6);
            fl+=exp(-age*10.)*exp(-dot(q-cp,q-cp)*.35)*(.6+.4*sin(age*90.)); }
        cc+=vec3(.75,.7,1.)*fl*5.*(.4+dn);
        c=mix(c,cc,dn*gStorm*smoothstep(.01,.12,rd.y));
        vec3 cf=normalize(gTa-gRo); float yaw=atan(cf.x,cf.z), ra=atan(rd.x,rd.z);
        for(int i=0;i<4;i++){ float age=uTime-uST[i]; if(age<0.||age>.5) continue; float sd_=uST[i]*7.31; if(hash11(sd_+1.)<.4) continue;
            float da=mod(ra-(yaw+(hash11(sd_)-.5)*1.3)+PI,TAU)-PI; float el=rd.y;
            float path=.16*(n2(vec2(el*8.,sd_))-.5)+.05*(n2(vec2(el*38.,sd_+3.))-.5)+.016*(n2(vec2(el*130.,sd_+7.))-.5);
            float d=abs(da-path);
            c+=vec3(.8,.82,1.)*exp(-age*13.)*(.55+.45*step(.5,fract(age*23.)))*(.000022/(d*d+.0000012)+.004/(d+.02))*smoothstep(.5,.4,el)*gStorm; }
    }
    return c;
}

// ---- radar fx on ground -------------------------------------------------------
vec3 radarFx(vec3 p){
    float idx; vec3 q=stLocal(p,idx);
    float r=length(q.xz), az=atan(q.z,q.x);
    float dl=mod(sweepAngle(idx)-az,TAU);
    float cell=gNS>.5?smoothstep(SP*.5,SP*.32,abs(q.x)):1.;
    float fall=smoothstep(6.,30.,r)*exp(-r/330.)*cell;
    vec3 c=gFxCol*(exp(-dl*dl*900.)*2.2+exp(-dl*3.2)*.2)*fall*gBeam;
    for(int i=0;i<8;i++){
        float age=uTime-uKT[i]; if(age<0.||age>2.6) continue;
        float rr=age*240.+9., w=.9+age*1.6; float x=(r-rr)/w;
        c+=gRingCol*(exp(-x*x)+.12*exp(-x*x*.02)*step(x,0.))*uKS[i]*exp(-age*1.9)*cell*1.1*gRing;
    }
    return c;
}
float scopeLines(vec3 p){
    float px=uRes.y/1080.;
    float hl=p.y/3.5; float fw=fwidth(hl)*px; float l=1.-smoothstep(fw*.7,fw*1.7,abs(fract(hl)-.5));
    l*=1.-smoothstep(.25,.6,fw); l*=.45;
    float hm=p.y/17.5; float fm=fwidth(hm)*px; float lm=1.-smoothstep(fm*.9,fm*2.2,abs(fract(hm)-.5)); lm*=1.-smoothstep(.3,.7,fm); l=max(l,lm)+.2*smoothstep(.25,.7,fm);
    vec2 g=p.xz/80.; vec2 fg=fwidth(g)*px; vec2 gl=1.-smoothstep(fg*.6,fg*1.5,abs(fract(g)-.5));
    float idx; vec3 q=stLocal(p,idx); float rr=length(q.xz)/100.; float fr=fwidth(rr)*px;
    float rl=(1.-smoothstep(fr*.7,fr*1.8,abs(fract(rr)-.5)))*step(rr,4.6);
    float sa=atan(q.z,q.x)/(PI/6.); float fs=min(fwidth(sa),.3)*px; float sl=(1.-smoothstep(fs*.6,fs*1.6,abs(fract(sa)-.5)))*step(rr,4.5)*step(.5,rr);
    return l+.3*max(gl.x,gl.y)*(1.-smoothstep(.2,.5,max(fg.x,fg.y)))+.55*rl+.3*sl;
}
vec3 shadeGround(vec3 p,vec3 n,vec3 rd,float t,float ice){
    float steep=1.-n.y;
    float rock=smoothstep(.42,.62,steep+.12*n2(p.xz*.05))*(1.-ice);
    vec3 alb=mix(vec3(.86,.9,.95),vec3(.045,.05,.06),rock);
    alb=mix(alb,vec3(.7,.86,.95),ice*.5);
    float trk=0., vao_=0.;
    if(gVOn>.5&&ice<.5){                                                   // the snowcat's tracks, and its shadow
        float x=p.x; if(x<gVX-1.8&&x>-1250.){ float sl=(vehZ(x+1.)-vehZ(x-1.))*.5; float d=abs(p.z-vehZ(x))/sqrt(1.+sl*sl);
            float w=.30+t*.0014; trk=smoothstep(w+.16,w,abs(d-1.12))*(.7+.3*step(.5,fract(x*2.4)))*smoothstep(900.,160.,t); }
        vec3 vq=vehLocal(p); vao_=smoothstep(1.25,.55,max(abs(vq.x)/3.1,abs(vq.z)/1.7));
    }
    alb*=1.-.42*trk;
    float sh=shadowT(p+n*.5,gKeyDir);
    float dif=max(dot(n,gKeyDir),0.)*sh;
    vec3 col=alb*(gKeyCol*dif+gAmb*(.55+.45*n.y));
    col+=alb*vec3(.006,.014,.028)*(1.-dif)*(1.-gTod*.6);                       // cold bounce in shadow
    vec3 hv=normalize(gKeyDir-rd);
    col+=gKeyCol*glitter(p,n,rd,t)*9.*gGlit*sh*(1.-rock)*(1.-trk)*smoothstep(900.,60.,t);
    col*=1.-.7*vao_;
    col+=gKeyCol*pow(max(dot(n,hv),0.),220.)*.10*sh*(1.-rock);
    // local red wash from the beacon
    float idx; vec3 q=stLocal(p,idx); vec3 bp=TOWER+vec3(0,49.,0); float bd=length(q-bp);
    col+=alb*BEACON*gRed*70./(bd*bd+60.);
    col+=alb*vec3(1.,.55,.2)*(.4+.35*A(F_MID)+.9*A(F_KEYS))*40./(dot(q-DOME,q-DOME)+40.)*(1.-.6*gTod);  // dome lantern spill
    if(gVOn>.5){ col+=alb*vehLight(p,n); vec3 fd=gVP+gVU*3.3-p; col+=alb*AMBER*gFlash*8./(dot(fd,fd)+12.); }
    return col;
}
vec3 shadeStation(vec3 p,vec3 rd,float mat,float t){
    float idx; vec3 q=stLocal(p,idx); vec3 n=stationN(q);
    float dif=max(dot(n,gKeyDir),0.);
    vec3 alb=vec3(.5,.53,.56); vec3 em=vec3(0);
    if(mat<1.5){ // main building: band of small lit windows
        alb=vec3(.42,.46,.5);
        if(abs(n.y)<.5&&q.y>3.6&&q.y<5.4){ float wx=abs(n.x)>.5?q.z:q.x; if(abs(fract(wx/2.6)-.5)<.27) em=vec3(1.,.6,.22)*2.4; }
    } else if(mat<2.5){ // geodesic radome
        vec3 d=normalize(q-DOME); vec3 ad=abs(d); vec3 a3=ad/(ad.x+ad.y+ad.z)*5.;      // barycentric on each octahedron face
        vec3 fl3=floor(a3), fr3=fract(a3);
        float e=min(min(min(fr3.x,1.-fr3.x),min(fr3.y,1.-fr3.y)),min(fr3.z,1.-fr3.z));
        float pid=hash31(fl3+step(0.,d)*vec3(7.,13.,29.)+idx*3.);
        float aa=clamp(.6*length(fwidth(a3)),.004,.6);
        float ln=mix(smoothstep(.028,.028+aa,e),.86,smoothstep(.12,.5,aa));          // 1 on panels, 0 on struts
        alb=mix(vec3(.05,.06,.07),vec3(.7,.74,.8)*(.75+.25*pid),ln);
        float pulse=.25+.5*A(F_MID)+1.3*A(F_KEYS)+.8*A(F_KICK)*step(.5,pid);
        em=gGlowCol*ln*(.35+.65*pid)*pulse*mix(.34,.1,gTod);
        float fr=pow(1.-max(dot(n,-rd),0.),3.); em+=gGlowCol*fr*.12*pulse*mix(1.,.2,gTod);
    } else if(mat<3.5){ alb=vec3(.25,.07,.05); }
    else if(mat<4.5){ // huts
        vec3 h=q-HUT1; if(dot(h,h)>120.){ h=q-HUT2; h.xz=mat2(.8,.6,-.6,.8)*h.xz; }
        alb=h.y>4.3?vec3(.75,.8,.86):vec3(.33,.12,.08);
        if(abs(n.y)<.4&&h.y>1.5&&h.y<3.1){ float wx=abs(n.x)>.5?h.z:h.x; float f=abs(fract(wx/3.2+.5)-.5); if(f<.2) em=vec3(1.,.62,.24)*3.2*(.8+.2*sin(uTime*7.+idx)); }
    } else alb=vec3(.6,.62,.6);
    if(n.y>.75&&mat!=2.) alb=mix(alb,vec3(.86,.9,.95),.8);          // snow on flat tops
    vec3 col=alb*(gKeyCol*dif+gAmb*(.6+.4*n.y));
    vec3 bp=TOWER+vec3(0,49.,0); vec3 bl=bp-q; float bd=length(bl);
    col+=alb*BEACON*gRed*max(dot(n,bl/bd),0.)*160./(bd*bd+30.);
    col+=alb*radarFx(p)*.6;
    col+=alb*vehLight(p,n);
    return col+em;
}
vec3 shadeVeh(vec3 p,vec3 rd,float mat){
    vec3 q=vehLocal(p); vec2 e=vec2(.01,0.);
    vec3 nl=normalize(vec3(vehSDF(q+e.xyy).x-vehSDF(q-e.xyy).x,vehSDF(q+e.yxy).x-vehSDF(q-e.yxy).x,vehSDF(q+e.yyx).x-vehSDF(q-e.yyx).x));
    vec3 n=gVF*nl.x+gVU*nl.y+gVR*nl.z;
    vec3 alb=vec3(.03,.032,.036), em=vec3(0); const vec3 ORG=vec3(.62,.2,.03);
    if(mat<1.5){ float tx=abs(q.x)-1.5; alb*=.55+.45*step(.35,fract(q.x*5.5));                                   // tread bars
        if(abs(nl.z)>.6&&abs(q.y-.56)<.2) alb=mix(alb,vec3(.09),smoothstep(.17,.13,abs(fract(tx*1.25+.5)-.5)*.8)); }          // bogie wheels
    else if(mat<2.5){ alb=ORG;
        if(abs(nl.z)>.5){ alb=mix(alb,vec3(.8,.8,.76),smoothstep(.06,.04,abs(q.y-1.72)));                                      // stripe
            alb*=1.-.6*smoothstep(.022,.008,min(abs(q.x+1.0),abs(q.x-.35))); }                                                 // panel seams
        if(nl.x>.5&&abs(q.z)<.42&&q.y>1.25&&q.y<1.85) alb=mix(vec3(.02),ORG*.5,step(.5,fract(q.y*9.)));                        // grille
        if(q.x<-2.5&&q.y>1.35&&q.y<1.75&&abs(abs(q.z)-.72)<.16) em=vec3(1.,.04,.02)*3.*(.3+gVLamp); }
    else if(mat<3.5){ alb=ORG;
        bool side=abs(nl.z)>.5&&abs(q.x-.8)<.78&&abs(abs(q.x-.8)-.02)>.05, front=nl.x>.4&&abs(q.z)<.76, back=nl.x<-.5&&abs(q.z)<.6;
        if(abs(nl.z)>.5&&q.y<2.45) alb*=1.-.6*smoothstep(.02,.008,abs(abs(q.x-.8)-.74));                                       // door
        if(q.y>2.5&&q.y<3.02&&(side||front||back)){ alb=vec3(.02,.03,.04); em=vec3(1.,.6,.26)*.16;
            vec2 hd=vec2(q.x-1.02,q.y-2.78); float man=min(length(hd)-.15,length(vec2(hd.x*.62,hd.y+.36))-.2);                // someone is driving
            if(side) em*=smoothstep(-.01,.03,man); } }
    else if(mat<4.5){ alb=vec3(.3); em=LAMP*30.*gVLamp*smoothstep(.2,.9,nl.x); }
    else { alb=vec3(.3,.15,.02); em=AMBER*14.*gFlash; }
    if(nl.y>.8&&mat>1.5&&mat<3.5) alb=mix(alb,vec3(.86,.9,.95),.55);                  // snow on the roof and deck
    float dif=max(dot(n,gKeyDir),0.);
    vec3 col=alb*(gKeyCol*dif+gAmb*(.6+.4*n.y));
    float idx; vec3 sq=stLocal(p,idx); vec3 bl=TOWER+vec3(0,49.,0)-sq; float bd=length(bl);
    col+=alb*BEACON*gRed*max(dot(n,bl/bd),0.)*160./(bd*bd+30.);
    col+=alb*radarFx(p)*.6;
    col+=alb*AMBER*gFlash*max(dot(n,normalize(gVP+gVU*3.5+gVF*.5-p)),0.)*1.5;
    return mix(col+em,gFxCol*1.8,gScope*.9);
}

vec3 renderArctic(vec3 ro,vec3 rd,vec2 fc,vec2 uv){
    float jit=hash21(fc+uSeed*17.13);
    const float TMAX=14000.;
    float tw0=rd.y<-1e-4?(-ro.y-6.)/rd.y:TMAX;
    float tT=marchTerrain(ro,rd,min(TMAX,max(tw0,1.)));
    float t=TMAX; int kind=0;
    if(tT>0.){ t=tT; kind=1; }
    if(rd.y<-1e-4){
        float tt=-ro.y/rd.y;
        for(int i=0;i<5;i++){ vec3 p=ro+rd*tt; tt-=(p.y-seaH(p.xz,tt))/rd.y; }
        if(tt>0.&&tt<t){ vec3 p=ro+rd*tt; if(H(p.xz)<p.y){ t=tt; kind=2; } }
    }
    float mat; float tS=marchStation(ro,rd,t,mat); if(tS>0.){ t=tS; kind=3; }
    float vmat; float tV=marchVeh(ro,rd,t,vmat); if(tV>0.){ t=tV; kind=4; }
    vec3 col; vec3 p=ro+rd*t;
    vec3 fogCol=skyBase(normalize(vec3(rd.x,.04,rd.z)));
    if(kind==0) col=skyFull(ro,rd,jit);
    else if(kind==4) col=shadeVeh(p,rd,vmat);
    else if(kind==1){
        vec3 n=terrainN(p.xz,t);
        col=shadeGround(p,n,rd,t,0.);
        vec3 fx=radarFx(p);
        col+=fx*(.35+.65*mix(1.,.3,gTod));
        vec3 sc=(gFxCol*scopeLines(p)*(.32+1.1*min(dot(fx,vec3(.4)),2.5))+fx*.3);
        if(gVOn>.5){ float dv=length(p.xz-gVP.xz);                                   // the scope has a contact
            sc+=vec3(1.,.8,.3)*(smoothstep(1.6,0.,abs(dv-15.))+smoothstep(2.5,0.,abs(dv-26.-18.*fract(uBeat*.5)))*(1.-fract(uBeat*.5)))*1.6; }
        col=mix(col,sc,gScope);
    } else if(kind==2){
        vec3 n=seaN(p.xz,t);
        float cov=mix(.22,.72,smoothstep(-1900.,-500.,p.z));
        vec2 vq=p.xz*.034+.9*vec2(n2(p.xz*.045),n2(p.xz*.045+9.))+.12*vec2(n2(p.xz*.3),n2(p.xz*.3+5.));
        vec3 v=voro(vq);
        float eg=.07+.10*n2(p.xz*.16);
        float ice=step(v.y,cov)*smoothstep(eg,eg+.03,v.x);
        vec3 R=reflect(rd,n); R.y=abs(R.y)+.003; R=normalize(R);
        float F=.02+.98*pow(1.-max(dot(n,-rd),0.),5.);
        vec3 body=mix(vec3(.003,.011,.017),vec3(.02,.06,.08),gTod)+gAlert*vec3(.02,0.,0.);
        vec3 refl=skyFull(p,R,jit);
        vec3 wcol=mix(body,refl,F);
        float sp=pow(max(dot(R,gKeyDir),0.),500.); wcol+=gKeyCol*sp*30.;
        vec3 icol=shadeGround(p,normalize(mix(n,vec3(0,1,0),.8)),rd,t,1.);
        icol*=(.7+.3*smoothstep(eg,eg+.25,v.x))*(.85+.3*n2(p.xz*.4));
        float rim=smoothstep(eg-.03,eg,v.x)*(1.-smoothstep(eg,eg+.03,v.x))*step(v.y,cov)*.35;
        col=mix(wcol,icol,ice)+rim*vec3(.02,.09,.11);
        vec3 fx=radarFx(p);
        col+=fx*mix(.22,.8,ice);
        vec3 sc=gFxCol*(.05*scopeLines(vec3(p.x,0.,p.z))+ice*.06)+fx*.5;
        col=mix(col,sc,gScope);
    } else col=mix(shadeStation(p,rd,mat,t),gFxCol*1.6*(.4+.6*fract(sin(p.y*3.)*4.)),gScope*.85);
    if(kind!=0){
        float dens=mix(.00020,.00085,gStorm)*mix(1.,.45,gScope);
        float f=1.-exp(-t*dens);
        col=mix(col,fogCol*mix(1.,.15,gScope),f);
    }
    gDepth=kind==0?1e5:t;
    // falling snow / rain, in screen space with parallax
    float sn=0.;
    if(gSnow>.01){
        vec3 f=normalize(gTa-gRo); float yaw=atan(f.x,f.z);
        float streak=mix(1.,7.,gStorm);
        for(int l=0;l<4;l++){
            float sc=5.+float(l)*6.5; vec2 q=uv; q=rot(mix(.12,.42,gStorm))*q; q.y/=streak;
            q=q*sc+vec2(yaw*sc*1.2+uTime*.5*(1.+float(l)*.3),uTime*(1.1+.3*float(l))*mix(1.,2.6,gStorm)/streak*2.+f.y*sc);
            vec2 id=floor(q), ff=fract(q)-.5; vec2 o=(hash22(id+float(l)*31.)-.5)*.7; float rr=.035+.05*hash21(id+3.3);
            vec2 dd=ff-o; dd.y*=streak;
            sn+=smoothstep(rr,0.,length(dd))*(1.-float(l)*.18)*step(hash21(id+9.1),gSnow);
        }
    }
    // volumetrics: beams + beacons for each visible station
    float air=mix(1.,2.4,gStorm)+gSnow, beamI=0.;
    for(float i=-gNS;i<=gNS+.5;i+=1.){
        vec3 S=vec3(i*SP,PAD,0.)+DOME+vec3(0,2.,0);
        float th=sweepAngle(i); vec3 bd=normalize(vec3(cos(th),.10,sin(th)));
        if(gBeam>.001){
            vec3 w0=ro-S; float bb=dot(rd,bd), dd=dot(rd,w0), ee=dot(bd,w0); float den=max(1.-bb*bb,1e-4);
            float sc=max((ee-bb*dd)/den,6.); float tc=clamp(dot(S+bd*sc-ro,rd),0.,t);
            sc=max(dot(ro+rd*tc-S,bd),6.);
            float dist=length((ro+rd*tc)-(S+bd*sc)); float rad=1.0+.030*sc;
            float dust=.75+.5*n2(vec2(sc*.05-uTime*.9,i*7.+tc*.01));
            dust+=gSnow*1.6*pow(n2(vec2(sc*1.1-uTime*2.5,tc*.35+i*3.)),4.);                    // flakes crossing the beam
            float I=exp(-pow(dist/rad,2.))/(rad*max(sqrt(den),.10))*exp(-sc/520.)*smoothstep(6.,14.,sc)*dust;
            I+=.25*exp(-pow(dist/(rad*3.),2.))/(rad*3.*max(sqrt(den),.10))*exp(-sc/400.)*smoothstep(6.,14.,sc);
            I*=gBeam*exp(-tc*.00018);
            col+=gFxCol*I*2.2*air*mix(1.,.3,gTod); beamI+=I;
        }
        vec3 B=vec3(i*SP,PAD,0.)+TOWER+vec3(0,49.2,0.);
        float tp=dot(B-ro,rd);
        if(tp>0.&&tp<t+1.5){ float d2=dot(B-ro,B-ro)-tp*tp; float sz=tp*.0011;
            col+=BEACON*gRed*(.9*sz*sz/(d2+sz*sz*.12)+air*.6/(d2+30.)+air*4./(d2+1500.))*exp(-tp*.0003); }
    }
    // the snowcat's lights: headlamp glare and cones, tail lights, amber flasher
    float hl=0.;
    if(gVOn>.5){
        vec3 ax=vehBeamAx();
        for(float sd=-1.;sd<1.5;sd+=2.){
            vec3 Lp=vehLampPos(sd); hl+=coneGlow(ro,rd,t,Lp,ax,.3,.15,34.)*gVLamp;
            float tp=dot(Lp-ro,rd);
            if(tp>0.&&tp<t+.7){ float d2=dot(Lp-ro,Lp-ro)-tp*tp, sz=tp*.0012, face=pow(max(dot(ax,normalize(ro-Lp)),0.),2.);
                col+=LAMP*gVLamp*face*(1.6*sz*sz/(d2+sz*sz*.1)+.10/(d2+1.2)+air*.2/(d2+300.))*exp(-tp*.0002); }
            vec3 Tp=gVP-gVF*2.68+gVU*1.55+gVR*.72*sd; tp=dot(Tp-ro,rd);
            if(tp>0.&&tp<t+.7){ float d2=dot(Tp-ro,Tp-ro)-tp*tp, sz=tp*.001, face=pow(max(dot(-gVF,normalize(ro-Tp)),0.),2.);
                col+=vec3(1.,.05,.02)*(.3+gVLamp)*face*(.5*sz*sz/(d2+sz*sz*.12)+.05/(d2+2.)); }
        }
        hl=min(hl,1.6)*(1.-.92*pow(max(dot(ax,normalize(ro-gVP)),0.),3.)); col+=LAMP*hl*.16*(.3+gSnow*2.+gStorm);   // inside the beam looking back, the scatter is only a halo
        vec3 Fp=gVP+gVU*3.5+gVF*.5; float tp=dot(Fp-ro,rd);
        if(tp>0.&&tp<t+.7){ float d2=dot(Fp-ro,Fp-ro)-tp*tp, sz=tp*.0011;
            col+=AMBER*gFlash*(1.1*sz*sz/(d2+sz*sz*.12)+.25/(d2+4.)+air*1.5/(d2+300.)); }
    }
    col+=sn*((gAmb*2.+gKeyCol*.25+BEACON*gRed*.25+vec3(.25,.3,.12)*gStorm)*.5+gFxCol*beamI*9.+LAMP*hl*1.6);
    return col;
}

// =============================================================================
//  ORBIT WORLD
// =============================================================================
vec3 orbitRot(vec3 p,float a){ p.xz=rot(a)*p.xz; return p; }
float ovalDens(vec3 p,float k,out float lon){
    vec3 m=normalize(vec3(.10,1.,-.06));
    vec3 ex=normalize(cross(m,vec3(0,0,1))), ez=cross(ex,m);
    vec3 d=normalize(p); float cl=acos(clamp(dot(d,m),-1.,1.)); lon=atan(dot(d,ez),dot(d,ex));
    vec2 cs=vec2(cos(lon),sin(lon));
    float c0=.30+.035*sin(lon*2.+uTime*.05)+.04*n3(vec3(cs*2.,uTime*.08))+.06*cos(lon-1.2);
    float w=.014+.02*n3(vec3(cs*3.,3.+uTime*.1));
    float prof=exp(-pow((cl-c0)/w,2.))+.3*exp(-pow((cl-c0-.06)/(w*2.2),2.));
    float rays=.35+.65*n3(vec3(cs*12.,uTime*.7+k*.3));
    float sb=spec(uTime,abs(fract(lon/TAU*3.)*2.-1.)*.9+.03);
    return prof*rays*(.35+2.4*sb*sb);
}
vec3 renderOrbit(vec3 ro,vec3 rd,vec2 fc){
    float jit=hash21(fc+uSeed*5.7);
    vec3 col=stars(rd)*vec3(.9,.95,1.1);
    float b=dot(ro,rd), c=dot(ro,ro)-1., disc=b*b-c;
    vec3 sun=normalize(vec3(.30,-.62,-.72));
    float spin=-1.6+uTime*.004;
    float tHit=disc>0.&&b<0.?-b-sqrt(disc):-1.;
    float red=gAlert;
    vec3 chainCol=mix(vec3(1.,.72,.3),vec3(1.,.1,.05),red);
    if(tHit>0.){
        vec3 n=ro+rd*tHit; vec3 pp=orbitRot(n,spin);
        float lat=asin(clamp(pp.y,-1.,1.)), lon=atan(pp.z,pp.x);
        float cont=fbm3(pp*1.9+vec3(3.,1.,7.),6)+.12*fbm3(pp*9.,3);
        float land=smoothstep(.5,.53,cont);
        float icecap=smoothstep(.93,.955,pp.y+.03*fbm3(pp*14.,3));
        float cloud=smoothstep(.46,.74,fbm3(pp*4.5+vec3(uTime*.004,0,0)+fbm3(pp*2.,3),7));
        float day=dot(n,sun), lit=smoothstep(-.12,.25,day);
        vec3 ocean=vec3(.012,.04,.09), ground=mix(vec3(.05,.07,.04),vec3(.12,.1,.07),fbm3(pp*8.,3));
        vec3 surf=mix(ocean,ground,land); surf=mix(surf,vec3(.75,.82,.9),icecap); surf=mix(surf,vec3(.8),cloud*.75);
        vec3 nightc=surf*vec3(.08,.115,.19)+vec3(.0,.002,.005);
        // city lights
        float pop=smoothstep(.5,.8,fbm3(pp*7.+9.,4))*land*(1.-icecap)*smoothstep(.95,.86,pp.y)*(.25+.75*smoothstep(.12,.0,cont-.53));
        float web=pow(1.-abs(2.*n3(pp*85.)-1.),10.)+pow(1.-abs(2.*n3(pp*33.+5.)-1.),14.);
        float lights=pow(n3(pp*420.),6.)*9.+pow(n3(pp*150.),5.)*3.+web*1.2;
        nightc+=vec3(1.,.70,.36)*lights*pop*(1.-cloud*.85)*.30;
        vec3 dayc=surf*mix(vec3(1.4,.6,.25),vec3(1.2,1.15,1.05),smoothstep(0.,.35,day))*2.2;
        col=mix(nightc,dayc,lit);
        // aurora light spilling on ice & cloud tops
        float ln; float od=ovalDens(n,0.,ln);
        col+=mix(gAurLo,gAurHi,.15)*od*(.05+.25*icecap+.1*cloud)*gAur;
        // the Line: chain of stations along 69N
        const float K=26.; float dl=.058, lon0=.75-12.5*dl;
        float clat=1.204;                        // 69 deg
        float j=clamp(floor((lon-lon0)/dl+.5),0.,K-1.);
        vec3 sp=vec3(cos(clat)*cos(lon0+j*dl),sin(clat),cos(clat)*sin(lon0+j*dl));
        float d=acos(clamp(dot(pp,sp),-1.,1.));
        float wave=feat(F_KICK,uTime-j*.035)+.35*feat(F_SNARE,uTime-(K-j)*.035);
        col+=chainCol*(.000006/(d*d+.0000012))*(.5+2.5*wave);
        float inl=step(lon0-.01,lon)*step(lon,lon0+(K-1.)*dl+.01);
        col+=chainCol*exp(-pow((lat-clat)/.0016,2.))*.10*inl*(.5+wave);
        for(int i=0;i<8;i++){ float age=uTime-uKT[i]; if(age<0.||age>1.6) continue; float rr=age*.028+.002;
            col+=chainCol*exp(-pow((d-rr)/.0012,2.))*uKS[i]*exp(-age*2.6)*.5; }
        // alert spreading from the line
        float spread=gLocal*.085*red; float dlat=abs(lat-clat);
        col+=vec3(1.,.08,.04)*red*inl*(exp(-pow((dlat-spread)/.004,2.))*.9+.4*exp(-pow((dlat-spread*.5)/.003,2.))+.02*smoothstep(spread,0.,dlat))*(.6+A(F_KICK));
        // atmosphere rim
        float rim=pow(1.-max(dot(n,-rd),0.),5.);
        col+=mix(vec3(.04,.11,.30),vec3(1.1,.45,.16),smoothstep(-.3,.0,day)*smoothstep(.4,.0,day))*rim*(.22+1.1*smoothstep(-.35,.15,day));
        col+=vec3(.5,.03,.015)*red*rim*(.25+A(F_SNARE));
    } else {
        float dmin=sqrt(max(dot(ro,ro)-b*b,0.));
        float halo=exp(-(dmin-1.)*90.)*step(b,0.);
        vec3 np=normalize(ro-rd*b); float day=dot(np,sun);
        col+=mix(vec3(.04,.12,.33),vec3(1.3,.5,.18),smoothstep(-.3,.0,day)*smoothstep(.45,.0,day))*halo*(.3+1.6*smoothstep(-.35,.2,day));
        col+=vec3(.6,.04,.02)*red*halo*(.25+A(F_SNARE));
        
    }
    // aurora shells
    vec3 au=vec3(0); const int NSH=26;
    for(int k=0;k<NSH;k++){
        float fk=(float(k)+jit)/float(NSH); float rk=1.004+.045*fk;
        float ck=dot(ro,ro)-rk*rk, dk=b*b-ck; if(dk<0.) continue;
        float sq=sqrt(dk);
        float t1=-b-sq; float lon;
        vec3 cc=mix(gAurLo,gAurHi,smoothstep(0.,.75,fk))*exp(-fk*2.4)*smoothstep(0.,.08,fk+.03);
        if(t1>0.) au+=cc*ovalDens(ro+rd*t1,float(k),lon);
        float t2=-b+sq; if(t2>0.&&tHit<0.) au+=cc*ovalDens(ro+rd*t2,float(k),lon);
    }
    col+=au*gAur*(3.2/float(NSH));
    return col;
}

// =============================================================================
//  SIGNAL TUNNEL  (inside the waveguide: walls are the spectrogram, receding in time)
// =============================================================================
vec3 hotPal(float x){ return mix(mix(vec3(.9,.08,.02),vec3(1.,.55,.08),smoothstep(0.,.5,x)),vec3(1.,.95,.8),smoothstep(.5,1.,x)); }
vec3 coldPal(float x){ return mix(mix(vec3(.02,.12,.3),vec3(.05,.75,.7),smoothstep(0.,.55,x)),vec3(.85,1.,.95),smoothstep(.55,1.,x)); }
vec3 renderTunnel(vec2 uv,vec2 fc){
    float s=gLocal, hot=gHot;
    float roll=s*.11+.4*sin(s*.23)+hot*uBeat*.05;
    vec2 u2=rot(roll)*uv;
    vec3 ro=vec3(.35*sin(s*.7),.3*cos(s*.53),0.), rd=normalize(vec3(u2,mix(1.25,.95,hot)));
    const float R=3.; const float DEL=.030;
    float a=dot(rd.xy,rd.xy), bb=dot(ro.xy,rd.xy), cc=dot(ro.xy,ro.xy)-R*R;
    float t=(-bb+sqrt(bb*bb-a*cc))/a;
    vec3 p=ro+rd*t; float ang=atan(p.x,-p.y);
    float travel=A(F_CUM_RMS)*mix(5.,16.,hot);
    float zs=p.z+travel;
    const float NS_=20.; float cellW=TAU*R/NS_;
    vec2 g=vec2(ang/TAU*NS_, zs/(cellW*.866));
    vec2 sk=vec2(g.x-g.y*.5,g.y); vec2 ci=floor(sk), cf=fract(sk);
    float up=step(1.,cf.x+cf.y);
    float e=up>.5?min(min(1.-cf.x,1.-cf.y),cf.x+cf.y-1.):min(min(cf.x,cf.y),1.-cf.x-cf.y);
    vec2 cen=ci+(up>.5?vec2(2./3.):vec2(1./3.));
    float cang=(cen.x+cen.y*.5)/NS_*TAU; cang=mod(cang+PI,TAU)-PI;
    float cz=cen.y*cellW*.866-travel;
    float band=abs(cang)/PI*.92+.03;
    float delay=max(cz,0.)*DEL;
    float sp=spec(uTime-delay,band);
    float pid=hash21(vec2(mod(ci.x,NS_)+up*37.,ci.y));
    float lvl=pow(smoothstep(.42,.97,sp),1.8)*(.35+1.1*pid*pid);
    vec3 pal=mix(coldPal(lvl),hotPal(lvl),hot);
    vec3 hue=.5+.5*cos(TAU*(vec3(0.,.33,.67)+band*.25+atan(A(F_HUE_S),A(F_HUE_C))/TAU));
    pal=mix(pal,pal*(.4+1.4*hue),.45*hot);
    float fw=fwidth(e)*1.2+.012;
    float strut=1.-smoothstep(.035,.035+fw,e);
    float kw=feat(F_KICK,uTime-p.z*DEL), sw=feat(F_SNARE,uTime-p.z*DEL);
    vec3 col=pal*(lvl*2.4+.012)*(1.-strut);
    col+=mix(vec3(.1,.5,.6),vec3(1.,.3,.08),hot)*strut*(.12+1.3*kw+.8*sw*step(.6,pid));
    float fog=exp(-p.z*.05);
    col*=fog;
    // light at the end
    float r2=dot(u2,u2);
    vec3 endc=mix(vec3(.5,.9,1.),vec3(1.,.7,.45),hot);
    col+=endc*(.0035/(r2+.0025))*(.4+1.2*A(F_RMS))+endc*gWhite*2.5*exp(-r2*2.);
    // the filament: the guitar's pitch, traced back through time down the axis
    {
        float glow=0., core=0.; vec2 prev=vec2(0); float pz=0.;
        for(int k=0;k<72;k++){
            float fz=float(k)/71.; float z=.5+90.*fz*fz;
            float tt=uTime-z*DEL;
            float ld=feat(F_LEAD,tt), en=feat(F_GTR,tt);
            float ph=z*.22+s*1.3;
            vec2 c=(ld-.5)*2.7*vec2(cos(ph),sin(ph))+.25*vec2(sin(z*.9+s*3.),cos(z*.7-s*2.));
            vec2 sc=(c-ro.xy)/z*mix(1.25,.95,hot);
            if(k>0){ vec2 pa=u2-prev, ba=sc-prev; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-7),0.,1.); float d=length(pa-ba*h);
                float wdt=.034/(mix(pz,z,h)+.5);
                float f=exp(-mix(pz,z,h)*.035)*(.12+1.1*en*en);
                core=max(core,exp(-d*d/(wdt*wdt))*f); glow+=f*wdt*.0035/(d*d+wdt*wdt*.5+1e-5)*(1.+fz*3.); }
            prev=sc; pz=z;
        }
        col+=mix(vec3(.8,.97,1.)*core*2.4+coldPal(.62)*glow*1.0, vec3(1.,.97,.9)*core*3.+hotPal(.55)*glow*1.3*(.6+.8*hue), hot);
    }
    return col;
}

// =============================================================================
//  TIMELINE
// =============================================================================
// camera angles for the fast-cut passages. s = seconds since the cut, k = ordinal of the shot
void angle(int id,float s,float k,inout vec3 ro,inout vec3 ta,inout float fl,inout float roll,inout float shake){
    float sg=mod(k,2.)<.5?1.:-1.; vec3 V=gVP,F=gVF,R=gVR,U=vec3(0,1,0), ST=vec3(0.,PAD,0.);
    roll=0.; gTop=0.; gDof=0.;
    if(id==1){        // beside the snowcat, low, the station beyond
        ro=V+R*10.5-F*(4.5-s*1.1)*sg+U*1.5; ta=V+F*5.5*sg+U*2.1; fl=1.55; gDof=7.; gFocus=length(V-ro); gMinH=1.1; shake*=.4; gNS=2.;
    } else if(id==2){ // head-on, long lens, the lamps coming at us
        float x0=gVX-uShotV*s; ro=vehAt(x0+38.)+U*1.25+vec3(0.,0.,2.4*sg); ta=V+U*1.7; fl=2.0; gDof=9.; gFocus=length(V-ro); gMinH=.9; shake*=.3; gNS=2.;
    } else if(id==3){ // riding behind and above, the station ahead
        ro=V-F*12.+U*5.2+R*2.4*sg; ta=mix(V+F*40.+U*5.,ST+U*25.,.35); fl=1.1; gMinH=2.; shake*=.6; gNS=2.;
    } else if(id==4){ // straight down on the snowcat: lamp pool, tracks, rings crossing
        gTop=1.; ro=V+U*(64.+s*5.)+F*4.; ta=V+F*5.; roll=.9*sg+s*.07; fl=1.35; gSnow*=.4; shake*=.3; gNS=2.;
    } else if(id==5){ // at the foot of the tower, looking up at the beacon
        vec3 T0=ST+TOWER; ro=T0+vec3(7.5*sg,2.4,-9.5); ta=T0+vec3(-1.*sg,38.+s*1.5,1.); fl=.82; roll=.22*sg+s*.035; gMinH=1.5; gNS=1.; gAur*=.6;
    } else if(id==6){ // the radome, long lens
        ro=ST+vec3((-44.+s*1.4)*sg,7.5,-58.); ta=ST+DOME+vec3(0.,1.,0.); fl=2.4; gDof=8.; gFocus=length(ta-ro)-8.; gNS=1.; shake*=.4;
    } else if(id==7){ // past the huts to the dome
        ro=ST+vec3(-47.+s*.9,2.3,31.); ta=ST+vec3(-14.,8.5,-2.); fl=1.55; gDof=8.; gFocus=24.; gMinH=1.6; gNS=1.; shake*=.4;
    } else if(id==8){ // skimming the sea toward the shore
        ro=vec3((150.-s*8.)*sg,0.,-930.+s*42.); ro.y=6.+seaH(ro.xz,0.)*.7; ta=vec3(0.,85.,0.); fl=1.45; roll=.05*sg; gNS=2.;
    } else if(id==9){ // high along the Line
        ro=vec3(-1150.+k*60.+s*74.,170.+s*13.,-380.-s*6.); ta=ro+vec3(.8,-.36,.48)*100.; fl=1.15; roll=-.05; gNS=4.;
    } else if(id==10){ // on our back under the sky, the tower leaning in
        ro=ST+vec3(46.*sg,2.5,-34.); ta=ro+vec3(-.42*sg,.62,.5)*100.+vec3(0.,s*2.,0.); fl=.8; roll=.1*sg; gMinH=1.5; gNS=1.; shake*=.5;
    } else if(id==11){ // whip past the station
        ro=ST+vec3(-150.+s*52.,9.+s*1.5,-44.*sg); ta=ST+vec3(6.,22.,0.); fl=.95; roll=-.08*sg; gNS=2.;
    } else if(id==12){ // cut to orbit: the Line from above
        gWorld=1; gLocal=gStorm>.5?9.:1.5+s; float an=.02+k*.03+s*.03; vec3 dH=vec3(sin(an),0.,cos(an));
        ro=(cos(.56)*vec3(0,1,0)+sin(.56)*dH)*1.36; ta=vec3(sin(an)*.1,.83,-.12); fl=1.5+s*.05; roll=-.1+.15*sg; shake=.5;
    } else if(id==13){ // scope over the mountains, lit by the lightning
        float fla=0.; for(int i=0;i<4;i++){ float age=uTime-uST[i]; if(age>=0.) fla+=exp(-age*9.); }
        gScope=1.-clamp(fla*.55,0.,.8); gSnow=0.; gNS=4.;
        ro=vec3(-700.+k*40.+s*88.,330.,250.+s*30.); ta=ro+vec3(.72,-.5,.5)*100.; fl=1.05; roll=.1*sg; shake=.6;
    } else if(id==14){ // close orbit of the station
        float an=-.9+k*.9-s*.21; ro=vec3(cos(an)*86.+6.,0.,sin(an)*86.); ro.y=gy(ro.xz)+6.5+2.*sin(s*.5); ta=vec3(10.,36.,-2.); fl=1.0; roll=.06*sg; gDof=4.; gFocus=86.; gNS=1.;
    } else if(id==15){ // the snowcat pulls in; first sun on it
        ro=V+vec3(-17.+s*.25,1.4,-13.); ta=V+U*1.9+F; fl=1.7; gDof=7.; gFocus=length(V-ro); gMinH=1.; shake*=.3; gNS=1.;
    } else if(id==16){ // the sun coming up behind the tower
        vec3 T0=ST+TOWER; ro=T0-vec3(.34,0.,-.94)*125.+vec3(-6.+s*.9,7.,0.); ta=T0+vec3(0.,30.,0.); fl=1.9; gDof=5.; gFocus=125.; gNS=1.; shake*=.3; gBeam=.18;   // the beam would sweep straight down this long lens
    }
}

void setup(float t){
    float kick=A(F_KICK),rms=A(F_RMS),snare=A(F_SNARE);
    float sub=.45*A(F_SUB)+.6*A(F_BASSN);                              // the sea moves with the bass guitar
    float mid=clamp(.3*A(F_MID)+.8*A(F_VOX)+.45*A(F_KEYS),0.,1.5);     // the aurora sings with the voice and the synths
    gCrowd=clamp(A(F_CROWD),0.,1.2);
    gWorld=0; gTod=0.; gAlert=0.; gScope=0.; gStorm=0.; gBeam=1.; gAur=1.; gNS=1.; gFade=1.; gSnow=.22; gSeaAmp=.5;
    gWhite=0.; gRing=1.; gSweepMul=1.; gHot=0.; gLocal=t; gRed=0.; gTop=0.;
    gDof=0.; gFocus=100.; gMinH=3.5; gGlit=1.+6.*gCrowd;
    float shake=0.; float fl=1.3; vec3 ro,ta; float roll=0.;
    if(t<T1){
        float s=t; gBeam=0.; gRing=0.; gAur=.25+smoothstep(2.,22.,s)*(.5+mid*2.2); gFade=smoothstep(.3,5.,s);
        ro=vec3(52.-s*.6,0.,-345.+s*4.6); ro.y=gy(ro.xz)+6.5+s*.1;
        ta=mix(vec3(-140.,560.,640.),vec3(6.,33.,0.),smoothstep(1.,21.5,s)); fl=1.2;
    } else if(t<T2){
        float s=t-T1,u=s/(T2-T1); gLocal=s; gWhite=.4*exp(-s*9.); gAur=.6+mid*1.6;
        float an=-1.41+s*.075; float r=mix(233.,78.,u*u*(3.-2.*u));
        ro=vec3(cos(an)*r,0.,sin(an)*r); ro.y=gy(ro.xz)+mix(9.,22.,u)+2.*sin(s*.4)*u;
        ta=vec3(8.,mix(34.,30.,u),0.); fl=1.25; shake=.5; gDof=3.; gFocus=r;
    } else if(t<T3){
        float s=t-T2; gLocal=s; gSeaAmp=.8+3.6*sub; gAur=.8+mid*1.7; gSnow=.12; gNS=2.;
        ro=vec3(-520.+s*36.,0.,-1080.+s*6.); ro.y=6.+seaH(ro.xz,0.)*.8+s*.25;
        ta=ro+vec3(.74,-.015+.02*sin(s*.5),.67)*100.; fl=1.05; roll=.035*sin(s*.6); shake=.3;
    } else if(t<T4){
        float s=t-T3,u=s/(T4-T3); gLocal=s; gScope=smoothstep(0.,.25,s); gNS=4.; gAur=.3+mid*.6; gSnow=0.;
        ro=vec3(-1500.+s*104.,0.,-70.+50.*sin(s*.16)); ro.y=95.+25.*sin(s*.21+1.);
        ta=ro+vec3(.9,-.33,.28+.2*sin(s*.13))*100.; fl=1.1; roll=.07*sin(s*.3);
        if(t>=T3B){ float s2=t-T3B,v=s2/(T4-T3B); gNS=1.; gTop=1.;
            ro=vec3(40.*sin(s2*.21),mix(620.,250.,v*v*(3.-2.*v)),-10.+40.*cos(s2*.17)); ta=vec3(0.,14.,0.); roll=.6+s2*.085; fl=1.3; }
    } else if(t<T5){
        float s=t-T4,u=s/(T5-T4); gLocal=s; gAlert=u*u*.85; gRed=.3+gAlert; gSeaAmp=.9+3.4*sub; gAur=.9+mid*1.6; gNS=2.; gSnow=.2;
        ro=vec3(260.-s*8.,0.,-2050.+s*96.); ro.y=6.+seaH(ro.xz,0.)*.7+u*u*10.;
        ta=vec3(0.,90.,0.); fl=mix(1.0,1.35,u); shake=.4+u;
    } else if(t<T6){            // chorus 1: red alert, cut every two bars
        float s=t-T5; gLocal=s; gAlert=1.; gRed=1.; gSweepMul=2.; gAur=.8+mid*1.5; gSnow=.4; gStorm=.25; gWhite=.7*exp(-s*5.); gNS=2.; gSeaAmp=.9+3.*sub;
        float an=-.9-s*.21; float r=86.+10.*sin(s*.4);
        ro=vec3(cos(an)*r+6.,0.,sin(an)*r); ro.y=gy(ro.xz)+5.5+3.*sin(s*.5);
        ta=vec3(10.,36.,-2.); fl=1.0; shake=1.3; roll=.06*sin(s*1.1); gDof=4.; gFocus=r;
    } else if(t<T8){
        gWorld=1; float s=t-T6; gLocal=s; gAur=.8+mid*1.8;
        float u=smoothstep(0.,T7-T6,s);
        float an=-.50+s*.016; vec3 dH=vec3(sin(an),0.,cos(an)); float e=u*u*(3.-2.*u); e=mix(e,u,.35);
        float c1=mix(.52,.56,e), c2=mix(.12,.0,e);
        ro=(cos(c1)*vec3(0,1,0)+sin(c1)*dH)*mix(1.04,1.42,e);
        ta=mix((cos(c2)*vec3(0,1,0)+sin(c2)*dH)*.985,vec3(sin(an)*.1,.83,-.12),e); fl=mix(.95,1.45,e); roll=mix(.22,-.10,e);
        if(t>T7){ float s2=t-T7,v=s2/(T8-T7); gLocal=s2; gAlert=smoothstep(0.,.25,v);
            vec3 tgt=normalize(vec3(sin(-.13)*.36,.934,cos(-.13)*.36)); float e=v*v*v;
            ro=mix(ro,tgt*1.012,e*.985); ta=mix(ta,tgt*.99+vec3(.02,-.05,-.3),smoothstep(.2,1.,v)); fl=mix(fl,.8,e); roll=-.12-v*v*.9;
            gWhite=smoothstep(.94,1.,v)*1.6; shake=v*2.; }
    } else if(t<T8C){           // chorus 2: the storm, cut every two bars
        float s=t-T8; gLocal=s; gAlert=1.; gRed=1.; gStorm=1.; gSnow=.6; gSweepMul=2.; gAur=.5; gWhite=1.2*exp(-s*4.); gSeaAmp=1.5+4.*sub; gNS=2.;
        ro=vec3(-150.+s*8.5,0.,120.-s*5.); ro.y=gy(ro.xz)+5.+1.5*sin(s*.8);
        ta=vec3(4.,34.,0.); fl=1.25; shake=1.5; roll=.05*sin(s*.9); gDof=3.5; gFocus=length(ta-ro);
    } else if(t<T9){            // the solo begins over the storm sea
        float s=t-T8C; gLocal=s; gAlert=1.; gRed=1.; gStorm=1.; gSnow=.7; gSweepMul=2.; gAur=.5; gSeaAmp=1.5+4.2*sub; gNS=2.;
        ro=vec3(190.-s*5.,0.,-1010.+s*13.); ro.y=7.+seaH(ro.xz,0.)*.85;
        ta=vec3(0.,80.,0.); fl=1.3; roll=.07*sin(s*.7); shake=1.2;
    } else if(t<T11){
        gWorld=2; float s=t-T9; gLocal=s; gHot=step(T10,t);
        gWhite=(t<T10?.9*exp(-s*3.5):.9*exp(-(t-T10)*4.)+smoothstep(T11-1.3,T11,t)*1.4);
        ro=vec3(0); ta=vec3(0,0,1);
    } else if(t<T12){
        float s=t-T11,u=s/(T12-T11); gLocal=s; gNS=4.; gAur=1.5+mid*2.2; gAlert=.0; gRed=.6; gSnow=.1; gWhite=1.3*exp(-s*3.);
        ro=vec3(-1500.+s*92.,250.+s*4.,-760.+s*10.); ta=ro+vec3(.72,-.15,.63)*100.; fl=.95; roll=.06*sin(s*.3); shake=.6;
        if(t<T11B){ gSeaAmp=.8+2.6*sub; ro=vec3(-700.+s*64.,0.,-1500.+s*58.); ro.y=9.+seaH(ro.xz,0.)*.6+s*1.2; ta=ro+vec3(.48,.17,.86)*100.; fl=.85; roll=.08*sin(s*.5); }
    } else if(t<T12B){          // last chorus: the alert gives way to dawn
        float s=t-T12,u=s/(T12B-T12); gLocal=s; gTod=mix(.14,.62,u); gAur=(1.-u)*(1.+mid*1.6); gRed=.8; gSnow=.15*(1.-u); gNS=2.; gWhite=.5*exp(-s*4.);
        float an=2.35-s*.03; float r=mix(128.,86.,u);
        ro=vec3(cos(an)*r,0.,sin(an)*r); ro.y=gy(ro.xz)+9.+u*8.;
        ta=vec3(4.,31.,0.); fl=1.3; shake=.5; gDof=3.5; gFocus=r;
    } else if(t<T13){
        float s=t-T12B,u=s/(T13-T12B); gLocal=s; gTod=mix(.62,.95,u); gAur=0.; gRed=.6; gSnow=.05; gNS=3.;
        ro=vec3(-70.-s*5.,0.,150.+s*7.); ro.y=gy(ro.xz)+11.+s*s*.22; ta=vec3(30.,26.,-120.); fl=mix(1.3,1.05,u); shake=.4;
    } else {
        float s=t-T13; gLocal=s; gTod=1.; gAur=0.; gRed=.5; gSnow=.05; gNS=3.; gRing=exp(-s*.6);
        ro=vec3(-205.-s*2.,163.+s*2.,345.+s*3.); ta=vec3(30.,26.,-120.); fl=1.05;
        gFade=1.-smoothstep(2.2,6.6,s);
    }
    // the snowcat, then the fast-cut camera if one is active
    vehSetup(vehX(t)+uShotV*max(t-uShotT0,0.));
    gVLamp=1.-smoothstep(281.5,284.5,t);
    gFlash=(t<T1?pow(max(sin(t*3.),0.),8.):pow(1.-A(F_BEATPHASE),5.))*(1.-smoothstep(281.,283.,t));
    if(uShotId>0) angle(uShotId,t-uShotT0,uShotK,ro,ta,fl,roll,shake);
    gVOn=gWorld==0?1.:0.;
    // sweep
    gSweepAbs=uBeat*(TAU/8.)*gSweepMul+1.2;
    if(t>=T13){ float s=t-T13; gSweepAbs=2.+(1.-exp(-.45*s))/.45*1.9; gBeam=exp(-s*.25); }
    // camera shake + kick punch
    vec3 sh=vec3(n2(vec2(t*11.,1.))-.5,n2(vec2(t*13.,7.))-.5,n2(vec2(t*9.,13.))-.5);
    if(gWorld==0){ ro.y=max(ro.y,textureLod(uHeight,ro.xz/8192.+.5,1.5).r+gMinH); ta+=sh*shake*(.35+2.2*kick)*min(1.,length(ta-ro)/90.); fl*=1.-.022*kick*shake; }
    else if(gWorld==1){ ta+=sh*shake*.004*(1.+kick); }
    cam(ro,ta,fl,roll);
    // lighting rig
    gMoonDir=normalize(vec3(.78,.2,.59));
    gSunDir=normalize(vec3(.34,mix(-.13,.105,smoothstep(.1,1.,gTod)),-.94));
    float sunK=smoothstep(.44,.66,gTod);
    gKeyDir=normalize(mix(gMoonDir,gSunDir+vec3(0,.02,0),step(.5,sunK+.001)));
    vec3 moonC=vec3(.20,.27,.40)*(1.-.75*gStorm)*(1.-smoothstep(.2,.5,gTod));
    vec3 sunC=mix(vec3(1.5,.5,.15),vec3(1.5,.92,.5),smoothstep(.62,1.,gTod))*sunK;
    gKeyCol=sunK>0.?sunC:moonC;
    // aurora palette
    vec3 lo=vec3(.10,1.,.42), hiC=vec3(.55,.18,.95);
    if(t>=T11&&t<T12){ float hh=atan(A(F_HUE_S),A(F_HUE_C))/TAU; lo=.55+.45*cos(TAU*(vec3(0.,.33,.67)+hh+.3)); hiC=.55+.45*cos(TAU*(vec3(0.,.33,.67)+hh+.62)); lo=mix(vec3(.1,1.,.42),lo,.7); }
    gAurLo=mix(lo,vec3(1.,.07,.035),gAlert); gAurHi=mix(hiC,vec3(.55,.0,.12),gAlert);
    float aI=gAur*(.4+mid);
    gAmb=mix(vec3(.010,.017,.028),vec3(.075,.10,.17),smoothstep(.1,1.,gTod))+gAurLo*.007*aI+vec3(.012,.001,.0008)*gAlert*(.5+rms);
    if(gStorm>.01){ float fla=0.; for(int i=0;i<4;i++){ float age=t-uST[i]; if(age>=0.) fla+=exp(-age*10.); } gAmb+=vec3(.16,.15,.24)*fla*gStorm; }
    gFxCol=mix(mix(vec3(.12,1.,.55),vec3(.3,.9,1.),.25),vec3(1.,.12,.05),gAlert);
    gRingCol=mix(vec3(.55,.95,1.),vec3(1.,.3,.1),gAlert);
    gGlowCol=mix(vec3(1.,.62,.25),vec3(1.,.07,.03),clamp(gAlert,0.,1.));
    float blink=gAlert>.5?pow(1.-A(F_BEATPHASE),3.)*1.5+.15:pow(max(sin(t*2.4),0.),24.)+.04;
    gRed*=blink;
}

//#KIT
void main(){
    vec2 fc=gl_FragCoord.xy+uJit;
    vec2 uv=(fc-.5*uRes)/uRes.y*2.;
    setup(uTime);
    vec3 f=normalize(gTa-gRo), up=gTop>.5?vec3(sin(gRoll),0.,cos(gRoll)):vec3(sin(gRoll),cos(gRoll),0.);
    vec3 r=normalize(cross(up,f)), u=cross(f,r);
    vec3 rd=normalize(uv.x*r+uv.y*u+gFl*f);
    vec3 col; gDepth=1e5;
    if(gWorld==0) col=renderArctic(gRo,rd,fc,uv);
    else if(gWorld==1) col=renderOrbit(gRo,rd,fc);
    else col=renderTunnel(uv,fc);
    col+=vec3(1.,.96,.9)*gWhite*(gWorld==2?0.:1.);
    // the ghost kit, bottom right: about a third of the width, transparent around the drums
    float kitA=0.; vec4 kit=vec4(0.);
    { vec2 kc=vec2(uRes.x/uRes.y-.72,-.337); float ks=.62; vec2 q=(uv-kc)/ks+vec2(.05,0.);
      if(uKitDbg>.5) q=uv*1.05;
      if(uKitDbg>.5||(abs(q.x-.05)<1.16&&abs(q.y)<1.07)){ kit=kitRender(q); kitA=kit.a*smoothstep(1.5,5.,uTime);
        if(uKitDbg<.5) kitA*=smoothstep(1.16,1.02,abs(q.x-.05))*smoothstep(1.07,.95,abs(q.y)); } }      // nothing is ever cut off by the edge of its window
    col*=gFade;
    // circle of confusion in pixels at 2160p (negative in front of the focal plane); the sky is held back so stars survive
    float coc=0.;
    if(gWorld==0&&gDof>0.){ coc=gDepth>9e4?gDof*.35:clamp(gDof*(1.-gFocus/max(gDepth,.5)),-2.5*gDof,gDof); }
    fragColor=vec4(max(col,0.),coc);
    fragKit=vec4(max(kit.rgb,0.)*kitA*gFade,kitA);
}
