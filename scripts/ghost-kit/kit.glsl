// =============================================================================
//  THE GHOST KIT, v2 — a double-bass kit in the bottom-right corner that turns, flies apart and reassembles.
//  Analytic ray tracing (cylinders, discs, capsules); every piece carries its own offset so the sticks follow it.
//  Pieces: 0 kick R 1 snare 2 hi-hat 3-6 rack toms 7,8 floor toms 9 ride 10 crash L 11 crash R 12 china 13 kick L
// =============================================================================
uniform float uHitT[14];     // last hit time of each piece
uniform float uHitV[14];     // and its velocity
uniform vec4  uStk[2];       // per hand: previous hit time, previous piece, next hit time, next piece
uniform vec4  uStkV[2];      // per hand: previous velocity, next velocity
uniform vec4  uFoot[2];      // per foot: previous kick time, next kick time, previous velocity, next velocity
uniform float uHatOpen;      // 0 closed .. 1 open
uniform float uKitDbg;

struct Drum{ vec3 c; vec3 a; float r; float h; };
struct Cym{ vec3 c; vec3 n; float r; };
const Drum DR[9]=Drum[9](
    Drum(vec3(.34,.32,.30),  vec3(0.,0.,-1.),            .30, .19),      // kick R (axis points at the batter head)
    Drum(vec3(0.,.64,-.34),  vec3(0.,.9995,.03),         .178,.075),     // snare
    Drum(vec3(-.52,.99,.12), vec3(.112,.930,-.353),      .105,.09),      // 8
    Drum(vec3(-.22,1.02,.22),vec3(.046,.927,-.371),      .13, .10),      // 10
    Drum(vec3(.10,1.02,.24), vec3(-.028,.928,-.371),     .155,.11),      // 12
    Drum(vec3(.46,.99,.14),  vec3(-.130,.932,-.336),     .168,.12),      // 13
    Drum(vec3(.80,.52,-.22), vec3(-.030,.9988,-.040),    .19, .19),      // floor 15
    Drum(vec3(.82,.50,-.66), vec3(-.050,.9983,.030),     .205,.20),      // floor 16
    Drum(vec3(-.34,.32,.30), vec3(0.,0.,-1.),            .30, .19));     // kick L
const Cym CY[5]=Cym[5](
    Cym(vec3(-.68,.92,-.30), vec3(0.,1.,0.),             .178),          // hi-hat
    Cym(vec3(.94,1.08,.20),  vec3(-.233,.932,-.280),     .255),          // ride
    Cym(vec3(-.82,1.38,.30), vec3(.188,.940,-.282),      .215),          // crash L
    Cym(vec3(.34,1.50,.56),  vec3(-.047,.943,-.330),     .23),           // crash R
    Cym(vec3(1.20,1.30,-.20),vec3(-.287,.957,.048),      .235));         // china
const vec3 SEAT=vec3(0.,.95,-.82), KITC=vec3(.12,.80,0.);

float kT; vec3 kN; int kM; int kI;     // nearest hit: distance, normal, material, piece
vec3 gDc[9]; vec3 gCc[5]; vec3 gCyN[5]; vec3 gStA[2], gStB[2]; vec3 gBeat[2]; float gPed[2];
float gKE,gKO,gRet,gLift; vec3 gKL;

int drumOf(int p){ return p==13?8:(p<=1?p:p-1); }
int pieceOfDrum(int i){ return i==8?13:(i<=1?i:i+1); }

