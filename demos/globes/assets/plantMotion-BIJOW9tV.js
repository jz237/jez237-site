import{t as e}from"./rolldown-runtime-DK3Fl9T5.js";import{n as t,t as n}from"./mesh-COPocGfL.js";var r=e({COLLIDE_MARGIN:()=>c,COLLIDE_SOFT:()=>l,FLOOR:()=>s,LEAF_STRIDE:()=>40,LEAN_CAP:()=>o,MOTION_VERTEX_STRIDE:()=>20,PHASE_STRIDE:()=>12,PLANT_MOTION:()=>f,SOLID_SKIN:()=>u,TAME_ALLOW:()=>q,TAME_MIN:()=>J,WAVE_K:()=>_,displacePlantVertex:()=>V,forgetMotion:()=>z,frameQuat:()=>b,leafPhases:()=>w,leafReach:()=>W,leafRow:()=>y,movePlant:()=>ae,moveVertex:()=>B,placeVertices:()=>H,plantCollide:()=>ie,plantMotionWGSL:()=>$,plantNormal:()=>U,plantSolids:()=>X,solidTrespass:()=>Y,tameMotion:()=>K,tamedLeaves:()=>ne}),i=20,a=40,o=.25,s=n+.004,c=.002,l=.0015,u=1.12,d=.001,f={tall:{cap:.07,k:.022,stalk:.03,rate:[1,.6],side:.3,twist:.4,sway:[.022,.015],height:.6},small:{cap:.04,k:.009,stalk:.025,rate:[1.3,.5],side:.3,twist:.25,sway:[.013,.009],height:.35}},p=2*Math.PI/17,m=1.12,h=.16,g=.1,_=1.8,v=(e,t,n)=>Math.min(Math.max(e,t),n);function y(e,t,n){let r=f[n.plant],i=n.Ls/(n.Ls+n.Lb),a=(n.base[0]*13.7+n.base[1]*9.3+n.base[2]*17.1)*(12/7)+n.dir[0]*4.2,o=r.rate[0]+r.rate[1]*(.5+.5*Math.sin(a*1.7)),s=Math.min(r.cap*n.Lb,r.k),c=r.stalk*n.Ls,l=[n.tip[0]-n.base[0],n.tip[1]-n.base[1],n.tip[2]-n.base[2]],u=[n.S[1]*n.P[2]-n.S[2]*n.P[1],n.S[2]*n.P[0]-n.S[0]*n.P[2],n.S[0]*n.P[1]-n.S[1]*n.P[0]],d=.5*(n.P[0]*n.jP[0]+n.P[1]*n.jP[1]+n.P[2]*n.jP[2]+u[0]*n.jQ[0]+u[1]*n.jQ[1]+u[2]*n.jQ[2]),p=v(1/(1+(n.S[0]*l[0]+n.S[1]*l[1]+n.S[2]*l[2])/n.Ls-d),.25,2),m=2.2*n.crown[0]+1.3*n.crown[2];e.set([...n.foot,i,...n.base,n.Ls,...n.S,n.Lb,...n.P,p,a,o,s,c,...n.crown,r.height,r.sway[0],r.sway[1],m,n.young?0:r.twist,r.side,n.plant===`tall`?0:1,0,0,...n.jP,0,...n.jQ,0],t)}function b(e,t,n){let r=e[0],i=e[1],a=e[2],o=t[0],s=t[1],c=t[2],l=n[0],u=n[1],d=n[2],f=r+s+d,p,m,h,g;if(f>0){let e=.5/Math.sqrt(f+1);g=.25/e,p=(c-u)*e,m=(l-a)*e,h=(i-o)*e}else if(r>s&&r>d){let e=2*Math.sqrt(1+r-s-d);g=(c-u)/e,p=.25*e,m=(o+i)/e,h=(l+a)/e}else if(s>d){let e=2*Math.sqrt(1+s-r-d);g=(l-a)/e,p=(o+i)/e,m=.25*e,h=(u+c)/e}else{let e=2*Math.sqrt(1+d-r-s);g=(i-o)/e,p=(l+a)/e,m=(u+c)/e,h=.25*e}let _=Math.hypot(p,m,h,g);return[p/_,m/_,h/_,g/_]}var x=2*Math.PI,S=e=>e-x*Math.floor(e/x);function C(e,t,n,r,i){let a=t*40,o=e[a+26],s=e[a+16],c=e[a+17],l=c*n+s+.32*Math.sin(.43*n+o);r[i]=S(l),r[i+1]=S(2.7*l),r[i+2]=S(.81*l),r[i+3]=S(2.1*l),r[i+4]=S(.5*c*n+.73*s),r[i+5]=S(.63*n+o),r[i+6]=.85+.15*Math.sin(p*n+o),r[i+7]=0,r[i+8]=e[a+24]*(.73*Math.sin(.82*n+o)+.27*Math.sin(1.19*n+1.7*o)),r[i+9]=e[a+25]*Math.sin(.67*n+o+.8),r[i+10]=0,r[i+11]=0}function w(e,t,n=null){let r=e.length/40,i=n??new Float32Array(r*12);for(let n=0;n<r;n++)C(e,n,t,i,n*12);return i}var T=e=>e<1e-4?1:Math.sin(e)/e;function E(e,t,n,r,i,a){let s=a.q??=new Float64Array(12);if(typeof i==`number`)C(e,r,i,s,0);else for(let e=0;e<12;e++)s[e]=i[r*12+e];let c=e[t+19];a.b=t,a.ph=s[0],a.ph27=s[1],a.ph081=s[2],a.ph21=s[3],a.waveB=s[5],a.surge=s[6],a.swayX=s[8],a.swayZ=s[9];let l=e[t+8],u=e[t+9],d=e[t+10],f=e[t+12],p=e[t+13],m=e[t+14],h=u*m-d*p,g=d*f-l*m,_=l*p-u*f,v=c*a.surge*Math.sin(a.ph+.6),y=c*a.surge*.45*Math.sin(s[4]+.9),b=f*v+h*y,x=p*v+g*y,S=m*v+_*y;if(n){let i=n[r*4],a=n[r*4+1],s=n[r*4+2],c=i*l+a*u+s*d,f=e[t+15],p=f*(i-l*c),m=f*(a-u*c),h=f*(s-d*c),g=Math.min(1,o*e[t+7]/Math.max(Math.hypot(p,m,h),1e-12));b+=p*g,x+=m*g,S+=h*g}a.Dx=b,a.Dy=x,a.Dz=S;let w=b*f+x*p+S*m,E=b*h+x*g+S*_;a.al=w,a.be=E,a.P=[f,p,m],a.Q=[h,g,_],a.tx=b-w*e[t+32]-E*e[t+36],a.ty=x-w*e[t+33]-E*e[t+37],a.tz=S-w*e[t+34]-E*e[t+38];let D=1/e[t+7],O=e[t+28]*e[t+18]*a.surge*Math.sin(s[4]-.5)/e[t+11];a.bx=(u*S-d*x)*D+f*O,a.by=(d*b-l*S)*D+p*O,a.bz=(l*x-u*b)*D+m*O,a.th2=a.bx*a.bx+a.by*a.by+a.bz*a.bz;let k=Math.sqrt(a.th2),A=T(.5*k);return a.s1=T(k),a.s2=.5*A*A,a}function D(e,t,n,r,i,a,o,s,c,l,u,d,f,p,v,y,b){let x=t.b,S=Math.max(i-e[x+1],0)/e[x+23],C=S*S,w=2*S/e[x+23],T=C*t.swayX,E=-w*((r-e[x])*t.swayX+(a-e[x+2])*t.swayZ),D=C*t.swayZ;if(n){let n=o/e[x+3],r=n*n*(2-n),i=n*(4-3*n)/e[x+7],a=(l[1]*t.Dz-l[2]*t.Dy)*i,s=(l[2]*t.Dx-l[0]*t.Dz)*i,c=(l[0]*t.Dy-l[1]*t.Dx)*i;T+=r*t.Dx-t.al*y[0]-t.be*y[3]+s*v-c*p,E+=r*t.Dy-t.al*y[1]-t.be*y[4]+c*f-a*v,D+=r*t.Dz-t.al*y[2]-t.be*y[5]+a*p-s*f}else{let n=e[x+18]*t.surge,o=v,y=s*s*(2-s),b=s*(4-3*s),S=t.ph,C=S-_*s,w=t.waveB-1.4*s,O=t.ph27-5.5*s,k=m*Math.sin(C)+h*Math.sin(w)+g*Math.sin(O),A=-1.12*_*Math.cos(C)-1.4*h*Math.cos(w)-5.5*g*Math.cos(O),j=n*y*k,M=n*(b*k+y*A),ee=-n*m*(Math.sin(S)*f-Math.cos(S)*p),te=e[x+27]*s*(.25*Math.sin(t.ph081-.6*s+1.2)+.08*Math.sin(t.ph21-3*s)),N=j+c*te,P=ee-o*M/e[x+11],F=-o*te,I=d[0]*N+l[0]*P+u[0]*F,L=d[1]*N+l[1]*P+u[1]*F,R=d[2]*N+l[2]*P+u[2]*F,z=r-e[x+4]+I,B=i-e[x+5]+L,V=a-e[x+6]+R,H=t.bx,U=t.by,W=t.bz,G=H*z+U*B+W*V;T+=t.tx+I+t.s1*(U*V-W*B)+t.s2*(H*G-t.th2*z),E+=t.ty+L+t.s1*(W*z-H*V)+t.s2*(U*G-t.th2*B),D+=t.tz+R+t.s1*(H*B-U*z)+t.s2*(W*G-t.th2*V)}b[0]=T,b[1]=E,b[2]=D}function O(e,t,n,r,i){let a=e[t+4],o=e[t+5],s=e[t+6],c=e[t+7];n[0]=1-2*(o*o+s*s),n[1]=2*(a*o+c*s),n[2]=2*(a*s-c*o),r[0]=2*(a*o-c*s),r[1]=1-2*(a*a+s*s),r[2]=2*(o*s+c*a),i[0]=2*(a*s+c*o),i[1]=2*(o*s-c*a),i[2]=1-2*(a*a+o*o)}var k={},A=[0,0,0],j=[0,0,0],M=[0,0,0],ee=[0,0,0],te=[0,0,0],N=[0,0,0],P=[0,0,0],F=[0,0,0],I=[0,0,0,0,0,0],L=[0,0,0,0,0,0],R={L:null,li:-1,t:NaN,lean:null},z=()=>{R.L=null};function B(e,t,n,r,i,a,o,c,l,u,f,p){let m=i[a];if(!(m>=0))return!1;let h=m*40,g=k;(R.L!==o||R.li!==m||R.t!==l||R.lean!==c)&&(E(o,h,c,m,l,g),R.L=o,R.li=m,R.t=l,R.lean=c);let v=e[t],y=e[t+1],b=e[t+2],x=i[a+1],S=i[a+2],C=i[a+3],w=i[a+8],T=i[a+9],z=i[a+10],B=S<0;if(O(i,a,A,j,M),B){for(let e=0;e<3;e++)I[e]=i[a+12+e],I[3+e]=i[a+16+e];D(o,g,!0,v,y,b,x,S,C,A,j,M,w,T,z,I,N)}else D(o,g,!1,v,y,b,x,S,C,A,j,M,T,z,i[a+11],null,N);if(u[f]=v+N[0],u[f+1]=Math.max(y+N[1],Math.min(y,s)),u[f+2]=b+N[2],!p)return!0;let V=n[r],H=n[r+1],U=n[r+2],W=A[0],G=A[1],K=A[2],q=W*V+G*H+K*U;W-=V*q,G-=H*q,K-=U*q;let J=Math.hypot(W,G,K);J<1e-4&&(W=j[0],G=j[1],K=j[2],q=W*V+G*H+K*U,W-=V*q,G-=H*q,K-=U*q,J=Math.hypot(W,G,K)||1),W/=J,G/=J,K/=J;let ne=H*K-U*G,Y=U*W-V*K,X=V*G-H*W;for(let e=0;e<2;e++){let t=e?ne:W,n=e?Y:G,r=e?X:K,s=e?F:P,c=t*A[0]+n*A[1]+r*A[2],l=d*c,u=v+d*t,f=y+d*n,p=b+d*r;if(B){let e=x/o[h+3],i=e*(4-3*e)*l/o[h+7],a=g.P,m=g.Q,_=(A[0]*a[0]+A[1]*a[1]+A[2]*a[2])*i,v=(A[0]*m[0]+A[1]*m[1]+A[2]*m[2])*i;for(let e=0;e<3;e++)L[e]=I[e]+A[e]*_,L[3+e]=I[3+e]+A[e]*v;D(o,g,!0,u,f,p,x+l*o[h+3]/o[h+7],S,C,A,j,M,w+d*(t-A[0]*c),T+d*(n-A[1]*c),z+d*(r-A[2]*c),L,s)}else{let e=w*l,c=S*S*(2-S);for(let t=0;t<3;t++)ee[t]=A[t]-e*M[t],te[t]=M[t]+e*A[t];let m=d*(t*j[0]+n*j[1]+r*j[2]),v=d*(t*M[0]+n*M[1]+r*M[2]);D(o,g,!1,u,f,p,x,S+l/o[h+11],C+m,ee,j,te,T+Math.cos(_*S)*c*e,z+Math.sin(_*S)*c*e,i[a+11]+v,null,s)}}let Z=W+(P[0]-N[0])/d,re=G+(P[1]-N[1])/d,ie=K+(P[2]-N[2])/d,ae=ne+(F[0]-N[0])/d,Q=Y+(F[1]-N[1])/d,oe=X+(F[2]-N[2])/d,$=re*oe-ie*Q,se=ie*ae-Z*oe,ce=Z*Q-re*ae,le=Math.hypot($,se,ce);if(!(le>1e-12))return p[f]=V,p[f+1]=H,p[f+2]=U,!0;let ue=$*V+se*H+ce*U<0?-1/le:1/le;return p[f]=$*ue,p[f+1]=se*ue,p[f+2]=ce*ue,!0}function V(e,t,n,r,i=null){let a=[e[0],e[1],e[2]];return z(),B(e,0,null,0,t,0,n,i,r,a,0,null),a}function H(e,t,n,r,i,a){z();for(let o=0;o<e.length/3;o++)B(e,o*3,null,0,t,o*20,n,i,r,a,o*3,null);return a}function U(e,t,n,r,i,a=null){let o=[0,0,0],s=[t[0],t[1],t[2]];return z(),B(e,0,t,0,n,0,r,a,i,o,0,s),s}function W(e,t){let n=t*40,r=1.1*e[n+19],i=Math.min(1,Math.hypot(e[n+32],e[n+33],e[n+34])+Math.hypot(e[n+36],e[n+37],e[n+38]));return r*Math.max(2,1+i+1.2*e[n+11]/e[n+7])+e[n+18]*(1.4+1.2+1.2*e[n+28])+.05*e[n+27]+3*Math.hypot(e[n+24],e[n+25])}var G=[18,19,27,24,25];function K(e,t,{minScale:n=.25,allow:r=0}={}){let{vertex:i,leaves:a}=e.motion,o=e.positions,s=o.length/3,c=a.length/40,l=Array(c).fill(1),u=Array.from({length:c},()=>[]),d=Array.from({length:c},(e,t)=>W(a,t));for(let e=0;e<s;e++){let n=i[e*20];if(!(n>=0))continue;let a=t(o[e*3],o[e*3+1],o[e*3+2]);a>-d[n]&&u[n].push(e,Math.max(a,0)+r)}let f=[0,0,0];for(let e=0;e<c;e++){let r=u[e];if(!r.length)continue;let s=e*40,c=G.map(e=>a[s+e]),p=t.near?t.near(o,r,d[e]):t,m=e=>G.forEach((t,n)=>a[s+t]=c[n]*e),h=(e,t=null)=>{m(e),z();let n=-1/0,s=t?40:100;for(let e=0;e<s;e++){let c=60/s*e+.07;for(let e=0;e<r.length;e+=2){let s=r[e];B(o,s*3,null,0,i,s*20,a,null,c,f,0,null);let l=p(f[0],f[1],f[2])-r[e+1];l>n&&(n=l),t&&l>t[e>>1]&&(t[e>>1]=l)}}return n},g=new Float64Array(r.length/2).fill(-1/0);if(h(1,g),r=r.filter((e,t)=>g[t>>1]>-.012),!r.length||h(1)<=0){m(1);continue}let _=n,v=1;for(let e=0;e<5;e++){let e=.5*(_+v);h(e)<=0?_=e:v=e}m(_),l[e]=_}return z(),l}var q=.003,J=.25;function ne(e,t,{allow:n=q,minScale:r=J,solids:i=null}={}){let{vertex:a}=e.motion,o=e.positions;if(!i){let e=[];for(let t=0;t<o.length/3;t++)a[t*20]>=0&&e.push(o[t*3],o[t*3+1],o[t*3+2]);i=X(t,e)}let s=Float32Array.from(e.motion.leaves);return{leaves:s,scales:K({positions:o,motion:{vertex:a,leaves:s}},Y(i),{allow:n,minScale:r}),solids:i}}function Y(e){let n=(n,r,i)=>{let a=Math.hypot(n,r,i)-(t-2*l);for(let t of e)a=Math.max(a,t.r-Z(n,r,i,t.a,t.b));return a};return n.near=(t,r,i)=>{let a=e.filter(e=>{for(let n=0;n<r.length;n+=2){let a=r[n];if(Z(t[a*3],t[a*3+1],t[a*3+2],e.a,e.b)<e.r+i+.001)return!0}return!1});return a.length===e.length?n:Y(a)},n}function X(e,t=null,n=c){let r=[];for(let i of e){if(!(i.solid>0))continue;let e=i.solid*u+n;if(t){let n=1/0,r=[0,1,2].map(t=>Math.min(i.a[t],i.b[t])-e),a=[0,1,2].map(t=>Math.max(i.a[t],i.b[t])+e);for(let e=0;e<t.length;e+=3)t[e]<r[0]||t[e]>a[0]||t[e+1]<r[1]||t[e+1]>a[1]||t[e+2]<r[2]||t[e+2]>a[2]||(n=Math.min(n,Z(t[e],t[e+1],t[e+2],i.a,i.b)));if(n<i.solid)continue;e=Math.min(e,n-1e-4)}r.push({a:[...i.a],b:[...i.b],r:Math.round(e*1e6)/1e6})}return r}function Z(e,t,n,r,i){let a=i[0]-r[0],o=i[1]-r[1],s=i[2]-r[2],c=e-r[0],l=t-r[1],u=n-r[2],d=a*a+o*o+s*s,f=d>0?v((c*a+l*o+u*s)/d,0,1):0;return Math.hypot(c-a*f,l-o*f,u-s*f)}var re=e=>e<.003?e*e/(4*l):e-l;function ie(e,n,r){let i=e[n],a=e[n+1],o=e[n+2],s=i,c=a,u=o;for(let e of r??[]){let t=e.b[0]-e.a[0],n=e.b[1]-e.a[1],r=e.b[2]-e.a[2],i=s-e.a[0],a=c-e.a[1],o=u-e.a[2],l=t*t+n*n+r*r,d=l>0?v((i*t+a*n+o*r)/l,0,1):0,f=i-t*d,p=a-n*d,m=o-r*d,h=Math.hypot(f,p,m);if(h>=e.r)continue;h<1e-9?(f=0,p=1,m=0):(f/=h,p/=h,m/=h);let g=re(e.r-h);s+=f*g,c+=p*g,u+=m*g}let d=Math.hypot(s,c,u),f=d-(t-2*l);if(f>0){let e=(d-re(f))/d;s*=e,c*=e,u*=e}return e[n]=s,e[n+1]=c,e[n+2]=u,Math.hypot(s-i,c-a,u-o)}function ae(e,t,{lean:n=null,solids:r=null,stats:i=null}={}){let a=e.positions,o=e.normals,{vertex:s,leaves:c}=e.motion,l=Float32Array.from(a),u=Float32Array.from(o),d=a.length/3;z();for(let e=0;e<d;e++){if(!B(a,e*3,o,e*3,s,e*20,c,n,t,l,e*3,u))continue;let d=ie(l,e*3,r);i&&(i.points++,d>0&&(i.pushed++,i.sum+=d,i.max=Math.max(i.max,d)))}return{positions:l,normals:u}}var Q=e=>{let t=Number.isInteger(e)?`${e}.0`:String(e);return/e/.test(t)&&!/\./.test(t)?t.replace(`e`,`.0e`):t},oe=e=>`vec3f(${e.map(e=>Q(Math.round(e*1e6)/1e6)).join(`, `)})`;function $(e=[],n=null){let r=X(e,n).map(e=>`  q = plant_pushOut(q, ${oe(e.a)}, ${oe(e.b)}, ${Q(e.r)});`).join(`
`);return`
// ---- the betta bowl's plants in motion (src/render/scape/plantMotion.mjs) -------------------------
const PLANT_FLOOR: f32 = ${Q(s)};
const PLANT_GLASS: f32 = ${Q(t)};
const PLANT_SOFT: f32 = ${Q(l)};
const PLANT_EPS: f32 = ${Q(d)};
const PLANT_LEAN_CAP: f32 = ${Q(o)};
const PLANT_WAVE_K: f32 = ${Q(_)};

struct PlantMV {
  a: vec4f,
  b: vec4f,
  c: vec4f,
  d: vec4f,
  e: vec4f,
}

struct PlantMoved {
  p: vec3f,
  n: vec3f,
}

// A leaf's motion this frame, shared by all its points: its table's rows (r0 .. r7, but r3), its
// phases (ph: the wave's and its harmonics'), the surge, the push on the stalk's tip D (its parts
// ab along P and Q) and where the tip goes (Dt), the blade's turn about it (wb, its length the
// angle: the stalk tip's turn and the blade's own sway in its plane; s1, s2 and th2 its rotation's
// terms), the plant's sway (x, z).
struct PlantLeaf {
  r0: vec4f,
  r1: vec4f,
  r2: vec4f,
  r4: vec4f,
  r5: vec4f,
  r6: vec4f,
  r7: vec4f,
  P: vec3f,
  Q: vec3f,
  ph: vec4f,
  surge: f32,
  waveB: f32,
  D: vec3f,
  ab: vec2f,
  Dt: vec3f,
  wb: vec3f,
  s1: f32,
  s2: f32,
  th2: f32,
  sway: vec2f,
}

// sin(x) / x, for x >= 0.
fn plant_sinc(x: f32) -> f32 {
  return select(sin(x) / x, 1.0, x < 1e-4);
}

fn plant_leaf(leaf: u32) -> PlantLeaf {
  let o = leaf * 10u;
  let r0 = plantLeaves[o];
  let r1 = plantLeaves[o + 1u];
  let r2 = plantLeaves[o + 2u];
  let r3 = plantLeaves[o + 3u];
  let r4 = plantLeaves[o + 4u];
  let r5 = plantLeaves[o + 5u];
  let r6 = plantLeaves[o + 6u];
  let r7 = plantLeaves[o + 7u];
  let r8 = plantLeaves[o + 8u];
  let r9 = plantLeaves[o + 9u];
  let q0 = plantPhase[leaf * 3u];
  let q1 = plantPhase[leaf * 3u + 1u];
  let q2 = plantPhase[leaf * 3u + 2u];
  let surge = q1.z;
  let S = r2.xyz;
  let P = r3.xyz;
  let Q = cross(S, P);
  let lean = plantLean[leaf].xyz;
  let e = r3.w * (lean - S * dot(S, lean));
  let D = r4.w * surge * (P * sin(q0.x + 0.6) + Q * (0.45 * sin(q1.x + 0.9))) + e * min(1.0, PLANT_LEAN_CAP * r1.w / max(length(e), 1e-12));
  let ab = vec2f(dot(D, P), dot(D, Q));
  let wb = cross(S, D) / r1.w + P * (r7.x * r4.z * surge * sin(q1.x - 0.5) / r2.w);
  let th2 = dot(wb, wb);
  let th = sqrt(th2);
  let sh = plant_sinc(0.5 * th);
  return PlantLeaf(r0, r1, r2, r4, r5, r6, r7, P, Q, q0, surge, q1.y, D, ab, D - r8.xyz * ab.x - r9.xyz * ab.y, wb, plant_sinc(th), 0.5 * sh * sh, th2, q2.xy);
}

// The displacement of a point p of the leaf (onStalk: its vertex is on the stalk; v, u, s along and
// across it; its frame T, X, N; k: on the blade the wave's integrals and its offset off the
// midrib's plane (Kc, Ks, h), on the stalk the point less its ring's centre; jP, jQ: on the stalk
// its J_P and J_Q).
fn plant_point(L: PlantLeaf, onStalk: bool, p: vec3f, v: f32, u: f32, s: f32, T: vec3f, X: vec3f, N: vec3f, k: vec3f, jP: vec3f, jQ: vec3f) -> vec3f {
  let h = max(p.y - L.r0.y, 0.0) / L.r5.w;
  // (The sway, turned with the bend at its height.)
  let r = p.xz - L.r0.xz;
  var d = vec3f(L.sway.x * (h * h), -2.0 * h / L.r5.w * dot(r, L.sway), L.sway.y * (h * h));
  if (onStalk) {
    // (Its ring turned by the bend's slope there, T towards D.)
    let q = v / L.r0.w;
    let turn = cross(T, L.D) * (q * (4.0 - 3.0 * q) / L.r1.w);
    d += L.D * (q * q * (2.0 - q)) - jP * L.ab.x - jQ * L.ab.y + cross(turn, k);
  } else {
    let flap = L.r4.z * L.surge;
    let fu = u * u * (2.0 - u);
    let fu1 = u * (4.0 - 3.0 * u);
    let ph = L.ph.x;
    let a = ph - PLANT_WAVE_K * u;
    let b = L.waveB - 1.4 * u;
    let c = L.ph.y - 5.5 * u;
    let R = 1.12 * sin(a) + 0.16 * sin(b) + 0.1 * sin(c);
    let R1 = -1.12 * PLANT_WAVE_K * cos(a) - 0.224 * cos(b) - 0.55 * cos(c);
    let F = flap * fu * R;
    let F1 = flap * (fu1 * R + fu * R1);
    let G = -flap * 1.12 * (sin(ph) * k.x - cos(ph) * k.y);
    let th = L.r6.w * u * (0.25 * sin(L.ph.z - 0.6 * u + 1.2) + 0.08 * sin(L.ph.w - 3.0 * u));
    // (Its flutter, its sections turned with the bend, along T, and with the twist, about it; then
    // the whole blade, fluttered, turned about the stalk's tip and carried with it.)
    let fl = N * (F + s * th) + T * (G - k.z * F1 / L.r2.w) - X * (k.z * th);
    let rb = p - L.r1.xyz + fl;
    d += L.Dt + fl + L.s1 * cross(L.wb, rb) + L.s2 * (L.wb * dot(L.wb, rb) - rb * L.th2);
  }
  return d;
}

// The frame (T, X, N) of a unit quaternion.
fn plant_frame(q: vec4f) -> mat3x3f {
  let x = q.x;
  let y = q.y;
  let z = q.z;
  let w = q.w;
  return mat3x3f(
    vec3f(1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + w * z), 2.0 * (x * z - w * y)),
    vec3f(2.0 * (x * y - w * z), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + w * x)),
    vec3f(2.0 * (x * z + w * y), 2.0 * (y * z - w * x), 1.0 - 2.0 * (x * x + y * y)));
}

// The displaced point a step along the rest surface's tangent tg from the vertex (its chain
// coordinates and frame moved with it), less the vertex's own displacement d0.
fn plant_step(L: PlantLeaf, rest: vec3f, mv: PlantMV, F: mat3x3f, tg: vec3f, d0: vec3f) -> vec3f {
  let tt = dot(tg, F[0]);
  let dl = PLANT_EPS * tt;
  let p = rest + tg * PLANT_EPS;
  let v = mv.a.y;
  let u = mv.a.z;
  if (u < 0.0) {
    // (On the stalk: further along it, its J_P and J_Q with it, and round its ring.)
    let q = v / L.r0.w;
    let dq = q * (4.0 - 3.0 * q) * dl / L.r1.w;
    let jP = mv.d.xyz + F[0] * (dot(F[0], L.P) * dq);
    let jQ = mv.e.xyz + F[0] * (dot(F[0], L.Q) * dq);
    return plant_point(L, true, p, v + dl * L.r0.w / L.r1.w, u, 0.0, F[0], F[1], F[2], mv.c.xyz + (tg - F[0] * tt) * PLANT_EPS, jP, jQ) - d0;
  }
  let dth = mv.c.x * dl;
  let fu = u * u * (2.0 - u);
  let T = F[0] - F[2] * dth;
  let N = F[2] + F[0] * dth;
  let k = mv.c.yz + vec2f(cos(PLANT_WAVE_K * u), sin(PLANT_WAVE_K * u)) * (fu * dth);
  return plant_point(L, false, p, v, u + dl / L.r2.w, mv.a.w + PLANT_EPS * dot(tg, F[1]), T, F[1], N, vec3f(k, mv.c.w + PLANT_EPS * dot(tg, F[2])), vec3f(0.0), vec3f(0.0)) - d0;
}

// What plant_point takes as k at the vertex itself.
fn plant_k(mv: PlantMV) -> vec3f {
  return select(mv.c.yzw, mv.c.xyz, mv.a.z < 0.0);
}

fn plant_move(rest: vec3f, n: vec3f, mv: PlantMV) -> PlantMoved {
  let L = plant_leaf(u32(mv.a.x));
  let F = plant_frame(mv.b);
  let d0 = plant_point(L, mv.a.z < 0.0, rest, mv.a.y, mv.a.z, mv.a.w, F[0], F[1], F[2], plant_k(mv), mv.d.xyz, mv.e.xyz);
  var p = rest + d0;
  p.y = max(p.y, min(rest.y, PLANT_FLOOR));
  // The normal: the rest surface's two tangents (along the chain, and across) carried by the
  // displacement's differences.
  var ta = F[0] - n * dot(n, F[0]);
  if (dot(ta, ta) < 1e-8) { ta = F[1] - n * dot(n, F[1]); }
  ta = normalize(ta);
  let tb = cross(n, ta);
  let ua = ta + plant_step(L, rest, mv, F, ta, d0) / PLANT_EPS;
  let ub = tb + plant_step(L, rest, mv, F, tb, d0) / PLANT_EPS;
  let c = cross(ua, ub);
  let cl = length(c);
  var nn = n;
  if (cl > 1e-12) { nn = c * (select(1.0, -1.0, dot(c, n) < 0.0) / cl); }
  return PlantMoved(p, nn);
}

fn plant_displace(rest: vec3f, mv: PlantMV) -> vec3f {
  let L = plant_leaf(u32(mv.a.x));
  let F = plant_frame(mv.b);
  var p = rest + plant_point(L, mv.a.z < 0.0, rest, mv.a.y, mv.a.z, mv.a.w, F[0], F[1], F[2], plant_k(mv), mv.d.xyz, mv.e.xyz);
  p.y = max(p.y, min(rest.y, PLANT_FLOOR));
  return p;
}

fn plant_normal(rest: vec3f, n: vec3f, mv: PlantMV) -> vec3f {
  return plant_move(rest, n, mv).n;
}

// How far a point x into a solid (or past the glass's line) is pushed back: softly at first.
fn plant_soft(x: f32) -> f32 {
  return select(x - PLANT_SOFT, x * x / (4.0 * PLANT_SOFT), x < 2.0 * PLANT_SOFT);
}

// p pushed out of the capsule a .. b (radius r).
fn plant_pushOut(p: vec3f, a: vec3f, b: vec3f, r: f32) -> vec3f {
  let e = b - a;
  let h = clamp(dot(p - a, e) / max(dot(e, e), 1e-12), 0.0, 1.0);
  let q = p - a - e * h;
  let d = length(q);
  if (d >= r) { return p; }
  let dir = select(vec3f(0.0, 1.0, 0.0), q / max(d, 1e-30), d > 1e-9);
  return p + dir * plant_soft(r - d);
}

// p kept out of the driftwood's, the rocks' and the equipment's solids and in from the glass.
fn plant_collide(p: vec3f) -> vec3f {
  var q = p;
${r||`  // (No solids given.)`}
  let l = length(q);
  let x = l - (PLANT_GLASS - 2.0 * PLANT_SOFT);
  if (x > 0.0) { q *= (l - plant_soft(x)) / l; }
  return q;
}
`}export{w as a,r as c,b as i,X as l,i as n,y as o,_ as r,$ as s,a as t,ne as u};