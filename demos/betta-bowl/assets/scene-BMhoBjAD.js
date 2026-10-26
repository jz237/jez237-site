import{i as e,l as t,n,t as r}from"./plantMotion-ByDdNSl-.js";import{a as i,c as a,i as o,l as s,n as c,r as l,s as u,t as d}from"./betta-Cv-kiqTL.js";var f=t({WGSL:()=>Te,build:()=>pe}),p=Math.PI*2,m=e=>e<0?0:e>1?1:e,h=(e,t,n)=>{let r=m((n-e)/(t-e));return r*r*(3-2*r)},g=e=>e-p*Math.round(e/p);function _(e,t,n){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,739982445);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}var v={e:0,nu:0,nv:0,pair:0,cell:0};function y(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=1e9,s=1e9,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0;for(let g=-1;g<=1;g++)for(let v=-1;v<=1;v++){let y=i+v,b=a+g,x=(y%n+n)%n,S=y+.06+.88*_(x,b,r),C=b+.06+.88*_(x,b,r+1013),w=S-e,T=C-t,E=w*w+T*T,D=x*7919+(b+4096)*131;E<o?(s=o,u=c,d=l,p=f,o=E,c=S,l=C,f=D,m=x,h=b):E<s&&(s=E,u=S,d=C,p=D)}let g=u-c,y=d-l,b=Math.hypot(g,y)||1;g/=b,y/=b,v.e=((c+u)*.5-e)*g+((l+d)*.5-t)*y,v.nu=g,v.nv=y,v.pair=_(Math.min(f,p),Math.max(f,p),r+77),v.cell=_(m,h,r+5)}var b={depth:0,shoulder:0,e:0,cell:0},x=new Float64Array(25),S=new Float64Array(25),C=new Int32Array(25);function w(e,t,n,r,i,a,o,s,c=1){let l=Math.floor(e),u=Math.floor(t),d=1e9,f=12;for(let i=-2,a=0;i<=2;i++)for(let o=-2;o<=2;o++,a++){let s=l+o,c=u+i,p=(s%n+n)%n,m=_(p,c,r),h=m*65536%1;if(x[a]=s+.06+.88*m,S[a]=c+.06+.88*h,C[a]=p*7919+(c+4096)*131,Math.abs(o)<2&&Math.abs(i)<2){let n=x[a]-e,r=S[a]-t,i=n*n+r*r;i<d&&([d,f]=[i,a])}}let p=x[f],m=S[f],g=C[f],v=0,y=0,w=1e9;for(let n=0;n<25;n++){if(n===f)continue;let l=x[n]-p,u=S[n]-m,d=Math.sqrt(l*l+u*u);l/=d,u/=d;let b=((p+x[n])*.5-e)*l+((m+S[n])*.5-t)*u,T=l/i,E=u/a,D=Math.sqrt(T*T+E*E),O=b/D;if(O<w&&(w=O),O>o*3.6*c)continue;let k=_(Math.min(g,C[n]),Math.max(g,C[n]),r+77),A=h(.35,.8,Math.abs(E)/D),j=(.5+.7*k)*(1-(1-s)*A),M=o*(.7+.6*(k*977%1))*(1-.15*A)*(1+(c-1)*A),N=O/M;N<1&&(v=Math.max(v,j*(1-h(0,1,N))**1.6)),y=Math.max(y,j*(1-h(M,M*3.2,O)))}return b.depth=v,b.shoulder=y,b.e=w,b.cell=_(g,5,r+5),b}function T(e,t,n,r,i){let o=e.length,c=(e,t)=>[2*t[0]-e[0],2*t[1]-e[1],2*t[2]-e[2]],l=[c(e[1],e[0]),...e,c(e[o-2],e[o-1])],u=[],d=(e,t)=>Math.sqrt(Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]))||1e-6;for(let e=0;e<o-1;e++){let[t,n,r,i]=[l[e],l[e+1],l[e+2],l[e+3]],a=d(t,n),o=a+d(n,r),s=o+d(r,i);for(let e=0;e<64;e++){let c=a+(o-a)*e/64,l=[0,0,0];for(let e=0;e<3;e++){let u=(a-c)/a*t[e]+c/a*n[e],d=(o-c)/(o-a)*n[e]+(c-a)/(o-a)*r[e],f=(s-c)/(s-o)*r[e]+(c-o)/(s-o)*i[e],p=(o-c)/o*u+c/o*d,m=(s-c)/(s-a)*d+(c-a)/(s-a)*f;l[e]=(o-c)/(o-a)*p+(c-a)/(o-a)*m}u.push(l)}}u.push(e[o-1]);let f=[0],m=()=>{for(let e=1;e<u.length;e++){let[t,n]=[u[e-1],u[e]];f[e]=f[e-1]+Math.hypot(n[0]-t[0],n[1]-t[1],n[2]-t[2])}};m();let g=f[u.length-1];for(let e=0;e<u.length;e++){let t=i*h(0,.12,f[e])*h(g,g-.12,f[e]);for(let n=0;n<3;n++)u[e][n]+=t*a(f[e]*2.7,r*.53,n*3.7)}m();let _=f[f.length-1],v=Math.max(3,Math.round(_/t)+1),y=_/(v-1),b=new Float64Array(v*3),x=new Float64Array(v*3),S=new Float64Array(v*3),C=new Float64Array(v*3),w=new Float64Array(v),T=0;for(let e=0;e<v;e++){let t=e*y;for(;T<u.length-2&&f[T+1]<t;)T++;let n=(t-f[T])/(f[T+1]-f[T]||1);for(let t=0;t<3;t++)b[e*3+t]=u[T][t]+(u[T+1][t]-u[T][t])*n}for(let e=0;e<v;e++){let t=Math.max(0,e-1),n=Math.min(v-1,e+1),r=[b[n*3]-b[t*3],b[n*3+1]-b[t*3+1],b[n*3+2]-b[t*3+2]],i=Math.hypot(r[0],r[1],r[2]);for(let t=0;t<3;t++)x[e*3+t]=r[t]/i}{let e=Math.abs(x[1])<.9?[0,1,0]:[1,0,0],t=e[0]*x[0]+e[1]*x[1]+e[2]*x[2],n=[e[0]-t*x[0],e[1]-t*x[1],e[2]-t*x[2]],r=Math.hypot(n[0],n[1],n[2]);for(let e=0;e<3;e++)S[e]=n[e]/r}for(let e=0;e<v-1;e++){let t=[b[e*3+3]-b[e*3],b[e*3+4]-b[e*3+1],b[e*3+5]-b[e*3+2]],n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=[S[e*3],S[e*3+1],S[e*3+2]],i=[x[e*3],x[e*3+1],x[e*3+2]],a=2/n*(t[0]*r[0]+t[1]*r[1]+t[2]*r[2]),o=2/n*(t[0]*i[0]+t[1]*i[1]+t[2]*i[2]),s=[r[0]-a*t[0],r[1]-a*t[1],r[2]-a*t[2]],c=[i[0]-o*t[0],i[1]-o*t[1],i[2]-o*t[2]],l=[x[e*3+3]-c[0],x[e*3+4]-c[1],x[e*3+5]-c[2]],u=2/(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]||1e-12)*(l[0]*s[0]+l[1]*s[1]+l[2]*s[2]);for(let t=0;t<3;t++)S[e*3+3+t]=s[t]-u*l[t]}for(let e=0;e<v;e++){let[t,n,r]=[x[e*3],x[e*3+1],x[e*3+2]],[i,a,o]=[S[e*3],S[e*3+1],S[e*3+2]];C[e*3]=n*o-r*a,C[e*3+1]=r*i-t*o,C[e*3+2]=t*a-n*i}w[0]=s(r)()*p;for(let e=1;e<v;e++)w[e]=w[e-1]+y*n*(1+.7*a(e*y*1.7,r*.37,.3));return{count:v,step:y,L:_,c:b,t:x,r:S,b:C,tau:w}}var E={cx:0,cy:0,cz:0,rx:0,ry:0,rz:0,bx:0,by:0,bz:0,tx:0,ty:0,tz:0,tau:0};function D(e,t){let n=t/e.step,r=Math.floor(n);r<0&&(r=0),r>e.count-2&&(r=e.count-2),n-=r;let i=r+1,a=1-n;return E.cx=e.c[r*3]*a+e.c[i*3]*n,E.cy=e.c[r*3+1]*a+e.c[i*3+1]*n,E.cz=e.c[r*3+2]*a+e.c[i*3+2]*n,E.rx=e.r[r*3]*a+e.r[i*3]*n,E.ry=e.r[r*3+1]*a+e.r[i*3+1]*n,E.rz=e.r[r*3+2]*a+e.r[i*3+2]*n,E.bx=e.b[r*3]*a+e.b[i*3]*n,E.by=e.b[r*3+1]*a+e.b[i*3+1]*n,E.bz=e.b[r*3+2]*a+e.b[i*3+2]*n,E.tx=e.t[r*3]*a+e.t[i*3]*n,E.ty=e.t[r*3+1]*a+e.t[i*3+1]*n,E.tz=e.t[r*3+2]*a+e.t[i*3+2]*n,E.tau=e.tau[r]*a+e.tau[i]*n,E}function O(e,t){let n=Math.max(3,Math.round(e.L/t)+1),r=e.L/(n-1),i=new Float64Array(n*3),a=new Float64Array(n*3),o=new Float64Array(n*3),s=new Float64Array(n*3),c=new Float64Array(n);for(let t=0;t<n;t++){let n=D(e,t*r),l=Math.hypot(n.tx,n.ty,n.tz),u=n.tx/l,d=n.ty/l,f=n.tz/l,p=n.rx*u+n.ry*d+n.rz*f,m=n.rx-p*u,h=n.ry-p*d,g=n.rz-p*f,_=Math.hypot(m,h,g);m/=_,h/=_,g/=_,i.set([n.cx,n.cy,n.cz],t*3),a.set([u,d,f],t*3),o.set([m,h,g],t*3),s.set([d*g-f*h,f*m-u*g,u*h-d*m],t*3),c[t]=n.tau}return{count:n,step:r,L:e.L,c:i,t:a,r:o,b:s,tau:c}}function k(e,t,n){if(e.caps[1]!==`broken`)return{rings:t.count,sOf:e=>e*t.step};let r=e.sBreak,i=r-.025,a=Math.floor(i/t.step),o=Math.round(r/t.step);return{rings:o+1,sOf:(i,s)=>{if(i<=a)return i*t.step;let c=(i-a)/(o-a),l=a*t.step;return l+c*(r+e.brk.rim(p*s/n)-l)}}}function A(e,t){let n=Math.min(Math.max(t/e.step,0),e.count-1.001),r=Math.floor(n);return e.c[r*3+1]+(e.c[r*3+4]-e.c[r*3+1])*(n-r)}function j(e,t){let n=1e9,r=0;for(let i=0;i<e.count;i++){let a=(e.c[i*3]-t[0])**2+(e.c[i*3+1]-t[1])**2+(e.c[i*3+2]-t[2])**2;a<n&&([n,r]=[a,i])}return r*e.step}var M=[{name:`arch`,pts:[[-.522,-.7,-.04],[-.514,-.632,-.048],[-.486,-.528,-.058],[-.425,-.443,-.07],[-.318,-.386,-.05],[-.178,-.344,-.122],[-.038,-.296,-.146],[.083,-.268,-.16],[.198,-.277,-.162],[.307,-.331,-.19],[.398,-.414,-.148],[.462,-.522,-.141],[.494,-.633,-.136],[.501,-.7,-.134]],radius:[[0,.092],[.07,.094],[.18,.08],[.3,.064],[.42,.07],[.56,.084],[.64,.088],[.74,.07],[.85,.08],[.93,.096],[1,.094]],around:176,ds:.0039,wiggle:.022,twist:1.7,flat:.28,lobe:.11,flute:.26,gnarl:.26,plates:17,plateLength:.26,depth:.19,width:.0055,knuckles:[[[-.36,-.396,-.085],.16,.08],[[.33,-.342,-.15],.18,.09],[[-.08,-.316,-.14],.1,.06],[[.05,-.286,-.15],-.08,.05]],knots:[[[-.27,-.333,-.03],.014,.04,.02,`pit`],[[0,-.222,-.12],.011,.032,.014,`boss`],[[.33,-.316,-.08],0,.06,.03,`burl`],[[.45,-.466,-.06],.01,.03,.012,`boss`],[[-.47,-.501,.03],.012,.035,.016,`pit`],[[.12,-.299,-.24],.012,.04,.016,`pit`],[[-.12,-.29,-.1],0,.06,.02,`burl`],[[-.36,-.366,-.05],0,.055,.026,`burl`],[[0,-.325,-.07],0,.05,.022,`burl`],[[.43,-.389,-.12],0,.06,.028,`burl`],[[.27,-.29,-.22],0,.045,.02,`burl`]],seed:11,caps:[`buried`,`buried`]},{name:`broken`,parent:0,pts:[[.115,-.268,-.163],[.143,-.2,-.232],[.183,-.12,-.268],[.232,-.042,-.284],[.27,.015,-.293]],radius:[[0,.058],[.3,.052],[.7,.045],[1,.04]],around:144,ds:.0035,wiggle:.006,twist:2.6,flat:.16,lobe:.08,flute:.2,gnarl:.17,plates:12,plateLength:.2,depth:.19,width:.00495,knuckles:[],knots:[[[.232,-.11,-.262],.009,.026,.01,`boss`]],fillet:.06,reach:[.12,.2],seed:23,caps:[`inside`,`broken`],breakAt:.04},{name:`left`,parent:0,pts:[[-.31,-.385,-.05],[-.305,-.457,-.02],[-.288,-.54,.055],[-.298,-.63,.11],[-.292,-.7,.13]],radius:[[0,.056],[.35,.049],[.75,.042],[1,.04]],around:144,ds:.0037,wiggle:.012,twist:-2.1,flat:.22,lobe:.09,flute:.22,gnarl:.2,plates:12,plateLength:.22,depth:.19,width:.00495,knuckles:[[[-.29,-.56,.07],.1,.05]],knots:[[[-.34,-.501,.1],.01,.03,.012,`pit`]],fillet:.07,reach:[.12,.22],seed:37,caps:[`inside`,`buried`]}];function N(e=1){let t=[];for(let[n,r]of M.entries()){let i={...r,index:n,pts:r.pts.map(e=>e.slice())};if(i.parent!==void 0){let e=t[i.parent].ref,n=j(e,i.pts[0]),r=D(e,n);i.pts[0]=[r.cx,r.cy,r.cz],i.junction=n,i.shrink=e=>.6+.4*h(0,.0525,e)}let a=i.ref=T(i.pts,i.ds,i.twist,i.seed,i.wiggle);i.roundScale=e**.75,i.alongScale=e**1.25,i.coarse=Math.max(1,1/i.roundScale),i.coarseAlong=Math.max(1,1/i.alongScale),i.refAround=r.around,i.around=e===1?r.around:Math.max(16,Math.round(r.around*i.roundScale)),i.spine=e===1?a:O(a,r.ds/i.alongScale),i.caps[1]===`broken`&&(i.brk=fe(i.seed+5),i.sBreak=a.L-i.breakAt),i.knuckleS=i.knuckles.map(([e,t,n])=>[j(a,e),t,n]),i.knotS=i.knots.map(([e,t,n,r,o],s)=>{let c=j(a,e),l=D(a,c),u=[e[0]-l.cx,e[1]-l.cy,e[2]-l.cz];return{s:c,phi:((Math.atan2(u[0]*l.bx+u[1]*l.by+u[2]*l.bz,u[0]*l.rx+u[1]*l.ry+u[2]*l.rz)-l.tau)%p+p)%p,eye:t,spread:n,height:r,kind:o,brk:o===`boss`?fe(i.seed*31+s):null}});let o=s(i.seed+101);i.flutes=Array.from({length:5},(e,t)=>({phi:t/5*p+o()*1,drift:(o()-.5)*1.5,width:.22+.3*o(),depth:i.flute*(.5+.8*o()),freq:1.5+2*o(),seed:i.seed+t*7.7})),t.push(i)}return t}var P={L:null,s:NaN,r:0};function ee(e,t,n){if(P.L===e&&P.s===n)return P.r;let r=n/t.L,i=e.radius,a=i[i.length-1][1];for(let e=0;e<i.length-1;e++)if(r<=i[e+1][0]){a=i[e][1]+(i[e+1][1]-i[e][1])*h(i[e][0],i[e+1][0],r);break}a*=1+.2*u(n*4+e.seed,.31,.77,2);for(let[t,r,i]of e.knuckleS)a*=1+r*Math.exp(-(((n-t)/i)**2));return Object.assign(P,{L:e,s:n,r:a}),a}var F={L:null,s:NaN,e:0,al:0,a3:0,b3:0,a4:0,b4:0,a5:0,b5:0,foot:1,fc:[0],fd:[0]};function te(e,t,n){if(F.s!==t||F.L!==e){let n=e.seed*1.37;F.s=t,F.L=e,F.e=e.flat*(.55+.45*a(t*2.3,n,.5)),F.al=e.seed+1.4*a(t*1.2,n+3.1,1.7),F.a3=e.lobe*(.6+.6*a(t*3.1,n,4.4)),F.b3=2.2*a(t*1.6,n,5.5),F.a4=e.lobe*.7*(.5+.7*a(t*3.7,n,6.6)),F.b4=2.2*a(t*1.9,n,7.7),F.a5=e.lobe*.5*(.4+.8*a(t*4.3,n,8.8)),F.b5=2.2*a(t*2.2,n,9.9),F.foot=1+.9*Math.exp(-(((A(e.ref,t)-d)/.07)**2)),F.fc=e.flutes.map(e=>e.phi+e.drift*t+.5*a(t*2.6,e.seed,.2)),F.fd=e.flutes.map(e=>e.depth*h(-.25,.35,a(t*e.freq,e.seed,3.3)))}let r=1+F.e*Math.cos(2*(n-F.al));r+=(F.a3*Math.cos(3*n+F.b3)+F.a4*Math.cos(4*n+F.b4)+F.a5*Math.cos(5*n+F.b5))*F.foot;for(let t=0;t<e.flutes.length;t++){let i=g(n-F.fc[t]);r-=F.fd[t]*Math.exp(-((i/e.flutes[t].width)**2))}let i=Math.max(.16-Math.abs(r-.6),0)/.16;return Math.max(r,.6)+i*i*.04}var ne={d:0,z:0};function re(e,t,n,r,i,o,s){let c=e.plates,l=e.plateLength,u=Math.sqrt(e.coarse),d=Math.sqrt(e.coarseAlong),f=m(2-e.coarse),_=e.width*u,v=d/u,y=Math.min(Math.max(s,.6*o),1.3*o),x=p*y/c,S=e.seed*.71,C=n/p*c+.55*a(r*1.1+S,i*1.1,t*1.5)+.2*a(r*2.7,i*2.7+S,t*5.3),T=t/l+.4*a(r*1.3+9.1,i*1.3,t*1.9+S),E=0,D=0;for(let r of e.knotS){let e=(t-r.s)/(r.kind===`burl`?1.4:2.6);if(Math.abs(e)>5*r.spread)continue;let i=g(n-r.phi)*o,s=i*i+e*e,c=Math.sqrt(s);if(c>5*r.spread)continue;let l=r.height*Math.exp(-((c/r.spread)**2))*(1+.2*a(i*55,e*55,r.s*9));if(r.kind===`burl`){E+=l,C+=.25*i*Math.exp(-((c/r.spread)**2))/x;continue}let d=(r.eye*1.6)**2,f=Math.exp(-((c/(2.6*r.spread))**2)),p=s>d?i*(1-d/s):0;C+=(p-i)*f/x;let m=Math.atan2(e,i);c*=1+.3*a(Math.cos(m)*2,Math.sin(m)*2,r.s*5),D=Math.max(D,1-h(r.eye*.9,r.eye*1.7,c));let _=.45*r.height*Math.exp(-(((c-r.eye)/(.35*r.eye*u))**2)),v;v=r.kind===`pit`?-.45*r.height*(1-h(0,r.eye*.8,c)):h(0,1,(r.eye-c)/(.3*r.eye))*(.8*r.height+r.brk.height(Math.min(c/(.7*r.eye),1),m)*(r.eye/.05)),E+=l+_+v}let O=h(.36,.66,a(r*.8+S,i*.8+2.2,t*2.2+4.1)),k=e.depth*y,A=.6+.4*a(r*2.1,i*2.1+S,t*7.3);w(C,T,c,e.seed,x,l,_,.2,v);let j=A*b.depth,M=.25*A*b.shoulder,N=(.26*b.cell+.1*a(C*1.7,T*2.3,S))*h(0,_*3,b.e),P=h(-.35,.2,a(r*1.6+5,i*1.6,t*3.1+S));if(P>0){let t=2.27/u,n=1.9/d;w(C*t+.5,T*n+.3,Math.round(c*t),e.seed+3,x/t,l/n,_*.8,.25,v),j=Math.max(j,.55*P*b.depth)}let ee=C*1.7+.35*a(r*3.1,i*3.1+S,t*6.1),F=.2*(.5+.5*Math.cos(p*ee))**(3/e.coarse)*A,te=f>0?.1*a(r*16+S,i*16,t*22)*f:0,re=(1-.5*O)*(1-D),I=(j+(M+N+F+te)*(1-.6*O))*re,ie=m(I/(.85*e.coarse**.075));return ne.z=e.coarse>1?ie**e.coarse**.13:ie,ne.d=I*k-E,ne}var I={cx:0,cy:0,cz:0,dx:0,dy:0,dz:0,r0:0,rb:0};function ie(e,t,n,r){let i=D(t,n),o=r+i.tau,s=Math.cos(o),c=Math.sin(o),l=s*i.rx+c*i.bx,d=s*i.ry+c*i.by,f=s*i.rz+c*i.bz,p=Math.sqrt(l*l+d*d+f*f);l/=p,d/=p,f/=p;let m=ee(e,t,n);e.shrink&&(m*=e.shrink(n));let h=m*te(e,n,r),g=i.cx+l*h,_=i.cy+d*h,v=i.cz+f*h;return h*=1+e.gnarl*(.6*u(g*3.4+1.7,_*3.4,v*3.4,2)+.45*a(Math.cos(r)*1.3+e.seed,Math.sin(r)*1.3,n*6.5)),I.cx=i.cx,I.cy=i.cy,I.cz=i.cz,I.dx=l,I.dy=d,I.dz=f,I.r0=m,I.rb=h,I}function ae(e,t,n){let r=e.around,i=e.rings,a=i*r,o={L:e,sp:t,N:r,rings:i,px:new Float64Array(a),py:new Float64Array(a),pz:new Float64Array(a),dx:new Float64Array(a),dy:new Float64Array(a),dz:new Float64Array(a),cx:new Float64Array(a),cy:new Float64Array(a),cz:new Float64Array(a),base:new Float64Array(a),rad:new Float64Array(a),s:new Float64Array(a),z:new Float64Array(a),ao:new Float64Array(a).fill(1),inside:new Uint8Array(a),nx:new Float64Array(a),ny:new Float64Array(a),nz:new Float64Array(a),b0:new Float64Array(a)},s=new Float64Array(r),c=new Float64Array(r);for(let e=0;e<r;e++)s[e]=Math.cos(p*e/r),c[e]=Math.sin(p*e/r);for(let a=0;a<i;a++)for(let i=0;i<r;i++){let l=a*r+i,u=n(a,i),d=p*i/r,f=ie(e,t,u,d),m=re(e,u,d,s[i],c[i],f.r0,f.rb),h=f.rb-m.d;o.px[l]=f.cx+f.dx*h,o.py[l]=f.cy+f.dy*h,o.pz[l]=f.cz+f.dz*h,o.dx[l]=f.dx,o.dy[l]=f.dy,o.dz[l]=f.dz,o.cx[l]=f.cx,o.cy[l]=f.cy,o.cz[l]=f.cz,o.base[l]=f.rb,o.rad[l]=h,o.s[l]=u,o.z[l]=m.z,o.b0[l]=u===a*t.step?f.rb:ie(e,t,a*t.step,d).rb}let l=2.5;for(let e=0;e<2;e++)for(let e=0;e<i;e++)for(let n=0;n<r;n++){let a=e*r+n,s=l*p*o.base[a]/r,c=l*t.step,u=o.base[a]-o.rad[a],d=u;for(let[t,l]of[[e*r+(n+1)%r,s],[e*r+(n+r-1)%r,s],[e>0?a-r:a,c],[e<i-1?a+r:a,c]])d=Math.min(d,o.base[t]-o.rad[t]+l);d<u&&u>0&&(o.z[a]*=Math.max(d,0)/u),o.rad[a]=o.base[a]-d}let u=new Float64Array(a),d=new Float64Array(a),f=new Float64Array(a);for(let e=0;e<a;e++)u[e]=o.cx[e]+o.dx[e]*o.base[e],d[e]=o.cy[e]+o.dy[e]*o.base[e],f[e]=o.cz[e]+o.dz[e]*o.base[e];o.bnx=new Float64Array(a),o.bny=new Float64Array(a),o.bnz=new Float64Array(a),ge(o,u,d,f,o.bnx,o.bny,o.bnz);for(let t=0;t<a;t++){let n=e.sBreak===void 0?0:h(e.sBreak-.045,e.sBreak-.02,o.s[t]),r=o.bnx[t]+(o.dx[t]-o.bnx[t])*n,i=o.bny[t]+(o.dy[t]-o.bny[t])*n,a=o.bnz[t]+(o.dz[t]-o.bnz[t])*n,s=Math.sqrt(r*r+i*i+a*a)||1;o.bnx[t]=r/=s,o.bny[t]=i/=s,o.bnz[t]=a/=s;let c=o.base[t]-o.rad[t];o.px[t]=u[t]-r*c,o.py[t]=d[t]-i*c,o.pz[t]=f[t]-a*c}return o.bs=o.base.slice(),o.r0=o.rad.slice(),o}var oe={i:0,jf:0};function se(e,t,n,r,i,a){let{sp:o,N:s}=e,c=Math.max(1,Math.floor((a-i)/20)),l=1e9,u=i;for(let e=i;e<=a;e+=c){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}for(let e=Math.max(i,u-c),s=Math.min(a,u+c);e<=s;e++){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}let d=(t-o.c[u*3])*o.t[u*3]+(n-o.c[u*3+1])*o.t[u*3+1]+(r-o.c[u*3+2])*o.t[u*3+2],f=u+d/o.step,m=Math.min(Math.max(f,i),a),h=Math.min(Math.floor(m),a-1),g=m-h,_=h+1,v=1-g,y=e=>o.c[h*3+e]*v+o.c[_*3+e]*g,b=t-y(0),x=n-y(1),S=r-y(2),C=b*(o.r[h*3]*v+o.r[_*3]*g)+x*(o.r[h*3+1]*v+o.r[_*3+1]*g)+S*(o.r[h*3+2]*v+o.r[_*3+2]*g),w=b*(o.b[h*3]*v+o.b[_*3]*g)+x*(o.b[h*3+1]*v+o.b[_*3+1]*g)+S*(o.b[h*3+2]*v+o.b[_*3+2]*g),T=(Math.atan2(w,C)-(o.tau[h]*v+o.tau[_]*g))/p*s;T=(T%s+s)%s;let E=Math.floor(T),D=T-E,O=(E+1)%s;oe.i=g<.5?h:_,oe.jf=T;let k=(e.b0[h*s+E]*(1-D)+e.b0[h*s+O]*D)*v+(e.b0[_*s+E]*(1-D)+e.b0[_*s+O]*D)*g,A=Math.sqrt(C*C+w*w)-k,j=Math.max(i-f,f-a)*o.step;return j<=0?A:A>0?Math.sqrt(A*A+j*j):j}var ce=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},le=[0,0,0];function ue(e,t,n,r,i){let a=e.sp,o=n-a.c[t*3],s=r-a.c[t*3+1],c=i-a.c[t*3+2],l=o*a.t[t*3]+s*a.t[t*3+1]+c*a.t[t*3+2];o-=l*a.t[t*3],s-=l*a.t[t*3+1],c-=l*a.t[t*3+2];let u=Math.sqrt(o*o+s*s+c*c)||1;return le[0]=o/u,le[1]=s/u,le[2]=c/u,le}function de(e,t,n,r,i,o,s,c,l){let{N:u,rings:d}=e,f=e=>n*(1-h(l[0],l[1],e));for(let n=0;n<d*u;n++){if(!o(n))continue;let l=e.bs[n],m=e.cx[n]+e.dx[n]*l,g=e.cy[n]+e.dy[n]*l,_=e.cz[n]+e.dz[n]*l,v=se(t,m,g,_,r,i),y=oe.i,b=f(e===c?e.s[n]:y*t.sp.step);if(b<1e-4||v>=b)continue;let x=ue(t,y,m,g,_),S=1-h(0,b,v),C=e.dx[n]+x[0]*S,w=e.dy[n]+x[1]*S,T=e.dz[n]+x[2]*S,E=Math.sqrt(C*C+w*w+T*T)||1;C/=E,w/=E,T/=E;let D=Math.floor(n/u),O=Math.max(10,Math.round(50*e.L.alongScale)),k=Math.max(0,D-O),A=Math.min(d-1,D+O),j={a:0,b:0,k:b,ia:0,ib:0},M=n=>{let a=m+C*n,o=g+w*n,s=_+T*n;return j.a=se(e,a,o,s,k,A),j.ia=oe.i,j.b=se(t,a,o,s,r,i),j.ib=oe.i,j.k=Math.max(f(e===c?j.ia*e.sp.step:j.ib*t.sp.step),1e-4),ce(j.a,j.b,j.k)},N=0,P=2*b,ee=M(P)<0,F=1;if(!ee){for(let e=0;e<14;e++){let e=(N+P)*.5;M(e)<0?N=e:P=e}M((N+P)*.5),F=(j.a-j.b)/j.k,F>.97&&(ee=!0)}if(ee){e.inside[n]=1;let t=e.r0[n]-1.5*s;e.px[n]=e.cx[n]+e.dx[n]*t,e.py[n]=e.cy[n]+e.dy[n]*t,e.pz[n]=e.cz[n]+e.dz[n]*t,e.rad[n]=t;continue}let te=(N+P)*.5,ne=m+C*te,re=g+w*te,I=_+T*te,ie=Math.max(j.k-Math.abs(j.a-j.b),0)/j.k,ae=j.a<j.b?1-ie/2:ie/2,le=[e.bnx[n],e.bny[n],e.bnz[n]],de=ue(t,j.ib,ne,re,I),fe=ae*le[0]+(1-ae)*de[0],pe=ae*le[1]+(1-ae)*de[1],me=ae*le[2]+(1-ae)*de[2],he=Math.sqrt(fe*fe+pe*pe+me*me)||1;fe/=he,pe/=he,me/=he;let ge=.55+.45*h(.02,.2,Math.abs(F)),_e=e===c?0:.002*Math.cos(p*2*F)*(1-Math.abs(F))*(.7+.6*a(ne*60,re*60,I*60)),ve=(l-e.r0[n])*ge-_e+s*h(-.05,.3,F);e.z[n]*=ge,e.px[n]=ne-fe*ve,e.py[n]=re-pe*ve,e.pz[n]=I-me*ve;let ye=(ne-e.cx[n])*e.dx[n]+(re-e.cy[n])*e.dy[n]+(I-e.cz[n])*e.dz[n];e.base[n]=ye,e.rad[n]=ye-ve}}function fe(e){let t=s(e),n=Array.from({length:5},(e,n)=>({phi:n/5*p+(t()-.5)*.9,w:.22+.45*t(),h:.008+.03*t()*t()+(n===1?.018:0),t:.55+.3*t()})),r=t()*p,i=t=>{let i=.008*Math.cos(t-r)+.003*a(Math.cos(t)*3,Math.sin(t)*3,e);for(let e of n){let n=Math.abs(g(t-e.phi))/e.w;n<1&&(i=Math.max(i,e.h*(1-n)**1.4+.008*Math.cos(t-r)))}return i+.0025*Math.abs(a(Math.cos(t)*11,Math.sin(t)*11,e+3))};return{rim:i,height:(t,o)=>{let s=Math.cos(o),c=Math.sin(o);y(t*4.5+.3*a(s*2,c*2,e),o/p*16,1e6,e+7);let l=(v.cell-.5)*.011*h(0,.4,v.e+.08)*h(.08,.35,t),u=.004*Math.cos(o-r)*t-.003+l+.002*a(s*t*20,c*t*20,e+1),d=h(.86,1,t);for(let e of n)Math.abs(g(o-e.phi))<e.w&&(d=Math.max(d,h(e.t,e.t+.12,t)));return u+(i(o)-u)*d}}}function pe(e={detail:1}){let t=N(Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1),n=[];for(let e of t){let{rings:t,sOf:r}=k(e,e.spine,e.around);e.rings=t,n.push(ae(e,e.spine,r))}for(let[e,r]of t.entries()){if(r.parent===void 0)continue;let t=n[r.parent],i=n[e],a=r.junction,o=Math.max(0,Math.floor((a-.3)/t.sp.step)),s=Math.min(t.rings-1,Math.ceil((a+.3)/t.sp.step)),c=Math.min(i.rings-1,Math.ceil(.35/i.sp.step)),[l,u,d]=[i.sp.c[0],i.sp.c[1],i.sp.c[2]],f=.026;de(i,t,r.fillet,o,s,e=>i.s[e]<=r.reach[1],f,i,r.reach),de(t,i,r.fillet,0,c,e=>(t.px[e]-l)**2+(t.py[e]-u)**2+(t.pz[e]-d)**2<.26*.26,f,i,r.reach)}for(let e of n)he(e);_e(n);let r=new i(`driftwood`);for(let e of n)ye(r,e);let a=[];for(let e of n)xe(e,a);return{meshes:[r.finish()],obstacles:a}}function me(e){let t=e.L;if(t.spine===t.ref)return(t,n)=>e.bs[t*e.N+n];let n=t.refAround,{sOf:r}=k(t,t.ref,n);return(e,i)=>ie(t,t.ref,r(e,i),p*i/n).rb}function he(e){ge(e,e.px,e.py,e.pz,e.nx,e.ny,e.nz)}function ge(e,t,n,r,i,a,o){let{N:s,rings:c}=e;for(let l=0;l<c;l++)for(let u=0;u<s;u++){let d=l*s+u,f=l*s+(u+1)%s,p=l*s+(u-1+s)%s,m=Math.min(c-1,l+1)*s+u,h=Math.max(0,l-1)*s+u,g=t[f]-t[p],_=n[f]-n[p],v=r[f]-r[p],y=t[m]-t[h],b=n[m]-n[h],x=r[m]-r[h],S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w);T>1e-12||([S,C,w,T]=[e.dx[d],e.dy[d],e.dz[d],1]),i[d]=S/T,a[d]=C/T,o[d]=w/T}}function _e(e){let t=.012,n=e.map(e=>{let n=[],r=e.s[(e.rings-1)*e.N];for(let i=0;i<=r;i+=t){let t=D(e.sp,i);n.push([t.cx,t.cy,t.cz,ee(e.L,e.sp,i)*(e.L.shrink?e.L.shrink(i):1)])}return n}),r=n.map(e=>{let t=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let[n,r,i,a]of e)for(let[e,o]of[n,r,i].entries())t[e]=Math.min(t[e],o-6*a),t[e+3]=Math.max(t[e+3],o+6*a);return t}),i=n.map(e=>Float64Array.from(e.flat()));for(let[a,o]of e.entries()){let{N:e,rings:s,L:c}=o,l=e=>Math.max(1,Math.round(e*c.alongScale)),u=e=>Math.max(1,Math.round(e*c.roundScale)),f=ve(o.rad,s,e,l(2),u(4)),p=ve(o.base,s,e,l(9),u(14));for(let l=0;l<s*e;l++){let e=o.base[l]||.07,s=Math.max(0,f[l]-o.rad[l])/(c.depth*.6*e),u=Math.max(0,p[l]-o.base[l])/(.1*e),g=(1-.55*m(s))*(1-.35*m(u))*(1-.25*o.z[l]),_=o.px[l],v=o.py[l],y=o.pz[l],b=o.nx[l],x=o.ny[l],S=o.nz[l],C=v-d;g*=.35+.65*h(-.01,.07,C),g*=1-.45*Math.max(0,-x)*Math.exp(-Math.max(C,0)/.12);let w=0;for(let e=0;e<n.length;e++){let n=r[e],o=i[e];if(!(e===a||_<n[0]||v<n[1]||y<n[2]||_>n[3]||v>n[4]||y>n[5]))for(let e=0;e<o.length;e+=4){let n=o[e+3],r=o[e]-_,i=o[e+1]-v,a=o[e+2]-y,s=r*r+i*i+a*a;if(s>36*n*n)continue;let c=Math.sqrt(s),l=(r*b+i*x+a*S)/c;l<=0||(w+=n*n/Math.max(s,n*n)*l*(t/(2*n)))}}g*=1-Math.min(.6,.75*w),o.inside[l]&&(g*=.3),o.ao[l]=Math.min(1,Math.max(.03,g))}}}function ve(e,t,n,r,i){let a=new Float64Array(t*n),o=new Float64Array(t*n);for(let r=0;r<t;r++){let t=0;for(let a=-i;a<=i;a++)t+=e[r*n+(a+n)%n];for(let o=0;o<n;o++)a[r*n+o]=t/(2*i+1),t+=e[r*n+(o+i+1)%n]-e[r*n+(o-i+n)%n]}for(let e=0;e<n;e++)for(let i=0;i<t;i++){let s=0,c=0;for(let o=Math.max(0,i-r);o<=Math.min(t-1,i+r);o++)s+=a[o*n+e],c++;o[i*n+e]=s/c}return o}function ye(e,t){let{N:n,rings:r,L:i}=t,a=e.vertexCount,s=2*p*i.index,c=(e,t)=>e*n+(t%n+n)%n;for(let a=0;a<r;a++)for(let r=0;r<=n;r++){let o=c(a,r),l=t.s[o]+(i.junction??0);e.vertex([t.px[o],t.py[o],t.pz[o]],[l,p*r/n+s,t.z[o],t.ao[o]],[t.nx[o],t.ny[o],t.nz[o]])}let l=n+1,u=(e,n)=>{let i=c(Math.min(Math.max(e,0),r-1),n);return t.rad[i]-t.base[i]};for(let t=0;t<r-1;t++)for(let r=0;r<n;r++){let n=a+t*l+r;Math.abs(u(t-1,r-1)-2*u(t,r)+u(t+1,r+1))+Math.abs(u(t,r)-2*u(t+1,r+1)+u(t+2,r+2))<=Math.abs(u(t-1,r+2)-2*u(t,r+1)+u(t+1,r))+Math.abs(u(t,r+1)-2*u(t+1,r)+u(t+2,r-1))?e.quad(n,n+1,n+l+1,n+l,o.BARK):e.quad(n+1,n+l+1,n+l,n,o.BARK)}for(let[c,u]of i.caps.entries()){if(u===`inside`)continue;let d=c?r-1:0;if(u===`buried`){let r=t.sp,u=t.s[d*n],f=D(r,u),p=c?1:-1,m=t.base[d*n],h=e.vertex([f.cx+p*f.tx*m*.4,f.cy+p*f.ty*m*.4,f.cz+p*f.tz*m*.4],[u+(i.junction??0),s,0,.1],[p*f.tx,p*f.ty,p*f.tz]);for(let t=0;t<n;t++){let n=a+d*l+t,r=n+1;c?e.tri(n,r,h,o.BARK):e.tri(r,n,h,o.BARK)}}else be(e,t)}}function be(e,t){let{N:n,rings:r,L:i,sp:a}=t,s=Math.max(6,Math.round(22*i.roundScale)),c=r-1,l=0;for(let e=0;e<n;e++)l+=t.rad[c*n+e];l/=n;let u=[];for(let r=0;r<=s;r++){let o=1-r/s,d=[];for(let u=0;u<n;u++){let f=c*n+u,m=p*u/n,g;if(r===0)g=[t.px[f],t.py[f],t.pz[f]];else{let e=D(a,i.sBreak+i.brk.height(o,m)),n=m+e.tau,s=Math.cos(n),c=Math.sin(n),l=t.rad[f]*o*(r===1?.985:1);g=[e.cx+(s*e.rx+c*e.bx)*l,e.cy+(s*e.ry+c*e.by)*l,e.cz+(s*e.rz+c*e.bz)*l]}let _=(.55+.45*h(0,.6,1-o))*(r===0?.8:1);if(d.push(e.vertex(g,[Math.cos(m)*o*l,Math.sin(m)*o*l,0,_])),r===s)break}u.push(d)}for(let t=0;t<s;t++)for(let r=0;r<n;r++){let i=u[t][r],a=u[t][(r+1)%n];t===s-1?e.tri(i,a,u[s][0],o.WOOD_END):e.quad(i,a,u[t+1][(r+1)%n],u[t+1][r],o.WOOD_END)}}function xe(e,t){let n=e.L.ref,r=e.L.refAround,{rings:i,sOf:a}=k(e.L,n,r),o=me(e),s=a(i-1,0),c=Math.max(1,Math.round(s/.1));for(let a=0;a<c;a++){let l=a/c*s,u=(a+1)/c*s,d=D(n,l),f=[d.cx,d.cy,d.cz],p=D(n,u),m=[p.cx,p.cy,p.cz];if(Math.max(f[1],m[1])<-.6||e.L.parent!==void 0&&u<.05)continue;let h=0;for(let e=Math.floor(l/n.step);e<=Math.min(i-1,Math.ceil(u/n.step));e++)for(let t=0;t<r;t+=4)h=Math.max(h,o(e,t));let g=Math.round(h*.9*1e3)/1e3;t.push({a:f.map(e=>Math.round(e*1e3)/1e3),b:m.map(e=>Math.round(e*1e3)/1e3),r:Math.round((g+.05)*1e3)/1e3,solid:g})}}function Se(e){let t=e=>Math.abs(e)<5e-6?`0.0`:e.toFixed(5),n=e=>`vec3f(${t(e[0])}, ${t(e[1])}, ${t(e[2])})`,r=``;for(let[i,a]of e.entries()){let e=a.spine,o=a.junction??0,s=Math.max(2,Math.ceil(e.L/.06)),c=[];for(let t=0;t<=s;t++){let n=D(e,t/s*e.L),r=Math.hypot(n.tx,n.ty,n.tz);c.push([o+t/s*e.L,[n.cx,n.cy,n.cz],[n.tx/r,n.ty/r,n.tz/r]])}r+=`fn scape_wood_axis${i}(s: f32) -> ScapeWoodAxis {\n`;for(let e=0;e<s;e++){let[i,o,l]=c[e],[u,d,f]=c[e+1],p=`scape_wood_lerp(${n(o)}, ${n(l)}, ${n(d)}, ${n(f)}, ${t(a.twist)}, clamp((s - ${t(i)}) * ${t(1/(u-i))}, 0.0, 1.0))`;r+=e<s-1?`  if (s < ${t(u)}) {\n    return ${p};\n  }\n`:`  return ${p};\n`}r+=`}

`}r+=`fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {
`;for(let t=1;t<e.length;t++)r+=`  if (limb == ${t}) {\n    return scape_wood_axis${t}(along);\n  }\n`;return r+`  return scape_wood_axis0(along);
}
`}function Ce(e){let t=e.find(e=>e.caps[1]===`broken`).spine,n=D(t,t.L),r=Math.hypot(n.tx,n.ty,n.tz);return`vec3f(${(n.tx/r).toFixed(5)}, ${(n.ty/r).toFixed(5)}, ${(n.tz/r).toFixed(5)})`}var we=N(),Te=`
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

${Se(we)}
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
  let axis = ${Ce(we)};
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
`,Ee=t({WGSL:()=>$e,build:()=>Ye}),De=[{at:[-.4,.32],size:[.24,.15,.19],sink:.35,yaw:.3,lean:[.04,-.06],freq:52,seed:11,exp:[2.1,2.3],taper:.04,ends:[[1.12,.88],[.55,1.45],[1.05,.95]],lumps:.06,planes:[[.25,1,.45,.66,.06],[.95,.2,-.1,.72,.06],[-.3,.5,-.8,.78,.07]],facets:2,dents:[[-.6,.35,.7,.35,.04],[.1,.9,-.4,.3,.025]],cracks:[[.25,.8,.5,.3,.28,.6],{from:0,at:-.25,turn:2.4,length:.2,depth:.6}],pits:.22,bedding:.7,layers:[.3,.9,-.2]},{at:[.17,.24],size:[.17,.085,.14],sink:.3,yaw:-.5,lean:[-.05,.05],freq:36,seed:23,exp:[2.2,2.4],taper:.05,ends:[[1.1,.9],[.42,1.58],[.92,1.08]],lumps:.05,planes:[[-.35,1,.3,.62,.06],[-.9,.2,.35,.78,.06]],facets:2,dents:[[.6,.5,.6,.4,.035]],cracks:[[.1,.8,.55,1,.55,.6]],pits:.5,bedding:.3,layers:[.9,.3,.2]},{at:[.408,.041],size:[.15,.075,.12],sink:.36,yaw:.9,lean:[.08,0],freq:32,seed:37,exp:[2.2,2.4],taper:0,ends:[[1,.88],[.4,1.6],[.95,1.05]],lumps:.04,planes:[[.35,1,.45,.62,.06],[.2,.3,.95,.75,.08]],facets:2,dents:[[-.5,.6,.6,.35,.04]],cracks:[[.5,.55,.65,1.3,.3,.8],{from:0,at:.2,turn:.7,length:.12,depth:.5}],pits:.9,bedding:0,layers:[0,1,0]},{at:[.62,.12],size:[.09,.05,.08],sink:.36,yaw:-.3,lean:[.02,.04],freq:20,seed:41,exp:[2,2.1],taper:0,ends:[[1,.95],[.46,1.54],[1,1]],lumps:.05,planes:[[.3,1,-.3,.66,.07]],facets:1,dents:[[.5,.7,.4,.4,.03]],cracks:[[.2,.7,.7,2.4,.35,.5]],pits:.3,bedding:.6,layers:[.2,.95,.3]}],Oe={a:[.482,-.64,-.139],b:[.432,-.45,-.14],r:.09},L=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],ke=e=>Math.hypot(e[0],e[1],e[2]),R=e=>{let t=ke(e)||1;return[e[0]/t,e[1]/t,e[2]/t]},Ae=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],z=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},je=e=>Math.min(Math.max(e,0),1);function Me({a:e,b:t,r:n},r,i,a){let o=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],s=je(((r-e[0])*o[0]+(i-e[1])*o[1]+(a-e[2])*o[2])/L(o,o));return Math.hypot(r-e[0]-o[0]*s,i-e[1]-o[1]*s,a-e[2]-o[2]*s)-n}function Ne(e,t,n,r){let i=Math.imul(e,668265261)^Math.imul(t,374761393)^Math.imul(n,2654435761)^Math.imul(r,2246822519);return i=Math.imul(i^i>>>15,2246822507),i=Math.imul(i^i>>>13,3266489909),((i^i>>>16)>>>0)/4294967296}function Pe(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=9,s=9,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=r+f,m=i+d,h=a+u,g=p+Ne(p,m,h,1)-e,_=m+Ne(p,m,h,2)-t,v=h+Ne(p,m,h,3)-n,y=g*g+_*_+v*v;y<o?(s=o,o=y,c=Ne(p,m,h,4),l=Ne(p,m,h,5)):y<s&&(s=y)}return[Math.sqrt(o),Math.sqrt(s),c,l]}function Fe(e){let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(R),r=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=n.slice(),a=(e,t,n)=>R([e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]),o=new Map,s=(t,r,s)=>{let c=Math.min(t,r)*12+Math.max(t,r),l=o.get(c);if(!l){l=[];let[s,u]=t<r?[t,r]:[r,t];for(let t=1;t<e;t++)l.push(i.push(a(n[s],n[u],t/e))-1);o.set(c,l)}return t<r?l[s-1]:l[e-s-1]},c=[];for(let[t,a,o]of r){L(Ae([n[a][0]-n[t][0],n[a][1]-n[t][1],n[a][2]-n[t][2]],[n[o][0]-n[t][0],n[o][1]-n[t][1],n[o][2]-n[t][2]]),n[t])<0&&([a,o]=[o,a]);let r=new Map,l=(c,l)=>{if(c===0&&l===0)return t;if(c===e)return a;if(l===e)return o;if(l===0)return s(t,a,c);if(c===0)return s(t,o,l);if(c+l===e)return s(a,o,l);let u=c*(e+1)+l,d=r.get(u);if(d===void 0){let s=n[t],f=n[a],p=n[o],m=(e-c-l)/e,h=c/e,g=l/e;d=i.push(R([s[0]*m+f[0]*h+p[0]*g,s[1]*m+f[1]*h+p[1]*g,s[2]*m+f[2]*h+p[2]*g]))-1,r.set(u,d)}return d};for(let t=0;t<e;t++)for(let n=0;n<e-t;n++)c.push(l(t,n),l(t+1,n),l(t,n+1)),t+n<e-1&&c.push(l(t+1,n),l(t+1,n+1),l(t,n+1))}return{dirs:i,tris:c}}function Ie(e,t){let n=Array.from({length:e},()=>new Set);for(let e=0;e<t.length;e+=3){let[r,i,a]=[t[e],t[e+1],t[e+2]];n[r].add(i).add(a),n[i].add(r).add(a),n[a].add(r).add(i)}let r=new Uint32Array(e+1);for(let t=0;t<e;t++)r[t+1]=r[t]+n[t].size;let i=new Uint32Array(r[e]);for(let t=0;t<e;t++)i.set([...n[t]],r[t]);return{start:r,list:i}}function Le(e,t,n){let r=Float64Array.from(e),i=new Float64Array(e.length);for(let e=0;e<n;e++){for(let e=0;e<r.length;e++){let n=0;for(let i=t.start[e];i<t.start[e+1];i++)n+=r[t.list[i]];i[e]=.5*r[e]+.5*n/(t.start[e+1]-t.start[e])}[r,i]=[i,r]}return r}function Re(e,t){let n=new Float64Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=Ae([e[a]-e[i],e[a+1]-e[i+1],e[a+2]-e[i+2]],[e[o]-e[i],e[o+1]-e[i+1],e[o+2]-e[i+2]]);for(let e of[i,a,o])for(let t=0;t<3;t++)n[e+t]+=s[t]}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2])||1;n[e]/=t,n[e+1]/=t,n[e+2]/=t}return n}function ze(e,t){let{half:n,exp:r,ends:i,lumps:o,planes:s,off:c,taper:l}=e,d=1-l*t[1],f=n[0]*i[0][t[0]<0?0:1]*d,p=n[1]*i[1][t[1]<0?0:1],m=n[2]*i[2][t[2]<0?0:1]*d,[h,g]=r,_=1/(((Math.abs(t[0])/f)**h+(Math.abs(t[2])/m)**h)**(g/h)+(Math.abs(t[1])/p)**g)**(1/g);_*=1+o*u(t[0]*1.2+c[0],t[1]*1.2+c[1],t[2]*1.2+c[2],3)+.15*o*a(t[0]*3+c[1],t[1]*3+c[2],t[2]*3+c[0]);for(let n of e.dents){let e=L(t,n.dir);e>0&&(_*=1-n.depth*Math.exp(-(1-e)/n.size))}let v=0;for(let e of s){let n=L(t,e.n);if(n<.001)continue;let r=e.h/n,i=e.soft,a=Math.max(i-Math.abs(_-r),0)/i;v=Math.max(v,je(.5+.5*(_-r)/i)),_=Math.min(_,r)-a*a*i*.25}return[_,v]}function Be(e,t){let n=e.scale,r=[t[0]/n[0],t[1]/n[1],t[2]/n[2]],i=ke(r),[a,o]=ze(e,[r[0]/i,r[1]/i,r[2]/i]);return[a/i,o]}var Ve=(e,t)=>e.wob.reduce((e,[n,r,i,a,o])=>e+o*Math.sin(n*t[0]+r*t[1]+i*t[2]+a),0),He=(e,t)=>e.branch?z(-.1*e.length,.05*e.length,t)*(1-z(.2*e.length,e.length,t)):1-z(.15*e.length,e.length,Math.abs(t)),Ue=(e,t)=>.4+.6*z(-.35,.15,.6*Math.sin(t*e.open[0]+e.open[1])+.4*Math.sin(t*e.open[2]+e.open[3])),We=(e,t)=>.6+.6*z(-.5,.5,.7*Math.sin(t*e.wide[0]+e.wide[1])+.3*Math.sin(t*e.wide[2]+e.wide[3]));function Ge(e){let t={...e},n=s(t.seed*7919+13),[r,i,a]=t.size,o=i/(1-t.sink);t.half=[r/2,o/2,a/2],t.mean=(r/2+o/2+a/2)/3,t.off=[n()*50-25,n()*50-25,n()*50-25],t.layers=R(t.layers),t.dents=t.dents.map(([e,t,n,r,i])=>({dir:R([e,t,n]),size:1-Math.cos(r),depth:i}));let c=Array.from({length:t.facets},()=>{let e=n()*2*Math.PI,t=.35+.55*n(),r=Math.sqrt(1-t*t);return[r*Math.cos(e),t,r*Math.sin(e),.8+.06*n(),.1+.05*n()]});t.planes=[...t.planes,...c].map(([e,n,r,i,a])=>{let o=R([e,n,r]);return{n:o,h:i*Math.hypot(...[0,1,2].map(e=>t.half[e]*t.ends[e][o[e]<0?0:1]*o[e])),soft:a*t.mean}});let l=Fe(16).dirs;t.scale=[1,1,1];let u=[1/0,1/0,1/0],f=[-1/0,-1/0,-1/0];for(let e of l){let[n]=Be(t,e);for(let t=0;t<3;t++)u[t]=Math.min(u[t],e[t]*n),f[t]=Math.max(f[t],e[t]*n)}t.scale=[r/(f[0]-u[0]),o/(f[1]-u[1]),a/(f[2]-u[2])];let[p,m]=t.lean,h=e=>{let[n,r,i]=e;return[n,r]=[n*Math.cos(m)-r*Math.sin(m),n*Math.sin(m)+r*Math.cos(m)],[r,i]=[r*Math.cos(p)-i*Math.sin(p),r*Math.sin(p)+i*Math.cos(p)],[n,i]=[n*Math.cos(t.yaw)+i*Math.sin(t.yaw),-n*Math.sin(t.yaw)+i*Math.cos(t.yaw)],[n,r,i]};t.turn=[h([1,0,0]),h([0,1,0]),h([0,0,1])];let g=-1/0;for(let e of l){let[n]=Be(t,e);g=Math.max(g,h([e[0]*n,e[1]*n,e[2]*n])[1])}t.shift=[t.at[0],d+i-g,t.at[1]];let _=[Math.cos(t.yaw),0,-Math.sin(t.yaw)],v=[Math.sin(t.yaw),0,Math.cos(t.yaw)],y=0,b=0;for(let e of l){let[n]=Be(t,e),[r,i,a]=h([e[0]*n,e[1]*n,e[2]*n]);i+t.shift[1]<-.6||(y=Math.max(y,Math.abs(r*_[0]+a*_[2])),b=Math.max(b,Math.abs(r*v[0]+a*v[2])))}let x=Math.max(b,.5*i),S=d+Math.max(i-x,0),C=Math.max(y-x,0);t.obstacle={a:[t.at[0]-_[0]*C,S,t.at[1]-_[2]*C],b:[t.at[0]+_[0]*C,S,t.at[1]+_[2]*C],r:x+.05,solid:x},t.crackList=[];for(let e of t.cracks){let r,i,a=!1,o,s;if(Array.isArray(e)){r=R(e.slice(0,3));let t=R(Ae(r,Math.abs(r[1])<.9?[0,1,0]:[1,0,0])),n=Ae(r,t);i=t.map((t,r)=>t*Math.cos(e[3])+n[r]*Math.sin(e[3])),[o,s]=e.slice(4)}else{let n=t.crackList[e.from];r=R(n.at.map((t,r)=>t+n.along[r]*e.at*n.length));let c=R(n.along.map((e,t)=>e-r[t]*L(n.along,r))),l=Ae(r,c);i=c.map((t,n)=>t*Math.cos(e.turn)+l[n]*Math.sin(e.turn)),a=!0,{length:o,depth:s}=e}let[c]=Be(t,r),l=R(Ae(r,i)),u=R(i),d=(e,n)=>{let i=R(r.map((t,r)=>t+n*e[r])),[a]=Be(t,i);return i.map(e=>e*a)},[f,p,m,h]=[d(l,.01),d(l,-.01),d(u,.01),d(u,-.01)],g=R(Ae(f.map((e,t)=>e-p[t]),m.map((e,t)=>e-h[t])));L(g,r)<0&&(g=g.map(e=>-e)),i=R(i.map((e,t)=>e-g[t]*L(i,g)));let _=[[12,.008],[80,.0012],[210,4e-4]].map(([e,t])=>{let r=R([n()*2-1,n()*2-1,n()*2-1]);return[r[0]*e,r[1]*e,r[2]*e,n()*2*Math.PI,t]});t.crackList.push({at:r.map(e=>e*c),out:r,along:i,n:R(Ae(i,g)),branch:a,length:o*2*t.mean,depth:s,wob:_,open:[35,n()*6.3,90,n()*6.3],wide:[60,n()*6.3,150,n()*6.3],k:n()*40})}return t}function Ke(e,t,n){let[r,i,o]=e.off,s=t[0]+r,c=t[1]+i,l=t[2]+o,d=e.spacing,f=e.coarse,p=Math.sqrt(f),m=.0065*(1-.8*n)*u(s*16,c*16,l*16,3),[h]=Pe(s/.04,c/.04,l/.04);m+=.0035*(1-.8*n)*(h*h-.35);let g=.012*p,[_]=Pe(s/g+4.4,c/g,l/g);m+=.0012*p*(1-n)*(_*_-.3),n>0&&(m+=.0012*p*n*u(s*70/p+1.7,c*70/p,l*70/p,2));let v=1-Math.abs(a(s*24+5.1,c*24,l*24)+.2*a(s*70,c*70,l*70+2.3));if(m-=.001*(1-.6*n)*z(.05,.55,a(s*5,c*5+7.7,l*5))*v**(6/f),e.bedding>0){let n=L(t,e.layers)*52+1.6*u(s*6,c*6,l*6,2);m-=7e-4*e.bedding*(1-Math.abs(Math.sin(Math.PI*n)))**(3/f)*(.5+.5*a(s*11,c*11,l*11+4))}let y=z(-.35,.45,a(s*8+3.1,c*8,l*8));for(let[t,n,r,i,o,u]of[[Math.max(.01,6*d),e.pits*(.2+.7*y),.25,.45,.3,0],[.032*p,.04*e.pits,.16,.3,.2,.35*je(2-f)]]){let[e,,d,f]=Pe(s/t+9.1,c/t,l/t),p=(r+(i-r)*f)*(1+u*a(s*180,c*180+2.2,l*180));if(d<n&&e<p){let n=1-e/p*(e/p);m-=o*p*t*n*n}}let b=3.2*d,[x,S]=Pe(s/b,c/b+3.3,l/b),C=(.08+.05*n)*d*z(0,.3,S-x);C+=(.09+.05*n)*d*u(s/(3.5*d),c/(3.5*d),l/(3.5*d),2);let w=0;for(let n of e.crackList){let r=[t[0]-n.at[0],t[1]-n.at[1],t[2]-n.at[2]],i=L(r,n.along),o=He(n,i)*z(-.5*e.mean,-.25*e.mean,L(r,n.out));if(o<=0)continue;let u=L(r,n.n)+Ve(n,t),f=2.6*d*(.5+.5*o)*We(n,i);if(Math.abs(u)>10*f)continue;let p=u/f,m=.9*d*n.depth*o*Ue(n,i);w+=m*((.75+.25*a(s*30,c*30+n.k,l*30))*Math.exp(-2*p*p)+.2*Math.exp(-p*p/12))}return[m+C-w,w,m-w]}function qe(e,t,n){let{nb:r}=n;e.coarse=Math.max(1,1/e.density);let i=n.dirs.length,a=e.size[1],o=new Float64Array(i*3),s=new Float64Array(i),c=(t,n)=>{let[r,i]=Be(e,n);o[t*3]=n[0]*r,o[t*3+1]=n[1]*r,o[t*3+2]=n[2]*r,s[t]=i};n.dirs.forEach((e,t)=>c(t,e));let l=new Float64Array(i*3);for(let e=0;e<8;e++){for(let e=0;e<i;e++){let t=0,n=0,i=0,a=r.start[e+1]-r.start[e];for(let a=r.start[e];a<r.start[e+1];a++){let e=r.list[a]*3;t+=o[e],n+=o[e+1],i+=o[e+2]}l[e*3]=.5*o[e*3]+.5*t/a,l[e*3+1]=.5*o[e*3+1]+.5*n/a,l[e*3+2]=.5*o[e*3+2]+.5*i/a}for(let e=0;e<i;e++)c(e,R([l[e*3],l[e*3+1],l[e*3+2]]))}let u=0;for(let e=0;e<i;e++)for(let t=r.start[e];t<r.start[e+1];t++){let n=r.list[t]*3;u+=Math.hypot(o[n]-o[e*3],o[n+1]-o[e*3+1],o[n+2]-o[e*3+2])}e.spacing=u/r.list.length;let f=Re(o,n.tris),p=new Float64Array(i),m=new Float64Array(i),h=new Float64Array(i),g=new Float64Array(i*3),[_,v,y]=e.turn;for(let t=0;t<i;t++){let[n,r,i]=Ke(e,[o[t*3],o[t*3+1],o[t*3+2]],s[t]);p[t]=n,m[t]=r,h[t]=i;let a=o[t*3]+f[t*3]*n,c=o[t*3+1]+f[t*3+1]*n,l=o[t*3+2]+f[t*3+2]*n;for(let n=0;n<3;n++)g[t*3+n]=_[n]*a+v[n]*c+y[n]*l+e.shift[n]}let b=Re(g,n.tris),x=Le(h,r,2),S=Le(h,r,Math.max(2,Math.round(12*e.density*e.density))),C=Le(Array.from(h,(e,t)=>x[t]-e),r,1),w=new Float64Array(i*4);for(let n=0;n<i;n++){let r=je(Math.max(C[n]/(.25*e.spacing)*.25+(S[n]-h[n])/.004*.6,m[n]/(2*e.spacing*e.coarse))),i=g[n*3+1]-d,o=b[n*3+1],s=.45+.55*z(-.01,.45*a,i),c=1-.55*Math.max(-o,0)*(1-z(0,.7*a,i)),l=.82+.18*(.5+.5*o),u=Me(Oe,g[n*3],g[n*3+1],g[n*3+2]),f=1-.45*Math.exp(-Math.max(u,0)/.015);w.set([t,r,0,je((1-.65*r)*s*c*l*f)],n*4)}return{world:g,attrs:w}}var Je=De.map(Ge);function Ye(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=new i(`rocks`),r=[],a=new Map;return Je.forEach((e,i)=>{let s=t===1?e.freq:Math.max(6,Math.round(e.freq*t)),c=a.get(s);if(!c){let e=Fe(s);c={...e,nb:Ie(e.dirs.length,e.tris)},a.set(s,c)}let{world:l,attrs:u}=qe({...e,density:s/e.freq},i,c),d=n.vertexCount;for(let e=0;e<c.dirs.length;e++)n.vertex([l[e*3],l[e*3+1],l[e*3+2]],[u[e*4],u[e*4+1],u[e*4+2],u[e*4+3]]);for(let e=0;e<c.tris.length;e+=3)n.tri(d+c.tris[e],d+c.tris[e+1],d+c.tris[e+2],o.ROCK);let f=e.obstacle;r.push({a:f.a.slice(),b:f.b.slice(),r:f.r,solid:f.solid})}),{meshes:[n.finish()],obstacles:r}}var B=e=>e.toFixed(5),Xe=e=>`vec3f(${e.map(B).join(`, `)})`;function Ze(){let e=De[0],t=s(e.seed*7919+4099);t();let n=[e.at[0],d+.45*e.size[1],e.at[1]],r=t()*2*Math.PI,i=(t()*2-1)*.6,a=[Math.sqrt(1-i*i)*Math.cos(r),i,Math.sqrt(1-i*i)*Math.sin(r)],o=L(a,n)+(t()-.5)*.5*Math.min(e.size[0],e.size[2]);return[o,o+(t()<.5?-1:1)*(.015+.015*t())].map((e,t)=>`    let vein${`AB`[t]} = vec4f(${a.map(B).join(`, `)}, ${B(e)});`).join(`
`)}function Qe(){let e=[];return Je.forEach((t,n)=>{let[r,i,a]=t.turn;e.push(`  ${n?`} else `:``}if (id == ${n}u) {`,`    let back = transpose(mat3x3f(${Xe(r)}, ${Xe(i)}, ${Xe(a)}));`,`    let ql = back * (p - ${Xe(t.shift)});`,`    let nl = back * n;`);for(let n of t.crackList){let r=n.length,i=n.branch?`smoothstep(${B(-.1*r)}, ${B(.05*r)}, along) * (1.0 - smoothstep(${B(.2*r)}, ${B(r)}, along))`:`1.0 - smoothstep(${B(.15*r)}, ${B(r)}, abs(along))`,a=n.wob.map(([e,t,n,r,i])=>`${B(i)} * sin(dot(ql, ${Xe([e,t,n])}) + ${B(r)})`).join(` + `);e.push(`    {`,`      let d = ql - ${Xe(n.at)};`,`      let along = dot(d, ${Xe(n.along)});`,`      let mask = (${i}) * smoothstep(${B(-.5*t.mean)}, ${B(-.25*t.mean)}, dot(d, ${Xe(n.out)}));`,`      let cn = ${Xe(n.n)};`,`      let off = dot(d, cn) + ${a};`,`      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${B(n.open[0])} + ${B(n.open[1])}) + 0.4 * sin(along * ${B(n.open[2])} + ${B(n.open[3])}));`,`      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${B(n.wide[0])} + ${B(n.wide[1])}) + 0.3 * sin(along * ${B(n.wide[2])} + ${B(n.wide[3])}));`,`      let hw = ${B(5e-4*Math.sqrt(n.depth))} * wide * (0.4 + 0.6 * mask);`,`      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);`,`      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);`,`      crackLine = max(crackLine, core * mask * open);`,`    }`)}}),e.push(`  }`),e.join(`
`)}var $e=`
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
${Ze()}
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
${Qe()}
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
`,et=t({WGSL:()=>Qt,build:()=>Xt}),V=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],H=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],U=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],tt=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],W=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],G=e=>Math.hypot(e[0],e[1],e[2]),K=e=>U(e,1/(G(e)||1)),nt=(e,t,n)=>V(e,U(H(t,e),n)),q=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return V(V(U(e,r),U(W(t,e),i)),U(t,tt(t,e)*(1-r)))},J=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},rt=[0,1,0],it=(e,t)=>K(H(e,U(t,tt(e,t)))),at=e=>e-Math.floor(e);function ot(e,t){let n=at(e*.618034+.17),r=at(e*.754877+.31),i=at(e*.56984+.53);return{widest:.3+.12*n,base:2+r,tip:1.45+.5*i,drawn:t?.06+.14*n:.18+.2*n}}function st(e,t){if(e<=t.widest)return Math.sqrt(Math.max(1-((t.widest-e)/t.widest)**t.base,0));let n=(e-t.widest)/(1-t.widest);return Math.max(1-n**t.tip,0)**1.05*(1-t.drawn*J(.62,1,n))}var ct=.3,lt=(e,t,n,r,i)=>{let a=Math.abs(t),o=+(t<0);return n*(e-ct*a**1.2*st(e,i))+.5*o+.2*Math.sin(9*e+2.3*r+1.7*o)*Math.min(2*a,1)};function ut(e){let t=e.length,n=.5*e.ratio*t,r=K(W(e.face,e.dir)),i=[[0,0,0]],o=[];for(let n=0;n<=120;n++){let a=n/120,s=e.arch*a**1.6+e.droop*J(.7,1,a),c=e.side*a**1.3,l=q(e.dir,r,s),u=q(e.face,r,s),d=q(r,u,c);l=q(l,u,c),d=q(d,l,e.twist*a),u=q(u,l,e.twist*a),o.push({T:l,N:u,X:d}),n&&i.push(V(i[n-1],U(V(l,o[n-1].T),.5*t/120)))}let s=t=>{let n=Math.min(Math.max(t,0),1)*120,r=Math.min(Math.floor(n),119),a=n-r;return{c:V(e.base,nt(i[r],i[r+1],a)),T:K(nt(o[r].T,o[r+1].T,a)),N:K(nt(o[r].N,o[r+1].N,a)),X:K(nt(o[r].X,o[r+1].X,a))}},c=ot(e.id,!!e.small),l=(t,r)=>st(t,c)*n*(r?1+e.asym:1-e.asym);return{b:e,L:t,H:n,at:(n,r)=>{let{c:i,N:o,X:u}=s(n),d=l(n,r>=0),f=Math.max(-1.2,Math.min(1.2,r/Math.max(d,1e-7))),p=Math.abs(f),m=Math.sin(Math.PI*Math.min(n*1.15,1)),h=e.cup*(.3+.7*m)*d*f*f;h+=e.fold*d*(Math.sqrt(f*f+.004)-.0632);let g=t*(.013-.007*n);h-=t*.0065*(1-.8*n)*Math.exp(-((r/g)**2)),h+=t*e.quilt*(.5-.5*Math.cos(2*Math.PI*lt(n,f,e.veins,e.id,c)))*J(.05,.2,p)*(1-J(.75,1,p))*J(.03,.12,n)*(1-J(.85,.98,n));let _=r>=0?e.phase:e.phase+2.3;if(h+=e.wave*d*(Math.sin(2*Math.PI*e.waves*n+_)+.6*a(n*6,f*1.3,e.id*3.7+.5))*J(.4,1,p)**2*m,!e.furl)return V(V(i,U(u,r)),U(o,h));let v=d/(e.furl*(r>=0?4.6:4)),y=r/Math.max(v,1e-7);return V(V(i,U(u,v*Math.sin(y))),U(o,v*(1-Math.cos(y))))},frame:s,half:l}}function dt(e,t,n,r,i){let{b:a,L:o,at:s,frame:c,half:l}=t,u=(e,t)=>{let n=2e-4,r=W(H(s(Math.min(e+n,1),t),s(Math.max(e-n,0),t)),H(s(e,t+n*o),s(e,t-n*o)));return G(r)>1e-14?K(r):c(e).N},d=[];for(let e=0;e<=r;e++){let t=-1+2*e/r;d.push(Math.sign(t)*Math.abs(t)**1.3)}let f=[],p=e.vertex(s(0,0),[0,0,a.id,1],c(0).N);f.push([p,0,0]);let m=[];for(let t=1;t<n;t++){let r=t/n,i=.6*r+.4*(.5-.5*Math.cos(Math.PI*r));m.push(d.map(t=>{let n=t*l(i,t>=0),r=e.vertex(s(i,n),[i,t,a.id,1],u(i,n));return f.push([r,i,n]),r}))}let h=e.vertex(s(1,0),[1,0,a.id,1],c(1).N);f.push([h,1,0]);for(let t=0;t<r;t++){e.tri(p,m[0][t],m[0][t+1],i);for(let n=0;n+1<m.length;n++)e.quad(m[n][t],m[n+1][t],m[n+1][t+1],m[n][t+1],i);e.tri(m[m.length-1][t],h,m[m.length-1][t+1],i)}return f}function ft(e,t){let n=e.length,r=e.map((t,r)=>K(H(e[Math.min(r+1,n-1)],e[Math.max(r-1,0)]))),i=[it(t,r[0])];for(let e=1;e<n;e++){let t=W(r[e-1],r[e]),n=G(t),a=n>1e-9?q(i[e-1],U(t,1/n),Math.atan2(n,tt(r[e-1],r[e]))):i[e-1];i.push(it(a,r[e]))}return{T:r,U:i}}function pt(e,t,n,r,i,a,o,s=null){let c=t.length,{T:l,U:u}=ft(t,o),d=[],f=0;for(let i=0;i<c;i++){let o=u[i];if(i&&(f+=G(H(t[i],t[i-1]))),n[i]<=0){d.push(e.vertex(t[i],[f,0,a,1],i?l[i]:U(l[i],-1)));continue}let p=W(l[i],o),m=Math.max(i-1,0),h=Math.min(i+1,c-1),g=Math.max(G(H(t[h],t[m])),1e-9),_=[];for(let c=0;c<=r;c++){let u=2*Math.PI*c/r,d=V(U(o,Math.cos(u)),U(p,Math.sin(u)));if(!s){let r=(n[h]-n[m])/g;_.push(e.vertex(V(t[i],U(d,n[i])),[f,u,a,1],K(H(d,U(l[i],Math.max(-3,Math.min(3,r)))))));continue}let v=s(i,u),y=(s(i,u+.001)-s(i,u-.001))/.002,b=K(H(U(d,v),U(V(U(o,-Math.sin(u)),U(p,Math.cos(u))),y))),x=(n[h]*s(h,u)-n[m]*s(m,u))/g*tt(d,b);_.push(e.vertex(V(t[i],U(d,n[i]*v)),[f,u,a,1],K(H(b,U(l[i],Math.max(-3,Math.min(3,x)))))))}d.push(_)}for(let t=0;t+1<c;t++){let n=d[t],a=d[t+1];for(let t=0;t<r;t++)typeof n==`number`?e.tri(n,a[t+1],a[t],i):typeof a==`number`?e.tri(n[t],n[t+1],a,i):e.quad(n[t],n[t+1],a[t+1],a[t],i)}return{rings:d,T:l,U:u}}function mt(e,t,n,r,i,a=1.35){let o=[];for(let s=0;s<=i;s++){let c=1-(1-s/i)**a,l=1-c;o.push(V(V(U(e,l*l*l),U(t,3*l*l*c)),V(U(n,3*l*c*c),U(r,c*c*c))))}return o}function ht(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function gt(e,t,n,r,i){let a=e.frame(0),o=V(e.at(0,0),U(a.N,-.8*i)),s=G(H(o,t));return mt(t,V(t,U(n,.45*s)),H(o,U(a.T,Math.min(.08,.3*s))),o,r)}function _t(e,t,n,r,i){let o=r.rTop*1.12,s=gt(e,t,n,r.segs,o),c=G(H(s[s.length-1],t)),l=[];s.forEach((e,t)=>{let n=t/r.segs;if(t&&t<r.segs){let r=.003*Math.sin(Math.PI*n)*(c/.4);s[t]=V(e,[r*a(n*2.2,i*1.7,.3),r*a(n*2.2,i*1.7,5.1),r*a(n*2.2,i*1.7,9.7)])}let o=r.rBase+(r.rTop-r.rBase)*n**.7;l.push(o*(1+r.sheath*(1-J(0,r.sheathLen/c,n))**2)*(1+.14*J(.88,1,n)))});let u=r.midribSegs;for(let t=1;t<=u;t++){let n=t/u*r.midrib,i=t===u?0:o*(1-t/u)**.75;s.push(V(e.at(n,0),U(e.frame(n).N,-.8*i))),l.push(i)}return{pts:s,rad:l,segs:r.segs,n:u,midrib:r.midrib}}function vt(e,t,n,r,i,a){let{pts:s,rad:c,segs:l}=n,u=t.frame(0).N,{T:d,U:f}=ft(s,u),p=Math.atan2(tt(u,W(d[l],f[l])),tt(u,f[l]));return pt(e,s,c,r.sides,o.STEM,i,u,(e,t)=>1-r.groove*(1-J(1-a,1,e/l))*Math.max(0,Math.cos(t-p))**3)}var yt=(e,t,n)=>{let r=(n-e)/(t-e);return r<=0||r>=1?0:6*r*(1-r)/(t-e)};function bt(e){let t=t=>1.6*e.arch*Math.max(t,0)**.6+e.droop*yt(.7,1,t),n=new Float64Array(513),i=new Float64Array(513);for(let e=1;e<=512;e++){let a=(e-.5)/512,o=a*a*(2-a)*t(a)/512;n[e]=n[e-1]+Math.cos(r*a)*o,i[e]=i[e-1]+Math.sin(r*a)*o}let a=(e,t)=>{let n=Math.min(Math.max(t,0),1)*512,r=Math.min(Math.floor(n),511);return e[r]+(e[r+1]-e[r])*(n-r)};return{turn:t,Kc:e=>a(n,e),Ks:e=>a(i,e)}}function xt(e,t){let n=e.frame(t),r=K(n.T),i=it(n.N,r);return[r,W(i,r),i]}function St(t,r,i,a,o,s,c,l,u,d){let f=u.segs,p=0;for(let e=1;e<=f;e++)p+=G(H(u.pts[e],u.pts[e-1]));let m=K(H(u.pts[f],u.pts[f-1])),h=o.frame(0).N,g=o.L,_=it(h,m),v=W(m,_),y=[0];for(let e=1;e<=f;e++)y.push(y[e-1]+G(H(u.pts[e],u.pts[e-1])));let b=e=>{let t=K(H(u.pts[Math.min(e+1,f)],u.pts[Math.max(e-1,0)])),n=y[e]/y[f],r=n*(4-3*n);return[U(t,tt(t,_)*r),U(t,tt(t,v)*r)]},x=[[0,0,0]],S=[[0,0,0]];for(let e=1;e<=f;e++){let[t,n]=b(e-1),[r,i]=b(e),a=.5*(y[e]-y[e-1])/y[f];x.push(V(x[e-1],U(V(t,r),a))),S.push(V(S[e-1],U(V(n,i),a)))}let C=e=>{let t=1;for(;t<f&&y[t]/y[f]<e;)t++;let n=Math.min(Math.max((e*y[f]-y[t-1])/(y[t]-y[t-1]),0),1);return[...nt(x[t-1],x[t],n),0,...nt(S[t-1],S[t],n),0]};if(e(i,a*40,{...d,foot:u.pts[0],base:u.pts[f],S:m,P:_,Ls:p,Lb:g,tip:o.at(1,0),dir:o.b.dir,jP:x[f],jQ:S[f]}),d.with!==void 0)for(let e of[16,17])i[a*40+e]=i[d.with*40+e];let w=p/(p+g),T=bt(o.b),E=(e,i)=>{let[s,c,l]=xt(o,i),u=H([t.p[e*3],t.p[e*3+1],t.p[e*3+2]],o.frame(i).c);r[e]=[a,w+(1-w)*i,i,tt(u,c),...n(s,c,l),T.turn(i)/g,T.Kc(i),T.Ks(i),tt(u,l),0,0,0,0,0,0,0,0]};for(let[e,t]of s)E(e,t);let D=[0];for(let e=1;e<=c.segs;e++)D.push(D[e-1]+G(H(c.pts[e],c.pts[e-1])));l.rings.forEach((e,i)=>{let o=typeof e==`number`?[e]:e;if(i<=c.segs){let e=l.T[i],s=it(l.U[i],e),u=n(e,s,W(e,s)),d=c.pts[i],f=C(D[i]/D[c.segs]);for(let e of o)r[e]=[a,D[i]/D[c.segs]*w,-1,0,...u,...H([t.p[e*3],t.p[e*3+1],t.p[e*3+2]],d),0,...f];return}let s=(i-c.segs)/c.n*c.midrib;for(let e of o)E(e,s)})}function Ct(e,t,n){let r=new Float32Array(e*20);for(let n=0;n<e;n++)t[n]?r.set(t[n],n*20):(r[n*20]=-1,r[n*20+7]=1);return{vertex:r,leaves:n}}var Y=(e,t,n)=>Math.max(n,Math.round(e*t)),wt=(e,t,n)=>Math.max(n,2*Math.round(e*t/2));function Tt(e,t=c-.01){if(G(e)<=t)return e;let n=Math.hypot(e[0],e[2]),r=Math.sqrt(Math.max(t*t-e[1]*e[1],0));return[e[0]*r/n,e[1],e[2]*r/n]}function Et(e,t,n,r,i,s,c,l,u){let f=d-.9*s,p=K(W(n,rt)),m=.3*(l()-.5),h=(e,r,i=0)=>[t[0]+n[0]*e+p[0]*i,r,t[2]+n[2]*e+p[2]*i],g=[t,h(.9*r,f+.7*s),h(r+.5*i,f,m*i),h(r+i,f,1.6*m*i),h(r+i+.012,f-.03,2*m*i),h(r+i+.018,f-.07,2.2*m*i)],_=Y(5,u,2),v=ht(g,_).map((e,t)=>{let n=t*5/_,r=n>6?.0025:0;return Tt(V(e,[r*a(n*.35,c,1.1),.4*r*a(n*.35,c,4.2),r*a(n*.35,c,7.3)]))});pt(e,v,v.map((e,t)=>t===v.length-1?0:s*(1.1-.65*(t/v.length))),Y(6,u,4),o.ROOT,c,rt)}var Dt=[{r:.1,pts:[[-.52,-.65,-.045],[-.5,-.55,-.055],[-.45,-.474,-.064],[-.38,-.418,-.076],[-.3,-.381,-.086],[-.21,-.358,-.113],[-.125,-.325,-.133],[-.034,-.29,-.144],[.06,-.273,-.152],[.16,-.273,-.159],[.25,-.299,-.164],[.33,-.342,-.158],[.39,-.403,-.147],[.44,-.47,-.136],[.48,-.55,-.131],[.5,-.65,-.138]]},{r:.085,pts:[[.15,-.27,-.165],[.2,-.13,-.245],[.228,-.04,-.254]]},{r:.095,pts:[[-.42,-.441,-.073],[-.4,-.501,-.004],[-.37,-.56,.058],[-.35,-.64,.108]]}],Ot=[{c:[-.4,.32],w:.24,h:.15,d:.19},{c:[.17,.24],w:.17,h:.1,d:.14},{c:[.4,.1],w:.15,h:.09,d:.12},{c:[.62,.12],w:.09,h:.05,d:.08}],kt={lo:[-.35,-.15,-.2],hi:[.35,.6,.6]},At=(e,t,n)=>{let r=n[0]-t[0],i=n[1]-t[1],a=n[2]-t[2],o=e[0]-t[0],s=e[1]-t[1],c=e[2]-t[2],l=Math.min(Math.max((o*r+s*i+c*a)/(r*r+i*i+a*a),0),1);return Math.hypot(o-r*l,s-i*l,c-a*l)};function jt(e,t){let n=0;for(let r of Dt)for(let i=0;i+1<r.pts.length;i++)n=Math.max(n,r.r+t-At(e,r.pts[i],r.pts[i+1]));for(let r of Ot){let i=r.h/.65,a=G([(e[0]-r.c[0])/(.5*r.w+t),(e[1]-(d+r.h-.5*i))/(.5*i+t),(e[2]-r.c[1])/(.5*r.d+t)]);a<1&&(n=Math.max(n,(1-a)*.5*r.h))}let r=Math.min(...[0,1,2].map(t=>Math.min(e[t]-kt.lo[t],kt.hi[t]-e[t])));return Math.max(n,r-.015)}function Mt(e,t,n){let r=0;for(let i=0;i<=12;i++){let a=i/12;for(let i of[-1,-.5,0,.5,1]){let o=e.at(a,i*e.half(a,i>=0));if(o[1]>-.62&&(r=Math.max(r,G(o)-(c-.012))),r=Math.max(r,jt(o,t)),n)for(let e=0;e<3;e++)r=Math.max(r,n.lo[e]-o[e],o[e]-n.hi[e])}}return r}var Nt=class{constructor(e){this.cell=e,this.map=new Map}key(e,t,n){return((e+512)*1024+(t+512))*1024+(n+512)}add(e,t){let n=this.cell,r=this.key(Math.floor(e[0]/n),Math.floor(e[1]/n),Math.floor(e[2]/n));this.map.has(r)||this.map.set(r,[]),this.map.get(r).push({p:e,blade:t})}near(e,t,n){let r=this.cell,i=Math.floor(e[0]/r),a=Math.floor(e[1]/r),o=Math.floor(e[2]/r),s=0;for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++)for(let u of this.map.get(this.key(i+r,a+c,o+l))??[]){let r=u.blade?t:n,i=u.p[0]-e[0],a=u.p[1]-e[1],o=u.p[2]-e[2];i*i+a*a+o*o<(r-s)*(r-s)&&r>s&&(s=r-Math.sqrt(i*i+a*a+o*o))}return s}};function Pt(e,t,n){let r=[];for(let i=0;i<=t;i++){let a=(i/t)**1.25;for(let t=0;t<=n;t++){let i=-1+2*t/n;r.push(e.at(a,i*e.half(a,i>=0)))}}return r}function Ft(e,t,n){let r=e=>{let t=ut(e.b),r=Mt(t,n.margin,n.bounds),i=gt(t,e.from,e.rise,12,0);for(let e of i.slice(4))r=Math.max(r,jt(e,.01));if(n.crowd){for(let e of Pt(t,n.samples[0],n.samples[1]))r=Math.max(r,n.crowd.near(e,n.gap,n.stalkGap));for(let e of i.slice(3))r=Math.max(r,n.crowd.near(e,n.stalkGap,0))}return{shape:t,w:r}},i=t[0].slice(1).map(()=>0),a={leaf:e(i),q:i};a.s=r(a.leaf);let o=a;for(let n=0,i=0;n<24&&o.s.w>0&&i<4;n++){let n=null;for(let i of t){let t=a.q.map((e,t)=>e+i[t]),o=e(t),s=r(o),c=s.w+i[i.length-1];(!n||c<n.cost)&&(n={cost:c,q:t,leaf:o,s})}a=n,a.s.w<o.s.w-1e-5?(o=a,i=0):i++}if(o.s.w>0&&n.wide){let t=null;for(let i of n.wide){let n=o.q.map((e,t)=>e+i[t]),a=e(n),s=r(a),c=s.w+i[i.length-1];s.w<o.s.w&&(!t||c<t.cost)&&(t={cost:c,q:n,leaf:a,s})}t&&(o=t)}if(o.s.w>0&&n.wider){let t=o,i=null;for(let a of n.wider){let n=t.q.map((e,t)=>e+a[t]),o=e(n),s=r(o),c=3*s.w+a[a.length-1];if(s.w<t.s.w&&(!i||c<i.cost)&&(i={cost:c,q:n,leaf:o,s}),s.w<=0)break}i&&(o=i)}return{leaf:o.leaf,shape:o.s.shape}}function It(e,t,n,r){for(let n of Pt(t,r[0],r[1]))e.add(n,!0);for(let t of n)e.add(t,!1)}function Lt(e,t,n,r,i){let a=new Float64Array(n.length*8);n.forEach((e,t)=>a.set([...e.c,...e.n??[0,0,0],e.a,e.owner],t*8));for(let n=0;n<e.vertexCount;n++){let o=e.p[n*3],s=e.p[n*3+1],c=e.p[n*3+2],l=t[n],u=0;for(let e=0;e<a.length;e+=8){if(a[e+7]===l)continue;let t=a[e]-o,n=a[e+1]-s,r=a[e+2]-c,i=t*t+n*n+r*r;if(i<25e-6)continue;let d=Math.sqrt(i),f=n/d;if(f<=-.1)continue;let p=a[e+3]||a[e+4]||a[e+5]?Math.abs(a[e+3]*t+a[e+4]*n+a[e+5]*r)/d:.5;u+=a[e+6]*(f+.1)*p*J(.005,.015,d)/(Math.PI*i+a[e+6])}let f=J(-.01,r,s-d);e.a[n*4+3]=Math.max(Math.exp(-i*u),.35)*(.75+.25*f)}}function Rt(e,t,n){for(let r=0;r<8;r++)for(let i=0;i<4;i++){let a=(r+.5)/8,o=-1+(2*i+1)/4,s=e.half(a,o>=0);n.push({c:e.at(a,o*s),n:e.frame(a).N,a:e.L/8*(2*s/4),owner:t})}}function zt(e,t,n,r){for(let i=3;i<e.length;i+=3)r.push({c:e[i],n:null,a:2*t*G(H(e[i],e[i-3])),owner:n})}var Bt=(e,t,n,r)=>{for(let i=n;i<e.vertexCount;i++)t[i]=r},Vt=[.5,d,-.32],Ht={lo:[.06,-.7,-.64],hi:[.92,.2,.24]},Ut=[{top:[.42,-.06,-.46],dir:[-.66,.6,.25],length:.44,ratio:.5,arch:.85,at:.24,toward:1},{top:[.64,-.1,-.3],dir:[.4,.75,.3],length:.41,ratio:.48,arch:.8,at:.74,toward:.8},{top:[.47,-.2,-.15],dir:[-.75,.1,.65],length:.36,ratio:.5,arch:.6,at:.47,toward:.9},{top:[.36,-.14,-.5],dir:[-.6,.7,-.1],length:.34,ratio:.47,arch:.7,at:.06,toward:.9},{top:[.56,-.17,-.22],dir:[.55,.55,.6],length:.31,ratio:.5,arch:.75,at:.53,toward:.9},{top:[.67,-.26,-.43],dir:[.1,.8,-.4],length:.32,ratio:.48,arch:.6,at:.82,toward:.6},{top:[.64,-.32,-.13],dir:[.75,.3,.55],length:.29,ratio:.51,arch:.6,at:.66,toward:.9},{top:[.4,-.2,-.43],dir:[-.85,.35,-.05],length:.28,ratio:.49,arch:.6,at:.15,toward:1,with:3},{top:[.72,-.4,-.26],dir:[.45,.75,.4],length:.24,ratio:.5,arch:.6,at:.92,toward:.5},{top:[.575,-.38,-.345],dir:[.05,.97,.1],length:.16,ratio:.42,arch:.15,at:.58,furl:.6,toward:.5},{top:[.47,-.48,-.3],dir:[-.1,.95,.12],length:.1,ratio:.4,arch:.08,at:.37,furl:.8,toward:.5}];function Wt(e,t,n){let r=q(e,rt,t),i=W(r,rt);return G(i)<.001?r:K(q(r,K(i),Math.min(n,Math.acos(Math.min(r[1],1))-.05)))}function Gt(e,t,n){let r=new i(`plantTall`),s=[],c=[],l=[],u=[],f=new Float32Array(Ut.length*40),p=[.4,d+.004,-.285],m=[.6,d+.004,-.36],h=.024,g=.016,_=e=>V(nt(p,m,e),[0,.006*Math.sin(Math.PI*e),.008*Math.sin(2*Math.PI*e)]);{let e=[0];for(let t=1;t<=400;t++)e.push(e[t-1]+G(H(_(t/400),_((t-1)/400))));let t=e[400],i=t=>{let n=1;for(;n<400&&e[n]<t;)n++;return(n-1+(t-e[n-1])/(e[n]-e[n-1]))/400},l=(e,n)=>{let r=[];for(let e=0;e<n;e++)r.push(h*(1-Math.cos(e/n*.5*Math.PI)));for(let n=Math.ceil(h/(g/e));n*g/e<t-h-.001;n++)r.push(n*g/e);for(let e=n;e>=0;e--)r.push(t-h*(1-Math.cos(e/n*.5*Math.PI)));return r},u=l(Y(5,n,2),Y(8,n,3)),d=[],f=[];u.forEach((e,n)=>{let r=Math.min(e,t-e),o=r<h?Math.sqrt(Math.max(1-((h-r)/h)**2,0)):1;d.push(_(i(e))),f.push(n===0||n===u.length-1?0:h*o*(1+.08*a(e*40,1.3,2.9)))});let p=(e,t)=>{let n=u[e],r=Math.round(n/g)%2?1:-1;return 1-.16*(.5+.5*Math.cos(2*Math.PI*n/g))**10*(.3+.7*(.5+.5*Math.cos(t-r*1.1))**1.5)};pt(r,d,f,Y(18,n,8),o.ROOT,0,rt,(e,t)=>p(e,t)*(1+.04*a(u[e]*14,.7*Math.cos(t)+2.3,.7*Math.sin(t)+7.1))),Bt(r,s,0,900),zt(l(5,8).map(e=>_(i(e))),h,900,c)}let v=K(H(m,p)),y=K(W(rt,v));for(let e=0;e<4;e++){let i=r.vertexCount,a=.1+.8*e/3+.05*(t()-.5),o=K(V(U(y,.6+.4*t()),U(v,1.2*(t()-.5)+(e===0?-1:+(e===3)))));Et(r,_(a),o,h,.015+.02*t(),.0045+.0015*t(),2+e,t,n),Bt(r,s,i,901+e)}let b=new Nt(.03),x=[18,7],S=[[.1,0,0,0],[-.1,0,0,0],[.3,0,0,.004],[-.3,0,0,.004],[0,.07,0,4e-4],[0,-.07,0,4e-4],[0,0,.05,.003]];Ut.forEach((t,i)=>{let a=!!t.furl,d=K([t.top[0]-Vt[0],0,t.top[2]-Vt[2]]),p=_(t.at),m=K(V(rt,U(K([t.top[0]-p[0],0,t.top[2]-p[2]]),.4+.7*e()))),h=Array.from({length:12},e),{leaf:g,shape:v}=Ft(([e,n,r])=>{let o=Wt(K(t.dir),e,n),s=q(it(V(V(rt,[0,0,t.toward]),U(d,.3)),o),o,.4*(h[0]-.5));return{from:p,rise:m,b:{base:t.top,dir:o,face:s,length:t.length*Math.exp(-r),ratio:t.ratio,arch:t.arch*(.9+.2*h[1]),droop:a?0:.15+.15*h[2],side:.12*(h[3]-.5),twist:.35*(h[4]-.5),cup:a?.05:.14+.1*h[5],fold:.06+.04*h[6],quilt:a?0:6e-4+3e-4*h[7],wave:a?.02:.05+.04*h[8],waves:2.5+1.5*h[9],phase:6.28*h[10],asym:.08*(h[11]-.5),furl:t.furl??0,veins:13,id:i}}},S,{margin:.02,bounds:Ht,crowd:b,gap:.02,stalkGap:.015,samples:x}),y=r.vertexCount,C=dt(r,v,Y(a?36:90,n,8),wt(a?20:22,n,6),o.LEAF_BIG);Bt(r,s,y,i),Rt(v,i,c);let w=r.vertexCount,T=Math.max(14,Math.round(G(H(t.top,p))/.012)),E={rBase:a?.0072:.0085,rTop:a?.0055:.0062,segs:T,midrib:a?.4:.6,midribSegs:a?10:20,sheath:.6,sheathLen:.045},D=_t(v,g.from,m,E,i),O=n===1?D:_t(v,g.from,m,{...E,segs:Y(T,n,4),midribSegs:Y(E.midribSegs,n,3)},i),k=vt(r,v,O,{sides:Y(8,n,4),groove:.2},i,3/T);Bt(r,s,w,1e3+i),St(r,u,f,i,v,C,O,k,D,{crown:Vt,plant:`tall`,young:a,with:t.with});let A=D.pts;if(zt(A.slice(0,T+1),.007,1e3+i,c),It(b,v,A,x),a)l.push({a:A[Math.round(T*.3)],b:v.at(1,0),r:.03,solid:.015});else{let e=A[Math.round(T*.6)];l.push({a:A[Math.round(T*.25)],b:e,r:.035,solid:.02},{a:e,b:t.top,r:.035,solid:.02}),l.push({a:v.at(.12,0),b:v.at(.8,0),r:.85*v.H+.02,solid:0})}}),l.push({a:Vt,b:V(Vt,[0,.14,0]),r:.07,solid:.03}),Lt(r,s,c,.2,1.6);let C=r.finish();return C.motion=Ct(r.vertexCount,u,f),{mesh:C,obstacles:l}}var Kt=[-.6,d,.06],qt={5:3,10:9,11:8,12:9,14:9,18:16},Jt={lo:[-.88,d+.012,-.22],hi:[-.3,-.2,.4]};function Yt(e,t){let n=new i(`plantSmall`),r=[],s=[],c=[],l=[],u=new Float32Array(800);{let e=[],i=[],s=Y(20,t,6);for(let t=0;t<=s;t++){let n=t/s;e.push(V(Kt,[.002*Math.sin(3*n),-.03+.062*n,0]));let r=J(.72,1,n);i.push(t===s?0:.0145*(1-.25*n)*Math.sqrt(Math.max(1-r*r,0))*(1+.06*a(n*5,3.3,1)))}pt(n,e,i,Y(16,t,8),o.ROOT,1,[1,0,0]),Bt(n,r,0,900)}for(let i=0;i<3;i++){let a=n.vertexCount,o=1.6+i/2*2.4+.3*(e()-.5);Et(n,V(Kt,[0,.004,0]),[Math.cos(o),0,Math.sin(o)],.012,.015+.035*e(),.0024+8e-4*e(),10+i,e,t),Bt(n,r,a,901+i)}let d=[],f=Math.PI/180,p=new Nt(.012),m=[18,7],h=[[.12,0,0,0,0],[-.12,0,0,0,0],[.3,0,0,0,.001],[-.3,0,0,0,.001],[0,.06,0,0,5e-4],[0,-.06,0,0,5e-4],[0,0,.05,0,.002],[0,0,0,.25,5e-4],[0,0,0,-.25,5e-4]],g=[],_=[];for(let e=-3;e<=3;e++)for(let t of[-.15,0,.15])for(let n of[-.4,0,.4])g.push([.15*e,t,0,n,.004*Math.abs(.15*e)+.006*Math.abs(t)+.003*Math.abs(n)]);for(let e=-4;e<=4;e++)for(let t of[-.45,-.15,.15])for(let n of[-.4,0,.4])for(let r of[0,.15,.3])_.push([.3*e,t,r,n,.004*Math.abs(.3*e)+.006*Math.abs(t)+.003*Math.abs(n)+.003*r]);_.sort((e,t)=>e[4]-t[4]);for(let i=0;i<20;i++){let a=19-i,c=1-a/19,v=2.6+2.6*(a*.618034%1-.5)*(1.4-.6*c)+.25*(e()-.5),y=(84-34*c+6*(e()-.5))*f,b=y-(4+18*c*(.6+.4*e()))*f,x=Math.min(.14,(.063+.077*(1-c))*(.85+.3*e())),S=Math.min(.27,(.17+.085*c)*(.9+.2*e())),C=Array.from({length:12},e),{leaf:w,shape:T}=Ft(([e,t,n,r])=>{let i=Math.min(Math.max(v+e,1.25-.6*(1-c)),4.3+.4*(1-c)),o=Math.min(y+t,1.48),s=Math.min(b+1.3*t,1.4),l=[Math.cos(i),0,Math.sin(i)],u=V(Kt,V(U(l,.008+.007*c),[0,.006+.022*(1-c),0])),d=V(u,U(V(U(l,Math.cos(o)),[0,Math.sin(o),0]),x*Math.exp(-n))),f=K(V(U(l,Math.cos(s)),[0,Math.sin(s),0]));return{az:i,from:V(u,V(U(l,-.008),[0,-.012,0])),rise:K(V(rt,U(l,.2+.8*c))),b:{base:d,dir:f,face:q(it(V(V(rt,U(l,-.15)),[0,0,.3]),f),f,.5*(C[0]-.5)+r),length:S*Math.exp(-n),ratio:.33+.12*c+.1*C[1],arch:.35+.4*c+.15*C[2],droop:.1+.15*C[3],side:.2*(C[4]-.5),twist:.5*(C[5]-.5),cup:.12+.12*C[6],fold:.05+.05*C[7],quilt:8e-4,wave:.07+.07*C[8],waves:2+2*C[9],phase:6.28*C[10],asym:.1*(C[11]-.5),furl:0,veins:9,id:a,small:!0}}},h,{margin:.012,bounds:Jt,crowd:p,gap:.009,stalkGap:.007,samples:m,wide:g,wider:c>.9?_:null}),E=n.vertexCount,D=dt(n,T,Y(24,Math.sqrt(t),12),wt(12,t,6),o.LEAF_SMALL);Bt(n,r,E,a),Rt(T,a,s);let O=n.vertexCount,k=Math.max(8,Math.round(G(H(w.b.base,w.from))/.008)),A={rBase:.0026+9e-4*c,rTop:.0021+6e-4*c,segs:k,midrib:.5,midribSegs:8,sheath:.3,sheathLen:.02},j=_t(T,w.from,w.rise,A,11+a),M=t===1?j:_t(T,w.from,w.rise,{...A,segs:Y(k,t,4),midribSegs:Y(8,t,3)},11+a),N=vt(n,T,M,{sides:Y(8,t,4),groove:.2},11+a,3/k);Bt(n,r,O,1e3+a),St(n,l,u,i,T,D,M,N,j,{crown:Kt,plant:`small`,young:!1,with:qt[i]}),zt(j.pts.slice(0,k+1),.003,1e3+a,s),It(p,T,j.pts,m),d.push({tip:T.at(.85,0),pts:Pt(T,6,2)})}c.push({a:Kt,b:V(Kt,[0,.07,0]),r:.08,solid:.02});let v=V(Kt,[0,.035,0]);for(let e=0;e<4;e++){let t=d.filter(t=>Math.floor((Math.atan2(t.tip[2]-v[2],t.tip[0]-v[0])+Math.PI)/(Math.PI/2))%4===e);if(!t.length)continue;let n=nt(v,U(t.reduce((e,t)=>V(e,t.tip),[0,0,0]),1/t.length),.85),r=t.flatMap(e=>e.pts.map(e=>At(e,v,n))).sort((e,t)=>e-t);c.push({a:v,b:n,r:Math.min(Math.max(r[Math.floor(.9*(r.length-1))],.03),.12),solid:0})}Lt(n,r,s,.12,.9);let y=n.finish();return y.motion=Ct(n.vertexCount,l,u),{mesh:y,obstacles:c}}function Xt(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=Gt(s(1511863939),s(4127),t),r=Yt(s(5227),t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles]}}var Zt=(e,t)=>`${t.lengths?`
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
  let ph = ${t.veins.toFixed(1)} * (u - ${ct} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
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
`,Qt=[Zt(`leafBig`,{salt:3,length:.34,lengths:Ut.map(e=>e.length),ratio:.46,veins:13,young:9,tint:`0.35, 0.62, 0.12`,net:280,bump:110,rough:.36}),Zt(`leafSmall`,{salt:5,length:.19,ratio:.44,veins:9,young:99,tint:`0.38, 0.66, 0.13`,net:420,bump:180,rough:.4,small:!0}),`
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
`].join(``),$t=t({WGSL:()=>kn,build:()=>On}),X=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],en=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Z=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],tn=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],nn=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],rn=e=>Math.hypot(e[0],e[1],e[2]),Q=e=>Z(e,1/(rn(e)||1)),an=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},on=.007,sn=.016,cn={az:-1.02,foot:-.46,top:.06,off:.104},ln={r:.052,rIn:.044,tube:.037,cap:.054,slots:[.045,.39],band:[.205,.225],bars:10,fill:.56},un=[.115,.315],dn={h:.432,r:.0095},fn=.525,pn=.0087,mn={at:[-.34,-.545],base:.125,baseTop:.03,sponge:.101,spongeTop:.3,tube:.026,tubeTop:.56,air:.528},hn=.0108,gn={rate:9,radius:.0055};function $(e,t,n){let r=l-n,i=Math.sqrt(Math.max(r*r-e*e,0));return[i*Math.cos(t),e,i*Math.sin(t)]}function _n(e){let t=rn(e);return[Math.asin(e[1]/t),Math.atan2(e[2],e[0]),l-t]}function vn([e,t,n]){let r=l-n;return[r*Math.cos(e)*Math.cos(t),r*Math.sin(e),r*Math.cos(e)*Math.sin(t)]}function yn(e,t,n){let r=Q(t),i=Q(en(n,Z(r,tn(n,r))));return{o:e,u:r,a:i,b:nn(r,i)}}function bn(e,t,n,r,i,a,o){let s=e.p,c=e=>[s[e*3],s[e*3+1],s[e*3+2]];tn(nn(en(c(n),c(t)),en(c(r),c(t))),o)>=0?e.quad(t,n,r,i,a):e.quad(t,i,r,n,a)}function xn(e,t,n,r,i,a,o=null,s=null){let[c,l]=o??[0,2*Math.PI],u=o?r+1:r,d=[];for(let e=0;e+1<n.length;e++){let t=n[e+1][0]-n[e][0],r=n[e+1][1]-n[e][1],i=Math.hypot(t,r)||1;d.push([r/i,-t/i])}let f=(i,o)=>{let[d,f]=n[i],p=a(i,d,f),m=X(t.o,Z(t.u,f));if(d===0){let n=s?s(m,t.u):m;return e.vertex(n,p,s?null:Z(t.u,o[1]<0?-1:1))}let h=[];for(let n=0;n<u;n++){let i=c+(l-c)*n/r,a=X(Z(t.a,Math.cos(i)),Z(t.b,Math.sin(i))),u=Q(X(Z(a,o[0]),Z(t.u,o[1]))),f=X(m,Z(a,d));h.push(s?e.vertex(s(f,u),p):e.vertex(f,p,u))}return h},p=(t,n)=>{for(let a=0;a<r;a++){let r=(a+1)%u;typeof t==`number`?e.tri(t,n[r],n[a],i):typeof n==`number`?e.tri(t[a],t[r],n,i):e.quad(t[a],t[r],n[r],n[a],i)}},m=null;n.forEach((e,t)=>{let n=d[t-1],r=d[t],i=null,a=null;if(n&&r&&!e[2]){let e=[n[0]+r[0],n[1]+r[1]],o=Math.hypot(e[0],e[1])||1;i=a=f(t,[e[0]/o,e[1]/o])}else n&&(i=f(t,n)),r&&(a=f(t,r));m!==null&&i!==null&&p(m,i),m=a})}function Sn(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function Cn(e,t,n,r,i,a,o,s){let c=t.length,l=t.map((e,n)=>Q(en(t[Math.min(n+1,c-1)],t[Math.max(n-1,0)]))),u=Q(en(s,Z(l[0],tn(s,l[0])))),d=[],f=0;for(let i=0;i<c;i++){i&&(f+=rn(en(t[i],t[i-1])),u=Q(en(u,Z(l[i],tn(u,l[i])))));let o=nn(l[i],u),s=[];for(let c=0;c<r;c++){let l=2*Math.PI*c/r,d=X(Z(u,Math.cos(l)),Z(o,Math.sin(l)));s.push(e.vertex(X(t[i],Z(d,n)),a(f),d))}d.push(s)}for(let t=0;t+1<c;t++)for(let n=0;n<r;n++)e.quad(d[t][n],d[t][(n+1)%r],d[t+1][(n+1)%r],d[t+1][n],i);if(o){let n=e.vertex(t[c-1],a(f),l[c-1]),o=d[c-1].map(n=>{let r=[e.p[n*3],e.p[n*3+1],e.p[n*3+2]];return e.vertex(r,a(f),Q(X(l[c-1],Z(Q(en(r,t[c-1])),.35))))});for(let t=0;t<r;t++)e.tri(n,o[t],o[(t+1)%r],i)}}function wn(e,t,n){return Sn(e.map(_n),t).map(([e,t,r])=>vn([e,t,Math.max(r,n)]))}function Tn(){let{az:e,foot:t,top:n,off:r}=cn,i=$(t,e,0),a=$(n,e,0),o=Q(en(a,i)),s=Z(X(i,a),.5),c=Q(en(Z(o,tn(s,o)),s)),u=e=>un.reduce((t,n)=>{let r=X(e,Z(o,n)),i=tn(r,Z(c,-1)),a=tn(r,r)-l*l;return t+(-i+Math.sqrt(i*i-a))/un.length},0),d=i;for(let e=0;e<4;e++)d=X(d,Z(c,r-u(d)));return yn(d,o,c)}function En(e){let t=new i(`heater`),n=Tn(),r=Math.max(14,Math.round(40*e)),a=e=>X(n.o,Z(n.u,e)),s=ln,c=e=>(t,n,r)=>[0,r,0,e];xn(t,n,[[0,-.012],[.022,-.0095],[.036,-.004],[.046,.005],[.051,.016],[s.r,.028],[s.r,.045,!0],[s.rIn,.045,!0],[s.rIn,.035]],r,o.HEATER,c(.92));let[u,d]=s.band;xn(t,n,[[s.rIn,u,!0],[s.r-.0025,u],[s.r,u+.0025],[s.r,d-.0025],[s.r-.0025,d],[s.rIn,d,!0],[s.rIn,u,!0]],r,o.HEATER,c(.9));let f=2*Math.PI/s.bars,p=.5*s.fill*f;for(let[e,r]of[[s.slots[0],u],[d,s.slots[1]]])for(let i=0;i<s.bars;i++){let c=(i+.5)*f,l=e=>X(Z(n.a,Math.cos(e)),Z(n.b,Math.sin(e))),u=e=>X(Z(n.a,-Math.sin(e)),Z(n.b,Math.cos(e))),d=[],m=[];for(let n=0;n<=3;n++){let i=c-p+2*p*n/3,o=n===0?-1:+(n===3),f=Q(X(l(i),Z(u(i),.75*o)));d.push([t.vertex(X(a(e),Z(l(i),s.r)),[0,e,0,.9],f),t.vertex(X(a(r),Z(l(i),s.r)),[0,r,0,.9],f)])}for(let e=0;e+1<d.length;e++)bn(t,d[e][0],d[e+1][0],d[e+1][1],d[e][1],o.HEATER,l(c-p+2*p*(e+.5)/3));for(let n of[c-p,c+p])m.push([t.vertex(X(a(e),Z(l(n),s.rIn)),[0,e,0,.6],Z(l(n),-1)),t.vertex(X(a(r),Z(l(n),s.rIn)),[0,r,0,.6],Z(l(n),-1))]);bn(t,m[0][0],m[1][0],m[1][1],m[0][1],o.HEATER,Z(l(c),-1));for(let[n,i]of[[c-p,-1],[c+p,1]]){let c=Z(u(n),i),d=Q(X(c,Z(l(n),.6))),f=[t.vertex(X(a(e),Z(l(n),s.rIn)),[0,e,0,.55],c),t.vertex(X(a(e),Z(l(n),s.r)),[0,e,0,.75],d),t.vertex(X(a(r),Z(l(n),s.r)),[0,r,0,.75],d),t.vertex(X(a(r),Z(l(n),s.rIn)),[0,r,0,.55],c)];bn(t,f[0],f[1],f[2],f[3],o.HEATER,c)}}xn(t,n,[[0,.03],[s.tube,.03,!0],[s.tube,.4]],r,o.HEATER,()=>[1,0,0,.4]),xn(t,n,[[s.rIn,.39,!0],[s.cap,.39,!0],[s.cap,.394],[s.cap,.452],[.0525,.461],[.048,.467],[.04,.4705],[.022,.4725,!0],[.0175,.475],[.0165,.49],[.0145,.512],[.0128,.522],[.0105,fn,!0],[pn,fn]],r,o.HEATER,c(.95)),xn(t,yn(X(a(dn.h),Z(n.a,s.cap-.0015)),n.a,n.u),[[dn.r,-.003],[dn.r,6e-4,!0],[.0085,.0021],[.0062,.0033],[.0033,.004],[0,.0042]],Math.max(10,Math.round(20*e)),o.HEATER_LAMP,(e,t)=>[t/dn.r,0,0,1]);let m=Math.max(12,Math.round(32*e));for(let r of un){let i=s.r+6e-4,c=s.r+.0078,u=.011,d=[Math.PI-2.25,Math.PI+2.25],f=(e,t)=>[1,(t-i)/(c-i),0,.85];xn(t,{...n,o:a(r)},[[i,-.011,!0],[c,-.011,!0],[c,u,!0],[i,u,!0],[i,-.011,!0]],Math.max(8,Math.round(18*e)),o.SUCTION,f,d);for(let[e,s]of[[d[0],-1],[d[1],1]]){let l=X(Z(n.a,Math.cos(e)),Z(n.b,Math.sin(e))),d=Z(X(Z(n.a,-Math.sin(e)),Z(n.b,Math.cos(e))),s),p=[[i,-.011],[c,-.011],[c,u],[i,u]].map(([e,n])=>t.vertex(X(a(r+n),Z(l,e)),f(0,e),d));bn(t,p[0],p[1],p[2],p[3],o.SUCTION,d)}let p=X(a(r),Z(n.a,-c));xn(t,yn(Z(Q(p),l-on),Z(Q(p),-1),n.u),[[0,0],[.047,0,!0],[.0466,.0024,!0],[.041,.006],[.032,.0108],[.0225,.0152],[.0148,.018],[.0106,.0194,!0],[.0086,.021],[.0086,l-on-rn(p)+.004]],m,o.SUCTION,(e,t)=>[0,t/.047,0,.7+.25*an(.047,.03,t)])}let h=a(.513),g=_n(a(.595)),_=cn.az;Cn(t,wn([h,a(.555),vn([g[0],g[1]-.01,.06]),$(.3,_-.03,sn),$(.56,_-.07,.045),$(.78,_-.1,.022),$(.866,_-.11,sn)],Math.max(4,Math.round(12*e)),sn),pn,Math.max(6,Math.round(9*e)),o.HEATER,e=>[2,e,0,.9],!0,n.a);let v=[{a:a(-.012),b:a(.48),r:.115,solid:.064},{a:h,b:$(.27,_-.025,sn),r:.063,solid:.013}];return{mesh:{...t.finish(),onGlass:!0},obstacles:v}}function Dn(e){let t=new i(`filter`),n=mn,r=[n.at[0],d,n.at[1]],s=yn(r,[0,1,0],[-n.at[0],0,-n.at[1]]),c=Math.max(16,Math.round(48*e));xn(t,s,[[0,-.012],[.118,-.012,!0],[.123,-.004],[n.base,.008],[n.base,.018],[.1225,.0255],[.117,n.baseTop-.001],[.11,n.baseTop,!0],[0,n.baseTop]],c,o.TUBE,(e,t,n)=>[2,n,0,n<.005?.55:.88]);let f=Math.max(10,Math.round(28*e)),p=[[n.sponge-.004,n.baseTop-.002],[n.sponge-.001,n.baseTop+.004]];for(let e=0;e<=f;e++)p.push([n.sponge,n.baseTop+.012+(n.spongeTop-n.baseTop-.026)*e/f]);p.push([n.sponge-.002,n.spongeTop-.006],[n.sponge-.009,n.spongeTop-5e-4],[.07,n.spongeTop],[.03,n.spongeTop]),xn(t,s,p,Math.max(20,Math.round(64*e)),o.SPONGE,(e,t,r)=>[0,r-n.baseTop,0,t<.06?.75:.62+.33*an(n.baseTop,n.baseTop+.08,r)],null,(e,t)=>{let r=e[1]-d,i=an(n.baseTop,n.baseTop+.02,r)*(t[1]>.7?.5:1);return X(e,Z(t,(.0028*u(e[0]*38,e[1]*38,e[2]*38,3)+.0018*a(e[0]*11+3.1,e[1]*7,e[2]*11))*i))});let m=n.tube,h=m-.0055;xn(t,s,[[0,n.spongeTop-.006],[.043,n.spongeTop-.006,!0],[.0445,n.spongeTop+.002],[.0445,n.spongeTop+.008],[.041,n.spongeTop+.0125],[.034,n.spongeTop+.0145,!0],[.032,n.spongeTop+.0145,!0],[.032,n.spongeTop+.026],[.0295,n.spongeTop+.029,!0],[m,n.spongeTop+.029,!0],[m,n.tubeTop-.004],[m-.0012,n.tubeTop-4e-4],[m-.003,n.tubeTop,!0],[h+.001,n.tubeTop,!0],[h,n.tubeTop-.0015],[h,n.tubeTop-.06,!0],[0,n.tubeTop-.06]],Math.max(14,Math.round(32*e)),o.TUBE,(e,t,r)=>e>=14?[1,r,0,.25+.5*an(n.tubeTop-.05,n.tubeTop,r)]:[0,r,0,.9]);let g=[0,0,-1],_=X(r,[0,n.air,0]);Cn(t,Sn([X(_,Z(g,m-.004)),X(X(_,Z(g,m+.016)),[0,.004,0])],3),.0132,Math.max(8,Math.round(12*e)),o.TUBE,e=>[4,e,0,.85],!0,[0,1,0]);let v=Math.atan2(-Math.sqrt(l*l-n.at[0]*n.at[0]),n.at[0]);Cn(t,wn([X(_,Z(g,m+.004)),X(X(_,Z(g,m+.045)),[0,.006,0]),X(X(_,Z(g,.17)),[0,-.012,0]),$(.02,v,.03),$(.3,v-.03,sn),$(.56,v-.07,.045),$(.78,v-.09,.022),$(.866,v-.095,sn)],Math.max(4,Math.round(12*e)),sn),hn,Math.max(6,Math.round(9*e)),o.TUBE,e=>[3,e,0,.9],!0,[0,1,0]);let y=[{a:X(r,[0,-.01,0]),b:X(r,[0,n.spongeTop,0]),r:.158,solid:.108},{a:X(r,[0,n.spongeTop,0]),b:X(r,[0,n.tubeTop,0]),r:.08,solid:.03},{a:_,b:$(.27,v-.025,sn),r:.064,solid:.014}];return{mesh:{...t.finish(),onGlass:!0},obstacles:y,bubbles:{at:X(r,[0,n.tubeTop-.01,0]),...gn}}}function On(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=En(t),r=Dn(t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles],bubbles:r.bubbles}}var kn=`
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
`,An=[[`wood`,f],[`rocks`,Ee],[`plants`,et],[`equipment`,$t]];An.map(([e])=>e);function jn(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=e?.only;return An.filter(([e])=>!n||n.includes(e)).map(([e,n])=>({name:e,...n.build({detail:t})}))}var Mn=An.map(([,e])=>e.WGSL);export{jn as n,Mn as t};