vec4 cylI(vec3 ro,vec3 rd,vec3 pa,vec3 pb,float ra){
    vec3 ba=pb-pa, oc=ro-pa; float baba=dot(ba,ba), bard=dot(ba,rd), baoc=dot(ba,oc);
    float k2=baba-bard*bard, k1=baba*dot(oc,rd)-baoc*bard, k0=baba*dot(oc,oc)-baoc*baoc-ra*ra*baba;
    float h=k1*k1-k2*k0; if(h<0.) return vec4(-1.);
    h=sqrt(h); float t=(-k1-h)/k2; float y=baoc+t*bard;
    if(y>0.&&y<baba) return vec4(t,(oc+t*rd-ba*y/baba)/ra);
    t=((y<0.?0.:baba)-baoc)/bard;
    if(abs(k1+k2*t)<h) return vec4(t,ba*sign(y)/sqrt(baba));
    return vec4(-1.);
}
float capI(vec3 ro,vec3 rd,vec3 pa,vec3 pb,float ra){
    vec3 ba=pb-pa, oa=ro-pa; float baba=dot(ba,ba), bard=dot(ba,rd), baoa=dot(ba,oa), rdoa=dot(rd,oa), oaoa=dot(oa,oa);
    float a=baba-bard*bard, b=baba*rdoa-baoa*bard, c=baba*oaoa-baoa*baoa-ra*ra*baba, h=b*b-a*c;
    if(h>=0.){ float t=(-b-sqrt(h))/a; float y=baoa+t*bard;
        if(y>0.&&y<baba) return t;
        vec3 oc=y<=0.?oa:ro-pb; b=dot(rd,oc); c=dot(oc,oc)-ra*ra; h=b*b-c; if(h>0.) return -b-sqrt(h); }
    return -1.;
}
void kCap(vec3 ro,vec3 rd,vec3 a,vec3 b,float r,int m){
    if(r<5e-4) return; float t=capI(ro,rd,a,b,r);
    if(t>1e-3&&t<kT){ kT=t; vec3 p=ro+rd*t, ba=b-a, pa=p-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); kN=(pa-h*ba)/r; kM=m; kI=-1; }
}
// hardware belongs to a piece: it travels with it, and telescopes into it when the piece leaves the floor
vec3 hw(vec3 P,vec3 off,vec3 c){ return mix(P+off,c,gRet); }
void kStand(vec3 ro,vec3 rd,vec3 base,vec3 off,vec3 c,float top,float ang){
    float rr=1.-gRet; vec3 b0=hw(base,off,c), b1=hw(base+vec3(0.,top,0.),off,c);
    kCap(ro,rd,b0,b1,.011*rr,5); kCap(ro,rd,b1,c-vec3(0.,.012,0.),.009*rr,5);
    for(int i=0;i<3;i++){ float a=ang+float(i)*2.0944; kCap(ro,rd,hw(base+vec3(0.,.24,0.),off,c),hw(base+vec3(cos(a),0.,sin(a))*.2,off,c),.009*rr,5); }
}
// where a stick lands on each piece: the side of the head nearest the player, a little different every time
vec3 hitPoint(int p,float seed){
    vec3 c,n; float r,k;
    if(p==2||(p>=9&&p<=12)){ int i=p==2?0:p-8; c=gCc[i]; n=CY[i].n; r=CY[i].r; k=p==2?.72:(p==9?.55:.86); if(p==2) c+=n*(.008+.028*uHatOpen); }
    else { int i=drumOf(p); c=gDc[i]+DR[i].a*DR[i].h; n=DR[i].a; r=DR[i].r; k=.36; }
    vec3 d=SEAT-c; d-=n*dot(d,n); d=normalize(d); vec3 s=cross(n,d);
    return c+d*(r*k+(hash11(seed*7.31)-.5)*.03)+s*(hash11(seed*3.17+2.)-.5)*.05+n*.012;
}
// ---- the tricks: where the kit's camera is, and whether the kit is whole, breathing, exploded or in orbit ----
void kitTricks(out float az,out float el,out float roll,out float zoom){
    float t=uTime, b=uBeat;
    float kp=max(exp(-max(t-uHitT[0],0.)*9.)*uHitV[0],exp(-max(t-uHitT[13],0.)*9.)*uHitV[13]);
    float sp=exp(-max(t-uHitT[1],0.)*9.)*uHitV[1];
    gKE=0.; gKO=0.; gLift=0.; roll=0.; zoom=1.; az=PI; el=.78;
    if(t<T1){            // the kit wakes: pieces drop in one at a time while the camera circles
        az=PI-1.3+t*.052; el=.60;
    } else if(t<T2){     // the band comes in: one slow turn all the way round
        float u=(t-T1)/(T2-T1); az=PI+TAU*u*u*(3.-2.*u); el=.70-.14*sin(u*PI);
    } else if(t<T3){     // straight down on the heads, turning
        float u=(t-T2)/(T3-T2); el=mix(.70,1.42,smoothstep(0.,.22,u)); roll=u*2.4;
    } else if(t<T4){     // verse 1: low three-quarter views, drifting round
        float s=t-T3; az=PI+s*.17; el=.46+.10*sin(s*.23);
    } else if(t<T5){     // the build: closing in and rising
        float u=(t-T4)/(T5-T4); az=PI+(T4-T3)*.17+u*1.3; el=mix(.5,1.0,u); zoom=mix(1.,1.16,u);
    } else if(t<T6){     // chorus 1: a full spin on the downbeat, then a fast orbit; the kit breathes out on every kick
        float s=t-T5; az=PI+TAU*smoothstep(0.,1.6,s)+s*.42; el=.72+.14*sin(s*.5); gKE=.10*kp; roll=.10*sin(s*.8);
    } else if(t<T8){     // in orbit: the pieces leave the floor and circle in two rings, then fall back as the alert spreads
        float s=t-T6; gKO=smoothstep(0.,7.,s)*(1.-smoothstep(T7-3.5,T7-.3,t)); az=PI+s*.07; el=mix(.72,1.02,gKO); zoom=mix(1.,.84,gKO); roll=.25*gKO*sin(s*.2);
        if(t>T7){ float v=(t-T7)/(T8-T7); az=PI+(T7-T6)*.07+TAU*v*v; el=mix(.72,.5,v); zoom=mix(1.,1.18,v); }
    } else if(t<T8C){    // chorus 2, the storm: the whole kit tumbles once and jumps apart on the snare
        float s=t-T8; az=PI+s*.5; el=.70+.2*sin(s*.37); roll=TAU*smoothstep(0.,T8C-T8,s); gKE=.10*kp+.14*sp;
    } else if(t<T9){     // the solo begins: straight down, spinning with the beat
        el=1.42; roll=b*TAU/16.; gKE=.08*kp;
    } else if(t<T10){    // inside the signal: an exploded view, turning slowly
        float s=t-T9; gKE=.85*smoothstep(0.,1.2,s)*(1.-smoothstep(T10-.35,T10,t)); az=PI+s*.3; el=.62; zoom=1.-.2*gKE/.85;
    } else if(t<T11){    // hot tunnel: snapped back together, barrel-rolling
        float s=t-T10; az=PI+s*.6; el=.8; roll=TAU*2.*s/(T11-T10); gKE=.10*kp;
    } else if(t<T12){    // every colour: a second, quicker flight in orbit
        float s=t-T11; gKO=smoothstep(0.,2.5,s)*(1.-smoothstep(T12-2.2,T12-.2,t)); az=PI+s*.2; el=.95; zoom=mix(1.,.84,gKO);
    } else if(t<T12B){   // last chorus at first light: one slow low circle
        float s=t-T12; az=PI+TAU*s/(T12B-T12); el=.42+.12*sin(s*.3); gKE=.07*kp;
    } else if(t<T13){    // outro: rising to look straight down
        float u=(t-T12B)/(T13-T12B); az=PI+u*1.5; el=mix(.5,1.35,smoothstep(0.,1.,u)); roll=u*1.2; gKE=.08*kp;
    } else {             // the ghost leaves: everything lifts away
        float s=t-T13; az=PI+1.5+s*.1; el=1.35-s*.06; roll=1.2; gLift=s;
    }
    gRet=clamp(smoothstep(.25,.6,gKE)+gKO+smoothstep(0.,1.5,gLift),0.,1.);
}
// where a piece is right now. j orders the pieces for the drop-in; ring: 0 = drums, 1 = cymbals
vec3 pieceOff(vec3 rest,float j,float ring,float slot,float nslot,vec3 axis,int piece){
    vec3 d=rest-KITC; vec3 dir=normalize(d+vec3(0.,.15,0.));
    vec3 p=rest+dir*gKE*(.55+.35*length(d));
    if(gKO>0.){ float th=slot/nslot*TAU+(ring<.5?1.:-1.)*uTime*(.55+.25*step(T11,uTime));
        float R=ring<.5?.92:1.30; vec3 q=KITC+vec3(0.,.12,0.)+vec3(cos(th)*R,(ring<.5?.14:-.10)*sin(th*2.+ring*1.7)+(ring<.5?0.:.28),sin(th)*R);
        p=mix(p,q,gKO*gKO*(3.-2.*gKO)); }
    float age=max(uTime-uHitT[piece],0.); p+=axis*.035*uHitV[piece]*exp(-age*10.)*sin(min(age*20.,PI));          // a little hop when struck
    if(uTime<T1){ float u=clamp((uTime-(2.2+j*1.3))/1.25,0.,1.); float e=1.-u; p.y+=uTime<2.2+j*1.3?60.:3.4*e*e*e+.07*sin(u*PI*3.)*e; }   // dropping in
    if(gLift>0.){ float h=hash11(j*3.7+1.); p+=vec3(0.,1.,0.)*gLift*gLift*(.05+.09*h)+dir*gLift*(.05+.1*h); }                               // leaving
    return p-rest;
}
void kitSetup(){
    for(int i=0;i<9;i++){ float j=i==0?0.:(i==8?1.:(i==1?2.:(i>=6?float(i)-3.:float(i)+3.)));          // kicks, snare, floors, racks
        gDc[i]=DR[i].c+pieceOff(DR[i].c,j,0.,float(i),9.,DR[i].a,pieceOfDrum(i)); }
    for(int i=0;i<5;i++){
        int p=i==0?2:i+8; gCc[i]=CY[i].c+pieceOff(CY[i].c,9.+float(i),1.,float(i),5.,vec3(0.),p);
        float age=max(uTime-uHitT[p],0.); vec3 n=CY[i].n; vec3 d=SEAT-CY[i].c; d-=n*dot(d,n); d=normalize(d);       // cymbals rock after each hit
        float w=i==0?26.:(i==1?8.:10.5), amp=(i==0?.035:(i==1?.07:.17))*uHitV[p]*exp(-age*(i==0?9.:1.7));
        gCyN[i]=normalize(n+d*amp*sin(w*age)+cross(n,d)*amp*.35*sin(w*.63*age));
    }
    for(int f=0;f<2;f++){               // two pedals: each beater winds back, lands on its head on the kick, and rebounds
        float tp=uFoot[f].x, tn=uFoot[f].y, gap=max(tn-tp,.02), ds=min(.075,gap*.42), dr=min(.10,gap*.4);
        float up=sqrt(clamp((uTime-tp)/dr,0.,1.)), q=clamp((uTime-(tn-ds))/ds,0.,1.);
        float back=up*(1.-q*q)*mix(.55,1.,smoothstep(.1,.5,gap)); float phi=mix(.32,-.70,back);
        int k=f==0?0:8; vec3 piv=gDc[k]+vec3(0.,-.25,-.30); gBeat[f]=piv+vec3(0.,cos(phi),sin(phi))*.235; gPed[f]=back;
        float ka=max(uTime-uHitT[f==0?0:13],0.); gDc[k]+=vec3(0.,0.,.014)*uHitV[f==0?0:13]*exp(-ka*16.)*cos(ka*38.);   // the shell jolts
    }
    for(int h=0;h<2;h++){               // the two sticks
        vec4 s=uStk[h]; float tp=s.x, tn=s.z; int pp=int(s.y+.5), pn=int(s.w+.5); float vn=uStkV[h].y;
        vec3 A=hitPoint(pp,tp), B=hitPoint(pn,tn);
        float gap=max(tn-tp,.02), ds=min(.10,gap*.42), dr=min(.08,gap*.35);
        float m0=max(tp+dr*.4,tn-.34), m1=max(tn-ds*.55,m0+1e-3), sm=smoothstep(m0,m1,uTime);
        vec3 base=mix(A,B,sm); base.y+=.36*length(B-A)*4.*sm*(1.-sm);                     // arc over the rims between drums
        float Htop=min(.10+.26*vn,.05+gap*1.1), Hhov=min(.10,Htop*.8);
        float up=sqrt(clamp((uTime-tp)/dr,0.,1.)), q=clamp((uTime-(tn-ds))/ds,0.,1.), W=smoothstep(tn-2.4*ds,tn-ds,uTime);
        float hgt=(Hhov+(Htop-Hhov)*W)*up*(1.-q*q)+.010*sin(uTime*1.9+float(h)*2.3)*(1.-W)*up;   // rebound, hover, wind up, strike
        vec3 hov=base+vec3(0.,Hhov,0.), tip=base+vec3(0.,hgt,0.);
        vec3 home=vec3(h==0?.36:-.36,.96,-.80);                                           // the hands stay at the throne unless the kit has flown
        vec3 anchor=mix(home,hov+normalize(SEAT-hov+vec3(0.,.4,0.))*.6,clamp(gKO+smoothstep(.3,.8,gKE),0.,1.));
        vec3 bd=normalize(anchor-hov); vec3 butt=hov+bd*.46;
        gStA[h]=tip; gStB[h]=tip+normalize(butt-tip)*.46;
        if(gap>1.5&&tp>T1-1.&&tn<1e4){                                                    // a long rest: toss the stick and catch it
            float S=smoothstep(tp+.30,tn-.45,uTime); float ph=TAU*floor(min(gap*1.1,5.))*S;
            vec3 w=normalize(vec3(0.,1.,0.)-bd*bd.y); vec3 dd=bd*cos(ph)+w*sin(ph); vec3 mid=hov+bd*.23+vec3(0.,.30*sin(PI*S),0.);
            if(S>0.&&S<1.){ gStA[h]=mid-dd*.23; gStB[h]=mid+dd*.23; }
        }
        if(uTime<21.2){ float e=1.-smoothstep(19.6,21.2,uTime); float dy=uTime<19.6?60.:2.5*e*e; gStA[h].y+=dy; gStB[h].y+=dy; }    // the sticks arrive last
        if(gLift>0.){ vec3 o=vec3(h==0?.3:-.3,1.,-.2)*gLift*gLift*.12; gStA[h]+=o; gStB[h]+=o; }
    }
}
void kitTrace(vec3 ro,vec3 rd){
    kT=1e9; kM=0; kI=-1; kN=vec3(0,1,0); float rr=1.-gRet;
    for(int i=0;i<9;i++){
        vec4 r=cylI(ro,rd,gDc[i]-DR[i].a*DR[i].h,gDc[i]+DR[i].a*DR[i].h,DR[i].r);
        if(r.x>1e-3&&r.x<kT){ kT=r.x; kN=r.yzw; kM=1; kI=i; }
    }
    for(int i=0;i<5;i++){
        for(int k=0;k<(i==0?2:1);k++){
            vec3 n=k==0?gCyN[i]:CY[i].n; vec3 c=gCc[i]+(i==0?(k==0?CY[i].n*(.008+.028*uHatOpen):vec3(0.,-.006,0.)):vec3(0.));
            float dn=dot(rd,n); if(abs(dn)<1e-5) continue; float t=dot(c-ro,n)/dn; if(t<1e-3||t>kT) continue;
            vec3 p=ro+rd*t-c; if(dot(p,p)<CY[i].r*CY[i].r){ kT=t; kN=n*(dn>0.?-1.:1.); kM=2; kI=i; }
        }
    }
    // cymbal stands, hi-hat stand, snare stand
    kStand(ro,rd,vec3(1.12,0.,.34),gCc[1]-CY[1].c,gCc[1],.86,.4);
    kStand(ro,rd,vec3(-.98,0.,.44),gCc[2]-CY[2].c,gCc[2],1.10,1.2);
    kStand(ro,rd,vec3(.44,0.,.80),gCc[3]-CY[3].c,gCc[3],1.22,2.2);
    kStand(ro,rd,vec3(1.36,0.,-.24),gCc[4]-CY[4].c,gCc[4],1.04,.9);
    kStand(ro,rd,vec3(-.68,0.,-.30),gCc[0]-CY[0].c,gCc[0],.84,.2);
    kStand(ro,rd,vec3(0.,0.,-.34),gDc[1]-DR[1].c,gDc[1],.46,1.6);
    // rack toms ride on the bass drums; floor toms stand on legs; spurs on the kicks
    kCap(ro,rd,hw(vec3(-.42,.62,.28),gDc[2]-DR[2].c,gDc[2]),gDc[2]-DR[2].a*.08,.012*rr,5); kCap(ro,rd,hw(vec3(-.26,.62,.28),gDc[3]-DR[3].c,gDc[3]),gDc[3]-DR[3].a*.09,.012*rr,5);
    kCap(ro,rd,hw(vec3(.26,.62,.28),gDc[4]-DR[4].c,gDc[4]),gDc[4]-DR[4].a*.10,.012*rr,5);   kCap(ro,rd,hw(vec3(.42,.62,.28),gDc[5]-DR[5].c,gDc[5]),gDc[5]-DR[5].a*.11,.012*rr,5);
    for(int i=6;i<8;i++) for(int k=0;k<3;k++){ float a=float(k)*2.0944+float(i); vec3 d=vec3(cos(a),0.,sin(a)); vec3 o=gDc[i]-DR[i].c;
        kCap(ro,rd,gDc[i]+d*(DR[i].r+.012),hw(DR[i].c+d*(DR[i].r+.06)-vec3(0.,DR[i].c.y,0.),o,gDc[i]),.008*rr,5); }
    for(int f=0;f<2;f++){ int k=f==0?0:8; vec3 c=gDc[k], o=c-DR[k].c; float sx=f==0?1.:-1.;
        kCap(ro,rd,c+vec3(.27*sx,-.12,.10),hw(DR[k].c+vec3(.46*sx,-.32,.22),o,c),.011*rr,5);
        vec3 piv=c+vec3(0.,-.25,-.30);                                          // pedal: beater, footboard, frame
        kCap(ro,rd,piv,gBeat[f],.008*rr,5); kCap(ro,rd,gBeat[f]-vec3(0.,.012,0.),gBeat[f]+vec3(0.,.012,0.),.034*rr,7);
        kCap(ro,rd,hw(DR[k].c+vec3(0.,-.295,-.62),o,c),hw(DR[k].c+vec3(0.,-.27+.07*gPed[f],-.33),o,c),.028*rr,8);
        kCap(ro,rd,piv+vec3(-.06,-.05,0.),piv+vec3(.06,-.05,0.),.020*rr,5); kCap(ro,rd,piv+vec3(-.06,-.05,0.),piv+vec3(-.06,.09,0.),.011*rr,5); kCap(ro,rd,piv+vec3(.06,-.05,0.),piv+vec3(.06,.09,0.),.011*rr,5);
    }
    kCap(ro,rd,hw(vec3(-.68,.025,-.60),gCc[0]-CY[0].c,gCc[0]),hw(vec3(-.68,.05+.05*uHatOpen,-.36),gCc[0]-CY[0].c,gCc[0]),.026*rr,8);
    for(int h=0;h<2;h++) kCap(ro,rd,gStA[h],gStB[h],.0145,6);
}
vec3 kitEnv(vec3 r){ return mix(vec3(.012,.015,.02),vec3(.72,.74,.78),smoothstep(-.1,.8,r.y))*(.45+.55*smoothstep(.2,.9,sin(r.x*5.+r.z*3.)))+gFxCol*.05*smoothstep(.2,-.6,r.y); }
vec4 kitRender(vec2 q){
    float az,el,roll,zoom; kitTricks(az,el,roll,zoom);
    vec3 f=-vec3(sin(az)*cos(el),sin(el),cos(az)*cos(el)); vec3 ro=KITC-vec3(0.,.06,0.)-f*4.6;
    vec3 r=normalize(cross(vec3(0,1,0),f)), u=cross(f,r); float cr=cos(roll), sr=sin(roll); vec3 r2=r*cr+u*sr, u2=u*cr-r*sr;
    vec3 rd=normalize(q.x*r2+q.y*u2+2.72*zoom*f);
    gKL=normalize(-.50*r2+.78*u2-.42*f);                                 // the key light rides with the camera: over its left shoulder
    kitSetup(); kitTrace(ro,rd);
    float halo=0.; for(int h=0;h<2;h++){ vec3 g=mix(gStA[h],gStB[h],.82)-ro; float tg=dot(g,rd); float d2=dot(g,g)-tg*tg; if(tg<kT) halo+=.0016/(d2+.0022); }
    vec3 ghost=mix(vec3(.62,.9,1.),gFxCol,.35); vec3 L=gKL;
    if(kT>1e8){
        // no floor is drawn, only what falls on it: the pieces' shadows, and a thin ring where the riser would be
        vec4 o=vec4(ghost*halo*.5,min(halo*.45,.55));
        if(rd.y<-1e-3&&gLift<.01){ float tf=-ro.y/rd.y; vec3 fp=ro+rd*tf; float fr=length(fp.xz-KITC.xz);
            if(fr<1.9){ kitTrace(fp+vec3(0.,.002,0.),L); float sh=kT>1e8?0.:1.; float ring=smoothstep(.014,.004,abs(fr-1.52))+.4*smoothstep(.01,.003,abs(fr-1.59));
                float a=sh*.44*smoothstep(1.75,1.4,fr)*smoothstep(1.5,5.,uTime); ring*=1.-gRet; o=vec4(o.rgb*(1.-a)+gFxCol*ring*.5,max(o.a,max(a,ring*.6))); } }
        return o;
    }
    vec3 p=ro+rd*kT, n=kN; int m=kM, pi=kI;
    vec3 col; vec3 alb=vec3(.5); float spec=0., sh_=24., chrome=0.; vec3 em=vec3(0);
    if(m==1){                                                           // a drum
        Drum D=DR[pi]; vec3 c=gDc[pi]; vec3 d=p-c; float ax=dot(d,D.a); vec3 rad=d-D.a*ax; float rr=length(rad);
        int piece=pieceOfDrum(pi); float age=max(uTime-uHitT[piece],0.), vel=uHitV[piece]; bool kick=pi==0||pi==8;
        if(abs(ax)>D.h-.002){                                           // a head
            float e=rr/D.r;
            if(kick){                                                   // both heads of each bass drum: a radar scope that jumps with its kicks
                vec2 hq=vec2(-rad.x*sign(ax),rad.y)/D.r; float hr=length(hq), ha=atan(hq.y,hq.x);
                float rings=smoothstep(.45,.485,abs(fract(hr*4.)-.5))*step(hr,.9)+smoothstep(.014,0.,abs(hr-.9));
                float spokes=smoothstep(.488,.498,abs(fract(ha/TAU*8.)-.5))*step(.25,hr)*step(hr,.9)*.5;
                float sw=mod(ha-uBeat*TAU/4.*(pi==0?1.:-1.),TAU); float sweep=exp(-sw*2.2)*step(hr,.9);
                float pulse=exp(-age*9.)*vel; float wave=exp(-pow((hr-age*3.2)/.07,2.))*exp(-age*5.)*vel;
                alb=vec3(.012); em=gFxCol*(rings*(.30+1.6*pulse)+spokes*(.16+pulse)+sweep*.16+wave*1.5+.06*pulse)+vec3(1.,.95,.9)*.45*pulse*exp(-hr*hr*5.);
                spec=.5; sh_=60.;
            } else {
                alb=vec3(.60,.59,.56)*(.90+.10*n2(rad.xz*140.))*(1.-.12*smoothstep(.30,.27,e))*(1.-.10*smoothstep(.80,.93,e)); spec=.2; sh_=30.;
                if(ax>0.){ vec3 hp=hitPoint(piece,uHitT[piece]); float dd=length(p-hp);
                    float ring=exp(-pow((dd-age*1.5)/.014,2.))*exp(-age*8.)*vel, flash=exp(-age*13.)*vel*exp(-dd*dd/.006);
                    em=ghost*(ring*1.3+flash*1.6); alb*=1.-.25*smoothstep(.05,.0,dd)*exp(-age*3.); }
                else alb*=.8;
                if(pi==1&&ax>0.) alb*=1.-.12*smoothstep(.02,.0,abs(e-.5)-.02);      // a worn ring on the snare
            }
            if(e>.93){ chrome=1.; }                                      // the hoop
        } else {                                                        // the shell
            vec3 e1=normalize(cross(D.a,vec3(.3,.1,.9))), e2=cross(D.a,e1); float ang=atan(dot(rad,e2),dot(rad,e1));
            float nl=D.r<.12?6.:(D.r<.2?8.:10.); float cell=abs(fract(ang*nl/TAU)-.5)*TAU/nl*D.r;
            float sparkle=pow(hash21(floor(vec2(ang*D.r,ax)*420.)),30.);
            alb=mix(vec3(.30,.008,.014),vec3(.52,.03,.03),.5+.5*sin(ang*3.+ax*8.))+vec3(1.,.5,.4)*sparkle*.6; spec=.9; sh_=70.;
            if(abs(ax)>D.h-.024) chrome=1.;                              // hoops
            else if(cell<.012&&abs(ax)<D.h*(kick?.8:.62)) chrome=1.;     // lugs
            else if(cell<.003) chrome=1.;                                // tension rods
            if(pi==1&&abs(ax)<D.h-.024){ alb=vec3(.55,.56,.58); chrome=max(chrome,.6); }   // a metal snare
            em=vec3(.5,.02,.02)*exp(-age*10.)*vel*.25;
        }
    } else if(m==2){                                                    // a cymbal
        vec3 d=p-gCc[pi]; if(pi==0) d.y=0.; float rr=length(d)/CY[pi].r; int piece=pi==0?2:pi+8; float age=max(uTime-uHitT[piece],0.), vel=uHitV[piece];
        vec3 radial=normalize(d+1e-5); n=normalize(n+radial*(rr<.22?.5:.09)*sign(dot(n,-rd)));     // bell and a shallow cone
        float groove=.6+.4*sin(rr*CY[pi].r*1100.)*sin(rr*CY[pi].r*173.+2.);
        alb=mix(vec3(.46,.29,.07),vec3(.66,.46,.14),groove)*(rr<.22?1.2:1.)*(pi==4?.85:1.)*(dot(kN,vec3(0,1,0))<0.?.45:1.);
        vec3 hv=normalize(L-rd); vec3 tang=cross(n,radial); float aniso=pow(max(1.-abs(dot(tang,hv))*1.4,0.),3.);
        spec=.30*aniso+.04; sh_=36.; chrome=.10;
        vec3 lp=normalize(L-n*dot(L,n)); alb*=mix(.72,1.08,rr); em+=vec3(1.,.82,.45)*.34*pow(abs(dot(radial,lp)),10.)*smoothstep(.1,.5,rr);
        em+=vec3(1.,.8,.4)*(exp(-age*6.)*vel*.22*(.5+.5*sin(rr*40.-age*60.))+exp(-age*20.)*vel*.3);
        if(rr<.035) { alb=vec3(.05); chrome=1.; }                        // wing nut
    } else if(m==5){ chrome=1.; alb=vec3(.6);
    } else if(m==7){ alb=vec3(.82,.80,.74); spec=.05;
    } else if(m==8){ alb=vec3(.05,.05,.055); spec=.6; sh_=40.;
    } else if(m==6){ alb=vec3(.86,.74,.52); spec=.3; em=ghost*.30; }
    // light: one key with real shadows from every piece (sticks included), sky fill, a rim in the film's colour
    vec3 pp=p+n*.003; kitTrace(pp,L); float shd=kT>1e8?1.:.22;
    float dif=max(dot(n,L),0.)*shd; vec3 hv=normalize(L-rd);
    col=alb*(vec3(.88,.84,.76)*dif+vec3(.13,.155,.20)*(.55+.45*n.y)+gAmb*1.5);
    col+=mix(vec3(1.,.97,.9),alb*2.2,m==2?.75:0.)*spec*pow(max(dot(n,hv),0.),sh_)*shd;
    vec3 ch=kitEnv(reflect(rd,n))*(.35+.65*shd)+vec3(1.)*pow(max(dot(n,hv),0.),90.)*2.*shd;
    col=mix(col,ch*mix(vec3(.9),alb*1.6,m==2?.9:0.),chrome);
    col+=gFxCol*.10*pow(1.-max(dot(n,-rd),0.),3.);
    col+=em+ghost*halo*.5;
    return vec4(col*1.1,1.);
}
