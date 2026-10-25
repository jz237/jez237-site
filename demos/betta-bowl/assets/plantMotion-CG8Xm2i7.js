import{l as e,n as t,t as n}from"./betta-LYyr4e0c.js";var r=e({COLLIDE_MARGIN:()=>o,COLLIDE_SOFT:()=>s,FLOOR:()=>a,LEAF_STRIDE:()=>40,LEAN_CAP:()=>i,MOTION_VERTEX_STRIDE:()=>20,PHASE_STRIDE:()=>12,PLANT_MOTION:()=>u,SOLID_SKIN:()=>c,TAME_ALLOW:()=>W,TAME_MIN:()=>G,WAVE_K:()=>h,forgetMotion:()=>z,frameQuat:()=>v,leafPhases:()=>S,leafReach:()=>V,leafRow:()=>_,moveVertex:()=>B,plantMotionWGSL:()=>Q,plantSolids:()=>J,solidTrespass:()=>q,tameMotion:()=>U,tamedLeaves:()=>K}),i=.25,a=n+.004,o=.002,s=.0015,c=1.12,l=.001,u={tall:{cap:.07,k:.022,stalk:.03,rate:[1,.6],side:.3,twist:.4,sway:[.022,.015],height:.6},small:{cap:.04,k:.009,stalk:.025,rate:[1.3,.5],side:.3,twist:.25,sway:[.013,.009],height:.35}},d=2*Math.PI/17,f=1.12,p=.16,m=.1,h=1.8,g=(e,t,n)=>Math.min(Math.max(e,t),n);function _(e,t,n){let r=u[n.plant],i=n.Ls/(n.Ls+n.Lb),a=(n.base[0]*13.7+n.base[1]*9.3+n.base[2]*17.1)*(12/7)+n.dir[0]*4.2,o=r.rate[0]+r.rate[1]*(.5+.5*Math.sin(a*1.7)),s=Math.min(r.cap*n.Lb,r.k),c=r.stalk*n.Ls,l=[n.tip[0]-n.base[0],n.tip[1]-n.base[1],n.tip[2]-n.base[2]],d=[n.S[1]*n.P[2]-n.S[2]*n.P[1],n.S[2]*n.P[0]-n.S[0]*n.P[2],n.S[0]*n.P[1]-n.S[1]*n.P[0]],f=.5*(n.P[0]*n.jP[0]+n.P[1]*n.jP[1]+n.P[2]*n.jP[2]+d[0]*n.jQ[0]+d[1]*n.jQ[1]+d[2]*n.jQ[2]),p=g(1/(1+(n.S[0]*l[0]+n.S[1]*l[1]+n.S[2]*l[2])/n.Ls-f),.25,2),m=2.2*n.crown[0]+1.3*n.crown[2];e.set([...n.foot,i,...n.base,n.Ls,...n.S,n.Lb,...n.P,p,a,o,s,c,...n.crown,r.height,r.sway[0],r.sway[1],m,n.young?0:r.twist,r.side,n.plant===`tall`?0:1,0,0,...n.jP,0,...n.jQ,0],t)}function v(e,t,n){let r=e[0],i=e[1],a=e[2],o=t[0],s=t[1],c=t[2],l=n[0],u=n[1],d=n[2],f=r+s+d,p,m,h,g;if(f>0){let e=.5/Math.sqrt(f+1);g=.25/e,p=(c-u)*e,m=(l-a)*e,h=(i-o)*e}else if(r>s&&r>d){let e=2*Math.sqrt(1+r-s-d);g=(c-u)/e,p=.25*e,m=(o+i)/e,h=(l+a)/e}else if(s>d){let e=2*Math.sqrt(1+s-r-d);g=(l-a)/e,p=(o+i)/e,m=.25*e,h=(u+c)/e}else{let e=2*Math.sqrt(1+d-r-s);g=(i-o)/e,p=(l+a)/e,m=(u+c)/e,h=.25*e}let _=Math.hypot(p,m,h,g);return[p/_,m/_,h/_,g/_]}var y=2*Math.PI,b=e=>e-y*Math.floor(e/y);function x(e,t,n,r,i){let a=t*40,o=e[a+26],s=e[a+16],c=e[a+17],l=c*n+s+.32*Math.sin(.43*n+o);r[i]=b(l),r[i+1]=b(2.7*l),r[i+2]=b(.81*l),r[i+3]=b(2.1*l),r[i+4]=b(.5*c*n+.73*s),r[i+5]=b(.63*n+o),r[i+6]=.85+.15*Math.sin(d*n+o),r[i+7]=0,r[i+8]=e[a+24]*(.73*Math.sin(.82*n+o)+.27*Math.sin(1.19*n+1.7*o)),r[i+9]=e[a+25]*Math.sin(.67*n+o+.8),r[i+10]=0,r[i+11]=0}function S(e,t,n=null){let r=e.length/40,i=n??new Float32Array(r*12);for(let n=0;n<r;n++)x(e,n,t,i,n*12);return i}var C=e=>e<1e-4?1:Math.sin(e)/e;function w(e,t,n,r,a,o){let s=o.q??=new Float64Array(12);if(typeof a==`number`)x(e,r,a,s,0);else for(let e=0;e<12;e++)s[e]=a[r*12+e];let c=e[t+19];o.b=t,o.ph=s[0],o.ph27=s[1],o.ph081=s[2],o.ph21=s[3],o.waveB=s[5],o.surge=s[6],o.swayX=s[8],o.swayZ=s[9];let l=e[t+8],u=e[t+9],d=e[t+10],f=e[t+12],p=e[t+13],m=e[t+14],h=u*m-d*p,g=d*f-l*m,_=l*p-u*f,v=c*o.surge*Math.sin(o.ph+.6),y=c*o.surge*.45*Math.sin(s[4]+.9),b=f*v+h*y,S=p*v+g*y,w=m*v+_*y;if(n){let a=n[r*4],o=n[r*4+1],s=n[r*4+2],c=a*l+o*u+s*d,f=e[t+15],p=f*(a-l*c),m=f*(o-u*c),h=f*(s-d*c),g=Math.min(1,i*e[t+7]/Math.max(Math.hypot(p,m,h),1e-12));b+=p*g,S+=m*g,w+=h*g}o.Dx=b,o.Dy=S,o.Dz=w;let T=b*f+S*p+w*m,E=b*h+S*g+w*_;o.al=T,o.be=E,o.P=[f,p,m],o.Q=[h,g,_],o.tx=b-T*e[t+32]-E*e[t+36],o.ty=S-T*e[t+33]-E*e[t+37],o.tz=w-T*e[t+34]-E*e[t+38];let D=1/e[t+7],O=e[t+28]*e[t+18]*o.surge*Math.sin(s[4]-.5)/e[t+11];o.bx=(u*w-d*S)*D+f*O,o.by=(d*b-l*w)*D+p*O,o.bz=(l*S-u*b)*D+m*O,o.th2=o.bx*o.bx+o.by*o.by+o.bz*o.bz;let k=Math.sqrt(o.th2),A=C(.5*k);return o.s1=C(k),o.s2=.5*A*A,o}function T(e,t,n,r,i,a,o,s,c,l,u,d,g,_,v,y,b){let x=t.b,S=Math.max(i-e[x+1],0)/e[x+23],C=S*S,w=2*S/e[x+23],T=C*t.swayX,E=-w*((r-e[x])*t.swayX+(a-e[x+2])*t.swayZ),D=C*t.swayZ;if(n){let n=o/e[x+3],r=n*n*(2-n),i=n*(4-3*n)/e[x+7],a=(l[1]*t.Dz-l[2]*t.Dy)*i,s=(l[2]*t.Dx-l[0]*t.Dz)*i,c=(l[0]*t.Dy-l[1]*t.Dx)*i;T+=r*t.Dx-t.al*y[0]-t.be*y[3]+s*v-c*_,E+=r*t.Dy-t.al*y[1]-t.be*y[4]+c*g-a*v,D+=r*t.Dz-t.al*y[2]-t.be*y[5]+a*_-s*g}else{let n=e[x+18]*t.surge,o=v,y=s*s*(2-s),b=s*(4-3*s),S=t.ph,C=S-h*s,w=t.waveB-1.4*s,O=t.ph27-5.5*s,k=f*Math.sin(C)+p*Math.sin(w)+m*Math.sin(O),A=-1.12*h*Math.cos(C)-1.4*p*Math.cos(w)-5.5*m*Math.cos(O),j=n*y*k,M=n*(b*k+y*A),N=-n*f*(Math.sin(S)*g-Math.cos(S)*_),P=e[x+27]*s*(.25*Math.sin(t.ph081-.6*s+1.2)+.08*Math.sin(t.ph21-3*s)),F=j+c*P,I=N-o*M/e[x+11],L=-o*P,R=d[0]*F+l[0]*I+u[0]*L,z=d[1]*F+l[1]*I+u[1]*L,B=d[2]*F+l[2]*I+u[2]*L,V=r-e[x+4]+R,H=i-e[x+5]+z,U=a-e[x+6]+B,W=t.bx,G=t.by,K=t.bz,q=W*V+G*H+K*U;T+=t.tx+R+t.s1*(G*U-K*H)+t.s2*(W*q-t.th2*V),E+=t.ty+z+t.s1*(K*V-W*U)+t.s2*(G*q-t.th2*H),D+=t.tz+B+t.s1*(W*H-G*V)+t.s2*(K*q-t.th2*U)}b[0]=T,b[1]=E,b[2]=D}function E(e,t,n,r,i){let a=e[t+4],o=e[t+5],s=e[t+6],c=e[t+7];n[0]=1-2*(o*o+s*s),n[1]=2*(a*o+c*s),n[2]=2*(a*s-c*o),r[0]=2*(a*o-c*s),r[1]=1-2*(a*a+s*s),r[2]=2*(o*s+c*a),i[0]=2*(a*s+c*o),i[1]=2*(o*s-c*a),i[2]=1-2*(a*a+o*o)}var D={},O=[0,0,0],k=[0,0,0],A=[0,0,0],j=[0,0,0],M=[0,0,0],N=[0,0,0],P=[0,0,0],F=[0,0,0],I=[0,0,0,0,0,0],L=[0,0,0,0,0,0],R={L:null,li:-1,t:NaN,lean:null},z=()=>{R.L=null};function B(e,t,n,r,i,o,s,c,u,d,f,p){let m=i[o];if(!(m>=0))return!1;let g=m*40,_=D;(R.L!==s||R.li!==m||R.t!==u||R.lean!==c)&&(w(s,g,c,m,u,_),R.L=s,R.li=m,R.t=u,R.lean=c);let v=e[t],y=e[t+1],b=e[t+2],x=i[o+1],S=i[o+2],C=i[o+3],z=i[o+8],B=i[o+9],V=i[o+10],H=S<0;if(E(i,o,O,k,A),H){for(let e=0;e<3;e++)I[e]=i[o+12+e],I[3+e]=i[o+16+e];T(s,_,!0,v,y,b,x,S,C,O,k,A,z,B,V,I,N)}else T(s,_,!1,v,y,b,x,S,C,O,k,A,B,V,i[o+11],null,N);if(d[f]=v+N[0],d[f+1]=Math.max(y+N[1],Math.min(y,a)),d[f+2]=b+N[2],!p)return!0;let U=n[r],W=n[r+1],G=n[r+2],K=O[0],q=O[1],J=O[2],Y=K*U+q*W+J*G;K-=U*Y,q-=W*Y,J-=G*Y;let X=Math.hypot(K,q,J);X<1e-4&&(K=k[0],q=k[1],J=k[2],Y=K*U+q*W+J*G,K-=U*Y,q-=W*Y,J-=G*Y,X=Math.hypot(K,q,J)||1),K/=X,q/=X,J/=X;let Z=W*J-G*q,Q=G*K-U*J,ee=U*q-W*K;for(let e=0;e<2;e++){let t=e?Z:K,n=e?Q:q,r=e?ee:J,a=e?F:P,c=t*O[0]+n*O[1]+r*O[2],u=l*c,d=v+l*t,f=y+l*n,p=b+l*r;if(H){let e=x/s[g+3],i=e*(4-3*e)*u/s[g+7],o=_.P,m=_.Q,h=(O[0]*o[0]+O[1]*o[1]+O[2]*o[2])*i,v=(O[0]*m[0]+O[1]*m[1]+O[2]*m[2])*i;for(let e=0;e<3;e++)L[e]=I[e]+O[e]*h,L[3+e]=I[3+e]+O[e]*v;T(s,_,!0,d,f,p,x+u*s[g+3]/s[g+7],S,C,O,k,A,z+l*(t-O[0]*c),B+l*(n-O[1]*c),V+l*(r-O[2]*c),L,a)}else{let e=z*u,c=S*S*(2-S);for(let t=0;t<3;t++)j[t]=O[t]-e*A[t],M[t]=A[t]+e*O[t];let m=l*(t*k[0]+n*k[1]+r*k[2]),v=l*(t*A[0]+n*A[1]+r*A[2]);T(s,_,!1,d,f,p,x,S+u/s[g+11],C+m,j,k,M,B+Math.cos(h*S)*c*e,V+Math.sin(h*S)*c*e,i[o+11]+v,null,a)}}let te=K+(P[0]-N[0])/l,ne=q+(P[1]-N[1])/l,re=J+(P[2]-N[2])/l,ie=Z+(F[0]-N[0])/l,ae=Q+(F[1]-N[1])/l,oe=ee+(F[2]-N[2])/l,$=ne*oe-re*ae,se=re*ie-te*oe,ce=te*ae-ne*ie,le=Math.hypot($,se,ce);if(!(le>1e-12))return p[f]=U,p[f+1]=W,p[f+2]=G,!0;let ue=$*U+se*W+ce*G<0?-1/le:1/le;return p[f]=$*ue,p[f+1]=se*ue,p[f+2]=ce*ue,!0}function V(e,t){let n=t*40,r=1.1*e[n+19],i=Math.min(1,Math.hypot(e[n+32],e[n+33],e[n+34])+Math.hypot(e[n+36],e[n+37],e[n+38]));return r*Math.max(2,1+i+1.2*e[n+11]/e[n+7])+e[n+18]*(1.4+1.2+1.2*e[n+28])+.05*e[n+27]+3*Math.hypot(e[n+24],e[n+25])}var H=[18,19,27,24,25];function U(e,t,{minScale:n=.25,allow:r=0}={}){let{vertex:i,leaves:a}=e.motion,o=e.positions,s=o.length/3,c=a.length/40,l=Array(c).fill(1),u=Array.from({length:c},()=>[]),d=Array.from({length:c},(e,t)=>V(a,t));for(let e=0;e<s;e++){let n=i[e*20];if(!(n>=0))continue;let a=t(o[e*3],o[e*3+1],o[e*3+2]);a>-d[n]&&u[n].push(e,Math.max(a,0)+r)}let f=[0,0,0];for(let e=0;e<c;e++){let r=u[e];if(!r.length)continue;let s=e*40,c=H.map(e=>a[s+e]),p=t.near?t.near(o,r,d[e]):t,m=e=>H.forEach((t,n)=>a[s+t]=c[n]*e),h=(e,t=null)=>{m(e),z();let n=-1/0,s=t?40:100;for(let e=0;e<s;e++){let c=60/s*e+.07;for(let e=0;e<r.length;e+=2){let s=r[e];B(o,s*3,null,0,i,s*20,a,null,c,f,0,null);let l=p(f[0],f[1],f[2])-r[e+1];l>n&&(n=l),t&&l>t[e>>1]&&(t[e>>1]=l)}}return n},g=new Float64Array(r.length/2).fill(-1/0);if(h(1,g),r=r.filter((e,t)=>g[t>>1]>-.012),!r.length||h(1)<=0){m(1);continue}let _=n,v=1;for(let e=0;e<5;e++){let e=.5*(_+v);h(e)<=0?_=e:v=e}m(_),l[e]=_}return z(),l}var W=.003,G=.25;function K(e,t,{allow:n=W,minScale:r=G,solids:i=null}={}){let{vertex:a}=e.motion,o=e.positions;if(!i){let e=[];for(let t=0;t<o.length/3;t++)a[t*20]>=0&&e.push(o[t*3],o[t*3+1],o[t*3+2]);i=J(t,e)}let s=Float32Array.from(e.motion.leaves);return{leaves:s,scales:U({positions:o,motion:{vertex:a,leaves:s}},q(i),{allow:n,minScale:r}),solids:i}}function q(e){let n=(n,r,i)=>{let a=Math.hypot(n,r,i)-(t-2*s);for(let t of e)a=Math.max(a,t.r-Y(n,r,i,t.a,t.b));return a};return n.near=(t,r,i)=>{let a=e.filter(e=>{for(let n=0;n<r.length;n+=2){let a=r[n];if(Y(t[a*3],t[a*3+1],t[a*3+2],e.a,e.b)<e.r+i+.001)return!0}return!1});return a.length===e.length?n:q(a)},n}function J(e,t=null,n=o){let r=[];for(let i of e){if(!(i.solid>0))continue;let e=i.solid*c+n;if(t){let n=1/0,r=[0,1,2].map(t=>Math.min(i.a[t],i.b[t])-e),a=[0,1,2].map(t=>Math.max(i.a[t],i.b[t])+e);for(let e=0;e<t.length;e+=3)t[e]<r[0]||t[e]>a[0]||t[e+1]<r[1]||t[e+1]>a[1]||t[e+2]<r[2]||t[e+2]>a[2]||(n=Math.min(n,Y(t[e],t[e+1],t[e+2],i.a,i.b)));if(n<i.solid)continue;e=Math.min(e,n-1e-4)}r.push({a:[...i.a],b:[...i.b],r:Math.round(e*1e6)/1e6})}return r}function Y(e,t,n,r,i){let a=i[0]-r[0],o=i[1]-r[1],s=i[2]-r[2],c=e-r[0],l=t-r[1],u=n-r[2],d=a*a+o*o+s*s,f=d>0?g((c*a+l*o+u*s)/d,0,1):0;return Math.hypot(c-a*f,l-o*f,u-s*f)}var X=e=>{let t=Number.isInteger(e)?`${e}.0`:String(e);return/e/.test(t)&&!/\./.test(t)?t.replace(`e`,`.0e`):t},Z=e=>`vec3f(${e.map(e=>X(Math.round(e*1e6)/1e6)).join(`, `)})`;function Q(e=[],n=null){let r=J(e,n).map(e=>`  q = plant_pushOut(q, ${Z(e.a)}, ${Z(e.b)}, ${X(e.r)});`).join(`
`);return`
// ---- the betta bowl's plants in motion (src/render/scape/plantMotion.mjs) -------------------------
const PLANT_FLOOR: f32 = ${X(a)};
const PLANT_GLASS: f32 = ${X(t)};
const PLANT_SOFT: f32 = ${X(s)};
const PLANT_EPS: f32 = ${X(l)};
const PLANT_LEAN_CAP: f32 = ${X(i)};
const PLANT_WAVE_K: f32 = ${X(h)};

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

// p kept out of the driftwood's and the rocks' solids and in from the glass.
fn plant_collide(p: vec3f) -> vec3f {
  var q = p;
${r||`  // (No solids given.)`}
  let l = length(q);
  let x = l - (PLANT_GLASS - 2.0 * PLANT_SOFT);
  if (x > 0.0) { q *= (l - plant_soft(x)) / l; }
  return q;
}
`}export{Q as a,K as c,_ as i,v as n,r as o,S as r,J as s,h as t};