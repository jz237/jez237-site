import{t as e}from"./rolldown-runtime-DK3Fl9T5.js";import{a as t,c as n,i as r,l as i,n as a,r as o,s,t as c}from"./mesh-COPocGfL.js";import{i as l,n as u,t as d}from"./plantMotion-BGlikTyn.js";var f={wood:[[-.505,-.601,-.054,-.493,-.57,-.056,.11],[-.493,-.57,-.056,-.481,-.538,-.058,.118],[-.481,-.538,-.058,-.469,-.507,-.06,.108],[-.469,-.507,-.06,-.448,-.481,-.06,.124],[-.448,-.481,-.06,-.426,-.456,-.061,.112],[-.426,-.456,-.061,-.405,-.43,-.061,.112],[-.405,-.43,-.061,-.375,-.415,-.057,.123],[-.375,-.415,-.057,-.346,-.399,-.054,.12],[-.346,-.399,-.054,-.316,-.384,-.05,.122],[-.316,-.384,-.05,-.287,-.376,-.065,.084],[-.287,-.376,-.065,-.259,-.367,-.08,.084],[-.259,-.367,-.08,-.23,-.359,-.095,.098],[-.23,-.359,-.095,-.199,-.352,-.106,.08],[-.199,-.352,-.106,-.168,-.344,-.117,.082],[-.168,-.344,-.117,-.137,-.337,-.128,.079],[-.137,-.337,-.128,-.105,-.327,-.133,.099],[-.105,-.327,-.133,-.073,-.318,-.139,.1],[-.073,-.318,-.139,-.041,-.308,-.144,.104],[-.041,-.308,-.144,-.009,-.299,-.149,.105],[-.009,-.299,-.149,.023,-.289,-.155,.118],[.023,-.289,-.155,.055,-.28,-.16,.114],[.055,-.28,-.16,.089,-.277,-.159,.088],[.089,-.277,-.159,.122,-.274,-.159,.1],[.122,-.274,-.159,.156,-.271,-.158,.099],[.156,-.271,-.158,.204,-.283,-.162,.108],[.204,-.283,-.162,.252,-.296,-.166,.098],[.252,-.296,-.166,.294,-.323,-.168,.108],[.294,-.323,-.168,.335,-.351,-.171,.112],[.335,-.351,-.171,.357,-.374,-.161,.133],[.357,-.374,-.161,.38,-.396,-.15,.14],[.38,-.396,-.15,.402,-.419,-.14,.14],[.402,-.419,-.14,.421,-.447,-.141,.096],[.421,-.447,-.141,.439,-.476,-.141,.096],[.439,-.476,-.141,.458,-.504,-.142,.096],[.458,-.504,-.142,.469,-.536,-.141,.15],[.469,-.536,-.141,.48,-.567,-.14,.125],[.48,-.567,-.14,.491,-.599,-.139,.122],[.491,-.599,-.139,.494,-.633,-.137,.119],[.494,-.633,-.137,.498,-.666,-.136,.119],[.498,-.666,-.136,.501,-.7,-.134,.119],[.117,-.272,-.161,.127,-.246,-.187,.057],[.127,-.246,-.187,.137,-.219,-.212,.074],[.137,-.219,-.212,.147,-.193,-.238,.075],[.147,-.193,-.238,.164,-.161,-.25,.072],[.164,-.161,-.25,.181,-.129,-.263,.062],[.181,-.129,-.263,.198,-.097,-.275,.078],[.198,-.097,-.275,.218,-.065,-.28,.07],[.218,-.065,-.28,.239,-.033,-.286,.055],[.239,-.033,-.286,.259,-.001,-.291,.051],[-.313,-.383,-.051,-.311,-.425,-.031,.058],[-.311,-.425,-.031,-.309,-.467,-.012,.058],[-.309,-.467,-.012,-.301,-.501,.019,.074],[-.301,-.501,.019,-.294,-.534,.05,.072],[-.294,-.534,.05,-.296,-.573,.075,.072],[-.296,-.573,.075,-.298,-.613,.099,.063]],rocks:[[-.442,-.548,.333,-.4,-.548,.32,.114],[-.4,-.548,.32,-.358,-.548,.307,.114],[.158,-.59,.233,.182,-.59,.247,.085],[.395,-.583,.057,.421,-.583,.025,.065],[.614,-.59,.118,.626,-.59,.122,.049]]};function p(e){return(f[e]??[]).map(e=>({a:e.slice(0,3),b:e.slice(3,6),r:0,solid:0,fin:e[6]}))}var m=e({WGSL:()=>Oe,build:()=>ge}),h=Math.PI*2,g=e=>e<0?0:e>1?1:e,_=(e,t,n)=>{let r=g((n-e)/(t-e));return r*r*(3-2*r)},v=e=>e-h*Math.round(e/h);function y(e,t,n){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,739982445);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}var b={e:0,nu:0,nv:0,pair:0,cell:0};function x(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=1e9,s=1e9,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0;for(let g=-1;g<=1;g++)for(let _=-1;_<=1;_++){let v=i+_,b=a+g,x=(v%n+n)%n,S=v+.06+.88*y(x,b,r),C=b+.06+.88*y(x,b,r+1013),w=S-e,T=C-t,E=w*w+T*T,D=x*7919+(b+4096)*131;E<o?(s=o,u=c,d=l,p=f,o=E,c=S,l=C,f=D,m=x,h=b):E<s&&(s=E,u=S,d=C,p=D)}let g=u-c,_=d-l,v=Math.hypot(g,_)||1;g/=v,_/=v,b.e=((c+u)*.5-e)*g+((l+d)*.5-t)*_,b.nu=g,b.nv=_,b.pair=y(Math.min(f,p),Math.max(f,p),r+77),b.cell=y(m,h,r+5)}var S={depth:0,shoulder:0,e:0,cell:0},C=new Float64Array(25),w=new Float64Array(25),T=new Int32Array(25);function E(e,t,n,r,i,a,o,s,c=1){let l=Math.floor(e),u=Math.floor(t),d=1e9,f=12;for(let i=-2,a=0;i<=2;i++)for(let o=-2;o<=2;o++,a++){let s=l+o,c=u+i,p=(s%n+n)%n,m=y(p,c,r),h=m*65536%1;if(C[a]=s+.06+.88*m,w[a]=c+.06+.88*h,T[a]=p*7919+(c+4096)*131,Math.abs(o)<2&&Math.abs(i)<2){let n=C[a]-e,r=w[a]-t,i=n*n+r*r;i<d&&([d,f]=[i,a])}}let p=C[f],m=w[f],h=T[f],g=0,v=0,b=1e9;for(let n=0;n<25;n++){if(n===f)continue;let l=C[n]-p,u=w[n]-m,d=Math.sqrt(l*l+u*u);l/=d,u/=d;let x=((p+C[n])*.5-e)*l+((m+w[n])*.5-t)*u,S=l/i,E=u/a,D=Math.sqrt(S*S+E*E),O=x/D;if(O<b&&(b=O),O>o*3.6*c)continue;let k=y(Math.min(h,T[n]),Math.max(h,T[n]),r+77),A=_(.35,.8,Math.abs(E)/D),j=(.5+.7*k)*(1-(1-s)*A),ee=o*(.7+.6*(k*977%1))*(1-.15*A)*(1+(c-1)*A),M=O/ee;M<1&&(g=Math.max(g,j*(1-_(0,1,M))**1.6)),v=Math.max(v,j*(1-_(ee,ee*3.2,O)))}return S.depth=g,S.shoulder=v,S.e=b,S.cell=y(h,5,r+5),S}function D(e,t,r,a,o){let s=e.length,c=(e,t)=>[2*t[0]-e[0],2*t[1]-e[1],2*t[2]-e[2]],l=[c(e[1],e[0]),...e,c(e[s-2],e[s-1])],u=[],d=(e,t)=>Math.sqrt(Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]))||1e-6;for(let e=0;e<s-1;e++){let[t,n,r,i]=[l[e],l[e+1],l[e+2],l[e+3]],a=d(t,n),o=a+d(n,r),s=o+d(r,i);for(let e=0;e<64;e++){let c=a+(o-a)*e/64,l=[0,0,0];for(let e=0;e<3;e++){let u=(a-c)/a*t[e]+c/a*n[e],d=(o-c)/(o-a)*n[e]+(c-a)/(o-a)*r[e],f=(s-c)/(s-o)*r[e]+(c-o)/(s-o)*i[e],p=(o-c)/o*u+c/o*d,m=(s-c)/(s-a)*d+(c-a)/(s-a)*f;l[e]=(o-c)/(o-a)*p+(c-a)/(o-a)*m}u.push(l)}}u.push(e[s-1]);let f=[0],p=()=>{for(let e=1;e<u.length;e++){let[t,n]=[u[e-1],u[e]];f[e]=f[e-1]+Math.hypot(n[0]-t[0],n[1]-t[1],n[2]-t[2])}};p();let m=f[u.length-1];for(let e=0;e<u.length;e++){let t=o*_(0,.12,f[e])*_(m,m-.12,f[e]);for(let r=0;r<3;r++)u[e][r]+=t*n(f[e]*2.7,a*.53,r*3.7)}p();let g=f[f.length-1],v=Math.max(3,Math.round(g/t)+1),y=g/(v-1),b=new Float64Array(v*3),x=new Float64Array(v*3),S=new Float64Array(v*3),C=new Float64Array(v*3),w=new Float64Array(v),T=0;for(let e=0;e<v;e++){let t=e*y;for(;T<u.length-2&&f[T+1]<t;)T++;let n=(t-f[T])/(f[T+1]-f[T]||1);for(let t=0;t<3;t++)b[e*3+t]=u[T][t]+(u[T+1][t]-u[T][t])*n}for(let e=0;e<v;e++){let t=Math.max(0,e-1),n=Math.min(v-1,e+1),r=[b[n*3]-b[t*3],b[n*3+1]-b[t*3+1],b[n*3+2]-b[t*3+2]],i=Math.hypot(r[0],r[1],r[2]);for(let t=0;t<3;t++)x[e*3+t]=r[t]/i}{let e=Math.abs(x[1])<.9?[0,1,0]:[1,0,0],t=e[0]*x[0]+e[1]*x[1]+e[2]*x[2],n=[e[0]-t*x[0],e[1]-t*x[1],e[2]-t*x[2]],r=Math.hypot(n[0],n[1],n[2]);for(let e=0;e<3;e++)S[e]=n[e]/r}for(let e=0;e<v-1;e++){let t=[b[e*3+3]-b[e*3],b[e*3+4]-b[e*3+1],b[e*3+5]-b[e*3+2]],n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=[S[e*3],S[e*3+1],S[e*3+2]],i=[x[e*3],x[e*3+1],x[e*3+2]],a=2/n*(t[0]*r[0]+t[1]*r[1]+t[2]*r[2]),o=2/n*(t[0]*i[0]+t[1]*i[1]+t[2]*i[2]),s=[r[0]-a*t[0],r[1]-a*t[1],r[2]-a*t[2]],c=[i[0]-o*t[0],i[1]-o*t[1],i[2]-o*t[2]],l=[x[e*3+3]-c[0],x[e*3+4]-c[1],x[e*3+5]-c[2]],u=2/(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]||1e-12)*(l[0]*s[0]+l[1]*s[1]+l[2]*s[2]);for(let t=0;t<3;t++)S[e*3+3+t]=s[t]-u*l[t]}for(let e=0;e<v;e++){let[t,n,r]=[x[e*3],x[e*3+1],x[e*3+2]],[i,a,o]=[S[e*3],S[e*3+1],S[e*3+2]];C[e*3]=n*o-r*a,C[e*3+1]=r*i-t*o,C[e*3+2]=t*a-n*i}w[0]=i(a)()*h;for(let e=1;e<v;e++)w[e]=w[e-1]+y*r*(1+.7*n(e*y*1.7,a*.37,.3));return{count:v,step:y,L:g,c:b,t:x,r:S,b:C,tau:w}}var O={cx:0,cy:0,cz:0,rx:0,ry:0,rz:0,bx:0,by:0,bz:0,tx:0,ty:0,tz:0,tau:0};function k(e,t){let n=t/e.step,r=Math.floor(n);r<0&&(r=0),r>e.count-2&&(r=e.count-2),n-=r;let i=r+1,a=1-n;return O.cx=e.c[r*3]*a+e.c[i*3]*n,O.cy=e.c[r*3+1]*a+e.c[i*3+1]*n,O.cz=e.c[r*3+2]*a+e.c[i*3+2]*n,O.rx=e.r[r*3]*a+e.r[i*3]*n,O.ry=e.r[r*3+1]*a+e.r[i*3+1]*n,O.rz=e.r[r*3+2]*a+e.r[i*3+2]*n,O.bx=e.b[r*3]*a+e.b[i*3]*n,O.by=e.b[r*3+1]*a+e.b[i*3+1]*n,O.bz=e.b[r*3+2]*a+e.b[i*3+2]*n,O.tx=e.t[r*3]*a+e.t[i*3]*n,O.ty=e.t[r*3+1]*a+e.t[i*3+1]*n,O.tz=e.t[r*3+2]*a+e.t[i*3+2]*n,O.tau=e.tau[r]*a+e.tau[i]*n,O}function A(e,t){let n=Math.max(3,Math.round(e.L/t)+1),r=e.L/(n-1),i=new Float64Array(n*3),a=new Float64Array(n*3),o=new Float64Array(n*3),s=new Float64Array(n*3),c=new Float64Array(n);for(let t=0;t<n;t++){let n=k(e,t*r),l=Math.hypot(n.tx,n.ty,n.tz),u=n.tx/l,d=n.ty/l,f=n.tz/l,p=n.rx*u+n.ry*d+n.rz*f,m=n.rx-p*u,h=n.ry-p*d,g=n.rz-p*f,_=Math.hypot(m,h,g);m/=_,h/=_,g/=_,i.set([n.cx,n.cy,n.cz],t*3),a.set([u,d,f],t*3),o.set([m,h,g],t*3),s.set([d*g-f*h,f*m-u*g,u*h-d*m],t*3),c[t]=n.tau}return{count:n,step:r,L:e.L,c:i,t:a,r:o,b:s,tau:c}}function j(e,t,n){if(e.caps[1]!==`broken`)return{rings:t.count,sOf:e=>e*t.step};let r=e.sBreak,i=r-.025,a=Math.floor(i/t.step),o=Math.round(r/t.step);return{rings:o+1,sOf:(i,s)=>{if(i<=a)return i*t.step;let c=(i-a)/(o-a),l=a*t.step;return l+c*(r+e.brk.rim(h*s/n)-l)}}}function ee(e,t){let n=Math.min(Math.max(t/e.step,0),e.count-1.001),r=Math.floor(n);return e.c[r*3+1]+(e.c[r*3+4]-e.c[r*3+1])*(n-r)}function M(e,t){let n=1e9,r=0;for(let i=0;i<e.count;i++){let a=(e.c[i*3]-t[0])**2+(e.c[i*3+1]-t[1])**2+(e.c[i*3+2]-t[2])**2;a<n&&([n,r]=[a,i])}return r*e.step}var te=[{name:`arch`,pts:[[-.522,-.7,-.04],[-.514,-.632,-.048],[-.486,-.528,-.058],[-.425,-.443,-.07],[-.318,-.386,-.05],[-.178,-.344,-.122],[-.038,-.296,-.146],[.083,-.268,-.16],[.198,-.277,-.162],[.307,-.331,-.19],[.398,-.414,-.148],[.462,-.522,-.141],[.494,-.633,-.136],[.501,-.7,-.134]],radius:[[0,.092],[.07,.094],[.18,.08],[.3,.064],[.42,.07],[.56,.084],[.64,.088],[.74,.07],[.85,.08],[.93,.096],[1,.094]],around:176,ds:.0039,wiggle:.022,twist:1.7,flat:.28,lobe:.11,flute:.26,gnarl:.26,plates:17,plateLength:.26,depth:.19,width:.0055,knuckles:[[[-.36,-.396,-.085],.16,.08],[[.33,-.342,-.15],.18,.09],[[-.08,-.316,-.14],.1,.06],[[.05,-.286,-.15],-.08,.05]],knots:[[[-.27,-.333,-.03],.014,.04,.02,`pit`],[[0,-.222,-.12],.011,.032,.014,`boss`],[[.33,-.316,-.08],0,.06,.03,`burl`],[[.45,-.466,-.06],.01,.03,.012,`boss`],[[-.47,-.501,.03],.012,.035,.016,`pit`],[[.12,-.299,-.24],.012,.04,.016,`pit`],[[-.12,-.29,-.1],0,.06,.02,`burl`],[[-.36,-.366,-.05],0,.055,.026,`burl`],[[0,-.325,-.07],0,.05,.022,`burl`],[[.43,-.389,-.12],0,.06,.028,`burl`],[[.27,-.29,-.22],0,.045,.02,`burl`]],seed:11,caps:[`buried`,`buried`]},{name:`broken`,parent:0,pts:[[.115,-.268,-.163],[.143,-.2,-.232],[.183,-.12,-.268],[.232,-.042,-.284],[.27,.015,-.293]],radius:[[0,.058],[.3,.052],[.7,.045],[1,.04]],around:144,ds:.0035,wiggle:.006,twist:2.6,flat:.16,lobe:.08,flute:.2,gnarl:.17,plates:12,plateLength:.2,depth:.19,width:.00495,knuckles:[],knots:[[[.232,-.11,-.262],.009,.026,.01,`boss`]],fillet:.06,reach:[.12,.2],seed:23,caps:[`inside`,`broken`],breakAt:.04},{name:`left`,parent:0,pts:[[-.31,-.385,-.05],[-.305,-.457,-.02],[-.288,-.54,.055],[-.298,-.63,.11],[-.292,-.7,.13]],radius:[[0,.056],[.35,.049],[.75,.042],[1,.04]],around:144,ds:.0037,wiggle:.012,twist:-2.1,flat:.22,lobe:.09,flute:.22,gnarl:.2,plates:12,plateLength:.22,depth:.19,width:.00495,knuckles:[[[-.29,-.56,.07],.1,.05]],knots:[[[-.34,-.501,.1],.01,.03,.012,`pit`]],fillet:.07,reach:[.12,.22],seed:37,caps:[`inside`,`buried`]}];function ne(e=1){let t=[];for(let[n,r]of te.entries()){let a={...r,index:n,pts:r.pts.map(e=>e.slice())};if(a.parent!==void 0){let e=t[a.parent].ref,n=M(e,a.pts[0]),r=k(e,n);a.pts[0]=[r.cx,r.cy,r.cz],a.junction=n,a.shrink=e=>.6+.4*_(0,.0525,e)}let o=a.ref=D(a.pts,a.ds,a.twist,a.seed,a.wiggle);a.roundScale=e**.75,a.alongScale=e**1.25,a.coarse=Math.max(1,1/a.roundScale),a.coarseAlong=Math.max(1,1/a.alongScale),a.refAround=r.around,a.around=e===1?r.around:Math.max(16,Math.round(r.around*a.roundScale)),a.spine=e===1?o:A(o,r.ds/a.alongScale),a.caps[1]===`broken`&&(a.brk=he(a.seed+5),a.sBreak=o.L-a.breakAt),a.knuckleS=a.knuckles.map(([e,t,n])=>[M(o,e),t,n]),a.knotS=a.knots.map(([e,t,n,r,i],s)=>{let c=M(o,e),l=k(o,c),u=[e[0]-l.cx,e[1]-l.cy,e[2]-l.cz];return{s:c,phi:((Math.atan2(u[0]*l.bx+u[1]*l.by+u[2]*l.bz,u[0]*l.rx+u[1]*l.ry+u[2]*l.rz)-l.tau)%h+h)%h,eye:t,spread:n,height:r,kind:i,brk:i===`boss`?he(a.seed*31+s):null}});let s=i(a.seed+101);a.flutes=Array.from({length:5},(e,t)=>({phi:t/5*h+s()*1,drift:(s()-.5)*1.5,width:.22+.3*s(),depth:a.flute*(.5+.8*s()),freq:1.5+2*s(),seed:a.seed+t*7.7})),t.push(a)}return t}var N={L:null,s:NaN,r:0};function re(e,t,n){if(N.L===e&&N.s===n)return N.r;let r=n/t.L,i=e.radius,a=i[i.length-1][1];for(let e=0;e<i.length-1;e++)if(r<=i[e+1][0]){a=i[e][1]+(i[e+1][1]-i[e][1])*_(i[e][0],i[e+1][0],r);break}a*=1+.2*s(n*4+e.seed,.31,.77,2);for(let[t,r,i]of e.knuckleS)a*=1+r*Math.exp(-(((n-t)/i)**2));return Object.assign(N,{L:e,s:n,r:a}),a}var P={L:null,s:NaN,e:0,al:0,a3:0,b3:0,a4:0,b4:0,a5:0,b5:0,foot:1,fc:[0],fd:[0]};function ie(e,t,r){if(P.s!==t||P.L!==e){let r=e.seed*1.37;P.s=t,P.L=e,P.e=e.flat*(.55+.45*n(t*2.3,r,.5)),P.al=e.seed+1.4*n(t*1.2,r+3.1,1.7),P.a3=e.lobe*(.6+.6*n(t*3.1,r,4.4)),P.b3=2.2*n(t*1.6,r,5.5),P.a4=e.lobe*.7*(.5+.7*n(t*3.7,r,6.6)),P.b4=2.2*n(t*1.9,r,7.7),P.a5=e.lobe*.5*(.4+.8*n(t*4.3,r,8.8)),P.b5=2.2*n(t*2.2,r,9.9),P.foot=1+.9*Math.exp(-(((ee(e.ref,t)-c)/.07)**2)),P.fc=e.flutes.map(e=>e.phi+e.drift*t+.5*n(t*2.6,e.seed,.2)),P.fd=e.flutes.map(e=>e.depth*_(-.25,.35,n(t*e.freq,e.seed,3.3)))}let i=1+P.e*Math.cos(2*(r-P.al));i+=(P.a3*Math.cos(3*r+P.b3)+P.a4*Math.cos(4*r+P.b4)+P.a5*Math.cos(5*r+P.b5))*P.foot;for(let t=0;t<e.flutes.length;t++){let n=v(r-P.fc[t]);i-=P.fd[t]*Math.exp(-((n/e.flutes[t].width)**2))}let a=Math.max(.16-Math.abs(i-.6),0)/.16;return Math.max(i,.6)+a*a*.04}var ae={d:0,z:0};function oe(e,t,r,i,a,o,s){let c=e.plates,l=e.plateLength,u=Math.sqrt(e.coarse),d=Math.sqrt(e.coarseAlong),f=g(2-e.coarse),p=e.width*u,m=d/u,y=Math.min(Math.max(s,.6*o),1.3*o),b=h*y/c,x=e.seed*.71,C=r/h*c+.55*n(i*1.1+x,a*1.1,t*1.5)+.2*n(i*2.7,a*2.7+x,t*5.3),w=t/l+.4*n(i*1.3+9.1,a*1.3,t*1.9+x),T=0,D=0;for(let i of e.knotS){let e=(t-i.s)/(i.kind===`burl`?1.4:2.6);if(Math.abs(e)>5*i.spread)continue;let a=v(r-i.phi)*o,s=a*a+e*e,c=Math.sqrt(s);if(c>5*i.spread)continue;let l=i.height*Math.exp(-((c/i.spread)**2))*(1+.2*n(a*55,e*55,i.s*9));if(i.kind===`burl`){T+=l,C+=.25*a*Math.exp(-((c/i.spread)**2))/b;continue}let d=(i.eye*1.6)**2,f=Math.exp(-((c/(2.6*i.spread))**2)),p=s>d?a*(1-d/s):0;C+=(p-a)*f/b;let m=Math.atan2(e,a);c*=1+.3*n(Math.cos(m)*2,Math.sin(m)*2,i.s*5),D=Math.max(D,1-_(i.eye*.9,i.eye*1.7,c));let h=.45*i.height*Math.exp(-(((c-i.eye)/(.35*i.eye*u))**2)),g;g=i.kind===`pit`?-.45*i.height*(1-_(0,i.eye*.8,c)):_(0,1,(i.eye-c)/(.3*i.eye))*(.8*i.height+i.brk.height(Math.min(c/(.7*i.eye),1),m)*(i.eye/.05)),T+=l+h+g}let O=_(.36,.66,n(i*.8+x,a*.8+2.2,t*2.2+4.1)),k=e.depth*y,A=.6+.4*n(i*2.1,a*2.1+x,t*7.3);E(C,w,c,e.seed,b,l,p,.2,m);let j=A*S.depth,ee=.25*A*S.shoulder,M=(.26*S.cell+.1*n(C*1.7,w*2.3,x))*_(0,p*3,S.e),te=_(-.35,.2,n(i*1.6+5,a*1.6,t*3.1+x));if(te>0){let t=2.27/u,n=1.9/d;E(C*t+.5,w*n+.3,Math.round(c*t),e.seed+3,b/t,l/n,p*.8,.25,m),j=Math.max(j,.55*te*S.depth)}let ne=C*1.7+.35*n(i*3.1,a*3.1+x,t*6.1),N=.2*(.5+.5*Math.cos(h*ne))**(3/e.coarse)*A,re=f>0?.1*n(i*16+x,a*16,t*22)*f:0,P=(1-.5*O)*(1-D),ie=(j+(ee+M+N+re)*(1-.6*O))*P,oe=g(ie/(.85*e.coarse**.075));return ae.z=e.coarse>1?oe**e.coarse**.13:oe,ae.d=ie*k-T,ae}var F={cx:0,cy:0,cz:0,dx:0,dy:0,dz:0,r0:0,rb:0};function se(e,t,r,i){let a=k(t,r),o=i+a.tau,c=Math.cos(o),l=Math.sin(o),u=c*a.rx+l*a.bx,d=c*a.ry+l*a.by,f=c*a.rz+l*a.bz,p=Math.sqrt(u*u+d*d+f*f);u/=p,d/=p,f/=p;let m=re(e,t,r);e.shrink&&(m*=e.shrink(r));let h=m*ie(e,r,i),g=a.cx+u*h,_=a.cy+d*h,v=a.cz+f*h;return h*=1+e.gnarl*(.6*s(g*3.4+1.7,_*3.4,v*3.4,2)+.45*n(Math.cos(i)*1.3+e.seed,Math.sin(i)*1.3,r*6.5)),F.cx=a.cx,F.cy=a.cy,F.cz=a.cz,F.dx=u,F.dy=d,F.dz=f,F.r0=m,F.rb=h,F}function ce(e,t,n){let r=e.around,i=e.rings,a=i*r,o={L:e,sp:t,N:r,rings:i,px:new Float64Array(a),py:new Float64Array(a),pz:new Float64Array(a),dx:new Float64Array(a),dy:new Float64Array(a),dz:new Float64Array(a),cx:new Float64Array(a),cy:new Float64Array(a),cz:new Float64Array(a),base:new Float64Array(a),rad:new Float64Array(a),s:new Float64Array(a),z:new Float64Array(a),ao:new Float64Array(a).fill(1),inside:new Uint8Array(a),nx:new Float64Array(a),ny:new Float64Array(a),nz:new Float64Array(a),b0:new Float64Array(a)},s=new Float64Array(r),c=new Float64Array(r);for(let e=0;e<r;e++)s[e]=Math.cos(h*e/r),c[e]=Math.sin(h*e/r);for(let a=0;a<i;a++)for(let i=0;i<r;i++){let l=a*r+i,u=n(a,i),d=h*i/r,f=se(e,t,u,d),p=oe(e,u,d,s[i],c[i],f.r0,f.rb),m=f.rb-p.d;o.px[l]=f.cx+f.dx*m,o.py[l]=f.cy+f.dy*m,o.pz[l]=f.cz+f.dz*m,o.dx[l]=f.dx,o.dy[l]=f.dy,o.dz[l]=f.dz,o.cx[l]=f.cx,o.cy[l]=f.cy,o.cz[l]=f.cz,o.base[l]=f.rb,o.rad[l]=m,o.s[l]=u,o.z[l]=p.z,o.b0[l]=u===a*t.step?f.rb:se(e,t,a*t.step,d).rb}let l=2.5;for(let e=0;e<2;e++)for(let e=0;e<i;e++)for(let n=0;n<r;n++){let a=e*r+n,s=l*h*o.base[a]/r,c=l*t.step,u=o.base[a]-o.rad[a],d=u;for(let[t,l]of[[e*r+(n+1)%r,s],[e*r+(n+r-1)%r,s],[e>0?a-r:a,c],[e<i-1?a+r:a,c]])d=Math.min(d,o.base[t]-o.rad[t]+l);d<u&&u>0&&(o.z[a]*=Math.max(d,0)/u),o.rad[a]=o.base[a]-d}let u=new Float64Array(a),d=new Float64Array(a),f=new Float64Array(a);for(let e=0;e<a;e++)u[e]=o.cx[e]+o.dx[e]*o.base[e],d[e]=o.cy[e]+o.dy[e]*o.base[e],f[e]=o.cz[e]+o.dz[e]*o.base[e];o.bnx=new Float64Array(a),o.bny=new Float64Array(a),o.bnz=new Float64Array(a),ye(o,u,d,f,o.bnx,o.bny,o.bnz);for(let t=0;t<a;t++){let n=e.sBreak===void 0?0:_(e.sBreak-.045,e.sBreak-.02,o.s[t]),r=o.bnx[t]+(o.dx[t]-o.bnx[t])*n,i=o.bny[t]+(o.dy[t]-o.bny[t])*n,a=o.bnz[t]+(o.dz[t]-o.bnz[t])*n,s=Math.sqrt(r*r+i*i+a*a)||1;o.bnx[t]=r/=s,o.bny[t]=i/=s,o.bnz[t]=a/=s;let c=o.base[t]-o.rad[t];o.px[t]=u[t]-r*c,o.py[t]=d[t]-i*c,o.pz[t]=f[t]-a*c}return o.bs=o.base.slice(),o.r0=o.rad.slice(),o}var le={i:0,jf:0};function ue(e,t,n,r,i,a){let{sp:o,N:s}=e,c=Math.max(1,Math.floor((a-i)/20)),l=1e9,u=i;for(let e=i;e<=a;e+=c){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}for(let e=Math.max(i,u-c),s=Math.min(a,u+c);e<=s;e++){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}let d=(t-o.c[u*3])*o.t[u*3]+(n-o.c[u*3+1])*o.t[u*3+1]+(r-o.c[u*3+2])*o.t[u*3+2],f=u+d/o.step,p=Math.min(Math.max(f,i),a),m=Math.min(Math.floor(p),a-1),g=p-m,_=m+1,v=1-g,y=e=>o.c[m*3+e]*v+o.c[_*3+e]*g,b=t-y(0),x=n-y(1),S=r-y(2),C=b*(o.r[m*3]*v+o.r[_*3]*g)+x*(o.r[m*3+1]*v+o.r[_*3+1]*g)+S*(o.r[m*3+2]*v+o.r[_*3+2]*g),w=b*(o.b[m*3]*v+o.b[_*3]*g)+x*(o.b[m*3+1]*v+o.b[_*3+1]*g)+S*(o.b[m*3+2]*v+o.b[_*3+2]*g),T=(Math.atan2(w,C)-(o.tau[m]*v+o.tau[_]*g))/h*s;T=(T%s+s)%s;let E=Math.floor(T),D=T-E,O=(E+1)%s;le.i=g<.5?m:_,le.jf=T;let k=(e.b0[m*s+E]*(1-D)+e.b0[m*s+O]*D)*v+(e.b0[_*s+E]*(1-D)+e.b0[_*s+O]*D)*g,A=Math.sqrt(C*C+w*w)-k,j=Math.max(i-f,f-a)*o.step;return j<=0?A:A>0?Math.sqrt(A*A+j*j):j}var de=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},fe=[0,0,0];function pe(e,t,n,r,i){let a=e.sp,o=n-a.c[t*3],s=r-a.c[t*3+1],c=i-a.c[t*3+2],l=o*a.t[t*3]+s*a.t[t*3+1]+c*a.t[t*3+2];o-=l*a.t[t*3],s-=l*a.t[t*3+1],c-=l*a.t[t*3+2];let u=Math.sqrt(o*o+s*s+c*c)||1;return fe[0]=o/u,fe[1]=s/u,fe[2]=c/u,fe}function me(e,t,r,i,a,o,s,c,l){let{N:u,rings:d}=e,f=e=>r*(1-_(l[0],l[1],e));for(let r=0;r<d*u;r++){if(!o(r))continue;let l=e.bs[r],p=e.cx[r]+e.dx[r]*l,m=e.cy[r]+e.dy[r]*l,g=e.cz[r]+e.dz[r]*l,v=ue(t,p,m,g,i,a),y=le.i,b=f(e===c?e.s[r]:y*t.sp.step);if(b<1e-4||v>=b)continue;let x=pe(t,y,p,m,g),S=1-_(0,b,v),C=e.dx[r]+x[0]*S,w=e.dy[r]+x[1]*S,T=e.dz[r]+x[2]*S,E=Math.sqrt(C*C+w*w+T*T)||1;C/=E,w/=E,T/=E;let D=Math.floor(r/u),O=Math.max(10,Math.round(50*e.L.alongScale)),k=Math.max(0,D-O),A=Math.min(d-1,D+O),j={a:0,b:0,k:b,ia:0,ib:0},ee=n=>{let r=p+C*n,o=m+w*n,s=g+T*n;return j.a=ue(e,r,o,s,k,A),j.ia=le.i,j.b=ue(t,r,o,s,i,a),j.ib=le.i,j.k=Math.max(f(e===c?j.ia*e.sp.step:j.ib*t.sp.step),1e-4),de(j.a,j.b,j.k)},M=0,te=2*b,ne=ee(te)<0,N=1;if(!ne){for(let e=0;e<14;e++){let e=(M+te)*.5;ee(e)<0?M=e:te=e}ee((M+te)*.5),N=(j.a-j.b)/j.k,N>.97&&(ne=!0)}if(ne){e.inside[r]=1;let t=e.r0[r]-1.5*s;e.px[r]=e.cx[r]+e.dx[r]*t,e.py[r]=e.cy[r]+e.dy[r]*t,e.pz[r]=e.cz[r]+e.dz[r]*t,e.rad[r]=t;continue}let re=(M+te)*.5,P=p+C*re,ie=m+w*re,ae=g+T*re,oe=Math.max(j.k-Math.abs(j.a-j.b),0)/j.k,F=j.a<j.b?1-oe/2:oe/2,se=[e.bnx[r],e.bny[r],e.bnz[r]],ce=pe(t,j.ib,P,ie,ae),fe=F*se[0]+(1-F)*ce[0],me=F*se[1]+(1-F)*ce[1],he=F*se[2]+(1-F)*ce[2],ge=Math.sqrt(fe*fe+me*me+he*he)||1;fe/=ge,me/=ge,he/=ge;let _e=.55+.45*_(.02,.2,Math.abs(N)),ve=e===c?0:.002*Math.cos(h*2*N)*(1-Math.abs(N))*(.7+.6*n(P*60,ie*60,ae*60)),ye=(l-e.r0[r])*_e-ve+s*_(-.05,.3,N);e.z[r]*=_e,e.px[r]=P-fe*ye,e.py[r]=ie-me*ye,e.pz[r]=ae-he*ye;let be=(P-e.cx[r])*e.dx[r]+(ie-e.cy[r])*e.dy[r]+(ae-e.cz[r])*e.dz[r];e.base[r]=be,e.rad[r]=be-ye}}function he(e){let t=i(e),r=Array.from({length:5},(e,n)=>({phi:n/5*h+(t()-.5)*.9,w:.22+.45*t(),h:.008+.03*t()*t()+(n===1?.018:0),t:.55+.3*t()})),a=t()*h,o=t=>{let i=.008*Math.cos(t-a)+.003*n(Math.cos(t)*3,Math.sin(t)*3,e);for(let e of r){let n=Math.abs(v(t-e.phi))/e.w;n<1&&(i=Math.max(i,e.h*(1-n)**1.4+.008*Math.cos(t-a)))}return i+.0025*Math.abs(n(Math.cos(t)*11,Math.sin(t)*11,e+3))};return{rim:o,height:(t,i)=>{let s=Math.cos(i),c=Math.sin(i);x(t*4.5+.3*n(s*2,c*2,e),i/h*16,1e6,e+7);let l=(b.cell-.5)*.011*_(0,.4,b.e+.08)*_(.08,.35,t),u=.004*Math.cos(i-a)*t-.003+l+.002*n(s*t*20,c*t*20,e+1),d=_(.86,1,t);for(let e of r)Math.abs(v(i-e.phi))<e.w&&(d=Math.max(d,_(e.t,e.t+.12,t)));return u+(o(i)-u)*d}}}function ge(e={detail:1}){let n=ne(Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1),r=[];for(let e of n){let{rings:t,sOf:n}=j(e,e.spine,e.around);e.rings=t,r.push(ce(e,e.spine,n))}for(let[e,t]of n.entries()){if(t.parent===void 0)continue;let n=r[t.parent],i=r[e],a=t.junction,o=Math.max(0,Math.floor((a-.3)/n.sp.step)),s=Math.min(n.rings-1,Math.ceil((a+.3)/n.sp.step)),c=Math.min(i.rings-1,Math.ceil(.35/i.sp.step)),[l,u,d]=[i.sp.c[0],i.sp.c[1],i.sp.c[2]],f=.026;me(i,n,t.fillet,o,s,e=>i.s[e]<=t.reach[1],f,i,t.reach),me(n,i,t.fillet,0,c,e=>(n.px[e]-l)**2+(n.py[e]-u)**2+(n.pz[e]-d)**2<.26*.26,f,i,t.reach)}for(let e of r)ve(e);be(r);let i=new t(`driftwood`);for(let e of r)Se(i,e);let a=[];for(let e of r)we(e,a);return a.push(...p(`wood`)),{meshes:[i.finish()],obstacles:a}}function _e(e){let t=e.L;if(t.spine===t.ref)return(t,n)=>e.bs[t*e.N+n];let n=t.refAround,{sOf:r}=j(t,t.ref,n);return(e,i)=>se(t,t.ref,r(e,i),h*i/n).rb}function ve(e){ye(e,e.px,e.py,e.pz,e.nx,e.ny,e.nz)}function ye(e,t,n,r,i,a,o){let{N:s,rings:c}=e;for(let l=0;l<c;l++)for(let u=0;u<s;u++){let d=l*s+u,f=l*s+(u+1)%s,p=l*s+(u-1+s)%s,m=Math.min(c-1,l+1)*s+u,h=Math.max(0,l-1)*s+u,g=t[f]-t[p],_=n[f]-n[p],v=r[f]-r[p],y=t[m]-t[h],b=n[m]-n[h],x=r[m]-r[h],S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w);T>1e-12||([S,C,w,T]=[e.dx[d],e.dy[d],e.dz[d],1]),i[d]=S/T,a[d]=C/T,o[d]=w/T}}function be(e){let t=.012,n=e.map(e=>{let n=[],r=e.s[(e.rings-1)*e.N];for(let i=0;i<=r;i+=t){let t=k(e.sp,i);n.push([t.cx,t.cy,t.cz,re(e.L,e.sp,i)*(e.L.shrink?e.L.shrink(i):1)])}return n}),r=n.map(e=>{let t=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let[n,r,i,a]of e)for(let[e,o]of[n,r,i].entries())t[e]=Math.min(t[e],o-6*a),t[e+3]=Math.max(t[e+3],o+6*a);return t}),i=n.map(e=>Float64Array.from(e.flat()));for(let[a,o]of e.entries()){let{N:e,rings:s,L:l}=o,u=e=>Math.max(1,Math.round(e*l.alongScale)),d=e=>Math.max(1,Math.round(e*l.roundScale)),f=xe(o.rad,s,e,u(2),d(4)),p=xe(o.base,s,e,u(9),d(14));for(let u=0;u<s*e;u++){let e=o.base[u]||.07,s=Math.max(0,f[u]-o.rad[u])/(l.depth*.6*e),d=Math.max(0,p[u]-o.base[u])/(.1*e),m=(1-.55*g(s))*(1-.35*g(d))*(1-.25*o.z[u]),h=o.px[u],v=o.py[u],y=o.pz[u],b=o.nx[u],x=o.ny[u],S=o.nz[u],C=v-c;m*=.35+.65*_(-.01,.07,C),m*=1-.45*Math.max(0,-x)*Math.exp(-Math.max(C,0)/.12);let w=0;for(let e=0;e<n.length;e++){let n=r[e],o=i[e];if(!(e===a||h<n[0]||v<n[1]||y<n[2]||h>n[3]||v>n[4]||y>n[5]))for(let e=0;e<o.length;e+=4){let n=o[e+3],r=o[e]-h,i=o[e+1]-v,a=o[e+2]-y,s=r*r+i*i+a*a;if(s>36*n*n)continue;let c=Math.sqrt(s),l=(r*b+i*x+a*S)/c;l<=0||(w+=n*n/Math.max(s,n*n)*l*(t/(2*n)))}}m*=1-Math.min(.6,.75*w),o.inside[u]&&(m*=.3),o.ao[u]=Math.min(1,Math.max(.03,m))}}}function xe(e,t,n,r,i){let a=new Float64Array(t*n),o=new Float64Array(t*n);for(let r=0;r<t;r++){let t=0;for(let a=-i;a<=i;a++)t+=e[r*n+(a+n)%n];for(let o=0;o<n;o++)a[r*n+o]=t/(2*i+1),t+=e[r*n+(o+i+1)%n]-e[r*n+(o-i+n)%n]}for(let e=0;e<n;e++)for(let i=0;i<t;i++){let s=0,c=0;for(let o=Math.max(0,i-r);o<=Math.min(t-1,i+r);o++)s+=a[o*n+e],c++;o[i*n+e]=s/c}return o}function Se(e,t){let{N:n,rings:i,L:a}=t,o=e.vertexCount,s=2*h*a.index,c=(e,t)=>e*n+(t%n+n)%n;for(let r=0;r<i;r++)for(let i=0;i<=n;i++){let o=c(r,i),l=t.s[o]+(a.junction??0);e.vertex([t.px[o],t.py[o],t.pz[o]],[l,h*i/n+s,t.z[o],t.ao[o]],[t.nx[o],t.ny[o],t.nz[o]])}let l=n+1,u=(e,n)=>{let r=c(Math.min(Math.max(e,0),i-1),n);return t.rad[r]-t.base[r]};for(let t=0;t<i-1;t++)for(let i=0;i<n;i++){let n=o+t*l+i;Math.abs(u(t-1,i-1)-2*u(t,i)+u(t+1,i+1))+Math.abs(u(t,i)-2*u(t+1,i+1)+u(t+2,i+2))<=Math.abs(u(t-1,i+2)-2*u(t,i+1)+u(t+1,i))+Math.abs(u(t,i+1)-2*u(t+1,i)+u(t+2,i-1))?e.quad(n,n+1,n+l+1,n+l,r.BARK):e.quad(n+1,n+l+1,n+l,n,r.BARK)}for(let[c,u]of a.caps.entries()){if(u===`inside`)continue;let d=c?i-1:0;if(u===`buried`){let i=t.sp,u=t.s[d*n],f=k(i,u),p=c?1:-1,m=t.base[d*n],h=e.vertex([f.cx+p*f.tx*m*.4,f.cy+p*f.ty*m*.4,f.cz+p*f.tz*m*.4],[u+(a.junction??0),s,0,.1],[p*f.tx,p*f.ty,p*f.tz]);for(let t=0;t<n;t++){let n=o+d*l+t,i=n+1;c?e.tri(n,i,h,r.BARK):e.tri(i,n,h,r.BARK)}}else Ce(e,t)}}function Ce(e,t){let{N:n,rings:i,L:a,sp:o}=t,s=Math.max(6,Math.round(22*a.roundScale)),c=i-1,l=0;for(let e=0;e<n;e++)l+=t.rad[c*n+e];l/=n;let u=[];for(let r=0;r<=s;r++){let i=1-r/s,d=[];for(let u=0;u<n;u++){let f=c*n+u,p=h*u/n,m;if(r===0)m=[t.px[f],t.py[f],t.pz[f]];else{let e=k(o,a.sBreak+a.brk.height(i,p)),n=p+e.tau,s=Math.cos(n),c=Math.sin(n),l=t.rad[f]*i*(r===1?.985:1);m=[e.cx+(s*e.rx+c*e.bx)*l,e.cy+(s*e.ry+c*e.by)*l,e.cz+(s*e.rz+c*e.bz)*l]}let g=(.55+.45*_(0,.6,1-i))*(r===0?.8:1);if(d.push(e.vertex(m,[Math.cos(p)*i*l,Math.sin(p)*i*l,0,g])),r===s)break}u.push(d)}for(let t=0;t<s;t++)for(let i=0;i<n;i++){let a=u[t][i],o=u[t][(i+1)%n];t===s-1?e.tri(a,o,u[s][0],r.WOOD_END):e.quad(a,o,u[t+1][(i+1)%n],u[t+1][i],r.WOOD_END)}}function we(e,t){let n=e.L.ref,r=e.L.refAround,{rings:i,sOf:a}=j(e.L,n,r),o=_e(e),s=a(i-1,0),c=Math.max(1,Math.round(s/.1));for(let a=0;a<c;a++){let l=a/c*s,u=(a+1)/c*s,d=k(n,l),f=[d.cx,d.cy,d.cz],p=k(n,u),m=[p.cx,p.cy,p.cz];if(Math.max(f[1],m[1])<-.6||e.L.parent!==void 0&&u<.05)continue;let h=0;for(let e=Math.floor(l/n.step);e<=Math.min(i-1,Math.ceil(u/n.step));e++)for(let t=0;t<r;t+=4)h=Math.max(h,o(e,t));let g=Math.round(h*.9*1e3)/1e3;t.push({a:f.map(e=>Math.round(e*1e3)/1e3),b:m.map(e=>Math.round(e*1e3)/1e3),r:Math.round((g+.05)*1e3)/1e3,solid:g,fin:0})}}function Te(e){let t=e=>Math.abs(e)<5e-6?`0.0`:e.toFixed(5),n=e=>`vec3f(${t(e[0])}, ${t(e[1])}, ${t(e[2])})`,r=``;for(let[i,a]of e.entries()){let e=a.spine,o=a.junction??0,s=Math.max(2,Math.ceil(e.L/.06)),c=[];for(let t=0;t<=s;t++){let n=k(e,t/s*e.L),r=Math.hypot(n.tx,n.ty,n.tz);c.push([o+t/s*e.L,[n.cx,n.cy,n.cz],[n.tx/r,n.ty/r,n.tz/r]])}r+=`fn scape_wood_axis${i}(s: f32) -> ScapeWoodAxis {\n`;for(let e=0;e<s;e++){let[i,o,l]=c[e],[u,d,f]=c[e+1],p=`scape_wood_lerp(${n(o)}, ${n(l)}, ${n(d)}, ${n(f)}, ${t(a.twist)}, clamp((s - ${t(i)}) * ${t(1/(u-i))}, 0.0, 1.0))`;r+=e<s-1?`  if (s < ${t(u)}) {\n    return ${p};\n  }\n`:`  return ${p};\n`}r+=`}

`}r+=`fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {
`;for(let t=1;t<e.length;t++)r+=`  if (limb == ${t}) {\n    return scape_wood_axis${t}(along);\n  }\n`;return r+`  return scape_wood_axis0(along);
}
`}function Ee(e){let t=e.find(e=>e.caps[1]===`broken`).spine,n=k(t,t.L),r=Math.hypot(n.tx,n.ty,n.tz);return`vec3f(${(n.tx/r).toFixed(5)}, ${(n.ty/r).toFixed(5)}, ${(n.tz/r).toFixed(5)})`}var De=ne(),Oe=`
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

${Te(De)}
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
  let axis = ${Ee(De)};
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
`,ke=e({WGSL:()=>nt,build:()=>Qe}),Ae=[{at:[-.4,.32],size:[.24,.15,.19],sink:.35,yaw:.3,lean:[.04,-.06],freq:52,seed:11,exp:[2.1,2.3],taper:.04,ends:[[1.12,.88],[.55,1.45],[1.05,.95]],lumps:.06,planes:[[.25,1,.45,.66,.06],[.95,.2,-.1,.72,.06],[-.3,.5,-.8,.78,.07]],facets:2,dents:[[-.6,.35,.7,.35,.04],[.1,.9,-.4,.3,.025]],cracks:[[.25,.8,.5,.3,.28,.6],{from:0,at:-.25,turn:2.4,length:.2,depth:.6}],pits:.22,bedding:.7,layers:[.3,.9,-.2]},{at:[.17,.24],size:[.17,.085,.14],sink:.3,yaw:-.5,lean:[-.05,.05],freq:36,seed:23,exp:[2.2,2.4],taper:.05,ends:[[1.1,.9],[.42,1.58],[.92,1.08]],lumps:.05,planes:[[-.35,1,.3,.62,.06],[-.9,.2,.35,.78,.06]],facets:2,dents:[[.6,.5,.6,.4,.035]],cracks:[[.1,.8,.55,1,.55,.6]],pits:.5,bedding:.3,layers:[.9,.3,.2]},{at:[.408,.041],size:[.15,.075,.12],sink:.36,yaw:.9,lean:[.08,0],freq:32,seed:37,exp:[2.2,2.4],taper:0,ends:[[1,.88],[.4,1.6],[.95,1.05]],lumps:.04,planes:[[.35,1,.45,.62,.06],[.2,.3,.95,.75,.08]],facets:2,dents:[[-.5,.6,.6,.35,.04]],cracks:[[.5,.55,.65,1.3,.3,.8],{from:0,at:.2,turn:.7,length:.12,depth:.5}],pits:.9,bedding:0,layers:[0,1,0]},{at:[.62,.12],size:[.09,.05,.08],sink:.36,yaw:-.3,lean:[.02,.04],freq:20,seed:41,exp:[2,2.1],taper:0,ends:[[1,.95],[.46,1.54],[1,1]],lumps:.05,planes:[[.3,1,-.3,.66,.07]],facets:1,dents:[[.5,.7,.4,.4,.03]],cracks:[[.2,.7,.7,2.4,.35,.5]],pits:.3,bedding:.6,layers:[.2,.95,.3]}],je={a:[.482,-.64,-.139],b:[.432,-.45,-.14],r:.09},I=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Me=e=>Math.hypot(e[0],e[1],e[2]),L=e=>{let t=Me(e)||1;return[e[0]/t,e[1]/t,e[2]/t]},Ne=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],R=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},Pe=e=>Math.min(Math.max(e,0),1);function Fe({a:e,b:t,r:n},r,i,a){let o=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],s=Pe(((r-e[0])*o[0]+(i-e[1])*o[1]+(a-e[2])*o[2])/I(o,o));return Math.hypot(r-e[0]-o[0]*s,i-e[1]-o[1]*s,a-e[2]-o[2]*s)-n}function Ie(e,t,n,r){let i=Math.imul(e,668265261)^Math.imul(t,374761393)^Math.imul(n,2654435761)^Math.imul(r,2246822519);return i=Math.imul(i^i>>>15,2246822507),i=Math.imul(i^i>>>13,3266489909),((i^i>>>16)>>>0)/4294967296}function Le(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=9,s=9,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=r+f,m=i+d,h=a+u,g=p+Ie(p,m,h,1)-e,_=m+Ie(p,m,h,2)-t,v=h+Ie(p,m,h,3)-n,y=g*g+_*_+v*v;y<o?(s=o,o=y,c=Ie(p,m,h,4),l=Ie(p,m,h,5)):y<s&&(s=y)}return[Math.sqrt(o),Math.sqrt(s),c,l]}function Re(e){let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(L),r=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=n.slice(),a=(e,t,n)=>L([e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]),o=new Map,s=(t,r,s)=>{let c=Math.min(t,r)*12+Math.max(t,r),l=o.get(c);if(!l){l=[];let[s,u]=t<r?[t,r]:[r,t];for(let t=1;t<e;t++)l.push(i.push(a(n[s],n[u],t/e))-1);o.set(c,l)}return t<r?l[s-1]:l[e-s-1]},c=[];for(let[t,a,o]of r){I(Ne([n[a][0]-n[t][0],n[a][1]-n[t][1],n[a][2]-n[t][2]],[n[o][0]-n[t][0],n[o][1]-n[t][1],n[o][2]-n[t][2]]),n[t])<0&&([a,o]=[o,a]);let r=new Map,l=(c,l)=>{if(c===0&&l===0)return t;if(c===e)return a;if(l===e)return o;if(l===0)return s(t,a,c);if(c===0)return s(t,o,l);if(c+l===e)return s(a,o,l);let u=c*(e+1)+l,d=r.get(u);if(d===void 0){let s=n[t],f=n[a],p=n[o],m=(e-c-l)/e,h=c/e,g=l/e;d=i.push(L([s[0]*m+f[0]*h+p[0]*g,s[1]*m+f[1]*h+p[1]*g,s[2]*m+f[2]*h+p[2]*g]))-1,r.set(u,d)}return d};for(let t=0;t<e;t++)for(let n=0;n<e-t;n++)c.push(l(t,n),l(t+1,n),l(t,n+1)),t+n<e-1&&c.push(l(t+1,n),l(t+1,n+1),l(t,n+1))}return{dirs:i,tris:c}}function ze(e,t){let n=Array.from({length:e},()=>new Set);for(let e=0;e<t.length;e+=3){let[r,i,a]=[t[e],t[e+1],t[e+2]];n[r].add(i).add(a),n[i].add(r).add(a),n[a].add(r).add(i)}let r=new Uint32Array(e+1);for(let t=0;t<e;t++)r[t+1]=r[t]+n[t].size;let i=new Uint32Array(r[e]);for(let t=0;t<e;t++)i.set([...n[t]],r[t]);return{start:r,list:i}}function Be(e,t,n){let r=Float64Array.from(e),i=new Float64Array(e.length);for(let e=0;e<n;e++){for(let e=0;e<r.length;e++){let n=0;for(let i=t.start[e];i<t.start[e+1];i++)n+=r[t.list[i]];i[e]=.5*r[e]+.5*n/(t.start[e+1]-t.start[e])}[r,i]=[i,r]}return r}function Ve(e,t){let n=new Float64Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=Ne([e[a]-e[i],e[a+1]-e[i+1],e[a+2]-e[i+2]],[e[o]-e[i],e[o+1]-e[i+1],e[o+2]-e[i+2]]);for(let e of[i,a,o])for(let t=0;t<3;t++)n[e+t]+=s[t]}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2])||1;n[e]/=t,n[e+1]/=t,n[e+2]/=t}return n}function He(e,t){let{half:r,exp:i,ends:a,lumps:o,planes:c,off:l,taper:u}=e,d=1-u*t[1],f=r[0]*a[0][t[0]<0?0:1]*d,p=r[1]*a[1][t[1]<0?0:1],m=r[2]*a[2][t[2]<0?0:1]*d,[h,g]=i,_=1/(((Math.abs(t[0])/f)**h+(Math.abs(t[2])/m)**h)**(g/h)+(Math.abs(t[1])/p)**g)**(1/g);_*=1+o*s(t[0]*1.2+l[0],t[1]*1.2+l[1],t[2]*1.2+l[2],3)+.15*o*n(t[0]*3+l[1],t[1]*3+l[2],t[2]*3+l[0]);for(let n of e.dents){let e=I(t,n.dir);e>0&&(_*=1-n.depth*Math.exp(-(1-e)/n.size))}let v=0;for(let e of c){let n=I(t,e.n);if(n<.001)continue;let r=e.h/n,i=e.soft,a=Math.max(i-Math.abs(_-r),0)/i;v=Math.max(v,Pe(.5+.5*(_-r)/i)),_=Math.min(_,r)-a*a*i*.25}return[_,v]}function Ue(e,t){let n=e.scale,r=[t[0]/n[0],t[1]/n[1],t[2]/n[2]],i=Me(r),[a,o]=He(e,[r[0]/i,r[1]/i,r[2]/i]);return[a/i,o]}var We=(e,t)=>e.wob.reduce((e,[n,r,i,a,o])=>e+o*Math.sin(n*t[0]+r*t[1]+i*t[2]+a),0),Ge=(e,t)=>e.branch?R(-.1*e.length,.05*e.length,t)*(1-R(.2*e.length,e.length,t)):1-R(.15*e.length,e.length,Math.abs(t)),Ke=(e,t)=>.4+.6*R(-.35,.15,.6*Math.sin(t*e.open[0]+e.open[1])+.4*Math.sin(t*e.open[2]+e.open[3])),qe=(e,t)=>.6+.6*R(-.5,.5,.7*Math.sin(t*e.wide[0]+e.wide[1])+.3*Math.sin(t*e.wide[2]+e.wide[3]));function Je(e){let t={...e},n=i(t.seed*7919+13),[r,a,o]=t.size,s=a/(1-t.sink);t.half=[r/2,s/2,o/2],t.mean=(r/2+s/2+o/2)/3,t.off=[n()*50-25,n()*50-25,n()*50-25],t.layers=L(t.layers),t.dents=t.dents.map(([e,t,n,r,i])=>({dir:L([e,t,n]),size:1-Math.cos(r),depth:i}));let l=Array.from({length:t.facets},()=>{let e=n()*2*Math.PI,t=.35+.55*n(),r=Math.sqrt(1-t*t);return[r*Math.cos(e),t,r*Math.sin(e),.8+.06*n(),.1+.05*n()]});t.planes=[...t.planes,...l].map(([e,n,r,i,a])=>{let o=L([e,n,r]);return{n:o,h:i*Math.hypot(...[0,1,2].map(e=>t.half[e]*t.ends[e][o[e]<0?0:1]*o[e])),soft:a*t.mean}});let u=Re(16).dirs;t.scale=[1,1,1];let d=[1/0,1/0,1/0],f=[-1/0,-1/0,-1/0];for(let e of u){let[n]=Ue(t,e);for(let t=0;t<3;t++)d[t]=Math.min(d[t],e[t]*n),f[t]=Math.max(f[t],e[t]*n)}t.scale=[r/(f[0]-d[0]),s/(f[1]-d[1]),o/(f[2]-d[2])];let[p,m]=t.lean,h=e=>{let[n,r,i]=e;return[n,r]=[n*Math.cos(m)-r*Math.sin(m),n*Math.sin(m)+r*Math.cos(m)],[r,i]=[r*Math.cos(p)-i*Math.sin(p),r*Math.sin(p)+i*Math.cos(p)],[n,i]=[n*Math.cos(t.yaw)+i*Math.sin(t.yaw),-n*Math.sin(t.yaw)+i*Math.cos(t.yaw)],[n,r,i]};t.turn=[h([1,0,0]),h([0,1,0]),h([0,0,1])];let g=-1/0;for(let e of u){let[n]=Ue(t,e);g=Math.max(g,h([e[0]*n,e[1]*n,e[2]*n])[1])}t.shift=[t.at[0],c+a-g,t.at[1]];let _=[Math.cos(t.yaw),0,-Math.sin(t.yaw)],v=[Math.sin(t.yaw),0,Math.cos(t.yaw)],y=0,b=0;for(let e of u){let[n]=Ue(t,e),[r,i,a]=h([e[0]*n,e[1]*n,e[2]*n]);i+t.shift[1]<-.6||(y=Math.max(y,Math.abs(r*_[0]+a*_[2])),b=Math.max(b,Math.abs(r*v[0]+a*v[2])))}let x=Math.max(b,.5*a),S=c+Math.max(a-x,0),C=Math.max(y-x,0);t.obstacle={a:[t.at[0]-_[0]*C,S,t.at[1]-_[2]*C],b:[t.at[0]+_[0]*C,S,t.at[1]+_[2]*C],r:x+.05,solid:x},t.crackList=[];for(let e of t.cracks){let r,i,a=!1,o,s;if(Array.isArray(e)){r=L(e.slice(0,3));let t=L(Ne(r,Math.abs(r[1])<.9?[0,1,0]:[1,0,0])),n=Ne(r,t);i=t.map((t,r)=>t*Math.cos(e[3])+n[r]*Math.sin(e[3])),[o,s]=e.slice(4)}else{let n=t.crackList[e.from];r=L(n.at.map((t,r)=>t+n.along[r]*e.at*n.length));let c=L(n.along.map((e,t)=>e-r[t]*I(n.along,r))),l=Ne(r,c);i=c.map((t,n)=>t*Math.cos(e.turn)+l[n]*Math.sin(e.turn)),a=!0,{length:o,depth:s}=e}let[c]=Ue(t,r),l=L(Ne(r,i)),u=L(i),d=(e,n)=>{let i=L(r.map((t,r)=>t+n*e[r])),[a]=Ue(t,i);return i.map(e=>e*a)},[f,p,m,h]=[d(l,.01),d(l,-.01),d(u,.01),d(u,-.01)],g=L(Ne(f.map((e,t)=>e-p[t]),m.map((e,t)=>e-h[t])));I(g,r)<0&&(g=g.map(e=>-e)),i=L(i.map((e,t)=>e-g[t]*I(i,g)));let _=[[12,.008],[80,.0012],[210,4e-4]].map(([e,t])=>{let r=L([n()*2-1,n()*2-1,n()*2-1]);return[r[0]*e,r[1]*e,r[2]*e,n()*2*Math.PI,t]});t.crackList.push({at:r.map(e=>e*c),out:r,along:i,n:L(Ne(i,g)),branch:a,length:o*2*t.mean,depth:s,wob:_,open:[35,n()*6.3,90,n()*6.3],wide:[60,n()*6.3,150,n()*6.3],k:n()*40})}return t}function Ye(e,t,r){let[i,a,o]=e.off,c=t[0]+i,l=t[1]+a,u=t[2]+o,d=e.spacing,f=e.coarse,p=Math.sqrt(f),m=.0065*(1-.8*r)*s(c*16,l*16,u*16,3),[h]=Le(c/.04,l/.04,u/.04);m+=.0035*(1-.8*r)*(h*h-.35);let g=.012*p,[_]=Le(c/g+4.4,l/g,u/g);m+=.0012*p*(1-r)*(_*_-.3),r>0&&(m+=.0012*p*r*s(c*70/p+1.7,l*70/p,u*70/p,2));let v=1-Math.abs(n(c*24+5.1,l*24,u*24)+.2*n(c*70,l*70,u*70+2.3));if(m-=.001*(1-.6*r)*R(.05,.55,n(c*5,l*5+7.7,u*5))*v**(6/f),e.bedding>0){let r=I(t,e.layers)*52+1.6*s(c*6,l*6,u*6,2);m-=7e-4*e.bedding*(1-Math.abs(Math.sin(Math.PI*r)))**(3/f)*(.5+.5*n(c*11,l*11,u*11+4))}let y=R(-.35,.45,n(c*8+3.1,l*8,u*8));for(let[t,r,i,a,o,s]of[[Math.max(.01,6*d),e.pits*(.2+.7*y),.25,.45,.3,0],[.032*p,.04*e.pits,.16,.3,.2,.35*Pe(2-f)]]){let[e,,d,f]=Le(c/t+9.1,l/t,u/t),p=(i+(a-i)*f)*(1+s*n(c*180,l*180+2.2,u*180));if(d<r&&e<p){let n=1-e/p*(e/p);m-=o*p*t*n*n}}let b=3.2*d,[x,S]=Le(c/b,l/b+3.3,u/b),C=(.08+.05*r)*d*R(0,.3,S-x);C+=(.09+.05*r)*d*s(c/(3.5*d),l/(3.5*d),u/(3.5*d),2);let w=0;for(let r of e.crackList){let i=[t[0]-r.at[0],t[1]-r.at[1],t[2]-r.at[2]],a=I(i,r.along),o=Ge(r,a)*R(-.5*e.mean,-.25*e.mean,I(i,r.out));if(o<=0)continue;let s=I(i,r.n)+We(r,t),f=2.6*d*(.5+.5*o)*qe(r,a);if(Math.abs(s)>10*f)continue;let p=s/f,m=.9*d*r.depth*o*Ke(r,a);w+=m*((.75+.25*n(c*30,l*30+r.k,u*30))*Math.exp(-2*p*p)+.2*Math.exp(-p*p/12))}return[m+C-w,w,m-w]}function Xe(e,t,n){let{nb:r}=n;e.coarse=Math.max(1,1/e.density);let i=n.dirs.length,a=e.size[1],o=new Float64Array(i*3),s=new Float64Array(i),l=(t,n)=>{let[r,i]=Ue(e,n);o[t*3]=n[0]*r,o[t*3+1]=n[1]*r,o[t*3+2]=n[2]*r,s[t]=i};n.dirs.forEach((e,t)=>l(t,e));let u=new Float64Array(i*3);for(let e=0;e<8;e++){for(let e=0;e<i;e++){let t=0,n=0,i=0,a=r.start[e+1]-r.start[e];for(let a=r.start[e];a<r.start[e+1];a++){let e=r.list[a]*3;t+=o[e],n+=o[e+1],i+=o[e+2]}u[e*3]=.5*o[e*3]+.5*t/a,u[e*3+1]=.5*o[e*3+1]+.5*n/a,u[e*3+2]=.5*o[e*3+2]+.5*i/a}for(let e=0;e<i;e++)l(e,L([u[e*3],u[e*3+1],u[e*3+2]]))}let d=0;for(let e=0;e<i;e++)for(let t=r.start[e];t<r.start[e+1];t++){let n=r.list[t]*3;d+=Math.hypot(o[n]-o[e*3],o[n+1]-o[e*3+1],o[n+2]-o[e*3+2])}e.spacing=d/r.list.length;let f=Ve(o,n.tris),p=new Float64Array(i),m=new Float64Array(i),h=new Float64Array(i),g=new Float64Array(i*3),[_,v,y]=e.turn;for(let t=0;t<i;t++){let[n,r,i]=Ye(e,[o[t*3],o[t*3+1],o[t*3+2]],s[t]);p[t]=n,m[t]=r,h[t]=i;let a=o[t*3]+f[t*3]*n,c=o[t*3+1]+f[t*3+1]*n,l=o[t*3+2]+f[t*3+2]*n;for(let n=0;n<3;n++)g[t*3+n]=_[n]*a+v[n]*c+y[n]*l+e.shift[n]}let b=Ve(g,n.tris),x=Be(h,r,2),S=Be(h,r,Math.max(2,Math.round(12*e.density*e.density))),C=Be(Array.from(h,(e,t)=>x[t]-e),r,1),w=new Float64Array(i*4);for(let n=0;n<i;n++){let r=Pe(Math.max(C[n]/(.25*e.spacing)*.25+(S[n]-h[n])/.004*.6,m[n]/(2*e.spacing*e.coarse))),i=g[n*3+1]-c,o=b[n*3+1],s=.45+.55*R(-.01,.45*a,i),l=1-.55*Math.max(-o,0)*(1-R(0,.7*a,i)),u=.82+.18*(.5+.5*o),d=Fe(je,g[n*3],g[n*3+1],g[n*3+2]),f=1-.45*Math.exp(-Math.max(d,0)/.015);w.set([t,r,0,Pe((1-.65*r)*s*l*u*f)],n*4)}return{world:g,attrs:w}}var Ze=Ae.map(Je);function Qe(e={detail:1}){let n=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,i=new t(`rocks`),a=[],o=new Map;return Ze.forEach((e,t)=>{let s=n===1?e.freq:Math.max(6,Math.round(e.freq*n)),c=o.get(s);if(!c){let e=Re(s);c={...e,nb:ze(e.dirs.length,e.tris)},o.set(s,c)}let{world:l,attrs:u}=Xe({...e,density:s/e.freq},t,c),d=i.vertexCount;for(let e=0;e<c.dirs.length;e++)i.vertex([l[e*3],l[e*3+1],l[e*3+2]],[u[e*4],u[e*4+1],u[e*4+2],u[e*4+3]]);for(let e=0;e<c.tris.length;e+=3)i.tri(d+c.tris[e],d+c.tris[e+1],d+c.tris[e+2],r.ROCK);let f=e.obstacle;a.push({a:f.a.slice(),b:f.b.slice(),r:f.r,solid:f.solid,fin:0})}),a.push(...p(`rocks`)),{meshes:[i.finish()],obstacles:a}}var z=e=>e.toFixed(5),$e=e=>`vec3f(${e.map(z).join(`, `)})`;function et(){let e=Ae[0],t=i(e.seed*7919+4099);t();let n=[e.at[0],c+.45*e.size[1],e.at[1]],r=t()*2*Math.PI,a=(t()*2-1)*.6,o=[Math.sqrt(1-a*a)*Math.cos(r),a,Math.sqrt(1-a*a)*Math.sin(r)],s=I(o,n)+(t()-.5)*.5*Math.min(e.size[0],e.size[2]);return[s,s+(t()<.5?-1:1)*(.015+.015*t())].map((e,t)=>`    let vein${`AB`[t]} = vec4f(${o.map(z).join(`, `)}, ${z(e)});`).join(`
`)}function tt(){let e=[];return Ze.forEach((t,n)=>{let[r,i,a]=t.turn;e.push(`  ${n?`} else `:``}if (id == ${n}u) {`,`    let back = transpose(mat3x3f(${$e(r)}, ${$e(i)}, ${$e(a)}));`,`    let ql = back * (p - ${$e(t.shift)});`,`    let nl = back * n;`);for(let n of t.crackList){let r=n.length,i=n.branch?`smoothstep(${z(-.1*r)}, ${z(.05*r)}, along) * (1.0 - smoothstep(${z(.2*r)}, ${z(r)}, along))`:`1.0 - smoothstep(${z(.15*r)}, ${z(r)}, abs(along))`,a=n.wob.map(([e,t,n,r,i])=>`${z(i)} * sin(dot(ql, ${$e([e,t,n])}) + ${z(r)})`).join(` + `);e.push(`    {`,`      let d = ql - ${$e(n.at)};`,`      let along = dot(d, ${$e(n.along)});`,`      let mask = (${i}) * smoothstep(${z(-.5*t.mean)}, ${z(-.25*t.mean)}, dot(d, ${$e(n.out)}));`,`      let cn = ${$e(n.n)};`,`      let off = dot(d, cn) + ${a};`,`      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${z(n.open[0])} + ${z(n.open[1])}) + 0.4 * sin(along * ${z(n.open[2])} + ${z(n.open[3])}));`,`      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${z(n.wide[0])} + ${z(n.wide[1])}) + 0.3 * sin(along * ${z(n.wide[2])} + ${z(n.wide[3])}));`,`      let hw = ${z(5e-4*Math.sqrt(n.depth))} * wide * (0.4 + 0.6 * mask);`,`      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);`,`      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);`,`      crackLine = max(crackLine, core * mask * open);`,`    }`)}}),e.push(`  }`),e.join(`
`)}var nt=`
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
${et()}
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
${tt()}
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
`,rt=e({WGSL:()=>tn,build:()=>$t}),B=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],V=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],H=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],it=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],U=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],W=e=>Math.hypot(e[0],e[1],e[2]),G=e=>H(e,1/(W(e)||1)),at=(e,t,n)=>B(e,H(V(t,e),n)),K=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return B(B(H(e,r),H(U(t,e),i)),H(t,it(t,e)*(1-r)))},q=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},ot=[0,1,0],st=(e,t)=>G(V(e,H(t,it(e,t)))),ct=e=>e-Math.floor(e);function lt(e,t){let n=ct(e*.618034+.17),r=ct(e*.754877+.31),i=ct(e*.56984+.53);return{widest:.3+.12*n,base:2+r,tip:1.45+.5*i,drawn:t?.06+.14*n:.18+.2*n}}function ut(e,t){if(e<=t.widest)return Math.sqrt(Math.max(1-((t.widest-e)/t.widest)**t.base,0));let n=(e-t.widest)/(1-t.widest);return Math.max(1-n**t.tip,0)**1.05*(1-t.drawn*q(.62,1,n))}var dt=.3,ft=(e,t,n,r,i)=>{let a=Math.abs(t),o=+(t<0);return n*(e-dt*a**1.2*ut(e,i))+.5*o+.2*Math.sin(9*e+2.3*r+1.7*o)*Math.min(2*a,1)};function pt(e){let t=e.length,r=.5*e.ratio*t,i=G(U(e.face,e.dir)),a=[[0,0,0]],o=[];for(let n=0;n<=120;n++){let r=n/120,s=e.arch*r**1.6+e.droop*q(.7,1,r),c=e.side*r**1.3,l=K(e.dir,i,s),u=K(e.face,i,s),d=K(i,u,c);l=K(l,u,c),d=K(d,l,e.twist*r),u=K(u,l,e.twist*r),o.push({T:l,N:u,X:d}),n&&a.push(B(a[n-1],H(B(l,o[n-1].T),.5*t/120)))}let s=t=>{let n=Math.min(Math.max(t,0),1)*120,r=Math.min(Math.floor(n),119),i=n-r;return{c:B(e.base,at(a[r],a[r+1],i)),T:G(at(o[r].T,o[r+1].T,i)),N:G(at(o[r].N,o[r+1].N,i)),X:G(at(o[r].X,o[r+1].X,i))}},c=lt(e.id,!!e.small),l=(t,n)=>ut(t,c)*r*(n?1+e.asym:1-e.asym);return{b:e,L:t,H:r,at:(r,i)=>{let{c:a,N:o,X:u}=s(r),d=l(r,i>=0),f=Math.max(-1.2,Math.min(1.2,i/Math.max(d,1e-7))),p=Math.abs(f),m=Math.sin(Math.PI*Math.min(r*1.15,1)),h=e.cup*(.3+.7*m)*d*f*f;h+=e.fold*d*(Math.sqrt(f*f+.004)-.0632);let g=t*(.013-.007*r);h-=t*.0065*(1-.8*r)*Math.exp(-((i/g)**2)),h+=t*e.quilt*(.5-.5*Math.cos(2*Math.PI*ft(r,f,e.veins,e.id,c)))*q(.05,.2,p)*(1-q(.75,1,p))*q(.03,.12,r)*(1-q(.85,.98,r));let _=i>=0?e.phase:e.phase+2.3;if(h+=e.wave*d*(Math.sin(2*Math.PI*e.waves*r+_)+.6*n(r*6,f*1.3,e.id*3.7+.5))*q(.4,1,p)**2*m,!e.furl)return B(B(a,H(u,i)),H(o,h));let v=d/(e.furl*(i>=0?4.6:4)),y=i/Math.max(v,1e-7);return B(B(a,H(u,v*Math.sin(y))),H(o,v*(1-Math.cos(y))))},frame:s,half:l}}function mt(e,t,n,r,i){let{b:a,L:o,at:s,frame:c,half:l}=t,u=(e,t)=>{let n=2e-4,r=U(V(s(Math.min(e+n,1),t),s(Math.max(e-n,0),t)),V(s(e,t+n*o),s(e,t-n*o)));return W(r)>1e-14?G(r):c(e).N},d=[];for(let e=0;e<=r;e++){let t=-1+2*e/r;d.push(Math.sign(t)*Math.abs(t)**1.3)}let f=[],p=e.vertex(s(0,0),[0,0,a.id,1],c(0).N);f.push([p,0,0]);let m=[];for(let t=1;t<n;t++){let r=t/n,i=.6*r+.4*(.5-.5*Math.cos(Math.PI*r));m.push(d.map(t=>{let n=t*l(i,t>=0),r=e.vertex(s(i,n),[i,t,a.id,1],u(i,n));return f.push([r,i,n]),r}))}let h=e.vertex(s(1,0),[1,0,a.id,1],c(1).N);f.push([h,1,0]);for(let t=0;t<r;t++){e.tri(p,m[0][t],m[0][t+1],i);for(let n=0;n+1<m.length;n++)e.quad(m[n][t],m[n+1][t],m[n+1][t+1],m[n][t+1],i);e.tri(m[m.length-1][t],h,m[m.length-1][t+1],i)}return f}function ht(e,t){let n=e.length,r=e.map((t,r)=>G(V(e[Math.min(r+1,n-1)],e[Math.max(r-1,0)]))),i=[st(t,r[0])];for(let e=1;e<n;e++){let t=U(r[e-1],r[e]),n=W(t),a=n>1e-9?K(i[e-1],H(t,1/n),Math.atan2(n,it(r[e-1],r[e]))):i[e-1];i.push(st(a,r[e]))}return{T:r,U:i}}function gt(e,t,n,r,i,a,o,s=null){let c=t.length,{T:l,U:u}=ht(t,o),d=[],f=0;for(let i=0;i<c;i++){let o=u[i];if(i&&(f+=W(V(t[i],t[i-1]))),n[i]<=0){d.push(e.vertex(t[i],[f,0,a,1],i?l[i]:H(l[i],-1)));continue}let p=U(l[i],o),m=Math.max(i-1,0),h=Math.min(i+1,c-1),g=Math.max(W(V(t[h],t[m])),1e-9),_=[];for(let c=0;c<=r;c++){let u=2*Math.PI*c/r,d=B(H(o,Math.cos(u)),H(p,Math.sin(u)));if(!s){let r=(n[h]-n[m])/g;_.push(e.vertex(B(t[i],H(d,n[i])),[f,u,a,1],G(V(d,H(l[i],Math.max(-3,Math.min(3,r)))))));continue}let v=s(i,u),y=(s(i,u+.001)-s(i,u-.001))/.002,b=G(V(H(d,v),H(B(H(o,-Math.sin(u)),H(p,Math.cos(u))),y))),x=(n[h]*s(h,u)-n[m]*s(m,u))/g*it(d,b);_.push(e.vertex(B(t[i],H(d,n[i]*v)),[f,u,a,1],G(V(b,H(l[i],Math.max(-3,Math.min(3,x)))))))}d.push(_)}for(let t=0;t+1<c;t++){let n=d[t],a=d[t+1];for(let t=0;t<r;t++)typeof n==`number`?e.tri(n,a[t+1],a[t],i):typeof a==`number`?e.tri(n[t],n[t+1],a,i):e.quad(n[t],n[t+1],a[t+1],a[t],i)}return{rings:d,T:l,U:u}}function _t(e,t,n,r,i,a=1.35){let o=[];for(let s=0;s<=i;s++){let c=1-(1-s/i)**a,l=1-c;o.push(B(B(H(e,l*l*l),H(t,3*l*l*c)),B(H(n,3*l*c*c),H(r,c*c*c))))}return o}function vt(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function yt(e,t,n,r,i){let a=e.frame(0),o=B(e.at(0,0),H(a.N,-.8*i)),s=W(V(o,t));return _t(t,B(t,H(n,.45*s)),V(o,H(a.T,Math.min(.08,.3*s))),o,r)}function bt(e,t,r,i,a){let o=i.rTop*1.12,s=yt(e,t,r,i.segs,o),c=W(V(s[s.length-1],t)),l=[];s.forEach((e,t)=>{let r=t/i.segs;if(t&&t<i.segs){let i=.003*Math.sin(Math.PI*r)*(c/.4);s[t]=B(e,[i*n(r*2.2,a*1.7,.3),i*n(r*2.2,a*1.7,5.1),i*n(r*2.2,a*1.7,9.7)])}let o=i.rBase+(i.rTop-i.rBase)*r**.7;l.push(o*(1+i.sheath*(1-q(0,i.sheathLen/c,r))**2)*(1+.14*q(.88,1,r)))});let u=i.midribSegs;for(let t=1;t<=u;t++){let n=t/u*i.midrib,r=t===u?0:o*(1-t/u)**.75;s.push(B(e.at(n,0),H(e.frame(n).N,-.8*r))),l.push(r)}return{pts:s,rad:l,segs:i.segs,n:u,midrib:i.midrib}}function xt(e,t,n,i,a,o){let{pts:s,rad:c,segs:l}=n,u=t.frame(0).N,{T:d,U:f}=ht(s,u),p=Math.atan2(it(u,U(d[l],f[l])),it(u,f[l]));return gt(e,s,c,i.sides,r.STEM,a,u,(e,t)=>1-i.groove*(1-q(1-o,1,e/l))*Math.max(0,Math.cos(t-p))**3)}var St=(e,t,n)=>{let r=(n-e)/(t-e);return r<=0||r>=1?0:6*r*(1-r)/(t-e)};function Ct(e){let t=t=>1.6*e.arch*Math.max(t,0)**.6+e.droop*St(.7,1,t),n=new Float64Array(513),r=new Float64Array(513);for(let e=1;e<=512;e++){let i=(e-.5)/512,a=i*i*(2-i)*t(i)/512;n[e]=n[e-1]+Math.cos(d*i)*a,r[e]=r[e-1]+Math.sin(d*i)*a}let i=(e,t)=>{let n=Math.min(Math.max(t,0),1)*512,r=Math.min(Math.floor(n),511);return e[r]+(e[r+1]-e[r])*(n-r)};return{turn:t,Kc:e=>i(n,e),Ks:e=>i(r,e)}}function wt(e,t){let n=e.frame(t),r=G(n.T),i=st(n.N,r);return[r,U(i,r),i]}function Tt(e,t,n,r,i,a,o,s,c,d){let f=c.segs,p=0;for(let e=1;e<=f;e++)p+=W(V(c.pts[e],c.pts[e-1]));let m=G(V(c.pts[f],c.pts[f-1])),h=i.frame(0).N,g=i.L,_=st(h,m),v=U(m,_),y=[0];for(let e=1;e<=f;e++)y.push(y[e-1]+W(V(c.pts[e],c.pts[e-1])));let b=e=>{let t=G(V(c.pts[Math.min(e+1,f)],c.pts[Math.max(e-1,0)])),n=y[e]/y[f],r=n*(4-3*n);return[H(t,it(t,_)*r),H(t,it(t,v)*r)]},x=[[0,0,0]],S=[[0,0,0]];for(let e=1;e<=f;e++){let[t,n]=b(e-1),[r,i]=b(e),a=.5*(y[e]-y[e-1])/y[f];x.push(B(x[e-1],H(B(t,r),a))),S.push(B(S[e-1],H(B(n,i),a)))}let C=e=>{let t=1;for(;t<f&&y[t]/y[f]<e;)t++;let n=Math.min(Math.max((e*y[f]-y[t-1])/(y[t]-y[t-1]),0),1);return[...at(x[t-1],x[t],n),0,...at(S[t-1],S[t],n),0]};if(l(n,r*40,{...d,foot:c.pts[0],base:c.pts[f],S:m,P:_,Ls:p,Lb:g,tip:i.at(1,0),dir:i.b.dir,jP:x[f],jQ:S[f]}),d.with!==void 0)for(let e of[16,17])n[r*40+e]=n[d.with*40+e];let w=p/(p+g),T=Ct(i.b),E=(n,a)=>{let[o,s,c]=wt(i,a),l=V([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],i.frame(a).c);t[n]=[r,w+(1-w)*a,a,it(l,s),...u(o,s,c),T.turn(a)/g,T.Kc(a),T.Ks(a),it(l,c),0,0,0,0,0,0,0,0]};for(let[e,t]of a)E(e,t);let D=[0];for(let e=1;e<=o.segs;e++)D.push(D[e-1]+W(V(o.pts[e],o.pts[e-1])));s.rings.forEach((n,i)=>{let a=typeof n==`number`?[n]:n;if(i<=o.segs){let n=s.T[i],c=st(s.U[i],n),l=u(n,c,U(n,c)),d=o.pts[i],f=C(D[i]/D[o.segs]);for(let n of a)t[n]=[r,D[i]/D[o.segs]*w,-1,0,...l,...V([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],d),0,...f];return}let c=(i-o.segs)/o.n*o.midrib;for(let e of a)E(e,c)})}function Et(e,t,n){let r=new Float32Array(e*20);for(let n=0;n<e;n++)t[n]?r.set(t[n],n*20):(r[n*20]=-1,r[n*20+7]=1);return{vertex:r,leaves:n}}var J=(e,t,n)=>Math.max(n,Math.round(e*t)),Dt=(e,t,n)=>Math.max(n,2*Math.round(e*t/2));function Ot(e,t=a-.01){if(W(e)<=t)return e;let n=Math.hypot(e[0],e[2]),r=Math.sqrt(Math.max(t*t-e[1]*e[1],0));return[e[0]*r/n,e[1],e[2]*r/n]}function kt(e,t,i,a,o,s,l,u,d){let f=c-.9*s,p=G(U(i,ot)),m=.3*(u()-.5),h=(e,n,r=0)=>[t[0]+i[0]*e+p[0]*r,n,t[2]+i[2]*e+p[2]*r],g=[t,h(.9*a,f+.7*s),h(a+.5*o,f,m*o),h(a+o,f,1.6*m*o),h(a+o+.012,f-.03,2*m*o),h(a+o+.018,f-.07,2.2*m*o)],_=J(5,d,2),v=vt(g,_).map((e,t)=>{let r=t*5/_,i=r>6?.0025:0;return Ot(B(e,[i*n(r*.35,l,1.1),.4*i*n(r*.35,l,4.2),i*n(r*.35,l,7.3)]))});gt(e,v,v.map((e,t)=>t===v.length-1?0:s*(1.1-.65*(t/v.length))),J(6,d,4),r.ROOT,l,ot)}var At=[{r:.1,pts:[[-.52,-.65,-.045],[-.5,-.55,-.055],[-.45,-.474,-.064],[-.38,-.418,-.076],[-.3,-.381,-.086],[-.21,-.358,-.113],[-.125,-.325,-.133],[-.034,-.29,-.144],[.06,-.273,-.152],[.16,-.273,-.159],[.25,-.299,-.164],[.33,-.342,-.158],[.39,-.403,-.147],[.44,-.47,-.136],[.48,-.55,-.131],[.5,-.65,-.138]]},{r:.085,pts:[[.15,-.27,-.165],[.2,-.13,-.245],[.228,-.04,-.254]]},{r:.095,pts:[[-.42,-.441,-.073],[-.4,-.501,-.004],[-.37,-.56,.058],[-.35,-.64,.108]]}],jt=[{c:[-.4,.32],w:.24,h:.15,d:.19},{c:[.17,.24],w:.17,h:.1,d:.14},{c:[.4,.1],w:.15,h:.09,d:.12},{c:[.62,.12],w:.09,h:.05,d:.08}],Mt={lo:[-.35,-.15,-.2],hi:[.35,.6,.6]},Nt=(e,t,n)=>{let r=n[0]-t[0],i=n[1]-t[1],a=n[2]-t[2],o=e[0]-t[0],s=e[1]-t[1],c=e[2]-t[2],l=Math.min(Math.max((o*r+s*i+c*a)/(r*r+i*i+a*a),0),1);return Math.hypot(o-r*l,s-i*l,c-a*l)};function Pt(e,t){let n=0;for(let r of At)for(let i=0;i+1<r.pts.length;i++)n=Math.max(n,r.r+t-Nt(e,r.pts[i],r.pts[i+1]));for(let r of jt){let i=r.h/.65,a=W([(e[0]-r.c[0])/(.5*r.w+t),(e[1]-(c+r.h-.5*i))/(.5*i+t),(e[2]-r.c[1])/(.5*r.d+t)]);a<1&&(n=Math.max(n,(1-a)*.5*r.h))}let r=Math.min(...[0,1,2].map(t=>Math.min(e[t]-Mt.lo[t],Mt.hi[t]-e[t])));return Math.max(n,r-.015)}function Ft(e,t,n){let r=0;for(let i=0;i<=12;i++){let o=i/12;for(let i of[-1,-.5,0,.5,1]){let s=e.at(o,i*e.half(o,i>=0));if(s[1]>-.62&&(r=Math.max(r,W(s)-(a-.012))),r=Math.max(r,Pt(s,t)),n)for(let e=0;e<3;e++)r=Math.max(r,n.lo[e]-s[e],s[e]-n.hi[e])}}return r}var It=class{constructor(e){this.cell=e,this.map=new Map}key(e,t,n){return((e+512)*1024+(t+512))*1024+(n+512)}add(e,t){let n=this.cell,r=this.key(Math.floor(e[0]/n),Math.floor(e[1]/n),Math.floor(e[2]/n));this.map.has(r)||this.map.set(r,[]),this.map.get(r).push({p:e,blade:t})}near(e,t,n){let r=this.cell,i=Math.floor(e[0]/r),a=Math.floor(e[1]/r),o=Math.floor(e[2]/r),s=0;for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++)for(let u of this.map.get(this.key(i+r,a+c,o+l))??[]){let r=u.blade?t:n,i=u.p[0]-e[0],a=u.p[1]-e[1],o=u.p[2]-e[2];i*i+a*a+o*o<(r-s)*(r-s)&&r>s&&(s=r-Math.sqrt(i*i+a*a+o*o))}return s}};function Lt(e,t,n){let r=[];for(let i=0;i<=t;i++){let a=(i/t)**1.25;for(let t=0;t<=n;t++){let i=-1+2*t/n;r.push(e.at(a,i*e.half(a,i>=0)))}}return r}function Rt(e,t,n){let r=e=>{let t=pt(e.b),r=Ft(t,n.margin,n.bounds),i=yt(t,e.from,e.rise,12,0);for(let e of i.slice(4))r=Math.max(r,Pt(e,.01));if(n.crowd){for(let e of Lt(t,n.samples[0],n.samples[1]))r=Math.max(r,n.crowd.near(e,n.gap,n.stalkGap));for(let e of i.slice(3))r=Math.max(r,n.crowd.near(e,n.stalkGap,0))}return{shape:t,w:r}},i=t[0].slice(1).map(()=>0),a={leaf:e(i),q:i};a.s=r(a.leaf);let o=a;for(let n=0,i=0;n<24&&o.s.w>0&&i<4;n++){let n=null;for(let i of t){let t=a.q.map((e,t)=>e+i[t]),o=e(t),s=r(o),c=s.w+i[i.length-1];(!n||c<n.cost)&&(n={cost:c,q:t,leaf:o,s})}a=n,a.s.w<o.s.w-1e-5?(o=a,i=0):i++}if(o.s.w>0&&n.wide){let t=null;for(let i of n.wide){let n=o.q.map((e,t)=>e+i[t]),a=e(n),s=r(a),c=s.w+i[i.length-1];s.w<o.s.w&&(!t||c<t.cost)&&(t={cost:c,q:n,leaf:a,s})}t&&(o=t)}if(o.s.w>0&&n.wider){let t=o,i=null;for(let a of n.wider){let n=t.q.map((e,t)=>e+a[t]),o=e(n),s=r(o),c=3*s.w+a[a.length-1];if(s.w<t.s.w&&(!i||c<i.cost)&&(i={cost:c,q:n,leaf:o,s}),s.w<=0)break}i&&(o=i)}return{leaf:o.leaf,shape:o.s.shape}}function zt(e,t,n,r){for(let n of Lt(t,r[0],r[1]))e.add(n,!0);for(let t of n)e.add(t,!1)}function Bt(e,t,n,r,i){let a=new Float64Array(n.length*8);n.forEach((e,t)=>a.set([...e.c,...e.n??[0,0,0],e.a,e.owner],t*8));for(let n=0;n<e.vertexCount;n++){let o=e.p[n*3],s=e.p[n*3+1],l=e.p[n*3+2],u=t[n],d=0;for(let e=0;e<a.length;e+=8){if(a[e+7]===u)continue;let t=a[e]-o,n=a[e+1]-s,r=a[e+2]-l,i=t*t+n*n+r*r;if(i<25e-6)continue;let c=Math.sqrt(i),f=n/c;if(f<=-.1)continue;let p=a[e+3]||a[e+4]||a[e+5]?Math.abs(a[e+3]*t+a[e+4]*n+a[e+5]*r)/c:.5;d+=a[e+6]*(f+.1)*p*q(.005,.015,c)/(Math.PI*i+a[e+6])}let f=q(-.01,r,s-c);e.a[n*4+3]=Math.max(Math.exp(-i*d),.35)*(.75+.25*f)}}function Vt(e,t,n){for(let r=0;r<8;r++)for(let i=0;i<4;i++){let a=(r+.5)/8,o=-1+(2*i+1)/4,s=e.half(a,o>=0);n.push({c:e.at(a,o*s),n:e.frame(a).N,a:e.L/8*(2*s/4),owner:t})}}function Ht(e,t,n,r){for(let i=3;i<e.length;i+=3)r.push({c:e[i],n:null,a:2*t*W(V(e[i],e[i-3])),owner:n})}var Ut=(e,t,n,r)=>{for(let i=n;i<e.vertexCount;i++)t[i]=r},Wt=[.5,c,-.32],Gt={lo:[.06,-.7,-.64],hi:[.92,.2,.24]},Kt=[{top:[.42,-.06,-.46],dir:[-.66,.6,.25],length:.44,ratio:.5,arch:.85,at:.24,toward:1},{top:[.64,-.1,-.3],dir:[.4,.75,.3],length:.41,ratio:.48,arch:.8,at:.74,toward:.8},{top:[.47,-.2,-.15],dir:[-.75,.1,.65],length:.36,ratio:.5,arch:.6,at:.47,toward:.9},{top:[.36,-.14,-.5],dir:[-.6,.7,-.1],length:.34,ratio:.47,arch:.7,at:.06,toward:.9},{top:[.56,-.17,-.22],dir:[.55,.55,.6],length:.31,ratio:.5,arch:.75,at:.53,toward:.9},{top:[.67,-.26,-.43],dir:[.1,.8,-.4],length:.32,ratio:.48,arch:.6,at:.82,toward:.6},{top:[.64,-.32,-.13],dir:[.75,.3,.55],length:.29,ratio:.51,arch:.6,at:.66,toward:.9},{top:[.4,-.2,-.43],dir:[-.85,.35,-.05],length:.28,ratio:.49,arch:.6,at:.15,toward:1,with:3},{top:[.72,-.4,-.26],dir:[.45,.75,.4],length:.24,ratio:.5,arch:.6,at:.92,toward:.5},{top:[.575,-.38,-.345],dir:[.05,.97,.1],length:.16,ratio:.42,arch:.15,at:.58,furl:.6,toward:.5},{top:[.47,-.48,-.3],dir:[-.1,.95,.12],length:.1,ratio:.4,arch:.08,at:.37,furl:.8,toward:.5}];function qt(e,t,n){let r=K(e,ot,t),i=U(r,ot);return W(i)<.001?r:G(K(r,G(i),Math.min(n,Math.acos(Math.min(r[1],1))-.05)))}function Jt(e,i,a){let o=new t(`plantTall`),s=[],l=[],u=[],d=[],f=new Float32Array(Kt.length*40),p=[.4,c+.004,-.285],m=[.6,c+.004,-.36],h=.024,g=.016,_=e=>B(at(p,m,e),[0,.006*Math.sin(Math.PI*e),.008*Math.sin(2*Math.PI*e)]);{let e=[0];for(let t=1;t<=400;t++)e.push(e[t-1]+W(V(_(t/400),_((t-1)/400))));let t=e[400],i=t=>{let n=1;for(;n<400&&e[n]<t;)n++;return(n-1+(t-e[n-1])/(e[n]-e[n-1]))/400},c=(e,n)=>{let r=[];for(let e=0;e<n;e++)r.push(h*(1-Math.cos(e/n*.5*Math.PI)));for(let n=Math.ceil(h/(g/e));n*g/e<t-h-.001;n++)r.push(n*g/e);for(let e=n;e>=0;e--)r.push(t-h*(1-Math.cos(e/n*.5*Math.PI)));return r},u=c(J(5,a,2),J(8,a,3)),d=[],f=[];u.forEach((e,r)=>{let a=Math.min(e,t-e),o=a<h?Math.sqrt(Math.max(1-((h-a)/h)**2,0)):1;d.push(_(i(e))),f.push(r===0||r===u.length-1?0:h*o*(1+.08*n(e*40,1.3,2.9)))});let p=(e,t)=>{let n=u[e],r=Math.round(n/g)%2?1:-1;return 1-.16*(.5+.5*Math.cos(2*Math.PI*n/g))**10*(.3+.7*(.5+.5*Math.cos(t-r*1.1))**1.5)};gt(o,d,f,J(18,a,8),r.ROOT,0,ot,(e,t)=>p(e,t)*(1+.04*n(u[e]*14,.7*Math.cos(t)+2.3,.7*Math.sin(t)+7.1))),Ut(o,s,0,900),Ht(c(5,8).map(e=>_(i(e))),h,900,l)}let v=G(V(m,p)),y=G(U(ot,v));for(let e=0;e<4;e++){let t=o.vertexCount,n=.1+.8*e/3+.05*(i()-.5),r=G(B(H(y,.6+.4*i()),H(v,1.2*(i()-.5)+(e===0?-1:+(e===3)))));kt(o,_(n),r,h,.015+.02*i(),.0045+.0015*i(),2+e,i,a),Ut(o,s,t,901+e)}let b=new It(.03),x=[18,7],S=[[.1,0,0,0],[-.1,0,0,0],[.3,0,0,.004],[-.3,0,0,.004],[0,.07,0,4e-4],[0,-.07,0,4e-4],[0,0,.05,.003]];Kt.forEach((t,n)=>{let i=!!t.furl,c=G([t.top[0]-Wt[0],0,t.top[2]-Wt[2]]),p=_(t.at),m=G(B(ot,H(G([t.top[0]-p[0],0,t.top[2]-p[2]]),.4+.7*e()))),h=Array.from({length:12},e),{leaf:g,shape:v}=Rt(([e,r,a])=>{let o=qt(G(t.dir),e,r),s=K(st(B(B(ot,[0,0,t.toward]),H(c,.3)),o),o,.4*(h[0]-.5));return{from:p,rise:m,b:{base:t.top,dir:o,face:s,length:t.length*Math.exp(-a),ratio:t.ratio,arch:t.arch*(.9+.2*h[1]),droop:i?0:.15+.15*h[2],side:.12*(h[3]-.5),twist:.35*(h[4]-.5),cup:i?.05:.14+.1*h[5],fold:.06+.04*h[6],quilt:i?0:6e-4+3e-4*h[7],wave:i?.02:.05+.04*h[8],waves:2.5+1.5*h[9],phase:6.28*h[10],asym:.08*(h[11]-.5),furl:t.furl??0,veins:13,id:n}}},S,{margin:.02,bounds:Gt,crowd:b,gap:.02,stalkGap:.015,samples:x}),y=o.vertexCount,C=mt(o,v,J(i?36:90,a,8),Dt(i?20:22,a,6),r.LEAF_BIG);Ut(o,s,y,n),Vt(v,n,l);let w=o.vertexCount,T=Math.max(14,Math.round(W(V(t.top,p))/.012)),E={rBase:i?.0072:.0085,rTop:i?.0055:.0062,segs:T,midrib:i?.4:.6,midribSegs:i?10:20,sheath:.6,sheathLen:.045},D=bt(v,g.from,m,E,n),O=a===1?D:bt(v,g.from,m,{...E,segs:J(T,a,4),midribSegs:J(E.midribSegs,a,3)},n),k=xt(o,v,O,{sides:J(8,a,4),groove:.2},n,3/T);Ut(o,s,w,1e3+n),Tt(o,d,f,n,v,C,O,k,D,{crown:Wt,plant:`tall`,young:i,with:t.with});let A=D.pts;if(Ht(A.slice(0,T+1),.007,1e3+n,l),zt(b,v,A,x),i)u.push({a:A[Math.round(T*.3)],b:v.at(1,0),r:.03,solid:.015});else{let e=A[Math.round(T*.6)];u.push({a:A[Math.round(T*.25)],b:e,r:.035,solid:.02},{a:e,b:t.top,r:.035,solid:.02}),u.push({a:v.at(.12,0),b:v.at(.8,0),r:.85*v.H+.02,solid:0})}}),u.push({a:Wt,b:B(Wt,[0,.14,0]),r:.07,solid:.03}),Bt(o,s,l,.2,1.6);let C=o.finish();return C.motion=Et(o.vertexCount,d,f),{mesh:C,obstacles:u}}var Yt=[-.6,c,.06],Xt={5:3,10:9,11:8,12:9,14:9,18:16},Zt={lo:[-.88,c+.012,-.22],hi:[-.3,-.2,.4]};function Qt(e,i){let a=new t(`plantSmall`),o=[],s=[],c=[],l=[],u=new Float32Array(800);{let e=[],t=[],s=J(20,i,6);for(let r=0;r<=s;r++){let i=r/s;e.push(B(Yt,[.002*Math.sin(3*i),-.03+.062*i,0]));let a=q(.72,1,i);t.push(r===s?0:.0145*(1-.25*i)*Math.sqrt(Math.max(1-a*a,0))*(1+.06*n(i*5,3.3,1)))}gt(a,e,t,J(16,i,8),r.ROOT,1,[1,0,0]),Ut(a,o,0,900)}for(let t=0;t<3;t++){let n=a.vertexCount,r=1.6+t/2*2.4+.3*(e()-.5);kt(a,B(Yt,[0,.004,0]),[Math.cos(r),0,Math.sin(r)],.012,.015+.035*e(),.0024+8e-4*e(),10+t,e,i),Ut(a,o,n,901+t)}let d=[],f=Math.PI/180,p=new It(.012),m=[18,7],h=[[.12,0,0,0,0],[-.12,0,0,0,0],[.3,0,0,0,.001],[-.3,0,0,0,.001],[0,.06,0,0,5e-4],[0,-.06,0,0,5e-4],[0,0,.05,0,.002],[0,0,0,.25,5e-4],[0,0,0,-.25,5e-4]],g=[],_=[];for(let e=-3;e<=3;e++)for(let t of[-.15,0,.15])for(let n of[-.4,0,.4])g.push([.15*e,t,0,n,.004*Math.abs(.15*e)+.006*Math.abs(t)+.003*Math.abs(n)]);for(let e=-4;e<=4;e++)for(let t of[-.45,-.15,.15])for(let n of[-.4,0,.4])for(let r of[0,.15,.3])_.push([.3*e,t,r,n,.004*Math.abs(.3*e)+.006*Math.abs(t)+.003*Math.abs(n)+.003*r]);_.sort((e,t)=>e[4]-t[4]);for(let t=0;t<20;t++){let n=19-t,c=1-n/19,v=2.6+2.6*(n*.618034%1-.5)*(1.4-.6*c)+.25*(e()-.5),y=(84-34*c+6*(e()-.5))*f,b=y-(4+18*c*(.6+.4*e()))*f,x=Math.min(.14,(.063+.077*(1-c))*(.85+.3*e())),S=Math.min(.27,(.17+.085*c)*(.9+.2*e())),C=Array.from({length:12},e),{leaf:w,shape:T}=Rt(([e,t,r,i])=>{let a=Math.min(Math.max(v+e,1.25-.6*(1-c)),4.3+.4*(1-c)),o=Math.min(y+t,1.48),s=Math.min(b+1.3*t,1.4),l=[Math.cos(a),0,Math.sin(a)],u=B(Yt,B(H(l,.008+.007*c),[0,.006+.022*(1-c),0])),d=B(u,H(B(H(l,Math.cos(o)),[0,Math.sin(o),0]),x*Math.exp(-r))),f=G(B(H(l,Math.cos(s)),[0,Math.sin(s),0]));return{az:a,from:B(u,B(H(l,-.008),[0,-.012,0])),rise:G(B(ot,H(l,.2+.8*c))),b:{base:d,dir:f,face:K(st(B(B(ot,H(l,-.15)),[0,0,.3]),f),f,.5*(C[0]-.5)+i),length:S*Math.exp(-r),ratio:.33+.12*c+.1*C[1],arch:.35+.4*c+.15*C[2],droop:.1+.15*C[3],side:.2*(C[4]-.5),twist:.5*(C[5]-.5),cup:.12+.12*C[6],fold:.05+.05*C[7],quilt:8e-4,wave:.07+.07*C[8],waves:2+2*C[9],phase:6.28*C[10],asym:.1*(C[11]-.5),furl:0,veins:9,id:n,small:!0}}},h,{margin:.012,bounds:Zt,crowd:p,gap:.009,stalkGap:.007,samples:m,wide:g,wider:c>.9?_:null}),E=a.vertexCount,D=mt(a,T,J(24,Math.sqrt(i),12),Dt(12,i,6),r.LEAF_SMALL);Ut(a,o,E,n),Vt(T,n,s);let O=a.vertexCount,k=Math.max(8,Math.round(W(V(w.b.base,w.from))/.008)),A={rBase:.0026+9e-4*c,rTop:.0021+6e-4*c,segs:k,midrib:.5,midribSegs:8,sheath:.3,sheathLen:.02},j=bt(T,w.from,w.rise,A,11+n),ee=i===1?j:bt(T,w.from,w.rise,{...A,segs:J(k,i,4),midribSegs:J(8,i,3)},11+n),M=xt(a,T,ee,{sides:J(8,i,4),groove:.2},11+n,3/k);Ut(a,o,O,1e3+n),Tt(a,l,u,t,T,D,ee,M,j,{crown:Yt,plant:`small`,young:!1,with:Xt[t]}),Ht(j.pts.slice(0,k+1),.003,1e3+n,s),zt(p,T,j.pts,m),d.push({tip:T.at(.85,0),pts:Lt(T,6,2)})}c.push({a:Yt,b:B(Yt,[0,.07,0]),r:.08,solid:.02});let v=B(Yt,[0,.035,0]);for(let e=0;e<4;e++){let t=d.filter(t=>Math.floor((Math.atan2(t.tip[2]-v[2],t.tip[0]-v[0])+Math.PI)/(Math.PI/2))%4===e);if(!t.length)continue;let n=at(v,H(t.reduce((e,t)=>B(e,t.tip),[0,0,0]),1/t.length),.85),r=t.flatMap(e=>e.pts.map(e=>Nt(e,v,n))).sort((e,t)=>e-t);c.push({a:v,b:n,r:Math.min(Math.max(r[Math.floor(.9*(r.length-1))],.03),.12),solid:0})}Bt(a,o,s,.12,.9);let y=a.finish();return y.motion=Et(a.vertexCount,l,u),{mesh:y,obstacles:c}}function $t(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=Jt(i(1511863939),i(4127),t),r=Qt(i(5227),t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles]}}var en=(e,t)=>`${t.lengths?`
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
  let ph = ${t.veins.toFixed(1)} * (u - ${dt} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
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
`,tn=[en(`leafBig`,{salt:3,length:.34,lengths:Kt.map(e=>e.length),ratio:.46,veins:13,young:9,tint:`0.35, 0.62, 0.12`,net:280,bump:110,rough:.36}),en(`leafSmall`,{salt:5,length:.19,ratio:.44,veins:9,young:99,tint:`0.38, 0.66, 0.13`,net:420,bump:180,rough:.4,small:!0}),`
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
`].join(``),nn=e({WGSL:()=>jn,build:()=>An}),Y=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],X=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Z=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],rn=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],an=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],on=e=>Math.hypot(e[0],e[1],e[2]),Q=e=>Z(e,1/(on(e)||1)),sn=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},cn=.007,ln=.016,un={az:-1.02,foot:-.46,top:.06,off:.104},dn={r:.052,rIn:.044,tube:.037,cap:.054,slots:[.045,.39],band:[.205,.225],bars:10,fill:.56},fn=[.115,.315],pn={h:.432,r:.0095},mn=.525,hn=.0087,gn={at:[-.34,-.545],base:.125,baseTop:.03,sponge:.101,spongeTop:.3,tube:.026,tubeTop:.56,air:.528},_n=.0108,vn={rate:9,radius:.0055};function $(e,t,n){let r=o-n,i=Math.sqrt(Math.max(r*r-e*e,0));return[i*Math.cos(t),e,i*Math.sin(t)]}function yn(e){let t=on(e);return[Math.asin(e[1]/t),Math.atan2(e[2],e[0]),o-t]}function bn([e,t,n]){let r=o-n;return[r*Math.cos(e)*Math.cos(t),r*Math.sin(e),r*Math.cos(e)*Math.sin(t)]}function xn(e,t,n){let r=Q(t),i=Q(X(n,Z(r,rn(n,r))));return{o:e,u:r,a:i,b:an(r,i)}}function Sn(e,t,n,r,i,a,o){let s=e.p,c=e=>[s[e*3],s[e*3+1],s[e*3+2]];rn(an(X(c(n),c(t)),X(c(r),c(t))),o)>=0?e.quad(t,n,r,i,a):e.quad(t,i,r,n,a)}function Cn(e,t,n,r,i,a,o=null,s=null){let[c,l]=o??[0,2*Math.PI],u=o?r+1:r,d=[];for(let e=0;e+1<n.length;e++){let t=n[e+1][0]-n[e][0],r=n[e+1][1]-n[e][1],i=Math.hypot(t,r)||1;d.push([r/i,-t/i])}let f=(i,o)=>{let[d,f]=n[i],p=a(i,d,f),m=Y(t.o,Z(t.u,f));if(d===0){let n=s?s(m,t.u):m;return e.vertex(n,p,s?null:Z(t.u,o[1]<0?-1:1))}let h=[];for(let n=0;n<u;n++){let i=c+(l-c)*n/r,a=Y(Z(t.a,Math.cos(i)),Z(t.b,Math.sin(i))),u=Q(Y(Z(a,o[0]),Z(t.u,o[1]))),f=Y(m,Z(a,d));h.push(s?e.vertex(s(f,u),p):e.vertex(f,p,u))}return h},p=(t,n)=>{for(let a=0;a<r;a++){let r=(a+1)%u;typeof t==`number`?e.tri(t,n[r],n[a],i):typeof n==`number`?e.tri(t[a],t[r],n,i):e.quad(t[a],t[r],n[r],n[a],i)}},m=null;n.forEach((e,t)=>{let n=d[t-1],r=d[t],i=null,a=null;if(n&&r&&!e[2]){let e=[n[0]+r[0],n[1]+r[1]],o=Math.hypot(e[0],e[1])||1;i=a=f(t,[e[0]/o,e[1]/o])}else n&&(i=f(t,n)),r&&(a=f(t,r));m!==null&&i!==null&&p(m,i),m=a})}function wn(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function Tn(e,t,n,r,i,a,o,s){let c=t.length,l=t.map((e,n)=>Q(X(t[Math.min(n+1,c-1)],t[Math.max(n-1,0)]))),u=Q(X(s,Z(l[0],rn(s,l[0])))),d=[],f=0;for(let i=0;i<c;i++){i&&(f+=on(X(t[i],t[i-1])),u=Q(X(u,Z(l[i],rn(u,l[i])))));let o=an(l[i],u),s=[];for(let c=0;c<r;c++){let l=2*Math.PI*c/r,d=Y(Z(u,Math.cos(l)),Z(o,Math.sin(l)));s.push(e.vertex(Y(t[i],Z(d,n)),a(f),d))}d.push(s)}for(let t=0;t+1<c;t++)for(let n=0;n<r;n++)e.quad(d[t][n],d[t][(n+1)%r],d[t+1][(n+1)%r],d[t+1][n],i);if(o){let n=e.vertex(t[c-1],a(f),l[c-1]),o=d[c-1].map(n=>{let r=[e.p[n*3],e.p[n*3+1],e.p[n*3+2]];return e.vertex(r,a(f),Q(Y(l[c-1],Z(Q(X(r,t[c-1])),.35))))});for(let t=0;t<r;t++)e.tri(n,o[t],o[(t+1)%r],i)}}function En(e,t,n){return wn(e.map(yn),t).map(([e,t,r])=>bn([e,t,Math.max(r,n)]))}function Dn(){let{az:e,foot:t,top:n,off:r}=un,i=$(t,e,0),a=$(n,e,0),s=Q(X(a,i)),c=Z(Y(i,a),.5),l=Q(X(Z(s,rn(c,s)),c)),u=e=>fn.reduce((t,n)=>{let r=Y(e,Z(s,n)),i=rn(r,Z(l,-1)),a=rn(r,r)-o*o;return t+(-i+Math.sqrt(i*i-a))/fn.length},0),d=i;for(let e=0;e<4;e++)d=Y(d,Z(l,r-u(d)));return xn(d,s,l)}function On(e){let n=new t(`heater`),i=Dn(),a=Math.max(14,Math.round(40*e)),s=e=>Y(i.o,Z(i.u,e)),c=dn,l=e=>(t,n,r)=>[0,r,0,e];Cn(n,i,[[0,-.012],[.022,-.0095],[.036,-.004],[.046,.005],[.051,.016],[c.r,.028],[c.r,.045,!0],[c.rIn,.045,!0],[c.rIn,.035]],a,r.HEATER,l(.92));let[u,d]=c.band;Cn(n,i,[[c.rIn,u,!0],[c.r-.0025,u],[c.r,u+.0025],[c.r,d-.0025],[c.r-.0025,d],[c.rIn,d,!0],[c.rIn,u,!0]],a,r.HEATER,l(.9));let f=2*Math.PI/c.bars,p=.5*c.fill*f;for(let[e,t]of[[c.slots[0],u],[d,c.slots[1]]])for(let a=0;a<c.bars;a++){let o=(a+.5)*f,l=e=>Y(Z(i.a,Math.cos(e)),Z(i.b,Math.sin(e))),u=e=>Y(Z(i.a,-Math.sin(e)),Z(i.b,Math.cos(e))),d=[],m=[];for(let r=0;r<=3;r++){let i=o-p+2*p*r/3,a=r===0?-1:+(r===3),f=Q(Y(l(i),Z(u(i),.75*a)));d.push([n.vertex(Y(s(e),Z(l(i),c.r)),[0,e,0,.9],f),n.vertex(Y(s(t),Z(l(i),c.r)),[0,t,0,.9],f)])}for(let e=0;e+1<d.length;e++)Sn(n,d[e][0],d[e+1][0],d[e+1][1],d[e][1],r.HEATER,l(o-p+2*p*(e+.5)/3));for(let r of[o-p,o+p])m.push([n.vertex(Y(s(e),Z(l(r),c.rIn)),[0,e,0,.6],Z(l(r),-1)),n.vertex(Y(s(t),Z(l(r),c.rIn)),[0,t,0,.6],Z(l(r),-1))]);Sn(n,m[0][0],m[1][0],m[1][1],m[0][1],r.HEATER,Z(l(o),-1));for(let[i,a]of[[o-p,-1],[o+p,1]]){let o=Z(u(i),a),d=Q(Y(o,Z(l(i),.6))),f=[n.vertex(Y(s(e),Z(l(i),c.rIn)),[0,e,0,.55],o),n.vertex(Y(s(e),Z(l(i),c.r)),[0,e,0,.75],d),n.vertex(Y(s(t),Z(l(i),c.r)),[0,t,0,.75],d),n.vertex(Y(s(t),Z(l(i),c.rIn)),[0,t,0,.55],o)];Sn(n,f[0],f[1],f[2],f[3],r.HEATER,o)}}Cn(n,i,[[0,.03],[c.tube,.03,!0],[c.tube,.4]],a,r.HEATER,()=>[1,0,0,.4]),Cn(n,i,[[c.rIn,.39,!0],[c.cap,.39,!0],[c.cap,.394],[c.cap,.452],[.0525,.461],[.048,.467],[.04,.4705],[.022,.4725,!0],[.0175,.475],[.0165,.49],[.0145,.512],[.0128,.522],[.0105,mn,!0],[hn,mn]],a,r.HEATER,l(.95)),Cn(n,xn(Y(s(pn.h),Z(i.a,c.cap-.0015)),i.a,i.u),[[pn.r,-.003],[pn.r,6e-4,!0],[.0085,.0021],[.0062,.0033],[.0033,.004],[0,.0042]],Math.max(10,Math.round(20*e)),r.HEATER_LAMP,(e,t)=>[t/pn.r,0,0,1]);let m=Math.max(12,Math.round(32*e));for(let t of fn){let a=c.r+6e-4,l=c.r+.0078,u=.011,d=[Math.PI-2.25,Math.PI+2.25],f=(e,t)=>[1,(t-a)/(l-a),0,.85];Cn(n,{...i,o:s(t)},[[a,-.011,!0],[l,-.011,!0],[l,u,!0],[a,u,!0],[a,-.011,!0]],Math.max(8,Math.round(18*e)),r.SUCTION,f,d);for(let[e,o]of[[d[0],-1],[d[1],1]]){let c=Y(Z(i.a,Math.cos(e)),Z(i.b,Math.sin(e))),d=Z(Y(Z(i.a,-Math.sin(e)),Z(i.b,Math.cos(e))),o),p=[[a,-.011],[l,-.011],[l,u],[a,u]].map(([e,r])=>n.vertex(Y(s(t+r),Z(c,e)),f(0,e),d));Sn(n,p[0],p[1],p[2],p[3],r.SUCTION,d)}let p=Y(s(t),Z(i.a,-l));Cn(n,xn(Z(Q(p),o-cn),Z(Q(p),-1),i.u),[[0,0],[.047,0,!0],[.0466,.0024,!0],[.041,.006],[.032,.0108],[.0225,.0152],[.0148,.018],[.0106,.0194,!0],[.0086,.021],[.0086,o-cn-on(p)+.004]],m,r.SUCTION,(e,t)=>[0,t/.047,0,.7+.25*sn(.047,.03,t)])}let h=s(.513),g=yn(s(.595)),_=un.az;Tn(n,En([h,s(.555),bn([g[0],g[1]-.01,.06]),$(.3,_-.03,ln),$(.56,_-.07,.045),$(.78,_-.1,.022),$(.866,_-.11,ln)],Math.max(4,Math.round(12*e)),ln),hn,Math.max(6,Math.round(9*e)),r.HEATER,e=>[2,e,0,.9],!0,i.a);let v=[{a:s(-.012),b:s(.48),r:.115,solid:.064},{a:h,b:$(.27,_-.025,ln),r:.063,solid:.013}];return{mesh:{...n.finish(),onGlass:!0},obstacles:v}}function kn(e){let i=new t(`filter`),a=gn,l=[a.at[0],c,a.at[1]],u=xn(l,[0,1,0],[-a.at[0],0,-a.at[1]]),d=Math.max(16,Math.round(48*e));Cn(i,u,[[0,-.012],[.118,-.012,!0],[.123,-.004],[a.base,.008],[a.base,.018],[.1225,.0255],[.117,a.baseTop-.001],[.11,a.baseTop,!0],[0,a.baseTop]],d,r.TUBE,(e,t,n)=>[2,n,0,n<.005?.55:.88]);let f=Math.max(10,Math.round(28*e)),p=[[a.sponge-.004,a.baseTop-.002],[a.sponge-.001,a.baseTop+.004]];for(let e=0;e<=f;e++)p.push([a.sponge,a.baseTop+.012+(a.spongeTop-a.baseTop-.026)*e/f]);p.push([a.sponge-.002,a.spongeTop-.006],[a.sponge-.009,a.spongeTop-5e-4],[.07,a.spongeTop],[.03,a.spongeTop]),Cn(i,u,p,Math.max(20,Math.round(64*e)),r.SPONGE,(e,t,n)=>[0,n-a.baseTop,0,t<.06?.75:.62+.33*sn(a.baseTop,a.baseTop+.08,n)],null,(e,t)=>{let r=e[1]-c,i=sn(a.baseTop,a.baseTop+.02,r)*(t[1]>.7?.5:1);return Y(e,Z(t,(.0028*s(e[0]*38,e[1]*38,e[2]*38,3)+.0018*n(e[0]*11+3.1,e[1]*7,e[2]*11))*i))});let m=a.tube,h=m-.0055;Cn(i,u,[[0,a.spongeTop-.006],[.043,a.spongeTop-.006,!0],[.0445,a.spongeTop+.002],[.0445,a.spongeTop+.008],[.041,a.spongeTop+.0125],[.034,a.spongeTop+.0145,!0],[.032,a.spongeTop+.0145,!0],[.032,a.spongeTop+.026],[.0295,a.spongeTop+.029,!0],[m,a.spongeTop+.029,!0],[m,a.tubeTop-.004],[m-.0012,a.tubeTop-4e-4],[m-.003,a.tubeTop,!0],[h+.001,a.tubeTop,!0],[h,a.tubeTop-.0015],[h,a.tubeTop-.06,!0],[0,a.tubeTop-.06]],Math.max(14,Math.round(32*e)),r.TUBE,(e,t,n)=>e>=14?[1,n,0,.25+.5*sn(a.tubeTop-.05,a.tubeTop,n)]:[0,n,0,.9]);let g=[0,0,-1],_=Y(l,[0,a.air,0]);Tn(i,wn([Y(_,Z(g,m-.004)),Y(Y(_,Z(g,m+.016)),[0,.004,0])],3),.0132,Math.max(8,Math.round(12*e)),r.TUBE,e=>[4,e,0,.85],!0,[0,1,0]);let v=Math.atan2(-Math.sqrt(o*o-a.at[0]*a.at[0]),a.at[0]),y=[Y(_,Z(g,m+.004)),Y(Y(_,Z(g,m+.045)),[0,.006,0]),Y(Y(_,Z(g,.17)),[0,-.012,0]),$(.02,v,.03),$(.3,v-.03,ln),$(.56,v-.07,.045),$(.78,v-.09,.022),$(.866,v-.095,ln)];Tn(i,En(y,Math.max(4,Math.round(12*e)),ln),_n,Math.max(6,Math.round(9*e)),r.TUBE,e=>[3,e,0,.9],!0,[0,1,0]);let b=En(y,3,ln),x=b.findIndex(e=>e[1]>.27),S=[_,...b.slice(1,x<0?b.length:x+1)],C=[_],w=(e,t,n)=>{let r=X(n,t);return on(X(e,Y(t,Z(r,Math.min(Math.max(rn(X(e,t),r)/rn(r,r),0),1)))))};for(let e=1,t=0;e<S.length;e++)(e===S.length-1||S.slice(t+1,e+2).some(n=>w(n,S[t],S[e+1])>.004))&&(C.push(S[e]),t=e);let T=[{a:Y(l,[0,-.01,0]),b:Y(l,[0,a.spongeTop,0]),r:.158,solid:.108},{a:Y(l,[0,a.spongeTop,0]),b:Y(l,[0,a.tubeTop,0]),r:.08,solid:.03},{a:_,b:$(.27,v-.025,ln),r:.064,solid:.014,fin:0},...C.slice(1).map((e,t)=>({a:C[t],b:e,r:0,solid:0,fin:.014}))];return{mesh:{...i.finish(),onGlass:!0},obstacles:T,bubbles:{at:Y(l,[0,a.tubeTop-.01,0]),...vn}}}function An(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=On(t),r=kn(t);return{meshes:[n.mesh,r.mesh],obstacles:[...n.obstacles,...r.obstacles],bubbles:r.bubbles}}var jn=`
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
`,Mn=[[`wood`,m],[`rocks`,ke],[`plants`,rt],[`equipment`,nn]];Mn.map(([e])=>e);function Nn(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,n=e?.only;return Mn.filter(([e])=>!n||n.includes(e)).map(([e,n])=>({name:e,...n.build({detail:t})}))}var Pn=Mn.map(([,e])=>e.WGSL);export{Nn as n,Pn as t};