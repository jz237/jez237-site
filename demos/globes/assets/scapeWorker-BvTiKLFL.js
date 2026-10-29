(function(){var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};let n=-.6,r=.99125,i=.95,a={BARK:1,WOOD_END:2,ROCK:3,LEAF_BIG:4,LEAF_SMALL:5,STEM:6,ROOT:7,HEATER:8,HEATER_LAMP:9,SPONGE:10,TUBE:11,SUCTION:12};function o(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}let s=(()=>{let e=o(77),t=Array.from({length:256},(e,t)=>t);for(let n=255;n>0;n--){let r=Math.floor(e()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return Uint8Array.from([...t,...t])})(),c=e=>e*e*e*(e*(e*6-15)+10),l=(e,t,n,r)=>{let i=e<8?t:n,a=e<4?n:e===12||e===14?t:r;return(e&1?-i:i)+(e&2?-a:a)};function u(e,t,n){let r=Math.floor(e)&255,i=Math.floor(t)&255,a=Math.floor(n)&255;e-=Math.floor(e),t-=Math.floor(t),n-=Math.floor(n);let o=c(e),u=c(t),d=c(n),f=s[r]+i,p=s[f]+a,m=s[f+1]+a,h=s[r+1]+i,g=s[h]+a,_=s[h+1]+a,v=(e,t,n)=>e+(t-e)*n;return v(v(v(l(s[p]&15,e,t,n),l(s[g]&15,e-1,t,n),o),v(l(s[m]&15,e,t-1,n),l(s[_]&15,e-1,t-1,n),o),u),v(v(l(s[p+1]&15,e,t,n-1),l(s[g+1]&15,e-1,t,n-1),o),v(l(s[m+1]&15,e,t-1,n-1),l(s[_+1]&15,e-1,t-1,n-1),o),u),d)}function d(e,t,n,r=4,i=.5){let a=0,o=1,s=0;for(let c=0;c<r;c++)a+=o*u(e,t,n),s+=o,o*=i,e=e*2.03+17.1,t=t*2.03+3.7,n=n*2.03+9.3;return a/s}var f=class{constructor(e){this.name=e,this.p=[],this.n=[],this.a=[],this.i=[],this.m=[]}get vertexCount(){return this.p.length/3}vertex(e,t=[0,0,0,1],n=null){return this.p.push(e[0],e[1],e[2]),n?this.n.push(n[0],n[1],n[2]):this.n.push(null,null,null),this.a.push(t[0],t[1],t[2],t[3]),this.vertexCount-1}tri(e,t,n,r){this.i.push(e,t,n),this.m.push(r)}quad(e,t,n,r,i){this.tri(e,t,n,i),this.tri(e,n,r,i)}finish(){let e=this.vertexCount,t=new Float32Array(e*3),n=new Uint8Array(e);for(let r=0;r<e;r++)this.n[r*3]===null?n[r]=1:t.set([this.n[r*3],this.n[r*3+1],this.n[r*3+2]],r*3);for(let e=0;e<this.i.length;e+=3){let[r,i,a]=[this.i[e],this.i[e+1],this.i[e+2]],o=this.p,s=[o[i*3]-o[r*3],o[i*3+1]-o[r*3+1],o[i*3+2]-o[r*3+2]],c=[o[a*3]-o[r*3],o[a*3+1]-o[r*3+1],o[a*3+2]-o[r*3+2]],l=[s[1]*c[2]-s[2]*c[1],s[2]*c[0]-s[0]*c[2],s[0]*c[1]-s[1]*c[0]];for(let e of[r,i,a])if(n[e])for(let n=0;n<3;n++)t[e*3+n]+=l[n]}for(let n=0;n<e;n++){let e=Math.hypot(t[n*3],t[n*3+1],t[n*3+2])||1;for(let r=0;r<3;r++)t[n*3+r]/=e}return{name:this.name,positions:Float32Array.from(this.p),normals:t,attrs:Float32Array.from(this.a),indices:Uint32Array.from(this.i),materials:Uint8Array.from(this.m)}}};let p=.014;function m(e,t,n,r){let i=new Float32Array(t*t).fill(r),o=new Float32Array(t*t).fill(r),s=new Float32Array(t*t).fill(1/0),c=2*n/t,l=e=>(e+n)/c-.5,u=(e,n,r,i,a)=>{let o=l(e[n]),s=l(e[n+2]),c=l(e[r]),u=l(e[r+2]),d=l(e[i]),f=l(e[i+2]),p=(u-f)*(o-d)+(d-c)*(s-f);if(Math.abs(p)<1e-12){for(let[l,p,m]of[[o,s,e[n+1]],[c,u,e[r+1]],[d,f,e[i+1]]]){let e=Math.round(l),n=Math.round(p);e>=0&&n>=0&&e<t&&n<t&&a(e+t*n,m)}return}let m=Math.max(0,Math.ceil(Math.min(o,c,d))),h=Math.min(t-1,Math.floor(Math.max(o,c,d))),g=Math.max(0,Math.ceil(Math.min(s,u,f))),_=Math.min(t-1,Math.floor(Math.max(s,u,f)));for(let l=g;l<=_;l++)for(let g=m;g<=h;g++){let m=((u-f)*(g-d)+(d-c)*(l-f))/p,h=((f-s)*(g-d)+(o-d)*(l-f))/p,_=1-m-h;m<-1e-6||h<-1e-6||_<-1e-6||a(g+t*l,m*e[n+1]+h*e[r+1]+_*e[i+1])}};for(let t of e){let e=t.positions,n=t.indices;for(let r=0;r<n.length/3;r++){let c=t.materials[r],l=n[r*3]*3,d=n[r*3+1]*3,f=n[r*3+2]*3;if(c===a.ROCK||c===a.TUBE&&Math.max(e[l+1],e[d+1],e[f+1])<=-.6+.04)u(e,l,d,f,(e,t)=>{t-p>i[e]&&(i[e]=t-p)});else if(c===a.BARK||c===a.WOOD_END){let t=Math.max(e[l+1],e[d+1],e[f+1])<=-.54;u(e,l,d,f,(e,n)=>{n<s[e]&&(s[e]=n),t&&n-p>o[e]&&(o[e]=n-p)})}}}let d=i;for(let e=0;e<t*t;e++)s[e]<=-.595&&o[e]>d[e]&&(d[e]=o[e]);return d}let h=.25,g=-.596,_=.0015,v=.001,y={tall:{cap:.07,k:.022,stalk:.03,rate:[1,.6],side:.3,twist:.4,sway:[.022,.015],height:.6},small:{cap:.04,k:.009,stalk:.025,rate:[1.3,.5],side:.3,twist:.25,sway:[.013,.009],height:.35}},b=2*Math.PI/17,x=1.12,S=.16,C=.1,w=1.8,T=(e,t,n)=>Math.min(Math.max(e,t),n);function E(e,t,n){let r=y[n.plant],i=n.Ls/(n.Ls+n.Lb),a=(n.base[0]*13.7+n.base[1]*9.3+n.base[2]*17.1)*(12/7)+n.dir[0]*4.2,o=r.rate[0]+r.rate[1]*(.5+.5*Math.sin(a*1.7)),s=Math.min(r.cap*n.Lb,r.k),c=r.stalk*n.Ls,l=[n.tip[0]-n.base[0],n.tip[1]-n.base[1],n.tip[2]-n.base[2]],u=[n.S[1]*n.P[2]-n.S[2]*n.P[1],n.S[2]*n.P[0]-n.S[0]*n.P[2],n.S[0]*n.P[1]-n.S[1]*n.P[0]],d=.5*(n.P[0]*n.jP[0]+n.P[1]*n.jP[1]+n.P[2]*n.jP[2]+u[0]*n.jQ[0]+u[1]*n.jQ[1]+u[2]*n.jQ[2]),f=T(1/(1+(n.S[0]*l[0]+n.S[1]*l[1]+n.S[2]*l[2])/n.Ls-d),.25,2),p=2.2*n.crown[0]+1.3*n.crown[2];e.set([...n.foot,i,...n.base,n.Ls,...n.S,n.Lb,...n.P,f,a,o,s,c,...n.crown,r.height,r.sway[0],r.sway[1],p,n.young?0:r.twist,r.side,n.plant===`tall`?0:1,0,0,...n.jP,0,...n.jQ,0],t)}function D(e,t,n){let r=e[0],i=e[1],a=e[2],o=t[0],s=t[1],c=t[2],l=n[0],u=n[1],d=n[2],f=r+s+d,p,m,h,g;if(f>0){let e=.5/Math.sqrt(f+1);g=.25/e,p=(c-u)*e,m=(l-a)*e,h=(i-o)*e}else if(r>s&&r>d){let e=2*Math.sqrt(1+r-s-d);g=(c-u)/e,p=.25*e,m=(o+i)/e,h=(l+a)/e}else if(s>d){let e=2*Math.sqrt(1+s-r-d);g=(l-a)/e,p=(o+i)/e,m=.25*e,h=(u+c)/e}else{let e=2*Math.sqrt(1+d-r-s);g=(i-o)/e,p=(l+a)/e,m=(u+c)/e,h=.25*e}let _=Math.hypot(p,m,h,g);return[p/_,m/_,h/_,g/_]}let O=2*Math.PI,k=e=>e-O*Math.floor(e/O);function A(e,t,n,r,i){let a=t*40,o=e[a+26],s=e[a+16],c=e[a+17],l=c*n+s+.32*Math.sin(.43*n+o);r[i]=k(l),r[i+1]=k(2.7*l),r[i+2]=k(.81*l),r[i+3]=k(2.1*l),r[i+4]=k(.5*c*n+.73*s),r[i+5]=k(.63*n+o),r[i+6]=.85+.15*Math.sin(b*n+o),r[i+7]=0,r[i+8]=e[a+24]*(.73*Math.sin(.82*n+o)+.27*Math.sin(1.19*n+1.7*o)),r[i+9]=e[a+25]*Math.sin(.67*n+o+.8),r[i+10]=0,r[i+11]=0}function j(e,t,n=null){let r=e.length/40,i=n??new Float32Array(r*12);for(let n=0;n<r;n++)A(e,n,t,i,n*12);return i}let M=e=>e<1e-4?1:Math.sin(e)/e;function N(e,t,n,r,i,a){let o=a.q??=/* @__PURE__ */ new Float64Array(12);if(typeof i==`number`)A(e,r,i,o,0);else for(let e=0;e<12;e++)o[e]=i[r*12+e];let s=e[t+19];a.b=t,a.ph=o[0],a.ph27=o[1],a.ph081=o[2],a.ph21=o[3],a.waveB=o[5],a.surge=o[6],a.swayX=o[8],a.swayZ=o[9];let c=e[t+8],l=e[t+9],u=e[t+10],d=e[t+12],f=e[t+13],p=e[t+14],m=l*p-u*f,g=u*d-c*p,_=c*f-l*d,v=s*a.surge*Math.sin(a.ph+.6),y=s*a.surge*.45*Math.sin(o[4]+.9),b=d*v+m*y,x=f*v+g*y,S=p*v+_*y;if(n){let i=n[r*4],a=n[r*4+1],o=n[r*4+2],s=i*c+a*l+o*u,d=e[t+15],f=d*(i-c*s),p=d*(a-l*s),m=d*(o-u*s),g=Math.min(1,h*e[t+7]/Math.max(Math.hypot(f,p,m),1e-12));b+=f*g,x+=p*g,S+=m*g}a.Dx=b,a.Dy=x,a.Dz=S;let C=b*d+x*f+S*p,w=b*m+x*g+S*_;a.al=C,a.be=w,a.P=[d,f,p],a.Q=[m,g,_],a.tx=b-C*e[t+32]-w*e[t+36],a.ty=x-C*e[t+33]-w*e[t+37],a.tz=S-C*e[t+34]-w*e[t+38];let T=1/e[t+7],E=e[t+28]*e[t+18]*a.surge*Math.sin(o[4]-.5)/e[t+11];a.bx=(l*S-u*x)*T+d*E,a.by=(u*b-c*S)*T+f*E,a.bz=(c*x-l*b)*T+p*E,a.th2=a.bx*a.bx+a.by*a.by+a.bz*a.bz;let D=Math.sqrt(a.th2),O=M(.5*D);return a.s1=M(D),a.s2=.5*O*O,a}function P(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){let _=t.b,v=Math.max(i-e[_+1],0)/e[_+23],y=v*v,b=2*v/e[_+23],T=y*t.swayX,E=-b*((r-e[_])*t.swayX+(a-e[_+2])*t.swayZ),D=y*t.swayZ;if(n){let n=o/e[_+3],r=n*n*(2-n),i=n*(4-3*n)/e[_+7],a=(l[1]*t.Dz-l[2]*t.Dy)*i,s=(l[2]*t.Dx-l[0]*t.Dz)*i,c=(l[0]*t.Dy-l[1]*t.Dx)*i;T+=r*t.Dx-t.al*h[0]-t.be*h[3]+s*m-c*p,E+=r*t.Dy-t.al*h[1]-t.be*h[4]+c*f-a*m,D+=r*t.Dz-t.al*h[2]-t.be*h[5]+a*p-s*f}else{let n=e[_+18]*t.surge,o=m,h=s*s*(2-s),g=s*(4-3*s),v=t.ph,y=v-w*s,b=t.waveB-1.4*s,O=t.ph27-5.5*s,k=x*Math.sin(y)+S*Math.sin(b)+C*Math.sin(O),A=-1.12*w*Math.cos(y)-1.4*S*Math.cos(b)-5.5*C*Math.cos(O),j=n*h*k,M=n*(g*k+h*A),N=-n*x*(Math.sin(v)*f-Math.cos(v)*p),P=e[_+27]*s*(.25*Math.sin(t.ph081-.6*s+1.2)+.08*Math.sin(t.ph21-3*s)),F=j+c*P,I=N-o*M/e[_+11],L=-o*P,R=d[0]*F+l[0]*I+u[0]*L,z=d[1]*F+l[1]*I+u[1]*L,B=d[2]*F+l[2]*I+u[2]*L,ee=r-e[_+4]+R,V=i-e[_+5]+z,te=a-e[_+6]+B,ne=t.bx,re=t.by,ie=t.bz,ae=ne*ee+re*V+ie*te;T+=t.tx+R+t.s1*(re*te-ie*V)+t.s2*(ne*ae-t.th2*ee),E+=t.ty+z+t.s1*(ie*ee-ne*te)+t.s2*(re*ae-t.th2*V),D+=t.tz+B+t.s1*(ne*V-re*ee)+t.s2*(ie*ae-t.th2*te)}g[0]=T,g[1]=E,g[2]=D}function F(e,t,n,r,i){let a=e[t+4],o=e[t+5],s=e[t+6],c=e[t+7];n[0]=1-2*(o*o+s*s),n[1]=2*(a*o+c*s),n[2]=2*(a*s-c*o),r[0]=2*(a*o-c*s),r[1]=1-2*(a*a+s*s),r[2]=2*(o*s+c*a),i[0]=2*(a*s+c*o),i[1]=2*(o*s-c*a),i[2]=1-2*(a*a+o*o)}let I={},L=[0,0,0],R=[0,0,0],z=[0,0,0],B=[0,0,0],ee=[0,0,0],V=[0,0,0],te=[0,0,0],ne=[0,0,0],re=[0,0,0,0,0,0],ie=[0,0,0,0,0,0],ae={L:null,li:-1,t:NaN,lean:null},oe=()=>{ae.L=null};function se(e,t,n,r,i,a,o,s,c,l,u,d){let f=i[a];if(!(f>=0))return!1;let p=f*40,m=I;(ae.L!==o||ae.li!==f||ae.t!==c||ae.lean!==s)&&(N(o,p,s,f,c,m),ae.L=o,ae.li=f,ae.t=c,ae.lean=s);let h=e[t],_=e[t+1],y=e[t+2],b=i[a+1],x=i[a+2],S=i[a+3],C=i[a+8],T=i[a+9],E=i[a+10],D=x<0;if(F(i,a,L,R,z),D){for(let e=0;e<3;e++)re[e]=i[a+12+e],re[3+e]=i[a+16+e];P(o,m,!0,h,_,y,b,x,S,L,R,z,C,T,E,re,V)}else P(o,m,!1,h,_,y,b,x,S,L,R,z,T,E,i[a+11],null,V);if(l[u]=h+V[0],l[u+1]=Math.max(_+V[1],Math.min(_,g)),l[u+2]=y+V[2],!d)return!0;let O=n[r],k=n[r+1],A=n[r+2],j=L[0],M=L[1],oe=L[2],se=j*O+M*k+oe*A;j-=O*se,M-=k*se,oe-=A*se;let ce=Math.hypot(j,M,oe);ce<1e-4&&(j=R[0],M=R[1],oe=R[2],se=j*O+M*k+oe*A,j-=O*se,M-=k*se,oe-=A*se,ce=Math.hypot(j,M,oe)||1),j/=ce,M/=ce,oe/=ce;let le=k*oe-A*M,ue=A*j-O*oe,de=O*M-k*j;for(let e=0;e<2;e++){let t=e?le:j,n=e?ue:M,r=e?de:oe,s=e?ne:te,c=t*L[0]+n*L[1]+r*L[2],l=v*c,u=h+v*t,d=_+v*n,f=y+v*r;if(D){let e=b/o[p+3],i=e*(4-3*e)*l/o[p+7],a=m.P,h=m.Q,g=(L[0]*a[0]+L[1]*a[1]+L[2]*a[2])*i,_=(L[0]*h[0]+L[1]*h[1]+L[2]*h[2])*i;for(let e=0;e<3;e++)ie[e]=re[e]+L[e]*g,ie[3+e]=re[3+e]+L[e]*_;P(o,m,!0,u,d,f,b+l*o[p+3]/o[p+7],x,S,L,R,z,C+v*(t-L[0]*c),T+v*(n-L[1]*c),E+v*(r-L[2]*c),ie,s)}else{let e=C*l,c=x*x*(2-x);for(let t=0;t<3;t++)B[t]=L[t]-e*z[t],ee[t]=z[t]+e*L[t];let h=v*(t*R[0]+n*R[1]+r*R[2]),g=v*(t*z[0]+n*z[1]+r*z[2]);P(o,m,!1,u,d,f,b,x+l/o[p+11],S+h,B,R,ee,T+Math.cos(w*x)*c*e,E+Math.sin(w*x)*c*e,i[a+11]+g,null,s)}}let fe=j+(te[0]-V[0])/v,pe=M+(te[1]-V[1])/v,me=oe+(te[2]-V[2])/v,he=le+(ne[0]-V[0])/v,ge=ue+(ne[1]-V[1])/v,_e=de+(ne[2]-V[2])/v,ve=pe*_e-me*ge,ye=me*he-fe*_e,be=fe*ge-pe*he,xe=Math.hypot(ve,ye,be);if(!(xe>1e-12))return d[u]=O,d[u+1]=k,d[u+2]=A,!0;let Se=ve*O+ye*k+be*A<0?-1/xe:1/xe;return d[u]=ve*Se,d[u+1]=ye*Se,d[u+2]=be*Se,!0}function ce(e,t){let n=t*40,r=1.1*e[n+19],i=Math.min(1,Math.hypot(e[n+32],e[n+33],e[n+34])+Math.hypot(e[n+36],e[n+37],e[n+38]));return r*Math.max(2,1+i+1.2*e[n+11]/e[n+7])+e[n+18]*(1.4+1.2+1.2*e[n+28])+.05*e[n+27]+3*Math.hypot(e[n+24],e[n+25])}let le=[18,19,27,24,25];function ue(e,t,{minScale:n=.25,allow:r=0}={}){let{vertex:i,leaves:a}=e.motion,o=e.positions,s=o.length/3,c=a.length/40,l=Array(c).fill(1),u=Array.from({length:c},()=>[]),d=Array.from({length:c},(e,t)=>ce(a,t));for(let e=0;e<s;e++){let n=i[e*20];if(!(n>=0))continue;let a=t(o[e*3],o[e*3+1],o[e*3+2]);a>-d[n]&&u[n].push(e,Math.max(a,0)+r)}let f=[0,0,0];for(let e=0;e<c;e++){let r=u[e];if(!r.length)continue;let s=e*40,c=le.map(e=>a[s+e]),p=t.near?t.near(o,r,d[e]):t,m=e=>le.forEach((t,n)=>a[s+t]=c[n]*e),h=(e,t=null)=>{m(e),oe();let n=-1/0,s=t?40:100;for(let e=0;e<s;e++){let c=60/s*e+.07;for(let e=0;e<r.length;e+=2){let s=r[e];se(o,s*3,null,0,i,s*20,a,null,c,f,0,null);let l=p(f[0],f[1],f[2])-r[e+1];l>n&&(n=l),t&&l>t[e>>1]&&(t[e>>1]=l)}}return n},g=new Float64Array(r.length/2).fill(-1/0);if(h(1,g),r=r.filter((e,t)=>g[t>>1]>-.012),!r.length||h(1)<=0){m(1);continue}let _=n,v=1;for(let e=0;e<5;e++){let e=.5*(_+v);h(e)<=0?_=e:v=e}m(_),l[e]=_}return oe(),l}function de(e,t,{allow:n=.003,minScale:r=.25,solids:i=null}={}){let{vertex:a}=e.motion,o=e.positions;if(!i){let e=[];for(let t=0;t<o.length/3;t++)a[t*20]>=0&&e.push(o[t*3],o[t*3+1],o[t*3+2]);i=pe(t,e)}let s=Float32Array.from(e.motion.leaves);return{leaves:s,scales:ue({positions:o,motion:{vertex:a,leaves:s}},fe(i),{allow:n,minScale:r}),solids:i}}function fe(e){let t=(t,n,r)=>{let a=Math.hypot(t,n,r)-(i-2*_);for(let i of e)a=Math.max(a,i.r-me(t,n,r,i.a,i.b));return a};return t.near=(n,r,i)=>{let a=e.filter(e=>{for(let t=0;t<r.length;t+=2){let a=r[t];if(me(n[a*3],n[a*3+1],n[a*3+2],e.a,e.b)<e.r+i+.001)return!0}return!1});return a.length===e.length?t:fe(a)},t}function pe(e,t=null,n=.002){let r=[];for(let i of e){if(!(i.solid>0))continue;let e=i.solid*1.12+n;if(t){let n=1/0,r=[0,1,2].map(t=>Math.min(i.a[t],i.b[t])-e),a=[0,1,2].map(t=>Math.max(i.a[t],i.b[t])+e);for(let e=0;e<t.length;e+=3)t[e]<r[0]||t[e]>a[0]||t[e+1]<r[1]||t[e+1]>a[1]||t[e+2]<r[2]||t[e+2]>a[2]||(n=Math.min(n,me(t[e],t[e+1],t[e+2],i.a,i.b)));if(n<i.solid)continue;e=Math.min(e,n-1e-4)}r.push({a:[...i.a],b:[...i.b],r:Math.round(e*1e6)/1e6})}return r}function me(e,t,n,r,i){let a=i[0]-r[0],o=i[1]-r[1],s=i[2]-r[2],c=e-r[0],l=t-r[1],u=n-r[2],d=a*a+o*o+s*s,f=d>0?T((c*a+l*o+u*s)/d,0,1):0;return Math.hypot(c-a*f,l-o*f,u-s*f)}let he=e=>{let t=Number.isInteger(e)?`${e}.0`:String(e);return/e/.test(t)&&!/\./.test(t)?t.replace(`e`,`.0e`):t},ge=e=>`vec3f(${e.map(e=>he(Math.round(e*1e6)/1e6)).join(`, `)})`;function _e(e=[],t=null){let n=pe(e,t).map(e=>`  q = plant_pushOut(q, ${ge(e.a)}, ${ge(e.b)}, ${he(e.r)});`).join(`
`);return`
// ---- the betta bowl's plants in motion (src/render/scape/plantMotion.mjs) -------------------------
const PLANT_FLOOR: f32 = ${he(g)};
const PLANT_GLASS: f32 = ${he(i)};
const PLANT_SOFT: f32 = ${he(_)};
const PLANT_EPS: f32 = ${he(v)};
const PLANT_LEAN_CAP: f32 = ${he(h)};
const PLANT_WAVE_K: f32 = ${he(w)};

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
${n||`  // (No solids given.)`}
  let l = length(q);
  let x = l - (PLANT_GLASS - 2.0 * PLANT_SOFT);
  if (x > 0.0) { q *= (l - plant_soft(x)) / l; }
  return q;
}
`}let ve=2e-6,ye=/* @__PURE__ */ new Float32Array(1),be=new Uint32Array(ye.buffer);function xe(e){let t=Math.fround(e);if(t<=e)return t;if(ye[0]=t,t>0)be[0]--;else if(t===0)return-1401298464324817e-60;else be[0]++;return ye[0]}function Se(e){return-xe(-e)}function Ce(e){let t=0;for(;e>4;)e=Math.ceil(e/2),t++;return t}function we(e,t,n,r,i,a){let o=new Uint32Array(n);for(let e=0;e<n;e++)o[e]=e;let s=Math.max(1,2*n),c=new Float64Array(s*3),l=new Float64Array(s*3),u=new Int32Array(s).fill(-1),d=new Int32Array(s).fill(-1),f=new Int32Array(s),p=new Int32Array(s),m=new Int32Array(s),h=1,g=0,_=0,v=0,y=Math.max(i,a),b=new Int32Array(3*y),x=new Float64Array(3*y*6),S=new Float64Array(y),C=new Int32Array(y),w=[[0,0,n,0]];for(;w.length;){let[n,s,y,T]=w.pop();m[n]=T,T>g&&(g=T);let E=1/0,D=1/0,O=1/0,k=-1/0,A=-1/0,j=-1/0,M=1/0,N=1/0,P=1/0,F=-1/0,I=-1/0,L=-1/0;for(let n=s;n<y;n++){let r=o[n],i=r*6,a=r*3;e[i]<E&&(E=e[i]),e[i+1]<D&&(D=e[i+1]),e[i+2]<O&&(O=e[i+2]),e[i+3]>k&&(k=e[i+3]),e[i+4]>A&&(A=e[i+4]),e[i+5]>j&&(j=e[i+5]);let s=t[a],c=t[a+1],l=t[a+2];s<M&&(M=s),s>F&&(F=s),c<N&&(N=c),c>I&&(I=c),l<P&&(P=l),l>L&&(L=l)}c[n*3]=E,c[n*3+1]=D,c[n*3+2]=O,l[n*3]=k,l[n*3+1]=A,l[n*3+2]=j;let R=y-s;if(R<=4){f[n]=s,p[n]=R,_++;continue}let z=R>4096?i:a,B=[F-M,I-N,L-P],ee=[M,N,P],V=B.map(e=>e>1e-12?z/e:0);b.fill(0,0,3*z);for(let e=0;e<3*z;e++){let t=e*6;x[t]=x[t+1]=x[t+2]=1/0,x[t+3]=x[t+4]=x[t+5]=-1/0}let te=V[0],ne=V[1],re=V[2];for(let n=s;n<y;n++){let r=o[n],i=r*6,a=r*3,s=e[i],c=e[i+1],l=e[i+2],u=e[i+3],d=e[i+4],f=e[i+5];for(let e=0;e<3;e++){let n=e===0?te:e===1?ne:re;if(n===0)continue;let r=(t[a+e]-ee[e])*n|0;r>=z&&(r=z-1),r+=e*z,b[r]++;let i=r*6;s<x[i]&&(x[i]=s),c<x[i+1]&&(x[i+1]=c),l<x[i+2]&&(x[i+2]=l),u>x[i+3]&&(x[i+3]=u),d>x[i+4]&&(x[i+4]=d),f>x[i+5]&&(x[i+5]=f)}}let ie=-1,ae=-1,oe=1/0,se=0;for(let e=0;e<3;e++){if(V[e]===0)continue;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=0;for(let c=z-1;c>0;c--){let l=(e*z+c)*6;s+=b[e*z+c],x[l]<t&&(t=x[l]),x[l+1]<n&&(n=x[l+1]),x[l+2]<r&&(r=x[l+2]),x[l+3]>i&&(i=x[l+3]),x[l+4]>a&&(a=x[l+4]),x[l+5]>o&&(o=x[l+5]),C[c]=s;let u=i-t,d=a-n,f=o-r;S[c]=s?u*d+d*f+f*u:0}t=n=r=1/0,i=a=o=-1/0,s=0;for(let c=0;c<z-1;c++){let l=(e*z+c)*6;if(s+=b[e*z+c],x[l]<t&&(t=x[l]),x[l+1]<n&&(n=x[l+1]),x[l+2]<r&&(r=x[l+2]),x[l+3]>i&&(i=x[l+3]),x[l+4]>a&&(a=x[l+4]),x[l+5]>o&&(o=x[l+5]),s===0||C[c+1]===0)continue;let u=i-t,d=a-n,f=o-r,p=s*(u*d+d*f+f*u)+C[c+1]*S[c+1];p<oe&&(oe=p,ie=e,ae=c,se=s)}}let ce;if(ie>=0&&T+1+Ce(Math.max(se,R-se))<=r){let e=ie,n=V[e],r=ee[e],i=s,a=y-1;for(;i<=a;){let s=o[i],c=(t[s*3+e]-r)*n|0;c>=z&&(c=z-1),c<=ae?i++:(o[i]=o[a],o[a]=s,a--)}ce=i}else{ie>=0&&v++;let e=B[0]>=B[1]&&B[0]>=B[2]?0:B[1]>=B[2]?1:2,n=Array.from(o.subarray(s,y));n.sort((n,r)=>t[n*3+e]-t[r*3+e]),o.set(n,s),ce=s+(R>>1)}let le=h++,ue=h++;u[n]=le,d[n]=ue,w.push([ue,ce,y,T+1],[le,s,ce,T+1])}return{idx:o,lo:c,hi:l,left:u,right:d,start:f,count:p,depthOf:m,nodes:h,depth:g,leaves:_,forced:v}}function Te(e,t={}){let n=performance.now(),r=t.layout===`stackless`?1:2,i=t.maxDepth??32;if(!Number.isInteger(i)||i<0)throw Error(`packScape: maxDepth ${i} (a whole number, 0 or more)`);let a=Math.min(i,32),o=t.bins??32,s=Math.min(o,16),c=0,l=0;for(let t of e)c+=t.positions.length/3,l+=t.indices.length/3;if(c>=1<<20)throw Error(`packScape: ${c} vertices (at most ${(1<<20)-1})`);if(Ce(l)>a)throw Error(`packScape: ${l} triangles need a tree ${Ce(l)} deep at least (leaves of 4); maxDepth is ${a}`);let u=new Float32Array(c*3),d=new Float32Array(c*3),f=new Float32Array(c*4),p=new Uint32Array(l*3),m=new Uint8Array(l),h=0,g=0;for(let t of e){let e=t.positions.length/3,n=t.indices.length/3,r=t.name??`(mesh)`;if(!Number.isInteger(e)||!Number.isInteger(n))throw Error(`packScape: ${r}: ragged positions or indices`);if(t.normals.length!==e*3||t.attrs.length!==e*4||t.materials.length!==n)throw Error(`packScape: ${r}: normals/attrs/materials of the wrong length`);u.set(t.positions,h*3),d.set(t.normals,h*3),f.set(t.attrs,h*4);for(let i=0;i<n*3;i++){let n=t.indices[i];if(!(n>=0&&n<e))throw Error(`packScape: ${r}: index ${n} out of range`);p[g*3+i]=n+h}for(let e=0;e<n;e++){let n=t.materials[e];if(!(n>=0&&n<16))throw Error(`packScape: ${r}: material ${n} (0..15)`);m[g+e]=n}h+=e,g+=n}for(let e=0;e<u.length;e++)if(!Number.isFinite(u[e]))throw Error(`packScape: a position is not finite`);let _=new Float64Array(l*6),v=new Float64Array(l*3);for(let e=0;e<l;e++){let t=p[e*3]*3,n=p[e*3+1]*3,r=p[e*3+2]*3;for(let i=0;i<3;i++){let a=Math.min(u[t+i],u[n+i],u[r+i]),o=Math.max(u[t+i],u[n+i],u[r+i]);_[e*6+i]=a,_[e*6+3+i]=o,v[e*3+i]=.5*(a+o)}}let y=we(_,v,l,a,o,s),b=performance.now()-n,x=[],S=[0];for(;S.length;){let e=S.pop();(r===1||y.left[e]>=0)&&x.push(e),y.left[e]>=0&&S.push(y.right[e],y.left[e])}let C=new Int32Array(y.nodes).fill(-1);x.forEach((e,t)=>C[e]=t);let w=x.length,T=4+w*(r===2?4:2),E=T+l*3,D=t.rows??/* @__PURE__ */ new Float32Array;if(D.length%4!=0)throw Error(`packScape: rows of ${D.length} floats (4 a texel)`);let O=E+c*2,k=O+D.length/4,A=1024,j=Math.max(1,Math.ceil(k/A));if(j>8192)throw Error(`packScape: ${j} rows (at most 8192)`);let M=new Float32Array(A*j*4),N=e=>y.left[e]>=0?C[e]:-(y.start[e]*4+y.count[e]-1)-1,P=(e,t)=>{for(let n=0;n<3;n++)M[e*4+n]=xe(y.lo[t*3+n]-ve),M[(e+1)*4+n]=Se(y.hi[t*3+n]+ve)},F=[0,0,0],I=[0,0,0];if(l>0){P(1,0);for(let e=0;e<3;e++)F[e]=M[4+e],I[e]=M[8+e]}else for(let e=0;e<3;e++)F[e]=M[4+e]=1e6,I[e]=M[8+e]=1e6;if(M.set([w,T,l,r===2&&l>0?N(0):0],0),M[7]=E,M[11]=c,M.set([r,y.depth,y.leaves,D.length?O:0],12),r===2)for(let e of x){let t=4+C[e]*4,n=y.left[e],r=y.right[e];P(t,n),P(t+2,r),M[t*4+3]=N(n),M[(t+1)*4+3]=N(r)}else{let e=new Int32Array(y.nodes).fill(w);for(let t of x)y.left[t]>=0&&(e[y.left[t]]=C[y.right[t]],e[y.right[t]]=e[t]);for(let t of x){let n=4+C[t]*2;P(n,t),M[n*4+3]=e[t],M[(n+1)*4+3]=y.left[t]>=0?0:y.start[t]*4+y.count[t]-1+1}}for(let e=0;e<l;e++){let t=y.idx[e],n=(T+e*3)*4;for(let e=0;e<3;e++){let r=p[t*3+e];M[n+e*4]=u[r*3],M[n+e*4+1]=u[r*3+1],M[n+e*4+2]=u[r*3+2],M[n+e*4+3]=e===0?r*16+m[t]:r}}for(let e=0;e<c;e++){let t=(E+e*2)*4;M[t]=d[e*3],M[t+1]=d[e*3+1],M[t+2]=d[e*3+2],M[t+3]=f[e*4],M[t+4]=f[e*4+1],M[t+5]=f[e*4+2],M[t+6]=f[e*4+3]}return M.set(D,O*4),{data:M,width:A,height:j,triangles:l,vertices:c,nodes:y.nodes,internal:y.nodes-y.leaves,leaves:y.leaves,depth:y.depth,lo:F,hi:I,rowBase:D.length?O:0,order:y.idx,layout:r===2?`stack`:`stackless`,forcedSplits:y.forced,buildMs:b,packMs:performance.now()-n-b}}let Ee=Math.fround;Ee(1e-6),Ee(1e-5);function De(e){let t=[];return e.forEach((e,n)=>{let r=t.at(-1);e.count>256?t.push({first:n,count:1,wide:!0,groups:Math.ceil(e.count/256)}):r&&!r.wide&&r.count<15?r.count++:t.push({first:n,count:1,wide:!1,groups:1})}),t}let Oe=Math.fround,ke=/* @__PURE__ */ new Float32Array(1),Ae=new Uint32Array(ke.buffer),je=e=>(ke[0]=e,Ae[0]);function Me(e,t,n=e=>!!e.motion,r={}){let i=e.data;if(i[12]!==2)throw Error(`refitPlan: the BVH is not in the shader's layout (packScape layout "stack")`);let a=i[0],o=i[1],s=i[2],c=i[7],l=i[11],u=i[3];if(s===0||u<0||a===0)throw Error(`refitPlan: the tree has no internal node to refit`);let d=new Float32Array(l*4),f=new Int32Array(l).fill(-1),p=[],m=0,h=0,g=0;if(t.forEach((e,t)=>{let r=e.positions.length/3;for(let t=0;t<r;t++)d.set([e.positions[t*3],e.positions[t*3+1],e.positions[t*3+2],0],(m+t)*4);if(n(e,t)&&e.motion){let n=e.motion.leaves.length/40;p.push({mesh:t,first:h,count:n,vo:m});for(let t=0;t<r;t++)e.motion.vertex[t*20]>=0&&(f[m+t]=g++);h+=n}m+=r}),m!==l)throw Error(`refitPlan: the meshes have ${m} vertices, the BVH ${l}`);let _=new Float32Array(g*28),v=new Uint32Array(g),y=new Float32Array(g*3),b=new Float32Array(h*40),x=new Float32Array(h*4),S=Array(h).fill(1);p.forEach(({mesh:e,first:n,vo:r})=>{let i=t[e];for(let e=0;e<i.positions.length/3;e++){let t=f[r+e];if(t<0)continue;let a=i.motion.vertex.subarray(e*20,(e+1)*20),o=t*28,s=[i.positions[e*3],i.positions[e*3+1],i.positions[e*3+2]];_.set([...s,r+e],o),_.set([i.normals[e*3],i.normals[e*3+1],i.normals[e*3+2],i.attrs[e*4]],o+4),_.set(a,o+8),_[o+8]=a[0]+n,v[t]=r+e,y.set(s,t*3),a[2]===1&&x.set([...s,i.motion.leaves[a[0]*40+11]],(n+a[0])*4)}});let C=pe(r.obstacles??[],y);p.forEach(({mesh:e,first:n})=>{let i=t[e],a=i.motion.leaves;if(r.obstacles){let e=de(i,r.obstacles,{...r,solids:C});a=e.leaves,e.scales.forEach((e,t)=>S[n+t]=e)}b.set(a,n*40)});let w=(e,t)=>i[(o+e*3+t)*4+3],T=new Uint8Array(s),E=0;for(let e=0;e<s;e++){let t=w(e,0)>>>4,n=w(e,1),r=w(e,2);(f[t]>=0||f[n]>=0||f[r]>=0)&&(T[e]=1,E++)}let D=e=>[i[(4+e*4)*4+3],i[(5+e*4)*4+3]],O=e=>{let t=-e-1;return[Math.floor(t/4),t%4+1]},k=e=>{let[t,n]=O(e);for(let e=t;e<t+n&&e<s;e++)if(T[e])return!0;return!1},A=new Int32Array(a).fill(-1);A[u]=0;for(let e=0;e<a;e++)if(!(A[e]<0))for(let t of D(e))t>=0&&(A[t]=A[e]+1);let j=new Uint8Array(a);for(let e=a-1;e>=0;e--)A[e]<0||(j[e]=+!!D(e).some(e=>e<0?k(e):j[e]===1));let M=[];for(let e=0;e<a;e++)j[e]&&M.push(e);M.sort((e,t)=>A[t]-A[e]||e-t);let N=new Int32Array(a).fill(-1);M.forEach((e,t)=>N[e]=t);let P=new Uint32Array(M.length*12),F=[],I=[];M.forEach((e,t)=>{let n=D(e);P.set([e,je(n[0]),je(n[1]),0],t*12),n.forEach((n,r)=>{let a=t*12+4+r*4;if(n<0&&k(n)){let[e,t]=O(n);P.set([2,F.length/4,t,0],a);for(let n=e;n<e+t;n++)F.push(n,Math.round(w(n,0)),w(n,1),w(n,2))}else if(n>=0&&j[n])P.set([1,N[n],0,0],a);else{let t=(4+e*4+r*2)*4,n=t+4;P.set([0,I.length/8,0,0],a),I.push(i[t],i[t+1],i[t+2],0,i[n],i[n+1],i[n+2],0)}})});let L=[];return M.forEach((e,t)=>{let n=A[e];(!L.length||L[L.length-1].depth!==n)&&L.push({depth:n,first:t,count:0}),L[L.length-1].count++}),I.length||I.push(0,0,0,0,0,0,0,0),{moving:g,verts:_,ids:v,rest:y,solids:C,leaves:b,leafCount:h,leafTips:x,scales:S,meshLeaves:p.map(({mesh:e,first:t,count:n})=>({mesh:e,first:t,count:n})),slots:Uint32Array.from(F),slotCount:F.length/4,touched:E,nodes:P,nodeCount:M.length,statics:Float32Array.from(I),levels:L,passes:De(L),dPos:d,triBase:o,vertBase:c,vertexCount:l}}function Ne(e){let t=/* @__PURE__ */ new ArrayBuffer(16);new Uint32Array(t).set([e.moving,e.vertBase,0,0]);let n=/* @__PURE__ */ new ArrayBuffer(16);new Uint32Array(n).set([e.slotCount,e.triBase,0,0]);let r=/* @__PURE__ */ new ArrayBuffer(Math.max(1,e.passes.length)*256);return e.passes.forEach((t,n)=>{let i=new Uint32Array(r,n*256,64);i.set([e.vertBase,e.vertexCount,t.count,+!!t.wide]);for(let n=0;n<t.count;n++)i.set([e.levels[t.first+n].first,e.levels[t.first+n].count],4+n*4)}),{skin:t,tris:n,levels:r}}function Pe(e,t=0){let n=Ne(e),r=(e,t,n=e.byteLength)=>({data:e,size:Math.max(32,Math.ceil(n/16)*16),usage:t});return{plantSkinParams:r(new Uint8Array(n.skin),`uniform`),plantTrisParams:r(new Uint8Array(n.tris),`uniform`),plantLevel:r(new Uint8Array(n.levels),`uniform`),plantVerts:r(e.verts,`storage`),plantLeaves:r(e.leaves,`storage`),plantLean:r(null,`storage`,e.leafCount*16),plantPhase:r(j(e.leaves,t),`storage`),plantSlots:r(e.slots,`storage`),plantNodes:r(e.nodes,`storage`),plantStatic:r(e.statics,`storage`),dPos:r(e.dPos,`storage`),nodeBox:r(null,`storage`,e.nodeCount*32)}}Oe(2e-6),Oe(1e-6);function Fe(e){let t=`
fn plant_texel(i: u32) -> vec2i {
  return vec2i(i32(i & 1023u), i32(i >> 10u));
}
`;return{skin:`
// ---- the plants' vertices moved (src/render/scape/scapeRefit.mjs) ------------------------------
struct PlantSkinParams {
  count: u32,
  vertBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantSkinParams: PlantSkinParams;
@group(0) @binding(1) var<storage, read> plantVerts: array<vec4f>;
@group(0) @binding(2) var<storage, read> plantLeaves: array<vec4f>;
@group(0) @binding(3) var<storage, read> plantLean: array<vec4f>;
@group(0) @binding(4) var<storage, read> plantPhase: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> dPos: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${e}
${t}
// One moving vertex: displaced, kept out of the solids, its normal to its texel.
@compute @workgroup_size(64)
fn plantSkin(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantSkinParams.count) { return; }
  let o = i * 7u;
  let r = plantVerts[o];
  let n = plantVerts[o + 1u];
  let m = plant_move(r.xyz, n.xyz, PlantMV(plantVerts[o + 2u], plantVerts[o + 3u], plantVerts[o + 4u], plantVerts[o + 5u], plantVerts[o + 6u]));
  let id = u32(r.w);
  dPos[id] = vec4f(plant_collide(m.p), 0.0);
  textureStore(scapeTex, plant_texel(plantSkinParams.vertBase + id * 2u), vec4f(m.n, n.w));
}
`,tris:`
// ---- the plants' triangles rewritten (src/render/scape/scapeRefit.mjs) -------------------------
struct PlantTrisParams {
  count: u32,
  triBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantTrisParams: PlantTrisParams;
@group(0) @binding(1) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(2) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(3) var scapeTex: texture_storage_2d<rgba32float, write>;
${t}
// One triangle: its corners from dPos (so corners it shares are bit for bit its neighbours'), their
// words as packed (va * 16 + material, vb, vc).
@compute @workgroup_size(64)
fn plantTris(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantTrisParams.count) { return; }
  let e = plantSlots[i];
  let at = plantTrisParams.triBase + e.x * 3u;
  textureStore(scapeTex, plant_texel(at), vec4f(dPos[e.y >> 4u].xyz, f32(e.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(dPos[e.z].xyz, f32(e.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(dPos[e.w].xyz, f32(e.w)));
}
`,refit:`
// ---- the boxes over the plants refitted, a pass of the tree's levels (src/render/scape/scapeRefit.mjs)
struct PlantPass {
  vertBase: u32,
  vertCount: u32,
  levels: u32,
  wide: u32,
  level: array<vec4u, 15u>,
}

struct PlantBox {
  lo: vec3f,
  hi: vec3f,
}

@group(0) @binding(0) var<uniform> plantLevel: PlantPass;
@group(0) @binding(1) var<storage, read> plantNodes: array<vec4u>;
@group(0) @binding(2) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(3) var<storage, read> plantStatic: array<vec4f>;
@group(0) @binding(4) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> nodeBox: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${t}
// A child's box: a node's refitted a level below, a leaf's from its triangles' corners (padded
// outward a little, as packScape's), or one that does not move, as packed.
fn plant_childBox(c: vec4u) -> PlantBox {
  if (c.x == 1u) {
    return PlantBox(nodeBox[c.y * 2u].xyz, nodeBox[c.y * 2u + 1u].xyz);
  }
  if (c.x == 2u) {
    var lo = vec3f(3.0e38);
    var hi = vec3f(-3.0e38);
    for (var j = 0u; j < c.z; j++) {
      let e = plantSlots[c.y + j];
      let a = dPos[e.y >> 4u].xyz;
      let b = dPos[e.z].xyz;
      let d = dPos[e.w].xyz;
      lo = min(lo, min(a, min(b, d)));
      hi = max(hi, max(a, max(b, d)));
    }
    return PlantBox(lo - (vec3f(2e-6) + 1e-6 * abs(lo)), hi + (vec3f(2e-6) + 1e-6 * abs(hi)));
  }
  return PlantBox(plantStatic[c.y * 2u].xyz, plantStatic[c.y * 2u + 1u].xyz);
}

// Record r: its children's boxes into its node's texels, its own into nodeBox (and the header's at
// the root).
fn plant_refitNode(r: u32) {
  let h = plantNodes[r * 3u];
  let b0 = plant_childBox(plantNodes[r * 3u + 1u]);
  let b1 = plant_childBox(plantNodes[r * 3u + 2u]);
  let at = 4u + h.x * 4u;
  textureStore(scapeTex, plant_texel(at), vec4f(b0.lo, bitcast<f32>(h.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(b0.hi, bitcast<f32>(h.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(b1.lo, 0.0));
  textureStore(scapeTex, plant_texel(at + 3u), vec4f(b1.hi, 0.0));
  let lo = min(b0.lo, b1.lo);
  let hi = max(b0.hi, b1.hi);
  nodeBox[r * 2u] = vec4f(lo, 0.0);
  nodeBox[r * 2u + 1u] = vec4f(hi, 0.0);
  if (h.x == 0u) {
    textureStore(scapeTex, vec2i(1i, 0i), vec4f(lo, f32(plantLevel.vertBase)));
    textureStore(scapeTex, vec2i(2i, 0i), vec4f(hi, f32(plantLevel.vertCount)));
  }
}

// A pass: a wide level, a node a thread; or a run of narrow ones, this one workgroup's, a level at
// a time, each waiting at the barrier for the last's boxes.
@compute @workgroup_size(256)
fn plantRefit(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32) {
  if (plantLevel.wide == 1u) {
    let l = plantLevel.level[0];
    if (gid.x < l.y) { plant_refitNode(l.x + gid.x); }
    return;
  }
  for (var k = 0u; k < plantLevel.levels; k++) {
    let l = plantLevel.level[k];
    for (var i = li; i < l.y; i += 256u) { plant_refitNode(l.x + i); }
    storageBarrier();
  }
}
`}}let Ie={wood:[[-.505,-.601,-.054,-.493,-.57,-.056,.11],[-.493,-.57,-.056,-.481,-.538,-.058,.118],[-.481,-.538,-.058,-.469,-.507,-.06,.108],[-.469,-.507,-.06,-.448,-.481,-.06,.124],[-.448,-.481,-.06,-.426,-.456,-.061,.112],[-.426,-.456,-.061,-.405,-.43,-.061,.112],[-.405,-.43,-.061,-.375,-.415,-.057,.123],[-.375,-.415,-.057,-.346,-.399,-.054,.12],[-.346,-.399,-.054,-.316,-.384,-.05,.122],[-.316,-.384,-.05,-.287,-.376,-.065,.084],[-.287,-.376,-.065,-.259,-.367,-.08,.084],[-.259,-.367,-.08,-.23,-.359,-.095,.098],[-.23,-.359,-.095,-.199,-.352,-.106,.08],[-.199,-.352,-.106,-.168,-.344,-.117,.082],[-.168,-.344,-.117,-.137,-.337,-.128,.079],[-.137,-.337,-.128,-.105,-.327,-.133,.099],[-.105,-.327,-.133,-.073,-.318,-.139,.1],[-.073,-.318,-.139,-.041,-.308,-.144,.104],[-.041,-.308,-.144,-.009,-.299,-.149,.105],[-.009,-.299,-.149,.023,-.289,-.155,.118],[.023,-.289,-.155,.055,-.28,-.16,.114],[.055,-.28,-.16,.089,-.277,-.159,.088],[.089,-.277,-.159,.122,-.274,-.159,.1],[.122,-.274,-.159,.156,-.271,-.158,.099],[.156,-.271,-.158,.204,-.283,-.162,.108],[.204,-.283,-.162,.252,-.296,-.166,.098],[.252,-.296,-.166,.294,-.323,-.168,.108],[.294,-.323,-.168,.335,-.351,-.171,.112],[.335,-.351,-.171,.357,-.374,-.161,.133],[.357,-.374,-.161,.38,-.396,-.15,.14],[.38,-.396,-.15,.402,-.419,-.14,.14],[.402,-.419,-.14,.421,-.447,-.141,.096],[.421,-.447,-.141,.439,-.476,-.141,.096],[.439,-.476,-.141,.458,-.504,-.142,.096],[.458,-.504,-.142,.469,-.536,-.141,.15],[.469,-.536,-.141,.48,-.567,-.14,.125],[.48,-.567,-.14,.491,-.599,-.139,.122],[.491,-.599,-.139,.494,-.633,-.137,.119],[.494,-.633,-.137,.498,-.666,-.136,.119],[.498,-.666,-.136,.501,-.7,-.134,.119],[.117,-.272,-.161,.127,-.246,-.187,.057],[.127,-.246,-.187,.137,-.219,-.212,.074],[.137,-.219,-.212,.147,-.193,-.238,.075],[.147,-.193,-.238,.164,-.161,-.25,.072],[.164,-.161,-.25,.181,-.129,-.263,.062],[.181,-.129,-.263,.198,-.097,-.275,.078],[.198,-.097,-.275,.218,-.065,-.28,.07],[.218,-.065,-.28,.239,-.033,-.286,.055],[.239,-.033,-.286,.259,-.001,-.291,.051],[-.313,-.383,-.051,-.311,-.425,-.031,.058],[-.311,-.425,-.031,-.309,-.467,-.012,.058],[-.309,-.467,-.012,-.301,-.501,.019,.074],[-.301,-.501,.019,-.294,-.534,.05,.072],[-.294,-.534,.05,-.296,-.573,.075,.072],[-.296,-.573,.075,-.298,-.613,.099,.063]],rocks:[[-.442,-.548,.333,-.4,-.548,.32,.114],[-.4,-.548,.32,-.358,-.548,.307,.114],[.158,-.59,.233,.182,-.59,.247,.085],[.395,-.583,.057,.421,-.583,.025,.065],[.614,-.59,.118,.626,-.59,.122,.049]]};function Le(e){return(Ie[e]??[]).map(e=>({a:e.slice(0,3),b:e.slice(3,6),r:0,solid:0,fin:e[6]}))}var Re=/* @__PURE__ */ t({WGSL:()=>jt,build:()=>yt});let H=Math.PI*2,ze=e=>e<0?0:e>1?1:e,U=(e,t,n)=>{let r=ze((n-e)/(t-e));return r*r*(3-2*r)},Be=e=>e-H*Math.round(e/H);function Ve(e,t,n){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,739982445);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}let He={e:0,nu:0,nv:0,pair:0,cell:0};function Ue(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=1e9,s=1e9,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0;for(let g=-1;g<=1;g++)for(let _=-1;_<=1;_++){let v=i+_,y=a+g,b=(v%n+n)%n,x=v+.06+.88*Ve(b,y,r),S=y+.06+.88*Ve(b,y,r+1013),C=x-e,w=S-t,T=C*C+w*w,E=b*7919+(y+4096)*131;T<o?(s=o,u=c,d=l,p=f,o=T,c=x,l=S,f=E,m=b,h=y):T<s&&(s=T,u=x,d=S,p=E)}let g=u-c,_=d-l,v=Math.hypot(g,_)||1;g/=v,_/=v,He.e=((c+u)*.5-e)*g+((l+d)*.5-t)*_,He.nu=g,He.nv=_,He.pair=Ve(Math.min(f,p),Math.max(f,p),r+77),He.cell=Ve(m,h,r+5)}let We={depth:0,shoulder:0,e:0,cell:0},Ge=/* @__PURE__ */ new Float64Array(25),Ke=/* @__PURE__ */ new Float64Array(25),qe=/* @__PURE__ */ new Int32Array(25);function Je(e,t,n,r,i,a,o,s,c=1){let l=Math.floor(e),u=Math.floor(t),d=1e9,f=12;for(let i=-2,a=0;i<=2;i++)for(let o=-2;o<=2;o++,a++){let s=l+o,c=u+i,p=(s%n+n)%n,m=Ve(p,c,r),h=m*65536%1;if(Ge[a]=s+.06+.88*m,Ke[a]=c+.06+.88*h,qe[a]=p*7919+(c+4096)*131,Math.abs(o)<2&&Math.abs(i)<2){let n=Ge[a]-e,r=Ke[a]-t,i=n*n+r*r;i<d&&([d,f]=[i,a])}}let p=Ge[f],m=Ke[f],h=qe[f],g=0,_=0,v=1e9;for(let n=0;n<25;n++){if(n===f)continue;let l=Ge[n]-p,u=Ke[n]-m,d=Math.sqrt(l*l+u*u);l/=d,u/=d;let y=((p+Ge[n])*.5-e)*l+((m+Ke[n])*.5-t)*u,b=l/i,x=u/a,S=Math.sqrt(b*b+x*x),C=y/S;if(C<v&&(v=C),C>o*3.6*c)continue;let w=Ve(Math.min(h,qe[n]),Math.max(h,qe[n]),r+77),T=U(.35,.8,Math.abs(x)/S),E=(.5+.7*w)*(1-(1-s)*T),D=o*(.7+.6*(w*977%1))*(1-.15*T)*(1+(c-1)*T),O=C/D;O<1&&(g=Math.max(g,E*(1-U(0,1,O))**1.6)),_=Math.max(_,E*(1-U(D,D*3.2,C)))}return We.depth=g,We.shoulder=_,We.e=v,We.cell=Ve(h,5,r+5),We}function Ye(e,t,n,r,i){let a=e.length,s=(e,t)=>[2*t[0]-e[0],2*t[1]-e[1],2*t[2]-e[2]],c=[s(e[1],e[0]),...e,s(e[a-2],e[a-1])],l=[],d=(e,t)=>Math.sqrt(Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]))||1e-6;for(let e=0;e<a-1;e++){let[t,n,r,i]=[c[e],c[e+1],c[e+2],c[e+3]],a=d(t,n),o=a+d(n,r),s=o+d(r,i);for(let e=0;e<64;e++){let c=a+(o-a)*e/64,u=[0,0,0];for(let e=0;e<3;e++){let l=(a-c)/a*t[e]+c/a*n[e],d=(o-c)/(o-a)*n[e]+(c-a)/(o-a)*r[e],f=(s-c)/(s-o)*r[e]+(c-o)/(s-o)*i[e],p=(o-c)/o*l+c/o*d,m=(s-c)/(s-a)*d+(c-a)/(s-a)*f;u[e]=(o-c)/(o-a)*p+(c-a)/(o-a)*m}l.push(u)}}l.push(e[a-1]);let f=[0],p=()=>{for(let e=1;e<l.length;e++){let[t,n]=[l[e-1],l[e]];f[e]=f[e-1]+Math.hypot(n[0]-t[0],n[1]-t[1],n[2]-t[2])}};p();let m=f[l.length-1];for(let e=0;e<l.length;e++){let t=i*U(0,.12,f[e])*U(m,m-.12,f[e]);for(let n=0;n<3;n++)l[e][n]+=t*u(f[e]*2.7,r*.53,n*3.7)}p();let h=f[f.length-1],g=Math.max(3,Math.round(h/t)+1),_=h/(g-1),v=new Float64Array(g*3),y=new Float64Array(g*3),b=new Float64Array(g*3),x=new Float64Array(g*3),S=new Float64Array(g),C=0;for(let e=0;e<g;e++){let t=e*_;for(;C<l.length-2&&f[C+1]<t;)C++;let n=(t-f[C])/(f[C+1]-f[C]||1);for(let t=0;t<3;t++)v[e*3+t]=l[C][t]+(l[C+1][t]-l[C][t])*n}for(let e=0;e<g;e++){let t=Math.max(0,e-1),n=Math.min(g-1,e+1),r=[v[n*3]-v[t*3],v[n*3+1]-v[t*3+1],v[n*3+2]-v[t*3+2]],i=Math.hypot(r[0],r[1],r[2]);for(let t=0;t<3;t++)y[e*3+t]=r[t]/i}{let e=Math.abs(y[1])<.9?[0,1,0]:[1,0,0],t=e[0]*y[0]+e[1]*y[1]+e[2]*y[2],n=[e[0]-t*y[0],e[1]-t*y[1],e[2]-t*y[2]],r=Math.hypot(n[0],n[1],n[2]);for(let e=0;e<3;e++)b[e]=n[e]/r}for(let e=0;e<g-1;e++){let t=[v[e*3+3]-v[e*3],v[e*3+4]-v[e*3+1],v[e*3+5]-v[e*3+2]],n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=[b[e*3],b[e*3+1],b[e*3+2]],i=[y[e*3],y[e*3+1],y[e*3+2]],a=2/n*(t[0]*r[0]+t[1]*r[1]+t[2]*r[2]),o=2/n*(t[0]*i[0]+t[1]*i[1]+t[2]*i[2]),s=[r[0]-a*t[0],r[1]-a*t[1],r[2]-a*t[2]],c=[i[0]-o*t[0],i[1]-o*t[1],i[2]-o*t[2]],l=[y[e*3+3]-c[0],y[e*3+4]-c[1],y[e*3+5]-c[2]],u=2/(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]||1e-12)*(l[0]*s[0]+l[1]*s[1]+l[2]*s[2]);for(let t=0;t<3;t++)b[e*3+3+t]=s[t]-u*l[t]}for(let e=0;e<g;e++){let[t,n,r]=[y[e*3],y[e*3+1],y[e*3+2]],[i,a,o]=[b[e*3],b[e*3+1],b[e*3+2]];x[e*3]=n*o-r*a,x[e*3+1]=r*i-t*o,x[e*3+2]=t*a-n*i}S[0]=o(r)()*H;for(let e=1;e<g;e++)S[e]=S[e-1]+_*n*(1+.7*u(e*_*1.7,r*.37,.3));return{count:g,step:_,L:h,c:v,t:y,r:b,b:x,tau:S}}let Xe={cx:0,cy:0,cz:0,rx:0,ry:0,rz:0,bx:0,by:0,bz:0,tx:0,ty:0,tz:0,tau:0};function Ze(e,t){let n=t/e.step,r=Math.floor(n);r<0&&(r=0),r>e.count-2&&(r=e.count-2),n-=r;let i=r+1,a=1-n;return Xe.cx=e.c[r*3]*a+e.c[i*3]*n,Xe.cy=e.c[r*3+1]*a+e.c[i*3+1]*n,Xe.cz=e.c[r*3+2]*a+e.c[i*3+2]*n,Xe.rx=e.r[r*3]*a+e.r[i*3]*n,Xe.ry=e.r[r*3+1]*a+e.r[i*3+1]*n,Xe.rz=e.r[r*3+2]*a+e.r[i*3+2]*n,Xe.bx=e.b[r*3]*a+e.b[i*3]*n,Xe.by=e.b[r*3+1]*a+e.b[i*3+1]*n,Xe.bz=e.b[r*3+2]*a+e.b[i*3+2]*n,Xe.tx=e.t[r*3]*a+e.t[i*3]*n,Xe.ty=e.t[r*3+1]*a+e.t[i*3+1]*n,Xe.tz=e.t[r*3+2]*a+e.t[i*3+2]*n,Xe.tau=e.tau[r]*a+e.tau[i]*n,Xe}function Qe(e,t){let n=Math.max(3,Math.round(e.L/t)+1),r=e.L/(n-1),i=new Float64Array(n*3),a=new Float64Array(n*3),o=new Float64Array(n*3),s=new Float64Array(n*3),c=new Float64Array(n);for(let t=0;t<n;t++){let n=Ze(e,t*r),l=Math.hypot(n.tx,n.ty,n.tz),u=n.tx/l,d=n.ty/l,f=n.tz/l,p=n.rx*u+n.ry*d+n.rz*f,m=n.rx-p*u,h=n.ry-p*d,g=n.rz-p*f,_=Math.hypot(m,h,g);m/=_,h/=_,g/=_,i.set([n.cx,n.cy,n.cz],t*3),a.set([u,d,f],t*3),o.set([m,h,g],t*3),s.set([d*g-f*h,f*m-u*g,u*h-d*m],t*3),c[t]=n.tau}return{count:n,step:r,L:e.L,c:i,t:a,r:o,b:s,tau:c}}function $e(e,t,n){if(e.caps[1]!==`broken`)return{rings:t.count,sOf:e=>e*t.step};let r=e.sBreak,i=r-.025,a=Math.floor(i/t.step),o=Math.round(r/t.step);return{rings:o+1,sOf:(i,s)=>{if(i<=a)return i*t.step;let c=(i-a)/(o-a),l=a*t.step;return l+c*(r+e.brk.rim(H*s/n)-l)}}}function et(e,t){let n=Math.min(Math.max(t/e.step,0),e.count-1.001),r=Math.floor(n);return e.c[r*3+1]+(e.c[r*3+4]-e.c[r*3+1])*(n-r)}function tt(e,t){let n=1e9,r=0;for(let i=0;i<e.count;i++){let a=(e.c[i*3]-t[0])**2+(e.c[i*3+1]-t[1])**2+(e.c[i*3+2]-t[2])**2;a<n&&([n,r]=[a,i])}return r*e.step}let nt=[{name:`arch`,pts:[[-.522,-.7,-.04],[-.514,-.632,-.048],[-.486,-.528,-.058],[-.425,-.443,-.07],[-.318,-.386,-.05],[-.178,-.344,-.122],[-.038,-.296,-.146],[.083,-.268,-.16],[.198,-.277,-.162],[.307,-.331,-.19],[.398,-.414,-.148],[.462,-.522,-.141],[.494,-.633,-.136],[.501,-.7,-.134]],radius:[[0,.092],[.07,.094],[.18,.08],[.3,.064],[.42,.07],[.56,.084],[.64,.088],[.74,.07],[.85,.08],[.93,.096],[1,.094]],around:176,ds:.0039,wiggle:.022,twist:1.7,flat:.28,lobe:.11,flute:.26,gnarl:.26,plates:17,plateLength:.26,depth:.19,width:.0055,knuckles:[[[-.36,-.396,-.085],.16,.08],[[.33,-.342,-.15],.18,.09],[[-.08,-.316,-.14],.1,.06],[[.05,-.286,-.15],-.08,.05]],knots:[[[-.27,-.333,-.03],.014,.04,.02,`pit`],[[0,-.222,-.12],.011,.032,.014,`boss`],[[.33,-.316,-.08],0,.06,.03,`burl`],[[.45,-.466,-.06],.01,.03,.012,`boss`],[[-.47,-.501,.03],.012,.035,.016,`pit`],[[.12,-.299,-.24],.012,.04,.016,`pit`],[[-.12,-.29,-.1],0,.06,.02,`burl`],[[-.36,-.366,-.05],0,.055,.026,`burl`],[[0,-.325,-.07],0,.05,.022,`burl`],[[.43,-.389,-.12],0,.06,.028,`burl`],[[.27,-.29,-.22],0,.045,.02,`burl`]],seed:11,caps:[`buried`,`buried`]},{name:`broken`,parent:0,pts:[[.115,-.268,-.163],[.143,-.2,-.232],[.183,-.12,-.268],[.232,-.042,-.284],[.27,.015,-.293]],radius:[[0,.058],[.3,.052],[.7,.045],[1,.04]],around:144,ds:.0035,wiggle:.006,twist:2.6,flat:.16,lobe:.08,flute:.2,gnarl:.17,plates:12,plateLength:.2,depth:.19,width:.00495,knuckles:[],knots:[[[.232,-.11,-.262],.009,.026,.01,`boss`]],fillet:.06,reach:[.12,.2],seed:23,caps:[`inside`,`broken`],breakAt:.04},{name:`left`,parent:0,pts:[[-.31,-.385,-.05],[-.305,-.457,-.02],[-.288,-.54,.055],[-.298,-.63,.11],[-.292,-.7,.13]],radius:[[0,.056],[.35,.049],[.75,.042],[1,.04]],around:144,ds:.0037,wiggle:.012,twist:-2.1,flat:.22,lobe:.09,flute:.22,gnarl:.2,plates:12,plateLength:.22,depth:.19,width:.00495,knuckles:[[[-.29,-.56,.07],.1,.05]],knots:[[[-.34,-.501,.1],.01,.03,.012,`pit`]],fillet:.07,reach:[.12,.22],seed:37,caps:[`inside`,`buried`]}];function rt(e=1){let t=[];for(let[n,r]of nt.entries()){let i={...r,index:n,pts:r.pts.map(e=>e.slice())};if(i.parent!==void 0){let e=t[i.parent].ref,n=tt(e,i.pts[0]),r=Ze(e,n);i.pts[0]=[r.cx,r.cy,r.cz],i.junction=n,i.shrink=e=>.6+.4*U(0,.0525,e)}let a=i.ref=Ye(i.pts,i.ds,i.twist,i.seed,i.wiggle);i.roundScale=e**.75,i.alongScale=e**1.25,i.coarse=Math.max(1,1/i.roundScale),i.coarseAlong=Math.max(1,1/i.alongScale),i.refAround=r.around,i.around=e===1?r.around:Math.max(16,Math.round(r.around*i.roundScale)),i.spine=e===1?a:Qe(a,r.ds/i.alongScale),i.caps[1]===`broken`&&(i.brk=vt(i.seed+5),i.sBreak=a.L-i.breakAt),i.knuckleS=i.knuckles.map(([e,t,n])=>[tt(a,e),t,n]),i.knotS=i.knots.map(([e,t,n,r,o],s)=>{let c=tt(a,e),l=Ze(a,c),u=[e[0]-l.cx,e[1]-l.cy,e[2]-l.cz];return{s:c,phi:((Math.atan2(u[0]*l.bx+u[1]*l.by+u[2]*l.bz,u[0]*l.rx+u[1]*l.ry+u[2]*l.rz)-l.tau)%H+H)%H,eye:t,spread:n,height:r,kind:o,brk:o===`boss`?vt(i.seed*31+s):null}});let s=o(i.seed+101);i.flutes=Array.from({length:5},(e,t)=>({phi:t/5*H+s()*1,drift:(s()-.5)*1.5,width:.22+.3*s(),depth:i.flute*(.5+.8*s()),freq:1.5+2*s(),seed:i.seed+t*7.7})),t.push(i)}return t}let it={L:null,s:NaN,r:0};function at(e,t,n){if(it.L===e&&it.s===n)return it.r;let r=n/t.L,i=e.radius,a=i[i.length-1][1];for(let e=0;e<i.length-1;e++)if(r<=i[e+1][0]){a=i[e][1]+(i[e+1][1]-i[e][1])*U(i[e][0],i[e+1][0],r);break}a*=1+.2*d(n*4+e.seed,.31,.77,2);for(let[t,r,i]of e.knuckleS)a*=1+r*Math.exp(-(((n-t)/i)**2));return Object.assign(it,{L:e,s:n,r:a}),a}let W={L:null,s:NaN,e:0,al:0,a3:0,b3:0,a4:0,b4:0,a5:0,b5:0,foot:1,fc:[0],fd:[0]};function ot(e,t,r){if(W.s!==t||W.L!==e){let r=e.seed*1.37;W.s=t,W.L=e,W.e=e.flat*(.55+.45*u(t*2.3,r,.5)),W.al=e.seed+1.4*u(t*1.2,r+3.1,1.7),W.a3=e.lobe*(.6+.6*u(t*3.1,r,4.4)),W.b3=2.2*u(t*1.6,r,5.5),W.a4=e.lobe*.7*(.5+.7*u(t*3.7,r,6.6)),W.b4=2.2*u(t*1.9,r,7.7),W.a5=e.lobe*.5*(.4+.8*u(t*4.3,r,8.8)),W.b5=2.2*u(t*2.2,r,9.9),W.foot=1+.9*Math.exp(-(((et(e.ref,t)-n)/.07)**2)),W.fc=e.flutes.map(e=>e.phi+e.drift*t+.5*u(t*2.6,e.seed,.2)),W.fd=e.flutes.map(e=>e.depth*U(-.25,.35,u(t*e.freq,e.seed,3.3)))}let i=1+W.e*Math.cos(2*(r-W.al));i+=(W.a3*Math.cos(3*r+W.b3)+W.a4*Math.cos(4*r+W.b4)+W.a5*Math.cos(5*r+W.b5))*W.foot;for(let t=0;t<e.flutes.length;t++){let n=Be(r-W.fc[t]);i-=W.fd[t]*Math.exp(-((n/e.flutes[t].width)**2))}let a=Math.max(.16-Math.abs(i-.6),0)/.16;return Math.max(i,.6)+a*a*.04}let st={d:0,z:0};function ct(e,t,n,r,i,a,o){let s=e.plates,c=e.plateLength,l=Math.sqrt(e.coarse),d=Math.sqrt(e.coarseAlong),f=ze(2-e.coarse),p=e.width*l,m=d/l,h=Math.min(Math.max(o,.6*a),1.3*a),g=H*h/s,_=e.seed*.71,v=n/H*s+.55*u(r*1.1+_,i*1.1,t*1.5)+.2*u(r*2.7,i*2.7+_,t*5.3),y=t/c+.4*u(r*1.3+9.1,i*1.3,t*1.9+_),b=0,x=0;for(let r of e.knotS){let e=(t-r.s)/(r.kind===`burl`?1.4:2.6);if(Math.abs(e)>5*r.spread)continue;let i=Be(n-r.phi)*a,o=i*i+e*e,s=Math.sqrt(o);if(s>5*r.spread)continue;let c=r.height*Math.exp(-((s/r.spread)**2))*(1+.2*u(i*55,e*55,r.s*9));if(r.kind===`burl`){b+=c,v+=.25*i*Math.exp(-((s/r.spread)**2))/g;continue}let d=(r.eye*1.6)**2,f=Math.exp(-((s/(2.6*r.spread))**2)),p=o>d?i*(1-d/o):0;v+=(p-i)*f/g;let m=Math.atan2(e,i);s*=1+.3*u(Math.cos(m)*2,Math.sin(m)*2,r.s*5),x=Math.max(x,1-U(r.eye*.9,r.eye*1.7,s));let h=.45*r.height*Math.exp(-(((s-r.eye)/(.35*r.eye*l))**2)),_;_=r.kind===`pit`?-.45*r.height*(1-U(0,r.eye*.8,s)):U(0,1,(r.eye-s)/(.3*r.eye))*(.8*r.height+r.brk.height(Math.min(s/(.7*r.eye),1),m)*(r.eye/.05)),b+=c+h+_}let S=U(.36,.66,u(r*.8+_,i*.8+2.2,t*2.2+4.1)),C=e.depth*h,w=.6+.4*u(r*2.1,i*2.1+_,t*7.3);Je(v,y,s,e.seed,g,c,p,.2,m);let T=w*We.depth,E=.25*w*We.shoulder,D=(.26*We.cell+.1*u(v*1.7,y*2.3,_))*U(0,p*3,We.e),O=U(-.35,.2,u(r*1.6+5,i*1.6,t*3.1+_));if(O>0){let t=2.27/l,n=1.9/d;Je(v*t+.5,y*n+.3,Math.round(s*t),e.seed+3,g/t,c/n,p*.8,.25,m),T=Math.max(T,.55*O*We.depth)}let k=v*1.7+.35*u(r*3.1,i*3.1+_,t*6.1),A=.2*(.5+.5*Math.cos(H*k))**(3/e.coarse)*w,j=f>0?.1*u(r*16+_,i*16,t*22)*f:0,M=(1-.5*S)*(1-x),N=(T+(E+D+A+j)*(1-.6*S))*M,P=ze(N/(.85*e.coarse**.075));return st.z=e.coarse>1?P**e.coarse**.13:P,st.d=N*C-b,st}let lt={cx:0,cy:0,cz:0,dx:0,dy:0,dz:0,r0:0,rb:0};function ut(e,t,n,r){let i=Ze(t,n),a=r+i.tau,o=Math.cos(a),s=Math.sin(a),c=o*i.rx+s*i.bx,l=o*i.ry+s*i.by,f=o*i.rz+s*i.bz,p=Math.sqrt(c*c+l*l+f*f);c/=p,l/=p,f/=p;let m=at(e,t,n);e.shrink&&(m*=e.shrink(n));let h=m*ot(e,n,r),g=i.cx+c*h,_=i.cy+l*h,v=i.cz+f*h;return h*=1+e.gnarl*(.6*d(g*3.4+1.7,_*3.4,v*3.4,2)+.45*u(Math.cos(r)*1.3+e.seed,Math.sin(r)*1.3,n*6.5)),lt.cx=i.cx,lt.cy=i.cy,lt.cz=i.cz,lt.dx=c,lt.dy=l,lt.dz=f,lt.r0=m,lt.rb=h,lt}function dt(e,t,n){let r=e.around,i=e.rings,a=i*r,o={L:e,sp:t,N:r,rings:i,px:new Float64Array(a),py:new Float64Array(a),pz:new Float64Array(a),dx:new Float64Array(a),dy:new Float64Array(a),dz:new Float64Array(a),cx:new Float64Array(a),cy:new Float64Array(a),cz:new Float64Array(a),base:new Float64Array(a),rad:new Float64Array(a),s:new Float64Array(a),z:new Float64Array(a),ao:new Float64Array(a).fill(1),inside:new Uint8Array(a),nx:new Float64Array(a),ny:new Float64Array(a),nz:new Float64Array(a),b0:new Float64Array(a)},s=new Float64Array(r),c=new Float64Array(r);for(let e=0;e<r;e++)s[e]=Math.cos(H*e/r),c[e]=Math.sin(H*e/r);for(let a=0;a<i;a++)for(let i=0;i<r;i++){let l=a*r+i,u=n(a,i),d=H*i/r,f=ut(e,t,u,d),p=ct(e,u,d,s[i],c[i],f.r0,f.rb),m=f.rb-p.d;o.px[l]=f.cx+f.dx*m,o.py[l]=f.cy+f.dy*m,o.pz[l]=f.cz+f.dz*m,o.dx[l]=f.dx,o.dy[l]=f.dy,o.dz[l]=f.dz,o.cx[l]=f.cx,o.cy[l]=f.cy,o.cz[l]=f.cz,o.base[l]=f.rb,o.rad[l]=m,o.s[l]=u,o.z[l]=p.z,o.b0[l]=u===a*t.step?f.rb:ut(e,t,a*t.step,d).rb}let l=2.5;for(let e=0;e<2;e++)for(let e=0;e<i;e++)for(let n=0;n<r;n++){let a=e*r+n,s=l*H*o.base[a]/r,c=l*t.step,u=o.base[a]-o.rad[a],d=u;for(let[t,l]of[[e*r+(n+1)%r,s],[e*r+(n+r-1)%r,s],[e>0?a-r:a,c],[e<i-1?a+r:a,c]])d=Math.min(d,o.base[t]-o.rad[t]+l);d<u&&u>0&&(o.z[a]*=Math.max(d,0)/u),o.rad[a]=o.base[a]-d}let u=new Float64Array(a),d=new Float64Array(a),f=new Float64Array(a);for(let e=0;e<a;e++)u[e]=o.cx[e]+o.dx[e]*o.base[e],d[e]=o.cy[e]+o.dy[e]*o.base[e],f[e]=o.cz[e]+o.dz[e]*o.base[e];o.bnx=new Float64Array(a),o.bny=new Float64Array(a),o.bnz=new Float64Array(a),St(o,u,d,f,o.bnx,o.bny,o.bnz);for(let t=0;t<a;t++){let n=e.sBreak===void 0?0:U(e.sBreak-.045,e.sBreak-.02,o.s[t]),r=o.bnx[t]+(o.dx[t]-o.bnx[t])*n,i=o.bny[t]+(o.dy[t]-o.bny[t])*n,a=o.bnz[t]+(o.dz[t]-o.bnz[t])*n,s=Math.sqrt(r*r+i*i+a*a)||1;o.bnx[t]=r/=s,o.bny[t]=i/=s,o.bnz[t]=a/=s;let c=o.base[t]-o.rad[t];o.px[t]=u[t]-r*c,o.py[t]=d[t]-i*c,o.pz[t]=f[t]-a*c}return o.bs=o.base.slice(),o.r0=o.rad.slice(),o}let ft={i:0,jf:0};function pt(e,t,n,r,i,a){let{sp:o,N:s}=e,c=Math.max(1,Math.floor((a-i)/20)),l=1e9,u=i;for(let e=i;e<=a;e+=c){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}for(let e=Math.max(i,u-c),s=Math.min(a,u+c);e<=s;e++){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}let d=(t-o.c[u*3])*o.t[u*3]+(n-o.c[u*3+1])*o.t[u*3+1]+(r-o.c[u*3+2])*o.t[u*3+2],f=u+d/o.step,p=Math.min(Math.max(f,i),a),m=Math.min(Math.floor(p),a-1),h=p-m,g=m+1,_=1-h,v=e=>o.c[m*3+e]*_+o.c[g*3+e]*h,y=t-v(0),b=n-v(1),x=r-v(2),S=y*(o.r[m*3]*_+o.r[g*3]*h)+b*(o.r[m*3+1]*_+o.r[g*3+1]*h)+x*(o.r[m*3+2]*_+o.r[g*3+2]*h),C=y*(o.b[m*3]*_+o.b[g*3]*h)+b*(o.b[m*3+1]*_+o.b[g*3+1]*h)+x*(o.b[m*3+2]*_+o.b[g*3+2]*h),w=(Math.atan2(C,S)-(o.tau[m]*_+o.tau[g]*h))/H*s;w=(w%s+s)%s;let T=Math.floor(w),E=w-T,D=(T+1)%s;ft.i=h<.5?m:g,ft.jf=w;let O=(e.b0[m*s+T]*(1-E)+e.b0[m*s+D]*E)*_+(e.b0[g*s+T]*(1-E)+e.b0[g*s+D]*E)*h,k=Math.sqrt(S*S+C*C)-O,A=Math.max(i-f,f-a)*o.step;return A<=0?k:k>0?Math.sqrt(k*k+A*A):A}let mt=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},ht=[0,0,0];function gt(e,t,n,r,i){let a=e.sp,o=n-a.c[t*3],s=r-a.c[t*3+1],c=i-a.c[t*3+2],l=o*a.t[t*3]+s*a.t[t*3+1]+c*a.t[t*3+2];o-=l*a.t[t*3],s-=l*a.t[t*3+1],c-=l*a.t[t*3+2];let u=Math.sqrt(o*o+s*s+c*c)||1;return ht[0]=o/u,ht[1]=s/u,ht[2]=c/u,ht}function _t(e,t,n,r,i,a,o,s,c){let{N:l,rings:d}=e,f=e=>n*(1-U(c[0],c[1],e));for(let n=0;n<d*l;n++){if(!a(n))continue;let c=e.bs[n],p=e.cx[n]+e.dx[n]*c,m=e.cy[n]+e.dy[n]*c,h=e.cz[n]+e.dz[n]*c,g=pt(t,p,m,h,r,i),_=ft.i,v=f(e===s?e.s[n]:_*t.sp.step);if(v<1e-4||g>=v)continue;let y=gt(t,_,p,m,h),b=1-U(0,v,g),x=e.dx[n]+y[0]*b,S=e.dy[n]+y[1]*b,C=e.dz[n]+y[2]*b,w=Math.sqrt(x*x+S*S+C*C)||1;x/=w,S/=w,C/=w;let T=Math.floor(n/l),E=Math.max(10,Math.round(50*e.L.alongScale)),D=Math.max(0,T-E),O=Math.min(d-1,T+E),k={a:0,b:0,k:v,ia:0,ib:0},A=n=>{let a=p+x*n,o=m+S*n,c=h+C*n;return k.a=pt(e,a,o,c,D,O),k.ia=ft.i,k.b=pt(t,a,o,c,r,i),k.ib=ft.i,k.k=Math.max(f(e===s?k.ia*e.sp.step:k.ib*t.sp.step),1e-4),mt(k.a,k.b,k.k)},j=0,M=2*v,N=A(M)<0,P=1;if(!N){for(let e=0;e<14;e++){let e=(j+M)*.5;A(e)<0?j=e:M=e}A((j+M)*.5),P=(k.a-k.b)/k.k,P>.97&&(N=!0)}if(N){e.inside[n]=1;let t=e.r0[n]-1.5*o;e.px[n]=e.cx[n]+e.dx[n]*t,e.py[n]=e.cy[n]+e.dy[n]*t,e.pz[n]=e.cz[n]+e.dz[n]*t,e.rad[n]=t;continue}let F=(j+M)*.5,I=p+x*F,L=m+S*F,R=h+C*F,z=Math.max(k.k-Math.abs(k.a-k.b),0)/k.k,B=k.a<k.b?1-z/2:z/2,ee=[e.bnx[n],e.bny[n],e.bnz[n]],V=gt(t,k.ib,I,L,R),te=B*ee[0]+(1-B)*V[0],ne=B*ee[1]+(1-B)*V[1],re=B*ee[2]+(1-B)*V[2],ie=Math.sqrt(te*te+ne*ne+re*re)||1;te/=ie,ne/=ie,re/=ie;let ae=.55+.45*U(.02,.2,Math.abs(P)),oe=e===s?0:.002*Math.cos(H*2*P)*(1-Math.abs(P))*(.7+.6*u(I*60,L*60,R*60)),se=(c-e.r0[n])*ae-oe+o*U(-.05,.3,P);e.z[n]*=ae,e.px[n]=I-te*se,e.py[n]=L-ne*se,e.pz[n]=R-re*se;let ce=(I-e.cx[n])*e.dx[n]+(L-e.cy[n])*e.dy[n]+(R-e.cz[n])*e.dz[n];e.base[n]=ce,e.rad[n]=ce-se}}function vt(e){let t=o(e),n=Array.from({length:5},(e,n)=>({phi:n/5*H+(t()-.5)*.9,w:.22+.45*t(),h:.008+.03*t()*t()+(n===1?.018:0),t:.55+.3*t()})),r=t()*H,i=t=>{let i=.008*Math.cos(t-r)+.003*u(Math.cos(t)*3,Math.sin(t)*3,e);for(let e of n){let n=Math.abs(Be(t-e.phi))/e.w;n<1&&(i=Math.max(i,e.h*(1-n)**1.4+.008*Math.cos(t-r)))}return i+.0025*Math.abs(u(Math.cos(t)*11,Math.sin(t)*11,e+3))};return{rim:i,height:(t,a)=>{let o=Math.cos(a),s=Math.sin(a);Ue(t*4.5+.3*u(o*2,s*2,e),a/H*16,1e6,e+7);let c=(He.cell-.5)*.011*U(0,.4,He.e+.08)*U(.08,.35,t),l=.004*Math.cos(a-r)*t-.003+c+.002*u(o*t*20,s*t*20,e+1),d=U(.86,1,t);for(let e of n)Math.abs(Be(a-e.phi))<e.w&&(d=Math.max(d,U(e.t,e.t+.12,t)));return l+(i(a)-l)*d}}}function yt(e={detail:1}){let t=rt(Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1),n=[];for(let e of t){let{rings:t,sOf:r}=$e(e,e.spine,e.around);e.rings=t,n.push(dt(e,e.spine,r))}for(let[e,r]of t.entries()){if(r.parent===void 0)continue;let t=n[r.parent],i=n[e],a=r.junction,o=Math.max(0,Math.floor((a-.3)/t.sp.step)),s=Math.min(t.rings-1,Math.ceil((a+.3)/t.sp.step)),c=Math.min(i.rings-1,Math.ceil(.35/i.sp.step)),[l,u,d]=[i.sp.c[0],i.sp.c[1],i.sp.c[2]],f=.026;_t(i,t,r.fillet,o,s,e=>i.s[e]<=r.reach[1],f,i,r.reach),_t(t,i,r.fillet,0,c,e=>(t.px[e]-l)**2+(t.py[e]-u)**2+(t.pz[e]-d)**2<.26*.26,f,i,r.reach)}for(let e of n)xt(e);Ct(n);let r=new f(`driftwood`);for(let e of n)Tt(r,e);let i=[];for(let e of n)Dt(e,i);return i.push(...Le(`wood`)),{meshes:[r.finish()],obstacles:i}}function bt(e){let t=e.L;if(t.spine===t.ref)return(t,n)=>e.bs[t*e.N+n];let n=t.refAround,{sOf:r}=$e(t,t.ref,n);return(e,i)=>ut(t,t.ref,r(e,i),H*i/n).rb}function xt(e){St(e,e.px,e.py,e.pz,e.nx,e.ny,e.nz)}function St(e,t,n,r,i,a,o){let{N:s,rings:c}=e;for(let l=0;l<c;l++)for(let u=0;u<s;u++){let d=l*s+u,f=l*s+(u+1)%s,p=l*s+(u-1+s)%s,m=Math.min(c-1,l+1)*s+u,h=Math.max(0,l-1)*s+u,g=t[f]-t[p],_=n[f]-n[p],v=r[f]-r[p],y=t[m]-t[h],b=n[m]-n[h],x=r[m]-r[h],S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w);T>1e-12||([S,C,w,T]=[e.dx[d],e.dy[d],e.dz[d],1]),i[d]=S/T,a[d]=C/T,o[d]=w/T}}function Ct(e){let t=.012,r=e.map(e=>{let n=[],r=e.s[(e.rings-1)*e.N];for(let i=0;i<=r;i+=t){let t=Ze(e.sp,i);n.push([t.cx,t.cy,t.cz,at(e.L,e.sp,i)*(e.L.shrink?e.L.shrink(i):1)])}return n}),i=r.map(e=>{let t=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let[n,r,i,a]of e)for(let[e,o]of[n,r,i].entries())t[e]=Math.min(t[e],o-6*a),t[e+3]=Math.max(t[e+3],o+6*a);return t}),a=r.map(e=>Float64Array.from(e.flat()));for(let[o,s]of e.entries()){let{N:e,rings:c,L:l}=s,u=e=>Math.max(1,Math.round(e*l.alongScale)),d=e=>Math.max(1,Math.round(e*l.roundScale)),f=wt(s.rad,c,e,u(2),d(4)),p=wt(s.base,c,e,u(9),d(14));for(let u=0;u<c*e;u++){let e=s.base[u]||.07,c=Math.max(0,f[u]-s.rad[u])/(l.depth*.6*e),d=Math.max(0,p[u]-s.base[u])/(.1*e),m=(1-.55*ze(c))*(1-.35*ze(d))*(1-.25*s.z[u]),h=s.px[u],g=s.py[u],_=s.pz[u],v=s.nx[u],y=s.ny[u],b=s.nz[u],x=g-n;m*=.35+.65*U(-.01,.07,x),m*=1-.45*Math.max(0,-y)*Math.exp(-Math.max(x,0)/.12);let S=0;for(let e=0;e<r.length;e++){let n=i[e],r=a[e];if(!(e===o||h<n[0]||g<n[1]||_<n[2]||h>n[3]||g>n[4]||_>n[5]))for(let e=0;e<r.length;e+=4){let n=r[e+3],i=r[e]-h,a=r[e+1]-g,o=r[e+2]-_,s=i*i+a*a+o*o;if(s>36*n*n)continue;let c=Math.sqrt(s),l=(i*v+a*y+o*b)/c;l<=0||(S+=n*n/Math.max(s,n*n)*l*(t/(2*n)))}}m*=1-Math.min(.6,.75*S),s.inside[u]&&(m*=.3),s.ao[u]=Math.min(1,Math.max(.03,m))}}}function wt(e,t,n,r,i){let a=new Float64Array(t*n),o=new Float64Array(t*n);for(let r=0;r<t;r++){let t=0;for(let a=-i;a<=i;a++)t+=e[r*n+(a+n)%n];for(let o=0;o<n;o++)a[r*n+o]=t/(2*i+1),t+=e[r*n+(o+i+1)%n]-e[r*n+(o-i+n)%n]}for(let e=0;e<n;e++)for(let i=0;i<t;i++){let s=0,c=0;for(let o=Math.max(0,i-r);o<=Math.min(t-1,i+r);o++)s+=a[o*n+e],c++;o[i*n+e]=s/c}return o}function Tt(e,t){let{N:n,rings:r,L:i}=t,o=e.vertexCount,s=2*H*i.index,c=(e,t)=>e*n+(t%n+n)%n;for(let a=0;a<r;a++)for(let r=0;r<=n;r++){let o=c(a,r),l=t.s[o]+(i.junction??0);e.vertex([t.px[o],t.py[o],t.pz[o]],[l,H*r/n+s,t.z[o],t.ao[o]],[t.nx[o],t.ny[o],t.nz[o]])}let l=n+1,u=(e,n)=>{let i=c(Math.min(Math.max(e,0),r-1),n);return t.rad[i]-t.base[i]};for(let t=0;t<r-1;t++)for(let r=0;r<n;r++){let n=o+t*l+r;Math.abs(u(t-1,r-1)-2*u(t,r)+u(t+1,r+1))+Math.abs(u(t,r)-2*u(t+1,r+1)+u(t+2,r+2))<=Math.abs(u(t-1,r+2)-2*u(t,r+1)+u(t+1,r))+Math.abs(u(t,r+1)-2*u(t+1,r)+u(t+2,r-1))?e.quad(n,n+1,n+l+1,n+l,a.BARK):e.quad(n+1,n+l+1,n+l,n,a.BARK)}for(let[c,u]of i.caps.entries()){if(u===`inside`)continue;let d=c?r-1:0;if(u===`buried`){let r=t.sp,u=t.s[d*n],f=Ze(r,u),p=c?1:-1,m=t.base[d*n],h=e.vertex([f.cx+p*f.tx*m*.4,f.cy+p*f.ty*m*.4,f.cz+p*f.tz*m*.4],[u+(i.junction??0),s,0,.1],[p*f.tx,p*f.ty,p*f.tz]);for(let t=0;t<n;t++){let n=o+d*l+t,r=n+1;c?e.tri(n,r,h,a.BARK):e.tri(r,n,h,a.BARK)}}else Et(e,t)}}function Et(e,t){let{N:n,rings:r,L:i,sp:o}=t,s=Math.max(6,Math.round(22*i.roundScale)),c=r-1,l=0;for(let e=0;e<n;e++)l+=t.rad[c*n+e];l/=n;let u=[];for(let r=0;r<=s;r++){let a=1-r/s,d=[];for(let u=0;u<n;u++){let f=c*n+u,p=H*u/n,m;if(r===0)m=[t.px[f],t.py[f],t.pz[f]];else{let e=Ze(o,i.sBreak+i.brk.height(a,p)),n=p+e.tau,s=Math.cos(n),c=Math.sin(n),l=t.rad[f]*a*(r===1?.985:1);m=[e.cx+(s*e.rx+c*e.bx)*l,e.cy+(s*e.ry+c*e.by)*l,e.cz+(s*e.rz+c*e.bz)*l]}let h=(.55+.45*U(0,.6,1-a))*(r===0?.8:1);if(d.push(e.vertex(m,[Math.cos(p)*a*l,Math.sin(p)*a*l,0,h])),r===s)break}u.push(d)}for(let t=0;t<s;t++)for(let r=0;r<n;r++){let i=u[t][r],o=u[t][(r+1)%n];t===s-1?e.tri(i,o,u[s][0],a.WOOD_END):e.quad(i,o,u[t+1][(r+1)%n],u[t+1][r],a.WOOD_END)}}function Dt(e,t){let n=e.L.ref,r=e.L.refAround,{rings:i,sOf:a}=$e(e.L,n,r),o=bt(e),s=a(i-1,0),c=Math.max(1,Math.round(s/.1));for(let a=0;a<c;a++){let l=a/c*s,u=(a+1)/c*s,d=Ze(n,l),f=[d.cx,d.cy,d.cz],p=Ze(n,u),m=[p.cx,p.cy,p.cz];if(Math.max(f[1],m[1])<-.6||e.L.parent!==void 0&&u<.05)continue;let h=0;for(let e=Math.floor(l/n.step);e<=Math.min(i-1,Math.ceil(u/n.step));e++)for(let t=0;t<r;t+=4)h=Math.max(h,o(e,t));let g=Math.round(h*.9*1e3)/1e3;t.push({a:f.map(e=>Math.round(e*1e3)/1e3),b:m.map(e=>Math.round(e*1e3)/1e3),r:Math.round((g+.05)*1e3)/1e3,solid:g,fin:0})}}function Ot(e){let t=e=>Math.abs(e)<5e-6?`0.0`:e.toFixed(5),n=e=>`vec3f(${t(e[0])}, ${t(e[1])}, ${t(e[2])})`,r=``;for(let[i,a]of e.entries()){let e=a.spine,o=a.junction??0,s=Math.max(2,Math.ceil(e.L/.06)),c=[];for(let t=0;t<=s;t++){let n=Ze(e,t/s*e.L),r=Math.hypot(n.tx,n.ty,n.tz);c.push([o+t/s*e.L,[n.cx,n.cy,n.cz],[n.tx/r,n.ty/r,n.tz/r]])}r+=`fn scape_wood_axis${i}(s: f32) -> ScapeWoodAxis {\n`;for(let e=0;e<s;e++){let[i,o,l]=c[e],[u,d,f]=c[e+1],p=`scape_wood_lerp(${n(o)}, ${n(l)}, ${n(d)}, ${n(f)}, ${t(a.twist)}, clamp((s - ${t(i)}) * ${t(1/(u-i))}, 0.0, 1.0))`;r+=e<s-1?`  if (s < ${t(u)}) {\n    return ${p};\n  }\n`:`  return ${p};\n`}r+=`}

`}r+=`fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {
`;for(let t=1;t<e.length;t++)r+=`  if (limb == ${t}) {\n    return scape_wood_axis${t}(along);\n  }\n`;return r+`  return scape_wood_axis0(along);
}
`}function kt(e){let t=e.find(e=>e.caps[1]===`broken`).spine,n=Ze(t,t.L),r=Math.hypot(n.tx,n.ty,n.tz);return`vec3f(${(n.tx/r).toFixed(5)}, ${(n.ty/r).toFixed(5)}, ${(n.tz/r).toFixed(5)})`}let At=rt(),jt=`
struct ScapeWoodAxis {
  c: vec3f,
  t: vec3f,
  twist: f32,
}

fn scape_wood_lerp(c0: vec3f, t0: vec3f, c1: vec3f, t1: vec3f, twist: f32, f: f32) -> ScapeWoodAxis {
  var a: ScapeWoodAxis;
  a.c = mix(c0, c1, f);
  a.t = normalize(mix(t0, t1, f));
  a.twist = twist;
  return a;
}

${Ot(At)}
// The bark's fine fibres, a height (about -1..1) at a distance along the limb and an angle round
// it: drawn out along the grain, thin round it.
fn scape_wood_fibres(along: f32, ang: f32) -> f32 {
  // (The fibres wander a little round as they go.)
  let a = ang + 0.05 * scape_noise3(vec3f(cos(ang) * 4.0, sin(ang) * 4.0, along * 9.0));
  let q = vec3f(cos(a) * 34.0, sin(a) * 34.0, along * 38.0);
  let r = 1.0 - abs(scape_noise3(q));
  return r * r * 1.4 - 0.7 + 0.5 * scape_noise3(q * vec3f(2.1, 2.1, 1.3) + vec3f(3.1, 7.7, 1.3));
}

// Coarser grooves and swellings along the grain (a height, about -1..1).
fn scape_wood_streaks(along: f32, ang: f32) -> f32 {
  return scape_noise3(vec3f(cos(ang) * 11.0, sin(ang) * 11.0, along * 7.0));
}

fn scape_mat_bark(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let along = attrs.x;
  let ang = attrs.y;
  let deep = clamp(attrs.z, 0.0, 1.0);
  let ao = clamp(attrs.w, 0.0, 1.0);
  // (Which limb: the angle's whole pairs of turns.)
  let limb = i32(floor(ang * (1.0 / 12.566371) + 0.25));

  // The grain's direction on the surface (along the limb, turned by its twist) and round it.
  let ax = scape_wood_axis(along, limb);
  let rv = p - ax.c - dot(p - ax.c, ax.t) * ax.t;
  let r = max(length(rv), 0.02);
  let roundDir = normalize(cross(ax.t, n) + vec3f(1.0e-5, 0.0, 0.0));
  let grain = normalize(ax.t - dot(ax.t, n) * n + roundDir * (ax.twist * r));

  // Fine relief on top of the geometry's: fibres (~2 mm) and streaks (~1 cm), each faded to its
  // mean where a pixel grows past it; slopes from differences along the grain and round it.
  let fineFade = (1.0 - smoothstep(0.0003, 0.0008, foot)) * (0.45 + 0.55 * smoothstep(-0.4, 0.4, scape_noise3(p * 23.0)));
  let midFade = 1.0 - smoothstep(0.001, 0.003, foot);
  var dAlong = 0.0;
  var dRound = 0.0;
  var fib = 0.0;
  if (fineFade > 0.0) {
    fib = scape_wood_fibres(along, ang);
    dAlong += fineFade * 0.00028 * (scape_wood_fibres(along + 0.002, ang) - fib) / 0.002;
    dRound += fineFade * 0.00028 * (scape_wood_fibres(along, ang + 0.0035) - fib) / (0.0035 * r);
  }
  var st = 0.0;
  if (midFade > 0.0) {
    st = scape_wood_streaks(along, ang);
    dAlong += midFade * 0.001 * (scape_wood_streaks(along + 0.01, ang) - st) / 0.01;
    dRound += midFade * 0.001 * (scape_wood_streaks(along, ang + 0.012) - st) / (0.012 * r);
  }
  // (Less of it deep in the fissures, where the shading is dark anyway; never tipped too far.)
  var tilt = (1.0 - 0.5 * deep) * (dAlong * grain + dRound * roundDir);
  tilt *= min(1.0, 0.6 / max(length(tilt), 1.0e-6));
  m.n = normalize(n - tilt);

  // Colour: warm wet mid brown, lighter on the worn crests, dark deep in the fissures; streaks
  // along the grain (paler, bleached ones and reddish ones) and a broad mottle.
  let gx = cos(ang);
  let gy = sin(ang);
  let streakA = scape_noise3(vec3f(gx * 3.2 + 4.1, gy * 3.2 + 1.7, along * 2.2));
  let streakB = scape_noise3(vec3f(gx * 6.5 + 9.3, gy * 6.5 + 2.2, along * 3.1 + 5.0));
  let mottle = scape_fbm3(p * 9.0 + vec3f(1.3, 4.1, 2.7), 3);
  var col = vec3f(0.48, 0.29, 0.15);
  col = mix(col, vec3f(0.57, 0.41, 0.26), smoothstep(0.1, 0.7, streakA) * 0.6);
  col = mix(col, vec3f(0.49, 0.24, 0.11), smoothstep(0.2, 0.75, streakB) * 0.5);
  col = col * (0.97 + 0.24 * mottle);
  // The crests, worn by the water: lighter and greyer (more so out in the open); the fissures
  // dark.
  let crest = (1.0 - smoothstep(0.0, 0.35, deep)) * smoothstep(0.35, 0.9, ao);
  col = mix(col, col * 1.15 + vec3f(0.09, 0.06, 0.03), crest * 0.65);
  col = mix(col, vec3f(0.13, 0.075, 0.04), smoothstep(0.25, 0.95, deep));
  // Fibres and streaks show a little in the colour too (their mean where they fade).
  col *= 1.0 + 0.12 * fineFade * fib + 0.1 * midFade * st;
  // A faint film of algae on the faces turned up to the light.
  let up = smoothstep(0.35, 0.95, n.y) * (1.0 - deep);
  let film = up * smoothstep(-0.2, 0.5, scape_noise3(p * 14.0 + vec3f(7.0, 1.0, 3.0)));
  col = mix(col, vec3f(0.27, 0.29, 0.13), film * 0.12);
  m.albedo = scape_linear(clamp(col, vec3f(0.0), vec3f(1.0)));

  // Wet wood: a faint sheen, rougher on the worn crests, smoother where water lies in the cracks.
  m.rough = clamp(0.62 + 0.07 * crest - 0.08 * deep + 0.04 * mottle, 0.5, 0.75);
  m.spec = 0.036;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}

// Bare wood where the limb broke off: pale, with growth rings round its middle, fine rays, and the
// torn fibres streaked along the limb.
fn scape_mat_woodEnd(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let xy = attrs.xy;
  let ao = clamp(attrs.w, 0.0, 1.0);
  let axis = ${kt(At)};
  let side = normalize(cross(axis, vec3f(0.0, 0.0, 1.0)));
  let side2 = cross(axis, side);
  // Rings a little off centre and wavy, ~0.4 mm apart (faded to their mean where a pixel spans
  // several), fine rays out from the middle.
  let rr = length(xy - vec2f(0.004, -0.003) * (1.0 - smoothstep(0.0, 0.05, length(xy)))) + 0.0018 * scape_noise3(vec3f(xy * 90.0, 1.7));
  let ringFade = 1.0 - smoothstep(0.0008, 0.0017, foot);
  let ph = fract(rr / 0.0034);
  let late = smoothstep(0.62, 0.86, ph) * (1.0 - smoothstep(0.9, 1.0, ph));
  let rays = smoothstep(0.55, 0.95, scape_noise3(vec3f(atan2(xy.y, xy.x) * 40.0, rr * 60.0, 3.3)));
  // The torn fibres: streaks along the limb.
  let fq = vec3f(dot(p, axis) * 30.0, dot(p, side) * 900.0, dot(p, side2) * 900.0);
  let fibre = scape_noise3(fq);
  let fineFade = 1.0 - smoothstep(0.0002, 0.0005, foot);
  // (Weathered, not fresh.)
  var col = vec3f(0.5, 0.38, 0.25);
  col = mix(col, vec3f(0.37, 0.25, 0.15), late * 0.7 * ringFade + 0.25 * (1.0 - ringFade));
  col = mix(col, vec3f(0.6, 0.48, 0.34), rays * 0.25 * ringFade);
  col *= 0.9 + 0.18 * fibre * fineFade;
  // The pith, dark; the rim and the hollows weathered towards the bark's brown.
  col = mix(col, vec3f(0.25, 0.15, 0.08), 1.0 - smoothstep(0.002, 0.005, length(xy)));
  col = mix(col, vec3f(0.36, 0.25, 0.15), (1.0 - smoothstep(0.55, 0.95, ao)) * 0.6);
  m.albedo = scape_linear(col);
  // The fibres' ridges in the normal, across the grain.
  let e = 0.0012;
  let g = (scape_noise3(fq + vec3f(0.0, e * 900.0, 0.0)) - fibre) / e * side + (scape_noise3(fq + vec3f(0.0, 0.0, e * 900.0)) - fibre) / e * side2;
  m.n = normalize(n - fineFade * 0.00012 * (g - dot(g, n) * n));
  m.rough = 0.74;
  m.spec = 0.03;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}
`;var Mt=/* @__PURE__ */ t({WGSL:()=>cn,build:()=>rn});let Nt=[{at:[-.4,.32],size:[.24,.15,.19],sink:.35,yaw:.3,lean:[.04,-.06],freq:52,seed:11,exp:[2.1,2.3],taper:.04,ends:[[1.12,.88],[.55,1.45],[1.05,.95]],lumps:.06,planes:[[.25,1,.45,.66,.06],[.95,.2,-.1,.72,.06],[-.3,.5,-.8,.78,.07]],facets:2,dents:[[-.6,.35,.7,.35,.04],[.1,.9,-.4,.3,.025]],cracks:[[.25,.8,.5,.3,.28,.6],{from:0,at:-.25,turn:2.4,length:.2,depth:.6}],pits:.22,bedding:.7,layers:[.3,.9,-.2]},{at:[.17,.24],size:[.17,.085,.14],sink:.3,yaw:-.5,lean:[-.05,.05],freq:36,seed:23,exp:[2.2,2.4],taper:.05,ends:[[1.1,.9],[.42,1.58],[.92,1.08]],lumps:.05,planes:[[-.35,1,.3,.62,.06],[-.9,.2,.35,.78,.06]],facets:2,dents:[[.6,.5,.6,.4,.035]],cracks:[[.1,.8,.55,1,.55,.6]],pits:.5,bedding:.3,layers:[.9,.3,.2]},{at:[.408,.041],size:[.15,.075,.12],sink:.36,yaw:.9,lean:[.08,0],freq:32,seed:37,exp:[2.2,2.4],taper:0,ends:[[1,.88],[.4,1.6],[.95,1.05]],lumps:.04,planes:[[.35,1,.45,.62,.06],[.2,.3,.95,.75,.08]],facets:2,dents:[[-.5,.6,.6,.35,.04]],cracks:[[.5,.55,.65,1.3,.3,.8],{from:0,at:.2,turn:.7,length:.12,depth:.5}],pits:.9,bedding:0,layers:[0,1,0]},{at:[.62,.12],size:[.09,.05,.08],sink:.36,yaw:-.3,lean:[.02,.04],freq:20,seed:41,exp:[2,2.1],taper:0,ends:[[1,.95],[.46,1.54],[1,1]],lumps:.05,planes:[[.3,1,-.3,.66,.07]],facets:1,dents:[[.5,.7,.4,.4,.03]],cracks:[[.2,.7,.7,2.4,.35,.5]],pits:.3,bedding:.6,layers:[.2,.95,.3]}],Pt={a:[.482,-.64,-.139],b:[.432,-.45,-.14],r:.09},Ft=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],It=e=>Math.hypot(e[0],e[1],e[2]),G=e=>{let t=It(e)||1;return[e[0]/t,e[1]/t,e[2]/t]},Lt=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Rt=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},zt=e=>Math.min(Math.max(e,0),1);function Bt({a:e,b:t,r:n},r,i,a){let o=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],s=zt(((r-e[0])*o[0]+(i-e[1])*o[1]+(a-e[2])*o[2])/Ft(o,o));return Math.hypot(r-e[0]-o[0]*s,i-e[1]-o[1]*s,a-e[2]-o[2]*s)-n}function Vt(e,t,n,r){let i=Math.imul(e,668265261)^Math.imul(t,374761393)^Math.imul(n,2654435761)^Math.imul(r,2246822519);return i=Math.imul(i^i>>>15,2246822507),i=Math.imul(i^i>>>13,3266489909),((i^i>>>16)>>>0)/4294967296}function Ht(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=9,s=9,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=r+f,m=i+d,h=a+u,g=p+Vt(p,m,h,1)-e,_=m+Vt(p,m,h,2)-t,v=h+Vt(p,m,h,3)-n,y=g*g+_*_+v*v;y<o?(s=o,o=y,c=Vt(p,m,h,4),l=Vt(p,m,h,5)):y<s&&(s=y)}return[Math.sqrt(o),Math.sqrt(s),c,l]}function Ut(e){let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(G),r=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=n.slice(),a=(e,t,n)=>G([e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]),o=/* @__PURE__ */ new Map,s=(t,r,s)=>{let c=Math.min(t,r)*12+Math.max(t,r),l=o.get(c);if(!l){l=[];let[s,u]=t<r?[t,r]:[r,t];for(let t=1;t<e;t++)l.push(i.push(a(n[s],n[u],t/e))-1);o.set(c,l)}return t<r?l[s-1]:l[e-s-1]},c=[];for(let[t,a,o]of r){let r=Lt([n[a][0]-n[t][0],n[a][1]-n[t][1],n[a][2]-n[t][2]],[n[o][0]-n[t][0],n[o][1]-n[t][1],n[o][2]-n[t][2]]);Ft(r,n[t])<0&&([a,o]=[o,a]);let l=/* @__PURE__ */ new Map,u=(r,c)=>{if(r===0&&c===0)return t;if(r===e)return a;if(c===e)return o;if(c===0)return s(t,a,r);if(r===0)return s(t,o,c);if(r+c===e)return s(a,o,c);let u=r*(e+1)+c,d=l.get(u);if(d===void 0){let s=n[t],f=n[a],p=n[o],m=(e-r-c)/e,h=r/e,g=c/e;d=i.push(G([s[0]*m+f[0]*h+p[0]*g,s[1]*m+f[1]*h+p[1]*g,s[2]*m+f[2]*h+p[2]*g]))-1,l.set(u,d)}return d};for(let t=0;t<e;t++)for(let n=0;n<e-t;n++)c.push(u(t,n),u(t+1,n),u(t,n+1)),t+n<e-1&&c.push(u(t+1,n),u(t+1,n+1),u(t,n+1))}return{dirs:i,tris:c}}function Wt(e,t){let n=Array.from({length:e},()=>/* @__PURE__ */ new Set);for(let e=0;e<t.length;e+=3){let[r,i,a]=[t[e],t[e+1],t[e+2]];n[r].add(i).add(a),n[i].add(r).add(a),n[a].add(r).add(i)}let r=new Uint32Array(e+1);for(let t=0;t<e;t++)r[t+1]=r[t]+n[t].size;let i=new Uint32Array(r[e]);for(let t=0;t<e;t++)i.set([...n[t]],r[t]);return{start:r,list:i}}function Gt(e,t,n){let r=Float64Array.from(e),i=new Float64Array(e.length);for(let e=0;e<n;e++){for(let e=0;e<r.length;e++){let n=0;for(let i=t.start[e];i<t.start[e+1];i++)n+=r[t.list[i]];i[e]=.5*r[e]+.5*n/(t.start[e+1]-t.start[e])}[r,i]=[i,r]}return r}function Kt(e,t){let n=new Float64Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=Lt([e[a]-e[i],e[a+1]-e[i+1],e[a+2]-e[i+2]],[e[o]-e[i],e[o+1]-e[i+1],e[o+2]-e[i+2]]);for(let e of[i,a,o])for(let t=0;t<3;t++)n[e+t]+=s[t]}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2])||1;n[e]/=t,n[e+1]/=t,n[e+2]/=t}return n}function qt(e,t){let{half:n,exp:r,ends:i,lumps:a,planes:o,off:s,taper:c}=e,l=1-c*t[1],f=n[0]*i[0][t[0]<0?0:1]*l,p=n[1]*i[1][t[1]<0?0:1],m=n[2]*i[2][t[2]<0?0:1]*l,[h,g]=r,_=1/(((Math.abs(t[0])/f)**h+(Math.abs(t[2])/m)**h)**(g/h)+(Math.abs(t[1])/p)**g)**(1/g);_*=1+a*d(t[0]*1.2+s[0],t[1]*1.2+s[1],t[2]*1.2+s[2],3)+.15*a*u(t[0]*3+s[1],t[1]*3+s[2],t[2]*3+s[0]);for(let n of e.dents){let e=Ft(t,n.dir);e>0&&(_*=1-n.depth*Math.exp(-(1-e)/n.size))}let v=0;for(let e of o){let n=Ft(t,e.n);if(n<.001)continue;let r=e.h/n,i=e.soft,a=Math.max(i-Math.abs(_-r),0)/i;v=Math.max(v,zt(.5+.5*(_-r)/i)),_=Math.min(_,r)-a*a*i*.25}return[_,v]}function Jt(e,t){let n=e.scale,r=[t[0]/n[0],t[1]/n[1],t[2]/n[2]],i=It(r),[a,o]=qt(e,[r[0]/i,r[1]/i,r[2]/i]);return[a/i,o]}let Yt=(e,t)=>e.wob.reduce((e,[n,r,i,a,o])=>e+o*Math.sin(n*t[0]+r*t[1]+i*t[2]+a),0),Xt=(e,t)=>e.branch?Rt(-.1*e.length,.05*e.length,t)*(1-Rt(.2*e.length,e.length,t)):1-Rt(.15*e.length,e.length,Math.abs(t)),Zt=(e,t)=>.4+.6*Rt(-.35,.15,.6*Math.sin(t*e.open[0]+e.open[1])+.4*Math.sin(t*e.open[2]+e.open[3])),Qt=(e,t)=>.6+.6*Rt(-.5,.5,.7*Math.sin(t*e.wide[0]+e.wide[1])+.3*Math.sin(t*e.wide[2]+e.wide[3]));function $t(e){let t={...e},r=o(t.seed*7919+13),[i,a,s]=t.size,c=a/(1-t.sink);t.half=[i/2,c/2,s/2],t.mean=(i/2+c/2+s/2)/3,t.off=[r()*50-25,r()*50-25,r()*50-25],t.layers=G(t.layers),t.dents=t.dents.map(([e,t,n,r,i])=>({dir:G([e,t,n]),size:1-Math.cos(r),depth:i}));let l=Array.from({length:t.facets},()=>{let e=r()*2*Math.PI,t=.35+.55*r(),n=Math.sqrt(1-t*t);return[n*Math.cos(e),t,n*Math.sin(e),.8+.06*r(),.1+.05*r()]});t.planes=[...t.planes,...l].map(([e,n,r,i,a])=>{let o=G([e,n,r]);return{n:o,h:i*Math.hypot(...[0,1,2].map(e=>t.half[e]*t.ends[e][o[e]<0?0:1]*o[e])),soft:a*t.mean}});let u=Ut(16).dirs;t.scale=[1,1,1];let d=[1/0,1/0,1/0],f=[-1/0,-1/0,-1/0];for(let e of u){let[n]=Jt(t,e);for(let t=0;t<3;t++)d[t]=Math.min(d[t],e[t]*n),f[t]=Math.max(f[t],e[t]*n)}t.scale=[i/(f[0]-d[0]),c/(f[1]-d[1]),s/(f[2]-d[2])];let[p,m]=t.lean,h=e=>{let[n,r,i]=e;return[n,r]=[n*Math.cos(m)-r*Math.sin(m),n*Math.sin(m)+r*Math.cos(m)],[r,i]=[r*Math.cos(p)-i*Math.sin(p),r*Math.sin(p)+i*Math.cos(p)],[n,i]=[n*Math.cos(t.yaw)+i*Math.sin(t.yaw),-n*Math.sin(t.yaw)+i*Math.cos(t.yaw)],[n,r,i]};t.turn=[h([1,0,0]),h([0,1,0]),h([0,0,1])];let g=-1/0;for(let e of u){let[n]=Jt(t,e);g=Math.max(g,h([e[0]*n,e[1]*n,e[2]*n])[1])}t.shift=[t.at[0],n+a-g,t.at[1]];let _=[Math.cos(t.yaw),0,-Math.sin(t.yaw)],v=[Math.sin(t.yaw),0,Math.cos(t.yaw)],y=0,b=0;for(let e of u){let[n]=Jt(t,e),[r,i,a]=h([e[0]*n,e[1]*n,e[2]*n]);i+t.shift[1]<-.6||(y=Math.max(y,Math.abs(r*_[0]+a*_[2])),b=Math.max(b,Math.abs(r*v[0]+a*v[2])))}let x=Math.max(b,.5*a),S=n+Math.max(a-x,0),C=Math.max(y-x,0);t.obstacle={a:[t.at[0]-_[0]*C,S,t.at[1]-_[2]*C],b:[t.at[0]+_[0]*C,S,t.at[1]+_[2]*C],r:x+.05,solid:x},t.crackList=[];for(let e of t.cracks){let n,i,a=!1,o,s;if(Array.isArray(e)){n=G(e.slice(0,3));let t=G(Lt(n,Math.abs(n[1])<.9?[0,1,0]:[1,0,0])),r=Lt(n,t);i=t.map((t,n)=>t*Math.cos(e[3])+r[n]*Math.sin(e[3])),[o,s]=e.slice(4)}else{let r=t.crackList[e.from];n=G(r.at.map((t,n)=>t+r.along[n]*e.at*r.length));let c=G(r.along.map((e,t)=>e-n[t]*Ft(r.along,n))),l=Lt(n,c);i=c.map((t,n)=>t*Math.cos(e.turn)+l[n]*Math.sin(e.turn)),a=!0,{length:o,depth:s}=e}let[c]=Jt(t,n),l=G(Lt(n,i)),u=G(i),d=(e,r)=>{let i=G(n.map((t,n)=>t+r*e[n])),[a]=Jt(t,i);return i.map(e=>e*a)},[f,p,m,h]=[d(l,.01),d(l,-.01),d(u,.01),d(u,-.01)],g=G(Lt(f.map((e,t)=>e-p[t]),m.map((e,t)=>e-h[t])));Ft(g,n)<0&&(g=g.map(e=>-e)),i=G(i.map((e,t)=>e-g[t]*Ft(i,g)));let _=[[12,.008],[80,.0012],[210,4e-4]].map(([e,t])=>{let n=G([r()*2-1,r()*2-1,r()*2-1]);return[n[0]*e,n[1]*e,n[2]*e,r()*2*Math.PI,t]});t.crackList.push({at:n.map(e=>e*c),out:n,along:i,n:G(Lt(i,g)),branch:a,length:o*2*t.mean,depth:s,wob:_,open:[35,r()*6.3,90,r()*6.3],wide:[60,r()*6.3,150,r()*6.3],k:r()*40})}return t}function en(e,t,n){let[r,i,a]=e.off,o=t[0]+r,s=t[1]+i,c=t[2]+a,l=e.spacing,f=e.coarse,p=Math.sqrt(f),m=.0065*(1-.8*n)*d(o*16,s*16,c*16,3),[h]=Ht(o/.04,s/.04,c/.04);m+=.0035*(1-.8*n)*(h*h-.35);let g=.012*p,[_]=Ht(o/g+4.4,s/g,c/g);m+=.0012*p*(1-n)*(_*_-.3),n>0&&(m+=.0012*p*n*d(o*70/p+1.7,s*70/p,c*70/p,2));let v=1-Math.abs(u(o*24+5.1,s*24,c*24)+.2*u(o*70,s*70,c*70+2.3));if(m-=.001*(1-.6*n)*Rt(.05,.55,u(o*5,s*5+7.7,c*5))*v**(6/f),e.bedding>0){let n=Ft(t,e.layers)*52+1.6*d(o*6,s*6,c*6,2);m-=7e-4*e.bedding*(1-Math.abs(Math.sin(Math.PI*n)))**(3/f)*(.5+.5*u(o*11,s*11,c*11+4))}let y=Rt(-.35,.45,u(o*8+3.1,s*8,c*8));for(let[t,n,r,i,a,d]of[[Math.max(.01,6*l),e.pits*(.2+.7*y),.25,.45,.3,0],[.032*p,.04*e.pits,.16,.3,.2,.35*zt(2-f)]]){let[e,,l,f]=Ht(o/t+9.1,s/t,c/t),p=(r+(i-r)*f)*(1+d*u(o*180,s*180+2.2,c*180));if(l<n&&e<p){let n=1-e/p*(e/p);m-=a*p*t*n*n}}let b=3.2*l,[x,S]=Ht(o/b,s/b+3.3,c/b),C=(.08+.05*n)*l*Rt(0,.3,S-x);C+=(.09+.05*n)*l*d(o/(3.5*l),s/(3.5*l),c/(3.5*l),2);let w=0;for(let n of e.crackList){let r=[t[0]-n.at[0],t[1]-n.at[1],t[2]-n.at[2]],i=Ft(r,n.along),a=Xt(n,i)*Rt(-.5*e.mean,-.25*e.mean,Ft(r,n.out));if(a<=0)continue;let d=Ft(r,n.n)+Yt(n,t),f=2.6*l*(.5+.5*a)*Qt(n,i);if(Math.abs(d)>10*f)continue;let p=d/f,m=.9*l*n.depth*a*Zt(n,i);w+=m*((.75+.25*u(o*30,s*30+n.k,c*30))*Math.exp(-2*p*p)+.2*Math.exp(-p*p/12))}return[m+C-w,w,m-w]}function tn(e,t,r){let{nb:i}=r;e.coarse=Math.max(1,1/e.density);let a=r.dirs.length,o=e.size[1],s=new Float64Array(a*3),c=new Float64Array(a),l=(t,n)=>{let[r,i]=Jt(e,n);s[t*3]=n[0]*r,s[t*3+1]=n[1]*r,s[t*3+2]=n[2]*r,c[t]=i};r.dirs.forEach((e,t)=>l(t,e));let u=new Float64Array(a*3);for(let e=0;e<8;e++){for(let e=0;e<a;e++){let t=0,n=0,r=0,a=i.start[e+1]-i.start[e];for(let a=i.start[e];a<i.start[e+1];a++){let e=i.list[a]*3;t+=s[e],n+=s[e+1],r+=s[e+2]}u[e*3]=.5*s[e*3]+.5*t/a,u[e*3+1]=.5*s[e*3+1]+.5*n/a,u[e*3+2]=.5*s[e*3+2]+.5*r/a}for(let e=0;e<a;e++)l(e,G([u[e*3],u[e*3+1],u[e*3+2]]))}let d=0;for(let e=0;e<a;e++)for(let t=i.start[e];t<i.start[e+1];t++){let n=i.list[t]*3;d+=Math.hypot(s[n]-s[e*3],s[n+1]-s[e*3+1],s[n+2]-s[e*3+2])}e.spacing=d/i.list.length;let f=Kt(s,r.tris),p=new Float64Array(a),m=new Float64Array(a),h=new Float64Array(a),g=new Float64Array(a*3),[_,v,y]=e.turn;for(let t=0;t<a;t++){let[n,r,i]=en(e,[s[t*3],s[t*3+1],s[t*3+2]],c[t]);p[t]=n,m[t]=r,h[t]=i;let a=s[t*3]+f[t*3]*n,o=s[t*3+1]+f[t*3+1]*n,l=s[t*3+2]+f[t*3+2]*n;for(let n=0;n<3;n++)g[t*3+n]=_[n]*a+v[n]*o+y[n]*l+e.shift[n]}let b=Kt(g,r.tris),x=Gt(h,i,2),S=Gt(h,i,Math.max(2,Math.round(12*e.density*e.density))),C=Gt(Array.from(h,(e,t)=>x[t]-e),i,1),w=new Float64Array(a*4);for(let r=0;r<a;r++){let i=zt(Math.max(C[r]/(.25*e.spacing)*.25+(S[r]-h[r])/.004*.6,m[r]/(2*e.spacing*e.coarse))),a=g[r*3+1]-n,s=b[r*3+1],c=.45+.55*Rt(-.01,.45*o,a),l=1-.55*Math.max(-s,0)*(1-Rt(0,.7*o,a)),u=.82+.18*(.5+.5*s),d=Bt(Pt,g[r*3],g[r*3+1],g[r*3+2]),f=1-.45*Math.exp(-Math.max(d,0)/.015);w.set([t,i,0,zt((1-.65*i)*c*l*u*f)],r*4)}return{world:g,attrs:w}}let nn=Nt.map($t);function rn(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=new f(`rocks`),r=[],i=/* @__PURE__ */ new Map;return nn.forEach((e,o)=>{let s=t===1?e.freq:Math.max(6,Math.round(e.freq*t)),c=i.get(s);if(!c){let e=Ut(s);c={...e,nb:Wt(e.dirs.length,e.tris)},i.set(s,c)}let{world:l,attrs:u}=tn({...e,density:s/e.freq},o,c),d=n.vertexCount;for(let e=0;e<c.dirs.length;e++)n.vertex([l[e*3],l[e*3+1],l[e*3+2]],[u[e*4],u[e*4+1],u[e*4+2],u[e*4+3]]);for(let e=0;e<c.tris.length;e+=3)n.tri(d+c.tris[e],d+c.tris[e+1],d+c.tris[e+2],a.ROCK);let f=e.obstacle;r.push({a:f.a.slice(),b:f.b.slice(),r:f.r,solid:f.solid,fin:0})}),r.push(...Le(`rocks`)),{meshes:[n.finish()],obstacles:r}}let K=e=>e.toFixed(5),an=e=>`vec3f(${e.map(K).join(`, `)})`;function on(){let e=Nt[0],t=o(e.seed*7919+4099);t();let r=[e.at[0],n+.45*e.size[1],e.at[1]],i=t()*2*Math.PI,a=(t()*2-1)*.6,s=[Math.sqrt(1-a*a)*Math.cos(i),a,Math.sqrt(1-a*a)*Math.sin(i)],c=Ft(s,r)+(t()-.5)*.5*Math.min(e.size[0],e.size[2]);return[c,c+(t()<.5?-1:1)*(.015+.015*t())].map((e,t)=>`    let vein${`AB`[t]} = vec4f(${s.map(K).join(`, `)}, ${K(e)});`).join(`
`)}function sn(){let e=[];return nn.forEach((t,n)=>{let[r,i,a]=t.turn;e.push(`  ${n?`} else `:``}if (id == ${n}u) {`,`    let back = transpose(mat3x3f(${an(r)}, ${an(i)}, ${an(a)}));`,`    let ql = back * (p - ${an(t.shift)});`,`    let nl = back * n;`);for(let n of t.crackList){let r=n.length,i=n.branch?`smoothstep(${K(-.1*r)}, ${K(.05*r)}, along) * (1.0 - smoothstep(${K(.2*r)}, ${K(r)}, along))`:`1.0 - smoothstep(${K(.15*r)}, ${K(r)}, abs(along))`,a=n.wob.map(([e,t,n,r,i])=>`${K(i)} * sin(dot(ql, ${an([e,t,n])}) + ${K(r)})`).join(` + `);e.push(`    {`,`      let d = ql - ${an(n.at)};`,`      let along = dot(d, ${an(n.along)});`,`      let mask = (${i}) * smoothstep(${K(-.5*t.mean)}, ${K(-.25*t.mean)}, dot(d, ${an(n.out)}));`,`      let cn = ${an(n.n)};`,`      let off = dot(d, cn) + ${a};`,`      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${K(n.open[0])} + ${K(n.open[1])}) + 0.4 * sin(along * ${K(n.open[2])} + ${K(n.open[3])}));`,`      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${K(n.wide[0])} + ${K(n.wide[1])}) + 0.3 * sin(along * ${K(n.wide[2])} + ${K(n.wide[3])}));`,`      let hw = ${K(5e-4*Math.sqrt(n.depth))} * wide * (0.4 + 0.6 * mask);`,`      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);`,`      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);`,`      crackLine = max(crackLine, core * mask * open);`,`    }`)}}),e.push(`  }`),e.join(`
`)}let cn=`
fn scape_mat_rock(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let id = u32(attrs.x + 0.5);
  let cav = clamp(attrs.y, 0.0, 1.0);
  let fid = f32(id);
  // Each stone its own grey (sRGB) and tint: neutral slate, a warmer grey, a darker basalt, a
  // greenish grey.
  var base = vec3f(0.245, 0.245, 0.247);
  var tint = vec3f(0.99, 1.0, 1.02);
  if (id == 1u) {
    base = vec3f(0.255, 0.247, 0.236);
    tint = vec3f(1.03, 1.0, 0.96);
  } else if (id == 2u) {
    base = vec3f(0.205, 0.208, 0.215);
    tint = vec3f(1.0, 1.0, 1.03);
  } else if (id >= 3u) {
    base = vec3f(0.228, 0.233, 0.218);
    tint = vec3f(0.98, 1.03, 0.95);
  }
  let q = p + vec3f(fid * 7.31, fid * 3.17, fid * 5.53);
  let aa = max(foot, 1e-6);
  // Soft mottling: broad cloudy patches, paler clouds, a finer speckle; the tint drifting patch to
  // patch, and a faint rusty stain here and there, where iron in it weathered.
  let m1 = scape_fbm3(q * 9.0, 3);
  let m2 = scape_fbm3(q * 36.0 + vec3f(2.7), 2) * (1.0 - smoothstep(0.007, 0.014, aa));
  let cloud = smoothstep(0.15, 0.65, scape_noise3(q * 4.0 + vec3f(9.0)));
  var c = base * (1.0 + 0.36 * m1 + 0.14 * m2 + 0.18 * cloud);
  c *= mix(vec3f(1.0), tint, 0.5 + 0.5 * scape_noise3(q * 5.0 + vec3f(4.0)));
  c *= mix(vec3f(1.0), vec3f(1.07, 1.0, 0.9), smoothstep(0.35, 0.75, scape_noise3(q * 3.0 + vec3f(21.0))));
  // Mineral flecks: a share of small cells lit pale (a few dark), more of them in some drifts than
  // in others, most of them small and a few bigger, each its own tone, flattened along the
  // stone's grain (so most show as short laths), their rims ragged up close.
  let drift = smoothstep(-0.4, 0.5, scape_noise3(q * 18.0 + vec3f(1.3)));
  let paleShare = 0.2 + 0.2 * drift;
  let grainSeen = 1.0 - smoothstep(0.003, 0.006, aa);
  var pale = 0.0;
  var dark = 0.0;
  var tone = 0.42;
  if (aa < 0.006) {
    let lath = normalize(vec3f(sin(fid * 2.4 + 0.5), 0.35, cos(fid * 2.4 + 0.5)));
    let gq = q * 140.0;
    let cl = scape_cells3(gq + lath * dot(gq, lath) * 0.7);
    let u = fract(cl.z * 7.3);
    var rad = 0.12 + 0.28 * u * u;
    if (aa < 0.0016) {
      rad *= 1.0 + 0.35 * (1.0 - smoothstep(0.0008, 0.0016, aa)) * scape_noise3(q * 900.0);
    }
    // (Edges blurred over a pixel, in cell units; a little brighter at the heart.)
    let edge = max(70.0 * aa, 0.03);
    let fleck = (1.0 - smoothstep(rad - edge, rad + edge, cl.x)) * (0.8 + 0.2 * clamp(1.0 - cl.x / rad, 0.0, 1.0));
    pale = select(0.0, fleck, cl.z > 1.0 - paleShare);
    dark = select(0.0, fleck, cl.z < 0.03);
    tone = 0.34 + 0.14 * fract(cl.z * 17.0);
  }
  // (Faded out, the flecks' mean cover: about a twentieth of the share of cells lit, measured.)
  c = mix(c, vec3f(tone, 0.99 * tone, 0.94 * tone), 0.5 * mix(0.052 * paleShare, pale, grainSeen));
  c *= 1.0 - 0.4 * mix(0.0015, dark, grainSeen);
  // Pinprick pits, finer than the mesh's: a few small cells, dark and rougher.
  var pit = 0.0;
  if (aa < 0.0032) {
    let pc = scape_cells3(q * 160.0 + vec3f(5.0));
    let pitR = 0.1 + 0.12 * fract(pc.z * 11.0);
    let pitEdge = max(80.0 * aa, 0.35 * pitR);
    pit = select(0.0, 1.0 - smoothstep(pitR - pitEdge, pitR + pitEdge, pc.x), pc.z > 0.965 - 0.04 * drift) * (1.0 - smoothstep(0.0016, 0.0032, aa));
  }
  c *= 1.0 - 0.3 * pit;
  // A faint quartz vein through the biggest stone and a finer one beside it: each a thin pale band
  // where its plane (bent gently, the two alike) meets the surface, with a fainter halo, its width
  // wavering, pinching out in stretches.
  var vein = 0.0;
  if (id == 0u) {
${on()}
    let bend = 0.015 * scape_fbm3(q * 6.0, 2);
    for (var k = 0; k < 2; k++) {
      let pl = select(veinA, veinB, k == 1);
      let fk = f32(k);
      let warp = bend + 0.0012 * scape_noise3(q * 60.0 + vec3f(fk * 2.0));
      let across = max(length(pl.xyz - n * dot(pl.xyz, n)), 0.25);
      let dist = abs(dot(p, pl.xyz) - pl.w + warp) / across;
      let run = smoothstep(-0.4, 0.05, scape_noise3(q * 6.0 + vec3f(fk * 3.1, 5.0, 0.0))) * (1.0 - 0.45 * fk);
      let w = 0.0009 * (0.25 + 1.1 * smoothstep(-0.6, 0.6, scape_fbm3(q * 30.0 + vec3f(fk), 2))) * (1.0 - 0.4 * fk);
      let core = clamp((w - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * w / aa, 1.0);
      let halo = 1.0 - smoothstep(0.5 * w, 5.0 * w + aa, dist);
      vein = max(vein, run * max(core, 0.1 * halo));
    }
  }
  c = mix(c, vec3f(0.4, 0.395, 0.375), 0.35 * vein);
  // Hairline cracks: each crack's centre line, sharp at any scale, down the middle of its groove.
  var crackLine = 0.0;
${sn()}
  c *= 1.0 - 0.8 * crackLine;
  // Darker in its cavities, cracks and pits (the occlusion darkens them too).
  c *= mix(1.0, 0.6, cav);
  let albedo = scape_linear(clamp(c, vec3f(0.0), vec3f(1.0)));
  // Fine roughness in the normal: two octaves of bumps, each faded once a pixel outgrows it, the
  // matte it gave left in the roughness instead, so the stone is no glossier from afar.
  var grad = vec3f(0.0);
  var matte = 0.0;
  for (var o = 0; o < 2; o++) {
    let f = select(140.0, 420.0, o == 1);
    let s = select(0.06, 0.05, o == 1);
    let seen = 1.0 - smoothstep(0.25 / f, 0.5 / f, aa);
    matte += 0.08 * (1.0 - seen);
    if (seen <= 0.0) { continue; }
    let b = q * f + vec3f(f32(o) * 13.0);
    let b0 = scape_noise3(b);
    let gb = vec3f(scape_noise3(b + vec3f(0.25, 0.0, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.25, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.0, 0.25)) - b0) * 4.0;
    grad += gb * s * seen;
  }
  let sn = normalize(n - (grad - n * dot(grad, n)));
  // A soft wet sheen: glossier on the quartz and the flecks, rougher in the hollows and pits.
  let rough = clamp(0.56 + matte + 0.06 * m1 + 0.12 * cav + 0.1 * pit - 0.08 * vein - 0.1 * pale * grainSeen, 0.3, 0.85);
  return ScapeMat(albedo, sn, rough, 0.04, vec3f(0.0), clamp(attrs.w, 0.0, 1.0), vec3f(0.0));
}
`;var ln=/* @__PURE__ */ t({WGSL:()=>dr,build:()=>lr});let q=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],J=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Y=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],un=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],dn=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],X=e=>Math.hypot(e[0],e[1],e[2]),Z=e=>Y(e,1/(X(e)||1)),fn=(e,t,n)=>q(e,Y(J(t,e),n)),pn=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return q(q(Y(e,r),Y(dn(t,e),i)),Y(t,un(t,e)*(1-r)))},mn=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},hn=[0,1,0],gn=(e,t)=>Z(J(e,Y(t,un(e,t)))),_n=e=>e-Math.floor(e);function vn(e,t){let n=_n(e*.618034+.17),r=_n(e*.754877+.31),i=_n(e*.56984+.53);return{widest:.3+.12*n,base:2+r,tip:1.45+.5*i,drawn:t?.06+.14*n:.18+.2*n}}function yn(e,t){if(e<=t.widest)return Math.sqrt(Math.max(1-((t.widest-e)/t.widest)**t.base,0));let n=(e-t.widest)/(1-t.widest);return Math.max(1-n**t.tip,0)**1.05*(1-t.drawn*mn(.62,1,n))}let bn=.3,xn=(e,t,n,r,i)=>{let a=Math.abs(t),o=+(t<0);return n*(e-bn*a**1.2*yn(e,i))+.5*o+.2*Math.sin(9*e+2.3*r+1.7*o)*Math.min(2*a,1)};function Sn(e){let t=e.length,n=.5*e.ratio*t,r=Z(dn(e.face,e.dir)),i=[[0,0,0]],a=[];for(let n=0;n<=120;n++){let o=n/120,s=e.arch*o**1.6+e.droop*mn(.7,1,o),c=e.side*o**1.3,l=pn(e.dir,r,s),u=pn(e.face,r,s),d=pn(r,u,c);l=pn(l,u,c),d=pn(d,l,e.twist*o),u=pn(u,l,e.twist*o),a.push({T:l,N:u,X:d}),n&&i.push(q(i[n-1],Y(q(l,a[n-1].T),.5*t/120)))}let o=t=>{let n=Math.min(Math.max(t,0),1)*120,r=Math.min(Math.floor(n),119),o=n-r;return{c:q(e.base,fn(i[r],i[r+1],o)),T:Z(fn(a[r].T,a[r+1].T,o)),N:Z(fn(a[r].N,a[r+1].N,o)),X:Z(fn(a[r].X,a[r+1].X,o))}},s=vn(e.id,!!e.small),c=(t,r)=>yn(t,s)*n*(r?1+e.asym:1-e.asym);return{b:e,L:t,H:n,at:(n,r)=>{let{c:i,N:a,X:l}=o(n),d=c(n,r>=0),f=Math.max(-1.2,Math.min(1.2,r/Math.max(d,1e-7))),p=Math.abs(f),m=Math.sin(Math.PI*Math.min(n*1.15,1)),h=e.cup*(.3+.7*m)*d*f*f;h+=e.fold*d*(Math.sqrt(f*f+.004)-.0632);let g=t*(.013-.007*n);h-=t*.0065*(1-.8*n)*Math.exp(-((r/g)**2)),h+=t*e.quilt*(.5-.5*Math.cos(2*Math.PI*xn(n,f,e.veins,e.id,s)))*mn(.05,.2,p)*(1-mn(.75,1,p))*mn(.03,.12,n)*(1-mn(.85,.98,n));let _=r>=0?e.phase:e.phase+2.3;if(h+=e.wave*d*(Math.sin(2*Math.PI*e.waves*n+_)+.6*u(n*6,f*1.3,e.id*3.7+.5))*mn(.4,1,p)**2*m,!e.furl)return q(q(i,Y(l,r)),Y(a,h));let v=d/(e.furl*(r>=0?4.6:4)),y=r/Math.max(v,1e-7);return q(q(i,Y(l,v*Math.sin(y))),Y(a,v*(1-Math.cos(y))))},frame:o,half:c}}function Cn(e,t,n,r,i){let{b:a,L:o,at:s,frame:c,half:l}=t,u=(e,t)=>{let n=2e-4,r=J(s(Math.min(e+n,1),t),s(Math.max(e-n,0),t)),i=J(s(e,t+n*o),s(e,t-n*o)),a=dn(r,i);return X(a)>1e-14?Z(a):c(e).N},d=[];for(let e=0;e<=r;e++){let t=-1+2*e/r;d.push(Math.sign(t)*Math.abs(t)**1.3)}let f=[],p=e.vertex(s(0,0),[0,0,a.id,1],c(0).N);f.push([p,0,0]);let m=[];for(let t=1;t<n;t++){let r=t/n,i=.6*r+.4*(.5-.5*Math.cos(Math.PI*r));m.push(d.map(t=>{let n=t*l(i,t>=0),r=e.vertex(s(i,n),[i,t,a.id,1],u(i,n));return f.push([r,i,n]),r}))}let h=e.vertex(s(1,0),[1,0,a.id,1],c(1).N);f.push([h,1,0]);for(let t=0;t<r;t++){e.tri(p,m[0][t],m[0][t+1],i);for(let n=0;n+1<m.length;n++)e.quad(m[n][t],m[n+1][t],m[n+1][t+1],m[n][t+1],i);e.tri(m[m.length-1][t],h,m[m.length-1][t+1],i)}return f}function wn(e,t){let n=e.length,r=e.map((t,r)=>Z(J(e[Math.min(r+1,n-1)],e[Math.max(r-1,0)]))),i=[gn(t,r[0])];for(let e=1;e<n;e++){let t=dn(r[e-1],r[e]),n=X(t),a=n>1e-9?pn(i[e-1],Y(t,1/n),Math.atan2(n,un(r[e-1],r[e]))):i[e-1];i.push(gn(a,r[e]))}return{T:r,U:i}}function Tn(e,t,n,r,i,a,o,s=null){let c=t.length,{T:l,U:u}=wn(t,o),d=[],f=0;for(let i=0;i<c;i++){let o=u[i];if(i&&(f+=X(J(t[i],t[i-1]))),n[i]<=0){d.push(e.vertex(t[i],[f,0,a,1],i?l[i]:Y(l[i],-1)));continue}let p=dn(l[i],o),m=Math.max(i-1,0),h=Math.min(i+1,c-1),g=Math.max(X(J(t[h],t[m])),1e-9),_=[];for(let c=0;c<=r;c++){let u=2*Math.PI*c/r,d=q(Y(o,Math.cos(u)),Y(p,Math.sin(u)));if(!s){let r=(n[h]-n[m])/g;_.push(e.vertex(q(t[i],Y(d,n[i])),[f,u,a,1],Z(J(d,Y(l[i],Math.max(-3,Math.min(3,r)))))));continue}let v=s(i,u),y=(s(i,u+.001)-s(i,u-.001))/.002,b=Z(J(Y(d,v),Y(q(Y(o,-Math.sin(u)),Y(p,Math.cos(u))),y))),x=(n[h]*s(h,u)-n[m]*s(m,u))/g*un(d,b);_.push(e.vertex(q(t[i],Y(d,n[i]*v)),[f,u,a,1],Z(J(b,Y(l[i],Math.max(-3,Math.min(3,x)))))))}d.push(_)}for(let t=0;t+1<c;t++){let n=d[t],a=d[t+1];for(let t=0;t<r;t++)typeof n==`number`?e.tri(n,a[t+1],a[t],i):typeof a==`number`?e.tri(n[t],n[t+1],a,i):e.quad(n[t],n[t+1],a[t+1],a[t],i)}return{rings:d,T:l,U:u}}function En(e,t,n,r,i,a=1.35){let o=[];for(let s=0;s<=i;s++){let c=1-(1-s/i)**a,l=1-c;o.push(q(q(Y(e,l*l*l),Y(t,3*l*l*c)),q(Y(n,3*l*c*c),Y(r,c*c*c))))}return o}function Dn(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function On(e,t,n,r,i){let a=e.frame(0),o=q(e.at(0,0),Y(a.N,-.8*i)),s=X(J(o,t));return En(t,q(t,Y(n,.45*s)),J(o,Y(a.T,Math.min(.08,.3*s))),o,r)}function kn(e,t,n,r,i){let a=r.rTop*1.12,o=On(e,t,n,r.segs,a),s=X(J(o[o.length-1],t)),c=[];o.forEach((e,t)=>{let n=t/r.segs;if(t&&t<r.segs){let r=.003*Math.sin(Math.PI*n)*(s/.4);o[t]=q(e,[r*u(n*2.2,i*1.7,.3),r*u(n*2.2,i*1.7,5.1),r*u(n*2.2,i*1.7,9.7)])}let a=r.rBase+(r.rTop-r.rBase)*n**.7;c.push(a*(1+r.sheath*(1-mn(0,r.sheathLen/s,n))**2)*(1+.14*mn(.88,1,n)))});let l=r.midribSegs;for(let t=1;t<=l;t++){let n=t/l*r.midrib,i=t===l?0:a*(1-t/l)**.75;o.push(q(e.at(n,0),Y(e.frame(n).N,-.8*i))),c.push(i)}return{pts:o,rad:c,segs:r.segs,n:l,midrib:r.midrib}}function An(e,t,n,r,i,o){let{pts:s,rad:c,segs:l}=n,u=t.frame(0).N,{T:d,U:f}=wn(s,u),p=Math.atan2(un(u,dn(d[l],f[l])),un(u,f[l]));return Tn(e,s,c,r.sides,a.STEM,i,u,(e,t)=>1-r.groove*(1-mn(1-o,1,e/l))*Math.max(0,Math.cos(t-p))**3)}let jn=(e,t,n)=>{let r=(n-e)/(t-e);return r<=0||r>=1?0:6*r*(1-r)/(t-e)};function Mn(e){let t=t=>1.6*e.arch*Math.max(t,0)**.6+e.droop*jn(.7,1,t),n=/* @__PURE__ */ new Float64Array(513),r=/* @__PURE__ */ new Float64Array(513);for(let e=1;e<=512;e++){let i=(e-.5)/512,a=i*i*(2-i)*t(i)/512;n[e]=n[e-1]+Math.cos(w*i)*a,r[e]=r[e-1]+Math.sin(w*i)*a}let i=(e,t)=>{let n=Math.min(Math.max(t,0),1)*512,r=Math.min(Math.floor(n),511);return e[r]+(e[r+1]-e[r])*(n-r)};return{turn:t,Kc:e=>i(n,e),Ks:e=>i(r,e)}}function Nn(e,t){let n=e.frame(t),r=Z(n.T),i=gn(n.N,r);return[r,dn(i,r),i]}function Pn(e,t,n,r,i,a,o,s,c,l){let u=c.segs,d=0;for(let e=1;e<=u;e++)d+=X(J(c.pts[e],c.pts[e-1]));let f=Z(J(c.pts[u],c.pts[u-1])),p=i.frame(0).N,m=i.L,h=gn(p,f),g=dn(f,h),_=[0];for(let e=1;e<=u;e++)_.push(_[e-1]+X(J(c.pts[e],c.pts[e-1])));let v=e=>{let t=Z(J(c.pts[Math.min(e+1,u)],c.pts[Math.max(e-1,0)])),n=_[e]/_[u],r=n*(4-3*n);return[Y(t,un(t,h)*r),Y(t,un(t,g)*r)]},y=[[0,0,0]],b=[[0,0,0]];for(let e=1;e<=u;e++){let[t,n]=v(e-1),[r,i]=v(e),a=.5*(_[e]-_[e-1])/_[u];y.push(q(y[e-1],Y(q(t,r),a))),b.push(q(b[e-1],Y(q(n,i),a)))}let x=e=>{let t=1;for(;t<u&&_[t]/_[u]<e;)t++;let n=Math.min(Math.max((e*_[u]-_[t-1])/(_[t]-_[t-1]),0),1);return[...fn(y[t-1],y[t],n),0,...fn(b[t-1],b[t],n),0]};if(E(n,r*40,{...l,foot:c.pts[0],base:c.pts[u],S:f,P:h,Ls:d,Lb:m,tip:i.at(1,0),dir:i.b.dir,jP:y[u],jQ:b[u]}),l.with!==void 0)for(let e of[16,17])n[r*40+e]=n[l.with*40+e];let S=d/(d+m),C=Mn(i.b),w=(n,a)=>{let[o,s,c]=Nn(i,a),l=J([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],i.frame(a).c);t[n]=[r,S+(1-S)*a,a,un(l,s),...D(o,s,c),C.turn(a)/m,C.Kc(a),C.Ks(a),un(l,c),0,0,0,0,0,0,0,0]};for(let[e,t]of a)w(e,t);let T=[0];for(let e=1;e<=o.segs;e++)T.push(T[e-1]+X(J(o.pts[e],o.pts[e-1])));s.rings.forEach((n,i)=>{let a=typeof n==`number`?[n]:n;if(i<=o.segs){let n=s.T[i],c=gn(s.U[i],n),l=D(n,c,dn(n,c)),u=o.pts[i],d=x(T[i]/T[o.segs]);for(let n of a)t[n]=[r,T[i]/T[o.segs]*S,-1,0,...l,...J([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],u),0,...d];return}let c=(i-o.segs)/o.n*o.midrib;for(let e of a)w(e,c)})}function Fn(e,t,n){let r=new Float32Array(e*20);for(let n=0;n<e;n++)t[n]?r.set(t[n],n*20):(r[n*20]=-1,r[n*20+7]=1);return{vertex:r,leaves:n}}let In=(e,t,n)=>Math.max(n,Math.round(e*t)),Ln=(e,t,n)=>Math.max(n,2*Math.round(e*t/2));function Rn(e,t=.94){if(X(e)<=t)return e;let n=Math.hypot(e[0],e[2]),r=Math.sqrt(Math.max(t*t-e[1]*e[1],0));return[e[0]*r/n,e[1],e[2]*r/n]}function zn(e,t,r,i,o,s,c,l,d){let f=n-.9*s,p=Z(dn(r,hn)),m=.3*(l()-.5),h=(e,n,i=0)=>[t[0]+r[0]*e+p[0]*i,n,t[2]+r[2]*e+p[2]*i],g=[t,h(.9*i,f+.7*s),h(i+.5*o,f,m*o),h(i+o,f,1.6*m*o),h(i+o+.012,f-.03,2*m*o),h(i+o+.018,f-.07,2.2*m*o)],_=In(5,d,2),v=Dn(g,_).map((e,t)=>{let n=t*5/_,r=n>6?.0025:0;return Rn(q(e,[r*u(n*.35,c,1.1),.4*r*u(n*.35,c,4.2),r*u(n*.35,c,7.3)]))});Tn(e,v,v.map((e,t)=>t===v.length-1?0:s*(1.1-.65*(t/v.length))),In(6,d,4),a.ROOT,c,hn)}let Bn=[{r:.1,pts:[[-.52,-.65,-.045],[-.5,-.55,-.055],[-.45,-.474,-.064],[-.38,-.418,-.076],[-.3,-.381,-.086],[-.21,-.358,-.113],[-.125,-.325,-.133],[-.034,-.29,-.144],[.06,-.273,-.152],[.16,-.273,-.159],[.25,-.299,-.164],[.33,-.342,-.158],[.39,-.403,-.147],[.44,-.47,-.136],[.48,-.55,-.131],[.5,-.65,-.138]]},{r:.085,pts:[[.15,-.27,-.165],[.2,-.13,-.245],[.228,-.04,-.254]]},{r:.095,pts:[[-.42,-.441,-.073],[-.4,-.501,-.004],[-.37,-.56,.058],[-.35,-.64,.108]]}],Vn=[{c:[-.4,.32],w:.24,h:.15,d:.19},{c:[.17,.24],w:.17,h:.1,d:.14},{c:[.4,.1],w:.15,h:.09,d:.12},{c:[.62,.12],w:.09,h:.05,d:.08}],Hn={lo:[-.35,-.15,-.2],hi:[.35,.6,.6]},Un=(e,t,n)=>{let r=n[0]-t[0],i=n[1]-t[1],a=n[2]-t[2],o=e[0]-t[0],s=e[1]-t[1],c=e[2]-t[2],l=Math.min(Math.max((o*r+s*i+c*a)/(r*r+i*i+a*a),0),1);return Math.hypot(o-r*l,s-i*l,c-a*l)};function Wn(e,t){let r=0;for(let n of Bn)for(let i=0;i+1<n.pts.length;i++)r=Math.max(r,n.r+t-Un(e,n.pts[i],n.pts[i+1]));for(let i of Vn){let a=i.h/.65,o=[(e[0]-i.c[0])/(.5*i.w+t),(e[1]-(n+i.h-.5*a))/(.5*a+t),(e[2]-i.c[1])/(.5*i.d+t)],s=X(o);s<1&&(r=Math.max(r,(1-s)*.5*i.h))}let i=Math.min(...[0,1,2].map(t=>Math.min(e[t]-Hn.lo[t],Hn.hi[t]-e[t])));return Math.max(r,i-.015)}function Gn(e,t,n){let r=0;for(let i=0;i<=12;i++){let a=i/12;for(let i of[-1,-.5,0,.5,1]){let o=e.at(a,i*e.half(a,i>=0));if(o[1]>-.62&&(r=Math.max(r,X(o)-.938)),r=Math.max(r,Wn(o,t)),n)for(let e=0;e<3;e++)r=Math.max(r,n.lo[e]-o[e],o[e]-n.hi[e])}}return r}var Kn=class{constructor(e){this.cell=e,this.map=/* @__PURE__ */ new Map}key(e,t,n){return((e+512)*1024+(t+512))*1024+(n+512)}add(e,t){let n=this.cell,r=this.key(Math.floor(e[0]/n),Math.floor(e[1]/n),Math.floor(e[2]/n));this.map.has(r)||this.map.set(r,[]),this.map.get(r).push({p:e,blade:t})}near(e,t,n){let r=this.cell,i=Math.floor(e[0]/r),a=Math.floor(e[1]/r),o=Math.floor(e[2]/r),s=0;for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++)for(let u of this.map.get(this.key(i+r,a+c,o+l))??[]){let r=u.blade?t:n,i=u.p[0]-e[0],a=u.p[1]-e[1],o=u.p[2]-e[2];i*i+a*a+o*o<(r-s)*(r-s)&&r>s&&(s=r-Math.sqrt(i*i+a*a+o*o))}return s}};function qn(e,t,n){let r=[];for(let i=0;i<=t;i++){let a=(i/t)**1.25;for(let t=0;t<=n;t++){let i=-1+2*t/n;r.push(e.at(a,i*e.half(a,i>=0)))}}return r}function Jn(e,t,n){let r=e=>{let t=Sn(e.b),r=Gn(t,n.margin,n.bounds),i=On(t,e.from,e.rise,12,0);for(let e of i.slice(4))r=Math.max(r,Wn(e,.01));if(n.crowd){for(let e of qn(t,n.samples[0],n.samples[1]))r=Math.max(r,n.crowd.near(e,n.gap,n.stalkGap));for(let e of i.slice(3))r=Math.max(r,n.crowd.near(e,n.stalkGap,0))}return{shape:t,w:r}},i=t[0].slice(1).map(()=>0),a={leaf:e(i),q:i};a.s=r(a.leaf);let o=a;for(let n=0,i=0;n<24&&o.s.w>0&&i<4;n++){let n=null;for(let i of t){let t=a.q.map((e,t)=>e+i[t]),o=e(t),s=r(o),c=s.w+i[i.length-1];(!n||c<n.cost)&&(n={cost:c,q:t,leaf:o,s})}a=n,a.s.w<o.s.w-1e-5?(o=a,i=0):i++}if(o.s.w>0&&n.wide){let t=null;for(let i of n.wide){let n=o.q.map((e,t)=>e+i[t]),a=e(n),s=r(a),c=s.w+i[i.length-1];s.w<o.s.w&&(!t||c<t.cost)&&(t={cost:c,q:n,leaf:a,s})}t&&(o=t)}if(o.s.w>0&&n.wider){let t=o,i=null;for(let a of n.wider){let n=t.q.map((e,t)=>e+a[t]),o=e(n),s=r(o),c=3*s.w+a[a.length-1];if(s.w<t.s.w&&(!i||c<i.cost)&&(i={cost:c,q:n,leaf:o,s}),s.w<=0)break}i&&(o=i)}return{leaf:o.leaf,shape:o.s.shape}}function Yn(e,t,n,r){for(let n of qn(t,r[0],r[1]))e.add(n,!0);for(let t of n)e.add(t,!1)}function Xn(e,t,r,i,a){let o=new Float64Array(r.length*8);r.forEach((e,t)=>o.set([...e.c,...e.n??[0,0,0],e.a,e.owner],t*8));for(let r=0;r<e.vertexCount;r++){let s=e.p[r*3],c=e.p[r*3+1],l=e.p[r*3+2],u=t[r],d=0;for(let e=0;e<o.length;e+=8){if(o[e+7]===u)continue;let t=o[e]-s,n=o[e+1]-c,r=o[e+2]-l,i=t*t+n*n+r*r;if(i<25e-6)continue;let a=Math.sqrt(i),f=n/a;if(f<=-.1)continue;let p=o[e+3]||o[e+4]||o[e+5]?Math.abs(o[e+3]*t+o[e+4]*n+o[e+5]*r)/a:.5;d+=o[e+6]*(f+.1)*p*mn(.005,.015,a)/(Math.PI*i+o[e+6])}let f=mn(-.01,i,c-n);e.a[r*4+3]=Math.max(Math.exp(-a*d),.35)*(.75+.25*f)}}function Zn(e,t,n){for(let r=0;r<8;r++)for(let i=0;i<4;i++){let a=(r+.5)/8,o=-1+(2*i+1)/4,s=e.half(a,o>=0);n.push({c:e.at(a,o*s),n:e.frame(a).N,a:e.L/8*(2*s/4),owner:t})}}function Qn(e,t,n,r){for(let i=3;i<e.length;i+=3)r.push({c:e[i],n:null,a:2*t*X(J(e[i],e[i-3])),owner:n})}let $n=(e,t,n,r)=>{for(let i=n;i<e.vertexCount;i++)t[i]=r},er=[.5,n,-.32],tr={lo:[.06,-.7,-.64],hi:[.92,.2,.24]},nr=[{top:[.42,-.06,-.46],dir:[-.66,.6,.25],length:.44,ratio:.5,arch:.85,at:.24,toward:1},{top:[.64,-.1,-.3],dir:[.4,.75,.3],length:.41,ratio:.48,arch:.8,at:.74,toward:.8},{top:[.47,-.2,-.15],dir:[-.75,.1,.65],length:.36,ratio:.5,arch:.6,at:.47,toward:.9},{top:[.36,-.14,-.5],dir:[-.6,.7,-.1],length:.34,ratio:.47,arch:.7,at:.06,toward:.9},{top:[.56,-.17,-.22],dir:[.55,.55,.6],length:.31,ratio:.5,arch:.75,at:.53,toward:.9},{top:[.67,-.26,-.43],dir:[.1,.8,-.4],length:.32,ratio:.48,arch:.6,at:.82,toward:.6},{top:[.64,-.32,-.13],dir:[.75,.3,.55],length:.29,ratio:.51,arch:.6,at:.66,toward:.9},{top:[.4,-.2,-.43],dir:[-.85,.35,-.05],length:.28,ratio:.49,arch:.6,at:.15,toward:1,with:3},{top:[.72,-.4,-.26],dir:[.45,.75,.4],length:.24,ratio:.5,arch:.6,at:.92,toward:.5},{top:[.575,-.38,-.345],dir:[.05,.97,.1],length:.16,ratio:.42,arch:.15,at:.58,furl:.6,toward:.5},{top:[.47,-.48,-.3],dir:[-.1,.95,.12],length:.1,ratio:.4,arch:.08,at:.37,furl:.8,toward:.5}];function rr(e,t,n){let r=pn(e,hn,t),i=dn(r,hn);return X(i)<.001?r:Z(pn(r,Z(i),Math.min(n,Math.acos(Math.min(r[1],1))-.05)))}function ir(e,t,n){let r=new f(`plantTall`),i=[],o=[],s=[],c=[],l=new Float32Array(nr.length*40),d=[.4,-.596,-.285],p=[.6,-.596,-.36],m=.024,h=.016,g=e=>q(fn(d,p,e),[0,.006*Math.sin(Math.PI*e),.008*Math.sin(2*Math.PI*e)]);{let e=[0];for(let t=1;t<=400;t++)e.push(e[t-1]+X(J(g(t/400),g((t-1)/400))));let t=e[400],s=t=>{let n=1;for(;n<400&&e[n]<t;)n++;return(n-1+(t-e[n-1])/(e[n]-e[n-1]))/400},c=(e,n)=>{let r=[];for(let e=0;e<n;e++)r.push(m*(1-Math.cos(e/n*.5*Math.PI)));for(let n=Math.ceil(m/(h/e));n*h/e<t-m-.001;n++)r.push(n*h/e);for(let e=n;e>=0;e--)r.push(t-m*(1-Math.cos(e/n*.5*Math.PI)));return r},l=c(In(5,n,2),In(8,n,3)),d=[],f=[];l.forEach((e,n)=>{let r=Math.min(e,t-e),i=r<m?Math.sqrt(Math.max(1-((m-r)/m)**2,0)):1;d.push(g(s(e))),f.push(n===0||n===l.length-1?0:m*i*(1+.08*u(e*40,1.3,2.9)))});let p=(e,t)=>{let n=l[e],r=Math.round(n/h)%2?1:-1;return 1-.16*(.5+.5*Math.cos(2*Math.PI*n/h))**10*(.3+.7*(.5+.5*Math.cos(t-r*1.1))**1.5)};Tn(r,d,f,In(18,n,8),a.ROOT,0,hn,(e,t)=>p(e,t)*(1+.04*u(l[e]*14,.7*Math.cos(t)+2.3,.7*Math.sin(t)+7.1))),$n(r,i,0,900),Qn(c(5,8).map(e=>g(s(e))),m,900,o)}let _=Z(J(p,d)),v=Z(dn(hn,_));for(let e=0;e<4;e++){let a=r.vertexCount,o=.1+.8*e/3+.05*(t()-.5),s=Z(q(Y(v,.6+.4*t()),Y(_,1.2*(t()-.5)+(e===0?-1:+(e===3)))));zn(r,g(o),s,m,.015+.02*t(),.0045+.0015*t(),2+e,t,n),$n(r,i,a,901+e)}let y=new Kn(.03),b=[18,7],x=[[.1,0,0,0],[-.1,0,0,0],[.3,0,0,.004],[-.3,0,0,.004],[0,.07,0,4e-4],[0,-.07,0,4e-4],[0,0,.05,.003]];nr.forEach((t,u)=>{let d=!!t.furl,f=Z([t.top[0]-er[0],0,t.top[2]-er[2]]),p=g(t.at),m=Z(q(hn,Y(Z([t.top[0]-p[0],0,t.top[2]-p[2]]),.4+.7*e()))),h=Array.from({length:12},e),{leaf:_,shape:v}=Jn(([e,n,r])=>{let i=rr(Z(t.dir),e,n),a=pn(gn(q(q(hn,[0,0,t.toward]),Y(f,.3)),i),i,.4*(h[0]-.5));return{from:p,rise:m,b:{base:t.top,dir:i,face:a,length:t.length*Math.exp(-r),ratio:t.ratio,arch:t.arch*(.9+.2*h[1]),droop:d?0:.15+.15*h[2],side:.12*(h[3]-.5),twist:.35*(h[4]-.5),cup:d?.05:.14+.1*h[5],fold:.06+.04*h[6],quilt:d?0:6e-4+3e-4*h[7],wave:d?.02:.05+.04*h[8],waves:2.5+1.5*h[9],phase:6.28*h[10],asym:.08*(h[11]-.5),furl:t.furl??0,veins:13,id:u}}},x,{margin:.02,bounds:tr,crowd:y,gap:.02,stalkGap:.015,samples:b}),S=r.vertexCount,C=Cn(r,v,In(d?36:90,n,8),Ln(d?20:22,n,6),a.LEAF_BIG);$n(r,i,S,u),Zn(v,u,o);let w=r.vertexCount,T=Math.max(14,Math.round(X(J(t.top,p))/.012)),E={rBase:d?.0072:.0085,rTop:d?.0055:.0062,segs:T,midrib:d?.4:.6,midribSegs:d?10:20,sheath:.6,sheathLen:.045},D=kn(v,_.from,m,E,u),O=n===1?D:kn(v,_.from,m,{...E,segs:In(T,n,4),midribSegs:In(E.midribSegs,n,3)},u),k=An(r,v,O,{sides:In(8,n,4),groove:.2},u,3/T);$n(r,i,w,1e3+u),Pn(r,c,l,u,v,C,O,k,D,{crown:er,plant:`tall`,young:d,with:t.with});let A=D.pts;if(Qn(A.slice(0,T+1),.007,1e3+u,o),Yn(y,v,A,b),d)s.push({a:A[Math.round(T*.3)],b:v.at(1,0),r:.03,solid:.015});else{let e=A[Math.round(T*.6)];s.push({a:A[Math.round(T*.25)],b:e,r:.035,solid:.02},{a:e,b:t.top,r:.035,solid:.02}),s.push({a:v.at(.12,0),b:v.at(.8,0),r:.85*v.H+.02,solid:0})}}),s.push({a:er,b:q(er,[0,.14,0]),r:.07,solid:.03}),Xn(r,i,o,.2,1.6);let S=r.finish();return S.motion=Fn(r.vertexCount,c,l),{mesh:S,obstacles:s}}let ar=[-.6,n,.06],or={5:3,10:9,11:8,12:9,14:9,18:16},sr={lo:[-.88,-.588,-.22],hi:[-.3,-.2,.4]};function cr(e,t){let n=new f(`plantSmall`),r=[],i=[],o=[],s=[],c=/* @__PURE__ */ new Float32Array(800);{let e=[],i=[],o=In(20,t,6);for(let t=0;t<=o;t++){let n=t/o;e.push(q(ar,[.002*Math.sin(3*n),-.03+.062*n,0]));let r=mn(.72,1,n);i.push(t===o?0:.0145*(1-.25*n)*Math.sqrt(Math.max(1-r*r,0))*(1+.06*u(n*5,3.3,1)))}Tn(n,e,i,In(16,t,8),a.ROOT,1,[1,0,0]),$n(n,r,0,900)}for(let i=0;i<3;i++){let a=n.vertexCount,o=1.6+i/2*2.4+.3*(e()-.5);zn(n,q(ar,[0,.004,0]),[Math.cos(o),0,Math.sin(o)],.012,.015+.035*e(),.0024+8e-4*e(),10+i,e,t),$n(n,r,a,901+i)}let l=[],d=Math.PI/180,p=new Kn(.012),m=[18,7],h=[[.12,0,0,0,0],[-.12,0,0,0,0],[.3,0,0,0,.001],[-.3,0,0,0,.001],[0,.06,0,0,5e-4],[0,-.06,0,0,5e-4],[0,0,.05,0,.002],[0,0,0,.25,5e-4],[0,0,0,-.25,5e-4]],g=[],_=[];for(let e=-3;e<=3;e++)for(let t of[-.15,0,.15])for(let n of[-.4,0,.4])g.push([.15*e,t,0,n,.004*Math.abs(.15*e)+.006*Math.abs(t)+.003*Math.abs(n)]);for(let e=-4;e<=4;e++)for(let t of[-.45,-.15,.15])for(let n of[-.4,0,.4])for(let r of[0,.15,.3])_.push([.3*e,t,r,n,.004*Math.abs(.3*e)+.006*Math.abs(t)+.003*Math.abs(n)+.003*r]);_.sort((e,t)=>e[4]-t[4]);for(let o=0;o<20;o++){let u=19-o,f=1-u/19,v=2.6+2.6*(u*.618034%1-.5)*(1.4-.6*f)+.25*(e()-.5),y=(84-34*f+6*(e()-.5))*d,b=y-(4+18*f*(.6+.4*e()))*d,x=Math.min(.14,(.063+.077*(1-f))*(.85+.3*e())),S=Math.min(.27,(.17+.085*f)*(.9+.2*e())),C=Array.from({length:12},e),{leaf:w,shape:T}=Jn(([e,t,n,r])=>{let i=Math.min(Math.max(v+e,1.25-.6*(1-f)),4.3+.4*(1-f)),a=Math.min(y+t,1.48),o=Math.min(b+1.3*t,1.4),s=[Math.cos(i),0,Math.sin(i)],c=q(ar,q(Y(s,.008+.007*f),[0,.006+.022*(1-f),0])),l=q(c,Y(q(Y(s,Math.cos(a)),[0,Math.sin(a),0]),x*Math.exp(-n))),d=Z(q(Y(s,Math.cos(o)),[0,Math.sin(o),0]));return{az:i,from:q(c,q(Y(s,-.008),[0,-.012,0])),rise:Z(q(hn,Y(s,.2+.8*f))),b:{base:l,dir:d,face:pn(gn(q(q(hn,Y(s,-.15)),[0,0,.3]),d),d,.5*(C[0]-.5)+r),length:S*Math.exp(-n),ratio:.33+.12*f+.1*C[1],arch:.35+.4*f+.15*C[2],droop:.1+.15*C[3],side:.2*(C[4]-.5),twist:.5*(C[5]-.5),cup:.12+.12*C[6],fold:.05+.05*C[7],quilt:8e-4,wave:.07+.07*C[8],waves:2+2*C[9],phase:6.28*C[10],asym:.1*(C[11]-.5),furl:0,veins:9,id:u,small:!0}}},h,{margin:.012,bounds:sr,crowd:p,gap:.009,stalkGap:.007,samples:m,wide:g,wider:f>.9?_:null}),E=n.vertexCount,D=Cn(n,T,In(24,Math.sqrt(t),12),Ln(12,t,6),a.LEAF_SMALL);$n(n,r,E,u),Zn(T,u,i);let O=n.vertexCount,k=Math.max(8,Math.round(X(J(w.b.base,w.from))/.008)),A={rBase:.0026+9e-4*f,rTop:.0021+6e-4*f,segs:k,midrib:.5,midribSegs:8,sheath:.3,sheathLen:.02},j=kn(T,w.from,w.rise,A,11+u),M=t===1?j:kn(T,w.from,w.rise,{...A,segs:In(k,t,4),midribSegs:In(8,t,3)},11+u),N=An(n,T,M,{sides:In(8,t,4),groove:.2},11+u,3/k);$n(n,r,O,1e3+u),Pn(n,s,c,o,T,D,M,N,j,{crown:ar,plant:`small`,young:!1,with:or[o]}),Qn(j.pts.slice(0,k+1),.003,1e3+u,i),Yn(p,T,j.pts,m),l.push({tip:T.at(.85,0),pts:qn(T,6,2)})}o.push({a:ar,b:q(ar,[0,.07,0]),r:.08,solid:.02});let v=q(ar,[0,.035,0]);for(let e=0;e<4;e++){let t=l.filter(t=>Math.floor((Math.atan2(t.tip[2]-v[2],t.tip[0]-v[0])+Math.PI)/(Math.PI/2))%4===e);if(!t.length)continue;let n=fn(v,Y(t.reduce((e,t)=>q(e,t.tip),[0,0,0]),1/t.length),.85),r=t.flatMap(e=>e.pts.map(e=>Un(e,v,n))).sort((e,t)=>e-t);o.push({a:v,b:n,r:Math.min(Math.max(r[Math.floor(.9*(r.length-1))],.03),.12),solid:0})}Xn(n,r,i,.12,.9);let y=n.finish();return y.motion=Fn(n.vertexCount,s,c),{mesh:y,obstacles:o}}function lr(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=ir(o(1511863939),o(4127),t),r=cr(o(5227),t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles]}}let ur=(e,t)=>`${t.lengths?`
fn scape_${e}_length(id: i32) -> f32 {
  // (A case each rather than an array indexed by id, which would be a copy of itself in each
  // invocation's private memory.)
  switch (clamp(id, 0i, ${t.lengths.length-1}i)) {
${t.lengths.slice(0,-1).map((e,t)=>`    case ${t}i: { return ${e.toFixed(3)}; }`).join(`
`)}
    default: { return ${t.lengths[t.lengths.length-1].toFixed(3)}; }
  }
}
`:``}
fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let u = clamp(attrs.x, 0.0, 1.0);
  let v = clamp(attrs.y, -1.0, 1.0);
  let av = abs(v);
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, ${t.salt}, 11));
  let px = ${t.length.toFixed(3)} / max(foot, 1e-6);
  // The outline's half-width here (as the mesh's, outlineOf and outline), so the veins keep their
  // true widths.
  let fid = round(attrs.z);
  let h1 = fract(fid * 0.618034 + 0.17);
  let h2 = fract(fid * 0.754877 + 0.31);
  let h3 = fract(fid * 0.56984 + 0.53);
  let wd = 0.3 + 0.12 * h1;
  var hw = sqrt(max(1.0 - pow(max(wd - u, 0.0) / wd, 2.0 + h2), 0.0));
  if (u > wd) {
    let t = (u - wd) / (1.0 - wd);
    hw = pow(max(1.0 - pow(t, 1.45 + 0.5 * h3), 0.0), 1.05) * (1.0 - (${t.small?`0.06 + 0.14 * h1`:`0.18 + 0.2 * h1`}) * smoothstep(0.62, 1.0, t));
  }
  // Across from the midrib in the blade's own length (its length 1).
  let x = av * hw * ${(t.ratio/2).toFixed(3)};
  // Where on the blade (world units along and across it, and a plane of its own).
  let len = ${t.lengths?`scape_${e}_length(id)`:t.length.toFixed(3)};
  let ch = vec3f(u * len, v * hw * ${(t.ratio/2).toFixed(3)} * len, f32(id) * 0.37 + ${(t.salt*5.1).toFixed(1)});
  // The midrib: drawn no narrower than about a pixel, fainter by as much, so it stays on the midrib.
  let midW = 0.005 + 0.009 * (1.0 - u);
  let midPx = max(midW, 0.9 / px);
  let midrib = (midW / midPx) * (1.0 - smoothstep(0.45 * midPx, midPx, x));
  // Lateral veins, out from the midrib and forwards along the margin (where the mesh is quilted).
  let left = select(0.0, 1.0, v < 0.0);
  let ph = ${t.veins.toFixed(1)} * (u - ${bn} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
  let dv = abs(fract(ph + 0.5) - 0.5);
  var lateral = (1.0 - smoothstep(0.025, 0.08, dv)) * smoothstep(0.03, 0.14, av) * (1.0 - smoothstep(0.8, 0.97, av)) * smoothstep(0.02, 0.1, u);
  lateral = mix(0.08, lateral, smoothstep(1.0, 2.5, 0.1 * px / ${t.veins.toFixed(1)}));
  // The fine net of veinlets between them (its cells warped, so the areoles are irregular).
  let q = ch * ${t.net.toFixed(1)};
  let cell = scape_cells3(q + 0.6 * vec3f(scape_noise3(q * 0.35), scape_noise3(q * 0.35 + vec3f(7.1)), scape_noise3(q * 0.35 + vec3f(13.7))));
  var net = 1.0 - smoothstep(0.015, 0.07, cell.y - cell.x);
  net = mix(0.15, net, smoothstep(8.0, 20.0, ${(1/t.net).toFixed(4)} / max(foot, 1e-6)));
  let vein = max(0.85 * midrib, 0.38 * lateral);

  let lit = scape_linear(vec3f(${t.tint}));
  let deep = scape_linear(vec3f(0.16, 0.36, 0.05));
  let pale = scape_linear(vec3f(0.6, 0.8, 0.28));
  var c = lit * (0.85 + 0.3 * rnd.x);
  c = mix(c, c * vec3f(1.1, 1.0, 0.75), rnd.y * 0.5);
  // Darker towards the base and the margins; a living leaf's faint mottling.
  c = mix(c, deep, 0.3 * (1.0 - smoothstep(0.0, 0.3, u)));
  c = mix(c, deep, 0.2 * smoothstep(0.7, 1.0, av));
  c *= 0.9 + 0.2 * scape_fbm3(ch * 35.0 + rnd * 10.0, 2);
  c = mix(c, pale, 0.7 * vein);
  c = mix(c, pale, 0.15 * net * (1.0 - vein));
  let young = id >= ${t.young};
  if (young) { c = mix(c, scape_linear(vec3f(0.58, 0.76, 0.2)), 0.55); }
  var rough = ${t.rough.toFixed(2)} + 0.06 * scape_noise3(ch * 20.0);
  var spec = 0.04;
  if (!front) {
    // Beneath: paler, matte, its veins standing out.
    c = mix(c, scape_linear(vec3f(0.52, 0.7, 0.32)), 0.45);
    rough = 0.6;
    spec = 0.025;
  }
  // Light through the blade: bright yellow-green, less through the veins and the thicker base.
  var trans = scape_linear(vec3f(0.45, 0.65, 0.12)) * (1.0 - 0.55 * vein) * (0.55 + 0.45 * smoothstep(0.0, 0.25, u)) * (1.0 - 0.15 * net);
  if (young) { trans *= 1.25; }
  // Fine relief: the blade's cells, faded below a few pixels (their slopes taken in its chart and
  // laid square to the normal).
  let k = ${t.bump.toFixed(1)};
  let e = 0.35 / k;
  let b0 = scape_noise3(ch * k);
  let g = vec3f(scape_noise3((ch + vec3f(e, 0.0, 0.0)) * k) - b0, scape_noise3((ch + vec3f(0.0, e, 0.0)) * k) - b0,
    scape_noise3((ch + vec3f(0.0, 0.0, e)) * k) - b0) / (e * k);
  let relief = 0.04 * smoothstep(2.0, 6.0, 1.0 / (k * max(foot, 1e-6)));
  let nn = normalize(n - (g - n * dot(n, g)) * relief);
  let ao = attrs.w * (1.0 - select(0.0, 0.2 * midrib, front));
  return ScapeMat(c, nn, rough, spec, trans, ao, vec3f(0.0));
}
`,dr=[ur(`leafBig`,{salt:3,length:.34,lengths:nr.map(e=>e.length),ratio:.46,veins:13,young:9,tint:`0.35, 0.62, 0.12`,net:280,bump:110,rough:.36}),ur(`leafSmall`,{salt:5,length:.19,ratio:.44,veins:9,young:99,tint:`0.38, 0.66, 0.13`,net:420,bump:180,rough:.4,small:!0}),`
fn scape_mat_stem(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, 7, 3));
  var c = scape_linear(vec3f(0.5, 0.7, 0.27)) * (0.9 + 0.2 * rnd.y);
  // Its sheathing foot: browner, darker (a short way up the small plant's short stems, ids 11 on).
  c = mix(scape_linear(vec3f(0.36, 0.38, 0.17)), c, smoothstep(0.0, select(0.05, 0.015, id >= 11), s));
  // Fine ridges along it (faded below a few pixels), and faint flecks: on its own chart (along it,
  // and round it), so they stay on it as it moves.
  let ch = vec3f(s + f32(id) * 1.37, 0.006 * cos(attrs.y), 0.006 * sin(attrs.y));
  var stria = 0.5 + 0.5 * sin(attrs.y * 9.0 + 3.0 * scape_noise3(ch * 40.0));
  stria = mix(0.5, stria, smoothstep(1.0, 3.0, 0.004 / max(foot, 1e-6)));
  c *= (0.93 + 0.12 * stria) * (0.94 + 0.12 * scape_noise3(vec3f(s * 60.0, f32(id) * 3.1, 0.5)));
  let trans = scape_linear(vec3f(0.4, 0.6, 0.15)) * 0.4;
  return ScapeMat(c, n, 0.4, 0.035, trans, attrs.w, vec3f(0.0));
}

fn scape_mat_root(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = attrs.z;
  var c = scape_linear(vec3f(0.55, 0.42, 0.26)) * (0.85 + 0.25 * scape_noise3(p * 90.0));
  if (id < 1.5) {
    // A crown: olive brown, ringed with the scars of old leaves.
    c = scape_linear(vec3f(0.38, 0.34, 0.18)) * (0.85 + 0.25 * scape_fbm3(p * 70.0, 3));
    var ring = smoothstep(0.8, 0.95, abs(fract(s / 0.016 + 0.3 * scape_noise3(p * 30.0)) * 2.0 - 1.0));
    ring = mix(0.2, ring, smoothstep(1.0, 3.0, 0.003 / max(foot, 1e-6)));
    c = mix(c, scape_linear(vec3f(0.2, 0.16, 0.08)), 0.6 * ring);
  }
  return ScapeMat(c, n, 0.7, 0.02, vec3f(0.0), attrs.w, vec3f(0.0));
}
`].join(``);var fr=/* @__PURE__ */ t({WGSL:()=>Vr,build:()=>Br});let Q=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],pr=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],$=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],mr=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],hr=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],gr=e=>Math.hypot(e[0],e[1],e[2]),_r=e=>$(e,1/(gr(e)||1)),vr=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},yr=.016,br={az:-1.02,foot:-.46,top:.06,off:.104},xr={r:.052,rIn:.044,tube:.037,cap:.054,slots:[.045,.39],band:[.205,.225],bars:10,fill:.56},Sr=[.115,.315],Cr={h:.432,r:.0095},wr=.525,Tr=.0087,Er={at:[-.34,-.545],base:.125,baseTop:.03,sponge:.101,spongeTop:.3,tube:.026,tubeTop:.56,air:.528},Dr={rate:9,radius:.0055};function Or(e,t,n){let i=r-n,a=Math.sqrt(Math.max(i*i-e*e,0));return[a*Math.cos(t),e,a*Math.sin(t)]}function kr(e){let t=gr(e);return[Math.asin(e[1]/t),Math.atan2(e[2],e[0]),r-t]}function Ar([e,t,n]){let i=r-n;return[i*Math.cos(e)*Math.cos(t),i*Math.sin(e),i*Math.cos(e)*Math.sin(t)]}function jr(e,t,n){let r=_r(t),i=_r(pr(n,$(r,mr(n,r))));return{o:e,u:r,a:i,b:hr(r,i)}}function Mr(e,t,n,r,i,a,o){let s=e.p,c=e=>[s[e*3],s[e*3+1],s[e*3+2]],l=hr(pr(c(n),c(t)),pr(c(r),c(t)));mr(l,o)>=0?e.quad(t,n,r,i,a):e.quad(t,i,r,n,a)}function Nr(e,t,n,r,i,a,o=null,s=null){let[c,l]=o??[0,2*Math.PI],u=o?r+1:r,d=[];for(let e=0;e+1<n.length;e++){let t=n[e+1][0]-n[e][0],r=n[e+1][1]-n[e][1],i=Math.hypot(t,r)||1;d.push([r/i,-t/i])}let f=(i,o)=>{let[d,f]=n[i],p=a(i,d,f),m=Q(t.o,$(t.u,f));if(d===0){let n=s?s(m,t.u):m;return e.vertex(n,p,s?null:$(t.u,o[1]<0?-1:1))}let h=[];for(let n=0;n<u;n++){let i=c+(l-c)*n/r,a=Q($(t.a,Math.cos(i)),$(t.b,Math.sin(i))),u=_r(Q($(a,o[0]),$(t.u,o[1]))),f=Q(m,$(a,d));h.push(s?e.vertex(s(f,u),p):e.vertex(f,p,u))}return h},p=(t,n)=>{for(let a=0;a<r;a++){let r=(a+1)%u;typeof t==`number`?e.tri(t,n[r],n[a],i):typeof n==`number`?e.tri(t[a],t[r],n,i):e.quad(t[a],t[r],n[r],n[a],i)}},m=null;n.forEach((e,t)=>{let n=d[t-1],r=d[t],i=null,a=null;if(n&&r&&!e[2]){let e=[n[0]+r[0],n[1]+r[1]],o=Math.hypot(e[0],e[1])||1;i=a=f(t,[e[0]/o,e[1]/o])}else n&&(i=f(t,n)),r&&(a=f(t,r));m!==null&&i!==null&&p(m,i),m=a})}function Pr(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function Fr(e,t,n,r,i,a,o,s){let c=t.length,l=t.map((e,n)=>_r(pr(t[Math.min(n+1,c-1)],t[Math.max(n-1,0)]))),u=_r(pr(s,$(l[0],mr(s,l[0])))),d=[],f=0;for(let i=0;i<c;i++){i&&(f+=gr(pr(t[i],t[i-1])),u=_r(pr(u,$(l[i],mr(u,l[i])))));let o=hr(l[i],u),s=[];for(let c=0;c<r;c++){let l=2*Math.PI*c/r,d=Q($(u,Math.cos(l)),$(o,Math.sin(l)));s.push(e.vertex(Q(t[i],$(d,n)),a(f),d))}d.push(s)}for(let t=0;t+1<c;t++)for(let n=0;n<r;n++)e.quad(d[t][n],d[t][(n+1)%r],d[t+1][(n+1)%r],d[t+1][n],i);if(o){let n=e.vertex(t[c-1],a(f),l[c-1]),o=d[c-1].map(n=>{let r=[e.p[n*3],e.p[n*3+1],e.p[n*3+2]];return e.vertex(r,a(f),_r(Q(l[c-1],$(_r(pr(r,t[c-1])),.35))))});for(let t=0;t<r;t++)e.tri(n,o[t],o[(t+1)%r],i)}}function Ir(e,t,n){return Pr(e.map(kr),t).map(([e,t,r])=>Ar([e,t,Math.max(r,n)]))}function Lr(){let{az:e,foot:t,top:n,off:i}=br,a=Or(t,e,0),o=Or(n,e,0),s=_r(pr(o,a)),c=$(Q(a,o),.5),l=_r(pr($(s,mr(c,s)),c)),u=e=>Sr.reduce((t,n)=>{let i=Q(e,$(s,n)),a=$(l,-1),o=mr(i,a),c=mr(i,i)-r*r;return t+(-o+Math.sqrt(o*o-c))/Sr.length},0),d=a;for(let e=0;e<4;e++)d=Q(d,$(l,i-u(d)));return jr(d,s,l)}function Rr(e){let t=new f(`heater`),n=Lr(),r=Math.max(14,Math.round(40*e)),i=e=>Q(n.o,$(n.u,e)),o=xr,s=e=>(t,n,r)=>[0,r,0,e];Nr(t,n,[[0,-.012],[.022,-.0095],[.036,-.004],[.046,.005],[.051,.016],[o.r,.028],[o.r,.045,!0],[o.rIn,.045,!0],[o.rIn,.035]],r,a.HEATER,s(.92));let[c,l]=o.band;Nr(t,n,[[o.rIn,c,!0],[o.r-.0025,c],[o.r,c+.0025],[o.r,l-.0025],[o.r-.0025,l],[o.rIn,l,!0],[o.rIn,c,!0]],r,a.HEATER,s(.9));let u=2*Math.PI/o.bars,d=.5*o.fill*u;for(let[e,r]of[[o.slots[0],c],[l,o.slots[1]]])for(let s=0;s<o.bars;s++){let c=(s+.5)*u,l=e=>Q($(n.a,Math.cos(e)),$(n.b,Math.sin(e))),f=e=>Q($(n.a,-Math.sin(e)),$(n.b,Math.cos(e))),p=[],m=[];for(let n=0;n<=3;n++){let a=c-d+2*d*n/3,s=n===0?-1:+(n===3),u=_r(Q(l(a),$(f(a),.75*s)));p.push([t.vertex(Q(i(e),$(l(a),o.r)),[0,e,0,.9],u),t.vertex(Q(i(r),$(l(a),o.r)),[0,r,0,.9],u)])}for(let e=0;e+1<p.length;e++)Mr(t,p[e][0],p[e+1][0],p[e+1][1],p[e][1],a.HEATER,l(c-d+2*d*(e+.5)/3));for(let n of[c-d,c+d])m.push([t.vertex(Q(i(e),$(l(n),o.rIn)),[0,e,0,.6],$(l(n),-1)),t.vertex(Q(i(r),$(l(n),o.rIn)),[0,r,0,.6],$(l(n),-1))]);Mr(t,m[0][0],m[1][0],m[1][1],m[0][1],a.HEATER,$(l(c),-1));for(let[n,s]of[[c-d,-1],[c+d,1]]){let c=$(f(n),s),u=_r(Q(c,$(l(n),.6))),d=[t.vertex(Q(i(e),$(l(n),o.rIn)),[0,e,0,.55],c),t.vertex(Q(i(e),$(l(n),o.r)),[0,e,0,.75],u),t.vertex(Q(i(r),$(l(n),o.r)),[0,r,0,.75],u),t.vertex(Q(i(r),$(l(n),o.rIn)),[0,r,0,.55],c)];Mr(t,d[0],d[1],d[2],d[3],a.HEATER,c)}}Nr(t,n,[[0,.03],[o.tube,.03,!0],[o.tube,.4]],r,a.HEATER,()=>[1,0,0,.4]),Nr(t,n,[[o.rIn,.39,!0],[o.cap,.39,!0],[o.cap,.394],[o.cap,.452],[.0525,.461],[.048,.467],[.04,.4705],[.022,.4725,!0],[.0175,.475],[.0165,.49],[.0145,.512],[.0128,.522],[.0105,wr,!0],[Tr,wr]],r,a.HEATER,s(.95)),Nr(t,jr(Q(i(Cr.h),$(n.a,o.cap-.0015)),n.a,n.u),[[Cr.r,-.003],[Cr.r,6e-4,!0],[.0085,.0021],[.0062,.0033],[.0033,.004],[0,.0042]],Math.max(10,Math.round(20*e)),a.HEATER_LAMP,(e,t)=>[t/Cr.r,0,0,1]);let p=Math.max(12,Math.round(32*e));for(let r of Sr){let s=o.r+6e-4,c=o.r+.0078,l=.011,u=[Math.PI-2.25,Math.PI+2.25],d=(e,t)=>[1,(t-s)/(c-s),0,.85];Nr(t,{...n,o:i(r)},[[s,-.011,!0],[c,-.011,!0],[c,l,!0],[s,l,!0],[s,-.011,!0]],Math.max(8,Math.round(18*e)),a.SUCTION,d,u);for(let[e,o]of[[u[0],-1],[u[1],1]]){let u=Q($(n.a,Math.cos(e)),$(n.b,Math.sin(e))),f=$(Q($(n.a,-Math.sin(e)),$(n.b,Math.cos(e))),o),p=[[s,-.011],[c,-.011],[c,l],[s,l]].map(([e,n])=>t.vertex(Q(i(r+n),$(u,e)),d(0,e),f));Mr(t,p[0],p[1],p[2],p[3],a.SUCTION,f)}let f=Q(i(r),$(n.a,-c));Nr(t,jr($(_r(f),.98425),$(_r(f),-1),n.u),[[0,0],[.047,0,!0],[.0466,.0024,!0],[.041,.006],[.032,.0108],[.0225,.0152],[.0148,.018],[.0106,.0194,!0],[.0086,.021],[.0086,.98425-gr(f)+.004]],p,a.SUCTION,(e,t)=>[0,t/.047,0,.7+.25*vr(.047,.03,t)])}let m=i(.513),h=kr(i(.595)),g=br.az;Fr(t,Ir([m,i(.555),Ar([h[0],h[1]-.01,.06]),Or(.3,g-.03,yr),Or(.56,g-.07,.045),Or(.78,g-.1,.022),Or(.866,g-.11,yr)],Math.max(4,Math.round(12*e)),yr),Tr,Math.max(6,Math.round(9*e)),a.HEATER,e=>[2,e,0,.9],!0,n.a);let _=[{a:i(-.012),b:i(.48),r:.115,solid:.064},{a:m,b:Or(.27,g-.025,yr),r:.063,solid:.013}];return{mesh:{...t.finish(),onGlass:!0},obstacles:_}}function zr(e){let t=new f(`filter`),i=Er,o=[i.at[0],n,i.at[1]],s=jr(o,[0,1,0],[-i.at[0],0,-i.at[1]]),c=Math.max(16,Math.round(48*e));Nr(t,s,[[0,-.012],[.118,-.012,!0],[.123,-.004],[i.base,.008],[i.base,.018],[.1225,.0255],[.117,i.baseTop-.001],[.11,i.baseTop,!0],[0,i.baseTop]],c,a.TUBE,(e,t,n)=>[2,n,0,n<.005?.55:.88]);let l=Math.max(10,Math.round(28*e)),p=[[i.sponge-.004,i.baseTop-.002],[i.sponge-.001,i.baseTop+.004]];for(let e=0;e<=l;e++)p.push([i.sponge,i.baseTop+.012+(i.spongeTop-i.baseTop-.026)*e/l]);p.push([i.sponge-.002,i.spongeTop-.006],[i.sponge-.009,i.spongeTop-5e-4],[.07,i.spongeTop],[.03,i.spongeTop]),Nr(t,s,p,Math.max(20,Math.round(64*e)),a.SPONGE,(e,t,n)=>[0,n-i.baseTop,0,t<.06?.75:.62+.33*vr(i.baseTop,i.baseTop+.08,n)],null,(e,t)=>{let r=e[1]-n,a=vr(i.baseTop,i.baseTop+.02,r)*(t[1]>.7?.5:1),o=.0028*d(e[0]*38,e[1]*38,e[2]*38,3)+.0018*u(e[0]*11+3.1,e[1]*7,e[2]*11);return Q(e,$(t,o*a))});let m=i.tube,h=m-.0055;Nr(t,s,[[0,i.spongeTop-.006],[.043,i.spongeTop-.006,!0],[.0445,i.spongeTop+.002],[.0445,i.spongeTop+.008],[.041,i.spongeTop+.0125],[.034,i.spongeTop+.0145,!0],[.032,i.spongeTop+.0145,!0],[.032,i.spongeTop+.026],[.0295,i.spongeTop+.029,!0],[m,i.spongeTop+.029,!0],[m,i.tubeTop-.004],[m-.0012,i.tubeTop-4e-4],[m-.003,i.tubeTop,!0],[h+.001,i.tubeTop,!0],[h,i.tubeTop-.0015],[h,i.tubeTop-.06,!0],[0,i.tubeTop-.06]],Math.max(14,Math.round(32*e)),a.TUBE,(e,t,n)=>e>=14?[1,n,0,.25+.5*vr(i.tubeTop-.05,i.tubeTop,n)]:[0,n,0,.9]);let g=[0,0,-1],_=Q(o,[0,i.air,0]);Fr(t,Pr([Q(_,$(g,m-.004)),Q(Q(_,$(g,m+.016)),[0,.004,0])],3),.0132,Math.max(8,Math.round(12*e)),a.TUBE,e=>[4,e,0,.85],!0,[0,1,0]);let v=Math.atan2(-Math.sqrt(r*r-i.at[0]*i.at[0]),i.at[0]),y=[Q(_,$(g,m+.004)),Q(Q(_,$(g,m+.045)),[0,.006,0]),Q(Q(_,$(g,.17)),[0,-.012,0]),Or(.02,v,.03),Or(.3,v-.03,yr),Or(.56,v-.07,.045),Or(.78,v-.09,.022),Or(.866,v-.095,yr)];Fr(t,Ir(y,Math.max(4,Math.round(12*e)),yr),.0108,Math.max(6,Math.round(9*e)),a.TUBE,e=>[3,e,0,.9],!0,[0,1,0]);let b=Ir(y,3,yr),x=b.findIndex(e=>e[1]>.27),S=[_,...b.slice(1,x<0?b.length:x+1)],C=[_],w=(e,t,n)=>{let r=pr(n,t),i=Math.min(Math.max(mr(pr(e,t),r)/mr(r,r),0),1);return gr(pr(e,Q(t,$(r,i))))};for(let e=1,t=0;e<S.length;e++)(e===S.length-1||S.slice(t+1,e+2).some(n=>w(n,S[t],S[e+1])>.004))&&(C.push(S[e]),t=e);let T=[{a:Q(o,[0,-.01,0]),b:Q(o,[0,i.spongeTop,0]),r:.158,solid:.108},{a:Q(o,[0,i.spongeTop,0]),b:Q(o,[0,i.tubeTop,0]),r:.08,solid:.03},...C.slice(1).map((e,t)=>({a:C[t],b:e,r:.064,solid:.014}))];return{mesh:{...t.finish(),onGlass:!0},obstacles:T,bubbles:{at:Q(o,[0,i.tubeTop-.01,0]),...Dr}}}function Br(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=Rr(t),r=zr(t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles],bubbles:r.bubbles}}let Vr=`
var<private> scapeHeaterLamp: f32 = 1.0;

fn scape_mat_heater(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let tube = attrs.x > 0.5 && attrs.x < 1.5;
  let cord = attrs.x > 1.5;
  m.albedo = select(select(vec3f(0.0135, 0.014, 0.0155), vec3f(0.021, 0.022, 0.024), tube), vec3f(0.0095, 0.0095, 0.01), cord);
  m.n = n;
  m.rough = select(select(0.38, 0.24, tube), 0.55, cord);
  m.spec = 0.045;
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}

fn scape_mat_heaterLamp(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  m.albedo = vec3f(0.45, 0.1, 0.005);
  m.n = n;
  m.rough = 0.12;
  m.spec = 0.05;
  m.ao = 1.0;
  m.glow = vec3f(1.0, 0.28, 0.02) * (0.35 + 1.5 * (1.0 - smoothstep(0.0, 0.85, attrs.x))) * scapeHeaterLamp;
  return m;
}

// The sponge: coarse open-cell foam, black, browned a little low down where the mulm settles. Its
// pores (~1.5 mm) round holes of many sizes (the cut passes through them at any depth), darkest at
// their middles, dimmer struts further in seen down them; between them the struts, palest where
// they meet; and here and there a larger void. Each faded to its mean where a pixel grows past it
// (the means measured). Matte, the struts with a faint sheen.
fn scape_mat_sponge(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let aa = max(foot, 1e-6);
  // (How much of the surface is strut here, how deep a hole, how much strut further in.)
  var strut = 0.09;
  var hole = 0.37;
  var deep = 0.22;
  for (var o = scapeZero; o < 3; o++) {
    let k = select(170.0, 55.0, o == 2);
    let seen = 1.0 - smoothstep(0.3 / k, 0.8 / k, aa);
    if (seen <= 0.0) { continue; }
    let c = scape_cells3(p * k + vec3f(f32(o) * 5.3));
    let e = c.y - c.x;
    if (o == 0) {
      let meet = 0.4 + 0.6 * (1.0 - smoothstep(0.02, 0.15 + aa * k, e));
      strut = mix(strut, smoothstep(0.58, 0.8, c.x) * meet * (0.3 + 0.7 * fract(c.z * 13.0)), seen);
      hole = mix(hole, 1.0 - smoothstep(0.3, 0.62, c.x), seen);
    } else if (o == 1) {
      deep = mix(deep, smoothstep(0.55, 0.78, c.x), seen);
    } else {
      // (A larger void: one coarse cell in five, its middle.)
      let big = select(0.0, smoothstep(0.1, 0.35, e), c.z > 0.8) * seen;
      hole = max(hole, big);
      strut *= 1.0 - big;
      deep *= 1.0 - 0.7 * big;
    }
  }
  let low = 1.0 - smoothstep(0.0, 0.09, attrs.y);
  let c = mix(vec3f(0.022, 0.022, 0.021), vec3f(0.036, 0.029, 0.021), 0.6 * low);
  m.albedo = c * ((1.0 - 0.85 * hole) * (1.0 + 0.6 * deep) + 1.6 * strut);
  m.n = n;
  // (Light caught in a hole stays there: no sheen off it.)
  m.rough = 0.9 - 0.25 * strut;
  m.spec = 0.025 * (1.0 - 0.9 * hole);
  m.ao = clamp(attrs.w, 0.0, 1.0) * (1.0 - 0.6 * hole);
  return m;
}

fn scape_mat_tube(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let part = u32(attrs.x + 0.5);
  m.albedo = vec3f(0.012, 0.0125, 0.0135) * select(select(1.0, 0.35, part == 1u), 1.4, part == 2u);
  m.n = n;
  m.rough = select(0.3, 0.52, part == 3u);
  m.spec = 0.045;
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}

// The cups: soft clear PVC, seen as a pale milky grey-green, clearer and thinner towards a cup's
// rim (more of what is behind it shows through). The clips: harder clear plastic round the black
// heater, seen as its dark through them. Both glossy.
fn scape_mat_suction(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let clip = attrs.x > 0.5;
  let rim = select(attrs.y, 1.0, clip);
  m.albedo = mix(vec3f(0.34, 0.39, 0.37), vec3f(0.22, 0.27, 0.26), rim) * select(1.0, 0.35, clip);
  m.n = n;
  m.rough = select(0.22, 0.12, clip);
  m.spec = 0.04;
  m.trans = vec3f(0.2, 0.25, 0.24) * (0.3 + 0.5 * rim);
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}
`,Hr=[[`wood`,Re],[`rocks`,Mt],[`plants`,ln],[`equipment`,fr]],Ur=Hr.map(([e])=>e);function Wr(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=e?.only;return Hr.filter(([e])=>!n||n.includes(e)).map(([e,n])=>({name:e,...n.build({detail:t})}))}Hr.map(([,e])=>e.WGSL);function Gr(e,t,n,r){let i=e.flatMap(e=>e.meshes),a=e.filter(e=>e.name!==`plants`).flatMap(e=>e.obstacles),o=Te(i,{rows:/* @__PURE__ */ new Float32Array(680)}),s=Me(o,i,void 0,{obstacles:a});return{data:o.data,width:o.width,height:o.height,map:m(i,t,n,r),obstacles:e.flatMap(e=>e.obstacles),bubbles:e.find(e=>e.bubbles)?.bubbles??null,parts:i.map(e=>[e.name,e.positions.length/3]),motion:{wgsl:Fe(_e(a,s.rest)),buffers:Pe(s),moving:s.moving,slotCount:s.slotCount,passes:s.passes,leafCount:s.leafCount,leaves:s.leaves,leafTips:s.leafTips}}}let Kr=[`wood`,`rocks`];function qr(e,t){let n=new Worker(new URL(
/* @vite-ignore */
new URL(`scapePieceWorker-B81kTOCN.js`,self.location.href).href,``+self.location.href),{type:`module`}),r=()=>{},i=new Promise(e=>r=e),a=new Promise((e,t)=>{n.onmessage=t=>{if(t.data===`started`)return r();n.terminate(),e(t.data)},n.onerror=e=>{n.terminate(),r(),t(Error(e.message||`the pieces worker failed`))}});return n.postMessage({detail:t,only:e}),{begun:i,made:a.catch(()=>null)}}self.onmessage=async e=>{let{n:t,extent:n,none:r,detail:i}=e.data,a=null;try{let e=qr(Kr,i);await e.begun,a=e.made}catch{}let o=Wr({detail:i,only:Ur.filter(e=>!Kr.includes(e))}),s=[...await a??Wr({detail:i,only:Kr}),...o];s.sort((e,t)=>Ur.indexOf(e.name)-Ur.indexOf(t.name));let c=Gr(s,t,n,r),l=/* @__PURE__ */ new Set([c.data.buffer,c.map.buffer,c.motion.leafTips.buffer]);for(let e of Object.values(c.motion.buffers))e.data&&l.add(e.data.buffer);self.postMessage(c,[...l])}})();